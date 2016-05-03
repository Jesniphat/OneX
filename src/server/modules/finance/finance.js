var express     = require('express');
var router      = express.Router();
var bodyParser  = require('body-parser');
var q           = require('q');

var conn        = require('../../lib/db');

router.use('/pv', require('./pv/pv'));

router.use('/cd', require('./cd/cd'));

router.use('/counts', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var getStaffCount = function() {
    return db.query("SELECT COUNT(*) AS cnt FROM staff WHERE is_active='YES'").then(function(rows) {
      $scope.staff = rows[0].cnt;
    });
  };
  var getShopCount = function() {
    return db.query("SELECT COUNT(*) AS cnt FROM shop WHERE is_active='YES'").then(function(rows) {
      $scope.shop = rows[0].cnt;
    });
  };
  var getDepartmentCount = function() {
    return db.query("SELECT COUNT(*) AS cnt FROM department WHERE is_active='YES'").then(function(rows) {
      $scope.department = rows[0].cnt;
    });
  };
  var getRoleCount = function() {
    return db.query("SELECT COUNT(*) AS cnt FROM role WHERE is_active='YES'").then(function(rows) {
      $scope.role = rows[0].cnt;
    });
  }

  var all = [];
  req.body.forEach(function(item) {
    if (item==='staff') {
      all.push(getStaffCount());
    } else if (item==='shop') {
      all.push(getShopCount());
    } else if (item==='department') {
      all.push(getDepartmentCount());
    } else if (item==='role') {
      all.push(getRoleCount());
    }
  });

  q.all(all).then(function() {
    res.send({
      status:true,
      counts:$scope
    });
  }).catch(function(e) {
    res.send({
      status:false
    });
  });

});

module.exports = router;
