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
    sell_staff_name:{name:'s.display_name'},
    num_contract: {name:'count(*)'},
    sum_total_price: {name:'sum(total_price)'},
    sum_payment_price: {name:'sum(payment_price)'},
    sum_cost: {name:'sum(cost)'},
    sum_fee: {name:'sum(fee)'},
    sum_profit: {name: 'sum(total_price - cost - fee - install_cost)'}
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

  var mainQuery = "SELECT s.display_name sell_staff_name, "
    + "p.authorized_date, ifnull(p.paid_amount, 0) paid_amount, c.* "
    + "FROM ( "
	  + "SELECT c.sell_staff_id AS id, count(*) num_contract, sum(total_price) sum_product_price "
	  + ", sum(payment_price) sum_payment_price, sum(cost) sum_cost "
	  + ", sum(fee) sum_fee, sum(install_cost) sum_install_cost "
	  + ", sum(total_price - cost - fee - install_cost) sum_profit "
	  + "FROM contract c "
	  + "WHERE c.shop_id=:shop_id AND c.type <> 'CASH_EXTRA' AND "
  	+ "c.sign_date >= :date_from AND c.sign_date < :date_to and c.current_status <> 'CLOSE_CHANGE' "
	  + "GROUP BY c.sell_staff_id "
    + ") c LEFT JOIN staff s ON c.id=s.id "
	  + "LEFT JOIN commission_open_contract p ON c.id=p.staff_id "
		+ "AND p.summary_period=:period";
  var whereCond = {
    shop_id: keywords.shop_id,
    date_from: helper.dateToString(dateFrom),
    date_to: helper.dateToString(dateTo),
    period: period
  };

  var cond = [];
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
    cond.push(tmp);
    if (fld=='sell_staff_name') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' HAVING ' + cond.join(' AND ');
  }

  console.log(mainQuery);

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
    var sortBy = req.body.sortBy || 'sell_staff_name';
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
      sortBy = 's.`display_name`';
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
    var sql = "SELECT DISTINCT YEAR(sign_date) term_year FROM contract ORDER BY term_year DESC";
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
    var sql = "SELECT c.shop_id, s.code shop_code, s.name shop_name, "
      + "c.sell_staff_id, st.display_name staff_name, COUNT(*) num_contract "
      + "FROM contract c JOIN shop s ON c.shop_id=s.id "
      + " LEFT JOIN staff st ON c.sell_staff_id=st.id "
      + "WHERE sign_date >= :date_from and sign_date < :date_to "
      + "GROUP BY c.shop_id, c.sell_staff_id";
    var date_from = req.body.term_year + '-' + req.body.term_month + '-01';
    var date_to = helper.dateToString(new Date(parseInt(req.body.term_year), parseInt(req.body.term_month), 1));
    console.log('date_from=', date_from, 'date_to=', date_to);
    return db.query(sql, {date_from:date_from, date_to:date_to}).then(function(rows) {
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
          num_con:row.num_contract
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

router.post('/commissionDetail', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {};
  var getContracts = function() {
    var date_from = helper.dateToString(new Date(parseInt(req.body.term_year), parseInt(req.body.term_month)-1, 1));
    var date_to = helper.dateToString(new Date(parseInt(req.body.term_year), parseInt(req.body.term_month), 1));
    console.log('term_month=',req.body.term_month);
    var sql = "SELECT c.id, c.code, c.sign_date "
      + ", trim(concat(c.cus_prename, ' ', c.cus_firstname, ' ', c.cus_lastname)) customer "
      + ", c.product_detail product, c.total_price, c.payment_price, c.cost, c.fee, c.install_cost "
      + ", (c.total_price - c.cost - c.fee - c.install_cost) as profit "
      + ", c.current_status, c.comm_open_payment_id, p.paid_period paid_period "
      + "FROM contract c LEFT JOIN commission_open_contract p ON c.comm_open_payment_id=p.id "
      + "WHERE c.sell_staff_id=:staff_id and c.shop_id=:shop_id AND c.type <> 'CASH_EXTRA' "
      + "  AND c.sign_date >= :date_from and c.sign_date < :date_to and c.current_status <> 'CLOSE_CHANGE' "
      + "ORDER BY c.sign_date, c.id";

    return db.query(sql, {
      staff_id: req.body.staff_id,
      date_from: date_from,
      date_to: date_to,
      shop_id: req.body.shop_id
    }).then(function(rows) {
      $scope.contracts = rows;
    });
  };

  var getCommissions = function() {
    var sql = "SELECT * FROM commission_open_contract "
      + "WHERE staff_id=:staff_id "
      + "  AND summary_period = :period "
      + "ORDER BY paid_period DESC";
    var period = req.body.term_year.substr(2,2) + '/' + req.body.term_month;
    //console.log('period=',period);
    return db.queryArray(sql, {
      staff_id: req.body.staff_id,
      period: period
    }).then(function(rows) {
      $scope.commissions = rows;
    });
  }

  q.all([
    getContracts(),
    getCommissions()
  ]).then(function() {
    res.send({
      status:true,
      contracts: $scope.contracts,
      commissions: $scope.commissions
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
    var sql = "INSERT INTO commission_open_contract (staff_id, summary_period, paid_period, num_contract, "
      + "profit_amount, paid_pct, paid_amount, authorized_date, remark, status, other_paid) "
      + "VALUES(:staff_id, :summary_period, :paid_period, :num_contract, :profit_amount, "
      + ":paid_pct, :paid_amount, :authorized_date, :remark, 'READY',:other_paid)";
    return db.query(sql, data).then(function(result) {
      $scope.comm_open_payment_id = result.insertId;
    });
  };

  var saveCommissionDetail = function() {
    var sql = "INSERT INTO commission_open_detail (comm_id, contract_id) VALUES ";
    sql += data.contracts.map(function(contract) {
      return '('+$scope.comm_open_payment_id+','+contract+')';
    }).join(', ');
    console.log(sql);
    return db.query(sql);
  }

  var updateContractCommissions = function() {
    var sql = "UPDATE contract SET comm_open_payment_id=:comm_open_payment_id "
      + "WHERE id IN (" + data.contracts.join(',') + ")";
    return db.query(sql, {comm_open_payment_id:$scope.comm_open_payment_id});
  };

  db.beginTransaction()
    .then(saveCommissionPayment)
    .then(saveCommissionDetail)
    .then(updateContractCommissions)
    .then(function() {
      db.commit();
      res.send({
        status:true,
        comm_open_payment_id: $scope.comm_open_payment_id
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
    var sql = "UPDATE commission_open_contract SET status='VOID' WHERE id=:id";
    return db.query(sql, {id:param.id});
  }

  var updateContract = function() {
    var sql = "UPDATE contract SET comm_open_payment_id=0 WHERE comm_open_payment_id=:id";
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
    var sql = "UPDATE commission_open_contract SET status='PAID' WHERE id=:id";
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
  var keywords = req.body.keywords || {};

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

  var fields = {
    sell_staff_name:{name:'s.display_name'},
    num_contract: {name:'count(*)'},
    sum_total_price: {name:'sum(total_price)'},
    sum_payment_price: {name:'sum(payment_price)'},
    sum_cost: {name:'sum(cost)'},
    sum_fee: {name:'sum(fee)'},
    sum_profit: {name: 'sum(total_price - cost - fee - install_cost)'}
  };

  var mainQuery = "SELECT s.display_name sell_staff_name, "
    + "p.authorized_date, ifnull(p.paid_amount, 0) paid_amount, c.* "
    + "FROM ( "
	  + "SELECT c.sell_staff_id AS id, count(*) num_contract, sum(total_price) sum_product_price "
	  + ", sum(payment_price) sum_payment_price, sum(cost) sum_cost "
	  + ", sum(fee) sum_fee, sum(install_cost) sum_install_cost "
	  + ", sum(total_price - cost - fee - install_cost) sum_profit "
	  + "FROM contract c "
	  + "WHERE c.shop_id=:shop_id AND c.type = 'CASH_EXTRA' AND "
  	+ "c.sign_date >= :date_from AND c.sign_date < :date_to "
	  + "GROUP BY c.sell_staff_id "
    + ") c LEFT JOIN staff s ON c.id=s.id "
	  + "LEFT JOIN commission_open_contract p ON c.id=p.staff_id "
		+ "AND p.summary_period=:period";
  var whereCond = {
    shop_id: keywords.shop_id,
    date_from: helper.dateToString(dateFrom),
    date_to: helper.dateToString(dateTo),
    period: period
  };

  var cond = [];
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
    cond.push(tmp);
    if (fld=='sell_staff_name') {
      hasJoin = true;
    }
  }
  if (cond.length > 0) {
    mainQuery += ' HAVING ' + cond.join(' AND ');
  }
  console.log(mainQuery);

  var getRows = function() {
    var sortBy = req.body.sortBy || 'sell_staff_name';
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
      sortBy = 's.`display_name`';
    }

var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir;

    return db.queryArray(sql, whereCond).then(function(rows) {
      $scope.rows = rows;
    });
  }


  getRows().then(function() {
    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "CommissionOpenList", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/installment_commission_open_list_'+id+'.xlsx';
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
