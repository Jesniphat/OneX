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

router.post('/checkproduct', [bodyParser.json()], function(req, res) {

  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var getContract = function(){
      var sql = " select c.id, c.sell_id, p.nationid from contract c inner join person p "
                +" on c.cus_person_id = p.id "
                +" where c.code = :code and c.current_status in ('NORMAL','DEBT') ";

        return db.query(sql,{code:req.body.code}).then(function(rows) {
          if (rows.length===0) {
            throw 'error.contract_id_not_found';
          }
          $scope.contract_id = rows[0].id;
          $scope.sell_id = rows[0].sell_id;
          $scope.nation_id = rows[0].nationid;
        });
    }

    var checkReturn = function(){
        var sql = " select r.id from returnx r inner join returnx_detail rd "
                  + " on r.id = rd.return_id "
                  + " inner join stock_shop s on s.barcode = rd.barcode "
                  + " where r.sell_id = :sell_id and rd.barcode = :barcode and r.finance_used = 'N' ";

        return oraConn.query(oradb, sql, {sell_id:$scope.sell_id,barcode:req.body.barcode}).then(function(result) {
          if (result.rows.length === 0){
            throw 'error';
          }else{
            $scope.return_id = result.rows[0][0];
          }
        });
    }

    var checkNewSell = function(){
        var sql = " select id from sell where id=:id and contract_id = 0 ";

        return oraConn.query(oradb, sql, {id:req.body.newsell_id}).then(function(result) {
          if (result.rows.length === 0){
            throw 'error';
          }else{
            $scope.newsell_id = result.rows[0][0];
          }
        });
    }

    var db = conn.connect();

    db.beginTransaction()
      .then(getContract)
      .then(checkReturn)
      .then(checkNewSell)
      .then(function(){
        oraConn.close(oradb);
        res.send({
          status:true,
          data:{
            contract_id:$scope.contract_id,
            sell_id:$scope.sell_id,
            return_id:$scope.return_id,
            nation_id:$scope.nation_id,
            newsell_id:$scope.newsell_id
          }
        });
      }).catch(function(e) {
        oraConn.close(oradb);
        console.log('rollback', e);
        db.rollback();
        res.send({
          status:false,
          error:e
        });
      });
  }).catch(function(e){
    oraConn.close(oradb);
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/saveCloseChange', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = mysqlConn.connect();
  var saveCloseChange = function(id, addrData) {
    var sql = " update contract set current_status='CLOSE_CHANGE', close_date=NOW()  where id:id ";
    return db.query(sql, {id:req.body.id});
  }

  var all = [
    saveCloseChange()
  ];
  q.all(all).then(function() {
    res.send({
      status: true
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

module.exports = router;
