var express     = require('express');
var router      = express.Router();
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var fs           = require('fs');
var conn        = require('../lib/db');
var helper      = require('../lib/helper');
var nsReport    = require('../lib/nsreport');

var doGetBooking = function(req, res) {
  var $scope = {};
  //console.log("GetBooking ID = ", req.body)

  var getBookingData = function(){
    var bookingId = req.body.bookingId;
      return q.all([
        (function() {
          var query = "select b.*, "
                    + "CONCAT('<label style=font-size:0.8em>', REPLACE(b.sender,char(10),'<br/>'), '</label>') AS sender1, "
                    + "CONCAT('<label style=font-size:0.8em>', REPLACE(b.receipient,char(10),'<br/>'), '</label>') AS receipient1, "
                    + "v.total sub_total "
                    + "from booking b join v_sumItem_price v on b.id = v.booking_id "
                    + "where b.id = '" + bookingId + "'";
          return db.query(query).then(function(rows) {
              $scope.booking = rows[0];
            });
        })()
      ]);
  }

  var db = conn.connect();
  db.beginTransaction()
    .then(getBookingData)
    .then(function(){
      db.commit();
      res.send({
        status:true,
        data: {
            bookingData:$scope.booking
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
}

var doGetBookingDetail = function(req, res){
  var $scope = {};
  console.log("Get Booking Detail ID = ", req.body);

  var getBookingDetail = function(){
    var bookingId = req.body.bookingId;
    return q.all([
      (function() {
        var query = "select booking_id, booking_name, package_contents_type, "
                  + "sum(qty) qty, width, depth, height, weight, volume_weight, "
                  + "sum(total_price) total_price "
                  + "from booking_detail where booking_id = '" + bookingId + "' "
                  + "GROUP BY booking_id,booking_name,package_contents_type,width, depth, height, weight, volume_weight";
        return db.query(query).then(function(rows) {
            $scope.bookingDetial = rows;
          });
      })()
    ]);
  }

  var db = conn.connect();
  db.beginTransaction()
    .then(getBookingDetail)
    .then(function(){
      db.commit();
      res.send({
        status:true,
        data: {
            bookingDetial:$scope.bookingDetial
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
}

var doGenReport = function(req, res){
  console.log('printReport',req.body.bookingId);
  var $scope = {};
  $scope.pdfFileShipment = 'shipment_'+ req.body.bookingId + '.pdf';
  $scope.pdfFileBarcode = 'barcode_' + req.body.bookingId + '.pdf';
  $scope.pdfFileInvoice = 'invoice_' + req.body.bookingId + '.pdf';

  var db = conn.connect();
  db.beginTransaction()
    // .then(getData)
    // .then(renderReport)
    .then(function() {
      res.send({
        status:true,
        data: {
          pdfFile: '/output/' + $scope.pdfFileShipment,
          pdfFileBarcode: '/output/' + $scope.pdfFileBarcode,
          pdfFileInvoice: '/output/' + $scope.pdfFileInvoice,
        }
      })
    }).catch(function(e) {
      console.log('catch',e);
      res.send({
        status:false,
        error:e
      })
    });
}

router.post('/api', bodyParser.json(), function(req, res) {
  console.log('Customer Function Js')
  if (!req.body) {
    res.sendStatus(400);
    return;
  }

  if (req.body.act==='getBooking') {
    doGetBooking(req, res);
  } else if (req.body.act=='getBookingDetail') {
    doGetBookingDetail(req, res);
  } else if (req.body.act == 'shipmentReport') {
    doGenReport(req, res);
  }
});


module.exports = router;
