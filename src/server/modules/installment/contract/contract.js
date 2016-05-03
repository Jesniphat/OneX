var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var mysqlConn   = require('../../../lib/db');
var oraConn     = require('../../../lib/oracle');
var router      = express.Router();
var helper      = require('../../../lib/helper');
var mkdirp      = require('mkdirp');
var fs          = require('fs');
var path        = require('path');
var nsReport    = require('../../../lib/nsreport');
var xlsx        = require('node-xlsx');

/*
var fields = {
  sell_date:{name:'c.sell_date',type:'date'},
  receipt_no:{name:'c.receipt_no'},
  company_name:{name:'c.company_name'},
  product_description:{name:'c.product_description'},
  down_payment:{name:'c.down_payment', type:'number'},
  remain_price:{name:'c.remain_price',type:'number'},
  shop_name:{name:'c.shop_id',type:'number'},
  finance_staff:{name:'c.finance_staff'},
  sales_staff:{name:'c.sales_staff'},
  shop_name:{name:'s.name'},
  shop:{name:'c.shop_code'}
};
*/
var fields = {
  sell_date:{name:'s.sell_date',type:'daterange'},
  receipt_no:{name:'s.receipt_no'},
  company_name:{name:'c.name'},
  product_description:{name:'p.description'},
  product_serial:{name:'sd.serial'},
  down_payment:{name:'(nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,0))', type:'number'},
  remain_price:{name:'(sd3.main_price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,0))',type:'number'},
  shop_name:{name:'s.shop_id',type:'number'},
  finance_staff:{name:'fst.fullname'},
  sales_staff:{name:'sst.fullname'},
  shop_name:{name:'sh.name'},
  shop:{name:'sh.code'},
  flag:{name:"decode(fst.nickname, 'สดพิเศษ', '*', '')"},
  return_status:{name:'r.return_status'}
};

var fieldsClose = {
  return_date:{name:'r.return_date',type:'daterange'},
  sell_date:{name:'s.sell_date',type:'daterange'},
  mysql_contract_code:{name:'s.mysql_contract_code'},
  shop_name:{name:'sh.name'},
  description:{name:'aa.description'},
  contract_id:{name:'s.contract_id'},
  return_status:{name:'r.return_status'},
  serial:{name:'aa.serial'},
  cus_name:{name:'c.name'},
  shop:{name:'sh.code'},
};

var contractFields = {
  code:{name:'c.code'},
  sign_date: {name:'c.sign_date', type:'daterange'},
  cus_name: {name:"CONCAT(c.cus_firstname, ' ', c.cus_lastname)"},
  product_detail: {name:'c.product_detail'},
  product_serial: {name:'c.product_serial'},
  payment_price: {name:'c.payment_price', type:'number'},
  total_paid: {name:'c.total_paid', type:'number'},
  balance: {name:'c.balance', type:'number'},
  shop:{name:'s.code'},
  shop_name:{name:'s.name'},
  current_status:{name:"c.current_status"},
  finance:{name:'st.display_name'},
  cus_mobile:{name:'c.cus_mobile'},
  over_day:{name:'c.over_day', type:'number'},
  amount_term:{name:'c.amount_term', type:'number'},
  last_paid:{name:'c.last_paid'}
};

// over_day:{
//   name:'(select DATEDIFF(now(),min(due_date)) from payment_term  where contract_id = c.id and term_status in (\'OVERDUE\',\'OVERDUE_PARTIAL\'))'
//   , type:'number'
// },
// amount_term:{
//   name:'(select case when count(id) = 0 then \'\' else count(id) end from payment_term where contract_id = c.id and term_status in (\'OVERDUE\',\'OVERDUE_PARTIAL\'))'
//   , type:'number'
// },
// last_paid:{
//   name:'(select case when max(paid_date) = \'0000-00-00\' then \'\' else max(paid_date) end  from payment_term where contract_id = c.id and term_status in (\'OVERDUE\',\'OVERDUE_PARTIAL\'))'
//   , type:'daterange'
// },
// discount:{
//   name:'(select max(discount) from payment_term where contract_id = c.id) '
//   , type:'number'
// }

router.post('/sellInfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var db = mysqlConn.connect();
    var $scope = {
      sell: null,
      person: null,
      address: {
        CARD: {},
        HOME: {},
        WORK: {},
        COCARD: {},
        COHOME: {},
        COWORK: {}
      },
      barcode:[]
    };

    var getSellInfo = function() {
      var mainQuery = "SELECT s.id, s.sell_date, s.receipt_no, "
        + "sh.id shop_id, sh.code shop_code, sh.name shop_name, "
        + "c.id company_id, c.code company_code, p.id product_id, "
        + "sh.name shop_name, s.contract_ref, c.name company_name, "
        + "p.description product_description, sd.serial product_serial, "
        + "sd2.price, sd2.cost, sd2.install_cost, sd2.price main_price, "
        + "nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,0)+sd2.down_payment  down_payment, "
        + "sd2.price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,0)-sd2.down_payment remain_price, "
        + "sst.barcode sell_staff_barcode, sst.mysqlviewstaffid sell_staff_id, sst.fullname sell_staff, "
        + "fst.mysqlviewstaffid finance_staff_id, fst.barcode finance_staff_barcode, fst.fullname finance_staff, "
        + "case when fst.nickname like '%'||:nickname||'%' then '*' else '' end flag "
        + "FROM sell s "
        + "        JOIN shop sh ON s.shop_id=sh.id "
        + "        JOIN company c ON s.company_id=c.id "
        + "        LEFT JOIN staff sst ON s.sales_staff_id=sst.id "
        + "        LEFT JOIN staff fst ON s.finance_staff_id=fst.id "
        + "          AND fst.nickname <> :nickname "
        + "        JOIN ( "
        + "          SELECT sell_id, sum(case when price >= 0 then price else 0 end) AS price, SUM(cost) cost, "
        + "            SUM(nvl(installation_cost,0))install_cost, "
        + "            SUM(case when price < 0 then -price else 0 end) down_payment , max(price) max_price "
        + "          FROM sell_detail "
        + "          GROUP BY sell_id "
        + "        ) sd2 ON sd2.sell_id=s.id "
        + "        JOIN sell_detail sd ON sd.sell_id=s.id  "
        + "          and sd.price = sd2.max_price   "
        + "        JOIN product p ON sd.product_id=p.id "
        + "WHERE s.status='DEBIT' AND s.id=:id and s.sell_type='NORMAL' ";

console.log('id:',req.body.id);

      return oraConn.query(oradb, mainQuery, {nickname:'สดพิเศษ', id:req.body.id}).then(function(result) {
        if (result.rows.length==0) {
          $scope.sell = null;
          return;
        }
        $scope.sell = oraConn.convert(result)[0];
      });
    }

    var getPersonInfo = function() {
      if ($scope.sell == null || $scope.sell.company_code.trim()=='') {
        return;
      }
      var sql = "SELECT * FROM person WHERE nationid=:code ORDER BY id DESC LIMIT 1";
      return db.query(sql, {code:$scope.sell.company_code.trim()}).then(function(rows) {
        console.log('PERSON=', rows);
        if (rows.length===0) {
          return;
        }
        if (rows.length >  0) {
          $scope.person = rows[0];
        }
      })
    }

    var getAddressInfo = function() {
      if ($scope.person == null) {
        return;
      }
      var sql = "SELECT * FROM address "
        + "WHERE contract_id IN ("
        + "  SELECT MAX(id) FROM contract WHERE cus_person_id=:id AND is_active='YES'"
        + "  ORDER BY sign_date) "
        + "AND is_active='YES'";
      return db.query(sql, {id: $scope.person.id}).then(function(rows) {
        console.log('ADDRESS=', rows);
        if (rows.length===0) {
          return;
        }
        for (var i = 0; i < rows.length; i++) {
          $scope.address[rows[i].type] = rows[i];
        }
        var list = ['CARD', 'HOME', 'WORK'];
        for (var i = 0; i < list.length; i++) {
          if (!$scope.address[i]) {
            $scope.address[i] = {};
          }
        }
      });
    }

    var getBarcode = function() {
      var sql = " SELECT b.barcode FROM contract_barcode b "
        + " JOIN shop s ON b.shop_id=s.id "
        + " WHERE s.code=:shop_code AND b.is_used='NO' AND b.is_active='YES' "
        + " order by b.barcode asc";
      return db.query(sql, {shop_code:$scope.sell.shop_code}).then(function(rows) {
//        console.log('BARCODE=', rows);
        if (rows.length===0) {
          return;
        }
        $scope.barcode = rows.map(function(row) {
          return row.barcode;
        });
      }).catch(function(e) {
        console.log('ERROR:', e);
      });
    };

    var getUsedBarcode = function() {
      var sql = "SELECT  c.code barcode  FROM contract c "
        + " JOIN shop s ON c.shop_id=s.id  "
        + " WHERE s.code=:shop_code order by c.code asc  ";
        return db.query(sql, {shop_code:$scope.sell.shop_code}).then(function(rows) {
          if (rows.length===0) {
            return;
          }
          $scope.used_barcode = rows.map(function(row) {
            return row.barcode;
          });
          //$scope.used_barcode = rows;
        }).catch(function(e) {
          console.log('ERROR:', e);
        });
    };

    var checkSpecialCode = function() {
      var sql = "select id from sell where finance_staff_id in (select id from staff where barcode like '%9999') and id=:id "
      //console.log(req.body.id);
      return oraConn.query(oradb, sql, {id:req.body.id}).then(function(result) {
        if (result.rows.length==0) {
          console.log('1111111');
          $scope.special = false;
          return;
        }
          console.log('2222222');
        $scope.special = true;
      });
    }

    var getPrefix = function(){
      var sql = "select prefix_barcode from shop where id = :shop_id "
      return db.query(sql,{shop_id:req.session.data.staff.shop_id}).then(function(rows) {
        if (rows.length===0) {
          throw 'shop.error.shop_id_not_found';
        }
        var _year = new Date().toJSON().slice(2,7).replace('-','');
        $scope.prefix_code = 'C' + rows[0].prefix_barcode + _year;
      });
    }

    var getContracRef = function() {
      var sql = "SELECT  c.code barcode  FROM contract c "
        + " JOIN shop s ON c.shop_id=s.id  "
        + " WHERE s.code=:shop_code and c.current_status='CLOSE_CHANGE' order by c.code asc  ";
        return db.query(sql, {shop_code:$scope.sell.shop_code}).then(function(rows) {
          if (rows.length===0) {
            return;
          }
          $scope.contract_ref = rows.map(function(row) {
            return row.barcode;
          });
          //$scope.used_barcode = rows;
        }).catch(function(e) {
          console.log('ERROR:', e);
        });
    };

    getSellInfo().then(function() {
      console.log('getSellInfo');
      return q.all([
        checkSpecialCode(),
        getPrefix(),
        getBarcode(),
        getUsedBarcode(),
        getContracRef(),
        getPersonInfo().then(getAddressInfo)
      ]);
    }).then(function() {
      oraConn.close(oradb);
      res.send({
        status:true,
        data: {
          sell: $scope.sell,
          person: $scope.person,
          address: $scope.address,
          barcode: $scope.barcode,
          flagSell: $scope.special,
          prefix_code: $scope.prefix_code,
          used_barcode: $scope.used_barcode,
          contract_ref: $scope.contract_ref
        }
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      res.send({
        status:false,
        error:e
      });
    });
  });
});

router.post('/listPending', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "s.id, s.sell_date, s.receipt_no, sh.name shop_name, "
      + "s.contract_ref, c.name company_name, "
      + "p.description product_description, sd.serial product_serial, "
      + "sd2.price, sd2.cost, sd2.install_cost,sd2.price main_price, "
      + "nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,0)+sd2.down_payment down_payment, "
      + "sd2.price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,0)-sd2.down_payment remain_price, "
      + "sst.fullname sales_staff, fst.fullname finance_staff, "
      + "case when fst.nickname like '%'||:nickname||'%' then '*' else '' end flag"
//      + "decode(fst.nickname, :nickname, '*', '') flag ";

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM sell s "
      + "        JOIN shop sh ON s.shop_id=sh.id "
      + "        JOIN company c ON s.company_id=c.id "
      + "        LEFT JOIN staff sst ON s.sales_staff_id=sst.id "
      + "        LEFT JOIN staff fst ON s.finance_staff_id=fst.id "
      + "        JOIN ( "
      + "          SELECT sell_id, sum(case when price >= 0 then price else 0 end) AS price, SUM(cost) cost, "
      + "            SUM(installation_cost) install_cost, "
      + "            SUM(case when price < 0 then -price else 0 end) down_payment ,max(price) max_price "
      + "          FROM sell_detail "
      + "          GROUP BY sell_id "
      + "        ) sd2 ON sd2.sell_id=s.id "
      + "        JOIN sell_detail sd ON sd.sell_id=s.id  "
      + "        and sd.price = sd2.max_price   "
      + "        JOIN product p ON sd.product_id=p.id "
      + "WHERE s.status='DEBIT' AND s.contract_id=0 "

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
      if (typeof fields[fld]==='undefined') {
        continue;
      }
      var tmp = helper.genCond(fields[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);

      if (fld=='remain_price'
          || fld=='down_payment') {
        hasJoin = true;
      }
    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }

    var getCount = function() {
      var sql = "SELECT count(s.id) AS cnt  "
        + "FROM sell s "
        + "        JOIN shop sh ON s.shop_id=sh.id "
        + "        JOIN company c ON s.company_id=c.id "
        + "        LEFT JOIN staff sst ON s.sales_staff_id=sst.id "
        + "        LEFT JOIN staff fst ON s.finance_staff_id=fst.id "
        + "        JOIN sell_detail sd ON sd.sell_id=s.id  "
        + "        JOIN(  "
        + "            select max(price) m_price,sell_id from sell_detail  "
        + "          group by sell_id  "
        + "         )sd3 on sd.price = sd3.m_price and sd3.sell_id = s.id    "
        + "        JOIN product p ON sd.product_id=p.id "
        + "WHERE s.status='DEBIT' AND s.contract_id=0 "
     if (hasJoin) {
        sql = 'SELECT COUNT(*) AS cnt FROM ('
          + mainQuery.replace('%FIELD_LIST%', '1') + ') x';
     } else if (cond.length > 0) {
         sql += ' AND ' + cond.join(' AND ');
     }

      //console.log('COUNT QUERY:', sql);

      return oraConn.query(oradb, sql, {}).then(function(result) {
        if (result.rows.length==0) {
          $scope.totalRows = 0;
        } else {
          $scope.totalRows = result.rows[0][0];
        }
      });
    }

    var getRows = function() {
      var sortBy = req.body.sortBy || 'sell_date';
      var sortDir = req.body.sortDir || 'DESC';
      var limit = req.body.limit || 50;
      var page = parseInt(req.body.page || 0);
      var sql;
      var sortBy2;

      $scope.opt = {
        sortBy: sortBy,
        sortDir: sortDir,
        limit: limit,
        page: page,
        totalRows: 0
      };

      if (fields[sortBy]) {
        sortBy2 = fields[sortBy];
      } else {
        sortBy2 = "s.sell_date";
      }
      sql = "SELECT * FROM (SELECT rank() OVER (ORDER BY " + sortBy2.name + " " + sortDir+") rnk, "
        + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
        + ") x WHERE rnk BETWEEN " + (page*limit+1) + " AND " + ((page+1)*limit)
        + " ORDER BY " + sortBy + " " + sortDir;

      console.log('QUERY:', sql);

      return oraConn.query(oradb, sql, {nickname:'สดพิเศษ'}).then(function(result) {
//        $scope.rows = oraConn.convert(result);
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      });
    }

    // MAIN QUERY
    q.all([
      getCount(),
      getRows()
    ]).then(function() {
      oraConn.close(oradb);
      $scope.opt.totalRows = $scope.totalRows;
      res.send({
        status: true,
        data: $scope.rows,
        opt: $scope.opt
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      res.send({
        status: false,
        error: e
      });
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  });
});


router.post('/exportPending', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "s.id, s.sell_date, s.receipt_no, sh.name shop_name, "
      + "s.contract_ref, c.name company_name, "
      + "p.description product_description, sd.serial product_serial, "
      + "sd2.price, sd2.cost, sd2.install_cost, sd3.main_price, "
      + "nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,0) down_payment, "
      + "sd3.main_price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,0) remain_price, "
      + "sst.fullname sales_staff, fst.fullname finance_staff, "
      + "case when fst.nickname like '%'||:nickname||'%' then '*' else '' end flag"

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM sell s "
      + "        JOIN shop sh ON s.shop_id=sh.id "
      + "        JOIN company c ON s.company_id=c.id "
      + "        LEFT JOIN staff sst ON s.sales_staff_id=sst.id "
      + "        LEFT JOIN staff fst ON s.finance_staff_id=fst.id "
      + "        JOIN ( "
      + "          SELECT sell_id, sum(price) price, SUM(cost) cost, "
      + "            SUM(installation_cost) install_cost "
      + "          FROM sell_detail "
      + "          GROUP BY sell_id "
      + "        ) sd2 ON sd2.sell_id=s.id "
      + "        JOIN ( "
      + "          SELECT sell_id, max(price) main_price "
      + "          FROM sell_detail "
      + "          GROUP BY sell_id "
      + "        ) sd3 ON sd3.sell_id=s.id "
      + "        JOIN sell_detail sd ON sd.sell_id=s.id AND sd.price=sd3.main_price "
      + "        JOIN product p ON sd.product_id=p.id "
      + "WHERE s.status='DEBIT' AND s.contract_id=0 "

    var cond = [];
    var hasJoin = false;
    for (var fld in req.body.keywords) {
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
      var tmp = helper.genCond(fields[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);

    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }


    var getRows = function() {
      var sortBy = req.body.sortBy || 'sell_date';
      var sortDir = req.body.sortDir || 'DESC';
      var limit = req.body.limit || 50;
      var page = parseInt(req.body.page || 0);
      var sql;
      var sortBy2;

      $scope.opt = {
        sortBy: sortBy,
        sortDir: sortDir,
        limit: limit,
        page: page,
        totalRows: 0
      };

      if (fields[sortBy]) {
        sortBy2 = fields[sortBy];
      } else {
        sortBy2 = "s.sell_date";
      }
      sql = mainQuery.replace('%FIELD_LIST%', fldList);
//      sql += ' AND rownum <= 100';
    //  console.log('SQL=', sql);
      return oraConn.query(oradb, sql, {nickname:'สดพิเศษ'}).then(function(result) {
        console.log('GET OK');
        $scope.result = result;
      }).catch(function(e) {
        console.log('ERROR=', e);
      });
    }

    // MAIN QUERY
    getRows().then(function() {
      var header = $scope.result.metaData.map(function(col) {
        return col.name.toLowerCase();
      });
      var rows = $scope.result.rows;
      rows.unshift(header);
      var buffer = xlsx.build([{name: "ListPending", data: rows}]);
      var id = helper.newUUID();
      var fname = '/output/contract_pending_'+id+'.xlsx';
      fs.writeFileSync(path.normalize(__dirname + '/../../../public'+fname), buffer);
      oraConn.close(oradb);
      res.send({
        status:true,
        file: fname
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      res.send({
        status: false,
        error: e
      });
    });
  }).catch(function(e) {
    oraConn.close(oradb);
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/listBarcode', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var param = req.body;

  var getBarcode = function() {
    var sql = "SELECT barcode FROM contract_barcode "
      + "WHERE shop_id=:shop_id AND is_used='NO'";
    return db.query(sql, {shop_id:req.body.shop_id}, function(rows) {
      $scope.rows = rows;
    });
  };

  getBarcode().then(function() {
    res.send({
      status: true,
      barcode: $scope.rows.map(function(row) {
        return row.barcode;
      })
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/saveNew', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {

    var db = mysqlConn.connect();
    var $scope = {};
    var data = req.body.data;
    var flagSell = req.body.flagSell;
    var contractCode = data.code;
    var sell_info = req.body.sellInfo;
    var contractref = req.body.contractref;

    var checkBarcode = function() {
      var sql = "";
      if (flagSell == true){
        var sql = " select max(code) code from contract where code like concat(:prefix,'%') "
        return db.query(sql,{prefix:req.body.prefix_code}).then(function(rows) {
          //console.log(rows);
          if (rows[0].code == null) {
            $scope.running = '1';
            $scope.running = '0000000000000000' + $scope.running;
          }else{
            $scope.running = parseInt(rows[0].code.substring(8,13)) + 1;
            $scope.running = '0000000000000000' + $scope.running.toString();
          }
          contractCode = req.body.prefix_code + $scope.running.substr($scope.running.length-4);
        });
      }else{
        sql = "SELECT barcode "
          + "FROM contract_barcode "
          + "WHERE barcode=:barcode AND is_used='YES'";

          return db.query(sql, {barcode: contractCode}).then(function(rows) {
            if (rows.length > 0) {
              throw 'err_barcode_already_used';
            }
            var sql = "SELECT 1 FROM contract WHERE code=:code";
            return db.query(sql, {code: contractCode});
          }).then(function(rows) {
            if (rows.length > 0) {
              throw 'err_barcode_already_used';
            }
          });
      }

    };

    var getShopId = function() {
      var sql = "SELECT id FROM shop WHERE code=:code AND is_active='YES'";
      return db.query(sql, {code: data.shop_code}).then(function(rows) {
        if (rows.length===0) {
          throw 'contract.error.shop_code_not_found';
        }
        $scope.shop_id = rows[0].id;
      });
    };

    var saveContract = function() {
      var sql = "INSERT INTO contract (code, shop_id, sell_id, ref_code, "
        + "sell_staff_id, finance_staff_id, "
        + "sign_date, type, cus_person_id, cus_ref_id, cus_prename, "
        + "cus_firstname, cus_lastname, cus_marital_status, cus_mobile, "
        + "cus_email, cus_addr_id, cus_addr_owner, cus_addr_with, cus_addr_person, "
        + "work_company, work_addr_id, work_type, work_type_other, work_detail, "
        + "work_department, work_position, work_time, work_year, work_salary, "
        + "work_income, work_income_source, work_prev_company, work_prev_addr, "
        + "work_prev_department, work_prev_tel, co_person_id, co_prename, "
        + "co_firstname, co_lastname, co_mobile, co_email, co_relation, co_work_company, "
        + "co_work_detail, co_work_department, co_work_position, co_work_time, "
        + "co_work_year, co_work_salary, co_work_income, co_work_income_source, "
        + "co_addr_id, doc_send_to, total_price, cost, install_cost, fee, "
        + "payment_price, payment_month, payment_on_day, payment_per_month, "
        + "product_detail, product_serial, balance, remark, created_by, updated_by, down_payment, total_paid "
        + ",sell_date , product_id, contract_ref) "
        + "VALUES (:code, :shop_id, :sell_id, :ref_code, :sell_staff_id, :finance_staff_id, :sign_date, "
        + ":type, :cus_person_id, :cus_ref_id, :cus_prename, :cus_firstname, :cus_lastname, "
        + ":cus_marital_status, :cus_mobile, :cus_email, :cus_addr_id, "
        + ":cus_addr_owner, :cus_addr_with, :cus_addr_person, :work_company, "
        + ":work_addr_id, :work_type, :work_type_other, :work_detail, "
        + ":work_department, :work_position, :work_time, :work_year, "
        + ":work_salary, :work_income, :work_income_source, :work_prev_company, "
        + ":work_prev_addr, :work_prev_department, :work_prev_tel, :co_person_id, "
        + ":co_prename, :co_firstname, :co_lastname, :co_mobile, :co_email, :co_relation, "
        + ":co_work_company, :co_work_detail, :co_work_department, "
        + ":co_work_position, :co_work_time, :co_work_year, :co_work_salary, "
        + ":co_work_income, :co_work_income_source, :co_addr_id, :doc_send_to, "
        + ":total_price, :cost, :install_cost, :fee, "
        + ":payment_price, :payment_month, :payment_on_day, :payment_per_month, "
        + ":product_detail, :product_serial, :balance, :remark, :user_id, :user_id, :down_payment, :total_paid "
        + ",:sell_date,:product_id,:contract_ref)";

      var contractData = {
        code: contractCode,
        shop_id: $scope.shop_id,
        sell_id: data.sell_id,
        ref_code: data.ref_code,
        sell_staff_id: data.sell_staff_id || 0,
        finance_staff_id: data.finance_staff_id || req.session.data.staff.id || 0,
        sign_date: helper.dateToString(new Date(data.sign_date)),
        type: flagSell == true ? 'CASH_EXTRA' : 'NORMAL',
        cus_person_id: 0,
        cus_ref_id: data.customer.ref_id || 0,
        cus_prename: data.customer.prename || '',
        cus_firstname: data.customer.firstname || '',
        cus_lastname: data.customer.lastname || '',
        cus_marital_status: data.customer.marital_status || 'N/A',
        cus_mobile: data.customer.mobile || '',
        cus_email: data.customer.email || '',
        cus_addr_id: 0,
        cus_addr_owner: data.addr_owner || '',
        cus_addr_with: data.addr_with || '',
        cus_addr_person: data.addr_person || 0,
        work_company: data.work_company || '',
        work_addr_id: 0,
        work_type: data.work_type || '',
        work_type_other: data.work_other || '',
        work_detail: data.work_detail || '',
        work_department: data.work_department || '',
        work_position: data.work_position || '',
        work_time: data.work_time || '',
        work_year: data.work_year || 0,
        work_salary: data.work_salary || 0,
        work_income: data.work_income || 0,
        work_income_source: data.work_income_source || '',
        work_prev_company: data.work_prev_company || '',
        work_prev_addr: data.work_prev_addr || '',
        work_prev_department: data.work_prev_department || '',
        work_prev_tel: data.work_prev_tel || '',
        co_person_id: 0,
        co_prename: data.co.prename || '',
        co_firstname: data.co.firstname || '',
        co_lastname: data.co.lastname || '',
        co_mobile: data.co.mobile || '',
        co_email: data.co.email || '',
        co_relation: data.co_relation || '',
        co_work_company: data.co_work_company || '',
        co_work_detail: data.co_work_detail || '',
        co_work_department: data.co_work_department || '',
        co_work_position: data.co_work_position || '',
        co_work_time: data.co_work_time || '',
        co_work_year: data.co_work_year || 0,
        co_work_salary: data.co_work_salary || 0,
        co_work_income: data.co_work_income || 0,
        co_work_income_source: data.co_work_income_source || '',
        co_addr_id: 0,
        doc_send_to: data.doc_send_to,
        total_price: data.total_price,
        cost: data.cost,
        install_cost: data.install_cost,
        fee: data.fee,
        payment_price: data.payment_price,
        payment_month: data.payment_month,
        payment_on_day: data.payment_on_day,
        payment_per_month: data.payment_per_month || 0,
        product_detail: data.product_detail || '',
        product_serial: data.product_serial || '',
        balance: data.payment_price,
        remark:'',
        user_id:req.session.data.staff.id,
        down_payment: contractref != '' ? $scope.downpayment_contractref : data.payment_down,
        total_paid: contractref != '' ? $scope.downpayment_contractref : data.payment_down,
        sell_date:data.sell_date,
        product_id:sell_info.product_id,
        contract_ref:contractref
      }
        console.log('sell_date:',data.sell_date,',product_id:',sell_info.product_id);
      return db.query(sql, contractData).then(function(result) {
        $scope.contract_id = result.insertId;
        console.log($scope.contract_id);
      });
    }

    var updateContract = function() {
      var sql = "UPDATE contract SET cus_person_id=:cus_person_id, "
        + "cus_addr_id=:cus_addr_id, cus_card_addr_id=:cus_card_addr_id, work_addr_id=:work_addr_id, "
        + "co_person_id=:co_person_id, co_addr_id=:co_addr_id, co_card_addr_id=:co_card_addr_id, "
        + "co_work_addr_id=:co_work_addr_id "
        + "WHERE id=:id";
      var updateData = {
        id: $scope.contract_id,
        cus_person_id: $scope.cus_person_id,
        cus_addr_id: $scope.cus_addr_id || 0,
        cus_card_addr_id: $scope.cus_card_addr_id || 0,
        work_addr_id: $scope.work_addr_id || 0,
        co_person_id: $scope.co_person_id,
        co_addr_id: $scope.co_addr_id || 0,
        co_card_addr_id: $scope.co_card_addr_id || 0,
        co_work_addr_id: $scope.co_work_addr_id || 0
      };
      return db.query(sql, updateData).then(function(){
        console.log('updateContract success');
      });
    }

    var saveAddress = function(id, addrData) {
      var sql = "INSERT INTO address (contract_id, type, addr1, addr2, tambon, "
        + "amphur, province, zipcode, tel, other, full_address, created_by, updated_by) VALUES ("
        + ":contract_id, :type, :addr1, :addr2, :tambon, "
        + ":amphur, :province, :zipcode, :tel, :other, :full_address, :user_id, :user_id)";
      addrData.user_id = req.session.data.staff.id;
      return db.query(sql, addrData).then(function(res) {
        $scope[id] = res.insertId;
      });
    }

    var insertPerson = function(id, personData) {
      var sql = "INSERT INTO person (nationid, type, prename, firstname, lastname, "
      + "fullname, idcard_info, passport, passport_info, nation, birth, gender, "
      + "marital_status, mobile, email, lineid, created_by, updated_by) VALUES ("
      + ":nationid, :type, :prename, :firstname, :lastname, :fullname, "
      + ":idcard_info, :passport, :passport_info, :nation, :birth, :gender, "
      + ":marital_status, :mobile, :email, :lineid, :user_id, :user_id) ON DUPLICATE KEY UPDATE "
      + "prename=VALUES(prename), firstname=VALUES(firstname), lastname=VALUES(lastname), "
      + "fullname=VALUES(fullname), idcard_info=VALUES(idcard_info), passport=VALUES(passport), "
      + "passport_info=VALUES(passport_info), nation=VALUES(nation), birth=VALUES(birth), "
      + "gender=VALUES(gender), marital_status=VALUES(marital_status), mobile=VALUES(mobile), "
      + "email=VALUES(email), lineid=VALUES(lineid), updated_by=VALUES(updated_by)";
      personData.user_id=req.session.data.staff.id;
      return db.query(sql, personData).then(function(res) {
        $scope[id] = res.insertId;
      })
    }

    var updatePerson = function(personData) {
      var sql = "UPDATE person SET prename=:prename, firstname=:firstname, "
        + "lastname=:lastname, fullname=:fullname, idcard_info=:idcard_info, "
        + "passport=:passport, passport_info=:passport_info, nation=:nation, "
        + "birth=:birth, gender=:gender, marital_status=:marital_status, "
        + "mobile=:mobile, email=:email, lineid=:lineid, updated_by=:user_id WHERE id=:id";
      personData.user_id = req.session.data.staff.id
      return db.query(sql, personData);
    }

    var getPerson = function(nationid) {
      var sql = "SELECT id FROM person WHERE nationid=:nationid";
      return db.query(sql, {nationid:nationid}).then(function(rows) {
        if (rows.length == 0) {
          return null;
        }
        return rows[0].id;
      });
    }

    var savePerson = function(id, personData) {
      return getPerson(personData.nationid).then(function(person_id) {
        if (person_id==null) {
          return insertPerson(id, personData);
        }
        $scope[id] = person_id;
        return updatePerson(personData);
      });
    };

    getStaffs = function() {
      var sql = "SELECT id, user FROM staff WHERE user=(:sell_staff_code, :finance_staff_code)";
      return db.query(sql, {
        sell_staff_code:req.body.sell_staff_code,
        finance_staff_code:req.body.finance_staff_code
      }).then(function(rows) {
        rows.forEach(function(row) {
          if (row.user==req.body.sell_staff_code) {
            $scope.sell_staff_id = row.id;
          } else {
            $scope.finance_staff_id = row.id;
          }
        });
      });
    };

    var savePayment = function() {
      var tmp = req.body.paymentData.map(function(payment) {
        return "(" + $scope.contract_id + ', ' + payment.no
          + ",'" + payment.date + "'," + payment.amount + ",'" + data.sell_id + "','" + payment.cost_term + "')";
      });
      var sql = "INSERT INTO payment_term (contract_id, term_num, due_date, "
        + "due_amount, sell_id, cost_term) VALUES " + tmp.join(', ')
        + "ON DUPLICATE KEY UPDATE due_date=VALUES(due_date), "
        + "due_amount=VALUES(due_amount)";
      return db.query(sql, {});
    }

    var genFullname = function(p, f, l) {
      var tmp = [];
      if (p) {
        tmp.push(p.trim());
      }
      if (f) {
        tmp.push(f.trim());
      }
      if (l) {
        tmp.push(l.trim());
      }
      return tmp.join(' ');
    }

    var savePhotoData = function(nationid, data) {
      var pos = data.indexOf(',');
      if (pos===-1) {
        return;
      }
      var filepath = path.normalize(__dirname + '/../../../public/idcard/photo/'
          + nationid.substr(-1) + '/' + nationid.substr(-2,1));
      //console.log(filepath);
      mkdirp(filepath, function (err) {
          if (err) {
            console.error(err);
            return;
          }
          fs.writeFile(filepath + '/' + nationid+'.jpg', data.substr(pos+1), 'base64', function(err) {
            if (err) {
              console.log(err);
            }
          });
      });
    }

    var updateSell = function() {
      var sql = "UPDATE sell SET contract_id=:contract_id, mysql_contract_code=:contract_code WHERE id=:sell_id";
      return oraConn.query(oradb, sql, {
        contract_id: $scope.contract_id,
        contract_code: contractCode,
        sell_id: data.sell_id
      }, true);
    };

    var updateUsedBarcode = function() {
      var sql = "UPDATE contract_barcode SET is_used='YES', contract_id=:contract_id WHERE barcode=:barcode";
      return db.query(sql, {barcode:contractCode, contract_id:$scope.contract_id});
    };

    var getTotalPaidContractRef = function(){
      var sql = "select (total_paid - down_payment) paid_term, total_paid, down_payment from contract where code = :contract_ref "
      return db.query(sql,{contract_ref:contractref}).then(function(rows) {
        if (rows.length===0) {
          throw 'contract.error.contract_ref_not_found';
        }
        $scope.totalpaid_contractref = rows[0].total_paid;
        $scope.paidterm_contractref = rows[0].paid_term;
        $scope.downpayment_contractref = rows[0].down_payment;
      });
    }

    var updateTotalPaid = function() {
      var sql = "UPDATE contract SET total_paid=:total_paid WHERE id=:id";
      return db.query(sql, {id:$scope.contract_id,total_paid:$scope.totalpaid_contractref});
    };

    var getContractUpdate = function(){

      var sql = " select p.id row_id,p.term_num,p.due_date,p.paid_date,p.due_amount,p.paid_amount, " +
                " p.paid_status, p.term_status, p.close_status, c.balance, p.cost_term " +
                " from payment_term p " +
                " inner join contract c on p.contract_id = c.id and p.sell_id = c.sell_id " +
                " where c.id = :id and p.term_status not in ('WAIT_PAID','OVERDUE_PAID') order by p.term_num asc ";
                //console.log(sql);
      return db.query(sql,{id:$scope.contract_id});
    }

    var updateAllPaymentTermContractRef = function(rows) {
      var all = [];
      var costTerm = 0.00;
      var total_amount = $scope.paidterm_contractref;

      for (var i = 0; i < rows.length; i++) {
        var id = rows[i].row_id;
        var pay = 0;
        var status = rows[i].paid_status;
        var close_status = 'NORMAL';
        var discount = 0.00;

        if(total_amount != 0){

          var cost = (rows[i].due_amount - rows[i].paid_amount);
          var balance = 0.00;

          if (total_amount >= cost){
            if (rows[i].term_status == 'WAIT' || rows[i].term_status == 'WAIT_PARTIAL'){
              status = 'WAIT_PAID';
            }else{
              status = 'OVERDUE_PAID';
            }
            pay = cost;
            //costTerm = (costTerm + ((rows[i].cost_term * ((cost * 100) / rows[i].due_amount)) / 100));
          }else{
            if (rows[i].term_status == 'WAIT' || rows[i].term_status == 'WAIT_PARTIAL'){
              status = 'WAIT_PARTIAL';
            }else{
              status = 'OVERDUE_PARTIAL';
            }
            pay = total_amount;
          }

          costTerm = (costTerm + ((rows[i].cost_term * ((pay * 100) / rows[i].due_amount)) / 100));

          if ((i == (rows.length - 1)) && $scope.close_contract == 'CLOSE_NORMAL'){
            close_status = $scope.close_contract;
          }
          total_amount = total_amount - pay;
          balance = (cost - pay);
          //all.push(insertTermReceipt(id, pay, cost, balance));
          all.push(updatePaymentTermContractRef(id, pay, status,helper.dateToString(new Date(data.sign_date)),close_status));
        }
      }
      $scope.cost_term = costTerm;
      return q.all(all);
    }

    var updatePaymentTermContractRef = function(id, amount,status,paid_on,close_status) {
      console.log('update');
      var sql = "UPDATE payment_term SET paid_date=:paid_on, paid_amount=(paid_amount + :amount), term_status=:status, close_status=:close_status WHERE id=:id";
      //console.log('id=', id, ', amount=', amount, ', status=', status, ', paid_date=', paid_on);
      return db.query(sql, {id: id, amount:amount, status:status, paid_on:paid_on, close_status:close_status});
    }

    var updateStatusChange = function() {
      var sql = "UPDATE contract SET current_status='CLOSE_CHANGE' WHERE code=:contract_ref";
      return db.query(sql, {code:contractref});
    };

    db.beginTransaction()
      .then(checkBarcode)
      .then(getShopId)
      .then(function(){
        if (contractref != ''){
          return getTotalPaidContractRef()
        }else{
          return true;
        }
      })
      .then(saveContract)
      .then(function() {
      var customerData = {
        id: data.customer.id || 0,
        nationid: data.customer.nationid || '',
        type:'PERSON',
        prename: data.customer.prename || '',
        firstname: data.customer.firstname || '',
        lastname: data.customer.lastname || '',
        fullname: genFullname(data.customer.prename, data.customer.firstname, data.customer.lastname),
        idcard_info: JSON.stringify(data.cusIDCard),
        passport: '',
        passport_info: JSON.stringify(data.coIDCard),
        nation:'THA',
        birth: data.customer.birth || '0000-00-00',
        gender: data.customer.gender || 'N/A',
        marital_status: data.customer.marital_status || 'N/A',
        mobile: data.customer.mobile || '',
        email: data.customer.email || '',
        lineid: data.customer.lineid || ''
      };
      var coData = {
        id: data.co.id || 0,
        nationid: data.co.nationid || '',
        type:'PERSON',
        prename: data.co.prename || '',
        firstname: data.co.firstname || '',
        lastname: data.co.lastname || '',
        fullname: genFullname(data.co.prename, data.co.firstname, data.co.lastname),
        idcard_info: '{}',
        passport: '',
        passport_info: '{}',
        nation:'THA',
        birth: '0000-00-00',
        gender: 'N/A',
        marital_status: 'N/A',
        mobile: data.co.mobile || '',
        email: data.co.email || '',
        lineid: data.co.lineid || ''
      };
      var cardAddr = {
        contract_id: $scope.contract_id,
        type:'CARD',
        addr1: data.cardAddr.addr1 || '',
        addr2: data.cardAddr.addr2 || '',
        tambon: data.cardAddr.tambon || '',
        amphur: data.cardAddr.amphur || '',
        province: data.cardAddr.province || '',
        zipcode: data.cardAddr.zipcode || '',
        tel: data.cardAddr.tel || '',
        other: data.cardAddr.other || '',
        full_address: data.cardAddr.addr_text || ''
      };
      var customerAddr = {
        contract_id: $scope.contract_id,
        type:'HOME',
        addr1: data.customerAddr.addr1 || '',
        addr2: data.customerAddr.addr2 || '',
        tambon: data.customerAddr.tambon || '',
        amphur: data.customerAddr.amphur || '',
        province: data.customerAddr.province || '',
        zipcode: data.customerAddr.zipcode || '',
        tel: data.customerAddr.tel || '',
        other: data.customerAddr.other || '',
        full_address: data.customerAddr.addr_text || ''
      };
      var workAddr = {
        contract_id: $scope.contract_id,
        type:'WORK',
        addr1: data.workAddr.addr1 || '',
        addr2: data.workAddr.addr2 || '',
        tambon: data.workAddr.tambon || '',
        amphur: data.workAddr.amphur || '',
        province: data.workAddr.province || '',
        zipcode: data.workAddr.zipcode || '',
        tel: data.workAddr.tel || '',
        other: data.workAddr.other || '',
        full_address: data.workAddr.addr_text || ''
      };
      var coCardAddr = {
        contract_id: $scope.contract_id,
        type:'COCARD',
        addr1: data.coCardAddr.addr1 || '',
        addr2: data.coCardAddr.addr2 || '',
        tambon: data.coCardAddr.tambon || '',
        amphur: data.coCardAddr.amphur || '',
        province: data.coCardAddr.province || '',
        zipcode: data.coCardAddr.zipcode || '',
        tel: data.coCardAddr.tel || '',
        other: data.coCardAddr.other || '',
        full_address: data.coCardAddr.addr_text || ''
      };
      var coAddr = {
        contract_id: $scope.contract_id,
        type:'COHOME',
        addr1: data.coAddr.addr1 || '',
        addr2: data.coAddr.addr2 || '',
        tambon: data.coAddr.tambon || '',
        amphur: data.coAddr.amphur || '',
        province: data.coAddr.province || '',
        zipcode: data.coAddr.zipcode || '',
        tel: data.coAddr.tel || '',
        other: data.coAddr.other || '',
        full_address: data.coAddr.addr_text || ''
      };
      var coWorkAddr = {
        contract_id: $scope.contract_id,
        type:'COWORK',
        addr1: data.coWorkAddr.addr1 || '',
        addr2: data.coWorkAddr.addr2 || '',
        tambon: data.coWorkAddr.tambon || '',
        amphur: data.coWorkAddr.amphur || '',
        province: data.coWorkAddr.province || '',
        zipcode: data.coWorkAddr.zipcode || '',
        tel: data.coWorkAddr.tel || '',
        other: data.coWorkAddr.other || '',
        full_address: data.coWorkAddr.addr_text || ''
      };
      return q.all([
        savePerson('cus_person_id', customerData),
        savePerson('co_person_id', coData),

        saveAddress('cus_card_addr_id', cardAddr),
        saveAddress('cus_addr_id', customerAddr),
        saveAddress('work_addr_id', workAddr),
        saveAddress('co_card_addr_id', coCardAddr),
        saveAddress('co_addr_id', coAddr),
        saveAddress('co_work_addr_id', coWorkAddr),

        savePayment()
      ]);
    }).then(updateContract)
      .then(updateSell)
      .then(function(){
        if (data.contract_ref != ''){
          return updateTotalPaid()
            .then(getContractUpdate)
            .then(updateAllPaymentTermContractRef)
            .then(updateStatusChange)
        }else{
          return true;
        }
      })
      .then(function() {
        if (flagSell == false){
          updateUsedBarcode();
        }
        //console.log('$scope=', $scope);
        return db.commit();
    }).then(function() {
      oraConn.close(oradb);
      res.send({
        status:true,
        id:$scope.contract_id,
        contract_code:contractCode
      });

    }).catch(function(e) {
      oraConn.close(oradb);
        db.rollback().then(function() {
          res.send({
            status:false,
            error:e
          });
        })
    });
  }).catch(function(e) {
    oraConn.close(oradb);
    res.send({
      status:false,
      error:e
    });
  });

  try {
    //console.log(req.body.cusPhoto);
    if (req.body.cusPhoto) {
      savePhotoData(req.body.data.customer.nationid, req.body.cusPhoto);
    }
    if (req.body.coPhoto) {
      savePhotoData(req.body.data.co.nationid, req.body.coPhoto);
    }
  } catch (e) {
    console.log('error', e);
  }
});

router.post('/getById', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {
    contract: null
  };
  var param = req.body;
  var getContract = function() {
    var sql = " SELECT sh.name shop_name,st1.display_name sell_staff_name ,st2.display_name finance_staff_name,c.* FROM contract c "
            + " left join staff st1 on c.sell_staff_id = st1.id"
            + " left join staff st2 on c.finance_staff_id = st2.id"
            + " left join shop sh on c.shop_id = sh.id"
            + " WHERE c.id = :id "
            + "AND c.is_active='YES'; ";
    return db.query(sql,  {id:param.id}).then(function(rows) {
      if (rows.length == 0) {
        return;
      }
      $scope.contract = rows[0];
    });
  };
  var getPaymentTerm = function() {
    var sql = "SELECT * FROM payment_term WHERE contract_id=:id AND is_active='YES' and status = 'ACTIVE' order by term_num asc";
    return db.query(sql, {id:param.id}).then(function(rows) {
      $scope.paymentTerm = rows;
    });
  };
  var getAddress = function() {
    var sql = "SELECT * FROM address WHERE contract_id=:id AND is_active='YES'";
    return db.query(sql, {id:param.id}).then(function(rows) {
      $scope.address = {};
      rows.forEach(function(row) {
        $scope.address[row.type] = row;
      });
    });
  };
  var getPerson = function() {
    var sql = "SELECT * FROM person "
      + "WHERE id IN (:customer, :co) AND is_active='YES'";
    return db.query(sql, {
      customer:$scope.contract.cus_person_id,
      co:$scope.contract.co_person_id
    }).then(function(rows) {
      console.log('rows=', rows);
      $scope.person = {};
      rows.forEach(function(row) {
        $scope.person[''+row.id] = row;
      });
    });
  };
  var getReferenceContract = function() {
    var sql = "SELECT c.id, c.code, c.current_status, "
      + "p1.fullname, p2.fullname co_fullname, "
      + "if(c.cus_person_id=:id, 'customer', 'co') role "
      + "FROM contract c "
      + "  JOIN person p1 ON c.cus_person_id=p1.id "
      + "  JOIN person p2 ON c.co_person_id=p2.id "
      + "WHERE cus_person_id = :id"
      + " OR co_person_id = :id";
    return db.query(sql, {
      id: $scope.contract.cus_person_id
    }).then(function(rows) {
      $scope.refContact = rows;
    });
  };
  var getCloseCA = function() {
    var sql = "select c.last_paid "
              + " , c.over_day "
              + " , s.display_name closeca_staffname,new_cost "
              + " from contract c "
              + " left join staff s on c.closeca_staff = s.id "
              + " where c.id = :id ";
    console.log('1111111111');
    return db.query(sql,  {id:param.id}).then(function(rows) {
      if (rows.length == 0) {
        return;
      }
      $scope.closeca = rows[0];
      console.log($scope.closeca);
    });
  };
  q.all([
    getContract().then(getPerson).then(getReferenceContract),
    getPaymentTerm(),
    getAddress(),
    getCloseCA()
  ]).then(function() {

    var contract = $scope.contract;
    contract.address = $scope.address || {};
    contract.customer = $scope.person[contract.cus_person_id] || {};
    contract.co = $scope.person[contract.co_person_id] || {};
    contract.closeca = $scope.closeca;
    res.send({
      status:true,
      contract: contract,
      refContract: $scope.refContact,
      paymentTerm: $scope.paymentTerm
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  })
});

router.post('/facetEdit', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};

  var getBranch = function() {
    return db.query("SELECT id AS value, concat(code, ' ', name) AS text FROM branch WHERE is_active='YES' ORDER BY code")
      .then(function(rows) {
        $scope.branch = rows;
      });
  }

  var getDepartment = function() {
    return db.query("SELECT id AS value, concat(code, ' ', name) AS text FROM department WHERE is_active='YES' ORDER BY code")
      .then(function(rows) {
        $scope.department = rows;
      });
  }

  q.all([
    getBranch(),
    getDepartment()
  ]).then(function() {
    res.send({
      status:true,
      data: {
        branch: $scope.branch,
        department: $scope.department
      }
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  })
});

router.post('/save', [bodyParser.json({limit: 10*1024*1024})], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var db = mysqlConn.connect();
    var $scope = {};
    var data = req.body;
  //  console.log('/save');
    console.log('/save',data.contract.customer);
    var getContract = function() {
      return db.query("SELECT * FROM contract WHERE id=:id", {id:data.contract.id}).then(function(rows) {
        if (rows.length==0) {
          throw 'NO CONTRACT FOUND';
        }
        $scope.contract = rows[0];
      });
    }

    var updateContract = function() {
      var flds = ('sign_date,cus_prename,cus_firstname,cus_lastname,'
        + 'cus_marital_status,cus_mobile,cus_email,'
        + 'cus_addr_owner,cus_addr_with,cus_addr_person,'
        + 'work_company,work_type,work_type_other,work_detail,'
        + 'work_department,work_position,work_time,work_year,'
        + 'work_salary,work_income,work_income_source,'
        + 'work_prev_company,work_prev_addr,work_prev_department,work_prev_tel,'
        + 'co_prename,co_firstname,co_lastname,co_mobile,co_email,'
        + 'co_work_company,co_work_detail,co_work_department,co_work_position,'
        + 'co_work_time,co_work_year,co_work_salary,co_work_income,'
        + 'co_work_income_source,doc_send_to,remark,fee,payment_month,payment_per_month,payment_on_day').split(',');
      data.contract.cus_prename         = data.contract.customer.prename;
      data.contract.cus_firstname       = data.contract.customer.firstname;
      data.contract.cus_lastname        = data.contract.customer.lastname;
      data.contract.cus_marital_status  = data.contract.customer.marital_status;
      data.contract.cus_mobile          = data.contract.cus_mobile;
      data.contract.cus_email           = data.contract.customer.email;
      data.contract.co_prename          = data.contract.co.prename;
      data.contract.co_firstname        = data.contract.co.firstname;
      data.contract.co_lastname         = data.contract.co.lastname;
      data.contract.co_mobile           = data.contract.co.mobile;
      data.contract.co_email            = data.contract.co.email;
      var tmp = mysqlConn.genUpdate('contract', flds, data.contract, $scope.contract);
      if (tmp===false) {
        console.log('CONTRACT: NOTHING TO UPDATE');
        return;
      }
      var sql = tmp.sql + ' WHERE id=:id';
      var param = tmp.param;
      param.id = data.contract.id;
    //  console.log('UPDATE CONTRACT=', sql);
      return db.query(sql, param).then(function(){
      //  console.log('updateContract /save success');
      });
    }

    var getPersons = function(ids) {
      if (ids.length==0) {
        return [];
      }
      ids = ids.map(function(id) {
        var n = parseInt(id);
        if (isNaN(n)) {
          throw 'INVALID NUMBER ('+id+')';
        }
        return n;
      });

      var sql = "SELECT * FROM person WHERE id IN (" + ids.join(',') + ")";
      return db.query(sql).then(function(rows) {
        $scope.persons = rows;
      //  console.log('getPersons /save success');
      });
    }

    var updatePerson = function(data, prevData) {
      var flds = ('nationid,prename,firstname,lastname,fullname,idcard_info,'
        + 'passport,passport_info,nation,birth,gender,marital_status,'
        + 'mobile,email,lineid').split(',');
      if (typeof data.idcard_info === 'object') {
        data.idcard_info = JSON.stringify(data.idcard_info);
      }
      if (typeof data.passport_info === 'object') {
        data.passport_info = JSON.stringify(data.passport_info);
      }
      var tmp = mysqlConn.genUpdate('person', flds, data, prevData);
      if (tmp === false) {
        return;
      }
      var sql = tmp.sql + ' WHERE id=:id';
      var param = tmp.param;
      param.id = data.id;
  //    console.log('UPDATE PERSON=', sql);
      return db.query(sql, param).then(function(){
      //  console.log('updatePerson /save success');
      });
    };

    var updatePersons = function() {
      return getPersons([$scope.contract.cus_person_id, $scope.contract.co_person_id]).then(function() {
        var all = [];
        $scope.persons.forEach(function(row) {
          var person =  (row.id === $scope.contract.cus_person_id) ?
              data.contract.customer : data.contract.co;
          all.push(updatePerson(person, row));
        });
        return q.all(all).then(function(){
      //    console.log('updatePersons /save success');
        });
      });
    }

    var getAddresses = function(ids) {
      if (ids.length == 0) {
        return [];
      }
      ids = ids.map(function(id) {
        var n = parseInt(id);
        if (isNaN(n)) {
          throw 'INVALID NUMBER ('+id+')';
        }
        return n;
      });
      var sql = "SELECT * FROM address WHERE id IN (" + ids.join(',') + ")";
    //  console.log('getAddresses query=',sql);
      return db.query(sql).then(function(rows) {
        $scope.addresses = rows;
    //    console.log('getAddresses /save success');
      });
    }

    var updateAddress = function(data, prevData) {
      var flds = 'addr1,addr2,tambon,amphur,province,zipcode,tel,other,fulladdress'.split(',');
  //    console.log(prevData);
      var tmp = mysqlConn.genUpdate('address', flds, data, prevData);
      if (tmp === false) {
  //      console.log('NO THING UPDATE', data);
        return true;
      }
      var sql = tmp.sql + ' WHERE id=:id';
      var param = tmp.param;
      param.id = data.id;
      // console.log(tmp);
      // console.log('UPDATE ADDRESS=', sql);
      return db.query(sql, param).then(function(){
    //      console.log('updateAddress /save success');
      });
    }

    var updateAddresses = function() {
      var ids = [$scope.contract.cus_addr_id, $scope.contract.cus_card_addr_id, $scope.contract.work_addr_id, $scope.contract.co_addr_id, $scope.contract.co_work_addr_id, $scope.contract.co_card_addr_id];
      return getAddresses(ids).then(function() {
        var all = [];
    //      console.log('scopeaddresses = ',$scope.addresses);
        $scope.addresses.forEach(function(row) {
          var addr;
          if (row.type==='HOME') {
            addr = data.contract.customerAddr;
  //          console.log(row.type);
          } else if (row.type === 'WORK') {
            addr = data.contract.workAddr;
      //      console.log(row.type);
          } else if (row.type === 'COHOME') {
            addr = data.contract.coAddr;
    //        console.log(row.type);
          } else if (row.type === 'COWORK'){
            addr = data.contract.coWorkAddr;
    //        console.log(row.type);
          } else if (row.type === 'CARD'){
            addr = data.contract.cardAddr;
      //      console.log(row.type);
          } else if (row.type === 'COCARD'){
            addr = data.contract.coCardAddr;
      //      console.log(row.type);
          }
          all.push(updateAddress(addr, row));
        });
        return q.all(all).then(function(){
      //      console.log('updateAddresses /save success');
        });
      });
    }

    var getPaymentTerms = function() {
      var sql = "SELECT id, term_num, due_date, due_amount FROM payment_term "
        + "WHERE contract_id=:contract_id "
        + "  AND term_status='WAIT' AND close_status='NORMAL'  order by term_num asc ";
      return db.query(sql, {contract_id: $scope.contract.id}).then(function(rows) {
        $scope.paymentTerms = rows;
//        console.log('getPaymentTerms /save success=',$scope.contract.id);
      });
    }

    var updatePaymentTerm = function(data, prevData) {
      if (prevData == undefined){
        return true;
      }
      var flds = 'due_date,due_amount'.split(',');
      var tmp = mysqlConn.genUpdate('payment_term', flds, data, prevData);
      if (tmp === false) {
        return;
      }
      var sql = tmp.sql + ' WHERE id=:id';
      var param = tmp.param;
      param.id = data.id;
//      console.log('prevData=',prevData);
  //    console.log('updatePaymentTerm id = ',data.id);
      return db.query(sql, param).then(function(){
  //      console.log('updatePaymentTerm /save success');
      });
    }

    var deletePaymentTerm = function() {
      var sql = "delete from payment_term where contract_id = :contract_id and sell_id =:sell_id "
      return db.query(sql, {contract_id:$scope.contract.id,sell_id:$scope.contract.sell_id}).then(function(){
  //      console.log('deletePaymentTerm /save success');
      });
    }

    var insertPaymentTerm = function(_cid,_tnum,_duedate,_dueamount,_sid,_costterm) {
      var sql = " insert into payment_term(contract_id,term_num,due_date,due_amount,sell_id,cost_term) "
              + " values(:contract_id, :term_num, :due_date, :due_amount, :sell_id, :cost_term) "
    //  console.log('insert = ',sql);
      return db.query(sql, {contract_id:_cid
                      ,term_num:_tnum
                      ,due_date:_duedate
                      ,due_amount:_dueamount
                      ,sell_id:_sid
                      ,cost_term:_costterm}).then(function(){
                        console.log('insertPaymentTerm /save success');
                      });
    }

    var updatePaymentTerms = function() {
      return req.body.genPaymentTerm == false ?
      getPaymentTerms().then(function() {
        var prevData = {};
        $scope.paymentTerms.forEach(function(term) {
          prevData[term.term_num] = term;
        });
        data.paymentTerm.forEach(function(term) {
          updatePaymentTerm(term, prevData[term.term_num]);
        });
      }) : deletePaymentTerm().then(function(){
            req.body.paymentTerm.forEach(function(term){
              insertPaymentTerm($scope.contract.id,term.term_num,term.due_date,term.due_amount,$scope.contract.sell_id,term.cost_term);
            });
      });
    }

    var updateCloseReturnContract = function() {
      var sql = "UPDATE contract SET current_status=:status, close_date=NOW() ,new_cost=:new_cost, profit_lost=:profit_loss,updated_by=:updated_by WHERE id=:id";

      return db.query(sql, {id: $scope.contract.id, status:data.return.return_status
        ,new_cost:data.contract.new_cost,profit_loss:data.contract.profit_loss,updated_by:req.session.data.staff.id}).then(function(){
        });
    }

    var updateStatusSell_Oracle = function() {
        console.log('updateStatusSell_Oracle');
      var sql = "UPDATE sell SET status='PASS' WHERE id=:id";
      return oraConn.query(oradb, sql, {id:data.contract.sell_id},false);
    }

    var updateStockShop_Oracle = function() {
      // console.log('updateStockShop_Oracle', data.stock_shop);
      // console.log('updateStockShop_Oracle2=', data.contract.new_cost);
      var sql = "UPDATE stock_shop SET cost_type='FIXED', status='OK', cost=:cost WHERE id=:id";
      return oraConn.query(oradb, sql, {id:data.stock_shop.id,cost:data.contract.new_cost},false);
    }

    var updateStockShopALL_Oracle = function() {
      var sql = "UPDATE stock_shop SET status='OK' WHERE ref_master = 'RETURN' and ref_id = :id";
      return oraConn.query(oradb, sql, {id:data.return.id},false);
    }

    var updateReturn_Oracle = function() {
      console.log('updateReturn_Oracle');
      var sql = "UPDATE returnx SET product_condition=:product_condition, remark=:remark, finance_used = 'Y' WHERE id=:id";

      return oraConn.query(oradb, sql, {id:data.return.id
        ,product_condition:data.return.product_condition
        ,remark:data.return.remark
          },false);
      }

    var insertHistoryLog_Oracle = function() {
        console.log('insertHistoryLog_Oracle');
      var sql = " insert into history_log(ID,system_date,system_staff,barcode,old_status,new_status,old_prod_id,new_prod_id,old_spec,new_spec " +
                " ,old_serial,new_serial,old_sup_id,new_sup_id,old_cost,new_cost,old_vat,new_vat) " +
                " values((HISTORY_ID.NEXTVAL),sysdate,'0',:barcode,:status,'OK',:product_id,:product_id,:spec,:spec " +
                " ,:serial,:serial,:company_id,:company_id,:cost,:new_cost,:vat,:vat) "

                  //console.log(data.stock_shop);
      return oraConn.query(oradb, sql,{
        barcode:data.stock_shop.barcode,
        status:data.stock_shop.status,
        product_id:data.stock_shop.product_id,
        spec:data.stock_shop.spec,
        serial:data.stock_shop.serial,
        company_id:data.stock_shop.company_id,
        cost:data.stock_shop.cost,
        new_cost:data.contract.new_cost,
        vat:data.stock_shop.vat
      },false);
    }

    getContract().then(function() {
      return db.beginTransaction();
    }).then(function() {
        var all = [
          updateContract(),
          updatePersons(),
          updateAddresses(),
          updatePaymentTerms()
        ]
        //console.log('flagclose=',data.flagClose);
        if (data.flagClose=='Y') {
          all.push(updateCloseReturnContract())
        }
        return q.all(all).then(function(){
      });
    }).then(function() {
      db.commit();
      if (data.flagClose == 'Y') {
        console.log('data.flagClose',data.flagClose);
        return q.all([
          updateStatusSell_Oracle(),
          updateStockShop_Oracle(),
          updateStockShopALL_Oracle(),
          updateReturn_Oracle(),
          insertHistoryLog_Oracle()
        ]).then(function(){
          return oradb.commit(function(){

          });
        });
      }
    }).catch(function(e) {
      console.log('aaaaaaaaaaaa');
      console.log('error=', e);
      oraConn.close(oradb);
      db.rollback();
      res.send({
        status:false,
        error:e
      });
    }).then(function() {
      oraConn.close(oradb);
      res.send({
        status:true
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      console.log('error2', e);
      res.send({
        status:false,
        error:e
      });
    });
  }).catch(function(e) {
    oraConn.close(oradb);
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/list', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid, st.display_name  finance  "
    + ", c.balance, c.over_day "
    + ", c.amount_term "
    + ", c.last_paid "
    + "FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "  LEFT JOIN staff st on c.finance_staff_id=st.id "
    + "WHERE c.is_active='YES' ";

    // + ", c.balance,(select DATEDIFF(now(),min(due_date)) from payment_term  where contract_id = c.id and term_status in ('OVERDUE','OVERDUE_PARTIAL')) over_day "
    // + ", (select count(id) from payment_term where contract_id = c.id and term_status in ('OVERDUE','OVERDUE_PARTIAL')) amount_term "
    // + ", (select max(paid_date)  from payment_term where contract_id =  c.id) last_paid "

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
    if (fld=='current_status' && keyword=='ALL') {
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

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM contract c WHERE c.is_active='YES' ";
    if (hasJoin) {
      sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x';
    } else if (cond.length > 0) {
      sql += ' AND ' + cond.join(' AND ');
    }
    return db.query(sql, {}).then(function(rows) {
      if (rows.length==0) {
        $scope.totalRows = 0;
      } else {
        $scope.totalRows = rows[0].cnt;
      }
    });
  }

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

    if(sortBy == 'over_day' || sortBy == 'amount_term' || sortBy == 'last_paid' ){
        sortBy = sortBy;
    }else if (sortBy == 'finance'){
        sortBy = 'st.`' + sortBy + '`';
    }else{
        sortBy = 'c.`' + sortBy + '`';
    }

var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;

    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
    });
  }

  var getPaymentTerm = function() {
    if ($scope.rows.d.length==0) {
      console.log('NO PAYMENTS');
      return;
      for (var i in $scope.rows.d) {
        $scope.rows.d[i].push([]);
      }
      $scope.rows.f.push('payments');
      return;
    }
    var ids = $scope.rows.d.map(function(row) {
      return row[0];
    });
    var sql = "SELECT contract_id, term_num, due_date, due_amount, "
      + "paid_date, paid_amount, term_status, close_status, remark "
      + "FROM payment_term WHERE is_active='YES' "
      + "AND contract_id IN (" + ids.join(',') + ") "
      + "AND due_date >= :date_from AND due_date < :date_to "
      + "ORDER BY contract_id, term_num";
    var today = new Date(req.body.keywords.today);
    var from_date = new Date(today.getFullYear(), today.getMonth()-9, 1, 0, 0, 0);
    var to_date = new Date(today.getFullYear(), today.getMonth()+3, 1, 0, 0, 0);
    return db.query(sql, {
      date_from:helper.dateToString(from_date),
      date_to:helper.dateToString(to_date)
    }).then(function(rows) {
      var payments = {};
      rows.forEach(function(row) {
        if (!payments[''+row.contract_id]) {
          payments[''+row.contract_id] = [];
        }
        payments[''+row.contract_id].push(row);
      });
//      console.log(payments);
      for (var i in $scope.rows.d) {
//        console.log('id=', $scope.rows.d[i][0]);
        $scope.rows.d[i].push(payments[''+$scope.rows.d[i][0]] || []);
//        console.log($scope.rows.d[i]);
      }
      $scope.rows.f.push('payments');
    });
  }
  q.all([
    getCount(),
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
      return getPaymentTerm().then(function() {
        console.log('ok');
//        console.log($scope.rows);
        res.send({
          status: true,
          data: $scope.rows,
          opt: $scope.opt
        });
      }, function(e) {
        console.log('EEEEEE', e);
      });
    }
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});


router.post('/export', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  // var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
  //   + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
  //   + ", c.product_detail, c.product_serial"
  //   + ", c.payment_price, c.total_paid "
  //   + ", c.balance , (select DATEDIFF(now(),min(due_date)) from payment_term  where contract_id = c.id and term_status in ('OVERDUE','OVERDUE_PARTIAL')) over_day "
  //   + "FROM contract c "
  //   + "  LEFT JOIN shop s on c.shop_id=s.id "
  //   + "WHERE c.is_active='YES' ";

  var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
    + " c.code, p1.nationid cus_nation , CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name "
    + " , c.cus_mobile, a1.full_address cus_address "
    + " , p2.nationid co_nation , CONCAT(c.co_firstname, ' ', c.co_lastname) co_name "
    + " , c.co_mobile, a2.full_address co_address "
    + " , c.product_detail, c.product_serial "
    + " , st.display_name  finance, st2.display_name  sell_staff   "
    + " , c.total_price, c.total_paid, c.balance , c.cost , c.install_cost,c.fee "
    + " , case when c.current_status = 'NORMAL' then 'ปกติ' "
    + "   when c.current_status = 'DEBT' then 'ค้างชำระ' "
    + "   when c.current_status = 'CLOSE_NORMAL' then 'ปิดปกติ' "
    + "   when c.current_status = 'CLOSE_CHANGE' then 'ปิดเปลี่ยนของ' "
    + "   when c.current_status = 'CLOSE_CONFISCATE' then 'ปิดยึด' "
    + "   when c.current_status = 'CLOSE_BAD_DEBT' then 'ปิดหนีหนี้' "
    + " else 'ปิดยกเลิก' end current_status "
    + " , case when close_date = '0000-00-00' then null else close_date end closeDate "
    + " FROM contract c  "
    + "  LEFT JOIN shop s on c.shop_id=s.id  "
    + "  LEFT JOIN staff st on c.finance_staff_id=st.id  "
    + "  LEFT JOIN staff st2 on c.sell_staff_id=st2.id  "
    + "  left join address a1 on a1.id = c.cus_card_addr_id "
    + "  left join address a2 on a2.id = c.co_card_addr_id "
    + "  left join person p1 on c.cus_person_id = p1.id "
    + "  left join person p2 on c.co_person_id = p2.id "
    + "WHERE c.is_active='YES' ";

    // + ", (select count(id) from payment_term where contract_id = c.id and term_status in ('OVERDUE','OVERDUE_PARTIAL')) amount_term "
    // + ", (select max(paid_date)  from payment_term where contract_id =  c.id) last_paid "

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

    if (contractFields[fld].name==='c.current_status' && keyword ==='ALL'){
        tmp = '';
    }

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

  //console.log(mainQuery);

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

    if(sortBy == 'over_day' || sortBy == 'amount_term' || sortBy == 'last_paid' ){
        sortBy = sortBy;
    }else if (sortBy == 'finance'){
        sortBy = 'st.`' + sortBy + '`';
    }else{
        sortBy = 'c.`' + sortBy + '`';
    }

var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir;

    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
      $scope.rows.f = rows.f.map(function(item){
          var change = { 'id': 'ลำดับ',
                        'sign_date':'วันที่ขาย',
                        'shop_name':'สาขา',
                        'shop_code':'รหัสสาขา',
                        'code':'เลขที่สัญญา',
                        'cus_name':'ชื่อลูกค้า',
                        'cus_mobile':'เบอร์โทรลูกค้า',
                        'cus_address':'ที่อยู่ลูกค้า',
                        'product_detail':'สินค้า',
                        'product_serial':'Serial',
                        'total_price':'ราคาขาย',
                        'total_paid':'ชำระแล้ว',
                        'finance':'ไฟแนนซ์',
                        'balance':'ยอดค้างชำระ',
                        'co_name':'ชื่อผู้ค้ำ',
                        'co_mobile':'เบอร์โทรผู้ค้ำ',
                        'co_address':'ที่อยผู้ค้ำ',
                        'sell_staff':'คนขาย',
                        'current_status':'สถานะ',
                        'cus_nation':'เลขบัตรประชาชนผู้เช่าซื้อ',
                        'co_nation':'เลขบัตรประชาชนผู้ค้ำ',
                        'cost':'ทุนสินค้า',
                        'install_cost':'ทุนติดตั้ง',
                        'fee':'ค่าเปิดสัญญา',
                        'closeDate':'วันที่ปิดสัญญา'
          }
          return change[item];
      });

    });
  }

  getRows().then(function() {

    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListContract", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/contract_list_'+id+'.xlsx';
    fs.writeFileSync(path.normalize(__dirname + '/../../../public'+fname), buffer);
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

router.post('/listClose', [bodyParser.json()], function(req, res) {

  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "s.id, r.return_date, s.mysql_contract_code,sh.name, aa.description ,s.contract_id, r.return_status, aa.serial, c.name cus_name, s.sell_date" ;

    var mainQuery = " select %FIELD_LIST% " +
                    " from returnx r inner join sell s on r.sell_id = s.id " +
                    " inner join shop sh on sh.id = r.shop_id" +
                    " inner join company c on c.id = s.company_id " +
                    " inner join ( " +
                    " select p.description,rd.return_id,rd.serial from returnx_detail rd inner join product p " +
                    " on rd.product_id = p.id " +
                    " where rd.id in ( " +
                    " select min(id) id from returnx_detail group by return_id) )aa on aa.return_id = r.id " +
                    " where s.contract_id > 0 and s.status='DEBIT' and r.return_status = 'CLOSE_CONFISCATE' and r.finance_used = 'N' "
                    //" where s.contract_id > 0 and s.status='DEBIT' and finance_used = 'N' and r.return_status = 'CLOSE_CONFISCATE' "

    var cond = [];
    var hasJoin = false;
    console.log(req.body.keywords);
    for(var fld in req.body.keywords) {
      var keyword = req.body.keywords[fld];
      if (typeof keyword === 'undefined') {
        continue;
      }
      keyword = keyword.trim();
      if (keyword == '') {
        continue;
      }
      if (typeof fieldsClose[fld]==='undefined') {
        continue;
      }
      var tmp = helper.genCond(fieldsClose[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);
    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }

    var getCount = function() {

        sql = 'SELECT COUNT(*) AS cnt FROM ('
          + mainQuery.replace('%FIELD_LIST%', '1') + ') x';

    //  console.log('COUNT QUERY:', sql);

      return oraConn.query(oradb, sql, {}).then(function(result) {
        if (result.rows.length==0) {
          $scope.totalRows = 0;
        } else {
          $scope.totalRows = result.rows[0][0];
        }
      });
    }

    var getRows = function() {
      var sortBy = req.body.sortBy || 'return_date';
      var sortDir = req.body.sortDir || 'DESC';
      var limit = req.body.limit || 50;
      var page = parseInt(req.body.page || 0);
      var sql;
      var sortBy2;

      $scope.opt = {
        sortBy: sortBy,
        sortDir: sortDir,
        limit: limit,
        page: page,
        totalRows: 0
      };

      // if (fields[sortBy]) {
      //   sortBy2 = fields[sortBy];
      // } else {
      sortBy2 = "r.return_date";
      //}
      sql = "SELECT * FROM (SELECT rank() OVER (ORDER BY " + sortBy2 + " " + sortDir+") rnk, "
        + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
        + ") x WHERE rnk BETWEEN " + (page*limit+1) + " AND " + ((page+1)*limit)
        + " ORDER BY " + sortBy + " " + sortDir;

      //console.log('test:', sql);

      return oraConn.query(oradb, sql, {}).then(function(result) {
//        $scope.rows = oraConn.convert(result);
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      });
    }
    // MAIN QUERY
    q.all([
      getCount(),
      getRows()
    ]).then(function() {
      $scope.opt.totalRows = $scope.totalRows;
      oraConn.close(oradb);
      res.send({
        status: true,
        data: $scope.rows,
        opt: $scope.opt
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      res.send({
        status: false,
        error: e
      });
    });
  }).catch(function(e) {
    oraConn.close(oradb);
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/exportClose', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "s.id, r.return_date, s.mysql_contract_code,sh.name, aa.description ,s.contract_id, r.return_status, aa.serial, c.name cus_name"

    var mainQuery = " select %FIELD_LIST% " +
                    " from returnx r inner join sell s on r.sell_id = s.id " +
                    " inner join shop sh on sh.id = r.shop_id" +
                    " inner join company c on c.id = s.company_id " +
                    " inner join ( " +
                    " select p.description,rd.return_id,rd.serial from returnx_detail rd inner join product p " +
                    " on rd.product_id = p.id " +
                    " where rd.id in ( " +
                    " select min(id) id from returnx_detail group by return_id) )aa on aa.return_id = r.id " +
                    " where s.contract_id > 0 and s.status='DEBIT' and r.return_status = 'CLOSE_CONFISCATE' and r.finance_used = 'N' "

    var cond = [];
    var hasJoin = false;
    for (var fld in req.body.keywords) {
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
      var tmp = helper.genCond(fields[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);

    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }

    var getRows = function() {
      var sortBy = req.body.sortBy || 'return_date';
      var sortDir = req.body.sortDir || 'DESC';
      var limit = req.body.limit || 50;
      var page = parseInt(req.body.page || 0);
      var sql;
      var sortBy2;

      $scope.opt = {
        sortBy: sortBy,
        sortDir: sortDir,
        limit: limit,
        page: page,
        totalRows: 0
      };

      sortBy2 = "r.return_date";

      sql = mainQuery.replace('%FIELD_LIST%', fldList);
//      sql += ' AND rownum <= 100';
      console.log('SQL=', sql);
      return oraConn.query(oradb, sql, {}).then(function(result) {
        console.log('GET OK');
        $scope.result = result;
      }).catch(function(e) {
        console.log('ERROR=', e);
      });
    }

    // MAIN QUERY
    getRows().then(function() {
      var header = $scope.result.metaData.map(function(col) {
        return col.name.toLowerCase();
      });
      var rows = $scope.result.rows;
      rows.unshift(header);
      var buffer = xlsx.build([{name: "ListClose", data: rows}]);
      var id = helper.newUUID();
      var fname = '/output/contract_close_'+id+'.xlsx';
      fs.writeFileSync(path.normalize(__dirname + '/../../../public'+fname), buffer);
      oraConn.close(oradb);
      res.send({
        status:true,
        file: fname
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      res.send({
        status: false,
        error: e
      });
    });
  }).catch(function(e) {
    oraConn.close(oradb);
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/getCloseReturn', [bodyParser.json()], function(req, res) {

  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var getReturn = function() {

      var sql = " select r.id,to_char(r.return_date,'YYYY-MM-DD') return_date, r.product_condition, r.remark , r.return_status ,aa.serial product_serial " +
                " from returnx r" +
                " inner join (  " +
  	            " select rd.return_id,rd.serial from returnx_detail rd inner join product p   " +
                " on rd.product_id = p.id   " +
                " where rd.id in (   " +
                " select min(id) id from returnx_detail group by return_id)   " +
                " )aa on aa.return_id = r.id  " +
                " where r.sell_id = :id ";
                //and return_status = 'CLOSE_RETURN'
                //console.log('COUNT QUERY:', sql);

      return oraConn.query(oradb, sql, {id:req.body.sell_id}).then(function(result) {

        $scope.rowsReturn = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
        $scope.return_id = oraConn.convert(result)[0];
        //console.log($scope.return_id.id);
      });
    }

    var getReturnDetail = function(){
      // var sql = " select ROWNUM ,p.description product,rd.serial " +
      //           " ,rd.cost newcost, 0.00 oldcost ,rd.barcode" +
      //           " from returnx_detail rd " +
      //           " inner join product p on rd.product_id = p.id " +
      //           " where rd.return_id = :id order by newcost desc ";

      var sql = " select ROWNUM,product,serial  " +
                " ,newcost,oldcost ,barcode " +
                " from ( " +
                " select p.description product,rd.serial  " +
                "  ,rd.cost newcost, 0.00 oldcost ,rd.barcode " +
                "  from returnx_detail rd  " +
                "  inner join product p on rd.product_id = p.id  " +
                "  where rd.return_id = :id order by newcost desc)aa "

    //  console.log('COUNT QUERY:', sql);
      return oraConn.query(oradb, sql, {id:$scope.return_id.id}).then(function(result) {

        $scope.rowsReturnDetail = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
        $scope.return_detail = oraConn.convert(result)[0];
      });
    }

    var getStockShop = function(){

      console.log('refid=',$scope.return_id.id);
      console.log('barcode=',$scope.return_detail.barcode);

      var sql = " select * from stock_shop where ref_id = :id and ref_master = 'RETURN' " +
                " and barcode = :barcode"

      return oraConn.query(oradb, sql, {id:$scope.return_id.id,barcode:$scope.return_detail.barcode}).then(function(result) {

        $scope.rowsStockShop = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      });
    }

    // MAIN QUERY
    getReturn().then(getReturnDetail).then(getStockShop).then(function() {
      console.log('success');
      //console.log($scope.rowsReturnDetail);
      oraConn.close(oradb);
      res.send({
        status:true,
        data: {
          return: $scope.rowsReturn,
          return_detail: $scope.rowsReturnDetail,
          stock_shop: $scope.rowsStockShop
        }
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      console.log('error1', e);
      res.send({
        status:false,
        error:e
      });
    });
  }).catch(function(e) {
    oraConn.close(oradb);
    console.log('error2', e);
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/getMobileNumber', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = mysqlConn.connect();
  console.log(req.body);
  var getMobileNumber = function() {

    var sql = "";
    if(req.body.type == 'โทรหาผู้ซื้อ'){
      sql = " select c.cus_mobile number, p.fullname from contract c "
            + " inner join person p on c.cus_person_id = p.id  "
            + " where c.id = :id ";
    }else if (req.body.type == 'โทรหาผู้ซื้ออื่น ๆ'){
      sql = " select c.cus_mobile number, p.fullname from contract c "
            + " left join address ad on ad.id = c.cus_addr_id  "
            + " inner join person p on c.cus_person_id = p.id  "
            + " where c.id = :id ";
    }else if (req.body.type == 'โทรหาผู้ค้ำ'){
      sql = " select c.co_mobile number, p.fullname from contract c "
            + " inner join person p on c.co_person_id = p.id  "
            + " where c.id = :id ";
    }else{
      sql = " select c.co_mobile number, p.fullname from contract c "
            + " left join address ad on ad.id = c.co_addr_id  "
            + " inner join person p on c.co_person_id = p.id  "
            + " where c.id = :id ";
    }

    return db.query(sql,{id:req.body.id}).then(function(rows) {
      $scope.mobileNumber = rows;
    });
  };

  var all = [
    getMobileNumber()
  ];
  q.all(all).then(function() {
    res.send({
      status: true,
      data: {
        mobilenumber: $scope.mobileNumber
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/getListCollection', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = mysqlConn.connect();

  var getListCollection = function() {
    var sql = " select co.system_date,co.due_date,co.call_type,co.call_number,co.call_remark,s.display_name "
              + " from collection co "
              + " inner join contract c on co.contract_id = c.id "
              + " inner join staff s on co.staff_id = s.id "
              + " where c.id = :id ";

    return db.query(sql,{id:req.body.id}).then(function(rows) {
      $scope.collection = rows;
    });
  };

  var all = [
    getListCollection()
  ];
  q.all(all).then(function() {
    res.send({
      status: true,
      data: {
        collection: $scope.collection
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/saveCollection', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = mysqlConn.connect();
  console.log('insert collection');
  var saveCollection = function(id, addrData) {
    var sql = " insert into collection(due_date,contract_id,call_type,call_number,call_remark,staff_id) "
              + " values(:due_date,:contract_id,:call_type,:call_number,:call_remark,:staff_id) ";
    return db.query(sql, req.body);
  }

  var all = [
    saveCollection()
  ];
  q.all(all).then(function() {
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

router.post('/printCollectionReport', [bodyParser.json()], function(req, res) {

  var $scope = {};
  var db = mysqlConn.connect();

  var toThaiDate = function(date, short) {
    if (date=='0000-00-00' || date=='') {
      return {dd:'', mm:'', yy:''};
    }
    try {
      var d = new Date(date);
    } catch (e) {
      return {dd:'', mm:'', yy:''};
    }
    var thMonthShort = [
      'ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'
    ];
    var thMonthLong = [
      'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'
    ];

    return {
      dd: ''+d.getDate(),
      mm: short ? thMonthShort[d.getMonth()] : thMonthLong[d.getMonth()],
      yy: ''+(d.getFullYear()+543)
    };
  }

  var getData = function() {
    var sql = " ";

    var staff_name = req.session.data.staff.display_name;
    if (req.body.sendto == '1'){
      sql = " select replace(c.code,'|','') code,NOW() today,p1.fullname, concat('เลขที่ ',ad1.addr1,' ',ad1.addr2) add1_to  "
            + " ,concat('ตำบล/แขวง ',case when instr(ad1.tambon,'ตำบล') > 0 then replace(ad1.tambon,'ตำบล','') "
            + " else "
            + "   case when instr(ad1.tambon,'แขวง') > 0 then replace(ad1.tambon,'แขวง','') "
            + "   else ad1.tambon end "
            + " end )	 add2_to "
            + " ,concat('อำเภอ/เขต ', case when instr(ad1.amphur,'อำเภอ') > 0 then replace(ad1.amphur,'อำเภอ','') "
            + " else "
            + "   case when instr(ad1.amphur,'เขต') > 0 then replace(ad1.amphur,'เขต','') "
            + "   else ad1.amphur end "
            + " end ) add3_to "
            + " ,concat('จังหวัด', case when instr(ad1.province,'จังหวัด') > 0 then replace(ad1.province,'จังหวัด','') "
            + " else						 "
            + "   ad1.province "
            + " end, ' ', ad1.zipcode )  add4_to  , '"+ staff_name.split(" ")[0] +"' staff_name "
                + " ,concat(ad1.tambon,' ',ad1.amphur) add2_to2  "
                + " ,concat(ad1.province,' ',ad1.zipcode) add3_to3 "
                + " ,sh.name shop_name  "
                + " ,c.sign_date, c.product_detail product_name  "
                + " ,p1.fullname fullname_to   "
                + " ,xx.term_date term_date, format(xx.amount,2) amount  "
                + " from contract c  "
                + " left join address ad1 on c.cus_card_addr_id = ad1.id  "
                + " inner join shop sh on c.shop_id = sh.id  "
                + " inner join person p1 on c.cus_person_id = p1.id  "
                + " inner join (  "
  	               + " select min(due_date) term_date, sum(due_amount - paid_amount) amount,contract_id from payment_term   "
  	               + " where contract_id = :id and term_status in ('OVERDUE','OVERDUE_PARTIAL')  "
                + " )xx on xx.contract_id = c.id  "
                + " where c.id = :id "
    }else{
      sql = " select replace(c.code,'|','') code,NOW() today,p1.fullname, concat('เลขที่ ',ad1.addr1,' ',ad1.addr2) add1  "
                + " ,concat(ad1.tambon,' ',ad1.amphur) add2  "
                + " ,concat(ad1.province,' ',ad1.zipcode) add3  "
                + " ,sh.name shop_name  "
                + " ,c.sign_date, c.product_detail product_name  "
                + " ,p2.fullname fullname_to, concat(ad2.addr1,' ',ad2.addr2) add1_to   "
                + " ,concat('ตำบล/แขวง ',case when instr(ad2.tambon,'ตำบล') > 0 then replace(ad2.tambon,'ตำบล','') "
                + " else "
                + "   case when instr(ad2.tambon,'แขวง') > 0 then replace(ad2.tambon,'แขวง','') "
                + "   else ad2.tambon end "
                + " end )	 add2_to "
                + " ,concat('อำเภอ/เขต ', case when instr(ad2.amphur,'อำเภอ') > 0 then replace(ad2.amphur,'อำเภอ','') "
                + " else "
                + "   case when instr(ad2.amphur,'เขต') > 0 then replace(ad2.amphur,'เขต','') "
                + "   else ad2.amphur end "
                + " end ) add3_to "
                + " ,concat('จังหวัด', case when instr(ad2.province,'จังหวัด') > 0 then replace(ad2.province,'จังหวัด','') "
                + " else						 "
                + "   ad2.province "
                + " end, ' ', ad2.zipcode )  add4_to , '"+ staff_name +"' staff_name "
                + " ,concat(ad2.tambon,' ',ad2.amphur) add2_to2  "
                + " ,concat(ad2.province,' ',ad2.zipcode) add3_to2 ,xx.term_date term_date, format(xx.amount,2) amount   "
                + " from contract c  "
                + " left join address ad1 on c.cus_card_addr_id = ad1.id  "
                + " left join address ad2 on c.co_card_addr_id = ad2.id  "
                + " inner join shop sh on c.shop_id = sh.id  "
                + " inner join person p1 on c.cus_person_id = p1.id  "
                + " inner join person p2 on c.co_person_id = p2.id  "
                + " inner join (  "
                   + " select min(due_date) term_date, sum(due_amount - paid_amount) amount,contract_id from payment_term   "
                   + " where contract_id = :id and term_status in ('OVERDUE','OVERDUE_PARTIAL')  "
                + " )xx on xx.contract_id = c.id  "
                + " where c.id = :id "
    }


    return db.query(sql,{id:req.body.id}).then(function(rows) {

      if (rows.length===0) {
        throw 'contract.error.report_collection';
      }
      $scope.collectionreport=rows;

      $scope.collectionreport=[];

      rows.forEach(function(row){

        var _today = toThaiDate(row.today, false);
        var _sign_date = toThaiDate(row.sign_date, false);
        var _term_date = toThaiDate(row.term_date, false);

        row.today = _today.dd +' '+ _today.mm +' '+ _today.yy;
        row.sign_date =  _sign_date.dd +' '+ _sign_date.mm +' '+ _sign_date.yy;
        row.term_date =  _term_date.dd +' '+ _term_date.mm +' '+ _term_date.yy;
        $scope.collectionreport.push(row);
      });


    });
  };

  var renderReport = function() {
    var dfd = q.defer();
    $scope.pdfFile = 'collection_'+ helper.newUUID() + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../../public/output/' + $scope.pdfFile);

    console.log(pdfFullPath);
    var report  = new nsReport();
    console.log($scope.collectionreport);
    //console.log('jack=111');
    var doc = report.createDocument(require('./reports/collection.js'), $scope.collectionreport);
    console.log('jack=111');
    var stream = fs.createWriteStream(pdfFullPath);
    doc.pipe(stream);
    doc.end();
    stream.on('finish', function() {
      console.log('success');
      dfd.resolve();
    });
    stream.on('error', function() {
        console.log('fail');
      dfd.reject();
    });
    return dfd.promise;
  }
  getData().then(renderReport).then(function() {
    res.send({
      status:true,
      data: {
        pdfFile: '/output/' + $scope.pdfFile
      }
    })
  }).catch(function(e) {
    console.log(e);
    res.send({
      status:false,
      error:e
    })
  });
});

router.post('/exportDunning', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};

  var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name, c.cus_mobile "
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid  "
    + ", c.balance, st.display_name  finance, st2.display_name  sell_staff, c.over_day "
    + ", c.amount_term "
    + ", c.last_paid "
    + ", c.over_due_amount "
    + "FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "  LEFT JOIN staff st on c.finance_staff_id=st.id "
    + "  LEFT JOIN staff st2 on c.sell_staff_id=st2.id "
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

    if (contractFields[fld].name==='c.current_status' && keyword ==='ALL'){
        tmp = '';
    }

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

  //console.log(mainQuery);

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

    if(sortBy == 'over_day' || sortBy == 'amount_term' || sortBy == 'last_paid' ){
        sortBy = sortBy;
    }else if (sortBy == 'finance'){
        sortBy = 'st.`' + sortBy + '`';
    }else{
        sortBy = 'c.`' + sortBy + '`';
    }

var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir;

      console.log(sql);

    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
      $scope.rows.f = rows.f.map(function(item){
          var change = { 'id': 'ลำดับ',
                        'sign_date':'วันที่ขาย',
                        'shop_name':'สาขา',
                        'shop_code':'รหัสสาขา',
                        'code':'เลขที่สัญญา',
                        'cus_name':'ชื่อลูกค้า',
                        'cus_mobile':'เบอร์โทรลูกค้า',
                        'product_detail':'สินค้า',
                        'product_serial':'Serial',
                        'total_price':'ราคาขาย',
                        'payment_price':'ยอดจัด',
                        'total_paid':'ชำระแล้ว',
                        'balance':'ยอดค้างชำระ',
                        'sell_staff':'พนักงานขาย',
                        'finance':'ไฟแนนซ์',
                        'over_day':'จำนวนวันที่เกินกำหนด',
                        'amount_term':'จำนวนงวดที่เกินกำหนด',
                        'last_paid':'วันที่ชำระล่าสุด',
                        'over_due_amount' :'จำนวนเงินที่ค้าง'
          }
          return change[item];
      });
    });
  }

  getRows().then(function() {

    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListContractDinning", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/contract_list_dinning_'+id+'.xlsx';
    fs.writeFileSync(path.normalize(__dirname + '/../../../public'+fname), buffer);
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

router.post('/listClosediscount', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid, st.display_name  finance  "
    + ", c.balance "
    + ", c.balance discount "
    + ", '0000-00-00' last_paid "
    + ", c.cus_mobile "
    + "FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "  LEFT JOIN staff st on c.finance_staff_id=st.id "
    + "WHERE c.is_active='YES' and c.status_discount = 'Y' and c.current_status in ('NORMAL','DEBT')  ";

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
    if (fld=='current_status' && keyword=='ALL') {
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

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM contract c WHERE c.is_active='YES' and c.status_discount = 'Y' and c.current_status in ('NORMAL','DEPT')  ";
    if (hasJoin) {
      sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x';
    } else if (cond.length > 0) {
      sql += ' AND ' + cond.join(' AND ');
    }
    return db.query(sql, {}).then(function(rows) {
      if (rows.length==0) {
        $scope.totalRows = 0;
      } else {
        $scope.totalRows = rows[0].cnt;
      }
    });
  }

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

    if(sortBy == 'over_day' || sortBy == 'amount_term' || sortBy == 'last_paid' || sortBy == 'discount' ){
        sortBy = sortBy;
    }else if (sortBy == 'finance'){
        sortBy = 'st.`' + sortBy + '`';
    }else{
        sortBy = 'c.`' + sortBy + '`';
    }

var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;

    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
    });
  }

  var getPaymentTerm = function() {
    if ($scope.rows.d.length==0) {
      console.log('NO PAYMENTS');
      return;
      for (var i in $scope.rows.d) {
        $scope.rows.d[i].push([]);
      }
      $scope.rows.f.push('payments');
      return;
    }
    var ids = $scope.rows.d.map(function(row) {
      return row[0];
    });
    var sql = "SELECT contract_id, term_num, due_date, due_amount, "
      + "paid_date, paid_amount, term_status, close_status, remark "
      + "FROM payment_term WHERE is_active='YES' "
      + "AND contract_id IN (" + ids.join(',') + ") "
      + "AND due_date >= :date_from AND due_date < :date_to "
      + "ORDER BY contract_id, term_num";
    var today = new Date(req.body.keywords.today);
    var from_date = new Date(today.getFullYear(), today.getMonth()-9, 1, 0, 0, 0);
    var to_date = new Date(today.getFullYear(), today.getMonth()+3, 1, 0, 0, 0);
    return db.query(sql, {
      date_from:helper.dateToString(from_date),
      date_to:helper.dateToString(to_date)
    }).then(function(rows) {
      var payments = {};
      rows.forEach(function(row) {
        if (!payments[''+row.contract_id]) {
          payments[''+row.contract_id] = [];
        }
        payments[''+row.contract_id].push(row);
      });
  //      console.log(payments);
      for (var i in $scope.rows.d) {
  //        console.log('id=', $scope.rows.d[i][0]);
        $scope.rows.d[i].push(payments[''+$scope.rows.d[i][0]] || []);
  //        console.log($scope.rows.d[i]);
      }
      $scope.rows.f.push('payments');
    });
  }

  q.all([
    getCount(),
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
      return getPaymentTerm().then(function() {
        res.send({
          status: true,
          data: $scope.rows,
          opt: $scope.opt
        });
      }, function(e) {
        console.log('EEEEEE', e);
      });
    }
  }).catch(function(e) {
    console.log(e);
    res.send({
      status: false,
      error: e
    });
  });
});


router.post('/exportClosediscount', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};

  var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid, st.display_name  finance  "
    + ", c.balance "
    + ", c.balanc discount "
    + ", '0000-00-00' last_paid "
    + ", c.cus_mobile "
    + "FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "  LEFT JOIN staff st on c.finance_staff_id=st.id "
    + "WHERE c.is_active='YES' and c.status_discount = 'Y' and c.current_status in ('NORMAL','DEPT')  ";

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

    if (contractFields[fld].name==='c.current_status' && keyword ==='ALL'){
        tmp = '';
    }

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

  //console.log(mainQuery);

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

    if(sortBy == 'over_day' || sortBy == 'amount_term' || sortBy == 'last_paid' ){
        sortBy = sortBy;
    }else if (sortBy == 'finance'){
        sortBy = 'st.`' + sortBy + '`';
    }else{
        sortBy = 'c.`' + sortBy + '`';
    }

var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir;

    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
    });
  }

  getRows().then(function() {

    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListContract_CloseDiscount", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/contract_closediscount_'+id+'.xlsx';
    fs.writeFileSync(path.normalize(__dirname + '/../../../public'+fname), buffer);
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

router.post('/saveClosediscount', [bodyParser.json()], function(req, res) {
    var db = mysqlConn.connect();
    var $scope = {};

    console.log(req.body.id);

    var updateCloseDiscount = function() {
      var sql = " UPDATE contract SET discount=balance, balance=0, current_status='CLOSE_NORMAL', close_date = NOW() "
                + " WHERE id=:id ";

      console.log(sql);

      return db.query(sql, {id:req.body.id});
    }

    db.beginTransaction()
      .then(updateCloseDiscount)
      .then(function(){
        db.commit();
        res.send({
          status:true
        });
      }).catch(function(e) {
        console.log('rollback', e);
        db.rollback(function(e) {
          res.send({
            status:false,
            error:e
          });
        });
      });
});

router.post('/closeCaStaffList', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = mysqlConn.connect();
  console.log(req.body.shop_id);
  var getStaff = function() {
    var sql = "select s.id, s.display_name name from staff s "
            + " inner join contract c on c.shop_id = s.shop_id"
            + " where c.id = :id ";
    return db.query(sql,{id:req.body.id}).then(function(rows) {
      $scope.closecastaff = rows;
    });
  };

  var all = [
    getStaff()
  ];
  q.all(all).then(function() {
    res.send({
      status: true,
      data: {
        closecastaff: $scope.closecastaff
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });

});

router.post('/saveCloseCa', [bodyParser.json()], function(req, res) {
    var db = mysqlConn.connect();
    var $scope = {};

    var updateCloseCa = function() {
      var sql = " UPDATE contract SET closeca_date=:closeca_date, closeca_staff=:closeca_staff "
                + " , closeca_percent=:closeca_percent "
                + " , closeca_amount=:closeca_amount "
                + " , closeca_staff_percent=:closeca_staff_percent "
                + " , closeca_staff_amount=:closeca_staff_amount "
                + " , closeca_remark=:closeca_remark "
                + " , closeca_effective=:closeca_effective "
                + " , install_cost=:install_cost "
                + " , current_status='CLOSE_BAD_DEBT' "
                + " , close_date = NOW() "
                + " WHERE id=:id ";

      return db.query(sql, req.body);
    }

    db.beginTransaction()
      .then(updateCloseCa)
      .then(function(){
        db.commit();
        res.send({
          status:true
        });
      }).catch(function(e) {
        console.log('rollback', e);
        db.rollback(function(e) {
          res.send({
            status:false,
            error:e
          });
        });
      });
});

router.post('/listRedeem', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    // var fldList = "s.id, s.sell_date, s.receipt_no, sh.name shop_name, "
    //   + "s.contract_ref, c.name company_name, "
    //   + "p.description product_description, sd.serial product_serial, "
    //   + "sd2.price, sd2.cost, sd2.install_cost, sd3.main_price, "
    //   + "nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,0)+sd2.down_payment down_payment, "
    //   + "sd3.main_price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,0)-sd2.down_payment remain_price, "
    //   + "sst.fullname sales_staff, fst.fullname finance_staff, "
    //   + "case when fst.nickname like '%'||:nickname||'%' then '*' else '' end flag"
    //
    // var mainQuery = "SELECT %FIELD_LIST% "
    //   + "FROM sell s "
    //   + "        JOIN shop sh ON s.shop_id=sh.id "
    //   + "        JOIN company c ON s.company_id=c.id "
    //   + "        LEFT JOIN staff sst ON s.sales_staff_id=sst.id "
    //   + "        LEFT JOIN staff fst ON s.finance_staff_id=fst.id "
    //   + "        JOIN ( "
    //   + "          SELECT sell_id, sum(case when price >= 0 then price else 0 end) AS price, SUM(cost) cost, "
    //   + "            SUM(installation_cost) install_cost, "
    //   + "            SUM(case when price < 0 then -price else 0 end) down_payment"
    //   + "          FROM sell_detail "
    //   + "          GROUP BY sell_id "
    //   + "        ) sd2 ON sd2.sell_id=s.id "
    //   + "        JOIN ( "
    //   + "          SELECT sell_id, max(price) main_price "
    //   + "          FROM sell_detail "
    //   + "          GROUP BY sell_id "
    //   + "        ) sd3 ON sd3.sell_id=s.id "
    //   + "        JOIN sell_detail sd ON sd.sell_id=s.id AND sd.price=sd3.main_price "
    //   + "        JOIN product p ON sd.product_id=p.id "
    //   + "WHERE s.status='DEBIT' AND s.contract_id=0 AND s.sell_type='REDEEM'  "

      var fldList = " s.id, s.sell_date, s.receipt_no, "
        + "sh.id shop_id, sh.code shop_code, sh.name shop_name, "
        + "c.id company_id, c.code company_code, p.id product_id, "
        + "sh.name shop_name, s.contract_ref, c.name company_name, "
        + "p.description product_description, sd.serial product_serial, "
        + "sd2.price, sd2.cost, sd2.install_cost, sd2.price main_price, "
        + "nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,0)+sd2.down_payment  down_payment, "
        + "sd2.price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,0)-sd2.down_payment remain_price, "
        + "sst.barcode sell_staff_barcode, sst.mysqlviewstaffid sell_staff_id, sst.fullname sell_staff, "
        + "fst.mysqlviewstaffid finance_staff_id, fst.barcode finance_staff_barcode, fst.fullname finance_staff, "
        + "case when fst.nickname like '%'||:nickname||'%' then '*' else '' end flag "

      var mainQuery = " SELECT %FIELD_LIST% "
        + "FROM sell s "
        + "        JOIN shop sh ON s.shop_id=sh.id "
        + "        JOIN company c ON s.company_id=c.id "
        + "        LEFT JOIN staff sst ON s.sales_staff_id=sst.id "
        + "        LEFT JOIN staff fst ON s.finance_staff_id=fst.id "
        + "          AND fst.nickname <> :nickname "
        + "        JOIN ( "
        + "          SELECT sell_id, sum(case when price >= 0 then price else 0 end) AS price, SUM(cost) cost, "
        + "            SUM(nvl(installation_cost,0))install_cost, "
        + "            SUM(case when price < 0 then -price else 0 end) down_payment"
        + "          FROM sell_detail "
        + "          GROUP BY sell_id "
        + "        ) sd2 ON sd2.sell_id=s.id "
        + "        JOIN sell_detail sd ON sd.sell_id=s.id  "
        + "        JOIN(  "
        + "            select max(price) m_price,sell_id from sell_detail  "
        + "          group by sell_id  "
        + "         )sd3 on sd.price = sd3.m_price and sd3.sell_id = s.id    "
        + "        JOIN product p ON sd.product_id=p.id "
        + "WHERE s.status='DEBIT' AND s.id=:id AND s.sell_type=:selltype  ";

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
      if (typeof fields[fld]==='undefined') {
        continue;
      }
      var tmp = helper.genCond(fields[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);

      // if (fld=='company_name'
      //     || fld=='product_description'
      //     || fld=='remain_price'
      //     || fld=='product_serial'
      //     || fld=='shop'
      //     || fld=='shop_name'
      //     || fld=='sales_staff'
      //     || fld=='finance_staff') {
      //   hasJoin = true;
      // }
    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }

    var getCount = function() {
      // var sql = "SELECT COUNT(*) cnt FROM sell s "
      //   + "JOIN staff st ON s.finance_staff_id=st.id "
      //   + "WHERE s.status='DEBIT' ";
      //
      // if (hasJoin) {
        sql = 'SELECT COUNT(*) AS cnt FROM ('
          + mainQuery.replace('%FIELD_LIST%', '1') + ') x';
      // } else if (cond.length > 0) {
      //   sql += ' AND ' + cond.join(' AND ');
      // }

      console.log('COUNT QUERY:', sql);

      return oraConn.query(oradb, sql, {}).then(function(result) {
        if (result.rows.length==0) {
          $scope.totalRows = 0;
        } else {
          $scope.totalRows = result.rows[0][0];
        }
      });
    }

    var getRows = function() {
      var sortBy = req.body.sortBy || 'sell_date';
      var sortDir = req.body.sortDir || 'DESC';
      var limit = req.body.limit || 50;
      var page = parseInt(req.body.page || 0);
      var sql;
      var sortBy2;

      $scope.opt = {
        sortBy: sortBy,
        sortDir: sortDir,
        limit: limit,
        page: page,
        totalRows: 0
      };

      if (fields[sortBy]) {
        sortBy2 = fields[sortBy];
      } else {
        sortBy2 = "s.sell_date";
      }
      sql = "SELECT * FROM (SELECT rank() OVER (ORDER BY " + sortBy2.name + " " + sortDir+") rnk, "
        + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
        + ") x WHERE rnk BETWEEN " + (page*limit+1) + " AND " + ((page+1)*limit)
        + " ORDER BY " + sortBy + " " + sortDir;

      console.log('QUERY:', sql);

      return oraConn.query(oradb, sql, {nickname:'สดพิเศษ'}).then(function(result) {
//        $scope.rows = oraConn.convert(result);
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      });
    }

    // MAIN QUERY
    q.all([
      getCount(),
      getRows()
    ]).then(function() {
      $scope.opt.totalRows = $scope.totalRows;
      oraConn.close(oradb);
      res.send({
        status: true,
        data: $scope.rows,
        opt: $scope.opt
      });
    }).catch(function(e) {
      console.log(e);
      oraConn.close(oradb);
      res.send({
        status: false,
        error: e
      });
    });
  }).catch(function(e) {
    console.log(e);
    oraConn.close(oradb);
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/exportRedeem', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "s.id, s.sell_date, s.receipt_no, sh.name shop_name, "
      + "s.contract_ref, c.name company_name, "
      + "p.description product_description, sd.serial product_serial, "
      + "sd2.price, sd2.cost, sd2.install_cost, sd3.main_price, "
      + "nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,0) down_payment, "
      + "sd3.main_price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,0) remain_price, "
      + "sst.fullname sales_staff, fst.fullname finance_staff, "
      + "case when fst.nickname like '%'||:nickname||'%' then '*' else '' end flag"

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM sell s "
      + "        JOIN shop sh ON s.shop_id=sh.id "
      + "        JOIN company c ON s.company_id=c.id "
      + "        LEFT JOIN staff sst ON s.sales_staff_id=sst.id "
      + "        LEFT JOIN staff fst ON s.finance_staff_id=fst.id "
      + "        JOIN ( "
      + "          SELECT sell_id, sum(price) price, SUM(cost) cost, "
      + "            SUM(installation_cost) install_cost "
      + "          FROM sell_detail "
      + "          GROUP BY sell_id "
      + "        ) sd2 ON sd2.sell_id=s.id "
      + "        JOIN ( "
      + "          SELECT sell_id, max(price) main_price "
      + "          FROM sell_detail "
      + "          GROUP BY sell_id "
      + "        ) sd3 ON sd3.sell_id=s.id "
      + "        JOIN sell_detail sd ON sd.sell_id=s.id AND sd.price=sd3.main_price "
      + "        JOIN product p ON sd.product_id=p.id "
      + "WHERE s.status='DEBIT' AND s.contract_id=0  AND s.sell_type='REDEEM' "

    var cond = [];
    var hasJoin = false;
    for (var fld in req.body.keywords) {
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
      var tmp = helper.genCond(fields[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);

    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }


    var getRows = function() {
      var sortBy = req.body.sortBy || 'sell_date';
      var sortDir = req.body.sortDir || 'DESC';
      var limit = req.body.limit || 50;
      var page = parseInt(req.body.page || 0);
      var sql;
      var sortBy2;

      $scope.opt = {
        sortBy: sortBy,
        sortDir: sortDir,
        limit: limit,
        page: page,
        totalRows: 0
      };

      if (fields[sortBy]) {
        sortBy2 = fields[sortBy];
      } else {
        sortBy2 = "s.sell_date";
      }
      sql = mainQuery.replace('%FIELD_LIST%', fldList);
//      sql += ' AND rownum <= 100';
    //  console.log('SQL=', sql);
      return oraConn.query(oradb, sql, {nickname:'สดพิเศษ'}).then(function(result) {
        console.log('GET OK');
        $scope.result = result;
      }).catch(function(e) {
        console.log('ERROR=', e);
      });
    }

    // MAIN QUERY
    getRows().then(function() {
      var header = $scope.result.metaData.map(function(col) {
        return col.name.toLowerCase();
      });
      var rows = $scope.result.rows;
      rows.unshift(header);
      var buffer = xlsx.build([{name: "ListRedeem", data: rows}]);
      var id = helper.newUUID();
      var fname = '/output/contract_redeem_'+id+'.xlsx';
      fs.writeFileSync(path.normalize(__dirname + '/../../../public'+fname), buffer);
      oraConn.close(oradb);
      res.send({
        status:true,
        file: fname
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      res.send({
        status: false,
        error: e
      });
    });
  }).catch(function(e) {
    oraConn.close(oradb);
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/listUsedBarcode', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var param = req.body;

  var getBarcode = function() {
    var sql = " SELECT contract_id, barcode FROM contract_barcode "
      + " WHERE shop_id=:shop_id AND is_used='YES'";
    return db.query(sql, {shop_id:req.body.shop_id}, function(rows) {
      $scope.rows = rows;
    });
  };

  getBarcode().then(function() {
    res.send({
      status: true,
      data:{
        barcode:$scope.rows
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/getContractID', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  //console.log(req.body.code);
  var getContractID = function() {
    var sql = " SELECT id FROM contract "
      + " WHERE code = :code ";
    return db.query(sql,{code:req.body.code}).then(function(rows) {
      $scope.contract = rows[0].id;
    });
  };

  getContractID().then(function() {
    res.send({
      status: true,
      data:{
        contract_id:$scope.contract
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/getPersonCard',[bodyParser.json()], function(req, res){
  var db = mysqlConn.connect();
  var $scope = {};

  var resStatus = false;

  var getPersonInfo = function() {

    var sql = "SELECT idcard_info,firstname,lastname FROM person WHERE nationid=:code ORDER BY id DESC LIMIT 1";
    return db.query(sql, {code:req.body.nationid}).then(function(rows) {
      console.log('PERSONCARD=', rows);
      if (rows.length===0) {
        return;
      }
      if (rows.length >  0) {
        $scope.person = rows[0];
      }
    })
  }

  getPersonInfo().then(function() {

    if ($scope.person != undefined) {

      resStatus = true;
    }else{

      resStatus = false;
    }

    console.log('person:',$scope.person);
    res.send({
      status: resStatus,
      data:{
        person_card:$scope.person
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });

});

router.post('/getPersonCardCo',[bodyParser.json()], function(req, res){
  var db = mysqlConn.connect();
  var $scope = {};

  var resStatus = false;

  var getPersonInfo = function() {

    var sql = "SELECT nationid,idcard_info,firstname,lastname FROM person WHERE nationid=:code ORDER BY id DESC LIMIT 1";
    return db.query(sql, {code:req.body.nationid}).then(function(rows) {
      console.log('PERSONCARD=', rows);
      if (rows.length===0) {
        return;
      }
      if (rows.length >  0) {
        $scope.person = rows[0];
      }
    })
  }

  getPersonInfo().then(function() {

    if ($scope.person != undefined) {

      resStatus = true;
    }else{

      resStatus = false;
    }

    console.log('person:',$scope.person);
    res.send({
      status: resStatus,
      data:{
        person_card:$scope.person
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });

});

router.post('/saveRecontract', [bodyParser.json()], function(req, res) {
    var db = mysqlConn.connect();
    var $scope = {};

    oraConn.connect().then(function(oradb) {
      var updateContractBarcode = function() {
        var sql = " UPDATE contract_barcode SET is_used='NO', contract_id=0 "
                  + " WHERE barcode=:code ";

        return db.query(sql, {code:req.body.contract_code});
      }

      var deleteContract = function() {
        var sql = " delete from contract "
                  + " WHERE id=:id ";

        return db.query(sql, {id:req.body.contract_id});
      }

      var updateSell = function() {
        var sql = " update sell set contract_id = 0 ,mysql_contract_code='' "
                  + " WHERE id=:id ";

        return oraConn.query(oradb, sql,{id:req.body.sell_id},true);
      }

      var insertContractHistory = function(){
        var sql = " INSERT INTO contract_history (contract_id,com_id,shop_id,code,cs_barcode,sell_id,ref_code,sell_staff_id,finance_staff_id,comm_open_payment_id "
                  + " ,comm_close_payment_id,sign_date,close_date,type,cus_person_id,cus_ref_id,cus_prename,cus_firstname "
                  + " ,cus_lastname,cus_marital_status,cus_mobile,cus_email,cus_addr_id,cus_card_addr_id,cus_addr_owner "
                  + " ,cus_addr_with,cus_addr_person,work_company,work_addr_id,work_type,work_type_other,work_detail,work_department "
                  + " ,work_position,work_time,work_year,work_salary,work_income,work_income_source,work_prev_company,work_prev_addr "
                  + " ,work_prev_department,work_prev_tel,co_person_id,co_prename,co_firstname,co_lastname,co_mobile,co_email "
                  + " ,co_relation,co_work_company,co_work_detail,co_work_department,co_work_position,co_work_time,co_work_year "
                  + " ,co_work_salary,co_work_income,co_work_income_source,co_addr_id,co_card_addr_id,co_work_addr_id,doc_send_to "
                  + " ,total_price,down_payment,cost,install_cost,fee,payment_price,payment_month,payment_on_day,payment_per_month,product_detail "
                  + " ,product_serial,total_paid,balance,remark,payment_status,current_status,is_active,created_at,created_by "
                  + " ,updated_at,updated_by,new_cost,profit_lost,from_system,discount,status_discount,close_confiscate "
                  + " ,closeca_date,closeca_staff,closeca_percent,closeca_amount,closeca_staff_percent,closeca_staff_amount "
                  + " ,closeca_remark,closeca_effective,over_day,amount_term,last_paid,close_contract_date) "
                  + " SELECT id,com_id,shop_id,code,cs_barcode,sell_id,ref_code,sell_staff_id,finance_staff_id,comm_open_payment_id "
                            + " ,comm_close_payment_id,sign_date,close_date,type,cus_person_id,cus_ref_id,cus_prename,cus_firstname "
                            + " ,cus_lastname,cus_marital_status,cus_mobile,cus_email,cus_addr_id,cus_card_addr_id,cus_addr_owner "
                            + " ,cus_addr_with,cus_addr_person,work_company,work_addr_id,work_type,work_type_other,work_detail,work_department "
                            + " ,work_position,work_time,work_year,work_salary,work_income,work_income_source,work_prev_company,work_prev_addr "
                            + " ,work_prev_department,work_prev_tel,co_person_id,co_prename,co_firstname,co_lastname,co_mobile,co_email "
                            + " ,co_relation,co_work_company,co_work_detail,co_work_department,co_work_position,co_work_time,co_work_year "
                            + " ,co_work_salary,co_work_income,co_work_income_source,co_addr_id,co_card_addr_id,co_work_addr_id,doc_send_to "
                            + " ,total_price,down_payment,cost,install_cost,fee,payment_price,payment_month,payment_on_day,payment_per_month,product_detail "
                            + " ,product_serial,total_paid,balance,remark,payment_status,current_status,is_active,created_at,created_by "
                            + " ,updated_at,updated_by,new_cost,profit_lost,from_system,discount,status_discount,close_confiscate "
                            + " ,closeca_date,closeca_staff,closeca_percent,closeca_amount,closeca_staff_percent,closeca_staff_amount "
                            + " ,closeca_remark,closeca_effective,over_day,amount_term,last_paid,close_contract_date "
                  + " from contract WHERE  id = :id " ;
        return db.query(sql, {id: req.body.contract_id}).then(function(){
            console.log('insertContractHistory success');
        });
      }

      db.beginTransaction()
        .then(insertContractHistory)
        .then(updateContractBarcode)
        .then(deleteContract)
        .then(updateSell)
        .then(function(){
          db.commit();
          res.send({
            status:true
          });
        }).catch(function(e) {
          console.log('rollback', e);
          db.rollback(function(e) {
            res.send({
              status:false,
              error:e
            });
          });
        });
    }).catch(function(e){
      oraConn.close(oradb);
      res.send({
        status:false,
        error:e
      });
    });
});

router.post('/listRecontract', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var mainQuery = "SELECT c.id,c.sell_id, c.sign_date, s.name shop_name, s.code shop_code, "
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid, st.display_name  finance  "
    + ", c.balance, c.over_day "
    + ", c.amount_term "
    + ", c.last_paid "
    + "FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "  LEFT JOIN staff st on c.finance_staff_id=st.id "
    + "WHERE c.is_active='YES' and (c.total_paid - c.down_payment) = 0 ";

    // + ", c.balance,(select DATEDIFF(now(),min(due_date)) from payment_term  where contract_id = c.id and term_status in ('OVERDUE','OVERDUE_PARTIAL')) over_day "
    // + ", (select count(id) from payment_term where contract_id = c.id and term_status in ('OVERDUE','OVERDUE_PARTIAL')) amount_term "
    // + ", (select max(paid_date)  from payment_term where contract_id =  c.id) last_paid "

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
    if (fld=='current_status' && keyword=='ALL') {
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

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM contract c WHERE c.is_active='YES' and (c.total_paid - c.down_payment) = 0 ";
    if (hasJoin) {
      sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x';
    } else if (cond.length > 0) {
      sql += ' AND ' + cond.join(' AND ');
    }
    return db.query(sql, {}).then(function(rows) {
      if (rows.length==0) {
        $scope.totalRows = 0;
      } else {
        $scope.totalRows = rows[0].cnt;
      }
    });
  }

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

    if(sortBy == 'over_day' || sortBy == 'amount_term' || sortBy == 'last_paid' ){
        sortBy = sortBy;
    }else if (sortBy == 'finance'){
        sortBy = 'st.`' + sortBy + '`';
    }else{
        sortBy = 'c.`' + sortBy + '`';
    }

var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;

    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
    });
  }

  var getPaymentTerm = function() {
    if ($scope.rows.d.length==0) {
      console.log('NO PAYMENTS');
      return;
      for (var i in $scope.rows.d) {
        $scope.rows.d[i].push([]);
      }
      $scope.rows.f.push('payments');
      return;
    }
    var ids = $scope.rows.d.map(function(row) {
      return row[0];
    });
    var sql = "SELECT contract_id, term_num, due_date, due_amount, "
      + "paid_date, paid_amount, term_status, close_status, remark "
      + "FROM payment_term WHERE is_active='YES' "
      + "AND contract_id IN (" + ids.join(',') + ") "
      + "AND due_date >= :date_from AND due_date < :date_to "
      + "ORDER BY contract_id, term_num";
    var today = new Date(req.body.keywords.today);
    var from_date = new Date(today.getFullYear(), today.getMonth()-9, 1, 0, 0, 0);
    var to_date = new Date(today.getFullYear(), today.getMonth()+3, 1, 0, 0, 0);
    return db.query(sql, {
      date_from:helper.dateToString(from_date),
      date_to:helper.dateToString(to_date)
    }).then(function(rows) {
      var payments = {};
      rows.forEach(function(row) {
        if (!payments[''+row.contract_id]) {
          payments[''+row.contract_id] = [];
        }
        payments[''+row.contract_id].push(row);
      });
//      console.log(payments);
      for (var i in $scope.rows.d) {
//        console.log('id=', $scope.rows.d[i][0]);
        $scope.rows.d[i].push(payments[''+$scope.rows.d[i][0]] || []);
//        console.log($scope.rows.d[i]);
      }
      $scope.rows.f.push('payments');
    });
  }
  q.all([
    getCount(),
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
      return getPaymentTerm().then(function() {
        console.log('ok');
//        console.log($scope.rows);
        res.send({
          status: true,
          data: $scope.rows,
          opt: $scope.opt
        });
      }, function(e) {
        console.log('EEEEEE', e);
      });
    }
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});


router.post('/exportRecontract', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  // var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
  //   + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
  //   + ", c.product_detail, c.product_serial"
  //   + ", c.payment_price, c.total_paid "
  //   + ", c.balance , (select DATEDIFF(now(),min(due_date)) from payment_term  where contract_id = c.id and term_status in ('OVERDUE','OVERDUE_PARTIAL')) over_day "
  //   + "FROM contract c "
  //   + "  LEFT JOIN shop s on c.shop_id=s.id "
  //   + "WHERE c.is_active='YES' ";

  var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid, st.display_name  finance  "
    + ", c.balance "
    + " FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "  LEFT JOIN staff st on c.finance_staff_id=st.id "
    + "WHERE c.is_active='YES' and c.total_paid = 0 ";

    // + ", (select count(id) from payment_term where contract_id = c.id and term_status in ('OVERDUE','OVERDUE_PARTIAL')) amount_term "
    // + ", (select max(paid_date)  from payment_term where contract_id =  c.id) last_paid "

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

    if (contractFields[fld].name==='c.current_status' && keyword ==='ALL'){
        tmp = '';
    }

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

  //console.log(mainQuery);

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

    if(sortBy == 'over_day' || sortBy == 'amount_term' || sortBy == 'last_paid' ){
        sortBy = sortBy;
    }else if (sortBy == 'finance'){
        sortBy = 'st.`' + sortBy + '`';
    }else{
        sortBy = 'c.`' + sortBy + '`';
    }

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
    var fname = '/output/recontract_list_'+id+'.xlsx';
    fs.writeFileSync(path.normalize(__dirname + '/../../../public'+fname), buffer);
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
