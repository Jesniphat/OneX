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

var bookingFields = {
    booking_no:{name:'b.booking_no'},
    customer_name:{name:"CONCAT(p.firstname,' ',p.lastname)"},
    pickup_place:{name:'b.pickup_place'},
    pickup_date:{name:'b.pickup_date'},
    type:{name:'p.type'},
    deliveried_date:{name:'b.deliveried_date'},
    booking_date:{name:'b.booking_date'},
    payment_status:{name:'b.payment_status'},
    receipt_type:{name:'b.receipt_type'},
    total_amount:{name:'b.total_amount'},
    additional_amount:{name:'b.additional_amount'}
};

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////  List //////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/listPayment',[bodyParser.json()], function(req, res){
  console.log("come to listPayment.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.total_amount, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.additional_amount, status, CASE WHEN b.receipt_type = 'CREDIT' THEN 'CREDITCARD' ELSE b.receipt_type END AS receipt_type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "upper(b.payment_status) as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = status ";
  //console.log("list Booking = ", mainQuery);
  var cond = [];
  var hasJoin = false;
  for(var fld in req.body.keywords) {
    var keyword = req.body.keywords[fld];
    if (typeof keyword === 'undefined') {
      continue;
    }
    keyword = keyword.trim();
    if (keyword == '') {
      continue;
    }
    if (typeof bookingFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(bookingFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='booking_no' || fld=='customer_name' || fld=='pickup_place' || fld=='pickup_date' || fld=='type' ||
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status' || fld == 'total_amount' ||
        fld == 'total_amount' || fld == 'receipt_type' || fld == 'additional_amount') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM booking WHERE status = status ";
    if (hasJoin) {
      sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x';
    } else if (cond.length > 0) {
      sql += ' AND ' + cond.join(' AND ');
    }
    return db.query(sql, {}).then(function(rows) {
      if (rows.length==0) {
        $scope.totalRows = 0;
      } else {
        $scope.totalRows = rows[0].cnt;
      }
    });
  }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'b.booking_id';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 500;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0,
    };

    //sortBy = 'r.`' + sortBy + '`';

    var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;
    //console.log("Maia sql = ", sql);
    return db.query(sql).then(function(rows) {
      $scope.rows = rows;
    });
  }

  q.all([
    getCount(),
    getRows()
  ]).then(function() {
    $scope.opt.totalRows = $scope.totalRows;
    if ($scope.totalRows==0) {
      res.send({
        status: true,
        data: $scope.rows,
        opt: $scope.opt
      });
    }else {
        res.send({
          status: true,
          data: $scope.rows,
          opt: $scope.opt
        });
    }
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });

});

////////////////////////////////////////////////////////////////////////////////
////////   export   ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/export',[bodyParser.json()], function(req, res){
  console.log("come to export.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.total_amount, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.additional_amount, status, receipt_type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "upper(b.payment_status) as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = status ";
  console.log("list Booking = ", mainQuery);
  var cond = [];
  var hasJoin = false;
  for(var fld in req.body.keywords) {
    var keyword = req.body.keywords[fld];
    if (typeof keyword === 'undefined') {
      continue;
    }
    keyword = keyword.trim();
    if (keyword == '') {
      continue;
    }
    if (typeof bookingFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(bookingFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='booking_no' || fld=='customer_name' || fld=='pickup_place' || fld=='pickup_date' || fld=='type' ||
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status' || fld == 'total_amount' ||
        fld == 'total_amount' || fld == 'receipt_type' || fld == 'additional_amount') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM booking WHERE status = status ";
    if (hasJoin) {
      sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x';
    } else if (cond.length > 0) {
      sql += ' AND ' + cond.join(' AND ');
    }
    return db.query(sql, {}).then(function(rows) {
      if (rows.length==0) {
        $scope.totalRows = 0;
      } else {
        $scope.totalRows = rows[0].cnt;
      }
    });
  }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'b.booking_id';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 500;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0,
    };

    //sortBy = 'r.`' + sortBy + '`';

    var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;
    //console.log("Maia sql = ", sql);
    return db.queryArray(sql, {}).then(function(rows) {
      $scope.rows = rows;
    });
  };


  getRows().then(function() {
      var rows = $scope.rows.d;  //console.log("$scope.rows.d = ", $scope.rows.d);
      rows.unshift($scope.rows.f);  //console.log("$scope.rows.f = ", $scope.rows.f);
      try {
        var buffer = xlsx.build([{name: "ListPaymentTracking", data: rows}]);
      } catch (e) {
        console.log('ERROR=', e);
      }
      var id = helper.newUUID();
      var fname = '/output/payment_tracking_'+id+'.xlsx';
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

////////////////////////////////////////////////////////////////////////////////
//////// changePaidBooking /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/changePaidBooking',[bodyParser.json()], function(req, res) {
  console.log('changePaidBooking');
  // console.log(req.body);
  var $scope = {};
  $scope.booking_id = req.body.id;
  $scope.condition = "";

  var _code = function() {
    console.log("genCode");
    Date.prototype.yyyymmdd = function() {
     var yyyy = this.getFullYear().toString();
     var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
     var dd  = this.getDate().toString();
     return yyyy + (mm[1]?mm:"0"+mm[0]); // padding
    };

    var d = new Date();
    var p = d.yyyymmdd();
    var c =  p.substr(2);
    var prefix = c;
     $scope.table="booking";
     $scope.fld="booking_no";
     $scope.fld_waybill="waybill";
     $scope.prefix=p;
     $scope.prefix_waybill="onex" + p;
     $scope.size = -5;
     $scope.start = 1;
     $scope.p = p;

    return true;
  }

  var _genWaybill = function() {
      console.log('_getNextWayBillCode');
    if(req.body.status == 'WAIT_CLEAR_CREDIT_CARD'){
      var sql = "SELECT max(`" + $scope.fld_waybill + "`) maxCode FROM `" + $scope.table + "`";
      if ($scope.prefix_waybill != '') {
        sql += " WHERE `" + $scope.fld_waybill + "` LIKE '" + $scope.prefix_waybill + "%'";
      }
      $scope.sql = sql;
      return q.all([
        (function() {
          return db.query($scope.sql).then(function(data) {
              console.log("data = ", data[0].maxCode);
              $scope.maxCode = data[0].maxCode;
              var maxCode = $scope.maxCode;
              console.log("maxCode = ", maxCode);
              var next = "";
              if (maxCode===false || maxCode==undefined || maxCode==null) {
                next = $scope.start + 0;
              } else {
                next = parseInt(maxCode.substr($scope.prefix_waybill.length)) + 1;
              }
              console.log("next = ", next);
              $scope.newWaybillCode = $scope.prefix_waybill + "" + ('0000000000000'+ next).substr($scope.size); // new code
              // $scope.newWaybill = ""; // more new code
              console.log("$scope.newWaybillCode = ", $scope.newWaybillCode);
            });
        })()
      ]);
    } else {
      $scope.newWaybillCode = "";
      return true;
    }
  }

  var writeSql = function(){
    if(req.body.status == 'WAIT_CLEAR_CREDIT_CARD'){
      $scope.condition = " status='WAIT_ASSIGN', updated_at=NOW(), payment_status='paid', waybill = '" + $scope.newWaybillCode + "',"
                       + " change_payment_status_by = 'staff', change_payment_status_at = NOW()";
    } else {
      $scope.condition = " updated_at=NOW(), payment_status='paid',"
                       + " change_payment_status_by = 'staff', change_payment_status_at = NOW()";
    }
  }

  var changeBooking = function() {
      var sql = "UPDATE booking SET " + $scope.condition + " WHERE id=:id";

      return db.query(sql, req.body);
    }

    var db = conn.connect();
    db.beginTransaction()
      .then(_code)
      .then(_genWaybill)
      .then(writeSql)
      .then(changeBooking)
      .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              booking_id:$scope.booking_id,
              done:'change status booking complete'
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
////////         changePaidBookingList                 /////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/changePaidBookingList',[bodyParser.json()], function(req, res) {
  console.log('changePaidBookingList');
  // console.log(req.body);
  var $scope = {};
  var dataList = req.body;
  // console.log("List = ", dataList);
  var _code = function() {
    console.log("genCode");
    Date.prototype.yyyymmdd = function() {
     var yyyy = this.getFullYear().toString();
     var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
     var dd  = this.getDate().toString();
     return yyyy + (mm[1]?mm:"0"+mm[0]); // padding
    };

    var d = new Date();
    var p = d.yyyymmdd();
    var c =  p.substr(2);
    var prefix = c;
     $scope.table="booking";
     $scope.fld="booking_no";
     $scope.fld_waybill="waybill";
     $scope.prefix=p;
     $scope.prefix_waybill="onex" + p;
     $scope.size = -5;
     $scope.start = 1;
     $scope.p = p;

    return true;
  }

  var _genWaybill = function() {
      console.log('_getNextWayBillCode');
      var sql = "SELECT max(`" + $scope.fld_waybill + "`) maxCode FROM `" + $scope.table + "`";
      if ($scope.prefix_waybill != '') {
        sql += " WHERE `" + $scope.fld_waybill + "` LIKE '" + $scope.prefix_waybill + "%'";
      }
      $scope.sql = sql;
      return q.all([
        (function() {
          return db.query($scope.sql).then(function(data) {
              console.log("data = ", data[0].maxCode);
              $scope.maxCode = data[0].maxCode;
              var maxCode = $scope.maxCode;
              console.log("maxCode = ", maxCode);
              var next = "";
              if (maxCode===false || maxCode==undefined || maxCode==null) {
                next = $scope.start + 0;
              } else {
                next = parseInt(maxCode.substr($scope.prefix_waybill.length));
              }
              console.log("next = ", next);
              $scope.waybillCode = next
              // $scope.waybillCode = $scope.prefix_waybill + "" + ('0000000000000'+ next).substr($scope.size); // new code
            });
        })()
      ]);
  }

  var checkWaitCredit = function(){
    var all = [];
    for (var i = 0; i < dataList.length; i++) {
      if(dataList[i].status == 'WAIT_CLEAR_CREDIT_CARD'){
        $scope.waybillCode += 1;
        dataList[i].wb = $scope.prefix_waybill + "" + ('0000000000000'+ $scope.waybillCode).substr($scope.size);
      } else {
        dataList[i].wb = "";
      }
    }
    return true;
  }

  var changePaidBooking = function(){
    var all = [];
    for (var i = 0; i < dataList.length; i++) {
      all.push(changePaidBookingList(i));
    }
    return q.all(all);
  }

  var changePaidBookingList = function(i) {
    var condition = "";
    if(dataList[i].status == 'WAIT_CLEAR_CREDIT_CARD'){
      condition = " status='WAIT_ASSIGN', updated_at=NOW(), payment_status='paid', waybill=:wb,"
                + " change_payment_status_by = 'staff', change_payment_status_at = NOW()";
    } else {
      condition = " updated_at=NOW(), payment_status='paid',"
                + " change_payment_status_by = 'staff', change_payment_status_at = NOW()";
    }
    var sql = "UPDATE booking SET " + condition + " WHERE id=:id";
    return db.query(sql, dataList[i]).then(function(res) {
      console.log("booking_item update = ", res);
    });
  }

    var db = conn.connect();
    db.beginTransaction()
      .then(_code)
      .then(_genWaybill)
      .then(checkWaitCredit)
      .then(changePaidBooking)
      .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              done:'change status booking complete'
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
