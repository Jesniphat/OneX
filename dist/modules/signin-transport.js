var express     = require('express');
var router      = express.Router();
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var fs           = require('fs');
var conn        = require('../lib/db');
var helper      = require('../lib/helper');
var cookie      = require('react-cookie');

var doSignIn = function(req, res) {
  console.log("Typ Login = CustomerSignin");
  var db = conn.connect();
  var $scope = {};

  var getStaff = function() {
    var sql = "select id, code user, password pass, firstname nickname, firstname displayname, email, '026754555' mobile, " 
            + "'YES' is_admin, is_active, '177' shop_id, '12' department_id, type, "
            + "'9996' suffix_barcode, '10' commission_pct, NOW() as last_login, '127.0.0.1' as last_ip, "
            + "'RK1' shop_code, 'รังสิต 1' as shop_name, 'NS' dep_code, 'NIPPON' dep_name, DATE_FORMAT(NOW(),'%Y-%m-%d') cur_date "
            + "from person WHERE code=:user";
    return db.query(sql, {user:req.body.user})
      .then(function(rows) {
        if (rows.length == 0) {
          throw 'signin.err_invalid_user';
        }
        $scope.staff = rows[0];
        console.log('staff',$scope.staff);
        console.log('reg',req.sessionID);
        console.log('regbody',req.body);
        console.log('req.body.hash',req.body.hash);
        console.log('md5',helper.md5($scope.staff.user+$scope.staff.pass+req.sessionID));
        if (req.body.hash != $scope.staff.pass) {
          console.log("wrog password");
          throw 'signin.err_invalid_pass';
        }

        if ($scope.staff.is_active=='NO') {
          throw 'signin.err_account_disabled';
        }
        return $scope.staff;
      });
  };

  var updateLastLogin = function() {
    return db.query('UPDATE staff SET last_login=NOW(), last_ip=:ip WHERE id=:id',
      {ip:req.connection.remoteAddress, id:$scope.staff.id});
  };

  var getPermissions = function() {
    var sql = 'SELECT b.code b_code, m.code m_code, p.code p_code ' +
      'FROM shop b ' +
      '  INNER JOIN staff_shop_role sbr ON b.id=sbr.shop_id ' +
      '    AND b.is_active=\'YES\' ' +
      '    AND sbr.is_active=\'YES\' ' +
      '    AND sbr.staff_id=:id ' +
      '  INNER JOIN role r ON sbr.role_id=r.id ' +
      '    AND r.is_active=\'YES\' ' +
      '  INNER JOIN role_permission rp ON r.id=rp.role_id ' +
      '    AND rp.is_active=\'YES\' ' +
      '  INNER JOIN permission p ON rp.permission_id=p.id ' +
      '    AND p.is_active=\'YES\' ' +
      '  INNER JOIN module m ON p.module_id=m.id ' +
      '    AND m.is_active=\'YES\' ';
    return db.query(sql, {id:$scope.staff.id})
      .then(function(rows) {
        var acl = {};
        rows.forEach(function(row) {
          if (!acl[row.b_code]) {
            acl[row.b_code] = {};
          }
          if (!acl[row.b_code][row.m_code]) {
            acl[row.b_code][row.m_code] = {};
          }
          acl[row.b_code][row.m_code][row.p_code]=true;
        });
        $scope.acl = acl;
        console.log("acl = ",acl);
        return acl;
      });
  };

  var prepareSession = function() {
    return q.all([
      updateLastLogin(),
      getPermissions()
    ]).then(function() {
      var data = {};
      data.staff = $scope.staff;
      data.acl = $scope.acl;
      data.shop = {
        id: $scope.staff.shop_id,
        code: $scope.staff.shop_code,
        name: $scope.staff.shop_name
      };
      data.shopList = [
        {code:'HQ', name:'สำนักงานใหญ่',isPrimary:true},
        {code:'01', name:'อโศก',isPrimary:false},
        {code:'02', name:'สีลม',isPrimary:false},
        {code:'03', name:'เอกมัย',isPrimary:false},
      ];
      data.period = '2015-04-18';
      data.current_date = new Date().toJSON().slice(0,10);
      req.session.data = data;
    });
  };

  getStaff()
    .then(prepareSession)
    .then(function() {
      var cid = $scope.staff.id;
      res.send({status:true, customerId:cid});
    })
    .catch(function(e) {
      res.send({status:false, error:e});
    });
};

var doRegister = function(req, res) {
  console.log("register1");
  console.log("req = ",req.body);

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
      var sql = " insert into customer_billing_name(customer_id,code,address_id,default_address) "
              + " values(:customer_id, 'D0000', :defultAddrId, 'Y')";
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
};

router.post('/api', bodyParser.json(), function(req, res) {
  if (!req.body) {
    res.sendStatus(400);
    return;
  }
  if (req.body.sid != req.sessionID) {
    res.send({status:false, session:false});
    return;
  }

  if (req.body.act==='signin-customer') {
    console.log("signin-customer");
    doSignIn(req, res);
  }
});

router.get('/:sid?', function(req, res) {
  cookie.plugToRequest(req, res);
  cookie.save('SS_LANG', process.env['SS_LANG']);
  if (!req.params.sid) {
    console.log("come herr");
    res.redirect('/signin-transport/' + req.sessionID);
    return;
  }
  fs.readFile(path.resolve(__dirname, '../views/index.html'), 'utf8', function(err, data) {
    if (err) {
      res.send({status:false, error:err})
      return
    }
    var scripts = [
      '/js/common.js',
      '/js/vendors.js',
      '/js/mui.js',
      '/js/signin_transport.js'
    ]
    var scriptHtml = '<script src="'
      + scripts.join('"></script>\n<script src="')
      + '"></script>'
    data = data.replace('#SCRIPT#', scriptHtml)

    var css = [
      '/css/signin-booking.css'
    ]
    var cssHtml = '<link rel="stylesheet" href="'
      + css.join('">\n<link rel="stylesheet" href="')
      + '">'
    data = data.replace('#CSS#', cssHtml)
    data = data.replace('#TITLE#', 'pieare&reg;')
    res.send(data)
  })

});


module.exports = router;
