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

var deliveryFields = {
  id:{name:'id'},
  delivery_no:{name:'delivery_no'},
  delivery_qty:{name:'delivery_qty'},
  delivery_date:{name:'delivery_date'},
  accepted_qty:{name:'accepted_qty'},
  from:{name:'from'},
  to:{name:'to'},
  status:{name:'status'},
  prepare_by:{name:'prepare_by'}
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////  Get Intransit List   ////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/listDelivery',[bodyParser.json()], function(req, res){
  console.log("come to listDelivery.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT *, UPPER(status) AS status FROM delivery WHERE id > 0 ";
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
    if (typeof deliveryFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(deliveryFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='delivery_no' || fld=='delivery_date' || fld=='from' || fld=='to' || fld=='prepare_by' ||
        fld=='delivery_qty' || fld == 'accepted_qty' || fld == 'status') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM delivery WHERE id > 0 ";
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
    var sortBy = req.body.sortBy || 'delivery_no';
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
///////   saveDelivery   ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
router.post('/saveDelivery', [bodyParser.json()], function(req, res) {
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
    var prefix = "D-" + c;
     $scope = {
       table:"delivery",
       fld:"delivery_no",
       prefix:prefix,
       size:-4,
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

  var insertDelivery = function(){
    console.log('insertDelivery');
    req.body.delivery_no = $scope.code;
    var sql = "insert into delivery(delivery_no,delivery_qty,delivery_date,accepted_qty,`from`,"
            + "`to`,delivery_place,prepare_by,status,remark,driver,license,created_by,updated_by) "
            + "values(:delivery_no,:delivery_qty,:delivery_date,'0',:from,"
            + ":to,:to,:prepare_by,'active',:remark,:driver,:license,:staff_id,:staff_id)";
    console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(res) {
      $scope.delivery_id = res.insertId;
    });
  }

  var insertDeliveryItem = function(){
    console.log("insertDeliveryItem");
    var all = [];
    for (var i = 0; i < req.body.deliveryListItems.length; i++) {
      all.push(insertDeliveryItemList(i));
    }
    return q.all(all);
  }

  var insertDeliveryItemList = function(i){
    console.log("insertDeliveryItemList");
    req.body.deliveryListItems[i].delivery_id = $scope.delivery_id;
    var sql = "INSERT INTO delivery_item (delivery_id,booking_id,booking_item_id,booking_item_no,status,"
            + "delivery_item_date,created_by,updated_by) "
            + "VALUES (:delivery_id, :booking_id, :booking_item_id, :booking_item_no, 'active', "
            + "NOW(), " + req.body.staff_id + "," + req.body.staff_id + ")";
    console.log("sql item = ", sql);
    return db.query(sql, req.body.deliveryListItems[i]).then(function(res) {
      console.log("insertDeliveryItemList = ", res);
    });
  }

  var updateBookingItem = function(){
    console.log("updateBookingItem");
    var sql = "UPDATE booking_item SET `status`='WAIT_DELIVERY' "
            + "WHERE id IN (SELECT booking_item_id FROM delivery_item WHERE delivery_id = '"
            + $scope.delivery_id + "')";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("updateBookingItem = ", res);
    });
  }

  var getdataForUpdateBooking = function(){
    console.log("getdataForUpdateBooking");
    var sql = "SELECT count(i.booking_item_no) delivery_item_qty ,b.id booking_id, b.booking_no, b.item_qty "
            + "FROM delivery_item i INNER JOIN booking b ON i.booking_id = b.id "
            + "WHERE i.`status` IN ('active','exception') "
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
    .then(insertDelivery)
    .then(insertDeliveryItem)
    .then(updateBookingItem)
    // .then(getdataForUpdateBooking)
    // .then(updateBooking)
    .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              delivery_id:$scope.delivery_id,
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
//////  updateDelivery  ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/updateDelivery', [bodyParser.json()], function(req, res) {
  console.log("updateDelivery = ", req.body);
  var $scope = {};

  var updateBackBookingItem = function(){
    console.log("updateBackBookingItem");
    var sql = "UPDATE booking_item SET `status` = 'ARRIVED_DESTINATION' "
            + "WHERE id IN (SELECT booking_item_id FROM delivery_item WHERE delivery_id =:delivery_id) ";
    console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(res) {
      console.log("updateBackBookingItem = ", res);
    });
  }

  var updateBackBooking = function(){ // ไม่ต้องใช้
    console.log("updateBackBooking");
    var sql = "UPDATE booking SET `status` = 'INPROCESS' "
            + "WHERE id IN (SELECT DISTINCT booking_id FROM intransit_item WHERE intransit_id =:intransit_id) ";
    console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(res) {
      console.log("updateBackBooking = ", res);
    });
  }

  var updateDelivery = function(){
    console.log('updateDelivery');
    var sql = "UPDATE delivery SET delivery_qty=:delivery_qty, delivery_date=:delivery_date, "
            + "`from`=:from, `to`=:to, updated_by=:staff_id,remark=:remark,driver=:driver,license=:license "
            + "WHERE id=:delivery_id";
    console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(res) {
      console.log("updateDeliverry = ", res);
    });
  }

  var deleteDeliveryItem = function(){
    console.log("deleteDeliveryItem");
    var sql = "DELETE FROM delivery_item WHERE delivery_id=:delivery_id"
    console.log("sql = ", sql);
    return db.query(sql, req.body).then(function(res) {
      console.log("deleteDeliveryItem = ", res);
    });
  }

  var insertDeliveryItem = function(){
    console.log("insertDeliveryItem");
    var all = [];
    for (var i = 0; i < req.body.deliveryListItems.length; i++) {
      all.push(insertDeliveryItemList(i));
    }
    return q.all(all);
  }

  var insertDeliveryItemList = function(i){
    console.log("insertDeliveryItemList");
    var sql = "INSERT INTO delivery_item (delivery_id,booking_id,booking_item_id,booking_item_no,status,"
            + "delivery_item_date,created_by,updated_by) "
            + "VALUES (" + req.body.delivery_id + ", :booking_id, :booking_item_id, :booking_item_no, 'active', "
            + "NOW(), " + req.body.staff_id + "," + req.body.staff_id + ")";
    console.log("sql item = ", sql);
    return db.query(sql, req.body.deliveryListItems[i]).then(function(res) {
      console.log("insertDeliveryItemList = ", res);
    });
  }

  var updateBookingItem = function(){
    console.log("updateBookingItem");

    var sql = "UPDATE booking_item SET `status`='WAIT_DELIVERY' "
            + "WHERE id IN (SELECT booking_item_id FROM delivery_item WHERE delivery_id = '"
            + req.body.delivery_id + "')";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("updateBookingItem = ", res);
    });
  }

  var getdataForUpdateBooking = function(){ // Not Use
    console.log("getdataForUpdateBooking");
    var sql = "SELECT count(i.booking_item_no) intransit_item_qty ,b.id booking_id, b.booking_no, b.item_qty "
            + "FROM intransit_item i INNER JOIN booking b ON i.booking_id = b.id "
            + "WHERE i.`status` IN ('active','exception') "
            + "GROUP BY b.id, b.booking_no, b.item_qty ";
    return db.query(sql, {}).then(function(res) {
      $scope.updateBookingData = res;
      console.log("getdataForUpdateBooking = ", $scope.updateBookingData);
    });
  }

  var updateBooking = function() {  // Not Use
    console.log("updateBooking");
    var all = [];
    for (var i = 0; i < $scope.updateBookingData.length; i++) {
      if ($scope.updateBookingData[i].intransit_item_qty == $scope.updateBookingData[i].item_qty){
        all.push(updateBookingList(i));
      }
    }
    return q.all(all);
  }
  var updateBookingList = function(i) {  // Not Use
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
    // .then(updateBackBooking)
    .then(updateDelivery)
    .then(deleteDeliveryItem)
    .then(insertDeliveryItem)
    .then(updateBookingItem)
    // .then(getdataForUpdateBooking)
    // .then(updateBooking)
    .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              delivery_id:req.body.delivery_id,
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
  console.log("v_get_delivery_lists_item req.body = ", req.body);
  var getItemNo = function() {
    var sql = "SELECT * FROM v_get_delivery_lists_item WHERE booking_item_no =:item_no";

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
///////  getDeliveryItemById  /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
router.post('/getDeliveryItemById', [bodyParser.json()], function(req, res) {
  console.log("getDeliveryItemById = ", req.body);
  var db = conn.connect();
  var $scope = {};

  var getDeliveryById = function(){
    var sql = "select *, UPPER(status) AS display_status from delivery where id =:delivery_id ";

    return db.query(sql, req.body).then(function(rows) {
        $scope.delivery = rows[0];
    });
  }

  var getDeliveryItemById = function(){
    var sql = "SELECT * FROM v_get_deliveryItem_byId WHERE delivery_id =:delivery_id";

    return db.query(sql, req.body).then(function(rows) {
        $scope.item_list = rows;
    });
  }

  q.all([
    getDeliveryById(),
    getDeliveryItemById()
  ]).then(function() {
    res.send({
      status:true,
      delivery:$scope.delivery,
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
    var sql = "SELECT * FROM v_get_delivery_item_for_receipt WHERE item_no =:item_no";

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
///////  saveDeliveryReceipt  /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/saveDeliveryReceipt', [bodyParser.json()], function(req, res) {
  console.log("req = ", req.body);

  var $scope = {};
  $scope.delivery_id = req.body.puReceiptItems[0].delivery_id;
  $scope.updateBookingData = null;

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

  var updateDeliveryItem = function(){
    console.log("updateDeliveryItem = ", $scope.itemIdStr);
    var sql = "UPDATE delivery_item SET `status` = 'received' WHERE delivery_id = '" + $scope.delivery_id
            + "' AND id IN (" + $scope.itemIdStr + ")";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("delivery_item update = ", res);
    });
  }

  var updateDeliveryItemC = function(){
    console.log("updateDeliveryItem C = ", $scope.itemIdStr);
    var sql = "UPDATE delivery_item SET `status` = 'exception' WHERE delivery_id = '" + $scope.delivery_id
            + "' AND id NOT IN (" + $scope.itemIdStr + ") AND `status` <> 'received'";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("delivery_item_C update = ", res);
    });
  }

  var updateBookingItemStatus = function(){
    console.log("updateBookingItemStatus = ", $scope.itemNoStr);
    var sql = "UPDATE booking_item SET `status` = 'DELIVERIED' WHERE item_no IN (" + $scope.itemNoStr + ")";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("booking_item update = ", res);
    });
  }

  var getUpdateBookingData = function(){
    console.log("getUpdateBookingData");
    var sql = "select di.booking_id, count(di.booking_item_id) delivery_item_qty, b.item_qty "
            + "from delivery_item di inner join booking b on di.booking_id = b.id "
            + "where di.`status` = 'received' and b.id IN (select distinct booking_id from delivery_item where delivery_id = '"+ $scope.delivery_id +"') "
            + "group by di.booking_id";
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
      if ($scope.updateBookingData[i].delivery_item_qty == $scope.updateBookingData[i].item_qty){
        all.push(updateBookingList(i));
        // all.push(i);
      }
    }
    // console.log("all = ", all);
    return q.all(all);
  }
  var updateBookingList = function(i) {
    console.log("updateBookingList");
    var sql = "UPDATE booking SET status = 'DELIVERIED', "
            + "deliveried_date = NOW() "
            + "WHERE booking.id = '" + $scope.updateBookingData[i].booking_id + "'";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("booking update = ", res);
    });
  }

  var getDeliveryData = function() {
    console.log("getDeliveryData");
    var sql = "select d.id delivery_id, d.delivery_no, d.delivery_qty, count(di.booking_item_no) delivery_item_qty "
            + "from delivery d inner join delivery_item di on d.id = di.delivery_id "
            + "where di.`status` = 'received' AND d.id = '" + $scope.delivery_id +"' "
            + "group by d.id, d.delivery_no, d.delivery_qty";
    console.log("sql = ", sql);

    return db.query(sql, {}).then(function(res) {
      $scope.updatedeliveryData = res[0];
      console.log("$scope.updatedeliveryData = ", $scope.updatedeliveryData);
    });
  }

  var updateDeliveryByData = function(){
    console.log("updateDeliveryByData");
    var setStatus = "active";
    if($scope.updatedeliveryData.delivery_qty == $scope.updatedeliveryData.delivery_item_qty){
      setStatus = "received";
    }else {
      setStatus = "exception";
    }
    var sql = "UPDATE delivery SET `status` = '" + setStatus + "', accepted_qty = '"
            + $scope.updatedeliveryData.delivery_item_qty + "' "
            + "WHERE id = '" + $scope.delivery_id + "' ";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("Delivery update = ", res);
    });
  }

  var db = conn.connect();
  db.beginTransaction()
  .then(loopGetItemNo)
  .then(updateDeliveryItem)
  .then(updateDeliveryItemC)
  .then(updateBookingItemStatus)
  .then(getUpdateBookingData)
  .then(updateBooking)
  .then(getDeliveryData)
  .then(updateDeliveryByData)
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

////////////////////////////////////////////////////////////////////////////////
//////////  Delivery Report ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/genDeliveryReport', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  console.log("req.body = ", req.body);

  var getDeliveryReportData = function() {
    var sql = "SELECT * FROM v_delivery_report WHERE delivery_id =:delivery_id";

    return db.query(sql, req.body).then(function(rows) {
      if (rows.length > 0) {
        $scope.temp_data = rows;
        console.log($scope.temp_data);
        var _chkCode = '';
        var line_no = 0;
        for(var i=0; i<$scope.temp_data.length; i++){
          var index_of_tel = $scope.temp_data[i].receipient.indexOf("Tel:");
          var first_rn = $scope.temp_data[i].receipient.indexOf("\n");
          var first_sd = $scope.temp_data[i].sender.indexOf("\n");
          $scope.temp_data[i].tel_r = "Contact : " + $scope.temp_data[i].receipient.substring(index_of_tel+5);
          $scope.temp_data[i].receipient_name = "Name : \n" + $scope.temp_data[i].receipient.substring(0,first_rn);
          $scope.temp_data[i].sender_name = "Sender name : " + $scope.temp_data[i].sender.substring(0,first_sd);
          $scope.temp_data[i].delivery_no_text = "Delivery no : " + $scope.temp_data[i].delivery_no;

          $scope.temp_data[i].delivery_to = "Name : \n" + $scope.temp_data[i].receipient.substring(0,first_rn) +
                                            "\nContact : " + $scope.temp_data[i].receipient.substring(index_of_tel+5);
          $scope.temp_data[i].address = $scope.temp_data[i].receipient.substring(first_rn+1,index_of_tel-1);
          $scope.temp_data[i].booking_detail = "Booking no : " + $scope.temp_data[i].booking_no +
                                               "\nSender name : " + $scope.temp_data[i].sender.substring(0,first_sd);
          $scope.temp_data[i].barcode = $scope.temp_data[i].booking_item_no;
          if(i != 0){
            if($scope.temp_data[i].booking_no == _chkCode){
              $scope.temp_data[i].booking_no = '';
              $scope.temp_data[i].delivery_to = '';
              $scope.temp_data[i].address = '';
              $scope.temp_data[i].booking_detail = '';
              $scope.temp_data[i].no = '';
            }
          }
          if ($scope.temp_data[i].booking_no != ''){
            _chkCode = $scope.temp_data[i].booking_no;
            line_no = line_no + 1;
            $scope.temp_data[i].no = line_no;
          }
        }
      }
      console.log("report2 = ", $scope.temp_data);
    });
  };

  var renderReport = function() {
    var dfd = q.defer();
    $scope.pdfFile = 'delivery_'+ req.body.delivery_id + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../../public/output/delivery/' + $scope.pdfFile);
    var report  = new nsReport();
    var doc = report.createDocument(require('../report/delivery_report.js'), $scope.temp_data);
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

  db.beginTransaction()
 .then(getDeliveryReportData)
 .then(renderReport)
 .then(function() {
   res.send({
     status:true,
     data: {
       pdfFile: '/output/delivery/'+$scope.pdfFile,
       pickupId: req.body.delivery_id
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

module.exports = router;
