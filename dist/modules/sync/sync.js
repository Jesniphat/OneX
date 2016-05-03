var conn        = require('../../lib/db');
var oraConn     = require('../../lib/oracle');
var helper      = require('../../lib/helper');

var syncInterval = 30*1000;

var syncAll = function() {
  oraConn.connect().then(function(oradb) {
    var db = conn.connect();
    var $scope = {
      max_sell_id: 0
    };

    var getLastSellId = function() {
      return db.query('SELECT MAX(sell_id) max_sell_id FROM contract_pending').then(function(rows) {
        $scope.max_sell_id = rows[0].max_sell_id || 0;
        console.log('max_sell_id=', $scope.max_sell_id);
      });
    }

    var getSellInfo = function() {
      var sql = "SELECT s.id, s.sell_date, s.receipt_no, s.contract_ref, "
        + "sh.id shop_id, sh.code shop_code, sh.name shop_name, "
        + "c.id company_id, c.code company_code, c.name company_name, "
        + "p.id product_id, p.description, sd.serial, "
        + "sd2.price, sd2.cost, sd3.main_price, "
        + "nvl(s.cash,0)+nvl(s.cr_card,0)+nvl(s.tranfer,2) down_payment, "
        + "sd3.main_price-nvl(s.cash,0)-nvl(s.cr_card,0)-nvl(s.tranfer,2) remain_price, "
        + "sst.id sales_staff_id, fst.id finance_staff_id, "
        + "sst.fullname sales_staff, fst.fullname finance_staff "
        + "FROM sell s "
        + "        JOIN shop sh ON s.shop_id=sh.id "
        + "        JOIN company c ON s.company_id=c.id "
        + "        JOIN staff sst ON s.sales_staff_id=sst.id "
        + "        JOIN staff fst ON s.finance_staff_id=fst.id "
        + "        JOIN ( "
        + "          SELECT sell_id, sum(price) price, SUM(cost+installation_cost) cost "
        + "          FROM sell_detail "
        + "          GROUP BY sell_id "
        + "        ) sd2 ON sd2.sell_id=s.id "
        + "        JOIN ( "
        + "          SELECT sell_id, max(price) main_price "
        + "          FROM sell_detail "
        + "          GROUP BY sell_id "
        + "        ) sd3 ON sd3.sell_id=s.id "
        + "        JOIN sell_detail sd ON sd.sell_id=s.id AND sd.price=sd3.main_price "
        + "        JOIN product p ON sd.product_id=p.id "
        + "WHERE s.status='DEBIT' "
        + " AND s.id > :sell_id "
        + " AND rownum <= 50 "
        + "ORDER BY s.id ";
      return oraConn.query(oradb, sql, {sell_id:$scope.max_sell_id}).then(function(result) {
        if (result.rows.length==0) {
          $scope.sell = null;
        } else {
          $scope.sell = oraConn.convert(result);
        }
      });
    }
    var insertContractPending = function() {
      if ($scope.sell == null) {
        console.log('NO NEW SELL');
        return;
      }

      var sql = "INSERT IGNORE INTO contract_pending (sell_id, shop_code, sell_date, receipt_no, "
        + "contract_ref, ref_shop_id, ref_company_id, ref_product_id, "
        + "company_code, company_name, product_description, product_serial, "
        + "price, cost, main_price, down_payment, remain_price, "
        + "ref_sales_staff_id, sales_staff, ref_finance_staff_id, finance_staff "
        + ") VALUES ";
      var tmp = $scope.sell.map(function(row) {
        var tmp2 = [];
        tmp2.push(row.id);
        tmp2.push("'" + row.shop_code + "'");
        tmp2.push("'" + helper.dateToString(row.sell_date) + "'");
        tmp2.push("'" + row.receipt_no + "'");
        tmp2.push("'" + (row.contract_ref || '') + "'");
        tmp2.push(row.shop_id);
        tmp2.push(row.company_id);
        tmp2.push(row.product_id);
        tmp2.push("'" + row.company_code + "'");
        tmp2.push("'" + row.company_name + "'");
        tmp2.push("'" + row.description + "'");
        tmp2.push("'" + row.serial + "'");
        tmp2.push(row.price || 0);
        tmp2.push(row.cost || 0);
        tmp2.push(row.main_price || 0);
        tmp2.push(row.down_payment || 0);
        tmp2.push(row.remain_price || 0);
        tmp2.push(row.sales_staff_id);
        tmp2.push("'" + row.sales_staff + "'");
        tmp2.push(row.finance_staff_id);
        tmp2.push("'" + row.finance_staff + "'");
        return '(' + tmp2.join(',') + ')';
      });
      sql += tmp.join(', ');
      console.log('SQL=', sql);
      return db.query(sql);
    }

    //////////////////////////////
    getLastSellId()
      .then(getSellInfo)
      .then(insertContractPending)
      .catch(function(e) {
        console.log('ERROR=', e);
      })
      .then(function() {
        setTimeout(syncAll, syncInterval);
      });
  });
}

var run = function() {
  setTimeout(syncAll, 10000);
}

module.exports = run;
