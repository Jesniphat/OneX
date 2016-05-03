var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var conn          = require('../../lib/db');
var router      = express.Router();
var helper      = require('../../lib/helper');

router.use('/profile', require('./profile/profile'));

router.post('/sessionInfo', [bodyParser.json()], function(req, res) {
  console.log(req.session.data);
  var data = req.session.data;
  data.sessionID = req.sessionID;
  res.send({
    status:true,
    session: req.session.data
  });
});

router.post('/sessionUpdate', [bodyParser.json()], function(req, res) {
  for (var i in req.body) {
    req.session.data[i] = req.body[i];
  }

  res.send({
    status:true,
    session: req.session.data
  });
});

router.post('/userInfo', [bodyParser.json()], function(req, res) {
  res.send({
    status:true,
    user: req.session.staff
  });
});

router.post('/ping', function(req, res) {
  res.send({
    status:true,
    sessionID: req.sessionID
  });
});

router.post('/signout', [bodyParser.json()], function(req, res) {
  delete req.session.data;
  res.send({status:true});
});

router.post('/getMaster', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var getModule = function() {
    req.session.data.staff = req.session.data.staff || {};
    var caseStaff = true;
    var sql = "SELECT id, code, name, icon, acl_code FROM module WHERE is_active='YES' ORDER BY sorting";
    if (req.session.data.staff.id == 1){

      sql="SELECT id, code, name, icon, acl_code FROM module ORDER BY sorting";
    } else if (req.session.data.user != undefined){
      caseStaff = false;
      sql="SELECT id, code, name, icon, acl_code FROM module WHERE is_customer='YES' ORDER BY sorting";
    }

    return db.query(sql).then(function(rows) {
      $scope.modules = rows;
      $scope.staff = caseStaff;
    });
  }

  var getShop = function() {
    var sql = "SELECT id,code, name FROM shop WHERE is_active='YES' ORDER BY code";
    return db.query(sql).then(function(rows) {
      $scope.shops = rows;
    });
  }

  q.all([
    getModule(),
    getShop()
  ]).then(function() {
    res.send({
      status:true,
      data: {
        modules: $scope.modules,
        shops: $scope.shops
      }
    })
  }).catch(function(e) {
    res.send({status: false, error: e});
  });

});

module.exports = router;
