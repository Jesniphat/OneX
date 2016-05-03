var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var mkdirp      = require('mkdirp');
var fs          = require('fs');
var path        = require('path');
var xlsx        = require('node-xlsx');

var mysqlConn   = require('../../../lib/db');
var helper      = require('../../../lib/helper');

var router      = express.Router();

router.post('/list', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var keywords = req.body.keywords || {};
  var fields = {
    shop_name: {name:'sh.name'},
    display_name: {name:'s.display_name'},
    cost_term: {name:"SUM(r.cost_term)", type:'number',having:true},
    amount: {name:"SUM(r.amount)", type:'number',having:true},
    profit: {name:"(sum(r.amount) - sum(r.cost_term))", type:'number',having:true},
    receipt_amount: {name:"count(r.id)", type:'number',having:true}
  };

  if (!keywords || !keywords.term_year) {
    var today = new Date();
    var prevDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()-15);
    var dateFrom = new Date(prevDay.getFullYear(), prevDay.getMonth(), 1);
    var dateTo = new Date(prevDay.getFullYear(), prevDay.getMonth()+1, 1);
    var period = (""+prevDay.getFullYear()).substr(-2)+('0'+(prevDay.getMonth()+1)).substr(-2);
  } else {
    var dateFrom = new Date(keywords.term_year+'-'+keywords.term_month+'-01');
    var dateTo = new Date(dateFrom.getFullYear(), dateFrom.getMonth()+1, 1);
    var period = (""+keywords.term_year).substr(-2) + '/' + keywords.term_month;
  }
// total_paid - install_cost - fee - cost

  var mainQuery = "SELECT sh.name shop_name, r.shop_id  "
    + ", case when c.finance_staff_id = 1550 then c.sell_staff_id  "
    + " else c.finance_staff_id end id  "
    + " ,case when c.finance_staff_id = 1550 then s2.display_name  "
    + " else s.display_name end display_name  "
    + " , sum(r.cost_term) cost_term, sum(r.amount) amount "
    + ",sum(r.amount) - sum(r.cost_term) profit "
    + ",count(r.id) receipt_amount  "
    + "from receipt r "
    + "inner join contract c on r.ref = c.id "
    + "inner join staff s on s.id = r.finance_staff  "
    + " inner join staff s2 on s2.id = c.sell_staff_id   "
    + "inner join shop sh on sh.id = r.shop_id "
    + "where r.status='NORMAL' and c.shop_id=:shop_id and c.close_date >= :date_from AND c.close_date < :date_to  "
    + " and c.current_status in ('CLOSE_NORMAL','CLOSE_CONFISCATE') ";

  var whereCond = {
    shop_id: keywords.shop_id,
    date_from: helper.dateToString(dateFrom),
    date_to: helper.dateToString(dateTo)
  };

  var cond = [];
  var having = [];
  var hasJoin = false;
  for(var fld in keywords) {
    var keyword = keywords[fld];
    if (typeof keyword === 'undefined') {
      continue;
    }
    if (typeof keyword=='string') {
      keyword = keyword.trim();
    }
    if (keyword == '') {
      continue;
    }
    if (typeof fields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(fields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    if (fields[fld].having) {
      having.push(tmp);
    } else {
      cond.push(tmp);
    }

    // if (fld=='shop') {
    //   hasJoin = true;
    // }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }
  mainQuery += ' group by id ';
  if (having.length > 0) {
    mainQuery += ' HAVING ' + having.join(' AND ');
  }

  var getCount = function() {
    sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x';
    return db.query(sql, whereCond).then(function(rows) {
      if (rows.length==0) {
        $scope.totalRows = 0;
      } else {
        $scope.totalRows = rows[0].cnt;
      }
    });
  }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'display_name';
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

    if (fields[sortBy]) {
      sortBy = fields[sortBy].name;
    } else {
      sortBy = 'display_name';
    }

    var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;

    return db.queryArray(sql, whereCond).then(function(rows) {
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
    } else {
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

router.post('/facetList', function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};

  var getShops = function() {
    var sql = "SELECT s.id, s.code, s.name, s.prefix_barcode FROM shop s WHERE s.is_active='YES' ORDER BY s.code";
    return db.queryArray(sql).then(function(result) {
      $scope.shops = result;
    });
  }
  var getYear = function() {
    var sql = "SELECT DISTINCT YEAR(sign_date) term_year FROM contract";
    return db.query(sql).then(function(rows) {
      $scope.years = rows;
    });
  }

  q.all([
    getShops(),
    getYear()
  ]).then(function() {
    res.send({
      status:true,
      shops: $scope.shops,
      years: $scope.years
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  })
});

router.post('/facetDetail', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {
    shops: [],
    years: []
  };


  var getShopStaff = function() {
    // var sql = "SELECT r.shop_id, s.code shop_code, s.name shop_name, "
    //   + " c.sell_staff_id, st.display_name staff_name, COUNT(*) num_contract "
    //   + " FROM receipt r JOIN shop s ON r.shop_id=s.id "
    //   + " inner join contract c on c.id = r.ref  "
    //   + " LEFT JOIN staff st ON r.finance_staff=st.id "
    //   + " WHERE c.close_date >= :date_from and c.close_date < :date_to "
    //   + " and r.shop_id = :shop_id "
    //   + " aand case when c.finance_staff_id = 1550 then c.sell_staff_id = :staff_id "
    //   + "         else r.finance_staff = :staff_id end "
    //   + " GROUP BY r.shop_id, r.finance_staff ";
    var sql = "select s.shop_id,sh.code shop_code, sh.name shop_name "
            + " ,s.id sell_staff_id, s.display_name staff_name "
            + " from staff s inner join shop sh on s.shop_id = sh.id where s.id = :staff_id "
    // var date_from = req.body.term_year + '-' + req.body.term_month + '-01';
    // var date_to = helper.dateToString(new Date(parseInt(req.body.term_year), parseInt(req.body.term_month), 1));
    //return db.query(sql, {date_from:date_from, date_to:date_to, shop_id:req.body.shop_id, staff_id:req.body.staff_id}).then(function(rows) {
    return db.query(sql, {staff_id:req.body.staff_id}).then(function(rows) {
      var shops = {};
      rows.forEach(function(row) {
        if (!shops[row.shop_id]) {
          shops[row.shop_id] = {
            id: row.shop_id,
            code: row.shop_code,
            name: row.shop_name,
            staffs: []
          };
        }
        shops[row.shop_id].staffs.push({
          id:row.sell_staff_id,
          name:row.staff_name,
          num_con:''
        });
      });
      for (var i in shops) {
        $scope.shops.push(shops[i]);
      }
    });
  }

  var getYear = function() {
    var sql = "SELECT DISTINCT YEAR(sign_date) term_year FROM contract";
    return db.query(sql).then(function(rows) {
      $scope.years = rows;
    });
  };

  q.all([
    getShopStaff(),
    getYear()
  ]).then(function() {
    res.send({
      status:true,
      shops: $scope.shops,
      years: $scope.years
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  })
});

// router.post('/facetDetail', [bodyParser.json()], function(req, res) {
//   var db = mysqlConn.connect();
//   var $scope = {
//     shops: []
//   };
//
//   var getShop = function() {
//     var sql = "SELECT DISTINCT sh.id, sh.code, sh.name "
//       + "FROM contract c JOIN shop sh ON c.shop_id=sh.id "
//       + "WHERE close_date >= :date_from AND close_date < :date_to "
//       + "ORDER BY sh.code";
//     var date_from = req.body.term_year + '-' + req.body.term_month + '-01';
//     var date_to = helper.dateToString(new Date(parseInt(req.body.term_year), parseInt(req.body.term_month), 1));
//     return db.query(sql, {date_from:date_from, date_to:date_to}).then(function(rows) {
//       $scope.shops = rows;
//     });
//   }
//   q.all([
//     getShop()
//   ]).then(function() {
//     res.send({
//       status:true,
//       shops: $scope.shops
//     });
//   }).catch(function(e) {
//     res.send({
//       status:false,
//       error:e
//     });
//   })
// });

router.post('/commissionDetail', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var getReceipts = function() {
    var date_from = helper.dateToString(new Date(parseInt(req.body.term_year), parseInt(req.body.term_month)-1, 1));
    var date_to = helper.dateToString(new Date(parseInt(req.body.term_year), parseInt(req.body.term_month), 1));

    // var sql = " select c.code contract_code, concat(c.cus_firstname,c.cus_lastname) cus_name, r.id ,r.code,r.pay_date, r.amount "
    //           + " , r.cost_term, (r.amount - r.cost_term) profit "
    //           + " , r.finance_staff ,s.display_name, r.commission_close_id, sh.name shop_name "
    //           + " from receipt r inner join contract c "
    //           + " on r.ref = c.id inner join staff s "
    //           + " on r.finance_staff = s.id "
    //           + " inner join shop sh on sh.id = r.shop_id "
    //           + " where r.status = 'NORMAL' and r.finance_staff = :staff_id  and c.shop_id=:shop_id "
    //           + " and c.current_status in ('CLOSE_NORMAL','CLOSE_CONFISCATE','CLOSE_RETURN') "
    //           + " and c.close_date >= :date_from AND c.close_date < :date_to ";

    var sql = "  select c.code contract_code,r.id ,r.code, concat(c.cus_firstname,c.cus_lastname) cus_name "
		 			    + " ,r.pay_date, c.sign_date,c.close_date , r.amount  "
              + "  , r.cost_term, (r.amount - r.cost_term) profit  "
              + "  , r.finance_staff ,s.display_name, r.commission_close_id, sh.name shop_name ,c.sell_date "
              + "  from receipt r inner join contract c  "
              + "  on r.ref = c.id inner join staff s  "
              + "  on r.finance_staff = s.id  "
              + "  inner join shop sh on sh.id = r.shop_id  "
              + "  inner join ( "
						  + " select distinct c.id "
			        + "  from receipt r inner join contract c  "
			        + "  on r.ref = c.id inner join staff s  "
			        + "  on r.finance_staff = s.id  "
			        + "  inner join shop sh on sh.id = r.shop_id  "
			        + "  where r.status = 'NORMAL'  and c.shop_id=:shop_id   "
              + "  and case when c.finance_staff_id = 1550 then c.sell_staff_id = :staff_id  "
						 	+ "  	else r.finance_staff = :staff_id end  "
			        + "  	and c.current_status in ('CLOSE_NORMAL','CLOSE_CONFISCATE')   "
			        + "    and c.close_date >= :date_from AND c.close_date < :date_to  "
					    + " ) aa on c.id = aa.id  "
              + " where r.status = 'NORMAL' ";

    return db.query(sql, {
      staff_id: req.body.staff_id,
      date_from: date_from,
      date_to: date_to,
      shop_id: req.body.shop_id
    }).then(function(rows) {
      // var _chkCode = '';
      // rows.forEach(function(row,i){
      //   if(i != 0){
      //     if(row.contract_code == _chkCode){
      //       row.contract_code = '';
      //     }
      //   }
      //   if (row.contract_code != ''){
      //       _chkCode = row.contract_code;
      //   }
      //     $scope.receipts.push(row);
      //  });
      $scope.receipts = rows;
    });
  };

  var getCommissions = function() {
      var sql = " SELECT * FROM commission_close_receipt "
      + " WHERE staff_id=:staff_id "
      + "  AND summary_period = :period "
      + " ORDER BY paid_period DESC";
    var period = req.body.term_year.substr(2,2) + '/' + req.body.term_month;
    return db.queryArray(sql, {
      staff_id: req.body.staff_id,
      period: period
    }).then(function(rows) {
      $scope.commissions = rows;
    });
  };

  var getCloseCAamount = function() {
    var date_from = helper.dateToString(new Date(parseInt(req.body.term_year), parseInt(req.body.term_month)-1, 1));
    var date_to = helper.dateToString(new Date(parseInt(req.body.term_year), parseInt(req.body.term_month), 1));
    var sql = " select sum(closeca_staff_amount) closeca_amount  "
              + " from contract  "
              + " where current_status = 'CLOSE_BAD_DEBT'  "
	            + " and closeca_staff = :staff_id "
	            + " and closeca_date >= :date_from and closeca_date < :date_to ";

    return db.query(sql, {
      staff_id: req.body.staff_id,
      date_from: date_from,
      date_to: date_to
    }).then(function(rows) {
      $scope.closeca_amount = rows[0].closeca_amount;
    });
  };

  q.all([
    getReceipts(),
    getCommissions(),
    getCloseCAamount()
  ]).then(function() {

    res.send({
      status:true,
      receipts: $scope.receipts,
      commissions: $scope.commissions,
      closeca_amount:$scope.closeca_amount
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  });
});

router.post('/saveCommission', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var data = req.body;

  var saveCommissionPayment = function() {
    var sql = "INSERT INTO commission_close_receipt (staff_id, summary_period, paid_period, num_receipt, "
      + "profit_amount, paid_pct, paid_amount, authorized_date, remark) "
      + "VALUES(:staff_id, :summary_period, :paid_period, :num_receipt, :profit_amount, "
      + ":paid_pct, :paid_amount, :authorized_date, :remark)";

    return db.query(sql, data).then(function(result) {
      $scope.comm_close_payment_id = result.insertId;
    });
  };

  var saveCommissionDetail = function() {
    var sql = "INSERT INTO commission_close_detail (comm_id, receipt_id) VALUES ";
    sql += data.receipts.map(function(receipt) {
      return '('+$scope.comm_close_payment_id+','+receipt+')';
    }).join(', ');
    return db.query(sql);
  }

  var updateReceiptCommissions = function() {
    var sql = "UPDATE receipt SET commission_close_id=:comm_close_payment_id "
      + "WHERE id IN (" + data.receipts.join(',') + ")";
    return db.query(sql, {comm_close_payment_id:$scope.comm_close_payment_id});
  };

  db.beginTransaction()
    .then(saveCommissionPayment)
    .then(saveCommissionDetail)
    .then(updateReceiptCommissions)
    .then(function() {
      db.commit();
      res.send({
        status:true,
        comm_close_payment_id: $scope.comm_close_payment_id
      });
    }).catch(function(e) {
      res.send({
        status:false,
        error:e
      });
    });

});

router.post('/voidCommission', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var param = req.body;

  var updateCommission = function() {
    var sql = "UPDATE commission_close_receipt SET status='VOID' WHERE id=:id";
    return db.query(sql, {id:param.id});
  }

  var updateContract = function() {
    var sql = "UPDATE receipt SET commission_close_id=0 WHERE commission_close_id=:id";
    return db.query(sql, {id:param.id});
  }

  db.beginTransaction()
  .then(updateCommission)
  .then(updateContract)
  .then(function() {
    return db.commit();
  }).then(function() {
    res.send({
      status:true
    });
  }).catch(function(e) {
    db.rollback().then(function() {
      res.send({
        status:false,
        error:e
      });
    })
  });
});

router.post('/paidCommission', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var param = req.body;

  var updateCommission = function() {
    var sql = "UPDATE commission_close_receipt SET status='PAID' WHERE id=:id";
    return db.query(sql, {id:param.id});
  }

  db.beginTransaction()
  .then(updateCommission)
  .then(function() {
    return db.commit();
  }).then(function() {
    res.send({
      status:true
    });
  }).catch(function(e) {
    db.rollback().then(function() {
      res.send({
        status:false,
        error:e
      });
    })
  });
});

router.post('/export', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var mainQuery = "SELECT c.id, c.sign_date, s.name shop_name, s.code shop_code, "
    + "c.code, CONCAT(c.cus_firstname, ' ', c.cus_lastname) cus_name"
    + ", c.product_detail, c.product_serial"
    + ", c.payment_price, c.total_paid "
    + ", c.balance "
    + "FROM contract c "
    + "  LEFT JOIN shop s on c.shop_id=s.id "
    + "WHERE c.is_active='YES' ";

  var cond = [];
  var hasJoin = false;
  var keywords = req.body.keywords || {};

  for(var fld in keywords) {
    var keyword = keywords[fld];
    if (typeof keyword === 'undefined') {
      continue;
    }
    keyword = keyword.trim();
    if (keyword == '') {
      continue;
    }
    if (typeof contractFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(contractFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    if (fld=='shop'
        || fld=='shop_name') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'sign_date';
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

    sortBy = 'c.`' + sortBy + '`';


var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir;

    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
    });
  }


  getRows().then(function() {
    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListContract", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/contract_list_'+id+'.xlsx';
    fs.writeFileSync('./dist/public'+fname, buffer);
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
