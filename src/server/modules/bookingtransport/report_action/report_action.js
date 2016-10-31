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


//////////////////////////////////////////////////////////////////////////////////////////
//+++++++++++++++++++++++++  genReportMasterManifest  ++++++++++++++++++++++++++++++++++++
//////////////////////////////////////////////////////////////////////////////////////////
router.post('/genReportManifest', [bodyParser.json()], function(req, res) {
  console.log("genReportManifest = ", req.body);
  var $scope = {};

  var genReportMasterManifest = function() {
    console.log("genReportMasterManifest");
    var sql = "select * from v_master_manifest where where_date = '" + req.body.manifest_date + "' "
            + "AND `from` = '" + req.body.from + "' AND `to` = '" + req.body.to + "'";
    console.log("sql = ", sql);

    return db.query(sql, req.body).then(function(res) {
      $scope.manifestData = res;
      // console.log("$scope.intransitData = ", $scope.intransitData);
    });
  }

  var genNewDataReport = function(){
    var sum_gross_weights = 0;
    for (var i=0; i<$scope.manifestData.length; i++){
      sum_gross_weights = sum_gross_weights + parseFloat($scope.manifestData[i].gross_weight);
      $scope.manifestData[i].item_num = i + 1;
      // console.log("sum_gross_weights = ",$scope.manifestData[i].gross_weights);
    }
    $scope.manifestData[0].item_no = $scope.manifestData.length;
    var sum_date = {intransit_id: '',created_date: '',intransit_date: '',intransit_no: 'Total',accepted_date: '',prepare_by: '',
      intransit_qty: '',from: '',to: '',person_code: 'Total',waybill: '',item_no: '',product_name: '',gross_weight: helper.numberFormat(sum_gross_weights,2),
      origit_code: '',destination_code: '',remark: '',where_date:'',size:'',item_num:''
    }
    $scope.manifestData.push(sum_date);
    console.log("Real data = ", $scope.manifestData);
    return $scope.manifestData;
  }

  var renderReport = function() {
    console.log("renderReport Manifest Master");
    var dfd = q.defer();
    $scope.pdfFile = 'master_manifest_'+ req.body.manifest_date + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../../public/output/intransit/' + $scope.pdfFile);
    var report  = new nsReport();
    var doc = report.createDocument(require('../report/master_manifest.js'), $scope.manifestData);
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
  }

  var db = conn.connect();
  db.beginTransaction()
  .then(genReportMasterManifest)
  .then(genNewDataReport)
  .then(renderReport)
  .then(function() {
    res.send({
      status:true,
      data: {
        pdfFile: '/output/intransit/'+$scope.pdfFile,
        manifest_date: req.body.manifest_date
      }
    })
    console.log("Test Gen Report")
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  });
});

////////////////////////////////////////////////////////////////////////////////
/////////////////  genReportSummaryCustomer  ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/genReportSummaryCustomer', [bodyParser.json()], function(req, res) {
  console.log("genReportSummaryCustomer = ", req.body);
  var $scope = {};

  var genReportSummaryCustomer = function() {
    console.log("genReportMasterManifest");
    if(req.body.p_status == 'all'){
      var whereStatus = "payment_status";
    } else {
      var whereStatus = "'" + req.body.p_status + "'";
    }

    var sql = "select * from v_summary_customer where p_date between '"
            + req.body.p_from + "' and '" + req.body.p_to + "' and "
            + "payment_status = " + whereStatus + " and customer_id = '"
            + req.body.customer + "'";
    console.log("sql = ", sql);

    return db.query(sql, {}).then(function(res) {
      $scope.summaryData = res;
      // console.log("$scope.intransitData = ", $scope.intransitData);
    });
  }

  var genNewDataReport = function(){
    for (var i=0; i<$scope.summaryData.length; i++){
      $scope.summaryData[i].p_from = req.body.p_from;
      $scope.summaryData[i].p_to = req.body.p_to;
      $scope.summaryData[i].p_status = req.body.p_status;
      $scope.summaryData[i].no = i + 1;
    }
    // console.log("data = ", $scope.summaryData);
    return $scope.summaryData;
  }

  var renderReport = function() {
    console.log("renderReport Summary Customer");
    var dfd = q.defer();
    $scope.pdfFile = 'summary_customer'+ req.body.p_from + req.body.p_to + req.body.p_status + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../../public/output/' + $scope.pdfFile);
    var report  = new nsReport();
    var doc = report.createDocument(require('../report/summary_customer.js'), $scope.summaryData);
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
  }

  var db = conn.connect();
  db.beginTransaction()
  .then(genReportSummaryCustomer)
  .then(genNewDataReport)
  .then(renderReport)
  .then(function() {
    res.send({
      status:true,
      data: {
        pdfFile: '/output/'+$scope.pdfFile
      }
    })
    console.log("Test Gen Report")
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  });
});

////////////////////////////////////////////////////////////////////////////////
////////        getCustomerList        /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/getCustomerList', [bodyParser.json()], function(req, res) {
  console.log("getCustomerList = ", req.body);
  var $scope = {};

  var getCustomerList = function() {
    console.log("genReportMasterManifest");
    var sql = "select distinct c.id as `value`, p.firstname as text from person p inner join customer c on p.id = c.person_id";
    console.log("sql = ", sql);

    return db.query(sql, {}).then(function(res) {
      $scope.customerList = res;
      // console.log("$scope.intransitData = ", $scope.intransitData);
    });
  }

  var db = conn.connect();
  db.beginTransaction()
  .then(getCustomerList)
  .then(function() {
    res.send({
      status:true,
      data: {
        customerList: $scope.customerList
      }
    })
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  });
});

module.exports = router;
