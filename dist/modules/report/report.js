var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var conn        = require('../../lib/db');
var router      = express.Router();
var helper      = require('../../lib/helper');
var fs          = require('fs');
var nsReport    = require('../../lib/nsreport');
var xlsx        = require('node-xlsx');

var receiptFields = {
  name:{name:'sh.name'},
  code:{name:'r.code'},
  pay_date: {name:'r.pay_date', type:'daterange'},
  display_name: {name:"s.display_name"},
  cost_term: {name:'r.cost_term',type:'number'},
  amount: {name:'r.amount', type:'number'},
  profit: {name:'(r.amount-r.cost_term)', type:'number'},
  paid_period: {name:'cr.paid_period'},
  shop: {name:'sh.id'}
};

var contractFields = {
  shop_name:{name:'sh.name'},
  contract_code:{name:'c.code'},
  sell_staff:{name:'s.display_name'},
  sign_date:{name:'c.sign_date', type:'daterange'},
  sell_id:{name:'c.sell_id'},
  cus_name:{name:'concat(c.cus_firstname,\' \',c.cus_lastname)'},
  product_detail:{name:'c.product_detail'},
  product_serial:{name:'c.product_serial'},
  total_price:{name:'c.total_price', type:'number'},
  cost:{name:'c.cost', type:'number'},
  install_cost:{name:'c.install_cost', type:'number'},
  fee:{name:'c.fee', type:'number'},
  profit:{name:'(c.total_price-(c.cost+c.install_cost+c.fee))', type:'number'},
  paid_period:{name:'cc.paid_period'},
  shop: {name:'sh.id'}
};

router.post('/getBranch', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  q.all([
    (function() {
      var query = "SELECT id AS value, concat(code, ' ', name) AS text FROM shop WHERE is_active='YES' ORDER BY code";
      return db.query(query).then(function(rows) {
          $scope.branch = ([ { value: 'ALL', text: 'ALL' } ]).concat(rows);
        });
    })()
  ]).then(function() {
    res.send({ status:true, data: { branch: $scope.branch } });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  })
});


router.post('/export', [bodyParser.json()], function(req, res) {

  try {
    var db = conn.connect();
    var $scope = {};


    var param = req.body.data;

    for (var key in param) {
      if(key !== 'display_name' && key !== 'report_name') {
        if(param[key] === 'ALL') param[key] = null;
        if(param[key] != null) param[key] = "'"+param[key]+"'";
      }
    }


    var PrepareReport = function(){
      var dfd = q.defer();
      var param_value = '';

      console.log(param);
      switch(param.report_name)
      {
        case 'income_customer':
          param_value += param.date_from+","+param.date_to+","+param.branch;
          break;
        case 'income_customer_expect':
          param_value += param.date_from+","+param.date_to+","+param.branch;
          break;
        case 'summary':
          param_value += param.date_from+","+param.date_to+","+param.branch;
          break;
        case 'product_branch':
          param_value += param.date_from+","+param.date_to+","+param.branch;
          break;
        case 'debtor_ca':
          param_value += param.date_from+","+param.date_to+",null";
          break;
        case 'debtor_ca_staff':
          param_value += param.date_from+","+param.date_to+",null";
          break;
        case 'debtor_per_day':
          param.day = parseInt(param.day) == NaN ? 0 : param.day;
          param_value += "'"+param.year.replace(/'/ig,'')+'-'+("0"+parseInt(param.month.replace(/'/ig,''))).slice(-2)+"',"+param.day;
          break;
        case 'debtor_per_year':
          var from = "'"+param.year.replace(/'/ig,'')+"-01-01'";
          var to = "'"+param.year.replace(/'/ig,'')+"-12-31'";
          param_value += from+","+to;
          break;  "'1'"
        case 'summary_installment':
          param_value += param.year_all+","+param.branch;
          break;
        case 'summary_debtor':
          param_value += param.date+","+param.date;
          break;
        case 'summary_ca':
          var from = "'"+param.year.replace(/'/ig,'')+"-01-01'";
          var to = "'"+param.year.replace(/'/ig,'')+"-12-31'";
          param_value += from+","+to;
          break;
        case 'commission_expense':
          param_value += "'"+param.year.replace(/'/ig,'')+'-'+("0"+parseInt(param.month.replace(/'/ig,''))).slice(-2)+"'";
          break;
        case 'table_summary_ca':
          param_value += "'"+param.year.replace(/'/ig,'')+'-'+("0"+parseInt(param.month.replace(/'/ig,''))).slice(-2)+"'";
          break;
        case 'table_summary_r':
          param_value += "'"+param.year.replace(/'/ig,'')+'-'+("0"+parseInt(param.month.replace(/'/ig,''))).slice(-2)+"'";
          break;
      }

      param_value = "call report_" + param.report_name + '('+param_value+')';
      console.log('Export ::', param_value);

      db.query(param_value).then(function(rows) {

        if(rows[0].length != 0) {
          console.log('switch', param.report_name);
          switch(param.report_name)
          {
            case 'debtor_per_year':
              var data = [];
              var item = {
                percent: 0.00, 1:0.00, 2:0.00, 3:0.00, 4:0.00, 5:0.00,
                6:0.00, 7:0.00, 8:0.00, 9:0.00, 10:0.00, 11:0.00, 12:0.00
              };

              var l = 1, group_by = '', percent = 0.00, ItemCount = 0, iRow = rows[0];
              for (var i=0; i<iRow.length;i++)
              {


                var IsItem = false;
                if(i == iRow.length - 1) {
                  IsItem = true;
                } else {
                  if(group_by !== iRow[i+1].group_by) IsItem = true;
                  group_by = iRow[i+1].group_by;
                }

                item.due_year = iRow[i].due_year;
                item.name = iRow[i].name;
                item.display_name = iRow[i].display_name;
                item[iRow[i].mon] = iRow[i].ca;
                if(iRow[i].ca > 0.00) {
                  percent += iRow[i].ca;
                  ItemCount++;
                }

                if(IsItem && i > 0) {
                  console.log('item', l, item[11]);

                  item.row = l;
                  if(ItemCount > 0) item.percent = percent / ItemCount;
                  data.push(item);
                  ItemCount = 0.00;
                  percent = 0.00;
                  item = {
                    percent: 0.00, 1:0.00, 2:0.00, 3:0.00, 4:0.00, 5:0.00,
                    6:0.00, 7:0.00, 8:0.00, 9:0.00, 10:0.00, 11:0.00, 12:0.00
                  }
                  l++;
                }
              }
              rows[0] = data;
              break;
            case 'summary_ca':
              var data = [];

              var l = 1, group_by = '', group_year = '', iRow = rows[0];
              for (var i=0; i<iRow.length;i++)
              {
                // if(group_year !== iRow[i].due_year) IsGroup = true; else  IsGroup = false;
                // group_year = iRow[i].due_year;
                var IsGroup = false;
                console.log('group_by', group_by, iRow[i].mon);
                if(i == iRow.length - 1) {
                  IsGroup = true;
                } else {
                  if(group_by !== iRow[i+1].group_by) IsGroup = true;
                  group_by = iRow[i+1].group_by;
                }

                if(IsGroup && i > 0)
                {
                  console.log('IsGroup', IsGroup);
                  var item = {};
                  for (var y=1; y<=12;y++)
                  {
                    item.name = iRow[i].name.toString();
                    item.due_year = iRow[i].due_year.toString();
                    var month = getTHMonth(y);
                    item['_close'+y] = 0.00;
                    item['_r'+y] = 0.00;
                    item['_ca'+y] = 0.00;
                    item['_r_close'+y] = 0.00;
                    item['_ca_close'+y] = 0.00;
                    item['_diff'+y] = 0.00;
                    item['month'+y] = month+' '+(item.due_year.substr(2,2));

                    if(y == 12) {
                      item.group_by = iRow[i].group_by.toString();
                      item.group_row = l;

                      data.push(item);
                      item = {};
                    }
                  }
                  l++;
                }
              }
              for (var i=0; i<data.length;i++)
              {
                for (var l=0; l<iRow.length;l++)
                {
                  var key = iRow[l].mon;
                  if(data[i].group_by === iRow[l].group_by) {
                    data[i]['_close'+key] = iRow[l]._close;
                    data[i]['_ca'+key] = iRow[l]._ca;
                    data[i]['_r_close'+key] = iRow[l]._r_close;
                    data[i]['_ca_close'+key] = iRow[l]._ca_close;
                    data[i]['_diff'+key] = iRow[l]._diff;
                  }
                }
              }

              rows[0] = data;
              break;
            case 'table_summary_ca':
              var data = [];
              var iRow = rows[0], totalRows = 0;
              for (var l=0; l<iRow.length;l++)
              {
                totalRows += parseInt(rows[0][l].value);
              }
              for (var l=0; l<iRow.length;l++)
              {
                console.log(iRow[l].value);
                rows[0][l].percent = parseInt(iRow[l].value) * 100 / totalRows;
              }
              break;
            case 'table_summary_r':
              var iRow = rows[0], totalRows = 0;
              for (var l=0; l<iRow.length;l++)
              {
                totalRows += parseInt(rows[0][l].value);
              }
              for (var l=0; l<iRow.length;l++)
              {
                rows[0][l].percent = parseInt(iRow[l].value) * 100 / totalRows;
              }
              break;
          }

          $scope.data = rows[0];
          dfd.resolve();
        } else {
          dfd.reject();
        }
      });
      return dfd.promise;
    }

    var getTHMonth = function(month){
        var r = '';
        switch(month)
        {
           case 1: r = 'ม.ค.'; break;
           case 2: r = 'ก.พ.'; break;
           case 3: r = 'มี.ค.'; break;
           case 4: r = 'เม.ย.'; break;
           case 5: r = 'พ.ค.'; break;
           case 6: r = 'มิ.ย.'; break;
           case 7: r = 'ก.ค.'; break;
           case 8: r = 'ส.ค.'; break;
           case 9: r = 'ก.ย.'; break;
           case 10: r = 'ต.ค.'; break;
           case 11: r = 'พ.ย.'; break;
           case 12: r = 'ธ.ค.'; break;
        }
        return r;
    }

    var RenderReport = function() {

      var dfd = q.defer();
      $scope.pdfFile = param.report_name +'_'+ helper.newUUID() + '.pdf';

      var pdfFullPath = path.normalize(__dirname + '/../../public/output/' + $scope.pdfFile);

      // console.log(pdfFullPath);

      // var pathjson = "D:/SeStock/Services/reports/sources/data/";
      // fs.exists(pathjson, function(exists) {
      //   if (exists) fs.writeFile(pathjson+param.report_name+'.json', JSON.stringify($scope.data), function(err) { });
      // });
      console.log('path', './items/collec_'+param.report_name+'.js');

      var stream = {};
      if (param.report_name == 'table_summary_r__' || param.report_name == 'table_summary_ca__')
      {
        console.log('nsGraph:', param.report_name);
        var report  = new nsGraph();
        var doc = report.createDocument({
          margin: [20, 20, 20, 20]
        }, $scope.data);
        stream = fs.createWriteStream(pdfFullPath);
        doc.pipe(stream);
        doc.end();
      } else {

        $scope.collec = require('./items/collec_'+param.report_name+'.js')
        $scope.collec.display_name = 'พิมพ์โดย '+param.display_name;

        var d = new Date();
        var t = d.getHours()+':'+('0'+d.getMinutes()).slice(-2)+':'+('0'+d.getSeconds()).slice(-2);
        $scope.collec.print_date = 'วันที่ '+d.getDate()+' '+getTHMonth(d.getMonth()+1)+' '+d.getFullYear()+' เวลา '+t;


        var report  = new nsReport();
        var doc = report.createDocument($scope.collec, $scope.data);
        var stream = fs.createWriteStream(pdfFullPath);
        doc.pipe(stream);
        doc.end();
      }

      stream.on('finish', function() {
        console.log('success');
        dfd.resolve();
      });

      stream.on('error', function() {
        console.log('fail');
        dfd.reject();
      });
      return dfd.promise;
    }

    // Response xhr.
    PrepareReport().then(RenderReport).then(function() {
      res.send({ status:true, data: { exports: 'output/'+$scope.pdfFile } })
    }).catch(function(e) {
      res.send({ status:false, error:e })
    });
  } catch(e){
     res.send({ status:false, error:e })
  }

});

router.post('/listclose', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var mainQuery = " select sh.name , r.code , s.display_name ,r.pay_date  "
                + " ,r.cost_term ,r.amount , cr.paid_period , cr.paid_amount "
                + " ,(r.amount-r.cost_term) profit  "
                + " from commission_close_receipt cr "
                + " inner join commission_close_detail cd on cr.id = cd.comm_id "
                + " inner join receipt r on r.id = cd.receipt_id "
                + " inner join staff s on s.id = r.finance_staff "
                + " inner join shop sh on sh.id = r.shop_id "
                + " where cr.status = 'PAID' ";
    // and current_status in ('NORMAL','DEBT')
  var cond = [];
  var hasJoin = false;
  console.log('keywords=',req.body.keywords);
  for(var fld in req.body.keywords) {
    var keyword = req.body.keywords[fld];
    if (typeof keyword === 'undefined') {
      continue;
    }
    keyword = keyword.trim();
    if (keyword == '') {
      continue;
    }
    if (typeof receiptFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(receiptFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    // if (fld=='shop'
    //     || fld=='shop_name') {
    //   hasJoin = true;
    // }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  var getCount = function() {
    var sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x ';
    return db.query(sql, {}).then(function(rows) {
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
      paid_amount:0
    };
    //sortBy = 'r.`' + sortBy + '`';
var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;
    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
    });
  }

  var getSumPaid = function(){
    mainQuery +=' group by cr.id ';
    var sql = 'SELECT sum(paid_amount) paid_amount FROM (' + mainQuery + ') x ';
    return db.query(sql, {}).then(function(rows) {
      if (rows.length==0) {
        $scope.paid_amount = 0;
      } else {
        $scope.paid_amount = rows[0].paid_amount;
      }
    });
  }

  q.all([
    getCount(),
    getRows(),
    getSumPaid()
  ]).then(function() {
      $scope.opt.totalRows = $scope.totalRows;
      $scope.opt.paid_amount = $scope.paid_amount;
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

router.post('/exportclose', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};
  var mainQuery = " select sh.name , r.code , cr.paid_period, s.display_name,r.pay_date "
                + " ,r.cost_term,r.amount "
                + " ,(r.amount-r.cost_term) profit "
                + " from commission_close_receipt cr "
                + " inner join commission_close_detail cd on cr.id = cd.comm_id "
                + " inner join receipt r on r.id = cd.receipt_id "
                + " inner join staff s on s.id = r.finance_staff "
                + " inner join shop sh on sh.id = r.shop_id "
                + " where cr.status = 'PAID' ";

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
    if (typeof receiptFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(receiptFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
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
      totalRows: 0
    };
    //sortBy = 'r.`' + sortBy + '`';
var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir;

    return db.queryArray(sql).then(function(rows) {
      var fld = {
             name: 'สาขา',
             code: 'เลขที่ใบเสร็จ',
             paid_period: 'เดือนที่จ่าย',
             display_name: 'ไฟแนนซ์',
             pay_date: 'วันที่ชำระเงิน',
             cost_term: 'ทุนประจำงวด',
             amount: 'ยอดเงินรับ',
             profit: 'กำไร'
           }

      rows.f = rows.f.map(function(row) {
         return fld[row];
       });
       $scope.rows = rows;
    });
  }

  getRows().then(function() {
    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListCommissionClose", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/commission_close_list_'+id+'.xlsx';
    fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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

router.post('/listopen', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var mainQuery = " select sh.name shop_name, c.code contract_code, s.display_name sell_staff,c.sign_date,c.sell_id   "
                  + " ,concat(c.cus_firstname,' ',c.cus_lastname) cus_name  "
                  + " ,c.product_detail,c.product_serial,c.total_price,c.cost,c.install_cost  "
                  + " ,c.fee, (c.total_price-(c.cost+c.install_cost+c.fee)) profit , c.id , cc.paid_period "
                  + " ,cc.paid_amount, cc.other_paid "
                  + " from commission_open_contract cc  "
                  + " inner join commission_open_detail cd on cc.id = cd.comm_id  "
                  + " inner join contract c on c.id = cd.contract_id  "
                  + " inner join staff s on s.id = c.sell_staff_id  "
                  + " inner join shop sh on sh.id = s.shop_id  "
                  + " where cc.status = 'PAID' ";

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
    if (typeof contractFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(contractFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
    // if (fld=='shop'
    //     || fld=='shop_name') {
    //   hasJoin = true;
    // }
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  var getCount = function() {
    var sql = 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x ';
    return db.query(sql, {}).then(function(rows) {
      if (rows.length==0) {
        $scope.totalRows = 0;
      } else {
        $scope.totalRows = rows[0].cnt;
      }
    });
  }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'sell_staff';
    var sortDir = req.body.sortDir || 'ASC';
    var limit = req.body.limit || 50;
    var page = req.body.page || 0;

    $scope.opt = {
      sortBy: sortBy,
      sortDir: sortDir,
      limit: limit,
      page: page,
      totalRows: 0,
      paid_amount:0
    };
    //sortBy = 'r.`' + sortBy + '`';
var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir +
      ' LIMIT ' + (page * limit) + ', ' + limit;

    return db.queryArray(sql).then(function(rows) {
      $scope.rows = rows;
    });
  }

  var getSumPaid = function(){
    mainQuery +=' group by cc.id ';
    var sql = 'SELECT sum(paid_amount) paid_amount FROM (' + mainQuery + ') x ';
    return db.query(sql, {}).then(function(rows) {
      if (rows.length==0) {
        $scope.paid_amount = 0;
      } else {
        $scope.paid_amount = rows[0].paid_amount;
      }
    });
  }

  q.all([
    getCount(),
    getRows(),
    getSumPaid()
  ]).then(function() {
      $scope.opt.totalRows = $scope.totalRows;
      $scope.opt.paid_amount = $scope.paid_amount;
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

router.post('/exportopen', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var mainQuery = " select sh.name shop_name, c.code contract_code, cc.paid_period, s.display_name sell_staff,c.sign_date,c.sell_id   "
                  + " ,concat(c.cus_firstname,' ',c.cus_lastname) cus_name  "
                  + " ,c.product_detail,c.product_serial,c.total_price,c.cost,c.install_cost  "
                  + " ,c.fee, (c.total_price-(c.cost+c.install_cost+c.fee)) profit , c.id  "
                  + " ,cc.paid_pct ,((c.total_price-(c.cost+c.install_cost+c.fee)) * cc.paid_pct)/100 total_paid "
                  + " from commission_open_contract cc  "
                  + " inner join commission_open_detail cd on cc.id = cd.comm_id  "
                  + " inner join contract c on c.id = cd.contract_id  "
                  + " inner join staff s on s.id = c.sell_staff_id  "
                  + " inner join shop sh on sh.id = s.shop_id  "
                  + " where cc.status = 'PAID' ";

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
    if (typeof contractFields[fld]==='undefined') {
      continue;
    }
    var tmp = helper.genCond(contractFields[fld], keyword, false);
    if (tmp==='') {
      continue;
    }
    cond.push(tmp);
  }
  if (cond.length > 0) {
    mainQuery += ' AND ' + cond.join(' AND ');
  }

  var getRows = function() {
    var sortBy = req.body.sortBy || 'sell_staff';
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
    //sortBy = 'r.`' + sortBy + '`';
var sql = mainQuery +
      ' ORDER BY ' + sortBy + ' ' + sortDir;

    return db.queryArray(sql).then(function(rows) {

      var fld = {
             shop_name: 'สาขา',
             contract_code: 'เลขที่สัญญา',
             paid_period: 'เดือนที่จ่าย',
             sell_staff: 'พนักงานขาย',
             sign_date: 'วันที่ขาย',
             cus_name: 'ผู้เช่าซื้อ',
             product_detail: 'สินค้า',
             product_serial: 'Serial',
             total_price: 'ราคาขาย',
             cost: 'ทุนพนักงาน',
             install_cost: 'ค่าติดตั้ง',
             fee: 'ค่าทำสัญญา',
             profit: 'กำไร',
             paid_pct:'%',
             total_paid:'ยอดจ่าย'
           }

           rows.f = rows.f.map(function(row) {
              return fld[row];
            });
           $scope.rows = rows;

    });
  }

  getRows().then(function() {
    var rows = $scope.rows.d;
    rows.unshift($scope.rows.f);
    var buffer = xlsx.build([{name: "ListCommissionOpen", data: rows}]);
    var id = helper.newUUID();
    var fname = '/output/commission_open_list_'+id+'.xlsx';
    fs.writeFileSync(path.normalize(__dirname + '/../../public'+fname), buffer);
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
