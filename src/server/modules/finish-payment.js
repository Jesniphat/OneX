var express     = require('express');
var router      = express.Router();
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var fs           = require('fs');
var conn        = require('../lib/db');
var helper      = require('../lib/helper');
var nsReport    = require('../lib/nsreport');

var updateBooking = function(req, res){
  var $scope = {};
  console.log("Get Booking Detail ID = ", req.body);

  var updateSuccess = function(){
    var sql = "update booking set payment_status = 'success', status = 'WAIT_ASSIGN' "
            + "where id = '" + req.body.bookingId + "'";
    return db.query(sql, {}).then(function(res) {
      console.log("updateBookingItem = ", res);
      $scope.updateSuccess = res;
    });
  }

 var insertReceipt = function(){
   var sql = "INSERT INTO transport_receipt (currency_id, booking_id, receipt_no, receipt_date, receipt_amount, payment_type, "
           + "real_receipt, `change`, qty, receipt_addr) SELECT currency_id, booking_id, CONCAT('RC',SUBSTRING(invoice_no,4)), NOW(), invoice_amount, "
           + "payment_type, real_invoice, `change`, qty, invoice_addr FROM transport_invoice WHERE "
           + "booking_id = '" + req.body.bookingId + "'";
   return db.query(sql, {}).then(function(res) {
     $scope.receipt_id = res.insertId;
   });
 };

 var insertReceiptItem = function(){
   var sql = "INSERT INTO transport_receipt_detail (transport_receipt_id, booking_id, booking_detail_id, qty, "
           + "description, total_price) SELECT '" + $scope.receipt_id + "', booking_id, booking_detail_id, qty, "
           + "description, total_price FROM transport_invoice_detail WHERE booking_id = '" + req.body.bookingId + "'";
   return db.query(sql, {}).then(function(res) {
     console.log("res = ", res);
   });
 };

 var getShipmentData = function() {
     console.log("Gen Report")
     var sql = "SELECT b.id, b.booking_no, DATE_FORMAT(b.booking_date,'%d %b %Y') AS booking_date, b.waybill, b.sender, b.receipient, "
             + "b.item_qty, CONCAT('-',FORMAT(b.discount_amount,2)) discount_amount, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, "
             + "CONCAT(b.total_weight,' Kgs.') total_weight, CONCAT(b.total_volume_weight,' Kgs.') total_volume_weight, "
             + "FORMAT(b.charge_amount,2) charge_amount, FORMAT(b.total_amount,2) total_amount, bd.booking_name, sum(bd.qty) qty, "
             + "CONCAT(bd.width,' CM') width, CONCAT(bd.depth,' CM') depth, CONCAT(bd.height,' CM') height, UPPER(b.payment_status) payment_status, "
             + "FORMAT(sum(bd.total_price),2) total_price, CASE WHEN b.currency_id = '1' THEN 'THB' ELSE 'USD' END AS currency, "
             + "CONCAT((CASE WHEN b.total_weight > b.total_volume_weight THEN b.total_weight ELSE b.total_volume_weight END),' Kgs.') AS chargeable, "
             + "FORMAT(vs.total,2) AS sub_total "
             + "FROM booking b INNER JOIN booking_detail bd ON b.id = bd.booking_id INNER JOIN customer c ON b.customer_id = c.id "
             + "LEFT JOIN v_sumItem_price vs ON b.id = vs.booking_id "
             + "WHERE b.id = '" + req.body.bookingId + "' "
             + "GROUP BY b.id, b.booking_no, b.booking_date, b.waybill, b.sender, b.receipient, b.item_qty, b.discount_amount, "
             + "b.charge_amount, total_amount, bd.booking_name, bd.width, bd.depth, bd.height, b.discount_amount, b.total_weight, "
             + "b.total_volume_weight";

     return db.query(sql,{}).then(function(rows) {
       if (rows.length===0) {
         throw 'contract.error.contract_id_not_found';
       }
       $scope.shipmentData = rows;
     });

 };

 var renderShipmentReport = function() {
   var dfd = q.defer();
   $scope.pdfFile = 'shipment_'+ req.body.bookingId + '.pdf';
   var pdfFullPath = path.normalize(__dirname + '/../public/output/' + $scope.pdfFile);
   var report  = new nsReport();
   var doc = report.createDocument(require('./bookingtransport/report/shipment.js'), $scope.shipmentData);
   var stream = fs.createWriteStream(pdfFullPath);
   doc.pipe(stream);
   doc.end();
   stream.on('finish', function() {
   dfd.resolve();
   });
   stream.on('error', function() {
   dfd.reject();
   });
   return dfd.promise;
  };

  var getReceiptData = function() {
      console.log("Gen Receipt Report")
      var sql = "SELECT r.receipt_no, b.sender, CONCAT('BOOKING NO : ',b.booking_no) booking_no, CONCAT('WAYBILL NO : ',b.waybill) waybill, "
              + "CONCAT('RECEIPT DATE : ', DATE_FORMAT(r.receipt_date,'%d %b %Y')) AS receipt_date, "
              + "DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, r.qty, b.from_place, b.to_place, b.delivery_type, "
              + "rd.description, SUM(rd.qty) AS item_qty, FORMAT(rd.total_price,2) total_price, FORMAT(SUM(rd.total_price),2) AS amount, FORMAT(vsp.total,2) AS sub_total, "
              + "CONCAT('-',FORMAT(b.discount_amount,2)) discount_amount, FORMAT(b.total_amount,2) total_amount, FORMAT(b.charge_amount,2) charge_amount, "
              + "CASE WHEN b.currency_id = '1' THEN 'PRICE(THB)' WHEN b.currency_id = '2' THEN 'PRICE(USD)' END AS price_text, "
              + "CASE WHEN b.currency_id = '1' THEN 'AMOUNT(THB)' WHEN b.currency_id = '2' THEN 'AMOUNT(USD)' END AS amount_text, "
              + "FLOOR(b.grand_total_amount) AS total_amount_text, CASE WHEN b.currency_id = '1' THEN 'baht' WHEN b.currency_id = '2' THEN 'dollar' END AS unit_c, "
              + "CASE WHEN b.currency_id = '1' THEN 'satang' WHEN b.currency_id = '2' THEN 'cent' END AS unit_z, "
              + "FORMAT(b.vat_amount,2) vat_amount, FORMAT(b.grand_total_amount,2) grand_total_amount, CONCAT('Vat (', b.vat_rate, '%)') AS vat_text "
              + "FROM booking b INNER JOIN transport_receipt r ON b.id=r.booking_id INNER JOIN "
              + "transport_receipt_detail rd ON r.id = rd.transport_receipt_id INNER JOIN v_sumItem_price vsp ON b.id=vsp.booking_id "
              + "WHERE b.id = '" + req.body.bookingId + "' "
              + "GROUP BY b.sender, b.booking_no, b.waybill, r.receipt_date, b.pickup_date, qty, "
              + "b.from_place, b.to_place, b.delivery_type, rd.description, vsp.total, b.discount_amount, b.total_amount, b.charge_amount, rd.id";

      return db.query(sql,{}).then(function(rows) {
        if (rows.length===0) {
          throw 'contract.error.contract_id_not_found';
        }
        // console.log("Data Before = ", rows);  numberToEnglish
        for(var i = 0; i < rows.length; i++){
            var tt_text = rows[i].grand_total_amount.toString();
            console.log(tt_text);
            var afterDotIndex = rows[i].grand_total_amount.indexOf(".");
            var after = rows[i].grand_total_amount.substr(afterDotIndex + 1);
            var afterText = "";
            if(after != '00' || after != 00 || after != 0){
              afterText = " " + helper.numberToEnglish(after) + " " + rows[i].unit_z;
            }
            console.log("afterText = ", afterText);
            rows[i].amountText = "(" + helper.numberToEnglish(rows[i].total_amount_text) + " " + rows[i].unit_c + afterText + ")";
            console.log("Invoice Text M = ",rows[i].amountText);
        }
        // console.log("Data = ", rows);
        $scope.reportReceiptData = rows;
      });

  };

  var renderReceiptReport = function() {
    var dfd = q.defer();
    $scope.pdfFile = 'receipt_'+ req.body.bookingId + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../public/output/' + $scope.pdfFile);
    var report  = new nsReport();
    var doc = report.createDocument(require('./bookingtransport/report/receipt.js'), $scope.reportReceiptData);
    var stream = fs.createWriteStream(pdfFullPath);
    doc.pipe(stream);
    doc.end();
    stream.on('finish', function() {
    dfd.resolve();
    });
    stream.on('error', function() {
    dfd.reject();
    });
    return dfd.promise;
   };


  var db = conn.connect();
  db.beginTransaction()
    .then(updateSuccess)
    .then(insertReceipt)
    .then(insertReceiptItem)
    .then(getShipmentData)
    .then(renderShipmentReport)
    .then(getReceiptData)
    .then(renderReceiptReport)
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

  if (req.body.act==='setFinish') {
    updateBooking(req, res);
  }
});


module.exports = router;
