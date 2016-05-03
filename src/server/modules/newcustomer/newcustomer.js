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
  console.log('JES');
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

    sql = mainQuery +
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

    sql = mainQuery +
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
      + " cb.memo billingNote, cb.payment_detial billingPayment, cb.code billingCode, cb.billing_name as billingName "
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
/////// Save Customer
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
          + " ,gender,email,password,is_active,created_at,created_by,updated_at,updated_by,idcard_info,passport_info"
          + " ,approve_status) "
          + " values(:customer_code, :customerTypeFieldList, :customerTitleList, :names, :last_name,"
          + " :customerTitleList  " + ":names   " + ":last_name, :tax_num, :customerGenderList, :e_mail, :password,"
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
            + "charge_text,charge,discount_type,credit_term,last_uses_shop) "
            + " values(:person_id, :member_code, :paymentTypeList, :currencyList, :discount, :serviceChargeText,"
            + " :serviceChargeAmount, :discountType, :credit_term, '0') ";
    return db.query(sql, req.body).then(function(res) {
      $scope.customer_id = res.insertId;
    });
  }

    // var insertContactList = function(){
    //   console.log('insertContactList');
    //   var all = [];
    //   //console.log(req.body.contactListData.length,'XXX');
    //   for (var i = 0; i < req.body.contactListData.length; i++) {
    //     all.push(insertDataContactList(i));
    //   }
    //   //console.log('array =' + all);
    //   return q.all(all);
    // }

  //   var insertDataContactList = function(i) {
  //     console.log('insertDataContactList');
  //     req.body.contactListData[i].customer_id = $scope.customer_id;
  //
  //     var sql = "insert into customer_contact(customer_id, name, department, email, tel_no, line_id, memo, created_at, created_by, updated_at, updated_by)"
  //       + " VALUES (:customer_id, :contactName, :contactPosition, :contactEmail, :contactPhoneNo, :contactLineId, :contactRemark, NOW(), '0', NOW(), '0') ";
  //       //console.log(sql);
  //     return db.query(sql, req.body.contactListData[i]);
  //     // return db.query(sql, req.body.contactListData[i]).then(function(res) {
  //     //   $scope.contact_id.push(res.insertId);
  //     // });
  //   }

    var insertDefaultAddr = function(){
      console.log('insertdefaultAddr');
      req.body.customer_id = $scope.customer_id;
      var sql = " insert into address(customer_id,type,addr1,addr2,tambon,amphur,province,zipcode,tel,default_address) "
              + " values(:customer_id, 'HOME', '-', '-', '-', '-', '-', '-', '-', 'Y')";
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

    // var selectDefultBill = function(){
    //   console.log('selectDefultAddr');
    //   return q.all([
    //     (function() {
    //       var query = "select id from customer_billing_name where default_billing = 'Y' AND customer_id = '" + $scope.customer_id + "'";
    //       return db.query(query).then(function(rows) {
    //           $scope.defultBillId = rows[0];
    //         });
    //     })()
    //   ]);
    // }

    var updateAddBillDefault = function(){
      console.log('updateAddBillDefault');
      console.log('Defualt Id is = ',$scope.defultAddrId.id);
      //console.log('Defualt Bill Id is = ',$scope.defultBillId.id);

      req.body.defultAddrId = $scope.defultAddrId.id;
      req.body.customer_id = $scope.customer_id;
      var sql ="UPDATE customer SET default_address=:defultAddrId"
      + " WHERE id=:customer_id ";

      return db.query(sql, req.body);
    }

    var db = conn.connect();
    db.beginTransaction()
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
/////// Edit Customer
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
      + " prename=:customerTitleList, firstname=:names, lastname=:last_name, email=:e_mail, password=:password,"
      + " is_active=:is_active_list WHERE id=:id";

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
    + " charge=:serviceChargeAmount, discount_type=:discountType, credit_term=:credit_term"
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

  var updateNameDefaultAddr = function(){
    console.log('updateNameDefaultAddr');
    var sql = " UPDATE customer_billing_name SET billing_name=:defaultAddrName "
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
        + " created_at, created_by, updated_at, updated_by, billing_name) "
        + " VALUES (:billingCode, :customer_id, :address_id, :billingRemark, :billingNote, :billingSend, :billingPayment, :default_billing,"
        + " NOW(), '0', NOW(), '0', :billingName) ";
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
      .then(updatePersonNationId)
      .then(updatePerson)
      .then(updateCustomers)
      .then(updateDefaultAddr)
      .then(updateNameDefaultAddr)
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

    var db = conn.connect();
    db.beginTransaction()
      .then(deleteCustomers)
      .then(function(){
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
});

// ///////////////////////////////  function product group  /////////////////////////////////////////////////////////////////////////

// router.post('/productGroupList', [bodyParser.json()], function(req, res) {
//   var $scope = {};
//   var selectConfigOracle = function(){
//       return q.all([
//         (function() {
//           var query = "select * from oracle_config";
//           return db.query(query).then(function(rows) {
//               $scope.configOracle = rows;
//             });
//         })()
//       ]);
//     }

//   var selectListOracle = function(){
//       console.log('JES_PRODUCTGROUP',$scope.configOracle[0]);
//       //var db = conn.connect();
//       var str = $scope.configOracle;
//       var myConn = {
//         user          : str[0].user,
//         password      : str[0].password,
//         connectString : str[0].ip
//       };

//       oraConn.connect(myConn).then(function(oradb) {
//         //var $scope = {};

//         var fldList = "s.id, s.sell_date, s.receipt_no, sh.name shop_name, "
//           + "s.contract_ref, c.name company_name, "
//           + "p.description product_description, sd.serial product_serial, "
//           + "sd2.price, sd2.cost, sd2.install_cost,sd2.price main_price, "
//           + "nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,0)+sd2.down_payment down_payment, "
//           + "sd2.price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,0)-sd2.down_payment remain_price, "
//           + "sst.fullname sales_staff, fst.fullname finance_staff, "
//           + "case when fst.nickname like '%'||:nickname||'%' then '*' else '' end flag"

//         var mainQuery = " select ID,NAME,DESCRIPTION,ROWNUM AS RM from promotion_group "

//         var cond = [];
//         var hasJoin = false;
//         for(var fld in req.body.keywords) {
//           var keyword = req.body.keywords[fld];
//           if (typeof keyword === 'undefined') {
//             continue;
//           }
//           keyword = keyword.trim();
//           if (keyword == '') {
//             continue;
//           }
//           if (typeof promotionFields[fld]==='undefined') {
//             continue;
//           }
//           var tmp = helper.genCond(promotionFields[fld], keyword, true);
//           if (tmp==='') {
//             continue;
//           }
//           cond.push(tmp);
//         }
//         if (cond.length > 0) {
//           mainQuery += ' AND ' + cond.join(' AND ');
//         }

//         var getCount = function() {
//             sql = 'SELECT COUNT(*) AS cnt FROM ('
//               + mainQuery + ') x';

//           return oraConn.query(oradb, sql, {}).then(function(result) {
//             if (result.rows.length==0) {
//               $scope.totalRows = 0;
//             } else {
//               $scope.totalRows = result.rows[0][0];
//             }
//           });
//         }

//         var getRows = function() {
//           var sortBy = req.body.sortBy || 'sell_date';
//           var sortDir = req.body.sortDir || 'DESC';
//           var limit = req.body.limit || 50;
//           var page = parseInt(req.body.page || 0);
//           var sql;
//           var sortBy2;

//           $scope.opt = {
//             sortBy: sortBy,
//             sortDir: sortDir,
//             limit: limit,
//             page: page,
//             totalRows: 0
//           };

//           sql = "select * from (" +  mainQuery + ") prod where prod.RM >=" + (page*limit+1) + " and prod.RM <=" + ((page+1)*limit + "order by ID");
//           console.log(sql);

//           return oraConn.query(oradb, sql, {}).then(function(result) {
//             $scope.rows = {
//               d: result.rows,
//               f: result.metaData.map(function(fld) {
//                 return fld.name.toLowerCase();
//               })
//             };
//           });
//         }

//         q.all([
//           getCount(),
//           getRows()
//         ]).then(function() {
//           oraConn.close(oradb);
//           $scope.opt.totalRows = $scope.totalRows;
//           res.send({
//             status: true,
//             data: $scope.rows,
//             opt: $scope.opt
//           });
//         }).catch(function(e) {
//           oraConn.close(oradb);
//           res.send({
//             status: false,
//             error: e
//           });
//         });
//       }).catch(function(e) {
//         res.send({
//           status:false,
//           error:e
//         });
//       });
//   }

//   var db = conn.connect();
//   db.beginTransaction()
//     .then(selectConfigOracle)
//     .then(function(){
//       selectListOracle();
//       db.commit();
//     }).catch(function(e) {
//       console.log('rollback', e);
//       db.rollback(function(e) {
//         res.send({
//           status:false,
//           error:e
//         });
//       });
//     });

// });


// router.post('/prodList', [bodyParser.json()], function(req, res) {
//   console.log(req.body);
//   var $scope = {};
//   var selectConfigOracle = function(){
//       return q.all([
//         (function() {
//           var query = "select * from oracle_config";
//           return db.query(query).then(function(rows) {
//               $scope.configOracle = rows;
//             });
//         })()
//       ]);
//     }


//     var selectListOracle = function(){
//         console.log('prodList',$scope.configOracle[0]);
//         //var db = conn.connect();
//         var str = $scope.configOracle;
//         var myConn = {
//           user          : str[0].user,
//           password      : str[0].password,
//           connectString : str[0].ip
//         };

//         oraConn.connect(myConn).then(function(oradb) {
//           var $scope = {};
//           //var mainQuery = " select CODE from product "

//           var getRows = function() {
//             var sql;
//             //sql = mainQuery;
//             sql = "select CODE,ID,'false' AS flag from product where ROWNUM <= 8 and product_group_promotion_id = 0 ";
//             console.log(sql);

//             return oraConn.query(oradb, sql, {}).then(function(result) {
//               $scope.rows = {
//                 d: result.rows,
//                 f: result.metaData.map(function(fld) {
//                   return fld.name.toLowerCase();
//                 })
//               };
//             });
//           }

//           q.all([
//             getRows()
//           ]).then(function() {
//             oraConn.close(oradb);
//             res.send({
//               status: true,
//               data: $scope.rows,
//               opt: $scope.opt
//             });
//             //res.send({ status:true, data: { contactListData: $scope.contactListData } });
//           }).catch(function(e) {
//             console.log(e);
//             oraConn.close(oradb);
//             res.send({
//               status: false,
//               error: e
//             });
//           });
//         }).catch(function(e) {
//           res.send({
//             status:false,
//             error:e
//           });
//         });
//     }




//   var db = conn.connect();
//   db.beginTransaction()
//     .then(selectConfigOracle)
//     .then(function(){
//       selectListOracle();
//       db.commit();
//     }).catch(function(e) {
//       console.log('rollback', e);
//       db.rollback(function(e) {
//         res.send({
//           status:false,
//           error:e
//         });
//       });
//     });
// });




// router.post('/prodGroupSave', [bodyParser.json()], function(req, res) {
//   //console.log(req.body);
//   var $scope = {};
//   var idProdGroup = '';

//   var selectConfigOracle = function(){
//       return q.all([
//         (function() {
//           var query = "select * from oracle_config";
//           return db.query(query).then(function(rows) {
//               $scope.configOracle = rows;
//             });
//         })()
//       ]);
//     }

//   var db = conn.connect();
//   db.beginTransaction()
//     .then(selectConfigOracle)
//     .then(function(){
//       db.commit();
//       Oracle();
//       res.send({
//         status:true,
//         data: {
//             done:'เพิ่มข้อมูลสำเร็จ'
//         }
//       });
//     }).catch(function(e) {
//       console.log('rollback', e);
//       db.rollback(function(e) {
//         res.send({
//           status:false,
//           error:e
//         });
//       });
//     });


//     var Oracle = function(){
//       var $scopes = {};
//       var str = $scope.configOracle;
//       var myConn = {
//         user          : str[0].user,
//         password      : str[0].password,
//         connectString : str[0].ip
//       };
//       var inId = req.body.id;
//       var inName = req.body.groupName;
//       //console.log(inId);

//       oraConns.connect(myConn).then(function(oradb){
//         var updateIdRef = req.body.id;

//         var insertPromotion = function(){
//           var sql = " insert into PROMOTION_GROUP(ID,NAME,CREATED_AT,UPDATED_AT) "
//                   + " values((PROMOTION_GROUP_ID.NEXTVAL),:inName,SYSDATE,SYSDATE) ";
//           return oraConns.query(oradb, sql,{inName:inName},true);
//         }

//         var getPromotionId = function(){
//           var sql = 'select MAX(ID) from PROMOTION_GROUP ';
//           return oraConn.query(oradb, sql, {}).then(function(result) {
//             $scopes.promotionId = result.rows[0][0];
//           });
//         }

//         var setGroup = function(){
//           var sql = " update product set product_group_promotion_id = "+$scopes.promotionId+" where id in ("+updateIdRef+") ";
//           return oraConns.query(oradb, sql,{},true);
//         }

//         return insertPromotion()
//         .then(getPromotionId)
//         .then(setGroup);
//         }).then(function(){
//           console.log('NNN');
//         }).catch(function(e){
//         oraConns.close(oradb);
//         res.send({
//           status:false,
//           error:e
//         });
//       });

//     }


// });


module.exports = router;
