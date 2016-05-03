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
  var db = conn.connect();
  var $scope = {};

  var getStaff = function() {
    return db.selectOne({ table: 'customer', fields: [ 'person_id', 'password' ] }, { member_no: req.body.user })
      .then(function(rows) {
        if (rows == undefined) {
          throw 'signin.err_invalid_user';
        }
        $scope = rows;
        console.log('staff',$scope);
        console.log('reg',req.sessionID);
        console.log('regbody',req.body);
        console.log('req.body.hash',req.body.hash);
        console.log('scope', $scope);
        if (req.body.hash != $scope.password) {
          console.log("wrog password");
          throw 'signin.err_invalid_pass';
        }

        if ($scope.is_active=='NO') {
          throw 'signin.err_account_disabled';
        }
        return $scope;
      });
  };

  // var updateLastLogin = function() {
  //   return db.query('UPDATE staff SET last_login=NOW(), last_ip=:ip WHERE id=:id',
  //     {ip:req.connection.remoteAddress, id:$scope.staff.id});
  // };

  // var getPermissions = function() {
  //   var sql = 'SELECT b.code b_code, m.code m_code, p.code p_code ' +
  //     'FROM shop b ' +
  //     '  INNER JOIN staff_shop_role sbr ON b.id=sbr.shop_id ' +
  //     '    AND b.is_active=\'YES\' ' +
  //     '    AND sbr.is_active=\'YES\' ' +
  //     '    AND sbr.staff_id=:id ' +
  //     '  INNER JOIN role r ON sbr.role_id=r.id ' +
  //     '    AND r.is_active=\'YES\' ' +
  //     '  INNER JOIN role_permission rp ON r.id=rp.role_id ' +
  //     '    AND rp.is_active=\'YES\' ' +
  //     '  INNER JOIN permission p ON rp.permission_id=p.id ' +
  //     '    AND p.is_active=\'YES\' ' +
  //     '  INNER JOIN module m ON p.module_id=m.id ' +
  //     '    AND m.is_active=\'YES\' ';
  //   return db.query(sql, {id:$scope.staff.id})
  //     .then(function(rows) {
  //       var acl = {};
  //       rows.forEach(function(row) {
  //         if (!acl[row.b_code]) {
  //           acl[row.b_code] = {};
  //         }
  //         if (!acl[row.b_code][row.m_code]) {
  //           acl[row.b_code][row.m_code] = {};
  //         }
  //         acl[row.b_code][row.m_code][row.p_code]=true;
  //       });
  //       $scope.acl = acl;
  //       console.log("acl = ",acl);
  //       return acl;
  //     });
  // };

  var prepareSession = function() {
    // return q.all([
    //   updateLastLogin(),
    //   // getPermissions()
    // ]).then(function() {
      var data = {};
      data.current_date = new Date().toJSON().slice(0,10);
      data.user = req.body.user;
      data.staff = { is_admin : false, cur_date: data.current_date };
      data.acl = { HQ: [] };
      data.shop = { code: 'HQ' };
      data.shopList = [
        {code:'HQ', name:'สำนักงานใหญ่',isPrimary:true}
      ];
      data.period = '2015-04-18';
      req.session.data = data;
    // });
  };

  getStaff()
    // .then(prepareSession)
    .then(function() {
      prepareSession();
      res.send({status:true, customerId: $scope.person_id});
    })
    .catch(function(e) {
      res.send({status:false, error:e});
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
    res.redirect('/signin-customer/' + req.sessionID);
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
      '/js/signin_customer.js'
    ]
    var scriptHtml = '<script src="'
      + scripts.join('"></script>\n<script src="')
      + '"></script>'
    data = data.replace('#SCRIPT#', scriptHtml)

    var css = [
      '/css/signin.css'
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
