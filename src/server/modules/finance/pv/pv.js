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

var pv_fields = {
  code:{name:'pv.code'},
  document_date:{name:'pv.document_date',type:'daterange'},
  approve_date:{name:'pv.approve_date',type:'daterange'},
  total_amount:{name:'pv.total_amount',type:'number'},
  vat_amount:{name:'pv.vat_amount',type:'number'},
  cn_code:{name:'pv.cn_code'},
  cn_amount:{name:'pv.cn_amount',type:'number'},
  net_amount:{name:'pv.net_amount',type:'number'},
  staff:{name:'s.display_name'},
  status:{name:'pv.status'}
}

router.post('/list', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};

  var mainQuery = "SELECT pv.*, " +
        "st.display_name staff " +
        "FROM payment_voucher pv " +
        "LEFT JOIN staff st ON pv.staff_id=st.id " +
        "WHERE pv.is_active='YES' "

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
    if (typeof pv_fields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(pv_fields[fld], keyword);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='staff') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  var getCount = function() {
    var sql = "SELECT COUNT(*) AS cnt FROM payment_voucher pv WHERE is_active='YES' ";
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
    var sortBy = req.body.sortBy || 'code';
    var sortDir = req.body.sortDir || 'DESC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0,
    };

    if (sortBy=='staff') {
      sortBy = 's.display_name';
    } else {
      sortBy = 'pv.`' + sortBy + '`';
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
  var db = mysqlConn.connect();
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
    if (typeof pv_fields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(pv_fields[fld], keyword);
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

router.post('/getPV', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {
    pv: {},
    pv_items:[]
  };

  var getPV = function() {
    var sql = "SELECT pv.*, pv.supplier_code supplier, st.display_name staff, st.id staff_id "
      + "FROM payment_voucher pv LEFT JOIN staff st "
      + "  ON pv.staff_id=st.id "
      + "WHERE pv.id=:id AND pv.is_active='YES'";

    return db.query(sql, {id:req.body.id}).then(function(rows) {
      if (rows.length > 0) {
        $scope.pv = rows[0];
      }
    });
  }

  var getPVItems = function() {
    var sql = "SELECT i.*, i.po_cost cost FROM payment_voucher_item i "
      + "WHERE i.pv_id=:id "
      + "ORDER BY i.po_code, i.invoice_code, i.serial, i.barcode ";
    return db.query(sql, {id:req.body.id}).then(function(rows) {
      $scope.pv_items = rows;
    });
  }

  q.all([
    getPV(),
    getPVItems()
  ]).then(function() {
    res.send({
      status:true,
      pv: $scope.pv,
      pv_items: $scope.pv_items
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    })
  })
});

router.post('/queryForWaitList', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {
      items: null
    };
    var param = req.body;

    var selectSql = "SELECT 0 id, sd.id stockin_id, si.timestamp stockin_date, sh.code shop_code, "
      + "si.company_id supplier_id, c.code supplier_code, "
      + "si.po_no po_code, si.po_date po_date, si.ref_inv invoice_code, si.ref_date invoice_date, "
      + "sd.product_id, p.description product, sd.serial, sd.barcode, "
//      + "sd.po_cost cost, sd.vat vat_rate, sd.vat*sd.po_cost/100.0 vat_amount, "
      + "sd.po_cost cost, 0.0 vat_rate, 0.0 vat_amount, "
      + "sd.qty, sd.voucher_payment_status status "
      + "FROM stock_in si JOIN stockin_detail sd ON si.id = sd.stockin_id "
      + "JOIN company c ON si.company_id = c.id "
      + "JOIN product p ON sd.product_id = p.id "
      + "JOIN shop sh ON si.shop_id = sh.id "
      + "WHERE c.code <> 'OLD' "

    var getStockItems = function() {
      var cond = [];
      var tmp = '';

      if (param.po_code) {
        tmp = helper.genCond({name:'si.po_no'}, param.po_code, true);
        if (tmp!=='') {
          cond.push(tmp);
        }
      }
      if (param.invoice_code) {
        tmp = helper.genCond({name:'si.ref_inv'}, param.invoice_code, true);
        if (tmp!='') {
          cond.push(tmp);
        }
      }
      if (param.invoice_date) {
        tmp = helper.genCond({name:'si.ref_date',type:'daterange'}, param.invoice_date, true);
        if (tmp!='') {
          cond.push(tmp);
        }
      }
      if (param.supplier) {
        tmp = helper.genCond({name:'c.code'}, param.supplier, true);
        if (tmp != '') {
          cond.push(tmp);
        }
      }
      if (param.product) {
        tmp = helper.genCond({name:'p.description'}, param.product, true);
        if (tmp != '') {
          cond.push(tmp);
        }
      }
      if (param.shop_code) {
        tmp = helper.genCond({name:'sh.code'}, param.shop_code, true);
        if (tmp != '') {
          cond.push(tmp);
        }
      }
      cond.push('rownum <= 1000');
      var sql = selectSql + ' AND ' + cond.join(' AND ')
        + ' ORDER BY si.po_no, si.ref_inv, sd.serial, sd.barcode ';

      return oraConn.query(oradb, sql, {}).then(function(result) {
        $scope.items = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };;
      });
    }

    return getStockItems().then(function() {
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

router.post('/save', [bodyParser.json()], function(req, res) {
  var data = req.body;
  var $scope = {
    pv_id: data.pv.id || null,
    pv_code: data.pv.code || null,
    prev_pv: null,
    prev_pv_items: [],
    stockin:[]
  };
  console.log('pv_id=', $scope.pv_id);
  oraConn.connect().then(function(oradb) {
    var db = mysqlConn.connect();


    // PV15070000
    var getNextCode = function() {
      var term_date = new Date(data.pv.document_date);
      var prefix = 'PV' + (''+term_date.getFullYear()).substr(-2)
        + ('0'+(term_date.getMonth()+1)).substr(-2);
      var sql = "SELECT MAX(code) max_code FROM payment_voucher WHERE code LIKE :prefix";

      return db.query(sql, {prefix:prefix+'%'}).then(function(rows) {
        if (rows.length==0 || rows[0].max_code==null) {
          $scope.pv_code = prefix+'0001';
        } else {
          $scope.pv_code = prefix + ('0000'+(parseInt(rows[0].max_code.substr(6,4))+1)).substr(-4);
        }
        console.log('pv_code', $scope.pv_code);
      });
    };
    var getPrevPV = function() {
      var sql = "SELECT * FROM payment_voucher WHERE id=:id";
      var sql2 = "SELECT * FROM payment_voucher_item WHERE pv_id=:id";
      return q.all([
        db.query(sql, {id:$scope.pv_id}).then(function(rows) {
          if (rows.length!=0) {
            $scope.prev_pv=rows[0];
          }
        }),
        db.query(sql2, {id:$scope.pv_id}).then(function(rows) {
          $scope.prev_pv_items = rows;
        })
      ]);
    };

    var insertPV = function() {
      var sql = "INSERT INTO payment_voucher (code, supplier_id, supplier_code, "
        + "document_date, propose_date, approve_date, total_amount, vat_amount, "
        + "cn_code, cn_amount, net_amount, pay_amount, remark, status, staff_id) "
        + "VALUES (:code, :supplier_id, :supplier_code, :document_date, NOW(), '0000-00-00', "
        + ":total_amount, :vat_amount, :cn_code, :cn_amount, :net_amount, :pay_amount, "
        + ":remark, :status, :staff_id)";
      return db.query(sql, {
        code: $scope.pv_code,
        supplier_id: data.pv.supplier_id || 0,
        supplier_code: data.pv.supplier || '',
        document_date: data.pv.document_date,
        total_amount: data.pv.total_amount || 0,
        vat_amount: data.pv.vat_amount || 0,
        cn_code: data.pv.cn_code || '',
        cn_amount: data.pv.cn_amount || 0,
        net_amount: data.pv.net_amount || 0,
        pay_amount: data.pv.pay_amount || data.pv.net_amount || 0,
        remark: data.pv.remark || '',
        status: data.pv.status || 'DRAFT',
        staff_id: req.session.data.staff.id || 0,
      }).then(function(result) {
        console.log('PVID=', result.insertId);
        $scope.pv_id = result.insertId;
      });
    }
    var updatePV = function() {
      var sql = "UPDATE payment_voucher SET supplier_id=:supplier_id, "
        + "supplier_code=:supplier_code, document_date=:document_date, "
        + "propose_date=NOW(), total_amount=:total_amount, "
        + "vat_amount=:vat_amount, cn_code=:cn_code, cn_amount=:cn_amount, "
        + "net_amount=:net_amount, pay_amount=:pay_amount, "
        + "remark=:remark, status=:status, staff_id=:staff_id "
        + "WHERE id=:id AND code=:code AND status IN ('DRAFT', 'PROPOSE')";

      return db.query(sql, {
        id: $scope.pv_id,
        code: $scope.pv_code,
        supplier_id: data.pv.supplier_id || 0,
        supplier_code: data.pv.supplier_code || '',
        document_date: data.pv.document_date,
        total_amount: data.pv.total_amount || 0,
        vat_amount: data.pv.vat_amount || 0,
        cn_code: data.pv.cn_code || '',
        cn_amount: data.pv.cn_amount || 0,
        net_amount: data.pv.net_amount || 0,
        pay_amount: data.pv.pay_amount || data.pv.net_amount || 0,
        remark: data.pv.remark || '',
        status: data.pv.status || 'DRAFT',
        staff_id: req.session.data.staff.id || 0,
      });
    }
    var insertPVItems = function() {
      var sql = "INSERT INTO payment_voucher_item (pv_id, stockin_id, stockin_date, "
        + "shop_code, po_code, po_date, invoice_code, invoice_date, "
        + "supplier_id, supplier_code, product_id, product, serial, barcode, qty, "
        + "po_cost, vat_rate, vat_amount) VALUES ";
      var tmp = [];
      var flds = [
        {name:'pv_id', type:'number'},
        {name:'stockin_id', type:'number'},
        'stockin_date', 'shop_code', 'po_code', 'po_date', 'invoice_code', 'invoice_date',
        {name:'supplier_id', type:'number'},
        'supplier_code',
        {name:'product_id', type:'number'},
        'product', 'serial', 'barcode',
        {name:'qty', type:'number'},
        {name:'po_cost', type:'number'},
        {name:'vat_rate', type:'number'},
        {name:'vat_amount', type:'number'}
      ];
      data.pv_items.forEach(function(item) {
        item.pv_id = $scope.pv_id;
        item.stockin_id = item.stockin_id;
        item.stockin_date = helper.dateToString(new Date(item.stockin_date), '0000-00-00');
        item.po_date = helper.dateToString(new Date(item.po_date), '0000-00-00');
        item.invoice_date = helper.dateToString(new Date(item.invoice_date), '0000-00-00');
        item.po_cost = item.cost;
        console.log('cost=', item.cost);

        tmp.push(mysqlConn.genValues(item, flds));
      });

      return db.query(sql + tmp.join(", "), {}).then(function() {
        console.log('insertPVItems OK');
      });
    }
    var insertPVItem = function(item) {
      var sql = "INSERT INTO payment_voucher_item (pv_id, stockin_id, stockin_date, "
        + "shop_code, po_code, po_date, invoice_code, invoice_date, "
        + "supplier_id, supplier_code, product_id, product, serial, barcode, qty, "
        + "po_cost, vat_rate, vat_amount) VALUES ";
      var flds = [
        {name:'pv_id', type:'number'},
        {name:'stockin_id', type:'number'},
        'stockin_date', 'shop_code', 'po_code', 'po_date', 'invoice_code', 'invoice_date',
        {name:'supplier_id', type:'number'},
        'supplier_code',
        {name:'product_id', type:'number'},
        'product', 'serial', 'barcode',
        {name:'qty', type:'number'},
        {name:'po_cost', type:'number'},
        {name:'vat_rate', type:'number'},
        {name:'vat_amount', type:'number'}
      ];
      item.pv_id = $scope.pv_id;
      item.stockin_id = item.stockin_id;
      item.stockin_date = helper.dateToString(new Date(item.stockin_date), '0000-00-00');
      item.po_date = helper.dateToString(new Date(item.po_date), '0000-00-00');
      item.invoice_date = helper.dateToString(new Date(item.invoice_date), '0000-00-00');
      item.po_cost = item.cost;

      return db.query(sql + mysqlConn.genValues(item, flds), {}).then(function(result) {
        console.log('insertPVItem OK', result);
      });
    }

    var updatePVItems = function() {
      var existing = {}
      var all = [];
      $scope.prev_pv_items.forEach(function(item) {

        existing[item.stockin_id] = true;
      });
      data.pv_items.forEach(function(item) {


        if (typeof existing[item.stockin_id] == 'undefined') {
          // insert
          console.log('INSERT', item);
          all.push(insertPVItem(item));
          // update pvitem
          $scope.stockin.push({
            id:item.stockin_id,
            status:'F'
          });
        } else {
          existing[item.stockin_id] = false;
          $scope.stockin.push({
            id:item.stockin_id,
            status:'F'
          });
        }
      });

      var list = [];

      $scope.prev_pv_items.forEach(function(item) {

        console.log('item prev:' + item.stockin_id + ',status :' + existing[item.stockin_id]);

        if (existing[item.stockin_id]==true) {
          // remove from pv_items
          console.log('item:'+ item.id);
          list.push(item.id);
          // update pvitem
          // $scope.stockin.push({
          //   id:item.stockin_id,
          //   status:'W'
          // });
        }
      });

      if (list.length > 0) {
        all.push(deletePVItems(list));
      }

      return q.all(all);
    }

    var deletePVItems = function(list) {
      console.log('deletePVItems', list);
      var sql = "DELETE FROM payment_voucher_item WHERE id IN ("+list.join(',')+")";
      return db.query(sql, {});
    }

    var updatePVStatus = function() {
      var sql = "UPDATE payment_voucher SET status=:status WHERE id=:id";
      return db.query(sql, {
        status:'',
        id:0
      });
    };

    var updateStockItems = function(list, status, commit, remark) {
      var sql = "UPDATE stockin_detail SET voucher_payment_status=:status, "
        + "voucher_payment_date=to_date('"+helper.dateToString(new Date(data.pv.document_date))+"', 'YYYY-MM-DD'), "
        + "voucher_payment_remark=:remark WHERE id IN ("
        + list.join(',') + ")";
        console.log('SQL : ',sql);
      return oraConn.query(oradb, sql, {
        status:status,
//        date:helper.dateToString(new Date(data.pv.document_date)),
        remark:remark
      }, commit || true);
    };

    // var updateStockItem = function(id, status) {
    //   var sql = "UPDATE stockin_detail SET voucher_payment_status=:status, "
    //     + "voucher_payment_date=to_date('"+helper.dateToString(new Date(data.pv.document_date))+"', 'YYYY-MM-DD'), "
    //     + "voucher_payment_remark=:remark WHERE id=" + id;
    //   console.log('updateStockItem', sql);
    //   return oraConn.query(oradb, sql, {
    //     status:status,
    //     remark:'PV=' + $scope.pv_code
    //   }, true);
    // }

    if ($scope.pv_id==null) {
      //////////////////////////////////////////////////////
      // CASE1: NEW PV
      ////////////////////////////////////////////////////////
      db.beginTransaction()
        .then(getNextCode)
        .then(insertPV)
        .then(insertPVItems)
        .then(function() {
        var list = data.pv_items.map(function(item) {
          return item.stockin_id;//
        });
        //console.log('STOCK ITEM LIST=', list);
        console.log('status : ', data.pv.status)
        if (data.pv.status=='PROPOSE'){
          return updateStockItems(list, 'F', true,  'PV=' + $scope.pv_code );
        }
      }).then(function() {
        return db.commit();
      }).then(function() {
        res.send({
          status:true,
          pv: {
            id: $scope.pv_id,
            code: $scope.pv_code
          }
        })
      }).catch(function(e) {
        db.rollback().then(function() {
          console.log('ROLLBACK DONE');
          res.send({
            status:false,
            error:e
          });
        });
      });
    } else if (data.pv.status=='DRAFT' || data.pv.status=='PROPOSE') {
      /////////////////////////////////////////////////////////
      // CASE 2: UPDATE
      /////////////////////////////////////////////////////////
      db.beginTransaction()
        .then(getPrevPV)
        .then(function() {
          if ($scope.prev_pv==null) {
            throw 'EXISTING PAYMENT NOT FOUND';
          }
          if ($scope.prev_pv.status!='DRAFT' && $scope.prev_pv.status!='PROPOSE') {
            throw 'PAYMENT STATUS INVALID (' + $scope.prev_pv.status + ')';
          }
        })
        .then(updatePV)
        .then(updatePVItems)
        .then(function() {
          var all = [];
          console.log('kk :' , $scope.stockin)
          if ($scope.stockin.length > 0) {
            var list = $scope.stockin.map(function(item) {
              return item.id;
            })
            console.log('List : ' , list);
            console.log('PV=' , $scope.pv_code);
            if (data.pv.status=='PROPOSE'){
                updateStockItems(list, 'F', true,  'PV=' + $scope.pv_code );
            }



          }
          // $scope.stockin.forEach(function(item) {
          //     console.log('itm:'+ item.id);
          //
          //   all.push(updateStockItem(item.id, item.status));
          // });
          // return q.all(all).then(function() {
          //   console.log('DONE');
          //   oraConn.query(oradb, 'COMMIT', {});
          // });
          return q.all([]);
        })
        .then(function() {
          db.commit().then(function() {
            res.send({
              status:true,
              pv: {
                id:$scope.pv_id,
                code:$scope.pv_code
              }
            })
          });
        })
        .catch(function(e) {
          db.rollback().then(function() {
            res.send({
              status:false,
              error:e
            });
          }).catch(function(e) {
            res.send({
              status:false,
              error:e
            });
          });
        });
    } else {
    }
  });
});

router.post('/genReport', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {
    items:[]
  };
  var param = req.body;

  var printNum = function(){
    var sql = " update payment_voucher set print_num = print_num + 1 where id = :id and status ='PROPOSE' "
    return db.query(sql, {id:param.pv_id});

  }

  var getPVInvoice = function() {
    var sql = "SELECT pv.code, case when print_num > 1 then CONCAT(pv.status,' REPRINT') else pv.status end status , pv.document_date, pv.net_amount total_amount, "
      + "pvi.shop_code, pvi.invoice_code, MIN(pvi.invoice_date) invoice_date, "
      + "pvi.po_code, sum(pvi.po_cost) amount, pv.cn_code, pv.cn_amount, pv.staff_id ,st.display_name staff_name ,pv.propose_date "
      + "FROM payment_voucher pv JOIN payment_voucher_item pvi ON pv.id=pvi.pv_id "
      + " left join staff st on pv.staff_id = st.id "
      + " WHERE pvi.pv_id=:id AND pv.id=:id "
      + " GROUP BY pvi.shop_code, pvi.invoice_code, pvi.po_code "
    return db.query(sql, {id:param.pv_id}).then(function(rows) {
      if (rows.length==0) {
        throw 'NO DATA';
      }
      $scope.items = rows;
      console.log('scope item : ',$scope.items);
    });
  }

  var renderReport = function() {
    try {
      var dfd = q.defer();
      $scope.pdfFile = 'finance_pv_'+ helper.newUUID() + '.pdf';
      var pdfFullPath = path.normalize(__dirname + '/../../../public/output/' + $scope.pdfFile);
      var report  = new nsReport();

      console.log('test :' , $scope.items);

      var data = $scope.items.map(function(item, i, all) {
        item.invoice_date = helper.thShortDate(item.invoice_date);
        item.amount = helper.numberFormat(item.amount,2);
        item.remark = 'PO: ' + item.po_code;
        item.showTotal = false;
        item.approve_by = "ผู้เสนออนุมัติ: " + item.staff_name
          + " วันที่: " + helper.thShortDate(item.propose_date);
        item.printed = "ผู้พิมพ์: " + req.session.data.staff.display_name
          + " วันที่: " + helper.thShortDateTime(new Date());
        return item;
      });

      data[0].document_date = helper.thShortDate(data[0].document_date);

      for (var i = data.length; i < 30; i++) {
        data.push({
          shop_code:'',
          invoice_code:'',
          invoice_date:'',
          amount:'',
          remark:''
        });
      }
      console.log('data:',data.length);

      var last = data.length;
      if ($scope.items[0].cn_code != '') {
        data.push({
          shop_code:'',
          invoice_code:'',
          invoice_date:'',
          amount:helper.numberFormat($scope.items[0].cn_amount,2),
          remark:'C/N: ' + $scope.items[0].cn_code
        });
        //
        // data[last].remark = 'C/N: ' + $scope.items[0].cn_code;
        // data[last].amount = helper.numberFormat($scope.items[0].cn_amount,2);
      }

      data[last].showTotal = true;
      data[last].total_amount = helper.numberFormat($scope.items[0].total_amount,2);
      data[last].total_amount_text = helper.bahtText($scope.items[0].total_amount);

      data[last].approve_by = "ผู้เสนออนุมัติ: " + $scope.items[0].staff_name
        + " วันที่: " + helper.thShortDate(data[0].propose_date);

      data[last].printed = "ผู้พิมพ์: " + req.session.data.staff.display_name
        + " วันที่: " + helper.thShortDateTime(new Date());

      var report  = new nsReport();
      var doc = report.createDocument(require('./reports/pv.js'), data);
      var stream = fs.createWriteStream(pdfFullPath);
      doc.pipe(stream);
      doc.end();
      stream.on('finish', function() {
        dfd.resolve();
      });
      stream.on('error', function(e) {
        dfd.reject();
      });

      return dfd.promise;

    } catch (e) {
      console.log(e);
    }
  }
  printNum()
  .then(getPVInvoice)
  .then(renderReport)
  .then(function() {
    res.send({
      status:true,
      data: {
        url: $scope.pdfFile
      }
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  });
});


module.exports = router;
