var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var oraConn     = require('../../../lib/oracle');
var conn        = require('../../../lib/db');
var helper      = require('../../../lib/helper');
var router      = express.Router();
var q           = require('q');

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(JSON.stringify(a[i]) === JSON.stringify(a[j])) {
                a.splice(j--, 1);
            }
        }
    }

    return a;
}

// Array.prototype.unique = function() {
//     var a = this.concat();
//     for(var i=0; i<a.length; ++i) {
//         for(var j=i+1; j<a.length; ++j) {
//             if(JSON.stringify(a[i]) === JSON.stringify(a[j]))
//                 a.splice(j--, 1);
//         }
//     }
//
//     return a;
// };

router.post('/facetSetting', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = conn.connect();

  var getShop = function() {
    var sql = " SELECT id, code, name FROM shop WHERE is_active='YES' AND prefix_barcode <> '' ";
    return db.query(sql).then(function(rows) {
      $scope.shop = rows;
    });
  };

  var getStaff = function() {
    var sql = "SELECT id, user AS code, display_name AS name, shop_id, department_id FROM staff WHERE is_active='YES'";
    return db.query(sql).then(function(rows) {
      $scope.staff = rows;
    });
  };

  var getRole = function() {
    var sql = "SELECT id, code, name FROM role WHERE is_active='YES'";
    return db.query(sql).then(function(rows) {
      $scope.role = rows;
    });
  };

  var getDepartment = function() {
    var sql = "SELECT id, code, name FROM department WHERE is_active='YES'";
    return db.query(sql).then(function(rows) {
      $scope.department = rows;
    });
  };

  var getData = function() {
    var sql = "SELECT g.staff_id s_id, g.shop_id b_id, g.role_id r_id " +
        "FROM staff_shop_role g " +
        "  JOIN staff s ON g.staff_id=s.id AND s.is_active='YES' " +
        "  JOIN shop sh ON g.shop_id=sh.id AND sh.is_active='YES' AND sh.prefix_barcode<>'' " +
        "  JOIN role r ON g.role_id=r.id AND r.is_active='YES' " +
        "WHERE g.is_active='YES'";
    return db.query(sql).then(function(rows) {
      var out = {};
      rows.forEach(function(row) {
        out[row.s_id+'_'+row.b_id+'_'+row.r_id]=true;
      });
      $scope.grant = out;
    });
  };

  //////////////////////////////////////
  // MAIN
  //////////////////////////////////////

  var all = [
    getShop(),
    getStaff(),
    getRole(),
    getDepartment(),
    getData()
  ];
  q.all(all).then(function() {
    res.send({
      status: true,
      data: {
        shop: $scope.shop,
        staff: $scope.staff,
        role: $scope.role,
        department: $scope.department,
        grant: $scope.grant
      }
    });
  }).catch(function(e) {
    res.send({
      status: false,
      error: e
    });
  });
});

router.post('/save', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
  // validate
  var $scope = {};
  var data = req.body.data;

//  console.log('data:',data);
  var getGrants = function() {
    var sql = "SELECT id, staff_id AS s_id, shop_id AS b_id, role_id AS r_id, is_active FROM staff_shop_role";
  //  console.log('getGrants', sql);
    return db.query(sql);
  }

  var updateGrant = function(id, active) {
    var sql = "UPDATE staff_shop_role SET is_active=:active WHERE id=:id";
  //  console.log('id=', id, ', active=', active, sql);
    return db.query(sql, {id: id, active:active});
  }

  var updateAllGrants = function(rows) {
    $scope.dummy = helper.clone(data);
    $scope.permission = [];
    var all = [];
    for (var i = 0; i < rows.length; i++) {
      var id = rows[i].s_id+'_'+rows[i].b_id+'_'+rows[i].r_id;
      delete $scope.dummy[id];
      var active = !!data[id] ? 'YES' : 'NO';

      if (rows[i].is_active != active) {
    //    console.log('rows',rows[i]);
        all.push(
          updateGrant(rows[i].id, active),
          getPermissionId(rows[i].b_id,rows[i].s_id,rows[i].r_id,active)
        );
      }
    }
  //  console.log('updateAllGrants');
    return q.all(all);
  }

  var insertNewGrant = function() {
    var tmp = [];
    var tmpOracle = [];

    for (var key in $scope.dummy) {
      if (!!$scope.dummy[key] == false) {
        continue;
      }
      var tmp2 = key.split('_');
      tmp.push("(" + tmp2[0] + "," + tmp2[1] + "," + tmp2[2] + ",'YES')");
    }
  //  console.log('tmp', tmp);
    if (tmp.length > 0) {
      var sql = "INSERT INTO staff_shop_role (staff_id, shop_id, role_id, is_active) VALUES " + tmp.join(', ');
    //  console.log(sql);
      return db.query(sql);
    }
  }

  var getNewGrantOra = function() {
    var all = [];
    //$scope.permission = [];
    for (var key in $scope.dummy) {
      if (!!$scope.dummy[key] == false) {
        continue;
      }
      var tmp2 = key.split('_');

      all.push(
        getPermissionId(tmp2[1],tmp2[0],tmp2[2],'YES')
      );
    }

    return q.all(all);

  }

  var getPermissionId = function(shopId,staffId,roleId,is_active){
    var sql = " select permission_id,:staffId staff_id,:shopId shop_id,:is_active is_active "
    + " from role_permission rp,permission p "
    + " where rp.is_active = 'YES' and role_id = :role_id "
    + " and rp.permission_id = p.id"
    + " and p.is_oracle = 'YES'"

    return db.query(sql,{role_id:roleId,staffId:staffId,shopId:shopId,is_active:is_active}).then(function(rows){
      //console.log('rows:',rows);
      $scope.permission = arrayUnique($scope.permission.concat(rows));
    });
  }

  var insNewPermissionOra = function(){
    var all = [];
  //  console.log('perscope:',$scope.permission);
    if ($scope.permission.length > 0){
      $scope.permission.forEach(function(row) {
        all.push(
          chkPermissionOra(row.shop_id,row.staff_id,row.permission_id,row.is_active)
        );
      });
    }

    return q.all(all);

  }

  var chkPermissionOra = function(shopId,staffId,permissionId,is_active){
    var sql = " select * from permission where mysqlpermissionid = :permissionId and mysqlstaffid = :staffId and mysqlshopid = :shopId ";

    return oraConn.query(oradb,sql,{permissionId:permissionId,shopId:shopId,staffId:staffId}).then(function(result) {
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
         if(result.rows.length==0){
           insPermissionOra(shopId,staffId,permissionId);
         }else{
           updatePermissionOra(shopId,staffId,permissionId,is_active);
         }
      })
  }

  var updatePermissionOra = function(shopId,staffId,permissionId,is_active){
    var sql = " update permission set is_active = :is_active "
            + " where mysqlpermissionid = :permissionId "
            + " and mysqlstaffid = :staffId "
            + " and mysqlshopid = :shopId "

  //  console.log('permission:',permissionId,'staff:',staffId,'shop:',shopId,'active:',is_active);
    return oraConn.query(oradb, sql,{permissionId:permissionId,staffId:staffId,shopId:shopId,is_active:is_active},true);
  }

  var insPermissionOpOra = function(shopId,staffId,permissionId) {
    var sql = " insert into siamchai_op.permission (id,screen_id,staff_id,mysqlpermissionid,mysqlstaffid,mysqlshopid,idcheck,is_active) "
            + " values (permission_id.nextval,(select id from screen where mysqlid = :permissionId),(select id from staff where mysqlviewstaffid = :staffId and mysqlviewshopid = :shopId),:permissionId,:staffId,:shopId,:idcheck,'YES') "

    var idCheck = permissionId+staffId+shopId;
    return oraConn.query(oradb, sql,{permissionId:permissionId,staffId:staffId,shopId:shopId,idCheck:idCheck},true);
  }

  var insPermissionOra = function(shopId,staffId,permissionId) {
    var sql = " insert into permission (id,screen_id,staff_id,mysqlpermissionid,mysqlstaffid,mysqlshopid,idcheck,is_active) "
            + " values (permission_id.nextval,(select id from screen where mysqlid = :permissionId),(select id from staff where mysqlviewstaffid = :staffId and mysqlviewshopid = :shopId),:permissionId,:staffId,:shopId,:idcheck,'YES') "

    var idCheck = permissionId.toString() + staffId.toString() + shopId.toString();
    return oraConn.query(oradb, sql,{permissionId:permissionId,staffId:staffId,shopId:shopId,idCheck:idCheck},true);
  }

  //////////////////////////////////////
  // MAIN
  //////////////////////////////////////

  var db = conn.connect();

  db.beginTransaction()
    .then(getGrants)
    .then(updateAllGrants)
    .then(insertNewGrant)
    .then(getNewGrantOra)
  //  .then(getPermissionId)
    .then(insNewPermissionOra)
    .then(function() {
      console.log('commit');
      db.commit(function() {
        oraConn.close(oradb);
        res.send({
          status:true
        });
      });
    }).catch(function(e) {

      console.log('rollback', e);
      db.rollback(function(e) {
        oraConn.close(oradb);
        res.send({
          status:false,
          error:e
        });
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

  var checkInStaffShopRole = function() {
    var sql = "SELECT 1 FROM staff_shop_role WHERE role_id=:id AND is_active='YES' LIMIT 1";
    return db.query(sql, {id:id})
      .then(function(rows) {
        if (rows.length > 0) {
          throw new Error('error.in_use');
        }
      });
  };

  var checkReferences = function() {
    return q.all([
      checkInStaffShopRole()
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
