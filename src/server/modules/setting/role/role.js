var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var fs          = require('fs');
var xlsx        = require('node-xlsx');

var conn          = require('../../../lib/db');
var helper      = require('../../../lib/helper');
var router      = express.Router();

var fields = {
  code:{name:'code'},
  name:{name:'name'}
};

router.post('/list', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var mainQuery = 'SELECT * FROM role ' +
      ' WHERE is_active=\'YES\' ';
  var cond = [];
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
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }
  console.log(mainQuery);

  var getCount = function() {
    var sql = "SELECT COUNT(*) AS cnt FROM role WHERE is_active='YES'";
    if (cond.length > 0) {
      sql += ' AND ' + cond.join(' AND ');
    }
    return db.query(sql).then(function(rows) {
      $scope.totalRows = rows[0].cnt;
      return true;
    });
  }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'code';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0
    };

var sql = mainQuery +
        ' ORDER BY `' + sortBy + '` ' + sortDir +
        ' LIMIT ' + (page * limit) + ', ' + limit;

    return db.queryArray(sql, {}).then(function(rows) {
      $scope.rows = rows;
      return rows;
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
  var mainQuery = 'SELECT * FROM role ' +
      ' WHERE is_active=\'YES\' ';
  var cond = [];
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
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }
  console.log(mainQuery);

  var getRows = function() {
    var sortBy = req.body.sortBy || 'code';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0
    };

var sql = mainQuery +
        ' ORDER BY `' + sortBy + '` ' + sortDir;

    return db.queryArray(sql, {}).then(function(rows) {
      $scope.rows = rows;
      return rows;
    });
  };

  ////////////////////////////////////////////////////
  // MAIN
  ////////////////////////////////////////////////////
  getRows().then(function() {
    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListRole", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/role_'+id+'.xlsx';
    fs.writeFileSync(path.normalize(__dirname + '/../../../public'+fname), buffer);
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

router.post('/getById', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var getRole = function() {
    var sql = 'SELECT * FROM role WHERE id=:id AND is_active=\'YES\'';
    return db.query(sql, {id:req.body.id})
      .then(function(rows) {
        $scope.role = rows[0];
      });
  }

  var getPermissions = function() {
    var sql = "SELECT * FROM role_permission WHERE is_active='YES' AND role_id=:id";
    return db.query(sql, {id:req.body.id})
      .then(function(rows) {
        $scope.permissions = {};
        rows.forEach(function(row) {
          $scope.permissions[row.permission_id]=true;
        });
      });
  }

  //////////////////////////////////////
  // MAIN
  //////////////////////////////////////

  q.all([
    getRole(),
    getPermissions()
  ]).then(function() {
    $scope.role.p = $scope.permissions;
    res.send({
      status: true,
      data: $scope.role
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});


router.post('/facetEdit', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var sql = "SELECT m.id mod_id, m.code mod_code, m.name mod_name, " +
    "p.id p_id, p.code p_code, p.detail p_name " +
    "FROM module m LEFT JOIN permission p ON m.id=p.module_id AND p.is_active='YES' " +
    "WHERE m.is_active='YES' "+
    "ORDER BY m.code ASC, p.code ASC";

  db.query(sql).then(function(rows) {
    var out = {};
    rows.forEach(function(row) {
      if (typeof out[row.mod_code] == 'undefined') {
        out[row.mod_code] = {
          m: {
            id:row.mod_id,
            code:row.mod_code,
            name:row.mod_name
          },
          p: {}
        };
      }
      out[row.mod_code].p[row.p_code] = {
        id:row.p_id,
        code:row.p_code,
        name:row.p_name
      };
    });

    res.send({
      status: true,
      data: out
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error: e
    });
  });
});

router.post('/save', [bodyParser.json()], function(req, res) {
  // validate
  var $scope = {};
  var error = [];
  var data = req.body.data;
  data.id = data.id || 0;

  if (data.code == '') {
    error.push('role.error.code_empty');
  }

  if (data.name == '') {
    error.push('role.error.name_empty');
  }

  if (error.length > 0) {
    res.send({status:false, msg: 'role.error', err: error});
    return;
  }

  var checkDup = function() {
    var sql = "SELECT 1 AS cnt FROM role WHERE code=:code AND id <> :id";
    return db.query(sql, {id:data.id, code:data.code})
      .then(function(rows) {
        if (rows.length > 0) {
          throw new Error('error.duplicate');
        }
      });
  };

  var insertData = function() {
    var sql = "INSERT INTO role (code, name, is_active) VALUES (:code, :name, 'YES')";
    return db.query(sql, data)
      .then(function(result) {
        data.id = result.insertId;
      });
  }

  var updateData = function() {
    var sql = "UPDATE role SET code=:code, name=:name WHERE id=:id";
    return db.query(sql, data);
  }

  var getPermssions = function() {
    var sql = "SELECT id, permission_id AS p_id FROM role_permission WHERE role_id=:id";
    return db.query(sql, {id:data.id});
  }

  var updatePermission = function(p_id, active) {
    var sql = "UPDATE role_permission SET is_active=:active WHERE role_id=:role_id AND permission_id=:p_id";
    return db.query(sql, {role_id: data.id, p_id: p_id, active:active});
  }

  var updateAllPermissions = function(rows) {
    $scope.dummy = helper.clone(data.p);
    var all = [];
    for (var i = 0; i < rows.length; i++) {
      delete $scope.dummy[rows[i].p_id];
      var active = !!data.p[rows[i].p_id] ? 'YES' : 'NO';
      if (rows[i].is_active != active) {
        all.push(updatePermission(rows[i].p_id, active));
      }
    }
    return q.all(all);
  }

  var insertNewPermissions = function() {
    var tmp = [];
    for (var key in $scope.dummy) {
      if (!!$scope.dummy[key] == false) {
        continue;
      }
      tmp.push("(" + data.id + "," + key + ", 'YES')");
    }
    if (tmp.length > 0) {
      var sql = "INSERT INTO role_permission (role_id, permission_id, is_active) VALUES " + tmp.join(', ');
      return db.query(sql);
    }
  }

  //////////////////////////////////////
  // MAIN
  //////////////////////////////////////

  var db = conn.connect();

  checkDup()
    .then(db.beginTransaction)
    .then(function() {
      console.log('begin tran');
      if (data.id==0) {
        return insertData();
      }
      return updateData();
    }).then(getPermssions)
    .then(updateAllPermissions)
    .then(insertNewPermissions)
    .then(function() {
      console.log('commit');
      db.commit(function() {
        res.send({
          status:true
        });
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

router.post('/delete', [bodyParser.json()], function(req, res) {
  var id = req.body.id;
  id = id || 0;
  if  (id==0) {
    res.send({status:false, msg:'error.missing_id'});
    return;
  }

  var db = conn.connect();

  var checkInStaffBranchRole = function() {
    var sql = "SELECT 1 FROM staff_branch_role WHERE role_id=:id AND is_active='YES' LIMIT 1";
    return db.query(sql, {id:id})
      .then(function(rows) {
        if (rows.length > 0) {
          throw new Error('error.in_use');
        }
      });
  };

  var checkReferences = function() {
    return q.all([
      checkInStaffBranchRole()
    ]);
  };


  // DEACTIVE ONLY PARENT
  var deactiveData = function() {
    var sql = "UPDATE role SET is_active='NO' WHERE id=:id";
    return db.query(sql, {id:id});
  }

  //////////////////////////////////////
  // MAIN
  //////////////////////////////////////

  checkReferences()
    .then(deactiveData)
    .then(function() {
      res.send({
        status: true
      });
    }).catch(function(e) {
      res.send({
        status: false,
        error: e
      });
    });
});
module.exports = router;
