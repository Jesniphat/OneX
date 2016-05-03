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


var fields = {
  shop:{name:'sh.code'},
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

    var param = req.body;

    var getPermission = function(){

      sql = " select id from permission where staff_id = :id and screen_id = 15 ";

      return oraConn.query(oradb, sql,{id:param.id}).then(function(result) {
//        $scope.rows = oraConn.convert(result);

          if (result.rows.length == 0) {
            $scope.closeCost = false;
          }else{
              $scope.closeCost = true;
          }


      //  console.log(result.rows[0]);
      });
    }

    q.all([
      getPermission(),
    ]).then(function() {
      oraConn.close(oradb);
      res.send({
        status:true,
        data: {
          closeCost: $scope.closeCost
        }
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      res.send({
        status:false,
        error:e
      });
    })
  });
});



router.post('/list', [bodyParser.json()], function(req, res) {

  var db = mysqlConn.connect();
  var $scope = {};

  var mainQuery = " select id,on_date,status cd_status,approve_date "
                + " ,approve_by,created_at,sum_cashTransfer "
                + " ,ifNull(cnClose,0) cnClose,ifnull(cnNoClose,0) cnNoClose"
                + " from cash_daily_on_date cod "
                + "	left join (select sum(ifnull(cash_transfer,0)) sum_cashTransfer,cash_daily_on_date_id "
                + " from cash_daily "
                + " group by cash_daily_on_date_id) a on a.cash_daily_on_date_id = cod.id "
                + " 	left join (select count(id) cnClose,cash_daily_on_date_id "
                + " from cash_daily  "
                + " where status = 'ปิดยอด' "
                + " group by cash_daily_on_date_id) cl on cl.cash_daily_on_date_id = cod.id "
                + " 	left join (select count(id) cnNoClose,cash_daily_on_date_id "
                + " from cash_daily  "
                + " where status <> 'ปิดยอด' "
                + " group by cash_daily_on_date_id) ncl on ncl.cash_daily_on_date_id = cod.id "

  var cond = [];
  var hasJoin = false;

  for(var fld in req.body.keywords) {
    var keyword = req.body.keywords[fld];
    if (typeof keyword === 'undefined') {
      continue;
    }
    // keyword = keyword.trim();
    if (keyword == '') {
      continue;
    }
    if (typeof fields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(fields[fld], keyword, false);
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
    // var sql = "SELECT COUNT(*) cnt FROM contract c WHERE c.is_active='YES' ";
    // if (hasJoin) {
      sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x';
    // } else if (cond.length > 0) {
    //   sql += ' AND ' + cond.join(' AND ');
    // }
    return db.query(sql, {shop_id:req.body.keywords['shop_id']}).then(function(rows) {

      if (rows.length==0) {
        $scope.totalRows = 0;
      } else {
        $scope.totalRows = rows[0].cnt;
      }
    });
  }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'created_at';
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

    if (fields[sortBy]) {
      sortBy2 = fields[sortBy];
    } else {
      sortBy2 = "sh_code";
    }

var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;

    return db.queryArray(sql,{shop_id:req.body.keywords['shop_id']}).then(function(rows) {
      $scope.rows = rows;

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
        console.log('ok');
//        console.log($scope.rows);
        res.send({
          status: true,
          data: $scope.rows,
          opt: $scope.opt
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
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid, st.display_name  finance  "
    + ", c.balance "
    + " FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "  LEFT JOIN staff st on c.finance_staff_id=st.id "
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
    if (typeof fields[fld]==='undefined') {
      continue;
    }

    var tmp = helper.genCond(fields[fld], keyword, false);

    if (fields[fld].name==='c.current_status' && keyword ==='ALL'){
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

router.post('/getBank', function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};

  var getBank = function() {
    var sql = "select id value,concat(account_no, ' - ',account_name) text from bank order by account_no";
    return db.queryArray(sql).then(function(rows) {
      $scope.bank = rows;
    });
  };

  q.all([
    getBank()
  ]).then(function() {
    res.send({
      status: true,
      data: {
        bank: $scope.bank
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/getDataMain', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var db = mysqlConn.connect();
    var $scope = {};

    var updateStatus = function(){
      var sql = " update cash_daily set status = 'รอตรวจสอบ' where id = :id and status = 'ปิดกะ'"
      return db.query(sql,{id:req.body.id })
    }

    var getDataMain = function() {
      $scope.Main = {};
      var sql = " select cod.id cash_daily_on_date_id,cd.id cash_daily_id,on_date,cd.status ,shop_id , " +
                " sh.code sh_code,sh.name sh_name,remark,ifnull(cd.approve_date,'-') cd_balance_date,cd.created_at,cd.updated_at, " +
                " cash_on_report,cash_transfer,bank_id,bank_ref,receive_pending_transfer, " +
                " today_pending_transfer,pastday_pending_transfer,total_pending_transfer,remark " +
                " ,doc_ref , ifnull(cod.approve_date,'-') approve_date" +
                " from cash_daily_on_date cod " +
                " left join cash_daily cd on cd.cash_daily_on_date_id = cod.id  " +
                " left join shop sh on cd.shop_id = sh.id " +
                " where cd.id = :id";

      return db.query(sql,{id:req.body.id }).then(function(rows) {
        console.log('getDataMain : ',rows.length);
        if(rows.length > 0) {

          $scope.Main = rows;
        }

      });
    };

    updateStatus()
    .then(getDataMain)
    .then(function() {
      oraConn.close(oradb);
      res.send({
        status: true,
        data: {
          Main: $scope.Main,
          CashTransfer : $scope.CashTransfer
        }
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      res.send({
        status: false,
        error: e
      });
    });
  });
});

router.post('/getDataDetail', [bodyParser.json()], function(req, res) {
 var db = mysqlConn.connect();
  var $scope = {};

  var getData = function() {
    var sql = " SELECT " +
              "   IFNULL(p.name,'Totals') AS receive_by, " +
              "   sums.old, sums.sell, sums.returnx,sums.installment,sums.income, " +
              "   sums.expense,sums.transfer " +
              " FROM (   " +
              "   SELECT   " +
              "     receive_by,  " +
              "     SUM(IF(item_name='ยกมา',amount,0)) As 'old',  " +
              "     SUM(IF(item_name='ขาย',amount,0)) As 'sell', " +
              "     SUM(IF(item_name='คืน',amount,0)) As 'returnx', " +
              "     SUM(IF(item_name='ค่างวด',amount,0)) As 'installment', " +
              "     SUM(IF(item_name='รับ',amount,0)) As 'income', " +
              "     SUM(IF(item_name='จ่าย',amount,0)) As 'expense', " +
              "     SUM(IF(item_name='ยอดนำส่ง',amount,0)) As 'transfer' " +
              "   FROM cash_daily_detail  " +
              " where cash_daily_id = :id" +
              "   GROUP BY receive_by WITH ROLLUP  " +
              " ) AS sums " +
              " left join payment_option p on p.id = sums.receive_by " ;

    return db.queryArray(sql,{id:req.body.id}).then(function(rows) {
      $scope.dataDetail = rows;
    });
  };

  q.all([
    getData()
  ]).then(function() {
    res.send({
      status: true,
      data: {
        dataDetail: $scope.dataDetail
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/ddlList', function(req, res) {
  // var db = conn.connect();
  var $scope = {};

  var getStatus = function() {
    $scope.cd_status = [ {value:'กำลังดำเนินการ',text:'กำลังดำเนินการ' } ,
    {value:'ปิดยอด',text:'ปิดยอด' },
    {value:'อนุมัติ',text:'อนุมัติ' }];
  };

  // var getShop = function() {
  //   var sql = "SELECT id value, CONCAT(code, ' ', name) text FROM shop "
  //     + "WHERE is_active='YES' ORDER BY code";
  //   return db.queryArray(sql).then(function(rows) {
  //     $scope.shop = rows;
  //   });
  // };

  q.all([
    getStatus()
  ]).then(function() {
    res.send({
      status: true,
      data: {
        cd_status: $scope.cd_status
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/save', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var error = [];
  var data = req.body.data;


  var updateData = function() {
    var sql = " update cash_daily_on_date "
            + " set approve_date = now() "
            + " ,approve_by = :staff_id "
            + " ,status = 'อนุมัติ' "
            + " where id = :id "

    return db.query(sql, {id:req.body.id
      ,staff_id:req.body.staff_id
    });
  }

  var updateDataCashDailyAll = function() {
    var sql = " update cash_daily "
            + " set status = 'อนุมัติ' "
            + " where cash_daily_on_date_id = :id "

    return db.query(sql, {id:req.body.id });
  }

  q.all([
    updateData(),
    updateDataCashDailyAll()
  ]).then(function() {
    res.send({
      status: true
    });
  }).catch(function(e) {
    console.log(e);
    res.send({
      status: false,
      error: e
    });
  });
});

module.exports = router;
