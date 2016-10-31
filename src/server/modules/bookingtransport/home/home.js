var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var conn        = require('../../../lib/db');
var oraConn     = require('../../../lib/oracle');
var router      = express.Router();
var helper      = require('../../../lib/helper');
var mkdirp      = require('mkdirp');
var fs          = require('fs');
var path        = require('path');
var nsReport    = require('../../../lib/nsreport');
var xlsx        = require('node-xlsx');

var intransitFields = {
  id:{name:'id'},
  intransit_no:{name:'intransit_no'},
  intransit_qty:{name:'intransit_qty'},
  intransit_date:{name:'intransit_date'},
  accepted_qty:{name:'accepted_qty'},
  from:{name:'from'},
  to:{name:'to'},
  plan_qty:{name:'plan_qty'},
  status:{name:'status'},
  prepare_by:{name:'prepare_by'}
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////  Get Intransit List   ////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/allBooking',[bodyParser.json()], function(req, res){
  console.log("allBooking = ", req.body);
  var db = conn.connect();
  var $scope = {};
  $scope.person_id = req.body.person_id;

  if(req.body.valudFromPlace == 'all'){
    $scope.from = " AND b.from_place = b.from_place ";
  }else {
    $scope.from = " AND b.from_place = '" + req.body.valudFromPlace + "' ";
  }
  // console.log($scope.from);

  if(req.body.valueToPlace == 'all'){
    $scope.to = " AND b.to_place = b.to_place ";
  }else {
    $scope.to = " AND b.to_place = '" + req.body.valueToPlace + "' ";
  }
  // console.log($scope.to);

  var getInProcess = function(){
    var sql = "SELECT b.id, b.receipient, DATE_FORMAT(b.pickup_date, '%d %b %Y') AS `date_i`, b.booking_no, "
            + "bd.package_contents_type "
            + "FROM booking b LEFT JOIN booking_detail bd on b.id = bd.booking_id "
            + "INNER JOIN customer c ON b.customer_id = c.id "
            + "WHERE c.person_id = '" + $scope.person_id + "' AND `status` IN ('INPROCESS','WAIT_ASSIGN','WAIT_CLEAR_CREDIT_CARD') "
            + "AND (b.created_at between DATE_ADD(now(),INTERVAL -" + req.body.passMonth + " month) AND now()) "
            + $scope.from + $scope.to
            + "group by b.id ";
            // console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(rows) {
        $scope.inproocess = rows;
    });
  }

  var getIntransit = function(){
    var sql = "SELECT b.id, b.receipient, DATE_FORMAT(b.accepted_origin_date, '%d %b %Y') AS `date_i`, b.booking_no, "
            + "bd.package_contents_type "
            + "FROM booking b LEFT JOIN booking_detail bd on b.id = bd.booking_id "
            + "INNER JOIN customer c ON b.customer_id = c.id "
            + "WHERE c.person_id = '" + $scope.person_id + "' AND `status` IN ('INTRANSIT') "
            + "AND (b.created_at between DATE_ADD(now(),INTERVAL -" + req.body.passMonth + " month) AND now()) "
            + $scope.from + $scope.to
            + "group by b.id ";

    return db.query(sql, req.body).then(function(rows) {
        $scope.intransit = rows;
    });
  }

  var getArrived = function(){
    var sql = "SELECT b.id, b.receipient, DATE_FORMAT(b.accepted_destination_date, '%d %b %Y') AS `date_i`, b.booking_no, "
            + "bd.package_contents_type "
            + "FROM booking b LEFT JOIN booking_detail bd on b.id = bd.booking_id "
            + "INNER JOIN customer c ON b.customer_id = c.id "
            + "WHERE c.person_id = '" + $scope.person_id + "' AND `status` IN ('ARRIVED') "
            + "AND (b.created_at between DATE_ADD(now(),INTERVAL -" + req.body.passMonth + " month) AND now()) "
            + $scope.from + $scope.to
            + "group by b.id ";

    return db.query(sql, req.body).then(function(rows) {
        $scope.arrived = rows;
    });
  }

  var getDeliveried = function(){
    var sql = "SELECT b.id, b.receipient, DATE_FORMAT(b.deliveried_date, '%d %b %Y') AS `date_i`, b.booking_no, "
            + "bd.package_contents_type "
            + "FROM booking b LEFT JOIN booking_detail bd on b.id = bd.booking_id "
            + "INNER JOIN customer c ON b.customer_id = c.id "
            + "WHERE c.person_id = '" + $scope.person_id + "' AND `status` IN ('DELIVERIED') "
            + "AND (b.created_at between DATE_ADD(now(),INTERVAL -" + req.body.passMonth + " month) AND now()) "
            + $scope.from + $scope.to
            + "group by b.id ";

    return db.query(sql, req.body).then(function(rows) {
        $scope.deliveried = rows;
    });
  }

  var getException = function(){
    var sql = "SELECT b.id, b.receipient, DATE_FORMAT(b.accepted_destination_date, '%d %b %Y') AS `date_i`, b.booking_no, "
            + "bd.package_contents_type "
            + "FROM booking b LEFT JOIN booking_detail bd on b.id = bd.booking_id "
            + "INNER JOIN customer c ON b.customer_id = c.id "
            + "WHERE c.person_id = '" + $scope.person_id + "' AND `status` IN ('EXCEPTION') "
            + "AND (b.created_at between DATE_ADD(now(),INTERVAL -" + req.body.passMonth + " month) AND now()) "
            + $scope.from + $scope.to
            + "group by b.id ";
// console.log(sql);
    return db.query(sql, req.body).then(function(rows) {
        $scope.exception = rows;
    });
  }

  var getCancel = function(){
    var sql = "SELECT b.id, b.receipient, DATE_FORMAT(b.updated_at, '%d %b %Y') AS `date_i`, b.booking_no, "
            + "bd.package_contents_type "
            + "FROM booking b LEFT JOIN booking_detail bd on b.id = bd.booking_id "
            + "INNER JOIN customer c ON b.customer_id = c.id "
            + "WHERE c.person_id = '" + $scope.person_id + "' AND `status` IN ('CANCEL') "
            + "AND (b.created_at between DATE_ADD(now(),INTERVAL -" + req.body.passMonth + " month) AND now()) "
            + $scope.from + $scope.to
            + "group by b.id ";

    return db.query(sql, req.body).then(function(rows) {
        $scope.cancel = rows;
    });
  }

  q.all([
    getInProcess(),
    getIntransit(),
    getArrived(),
    getDeliveried(),
    getException(),
    getCancel()
  ]).then(function() {
    res.send({
      status:true,
      inproocess:$scope.inproocess,
      intransit: $scope.intransit,
      arrived: $scope.arrived,
      deliveried: $scope.deliveried,
      exception: $scope.exception,
      cancel: $scope.cancel
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  })

});


////////////////////////////////////////////////////////////////////////////////
///////////////  GetCityList  //////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/getCityList',[bodyParser.json()], function(req, res){
  console.log("allBooking = ", req.body);
  var db = conn.connect();
  var $scope = {};
  $scope.person_id = req.body.person_id;

  var getFromPlace = function(){
    var fromSql = "SELECT DISTINCT b.from_place "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id "
                + "WHERE c.person_id = '" + $scope.person_id + "'";

    return db.query(fromSql, req.body).then(function(rows) {
        $scope.from_place = rows;
    });
  }

  var getToFlace = function(){
    var toSql = "SELECT DISTINCT b.to_place "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id "
                + "WHERE c.person_id = '" + $scope.person_id + "'";

    return db.query(toSql, req.body).then(function(rows) {
        $scope.to_place = rows;
    });
  }

  q.all([
    getFromPlace(),
    getToFlace()
  ]).then(function() {
    res.send({
      status:true,
      from_place:$scope.from_place,
      to_place: $scope.to_place
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  })

});

////////////////////////////////////////////////////////////////////////////////
////////  export excel /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/export', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  console.log("export = ", $scope.person_id);
  $scope.person_id = req.body.person_id;

  if(req.body.valudFromPlace == 'all'){
    $scope.from = " AND b.from_place = b.from_place ";
  }else {
    $scope.from = " AND b.from_place = '" + req.body.valudFromPlace + "' ";
  }
  // console.log($scope.from);

  if(req.body.valueToPlace == 'all'){
    $scope.to = " AND b.to_place = b.to_place ";
  }else {
    $scope.to = " AND b.to_place = '" + req.body.valueToPlace + "' ";
  }

  var file_name = "booking_name_" + req.body.person_id;
  var sql = "SELECT b.booking_no, b.status, b.from_place, b.to_place, b.sender, b.receipient, "
          + "bd.package_contents_type, DATE_FORMAT(b.booking_date, '%d %b %Y') AS `booking date`, "
          + "DATE_FORMAT(b.accepted_origin_date, '%d %b %Y') AS `accepted origin date`, "
          + "DATE_FORMAT(b.accepted_destination_date, '%d %b %Y') AS `accepted destination date`, "
          + "DATE_FORMAT(b.deliveried_date, '%d %b %Y') AS `deliveried_date` "
          + "FROM booking b LEFT JOIN booking_detail bd on b.id = bd.booking_id "
          + "INNER JOIN customer c ON b.customer_id = c.id "
          + "WHERE c.person_id = '" + $scope.person_id + "' "
          + "AND (b.created_at between DATE_ADD(now(),INTERVAL -" + req.body.passMonth + " month) AND now()) "
          + $scope.from + $scope.to
          + "group by b.id ";

  var getRows = function() {
    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
      console.log($scope.rows);
    });
  }

  getRows().then(function() {
    var rows = $scope.rows.d; //console.log("$scope.rows.d = ", $scope.rows.d);
    rows.unshift($scope.rows.f); //console.log("$scope.rows.f = ", $scope.rows.f);
    try {
      var buffer = xlsx.build([{name: "ListBooking", data: rows}]);
    } catch (e) {
      console.log('ERROR=', e);
    }
    var id = helper.newUUID();
    var fname = '/output/booking_name_'+id+'.xlsx';
    try {
      fs.writeFileSync(path.normalize(__dirname + '/../../../public'+fname), buffer);
    } catch (e) {
      console.log('ERROR2=', e);
    }
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

module.exports = router;
