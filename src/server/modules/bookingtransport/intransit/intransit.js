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
router.post('/listIntransit',[bodyParser.json()], function(req, res){
  console.log("come to listPickUp.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT *,UPPER(status) AS status FROM intransit WHERE id > 0 ";
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
    if (typeof intransitFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(intransitFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='intransit_no' || fld=='intransit_date' || fld=='from' || fld=='to' || fld=='prepare_by' ||
        fld=='intransit_qty' || fld == 'accepted_qty' || fld == 'status') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM intransit WHERE id > 0 ";
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
    var sortBy = req.body.sortBy || 'intransit_no';
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

//////////////////////////////////////////////////////////////////////////////////
///////   saveIntransit    ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
router.post('/saveIntransit', [bodyParser.json()], function(req, res) {
  console.log("req = ", req.body);
  var $scope = {};

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
    var prefix = "HW" + p;
     $scope = {
       table:"intransit",
       fld:"intransit_no",
       prefix:prefix,
       size:-5,
       start:1
     }
    return true;
  }

  var _getNextCode = function(){
    console.log('_getNextCode');
    var sql = "SELECT max(`" + $scope.fld + "`) maxCode FROM `" + $scope.table + "`";
    if ($scope.prefix != '') {
      sql += " WHERE `" + $scope.fld + "` LIKE '" + $scope.prefix + "%'";
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
              next = parseInt(maxCode.substr($scope.prefix.length)) + 1;
            }
            console.log("next = ", next);
            $scope.code = $scope.prefix + ('0000000000000'+ next).substr($scope.size);
            console.log("$scope.code = ",$scope.code);
          });
      })()
    ]);
  }

  var insertIntransit = function(){
    console.log('insertIntransit');
    req.body.intransit_no = $scope.code;
    var sql = "insert into intransit(intransit_no,intransit_qty,intransit_date,accepted_qty,`from`,"
            + "`to`,prepare_by,status,remark,created_by,updated_by,size,eta,intransit_time) "
            + "values(:intransit_no,:intransit_qty,:delivery_date,'0',:from,"
            + ":to,:prepare_by,'active',:remark,:staff_id,:staff_id,:size,:eta_date,:intransit_time)";
    console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(res) {
      $scope.intransit_id = res.insertId;
    });
  }

  var insertIntransitItem = function(){
    console.log("insertIntransitItem");
    var all = [];
    for (var i = 0; i < req.body.intransitListItems.length; i++) {
      all.push(insertIntransitItemList(i));
    }
    return q.all(all);
  }

  var insertIntransitItemList = function(i){
    console.log("insertIntransitItemList");
    req.body.intransitListItems[i].intransit_id = $scope.intransit_id;
    var sql = "INSERT INTO intransit_item (intransit_id,booking_id,booking_item_id,booking_item_no,status,"
            + "intransit_item_date,created_by,updated_by) "
            + "VALUES (:intransit_id, :booking_id, :booking_item_id, :booking_item_no, 'active', "
            + "NOW(), " + req.body.staff_id + "," + req.body.staff_id + ")";
    console.log("sql item = ", sql);
    return db.query(sql, req.body.intransitListItems[i]).then(function(res) {
      console.log("insertIntransitItemList = ", res);
    });
  }

  var updateBookingItem = function(){
    console.log("updateBookingItem");
    var sql = "UPDATE booking_item SET `status`='INTRANSIT' "
            + "WHERE id IN (SELECT booking_item_id FROM intransit_item WHERE intransit_id = '"
            + $scope.intransit_id + "')";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("updateBookingItem = ", res);
    });
  }

  var getdataForUpdateBooking = function(){
    console.log("getdataForUpdateBooking");
    var sql = "SELECT count(i.booking_item_no) intransit_item_qty ,b.id booking_id, b.booking_no, b.item_qty "
            + "FROM intransit_item i INNER JOIN booking b ON i.booking_id = b.id "
            + "WHERE i.`booking_id` IN (SELECT distinct booking_id FROM intransit_item WHERE intransit_id = '"
            + $scope.intransit_id + "') "
            + "GROUP BY b.id, b.booking_no, b.item_qty ";
    return db.query(sql, {}).then(function(res) {
      $scope.updateBookingData = res;
      console.log("getdataForUpdateBooking = ", $scope.updateBookingData);
    });
  }

  var updateBooking = function() {
    console.log("updateBooking");
    var all = [];
    for (var i = 0; i < $scope.updateBookingData.length; i++) {
      if ($scope.updateBookingData[i].intransit_item_qty == $scope.updateBookingData[i].item_qty){
        all.push(updateBookingList(i));
      }
    }
    return q.all(all);
  }
  var updateBookingList = function(i) {
    console.log("updateBookingList");
    var sql = "UPDATE booking SET booking.status = 'INTRANSIT' "
            + "WHERE id = '" + $scope.updateBookingData[i].booking_id + "'";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("booking update = ", res);
    });
  }

  var db = conn.connect();
  db.beginTransaction()
    .then(_code)
    .then(_getNextCode)
    .then(insertIntransit)
    .then(insertIntransitItem)
    .then(updateBookingItem)
    .then(getdataForUpdateBooking)
    .then(updateBooking)
    .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              intransit_id:$scope.intransit_id,
              done:'เพิ่มข้อมูลสำเร็จ'
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
//////  updateIntransit  ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/updateIntransit', [bodyParser.json()], function(req, res) {
  console.log("updateIntransit = ", req.body);
  var $scope = {};

  var updateBackBookingItem = function(){
    console.log("updateBackBookingItem");
    var sql = "UPDATE booking_item SET `status` = 'ARRIVED_ORIGIN' "
            + "WHERE id IN (SELECT booking_item_id FROM intransit_item WHERE intransit_id =:intransit_id) ";
    console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(res) {
      console.log("updateBackBookingItem = ", res);
    });
  }

  var updateBackBooking = function(){
    console.log("updateBackBooking");
    var sql = "UPDATE booking SET `status` = 'INPROCESS' "
            + "WHERE id IN (SELECT DISTINCT booking_id FROM intransit_item WHERE intransit_id =:intransit_id) ";
    console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(res) {
      console.log("updateBackBooking = ", res);
    });
  }

  var updateIntransit = function(){
    console.log('updateIntransit');
    var sql = "UPDATE intransit SET intransit_qty=:intransit_qty, intransit_date=:delivery_date, intransit_time=:intransit_time, "
            + "`from`=:from, `to`=:to, updated_by=:staff_id,remark=:remark,size=:size,eta=:eta_date "
            + "WHERE id=:intransit_id";
    console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(res) {
      console.log("updateIntransit = ", res);
    });
  }

  var deleteIntransitItem = function(){
    console.log("deleteIntransitItem");
    var sql = "DELETE FROM intransit_item WHERE intransit_id=:intransit_id"
    console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(res) {
      console.log("deleteIntransitItem = ", res);
    });
  }

  var insertIntransitItem = function(){
    console.log("insertIntransitItem");
    var all = [];
    for (var i = 0; i < req.body.intransitListItems.length; i++) {
      all.push(insertIntransitItemList(i));
    }
    return q.all(all);
  }

  var insertIntransitItemList = function(i){
    console.log("insertIntransitItemList");
    var sql = "INSERT INTO intransit_item (intransit_id,booking_id,booking_item_id,booking_item_no,status,"
            + "intransit_item_date,created_by,updated_by) "
            + "VALUES (" + req.body.intransit_id + ", :booking_id, :booking_item_id, :booking_item_no, 'active', "
            + "NOW(), " + req.body.staff_id + "," + req.body.staff_id + ")";
    console.log("sql item = ", sql);
    return db.query(sql, req.body.intransitListItems[i]).then(function(res) {
      console.log("insertIntransitItemList = ", res);
    });
  }

  var updateBookingItem = function(){
    console.log("updateBookingItem");

    var sql = "UPDATE booking_item SET `status`='INTRANSIT' "
            + "WHERE id IN (SELECT booking_item_id FROM intransit_item WHERE intransit_id = '"
            + req.body.intransit_id + "')";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("updateBookingItem = ", res);
    });
  }

  var getdataForUpdateBooking = function(){
    console.log("getdataForUpdateBooking");
    var sql = "SELECT count(i.booking_item_no) intransit_item_qty ,b.id booking_id, b.booking_no, b.item_qty "
            + "FROM intransit_item i INNER JOIN booking b ON i.booking_id = b.id "
            + "WHERE i.`booking_id` IN (SELECT DISTINCT booking_id FROM intransit_item WHERE intransit_id = '"
            + req.body.intransit_id + "') "
            + "GROUP BY b.id, b.booking_no, b.item_qty ";
    return db.query(sql, {}).then(function(res) {
      $scope.updateBookingData = res;
      console.log("getdataForUpdateBooking = ", $scope.updateBookingData);
    });
  }

  var updateBooking = function() {
    console.log("updateBooking");
    var all = [];
    for (var i = 0; i < $scope.updateBookingData.length; i++) {
      if ($scope.updateBookingData[i].intransit_item_qty == $scope.updateBookingData[i].item_qty){
        all.push(updateBookingList(i));
      }
    }
    return q.all(all);
  }

  var updateBookingList = function(i) {
    console.log("updateBookingList");
    var sql = "UPDATE booking SET booking.status = 'INTRANSIT' "
            + "WHERE id = '" + $scope.updateBookingData[i].booking_id + "'";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("booking update = ", res);
    });
  }

  var db = conn.connect();
  db.beginTransaction()
    .then(updateBackBookingItem)
    .then(updateBackBooking)
    .then(updateIntransit)
    .then(deleteIntransitItem)
    .then(insertIntransitItem)
    .then(updateBookingItem)
    .then(getdataForUpdateBooking)
    .then(updateBooking)
    .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              intransit_id:req.body.intransit_id,
              done:'แก้ไขข้อมูลสำเร็จ'
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
///////  addBarcode  ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/addBarcode', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {
    item_no: {}
  };
  console.log("req.body = ", req.body);
  var getItemNo = function() {
    var sql = "SELECT * FROM v_get_intransit_lists_item WHERE booking_item_no =:item_no";

    return db.query(sql, req.body).then(function(rows) {
      if (rows.length > 0) {
        $scope.item_no = rows[0];
      } else {
        $scope.item_no = "x";
      }
    });
  }

  q.all([
    getItemNo()
  ]).then(function() {
    res.send({
      status:true,
      item_no: $scope.item_no
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  })
});

/////////////////////////////////////////////////////////////////////////////////
///////  getIntransitItemById  /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
router.post('/getIntransitItemById', [bodyParser.json()], function(req, res) {
  console.log("getIntransitItemById = ", req.body);
  var db = conn.connect();
  var $scope = {};

  var getIntransitById = function(){
    var sql = "select *,UPPER(status) AS display_status from intransit where id =:intransit_id ";

    return db.query(sql, req.body).then(function(rows) {
        $scope.intransit = rows[0];
    });
  }

  var getIntransitItemById = function(){
    var sql = "SELECT * FROM v_get_intransitItem_byId WHERE intransit_id =:intransit_id";

    return db.query(sql, req.body).then(function(rows) {
        $scope.item_list = rows;
    });
  }

  q.all([
    getIntransitById(),
    getIntransitItemById()
  ]).then(function() {
    res.send({
      status:true,
      intransit:$scope.intransit,
      item_list: $scope.item_list
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  })

});

////////////////////////////////////////////////////////////////////////////////
////////// pickup cancel  cancelPickup /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/cancelPickup', [bodyParser.json()], function(req, res) {
  console.log("req = ", req.body);
  var cancelBookingItem = function(){
    var sql = "UPDATE booking_item SET `status` = 'WAIT_ASSIGN' "
            + "WHERE booking_id IN (SELECT DISTINCT booking_id FROM pickup_detail WHERE pickup_id = '"
            + req.body.id + "') ";
    return db.query(sql, {}).then(function(res) {
      console.log("cancelPickup update = ", res);
    });
  }

  var cancelPickupItem = function(){
    var sql = "UPDATE pickup_item SET `status` = 'cancel' "
            + "WHERE pickup_id = '" + req.body.id +"'";
    return db.query(sql, {}).then(function(res) {
      console.log("cancelPickupItem update = ", res);
    });
  }

  var cancelPicupDetail = function(){
    var sql = "UPDATE pickup_detail SET pickup_detail_status = 'cancel' "
        + "WHERE pickup_id = '" + req.body.id +"'";
    return db.query(sql, {}).then(function(res) {
      console.log("cancelPicupDetail update = ", res);
    });
  }

  var cancelPickup = function(){
    var sql = "UPDATE pickup SET status = 'cancel' "
            + "WHERE id = '" + req.body.id +"'";
    return db.query(sql, {}).then(function(res) {
      console.log("cancelPickup update = ", res);
    });
  }

  var db = conn.connect();
  db.beginTransaction()
  .then(cancelBookingItem)
  .then(cancelPickupItem)
  .then(cancelPicupDetail)
  .then(cancelPickup)
  .then(function() {
    db.commit();
    res.send({
      status:true,
      pickup_id: req.body.id
    });
  }).catch(function(e) {
    db.rollback(function(e) {
      res.send({
        status:false,
        error:e
      });
    });
  })

});

////////////////////////////////////////////////////////////////////////////////
/// addBarcodeRecipt ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/addBarcodeRecipt', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {
    item_no: {}
  };
  console.log("req.body = ", req.body);
  var getItemNo = function() {
    var sql = "SELECT * FROM v_get_intransit_item_for_receipt WHERE item_no =:item_no";

    return db.query(sql, req.body).then(function(rows) {
      if (rows.length > 0) {
        $scope.item_no = rows[0];
      } else {
        $scope.item_no = "x";
      }
    });
  }

  q.all([
    getItemNo()
  ]).then(function() {
    res.send({
      status:true,
      item_no: $scope.item_no
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  })
});

////////////////////////////////////////////////////////////////////////////////
///////  saveIntransitReceipt  /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/saveIntransitReceipt', [bodyParser.json()], function(req, res) {
  console.log("req = ", req.body);

  var $scope = {};
  $scope.intransit_id = req.body.puReceiptItems[0].intransit_id;
  $scope.updateBookingData = null;
  $scope.exception_booking = [];

  function loopGetItemNo(){
    console.log("loopGetItemNo");
    var itemIdStr = "";
    var itemNoStr = "";
    for(var i=0; i<req.body.puReceiptItems.length; i++ ){
      itemIdStr += "'" + req.body.puReceiptItems[i].item_id + "',";
      itemNoStr += "'" + req.body.puReceiptItems[i].item_no + "',";
    }
    $scope.itemIdStr = itemIdStr.substr(0, itemIdStr.length - 1);
    $scope.itemNoStr = itemNoStr.substr(0, itemNoStr.length - 1);
    return true;
  }

  var updateIntransitItem = function(){
    console.log("updateIntransitItem = ", $scope.itemIdStr);
    var sql = "UPDATE intransit_item SET `status` = 'received', accepted_date = NOW() WHERE intransit_id = '" + $scope.intransit_id
            + "' AND id IN (" + $scope.itemIdStr + ")";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("intransit_item update = ", res);
    });
  }

  var updateIntransitItemC = function(){
    console.log("updateIntransitItem C = ", $scope.itemIdStr);
    var sql = "UPDATE intransit_item SET `status` = 'exception' WHERE intransit_id = '" + $scope.intransit_id
            + "' AND id NOT IN (" + $scope.itemIdStr + ") AND `status` <> 'received'";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("intransit_item_C update = ", res);
    });
  }

  var updateBookingItemStatus = function(){
    console.log("updateBookingItemStatus = ", $scope.itemNoStr);
    var sql = "UPDATE booking_item SET `status` = 'ARRIVED_DESTINATION' WHERE item_no IN (" + $scope.itemNoStr + ")";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("booking_item update = ", res);
    });
  }

  var getUpdateBookingData = function(){
    console.log("getUpdateBookingData");
    var sql = "select ii.booking_id, count(ii.booking_item_id) intransit_item_qty, b.item_qty "
            + "from intransit_item ii inner join booking b on ii.booking_id = b.id "
            + "where ii.`status` = 'received' and b.id IN (select distinct booking_id from intransit_item where intransit_id = '"+ $scope.intransit_id +"') "
            + "group by ii.booking_id";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      $scope.updateBookingData = res;
      console.log("$scope.updateBookingData = ", $scope.updateBookingData);
    });
  }

  var updateBooking = function() {
    console.log("updateBooking");
    var all = [];
    for (var i = 0; i < $scope.updateBookingData.length; i++) {
      if ($scope.updateBookingData[i].intransit_item_qty == $scope.updateBookingData[i].item_qty){
        all.push(updateBookingList(i));
        // all.push(i);
      }else {
        $scope.exception_booking.push($scope.updateBookingData[i].booking_id);
      }
    }
    // console.log("all = ", all);
    return q.all(all);
  }
  var updateBookingList = function(i) {
    console.log("updateBookingList");
    var sql = "UPDATE booking SET status = 'ARRIVED', accepted_destination_date = NOW() "
            + "WHERE booking.id = '" + $scope.updateBookingData[i].booking_id + "'";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("booking update = ", res);
    });
  }

  var updateBookingException = function(){
    console.log("updateBookingException");
    if($scope.exception_booking.length > 0){
      console.log("have Exception = ", $scope.exception_booking.length);
      var bookingExceptionId = "";
      for(var i=0; i<$scope.exception_booking.length; i++){
        bookingExceptionId += "'" + $scope.exception_booking[i] + "',";
      }
      var bookingExceptionIdList = bookingExceptionId.substr(0, bookingExceptionId.length - 1);

      var sql = "UPDATE booking SET status = 'EXCEPTION' "
              + "WHERE booking.id IN (" + bookingExceptionIdList + ")";
      console.log("sql = ", sql);
      return db.query(sql, {}).then(function(res) {
        console.log("booking exception update = ", res);
      });
    } else {
      console.log("Don't Have Exception");
      return true;
    }

  }

  var getIntransitData = function() {
    console.log("getIntransitData");
    var sql = "select i.id intransit_id, i.intransit_no, i.intransit_qty, count(ii.booking_item_no) intransit_item_qty "
            + "from intransit i inner join intransit_item ii on i.id = ii.intransit_id "
            + "where ii.`status` = 'received' AND i.id = '" + $scope.intransit_id +"' "
            + "group by i.id, i.intransit_no, i.intransit_qty";
    console.log("sql = ", sql);

    return db.query(sql, {}).then(function(res) {
      $scope.updateintransitData = res[0];
      console.log("$scope.updatePickupData = ", $scope.updateintransitData);
    });
  }

  var updateIntransitByData = function(){
    console.log("updateIntransitByData");
    var setStatus = "active";
    if($scope.updateintransitData.intransit_qty == $scope.updateintransitData.intransit_item_qty){
      setStatus = "received";
    }else {
      setStatus = "exception";
    }
    var sql = "UPDATE intransit SET `status` = '" + setStatus + "', accepted_qty = '"
            + $scope.updateintransitData.intransit_item_qty + "', eta = NOW() "
            + "WHERE id = '" + $scope.intransit_id + "' ";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("Intransit update = ", res);
    });
  }

  var db = conn.connect();
  db.beginTransaction()
  .then(loopGetItemNo)
  .then(updateIntransitItem)
  .then(updateIntransitItemC)
  .then(updateBookingItemStatus)
  .then(getUpdateBookingData)
  .then(updateBooking)
  .then(updateBookingException)
  .then(getIntransitData)
  .then(updateIntransitByData)
  .then(function() {
    db.commit();
    res.send({
      status:true,
      item_no: ""
    });
  }).catch(function(e) {
    db.rollback(function(e) {
      res.send({
        status:false,
        error:e
      });
    });
  })

});

//+++++++++++++++++++++++++  genReport  ++++++++++++++++++++++++++++++++++++
router.post('/genReport', [bodyParser.json()], function(req, res) {
  console.log("genReport = ", req.body);
  var $scope = {};

  var getIntransitDataReport = function() {
    console.log("getIntransitData");
    var sql = "select * from v_intransit_report where intransit_id = " + req.body.intransit_id;
    console.log("sql = ", sql);

    return db.query(sql, {}).then(function(res) {
      $scope.intransitData = res;
    });
  }

  var getwallbillno = function() {
    var sql = "select count(distinct waybill) waybill_no  from v_intransit_report where intransit_id = " + req.body.intransit_id;

    return db.query(sql, {}).then(function(res) {
      $scope.waybill_no = res[0].waybill_no;
      console.log("waybill_no = ", $scope.waybill_no);
    });
  }

  var genNewDataReport = function(){
    console.log("genNewDataReport");
    $scope.intransitDataRow = [];
    var _gross_weight = 0;
    var _chkCode = '';
    var _lastSumId = ($scope.intransitData.length - 1);
    var sumdata = 0;
    console.log("_lastSumId = ", _lastSumId);
    $scope.intransitData.forEach(function(row,i){
      if(i != 0){
        if(row.person_code == _chkCode){
          row.person_code = '';
          _gross_weight = _gross_weight + row.gross_weight;
        }else{
          var temp_date = {
            intransit_id: '',
            created_date: '',
            intransit_date: '',
            intransit_no: '',
            accepted_date: '',
            prepare_by: '',
            intransit_qty: $scope.intransitData[0].intransit_qty,
            from: '',
            to: '',
            person_code: 'Sub total',
            waybill: '',
            item_no: '',
            product_name: '',
            gross_weight: helper.numberFormat(_gross_weight,2),
            origit_code: '',
            destination_code: '',
            remark: ''
          }
          $scope.intransitDataRow.push(temp_date);
          _gross_weight = 0;
        }
      }
      if (row.person_code != ''){
        _chkCode = row.person_code;
        _gross_weight = row.gross_weight;
      }
      $scope.intransitDataRow.push(row);
      if(i == _lastSumId) {
        var temp_date = {
          intransit_id: '',
          created_date: '',
          intransit_date: '',
          intransit_no: '',
          accepted_date: '',
          prepare_by: '',
          intransit_qty: $scope.intransitData[0].intransit_qty,
          from: '',
          to: '',
          person_code: 'Sub total',
          waybill: '',
          item_no: '',
          product_name: '',
          gross_weight: helper.numberFormat(_gross_weight,2),
          origit_code: '',
          destination_code: '',
          remark: ''
        }
        $scope.intransitDataRow.push(temp_date);
      }
      sumdata = sumdata + row.gross_weight;
      // console.log("$scope.intransitDataRow = ", $scope.intransitDataRow);
    });
    var sum_date = {intransit_id: '',created_date: '',intransit_date: '',intransit_no: '',accepted_date: '',prepare_by: '',
      intransit_qty: $scope.intransitData[0].intransit_qty,from: '',to: '',person_code: 'Total',waybill: '',item_no: '',product_name: '',gross_weight: helper.numberFormat(sumdata,2),
      origit_code: '',destination_code: '',remark: ''
    }

    $scope.intransitDataRow.push(sum_date);
    $scope.intransitDataRow[0].waybill_no = $scope.waybill_no;
    console.log("Real data = ", $scope.intransitDataRow);
    return $scope.intransitDataRow;
  }

  var renderReport = function() {
    console.log("renderReport Intransit");
    var dfd = q.defer();
    $scope.pdfFile = 'intransit_'+ req.body.intransit_id + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../../public/output/intransit/' + $scope.pdfFile);
    var report  = new nsReport();
    var doc = report.createDocument(require('../report/house_manifest.js'), $scope.intransitDataRow);
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
  .then(getIntransitDataReport)
  .then(getwallbillno)
  .then(genNewDataReport)
  .then(renderReport)
  .then(function() {
    res.send({
      status:true,
      data: {
        pdfFile: '/output/intransit/'+$scope.pdfFile,
        intransitId: req.body.intransit_id
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
/////////////////  genBarcode  /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/genBarcode', [bodyParser.json()], function(req, res) {
  console.log("genBarcode = ", req.body);
  var $scope = {};

  var getIntransitDataReport = function() {
    console.log("getIntransitData");
    var sql = "select * from v_intransit_barcode_report where intransit_id = " + req.body.intransit_id;
    console.log("sql = ", sql);

    return db.query(sql, {}).then(function(res) {
      $scope.intransitData = res;
      console.log("$scope.intransitBarcode = ", $scope.intransitData);
    });
  }

  var renderReport = function() {
    console.log("renderReport Intransit");
    var dfd = q.defer();
    $scope.pdfFile = 'intransit_barcode_'+ req.body.intransit_id + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../../public/output/intransit/' + $scope.pdfFile);
    var report  = new nsReport();
    var doc = report.createDocument(require('../report/barcode_intransit.js'), $scope.intransitData);
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
  .then(getIntransitDataReport)
  .then(renderReport)
  .then(function() {
    res.send({
      status:true,
      data: {
        pdfFile: '/output/intransit/'+$scope.pdfFile,
        intransitId: req.body.intransit_id
      }
    })
    console.log("Test Gen Report")
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  });
})

////////////////////////////////////////////////////////////////////////////////
/////////////////////////   saveExceptionIntransit   ///////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/saveExceptionIntransit', [bodyParser.json()], function(req, res) {
  console.log("saveExceptionIntransit = ", req.body);
  var $scope = {};

  var updateReason = function(){
    var sql = "UPDATE intransit SET exception_reason = :exception_reason WHERE id = :intransit_id";

    return db.query(sql, req.body).then(function(res) {
      $scope.intransitUpdate = res;
      console.log("$scope.intransitUpdate = ", $scope.intransitUpdate);
    });
  }


  var db = conn.connect();
  db.beginTransaction()
  .then(updateReason)
  .then(function() {
    db.commit();
    res.send({
      status:true,
      data: {
        intransitId: req.body.intransit_id
      }
    })
  }).catch(function(e) {
    db.rollback(function(e) {
      res.send({
        status:false,
        error:e
      });
    });
  })
});


////////////////////////////////////////////////////////////////////////////////
//////////////////////////   getDistrict   /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/getDistrict', [bodyParser.json()], function(req, res) {
  console.log("getDistrict = ", req.body);
  var $scope = {};

  var getOrigin = function(){
    var sql = "SELECT DISTINCT CONCAT(country_origin, ' - ' , district_origin) `value`, CONCAT(country_origin, ' - ' , district_origin) `text` FROM excel_zone";

    return db.query(sql, {}).then(function(res) {
      $scope.origin = res;
      //console.log("$scope.origin = ", $scope.origin);
    });
  }

  var getDestination = function(){
    var sql = "SELECT DISTINCT CONCAT(country_destination, ' - ' , district_destination) `value`, CONCAT(country_destination, ' - ' , district_destination) `text` FROM excel_zone";

    return db.query(sql, {}).then(function(res) {
      $scope.destination = res;
      //console.log("$scope.destination = ", $scope.destination);
    });
  }


  var db = conn.connect();
  db.beginTransaction()
  .then(getOrigin)
  .then(getDestination)
  .then(function() {
    // db.commit();
    res.send({
      status:true,
      data: {
        origin: $scope.origin,
        destination: $scope.destination
      }
    })
  }).catch(function(e) {
    // db.rollback(function(e) {
      res.send({
        status:false,
        error:e
      });
    // });
  })
});



module.exports = router;
