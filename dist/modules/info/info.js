var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var mysqlConn   = require('../../lib/db');
var oraConn     = require('../../lib/oracle');
var router      = express.Router();
var helper      = require('../../lib/helper');
var mkdirp      = require('mkdirp');
var fs          = require('fs');
var path        = require('path');
var nsReport    = require('../../lib/nsreport');
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
  shop:{name:'sh_code'},
  c_name:{name:'c_name'},
  sh_name:{name:'sh_name'},
  p_code:{name:'p_code'},
  p_desc:{name:'p_desc'},
  total:{name:'total'},
  sh_code:{name:'sh_code'},
  c_code:{name:'c_code'},
  p_group:{name:'p_group'},
  serial:{name:'serial'},
  barcode:{name:'barcode'},
  spec:{name:'spec'},
  qty:{name:'qty'},
  status:{name:'status'},
  po_cost:{name:'po_cost'},
  cost:{name:'cost'},
  vat:{name:'vat'},
  date_in:{name:'date_in'},
  po_no:{name:'po_no'},
  ref_date:{name:'ref_date'},
  ref_inv:{name:'ref_inv'},
  timestamp:{name:'timestamp'},
  nickname:{name:'nickname'},
  from_shop:{name:'from_shop'},
  to_shop:{name:'to_shop'},
  trans_date:{name:'trans_date'},
  sell_date:{name:'sell_date'},
  id:{name:'id'},
  contract_ref:{name:'contract_ref'},
  price:{name:'price'},
  return_date:{name:'return_date'},
  c_tel:{name:'c_tell'}
};

var fieldslist = {
  // shop:{name:'sh_code'},
  c_name:{name:'c_name'},
  sh_name:{name:'sh_name'},
  p_code:{name:'p_code'},
  p_desc:{name:'p_desc'},
  total:{name:'total'},
  sh_code:{name:'sh_code'},
  c_code:{name:'c_code'},
  p_group:{name:'p_group'},
  serial:{name:'serial'},
  barcode:{name:'barcode'},
  spec:{name:'spec'},
  qty:{name:'qty'},
  status:{name:'status'},
  po_cost:{name:'po_cost'},
  cost:{name:'cost'},
  vat:{name:'vat'},
  date_in:{name:'date_in'},
  po_no:{name:'po_no'},
  ref_date:{name:'ref_date'},
  ref_inv:{name:'ref_inv'},
  timestamp:{name:'timestamp'},
  nickname:{name:'nickname'},
  from_shop:{name:'from_shop'},
  to_shop:{name:'to_shop'},
  trans_date:{name:'trans_date'},
  sell_date:{name:'sell_date'},
  id:{name:'id'},
  contract_ref:{name:'contract_ref'},
  price:{name:'price'},
  return_date:{name:'return_date'},
  c_tel:{name:'c_tell'}
};

router.post('/getById', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};
    var db = mysqlConn.connect();
    var param = req.body;

    var getPermission = function(){

      var sql = " select * "
          + " from staff_shop_role shr "
          + " 	left join role_permission rp on shr.role_id = rp.role_id "
          + " where rp.permission_id = 163 "
          + " and staff_id = :id "
          + " and rp.is_active = 'YES'";

      return db.query(sql,{id:req.body.id}).then(function(result) {
          if (result.length == 0) {
            $scope.closeCost = false;
          }else{
            $scope.closeCost = true;
          }
      });
      // return oraConn.query(oradb, sql,{id:req.body.id}).then(function(result) {
      //     if (result.rows.length == 0) {
      //       $scope.closeCost = false;
      //     }else{
      //       $scope.closeCost = true;
      //     }
      // });
    }

    q.all([
      getPermission(),
    ]).then(function() {
      res.send({
        status:true,
        data: {
          closeCost: $scope.closeCost
        }
      });
    }).catch(function(e) {
      res.send({
        status:false,
        error:e
      });
    })
  });
});

router.post('/listTotalinfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "shop_id,company_id,product_id,sh_code,sh_name,c_code,c_name,p_code,p_desc,total"
//      + "decode(fst.nickname, :nickname, '*', '') flag ";

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_total_web where total > 0"

    var cond = [];
    var hasJoin = false;
    for(var fld in req.body.keywords) {

      // console.log('keyword:',req.body.keywords[fld]);
      // console.log('fields:',fld);
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
        var sql = 'SELECT COUNT(*) AS cnt FROM ('
          + mainQuery.replace('%FIELD_LIST%', '1') + ') x';
      // } else if (cond.length > 0) {
      //   sql += ' AND ' + cond.join(' AND ');
      // }


      return oraConn.query(oradb, sql, {}).then(function(result) {
        if (result.rows.length==0) {
          $scope.totalRows = 0;
        } else {
          $scope.totalRows = result.rows[0][0];
        }
      });
    }

    var getRows = function() {
      var sortBy = req.body.sortBy || 'sh_code';
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
        sortBy2 = "sh_code";
      }

      var sql = " select * "
          + " from ( "
          + "   select a.*, rownum rnum "
          + "         from ( select "
          +           mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
          + "         ORDER BY " + sortBy + " " + sortDir
          + "        ) a "
          + " where rownum <= " + ((page+1)*limit)
          + ") "
          + " where rnum >= " + (page*limit+1) + " "

      // sql = " select * from ( select "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + " ORDER BY " + sortBy + " " + sortDir
      //   + " ) "
      //   + " where rnk between " + (page*limit+1) + " AND " + ((page+1)*limit);

      // sql = "SELECT * FROM (SELECT rank() OVER (ORDER BY product_id " + sortDir+") rnk, "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + ") x WHERE rnk BETWEEN " + (page*limit+1) + " AND " + ((page+1)*limit)
      //   + " ORDER BY " + sortBy + " " + sortDir;

     //console.log('QUERY:', sql);

      return oraConn.query(oradb, sql,{}).then(function(result) {
//        $scope.rows = oraConn.convert(result);
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      //  console.log(result.rows[0]);
      });
    }

    // MAIN QUERY
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
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  });
});


router.post('/exportTotalinfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList =  "sh_code รหัสสาขา,sh_name ชื่อสาขา,c_code||'-'||c_name ซื้อจาก,p_code รหัสสินค้า,p_desc รายละเอียดสินค้า,total จำนวน "

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_total_web where total > 0"

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
      var sortBy = req.body.sortBy || 'sh_code';
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
        sortBy2 = "sh_code";
      }
      var sql = mainQuery.replace('%FIELD_LIST%', fldList);
//      sql += ' AND rownum <= 100';
      //console.log('SQL=', sql);
      return oraConn.query(oradb, sql, {}).then(function(result) {
        //console.log('GET OK');
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
      var buffer = xlsx.build([{name: "ListTotalinfo", data: rows}]);
      var id = helper.newUUID();
      var fname = '/output/info_totalinfo_'+id+'.xlsx';
      fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/listStockinfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "id,product_id,company_id,shop_id,sh_code,sh_name,p_code,p_desc,c_code,c_name,p_group,spec,serial,barcode,cost,po_cost,vat,status,date_in,qty,qty_yn,prod_age_month,prod_age_day"
//      + "decode(fst.nickname, :nickname, '*', '') flag ";

// select *
// from (
//   select rank() OVER (ORDER BY id DESC) rnk,id,product_id,company_id,shop_id,sh_code,sh_name,p_code,p_desc,c_code,c_name,
//   p_group,spec,serial,barcode,cost,po_cost,vat,status,date_in,qty,qty_yn,prod_age_month,prod_age_day
//   from info_stock_web
//   where shop_id <> 0
//   order by id desc,sh_code desc
// )
// where rnk between 51 and 100

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_stock_web where shop_id <> 0 "

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
        var sql = 'SELECT COUNT(*) AS cnt FROM ('
          + mainQuery.replace('%FIELD_LIST%', '1') + ') x';
      // } else if (cond.length > 0) {
      //   sql += ' AND ' + cond.join(' AND ');
      // }

      return oraConn.query(oradb, sql, {}).then(function(result) {
        if (result.rows.length==0) {
          $scope.totalRows = 0;
        } else {
          $scope.totalRows = result.rows[0][0];
        }
      });
    }

    var getRows = function() {
      var sortBy = req.body.sortBy || 'sh_code';
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
        sortBy2 = "sh_code";
      }

      var sql = " select * "
          + " from ( "
          + "   select a.*, rownum rnum "
          + "         from ( select "
          +           mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
          + "         ORDER BY " + sortBy + " " + sortDir
          + "        ) a "
          + " where rownum <= " + ((page+1)*limit)
          + ") "
          + " where rnum >= " + (page*limit+1) + " "

      // sql = " select * from ( select "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + " ORDER BY " + sortBy + " " + sortDir
      //   + " ) "
      //   + " where rnk between " + (page*limit+1) + " AND " + ((page+1)*limit);

      // sql = "SELECT * FROM (SELECT rank() OVER (ORDER BY id " + sortDir+") rnk, "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + ") x WHERE rnk BETWEEN " + (page*limit+1) + " AND " + ((page+1)*limit)
      //   + " ORDER BY " + sortBy + " " + sortDir;
      //console.log('sql=',sql)
      return oraConn.query(oradb, sql,{}).then(function(result) {
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


router.post('/exportStockinfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList =  "id เลขที่อ้างอิง,sh_code รหัสสาขา,sh_name ชื่อสาขา,p_code รหัสสินค้า,p_desc รายละเอียดสินค้า,c_code||'-'||c_name ซื้อจาก ,p_group กลุ่มสินค้า,spec ลักษณะ,serial,barcode,cost ทุนซื้อ,po_cost ทุนพนักงาน,vat,status สถานะ,date_in วันที่ทำรายการ,qty,qty_yn"

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_stock_web where  shop_id <> 0 "


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
      var sortBy = req.body.sortBy || 'sh_code';
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
        sortBy2 = "sh_code";
      }
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
      var buffer = xlsx.build([{name: "ListStockinfo", data: rows}]);
      var id = helper.newUUID();
      var fname = '/output/info_stockinfo_'+id+'.xlsx';
      fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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

router.post('/listAginginfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "id,product_id,company_id,shop_id,sh_code,sh_name,p_code,p_desc,c_code,c_name,p_group,spec,serial,barcode,cost,po_cost,vat,status,date_in,qty,qty_yn,prod_age_month,prod_age_day"
//      + "decode(fst.nickname, :nickname, '*', '') flag ";

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_stock_web where shop_id <> 0  "

    var cond = [];
    var hasJoin = false;
    for(var fld in req.body.keywords) {
      //
      // console.log('keyword:',req.body.keywords[fld]);
      // console.log('fields:',fld);
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
      var sortBy = req.body.sortBy || 'sh_code';
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
        sortBy2 = "sh_code";
      }

      sql = " select * "
          + " from ( "
          + "   select a.*, rownum rnum "
          + "         from ( select "
          +           mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
          + "         ORDER BY " + sortBy + " " + sortDir
          + "        ) a "
          + " where rownum <= " + ((page+1)*limit)
          + ") "
          + " where rnum >= " + (page*limit+1) + " "

      // sql = " select * from ( select "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + " ORDER BY " + sortBy + " " + sortDir
      //   + " ) "
      //   + " where rnk between " + (page*limit+1) + " AND " + ((page+1)*limit);

      // sql = "SELECT * FROM (SELECT rank() OVER (ORDER BY id " + sortDir+") rnk, "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + ") x WHERE rnk BETWEEN " + (page*limit+1) + " AND " + ((page+1)*limit)
      //   + " ORDER BY " + sortBy + " " + sortDir;

    // console.log('QUERY:', sql);

      return oraConn.query(oradb, sql,{}).then(function(result) {
//        $scope.rows = oraConn.convert(result);
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      //  console.log(result.rows[0]);
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


router.post('/exportAginginfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "id เลขที่อ้างอิง,sh_code รหัสสาขา,sh_name ชื่อสาขา,p_code รหัสสินค้า,p_desc รายละเอียดสินค้า,c_code||'-'||c_name ซื้อจาก ,p_group กลุ่มสินค้า,spec ลักษณะ,serial,barcode,cost ทุนซื้อ,po_cost ทุนพนักงาน,vat,status สถานะ,date_in วันที่ทำรายการ,qty,qty_yn,prod_age_month เดือน,prod_age_day วัน"

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_stock_web where  shop_id <> 0  "


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
      var sortBy = req.body.sortBy || 'sh_code';
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
        sortBy2 = "sh_code";
      }
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
      var buffer = xlsx.build([{name: "ListAginginfo", data: rows}]);
      var id = helper.newUUID();
      var fname = '/output/info_aginginfo_'+id+'.xlsx';
      fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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

router.post('/listStockininfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "sd_id,timestamp,id,company_id,shop_id,sh_code,sh_name,product_id,ref_inv,ref_date,c_code,p_code,p_desc,spec,serial,barcode,cost,vat,nickname,qty,qty_yn,register,po_no,voucher_payment_status"
//      + "decode(fst.nickname, :nickname, '*', '') flag ";

// select si.id,sd.id sd_id,si.company_id,si.shop_id,sh.code sh_code ,sh.name sh_name, sd.product_id, si.timestamp,si.ref_inv,si.ref_date, c.code c_code, p.code p_code, p.description p_desc,
//  sd.spec, sd.serial, sd.barcode, (sd.cost*sd.qty) as cost, sd.vat, sf.nickname, sd.qty, sd.qty_yn ,cost_original po_cost
//  ,'' voucher_payment_status,si.po_no,p.register
// from stock_in si, stockin_detail sd, company c, product p, staff sf ,shop sh
// where si.id = sd.stockin_id
// and si.company_id = c.id
// and sd.product_id = p.id
// and si.staff_id = sf.id
// and si.shop_id = sh.id

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_stockin_web where shop_id <> 0  "

    var cond = [];
    var hasJoin = false;
    for(var fld in req.body.keywords) {
      //
      // console.log('keyword:',req.body.keywords[fld]);
      // console.log('fields:',fld);
      var keyword = req.body.keywords[fld];
      if (typeof keyword === 'undefined') {
        continue;
      }
      keyword = keyword.trim();
      if (keyword == '') {
        continue;
      }
      if (typeof fieldslist[fld]==='undefined') {
        continue;
      }
      var tmp = helper.genCond(fieldslist[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);

      if (fld=='company_name'
          || fld=='product_description'
          || fld=='remain_price'
          || fld=='product_serial'
          || fld=='sales_staff'
          || fld=='finance_staff') {
        hasJoin = true;
      }
    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }

    var getIDShop = function() {
      var sql = "select id from shop where code=:code"

      return oraConn.query(oradb, sql, {code:req.body.keywords.shop}).then(function(result) {
        if (result.rows.length==0) {
          $scope.shop_id = '*';
          return;
        }
        $scope.shop_id = oraConn.convert(result)[0].id;
      });
    }

    var getCount = function() {
       var sql = "SELECT COUNT(*) cnt FROM stockin_detail "
      //   + "JOIN staff st ON s.finance_staff_id=st.id "
      //   + "WHERE s.status='DEBIT' ";
      //
      if (hasJoin == true) {
        sql = 'SELECT COUNT(*) AS cnt FROM ('
          + mainQuery.replace('%FIELD_LIST%', '1') + ') x';
      } else if (cond.length > 0) {
        if ($scope.shop_id !='*'){
          sql = mainQuery.replace('%FIELD_LIST%', 'count(1) ');
        }
        //sql += ' AND ' + cond.join(' AND ');
      }

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
      var sortBy = req.body.sortBy || 'sd_id';
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

      if (fieldslist[sortBy]) {
        sortBy2 = fieldslist[sortBy];
      } else {
        sortBy2 = "sh_code";
      }

      sql = " select * "
          + " from ( "
          + "   select a.*, rownum rnum "
          + "         from ( select "
          +           mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
          + "         ORDER BY " + sortBy + " " + sortDir
          + "        ) a "
          + " where rownum <= " + ((page+1)*limit)
          + ") "
          + " where rnum >= " + (page*limit+1) + " "

      // sql = " select * from ( select "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + " ORDER BY " + sortBy + " " + sortDir
      //   + " ) "
      //   + " where rnk between " + (page*limit+1) + " AND " + ((page+1)*limit);

      // sql = "SELECT * FROM (SELECT rank() OVER (ORDER BY sd_id " + sortDir+") rnk, "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + ") x WHERE rnk BETWEEN " + (page*limit+1) + " AND " + ((page+1)*limit)
      //   + " ORDER BY " + sortBy + " " + sortDir;

      return oraConn.query(oradb, sql,{}).then(function(result) {
//        $scope.rows = oraConn.convert(result);
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      //  console.log(result.rows[0]);
      });
    }

    // MAIN QUERY
    getIDShop().then(function(){
        if ($scope.shop_id != '*'){
            mainQuery += ' and shop_id = ' +  $scope.shop_id
        }
        return true;
    })
    .then(function(){
      return   q.all([
          getCount(),
          getRows()
        ])
    })
    .then(function() {
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


router.post('/exportStockininfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "sd_id เลขที่อ้างอิง,timestamp วันที่ทำรายการ,sh_code รหัสสาขา,sh_name ชื่อสาขา,ref_inv ใบสั่งซื้อ,ref_date วันที่อ้างอิง,c_code ซื้อจาก,p_code รหัสสินค้า,p_desc ชื่อสินค้า,spec ลักษณะ,serial,barcode,cost ทุนซื้อ,vat,voucher_payment_status สถานะจ่าย,nickname โดย,qty,qty_yn"

  //  var fldList = "sd_id"

    var mainQuery = "SELECT %FIELD_LIST% "
      + " FROM info_stockin_web where  shop_id <> 0  "

// select sd.id sd_id, si.id,si.company_id,si.shop_id,sh.code sh_code ,sh.name sh_name, sd.product_id, to_char(si.timestamp,'DD-MM-YYYY') timestamp,si.ref_inv,to_char(si.ref_date,'DD-MM-YYYY') ref_date, c.code c_code, p.code p_code, p.description p_desc,
// sd.spec, sd.serial, sd.barcode, (sd.cost*sd.qty) as cost, sd.vat, sf.nickname, sd.qty, sd.qty_yn , p.register, po.po_no,decode(sd.voucher_payment_status,'W','รอทำจ่าย','F','ทำจ่ายเงินเรียบร้อยแล้ว') voucher_payment_status
// from stock_in si, stockin_detail sd, company c, product p, staff sf, siamchai_op.po po, siamchai_op.po_detail pd,shop sh
// where si.id = sd.stockin_id
// and si.company_id = c.id
// and sd.product_id = p.id
// and si.staff_id = sf.id
// and sd.po_detail_id = pd.id(+)
// and pd.po_id = po.id(+)
// and si.shop_id = sh.id



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
      if (typeof fieldslist[fld]==='undefined') {
        continue;
      }
      var tmp = helper.genCond(fieldslist[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);

    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }


    var getRows = function() {
      var sortBy = req.body.sortBy || 'sh_code';
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

      if (fieldslist[sortBy]) {
        sortBy2 = fieldslist[sortBy];
      } else {
        sortBy2 = "sh_code";
      }
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
      var buffer = xlsx.build([{name: "ListStockininfo", data: rows}]);
      var id = helper.newUUID();
      var fname = '/output/info_stockininfo_'+id+'.xlsx';
    //  console.log("fname=" + path.normalize(__dirname + '/../../public'+fname));
      fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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


router.post('/listTransferinfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "trans_date,remark,from_shop,to_shop,c_code,p_code,p_desc,spec,serial,barcode,qty,qty_yn,cost,vat,nickname,transfer_detail_id"
//      + "decode(fst.nickname, :nickname, '*', '') flag ";

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_transfer_web where from_shop_id <> 0  "

    var cond = [];
    var hasJoin = false;
    for(var fld in req.body.keywords) {
      //
      // console.log('keyword:',req.body.keywords[fld]);
      // console.log('fields:',fld);
      var keyword = req.body.keywords[fld];
      if (typeof keyword === 'undefined') {
        continue;
      }
      keyword = keyword.trim();
      if (keyword == '') {
        continue;
      }
      if (typeof fieldslist[fld]==='undefined') {
        continue;
      }
      var tmp = helper.genCond(fieldslist[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);

      if (fld=='company_name'
          || fld=='product_description'
          || fld=='remain_price'
          || fld=='product_serial'
          || fld=='shop_name'
          || fld=='sales_staff'
          || fld=='finance_staff') {
        hasJoin = true;
      }
    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }

    var getCount = function() {
      var sql = "SELECT COUNT(*) cnt FROM transfer_detail "
     //   + "JOIN staff st ON s.finance_staff_id=st.id "
     //   + "WHERE s.status='DEBIT' ";
     //
      if (hasJoin == true) {
        sql = 'SELECT COUNT(*) AS cnt FROM ('
          + mainQuery.replace('%FIELD_LIST%', '1') + ') x';
      } else if (cond.length > 0) {
        if ($scope.shop_id !='*'){
          sql = mainQuery.replace('%FIELD_LIST%', 'count(1) ');
        }
        //sql += ' AND ' + cond.join(' AND ');
      }
      //console.log('sqltrancount=',sql);
      return oraConn.query(oradb, sql, {}).then(function(result) {
        if (result.rows.length==0) {
          $scope.totalRows = 0;
        } else {
          $scope.totalRows = result.rows[0][0];
        }
      });
    }

    var getIDShop = function() {
      var sql = "select id from shop where code=:code"
      return oraConn.query(oradb, sql, {code:req.body.keywords.from_shop}).then(function(result) {
        if (result.rows.length==0) {
          $scope.shop_id = '*';
          return;
        }
        $scope.shop_id = oraConn.convert(result)[0].id;
      });
    }

    var getRows = function() {
      var sortBy = req.body.sortBy || 'transfer_detail_id';
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

      if (fieldslist[sortBy]) {
        sortBy2 = fieldslist[sortBy];
      } else {
        sortBy2 = "trans_date";
      }
      sql = " select * "
          + " from ( "
          + "   select a.*, rownum rnum "
          + "         from ( select "
          +           mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
          + "         ORDER BY " + sortBy + " " + sortDir
          + "        ) a "
          + " where rownum <= " + ((page+1)*limit)
          + ") "
          + " where rnum >= " + (page*limit+1) + " "
          console.log('sqltransfer=',sql);
      // sql = " select * from ( select "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + " ORDER BY " + sortBy + " " + sortDir
      //   + " ) "
      //   + " where rnk between " + (page*limit+1) + " AND " + ((page+1)*limit);

      // sql = "SELECT * FROM (SELECT rank() OVER (ORDER BY transfer_detail_id " + sortDir+") rnk, "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + ") x WHERE rnk BETWEEN " + (page*limit+1) + " AND " + ((page+1)*limit)
      //   + " ORDER BY " + sortBy + " " + sortDir;

      return oraConn.query(oradb, sql,{}).then(function(result) {
//        $scope.rows = oraConn.convert(result);
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      //  console.log(result.rows[0]);
      });
    }

    // MAIN QUERY
    getIDShop().then(function(){
        if ($scope.shop_id != '*'){
            mainQuery += ' and from_shop_id = ' +  $scope.shop_id
        }
        return true;
    })
    .then(function(){
      return   q.all([
          getCount(),
          getRows()
        ])
    })
    .then(function() {
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


router.post('/exportTransferinfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList =  "trans_date วันที่ทำรายการ,remark หมายเหตุ,from_shop จากสาขา,to_shop ถึงสาขา ,c_code ซื้อจาก,p_code รหัสสินค้า,p_desc รายละเอียดสินค้า,spec ลักษณะ,serial,barcode,qty,qty_yn,cost ทุนซื้อ,vat,nickname โดย"

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_transfer_web where  from_shop_id <> 0  "


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
      if (typeof fieldslist[fld]==='undefined') {
        continue;
      }
      var tmp = helper.genCond(fieldslist[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);

    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }


    var getRows = function() {
      var sortBy = req.body.sortBy || 'trans_date';
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

      if (fieldslist[sortBy]) {
        sortBy2 = fieldslist[sortBy];
      } else {
        sortBy2 = "trans_date";
      }
      sql = mainQuery.replace('%FIELD_LIST%', fldList);
//      sql += ' AND rownum <= 100';
    //  console.log('SQL=', sql);
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
      var buffer = xlsx.build([{name: "ListTransferinfo", data: rows}]);
      var id = helper.newUUID();
      var fname = '/output/info_transferinfo_'+id+'.xlsx';
      fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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

router.post('/listSelldetailinfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "id,sd_id,shop_id,sell_date,c_code,c_name,c_tel,status,remark,nickname,p_code,p_desc,s_code,spec,serial,barcode,cost,price,vatchar,qty,qty_yn,type,vat,sh_code,credit_card_name,contract_ref,sales_name,installation_cost,profit,description,scs_check"
//      + "decode(fst.nickname, :nickname, '*', '') flag ";

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_sell_web where shop_id <> 0  "

    var cond = [];
    var hasJoin = false;
    for(var fld in req.body.keywords) {
      //
      // console.log('keyword:',req.body.keywords[fld]);
      // console.log('fields:',fld);
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

      if (fld=='company_name'
          || fld=='product_description'
          || fld=='remain_price'
          || fld=='product_serial'
          || fld=='sales_staff'
          || fld=='finance_staff') {
        hasJoin = true;
      }
    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }

    var getIDShop = function() {
      var sql = "select id from shop where code=:code"
      return oraConn.query(oradb, sql, {code:req.body.keywords.shop}).then(function(result) {
        if (result.rows.length==0) {
          $scope.shop_id = '*';
          return;
        }
        $scope.shop_id = oraConn.convert(result)[0].id;
      });
    }

    var getCount = function() {
        var sql = "SELECT COUNT(*) cnt FROM stockin_detail "
       //   + "JOIN staff st ON s.finance_staff_id=st.id "
       //   + "WHERE s.status='DEBIT' ";
       //
       if (hasJoin == true) {
         sql = 'SELECT COUNT(*) AS cnt FROM ('
           + mainQuery.replace('%FIELD_LIST%', '1') + ') x';
       } else if (cond.length > 0) {
         if ($scope.shop_id !='*'){
           sql = mainQuery.replace('%FIELD_LIST%', 'count(1) ');
         }
         //sql += ' AND ' + cond.join(' AND ');
       }

      return oraConn.query(oradb, sql, {}).then(function(result) {
        if (result.rows.length==0) {
          $scope.totalRows = 0;
        } else {
          $scope.totalRows = result.rows[0][0];
        }
      });
    }

    var getRows = function() {
      var sortBy = req.body.sortBy || 'sd_id';
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
        sortBy2 = "sh_code";
      }

      sql = " select * "
          + " from ( "
          + "   select a.*, rownum rnum "
          + "         from ( select "
          +           mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
          + "         ORDER BY " + sortBy + " " + sortDir
          + "        ) a "
          + " where rownum <= " + ((page+1)*limit)
          + ") "
          + " where rnum >= " + (page*limit+1) + " "

      // sql = " select * from ( select "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + " ORDER BY " + sortBy + " " + sortDir
      //   + " ) "
      //   + " where rnk between " + (page*limit+1) + " AND " + ((page+1)*limit);

      // sql = "SELECT * FROM (SELECT rank() OVER (ORDER BY id " + sortDir+") rnk, "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + ") x WHERE rnk BETWEEN " + (page*limit+1) + " AND " + ((page+1)*limit)
      //   + " ORDER BY " + sortBy + " " + sortDir;

    //console.log('QUERY:', sql);

      return oraConn.query(oradb, sql,{}).then(function(result) {
//        $scope.rows = oraConn.convert(result);
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      //  console.log(result.rows[0]);
      });
    }

    // MAIN QUERY
    getIDShop().then(function(){
        if ($scope.shop_id != '*'){
            mainQuery += ' and shop_id = ' +  $scope.shop_id
        }
        return true;
    })
    .then(function(){
      return   q.all([
          getCount(),
          getRows()
        ])
    })
    .then(function() {
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


router.post('/exportSelldetailinfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    //var fldList =  "id เลขที่อ้างอิง,sell_date วันที่ขาย,c_code รหัสลูกค้า,c_name ชื่อลูกค้า,status สถานะ,remark หมายเหตุ,p_code รหัสสินค้า,p_desc รายละเอียดสินค้า,s_code ซื้อจาก,spec ลักษณะ,serial,barcode,cost ทุนซื้อ,price ราคาขาย,vat,qty,qty_yn,type,sh_code ชื่อสาขา,credit_card_name ชื่อบัตรเครดิต,contract_ref เลขที่สัญญา,sales_name พนักงานขาย"
    var fldList =  "id เลขที่อ้างอิง,sell_date วันที่ขาย,c_code รหัสลูกค้า,c_name ชื่อลูกค้า,status สถานะ,remark หมายเหตุ,p_code รหัสสินค้า,p_desc รายละเอียดสินค้า,s_code ซื้อจาก,spec ลักษณะ,serial,barcode,cost ทุนซื้อ,price ราคาขาย,vat,qty,qty_yn,type,sh_code ชื่อสาขา,credit_card_name ชื่อบัตรเครดิต,contract_ref เลขที่สัญญา,sales_name พนักงานขาย"

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_sell_web where shop_id <> 0 and rownum < 100000  "


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
      var sortBy = req.body.sortBy || 'sh_code';
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
        sortBy2 = "sh_code";
      }
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
      var buffer = xlsx.build([{name: "ListSelldetailinfo", data: rows}]);
      var id = helper.newUUID();
      var fname = '/output/info_selldetailinfo_'+id+'.xlsx';
      fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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


router.post('/listReturninfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "id,shop_id,sh_code,sh_name,return_date,remark,nickname,c_code,p_code,spec,serial,barcode,price,qty,qty_yn,sell_date"
//      + "decode(fst.nickname, :nickname, '*', '') flag ";

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_return_web where shop_id <> 0  "

    var cond = [];
    var hasJoin = false;
    for(var fld in req.body.keywords) {
      //
      // console.log('keyword:',req.body.keywords[fld]);
      // console.log('fields:',fld);
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
        var sql = 'SELECT COUNT(*) AS cnt FROM ('
          + mainQuery.replace('%FIELD_LIST%', '1') + ') x';
      // } else if (cond.length > 0) {
      //   sql += ' AND ' + cond.join(' AND ');
      // }

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
      var sortBy = req.body.sortBy || 'sh_code';
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
        sortBy2 = "sh_code";
      }

      var sql = " select * "
          + " from ( "
          + "   select a.*, rownum rnum "
          + "         from ( select "
          +           mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
          + "         ORDER BY " + sortBy + " " + sortDir
          + "        ) a "
          + " where rownum <= " + ((page+1)*limit)
          + ") "
          + " where rnum >= " + (page*limit+1) + " "

      // sql = " select * from ( select "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + " ORDER BY " + sortBy + " " + sortDir
      //   + " ) "
      //   + " where rnk between " + (page*limit+1) + " AND " + ((page+1)*limit);

      // sql = "SELECT * FROM (SELECT rank() OVER (ORDER BY id " + sortDir+") rnk, "
      //   + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
      //   + ") x WHERE rnk BETWEEN " + (page*limit+1) + " AND " + ((page+1)*limit)
      //   + " ORDER BY " + sortBy + " " + sortDir;

     //console.log('QUERY RETURN:', sql);

      return oraConn.query(oradb, sql,{}).then(function(result) {
//        $scope.rows = oraConn.convert(result);
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      //  console.log(result.rows[0]);
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


router.post('/exportReturninfo', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList =  "id เลขที่อ้างอิง,sh_code รหัสสาขา,sh_name ชื่อสาขา,return_date วันที่ทำรายการ,remark หมายเหตุ,nickname โดย,c_code รหัสลูกค้า,p_code รหัสสินค้า,spec ลักษณะ,serial,barcode,price ราคา,qty,qty_yn,sell_date วันที่ขาย "

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM info_return_web where  shop_id <> 0   "


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
      var sortBy = req.body.sortBy || 'sh_code';
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
        sortBy2 = "sh_code";
      }
      var sql = mainQuery.replace('%FIELD_LIST%', fldList);
//      sql += ' AND rownum <= 100';
    //  console.log('SQL=', sql);
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
      var buffer = xlsx.build([{name: "ListReturninfo", data: rows}]);
      var id = helper.newUUID();
      var fname = '/output/info_returninfo_'+id+'.xlsx';
      fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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


module.exports = router;
