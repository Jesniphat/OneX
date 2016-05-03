var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var conn        = require('../../lib/db');
var oraConn     = require('../../lib/oracle');
var oraConns    = require('../../lib/oraclemulti');
var router      = express.Router();
var helper      = require('../../lib/helper');
var fs          = require('fs');
var nsReport    = require('../../lib/nsreport');
var xlsx        = require('node-xlsx');

var oracleConfig ={
  password: ':ug8up;', 
  connectString : '192.168.10.4/ORCL'
}

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

var customerFields = {
  customer_id:{name:'customer_id'},
  customer_code:{name:'customer_code'},
  type:{name:'p.type'},
  fullname:{name:'p.fullname'},
  member_type_name:{name:'member_type_name'},
  last_uses_at:{name:'last_uses_at'},
  shop_name:{shop_name:'shop_name'}
};

var promotionFields = {
  ID:{name:'ID'},
  NAME:{name:'NAME'},
  DESCRIPTION:{name:'DESCRIPTION'}
};


router.post('/list', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var mainQuery = " select p.code as customer_code,p.type,concat(p.firstname,' ',p.lastname) as fullname,case when c.member_type_id='-1' then 'General' else mt.name end as member_type_name " +
                  " ,case when c.last_uses_at = '0000-00-00 00:00:00' then 'ไม่เคยใช้งาน' else c.last_uses_at end as last_uses_at, sp.name shop_name ,p.id as person_id " +
                  " from person p inner join customer c on p.id=c.person_id left join member_type mt on c.member_type_id=mt.id " +
                  " left join shop sp on c.last_uses_shop = sp.id where p.is_active = 'YES' ";
  console.log(mainQuery);

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
    if (typeof customerFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(customerFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='customer_code' || fld=='type' || fld=='fullname' || fld=='member_type_name' || fld=='shop_name' || fld=='last_uses_at') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM person WHERE is_active='YES' ";
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
    //var sortBy = req.body.sortBy || 'system_date';
    //var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      //sortBy: sortBy,
      //sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0,
    };

    //sortBy = 'r.`' + sortBy + '`';

    var sql = mainQuery +
      //' ORDER BY ' + sortBy + ' ' + sortDir +
      //' LIMIT ' + (page * limit) + ', ' + limit;
      ' LIMIT 200 ';
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
      error: e,
      j:'jes'
    });
  });
});

router.post('/export', [bodyParser.json()], function(req, res) {
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

router.post('/getMemberType', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  q.all([
    (function() {
      var query = "SELECT id AS value, name AS text FROM member_type ";
      return db.query(query).then(function(rows) {
          $scope.memberType = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { memberType: $scope.memberType } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});

router.post('/getCurrencyFromBase', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  q.all([
    (function() {
      var query = "SELECT id AS value, name AS text FROM currency ";
      return db.query(query).then(function(rows) {
          $scope.currencyListFromBase = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { currencyListFromBase: $scope.currencyListFromBase } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});

router.post('/getCustomerData', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var person_id = req.body.person_id;
  console.log(req.body.person_id, 'check_person_id_getCustomerData');

  q.all([
    (function() {
      var query = "SELECT p.id,c.id customer_id,p.code,p.com_id,p.type,c.member_type_id as memberTypeFieldList,c.member_no,p.prename,p.firstname,p.lastname,p.mobile,"
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
  })
});

router.post('/getContactListData', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var person_id = req.body.person_id;

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
  })
});

router.post('/getBillingListData', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var person_id = req.body.person_id;
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
  })
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Save customer //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/saveCustomers',[bodyParser.json()], function(req, res) {
  console.log('F_SAVE');
  //console.log(req.body);
  var $scope = {};
  $scope.address_id = [];
  //$scope.contact_id = [];

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
    for(i=z.length; i<4; i++){
    a = a + "0";
    }
    $scope.newCode = ("A" + a + "" + y );
  }

  var insertPerson = function() {
    console.log('insertPerson');
    req.body.customer_code = $scope.newCode;
    var listId = '';
    if(req.body.customerIdTypeList == 'nationid'){
      listId = 'nationid';
    }else if (req.body.customerIdTypeList == 'passport') {
      listId = 'passport';
    }else {
      listId = 'tax_id';
    }
      var sql = " insert into person(code,type,prename,firstname,lastname,fullname," + listId
          + " ,birth,gender,email,password,is_active,created_at,created_by,updated_at,updated_by,idcard_info,passport_info"
          + " ,approve_status) "
          + " values(:customer_code, :customerTypeFieldList, :customerTitleList, :names, :last_name,"
          + " :customerTitleList  " + ":names   " + ":last_name, :tax_num, :birthday, :customerGenderList, :e_mail, :password,"
          + " :is_active_list, NOW(), '0', NOW(), '0', '{}', '{}', :credit_term_status) ";

      return db.query(sql, req.body).then(function(res) {
        $scope.person_id = res.insertId;
      });
    }

  var insertCustomers = function() {
    console.log('insertCustomers');
    req.body.person_id = $scope.person_id;
    var discountType = req.body.discount;
    if(discountType.substr(discountType.length - 1) == '%'){
      req.body.discountType = 'percent';
    }else {
      req.body.discountType = 'baht';
    }
    var sql = " insert into customer(person_id,member_no,payment_type,currency_id,discount,"
            + "charge_text,charge,discount_type,credit_term,last_uses_shop,member_type_id) "
            + " values(:person_id, :member_code, :paymentTypeList, :currencyList, :discount, :serviceChargeText,"
            + " :serviceChargeAmount, :discountType, :credit_term, '0', :memberTypeFieldList) ";
    return db.query(sql, req.body).then(function(res) {
      $scope.customer_id = res.insertId;
    });
  }

    var insertContactList = function(){
      console.log('insertContactList');
      var all = [];
      //console.log(req.body.contactListData.length,'XXX');
      for (var i = 0; i < req.body.contactListData.length; i++) {
        all.push(insertDataContactList(i));
      }
      //console.log('array =' + all);
      return q.all(all);
    }

    var insertDataContactList = function(i) {
      console.log('insertDataContactList');
      req.body.contactListData[i].customer_id = $scope.customer_id;
  
      var sql = "insert into customer_contact(customer_id, name, department, email, tel_no, line_id, memo,"
        + " addr1, addr2, tambon, amphur, province, zipcode, created_at, created_by, updated_at, updated_by)"
        + " VALUES (:customer_id, :contactName, :contactPosition, :contactEmail, :contactPhoneNo, :contactLineId, :contactRemark,"
        + " :contactAddr1, :contactAddr2, :contactTambon, :contactAmphur, :contactProvince, :contactZipcode, NOW(), '0', NOW(), '0') ";
        //console.log(sql);
      return db.query(sql, req.body.contactListData[i]);
      // return db.query(sql, req.body.contactListData[i]).then(function(res) {
      //   $scope.contact_id.push(res.insertId);
      // });
    }

    var insertDefaultAddr = function(){
      console.log('insertdefaultAddr');
      req.body.customer_id = $scope.customer_id;
      var sql = " insert into address(customer_id,type,addr1,addr2,tambon,amphur,province,zipcode,tel,default_address) "
              + " values(:customer_id, 'HOME', :defaultAddrNo, :defaultAddrSoi, :defaultAddrTambon, :defaultAddrAmphur, :defaultAddrProvince, :defaultAddrZipCode, :defaultAddrPhone, 'Y')";
      return db.query(sql, req.body).then(function(res) {
        $scope.defaultAddr = res.insertId;
      });
    }

    var insertDefaultBill = function(){
      console.log('insertDefaultBill');
      req.body.defultAddrId = $scope.defaultAddr;
      var sql = " insert into customer_billing_name(customer_id,code,address_id,default_address) "
              + " values(:customer_id, 'D0000', :defultAddrId, 'Y')";
      return db.query(sql, req.body).then(function(res) {
        $scope.defaultBill = res.insertId;
      });
    }

    var insertAddressList = function(){
      console.log('insertAddressList');
      var all = [];
      for (var i = 0; i < req.body.billingListData.length; i++) {
        all.push(insertDataAddressList(i));
      }
      return q.all(all);
    }

    var insertDataAddressList = function(i) {
      console.log('insertDataAddressList');
      req.body.billingListData[i].customer_id = $scope.customer_id;
      req.body.billingListData[i].tel = req.body.phone;
      req.body.billingListData[i].full_address = req.body.billingListData[i].billingAddr1 + ' ' + req.body.billingListData[i].billingAddr2
      + ' ' + req.body.billingListData[i].billingTambon + ' ' + req.body.billingListData[i].billingAmper + ' ' + req.body.billingListData[i].billingProvince
      + ' ' + req.body.billingListData[i].billingZipcode;
      //console.log(req.body.billingListData[i]);
      var sql = "insert into address(customer_id, type, addr1, addr2, tambon, amphur, province, zipcode, tel,"
        + " other, full_address, is_active, created_at, created_by, updated_at, updated_by)"
        + " VALUES (:customer_id, 'HOME', :billingAddr1, :billingAddr2, :billingTambon, :billingAmper, :billingProvince, :billingZipcode, :billingOtherNo,"
        + " '', :full_address, 'YES', NOW(), '0', NOW(), '0')";
        //console.log(sql);
      //return db.query(sql, req.body.billingListData[i]);
      return db.query(sql, req.body.billingListData[i]).then(function(res) {
        $scope.address_id.push(res.insertId);
      });
    }

    var insertBillingList = function(){
      console.log('insertBillingList');
      var all = [];
      console.log(req.body.billingListData.length,'XXX');
      for (var i = 0; i < req.body.billingListData.length; i++) {
        all.push(insertDataBillingList(i));
      }
      //console.log('array =' + all);
      return q.all(all);
    }

    var insertDataBillingList = function(i) {
      console.log('insertDataBillingList');
      req.body.billingListData[i].customer_id = $scope.customer_id;
      req.body.billingListData[i].address_id = $scope.address_id[i];

      var sql = "insert into customer_billing_name(code, customer_id, address_id, remark, memo, delivery_detial, payment_detial, default_billing,"
        + " created_at, created_by, updated_at, updated_by) "
        + " VALUES (:billingCode, :customer_id, :address_id, :billingRemark, :billingNote, :billingSend, :billingPayment, :default_billing,"
        + " NOW(), '0', NOW(), '0') ";
        //console.log(sql);
      return db.query(sql, req.body.billingListData[i]);
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

    var selectDefultBill = function(){
      console.log('selectDefultAddr');
      return q.all([
        (function() {
          var query = "select id from customer_billing_name where default_billing = 'Y' AND customer_id = '" + $scope.customer_id + "'";
          return db.query(query).then(function(rows) {
              $scope.defultBillId = rows[0];
            });
        })()
      ]);
    }

    var updateAddBillDefault = function(){
      console.log('updateAddBillDefault');
      console.log('Defualt Id is = ',$scope.defultAddrId.id);
      //console.log('Defualt Bill Id is = ',$scope.defultBillId.id);

      req.body.defultAddrId = $scope.defultAddrId.id;
      req.body.customer_id = $scope.customer_id;
      if($scope.defultBillId.id == undefined){
        req.body.defultBillId = '0';
      }else {
        req.body.defultBillId = $scope.defultBillId.id;
      }
      var sql ="UPDATE customer SET default_address=:defultAddrId, default_billing=:defultBillId"
      + " WHERE id=:customer_id ";

      return db.query(sql, req.body);
    }


    var selectConfigOracle = function(){
      console.log('selectConfigOracle');
      return q.all([
        (function() {
          var query = "select * from oracle_config";
          return db.query(query).then(function(rows) {
              $scope.configOracle = rows;
            });
        })()
      ]);
    }


    var insertToOracle = function(){
        console.log('insertToOracle');
        //console.log(req.body);
        var data = req.body;
          if(data.memberTypeFieldList == -1 || data.memberTypeFieldList == '-1'){
            data.customer_level = 'GENERAL';
          }else if (data.memberTypeFieldList == 1 || data.memberTypeFieldList == '1') {
            data.customer_level = 'PLATINUM';
          }else if (data.memberTypeFieldList == 2 || data.memberTypeFieldList == '2') {
            data.customer_level = 'GOLD';
          }else if (data.memberTypeFieldList == 3 || data.memberTypeFieldList == '3') {
            data.customer_level = 'SILVER';
          }else if (data.memberTypeFieldList == 4 || data.memberTypeFieldList == '4') {
            data.customer_level = 'SPENDER CLUB';
          }
        var billList = req.body.billingListData;

        var list = {};
        var flagDefault = 'N';
        for(i = 0; i < billList.length; i++){
          if(billList[i].default_billing=='Y'){
            flagDefault = 'Y';
            list.billName = billList[i].billingName;
            list.addr = billList[i].full_address;
            list.dalivery = billList[i].billingSend;
            list.payment = billList[i].billingPayment;
          }
        }
        if(flagDefault == 'N'){
          list.billName = billList[0].billingName;
          list.addr = billList[0].full_address;
          list.dalivery = billList[0].billingSend;
          list.payment = billList[0].billingPayment;
        }
        //console.log(list);

        var str = $scope.configOracle;
        //console.log(str);
        for (f = 0; f < str.length; f++){
          var myConn = {
            user          : str[f].user,
            password      : str[f].password,
            connectString : str[f].ip
          };
          //console.log(myConn,$scope.person_id);
          oraConns.connect(myConn).then(function(oradb){
              var sql = " insert into COMPANY(ID,TYPE,CODE,NAME,ADDRESS,TEL,FAX,BILL_NAME,BILL_ADDR,DELIVERY_DETAIL,PAYMENT_DETAIL,"
                      + " CREDIT_TERM,UPDATE_STAFF,CUSTOMER_LEVEL,UPDATE_DATE,MEMBER_NO,MYSQL_PERSON_ID) "
                      + " values((PAYMENT_ID.NEXTVAL),:type,:code,:name,:address,:tel,:fax,:bill_name,:bill_addr,:delivery_detail,"
                      + " :payment_detail,:credit_term,0,:customer_level,SYSDATE,:member_no,:sql_id) ";
              oraConns.query(oradb, sql,{
                type:'C',
                code:data.customer_code,
                name:data.names + '  ' + data.last_name,
                address:list.addr,
                tel:data.phone,
                fax:data.fax,
                bill_name:list.billName,
                bill_addr:list.addr,
                delivery_detail:list.dalivery,
                payment_detail:list.payment,
                credit_term:data.credit_term,
                customer_level:data.customer_level,
                member_no:data.member_code,
                sql_id:$scope.person_id
              },true);
            }).catch(function(e){
            console.log('Phang');
            oraConns.close(oradb);
            db.rollback(function(e) {
              res.send({
                status:false,
                error:e
              });
            });
            res.send({
              status:false,
              error:e
            });
          });
        }
        return true;
      }

      var getCompanyId = function(){
        var str = $scope.configOracle;
        var myConn = {
          user          : str[0].user,
          password      : str[0].password,
          connectString : str[0].ip
        };
        console.log('getCompanyId');
        oraConns.connect(myConn).then(function(oradb){
          var sql = 'select MAX(ID) from COMPANY ';
          return oraConn.query(oradb, sql, {}).then(function(result) {
            $scope.companyId = result.rows[0][0];
            console.log('$scope.companyId = ',result.rows[0][0]);
            updateComidToMysql($scope.companyId);
          });
        }).catch(function(e){
            console.log('Phang');
            oraConns.close(oradb);
            res.send({
              status:false,
              error:e
            });
          });
      }

      var updateComidToMysql = function(company_id){
        // req.body.companyOracleId = $scope.companyId;
         console.log('updateComidToMysql ',company_id);
        // console.log('up to myaql 1',req.body.companyOracleId,$scope.companyId);
        // // console.log('up to myaql 2',req.body.person_id);
        var sql = " update person set company_oracle_id=:companyOracleId where id=:person_id";
        return db.query(sql, {companyOracleId:company_id,person_id:req.body.person_id});
        //console.log(sql);
      }

    var db = conn.connect();
    db.beginTransaction()
      .then(selectConfigOracle)
      .then(selectLastcode)
      .then(_GenCode)
      .then(insertPerson)
      .then(insertCustomers)
      .then(insertContactList)
      .then(insertDefaultAddr)
      .then(insertDefaultBill)
      .then(insertAddressList)
      .then(insertBillingList)
      .then(selectDefultAddr)
      .then(selectDefultBill)
      .then(updateAddBillDefault)
      .then(insertToOracle)
      .then(getCompanyId) 
      .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              person_id:$scope.person_id,
              done:'เพิ่มข้อมูลสำเร็จ'
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

});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// edit customer ///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/editCustomers',[bodyParser.json()], function(req, res) {
  console.log('Edit');
  console.log(req.body.id);
  var $scope = {};
  $scope.customer_id = req.body.customer_id;
  $scope.address_id = [];

  var updatePersonNationId = function(){
    console.log('updatePersonNationId');
    var sql = "UPDATE person SET nationid='',tax_id='',passport='' where id=:id";
    return db.query(sql,req.body);
  }

  var updatePerson = function() {
      console.log('updatePerson');
      var listId = '';
      if(req.body.customerIdTypeList == 'nationid'){
        listId = 'nationid';
      }else if (req.body.customerIdTypeList == 'passport') {
        listId = 'passport';
      }else {
        listId = 'tax_id';
      }
      var sql = "UPDATE person SET code=:customer_code," + listId + "=:tax_num, type=:customerTypeFieldList,"
      + " prename=:customerTitleList, firstname=:names, lastname=:last_name, email=:e_mail, password=:password, birth=:birthday,"
      + " approve_status=:credit_term_status, is_active=:is_active_list WHERE id=:id";

      return db.query(sql, req.body);
    }

  var updateCustomers = function() {
    console.log('updateCustomers');
    var discountType = req.body.discount;
    if(discountType.substr(discountType.length - 1) == '%'){
      req.body.discountType = 'percent';
    }else {
      req.body.discountType = 'baht';
    }
    var sql ="UPDATE customer SET payment_type=:paymentTypeList, currency_id=:currencyList, discount=:discount, charge_text=:serviceChargeText,"
    + " charge=:serviceChargeAmount, discount_type=:discountType, credit_term=:credit_term, member_type_id=:memberTypeFieldList"
    + " WHERE id=:customer_id ";

    return db.query(sql, req.body);
  }

  var updateDefaultAddr = function(){
    console.log('updateDefaultAddr');
    var sql = " UPDATE address SET addr1=:defaultAddrNo,addr2=:defaultAddrSoi,tambon=:defaultAddrTambon,"
    + " amphur=:defaultAddrAmphur,province=:defaultAddrProvince,zipcode=:defaultAddrZipCode,tel=:defaultAddrPhone "
    + " WHERE customer_id=:customer_id AND default_address='Y'";
    return db.query(sql, req.body)
  }

  var deleteContactList = function() {
    var sql = "DELETE FROM customer_contact WHERE customer_id=:customer_id";
    return db.query(sql, req.body);
  }

  var deleteAddress = function() {
    var sql = "DELETE FROM address WHERE customer_id=:customer_id AND default_address <> 'Y'";
    return db.query(sql, req.body);
  }

  var deleteBillingList = function() {
    var sql = "DELETE FROM customer_billing_name WHERE customer_id=:customer_id AND default_address <> 'Y'";
    return db.query(sql, req.body);
  }

  var insertContactList = function(){
    console.log('edit ContactList');
    var all = [];
    for (var i = 0; i < req.body.contactListData.length; i++) {
      all.push(insertDataContactList(i));
    }
    //console.log('array =' + all);
    return q.all(all);
  }

  var insertDataContactList = function(i) {
    console.log('edit ContactList2');
    req.body.contactListData[i].customer_id = $scope.customer_id;

    var sql = "insert into customer_contact(customer_id, name, department, email, tel_no, line_id, memo,"
        + " addr1, addr2, tambon, amphur, province, zipcode, created_at, created_by, updated_at, updated_by)"
        + " VALUES (:customer_id, :contactName, :contactPosition, :contactEmail, :contactPhoneNo, :contactLineId, :contactRemark,"
        + " :contactAddr1, :contactAddr2, :contactTambon, :contactAmphur, :contactProvince, :contactZipcode, NOW(), '0', NOW(), '0') ";
      console.log(sql);
    return db.query(sql, req.body.contactListData[i]);
    // return db.query(sql, req.body.contactListData[i]).then(function(res) {
    //   $scope.contact_id.push(res.insertId);
    // });
  }

    var insertAddressList = function(){
      console.log('insertAddressList');
      var all = [];
      for (var i = 0; i < req.body.billingListData.length; i++) {
        all.push(insertDataAddressList(i));
      }
      return q.all(all);
    }

    var insertDataAddressList = function(i) {
      console.log('insertDataAddressList');
      req.body.billingListData[i].customer_id = $scope.customer_id;
      req.body.billingListData[i].tel = req.body.phone;
      req.body.billingListData[i].full_address = req.body.billingListData[i].billingAddr1 + ' ' + req.body.billingListData[i].billingAddr2
      + ' ' + req.body.billingListData[i].billingTambon + ' ' + req.body.billingListData[i].billingAmper + ' ' + req.body.billingListData[i].billingProvince
      + ' ' + req.body.billingListData[i].billingZipcode;
      //console.log(req.body.billingListData[i]);
      var sql = "insert into address(customer_id, type, addr1, addr2, tambon, amphur, province, zipcode, tel,"
        + " other, full_address, is_active, created_at, created_by, updated_at, updated_by)"
        + " VALUES (:customer_id, 'HOME', :billingAddr1, :billingAddr2, :billingTambon, :billingAmper, :billingProvince, :billingZipcode, :billingOtherNo,"
        + " '', :full_address, 'YES', NOW(), '0', NOW(), '0')";
        //console.log(sql);
      //return db.query(sql, req.body.billingListData[i]);
      return db.query(sql, req.body.billingListData[i]).then(function(res) {
        $scope.address_id.push(res.insertId);
      });
    }

    var insertBillingList = function(){
      console.log('insertBillingList');
      var all = [];
      console.log(req.body.billingListData.length,'XXX');
      for (var i = 0; i < req.body.billingListData.length; i++) {
        all.push(insertDataBillingList(i));
      }
      //console.log('array =' + all);
      return q.all(all);
    }

    var insertDataBillingList = function(i) {
      console.log('insertDataBillingList');
      req.body.billingListData[i].customer_id = $scope.customer_id;
      req.body.billingListData[i].address_id = $scope.address_id[i];

      var sql = "insert into customer_billing_name(code, customer_id, address_id, remark, memo, delivery_detial, payment_detial, default_billing,"
        + " created_at, created_by, updated_at, updated_by) "
        + " VALUES (:billingCode, :customer_id, :address_id, :billingRemark, :billingNote, :billingSend, :billingPayment, :default_billing,"
        + " NOW(), '0', NOW(), '0') ";
        //console.log(sql);
      return db.query(sql, req.body.billingListData[i]);
    }

    var selectDefultAddr = function(){
      console.log('selectDefultAddr');
      return q.all([
        (function() {
          var query = "select id from customer_billing_name where default_address = 'Y' AND customer_id = '" + req.body.customer_id + "'";
          return db.query(query).then(function(rows) {
              $scope.defultAddrId = rows[0];
            });
        })()
      ]);
    }

    var selectDefultBill = function(){
      console.log('selectDefultAddr');
      return q.all([
        (function() {
          var query = "select id from customer_billing_name where default_billing = 'Y' AND customer_id = '" + req.body.customer_id + "'";
          return db.query(query).then(function(rows) {
              $scope.defultBillId = rows[0];
            });
        })()
      ]);
    }

    var updateAddBillDefault = function(){
      console.log('updateAddBillDefault');
      console.log('Defualt Id is = ',$scope.defultAddrId.id);
      console.log('Defualt Bill Id is = ',$scope.defultBillId);

      req.body.defultAddrId = $scope.defultAddrId.id;
      if($scope.defultBillId == undefined){
        req.body.defultBillId = '0';
      }else {
        req.body.defultBillId = $scope.defultBillId.id;
      }
      var sql ="UPDATE customer SET default_address=:defultAddrId, default_billing=:defultBillId"
      + " WHERE id=:customer_id ";

      return db.query(sql, req.body);
    }

    var selectConfigOracle = function(){
      return q.all([
        (function() {
          var query = "select * from oracle_config";
          return db.query(query).then(function(rows) {
              $scope.configOracle = rows;
            });
        })()
      ]);
    }

    var db = conn.connect();
    db.beginTransaction()
      .then(selectConfigOracle)
      .then(updatePersonNationId)
      .then(updatePerson)
      .then(updateCustomers)
      .then(updateDefaultAddr)
      .then(deleteContactList)
      .then(deleteAddress)
      .then(deleteBillingList)
      .then(insertContactList)
      .then(insertAddressList)
      .then(insertBillingList)
      .then(selectDefultAddr)
      .then(selectDefultBill)
      .then(updateAddBillDefault)
      .then(function(){
        db.commit();
        updateToOracle();
        res.send({
          status:true,
          data: {
              person_id:$scope.customer_id,
              done:'อัพเดทข้อมูลสำเร็จ'
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


      var updateToOracle = function(){
        console.log('updateToOracle');
        console.log(req.body);
        var data = req.body;
          if(data.memberTypeFieldList == -1 || data.memberTypeFieldList == '-1'){
            data.customer_level = 'GENERAL';
          }else if (data.memberTypeFieldList == 1 || data.memberTypeFieldList == '1') {
            data.customer_level = 'PLATINUM';
          }else if (data.memberTypeFieldList == 2 || data.memberTypeFieldList == '2') {
            data.customer_level = 'GOLD';
          }else if (data.memberTypeFieldList == 3 || data.memberTypeFieldList == '3') {
            data.customer_level = 'SILVER';
          }else if (data.memberTypeFieldList == 4 || data.memberTypeFieldList == '4') {
            data.customer_level = 'SPENDER CLUB';
          }
        var billList = req.body.billingListData;

        var list = {};
        var flagDefault = 'N';
        for(i = 0; i < billList.length; i++){
          if(billList[i].default_billing=='Y'){
            flagDefault = 'Y';
            list.billName = billList[i].billingName;
            list.addr = billList[i].full_address;
            list.dalivery = billList[i].billingSend;
            list.payment = billList[i].billingPayment;
          }
        }
        if(flagDefault == 'N'){
          list.billName = billList[0].billingName;
          list.addr = billList[0].full_address;
          list.dalivery = billList[0].billingSend;
          list.payment = billList[0].billingPayment;
        }
        console.log(list);

        var str = $scope.configOracle;
        console.log(str);
        for (f = 0; f < str.length; f++){
          var myConn = {
            user          : str[f].user,
            password      : str[f].password,
            connectString : str[f].ip
          };
          console.log(myConn,$scope.person_id);
          oraConns.connect(myConn).then(function(oradb){
              var sql = " UPDATE COMPANY SET NAME=:name,ADDRESS=:address,TEL=:tel,FAX=:fax,BILL_NAME=:bill_name,BILL_ADDR=:bill_addr,"
                      + " DELIVERY_DETAIL=:delivery_detail,PAYMENT_DETAIL=:payment_detail,CREDIT_TERM=:credit_term,CUSTOMER_LEVEL=:customer_level,"
                      + " UPDATE_DATE=SYSDATE,MEMBER_NO=:member_no,MYSQL_PERSON_ID=:sql_id WHERE CODE=:code ";
              oraConns.query(oradb, sql,{
                code:data.customer_code,
                name:data.sex + ' ' + data.names + '  ' + data.last_name,
                address:list.addr,
                tel:data.phone,
                fax:data.fax,
                bill_name:list.billName,
                bill_addr:list.addr,
                delivery_detail:list.dalivery,
                payment_detail:list.payment,
                credit_term:data.credit_term,
                customer_level:data.customer_level,
                member_no:data.member_code,
                sql_id:$scope.person_id
              },true);
            }).catch(function(e){
            console.log('Phang');
            oraConns.close(oradb);
            res.send({
              status:false,
              error:e
            });
          });
        }
      }
});

router.post('/deleteCustomers',[bodyParser.json()], function(req, res) {
  console.log('Delete');
  console.log(req.body.customer_id);
  var $scope = {};
  $scope.person_id = req.body.customer_id;

  var deleteCustomers = function() {
      var sql = "UPDATE person SET is_active='NO', updated_at=NOW() WHERE id=:customer_id";

      return db.query(sql, req.body);
    }


  var selectConfigOracle = function(){
      return q.all([
        (function() {
          var query = "select * from oracle_config";
          return db.query(query).then(function(rows) {
              $scope.configOracle = rows;
            });
        })()
      ]);
    }

    var db = conn.connect();
    db.beginTransaction()
      .then(selectConfigOracle)
      .then(deleteCustomers)
      .then(function(){
        deleteToOracle();
        db.commit();
        res.send({
          status:true,
          data: {
              person_id:$scope.person_id,
              done:'ลบข้อมูลสมาชิกสำเร็จ'
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


      var deleteToOracle = function(){
        console.log('deleteToOracle');

        var str = $scope.configOracle;
        console.log(str);
        for (f = 0; f < str.length; f++){
          var myConn = {
            user          : str[f].user,
            password      : str[f].password,
            connectString : str[f].ip
          };
          console.log(myConn,$scope.person_id);
          oraConns.connect(myConn).then(function(oradb){
              var sql = " UPDATE COMPANY SET active = 'N' WHERE MYSQL_PERSON_ID=:mysql_person_id ";
              oraConns.query(oradb, sql,{
                mysql_person_id:$scope.person_id
              },true);
            }).catch(function(e){
            console.log('Phang');
            oraConns.close(oradb);
            res.send({
              status:false,
              error:e
            });
          });
        }
      }

});

// ///////////////////////////////  function product group  /////////////////////////////////////////////////////////////////////////

router.post('/group_product_list', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = conn.connect();

  var sql = 'SELECT id, code, name from point_group WHERE 1=1';
  var ext = {
    sortBy: 'code',
    fields: {
      code: { name: 'code' },
      name: { name: 'name' }
    }
  }

  helper.gridOpt(db, sql, req.body, ext).then(function(scope){
      res.send(scope);
  }).catch(function(error) {
      res.send(error);
  });

});

router.post('/group_proudct', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = conn.connect();

  var sql = 'SELECT code, name, dbname_oracle from point_group WHERE id=:group_id';

  db.query(sql, req.body).then(function(data){
    res.send({ status:true, data: data[0] });
  }).catch(function(e){
    res.send({ status:false, error: e });
  });

});

router.post('/product_all_item', [bodyParser.json()], function(req, res) {
  console.log('product_all_item', req.body);
  if(req.body.group_id != "0") 
  {
    oraConn.connect({ user:req.body.oracle_db }).then(function(oradb) {
      var $scope = {};
      (function() {
        var sql = "select CODE,ID,'false' AS flag from product where ROWNUM <= 100 and product_group_promotion_id = 0 and CODE LIKE :code ";
        if(req.body.search_prod == '') req.body.search_prod = '%%';
        return oraConn.query(oradb, sql, { code : req.body.search_prod }).then(function(result) {
          $scope.rows = oraConn.convert(result);
        });
      })().then(function(){
        oraConn.close(oradb);
        res.send({ status:true, data: $scope.rows});
      }).catch(function(e){
        res.send({ status:false, error: e });
      });
    }).catch(function(e){
      oraConn.close(oradb);
      res.send({ status:false, error: e });
    });
  } else {
    res.send({ status:true, data: []});
  } 

});

router.post('/group_all_item', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  db.select('point_group_product', { point_group_id : req.body.group_id }).then(function(data){
    res.send({ status:true, data: data });
  }).catch(function(e){
    res.send({ status:false, error: e });
  });
});




router.post('/group_proudct_save', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var sql = "", oraSql = "", item = {};
  var params = req.body.param;
  if(params.group_id == "0") {
    item = { group_code: params.group_code, group_name: params.group_name, staff_id: params.staff_id };
    sql = "INSERT INTO point_group (code, name, dbname_oracle, created_by, updated_by) VALUES (:group_code, :group_name, :oracle_db, :staff_id, :staff_id)";
    oraSql = "INSERT INTO point_group (id, code, name, created_at, created_by, updated_at, updated_by) " +
             "VALUES (POINT_GROUP_ID.NEXTVAL, :group_code, :group_name, SYSDATE, :staff_id, SYSDATE, :staff_id)";
  } else {
    item = { group_id: params.group_id, group_name: params.group_name, staff_id: params.staff_id };
    sql = "UPDATE point_group SET name=:group_name, updated_by=:staff_id WHERE id=:group_id"
    oraSql = "UPDATE point_group SET name=:group_name, updated_by=:staff_id WHERE id=:group_id"
  }

  db.query(sql, params).then(function(data){
    oracleConfig.user = params.oracle_db;
    oraConn.connect(oracleConfig).then(function(oradb) {
      oraConn.query(oradb, oraSql, item, true).then(function(){
        if(params.group_id !== "0") {
          db.delete('point_group_product', { point_group_id: params.group_id }).then(function(){
            oraSql = "DELETE FROM point_group_product WHERE point_group_id = :point_group_id";
            return oraConn.query(oradb, oraSql, { point_group_id: params.group_id }, true);
          }).then(function(){

            var all = [];
            for (var i in req.body.items){
              req.body.items[i];
              var dbData = { 
                point_group_id: params.group_id, 
                oracle_product_code: req.body.items[i].code, 
                oracle_product_id: req.body.items[i].id, 
                oracle_dbname: params.oracle_db 
              };
              var oraData = { 
                point_group_id: params.group_id, 
                product_code: req.body.items[i].code, 
                product_id: req.body.items[i].id,
                staff_id: params.staff_id
              };
              oraSql = "INSERT INTO point_group_product (product_code, product_id, point_group_id, created_at, created_by) " +
                "VALUES (:product_code, :product_id, :point_group_id, SYSDATE, :staff_id)";
              all.push(db.insert('point_group_product', dbData));
              all.push(oraConn.query(oradb, oraSql, oraData, true));
            }
            return q.all(all);
          }).then(function(){
            oraConn.close(oradb);
            res.send({ status:true, id: data.insertId });
          }).catch(function(e){
            oraConn.close(oradb);
            res.send({ status:false, error: e });
          });
        } else {
          oraConn.close(oradb);
          res.send({ status:true, id: data.insertId });
        }
      }).catch(function(e){
        oraConn.close(oradb);
        res.send({ status:false, error: e });
      });

    }).catch(function(e){
      oraConn.close(oradb);
      res.send({ status:false, error: e });
    });
  }).catch(function(e){
    res.send({ status:false, error: e });
  });

});


router.post('/group_proudct_delete', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var sql = "", oraSql = "", item = {};
  console.log('group_proudct_delete', req.body);
  db.delete('point_group_product', { point_group_id: req.body.id }).then(function(data){
    oracleConfig.user = req.body.oracle_db;
    
    oraConn.connect(oracleConfig).then(function(oradb) {
      oraSql = "DELETE FROM point_group_product WHERE point_group_id = :point_group_id";
      oraConn.query(oradb, oraSql, { point_group_id: req.body.id }, true).then(function(){
        oraSql = "DELETE FROM point_group WHERE id = :point_group_id";
        return oraConn.query(oradb, oraSql, { point_group_id: req.body.id }, true);
      }).then(function(){
        return db.delete('point_group', { id: req.body.id });
      }).then(function(){
        oraConn.close(oradb);
        res.send({ status:true });
      }).catch(function(e){
        oraConn.close(oradb);
        res.send({ status:false, error: e });
      });
    }).catch(function(e){
      oraConn.close(oradb);
      res.send({ status:false, error: e });
    });
  }).catch(function(e){
    res.send({ status:false, error: e });
  });

});


module.exports = router;
