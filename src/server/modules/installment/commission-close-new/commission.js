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
    contract_amount: {name:"count(c.id)", type:'number',having:true}
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

  var mainQuery = "SELECT sh.name shop_name  "
    + ",s.display_name, sum(r.cost_term) cost_term, sum(r.amount) amount "
    + ",sum(r.amount) - sum(r.cost_term) profit "
    + ",count(c.id) contract_amount "
    + "from receipt r "
    + "inner join contract c on r.ref = c.id "
    + "inner join staff s on s.id = r.finance_staff "
    + "inner join shop sh on sh.id = r.shop_id "
    + "where r.shop_id = 177 AND c.close_date >= :date_from AND c.close_date < :date_to  "
    + " and c.current_status in ('CLOSE_NORMAL','CLOSE_CONFISCATE','CLOSE_RETURN') ";

  var whereCond = {
    date_from: helper.dateToString(dateFrom),
    date_to: helper.dateToString(dateTo)
  };

  console.log('datefrom=',date_from);
  console.log('dateto=',date_to);

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
  mainQuery += ' group by r.finance_staff ';
  if (having.length > 0) {
    mainQuery += ' HAVING ' + having.join(' AND ');
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
    var sortBy = req.body.sortBy || 'shop';
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
      sortBy = 'sh.code';
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
    shops: []
  };

  var getShop = function() {
    var sql = "SELECT DISTINCT sh.id, sh.code, sh.name "
      + "FROM contract c JOIN shop sh ON c.shop_id=sh.id "
      + "WHERE close_date >= :date_from AND close_date < :date_to "
      + "ORDER BY sh.code";
    var date_from = req.body.term_year + '-' + req.body.term_month + '-01';
    var date_to = helper.dateToString(new Date(parseInt(req.body.term_year), parseInt(req.body.term_month), 1));
    return db.query(sql, {date_from:date_from, date_to:date_to}).then(function(rows) {
      $scope.shops = rows;
    });
  }
  q.all([
    getShop()
  ]).then(function() {
    res.send({
      status:true,
      shops: $scope.shops
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

    var sql =  "SELECT c.code, c.close_date, c.product_detail product, "
      + "c.total_paid, c.balance, c.cost, c.install_cost, c.fee, c.total_paid-c.cost-c.install_cost-c.fee profit, "
      + "c.comm_close_payment_id, c.closeca_staff_percent staff_pct, c.closeca_staff_amount staff_amount, "
      + "c.current_status status "
      + "FROM contract c "
      + "WHERE c.current_status IN ('CLOSE_CANCEL','CLOSE_NORMAL','CLOSE_RETURN','CLOSE_CONFISCATE','CLOSE_BAD_DEBT') "
      + "  AND c.shop_id=:shop_id "
      + "  AND c.close_date >= :date_from AND close_date < :date_to "
      + "  AND c.type='NORMAL' ";
    console.log(sql, {
      shop_id: req.body.shop_id,
      date_from: date_from,
      date_to: date_to
    });
    return db.query(sql, {
      shop_id: req.body.shop_id,
      date_from: date_from,
      date_to: date_to
    }).then(function(rows) {
      $scope.contracts = rows;
    });
  };

  var getCommissions = function() {
    var sql = "SELECT * FROM commission_close_contract "
      + "WHERE shop_id=:shop_id "
      + "  AND summary_period >= :period "
      + "ORDER BY paid_period DESC";
    var period = (parseInt(req.body.term_year)-2)+'/01';
    return db.queryArray(sql, {
      shop_id: req.body.shop_id,
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
      + "profit_amount, paid_pct, paid_amount, authorized_date, remark) "
      + "VALUES(:staff_id, :summary_period, :paid_period, :num_contract, :profit_amount, "
      + ":paid_pct, :paid_amount, :authorized_date, :remark)";
    return db.query(sql, data).then(function(result) {
      $scope.comm_open_payment_id = result.insertId;
    });
  };

  var updateContractCommissions = function() {
    var sql = "UPDATE contract SET comm_open_payment_id=:comm_open_payment_id "
      + "WHERE id IN (" + data.contracts.join(',') + ")";
    return db.query(sql, {comm_open_payment_id:$scope.comm_open_payment_id});
  };

  db.beginTransaction()
    .then(saveCommissionPayment)
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

  console.log(mainQuery);


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
