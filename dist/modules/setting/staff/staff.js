var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var fs          = require('fs');
var xlsx        = require('node-xlsx');

var oraConn          = require('../../../lib/oracle');
var conn          = require('../../../lib/db');
var router      = express.Router();
var helper      = require('../../../lib/helper');

var fields = {
  user:{name:'s.user'},
  display_name:{name:'s.display_name'},
  department:{name:'d.id',type:'number'},
  shop:{name:'sh.id',type:'number'},
  last_login:{name:'s.last_login',type:'daterange'}
};

router.post('/list', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var mainQuery = 'SELECT s.*, ' +
        'concat(sh.code, \' \', sh.name) AS shop, ' +
        'concat(d.code, \' \', d.name) AS department ' +
        'FROM staff s ' +
        'LEFT JOIN department d ON s.department_id=d.id ' +
        'LEFT JOIN shop sh ON s.shop_id=sh.id ' +
        'WHERE s.id > 0  ';

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
    if (typeof fields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(fields[fld], keyword);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='department' || fld=='shop') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  console.log(mainQuery);

  var getCount = function() {
    var sql = 'SELECT COUNT(*) AS cnt FROM staff s WHERE s.id > 0  ';
    if (hasJoin) {
      sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x';
    } else if (cond.length > 0) {
      sql += ' AND ' + cond.join(' AND ');
    }

    return db.queryArray(sql).then(function(rows) {
      $scope.totalRows = rows.d[0][0];
    });
  }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'user';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0,
    };

    if (sortBy=='department') {
      sortBy = 'd.code';
    } else if (sortBy=='shop') {
      sortBy = 'sh.code';
    } else {
      sortBy = 's.`' + sortBy + '`';
    }


    var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;

    return db.queryArray(sql, {}).then(function(rows) {
      $scope.rows = rows;
    });
  };

  ////////////////////////////////////////////////////
  // MAIN
  ////////////////////////////////////////////////////
  q.all([
    getCount(),
    getRows()
  ]).then(function() {
    $scope.opt.totalRows = $scope.totalRows;
    res.send({
      status: true,
      data: $scope.rows,
      opt: $scope.opt
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/export', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var mainQuery = 'SELECT s.id, s.user, s.nickname, s.display_name, s.email, '
    + 's.mobile, s.suffix_barcode, s.commission_pct, s.last_login, s.last_ip, '
    + 's.is_admin, s.is_active, s.created_at, s.created_by, s.updated_at, '
    + 's.updated_by, s.zdepartment_name, '
    + 'concat(sh.code, \' \', sh.name) AS shop, '
    + 'concat(d.code, \' \', d.name) AS department '
    + 'FROM staff s '
    + 'LEFT JOIN department d ON s.department_id=d.id '
    + 'LEFT JOIN shop sh ON s.shop_id=sh.id '
    + 'WHERE s.id > 0 ';

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
    if (typeof fields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(fields[fld], keyword);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='department' || fld=='shop') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  console.log(mainQuery);

  var getRows = function() {
    var sortBy = req.body.sortBy || 'user';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0,
    };

    if (sortBy=='department') {
      sortBy = 'd.code';
    } else if (sortBy=='shop') {
      sortBy = 'sh.code';
    } else {
      sortBy = 's.`' + sortBy + '`';
    }

    var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir;

    return db.queryArray(sql, {}).then(function(rows) {
      $scope.rows = rows;
    });
  };

  ////////////////////////////////////////////////////
  // MAIN
  ////////////////////////////////////////////////////
  getRows().then(function() {
    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    try {
      var buffer = xlsx.build([{name: "ListStaff", data: rows}]);
    } catch (e) {
      console.log('ERROR=', e);
    }
    var id = helper.newUUID();
    var fname = '/output/staff_'+id+'.xlsx';
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


router.post('/facetList', function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var getDepartment = function() {
    var sql = "SELECT id value, CONCAT(code, ' ', name) text FROM department "
      + "WHERE is_active='YES' ORDER BY code";
    return db.queryArray(sql).then(function(rows) {
      $scope.department = rows;
    });
  };

  var getShop = function() {
    var sql = "SELECT id value, CONCAT(code, ' ', name) text FROM shop "
      + "WHERE is_active='YES' ORDER BY code";
    return db.queryArray(sql).then(function(rows) {
      $scope.shop = rows;
    });
  };

  q.all([
    getDepartment(),
    getShop()
  ]).then(function() {
    res.send({
      status: true,
      data: {
        department: $scope.department,
        shop: $scope.shop
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/getById', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  db.query('SELECT * FROM staff WHERE id=:id', {id:req.body.id}).then(function(rows){
    if (rows.length==0) {
      throw 'staff.error.not_found';
    }
    res.send({
      status: true,
      data: rows[0]
    });
  }).catch(function(e) {
    res.send({
      status: false,
      msg: e
    });
  });
});

router.post('/facetEdit', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var getShop = function() {
    return db.queryArray("SELECT id AS value, concat(code, ' ', name) AS text FROM shop WHERE is_active='YES' ORDER BY code")
      .then(function(rows) {
        $scope.shop = rows;
      });
  }

  var getDepartment = function() {
    return db.queryArray("SELECT id AS value, concat(code, ' ', name) AS text FROM department WHERE is_active='YES' ORDER BY code")
      .then(function(rows) {
        $scope.department = rows;
      });
  }

  q.all([
    getShop(),
    getDepartment()
  ]).then(function() {
    res.send({
      status:true,
      data: {
        shop: $scope.shop,
        department: $scope.department
      }
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  })
});

router.post('/save', [bodyParser.json()], function(req, res) {

  oraConn.connect().then(function(oradb) {
  // validate
  var error = [];
  var data = req.body.data;
  data.id = parseInt(data.id || 0);

  data.created_by = req.session.data.staff.id;
  data.updated_by = req.session.data.staff.id;

  if (data.nickname == '') {
    error.push('staff.error.nickname_empty');
  }

  if (data.display_name == '') {
    error.push('staff.error.display_name_empty');
  }

  if (data.department_id == 0) {
    error.push('staff.error.department_empty');
  }
  if (data.shop_id == 0) {
    error.push('staff.error.branch_empty');
  }

  if (data.id == 0) {
    if (data.pass == '') {
      error.push('staff.error.pass_empty');
    } else {
      if (data.pass != data.pass2) {
        error.push('staff.error.pass_mismatch');
      }
    }
  }
  console.log('error:',error);
  if (error.length > 0) {
    res.send({
      status:false,
      error: error
    });
    return;
  }

  var checkDup = function() {
    var sql = "SELECT 1 AS cnt FROM staff WHERE user=:user AND id <> :id";
    return db.query(sql, {user:data.user, id:data.id})
      .then(function(rows) {
        if (rows.length > 0) {
          throw 'error.duplicate';
        }
      });
  }
  var getNextId = function() {
    var sql = "SELECT IFNULL(MAX(suffix_barcode+0), 0) + 1 AS next_barcode "
      + "FROM staff WHERE suffix_barcode+0<9000";
    return db.query(sql, data).then(function(rows) {
      data.suffix_barcode = ('0000' + parseInt(rows[0].next_barcode)).substr(-4);
      data.user = ('0000' + parseInt(rows[0].next_barcode)).substr(-4);
    });
  }

  var insertData = function() {
    data.pass2 = data.pass;
    data.pass = helper.md5('ss2015' + data.user + data.pass);

    var sql = "INSERT INTO staff (user, pass, pass2, nickname, display_name, "
      + "email, mobile, department_id, shop_id, is_admin, is_active, "
      + "suffix_barcode,created_by)"
      + " VALUES (:user, :pass, :pass2, :nickname, :display_name, "
      + ":email, :mobile, :department_id, :shop_id, 'NO', :is_active, "
      + ":suffix_barcode,:created_by)";

  //    console.log(sql,data);
//  console.log('staffID:', req.session.data.staff.id);
    return db.query(sql, data).then(function(result) {
    //  console.log(result);
      data.id = result.insertId;
    });
  }

  var insertDataOracle = function(shop_id,barcode,mainShop) {
    var sql = " insert into staff (id,barcode,nickname,fullname,shop_id,passwd,active,mysqlviewstaffid,mysqlviewshopid,main_shop) "
            + " values (staff_id.nextval,:barcode,:nickname,:fullname,(select id from shop where mysqlshopid = :shop_id),:passwd,decode(:active,'YES','Y','N'),:staffid,:shop_id,:mainShop)"
            //console.log('barcode:',barcode);
    return oraConn.query(oradb, sql,{barcode:barcode,nickname:data.nickname,fullname:data.display_name,passwd:data.pass2,active:data.is_active,staffid:data.id,shop_id:shop_id,mainShop:mainShop},true);
  }

  var getShop = function() {
    var sql = " select id,substring(prefix_barcode,2,2) prefix_barcode from shop where is_active = 'YES'"
    return db.query(sql);
  }

  var InsStaff = function(row){
    var all = [];
    for (var i = 0; i < row.length; i++) {
        var user = row[i].prefix_barcode + data.user;
        var mainShop = 'N';
      //  console.log(user);
        if (row[i].id == data.shop_id) {
          mainShop = 'Y';
        }else{
          mainShop = 'N';
        }
        all.push(insertDataOracle(row[i].id,user,mainShop));
      }
      return q.all(all);

  }

  var updateData = function() {
    var sql = "UPDATE staff SET user=:user, nickname=:nickname, "
      + "display_name=:display_name, email=:email, mobile=:mobile, "
      + "updated_by=:updated_by, "
      + "department_id=:department_id, shop_id=:shop_id,is_active=:is_active WHERE id=:id";


      //  console.log('staffID:', req.session.data.staff.id,data);
    return db.query(sql, data);
  }

  var updateDataOracle = function(){
    var sql = " update staff set nickname=:nickname,fullname=:display_name,active=decode(:is_active,'YES','Y','N')"
            + " ,main_shop = decode(mysqlviewshopid,:shop_id,'Y','N') where mysqlviewstaffid = :id";
            //console.log('Ora:',data,sql);
      return oraConn.query(oradb, sql,{nickname:data.nickname,display_name:data.display_name,is_active:data.is_active,shop_id:data.shop_id,id:data.id},true);
  }

  //////////////////////////////////////
  // MAiN
  //////////////////////////////////////
  var db = conn.connect();

    db.beginTransaction()
      .then(checkDup)
      .then(function() {
        var all = [];
        if (data.id==0) {
          return getNextId().then(insertData).then(getShop).then(InsStaff);
        }
        return updateData().then(updateDataOracle);
      }).then(function() {

        db.commit();
        oraConn.close(oradb);
        res.send({
          status:true,
          id:data.id,
          user:data.user
        });
      }).catch(function(e) {
        console.log(e);
        db.rollback();
        oraConn.close(oradb);
        res.send({
          status:false,
          error:e
        });
      });
    });
});


module.exports = router;
