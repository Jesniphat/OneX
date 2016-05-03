var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var mysqlConn   = require('../../../lib/db');
var oraConn     = require('../../../lib/oracle');
var router      = express.Router();
var helper      = require('../../../lib/helper');
var mkdirp      = require('mkdirp');
var fs          = require('fs');
var path        = require('path');
var nsReport    = require('../../../lib/nsreport');
var xlsx        = require('node-xlsx');

router.post('/queryForWaitList', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {
      items: null
    };
    var param = req.body;

    var selectSql = "SELECT sd.id, si.company_id supplier_id, c.code supplier, "
      + "si.ref_inv invoice_code, si.ref_date invoice_date, si.po_no po_code, "
      + "sd.product_id, p.description product, sd.serial, sd.barcode, "
      + "sd.po_cost cost, sd.vat vat_rate, sd.vat*sd.po_cost/100.0 vat_amount, "
      + "sd.qty, sd.qty_yn, sd.voucher_payment_status status "
      + "FROM stock_in si JOIN stockin_detail sd ON si.id = sd.stockin_id "
      + "JOIN company c ON si.company_id = c.id "
      + "JOIN product p ON sd.product_id = p.id "
      + "JOIN staff sf ON si.staff_id = sf.id "
      + "JOIN shop sh ON si.shop_id = sh.id "
      + "WHERE c.code <> 'OLD' "

    var getStockItemByPO = function() {
      var sql = selectSql
        + "AND si.po_no=:po_code"
      return oraConn.query(oradb, sql, {po_code:param.po_code}).then(function(result) {
        $scope.items = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };;
      });
    }

    var getStockItemByInvoice = function() {
      var sql = selectSql
        + "AND si.ref_inv=:invoice_code"
      return oraConn.query(oradb, sql, {invoice_code: param.invoice_code}).then(function(result) {
        $scope.items = result;
      });
    }
    var getItem = null;
    if (param.po_code) {
      getItem = getStockItemByPO;
    } else if (param.invoice_code){
      getItem = getStockItemByInvoice;
    }
    return getItem().then(function() {
      res.send({
        status: true,
        data: $scope.items
      });
    }).catch(function(e) {
      res.send({
        status:false,
        error:e
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
