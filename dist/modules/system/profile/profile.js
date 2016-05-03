var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var fs          = require('fs');
var xlsx        = require('node-xlsx');

var conn          = require('../../../lib/db');
var router      = express.Router();
var helper      = require('../../../lib/helper');

router.post('/changePass', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var getStaff = function() {
    var sql = "SELECT id FROM staff WHERE id=:id AND pass=md5(concat('ss2015', user, :pass))";
    console.log(req.session.data.staff);
    return db.query(sql, {
      id: req.session.data.staff.id,
      pass: req.body.old_pass
    }).then(function(rows) {
      if (rows.length == 0) {
        $scope.staff = null;
      } else {
        $scope.staff = rows[0];
      }
    });
  };

  var updatePass = function() {
    var sql = "UPDATE staff SET pass=md5(concat('ss2015', user, :pass)), pass2=:pass "
      + "WHERE id=:id";
    return db.query(sql, {
      id: req.session.data.staff.id,
      pass: req.body.new_pass
    });
  };

  getStaff().then(function() {
    if ($scope.staff == null) {
      res.send({
        status:false,
        error:'error.old_pass_incorrect'
      });
      return;
    }
    return updatePass().then(function() {
      res.send({
        status:true,
      });
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  });
});


module.exports = router;
