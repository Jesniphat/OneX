var express     = require('express');
var router      = express.Router();
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var fs           = require('fs');
var conn        = require('../lib/db');
var helper      = require('../lib/helper');
var cookie      = require('react-cookie');

var doRegister = function(req, res) {
  console.log("register");
  console.log("req = ",req.body);

  var $scope = {};
  $scope.address_id = [];
  //$scope.contact_id = [];
  
  var checkValid = function(){
    var checkData = req.body.dataSaving;
    if(checkData.tax_num == '' || checkData.names == '' || checkData.last_name == '' || checkData.e_mail == '' || checkData.password == ''){
      console.log(checkData);
      console.log("Valid Data");
      throw 'Valid Data';
    }
  }

  var selectLastcode = function(){
    console.log('selectLastcode');
    return q.all([
      (function() {
        var query = "select code from person order by id desc limit 1";
        return db.query(query).then(function(rows) {
            $scope.lastCode = rows[0];
          });
      })()
    ]);
  }

  var _GenCode = function(){
    console.log("gencode");
    var code = $scope.lastCode.code;
    var lastFour = code.substr(code.length - 4);
    console.log(lastFour);
    var y = parseInt(lastFour ) + 1;
    var z = y + "";
    console.log(y,z.length);
    var a = "";
    for(var i=z.length; i<4; i++){
    a = a + "0";
    }
    $scope.newCode = ("A" + a + "" + y );
  }

  var insertPerson = function() {
    console.log('insertPerson');
    req.body.dataSaving.customer_code = $scope.newCode;
    var listId = '';
    if(req.body.dataSaving.customerIdTypeList == 'nationid'){
      listId = 'nationid';
    }else if (req.body.dataSaving.customerIdTypeList == 'passport') {
      listId = 'passport';
    }else {
      listId = 'tax_id';
    }
      var sql = " insert into person(code,type,prename,firstname,lastname,fullname," + listId
          + " ,gender,email,password,is_active,created_at,created_by,updated_at,updated_by,idcard_info,passport_info"
          + " ,approve_status) "
          + " values(:customer_code, :customerTypeFieldList, :customerTitleList, :names, :last_name,"
          + " :customerTitleList  " + ":names   " + ":last_name, :tax_num, :customerGenderList, :e_mail, :password,"
          + " :is_active_list, NOW(), '0', NOW(), '0', '{}', '{}', :credit_term_status) ";

      return db.query(sql, req.body.dataSaving).then(function(res) {
        $scope.person_id = res.insertId;
      });
    }

  var insertCustomers = function() {
    console.log('insertCustomers');
    req.body.dataSaving.person_id = $scope.person_id;
    var discountType = req.body.dataSaving.discount;
    if(discountType.substr(discountType.length - 1) == '%'){
      req.body.dataSaving.discountType = 'percent';
    }else {
      req.body.dataSaving.discountType = 'baht';
    }
    var sql = " insert into customer(person_id,member_no,payment_type,currency_id,discount,"
            + "charge_text,charge,discount_type,credit_term,last_uses_shop) "
            + " values(:person_id, :member_code, :paymentTypeList, :currencyList, :discount, :serviceChargeText,"
            + " :serviceChargeAmount, :discountType, :credit_term, '0') ";
    return db.query(sql, req.body.dataSaving).then(function(res) {
      $scope.customer_id = res.insertId;
    });
  }

    var insertDefaultAddr = function(){
      console.log('insertdefaultAddr');
      req.body.dataSaving.customer_id = $scope.customer_id;
      var sql = " insert into address(customer_id,type,addr1,addr2,tambon,amphur,province,zipcode,tel,default_address) "
              + " values(:customer_id, 'HOME', '-', '-', '-', '-', '-', '-', '-', 'Y')";
      return db.query(sql, req.body.dataSaving).then(function(res) {
        $scope.defaultAddr = res.insertId;
      });
    }

    var insertDefaultBill = function(){
      console.log('insertDefaultBill');
      req.body.dataSaving.defultAddrId = $scope.defaultAddr;
      var sql = " insert into customer_billing_name(customer_id,code,address_id,default_address,billing_name) "
              + " values(:customer_id, 'D0000', :defultAddrId, 'Y', :defaultAddrName)";
      return db.query(sql, req.body.dataSaving).then(function(res) {
        $scope.defaultBill = res.insertId;
      });
    }


    var selectDefultAddr = function(){
      console.log('selectDefultAddr');
      return q.all([
        (function() {
          var query = "select id from customer_billing_name where default_address = 'Y' AND customer_id = '" + $scope.customer_id + "'";
          return db.query(query).then(function(rows) {
              $scope.defultAddrId = rows[0];
            });
        })()
      ]);
    }

    var updateAddBillDefault = function(){
      console.log('updateAddBillDefault');
      console.log('Defualt Id is = ',$scope.defultAddrId.id);
      //console.log('Defualt Bill Id is = ',$scope.defultBillId.id);

      req.body.dataSaving.defultAddrId = $scope.defultAddrId.id;
      req.body.dataSaving.customer_id = $scope.customer_id;
      var sql ="UPDATE customer SET default_address=:defultAddrId"
      + " WHERE id=:customer_id ";

      return db.query(sql, req.body.dataSaving);
    }

    var db = conn.connect();
    db.beginTransaction()
      .then(checkValid)
      .then(selectLastcode)
      .then(_GenCode)
      .then(insertPerson)
      .then(insertCustomers)
      //.then(insertContactList)
      .then(insertDefaultAddr)
      .then(insertDefaultBill)
      // .then(insertAddressList)
      // .then(insertBillingList)
      .then(selectDefultAddr)
      //.then(selectDefultBill)
      .then(updateAddBillDefault)
      .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              person_id:$scope.person_id,
              done:'เพิ่มข้อมูลสำเร็จ',
              user:$scope.newCode,
          }
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
};

var doGetCustomerData = function(req, res){
    var db = conn.connect();
    var $scope = {};
    var person_id = req.body.refId;
    console.log(req.body.refId, 'check_person_id_getCustomerData');

    q.all([
      (function() {
        var query = "SELECT p.id,c.id customer_id,p.code,p.com_id,p.type,c.member_type_id,c.member_no,p.prename,p.firstname,p.lastname,p.mobile,"
        + " p.email,p.lineid,p.birth,c.credit_term,p.approve_status,p.get_news,case when p.nationid <> '' then 'nationid' when p.passport <> '' then 'passport' when p.tax_id <> '' then 'tax_id' end as costomer_type_id,"
        + " concat(p.nationid,p.passport,p.tax_id) as id_number,p.gender,p.is_active,p.password,c.payment_type,c.currency_id,c.charge_text,c.discount,c.charge,c.discount_type, "
        + " a.addr1,a.addr2,a.tambon,a.amphur,a.province,a.zipcode,a.tel"
        + " FROM person p INNER JOIN customer c ON p.id = c.person_id INNER JOIN customer_billing_name cb on c.id = cb.customer_id and cb.default_address = 'Y'"
        + " INNER JOIN address a ON cb.address_id = a.id where p.id = '" + person_id + "'";
        return db.query(query).then(function(rows) {
            $scope.customerData = rows;
          });
      })()
    ]).then(function() {
      res.send({ status:true, data: { customerData: $scope.customerData } });
    }).catch(function(e) {
      res.send({ status:false, error:e });
    });
}

var doGetContactListData = function(req, res){
  var db = conn.connect();
  var $scope = {};
  var person_id = req.body.refId;

  q.all([
    (function() {
      var query = "SELECT cc.id AS contactId, cc.customer_id AS customerPersonId, cc.name AS contactName, cc.department AS contactPosition,"
      + " cc.email AS contactEmail, cc.tel_no as contactPhoneNo, cc.line_id as contactLineId, cc.memo as contactRemark, cc.addr1 as contactAddr1, "
      + " cc.addr2 as contactAddr2, cc.tambon as contactTambon, cc.amphur as contactAmphur, cc.province as contactProvince, cc.zipcode as contactZipcode "
      + " FROM customer c INNER JOIN customer_contact cc ON c.id = cc.customer_id where c.person_id = '" + person_id + "'";
      return db.query(query).then(function(rows) {
          $scope.contactListData = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { contactListData: $scope.contactListData } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  });
}

var doGetBillingListData = function(req, res){
  var db = conn.connect();
  var $scope = {};
  var person_id = req.body.refId;
  console.log("id = ",person_id,"customerid for getBillingListData");

  q.all([
    (function() {
      var query = "SELECT a.customer_id billingCustomerId, a.`type`, a.addr1 billingAddr1, a.addr2 billingAddr2, a.tambon billingTambon,"
      + " a.amphur billingAmper, a.province billingProvince, a.zipcode billingZipcode, a.tel billingOtherNo,"
      + " cb.remark billingRemark, cb.delivery_detial billingSend, cb.default_billing,"
      + " cb.memo billingNote, cb.payment_detial billingPayment, cb.code billingCode "
      + " FROM customer c INNER JOIN address a ON c.id=a.customer_id INNER JOIN customer_billing_name cb ON a.id=cb.address_id"
      + " WHERE cb.default_address = 'N' AND c.person_id = '" + person_id + "'";
      return db.query(query).then(function(rows) {
          $scope.billingListDatas = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { billingListDatas: $scope.billingListDatas } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  });
}


router.post('/api', bodyParser.json(), function(req, res) {
  console.log('Customer Function Js')
  if (!req.body) {
    res.sendStatus(400);
    return;
  }

  if (req.body.act==='register') {
    doRegister(req, res);
  } else if (req.body.act=='getCustomerData'){
    doGetCustomerData(req, res);
  } else if (req.body.act=='getContactListData'){
    doGetContactListData(req, res);
  } else if (req.body.act=='getBillingListData'){
    doGetBillingListData(req, res);
  }
});

router.get('/:sid?', function(req, res) {
  cookie.plugToRequest(req, res);
  cookie.save('SS_LANG', process.env['SS_LANG']);
  if (!req.params.sid) {
    res.redirect('/signin/' + req.sessionID);
    return;
  }
  res.sendFile(path.normalize(__dirname + '/../public/signin.html'));
});


module.exports = router;
