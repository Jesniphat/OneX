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
  on_date:{name:'cod.on_date',type:'daterange'},
  sh_name:{name:'sh.name'},
  cash_transfer:{name:'cd.cash_transfer'},
  sh_tel:{name:'sh.tel'},
  approve_date:{name:'cd.approve_date',type:'daterange'},
  remark:{name:'cd.remark'},
  cd_status:{name:'cd.status'}
};

router.post('/getById', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var param = req.body;

    var getPermission = function(){

      var sql = " select id from permission where staff_id = :id and screen_id = 15 ";

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

  var mainQuery = " select cod.ID cash_daily_on_date_id,cd.id cash_daily_id,cod.on_date on_date,sh.code sh_code,sh.name sh_name,sh.tel sh_tel,cd.cash_transfer cash_transfer,cd.approve_date approve_date,cd.remark remark,cd.status cd_status " +
                  " from cash_daily_on_date cod " +
                  " 	left join cash_daily cd on cd.cash_daily_on_date_id = cod.id " +
                  " 	left join shop sh on sh.id = cd.shop_id " +
                  " where cd.shop_id is not null  " +
                  " and cd.status in ('ปิดกะ','เปิดให้แก้ไข','รอตรวจสอบ','ปิดยอด','อนุมัติ')"

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
    return db.query(sql, {shop_id:req.body.keywords['shop']}).then(function(rows) {

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
        if(rows.length > 0) {

          $scope.Main = rows;
        }

      });
    };

    var getHistoryCloseCashdaily = function(){
      var sql = " select on_date,cashAmount"
              + " from history_close_cashdaily "
              + " where ref_id = :cashDailyID"

      return db.query(sql,{cashDailyID:req.body.id }).then(function(rows) {
      //  console.log('getDataMain : ',rows.length ,rows);
        if(rows.length > 0) {
          $scope.hisCloseCashdaily = rows;
        }else{
          $scope.hisCloseCashdaily = [];
        }

      });
    }

    updateStatus()
    .then(getDataMain)
    .then(getHistoryCloseCashdaily)
    .then(function() {

      console.log($scope.hisCloseCashdaily);
      res.send({
        status: true,
        data: {
          Main: $scope.Main,
          CashTransfer : $scope.CashTransfer,
          HistoryClose : $scope.hisCloseCashdaily
        }
      });
    }).catch(function(e) {
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
    $scope.cd_status = [ {value:'ปิดกะ',text:'ปิดกะ' },
    {value:'รอตรวจสอบ',text:'รอตรวจสอบ' },
    {value:'เปิดให้แก้ไข',text:'เปิดให้แก้ไข' },
    {value:'ปิดยอด',text:'ปิดยอด' },
    {value:'อนุมัติ',text:'อนุมัติ' }
    ];
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
  oraConn.connect().then(function(oradb) {
    var db = mysqlConn.connect();
    var error = [];
    var data = req.body.data;

    console.log( req.body);

    var updateData = function() {
      var sql = " update cash_daily "
        + " set status=:status  "
        + " ,updated_by=:staff_id "
        + " ,remark =:remark"
        if(req.body.data.status=='ปิดยอด'){
            sql = sql + " , approve_date=NOW() "
            + " , approve_by=:staff_id "
        }

        sql = sql + " where id=:id "

      return db.query(sql, {id:req.body.data.cash_daily_id
        ,status:req.body.data.status
        ,staff_id:req.body.staff_id
        ,remark:req.body.data.remark
      });
    }

    var updateData_Oracle = function() {
      var sql = "UPDATE chkCashDailystatus SET status=:status WHERE cash_daily_id=:id";
      return oraConn.query(oradb, sql, {id:req.body.data.cash_daily_id,status:req.body.data.status},true);
    }

    var checkAllCashDaily = function(){

      var sql = "select count(id) cn "
              + " from cash_daily "
              + " where cash_daily_on_date_id = :cod_id "
              + " and status not in ('ปิดยอด','อนุมัติ') "

        return db.query(sql,{cod_id:req.body.data.cash_daily_on_date_id}).then(function(rows){

          if(rows[0].cn== 0){
            updateCashOnDate();
          }
        });
    }

    var updateCashOnDate = function() {
      var sql = " update cash_daily_on_date "
        + " set status='ปิดยอด' "
        + " where ID=:id "
      return db.query(sql, {id:req.body.data.cash_daily_on_date_id});
    }

    var insHistoryCloseCashDaily = function(){
      var sql = " insert into history_close_cashdaily (staff_id,cash_daily_id,on_date,cashAmount,shop_id,ref_id) "
              + " values (:staffID,:cashDailyID,:onDate,:cashAmount,:shop_id,(select cd.id "
              + " from  cash_daily cd "
              + "	inner join cash_daily_on_date cod on cd.cash_daily_on_date_id = cod.id"
              + " where cd.shop_id = :shop_id"
              + " and cod.on_date = curdate()))"

      return db.query(sql, {staffID:req.body.staff_id
                            ,cashDailyID:req.body.data.cash_daily_id
                            ,onDate:req.body.data.on_date
                            ,cashAmount:req.body.data.total_pending_transfer
                            ,shop_id:req.body.data.shop_id}).then(function(result) {
        updatePastdayOnToday();
      });

    }

    var updatePastdayOnToday = function(){
      var sql = " update cash_daily cd "
              + "	inner join cash_daily_on_date cod on cd.cash_daily_on_date_id = cod.id"
              + " set pastday_pending_transfer=ifnull((select sum(cashAmount) "
              + "												from history_close_cashdaily "
              + "												where id in("
              + "											  select max(id) from history_close_cashdaily "
              + "												where shop_id = :shop_id "
              + "												and DATE(system_date) = curdate() "
              + "												group by cash_daily_id)),0)"
              + " where cd.shop_id = :shop_id"
              + " and cod.on_date = curdate()"

        return db.query(sql, {shop_id:req.body.data.shop_id});
    }

    q.all([
      updateData(),
      updateData_Oracle()
    ]).then(function(){
      if(req.body.data.status=='ปิดยอด'){
        return checkAllCashDaily(),insHistoryCloseCashDaily();
      }
    }).then(function() {
      oraConn.close(oradb);
      res.send({
        status: true
      });
    }).catch(function(e) {
      console.log(e);
      oraConn.close(oradb);
      res.send({
        status: false,
        error: e
      });
    });
  });
});

router.post('/getBranch', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};

  q.all([
    (function() {
      var query = "SELECT id AS value, concat(code, ' ', name) AS text FROM shop WHERE is_active='YES' ORDER BY code";
      return db.query(query).then(function(rows) {
          $scope.branch = ([ { value: 'ALL', text: 'ALL' } ]).concat(rows);
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { branch: $scope.branch } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});

router.post('/exportReport', [bodyParser.json()], function(req, res) {

  try {
    var db = mysqlConn.connect();
    var $scope = {};

    var param = req.body.data;
    for (var key in param) {
      if(param[key] === 'ALL') param[key] = null;
      if(param[key] != null && key !== 'report_name') param[key] = "'"+param[key]+"'";

      // console.log(param[key]);
    }


    var PrepareReport = function(){
      var dfd = q.defer();
      var param_value = '';

      console.log(param);
      switch(param.report_name)
      {
        case 'summaryIncomeShop':
          param_value += param.date_to;
          break;
      }

      param_value = "call report_" + param.report_name + '('+param_value+')';
      console.log('Export ::', param_value);

      db.query(param_value).then(function(rows) {

        if(rows[0].length != 0) {
          var list = 1;
          $scope.data = rows[0];
          dfd.resolve();
        } else {
          dfd.reject();
        }
      });
      return dfd.promise;
    }

    var RenderReport = function() {

      var dfd = q.defer();
      $scope.pdfFile = param.report_name +'_'+ helper.newUUID() + '.pdf';

      var pdfFullPath = path.normalize(__dirname + '/../../../public/output/' + $scope.pdfFile);

       console.log(pdfFullPath);

      // var pathjson = "D:/SecureStock/Services/reports/sources/data/";
      // fs.exists(pathjson, function(exists) {
      //   console.log(exists);
      //   if (exists) fs.writeFile(pathjson+param.report_name+'.json', JSON.stringify($scope.data), function(err) { });
      // });

      var report  = new nsReport();
      var doc = report.createDocument(require('./items/'+param.report_name+'.js'), $scope.data);
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

    // Response xhr.
    PrepareReport().then(RenderReport).then(function() {
      res.send({ status:true, data: { exports: 'output/'+$scope.pdfFile } })
    }).catch(function(e) {
      res.send({ status:false, error:e })
    });
  } catch(e){
     res.send({ status:false, error:e })
  }

});


router.post('/exportProfitLoss', [bodyParser.json()], function(req, res) {

  try {
    oraConn.connect().then(function(oradb) {
    var db = mysqlConn.connect();
    var $scope = {  items:[]};

    var param = req.body.data;
    for (var key in param) {
      if(param[key] === 'ALL') param[key] = null;
      if(param[key] != null && key !== 'report_name') param[key] = "'"+param[key]+"'";

      // console.log(param[key]);
    }

    var param_month = "'"+param.year.replace(/'/ig,'')+'-'+("0"+parseInt(param.month.replace(/'/ig,''))).slice(-2)+"'";

    var GenDataMySql = function(){

      var param_value = '';

      switch(param.report_name)
      {
        case 'profit_loss':
          param_value += "'"+param.year.replace(/'/ig,'')+'-'+("0"+parseInt(param.month.replace(/'/ig,''))).slice(-2)+"'";
          break;
      }

      param_value = "call report_" + param.report_name + '('+param_value+')';

      // var query = " select sh.id,sh.code,sh.name,ifnull(r.amount,0) amount "
      //           + " ,ifnull(c.down_payment,0) down_payment"
      //           + " ,ifnull(c.down_payment,0)+ifnull(r.cost_term,0) cost_term"
      //           + " ,(ifnull(c.down_payment,0) + ifnull(r.amount,0)) - (ifnull(c.down_payment,0)+ifnull(r.cost_term,0)) profit"
      //           + " from shop sh"
      //           + " left join (select  sum(amount) amount "
      //           + " 				,sum(cost_term) cost_term  ,shop_id"
      //           + " 				from receipt "
      //           + " 				group by shop_id) r on r.shop_id = sh.id"
      //           + " left join (select sum(down_payment) down_payment"
      //           + " 				,shop_id "
      //           + " 				from contract "
      //           + " 				group by shop_id) c on c.shop_id = sh.id"
      //           + " where sh.is_active = 'YES'"
      return db.query(param_value).then(function(rows) {
        if(rows[0].length != 0) {
          $scope.items = rows[0];

        }
      });

    }

    var GenDataOracle = function (){
      var query = " select sh.mysqlshopid,sh.code,s.shop_id,s.sell_price,(s.sell_cost * -1) sell_cost,s.sumsell, i.installment_price"
                + " ,(i.installment_cost * -1) installment_cost,i.sumInstallment,inc.income_price,(expense_price * -1) expense_price"
                + " from shop sh"
                + " 	left join ("
                + " 		select  sum(nvl(price,0)) sell_price,sum(nvl(cost,0)) sell_cost, (sum(nvl(price,0)) - sum(nvl(cost,0))) sumSell ,s.shop_id"
                + " 		 from ( "
                + " 		   select (nvl(price,0)*nvl(qty,0)) price,((nvl(cost,0) * nvl(qty,0)) + nvl(installation_cost,0) ) cost"
                + " 		   ,s.shop_id "
                + " 		   from sell s ,sell_detail sd, staff st "
                + " 		   where s.id = sd.sell_id "
                + " 		   and s.sell_on_cash = 'Y' "
                + "        and to_date(to_char(sell_date,'YYYY-MM'),'YYYY-MM') = to_date("+ param_month + ",'YYYY-MM') "
                + " 		   and s.finance_staff_id = st.id and st.is_staff = 'N'  "
                + " 		   union all "
                + " 		   select (nvl(price,0)*nvl(qty,0)) price,((nvl(cost,0) * nvl(qty,0)) + nvl(installation_cost,0) ) cost"
                + " 		   ,s.shop_id "
                + " 		   from sell s ,sell_detail sd, staff st "
                + " 		   where s.id = sd.sell_id "
                + "        and to_date(to_char(sell_date,'YYYY-MM'),'YYYY-MM') = to_date("+ param_month + ",'YYYY-MM') "
                + " 		   and s.finance_staff_id = st.id and st.is_staff = 'Y'  "
                + " 		 ) s "
                + " 		group by shop_id"
                + " 	) s on sh.id = s.shop_id"
                + " 	left join ("
                + " 		select  sum(nvl(price,0)) installment_price,sum(nvl(cost,0)) installment_cost"
                + " 		,(sum(nvl(price,0)) - sum(nvl(cost,0))) sumInstallment ,shop_id"
                + " 		from ( "
                + " 		  select (nvl(price,0)*nvl(qty,0)) price"
                + " 		  ,((nvl(cost,0) * nvl(qty,0)) + nvl(installation_cost,0) ) cost,s.shop_id "
                + " 		  from sell s ,sell_detail sd, staff st "
                + " 		  where s.id = sd.sell_id "
                + " 		  and s.sell_on_cash = 'N' "
                + "        and to_date(to_char(sell_date,'YYYY-MM'),'YYYY-MM') = to_date("+ param_month + ",'YYYY-MM') "
                + " 		   and s.finance_staff_id = st.id and st.is_staff = 'N'  "
                + " 		) s"
                + " 		group by shop_id"
                + " 	)i on i.shop_id = sh.id"
                + " 	left join ("
                + " 		select sum(nvl(amount,0) * nvl(qty,0)) income_price,shop_id "
                + " 		from income ic,income_detail icd"
                + " 		where icd.income_id = ic.id"
                + "     and to_date(to_char(income_date,'YYYY-MM'),'YYYY-MM') = to_date("+ param_month + ",'YYYY-MM') "
                + " 		group by shop_id "
                + " 	) inc on inc.shop_id = sh.id"
                + " 	left join ("
                + " 		select sum(nvl(amount,0) * nvl(qty,0)) expense_price,shop_id"
                + " 		from expense ic,expense_detail icd"
                + " 		where icd.expense_id = ic.id"
                + "     and to_date(to_char(expense_date,'YYYY-MM'),'YYYY-MM') = to_date("+ param_month + ",'YYYY-MM') "
                + " 		group by shop_id"
                + " 	)ex on ex.shop_id = sh.id"
                + " where sh.active = 'Y'"

          return oraConn.query(oradb, query,{});
    }

    // var Sell = function(sh_code){
    //   var query = " select  sum(price) sell_price,sum(cost) sell_cost, (sum(price) - sum(cost)) sumSell " +
    //               "  from ( " +
    //               "    select (nvl(price,0)*nvl(qty,0)) price,((nvl(cost,0) * nvl(qty,0)) + nvl(installation_cost,0) ) cost,s.shop_id " +
    //               "    from sell s ,sell_detail sd ,shop sh" +
    //               "    where s.id = sd.sell_id " +
    //               "    and s.sell_on_cash = 'Y' " +
    //               "    and s.shop_id = sh.id " +
    //               "    and sh.mysqlshopid = :shop_id"
    //               "    and s.finance_staff_id not in (select id from staff where barcode like '%9999') " +
    //               "    union all " +
    //               "    select (nvl(price,0)*nvl(qty,0)) price,((nvl(cost,0) * nvl(qty,0)) + nvl(installation_cost,0) ) cost,s.shop_id " +
    //               "    from sell s ,sell_detail sd, shop sh " +
    //               "    where s.id = sd.sell_id " +
    //               "    and s.shop_id = sh.id " +
    //               "    and sh.mysqlshopid = :shop_id"
    //               "    and s.finance_staff_id in (select id from staff where barcode like '%9999') " +
    //               "  ) s " +
    //               " group by shop_id "
    //
    //   // return oraConn.query(oradb, query, {shop_code:sh_code}).then(function(result) {
    //   //
    //   // }
    // }
    // var DownPayment = function(id_list){
    //   var query = " select sum(down_payment) down_payment,shop_id from contract where shop_id in("+id_list+") group by shop_id"
    //   return db.query(query)
    // }
    // var DownPayment_old = function(shop_id){
    //   var query = " select sum(down_payment) down_payment,shop_id from contract where shop_id = :shop_id group by shop_id"
    //
    // return db.query(query,{shop_id:shop_id});
    //   // .then(function(rows) {
    //   //
    //   //   $scope.down = rows[0].shop_id;
    //   //   // if(rows[0].length != 0) {
    //   //   //   console.log(rows[0]);
    //   //   //    return rows;
    //   //   // }
    //   // });
    // }
    //
    // var Receipt = function(type){
    //   var query = " select  sum(amount) amount ,sum(cost_term) cost_term  from receipt where shop_id = 177 group by shop_id"
    // }
    //
    // var Installment = function(sh_code){
    //   var query = " select  sum(price) installment_price,sum(cost) installment_cost,(sum(price) - sum(cost)) sumInstallment " +
    //               " from ( " +
    //               "   select (nvl(price,0)*nvl(qty,0)) price,((nvl(cost,0) * nvl(qty,0)) + nvl(installation_cost,0) ) cost,s.shop_id " +
    //               "   from sell s ,sell_detail sd,shop sh " +
    //               "   where s.id = sd.sell_id " +
    //               "   and s.sell_on_cash = 'N' " +
    //               "   and s.shop_id = sh.id " +
    //               "   and sh.mysqlshopid = :shop_id"
    //               "   and s.finance_staff_id not in (select id from staff where barcode like '%9999') " +
    //               " ) s" +
    //               " group by shop_id "
    //
    //   // return oraConn.query(oradb, query, {shop_code:sh_code}).then(function(result) {
    //   //
    //   // }
    // }
    //
    // var Income = function(sh_code){
    //   var query = " select sum(nvl(amount,0) * nvl(qty,0)) income_price " +
    //               " from income ic,income_detail icd , shop sh " +
    //               " where icd.income_id = ic.id " +
    //               " and ic.shop_id = sh.id " +
    //               " and sh.mysqlshopid = :shop_id"
    //   // return oraConn.query(oradb, query, {shop_code:sh_code}).then(function(result) {
    //   //
    //   // }
    // }
    //
    // var Expense = function(sh_code){
    //   var query = " select sum(nvl(amount,0) * nvl(qty,0)) expense_price " +
    //               " from expense ic,expense_detail icd , shop sh  " +
    //               " where icd.expense_id = ic.id " +
    //               " and ic.shop_id = sh.id "
    //               " and sh.mysqlshopid = :shop_id"
    //   // return oraConn.query(oradb, query, {shop_code:sh_code}).then(function(result) {
    //   //
    //   // }
    // }

    var MergeData = function(){
      return GenDataOracle().then(function(result) {
        var tmp = {}
        if (result.rows.length==0) {

          $scope.oracle = 0;
        } else {

          $scope.rows = {
            d: result.rows,
            f: result.metaData.map(function(fld) {
              return fld.name.toLowerCase();
            })
          };

          var data = $scope.rows;
          data.d.forEach(function(row) {
              tmp[row[0]] = row;
          });
        }

        $scope.items.forEach(function(item) {

        //  console.log('item1',item.id,tmp[item.id][3]);
          item.sell_price = parseInt(tmp[item.id][3] ||0);
        //  console.log('item2');
          item.sell_cost = parseInt(tmp[item.id][4] ||0);
        //  console.log('item3');
          item.sumSell = parseInt(tmp[item.id][5] ||0);
        //  console.log('item4');
          item.installment_price = parseInt(tmp[item.id][6] ||0);
        //  console.log('item5');
          item.installment_cost = parseInt(tmp[item.id][7] ||0);
        //  console.log('item6');
          item.sumInstallment = parseInt(tmp[item.id][8] ||0);
        //  console.log('item7');
          item.income_price = parseInt(tmp[item.id][9] ||0);
        //  console.log('item8');
          item.expense_price = parseInt(tmp[item.id][10] ||0);
        //  console.log('item9');
          item.net_profit = (parseInt(tmp[item.id][3] ||0) + parseInt(item.profit ||0) + parseInt(tmp[item.id][9] ||0)) - parseInt(tmp[item.id][10] ||0);
        })
      });
      // var all=[]
      // var data = $scope.items.forEach(function(item) {
      //   //  console.log(item.id);
      //     //item.DownPayment =  DownPayment(item.id);
      //     console.log(DownPayment(item.id).down_payment);
      //     all.push(DownPayment(item.id).then(function(x) {
      //       item.down_payment =x
      //     }))
      // });
      // return q.all(all)
      //console.log('data:',data);
      //  return DownPayment($scope.items[1].id).then(function(){
      //   console.log('payment:',$scope.down);
      //
      // });

    }

    var RenderReport = function() {
      try {

        var test = {}

        var dfd = q.defer();

        $scope.pdfFile = param.report_name +'_'+ helper.newUUID() + '.pdf';

        var pdfFullPath = path.normalize(__dirname + '/../../../public/output/' + $scope.pdfFile);

        var report  = new nsReport();
        var doc = report.createDocument(require('./items/profit_loss.js'), $scope.items);
        var stream = fs.createWriteStream(pdfFullPath);
        doc.pipe(stream);
        doc.end();
        stream.on('finish', function() {
          dfd.resolve();
        });
        stream.on('error', function(e) {
          dfd.reject();
        });

        return dfd.promise;

      } catch (e) {
        console.log(e);
      }
    }

    // Response xhr.
    GenDataMySql()
    .then(MergeData)
    .then(RenderReport)
    .then(function() {
      oraConn.close(oradb);
      res.send({ status:true, data: { exports: 'output/'+$scope.pdfFile } })
    }).catch(function(e) {
      oraConn.close(oradb);
      res.send({ status:false, error:e })
    });
  });
  } catch(e){
    oraConn.close(oradb);
     res.send({ status:false, error:e })
  }

});

module.exports = router;
