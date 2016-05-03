var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var fs          = require('fs');
var xlsx        = require('node-xlsx');

var conn        = require('../../../lib/db');
var router      = express.Router();
var helper      = require('../../../lib/helper');

var fields = {
  code:{name:'code'},
  name:{name:'name'},
  location:{name:'location'},
  tel:{name:'tel'},
  fax:{name:'fax'}
};

router.post('/list', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var mainQuery = 'SELECT * FROM shop ' +
          ' WHERE is_active in (\'YES\',\'NO\') ';
  var cond = [];
  for(var fld in req.body.keywords) {
    var keyword = req.body.keywords[fld];
    if (typeof keyword === 'undefined') {
      continue;
    }
    keyword = keyword.trim();
    if (keyword == '') {
      continue;
    }
    if (typeof fields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(fields[fld], keyword);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  console.log(mainQuery);

  var getCount = function() {
    var sql = "SELECT COUNT(*) AS cnt FROM shop WHERE is_active in (\'YES\',\'NO\') ";
    if (cond.length > 0) {
      sql += ' AND ' + cond.join(' AND ');
    }
    return db.query(sql).then(function(rows) {
      $scope.totalRows = rows[0].cnt;
      return true;
    });
  }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'code';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0
    };

    var sql = mainQuery +
        ' ORDER BY `' + sortBy + '` ' + sortDir +
        ' LIMIT ' + (page * limit) + ', ' + limit;

    return db.queryArray(sql, {}).then(function(rows) {
      $scope.rows = rows;
      return rows;
    });
  };

  ////////////////////////////////////////////////////
  // MAIN
  ////////////////////////////////////////////////////
  q.all([
    getCount(),
    getRows()
  ]).then(function() {
    $scope.opt.totalRows = $scope.totalRows;
    res.send({
      status: true,
      data: $scope.rows,
      opt: $scope.opt
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/export', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var mainQuery = 'SELECT * FROM shop ' +
          ' WHERE id > 0 ';
  var cond = [];
  for(var fld in req.body.keywords) {
    var keyword = req.body.keywords[fld];
    if (typeof keyword === 'undefined') {
      continue;
    }
    keyword = keyword.trim();
    if (keyword == '') {
      continue;
    }
    if (typeof fields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(fields[fld], keyword);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  console.log(mainQuery);

  var getRows = function() {
    var sortBy = req.body.sortBy || 'code';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0
    };

    var sql = mainQuery +
        ' ORDER BY `' + sortBy + '` ' + sortDir;

    return db.queryArray(sql, {}).then(function(rows) {
      $scope.rows = rows;
      return rows;
    });
  };

  ////////////////////////////////////////////////////
  // MAIN
  ////////////////////////////////////////////////////
  getRows().then(function() {
    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListShop", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/shop_'+id+'.xlsx';
    fs.writeFileSync(path.normalize(__dirname+'/../../../public'+fname), buffer);
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

router.post('/getById', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var sql = "SELECT * FROM shop WHERE id=:id ";
  db.query(sql, {id:req.body.id}).then(function(rows){
    if (rows.length==0) {
      throw new Error('shop.error.not_found');
    }
    res.send({
      status: true,
      data: rows[0]
    });
  }).catch(function(e) {
    res.send({
      status: false,
      msg: e
    });
  });
});

router.post('/save', [bodyParser.json()], function(req, res) {
  // validate
  var error = [];
  var data = req.body.data;
  data.id = data.id || 0;

  if (data.code == '') {
    error.push('shop.error.code_empty');
  }

  if (data.name == '') {
    error.push('shop.error.name_empty');
  }

  if (error.length > 0) {
    res.send({status:false, error: error});
    return;
  }

  var checkDup = function() {
    var sql = "SELECT 1 AS cnt FROM shop WHERE code=:code AND id <> :id";
    return db.query(sql, {code:data.code, id:data.id})
      .then(function(rows) {
        if (rows.length > 0) {
//          console.log('ERROR duplicate');
          throw 'error.duplicate';
        }
      });
  };

  var checkDupBarcode = function() {
    if (data.prefix_barcode.trim()=='') {
      return true;
    }
    var sql = "SELECT 1 AS cnt FROM shop WHERE prefix_barcode=:prefix_barcode "
      + "AND id <> :id";
    return db.query(sql, {prefix_barcode:data.prefix_barcode, id:data.id})
      .then(function(rows) {
        if (rows.length > 0) {
//          console.log('ERROR duplicate_barcode');
          throw 'error.duplicate_barcode';
        }
      });
  };

  var insertData = function() {
    var sql =  "INSERT INTO shop (code, name, location, tel, fax, is_active, "
      + "prefix_barcode) VALUES (:code, :name, :location, :tel, :fax, :is_active, "
      + ":prefix_barcode)";
    return db.query(sql, data).then(function(result) {
      data.id = result;
    });
  }

  var updateData = function() {
    var sql = "UPDATE shop SET code=:code, name=:name, location=:location, "
      + "tel=:tel, fax=:fax,is_active=:is_active WHERE id=:id";
    return db.query(sql, data);
  }

  //////////////////////////////////////
  // MAiN
  //////////////////////////////////////
  var db = conn.connect();
  q.all([
    checkDup(),
    checkDupBarcode()
  ]).then(function() {
    var all = [];
    if (data.id==0) {
      return insertData();
    }
    return updateData();
  }).then(function() {
    res.send({
      status:true,
      id:data.id
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/delete', [bodyParser.json()], function(req, res) {
  var id = req.body.id;
  id = id || 0;
  if  (id==0) {
    res.send({status:false, msg:'error.missing_id'});
    return;
  }

  var checkInStaff = function() {
    var sql = "SELECT 1 FROM staff WHERE branch_id=:id AND is_active='YES' LIMIT 1";
    return db.query(sql, {id:id})
      .then(function(rows) {
        if (rows.length > 0) {
          throw new Error('error.in_use');
        }
      });
  };

  var checkReferences = function() {
    return q.all([
      checkInStaff()
    ]);
  };

  var deactiveData = function() {
    var sql = "UPDATE shop SET is_active='NO' WHERE id=:id";
    return db.query(sql, {id:id});
  }

  //////////////////////////////////////
  // MAIN
  //////////////////////////////////////

  var db = conn.connect();
  checkReferences()
    .then(deactiveData)
    .then(function() {
      res.send({
        status: true
      });
    }).catch(function(e) {
      res.send({
        status: false,
        error: e
      });
    });
});

module.exports = router;
