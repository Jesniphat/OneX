var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var conn        = require('../../lib/db');
var oraConn     = require('../../lib/oracle');
var router      = express.Router();
var helper      = require('../../lib/helper');

router.get('/sync_company', [bodyParser.json()], function(req, res) {
  oraConn.connect().then(function(oradb) {
    var $scope = {};
    var db = conn.connect();

    var mysqlCustomer = function(oracle, i){
      var verrify = oracle.code.replace(/ /ig, '').length == 13;
      var name = oracle.name.split(/ /);
      var data = {
        code: oracle.code,
        nationid: (verrify ? oracle.code.replace(/ /ig, '') : (Math.random()*100000000000000).toString().substr(0, 13)),
        type : 'PERSON',
        fullname: oracle.name,
        firstname: name.slice(0,1),
        lastname: name.slice(1,10).join(' '),
        idcard_info: '{}',
        passport_info: '{}',
        mobile: oracle.tel1 ? oracle.tel1.replace(/[^\d]/ig, '').substr(0, 10) : '0',
        company_oracle_id: oracle.id,
        verrify: (verrify ? 'YES' : 'NO')
      }


      var checl_sql = "SELECT sum(found_id) found_id FROM (SELECT count(*) found_id from person p where p.nationid = :nationid union all " +
                      "SELECT count(*) found_id from customer c where c.company_oracle_id = :company_oracle_id) x";

      return db.query(checl_sql, { nationid : data.nationid, company_oracle_id : oracle.id }).then(function(rows){
          if(rows[0].found_id != "0") {
            console.log('update:', i, data.nationid);
          } else {
            console.log('insert:', i, data.nationid);
            var sql = "INSERT INTO person (code, nationid, type, firstname, lastname, fullname, mobile, idcard_info, passport_info, verrify) VALUES (:code, :nationid, :type, :firstname, :lastname, :fullname, :mobile, :idcard_info, :passport_info, :verrify)";
            return db.query(sql, data).then(function(person){
              if(data.type == 'PERSON') {
                return db.query("INSERT INTO customer (person_id, company_oracle_id) VALUES (:person_id, :company_oracle_id)", { person_id : person.insertId, company_oracle_id : oracle.id }).then(function(customer){
                  if(oracle.address) {
                    var address = {
                      customer_id: customer.insertId,
                      full_address: oracle.address ? oracle.address : '' ,
                      tel: oracle.tel ? oracle.tel : '',
                      other: oracle.fax ? oracle.fax : ''
                    }
                    return db.query("INSERT INTO address (customer_id, full_address, tel, other, type) VALUES (:customer_id, :full_address, :tel, :other, 'HOME')", address).catch(function(e){
                      console.log('address', e);
                    });
                  }
                }).catch(function(e){
                  console.log('customer', e);
                });
              }
            }).catch(function(e){
              console.log('person', e);
            });
          }
        });
    }

    var oracleCustomer = function(form, to){
      var sql = "SELECT * FROM (SELECT rank() over (order by i.id asc) rnk, i.* FROM ( SELECT tb.id, tb.code, tb.name, tb.tel1, tb.address, tb.tel, tb.fax " +
        "FROM company tb, sell s WHERE tb.ID = s.company_id AND ( s.contract_id = 0 OR s.contract_id = - 1) GROUP BY tb.id, tb.code, tb.name, tb.tel1, tb.address, tb.tel, tb.fax " +
        ") i ) x WHERE x.rnk between "+form+" and "+ to;

      return oraConn.query(oradb, sql, {}).then(function(result){
        $scope.data = oraConn.convert(result);
      });
    }

    var items = [];
    oracleCustomer(1, 70000).then(function(){
      console.log('[', $scope.data.length,'] Check company in oracle...');
      for (var i = $scope.data.length - 1; i >= 0; i--) {
        items.push(mysqlCustomer($scope.data[i], i));
      };
    }).then(function(){
      return q.all(items);
    }).then(function(){
      console.log('Compalte company in oracle...');
      oraConn.close(oradb);
      res.send({ status:true });
    }).catch(function(e) {
      oraConn.close(oradb);
      res.send({ status:false, error:e });
    });

  }).catch(function(e){
    oraConn.close(oradb);
    res.send({ status:false, error:e });
  });
});

module.exports = router;