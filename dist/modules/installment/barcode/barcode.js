var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var mkdirp      = require('mkdirp');
var fs          = require('fs');
var path        = require('path');
var xlsx        = require('node-xlsx');

var mysqlConn   = require('../../../lib/db');
var helper      = require('../../../lib/helper');

var router      = express.Router();

var calc_barcode     = { X: '27', sum_x: 9, mod: 100, max: 5,  };

router.post('/list', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var barcodeFields = {
    shop_code:{name:'s.code'},
    shop_name: {name:'s.name'},
    last_barcode: {name:'MAX(b.barcode)'}
  };

  console.log('body', req.body);

  var mainQuery = "SELECT b.shop_id, s.code shop_code, s.name shop_name, "
    + "SUBSTRING(b.barcode, 9,2) year, MAX(b.barcode) last_barcode, "
    + "COUNT(*) count_total, SUM(IF(is_used='YES', 1, 0)) count_used, "
    + "SUM(IF(is_used='NO', 1, 0)) count_available "
    + "FROM contract_barcode b "
    + "  JOIN shop s ON b.shop_id=s.id "
    + "WHERE b.is_active='YES' AND b.barcode LIKE '41101%' ";

  var cond = [];
  var hasJoin = false;
  for(var fld in req.body.keywords) {
    var keyword = req.body.keywords[fld];
    if (typeof keyword === 'undefined') {
      continue;
    }

    if (keyword == '') {
      continue;
    }
    if (typeof barcodeFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(barcodeFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='shop_code' || fld=='shop_name') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  mainQuery += " GROUP BY b.shop_id, SUBSTRING(b.barcode, 9,2)";

  // var getCount = function() {
  //   var sql = "SELECT COUNT(*) cnt FROM contract_barcode b "
  //     + "WHERE b.is_active='YES'  AND b.barcode LIKE '41101%' "
  // 	  + "AND SUBSTRING(b.barcode, 9, 2) = :year ";
  //   if (hasJoin) {
  //     sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x';
  //   } else if (cond.length > 0) {
  //     sql += ' AND ' + cond.join(' AND ');
  //   }
  //   return db.query(sql, {year:req.body.year}).then(function(rows) {
  //     if (rows.length==0) {
  //       $scope.totalRows = 0;
  //     } else {
  //       $scope.totalRows = rows[0].cnt;
  //     }
  //   });
  // }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'shop_code';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0,
    };

    if (barcodeFields[sortBy]) {
      sortBy = barcodeFields[sortBy].name;
    } else {
      sortBy = 's.shop_code';
    }

    var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;

    console.log({ year:req.body.year, shop_id:req.body.shop_id});
    return db.query(sql, { year:req.body.year, shop_id:req.body.shop_id}).then(function(rows) {
      $scope.rows = rows;
    });
  }

  q.all([
    // getCount(),
    getRows()
  ]).then(function() {
    $scope.opt.totalRows = $scope.totalRows;
    if ($scope.totalRows==0) {
      res.send({
        status: true,
        data: $scope.rows,
        opt: $scope.opt
      });
    } else {
      res.send({
        status: true,
        data: $scope.rows,
        opt: $scope.opt
      });
    }
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/facet', function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};

  var getShops = function() {
    var sql = "SELECT s.id, s.code, s.name, s.prefix_barcode FROM shop s WHERE s.is_active='YES' ORDER BY s.code";
    return db.queryArray(sql).then(function(result) {
      $scope.shops = result;
    });
  }

  q.all([
    getShops()
  ]).then(function() {
    res.send({
      status:true,
      shops: $scope.shops
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  })
});

router.post('/generate', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};

  var param = req.body;
  var getInitial = function() {
    var sql = "SELECT name, value FROM initial WHERE name in ('BARCODE.CLIENT_ID','BARCODE.SERVICE')";
    return db.query(sql).then(function(result) {
      for(var i=0; i<result.length;i++) { $scope[result[i].name] = result[i].value; }
    });
  }

  // Object {shop_code: "011", year: "2558", qty: "100"}
  var getLastBarcode = function() {
    $scope.prefix = $scope['BARCODE.CLIENT_ID'] + $scope['BARCODE.SERVICE'] + param.shop_code + param.year.substr(2);

    $scope.len = calc_barcode.max + $scope.prefix.length;
    while(calc_barcode.X.length < $scope.len) { calc_barcode.X += calc_barcode.X }

    var sql = "SELECT SUBSTR(barcode,"+($scope.prefix.length+1)+","+calc_barcode.max+") last_digit FROM contract_barcode c "
             +"WHERE barcode LIKE '"+$scope.prefix+"%' AND is_active = 'YES' "
             +"ORDER BY SUBSTR(barcode,1,"+$scope.len+") DESC LIMIT 1;";

    return db.query(sql).then(function(result) {
      $scope.begin = parseInt(result.length == 0 ? '0' : result[0].last_digit) + 1;
      //console.log('generate:', $scope.begin, '=>', param.qty);
    });

  }

  var calcBarcode = function() {
    $scope.barcode = [];
    var all = [];
    for (var i = 0; i < param.qty; i++) {
      // Append Zero
      var next_no = parseInt($scope.begin.toString()) + i;
      while(next_no.toString().length < calc_barcode.max) { next_no = '0'+next_no; }

      var sum = 0, barcode = $scope.prefix.toString() + next_no;
      for(var l=0; l<$scope.len; l++)
      { 
        // Step 1-2
        //console.log(barcode[l], calc_barcode.X[l], sum);
        sum += parseInt(barcode[l]) * parseInt(calc_barcode.X[l]);
      }

      // Step 3-4
      // console.log('chk_digit:', sum, calc_barcode.sum_x, calc_barcode.mod);
      var chk_digit = ('0' + ((sum * calc_barcode.sum_x) % calc_barcode.mod)).slice(-2);

      $scope.barcode.push($scope.prefix + next_no + chk_digit);
      all.push(saveBarcode({
        barcode: $scope.prefix + next_no + chk_digit,
        shop_id: param.shop_id,
      }));

      //console.log('Barcode:', $scope.prefix, next_no, chk_digit);
    }
    return q.all(all);
  }

  var saveBarcode = function(param) {
    var sql = "INSERT INTO contract_barcode (barcode, shop_id) VALUES(:barcode, :shop_id)";
    return db.query(sql, param);
  };

  getInitial()
  .then(getLastBarcode)
  .then(calcBarcode)
  .then(function() {
    res.send({
      status:true,
      barcode: $scope.barcode
    });
  }).catch(function(e) { res.send({ status:false, error:e }); })
});


router.post('/reprint', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};

  var param = req.body;

  var chkBarcode = function() {
    var sql = "SELECT COUNT(*) code FROM contract_barcode WHERE barcode in ('"+param.begin+"','"+param.end+"')";
    console.log(sql);
    return db.query(sql).then(function(result) {
      console.log('reprint', parseInt(result[0].code));
      $scope.check = parseInt(result[0].code) > 0 ? true : false;
      if(!$scope.check) throw 'Barcode is not exists.';
    });
  }

  // Object {shop_code: "011", year: "2558", qty: "100"}
  var getBarcode = function() {
    $scope.barcode = [];

    if(param.begin != '') $scope.barcode.push(param.begin);
    if(param.end != '') $scope.barcode.push(param.end);
    // var sql = "SELECT barcode FROM contract_barcode WHERE SUBSTR(barcode,1,15) >= SUBSTR('"+param.begin+"',1,15) "
    //          +"AND SUBSTR(barcode,1,15) <= SUBSTR('"+param.end+"',1,15) "
    //          +"AND length('"+param.end+"')=length(barcode) ORDER BY SUBSTR(barcode,1,15) DESC ";

    // return db.query(sql).then(function(result) {
    //   for (var i = 0; i < result.length; i++) {
    //     $scope.barcode.push(result[i].barcode);
    //   };
    // });
  }


  chkBarcode()
  .then(getBarcode)
  .then(function() {
    res.send({
      status:true,
      barcode: $scope.barcode
    });
  }).catch(function(e) { res.send({ status:false, error:e }); })
});


router.post('/export', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid "
    + ", c.balance "
    + "FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "WHERE c.is_active='YES' ";

  var cond = [];
  var hasJoin = false;
  for(var fld in req.body.keywords) {
    var keyword = req.body.keywords[fld];
    if (typeof keyword === 'undefined') {
      continue;
    }
    keyword = keyword.trim();
    if (keyword == '') {
      continue;
    }
    if (typeof contractFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(contractFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='shop'
        || fld=='shop_name') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  console.log(mainQuery);


  var getRows = function() {
    var sortBy = req.body.sortBy || 'sign_date';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0,
    };

    sortBy = 'c.`' + sortBy + '`';


    var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir;

    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
    });
  }


  getRows().then(function() {
    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListContract", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/contract_list_'+id+'.xlsx';
    fs.writeFileSync('./dist/public'+fname, buffer);
    res.send({
      status:true,
      file: fname
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

module.exports = router;
