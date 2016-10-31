var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var conn        = require('../../../lib/db');
var oraConn          = require('../../../lib/oracle');
var oraConns    = require('../../../lib/oraclemulti');
var router      = express.Router();
var helper      = require('../../../lib/helper');
var fs          = require('fs');
var nsReport    = require('../../../lib/nsreport');
var xlsx        = require('node-xlsx');
var moment      = require('moment');
// var multer      = require('multer');

// var upload      = multer({ dest: __dirname+'/../../public/uploads/tmp/' })

router.post('/save', [bodyParser.json()], function(req, res) {
  console.log("data = ", req.body);
  var insertCompanyProfile = function(){
    var sql = "UPDATE company_profile SET name = :company_name, addr1 = :addr1, "
            + "road = :addr2, tambon = :tambon, amphur = :amphur, "
            + "province = :province, zipcode = :zipcode, tel = :tel, email = :email, "
            + "homepage = :homepage, `condition` = :conditionpage, document1 = :doc1, "
            + "document2 = :doc2, document3 = :doc3, created_by = :staff_id, updated_by = :staff_id, "
            + "vat_rate = :vatrate";
    return db.query(sql, req.body).then(function(res) {
      console.log("updateCompany = ", res);
    });
  }

  var db = conn.connect();
  db.beginTransaction()
    .then(insertCompanyProfile)
    .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              done:'Update complete.'
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

////////////////////////////////////////////////////////////////////////////////
////////     facetSetting     //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/facetSetting', [bodyParser.json()], function(req, res) {
  console.log("data = ", req.body);
  var $scope = {};
  var getCompanyProfile = function(){
    var sql = "SELECT * FROM company_profile order by id desc limit 1";
    return db.query(sql, {}).then(function(res) {
      $scope.company = res[0];
      console.log("data = ", $scope.company);
    });
  }

  var db = conn.connect();
  db.beginTransaction()
    .then(getCompanyProfile)
    .then(function(){
        res.send({
          status:true,
          data: {
              done: $scope.company
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

module.exports = router;
