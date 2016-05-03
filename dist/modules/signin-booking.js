'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var q = require('q');
var fs = require('fs');
var conn = require('../lib/db');
var helper = require('../lib/helper');

var doSignIn = function doSignIn(req, res) {
  console.log("Typ Login = CustomerSignin");
  var db = conn.connect();
  var $scope = {};

  var getStaff = function getStaff() {
    var sql = "select id, code user, password pass, firstname nickname, firstname displayname, email, '026754555' mobile, " + "'YES' is_admin, is_active, '177' shop_id, '12' department_id, " + "'9996' suffix_barcode, '10' commission_pct, NOW() as last_login, '127.0.0.1' as last_ip, " + "'RK1' shop_code, 'รังสิต 1' as shop_name, 'NS' dep_code, 'NIPPON' dep_name, DATE_FORMAT(NOW(),'%Y-%m-%d') cur_date " + "from person WHERE code=:user";
    return db.query(sql, { user: req.body.user }).then(function (rows) {
      if (rows.length == 0) {
        throw 'signin.err_invalid_user';
      }
      $scope.staff = rows[0];
      console.log('staff', $scope.staff);
      console.log('reg', req.sessionID);
      console.log('regbody', req.body);
      console.log('req.body.hash', req.body.hash);
      console.log('md5', helper.md5($scope.staff.user + $scope.staff.pass + req.sessionID));
      if (req.body.hash != $scope.staff.pass) {
        console.log("wrog password");
        throw 'signin.err_invalid_pass';
      }

      if ($scope.staff.is_active == 'NO') {
        throw 'signin.err_account_disabled';
      }
      return $scope.staff;
    });
  };

  var updateLastLogin = function updateLastLogin() {
    return db.query('UPDATE staff SET last_login=NOW(), last_ip=:ip WHERE id=:id', { ip: req.connection.remoteAddress, id: $scope.staff.id });
  };

  var getPermissions = function getPermissions() {
    var sql = 'SELECT b.code b_code, m.code m_code, p.code p_code ' + 'FROM shop b ' + '  INNER JOIN staff_shop_role sbr ON b.id=sbr.shop_id ' + '    AND b.is_active=\'YES\' ' + '    AND sbr.is_active=\'YES\' ' + '    AND sbr.staff_id=:id ' + '  INNER JOIN role r ON sbr.role_id=r.id ' + '    AND r.is_active=\'YES\' ' + '  INNER JOIN role_permission rp ON r.id=rp.role_id ' + '    AND rp.is_active=\'YES\' ' + '  INNER JOIN permission p ON rp.permission_id=p.id ' + '    AND p.is_active=\'YES\' ' + '  INNER JOIN module m ON p.module_id=m.id ' + '    AND m.is_active=\'YES\' ';
    return db.query(sql, { id: $scope.staff.id }).then(function (rows) {
      var acl = {};
      rows.forEach(function (row) {
        if (!acl[row.b_code]) {
          acl[row.b_code] = {};
        }
        if (!acl[row.b_code][row.m_code]) {
          acl[row.b_code][row.m_code] = {};
        }
        acl[row.b_code][row.m_code][row.p_code] = true;
      });
      $scope.acl = acl;
      console.log("acl = ", acl);
      return acl;
    });
  };

  var prepareSession = function prepareSession() {
    return q.all([updateLastLogin(), getPermissions()]).then(function () {
      var data = {};
      data.staff = $scope.staff;
      data.acl = $scope.acl;
      data.shop = {
        id: $scope.staff.shop_id,
        code: $scope.staff.shop_code,
        name: $scope.staff.shop_name
      };
      data.shopList = [{ code: 'HQ', name: 'สำนักงานใหญ่', isPrimary: true }, { code: '01', name: 'อโศก', isPrimary: false }, { code: '02', name: 'สีลม', isPrimary: false }, { code: '03', name: 'เอกมัย', isPrimary: false }];
      data.period = '2015-04-18';
      data.current_date = new Date().toJSON().slice(0, 10);
      req.session.data = data;
    });
  };

  getStaff().then(prepareSession).then(function () {
    var cid = $scope.staff.id;
    res.send({ status: true, customerId: cid });
  }).catch(function (e) {
    res.send({ status: false, error: e });
  });
};

router.post('/api', bodyParser.json(), function (req, res) {
  console.log('signin-booking api');
  if (!req.body) {
    res.sendStatus(400);
  } else if (req.body.sid != req.sessionID) {
    res.send({ status: false, session: false });
  }

  if (req.body.act === 'signin-booking') {
    console.log("signin-booking");
    doSignIn(req, res);
  }
});

router.get('/:sid?', function (req, res) {
  console.log('signin-booking sid');
  if (!req.params.sid) {
    res.redirect('/signin-booking/' + req.sessionID);
    return;
  }
  fs.readFile(path.resolve(__dirname, '../views/index.html'), 'utf8', function (err, data) {
    if (err) {
      res.send({ status: false, error: err });
      return;
    }
    var scripts = ['/js/common.js', '/js/vendors.js', '/js/mui.js', '/js/signin_booking.js'];
    var scriptHtml = '<script src="' + scripts.join('"></script>\n<script src="') + '"></script>';
    data = data.replace('#SCRIPT#', scriptHtml);

    var css = ['/css/signin.css'];
    var cssHtml = '<link rel="stylesheet" href="' + css.join('">\n<link rel="stylesheet" href="') + '">';
    data = data.replace('#CSS#', cssHtml);
    data = data.replace('#TITLE#', 'pieare&reg;');
    res.send(data);
  });
});

module.exports = router;