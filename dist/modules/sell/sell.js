var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var conn        = require('../../lib/db');
var dbo         = require('../../lib/db_ora');
var oraConn     = require('../../lib/oracle');
var router      = express.Router();
var helper      = require('../../lib/helper');
var moment      = require('moment');

router.post('/init', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {}
  // var sql = "SELECT COUNT(*) status_selldate FROM cash_daily_on_date d INNER JOIN cash_daily c "
  // sql += "ON c.cash_daily_on_date_id = d.id WHERE c.status in ('รอปิดกะ','เปิดให้แก้ไข') and c.shop_id = 177"
  // db.query(sql).then(function(rows) {
  //   res.send({ 
  //     status: true, 
  //     data: {
  //       sell_date: (rows[0].status_selldate.toString() === '0' ? true : false),
  //       staff: req.session.data.staff
  //     }
  //   });
  // }).catch(function(e) {
  //   res.send({ status:false, error:e });
  // });

  var getStatusSellDate = function() {
    var sql = " select case when min(cod.on_date) <> curdate() then 'Y' " 
              +" else 'N' end link_cashdaily " 
              +" from cash_daily_on_date cod " 
              +" left join cash_daily cd on cd.cash_daily_on_date_id = cod.id " 
              +" where shop_id = :shop_id " 
              +" and cd.status = 'รอปิดกะ'";

    return db.query(sql, req.body).then(function(rows) {
      $scope.sell_date = (rows[0].link_cashdaily.toString() === 'Y' ? true : false);
      $scope.dep_code = req.session.data.staff.dep_code;
    });
  };

  var getPaymentOption = function() {
    var sql = "SELECT id, name, credit_card FROM payment_option";
    return dbo.query(sql, {}).then(function(rows) {
      $scope.payment = rows;
    });
  };
  var getPaymentCreditcard = function() {
    var sql = "SELECT ID, CARD_NAME, BANK_CHARGE, CLIENT_CHARGE FROM credit_card WHERE STATUS='ACTIVE'";
    return dbo.query(sql, {}).then(function(rows) {
      $scope.creditcard = rows;
    });
  };

  var all = [
    getStatusSellDate(),
    getPaymentOption(),
    getPaymentCreditcard()
  ];

  q.all(all).then(function() {
    res.send({ status:true, data: $scope });
  }).catch(function(e) {
    res.send({ status:false, error:e });
  });

});

router.post('/search-customer', [bodyParser.json()], function(req, res) {
  var $scope = {};

  dbo.query("SELECT name, address, tel FROM company WHERE id = :company_id", { company_id: req.body.company_id }).then(function(data){
    $scope = data[0] || {};
    var sql = "select h1.balance from HISTORY_CASHPLEDGE h1 , "+ 
              "(select max(h2.id) id "+ 
              "from HISTORY_CASHPLEDGE h2, (select id from shop where mysqlshopid = :shop_id) sh "+ 
              "where h2.shop_id = sh.id and h2.company_id = :company_id "+
              ") c where h1.id = c.id";

    return dbo.query(sql, { company_id: req.body.company_id, shop_id: req.body.shop_id });
  }).then(function(data){
    $scope.no = '';
    $scope.balance = data[0] || "0.00";
    res.send({ success:true, data: $scope });
  }).catch(function(){
    res.send({ success:false, data: [] });
  });
});

router.post('/search-product', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var sql = "SELECT REPLACE(REPLACE(p.DESCRIPTION, CHR(10),''), CHR(13), '') name, s.spec, "+  
            "p.installation_yn, p.installation_cost, p.qty_yn, qty,"+ 
            "p.id product_id, s.company_id, s.barcode, s.serial, "+ 
            "s.cost, s.vat, s.status, s.cost_type, TO_CHAR(s.date_in, 'yyyy/mm/dd') date_in, s.po_cost, p.price "+ 
            "FROM stock_shop s, product p, (select id from shop where mysqlshopid = :shop_id) sh "+ 
            "WHERE (s.barcode = :code OR s.serial = :code) AND s.shop_id = sh.id and "+ 
            "s.PRODUCT_ID = p.id ";
  dbo.query(sql, { code: req.body.code.trim(), shop_id:req.body.shop_id }).then(function(data){
    res.send({ success:true, data: data });
  }).catch(function(){
    res.send({ success:false, data: [] });
  });
});


router.post('/checkOndate', [bodyParser.json()], function(req, res) {
  var db = conn.connect();
  var $scope = {};

  var checkOndate = function() {
    var sql = " select cd.status "
              +" from cash_daily_on_date cod "
              +" left join cash_daily cd on cd.cash_daily_on_date_id = cod.id "
              +" where shop_id = :shop_id "
              +" and cod.on_date = :date ";

    return db.query(sql, req.body).then(function(rows) {

      if (rows.length===0) {
        $scope.flagSave = true;
      }else{
        if (rows[0].status == 'รอปิดกะ' || rows[0].status == 'เปิดให้แก้ไข') {
          $scope.flagSave = false;
        }else{
          $scope.flagSave = true;
        }
      }
    });
  }

  q.all([
    checkOndate()
  ]).then(function(){
    res.send({
      status:true,
      data: {
        date: req.body.date,
        flagSave: $scope.flagSave
      }
    });
  }).catch(function(e){
    console.log(e);
    res.send({
      status:false,
      error:e
    });
  });

});

var fields = {
  sell_date:{name:'s.sell_date',type:'daterange'},
  receipt_no:{name:'s.receipt_no'},
  company_name:{name:'c.name'},
  product_description:{name:'p.description'},
  product_serial:{name:'sd.serial'},
  down_payment:{name:'(nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,0))', type:'number'},
  remain_price:{name:'(sd3.main_price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,0))',type:'number'},
  shop_name:{name:'s.shop_id',type:'number'},
  finance_staff:{name:'fst.fullname'},
  sales_staff:{name:'sst.fullname'},
  shop_name:{name:'sh.name'},
  shop:{name:'sh.code'},
  flag:{name:"decode(fst.nickname, 'สดพิเศษ', '*', '')"},
  return_status:{name:'r.return_status'}
};

router.post('/list', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};

    var fldList = "s.id, s.sell_date, s.receipt_no, sh.name shop_name, "
      + "s.contract_ref, c.name company_name, "
      + "p.description product_description, sd.serial product_serial, "
      + "sd2.price, sd2.cost, sd2.install_cost,sd2.price main_price, "
      + "nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,0)+sd2.down_payment down_payment, "
      + "sd2.price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,0)-sd2.down_payment remain_price, "
      + "sst.fullname sales_staff, fst.fullname finance_staff, "
      + "case when fst.nickname like '%'||:nickname||'%' then '*' else '' end flag"

    var mainQuery = "SELECT %FIELD_LIST% "
      + "FROM sell s "
      + "        JOIN shop sh ON s.shop_id=sh.id "
      + "        JOIN company c ON s.company_id=c.id "
      + "        LEFT JOIN staff sst ON s.sales_staff_id=sst.id "
      + "        LEFT JOIN staff fst ON s.finance_staff_id=fst.id "
      + "        JOIN ( "
      + "          SELECT sell_id, sum(case when price >= 0 then price else 0 end) AS price, SUM(cost) cost, "
      + "            SUM(installation_cost) install_cost, "
      + "            SUM(case when price < 0 then -price else 0 end) down_payment ,max(price) max_price "
      + "          FROM sell_detail "
      + "          GROUP BY sell_id "
      + "        ) sd2 ON sd2.sell_id=s.id "
      + "        JOIN sell_detail sd ON sd.sell_id=s.id  "
      + "        and sd.price = sd2.max_price   "
      + "        JOIN product p ON sd.product_id=p.id WHERE 1=1 "
      // + "WHERE s.status='DEBIT' AND s.contract_id=0 "

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
      var tmp = helper.genCond(fields[fld], keyword, true);
      if (tmp==='') {
        continue;
      }
      cond.push(tmp);

      if (fld=='remain_price'
          || fld=='down_payment') {
        hasJoin = true;
      }
    }
    if (cond.length > 0) {
      mainQuery += ' AND ' + cond.join(' AND ');
    }

    var getCount = function() {
      var sql = "SELECT count(s.id) AS cnt  "
        + "FROM sell s "
        + "        JOIN shop sh ON s.shop_id=sh.id "
        + "        JOIN company c ON s.company_id=c.id "
        + "        LEFT JOIN staff sst ON s.sales_staff_id=sst.id "
        + "        LEFT JOIN staff fst ON s.finance_staff_id=fst.id "
        + "        JOIN sell_detail sd ON sd.sell_id=s.id  "
        + "        JOIN(  "
        + "            select max(price) m_price,sell_id from sell_detail  "
        + "          group by sell_id  "
        + "         )sd3 on sd.price = sd3.m_price and sd3.sell_id = s.id    "
        + "        JOIN product p ON sd.product_id=p.id WHERE 1=1 "
        // + "WHERE s.status='DEBIT' AND s.contract_id=0 "
     if (hasJoin) {
        sql = 'SELECT COUNT(*) AS cnt FROM ('
          + mainQuery.replace('%FIELD_LIST%', '1') + ') x';
     } else if (cond.length > 0) {
         sql += ' AND ' + cond.join(' AND ');
     }

      //console.log('COUNT QUERY:', sql);

      return oraConn.query(oradb, sql, {}).then(function(result) {
        if (result.rows.length==0) {
          $scope.totalRows = 0;
        } else {
          $scope.totalRows = result.rows[0][0];
        }
      });
    }

    var getRows = function() {
      var sortBy = req.body.sortBy || 'sell_date';
      var sortDir = req.body.sortDir || 'DESC';
      var limit = req.body.limit || 50;
      var page = parseInt(req.body.page || 0);
      var sql;
      var sortBy2;

      $scope.opt = {
        sortBy: sortBy,
        sortDir: sortDir,
        limit: limit,
        page: page,
        totalRows: 0
      };

      if (fields[sortBy]) {
        sortBy2 = fields[sortBy];
      } else {
        sortBy2 = "s.sell_date";
      }


      sql = " select * " 
        + " from ( " 
        + " select a.*, rownum rnum " 
        + " from ( select " 
        + mainQuery.substr(7).replace('%FIELD_LIST%', fldList)
        + " ORDER BY " + sortBy + " " + sortDir 
        + " ) a " 
        + " where rownum <= " + ((page+1)*limit) 
        + ") " 
        + " where rnum >= " + (page*limit+1) + " " 
      // console.log('QUERY:', sql);

      return oraConn.query(oradb, sql, {nickname:'สดพิเศษ'}).then(function(result) {
        $scope.rows = {
          d: result.rows,
          f: result.metaData.map(function(fld) {
            return fld.name.toLowerCase();
          })
        };
      });
    }

    // MAIN QUERY
    q.all([
      getCount(),
      getRows()
    ]).then(function() {
      oraConn.close(oradb);
      $scope.opt.totalRows = $scope.totalRows;
      res.send({
        status: true,
        data: $scope.rows,
        opt: $scope.opt
      });
    }).catch(function(e) {
      console.log('catch 1', e);
      oraConn.close(oradb);
      res.send({
        status: false,
        error: e
      });
    });
  }).catch(function(e) {
    console.log('catch 2', e);
    res.send({
      status:false,
      error:e
    });
  });
});






router.post('/save', [bodyParser.json()], function(req, res) {
  var $scope = {};
  var db = conn.connect();

  var checkOndate = function() {
    var sql = " select cd.status "
              +" from cash_daily_on_date cod "
              +" left join cash_daily cd on cd.cash_daily_on_date_id = cod.id "
              +" where shop_id = :shop_id "
              +" and cod.on_date = :date ";

    return db.query(sql, { shop_id: req.body.sell.shop_id, date: req.body.sell.sell_date }).then(function(rows) {
      if (rows.length===0) {
        throw 'ex.selldate.vaild';
      }else{
        if (rows[0].status !== 'รอปิดกะ' && rows[0].status !== 'เปิดให้แก้ไข') {
          throw 'ex.selldate.vaild';
        }
      }
    });
  }



  oraConn.connect().then(function(oradb) {

    var checkStockIn = function(item){
      var sql = "SELECT COUNT(id) item FROM stock_shop WHERE barcode = :barcode AND qty >= :qty" ;

      return oraConn.query(oradb, sql, { barcode: item.barcode, qty: item.qty }).then(function(data){
        var cItem = oraConn.convert(data)[0].item || 0;
        if(cItem == 0) throw 'ไม่พบสินค้า '+item.name+' ในสต๊อก';
      });
    }

    var SaveSellDetail = function(item){
      var sell = req.body.sell;

      var sql = "insert into sell_detail (id,sell_id,product_id,company_id,shop_id,barcode "
                +" ,serial,spec,cost,price,vat,status,qty,qty_yn,installation_cost,installation_yn "
                +" ,from_return,cost_type,po_cost,stockin_date,installation_status) "
                +" values(  "
                +"  (selldetail_id.NEXTVAL),:sell_id,:product_id,:company_id,:shop_id,:barcode  "
                +"  ,:serial,:spec,:cost,:price,:vat,:status,:qty,:qty_yn,:installation_cost,:installation_yn "
                +" ,:from_return,:cost_type,:po_cost,TO_DATE(:date_in, 'yyyy/mm/dd'),:installation_status) ";

      item = {
        sell_id: $scope.sell_id,
        shop_id: sell.shop_id,
        company_id: item.company_id,
        product_id: item.product_id,
        spec: item.spec,
        installation_yn: item.installation_yn,
        installation_cost: item.installation_cost,
        qty_yn: item.qty_yn,
        qty: item.qty,
        from_return: null,
        barcode: item.barcode,
        serial: item.serial,
        cost: item.cost,
        vat: item.vat,
        status: item.status,
        cost_type: item.cost_type,
        date_in: item.date_in,
        po_cost: item.po_cost,
        price: parseFloat(item.price),
        installation_status: item.installation_status
      }
      return oraConn.query(oradb, sql, item, false)
    }


    var SaveStockCus = function(item){
      var sell = req.body.sell;

      var sql = "insert into stock_cus (id, product_id, company_id, shop_id, date_in, ref_id, ref_master"
                +" , barcode, serial, spec, cost, price, vat, status, qty, qty_yn, po_cost) "
                +" values(  "
                +"  (stockcus_id.NEXTVAL),:product_id,:company_id,:shop_id, TO_DATE(:date_in, 'yyyy/mm/dd') "
                +"  ,:ref_id,'SALES',:barcode,:serial,:spec,:cost,:price,:vat,:status,:qty,:qty_yn,:po_cost) ";

      item = {
        ref_id: $scope.sell_id,
        shop_id: sell.shop_id,
        company_id: item.company_id,
        product_id: item.product_id,
        spec: item.spec,
        qty_yn: item.qty_yn,
        qty: item.qty,
        barcode: item.barcode,
        serial: item.serial,
        cost: item.cost,
        vat: item.vat,
        status: item.status,
        date_in: item.date_in,
        po_cost: item.po_cost,
        price: parseFloat(item.price),
      }
      return oraConn.query(oradb, sql, item, false)
    }


    var UpdateStockShop = function(item){
      var sell = req.body.sell;
      var sql = '';

      sql = 'select count(id) id from STOCK_SHOP where barcode = :barcode and qty > :qty';
      return oraConn.query(oradb, sql, { qty: item.qty, barcode: item.barcode }, false).then(function(data){
        console.log('UpdateStockShop', oraConn.convert(data)[0]);
        if(oraConn.convert(data)[0].id > 0) { // UPDATE
          return oraConn.query(oradb, 'update STOCK_SHOP set qty = qty-:qty where barcode = :barcode', { barcode: item.barcode, qty: item.qty }, false);
        } else {
          return oraConn.query(oradb, 'delete from stock_shop WHERE barcode = :barcode', { barcode: item.barcode }, false);
        }
      });
    }

    var SaveSellPayment = function(item){
      // { desc1: null,
      //   ref_id: null,
      //   payment_option: { id: 2, name: 'เงินโอน', credit_card: 'N' },
      //   credit_option: { id: 301, card_name: 'ส่วนลดไฟแนนซ์', bank_charge: null, client_charge: 0 },
      //   name: 'เงินโอน',
      //   sell_id: 0,
      //   amount: '5,000.00',
      //   desc2: '1',
      //   id: 0 }
      var sell = req.body.sell;

      var sql = "insert into sell_payment (id, sell_id, payment_option_id, amount, ref_id"
                +", desc1, desc2, bank_charge, client_charge)"
                +" values (  "
                +"(sellpayment_id.NEXTVAL), :sell_id, :payment_option_id, :amount, :ref_id "
                +",:desc1, :desc2, :bank_charge, :client_charge) ";

      item = {
        sell_id: $scope.sell_id,
        payment_option_id: item.payment_option.id,
        ref_id: item.payment_option.id == 3 ? item.credit_option.id : null,
        amount: item.amount,
        desc1: item.payment_option.id == 3 ? item.credit_option.card_name : null,
        desc2: item.desc2,
        bank_charge: item.payment_option.id == 3 ? item.credit_option.bank_charge : null,
        client_charge: item.payment_option.id == 3 ? item.credit_option.client_charge : null
      }
      console.log(item);
      return oraConn.query(oradb, sql, item, false)     
    }

    var SaveHistoryCash = function(item){
      // { desc1: null,
      //   ref_id: null,
      //   payment_option: { id: 2, name: 'เงินโอน', credit_card: 'N' },
      //   name: 'เงินโอน',
      //   sell_id: 0,
      //   amount: '5,000.00',
      //   desc2: '1',
      //   id: 0 }


    }

    checkOndate().then(function(){
      var all = [];
      req.body.product.forEach(function(item){ all.push(checkStockIn(item)); });
      return q.all(all);
    }).then(function(){
      var sell = req.body.sell;
      var sql = " insert into sell (id,sell_date,sell_staff,shop_id "
                +" ,company_id,remark,status,cash,receipt_no,frequency,sales_staff_id, finance_staff_id,sell_type) "
                +" values(:id,TO_DATE(:sell_date,'yyyy/mm/dd'),:sell_staff,:shop_id"
                +",:company_id,:remark,:status,'0',:receipt_no,'1',:sales_staff_id,:finance_staff_id,:sell_type) ";

      return oraConn.query(oradb, "select sell_id.NEXTVAL id from dual", {}).then(function(dual){
        $scope.sell_id = oraConn.convert(dual)[0].id;
        return oraConn.query(oradb, sql, {
          id: $scope.sell_id,
          sell_date: sell.sell_date,
          sell_staff: sell.sell_staff,
          shop_id: sell.shop_id,
          company_id: sell.company_id,
          remark: sell.remark,
          status: sell.status,
          receipt_no: '',
          sales_staff_id: sell.sales_staff_id,
          finance_staff_id: sell.finance_staff_id,
          sell_type: sell.sell_type
        }, false);
      });

    }).then(function(){
      var all = [];
      var sell = req.body.sell;
      req.body.product.forEach(function(item){ 
        all.push(SaveSellDetail(item)); 
        all.push(SaveStockCus(item)); 
        all.push(UpdateStockShop(item)); 
      });
      req.body.payment.forEach(function(item){
        all.push(SaveSellPayment(item)); 
        if(item.payment_option.id == 6) {
          all.push(SaveHistoryCash(item)); 
        }
      });
      return q.all(all);
    }).then(function(){
      return oradb.rollback(function(){ console.log('save commit'); });
    }).then(function(){
      oraConn.close(oradb);
      res.send({ success:true, sell_id: $scope.sell_id });
    }).catch(function(ex){
      oradb.rollback(function(e){ 
        oraConn.close(oradb); 
        res.send({ status:false, error: (ex || 'undefined').toString() }); 
      });
    });

  }).catch(function(ex){
      oradb.rollback(function(e){ 
        oraConn.close(oradb); 
        res.send({ status:false, error: ex.toString() }); 
      });
  });

});

module.exports = router;