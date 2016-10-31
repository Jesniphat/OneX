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
var nodemailer  = require('nodemailer');

router.use('/pickup', require('./pickup/pickup'));
router.use('/intransit', require('./intransit/intransit'));
router.use('/delivery', require('./delivery/delivery'));
router.use('/home', require('./home/home'));
router.use('/report_action', require('./report_action/report_action'));
router.use('/payment_tracking', require('./payment_tracking/payment_tracking'));

var bookingFields = {
    booking_no:{name:'b.booking_no'},
    customer_name:{name:"CONCAT(p.firstname,' ',p.lastname)"},
    pickup_place:{name:'b.pickup_place'},
    pickup_date:{name:'b.pickup_date'},
    type:{name:'p.type'},
    deliveried_date:{name:'b.deliveried_date'},
    booking_date:{name:'b.booking_date'},
    payment_status:{name:'b.payment_status'},
    receipt_type:{name:'b.receipt_type'}
};

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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// WaitClearCreditCard  ///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/listWaitClearCreditCard',[bodyParser.json()], function(req, res){
  console.log("come to listWaitClearCreditCard.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "case b.payment_status when 'paid' then 'PAID' when 'pending' then 'PENDING' else 'UNPAID' end as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'WAIT_CLEAR_CREDIT_CARD' ";
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
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM booking WHERE status = 'WAIT_CLEAR_CREDIT_CARD' ";
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
      error: e,
      j:'jes'
    });
  });

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////  Get booking list wait assinge ////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/listWaitAssign',[bodyParser.json()], function(req, res){
  console.log("come to listWaitAssign.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "CASE WHEN receipt_type = 'CREDIT' THEN 'CREDITCARD' ELSE receipt_type END AS receipt_type, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'WAIT_ASSIGN' ";
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
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'receipt_type') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM booking WHERE status = 'WAIT_ASSIGN' ";
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
    var sortBy = req.body.sortBy || 'b.booking_no';
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
      error: e,
      j:'jes'
    });
  });

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////  Get listInprocess    /////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/listInprocess',[bodyParser.json()], function(req, res){
  console.log("come to listInprocess.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'INPROCESS' ";
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
        fld=='deliveried_date' || fld == 'booking_date') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM booking WHERE status = 'WAIT_ASSIGN' ";
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
    var sortBy = req.body.sortBy || 'b.booking_no';
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
      error: e,
      j:'jes'
    });
  });

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////  Get listInTransit /////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/listInTransit',[bodyParser.json()], function(req, res){
  console.log("come to listInTransit.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'INTRANSIT' ";
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
        fld=='deliveried_date' || fld == 'booking_date') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM booking WHERE status = 'WAIT_ASSIGN' ";
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
    var sortBy = req.body.sortBy || 'b.booking_no';
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////  Get listArrived    /////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/listArrived',[bodyParser.json()], function(req, res){
  console.log("come to listArrived.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'ARRIVED' ";
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
        fld=='deliveried_date' || fld == 'booking_date') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM booking WHERE status = 'WAIT_ASSIGN' ";
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
    var sortBy = req.body.sortBy || 'b.booking_no';
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////  Get listDelivered   ///////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/listDelivered',[bodyParser.json()], function(req, res){
  console.log("come to listDelivered.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'DELIVERIED' ";
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
        fld=='deliveried_date' || fld == 'booking_date') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM booking WHERE status = 'WAIT_ASSIGN' ";
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
    var sortBy = req.body.sortBy || 'b.booking_no';
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////  GET listException   ///////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/listException',[bodyParser.json()], function(req, res){
  console.log("come to listException.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'EXCEPTION' ";
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
        fld=='deliveried_date' || fld == 'booking_date') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM booking WHERE status = 'WAIT_ASSIGN' ";
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
    var sortBy = req.body.sortBy || 'b.booking_no';
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////  Get listCancel   /////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/listCancel',[bodyParser.json()], function(req, res){
  console.log("come to listCancel.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'CANCEL' ";
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
        fld=='deliveried_date' || fld == 'booking_date') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
    //console.log("mainQuery = ", mainQuery);
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) cnt FROM booking WHERE status = 'WAIT_ASSIGN' ";
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
    var sortBy = req.body.sortBy || 'b.booking_no';
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// cancelBooking /////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/cancelBooking',[bodyParser.json()], function(req, res) {
  console.log('cancelBooking');
  console.log(req.body.id);
  var $scope = {};
  $scope.booking_id = req.body.id;

  var cancelBooking = function() {
      var sql = "UPDATE booking SET status='CANCEL', updated_at=NOW() WHERE id=:id";

      return db.query(sql, req.body);
    }

    var db = conn.connect();
    db.beginTransaction()
      .then(cancelBooking)
      .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              booking_id:$scope.booking_id,
              done:'cancel booking complete'
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////  Change Status ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/changeStatusBooking',[bodyParser.json()], function(req, res) {
  console.log('changeStatusBooking');
  console.log(req.body.id);
  var $scope = {};
  $scope.booking_id = req.body.id;

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
     $scope = {
       table:"booking",
       fld:"booking_no",
       fld_waybill:"waybill",
       prefix:p,
       prefix_waybill:"onex" + p,
       size:-5,
       start:1,
       p:p
     }
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
                next = parseInt(maxCode.substr($scope.prefix_waybill.length)) + 1;
              }
              console.log("next = ", next);
              $scope.newWaybillCode = $scope.prefix_waybill + "" + ('0000000000000'+ next).substr($scope.size); // new code
              // $scope.newWaybill = ""; // more new code
              console.log("$scope.newWaybillCode = ", $scope.newWaybillCode);
            });
        })()
      ]);
  }

  var changeBooking = function() {
      var sql = "UPDATE booking SET status='WAIT_ASSIGN', waybill = '" + $scope.newWaybillCode + "', updated_at=NOW() WHERE id=:id";
      console.log("sql = ", sql);
      return db.query(sql, req.body);
    }

    var db = conn.connect();
    db.beginTransaction()
      .then(_code)
      .then(_genWaybill)
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////   GetPackgageList    //////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/getContentPackageList', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  q.all([
    (function() {
      var query = "SELECT id AS value, description AS text FROM comodities ";
      return db.query(query).then(function(rows) {
          $scope.packageList = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { packageList: $scope.packageList } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///    getAddressList       /////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/getAddressList', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  q.all([
    (function() {
      var query = "SELECT c.person_id, c.id customer_id, a.id address_id, a.tel, "
                + "CONCAT((case when cb.billing_name is null then '' else cb.billing_name END), '\r\n', a.addr1, ' ', a.addr2, '\r\n', a.tambon, ' ', a.amphur, '\r\n', a.province, ' ', a.zipcode, '\r\n','Tel: ', a.tel) AS address  "
                + "from customer c INNER JOIN address a ON c.id = a.customer_id INNER JOIN customer_billing_name cb ON a.id = cb.address_id WHERE c.person_id = '"
                + req.body.person_id + "' ORDER BY cb.address_id DESC";
      return db.query(query).then(function(rows) {
          $scope.addressList = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { addressList: $scope.addressList } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///    getDefaultAddr      //////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/getDefaultAddr', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  console.log("Server getDefaultAddr = ", req.body.person_id);
  q.all([
    (function() {
      var query = "SELECT c.*, cr.code currency_code, cr.name currency_name, a.tel, "
                + "CONCAT(cb.billing_name, '\r\n',a.addr1, ' ', a.addr2, '\r\n', a.tambon, ' ', a.amphur, '\r\n', a.province, ' ', a.zipcode, '\r\n','Tel: ',a.tel) AS address  "
                + "from customer c INNER JOIN address a ON c.id = a.customer_id INNER JOIN customer_billing_name cb ON a.id = cb.address_id "
                + "LEFT JOIN currency cr ON c.currency_id = cr.id "
                + "WHERE a.default_address = 'Y' AND c.person_id = '"
                + req.body.person_id + "'";
      return db.query(query).then(function(rows) {
          $scope.address = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { address: $scope.address } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  Get From To List ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/getFromDestination', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  console.log("Server getFromDestination");
  q.all([
    (function() {
      var query = "SELECT DISTINCT district_origin AS value, CONCAT(city_origin, '-', district_origin) AS text FROM excel_zone ";
      return db.query(query).then(function(rows) {
          $scope.fromDestination = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { fromDestination: $scope.fromDestination } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});


router.post('/getToDestination', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  console.log("Server getToDestination");
  q.all([
    (function() {
      var query = "SELECT DISTINCT district_destination AS value, CONCAT(city_destination, '-', district_destination) AS text FROM excel_zone ";
      return db.query(query).then(function(rows) {
          $scope.toDestination = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { toDestination: $scope.toDestination } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////   Get Rate   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/getRate', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  //console.log("getRate = ", req.body)
  q.all([
    (function() {
      // var query = "SELECT r.* FROM excel_zone z INNER JOIN excel_rate r on z.zone = r.zone WHERE CONCAT(z.city_origin,'-',z.district_origin) = '" + req.body.from
      //           + "' AND CONCAT(z.city_destination,'-',z.district_destination) = '" + req.body.to + "' AND r.service_type = '" + req.body.type +"';";
      var query = "SELECT r.*,z.country_origin, z.country_destination FROM excel_zone z INNER JOIN excel_rate r on z.zone = r.zone WHERE z.district_origin = '" + req.body.from
                + "' AND z.district_destination = '" + req.body.to + "' AND r.service_type = '" + req.body.type +"';";
       console.log("query = ", query);
      return db.query(query).then(function(rows) {
          $scope.rate = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { rate: $scope.rate } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});

// var query = "SELECT r.* FROM excel_zone z INNER JOIN excel_rate r on z.zone = r.zone WHERE z.district_origin = '" + req.body.from
//                 + "' AND z.district_destination = '" + req.body.to + "' AND r.service_type = '" + req.body.type +"';";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///   Save Booking   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/saveBooking', [bodyParser.json()], function(req, res){
  var $scope = {};
  $scope.booking_id = null;
  $scope.booking_detail_id = null;
  // $scope.booking_detail_id = [];
  //$scope.lastCode == {};

  console.log("Save Booking");
  console.log("Save Booking = ", req.body);

  var editQty = function(){
    req.body.bookingDetail = [];
    var listBookingItem = req.body.bookingItem;
    for (var i=0; i<listBookingItem.length; i++){
      if(listBookingItem[i].qty>1){
        for(var j=0; j<listBookingItem[i].qty; j++){
          (req.body.bookingDetail).push({
            name:listBookingItem[i].name,
            contentId:listBookingItem[i].contentId,
            packageType:listBookingItem[i].packageType,
            packageContent:listBookingItem[i].packageContent,
            amount:(listBookingItem[i].amount)/listBookingItem[i].qty,
            currency:listBookingItem[i].currency,
            qty:'1',
            width:listBookingItem[i].width,
            depth:listBookingItem[i].depth,
            height:listBookingItem[i].height,
            volume_weight:listBookingItem[i].volume_weight,
            weight:listBookingItem[i].weight,
            total_price:(listBookingItem[i].total_price)/listBookingItem[i].qty,
            booking_detail_id:listBookingItem[i].booking_detail_id,
            customer_id:req.body.customer_id,
          });
        }
      }else{
        (req.body.bookingDetail).push({
          name:listBookingItem[i].name,
          contentId:listBookingItem[i].contentId,
          packageType:listBookingItem[i].packageType,
          packageContent:listBookingItem[i].packageContent,
          amount:listBookingItem[i].amount,
          currency:listBookingItem[i].currency,
          qty:listBookingItem[i].qty,
          width:listBookingItem[i].width,
          depth:listBookingItem[i].depth,
          height:listBookingItem[i].height,
          volume_weight:listBookingItem[i].volume_weight,
          weight:listBookingItem[i].weight,
          total_price:listBookingItem[i].total_price,
          booking_detail_id:listBookingItem[i].booking_detail_id,
          customer_id:req.body.customer_id,
        });
      }
    }
    //console.log("New Obj = ", req.body);
  }

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
     $scope = {
       table:"booking",
       fld:"booking_no",
       fld_waybill:"waybill",
       prefix:p,
       prefix_waybill:"onex" + p,
       size:-5,
       start:1,
       p:p
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
            $scope.newCode = $scope.prefix + "" + ('0000000000000'+ next).substr($scope.size); // new code
            $scope.newWaybill = ""; // more new code
            console.log("$scope.newCode = ",$scope.newCode, $scope.newWaybill);
          });
      })()
    ]);
  }

  var insertBooking = function(){
    console.log('insertBooking');
    console.log('pick up date = ',req.body.picUpDate);
    req.body.booking_no = $scope.newCode;
    req.body.waybill = $scope.newWaybill;
    req.body.deliveryDate = (req.body.deliveryDate).substring(0, 10);
    req.body.booking_status = "WAIT_CLEAR_CREDIT_CARD";
    if(req.body.paymentType == "billing"){
      req.body.booking_status = "WAIT_ASSIGN";
    }
    //console.log("obj = ", req.body);

    var sql = "insert into booking(booking_no,booking_date,customer_id,from_place,to_place,sender,receipient,pickup_place,pickup_date,"
            + "package_contents,item_qty,discount_amount,discount_percent,charge_amount,receipt_type,"
            + "total_amount,receipt_amount,currency_id,zone,rate,total_weight,total_volume_weight,"
            + "waybill,delivery_type,country_origin,country_destination,created_by,updated_by,status,"
            + "total,vat_amount,vat_rate,grand_total_amount) "
            + "values(:booking_no, NOW(), :customer_id, :from, :to, :sender, :receipient, :picUpPlace, :picUpDate, "
            + ":content, :itemQty, :discount_amount, :discount_percent, :charge_amount,:paymentType, "
            + ":totalAmount, :totalAmount, :currency_id, :zone, :rate, :total_weight, :total_volume_weight, "
            + ":waybill, :deliveryType, :country_origin, :country_destination, :staff_id, :staff_id, :booking_status, "
            + ":total, :vat_amount, :vat_rate, :grand_total_amount) ";

    return db.query(sql, req.body).then(function(res) {
      $scope.booking_id = res.insertId;
    });
  }

  var insertInvoice = function(){
      req.body.booking_id = $scope.booking_id;
      req.body.invoice_no = "INV" + req.body.booking_no;
      console.log("payment type = ", req.body.paymentType,req.body.customer_id);
      var sql = "INSERT INTO transport_invoice (currency_id,booking_id,invoice_no,invoice_amount,"
              + "real_invoice,qty,created_by,updated_by,invoice_addr) "
              + "VALUES(:currency_id,:booking_id,:invoice_no,:totalAmount,:totalAmount,:itemQty,:staff_id,:staff_id,:invoiceName)"

    return db.query(sql, req.body).then(function(res) {
      $scope.invoice_id = res.insertId;
    });
  }


  var insertBookingDetail = function(){
    console.log('bookingDetailList');
    console.log("bookingDetail length = ", req.body.bookingItem.length);
    var all = [];
    for (var i = 0; i < req.body.bookingItem.length; i++) {
      all.push(insertDataBookingDetailList(i));
    }
    return q.all(all);
  }

    var insertDataBookingDetailList = function(i) {
      console.log('insertbookingDetailList');
      req.body.bookingItem[i].booking_id = $scope.booking_id;
      req.body.bookingItem[i].customer_id = req.body.customer_id;
      req.body.bookingItem[i].sub_total_price = req.body.bookingItem[i].total_price/req.body.bookingItem[i].qty;
      var sql = "insert into booking_detail(booking_id, booking_date, qty, width, depth, height, volume_weight, weight, total_price,"
        + " booking_name, package_contents_type, commodities_id, package_contents, sub_total_price)"
        + " VALUES (:booking_id, NOW(), :qty, :width, :depth, :height, :volume_weight, :weight, :total_price,"
        + " :name, :packageType, :contentId, :packageContent, :sub_total_price)";
      // console.log("SQL = ", sql);
      // console.log("SQL DATA = ", req.body.bookingDetail[i]);
      $scope.booking_detail_id = [];
      return db.query(sql, req.body.bookingItem[i]).then(function(res) {
        // console.log("insertId = ", res.insertId);
        $scope.booking_detail_id.push(res.insertId);
        req.body.bookingItem[i].booking_detail_id = res.insertId;
      });
    }

  var insertBookingItem = function(){
    console.log('bookingItemList');
    var all = [];
    for (var i = 0; i < req.body.bookingDetail.length; i++) {
      all.push(insertBookingItemList(i));
    }
    return q.all(all);
  }

    var insertBookingItemList = function(i){
      console.log("insertBookingItemList");
      req.body.bookingDetail[i].booking_id = $scope.booking_id;
      //req.body.bookingDetail[i].booking_detail_id = $scope.booking_detail_id[i];

      var z = i + "";
      var a = "";
      for(j=z.length; j<2; j++){
        a = a + "0";
      }
      var n = 0;
          n = (i+1);
      var itemCode = ($scope.newCode + " " + a + "" + n );

      req.body.bookingDetail[i].itemCode = itemCode;

      var sql = "insert into booking_item(booking_id, booking_detail_id, item_no, booking_date, item_qty, item_values, item_weight, item_total_price,"
        + " booking_name, package_contents_type, commodities_id, package_contents)"
        + " VALUES (:booking_id, :booking_detail_id, :itemCode, NOW(), :qty, :volume_weight, :weight, :total_price,"
        + " :name, :packageType, :contentId, :packageContent)";
        //console.log(sql);
      return db.query(sql, req.body.bookingDetail[i]);
    }

  var insertInvoiceDetail = function(){
    console.log('bookingItemList');
    var all = [];
    for (var i = 0; i < req.body.bookingItem.length; i++) {
      all.push(insertInvoiceDetailList(i));
    }
    return q.all(all);
  }

    var insertInvoiceDetailList = function(i) {
        console.log("insertInvoiceDetailList");
        req.body.bookingItem[i].transport_invoice_id = $scope.invoice_id;

        var sql = "insert into transport_invoice_detail(transport_invoice_id,booking_id,booking_detail_id,qty,description,total_price,"
            + "created_by,updated_by) "
            + "VALUES (:transport_invoice_id, :booking_id, :booking_detail_id, :qty, :name, :total_price,"
            + ":customer_id,:customer_id)";
            //console.log(sql);  transport_invoice_id
        return db.query(sql, req.body.bookingItem[i]);
    }


  var _genWaybill = function() {
      console.log('_getNextWayBillCode');
      console.log("req.body.paymentType = ",req.body.paymentType);
      if(req.body.paymentType == 'credit'){
        $scope.newWaybillCode = "";
        return true;
      } else {

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
    }
  }

  var updateWaybill = function(){
    var sql = "UPDATE booking SET waybill = '" + $scope.newWaybillCode + "' WHERE id = '" + $scope.booking_id + "'";
    return db.query(sql).then(function(data){
      console.log("updateWaybill = ", data);
    });
  }


  var db = conn.connect();
  db.beginTransaction()
    .then(_code)
    .then(_getNextCode)
    .then(insertBooking)
    .then(insertInvoice)
    .then(insertBookingDetail)
    .then(editQty)
    .then(insertBookingItem)
    .then(insertInvoiceDetail)
    .then(_genWaybill)
    .then(updateWaybill)
    .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              booking_id:$scope.booking_id,
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////  saveAddition   ////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/saveAddition', [bodyParser.json()], function(req, res){
  var $scope = {};
  console.log("Save Edit Data = ", req.body);
  $scope.booking_id = req.body.booking_id;

  var cancelBooking = function() {
      var sql = "UPDATE booking SET additional_detail=:additionDetail, additional_amount=:additionAmount, additional_remark=:additionRemark, updated_at=NOW() WHERE id=:booking_id";

      return db.query(sql, req.body);
    }

    var db = conn.connect();
    db.beginTransaction()
      .then(cancelBooking)
      .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              booking_id:$scope.booking_id,
              done:'Edit booking complete'
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  Get Rate Type /////
///  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/getRateType', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  //console.log("getRate = ", req.body)
  q.all([
    (function() {
      var query = "SELECT DISTINCT service_type from excel_rate;";
      return db.query(query).then(function(rows) {
          $scope.rateType = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { rateType: $scope.rateType } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////  getDialogData  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/getDialogData',[bodyParser.json()], function(req, res) {

  var db = conn.connect();
  console.log('getDialogData');
  console.log(req.body.booking_id);
  var $scope = {};
  $scope.booking_id = req.body.booking_id;

  q.all([
    (function() {
      // var query = "SELECT r.* FROM excel_zone z INNER JOIN excel_rate r on z.zone = r.zone WHERE CONCAT(z.city_origin,'-',z.district_origin) = '" + req.body.from
      //           + "' AND CONCAT(z.city_destination,'-',z.district_destination) = '" + req.body.to + "' AND r.service_type = '" + req.body.type +"';";
      var query = "select * from v_list_booking_dialoginfo where id = " + $scope.booking_id ;
      console.log("query = ", query);
      return db.query(query).then(function(rows) {
          $scope.data = rows;
        });
    })()
  ]).then(function() {
    console.log($scope.data);
    res.send({
        status:true,
        data: { booking_data: $scope.data },
        path: path.normalize(__dirname + '/../../public/output/')
    });
  }).catch(function(e) {
    res.send({
        status:false,
        error:e
    });
  })
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////  getDialogDetailList /////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/getDialogDetailList',[bodyParser.json()], function(req, res) {

  var db = conn.connect();
  console.log('getDialogDetailList');
  console.log(req.body.booking_id);
  var $scope = {};
  $scope.booking_id = req.body.booking_id;

  q.all([
    (function() {
      // var query = "SELECT r.* FROM excel_zone z INNER JOIN excel_rate r on z.zone = r.zone WHERE CONCAT(z.city_origin,'-',z.district_origin) = '" + req.body.from
      //           + "' AND CONCAT(z.city_destination,'-',z.district_destination) = '" + req.body.to + "' AND r.service_type = '" + req.body.type +"';";
      var query = "select * from v_booking_detail_dialog where booking_id = " + $scope.booking_id ;
      console.log("query = ", query);
      return db.query(query).then(function(rows) {
          $scope.data = rows;
        });
    })()
  ]).then(function() {
    console.log($scope.data);
    res.send({
        status:true,
        data: { bookingDetail_data: $scope.data }
    });
  }).catch(function(e) {
    res.send({
        status:false,
        error:e
    });
  })
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////  getDialogItemList///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/getDialogItemList',[bodyParser.json()], function(req, res) {

  var db = conn.connect();
  console.log('getDialogItemList');
  console.log(req.body.booking_id);
  var $scope = {};
  $scope.booking_id = req.body.booking_id;

  q.all([
    (function() {
      // var query = "SELECT r.* FROM excel_zone z INNER JOIN excel_rate r on z.zone = r.zone WHERE CONCAT(z.city_origin,'-',z.district_origin) = '" + req.body.from
      //           + "' AND CONCAT(z.city_destination,'-',z.district_destination) = '" + req.body.to + "' AND r.service_type = '" + req.body.type +"';";
      var query = "select * from v_booking_item_dialog where booking_id = " + $scope.booking_id ;
      console.log("query = ", query);
      return db.query(query).then(function(rows) {
          $scope.data = rows;
        });
    })()
  ]).then(function() {
    console.log($scope.data);
    res.send({
        status:true,
        data: { bookingItem_data: $scope.data }
    });
  }).catch(function(e) {
    res.send({
        status:false,
        error:e
    });
  })
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  saveBillist  ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/saveBillist', [bodyParser.json()], function(req, res) {
  var $scope = {};
  $scope.address_id = "";

  console.log("body bill",req.body);

  var insertDataAddressList = function() {
      console.log('insertDataAddressList');

      req.body.full_address = req.body.billingAddr1 + ' ' + req.body.billingAddr2
      + ' ' + req.body.billingTambon + ' ' + req.body.billingAmpher + ' ' + req.body.billingProvince
      + ' ' + req.body.billingZipcode;
      //console.log(req.body.billingListData[i]);
      var sql = "insert into address(customer_id, type, addr1, addr2, tambon, amphur, province, zipcode, tel,"
        + " other, full_address, is_active, created_at, created_by, updated_at, updated_by)"
        + " VALUES (:personId, 'HOME', :billingAddr1, :billingAddr2, :billingTambon, :billingAmpher, :billingProvince, :billingZipCode, :billingTel,"
        + " '', :full_address, 'YES', NOW(), '0', NOW(), '0')";
        //console.log(sql);
      //return db.query(sql, req.body.billingListData[i]);
      return db.query(sql, req.body).then(function(res) {
        $scope.address_id = res.insertId;
      });
    }

  var insertDataBillingList = function() {
    console.log('insertDataBillingList');
    if(req.body.billingCode == ''||req.body.billingCode == null||req.body.billingCode == undefined){
        req.body.billingCode = '';
    }
    req.body.address_id = $scope.address_id;
      var sql = "insert into customer_billing_name(code, customer_id, address_id, remark, memo, delivery_detial, payment_detial, default_billing,"
        + " created_at, created_by, updated_at, updated_by, billing_name) "
        + " VALUES (:billingCode, :personId, :address_id, '-', '-', '-', '-', 'N',"
        + " NOW(), '1', NOW(), '1', :billingName) ";
        //console.log(sql);
      return db.query(sql, req.body);
    }

  var db = conn.connect();
    db.beginTransaction()
      .then(insertDataAddressList)
      .then(insertDataBillingList)
      .then(function(){
        db.commit();
        res.send({
          status:true,
          data: {
              done:'อัพเดทข้อมูลสำเร็จ'
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////  Gen booking Report
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/booking_report', [bodyParser.json()], function(req, res) {
  console.log('print = ', req.body.bookingId);
  var $scope = {};

  var db = conn.connect();

  var getData = function() {
      console.log("Gen Report")
      var sql = "SELECT b.id, b.booking_no, DATE_FORMAT(b.booking_date,'%d %b %Y') AS booking_date, b.waybill, b.sender, b.receipient, "
              + "b.item_qty, CONCAT('-',FORMAT(b.discount_amount,2)) discount_amount, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, "
              + "CONCAT(b.total_weight,' Kgs.') total_weight, CONCAT(b.total_volume_weight,' Kgs.') total_volume_weight, "
              + "FORMAT(b.charge_amount,2) charge_amount, FORMAT(b.total_amount,2) total_amount, bd.booking_name, sum(bd.qty) qty, "
              + "CONCAT(bd.width,' CM') width, CONCAT(bd.depth,' CM') depth, CONCAT(bd.height,' CM') height, UPPER(b.payment_status) payment_status, "
              + "FORMAT(sum(bd.total_price),2) total_price, CASE WHEN b.currency_id = '1' THEN 'THB' ELSE 'USD' END AS currency, "
              + "CONCAT((CASE WHEN b.total_weight > b.total_volume_weight THEN b.total_weight ELSE b.total_volume_weight END),' Kgs.') AS chargeable, "
              + "FORMAT(vs.total,2) AS sub_total, FORMAT(b.vat_amount,2) AS vat_amount, CONCAT('Vat (', b.vat_rate, '%)') AS vat_text, FORMAT(b.grand_total_amount,2) AS grand_total_amount "
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
        // console.log("Data = ", rows);
        $scope.reportData = rows;
      });

  };

  var renderReport = function() {
    //console.log("Rander Report");
    var dfd = q.defer();
    //console.log("Rander Report2");
    $scope.pdfFile = 'shipment_'+ req.body.bookingId + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../public/output/' + $scope.pdfFile);
    //console.log("pdfFullPath = ",pdfFullPath);
    var report  = new nsReport();
    //console.log("nsReport = ",report);
    var doc = report.createDocument(require('./report/shipment.js'), $scope.reportData);
    //console.log("doc = ",doc);
    var stream = fs.createWriteStream(pdfFullPath);
    //console.log("pdfFullPath2 = ",pdfFullPath);
    doc.pipe(stream);
    doc.end();
    //console.log('1111');
    stream.on('finish', function() {
    //console.log('success');
    dfd.resolve();
    });
    stream.on('error', function() {
    //console.log('fail');
    dfd.reject();
    });
    return dfd.promise;
   };

   db.beginTransaction()
  .then(getData)
  .then(renderReport)
  .then(function() {
    res.send({
      status:true,
      data: {
        pdfFile: '/output/' + $scope.pdfFile,
        bookingId: req.body.bookingId
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

router.post('/booking_barcode', [bodyParser.json()], function(req, res) {
  console.log('print = ', req.body.bookingId);
  var $scope = {};
  $scope.reportData=[];

  var db = conn.connect();

  var getData = function() {
      console.log("Gen Report barcode")
      var sql = "SELECT DISTINCT 1 piece, b.id, b.booking_no, DATE_FORMAT(b.booking_date,'%d %b %Y') AS booking_date, b.waybill, b.sender, b.receipient, "
              + "b.item_qty, FORMAT(b.discount_amount,2) discount_amount, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, "
              + "CONCAT(bd.weight,' Kgs.') total_weight, CONCAT(bd.volume_weight,' Kgs.') total_volume_weight, "
              + "FORMAT(b.charge_amount,2) charge_amount, FORMAT(b.total_amount,2) total_amount, CONCAT(bd.booking_name,'\n',bd.package_contents) booking_name, bd.qty, "
              + "CONCAT(bd.width,' CM') width, CONCAT(bd.depth,' CM') depth, CONCAT(bd.height,' CM') height, "
              + "FORMAT(bd.total_price,2) total_price, CASE WHEN b.currency_id = '1' THEN 'THB' ELSE 'USD' END AS currency, "
              + "CONCAT((CASE WHEN b.total_weight > b.total_volume_weight THEN b.total_weight ELSE b.total_volume_weight END),' Kgs.') AS chargeable, "
              + "bi.item_no "
              + "FROM booking b INNER JOIN booking_detail bd ON b.id = bd.booking_id INNER JOIN customer c ON b.customer_id = c.id "
              + "INNER JOIN booking_item bi ON b.id = bi.booking_id AND bd.booking_name = bi.booking_name AND bd.id = bi.booking_detail_id "
              + "WHERE b.id = '" + req.body.bookingId + "' ";

      return db.query(sql,{}).then(function(rows) {
        if (rows.length===0) {
          throw 'contract.error.contract_id_not_found';
        }
        var piece = 1;
        rows.forEach(function(row){
          row.piece = piece + "/" + row.item_qty;
          $scope.reportData.push(row);
          piece += 1;
        });
        console.log("Data = ", rows);
        // $scope.reportData = rows;
      });

  };

  var renderReport = function() {
    //console.log("Rander Report");
    var dfd = q.defer();
    //console.log("Rander Report2");
    $scope.pdfFile = 'barcode_'+ req.body.bookingId + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../public/output/' + $scope.pdfFile);
    //console.log("pdfFullPath = ",pdfFullPath);
    var report  = new nsReport();
    //console.log("nsReport = ",report);
    var doc = report.createDocument(require('./report/barcode.js'), $scope.reportData);
    //console.log("doc = ",doc);
    var stream = fs.createWriteStream(pdfFullPath);
    //console.log("pdfFullPath2 = ",pdfFullPath);
    doc.pipe(stream);
    doc.end();
    //console.log('1111');
    stream.on('finish', function() {
    //console.log('success');
    dfd.resolve();
    });
    stream.on('error', function() {
    //console.log('fail');
    dfd.reject();
    });
    return dfd.promise;
   };

   db.beginTransaction()
  .then(getData)
  .then(renderReport)
  .then(function() {
    res.send({
      status:true,
      data: {
        pdfFile: '/output/' + $scope.pdfFile,
        bookingId: req.body.bookingId
      }
    })
    console.log("Test Gen Report")
  }).catch(function(e) {
    console.log(e);
    res.send({
      status:false,
      error:e
    })
  });

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////  Invoice   //////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/invoice_report', [bodyParser.json()], function(req, res) {
  console.log('print = ', req.body.bookingId);
  var $scope = {};

  var db = conn.connect();

  var getData = function() {
      console.log("Gen invoice Report")
      var sql = "SELECT t.invoice_no, b.sender, CONCAT('BOOKING NO : ',b.booking_no) booking_no, CONCAT('WAYBILL NO : ',b.waybill) waybill, "
              + "CONCAT('INVOICE DATE : ', DATE_FORMAT(t.invoice_date,'%d %b %Y')) AS invoice_date, "
              + "DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, t.qty, b.from_place, b.to_place, b.delivery_type, "
              + "td.description, SUM(td.qty) AS item_qty, FORMAT(td.total_price,2) total_price, FORMAT(SUM(td.total_price),2) AS amount, FORMAT(vsp.total,2) AS sub_total, "
              + "CONCAT('-',FORMAT(b.discount_amount,2)) discount_amount, FORMAT(b.total_amount,2) total_amount, FORMAT(b.charge_amount,2) charge_amount, "
              + "CASE WHEN b.currency_id = '1' THEN 'PRICE(THB)' WHEN b.currency_id = '2' THEN 'PRICE(USD)' END AS price_text, "
              + "CASE WHEN b.currency_id = '1' THEN 'AMOUNT(THB)' WHEN b.currency_id = '2' THEN 'AMOUNT(USD)' END AS amount_text, "
              + "FLOOR(b.grand_total_amount) AS total_amount_text, CASE WHEN b.currency_id = '1' THEN 'baht' WHEN b.currency_id = '2' THEN 'dollar' END AS unit_c, "
              + "CASE WHEN b.currency_id = '1' THEN 'satang' WHEN b.currency_id = '2' THEN 'cent' END AS unit_z, "
              + "FORMAT(b.vat_amount,2) vat_amount, FORMAT(b.grand_total_amount,2) grand_total_amount, CONCAT('Vat (', b.vat_rate, '%)') AS vat_text "
              + "FROM booking b INNER JOIN transport_invoice t ON b.id=t.booking_id INNER JOIN "
              + "transport_invoice_detail td ON t.id = td.transport_invoice_id INNER JOIN v_sumItem_price vsp ON b.id=vsp.booking_id "
              + "WHERE b.id = '" + req.body.bookingId + "' "
              + "GROUP BY b.sender, b.booking_no, b.waybill, t.invoice_date, b.pickup_date, qty, "
              + "b.from_place, b.to_place, b.delivery_type, td.description, vsp.total, b.discount_amount, b.total_amount, b.charge_amount, td.id";

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
        $scope.reportData = rows;
      });

  };

  var renderReport = function() {
    //console.log("Rander Report");
    var dfd = q.defer();
    //console.log("Rander Report2");
    $scope.pdfFile = 'invoice_'+ req.body.bookingId + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../public/output/' + $scope.pdfFile);
    //console.log("pdfFullPath = ",pdfFullPath);
    var report  = new nsReport();
    //console.log("nsReport = ",report);
    var doc = report.createDocument(require('./report/invoice.js'), $scope.reportData);
    //console.log("doc = ",doc);
    var stream = fs.createWriteStream(pdfFullPath);
    //console.log("pdfFullPath2 = ",pdfFullPath);
    doc.pipe(stream);
    doc.end();
    //console.log('1111');
    stream.on('finish', function() {
    //console.log('success');
    dfd.resolve();
    });
    stream.on('error', function() {
    //console.log('fail');
    dfd.reject();
    });
    return dfd.promise;
   };

   db.beginTransaction()
  .then(getData)
  .then(renderReport)
  .then(function() {
    res.send({
      status:true,
      data: {
        pdfFile: '/output/' + $scope.pdfFile,
        bookingId: req.body.bookingId
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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  Email Sent
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/booking_sentMail', [bodyParser.json()], function(req, res) {
// create reusable transport method (opens pool of SMTP connections)
// https://www.google.com/settings/security/lesssecureapps
console.log('print = ', req.body.bookingId);
var booking_id = req.body.bookingId;
var $scope = {};
var dataListTable = "";

var db = conn.connect();

var getData = function() {
      console.log("Gen Report")
      var sql = "SELECT DISTINCT b.id, b.booking_no, DATE_FORMAT(b.booking_date,'%d %b %Y') AS booking_date, b.waybill, b.sender, b.receipient, "
              + "b.item_qty, CONCAT('-',FORMAT(b.discount_amount,2)) discount_amount, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, "
              + "CONCAT(b.total_weight,' Kgs.') total_weight, CONCAT(b.total_volume_weight,' Kgs.') total_volume_weight, "
              + "FORMAT(b.charge_amount,2) charge_amount, FORMAT(b.total_amount,2) total_amount, p.email, "
              + "CASE WHEN b.currency_id = '1' THEN 'THB' ELSE 'USD' END AS currency, b.payment_status, "
              + "CONCAT((CASE WHEN b.total_weight > b.total_volume_weight THEN b.total_weight ELSE b.total_volume_weight END),' Kgs.') AS chargeable, "
              + "FORMAT(b.grand_total_amount,2) grand_total_amount, FORMAT(b.vat_amount,2) vat_amount, CONCAT('Vat (', b.vat_rate, '%)') AS vat_text "
              + "FROM booking b INNER JOIN booking_detail bd ON b.id = bd.booking_id INNER JOIN customer c ON b.customer_id = c.id "
              + "INNER JOIN person p ON c.person_id = p.id "
              + "WHERE b.id = '" + booking_id + "'";

      return db.query(sql,{}).then(function(rows) {
        if (rows.length===0) {
          throw 'contract.error.contract_id_not_found';
        }
        // console.log("Data = ", rows);
        $scope.emailData = rows;
      });

  };

var getDataList = function() {
    console.log("Gen Email List");
    var sql = "SELECT b.id,bd.booking_name, sum(bd.qty) qty, "
            + "CONCAT(bd.width,' CM') width, CONCAT(bd.depth,' CM') depth, CONCAT(bd.height,' CM') height, "
            + "FORMAT(sum(bd.total_price),2) total_price, CASE WHEN b.currency_id = '1' THEN 'THB' ELSE 'USD' END AS currency "
            + "FROM booking b INNER JOIN booking_detail bd ON b.id = bd.booking_id INNER JOIN customer c ON b.customer_id = c.id "
            + "WHERE b.id = '" + booking_id + "' "
            + "GROUP BY b.id, bd.width, bd.depth, bd.height, bd.booking_name, b.currency_id";
    return db.query(sql,{}).then(function(rows) {
        if (rows.length===0) {
        throw 'contract.error.contract_id_not_found';
        }
        // console.log("Data = ", rows);
        $scope.reportDataList = rows;
    });
}

var doDataTable = function(){
    console.log("doDataTable = ", $scope.reportDataList);

    for(var i = 0; i < $scope.reportDataList.length; i++){
        dataListTable += "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'>" + $scope.reportDataList[i].booking_name + "</td>"+
                            "<td style='width:55px; text-align: center;'>" + $scope.reportDataList[i].qty + "</td>"+
                            "<td style='width:55px; text-align: right;'>" + $scope.reportDataList[i].width + "</td>"+
                            "<td style='width:55px; text-align: right;'>" + $scope.reportDataList[i].depth + "</td>"+
                            "<td style='width:55px; text-align: right;'>" + $scope.reportDataList[i].height + "</td>"+
                            "<td style='width:55px; text-align: right;'>" + $scope.reportDataList[i].total_price + "</td>"+
                            "<td style='width:45px; text-align: right;'>" + $scope.reportDataList[i].currency + "</td>"+
                        "</tr>"
    }
    return true;
}

var renderEmail = function(){
    console.log("Email Data = ", $scope.emailData[0]);
    console.log("Html = ", dataListTable);
    //return true;
    console.log("Sent Email");
    var emailData = $scope.emailData[0];
    // console.log("emailData = ", emailData);
    var smtpTransport = nodemailer.createTransport('smtps://test.onex.nippon%40gmail.com:p@ssw0rd3@smtp.gmail.com');

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Onex <test.onex.nippon@gmail.com>", // sender address
        to: $scope.emailData[0].email, // list of receivers
        subject: "Logistic One :: Shipment Confirmation Booking no. " + emailData.booking_no, // Subject line
        //text: "Hello world", // plaintext body
        html: "<div style='width:590px;min-height:842px;position:relative; font-family: Arial; margin:auto;'>"+
                    "</br>"+
                    "<table style='width:590px;'>"+
                        "<tr style='height:30px; text-align:right; font-size: 18px;'>"+
                            "<th colspan='4'>BOOKING CONFIRMATION</th>"+
                        "</tr>"+
                        "<tr style='text-align: right; font-size: 13px;'>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:35%'><b>WAYBILL NUMBER:</b></td>"+
                            "<td style='width:15%'>" + emailData.waybill + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: right; font-size: 13px;'>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:35%'><b>BOOKING NO:</b></td>"+
                            "<td style='width:15%'>" + emailData.booking_no + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: right; font-size: 13px;'>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:35%'><b>DATE OF SHIPMENT:</b></td>"+
                            "<td style='width:15%'>" + emailData.pickup_date + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: right; font-size: 13px;'>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:35%'><b>DATE OF BOOKING:</b></td>"+
                            "<td style='width:15%'>" + emailData.booking_date + "</td>"+
                        "</tr>"+
                    "</table>"+
                    "<div style='clear: both;'></div>"+
                    "<div style='width:590px; height:2px; border-bottom:solid 1px;'>"+
                    "</div>"+
                    "<div style='clear: both;'></div>"+
                    "</br>"+
                    "<table style='width:590px;'>"+
                        "<tr style='text-align: left; font-size: 12px;'>"+
                            "<td style='width:110px; vertical-align:top;'><b>Sender</b></td>"+
                            "<td style='width:185px;'>" + emailData.sender + "</td>"+
                            "<td style='width:110px; vertical-align:top;'><b>Receipient</b></td>"+
                            "<td style='width:185px'>" + emailData.receipient + "</td>"+
                        "</tr>"+
                    "</table>"+
                    "<div style='clear: both;'></div>"+
                    "</br>"+
                    "<div style='width:590px; height:16px; background-color:lightgray; font-size:12px; padding-top:2px'>"+
                        "<b>Shipment Detail</b>"+
                    "</div>"+
                    "<table style='width:590px;'>"+
                        "<tr style='text-align: left; font-size: 12px;'>"+
                            "<td style='width:110px;'><b>Shipment Date</b></td>"+
                            "<td style='width:185px;'>" + emailData.pickup_date + "</td>"+
                            "<td style='width:110px;'><b>Number of Pieces</b></td>"+
                            "<td style='width:15'>" + emailData.item_qty + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: left; font-size: 12px;'>"+
                            "<td style='width:110px;'><b>Waybill Number</b></td>"+
                            "<td style='width:185px;'>" + emailData.waybill + "</td>"+
                            "<td style='width:110px;'><b>Gross Weight</b></td>"+
                            "<td style='width:185px'>" + emailData.total_weight + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: left; font-size: 12px;'>"+
                            "<td style='width:110px;'></td>"+
                            "<td style='width:185px;'></td>"+
                            "<td style='width:110px;'><b>Volumn Weight</b></td>"+
                            "<td style='width:185px'>" + emailData.total_volume_weight + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: left; font-size: 12px;'>"+
                            "<td style='width:110px;'></td>"+
                            "<td style='width:185px;'></td>"+
                            "<td style='width:110px;'><b>Chargeable Weight</b></td>"+
                            "<td style='width:185px'>" + emailData.chargeable + "</td>"+
                        "</tr>"+
                    "</table>"+
                    "<div style='width:590px; height:16px;font-size:12px; padding-top:2px'>"+
                        "<b>Fare</b>"+
                    "</div>"+
                    "<table style=width:590px; text-align: center; border-bottom:solid 1px;'>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'></td>"+
                            "<td style='width:55px;'>Quantity</td>"+
                            "<td style='width:55px;'>Width</td>"+
                            "<td style='width:55px;'>Depth</td>"+
                            "<td style='width:55px;'>Height</td>"+
                            "<td style='width:55px;'>Total</td>"+
                            "<td style='width:45px;'></td>"+
                        "</tr>"+
                    "</table>"+
                    "<table style='width:590px;'>"+
                        dataListTable +
                    "</table>"+
                    "<table style='width:590px; border-top:solid 1px;'>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'>Discount</td>"+
                            "<td style='width:55px; text-align: center;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'>" + emailData.discount_amount + "</td>"+
                            "<td style='width:45px; text-align: right;'>USD</td>"+
                        "</tr>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'>Surcharge</td>"+
                            "<td style='width:55px; text-align: center;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'>" + emailData.charge_amount + "</td>"+
                            "<td style='width:45px; text-align: right;'>USD</td>"+
                        "</tr>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'>" + emailData.vat_text + "</td>"+
                            "<td style='width:55px; text-align: center;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'>" + emailData.vat_amount + "</td>"+
                            "<td style='width:45px; text-align: right;'>USD</td>"+
                        "</tr>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'><b>Grand Total</b></td>"+
                            "<td style='width:55px; text-align: center;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'><b>" + emailData.grand_total_amount + "</b></td>"+
                            "<td style='width:45px; text-align: right;'><b>USD</b></td>"+
                        "</tr>"+
                    "</table>"+
                    "</br>"+
                    "<div style='width:590px; height:16px; background-color:lightgray; font-size:12px; padding-top:2px'>"+
                        "<b>Payment Information</b>"+
                    "</div>"+
                    "</br>"+
                    "<table style='width:590px; border-bottom:solid 1px;'>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:100px;'><b> "+ emailData.payment_status + "</b></td>"+
                        "</tr>"+
                    "</table>"+
                    "</br>"+
                    "<table style='width:590px;'>"+
                        "<tr style='font-size: 9px;'>"+
                            "<td style='width:590px;'>"+
                                "Reference information</br>"+
                                "Pick up booking referencee: 134370</br>"+
                                "Discription of contents: Form FTA & Copy of Bill of Lading : CI-2119-007,CI-2118-026,CI-2117-130</br>"+
                            "</td>"+
                    " </tr>"+
                    "</table>"+
                "</div>",
        attachments: [
            {
                //path: './dist/public/output/shipment_'+booking_id+'.pdf'
                //$scope.pdfFile = 'shipment_'+ req.body.bookingId + '.pdf';
                path: path.normalize(__dirname + '/../../public/output/' + 'shipment_'+ booking_id+'.pdf')
            },
            {
                //path: './dist/public/output/invoice_'+booking_id+'.pdf'
                path: path.normalize(__dirname + '/../../public/output/' + 'invoice_'+ booking_id+'.pdf')
            },
            {
                //path: './dist/public/output/barcode_'+booking_id+'.pdf'
                path: path.normalize(__dirname + '/../../public/output/' + 'barcode_'+ booking_id+'.pdf')
            }
        ]
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}


 db.beginTransaction()
  .then(getData)
  .then(getDataList)
  .then(doDataTable)
  .then(renderEmail)
  .then(function() {
    res.send({
      status:true,
      data: {
        bookingId: req.body.bookingId
      }
    })
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  });


});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// sentDocToEmail ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/sentDocToEmail', [bodyParser.json()], function(req, res) {
// create reusable transport method (opens pool of SMTP connections)
// https://www.google.com/settings/security/lesssecureapps
console.log('print = ', req.body.booking_id);
var booking_id = req.body.booking_id;
var $scope = {};
var dataListTable = "";

var db = conn.connect();

var getData = function() {
      console.log("Gen Report")
      var sql = "SELECT DISTINCT b.id, b.booking_no, DATE_FORMAT(b.booking_date,'%d %b %Y') AS booking_date, b.waybill, b.sender, b.receipient, "
              + "b.item_qty, CONCAT('-',FORMAT(b.discount_amount,2)) discount_amount, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, "
              + "CONCAT(b.total_weight,' Kgs.') total_weight, CONCAT(b.total_volume_weight,' Kgs.') total_volume_weight, "
              + "FORMAT(b.charge_amount,2) charge_amount, FORMAT(b.total_amount,2) total_amount, p.email, "
              + "CASE WHEN b.currency_id = '1' THEN 'THB' ELSE 'USD' END AS currency, b.payment_status, "
              + "CONCAT((CASE WHEN b.total_weight > b.total_volume_weight THEN b.total_weight ELSE b.total_volume_weight END),' Kgs.') AS chargeable, "
              + "FORMAT(b.grand_total_amount,2) grand_total_amount, FORMAT(b.vat_amount,2) vat_amount, CONCAT('Vat (', b.vat_rate, '%)') AS vat_text "
              + "FROM booking b INNER JOIN booking_detail bd ON b.id = bd.booking_id INNER JOIN customer c ON b.customer_id = c.id "
              + "INNER JOIN person p ON c.person_id = p.id "
              + "WHERE b.id = '" + booking_id + "'";

      return db.query(sql,{}).then(function(rows) {
        if (rows.length===0) {
          throw 'contract.error.contract_id_not_found';
        }
        // console.log("Data = ", rows);
        $scope.emailData = rows;
      });

  };

var getDataList = function() {
    console.log("Gen Email List");
    var sql = "SELECT b.id,bd.booking_name, sum(bd.qty) qty, "
            + "CONCAT(bd.width,' CM') width, CONCAT(bd.depth,' CM') depth, CONCAT(bd.height,' CM') height, "
            + "FORMAT(sum(bd.total_price),2) total_price, CASE WHEN b.currency_id = '1' THEN 'THB' ELSE 'USD' END AS currency "
            + "FROM booking b INNER JOIN booking_detail bd ON b.id = bd.booking_id INNER JOIN customer c ON b.customer_id = c.id "
            + "WHERE b.id = '" + booking_id + "' "
            + "GROUP BY b.id, bd.width, bd.depth, bd.height, bd.booking_name, b.currency_id";
    return db.query(sql,{}).then(function(rows) {
        if (rows.length===0) {
        throw 'contract.error.contract_id_not_found';
        }
        // console.log("Data = ", rows);
        $scope.reportDataList = rows;
    });
}

var doDataTable = function(){
    console.log("doDataTable = ", $scope.reportDataList);

    for(var i = 0; i < $scope.reportDataList.length; i++){
        dataListTable += "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'>" + $scope.reportDataList[i].booking_name + "</td>"+
                            "<td style='width:55px; text-align: center;'>" + $scope.reportDataList[i].qty + "</td>"+
                            "<td style='width:55px; text-align: right;'>" + $scope.reportDataList[i].width + "</td>"+
                            "<td style='width:55px; text-align: right;'>" + $scope.reportDataList[i].depth + "</td>"+
                            "<td style='width:55px; text-align: right;'>" + $scope.reportDataList[i].height + "</td>"+
                            "<td style='width:55px; text-align: right;'>" + $scope.reportDataList[i].total_price + "</td>"+
                            "<td style='width:45px; text-align: right;'>" + $scope.reportDataList[i].currency + "</td>"+
                        "</tr>"
    }
    return true;
}

var renderEmail = function(){
    console.log("Email Data = ", $scope.emailData[0]);
    console.log("Html = ", dataListTable);
    //return true;
    console.log("Sent Email");
    var emailData = $scope.emailData[0];
    //var booking_id = 98;
    var smtpTransport = nodemailer.createTransport('smtps://test.onex.nippon%40gmail.com:p@ssw0rd3@smtp.gmail.com');

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Onex <test.onex.nippon@gmail.com>", // sender address
        to: req.body.email, // list of receivers
        subject: "Logistic One :: Shipment Confirmation Booking no. " + emailData.booking_no, // Subject line
        //text: "Hello world", // plaintext body
        html: "<div style='width:590px;min-height:842px;position:relative; font-family: Arial; margin:auto;'>"+
                    "</br>"+
                    "<table style='width:590px;'>"+
                        "<tr style='height:30px; text-align:right; font-size: 18px;'>"+
                            "<th colspan='4'>BOOKING CONFIRMATION</th>"+
                        "</tr>"+
                        "<tr style='text-align: right; font-size: 13px;'>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:35%'><b>WAYBILL NUMBER:</b></td>"+
                            "<td style='width:15%'>" + emailData.waybill + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: right; font-size: 13px;'>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:35%'><b>BOOKING NO:</b></td>"+
                            "<td style='width:15%'>" + emailData.booking_no + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: right; font-size: 13px;'>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:35%'><b>DATE OF SHIPMENT:</b></td>"+
                            "<td style='width:15%'>" + emailData.pickup_date + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: right; font-size: 13px;'>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:25%'></td>"+
                            "<td style='width:35%'><b>DATE OF BOOKING:</b></td>"+
                            "<td style='width:15%'>" + emailData.booking_date + "</td>"+
                        "</tr>"+
                    "</table>"+
                    "<div style='clear: both;'></div>"+
                    "<div style='width:590px; height:2px; border-bottom:solid 1px;'>"+
                    "</div>"+
                    "<div style='clear: both;'></div>"+
                    "</br>"+
                    "<table style='width:590px;'>"+
                        "<tr style='text-align: left; font-size: 12px;'>"+
                            "<td style='width:110px; vertical-align:top;'><b>Sender</b></td>"+
                            "<td style='width:185px;'>" + emailData.sender + "</td>"+
                            "<td style='width:110px; vertical-align:top;'><b>Recipient</b></td>"+
                            "<td style='width:185px'>" + emailData.receipient + "</td>"+
                        "</tr>"+
                    "</table>"+
                    "<div style='clear: both;'></div>"+
                    "</br>"+
                    "<div style='width:590px; height:16px; background-color:lightgray; font-size:12px; padding-top:2px'>"+
                        "<b>Shipment Detail</b>"+
                    "</div>"+
                    "<table style='width:590px;'>"+
                        "<tr style='text-align: left; font-size: 12px;'>"+
                            "<td style='width:110px;'><b>Shipment Date</b></td>"+
                            "<td style='width:185px;'>" + emailData.pickup_date + "</td>"+
                            "<td style='width:110px;'><b>Number of Pieces</b></td>"+
                            "<td style='width:15'>" + emailData.item_qty + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: left; font-size: 12px;'>"+
                            "<td style='width:110px;'><b>Waybill Number</b></td>"+
                            "<td style='width:185px;'>" + emailData.waybill + "</td>"+
                            "<td style='width:110px;'><b>Gross Weight</b></td>"+
                            "<td style='width:185px'>" + emailData.total_weight + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: left; font-size: 12px;'>"+
                            "<td style='width:110px;'></td>"+
                            "<td style='width:185px;'></td>"+
                            "<td style='width:110px;'><b>Volumn Weight</b></td>"+
                            "<td style='width:185px'>" + emailData.total_volume_weight + "</td>"+
                        "</tr>"+
                        "<tr style='text-align: left; font-size: 12px;'>"+
                            "<td style='width:110px;'></td>"+
                            "<td style='width:185px;'></td>"+
                            "<td style='width:110px;'><b>Chargeable Weight</b></td>"+
                            "<td style='width:185px'>" + emailData.chargeable + "</td>"+
                        "</tr>"+
                    "</table>"+
                    "<div style='width:590px; height:16px;font-size:12px; padding-top:2px'>"+
                        "<b>Fare</b>"+
                    "</div>"+
                    "<table style=width:590px; text-align: center; border-bottom:solid 1px;'>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'></td>"+
                            "<td style='width:55px;'>Quantity</td>"+
                            "<td style='width:55px;'>Width</td>"+
                            "<td style='width:55px;'>Depth</td>"+
                            "<td style='width:55px;'>Height</td>"+
                            "<td style='width:55px;'>Total</td>"+
                            "<td style='width:45px;'></td>"+
                        "</tr>"+
                    "</table>"+
                    "<table style='width:590px;'>"+
                        dataListTable +
                    "</table>"+
                    "<table style='width:590px; border-top:solid 1px;'>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'>Discount</td>"+
                            "<td style='width:55px; text-align: center;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'>" + emailData.discount_amount + "</td>"+
                            "<td style='width:45px; text-align: right;'>USD</td>"+
                        "</tr>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'>Surcharge</td>"+
                            "<td style='width:55px; text-align: center;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'>" + emailData.charge_amount + "</td>"+
                            "<td style='width:45px; text-align: right;'>USD</td>"+
                        "</tr>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'>" + emailData.vat_text + "</td>"+
                            "<td style='width:55px; text-align: center;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'>" + emailData.vat_amount + "</td>"+
                            "<td style='width:45px; text-align: right;'>USD</td>"+
                        "</tr>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:270px;'><b>Grand Total</b></td>"+
                            "<td style='width:55px; text-align: center;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'></td>"+
                            "<td style='width:55px; text-align: right;'><b>" + emailData.grand_total_amount + "</b></td>"+
                            "<td style='width:45px; text-align: right;'><b>USD</b></td>"+
                        "</tr>"+
                    "</table>"+
                    "</br>"+
                    "<div style='width:590px; height:16px; background-color:lightgray; font-size:12px; padding-top:2px'>"+
                        "<b>Payment Information</b>"+
                    "</div>"+
                    "</br>"+
                    "<table style='width:590px; border-bottom:solid 1px;'>"+
                        "<tr style='font-size: 12px;'>"+
                            "<td style='width:100px;'><b> "+ emailData.payment_status + "</b></td>"+
                        "</tr>"+
                    "</table>"+
                    "</br>"+
                    "<table style='width:590px;'>"+
                        "<tr style='font-size: 9px;'>"+
                            "<td style='width:590px;'>"+
                                "Reference information</br>"+
                                "Pick up booking referencee: 134370</br>"+
                                "Discription of contents: Form FTA & Copy of Bill of Lading : CI-2119-007,CI-2118-026,CI-2117-130</br>"+
                            "</td>"+
                    " </tr>"+
                    "</table>"+
                "</div>",
        attachments: [
            {
                //path: './dist/public/output/shipment_'+booking_id+'.pdf'
                //$scope.pdfFile = 'shipment_'+ req.body.bookingId + '.pdf';
                path: path.normalize(__dirname + '/../../public/output/' + 'shipment_'+ booking_id+'.pdf')
            },
            {
                //path: './dist/public/output/invoice_'+booking_id+'.pdf'
                path: path.normalize(__dirname + '/../../public/output/' + 'invoice_'+ booking_id+'.pdf')
            },
            {
                //path: './dist/public/output/barcode_'+booking_id+'.pdf'
                path: path.normalize(__dirname + '/../../public/output/' + 'barcode_'+ booking_id+'.pdf')
            }
        ]
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}


 db.beginTransaction()
  .then(getData)
  .then(getDataList)
  .then(doDataTable)
  .then(renderEmail)
  .then(function() {
    res.send({
      status:true,
      data: {
        bookingId: req.body.booking_id,
        rs: "Sent Email complete."
      }
    })
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  });


});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////  List fare zone ////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/list_farezone', function(req, res) {
  var db = conn.connect();
  var sql = "SELECT * FROM excel_zone";
  db.query(sql, {}).then(function(data){
    res.send({ status:true, data: data });
  }).catch(function(e){
    res.send({ status:false, error: e });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////  List fare rate //////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/list_farerate', function(req, res) {
  var db = conn.connect();
  var sql = "SELECT * FROM excel_rate";
  db.query(sql, {}).then(function(data){
    res.send({ status:true, data: data });
  }).catch(function(e){
    res.send({ status:false, error: e });
  });
});

////////////////////////////////////////////////////////////////////////////////
///////  getPersonType   ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/getPersonType', [bodyParser.json()], function(req, res) {
  console.log("getPersonType = ", req.body);
  var $scope = {};
  var db = conn.connect();
  var getType = function() {
    var sql = "SELECT `type` FROM person where id =:person_id"

    return db.query(sql, req.body).then(function(rows) {
      if (rows.length > 0) {
        $scope.person_type = rows[0];
        console.log("data = ", $scope.person_type);
      } else {
        $scope.person_type = "x";
      }
    });
  }

  q.all([
    getType()
  ]).then(function() {
    res.send({
      status:true,
      person_type: $scope.person_type
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  })
});


////////////////////////////////////////////////////////////////////////////////
/////////       getPickUptime   ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

router.post('/getPickUptime', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  console.log("Server getPickUptime");
  q.all([
    (function() {
      var query = "SELECT DISTINCT pickup_time AS value, pickup_time AS text FROM pickup_time ";
      return db.query(query).then(function(rows) {
          $scope.pickUpTime = rows;
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { pickupTime: $scope.pickUpTime } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});

////////////////////////////////////////////////////////////////////////////////
////////////////  getCompanyProfile   //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/getCompanyProfile', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  console.log("Server getCompanyProfile");
  q.all([
    (function() {
      var query = "SELECT * FROM company_profile";
      return db.query(query).then(function(rows) {
          $scope.conpany_profile = rows;
        });
    })()
  ]).then(function() {
    res.send({
      status:true,
      data: {
        conpany_profile: $scope.conpany_profile
      }
    });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});

////////////////////////////////////////////////////////////////////////////////
///////////////   exportWaitClearCreditCard   //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/exportWaitClearCreditCard',[bodyParser.json()], function(req, res){
  console.log("come to export.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "case b.payment_status when 'paid' then 'PAID' when 'pending' then 'PENDING' else 'UNPAID' end as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'WAIT_CLEAR_CREDIT_CARD' ";

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
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status') {
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
        var buffer = xlsx.build([{name: "ListWaitCrearCredit_", data: rows}]);
      } catch (e) {
        console.log('ERROR=', e);
      }
      var id = helper.newUUID();
      var fname = '/output/waitcrearcredit_'+id+'.xlsx';
      try {
        fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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
///////////////   exportWaitAssign   ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/exportWaitAssign',[bodyParser.json()], function(req, res){
  console.log("come to export.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "case b.payment_status when 'paid' then 'PAID' when 'pending' then 'PENDING' else 'UNPAID' end as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'WAIT_ASSIGN' ";

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
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status') {
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
        var buffer = xlsx.build([{name: "ListWaitAssign_", data: rows}]);
      } catch (e) {
        console.log('ERROR=', e);
      }
      var id = helper.newUUID();
      var fname = '/output/waitassign_'+id+'.xlsx';
      try {
        fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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
///////////////   exportInprocess   ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/exportInprocess',[bodyParser.json()], function(req, res){
  console.log("come to export.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "case b.payment_status when 'paid' then 'PAID' when 'pending' then 'PENDING' else 'UNPAID' end as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'INPROCESS' ";

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
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status') {
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
        var buffer = xlsx.build([{name: "ListInProcess_", data: rows}]);
      } catch (e) {
        console.log('ERROR=', e);
      }
      var id = helper.newUUID();
      var fname = '/output/inprocess_'+id+'.xlsx';
      try {
        fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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
///////////////   exportInprocess   ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/exportInTransit',[bodyParser.json()], function(req, res){
  console.log("come to export.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "case b.payment_status when 'paid' then 'PAID' when 'pending' then 'PENDING' else 'UNPAID' end as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'INTRANSIT' ";

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
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status') {
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
        var buffer = xlsx.build([{name: "ListInTransit_", data: rows}]);
      } catch (e) {
        console.log('ERROR=', e);
      }
      var id = helper.newUUID();
      var fname = '/output/intransit_'+id+'.xlsx';
      try {
        fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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
///////////////   exportArrived   ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/exportArrived',[bodyParser.json()], function(req, res){
  console.log("come to export.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "case b.payment_status when 'paid' then 'PAID' when 'pending' then 'PENDING' else 'UNPAID' end as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'ARRIVED' ";

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
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status') {
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
        var buffer = xlsx.build([{name: "ListInTransit_", data: rows}]);
      } catch (e) {
        console.log('ERROR=', e);
      }
      var id = helper.newUUID();
      var fname = '/output/arrived_'+id+'.xlsx';
      try {
        fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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

////////////////////////////////////////////////////////////////////////////////
///////////////   exportDelivered   ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/exportDelivered',[bodyParser.json()], function(req, res){
  console.log("come to export.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "case b.payment_status when 'paid' then 'PAID' when 'pending' then 'PENDING' else 'UNPAID' end as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'DELIVERIED' ";

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
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status') {
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
        var buffer = xlsx.build([{name: "ListInTransit_", data: rows}]);
      } catch (e) {
        console.log('ERROR=', e);
      }
      var id = helper.newUUID();
      var fname = '/output/delivered_'+id+'.xlsx';
      try {
        fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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
///////        exportException        //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/exportException',[bodyParser.json()], function(req, res){
  console.log("come to export.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "case b.payment_status when 'paid' then 'PAID' when 'pending' then 'PENDING' else 'UNPAID' end as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'EXCEPTION' ";

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
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status') {
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
        var buffer = xlsx.build([{name: "ListInTransit_", data: rows}]);
      } catch (e) {
        console.log('ERROR=', e);
      }
      var id = helper.newUUID();
      var fname = '/output/exceotion_'+id+'.xlsx';
      try {
        fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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
////////////////////   exportCancel   //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
router.post('/exportCancel',[bodyParser.json()], function(req, res){
  console.log("come to export.");
  var db = conn.connect();
  var $scope = {};

  var mainQuery = "SELECT b.id, b.booking_no, CONCAT(p.firstname,' ',p.lastname) customer_name, "
                + "b.pickup_place, DATE_FORMAT(b.pickup_date,'%d %b %Y') AS pickup_date, p.type, "
                + "b.deliveried_date, DATE_FORMAT(b.booking_date,'%d %b %Y %T') AS booking_date, "
                + "case b.payment_status when 'paid' then 'PAID' when 'pending' then 'PENDING' else 'UNPAID' end as payment_status "
                + "FROM booking b INNER JOIN customer c ON b.customer_id = c.id INNER JOIN person p ON c.person_id = p.id "
                + "WHERE status = 'CANCEL' ";

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
        fld=='deliveried_date' || fld == 'booking_date' || fld == 'payment_status') {
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
        var buffer = xlsx.build([{name: "ListInTransit_", data: rows}]);
      } catch (e) {
        console.log('ERROR=', e);
      }
      var id = helper.newUUID();
      var fname = '/output/cancel_'+id+'.xlsx';
      try {
        fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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
