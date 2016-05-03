var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var conn        = require('../../lib/db');
var oraConn     = require('../../lib/oracle');
var router      = express.Router();
var helper      = require('../../lib/helper');
var fs          = require('fs');
var nsReport    = require('../../lib/nsreport');
var xlsx        = require('node-xlsx');

var fields = {
  code:{name:'code'},
  name:{name:'name'}
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
  current_status:{name:"c.current_status"}
};

var receiptFields = {
  code:{name:'r.code'},
  system_date: {name:'r.system_date', type:'daterange'},
  pay_date: {name:'r.pay_date', type:'daterange'},
  product_detail: {name:'c.product_detail'},
  shop:{name:'sh.code'},
  shop_name:{name:'sh.name'},
  fullname:{name:'p.fullname'},
  pay_staff:{name:'s.display_name'},
  amount: {name:'r.amount', type:'number'}
};

router.post('/getContractList', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = conn.connect();
  var nation_id = req.body.nationid;
  var contract_id = req.body.contractid;
  var other = req.body.other;

    var getContractList = function() {
      var sql = " select c.id,c.code,c.sell_id,c.product_detail,c.balance,c.payment_price, c.from_system, c.current_status from contract c " +
                " inner join person p on c.cus_person_id = p.id " +
                " where c.product_detail <> '' and c.product_detail like concat('%', :other,'%')  ";
      if (nation_id != ''){
        sql +=    " and p.nationid=:id ";
      }
      if (contract_id != ''){
        sql +=    " and c.code=:code ";
      }
      sql +=    " order by c.id asc";
      return db.query(sql,{id:nation_id,code:contract_id,other:other}).then(function(rows) {
        $scope.contractlist = rows;
      });
    };

    var getPerson = function() {
      var sql = " select fullname,nationid,mobile from person where nationid=:id";
      return db.query(sql,{id:nation_id}).then(function(rows) {
        $scope.person = rows;
      });
    };

  var all = [
    getContractList(),
    getPerson()
  ];
  q.all(all).then(function() {
    res.send({
      status: true,
      data: {
        contractlist: $scope.contractlist,
        person: $scope.person
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/getContractDetail', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = conn.connect();
  var contract_code = req.body.contractid;

    var getContractDetail = function() {
      var sql = " select id, sell_id, balance, code, from_system, product_detail, status_discount, finance_staff_id, type, sell_staff_id " +
                " from contract " +
                " where code = :code ";
      return db.query(sql,{code:contract_code}).then(function(rows) {
        $scope.contractdetail = rows;
      });
    };

  var all = [
    getContractDetail()
  ];
  q.all(all).then(function() {
    res.send({
      status: true,
      data: {
        contractdetail: $scope.contractdetail
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });

});

router.post('/paymentOptionList', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = conn.connect();

  var getPaymentOption = function() {
    var sql = "SELECT id, name FROM payment_option where on_receipt='YES' ";
    return db.query(sql).then(function(rows) {
      $scope.paymentoption = rows;
    });
  };

  var all = [
    getPaymentOption()
  ];
  q.all(all).then(function() {
    res.send({
      status: true,
      data: {
        paymentoption: $scope.paymentoption
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });

});

router.post('/getPaymentTerm', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var contract_id = req.body.contractid;
  var sell_id = req.body.sellid;
  //console.log('jack');

  var getContract = function(){
    var sql = " select p.term_num,p.due_date,p.paid_date,p.due_amount,p.paid_amount, " +
              " case when p.paid_amount <> '0.00' then cast((p.due_amount - p.paid_amount) as char) " +
              " else '-' end balance, " +
              " case when p.due_date <= p.paid_date then concat('(',DATEDIFF(paid_date,due_date),')')   " +
              " when p.due_date < now() and p.paid_date='0000-00-00' then concat('(',DATEDIFF(now(),due_date) ,')')  " +
              " else '' end diffday, " +
              " p.discount " +
              " from payment_term p " +
              " inner join contract c on p.contract_id = c.id and p.sell_id = c.sell_id " +
              " where c.id = :id and p.status = 'ACTIVE' order by p.term_num asc ";
    return db.query(sql,{id:contract_id}).then(function(rows){
      $scope.contract = rows;
    });
  };

  var getMaxPaid = function(){
    var sql = " select max(paid_date) paid_date from payment_term where contract_id =:id ";
    return db.query(sql,{id:contract_id}).then(function(rows){
      $scope.max_paiddate = rows[0].paid_date;
    });
  };

  var checkOndate = function() {
    var sql = " select cd.status "
              +" from cash_daily_on_date cod "
              +" left join cash_daily cd on cd.cash_daily_on_date_id = cod.id "
              +" where shop_id = :shop_id "
              +" and cod.on_date = CURDATE() ";

    return db.query(sql,{shop_id:req.session.data.shop.id,date:req.body.selectDate}).then(function(rows) {

      if (rows.length===0) {
        $scope.flagSave = true;
      }else{

        if (rows[0].status == 'รอปิดกะ' || rows[0].status == 'เปิดให้แก้ไข') {
          $scope.flagSave = false;
        }else{
          $scope.flagSave = true;
        }
      }
    });
  }

  q.all([
    getMaxPaid(),
    getContract(),
    checkOndate()
  ]).then(function(){
    res.send({
      status:true,
      data: {
        contract: $scope.contract,
        max_paiddate: $scope.max_paiddate,
        flagSave: $scope.flagSave
      }
    });
  }).catch(function(e){
    console.log(e);
    res.send({
      status:false,
      error:e
    });
  });

});

router.post('/savePayment', [bodyParser.json()], function(req, res) {

  oraConn.connect().then(function(oradb) {
    var $scope = {};
    $scope.close_contract = 'NORMAL';
    var total_amount = req.body.amount;

    var getShopID = function(){
      var sql = "select prefix_barcode from shop where id = :shop_id "
      return db.query(sql,{shop_id:req.body.shop_id}).then(function(rows) {
        if (rows.length===0) {
          throw 'shop.error.shop_id_not_found';
        }
        $scope.prefix_code = rows[0].prefix_barcode + '-RC' + req.body.code_year + '/' ;
      });
    }

    var selectMaxCode = function(){
      console.log($scope.prefix_code);
      var sql = "select max(code) code from receipt where code like concat(:prefix,'%')"
      console.log(sql);
      return db.query(sql,{prefix:$scope.prefix_code}).then(function(rows) {
        console.log(rows);
        if (rows[0].code == null) {
          $scope.running = '1';
          $scope.running = '0000000000000000' + $scope.running;
        }else{
          $scope.running = parseInt(rows[0].code.substring(11,15)) + 1;
          $scope.running = '0000000000000000' + $scope.running.toString();
        }
        $scope.runningCode = $scope.prefix_code + $scope.running.substr($scope.running.length-4)
      });

    }

    var insertReceipt = function() {

      req.body.runningCode = $scope.runningCode;

      var sql = " insert into receipt(code,payment_type,pay_date,shop_id,ref,company_id,amount,pay_staff,penalty,finance_staff,remark,payment_option) "
          + " values(:runningCode, :payment_type, :pay_date, :shop_id, :contract_id, :company_id, :amount, :pay_staff, :penalty, :finance_staff, :receipt_remark, :receipt_option) ";

      return db.query(sql, req.body).then(function(res) {
        $scope.receipt_id = res.insertId;
      });
    }

    var insertListReceipt = function(){

      var all = [];
      var allOracel = [];
      var debit = req.body.balance;
      //console.log(req.body.receipt_item.length);
      for (var i = 0; i < req.body.receipt_item.length; i++) {

        var cash = 0;
        var credit = 0;
        var tranfer = 0;
        debit = (debit - req.body.receipt_item[i].amount);

        if (req.body.receipt_item[i].payment_option_id == '1'){
          cash = req.body.receipt_item[i].amount;
        }else if (req.body.receipt_item[i].payment_option_id == '2'){
          tranfer = req.body.receipt_item[i].amount;
        }else{
          credit = req.body.receipt_item[i].amount;
        }

        all.push(insertDataReceiptItem(i));

      }
      return q.all(all);

    }

    var insertListPaymentOracle = function(){

      var all = [];
      var debit = req.body.balance;
      //console.log(req.body.receipt_item.length);
      for (var i = 0; i < req.body.receipt_item.length; i++) {

        var cash = 0;
        var credit = 0;
        var tranfer = 0;
        debit = (debit - req.body.receipt_item[i].amount);

        if (req.body.receipt_item[i].payment_option_id == '1'){
          cash = req.body.receipt_item[i].amount;
        }else if (req.body.receipt_item[i].payment_option_id == '2'){
          tranfer = req.body.receipt_item[i].amount;
        }else{
          credit = req.body.receipt_item[i].amount;
        }

        // if (req.body.from_system == 'ORACLE'){
          all.push(insertPayment_Oracle(i,cash,credit,tranfer,debit,$scope.runningCode));
        //}
      }
      //console.log('array =' + all);
      return q.all(all);

    }

    var insertDataReceiptItem = function(i) {

      req.body.receipt_item[i].receipt_id = $scope.receipt_id;
      req.body.receipt_item[i].pay_date = req.body.pay_date;
      req.body.receipt_item[i].pay_staff = req.body.pay_staff;
      req.body.receipt_item[i].shop_id = req.body.shop_id;
      req.body.receipt_item[i].company_id = req.body.company_id;
      req.body.receipt_item[i].sell_id = req.body.sell_id;
      req.body.receipt_item[i].contract_id = req.body.contract_id;

      var sql = "insert into receipt_item(receipt_id,pay_date,pay_staff,shop_id,company_id,sell_id,amount,payment_option_id,penalty,remark,contract_id) "
        + " VALUES (:receipt_id, :pay_date, :pay_staff, :shop_id, :company_id, :sell_id, "
        + ":amount, :payment_option_id, :penalty, :remark, :contract_id) ";
        console.log(sql);
      return db.query(sql, req.body.receipt_item[i]);
    }

    var getContractUpdate = function(){

      var sql = " select p.id row_id,p.term_num,p.due_date,p.paid_date,p.due_amount,p.paid_amount, " +
                " p.paid_status, p.term_status, p.close_status, c.balance, p.cost_term " +
                " from payment_term p " +
                " inner join contract c on p.contract_id = c.id and p.sell_id = c.sell_id " +
                " where c.id = :id and p.term_status not in ('WAIT_PAID','OVERDUE_PAID') " +
                " and p.status = 'ACTIVE' order by p.term_num asc ";
                //console.log(sql);
      return db.query(sql,{id:req.body.contract_id});
    }

    var updatePaymentTerm = function(id, amount,status,paid_on,close_status,discount) {
      console.log('update');
      var sql = "UPDATE payment_term SET paid_date=:paid_on, paid_amount=(paid_amount + :amount), term_status=:status, close_status=:close_status, discount=:discount WHERE id=:id";
      //console.log('id=', id, ', amount=', amount, ', status=', status, ', paid_date=', paid_on);
      return db.query(sql, {id: id, amount:amount, status:status, paid_on:paid_on, close_status:close_status, discount:discount });
    }

    var getCostTerm = function() {
      var sql = "select cost_term form payment_term where contract_id=:id limit 1 "
      return db.query(sql,{id:req.body.contract_id}).then(function(rows) {
        if (rows.length===0) {
          throw 'term.error.cost_term_not_found';
        }
        $scope.cost_term = rows[0].cost_term ;
      });
    }

    var updateAllPaymentTerm = function(rows) {
      var all = [];
      var costTerm = 0.00;
      //var balance = total_amount;
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

          if (req.body.status_discount == 'Y'){
            discount = rows[i].balance;
            costTerm = (costTerm - discount);
          }

          all.push(insertTermReceipt(id, pay, cost, balance));
          all.push(updatePaymentTerm(id, pay, status,req.body.pay_date,close_status,discount));
        }
      }
      $scope.cost_term = costTerm;
      return q.all(all);
    }

    var updateCostTerm = function() {
      var sql = "UPDATE receipt SET cost_term=:cost_term WHERE id=:id";
      return db.query(sql, {id: $scope.receipt_id, cost_term:$scope.cost_term });
    }

    var insertTermReceipt = function(term_id,amount,cost,balance){

      var sql = "insert into term_receipt(payment_term_id,receipt_id,amount,cost,balance) "
          + " values(:term_id, :receipt_id, :amount, :cost, :balance) ";

      return db.query(sql, {term_id:term_id,receipt_id:$scope.receipt_id,amount:amount,cost:cost,balance:balance});

    }

    var getBalanceAmount = function(){
      var sql = "select balance from contract where id = :id "
      return db.query(sql,{id:req.body.contract_id}).then(function(rows) {
        if (rows.length===0) {
          throw 'contract.error.contract_id_not_found';
        }
        $scope.contract_balance = (rows[0].balance - parseFloat(req.body.amount));
        if ($scope.contract_balance <= 0){
          $scope.close_contract = 'CLOSE_NORMAL';
          $scope.close_contract_date = req.body.pay_date;
          //req.session.data.staff.cur_date;
        }else{
          $scope.close_contract = 'NORMAL';
          $scope.close_contract_date = '0000-00-00';
        }
      });
    }

    var updateContract = function() {
      var sql = " UPDATE contract SET balance=(balance - :amount), total_paid=(total_paid + :amount) "
                + ", current_status=:status, status_discount=:status_discount, last_paid=:last_paid, close_date = :system_date WHERE id=:id ";
      return db.query(sql, {id: req.body.contract_id, amount:req.body.amount
                            , status:$scope.close_contract
                            , status_discount:req.body.status_discount
                            , last_paid:req.body.pay_date
                            , system_date:$scope.close_contract_date});
    }

    var updateSell_Oracle = function() {
      var sql = "UPDATE sell SET status='PASS' WHERE id=:id";
      return oraConn.query(oradb, sql, {id:req.body.sell_id},true);
    }

    var insertPayment_Oracle = function(i,cash,credit,tranfer,debit,receipt_code) {

      req.body.receipt_item[i].receipt_id = $scope.receipt_id;
      req.body.receipt_item[i].pay_date = req.body.pay_date;
      req.body.receipt_item[i].pay_staff = req.body.pay_staff;
      req.body.receipt_item[i].shop_id = req.body.shop_id;
      req.body.receipt_item[i].company_id = req.body.company_id;
      req.body.receipt_item[i].sell_id = req.body.sell_id;
      req.body.receipt_item[i].contract_id = req.body.contract_id;

      var sql = " insert into payment(id,pay_date,pay_staff,shop_id,company_id,sell_id,cash,cr_card,tranfer,remark,debit,mysql_receipt_code,credit_card_id,period_no) " +
                " values((PAYMENT_ID.NEXTVAL),TO_DATE('"+req.body.receipt_item[i].pay_date+"','YYYY-MM-DD'), (select id from staff where mysqlviewstaffid = :staff_id and mysqlviewshopid = :shop_id and active='Y') " +
                " ,(select id from shop where mysqlshopid = :shop_id) " +
                " ,(select company_id from sell where id = :sell_id) " +
                " ,:sell_id,:cash,:credit,:tranfer,:remark " +
                " ,:debit,:receipt_code " +
                " ,(select id from credit_card where mysqlpaymentoptionid = :payment_option_id) " +
                " ,(select count(id) + 1 rowno from payment where sell_id = :sell_id)) ";
      console.log(req.body.receipt_item[i].pay_date);
      return oraConn.query(oradb, sql,{
        staff_id:req.body.receipt_item[i].pay_staff,
        shop_id:req.body.receipt_item[i].shop_id,
        sell_id:req.body.receipt_item[i].sell_id,
        cash:cash,
        credit:credit,
        tranfer:tranfer,
        remark:req.body.receipt_item[i].remark,
        debit:debit,
        receipt_code:receipt_code,
        payment_option_id:req.body.receipt_item[i].payment_option_id
      },true);
    }

    var selectMaxCodeIncome = function(){
      //console.log($scope.prefix_code);
      var sql = "select nvl(substr(max(income_no),length(max(income_no))-3,4)+1,1) income_no from income where income_no like concat(:prefix,'%') "
      console.log(sql);
      console.log(req.body.code_year_oracle);
      return oraConn.query(oradb, sql, {prefix:req.body.code_year_oracle}).then(function(result) {
        $scope.running_oracle = result.rows[0][0];
        console.log($scope.running_oracle);
        if ($scope.running_oracle == '') {
          $scope.running_oracle = '1';
          $scope.running_oracle = '0000000000000000' + $scope.running_oracle;
        }else{
          console.log($scope.running_oracle);
          //$scope.running_oracle = parseInt($scope.running_oracle.substring(11,15));
          $scope.running_oracle = '0000000000000000' + $scope.running_oracle.toString();
        }

        $scope.running_oracle = req.body.code_year_oracle + $scope.running_oracle.substr($scope.running_oracle.length-4)
          console.log($scope.running_oracle);
      });

    }

    var getNextVal = function() {
      var sql = 'select in_id.nextval from dual ';
      return oraConn.query(oradb, sql, {}).then(function(result) {
        $scope.income_nextval = result.rows[0][0];
      });
    }

    var insertIncome = function() {

      var cash = 0;
      var credit = 0;
      var tranfer = 0;
      var mydate='';
      var penalty = 0;
      var remark = 'ชื่อ ' +  req.body.cust_name;

      for (var i = 0; i < req.body.receipt_item.length; i++) {

        if (i == 0){
          mydate = req.body.receipt_item[i].pay_date;
        }
        penalty += parseFloat(req.body.receipt_item[i].penalty);
        remark = remark + ',' + req.body.receipt_item[i].remark;
        if (req.body.receipt_item[i].payment_option_id == '1'){
          cash += (parseFloat(req.body.receipt_item[i].amount));
        }else if (req.body.receipt_item[i].payment_option_id == '2'){
          tranfer += (parseFloat(req.body.receipt_item[i].amount));
        }else{
          credit += (parseFloat(req.body.receipt_item[i].amount));
        }
      }

      if(penalty != 0){
          remark = remark + ',ค่าปรับ ' + penalty;
      }

      var sql = " insert into income(id,system_date,system_staff,income_date,income_no,shop_id,ref_id,ref_type,name,address,remark,status,cash,cr_card,transfer,MYSQL_RECEIPT_CODE) "
          + " values(:id, SYSDATE, (select id from staff where mysqlviewstaffid = :staff_id and mysqlviewshopid = :shop_id and active='Y') "
          + ", TO_DATE('"+mydate+"','YYYY-MM-DD'), :income_no "
          + ", (select id from shop where mysqlshopid = :shop_id), '137896', 'CUSTOMER' "
          + ",(select name from company where id = 137896), (select address from company where id = 137896) "
          + ", :remark, 'ACTIVE', :cash, :cr_card, :transfer, :receipt_code) ";

          return oraConn.query(oradb, sql, {id:$scope.income_nextval,
            staff_id:req.body.pay_staff,
            shop_id:req.body.shop_id,
            //  pay_date:mydate,
            income_no:$scope.running_oracle,
            // contract_id:req.body.contract_id,
            remark:remark,
            cash:cash,
            cr_card:credit,
            transfer:tranfer,
            receipt_code:$scope.runningCode
          },true);
    }

    var insertIncomeDetail = function() {
      var sql = " insert into income_detail(id,income_id,account_type_id,account_desc,document_ref,description,amount,qty,MYSQL_RECEIPT_CODE) " +
                " values((IN_DETAIL_ID.NEXTVAL),:income_id,'60','รับชำระสินค้า',:contract_id,:description,:amount,'1',:receipt_code)";
      return oraConn.query(oradb, sql, {income_id:$scope.income_nextval,
        contract_id:req.body.contract_id,
        description:req.body.description,
        amount:req.body.amount,
        receipt_code:$scope.runningCode
      },true);
    }

    var insertIncome_Penalty = function() {

      var cash = 0;
      var credit = 0;
      var tranfer = 0;
      var mydate='';
      var penalty = 0;
      var remark = '';

      for (var i = 0; i < req.body.receipt_item.length; i++) {
        if (i == 0){
          mydate = req.body.receipt_item[i].pay_date;
        }
        //penalty += parseFloat(req.body.receipt_item[i].penalty);
        $scope.remark_income = 'ค่าปรับ ' + req.body.penalty + ' ชื่อ ' + req.body.cust_name + ' สัญญา:' + req.body.contract_code;
        if (req.body.receipt_item[i].payment_option_id == '1'){
          cash += (parseFloat(req.body.receipt_item[i].penalty));
        }else if (req.body.receipt_item[i].payment_option_id == '2'){
          tranfer += (parseFloat(req.body.receipt_item[i].penalty));
        }else{
          credit += (parseFloat(req.body.receipt_item[i].penalty));
        }
      }

      var sql = " insert into income(id,system_date,system_staff,income_date,income_no,shop_id,ref_id,ref_type,name,address,remark,status,cash,cr_card,transfer,MYSQL_RECEIPT_CODE) "
          + " values(:id, SYSDATE, (select id from staff where mysqlviewstaffid = :staff_id and mysqlviewshopid = :shop_id and active='Y') "
          + ", TO_DATE('"+mydate+"','YYYY-MM-DD'), :income_no "
          + ", (select id from shop where mysqlshopid = :shop_id), '137896', 'CUSTOMER' "
          + ",(select name from company where id = 137896), (select address from company where id = 137896) "
          + ", :remark, 'ACTIVE', :cash, :cr_card, :transfer, :receipt_code) ";

          return oraConn.query(oradb, sql, {id:$scope.income_nextval,
            staff_id:req.body.pay_staff,
            shop_id:req.body.shop_id,
            // pay_date:mydate,
            income_no:$scope.running_oracle,
            // contract_id:req.body.contract_id,
            remark:$scope.remark_income,
            cash:cash,
            cr_card:credit,
            transfer:tranfer,
            receipt_code:$scope.runningCode
          },true);
    }

    var insertIncomeDetail_Penalty = function() {
      var sql = " insert into income_detail(id,income_id,account_type_id,account_desc,document_ref,description,amount,qty,MYSQL_RECEIPT_CODE) " +
                " values((IN_DETAIL_ID.NEXTVAL),:income_id,'60','รับชำระสินค้า',:contract_id,:description,:amount,'1',:receipt_code)";
      return oraConn.query(oradb, sql, {income_id:$scope.income_nextval,
        contract_id:req.body.contract_id,
        description:$scope.remark_income,
        amount:req.body.penalty,
        receipt_code:$scope.runningCode
      },true);
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

    var insertPaymentHistory = function(){
      var sql = " INSERT INTO payment_term (contract_id, term_num, due_date, due_amount, paid_date, paid_amount "
              + " , paid_status, due_status, term_status, close_status, ref_payment_codes, remark, is_active "
              + " , created_at, created_by, updated_at, updated_by, discount, sell_id, cost_term) "
              + " SELECT contract_id, term_num, due_date, due_amount, paid_date, paid_amount "
              + " , paid_status, due_status, term_status, close_status, ref_payment_codes, remark, is_active "
              + " , created_at, created_by, updated_at, updated_by, discount, :sell_id sell_id, cost_term "
              + " FROM   payment_term p "
              + " WHERE  contract_id = :id and status = 'ACTIVE' " ;
      return db.query(sql, {id: req.body.contract_id,sell_id:$scope.sell_nextval}).then(function(){
        console.log('insertPaymentHistory success');
      });
    }

    var updatePaymentTermHistory = function(){
      var sql = "update payment_term set status='INACTIVE' where contract_id=:id and sell_id=:sell_id ";
      return db.query(sql, {id: req.body.contract_id,sell_id:req.body.sell_id}).then(function(){
        console.log('updatePaymentTermHistory succsess');
        req.body.sell_id = $scope.sell_nextval;
      });
    }

    var updateNewSellID = function(){
      console.log('updateNewSellID');
      var sql = "update contract set sell_id=:sell_id where id=:id ";
      return db.query(sql, {id: req.body.contract_id,sell_id:$scope.sell_nextval});
    }

    var getNextValSell = function() {
      console.log('getNextValSell');
      var sql = 'select sell_id.nextval from dual ';
      return oraConn.query(oradb, sql, {}).then(function(result) {
        $scope.sell_nextval = result.rows[0][0];
        console.log('getNextValSell=',$scope.sell_nextval);
      });
    }

    var getSellData = function(){
      console.log('getSellData');
      var sql = " select * from sell where id=:id";
      return oraConn.query(oradb, sql, {id:req.body.sell_id}).then(function(result){
        $scope.sell_data = oraConn.convert(result);
      });
    }

    var insertSellData = function(){
      console.log('insertSellData');
      var _Remark = 'ไถ่ถอนสินค้า เลขที่สัญญา ' + req.body.contract_code + ' ยอดรับ ' + req.body.amount +  ' บาท ค่าปรับ ' + req.body.penalty + ' บาท';

      var sql = " insert into sell (id,sell_date,sell_staff,shop_id "
                +" ,company_id,remark,status,cash,receipt_no,frequency,sales_staff_id,sell_type) "
                +" values(:id,SYSDATE,:sell_staff,:shop_id"
                +"  ,:company_id,:remark,:status,'0',:receipt_no,'1',:sales_staff_id,'REDEEM') ";
      return oraConn.query(oradb, sql,{
          id:$scope.sell_nextval,
          sell_staff:$scope.sell_data[0].sell_staff,
          shop_id:$scope.sell_data[0].shop_id,
          company_id:$scope.sell_data[0].company_id,
          remark:_Remark,
          status:$scope.sell_data[0].status,
          receipt_no:$scope.sell_data[0].receipt_no,
          sales_staff_id:$scope.sell_data[0].sales_staff_id
        },true);
    }

    var getSellDetailData = function(){
      console.log('getSellDetailData');
      var sql = " select ss.product_id, ss.company_id, ss.shop_id, ss.barcode "
                +" ,ss.serial, ss.spec, 0 cost, 0 price, 0 vat, ss.status "
                +" ,rd.qty ,ss.qty_yn, 0 installation_cost, 'N' installation_yn "
                +" ,'N' from_return,ss.cost_type, 0 po_cost "
                +" from stock_shop ss inner join returnx_detail rd "
                +" on ss.BARCODE = rd.barcode "
                +" inner join returnx r on r.id = rd.return_id "
                +" where r.sell_id = :sell_id ";
      return oraConn.query(oradb, sql, {sell_id:req.body.sell_id}).then(function(result) {
        $scope.sell_data_detail = oraConn.convert(result);
        //req.body.sell_id = $scope.sell_nextval;
      });
    }

    var genInsertSellDetail = function(){
      console.log('genInsertSellDetail num = ',$scope.sell_data_detail.length);
      var all=[];
      for (var i = 0; i < $scope.sell_data_detail.length; i++) {
        all.push(insertSellDetailData(i));
      }
      return q.all;
    }

    var insertSellDetailData = function(i){
      var sql = "insert into sell_detail (id,sell_id,product_id,company_id,shop_id,barcode "
                +" ,serial,spec,cost,price,vat,status,qty,qty_yn,installation_cost,installation_yn "
                +" ,from_return,cost_type,po_cost) "
                +" values(  "
                +"  (selldetail_id.NEXTVAL),:sell_id,:product_id,:company_id,:shop_id,:barcode  "
                +"  ,:serial,:spec,:cost,:price,:vat,:status,:qty,:qty_yn,:installation_cost,:installation_yn "
                +" ,:from_return,:cost_type,:po_cost) ";
      return oraConn.query(oradb, sql,{
          sell_id:$scope.sell_nextval,
          product_id:$scope.sell_data_detail[i].product_id,
          company_id:$scope.sell_data_detail[i].company_id,
          shop_id:$scope.sell_data_detail[i].shop_id,
          barcode:$scope.sell_data_detail[i].barcode,
          serial:$scope.sell_data_detail[i].serial,
          spec:$scope.sell_data_detail[i].spec,
          cost:$scope.sell_data_detail[i].cost,
          price:$scope.sell_data_detail[i].price,
          vat:$scope.sell_data_detail[i].vat,
          status:$scope.sell_data_detail[i].status,
          qty:$scope.sell_data_detail[i].qty,
          qty_yn:$scope.sell_data_detail[i].qty_yn,
          installation_cost:$scope.sell_data_detail[i].installation_cost,
          installation_yn:$scope.sell_data_detail[i].installation_yn,
          from_return:$scope.sell_data_detail[i].from_return,
          cost_type:$scope.sell_data_detail[i].cost_type,
          po_cost:$scope.sell_data_detail[i].po_cost
        },true);
    }

    var insertSellPayment = function(){

      var sql = " insert into sell_payment(id,sell_id,payment_option_id,amount) "
                +" values((SELLPAYMENT_ID.NEXTVAL),:sell_id,'1','0')";
      return oraConn.query(oradb, sql,{
          sell_id:$scope.sell_nextval
        },true).then(function(){
        console.log('insertSellPayment success');
        });
    }

    var getBarcodeReturn = function(){
        console.log('getBarcodeReturn');
        var sql = " select rd.id,rd.barcode,rd.qty,rd.qty_yn,r.id return_id from returnx_detail rd "
                  +" inner join returnx r on r.id = rd.return_id "
                  +" where r.sell_id = :sell_id and r.finance_used = 'N' order by rd.barcode asc ";
        return oraConn.query(oradb, sql, {sell_id:req.body.sell_id}).then(function(result) {
          $scope.barcode_return = oraConn.convert(result);
        });
    }

    var getBarcodeStockShop = function(){
        console.log('getBarcodeStockShop');
        var sql = " select s.id,  "
                  +" s.product_id,s.company_id,s.shop_id,s.date_in,:ref_id ref_id,'SALES' ref_master "
                  +" ,s.barcode,s.serial,s.spec,s.cost,s.price,s.vat,s.status,'N' app,s.qty,s.qty_yn "
                  +" ,s.po_cost,s.cost_type "
                  +" from stock_shop s "
                  +" inner join returnx_detail rd on s.barcode = rd.barcode "
                  +" inner join returnx r on r.id = rd.return_id "
                  +" where r.sell_id = :sell_id and r.finance_used = 'N' order by rd.barcode asc ";
        return oraConn.query(oradb, sql, {sell_id:req.body.sell_id,ref_id:$scope.sell_nextval}).then(function(result) {
          $scope.barcode_stockshop = oraConn.convert(result);
          console.log('sellid=',req.body.sell_id);
          console.log('newsellid=',$scope.sell_nextval);
          console.log('success=',$scope.barcode_stockshop);
        });
    }

    var moveStock = function(){
      console.log('moveStock');
      var all=[];
      for (var i = 0; i < $scope.barcode_return.length; i++) {
        if (i == 0){
          $scope.return_id = $scope.barcode_return[i].return_id;
        }

        if($scope.barcode_return[i].qty_yn != 'Y'){
          all.push(deleteStockshop($scope.barcode_return[i].barcode));
        }else{
          var qtyReturn = parseInt($scope.barcode_return[i].qty);
          var qtyStock = parseInt($scope.barcode_stockshop[i].qty);
          if ((qtyStock-qtyReturn)==0) {
            all.push(deleteStockshop($scope.barcode_return[i].barcode));
          }else{
            all.push(updateStockshop($scope.barcode_return[i].barcode,$scope.barcode_return[i].barcode));
          }
        }
        all.push(insertStockCus(i));
      }
      return q.all;
    }

    var deleteStockshop = function(barcode){
      console.log('deleteStockshop');
      var sql = " delete from stock_shop where barcode = :barcode ";
      return oraConn.query(oradb, sql,{
          barcode:barcode
        },true);
    }

    var updateStockshop = function(barcode,qty){
      console.log('updateStockshop');
      var sql = " update stock_shop set qty=(qty - :qty) where barcode = :barcode ";
      return oraConn.query(oradb, sql,{
          qty:qty,
          barcode:barcode
        },true);
    }

    var insertStockCus = function(i){
      console.log('insertStockCus,=',$scope.barcode_stockshop);
      var sql = " insert into stock_cus(id,product_id,company_id,shop_id,date_in,ref_id,ref_master "
                +" ,barcode,serial,spec,cost,price,vat,status,app,qty,qty_yn "
                +" ,po_cost,cost_type) "
                +" values((STOCKCUS_ID.NEXTVAL),:product_id,:company_id,:shop_id,SYSDATE,:sell_id,'SALES' "
                +" ,:barcode,:serial,:spec,:cost,:price,:vat,:status,'N',:qty,:qty_yn "
                +" ,:po_cost,:cost_type)";
      return oraConn.query(oradb, sql,{
          product_id:$scope.barcode_stockshop[i].product_id,
          company_id:$scope.barcode_stockshop[i].company_id,
          shop_id:$scope.barcode_stockshop[i].shop_id,
          sell_id:$scope.sell_nextval,
          barcode:$scope.barcode_stockshop[i].barcode,
          serial:$scope.barcode_stockshop[i].serial,
          spec:$scope.barcode_stockshop[i].spec,
          cost:$scope.barcode_stockshop[i].cost,
          price:$scope.barcode_stockshop[i].price,
          vat:$scope.barcode_stockshop[i].vat,
          status:$scope.barcode_stockshop[i].status,
          qty:$scope.barcode_stockshop[i].qty,
          qty_yn:$scope.barcode_stockshop[i].qty_yn,
          po_cost:$scope.barcode_stockshop[i].po_cost,
          cost_type:$scope.barcode_stockshop[i].cost_type
        },true);
    }

    var updateReturnUsed = function(){
      console.log('updateReturnUsed');
      var sql = " update returnx set finance_used='Y' where id = :id ";
      return oraConn.query(oradb, sql,{
          id:$scope.return_id
        },true);
    }

    var db = conn.connect();

    db.beginTransaction()
      .then(function(){
        if (req.body.flagRedeem == 'Y'){
          return getNextValSell()
              .then(getSellData)
              .then(insertSellData)
              .then(getSellDetailData)
              .then(genInsertSellDetail)
              .then(insertSellPayment)
              .then(getBarcodeReturn)
              .then(getBarcodeStockShop)
              .then(moveStock)
              .then(insertContractHistory)
              .then(insertPaymentHistory)
              .then(updatePaymentTermHistory)
              .then(updateNewSellID)
              .then(updateReturnUsed)
        }
      }).then(getShopID)
      .then(selectMaxCode)
      .then(insertReceipt)
      .then(insertListReceipt)
      .then(getBalanceAmount)
      .then(updateContract)
      .then(getContractUpdate)
      .then(updateAllPaymentTerm)
      .then(updateCostTerm)
      .then(function() {
        db.commit();
        // console.log('commit');
        // console.log(db.commit);
        if ($scope.close_contract == 'CLOSE_NORMAL' && req.body.from_system == 'ORACLE') {
          return q.all([
            updateSell_Oracle()
          ]);
        }
      }).then(function(){
        if(req.body.from_system == 'ORACLE'){
          return insertListPaymentOracle()
        }else{
          return getNextVal()
          .then(selectMaxCodeIncome)
          .then(insertIncome)
          .then(insertIncomeDetail)
        }
      }).then(function(){
        if(req.body.penalty != '0'){
          return getNextVal()
          .then(selectMaxCodeIncome)
          .then(insertIncome_Penalty)
          .then(insertIncomeDetail_Penalty)
        }
      }).then(function(){
        oraConn.close(oradb);
        res.send({
          status:true,
          data: {
              receipt_id:$scope.receipt_id
          }
        });
      }).catch(function(e) {
        oraConn.close(oradb);
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

router.post('/getById', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var sql = "SELECT * FROM department WHERE id=:id AND is_active='YES'";
  db.query(sql, {id:req.body.id}).then(function(rows){
    if (rows.length==0) {
      throw new Error('department.error.not_found');
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
    error.push('department.error.code_empty');
  }

  if (data.name == '') {
    error.push('department.error.name_empty');
  }

  if (error.length > 0) {
    res.send({status:false, error: error});
    return;
  }

  var checkDup = function() {
    var sql = "SELECT 1 AS cnt FROM department WHERE code=:code AND id <> :id";
    return db.query(sql, {code:data.code, id:data.id})
      .then(function(rows) {
        if (rows.length > 0) {
          throw new Error('error.duplicate');
        }
      });
  }

  var insertData = function() {
    var sql =  "INSERT INTO department (code, name, is_active) VALUES (:code, :name, 'YES')";
    return db.query(sql, data).then(function(result) {
      data.id = result;
    });
  }

  var updateData = function() {
    var sql = "UPDATE department SET code=:code, name=:name WHERE id=:id";
    return db.query(sql, data);
  }

  //////////////////////////////////////
  // MAiN
  //////////////////////////////////////
  var db = conn.connect();
  checkDup()
    .then(function() {
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
    var sql = "SELECT 1 FROM staff WHERE department_id=:id AND is_active='YES' LIMIT 1";
    return db.query(sql, {id:id})
      .then(function(rows) {
        if (rows.length > 0) {
          throw new Error('error.in_use');
        }
      });
  };

  var checkReferences = function() {
    return q.all([
      checkInBranch()
    ]);
  };

  var deactiveData = function() {
    var sql = "UPDATE department SET is_active='NO' WHERE id=:id";
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

router.post('/receipt_report', [bodyParser.json()], function(req, res) {
    console.log('print');
  var $scope = {};
  var db = conn.connect();
  var getData = function() {

    var sql = "  select '1' rownum, CONCAT(co.cus_firstname ,' ',co.cus_lastname,' [',co.code,']') cus_name "
              + "  ,ad.full_address cus_add, concat(sh.name,' ',sh.location,' ',sh.tel) shop_name  "
              + "  ,r.code,r.system_date,s.display_name,pp.payment_remark,p_remark.remark  "
              + "   ,co.product_detail product_name, (co.balance + r.amount) old_balance, r.amount , co.balance balance  "
              + "   ,(r.amount + r.penalty) total_amount, s2.display_name pay_staff, '' text_total_amount  "
              + "   ,r.penalty   "
					    + "       ,concat('ชำระงวดที่ ',p.term_num,'/',co.payment_month) pay_detail			 "
					    + "       , rk.pay_remark1, rk.pay_remark2, rk.pay_remark3 "
					    + "            , tr.cost tr_cost ,tr.amount tr_amount, tr.balance tr_balance , p.paid_amount "
              + "   , case when DATE_FORMAT(r.pay_date,'%Y-%m-%d') <> DATE_FORMAT(r.system_date,'%Y-%m-%d') then 'รายการคีย์ข้อมูลย้อนหลัง' "
              + "   else '' end alert_text, r.status, co.status_discount, co.current_status "
              + "   from contract co  "
              + "   left join address ad on co.id = ad.contract_id and ad.type = 'HOME'  "
              + "   inner join shop sh on co.shop_id = sh.id  "
              + "   inner join receipt r on co.id = r.ref  "
              + "   inner join staff s on co.finance_staff_id = s.id  "
              + "   inner join staff s2 on r.pay_staff = s2.id  "
              + "   inner join (  "
              + "     SELECT ri.receipt_id, GROUP_CONCAT(DISTINCT po.name,' ',format(ri.amount,2),' ') payment_remark  "
              + "     FROM receipt_item ri  "
              + "     inner join payment_option po on ri.payment_option_id = po.id  "
              + "     where ri.receipt_id = :rid  "
              + "     GROUP BY ri.receipt_id  "
              + "   ) pp on pp.receipt_id = r.id  "
              + "   inner join (  "
              + "     SELECT receipt_id, GROUP_CONCAT(DISTINCT remark) remark  "
              + "     FROM receipt_item  "
              + "     where receipt_id = :rid  "
              + "     GROUP BY receipt_id  "
              + "   )p_remark on p_remark.receipt_id = r.id  "
					    + "       inner join ( "
						  + "            select c.id contract_id "
						  + "  ,concat('***ผ่อนร้าน ',c.payment_month,' งวด งวดละ ', format(c.payment_per_month,2),' บาท***') pay_remark1 "
					    + "   ,concat('กำหนดชำระ ',DATE_FORMAT(min(p.due_date),'%d/%m/%Y'),' - ' , DATE_FORMAT(max(p.due_date),'%d/%m/%Y')) pay_remark2  "
					    + "   ,concat('ครบกำหนดชำระทุกวันที่ ',c.payment_on_day) pay_remark3 "
						  + "  from payment_term p  "
					    + "   left join contract c on c.id = p.contract_id "
						  + "  where c.id = :id "
					    + "  )rk on rk.contract_id = co.id  "
					    + "  inner join term_receipt tr on tr.receipt_id = r.id  "
					    + "  inner join payment_term p on tr.payment_term_id = p.id  "
              + "  where co.id = :id and r.id = :rid  "

    return db.query(sql,{id:req.body.contract_id,rid:req.body.receipt_id}).then(function(rows) {
      if (rows.length===0) {
        throw 'contract.error.contract_id_not_found';
      }

      $scope.data=[];

      var rownum = 1;

      rows.forEach(function(row){
        row.rownum = rownum;
        row.text_total_amount = '(' + helper.bahtText(row.total_amount) + ')';
        row.amount = helper.numberFormat(row.amount,2);
        row.due_amount = helper.numberFormat(row.due_amount,2);
        row.balance = helper.numberFormat(row.balance,2);
        //row.total_amount = helper.numberFormat(row.total_amount,2);
        row.total_amount = row.total_amount;
        row.tr_cost = helper.numberFormat(row.tr_cost,2);
        row.tr_amount = helper.numberFormat(row.tr_amount,2);
        row.tr_balance = helper.numberFormat(row.tr_balance,2);
        $scope.data.push(row);
        rownum += 1;
      });

      // console.log(rows);
      // console.log($scope.data);
        var row = $scope.data[0];

        console.log(row);

        var rowProduct = helper.clone(row)
        rowProduct.rownum = '';
        rowProduct.amount = '';
        rowProduct.balance = '';
        rowProduct.due_amount = '';
        rowProduct.tr_cost = '';
        rowProduct.tr_amount = '';
        rowProduct.tr_balance = '';
        rowProduct.pay_detail = row.product_name;
        $scope.data.push(rowProduct);
        var _FreeLoop = 21 ;
        if (row.penalty != 0.00){
          _FreeLoop = 20;
          var rowPenalty = helper.clone(row)
          rowPenalty.rownum = '';
          rowPenalty.amount = helper.numberFormat(row.penalty,2);
          rowPenalty.balance = '';
          rowPenalty.tr_cost = '0.00';
          rowPenalty.tr_amount = helper.numberFormat(row.penalty,2);
          rowPenalty.tr_balance = '';
          rowPenalty.due_amount = '0.00';
          rowPenalty.pay_detail = 'ค่าปรับ';
          $scope.data.push(rowPenalty);
        }
        var row3 = helper.clone(row)
        row3.rownum = '';
        row3.amount = '';
        row3.balance = '';
        row3.due_amount = '';
        row3.tr_cost = '';
        row3.tr_amount = '';
        row3.tr_balance = '';
        row3.pay_detail = '';
        row3.text_total_amount = '('+ helper.bahtText(row.total_amount) +')';
        row3.total_amount = helper.numberFormat(row.total_amount,2);
        for (var iRow = (rows.length - 1); iRow < _FreeLoop; iRow++) {
          if(iRow == 12){
            var rowRemarkBalance = helper.clone(row3)
            rowRemarkBalance.rownum = '';
            rowRemarkBalance.amount = '';
            rowRemarkBalance.balance = '';
            rowRemarkBalance.due_amount = '';
            rowRemarkBalance.tr_cost = '';
            rowRemarkBalance.tr_amount = '';
            rowRemarkBalance.tr_balance = '';
            if (row.current_status == 'CLOSE_NORMAL' && row.status_discount == 'N'){
               rowRemarkBalance.pay_detail = '*** ปิดบัญชี ***';
            }else{
                rowRemarkBalance.pay_detail = row.status_discount == 'N'? '***ยอดปิดบัญชีงวดถัดไป '+ helper.numberFormat(row.balance,2) +' บาท***' : '***ปิดบัญชีโดยมีส่วนลด '+ helper.numberFormat(row.balance,2) +' บาท***';
            }
            $scope.data.push(rowRemarkBalance);
          }else if(iRow == 13){
            var rowRemark = helper.clone(row3)
            rowRemark.rownum = '';
            rowRemark.amount = '';
            rowRemark.balance = '';
            rowRemark.due_amount = '';
            rowRemark.tr_cost = '';
            rowRemark.tr_amount = '';
            rowRemark.tr_balance = '';
            rowRemark.pay_detail = row.pay_remark1;
            $scope.data.push(rowRemark);
          }else if(iRow == 14){
            var rowRemark2 = helper.clone(rowRemark)
            rowRemark2.rownum = '';
            rowRemark2.amount = '';
            rowRemark2.balance = '';
            rowRemark2.tr_cost = '';
            rowRemark2.tr_amount = '';
            rowRemark2.tr_balance = '';
            rowRemark2.due_amount = '';
            rowRemark2.pay_detail = row.pay_remark2;
            $scope.data.push(rowRemark2);
          }else if(iRow == 15){
            var rowRemark3 = helper.clone(rowRemark)
            rowRemark3.rownum = '';
            rowRemark3.amount = '';
            rowRemark3.balance = '';
            rowRemark3.due_amount = '';
            rowRemark3.tr_cost = '';
            rowRemark3.tr_amount = '';
            rowRemark3.tr_balance = '';
            rowRemark3.pay_detail = row.pay_remark3;
            $scope.data.push(rowRemark3);
          }else{
              $scope.data.push(row3);
          }
        }

    });

  };

  var updateGenReceipt = function() {
    //var json = JSON.parse($scope.data);
    //var sql = "UPDATE receipt SET gen_receipt=:data WHERE id=:id ";
    //console.log(json);
    //return db.query(sql, {id:req.body.receipt_id,data:stringToBeInserted});
  }

  var renderReport = function() {
    var dfd = q.defer();
    $scope.pdfFile = 'receipt_'+ helper.newUUID() + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../public/output/' + $scope.pdfFile);
    //console.log(pdfFullPath);
    var report  = new nsReport();
    var doc = report.createDocument(require('./reports/receipt.js'), $scope.data);
    var stream = fs.createWriteStream(pdfFullPath);
    //console.log(pdfFullPath);
    doc.pipe(stream);
    doc.end();
    //console.log('1111');
    stream.on('finish', function() {
      //console.log('success');
      dfd.resolve();
    });
    stream.on('error', function() {
      //console.log('fail');
      dfd.reject();
    });
    return dfd.promise;
  }
  getData()
  .then(updateGenReceipt)
  .then(renderReport).then(function() {
    res.send({
      status:true,
      data: {
        pdfFile: '/output/' + $scope.pdfFile
      }
    })
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  });
});

router.post('/list', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name,cus_mobile"
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid "
    + ", c.balance , p.nationid, c.current_status "
    + "FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "  inner join person p on c.cus_person_id = p.id "
    + "WHERE c.is_active='YES' ";
    // and current_status in ('NORMAL','DEBT')
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

    sortBy = 'c.`' + sortBy + '`';

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
  var db = conn.connect();
  var $scope = {};
  var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid "
    + ", c.balance , p.nationid, c.current_status "
    + "FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "  inner join person p on c.cus_person_id = p.id "
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
      //console.log($scope.rows);
    });
  }

  getRows().then(function() {
    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListContractReceipt", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/contract_receipt_list_'+id+'.xlsx';
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
});

router.post('/deptList', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var mainQuery = " select r.system_date,r.pay_date,r.code,c.product_detail,p.fullname,s.display_name "
                  + " ,r.amount,sh.name, r.id ,c.id contract_id "
                  + " from receipt r "
                  + " left join contract c on r.ref = c.id "
                  + " inner join person p on c.cus_person_id = p.id "
                  + " inner join staff s on r.pay_staff = s.id "
                  + " inner join shop sh on r.shop_id = sh.id "
                  + " WHERE c.is_active='YES' ";

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
    if (typeof receiptFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(receiptFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='shop' || fld=='shop_name' || fld=='fullname' || fld=='pay_staff' || fld=='shop_name') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM receipt r left join contract c on r.ref = c.id WHERE c.is_active='YES' ";
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
    var sortBy = req.body.sortBy || 'system_date';
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

    //sortBy = 'r.`' + sortBy + '`';

var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;
    return db.queryArray(sql).then(function(rows) {
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
    }else {
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

router.post('/exportDept', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var mainQuery = " select r.system_date,r.pay_date,r.code,c.product_detail,p.fullname,s.display_name "
                  + " ,r.amount,sh.name, r.id ,c.id contract_id "
                  + " from receipt r "
                  + " left join contract c on r.ref = c.id "
                  + " inner join person p on c.cus_person_id = p.id "
                  + " inner join staff s on r.pay_staff = s.id "
                  + " inner join shop sh on r.shop_id = sh.id "
                  + " WHERE c.is_active='YES' ";

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
    if (typeof receiptFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(receiptFields[fld], keyword, false);
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

  var getRows = function() {
    var sortBy = req.body.sortBy || 'system_date';
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

    //sortBy = 'r.`' + sortBy + '`';

var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir;

    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
      //console.log($scope.rows);
    });
  }

  getRows().then(function() {
    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListContractReceiptDept", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/contract_receipt_listdept_'+id+'.xlsx';
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
});

router.post('/getHistoryPaymentTerm', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var contract_id = req.body.contractid;
  $scope.paymentHistory=[];
  //var sell_id = req.body.sellid;

  var getHistoryPayment = function(){
    var sql = " select r.id,r.code,r.system_date,r.pay_date,p.term_num,r.payment_option option_name "
              + " ,tr.amount,r.remark,c.id contract_id, s.display_name, r.penalty, r.status, DATE_FORMAT(r.system_date,'%Y-%m-%d') cur_date, 'N' void  "
              + " ,case when cd.status = 'รอปิดกะ' or cd.status = 'เปิดให้แก้ไข' then 'Y' "
              + " else 'N' end check_date "
              + " from receipt r "
              + " inner join term_receipt tr on tr.receipt_id = r.id "
              + " inner join payment_term p on p.id = tr.payment_term_id "
              + " inner join staff s on s.id = r.pay_staff "
              + " inner join contract c on c.id = r.ref "
              + " inner join cash_daily cd on r.shop_id = cd.shop_id "
              + " inner join cash_daily_on_date con on cd.cash_daily_on_date_id = con.ID  "
							+ " 		and con.on_date = r.pay_date "
              + " where c.id = :id  order by r.system_date desc, p.term_num desc "
    return db.query(sql,{id:contract_id}).then(function(rows){
      //$scope.paymentHistory = rows;
      // console.log('jack');
      var _chkVoid = 'N';
      var _chkCode = '';
      rows.forEach(function(row,i){
        //console.log('test=' + rows);
        //var newRow = helper.clone(row)
        if (row.status == 'NORMAL' && _chkVoid == 'N'){
          row.void = 'Y';
          _chkVoid = 'Y';
        }
        if(i != 0){
          if(row.code == _chkCode){
            row.code = '';
          }
          if(rows[i-1].status == 'NORMAL'){
            row.void = 'N';
          }
        }
        if (row.code != ''){
            _chkCode = row.code;
        }

        $scope.paymentHistory.push(row);
       });

    });
  };

  q.all([
    getHistoryPayment()
    //getContract()
  ]).then(function(){
    //console.log($scope.paymentHistory);
    res.send({
      status:true,
      data: {
        paymentHistory: $scope.paymentHistory
        // payment: $scope.payment
      }
    });
  }).catch(function(e){
    res.send({
      status:false,
      error:e
    });
  });

});

router.post('/financeList', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = conn.connect();

  var getFinanceList = function() {
    //var sql = "SELECT id, display_name FROM staff where shop_id=:shop_id and department_id = 14 ";
    var sql = "";
    if (req.body.contracttype == 'CASH_EXTRA'){
      sql = "SELECT s.id, s.display_name FROM staff s inner join contract c on s.id = c.sell_staff_id where c.id = :contract_id ";
      $scope.staff_id = req.body.sell_staff_id;
    }else{
      sql = "select distinct id, display_name from (select id, display_name from staff where shop_id = :shop_id  and department_id = 14 union all  SELECT s.id, s.display_name FROM staff s inner join contract c on s.id = c.finance_staff_id where c.id = :contract_id) finance ";
      $scope.staff_id = req.body.finance_id;
    }
    return db.query(sql,{shop_id:req.body.shop_id,contract_id:req.body.contract_id}).then(function(rows) {
      $scope.financelist = rows;
    });
  };

  var all = [
    getFinanceList()
  ];
  q.all(all).then(function() {
    res.send({
      status: true,
      data: {
        financelist: $scope.financelist,
        finance_staff_id: $scope.staff_id
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });

});

router.post('/voidpayment', [bodyParser.json()], function(req, res) {

  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var getCheckVoid = function() {

      // var sql = " select max(p.term_num) term_num from receipt r " +
      //           "   inner join term_receipt tr on r.id = tr.receipt_id " +
      //           "   inner join payment_term p on tr.payment_term_id = p.id " +
      //           "   where r.ref = :id and r.status = 'NORMAL' ";
       var sql = " select r.code,r.pay_date, con.on_date, cd.status from receipt r " +
					       "   iinner join cash_daily cd on r.shop_id = cd.shop_id " +
                 "   inner join cash_daily_on_date con on cd.cash_daily_on_date_id = con.ID  " +
						     "     and r.pay_date = con.on_date " +
					       "  where r.ref = :id and r.code = :code and r.status = 'NORMAL' " +
					       "  and cd.status in ('รอปิดกะ','เปิดให้แก้ไข')  " ;

      return db.query(sql,{id:req.body.contract_id,code:req.body.receipt_code}).then(function(rows) {
        if (rows.length===0) {
          $scope.checkVoid = false;
        }else{
          $scope.checkVoid = true;
        }
      });
    };

    var getContract = function(){

      var sql = " select from_system from contract where id=:id and current_status in('NORMAL','DEBT','CLOSE_NORMAL') ";

      return db.query(sql,{id:req.body.contract_id}).then(function(rows) {
        if (rows.length===0) {
          throw 'contract.error.contract_id_not_found';
        }
        $scope.from_system = rows[0].from_system;
      });
    }

    var getReceipt = function(){

      var sql = " select amount from receipt where id=:id  ";
                console.log(sql);
      return db.query(sql,{id:req.body.receipt_id}).then(function(rows) {
        if (rows.length===0) {
          throw 'receipt.error.receipt_id_not_found';
        }
        $scope.receipt_amount = rows[0].amount;
      });
    }

    var updateContract = function() {
      var sql = "update contract set total_paid = (total_paid-:receipt_amount), balance=(balance+:receipt_amount),current_status = 'DEBT' where id=:id";
      //console.log('id=', id, ', amount=', amount, ', status=', status, ', paid_date=', paid_on);
      return db.query(sql, {id: req.body.contract_id,receipt_amount:$scope.receipt_amount });
    }

    var updateReceipt = function() {
      var sql = "update receipt set status = 'VOID', void_staff_id=:void_staff where id=:id";
      //console.log('id=', id, ', amount=', amount, ', status=', status, ', paid_date=', paid_on);
      return db.query(sql, {id: req.body.receipt_id,void_staff:req.body.void_staff });
    }

    var insertActivePaymentTerm = function(id,amount,status,paid_date){

      var sql = " INSERT INTO payment_term (contract_id, term_num, due_date, due_amount, paid_date, paid_amount "
              + " , paid_status, due_status, term_status, close_status, ref_payment_codes, remark, is_active "
              + " , created_at, created_by, updated_at, updated_by, discount, sell_id, cost_term) "
              + " SELECT contract_id, term_num, due_date, due_amount, :paid_date paid_date, :amount paid_amount "
              + " , paid_status, due_status, :status term_status, close_status, ref_payment_codes, remark, is_active "
              + " , created_at, created_by, updated_at, updated_by, discount, sell_id, cost_term "
              + " FROM   payment_term p "
              + " WHERE  id = :id ON DUPLICATE KEY UPDATE paid_date = :paid_date,paid_amount=(payment_term.paid_amount - :amount) " ;
      return db.query(sql, {id: id,amount:amount,status:status,paid_date:paid_date});

    }

    var getPaymentTerm = function(){

      var sql = " select tr.payment_term_id,pt.term_status,pt.paid_date , (pt.paid_amount - tr.amount) diff_amount from term_receipt tr "
                + " inner join payment_term pt on tr.payment_term_id = pt.id "
                + " where tr.receipt_id=:id and pt.status = 'ACTIVE' order by tr.payment_term_id desc ";
                console.log(sql);
      return db.query(sql,{id:req.body.receipt_id});
    }

    var updateAllPaymentTerm = function(rows) {
      var all = [];
      for (var i = 0; i < rows.length; i++) {

          all.push(updatePaymentTerm(rows[i].payment_term_id));
        }
        return q.all(all);
      }

      var insertNewPaymentTerm = function(rows) {
        var all = [];
        for (var i = 0; i < rows.length; i++) {
          var status = '';
          var paid_date = '0000-00-00';
            if (rows[i].diff_amount == 0){
              if (rows[i].term_status == 'WAIT_PAID' || rows[i].term_status == 'WAIT_PARTIAL'){
                status = 'WAIT';
              }else{
                status = 'OVERDUE';
              }
            }else{
              if (rows[i].term_status == 'WAIT_PAID' || rows[i].term_status == 'WAIT_PARTIAL'){
                status = 'WAIT_PARTIAL';
              }else{
                status = 'OVERDUE_PARTIAL';
              }
              paid_date = rows[i].paid_date;
            }
            all.push(insertActivePaymentTerm(rows[i].payment_term_id, rows[i].diff_amount, status, paid_date));
            //all.push(updatePaymentTerm(rows[i].payment_term_id));
          }
          return q.all(all);
        }

    var updatePaymentTerm = function(id){

      //var sql = "update payment_term set paid_date = :paid_date, paid_amount=:amount, term_status=:status where id=:id  ";
      var sql = "update payment_term set status='INACTIVE' where id=:id  ";

      return db.query(sql, {id:id});

    }

    var deleteTermReceipt = function() {
      var sql = "delete from term_receipt where receipt_id = :id";
      return db.query(sql, {id: req.body.receipt_id });
    }

    var deleteIncome = function() {
      var sql = " delete from income where mysql_receipt_code = :receipt_code ";
      return oraConn.query(oradb, sql, {receipt_code:req.body.receipt_code},true);
    }

    var deleteIncomeDetail = function() {
      var sql = " delete from income_detail where mysql_receipt_code = :receipt_code ";
      return oraConn.query(oradb, sql, {receipt_code:req.body.receipt_code},true);
    }

    var deletePayment = function() {
      var sql = " delete from payment where mysql_receipt_code = :receipt_code ";
      return oraConn.query(oradb, sql, {receipt_code:req.body.receipt_code},true);
    }

    var db = conn.connect();

    db.beginTransaction()
      .then(getCheckVoid)
      .then(function(){
        if ( $scope.checkVoid != true){
          throw 'update term';
        }
      })
      .then(getContract)
      .then(getReceipt)
      .then(updateContract)
      .then(updateReceipt)
      .then(getPaymentTerm)
      .then(updateAllPaymentTerm)
      .then(getPaymentTerm)
      .then(insertNewPaymentTerm)
      .then(function() {
        db.commit();
        if ($scope.from_system == 'ORACLE') {
          return q.all([
            deletePayment(),
            deleteIncome(),
            deleteIncomeDetail()
          ]);
        }else{
          return q.all([
            deleteIncome(),
            deleteIncomeDetail()
          ]);
        }
      }).then(function(){
        oraConn.close(oradb);
        res.send({
          status:true
        });
      }).catch(function(e) {
        oraConn.close(oradb);
        console.log('rollback', e);
        db.rollback();
        res.send({
          status:false,
          error:e
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

router.post('/checkVoid', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = conn.connect();

  var getVoid = function() {

    var sql = " select max(p.term_num) term_num from receipt r " +
              "   inner join term_receipt tr on r.id = tr.receipt_id " +
              "   inner join payment_term p on tr.payment_term_id = p.id " +
              "   where r.ref = :id and r.status = 'NORMAL' ";

    return db.query(sql,{id:req.body.contract_id}).then(function(rows) {
      $scope.maxTermnum = rows[0].term_num;
    });
  };

  var all = [
    getVoid()
  ];
  q.all(all).then(function() {
    res.send({
      status: true,
      data: {
        max_termnum: $scope.maxTermnum
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });

});

router.post('/checkredeem', [bodyParser.json()], function(req, res) {

  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var getContract = function(){
      var sql = " select c.id, c.sell_id, p.nationid from contract c inner join person p "
                +" on c.cus_person_id = p.id "
                +" where c.code = :code and c.current_status in ('NORMAL','DEBT') ";
        return db.query(sql,{code:req.body.code}).then(function(rows) {
          if (rows.length===0) {
            throw 'error.contract_id_not_found';
          }
          $scope.contract_id = rows[0].id;
          $scope.sell_id = rows[0].sell_id;
          $scope.nation_id = rows[0].nationid;
        });
    }

    var checkReturn = function(){
        var sql = " select r.id from returnx r inner join returnx_detail rd "
                  + " on r.id = rd.return_id "
                  + " inner join stock_shop s on s.barcode = rd.barcode "
                  + " where r.sell_id = :sell_id and rd.barcode = :barcode and r.finance_used = 'N' ";
        return oraConn.query(oradb, sql, {sell_id:$scope.sell_id,barcode:req.body.barcode}).then(function(result) {
          if (result.rows.length === 0){
            throw 'error';
          }else{
            $scope.return_id = result.rows[0][0];
          }
        });
    }

    var db = conn.connect();

    db.beginTransaction()
      .then(getContract)
      .then(checkReturn)
      .then(function(){
        oraConn.close(oradb);
        res.send({
          status:true,
          data:{
            contract_id:$scope.contract_id,
            sell_id:$scope.sell_id,
            return_id:$scope.return_id,
            nation_id:$scope.nation_id
          }
        });
      }).catch(function(e) {
        oraConn.close(oradb);
        console.log('rollback', e);
        db.rollback();
        res.send({
          status:false,
          error:e
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

router.post('/checkOndate', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var checkOndate = function() {
    var sql = " select cd.status "
              +" from cash_daily_on_date cod "
              +" left join cash_daily cd on cd.cash_daily_on_date_id = cod.id "
              +" where shop_id = :shop_id "
              +" and cod.on_date = :date ";

    return db.query(sql,{shop_id:req.session.data.shop.id,date:req.body.selectDate}).then(function(rows) {

      if (rows.length===0) {
        $scope.flagSave = true;
      }else{
        if (rows[0].status == 'รอปิดกะ' || rows[0].status == 'เปิดให้แก้ไข') {
          $scope.flagSave = false;
        }else{
          $scope.flagSave = true;
        }
      }
    });
  }

  q.all([
    checkOndate()
  ]).then(function(){
    res.send({
      status:true,
      data: {
        flagSave: $scope.flagSave
      }
    });
  }).catch(function(e){
    console.log(e);
    res.send({
      status:false,
      error:e
    });
  });

});

router.post('/checkCloseCashDaily', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var checkOndate = function() {
    var sql = " select case when min(cod.on_date) <> curdate() then 'Y' "
					    +" else 'N' end link_cashdaily "
              +"  from cash_daily_on_date cod  "
              +"  left join cash_daily cd on cd.cash_daily_on_date_id = cod.id  "
              +"  where shop_id = :shop_id  "
              +"  and cd.status = 'รอปิดกะ'";

    return db.query(sql,{shop_id:req.session.data.shop.id}).then(function(rows) {

      if (rows.length===0) {
        $scope.flagLink = 'N';
      }else{
        $scope.flagLink = rows[0].link_cashdaily;
        //$scope.flagLink = 'N';
      }
    });
  }

  q.all([
    checkOndate()
  ]).then(function(){
    res.send({
      status:true,
      data: {
        flagLink: $scope.flagLink
      }
    });
  }).catch(function(e){
    console.log(e);
    res.send({
      status:false,
      error:e
    });
  });

});

module.exports = router;
