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

var pickupFields = {
  id:{name:'id'},
  pickup_no:{name:'pickup_no'},
  pickup_date:{name:'pickup_date'},
  booking_qty:{name:'booking_qty'},
  city_district:{name:'city_district'},
  prepare_by:{name:'prepare_by'},
  vehicle:{name:'vehicle'},
  driver:{name:'driver'},
  plan_qty:{name:'plan_qty'},
  pickup_qty:{name:'pickup_qty'},
  status:{name:'status'},
  remark_status:{name:'remark_status'}

};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////  Get Pickup List   ////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/listPickUp',[bodyParser.json()], function(req, res){
  console.log("come to listPickUp.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT id, pickup_no, pickup_date, booking_qty, city_district, prepare_by, "
                + "vehicle, driver, plan_qty, pickup_qty, "
                + "UPPER(status) as status, "
                + "remark_status, created_at, created_by, updated_at, updated_by "
                + "FROM pickup WHERE id > 0 ";
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
    if (typeof pickupFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(pickupFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='pickup_no' || fld=='pickup_date' || fld=='city_district' || fld=='prepare_by' || fld=='driver' ||
        fld=='plan_qty' || fld == 'pickup_qty' || fld == 'status') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM pickup WHERE id > 0 ";
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
    var sortBy = req.body.sortBy || 'pickup_no';
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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////   getSearchBookingWait    ///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/getSearchBookingWait', function(req, res) {
  var searchData = req.body;
  var db = conn.connect();
  var sql = "SELECT b.*, p.firstname, b.id booking_id, "
          + "GROUP_CONCAT(DISTINCT `bd`.`booking_name`ORDER BY `bd`.`booking_name` ASC SEPARATOR ',') AS `package_contents_p` "
          + "FROM booking b "
          + "INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
          + "INNER JOIN booking_detail bd ON b.id = bd.booking_id "
          + "LEFT JOIN pickup_detail pd ON b.id <> pd.booking_id "
          + "WHERE b.status = 'WAIT_ASSIGN' "
          + "AND b.id NOT IN (SELECT booking_id FROM pickup_detail WHERE pickup_detail_status = 'active') ";

  if(searchData.booking_no != ""){
    sql += "AND b.booking_no = '" + searchData.booking_no + "' ";
  }
  if(searchData.customer != ""){
    sql += "AND p.firstname LIKE '%" + searchData.customer + "%' ";
  }
  if(searchData.waybill != ""){
    sql += "AND b.waybill = '" + searchData.waybill + "' ";
  }
  if(searchData.pickup_date != ""){
    sql += "AND b.pickup_date LIKE '" + searchData.pickup_date + "%' ";
  }
  if(searchData.district != ""){
    sql += "AND b.pickup_place LIKE '%" + searchData.district + "%' ";
  }
  // console.log("SQL = ", sql);
  sql += "GROUP BY b.id ";
  console.log("SQL = ", sql);
  db.query(sql, {}).then(function(data){
    res.send({ status:true, data: data });
  }).catch(function(e){
    res.send({ status:false, error: e });
  });
});

//////////////////////////////////////////////////////////////////////////////////
///////       getPU      /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
router.post('/getPU', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {
    pu: {},
    pu_items:[]
  };

  var getPU = function() {
    var sql = "SELECT pu.*, st.display_name staff, st.id staff_id, st.display_name prepare_by, "
      + "pu.remark_status remark, pu.pickup_date pickup_date_set, UPPER(pu.status) display_status "
      + "FROM pickup pu LEFT JOIN staff st "
      + "  ON pu.prepare_by=st.id "
      + "WHERE pu.id=:id ";

    return db.query(sql, {id:req.body.id}).then(function(rows) {
      if (rows.length > 0) {
        $scope.pu = rows[0];
      }
    });
  }

  var getPUItems = function() {
    var sql = "SELECT * FROM v_pickup_list "
      + "WHERE pickup_id=:id "
      + "ORDER BY pickup_id ";
    return db.query(sql, {id:req.body.id}).then(function(rows) {
      $scope.pu_items = rows;
    });
  }

  q.all([
    getPU(),
    getPUItems()
  ]).then(function() {
    res.send({
      status:true,
      pu: $scope.pu,
      pu_items: $scope.pu_items
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  })
})

//////////////////////////////////////////////////////////////////////////////////
///////   savePickup    //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
router.post('/savePickup', [bodyParser.json()], function(req, res) {
  // console.log("req = ", req.body);
  // console.log("PU Head = ", req.body.pu);
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
    var prefix = "P-" + c;
     $scope = {
       table:"pickup",
       fld:"pickup_no",
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

  var insertPickup = function(){
    console.log('insertBooking');
    console.log('pick up date = ',req.body.pu);
    req.body.pu.pickup_no = $scope.code;
    req.body.pu.country_origin = req.body.pu_items[0].country_origin;

    var sql = "insert into pickup(pickup_no,pickup_date,booking_qty,city_district,prepare_by,"
            + "vehicle,driver,plan_qty,pickup_qty,status,remark_status,created_by,updated_by) "
            + "values(:pickup_no, :pickup_date_set, :booking_qty, :country_origin, :staff, "
            + ":vehicle, :driver, :booking_item_qty, '0', 'active', :remark,:staff_id,:staff_id) ";

    return db.query(sql, req.body.pu).then(function(res) {
      $scope.pickup_id = res.insertId;
    });
  }

  var insertPickupDetail = function(){
    console.log('pickupDetailList');
    console.log("pickupDetailList length = ", req.body.pu_items.length);
    var all = [];
    for (var i = 0; i < req.body.pu_items.length; i++) {
      all.push(insertDataPickupDetailList(i));
    }
    return q.all(all);
  }

  var insertDataPickupDetailList = function(i){
    console.log('insertDataPickupDetailList = ', $scope.pickup_id);
    req.body.pu_items[i].pickup_id = $scope.pickup_id;
    req.body.pu_items[i].pickup_detail_no = $scope.code + i;
    req.body.pu_items[i].pickup_date = req.body.pu.pickup_date_set;
    var sql = "insert into pickup_detail(pickup_id, booking_id, pickup_detail_no, item_qty, pickup_detail_status, "
            + "pickup_date, receipted_date, created_by, updated_by) "
            + "VALUES (:pickup_id, :booking_id, :pickup_detail_no, :item_qty, 'active', "
            + ":pickup_date, '0000-00-00', '1', '1')";
    // console.log("SQL = ", sql);
    // console.log("SQL DATA = ", req.body.bookingDetail[i]);
    $scope.pickUp_detail_id = [];
    return db.query(sql, req.body.pu_items[i]).then(function(res) {
      $scope.pickUp_detail_id.push({pickup_id:$scope.pickup_id, pickUp_detail_id:res.insertId, booking_id:req.body.pu_items[i].id});
      req.body.pu_items[i].pickUp_detail_id = res.insertId;
    });
  }

  var insertPickupItem = function(){
    console.log("$scope.pickUp_detail_id = ", $scope.pickUp_detail_id);
    console.log("$scope.pickUp_detail_id = ", $scope.pickUp_detail_id.length);
    var all = [];
    for (var i = 0; i < $scope.pickUp_detail_id.length; i++) {
      all.push(insertDataPickupItemList(i));
    }
    return q.all(all);
  }

  var insertDataPickupItemList = function(i){
    $scope.pickUp_detail_id[i].pickup_item_date = req.body.pu.pickup_date_set;
    var sql = "INSERT INTO pickup_item (pickup_id,pickup_detail_id,booking_id,item_id,item_no,"
            + "item_qty,status,pickup_date) "
            + "select :pickup_id pickupid, :pickUp_detail_id pickup_detail_id, booking_id, id, item_no, item_qty, "
            + "'active' pickup_detail_status, :pickup_item_date pickup_date "
            + "from booking_item where booking_id = :booking_id "
    console.log("sql item = ", sql);
    $scope.pickUp_item_id = [];
    return db.query(sql, $scope.pickUp_detail_id[i]).then(function(res) {
      $scope.pickUp_item_id.push({pickup_id:$scope.pickup_id, pickUp_detail_id:$scope.pickUp_detail_id[i].pickUp_detail_id,pickUp_item_id:res.insertId, booking_id:req.body.pu_items[i].id});
    });
  }

  var updateBookingItem = function(){
    var all = [];
    for (var i = 0; i < req.body.pu_items.length; i++) {
      all.push(updateBookingItemList(i));
    }
    return q.all(all);
  }

  var updateBookingItemList = function(i) {
    var sql = "UPDATE booking_item SET status = 'ASSIGNED' WHERE booking_id=:booking_id";
    return db.query(sql, req.body.pu_items[i]).then(function(res) {
      console.log("booking_item update = ", res);
    });
  }


  var db = conn.connect();
  db.beginTransaction()
    .then(_code)
    .then(_getNextCode)
    .then(insertPickup)
    .then(insertPickupDetail)
    .then(insertPickupItem)
    .then(updateBookingItem)
    .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              pickup_id:$scope.pickup_id,
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
//////  updatePickup  //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/updatePickup', [bodyParser.json()], function(req, res) {
  console.log("req = ", req.body);
  console.log("PU Head = ", req.body.pu);
  var $scope = {};

  var updatePickup = function(){
    console.log('updatePickup');
    console.log('pick up date = ',req.body.pu);
    var sql = "UPDATE pickup SET pickup_date=:pickup_date_set, booking_qty=:booking_qty, "
            + "vehicle=:vehicle, driver=:driver, plan_qty=:booking_item_qty, "
            + "status = 'active', remark_status=:remark,updated_by=:staff_id "
            + "WHERE id=:id";

    return db.query(sql, req.body.pu).then(function(res) {
      console.log("pickup update = ", res);
    });
  }

  var updateBackBookingItem = function(){
    var sql = "UPDATE booking_item SET `status` = 'WAIT_ASSIGN'"
            + "WHERE booking_id IN (SELECT DISTINCT booking_id FROM pickup_detail WHERE pickup_id = '"
            + req.body.pu.id + "')";
    return db.query(sql, {}).then(function(res) {
      console.log("booking_item update = ", res);
    });
  }

  var deletepicupDetail = function(){
    var sql = "DELETE FROM pickup_detail WHERE pickup_id='" + req.body.pu.id + "'";
    return db.query(sql, {}).then(function(res) {
      console.log("pickupdetail delete = ", res);
    });
  }

  var insertPickupDetail = function(){
    console.log('pickupDetailList');
    console.log("pickupDetailList length = ", req.body.pu_items.length);
    var all = [];
    for (var i = 0; i < req.body.pu_items.length; i++) {
      all.push(insertDataPickupDetailList(i));
    }
    return q.all(all);
  }

  var insertDataPickupDetailList = function(i){
    console.log('insertDataPickupDetailList = ', $scope.pickup_id);
    req.body.pu_items[i].pickup_id = req.body.pu.id;
    req.body.pu_items[i].pickup_detail_no = req.body.pu.pickup_no + i;
    req.body.pu_items[i].pickup_date = req.body.pu.pickup_date_set;
    req.body.pu_items[i].u_staff = req.body.pu.staff_id;
    var sql = "insert into pickup_detail(pickup_id, booking_id, pickup_detail_no, item_qty, pickup_detail_status, "
            + "pickup_date, receipted_date, created_by, updated_by) "
            + "VALUES (:pickup_id, :booking_id, :pickup_detail_no, :item_qty, 'active', "
            + ":pickup_date, '0000-00-00', :u_staff, :u_staff)";
    // console.log("SQL = ", sql);
    // console.log("SQL DATA = ", req.body.bookingDetail[i]);
    $scope.pickUp_detail_id = [];
    return db.query(sql, req.body.pu_items[i]).then(function(res) {
      $scope.pickUp_detail_id.push({pickup_id:req.body.pu.id, pickUp_detail_id:res.insertId, booking_id:req.body.pu_items[i].booking_id});
      req.body.pu_items[i].pickUp_detail_id = res.insertId;
    });
  }

  var deletepicupItem = function(){
    var sql = "DELETE FROM pickup_item WHERE pickup_id='" + req.body.pu.id + "'";
    return db.query(sql, {}).then(function(res) {
      console.log("pickupitem delete = ", res);
    });
  }

  var insertPickupItem = function(){
    console.log("$scope.pickUp_detail_id = ", $scope.pickUp_detail_id);
    console.log("$scope.pickUp_detail_id = ", $scope.pickUp_detail_id.length);
    var all = [];
    for (var i = 0; i < $scope.pickUp_detail_id.length; i++) {
      all.push(insertDataPickupItemList(i));
    }
    return q.all(all);
  }

  var insertDataPickupItemList = function(i){
    $scope.pickUp_detail_id[i].pickup_iteme_date = req.body.pu.pickup_date_set;
    var sql = "INSERT INTO pickup_item (pickup_id,pickup_detail_id,booking_id,item_id,item_no,"
            + "item_qty,status,pickup_date) "
            + "select :pickup_id pickupid, :pickUp_detail_id pickup_detail_id, booking_id, id, item_no, item_qty, "
            + "'active' pickup_detail_status, :pickup_iteme_date pickup_date "
            + "from booking_item where booking_id = :booking_id "
    console.log("sql item = ", sql);
    $scope.pickUp_item_id = [];
    return db.query(sql, $scope.pickUp_detail_id[i]).then(function(res) {
      $scope.pickUp_item_id.push({pickup_id:$scope.pickup_id, pickUp_detail_id:$scope.pickUp_detail_id[i].pickUp_detail_id,pickUp_item_id:res.insertId, booking_id:req.body.pu_items[i].id});
    });
  }

  var updateBookingItem = function(){
    var all = [];
    for (var i = 0; i < req.body.pu_items.length; i++) {
      all.push(updateBookingItemList(i));
    }
    return q.all(all);
  }

  var updateBookingItemList = function(i) {
    var sql = "UPDATE booking_item SET status = 'ASSIGNED' WHERE booking_id=:booking_id";
    return db.query(sql, req.body.pu_items[i]).then(function(res) {
      console.log("booking_item update = ", res);
    });
  }


  var db = conn.connect();
  db.beginTransaction()
    .then(updatePickup)
    .then(updateBackBookingItem)
    .then(deletepicupDetail)
    .then(insertPickupDetail)
    .then(deletepicupItem)
    .then(insertPickupItem)
    .then(updateBookingItem)
    .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              done:'Update complete'
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
    var sql = "SELECT * FROM v_get_pickup_item WHERE item_no =:item_no";

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
///////  savePickupReceipt  /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
router.post('/savePickupReceipt', [bodyParser.json()], function(req, res) {
  console.log("req = ", req.body);
  // console.log("PU Head = ", req.body.pu);
  var $scope = {};
  $scope.pickup_id = req.body.puReceiptItems[0].pickup_id;
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

  var updatePickupItem = function(){
    console.log("updatePickupItem = ", $scope.itemIdStr);
    var sql = "UPDATE pickup_item SET `status` = 'received' WHERE pickup_id = '" + $scope.pickup_id
            + "' AND id IN (" + $scope.itemIdStr + ")";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("pickup_item update = ", res);
    });
  }

  var updatePickupItemC = function(){
    console.log("updatePickupItem = ", $scope.itemIdStr);
    var sql = "UPDATE pickup_item SET `status` = 'exception' WHERE pickup_id = '" + $scope.pickup_id
            + "' AND id NOT IN (" + $scope.itemIdStr + ") AND `status` <> 'received'";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("pickup_item update = ", res);
    });
  }

  var updateBookingItemStatus = function(){
    console.log("updateBookingItemStatus = ", $scope.itemNoStr);
    var sql = "UPDATE booking_item SET `status` = 'ARRIVED_ORIGIN' WHERE item_no IN (" + $scope.itemNoStr + ")";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("booking_item update = ", res);
    });
  }

  var getUpdateBookingData = function(){
    console.log("getUpdateBookingData");
    var sql = "select pi.pickup_id, pi.booking_id, count(pi.item_id) picup_item_qty, b.item_qty "
            + "from pickup_item pi inner join booking b on pi.booking_id = b.id "
            + "where pi.`status` = 'received' and pi.pickup_id = '"+ $scope.pickup_id +"' "
            + "group by pi.booking_id";
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
      if ($scope.updateBookingData[i].picup_item_qty == $scope.updateBookingData[i].item_qty){
        all.push(updateBookingList(i));
        // all.push(i);
      }
    }
    // console.log("all = ", all);
    return q.all(all);
  }
  var updateBookingList = function(i) {
    console.log("updateBookingList");
    var sql = "UPDATE booking, pickup_detail SET booking.status = 'INPROCESS', "
            + "pickup_detail.pickup_detail_status = 'received', "
            + "booking.accepted_origin_date = NOW() "
            + "WHERE booking.id = pickup_detail.booking_id "
            + "AND pickup_detail.pickup_id = '" + $scope.updateBookingData[i].pickup_id + "' "
            + "AND pickup_detail.booking_id = '" + $scope.updateBookingData[i].booking_id + "' "
            + "AND booking.id = '" + $scope.updateBookingData[i].booking_id + "'";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("booking update = ", res);
    });
  }

  var getPickupData = function() {
    console.log("getPickupData");
    var sql = "select p.id pickup_id, p.pickup_no, p.plan_qty, count(pi.item_no) pickup_qty "
            + "from pickup p inner join pickup_item pi on p.id = pi.pickup_id "
            + "where pi.`status` = 'received' AND p.id = '" + $scope.pickup_id +"' "
            + "group by p.id, p.pickup_no, p.plan_qty";
    console.log("sql = ", sql);

    return db.query(sql, {}).then(function(res) {
      $scope.updatePickupData = res[0];
      console.log("$scope.updatePickupData = ", $scope.updatePickupData);
    });
  }

  var updatePickupByData = function(){
    console.log("updatePickupByData");
    var setStatus = "active";
    if($scope.updatePickupData.plan_qty == $scope.updatePickupData.pickup_qty){
      setStatus = "received";
    }else {
      setStatus = "exception";
    }
    var sql = "UPDATE pickup SET `status` = '" + setStatus + "', pickup_qty = '"
            + $scope.updatePickupData.pickup_qty + "' "
            + "WHERE id = '" + $scope.pickup_id + "' ";
    console.log("sql = ", sql);
    return db.query(sql, {}).then(function(res) {
      console.log("pickup update = ", res);
    });
  }

  var db = conn.connect();
  db.beginTransaction()
  .then(loopGetItemNo)
  .then(updatePickupItem)
  .then(updatePickupItemC)
  .then(updateBookingItemStatus)
  .then(getUpdateBookingData)
  .then(updateBooking)
  .then(getPickupData)
  .then(updatePickupByData)
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
////// genPrintPickup /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/genPrintPickup', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  console.log("req.body = ", req.body);
  var getPickupReportData = function() {
    var sql = "SELECT DATE_FORMAT(p.pickup_date,'%d %b %Y') time,b.pickup_place, p.item_qty qty, "
            + "CONCAT(ps.firstname, ' ', ps.lastname) contact_name, "
            + "CONCAT('PICK UP SCHEDULE ON ', DATE_FORMAT(p.pickup_date,'%d %b %Y')) pickup_schedule, "
            + "CONCAT('Driver name : ',ph.driver,' | Plate number : A1-8888') driver_plate "
            + "FROM pickup_detail p "
            + "JOIN booking b ON p.booking_id = b.id "
            + "JOIN customer c ON b.customer_id = c.id "
            + "JOIN person ps ON c.person_id = ps.id "
            + "JOIN pickup ph ON p.pickup_id = ph.id "
            + "WHERE p.pickup_id =:pickup_id";

    return db.query(sql, req.body).then(function(rows) {
      if (rows.length > 0) {
        $scope.reportData = rows;
        console.log($scope.reportData);
        for(var i=0; i<$scope.reportData.length; i++){
          var idex_of = $scope.reportData[i].pickup_place.indexOf("Tel:");
          $scope.reportData[i].tel = $scope.reportData[i].pickup_place.substring(idex_of+5);
          $scope.reportData[i].address = $scope.reportData[i].pickup_place.substring(0,idex_of-1);
          $scope.reportData[i].no = i+1;
        }
      }
      console.log("report2 = ", $scope.reportData);
    });
  };

  var renderReport = function() {
    var dfd = q.defer();
    $scope.pdfFile = 'pickup_'+ req.body.pickup_id + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../../public/output/pickup/' + $scope.pdfFile);
    var report  = new nsReport();
    var doc = report.createDocument(require('../report/pickup_report.js'), $scope.reportData);
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
 .then(getPickupReportData)
 .then(renderReport)
 .then(function() {
   res.send({
     status:true,
     data: {
       pdfFile: '/output/pickup/'+$scope.pdfFile,
       pickupId: req.body.pickup_id
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
////////     getAutoComplete        ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/getAutoComplete', [bodyParser.json()], function(req, res) {
  console.log("getAutoComplete");
  var db = conn.connect();
  var $scope = {};
  $scope.driver = [];
  $scope.vehicle = [];

  var getDriver = function(){
    var sql = "select distinct driver from pickup"
    return db.query(sql, {}).then(function(res) {
      for (var i = 0; i < res.length; i++) {
        $scope.driver.push(res[i].driver);
      }
      console.log("driver = ", $scope.driver);
    });
  }

  var getVehicle = function(){
    var sql = "select distinct vehicle from pickup"
    return db.query(sql, {}).then(function(res) {
      for (var i = 0; i < res.length; i++) {
        $scope.vehicle.push(res[i].vehicle);
      }
      console.log("Vehicle = ", $scope.vehicle);
    });
  }


  q.all([
    getDriver(),
    getVehicle()
  ]).then(function() {
    res.send({
      status:true,
      data:{
        driver: $scope.driver,
        vehicle: $scope.vehicle
      }
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  })
});

module.exports = router;
