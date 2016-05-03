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
  shop:{name:'shop_id'},
  on_date:{name:'cod.on_date'},
  sh_name:{name:'sh.name'},
  cash_transfer:{name:'cd.cash_transfer'},
  sh_tel:{name:'sh.tel'},
  approve_date:{name:'cd.approve_date'},
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



router.post('/list', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
  //  var db = mysqlConn.connect();
    var $scope = {};

    var mainQuery = " select cod.ID cash_daily_on_date_id,cd.id cash_daily_id,cod.on_date on_date " +
                    " ,sh.code sh_code,sh.name sh_name,sh.tel sh_tel,cd.cash_on_report cash_transfer " +
                    " ,ifnull(cd.approve_date,'-') cl_balance_date,cod.approve_date approve_date,cd.remark remark,cd.status cd_status " +
                    " from cash_daily_on_date cod " +
                    " 	left join cash_daily cd on cd.cash_daily_on_date_id = cod.id " +
                    " 	left join shop sh on sh.id = cd.shop_id " +
                    " where cd.shop_id = :shop_id  " +
                    " and cd.status in ('รอปิดกะ','เปิดให้แก้ไข')"

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
      if (typeof fields[fld]==='undefined') {
        continue;
      }
      if (fld=='current_status' && keyword=='ALL') {
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

    var checkOndate = function(){

      var sql = " select max(on_date) maxDate,DATEDIFF(current_timestamp,max(on_date)) cnDate " +
                " from cash_daily_on_date cod "

      return db.query(sql).then(function(rows) {

        if (rows.length==0) {
          $scope.MaxDate = 0;
        } else {
          if(rows[0].cnDate > 0){
            for (var i = 1; i <= rows[0].cnDate; i++) {
              insCashDailyOndate(rows[0].maxDate,i);
            }
          }
        }

      });
    }

    var insCashDailyOndate = function(date,day) {
      var sql = " insert into cash_daily_on_date (on_date) " +
                " values (CONVERT(:on_date, DATE) + INTERVAL :day DAY) "
      return db.query(sql, {on_date:date,day:day}).then(function(result) {
        result.insertId

      });
    }

    var checkCashDailyAllShop = function(){
      var sql = " select id,code from shop where is_active = 'YES' and is_sale='YES' "

      return db.query(sql);
    }

    var updateCashDailyAllShop = function(rows) {
      var all = [];
      for (var i = 0; i < rows.length; i++) {
          all.push(checkCashDaily(rows[i].id));
        }
        return q.all(all);
    }

    var checkCashDaily = function(shop_id){
      var sql = " select cod.id ,on_date,cd.ID cd_id " +
                " from cash_daily_on_date cod " +
                "	left join cash_daily cd on cod.id = cd.cash_daily_on_date_id and cd.shop_id = :shop_id " +
                " where cd.id is null "

      return db.query(sql,{shop_id:shop_id}).then(function(rows) {
        if (rows.length==0) {
          $scope.CashDaily = 0;
        } else {
          for (var i = 0; i < rows.length; i++) {
            if(rows[i].id !=null){
              insCashDaily(rows[i].id,shop_id,rows[i].on_date);
            }
          }
        }
      });
    }

    var insCashDaily = function(id,shop_id,onDate) {
      var sql = " insert into cash_daily (cash_daily_on_date_id,shop_id,cash_transfer,created_by) " +
                " values (:id,:shop_id,0,:staff_id) "

      return db.query(sql, {id:id,shop_id:shop_id,staff_id:req.body.keywords['staff_id']}).then(function(result) {
          //insCashDailyOracle(result.insertId,shop_id,onDate);
          getCashdailystatus(result.insertId,shop_id,onDate);

      });
    }

    var insCashDailyOracle = function(cd_id,shop_id,date) {
      var sql = " insert into chkCashDailystatus (id,shop_id,on_date,cash_daily_id) " +
                " values (chkCashDaily_ID.nextval,:shop_id,to_date(:on_date,'yyyy-mm-dd'),:cd_id) "
      return oraConn.query(oradb,sql, {shop_id:shop_id,on_date:date,cd_id:cd_id},true);
    }

    var chkCash = function(){
      var sql = " select cod.on_date,cd.ID id ,cd.shop_id "
              + " from cash_daily_on_date cod"
              + "	left join cash_daily cd on cd.cash_daily_on_date_id = cod.id"
              + " where shop_id = :shop_id"
              + " and cd.status in ('รอปิดกะ','เปิดให้แก้ไข')"
      return db.query(sql,{shop_id:req.body.keywords.shop_id});
    }

    var updateCashAllShop = function(rows) {
      var all = [];
      for (var i = 0; i < rows.length; i++) {

          all.push(getUpdateCashOnreport(rows[i].id,rows[i].shop_id,rows[i].on_date));
        }
      return q.all(all);
    }

    var getUpdateCashOnreport = function(cd_id,shop_id,onDate) {
      //console.log('onDate:',onDate.replace(/-/ig,''));
      var sql = " select sum(nvl(amount,0)) sumAmount"
              + " from ("
              + "	select sum(nvl(amount,0)) amount"
              + "	from sell s "
              + "		left join sell_payment sd on sd.sell_id = s.id "
              + "	left join shop sh on sh.id = s.shop_id "
              + "		left join payment_option po on po.id = sd.payment_option_id "
              + "	where payment_option_id is not null "
              + " and to_date(to_char(s.sell_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:onDate,'yyyymmdd')"
              + "	and payment_option_id = 1 "
              + "	and sh.mysqlshopid = :shop_id"
              + "	union all"
              + "	select sum(nvl(amount,0))*-1 amount"
              + "	 from returnx s "
              + "	left join returnx_payment sd on sd.return_id = s.id "
              + "	left join shop sh on sh.id = s.shop_id"
              + "	left join payment_option po on po.id = sd.payment_option_id"
              + "	where payment_option_id is not null"
              + "	and return_status = 'PAYMENT_INCORRECT' "
              + "	and to_date(to_char(s.return_date,'yyyymmdd'),'yyyymmdd') = to_date(:onDate,'yyyymmdd')  "
              + "	and payment_option_id = 1 "
              + "	and sh.mysqlshopid = :shop_id"
              + "	union all"
              + "	select sum(nvl(cash,0)) amount"
              + "	from income ic  "
              + "	 	 left join shop sh on sh.id = ic.shop_id "
              + "	 where cash is not null "
              + "	 and to_date(to_char(ic.income_date,'yyyymmdd'),'yyyymmdd') = to_date(:onDate,'yyyymmdd') "
              + "	and sh.mysqlshopid = :shop_id"
              + "	union all"
              + "	select sum(nvl(cash,0)) amount"
              + "	from payment ic "
              + "		 left join shop sh on sh.id = ic.shop_id "
              + "	where cash is not null "
              + "	and to_date(to_char(ic.pay_date,'yyyymmdd'),'yyyymmdd') = to_date(:onDate,'yyyymmdd') "
              + "	and sh.mysqlshopid = :shop_id"
              + "	union all"
              + "	select sum(nvl(cash,0)) *-1 amount"
              + "	from expense ic "
              + "	 left join shop sh on sh.id = ic.shop_id "
              + "	where cash is not null "
              + "	and to_date(to_char(ic.expense_date,'yyyymmdd'),'yyyymmdd') = to_date(:onDate,'yyyymmdd') "
              + "	and sh.mysqlshopid = :shop_id"
              + " ) a"

        return oraConn.query(oradb,sql, {shop_id:shop_id,onDate:onDate.replace(/-/ig,'')}).then(function(result){

          $scope.rows = {
            d: result.rows,
            f: result.metaData.map(function(fld) {
              return fld.name.toLowerCase();
            })
          };

          result.rows.forEach(function(row) {
              updateCashOnReport(row[0],cd_id);
          });
        });
    }

    var updateCashOnReport = function(amount,id){
      var sql = " update cash_daily "
              + " set cash_on_report = :amount "
              + " where id = :id "

      return db.query(sql,{id:id,amount:amount});
    }

    var getChkCahdailyStatusOnOracle = function(){
      var sql = " select cd.id,shop_id,cod.on_date"
              + " from cash_daily cd"
              + "	 left join cash_daily_on_date cod on cod.ID = cd.cash_daily_on_date_id "
              + " where cod.on_date = current_date()"
              + " and flag_insOracle = 'N'"

console.log('sql:',sql);

      return db.query(sql);
    }

    var chkCashdailyStatusOnOracle = function(row){
      var all = [];
      console.log('ros;',row);
      for (var i = 0; i < row.length; i++) {
          all.push(getCashdailystatus(row[i].id,row[i].shop_id,row[i].on_date));
        }
      return q.all(all);
    }

    var getCashdailystatus = function(cashDaily_id,shopId,onDate){
      var sql = " select id from chkcashdailystatus where cash_daily_id = :cashDaily_id "

      return oraConn.query(oradb,sql, {cashDaily_id:cashDaily_id}).then(function(result){
      console.log('getCashDailyStatus:',result.rows.length ,' param:',cashDaily_id,shopId,onDate);
        if(result.rows.length==0){
          insCashDailyOracle(cashDaily_id,shopId,onDate);
        }else{
          UpdateFlagInsOracle(cashDaily_id);
        };
      });
    }

    var UpdateFlagInsOracle = function(cashDaily_id){
      var sql = " update cash_daily set flag_insOracle = 'Y' where id = :id"
      console.log(sql);
      return db.query(sql,{id:cashDaily_id})
    }

    var getCount = function() {
      var sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x';

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

    var db = mysqlConn.connect();

    db.beginTransaction()
      .then(checkOndate)
      .then(checkCashDailyAllShop)
      .then(updateCashDailyAllShop)
      // .then(chkCash)
      // .then(updateCashAllShop)
      .then(getChkCahdailyStatusOnOracle)
      .then(chkCashdailyStatusOnOracle)
      .then(getRows)
      .then(getCount)
      .then(function() {

       db.commit();
        $scope.opt.totalRows = $scope.totalRows;
        oraConn.close(oradb);
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
        oraConn.close(oradb);
        console.log(e);

        db.rollback(function(e) {
          res.send({
            status:false,
            error:e
          });
        });
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
//console.log('sql :',sql);
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

    var checkOldData = function(){
      var sql = " select min(on_date),c.id "
              + " from cash_daily_on_date cod "
              + "	  left join cash_daily c on c.cash_daily_on_date_id = cod.id "
              + " where on_date < curdate() "
              + " and c.status in('รอปิดกะ') "
              + " and c.shop_id = :shop_id"

      return db.query(sql,{shop_id:req.body.shop_id}).then(function(rows) {

          if(rows.length>0){
              if(rows[0].id==null){
                req.body.id = req.body.id;
              }else{
                if(req.body.status=='รอปิดกะ'){
                  req.body.id = rows[0].id;
                }
              }

          }
      });
    }

    var checkData = function(){

      var sql = " select cod.id cash_daily_on_date_id,on_date,cd.shop_id "
              + " from cash_daily cd "
              + "	left join cash_daily_on_date cod on cd.cash_daily_on_date_id = cod.id "
              + " where cd.id = :id "
              + " and cd.status in('รอปิดกะ','เปิดให้แก้ไข') "

      return db.query(sql,{id:req.body.id}).then(function(rows) {

          if(rows.length>0){

            $scope.checkData = rows;
          }
      });
    }

    var updateData = function(){
      var all = [];

      if($scope.checkData==null){
        return '';
      }

      all.push(
          Sell($scope.checkData[0].on_date,$scope.checkData[0].shop_id),
          Return($scope.checkData[0].on_date,$scope.checkData[0].shop_id),
          Income($scope.checkData[0].on_date,$scope.checkData[0].shop_id),
          Expense($scope.checkData[0].on_date,$scope.checkData[0].shop_id),
          Payment($scope.checkData[0].on_date,$scope.checkData[0].shop_id),
          Old($scope.checkData[0].on_date,$scope.checkData[0].shop_id)
      );

      return q.all(all);
    }

    var getCashTransferAll = function(){
      var sql = " select sum(case when item_name in('ขาย','รับ','ค่างวด','ยกมา') "
              + " then ifnull(amount,0) else ifnull(amount,0) * -1 end) amount,receive_by "
              + " from cash_daily c "
              + "  join cash_daily_detail cd on cd.cash_daily_id = c.id "
              + " where c.id = :id "
              + " and c.status in('รอปิดกะ','เปิดให้แก้ไข') "
              + " and item_name <> 'ยอดนำส่ง'"
              + " group by cd.receive_by "

      return db.query(sql,{id:req.body.id}).then(function(rows) {
          $scope.updateCashTransferAll = rows;

          // if(rows.length > 0){
          //   rows.forEach(function(row) {
          //     checkDailyDetail('ยอดนำส่ง',row.receive_by,row.amount);
          //   });
          // }
      });
    }

    var updateCashTransferAll = function(){
      var all = [];

      if($scope.updateCashTransferAll==null){
        return '';
      }

      if($scope.updateCashTransferAll.length > 0){
        $scope.updateCashTransferAll.forEach(function(row) {
          all.push(checkDailyDetail('ยอดนำส่ง',row.receive_by,row.amount));
        });
      }

      // all.push(
      //     checkDailyDetail('ยอดนำส่ง',row.receive_by,row.amount);
      // );

      return q.all(all);
    }

    var Sell = function(sellDate,shop_id){
      // var sql = " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid " +
      //           " from sell s " +
      //           " left join sell_payment sd on sd.sell_id = s.id " +
      //           " left join shop sh on sh.id = s.shop_id " +
      //           " left join payment_option po on po.id = sd.payment_option_id " +
      //           " where payment_option_id is not null " +
      //           " and to_date(to_char(s.sell_date,'yyyymmdd'),'yyyymmdd') = to_date(:sellDate,'yyyymmdd')  " +
      //           " and sh.mysqlshopid = :shop_id" +
      //           " group by po.mysqlpaymentoptionid "

      var sql = " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid  mysqlpaymentoptionid"
              + " from sell s "
              + " left join sell_payment sd on sd.sell_id = s.id "
              + " left join shop sh on sh.id = s.shop_id"
              + " left join payment_option po on po.id = sd.payment_option_id"
              + " where payment_option_id <> '3'"
              + " and to_date(to_char(s.sell_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:sellDate,'yyyymmdd')"
              + " and sh.mysqlshopid = :shop_id"
              + " group by mysqlpaymentoptionid"
              + " union all"
              + " select sum(nvl(amount,0)) amount, 5 mysqlpaymentoptionid"
              + " from sell s "
              + " left join sell_payment sd on sd.sell_id = s.id "
              + " left join shop sh on sh.id = s.shop_id"
              + " left join payment_option po on po.id = sd.payment_option_id"
              + " where payment_option_id = '3'"
              + " and sd.ref_id = 321"
              + " and to_date(to_char(s.sell_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:sellDate,'yyyymmdd')"
              + " and sh.mysqlshopid = :shop_id"
              + " group by mysqlpaymentoptionid"
              + " union all"
              + " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid"
              + " from sell s "
              + " left join sell_payment sd on sd.sell_id = s.id "
              + " left join shop sh on sh.id = s.shop_id"
              + " left join payment_option po on po.id = sd.payment_option_id"
              + " where payment_option_id = '3'"
              + " and sd.ref_id <> 321"
              + " and to_date(to_char(s.sell_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:sellDate,'yyyymmdd')"
              + " and sh.mysqlshopid = :shop_id"
              + " group by mysqlpaymentoptionid"
      //  console.log('sellDate:',sellDate.replace(/-/ig,''));
       return oraConn.query(oradb, sql,{shop_id:shop_id,sellDate:sellDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
        //  console.log('sell :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('ขาย',row[1],row[0]);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var Return = function(returnDate,shop_id){
      // var sql = " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid " +
      //           " from returnx s " +
      //           " left join returnx_payment sd on sd.return_id = s.id " +
      //           " left join shop sh on sh.id = s.shop_id " +
      //           " left join payment_option po on po.id = sd.payment_option_id " +
      //           " where payment_option_id is not null " +
      //           " and return_status = 'PAYMENT_INCORRECT' " +
      //           " and to_date(to_char(s.return_date,'yyyymmdd'),'yyyymmdd') = to_date(:returnDate,'yyyymmdd')  " +
      //           " and sh.mysqlshopid = :shop_id" +
      //           " group by po.mysqlpaymentoptionid "

        var sql = " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid "
                + " from returnx s "
                + " left join returnx_payment sd on sd.return_id = s.id "
                + " left join shop sh on sh.id = s.shop_id "
                + " left join payment_option po on po.id = sd.payment_option_id "
                + " where payment_option_id <> 3"
                + " and return_status = 'PAYMENT_INCORRECT' "
                + " and to_date(to_char(s.return_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:returnDate,'yyyymmdd')  "
                + " and sh.mysqlshopid = :shop_id"
                + " group by po.mysqlpaymentoptionid"
                + " union all"
                + " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid "
                + " from returnx s "
                + " left join returnx_payment sd on sd.return_id = s.id "
                + " left join shop sh on sh.id = s.shop_id "
                + " left join payment_option po on po.id = sd.payment_option_id "
                + " where payment_option_id = 3"
                + " and ref_id = 321"
                + " and return_status = 'PAYMENT_INCORRECT' "
                + " and to_date(to_char(s.return_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:returnDate,'yyyymmdd')  "
                + " and sh.mysqlshopid = :shop_id"
                + " group by po.mysqlpaymentoptionid"
                + " union all"
                + " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid "
                + " from returnx s "
                + " left join returnx_payment sd on sd.return_id = s.id "
                + " left join shop sh on sh.id = s.shop_id "
                + " left join payment_option po on po.id = sd.payment_option_id "
                + " where payment_option_id = 3"
                + " and ref_id <> 321"
                + " and return_status = 'PAYMENT_INCORRECT' "
                + " and to_date(to_char(s.return_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:returnDate,'yyyymmdd')  "
                + " and sh.mysqlshopid = :shop_id"
                + " group by po.mysqlpaymentoptionid"
          //  console.log('returnDate:',returnDate.replace(/-/ig,''))
       return oraConn.query(oradb, sql,{shop_id:shop_id,returnDate:returnDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
        //  console.log('return :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('คืน',row[1],row[0]);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var Income = function(incomeDate,shop_id){
      // var sql = " select sum(nvl(cash,0)) amount,'1' payment_option_id " +
      //           " from income ic  " +
      //           " 	 left join shop sh on sh.id = ic.shop_id " +
      //           " where cash is not null " +
      //           " and to_date(to_char(ic.income_date,'yyyymmdd'),'yyyymmdd') = to_date(:incomeDate,'yyyymmdd') " +
      //           " and sh.mysqlshopid = :shop_id " +
      //           " union all " +
      //           " select sum(nvl(cr_card,0)) amount,'3' payment_option_id " +
      //           " from income ic " +
      //           " 	 left join shop sh on sh.id = ic.shop_id " +
      //           " where cr_card is not null " +
      //           " and to_date(to_char(ic.income_date,'yyyymmdd'),'yyyymmdd') = to_date(:incomeDate,'yyyymmdd') " +
      //           " and sh.mysqlshopid = :shop_id " +
      //           " union all " +
      //           " select sum(nvl(transfer,0)) amount,'2' payment_option_id " +
      //           " from income ic " +
      //           " 	 left join shop sh on sh.id = ic.shop_id " +
      //           " where transfer is not null " +
      //           " and to_date(to_char(ic.income_date,'yyyymmdd'),'yyyymmdd') = to_date(:incomeDate,'yyyymmdd')   " +
      //           " and sh.mysqlshopid = :shop_id "

        var sql = " select sum(nvl(cash,0)) amount,'1' payment_option_id"
                + " from income ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cash is not null"
                + " and to_date(to_char(ic.income_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:incomeDate,'yyyymmdd')"
                + " and sh.mysqlshopid = :shop_id"
                + " union all"
                + " select sum(nvl(cr_card,0)) amount,'3' payment_option_id "
                + " from income ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id <> 321"
                + " and to_date(to_char(ic.income_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:incomeDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id "
                + " union all"
                + " select sum(nvl(cr_card,0)) amount,'5' payment_option_id "
                + " from income ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id = 321"
                + " and to_date(to_char(ic.income_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:incomeDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id "
                + " union all "
                + " select sum(nvl(transfer,0)) amount,'2' payment_option_id"
                + " from income ic"
                + " 	 left join shop sh on sh.id = ic.shop_id"
                + " where transfer is not null "
                + " and to_date(to_char(ic.income_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:incomeDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id"
        //      console.log('incomeDate:')
       return oraConn.query(oradb, sql,{shop_id:shop_id,incomeDate:incomeDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
    //      console.log('income :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('รับ',row[1],row[0]);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var Expense = function(expenseDate,shop_id){
      // var sql = " select sum(nvl(cash,0)) amount,'1' payment_option_id " +
      //           " from expense ic  " +
      //           " 	 left join shop sh on sh.id = ic.shop_id " +
      //           " where cash is not null " +
      //           " and to_date(to_char(ic.expense_date,'yyyymmdd'),'yyyymmdd') = to_date(:expenseDate,'yyyymmdd') " +
      //           " and sh.mysqlshopid = :shop_id " +
      //           " union all " +
      //           " select sum(nvl(cr_card,0)) amount,'3' payment_option_id " +
      //           " from expense ic " +
      //           " 	 left join shop sh on sh.id = ic.shop_id " +
      //           " where cr_card is not null " +
      //           " and to_date(to_char(ic.expense_date,'yyyymmdd'),'yyyymmdd') = to_date(:expenseDate,'yyyymmdd') " +
      //           " and sh.mysqlshopid = :shop_id " +
      //           " union all " +
      //           " select sum(nvl(transfer,0)) amount,'2' payment_option_id " +
      //           " from expense ic " +
      //           " 	 left join shop sh on sh.id = ic.shop_id " +
      //           " where transfer is not null " +
      //           " and to_date(to_char(ic.expense_date,'yyyymmdd'),'yyyymmdd') = to_date(:expenseDate,'yyyymmdd')   " +
      //           " and sh.mysqlshopid = :shop_id "

        var sql = " select sum(nvl(cash,0)) amount,'1' payment_option_id"
                + " from expense ic "
                + " 	 left join shop sh on sh.id = ic.shop_id"
                + " where cash is not null "
                + " and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:expenseDate,'yyyymmdd')"
                + " and sh.mysqlshopid = :shop_id "
                + " union all "
                + " select sum(nvl(cr_card,0)) amount,'3' payment_option_id "
                + " from expense ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id <> 321"
                + " and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:expenseDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id"
                + " union all "
                + " select sum(nvl(cr_card,0)) amount,'5' payment_option_id "
                + " from expense ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id = 321"
                + " and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:expenseDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id"
                + " union all "
                + " select sum(nvl(transfer,0)) amount,'2' payment_option_id"
                + " from expense ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where transfer is not null "
                + " and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:expenseDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id"

       return oraConn.query(oradb, sql,{shop_id:shop_id,expenseDate:expenseDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
    //    console.log('expense :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('จ่าย',row[1],row[0]);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var Payment = function(paymentDate,shop_id){
      // var sql = " select sum(nvl(cash,0)) amount,'1' payment_option_id " +
      //           " from payment ic  " +
      //           " 	 left join shop sh on sh.id = ic.shop_id " +
      //           " where cash is not null " +
      //           " and to_date(to_char(ic.pay_date,'yyyymmdd'),'yyyymmdd') = to_date(:paymentDate,'yyyymmdd') " +
      //           " and sh.mysqlshopid = :shop_id " +
      //           " union all " +
      //           " select sum(nvl(cr_card,0)) amount,'3' payment_option_id " +
      //           " from payment ic " +
      //           " 	 left join shop sh on sh.id = ic.shop_id " +
      //           " where cr_card is not null " +
      //           " and to_date(to_char(ic.pay_date,'yyyymmdd'),'yyyymmdd') = to_date(:paymentDate,'yyyymmdd') " +
      //           " and sh.mysqlshopid = :shop_id " +
      //           " union all " +
      //           " select sum(nvl(tranfer,0)) amount,'2' payment_option_id " +
      //           " from payment ic " +
      //           " 	 left join shop sh on sh.id = ic.shop_id " +
      //           " where tranfer is not null " +
      //           " and to_date(to_char(ic.pay_date,'yyyymmdd'),'yyyymmdd') = to_date(:paymentDate,'yyyymmdd')   " +
      //           " and sh.mysqlshopid = :shop_id "

        var sql = " select sum(nvl(cash,0)) amount,'1' payment_option_id"
                + " from payment ic  "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cash is not null "
                + " and to_date(to_char(ic.pay_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:paymentDate,'yyyymmdd')"
                + " and sh.mysqlshopid = :shop_id "
                + " union all "
                + " select sum(nvl(cr_card,0)) amount,'3' payment_option_id "
                + " from payment ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id <> 321"
                + " and to_date(to_char(ic.pay_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:paymentDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id "
                + " union all "
                + " select sum(nvl(cr_card,0)) amount,'5' payment_option_id "
                + " from payment ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id = 321"
                + " and to_date(to_char(ic.pay_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:paymentDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id "
                + " union all "
                + " select sum(nvl(tranfer,0)) amount,'2' payment_option_id "
                + " from payment ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where tranfer is not null "
                + " and to_date(to_char(ic.pay_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:paymentDate,'yyyymmdd')  "
                + " and sh.mysqlshopid = :shop_id"

       return oraConn.query(oradb, sql,{shop_id:shop_id,paymentDate:paymentDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
    //    console.log('Payment :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('ค่างวด',row[1],row[0]);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var Old = function(oldDate,shop_id){
      var sql = " select sum(amount) amount , '11' payment_option_id "
              + " from ( "
              + "	select sum(nvl(amount,0)) *-1 amount"
              + "	from sell s"
              + "		 left join sell_payment sp on sp.sell_id = s.id"
              + "		 left join shop sh on sh.id = s.shop_id"
              + "	where sh.mysqlshopid = :shop_id"
              + "	and sp.payment_option_id = 6"
              + "    and to_date(to_char(s.sell_date,'ddmmyyyy'),'ddmmyyyy') < to_date(:oldDate,'yyyymmdd')   "
              + "	union all"
              + "	select sum(nvl(amount,0)) amount"
              + "	from returnx s"
              + "		 left join returnx_payment sp on sp.return_id = s.id"
              + "		 left join shop sh on sh.id = s.shop_id"
              + "	where sh.mysqlshopid = :shop_id"
              + "	and sp.payment_option_id = 6"
              + "    and to_date(to_char(s.return_date,'ddmmyyyy'),'ddmmyyyy') < to_date(:oldDate,'yyyymmdd')   "
              + "	union all"
              + "	select sum(nvl(amount,0) * nvl(qty,0)) amount "
              + "	from income ic"
              + "		 left join income_detail icd on icd.income_id = ic.id"
              + "		 left join shop sh on sh.id = ic.shop_id"
              + "	where"
              + "		 sh.mysqlshopid = :shop_id"
              + "		 and icd.account_type_id = 78"
              + "    and to_date(to_char(ic.income_date,'ddmmyyyy'),'ddmmyyyy') < to_date(:oldDate,'yyyymmdd')   "
              + "	union all"
              + "	select sum(nvl(amount,0) * nvl(qty,0)) *-1 amount "
              + "	from expense ic"
              + "		 left join expense_detail icd on icd.expense_id = ic.id"
              + "		 left join shop sh on sh.id = ic.shop_id"
              + "	where"
              + "		 sh.mysqlshopid = :shop_id"
              + "		 and icd.account_type_id = 78"
              + "    and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') < to_date(:oldDate,'yyyymmdd')   "
              + "	)"


       return oraConn.query(oradb, sql,{shop_id:shop_id,oldDate:oldDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
    //    console.log('Old :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('ยกมา',row[1],row[0]);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var checkDailyDetail = function(item,receiveBy,amount){
      var sql = " select id from cash_daily_detail "
              + " where cash_daily_id = :cashDailyID "
              + " and item_name = :itemName "
              + " and receive_by = :receiveBy "
      return db.query(sql,{itemName:item,cashDailyID:req.body.id,receiveBy:receiveBy}).then(function(rows) {

          if(rows.length > 0){
              updateDailyDetail(amount,rows[0].id);
          }else{
              insertDailyDetail(amount,item,receiveBy);
          }
      });
    }

    var updateDailyDetail = function(amount,id){
      var sql = " update cash_daily_detail "
              + " set amount = :amount "
              + " where id = :id "
      return db.query(sql,{id:id,amount:amount}).then(function(rows) {
      });
    }

    var insertDailyDetail = function(amount,itemName,receive_by){
      var sql = " insert into cash_daily_detail (cash_daily_id,item_name,receive_by,created_by,amount) "
              + " values(:cashDailyID,:item_name,:receive_by,:created_by,:amount) "

      return db.query(sql,{cashDailyID:req.body.id,item_name:itemName,receive_by:receive_by,created_by:req.body.staff_id,amount:amount}).then(function(rows) {
      });
    }

    var getCashOnReport = function() {
      $scope.CashTransfer = {};
      var sql = " select round(amount) amount "
              + " from cash_daily_detail "
              + " where receive_by = 1 "
              + " and item_name = 'ยอดนำส่ง' "
              + " and cash_daily_id = :id"

      return db.query(sql,{id:req.body.id }).then(function(rows) {
    //    console.log('getCashOnReport : ',rows.length);
        if(rows.length > 0) {
          updateCashOnReport(rows[0].amount);
        }else{
          updateCashOnReport('0');
        }

      });
    };

    var updateCashOnReport = function(amount){
      var sql = " update cash_daily "
              + " set cash_on_report = :amount "
              + " where id = :id "
              + " and status in('รอปิดกะ','เปิดให้แก้ไข') "
            //    console.log('cash_daily:',amount);
      return db.query(sql,{id:req.body.id,amount:amount}).then(function(rows) {
      });
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
      //  console.log('getDataMain : ',rows.length ,rows);
        if(rows.length > 0) {

          $scope.Main = rows;
        }

      });
    };

    var checkOldPendingTransfer = function(){
      var sql = "select cod2.on_date,cod2.id id,cd2.today_pending_transfer "
              + " from cash_daily cd "
              + " 	left join cash_daily_on_date cod on cd.cash_daily_on_date_id = cod.id "
              + " 	left join cash_daily_on_date cod2 on cod2.on_date = DATE_ADD(cod.on_date,INTERVAL -1 day) "
              + " 	left join cash_daily cd2 on cod2.id = cd2.cash_daily_on_date_id and cd2.shop_id = cd.shop_id "
              + " where cd.id = :id "
              + " and cd.status in('รอปิดกะ','เปิดให้แก้ไข')"
        return db.query(sql,{id:req.body.id }).then(function(rows) {
            if(rows.length!=0){
              updatePastday(rows[0].today_pending_transfer);
            }
        });
    }

    var updatePastday = function(amount){
      var sql = " update cash_daily set pastday_pending_transfer = :amount where id = :id"
      return db.query(sql,{id:req.body.id,amount:amount})
    }

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

    db.beginTransaction()
    .then(checkOldData)
    .then(checkData)
    .then(updateData)
    .then(getCashTransferAll)
    .then(updateCashTransferAll)
    .then(getCashOnReport)
    .then(getDataMain)
    .then(getHistoryCloseCashdaily)
  //  .then(checkOldPendingTransfer)
    .then(function() {
      db.commit();
      oraConn.close(oradb);
//   console.log('his:',$scope.hisCloseCashdaily);
      res.send({
        status: true,
        data: {
          Main: $scope.Main,
          CashTransfer : $scope.CashTransfer,
          HistoryClose : $scope.hisCloseCashdaily
        }
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      db.rollback(function(e) {
        res.send({
          status: false,
          error: e
        });
      });
    });
  });
});

router.post('/getDataDetail', [bodyParser.json()], function(req, res) {
 var db = mysqlConn.connect();
  var $scope = {};

  var getData = function() {
    var sql = " SELECT " +
              "   IFNULL(p.name,'รวม') AS receive_by, " +
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
    $scope.cd_status = [ {value:'รอปิดกะ',text:'รอปิดกะ' } ,
    {value:'เปิดให้แก้ไข',text:'เปิดให้แก้ไข' }]
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

    var updateData = function() {
      var sql = " update cash_daily "
        + " set cash_on_report = :cash_on_report "
        + " ,cash_transfer =:cash_transfer, "
        + " bank_id =:bank_id, "
        + " bank_ref=:bank_ref, "
        + " receive_pending_transfer=:receive_pending_transfer, "
        + " today_pending_transfer=:today_pending_transfer, "
        + " pastday_pending_transfer=:pastday_pending_transfer, "
        + " total_pending_transfer=:total_pending_transfer, "
        + " remark=:remark, "
        + " doc_ref=:doc_ref, "
        + " status='ปิดกะ', "
        + " updated_by=:staff_id "
        + " where id=:id "

      return db.query(sql, {id:req.body.data.cash_daily_id
        ,cash_on_report:req.body.data.cash_on_report
        ,cash_transfer:req.body.data.cash_transfer
        ,bank_id:req.body.data.bank
        ,bank_ref:req.body.data.bank_ref
        ,receive_pending_transfer:req.body.data.receive_pending_transfer
        ,today_pending_transfer:req.body.data.today_pending_transfer
        ,pastday_pending_transfer:req.body.data.pastday_pending_transfer
        ,total_pending_transfer:req.body.data.total_pending_transfer
        ,remark:req.body.data.remark
        ,doc_ref:req.body.data.doc_ref
        ,staff_id:req.body.staff_id
      });
    }

    var updateData_Oracle = function() {
      var sql = "UPDATE chkCashDailystatus SET status='ปิดกะ' WHERE cash_daily_id=:id";
      return oraConn.query(oradb, sql, {id:req.body.data.cash_daily_id},true);
    }

    q.all([
      updateData(),
      updateData_Oracle()
    ]).then(function() {
      oraConn.close(oradb);
      res.send({
        status: true,
        id:req.body.data.cash_daily_id
      });
    }).catch(function(e) {
      oraConn.close(oradb);
      console.log(e);
      res.send({
        status: false,
        error: e
      });
    });
  });
});



router.post('/insertOld', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var db = mysqlConn.connect();
    var $scope = {};

  //  console.log('req:',req.body);

    var checkOndate = function(){
      console.log('sks');
      var sql = " select :dateFrom minDate,DATEDIFF(:dateTo,:dateFrom) cnDate "
              + " from shop "
              + " limit 1 ";
      return db.query(sql,{dateTo:req.body.data.dateTo,dateFrom:req.body.data.dateFrom});
    }

    var chkInsCashOndate = function(rows){

      var count = rows[0].cnDate;
      var all = [];
      for (var i = 0; i <= count; i++) {

          all.push(
            chkCashonDate(rows[0].minDate,i)
          );
      }
      return q.all(all);
    }

    var chkCashonDate = function(date,day){
      var sql = " select id from cash_daily_on_date "
              + "where on_date =  CONVERT(:date, DATE) + INTERVAL :day DAY"

      return db.query(sql,{date:date,day:day}).then(function(rows) {
        if (rows.length==0) {
          insCashDailyOndate(date,day);
        }
      });
    }

    var insCashDailyOndate = function(date,day) {
      var sql = " insert into cash_daily_on_date (on_date) " +
                " values (CONVERT(:on_date, DATE) + INTERVAL :day DAY) "
      return db.query(sql, {on_date:date,day:day}).then(function(result) {
        result.insertId
      });
    }

    var checkCashDailyAllShop = function(){
      var sql = " select id,code from shop where is_active = 'YES' and is_sale = 'YES' "
//  console.log('query',sql);
      return db.query(sql);
    }

    var updateCashDailyAllShop = function(rows) {
      var all = [];

    //  console.log('rowUpdateCahdailyAllshop:',rows);
      for (var i = 0; i < rows.length; i++) {
          all.push(
            checkCashDaily(rows[i].id)
          );
        }
        return q.all(all);
    }

    var checkCashDaily = function(shop_id){
       var sql = " select cod.id ,on_date,cd.ID cd_id " +
                 " from cash_daily_on_date cod " +
                 "	left join cash_daily cd on cod.id = cd.cash_daily_on_date_id and cd.shop_id = :shop_id " +
                 " where cd.id is null "

       return db.query(sql,{shop_id:shop_id}).then(function(rows) {
         if (rows.length==0) {
           $scope.CashDaily = 0;
         } else {
           for (var i = 0; i < rows.length; i++) {
             if(rows[i].id !=null){
               insCashDaily(rows[i].id,shop_id,rows[i].on_date);
             }
           }
         }
       });
     }

     var insCashDaily = function(id,shop_id,onDate) {
       var sql = " insert into cash_daily (cash_daily_on_date_id,shop_id,cash_transfer,created_by) " +
                 " values (:id,:shop_id,0,0) "

       return db.query(sql, {id:id,shop_id:shop_id}).then(function(result) {
           insCashDailyOracle(result.insertId,shop_id,onDate);
       });
     }

     var insCashDailyOracle = function(cd_id,shop_id,date) {
       var sql = " insert into chkCashDailystatus (id,shop_id,on_date,cash_daily_id) " +
                 " values (chkCashDaily_ID.nextval,:shop_id,to_date(:on_date,'YYYY-MM-DD'),:cd_id) "
       return oraConn.query(oradb,sql, {shop_id:shop_id,on_date:date,cd_id:cd_id},true);
     }

     var chkCash = function(){
       var sql = " select cod.on_date,cd.ID id ,cd.shop_id "
               + " from cash_daily_on_date cod"
               + "	left join cash_daily cd on cd.cash_daily_on_date_id = cod.id"
               + " where shop_id = :shop_id"
               + " and cd.status in ('รอปิดกะ','เปิดให้แก้ไข')"
       return db.query(sql,{shop_id:req.body.keywords.shop_id});
     }

     var updateCashAllShop = function(rows) {

       var all = [];
       for (var i = 0; i < rows.length; i++) {

           all.push(getUpdateCashOnreport(rows[i].id,rows[i].shop_id,rows[i].on_date));
         }
         return q.all(all);
     }

     var getUpdateCashOnreport = function(cd_id,shop_id,onDate) {

       var sql = " select sum(nvl(amount,0)) sumAmount"
               + " from ("
               + "	select sum(nvl(amount,0)) amount"
               + "	from sell s "
               + "		left join sell_payment sd on sd.sell_id = s.id "
               + "	left join shop sh on sh.id = s.shop_id "
               + "		left join payment_option po on po.id = sd.payment_option_id "
               + "	where payment_option_id is not null "
               + " and to_date(to_char(s.sell_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:onDate,'YYYY-MM-DD')"
               + "	and payment_option_id = 1 "
               + "	and sh.mysqlshopid = :shop_id"
               + "	union all"
               + "	select sum(nvl(amount,0))*-1 amount"
               + "	 from returnx s "
               + "	left join returnx_payment sd on sd.return_id = s.id "
               + "	left join shop sh on sh.id = s.shop_id"
               + "	left join payment_option po on po.id = sd.payment_option_id"
               + "	where payment_option_id is not null"
               + "	and return_status = 'PAYMENT_INCORRECT' "
               + "	and to_date(to_char(s.return_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:onDate,'YYYY-MM-DD')  "
               + "	and payment_option_id = 1 "
               + "	and sh.mysqlshopid = :shop_id"
               + "	union all"
               + "	select sum(nvl(cash,0)) amount"
               + "	from income ic  "
               + "	 	 left join shop sh on sh.id = ic.shop_id "
               + "	 where cash is not null "
               + "	 and to_date(to_char(ic.income_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:onDate,'YYYY-MM-DD') "
               + "	and sh.mysqlshopid = :shop_id"
               + "	union all"
               + "	select sum(nvl(cash,0)) amount"
               + "	from payment ic "
               + "		 left join shop sh on sh.id = ic.shop_id "
               + "	where cash is not null "
               + "	and to_date(to_char(ic.pay_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:onDate,'YYYY-MM-DD') "
               + "	and sh.mysqlshopid = :shop_id"
               + "	union all"
               + "	select sum(nvl(cash,0)) *-1 amount"
               + "	from expense ic "
               + "	 left join shop sh on sh.id = ic.shop_id "
               + "	where cash is not null "
               + "	and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:onDate,'YYYY-MM-DD') "
               + "	and sh.mysqlshopid = :shop_id"
               + " ) a"

         return oraConn.query(oradb,sql, {shop_id:shop_id,onDate:onDate}).then(function(result){

           $scope.rows = {
             d: result.rows,
             f: result.metaData.map(function(fld) {
               return fld.name.toLowerCase();
             })
           };

           result.rows.forEach(function(row) {
               updateCashOnReport(row[0],cd_id);
           });
         });
     }

     var updateCashOnReport = function(amount,id){
       var sql = " update cash_daily "
               + " set cash_on_report = :amount "
               + " where id = :id "

       return db.query(sql,{id:id,amount:amount});
     }

    var chkUpdateDataAll = function(){
      var sql = " select cd.id id ,cd.status,cd.shop_id,cod.on_date "
              + " from cash_daily_on_date cod"
              + "	inner join cash_daily cd on cd.cash_daily_on_date_id = cod.id"
              + " where cod.on_date between :dateFrom and :dateTo "
              + " and cd.status = 'รอปิดกะ' "
        //      console.log('query:',sql,req.body.data.dateFrom,req.body.data.dateTo);
      return db.query(sql,{dateTo:req.body.data.dateTo,dateFrom:req.body.data.dateFrom});
    }

    var loopChkUpdateDataAll = function(rows){
      var all = [];
  //    console.log('loopDataAll:',rows);
      for (var i = 0; i < rows.length; i++) {
      //  console.log('dataAll:',i);
        if(rows[i].id !=null){
          all.push(
            Sell(rows[i].on_date,rows[i].shop_id,rows[i].id),
            Return(rows[i].on_date,rows[i].shop_id,rows[i].id),
            Income(rows[i].on_date,rows[i].shop_id,rows[i].id),
            Expense(rows[i].on_date,rows[i].shop_id,rows[i].id),
            Payment(rows[i].on_date,rows[i].shop_id,rows[i].id),
            Old(rows[i].on_date,rows[i].shop_id,rows[i].id)
          );
        }
      }

      return q.all(all);

    }

    var chkUpdateCashTransferAll = function(){
      var sql = " select cd.id id ,cd.status,cd.shop_id,cod.on_date "
              + " from cash_daily_on_date cod"
              + "	inner join cash_daily cd on cd.cash_daily_on_date_id = cod.id"
              + " where cod.on_date between :dateFrom and :dateTo "
              + " and cd.status = 'รอปิดกะ' "

      return db.query(sql,{dateTo:req.body.data.dateTo,dateFrom:req.body.data.dateFrom});
    }

    var loopChkUpdateCashTransferAll = function(rows){
      var all = [];

      for (var i = 0; i < rows.length; i++) {
        if(rows[i].id !=null){
          all.push(
            getCashTransferAll(rows[i].id)
          );
        }
      }

      return q.all(all);

    }

    var chkUpdateCashOnReportALL = function(){
      var sql = " select cd.id id ,cd.status,cd.shop_id,cod.on_date "
              + " from cash_daily_on_date cod"
              + "	inner join cash_daily cd on cd.cash_daily_on_date_id = cod.id"
              + " where cod.on_date between :dateFrom and :dateTo "
              + " and cd.status = 'รอปิดกะ' "

      return db.query(sql,{dateTo:req.body.data.dateTo,dateFrom:req.body.data.dateFrom});
    }

    var loopChkUpdateCashOnReportALL = function(rows){
      var all = [];

      for (var i = 0; i < rows.length; i++) {
        if(rows[i].id !=null){
          all.push(
            getCashOnReport(rows[i].id)
          );
        }
      }

      return q.all(all);

    }

    var getCashTransferAll = function(cd_id){
      var sql = " select sum(case when item_name in('ขาย','รับ','ค่างวด','ยกมา') "
              + " then ifnull(amount,0) else ifnull(amount,0) * -1 end) amount,receive_by "
              + " from cash_daily c "
              + "  join cash_daily_detail cd on cd.cash_daily_id = c.id "
              + " where c.id = :id "
              + " and c.status in('รอปิดกะ','เปิดให้แก้ไข') "
              + " and item_name <> 'ยอดนำส่ง'"
              + " group by cd.receive_by "

      return db.query(sql,{id:cd_id}).then(function(rows) {
    //    console.log('updateDetail :',rows.length);
        updateCashTransferAll(rows,cd_id);

      });
    }

    var updateCashTransferAll = function(resuts,cd_id){
      var all = [];

      if(resuts.length > 0){
        resuts.forEach(function(row) {
      //    console.log('total:')
          all.push(checkDailyDetail('ยอดนำส่ง',row.receive_by,row.amount,cd_id));
        });
      }
      return q.all(all);
    }

    var Sell = function(sellDate,shop_id,cd_id){
      var sql = " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid  mysqlpaymentoptionid"
              + " from sell s "
              + " left join sell_payment sd on sd.sell_id = s.id "
              + " left join shop sh on sh.id = s.shop_id"
              + " left join payment_option po on po.id = sd.payment_option_id"
              + " where payment_option_id <> '3'"
              + " and to_date(to_char(s.sell_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:sellDate,'yyyymmdd')"
              + " and sh.mysqlshopid = :shop_id"
              + " group by mysqlpaymentoptionid"
              + " union all"
              + " select sum(nvl(amount,0)) amount, 5 mysqlpaymentoptionid"
              + " from sell s "
              + " left join sell_payment sd on sd.sell_id = s.id "
              + " left join shop sh on sh.id = s.shop_id"
              + " left join payment_option po on po.id = sd.payment_option_id"
              + " where payment_option_id = '3'"
              + " and sd.ref_id = 321"
              + " and to_date(to_char(s.sell_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:sellDate,'yyyymmdd')"
              + " and sh.mysqlshopid = :shop_id"
              + " group by mysqlpaymentoptionid"
              + " union all"
              + " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid"
              + " from sell s "
              + " left join sell_payment sd on sd.sell_id = s.id "
              + " left join shop sh on sh.id = s.shop_id"
              + " left join payment_option po on po.id = sd.payment_option_id"
              + " where payment_option_id = '3'"
              + " and sd.ref_id <> 321"
              + " and to_date(to_char(s.sell_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:sellDate,'yyyymmdd')"
              + " and sh.mysqlshopid = :shop_id"
              + " group by mysqlpaymentoptionid"

       return oraConn.query(oradb, sql,{shop_id:shop_id,sellDate:sellDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
        //  console.log('sell :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('ขาย',row[1],row[0],cd_id);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var Return = function(returnDate,shop_id,cd_id){

        var sql = " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid "
                + " from returnx s "
                + " left join returnx_payment sd on sd.return_id = s.id "
                + " left join shop sh on sh.id = s.shop_id "
                + " left join payment_option po on po.id = sd.payment_option_id "
                + " where payment_option_id <> 3"
                + " and return_status = 'PAYMENT_INCORRECT' "
                + " and to_date(to_char(s.return_date,'yyyymmdd'),'yyyymmdd') = to_date(:returnDate,'yyyymmdd')  "
                + " and sh.mysqlshopid = :shop_id"
                + " group by po.mysqlpaymentoptionid"
                + " union all"
                + " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid "
                + " from returnx s "
                + " left join returnx_payment sd on sd.return_id = s.id "
                + " left join shop sh on sh.id = s.shop_id "
                + " left join payment_option po on po.id = sd.payment_option_id "
                + " where payment_option_id = 3"
                + " and ref_id = 321"
                + " and return_status = 'PAYMENT_INCORRECT' "
                + " and to_date(to_char(s.return_date,'yyyymmdd'),'yyyymmdd') = to_date(:returnDate,'yyyymmdd')  "
                + " and sh.mysqlshopid = :shop_id"
                + " group by po.mysqlpaymentoptionid"
                + " union all"
                + " select sum(nvl(amount,0)) amount, po.mysqlpaymentoptionid "
                + " from returnx s "
                + " left join returnx_payment sd on sd.return_id = s.id "
                + " left join shop sh on sh.id = s.shop_id "
                + " left join payment_option po on po.id = sd.payment_option_id "
                + " where payment_option_id = 3"
                + " and ref_id <> 321"
                + " and return_status = 'PAYMENT_INCORRECT' "
                + " and to_date(to_char(s.return_date,'yyyymmdd'),'yyyymmdd') = to_date(:returnDate,'yyyymmdd')  "
                + " and sh.mysqlshopid = :shop_id"
                + " group by po.mysqlpaymentoptionid"

       return oraConn.query(oradb, sql,{shop_id:shop_id,returnDate:returnDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
        //  console.log('return :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('คืน',row[1],row[0],cd_id);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var Income = function(incomeDate,shop_id,cd_id){

        var sql = " select sum(nvl(cash,0)) amount,'1' payment_option_id"
                + " from income ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cash is not null"
                + " and to_date(to_char(ic.income_date,'yyyymmdd'),'yyyymmdd') = to_date(:incomeDate,'yyyymmdd')"
                + " and sh.mysqlshopid = :shop_id"
                + " union all"
                + " select sum(nvl(cr_card,0)) amount,'3' payment_option_id "
                + " from income ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id <> 321"
                + " and to_date(to_char(ic.income_date,'yyyymmdd'),'yyyymmdd') = to_date(:incomeDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id "
                + " union all"
                + " select sum(nvl(cr_card,0)) amount,'5' payment_option_id "
                + " from income ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id = 321"
                + " and to_date(to_char(ic.income_date,'yyyymmdd'),'yyyymmdd') = to_date(:incomeDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id "
                + " union all "
                + " select sum(nvl(transfer,0)) amount,'2' payment_option_id"
                + " from income ic"
                + " 	 left join shop sh on sh.id = ic.shop_id"
                + " where transfer is not null "
                + " and to_date(to_char(ic.income_date,'yyyymmdd'),'yyyymmdd') = to_date(:incomeDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id"

       return oraConn.query(oradb, sql,{shop_id:shop_id,incomeDate:incomeDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
      //    console.log('income :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('รับ',row[1],row[0],cd_id);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var Expense = function(expenseDate,shop_id,cd_id){

        var sql = " select sum(nvl(cash,0)) amount,'1' payment_option_id"
                + " from expense ic "
                + " 	 left join shop sh on sh.id = ic.shop_id"
                + " where cash is not null "
                + " and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:expenseDate,'yyyymmdd')"
                + " and sh.mysqlshopid = :shop_id "
                + " union all "
                + " select sum(nvl(cr_card,0)) amount,'3' payment_option_id "
                + " from expense ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id <> 321"
                + " and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:expenseDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id"
                + " union all "
                + " select sum(nvl(cr_card,0)) amount,'5' payment_option_id "
                + " from expense ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id = 321"
                + " and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:expenseDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id"
                + " union all "
                + " select sum(nvl(transfer,0)) amount,'2' payment_option_id"
                + " from expense ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where transfer is not null "
                + " and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:expenseDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id"

       return oraConn.query(oradb, sql,{shop_id:shop_id,expenseDate:expenseDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
      //  console.log('expense :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('จ่าย',row[1],row[0],cd_id);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var Payment = function(paymentDate,shop_id,cd_id){

        var sql = " select sum(nvl(cash,0)) amount,'1' payment_option_id"
                + " from payment ic  "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cash is not null "
                + " and to_date(to_char(ic.pay_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:paymentDate,'yyyymmdd')"
                + " and sh.mysqlshopid = :shop_id "
                + " union all "
                + " select sum(nvl(cr_card,0)) amount,'3' payment_option_id "
                + " from payment ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id <> 321"
                + " and to_date(to_char(ic.pay_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:paymentDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id "
                + " union all "
                + " select sum(nvl(cr_card,0)) amount,'5' payment_option_id "
                + " from payment ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where cr_card is not null"
                + " and credit_card_id = 321"
                + " and to_date(to_char(ic.pay_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:paymentDate,'yyyymmdd') "
                + " and sh.mysqlshopid = :shop_id "
                + " union all "
                + " select sum(nvl(tranfer,0)) amount,'2' payment_option_id "
                + " from payment ic "
                + " 	 left join shop sh on sh.id = ic.shop_id "
                + " where tranfer is not null "
                + " and to_date(to_char(ic.pay_date,'ddmmyyyy'),'ddmmyyyy') = to_date(:paymentDate,'yyyymmdd')  "
                + " and sh.mysqlshopid = :shop_id"

       return oraConn.query(oradb, sql,{shop_id:shop_id,paymentDate:paymentDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
      //  console.log('Payment :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('ค่างวด',row[1],row[0],cd_id);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var Old = function(oldDate,shop_id,cd_id){
      var sql = " select sum(amount) amount , '11' payment_option_id "
              + " from ( "
              + "	select sum(nvl(amount,0)) *-1 amount"
              + "	from sell s"
              + "		 left join sell_payment sp on sp.sell_id = s.id"
              + "		 left join shop sh on sh.id = s.shop_id"
              + "	where sh.mysqlshopid = :shop_id"
              + "	and sp.payment_option_id = 6"
              + "    and to_date(to_char(s.sell_date,'ddmmyyyy'),'ddmmyyyy') < to_date(:oldDate,'yyyymmdd')   "
              + "	union all"
              + "	select sum(nvl(amount,0)) amount"
              + "	from returnx s"
              + "		 left join returnx_payment sp on sp.return_id = s.id"
              + "		 left join shop sh on sh.id = s.shop_id"
              + "	where sh.mysqlshopid = :shop_id"
              + "	and sp.payment_option_id = 6"
              + "    and to_date(to_char(s.return_date,'ddmmyyyy'),'ddmmyyyy') < to_date(:oldDate,'yyyymmdd')   "
              + "	union all"
              + "	select sum(nvl(amount,0) * nvl(qty,0)) amount "
              + "	from income ic"
              + "		 left join income_detail icd on icd.income_id = ic.id"
              + "		 left join shop sh on sh.id = ic.shop_id"
              + "	where"
              + "		 sh.mysqlshopid = :shop_id"
              + "		 and icd.account_type_id = 78"
              + "    and to_date(to_char(ic.income_date,'ddmmyyyy'),'ddmmyyyy') < to_date(:oldDate,'yyyymmdd')   "
              + "	union all"
              + "	select sum(nvl(amount,0) * nvl(qty,0)) *-1 amount "
              + "	from expense ic"
              + "		 left join expense_detail icd on icd.expense_id = ic.id"
              + "		 left join shop sh on sh.id = ic.shop_id"
              + "	where"
              + "		 sh.mysqlshopid = :shop_id"
              + "		 and icd.account_type_id = 78"
              + "    and to_date(to_char(ic.expense_date,'ddmmyyyy'),'ddmmyyyy') < to_date(:oldDate,'yyyymmdd')   "
              + "	)"


       return oraConn.query(oradb, sql,{shop_id:shop_id,oldDate:oldDate.replace(/-/ig,'')}).then(function(result) {
         $scope.rows = {
           d: result.rows,
           f: result.metaData.map(function(fld) {
             return fld.name.toLowerCase();
           })
         };

      //  $scope.return_detail = oraConn.convert(result)[0];
  //      console.log('Old :',result.rows.length);
          if(result.rows.length>0){
            result.rows.forEach(function(row) {
              checkDailyDetail('ยกมา',row[1],row[0],cd_id);
            });
          }
       }).catch(function(e){
          console.log(e);
       });
    }

    var checkDailyDetail = function(item,receiveBy,amount,cd_id){
      var sql = " select id from cash_daily_detail "
              + " where cash_daily_id = :cashDailyID "
              + " and item_name = :itemName "
              + " and receive_by = :receiveBy "
      return db.query(sql,{itemName:item,cashDailyID:cd_id,receiveBy:receiveBy}).then(function(rows) {
      //  console.log('chkDailyDetail :',rows.length);
          if(rows.length > 0){
              updateDailyDetail(amount,rows[0].id);
          }else{
              insertDailyDetail(amount,item,receiveBy,cd_id);
          }
      });
    }

    var updateDailyDetail = function(amount,id){
      var sql = " update cash_daily_detail "
              + " set amount = :amount "
              + " where id = :id "
      return db.query(sql,{id:id,amount:amount}).then(function(rows) {
      });
    }

    var insertDailyDetail = function(amount,itemName,receive_by,cd_id){
      var sql = " insert into cash_daily_detail (cash_daily_id,item_name,receive_by,created_by,amount) "
              + " values(:cashDailyID,:item_name,:receive_by,0,:amount) "

      return db.query(sql,{cashDailyID:cd_id,item_name:itemName,receive_by:receive_by,amount:amount}).then(function(rows) {
      });
    }

    var getCashOnReport = function(cd_id) {
      var sql = " select amount "
              + " from cash_daily_detail "
              + " where receive_by = 1 "
              + " and item_name = 'ยอดนำส่ง' "
              + " and cash_daily_id = :id"

      return db.query(sql,{id:cd_id }).then(function(rows) {
  //      console.log('getCashOnReport : ',rows.length);
        if(rows.length > 0) {
          updateCashOnReport(rows[0].amount,cd_id);
        }else{
          updateCashOnReport('0',cd_id);
        }

      });
    };

    var updateCashOnReport = function(amount,cd_id){
      var sql = " update cash_daily "
              + " set cash_on_report = :amount "
              + " where id = :id "
              + " and status in('รอปิดกะ','เปิดให้แก้ไข') "
            //    console.log('cash_daily:',amount);
      return db.query(sql,{id:cd_id,amount:amount}).then(function(rows) {
      });
    }

    var checkOldPendingTransfer = function(){
      var sql = "select cod2.on_date,cod2.id id,cd2.today_pending_transfer "
              + " from cash_daily cd "
              + " 	left join cash_daily_on_date cod on cd.cash_daily_on_date_id = cod.id "
              + " 	left join cash_daily_on_date cod2 on cod2.on_date = DATE_ADD(cod.on_date,INTERVAL -1 day) "
              + " 	left join cash_daily cd2 on cod2.id = cd2.cash_daily_on_date_id and cd2.shop_id = cd.shop_id "
              + " where cd.id = :id "
              + " and cd.status in('รอปิดกะ','เปิดให้แก้ไข')"
        return db.query(sql,{id:req.body.id }).then(function(rows) {
            if(rows.length!=0){
              updatePastday(rows[0].today_pending_transfer);
            }
        });
    }

    var updatePastday = function(amount){
      var sql = " update cash_daily set pastday_pending_transfer = :amount where id = :id"
      return db.query(sql,{id:req.body.id,amount:amount})
    }

    checkOndate()
    .then(chkInsCashOndate)
    .then(checkCashDailyAllShop)
    .then(updateCashDailyAllShop)
    .then(chkUpdateDataAll)
    .then(loopChkUpdateDataAll)
    .then(chkUpdateCashTransferAll)
    .then(loopChkUpdateCashTransferAll)
    .then(chkUpdateCashOnReportALL)
    .then(loopChkUpdateCashOnReportALL)
    .then(function() {
    // q.all([
    //   getDataMain()
    // ]).then(function() {
    oraConn.close(oradb);
    console.log('finish');
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


module.exports = router;
