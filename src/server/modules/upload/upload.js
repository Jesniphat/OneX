var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var conn        = require('../../lib/db');
var oraConn     = require('../../lib/oracle');
var oraConns    = require('../../lib/oraclemulti');
var router      = express.Router();
var helper      = require('../../lib/helper');
var fs          = require('fs');
var nsReport    = require('../../lib/nsreport');
var xlsx        = require('node-xlsx');
var moment      = require('moment')
var multer      = require('multer')
var upload      = multer({ dest: 'dist/public/uploads/tmp/' })

var oracleConfig ={
  password: ':ug8up;', 
  connectString : '192.168.10.4/ORCL'
}

var fields = {
  code:{name:'code'},
  name:{name:'name'}
};


router.post('/fare_point', upload.single('fare'), function(req, res) {
  var $scope = {};
  var db = conn.connect();
  var exMessage = '';
  if(req.file.mimetype == 'application/vnd.ms-excel') {
    var newName = moment().format('YYYY-MM-DD_hh-mm-ss') + /\..\w+$/.exec(req.file.originalname)[0];
    var filename = './dist/public/uploads/' + newName;
    var src = fs.createReadStream(req.file.path);
    src.pipe(fs.createWriteStream(filename));
    src.on('end', function() { 
      var error = true;
      var obj = xlsx.parse(filename); // parses a file 
      try
      {
        var items = obj[0].data;
        var head = items[0];

        var SYSTEM = -1, PRODUCT = -1, DATE = -1, LEVEL = -1,  PURCHASE = -1, UNIT = -1, POINT = -1;

        var EOL = function(data){ return data.replace(/\n|\r/, ''); }
        for (var i = 0; i < head.length; i++) {
          switch(head[i]) {
            case 'System': SYSTEM = i; break;
            case 'Product': PRODUCT = i; break;
            case 'Effective date': DATE = i; break;
            case 'Customer Level': LEVEL = i; break;
            case 'Every Purchase': PURCHASE = i; break;
            case 'Unit': UNIT = i; break;
            case 'Point': POINT = i; break;
          }
        }

        if(SYSTEM < 0 || PRODUCT < 0 || DATE < 0 || LEVEL < 0 || PURCHASE < 0 || UNIT < 0 || POINT < 0) {
          throw 'Column name not match';
        }
        var all = [];
        var dataItems = [];
        error = false;
        for (var i = 1; i < items.length; i++) {
          var tmp = items[i];
          if(tmp.length > 0) {
            var dbname = EOL(tmp[SYSTEM]).toLowerCase();
            var dbunit = EOL(tmp[UNIT]).toLowerCase();
            if(dbname != '*' && dbname != 'radio' && dbname != 'repair' && dbname != 'mini') {
              throw 'System database not match.'
            }
            if(dbunit != '*' && dbunit != 'piece' && dbunit != 'amount') {
              throw 'Unit type not match.';
            }

            all.push(db.selectOne('member_type', { name : EOL(tmp[LEVEL])}).then(function(data){
              //$scope[data.name.toLowerCase()] = data.id;
            }).catch(function(err){ console.log(err); error = true; }));
          }
        }


        var member_point_rule = "INSERT INTO member_point_rule (id, member_type, effective_begin, effective_end " +
        ", purchase, point, created_at, on_system, unit, excel_name, excel_line, product_code) VALUES (POINT_RULE.nextval, :member_type" +
        ", to_date(:effective_begin, 'yyyy-mm-dd'), to_date(:effective_end, 'yyyy-mm-dd') , :purchase, :point, SYSDATE " +
        ", :on_system, :unit, :excel_name, :excel_line, :product_code)";

        var rows = [];
        q.all(all).then(function(){
          if (error) {
            throw "PointGroup name or MemberType is not match";
          } else {
            all = [];
            for (var i = 1; i < items.length; i++) {
              var tmp = items[i];
              var item = {};
              if(tmp.length > 0) {
                var effect = /(.*)\-(.*)/.exec(tmp[DATE]);
                if(!effect) throw "Effective date not match."
                if(parseInt(tmp[PURCHASE]) == NaN || parseInt(tmp[POINT]) == NaN) throw "PURCHASE and POINT not match.";

                var begin = moment(effect[1], "DDMMMYYYY").format('YYYY-MM-DD');
                var end = moment(effect[2], "DDMMMYYYY").format('YYYY-MM-DD');
                if(begin === "Invalid date") throw "Invalid effective date.";
                if(end === "Invalid date") throw "Invalid effective date.";
                item.purchase = tmp[PURCHASE];
                item.point = tmp[POINT];
                item.effective_begin = begin;
                item.effective_end = end;
                item.unit = EOL(tmp[UNIT]); 
                item.on_system = EOL(tmp[SYSTEM]); 
                item.product_code = EOL(tmp[PRODUCT]); 
                item.excel_name = newName; 
                item.excel_line = i; 
                item.member_type = EOL(tmp[LEVEL]);
                rows.push(item);
              }
            }
            all.push(db.delete('member_point_rule', {}));
            return q.all(all);
          }
        }).then(function(){
          return oraConn.connect({ user: 'tcradio_stock' }).then(function(ora) {
            var sql = 'DELETE FROM member_point_rule';
            return oraConn.query(ora, sql, {}, true).then(function() { oraConn.close(ora); });
          });
        }).then(function(){
          return oraConn.connect({ user: 'tcradio_repair' }).then(function(ora) {
            var sql = 'DELETE FROM member_point_rule';
            return oraConn.query(ora, sql, {}, true).then(function() { oraConn.close(ora); });
          });
        }).then(function(){
          return oraConn.connect({ user: 'mini_stock' }).then(function(ora) {
            var sql = 'DELETE FROM member_point_rule';
            return oraConn.query(ora, sql, {}, true).then(function() { oraConn.close(ora); });
          });
        }).then(function(){
          var oradb = null;
          return oraConn.connect({ user: 'tcradio_stock' }).then(function(o) {
            oradb = o;
            all = [];
            for (var i = 0; i < rows.length; i++) { 
              var data = {
                on_system: rows[i].on_system,
                member_type: rows[i].member_type,
                effective_begin: rows[i].effective_begin,
                effective_end: rows[i].effective_end,
                purchase: rows[i].purchase,
                point: rows[i].point,
                unit: rows[i].unit,
                created_by: req.session.data.staff.id
              }
              // .catch(function(ex){ console.log('ex',ex); })
              all.push(db.insert('member_point_rule', data));
              all.push(oraConn.query(oradb, member_point_rule, rows[i], true));
            }
            return q.all(all);
          }).then(function(){
            error = false;
            return oraConn.close(oradb);
          }).catch(function(ex){
            error = true;
            exMessage = 'Oracle disconnect.'
            return oraConn.close(oradb);
          });
        }).then(function(){
          var oradb = null;
          return oraConn.connect({ user: 'tcradio_repair' }).then(function(o) {
            oradb = o;
            all = [];
            for (var i = 0; i < rows.length; i++) { 
              all.push(oraConn.query(oradb, member_point_rule, rows[i], true));
            }
            return q.all(all);
          }).then(function(){
            error = false;
            return oraConn.close(oradb);
          }).catch(function(ex){
            error = true;
            exMessage = 'Oracle disconnect.'
            return oraConn.close(oradb);
          });
        }).then(function(){
          var oradb = null;
          return oraConn.connect({ user: 'mini_stock' }).then(function(o) {
            oradb = o;
            all = [];
            for (var i = 0; i < rows.length; i++) { 
              all.push(oraConn.query(oradb, member_point_rule, rows[i], true));
            }
            return q.all(all);
          }).then(function(){
            error = false;
            return oraConn.close(oradb);
          }).catch(function(ex){
            error = true;
            exMessage = 'Oracle disconnect.'
            return oraConn.close(oradb);
          });
        }).then(function(){
          res.send({ status: !error, message: exMessage }); 
        }).catch(function(ex){
          console.log('catch', ex);
          exMessage = ex.toString();
          console.log('ex', ex);
          res.send({ status: false, message: exMessage }); 
        });

      } catch(e) { 
        exMessage = e.toString();
        res.send({ status: false, message: exMessage }); 
      }
    });
    src.on('error', function(err) { res.send({ status: false, exMessage: 'copy file error' }); });
  } else {
    res.send({ status: false, message: 'file type unknow.' });
  }
});


router.post('/fare_reword', upload.single('fare'), function(req, res) {
  var $scope = {};
  var db = conn.connect();
  var exMessage = '';
  if(req.file.mimetype == 'application/vnd.ms-excel') {
    var newName = moment().format('YYYY-MM-DD_hh-mm-ss') + /\..\w+$/.exec(req.file.originalname)[0];
    var filename = './dist/public/uploads/' + newName;
    var src = fs.createReadStream(req.file.path);
    src.pipe(fs.createWriteStream(filename));
    src.on('end', function() { 
      var error = false;
      var obj = xlsx.parse(filename); // parses a file 
      try
      {
        var items = obj[0].data;
        var head = items[0];

        var SYSTEM = -1, CODE = -1, DATE = -1,  POINT = -1, PAY = -1;
        var EOL = function(data){ return data.replace(/\n|\r/, ''); }
        for (var i = 0; i < head.length; i++) {
          switch(head[i]) {
            case 'System': SYSTEM = i; break;
            case 'Product Code': CODE = i; break;
            case 'Effective date': DATE = i; break;
            case 'Point': POINT = i; break;
            case 'Pay': PAY = i; break;
          }
        }

        if(SYSTEM < 0 || CODE < 0 || DATE < 0 || POINT < 0 || PAY < 0) {
          throw 'Column name not match';
        }



        var member_point_reword = "INSERT INTO member_point_reword (id, effective_begin, effective_end " +
        ", pay, point, created_at, on_system, excel_name, excel_line, product_code) VALUES (POINT_REWORD.nextval" +
        ", to_date(:effective_begin, 'yyyy-mm-dd'), to_date(:effective_end, 'yyyy-mm-dd') , :pay, :point, SYSDATE " +
        ", :on_system, :excel_name, :excel_line, :product_code)";

        var rows = [];
        var all = [];
        for (var i = 1; i < items.length; i++) {
          var tmp = items[i];
          var item = {};
          if(tmp.length > 0) {

            var dbname = EOL(tmp[SYSTEM]).toLowerCase();
            if(dbname != '*' && dbname != 'radio' && dbname != 'repair' && dbname != 'mini') {
              throw 'System database not match.'
            }

            var effect = /(.*)\-(.*)/.exec(tmp[DATE]);
            if(!effect) throw "Effective date not match."
            if(parseInt(tmp[PAY]) == NaN || parseInt(tmp[POINT]) == NaN) throw "PAY and POINT not match.";

            var begin = moment(effect[1], "DDMMMYYYY").format('YYYY-MM-DD');
            var end = moment(effect[2], "DDMMMYYYY").format('YYYY-MM-DD');
            if(begin === "Invalid date") throw "Invalid effective date.";
            if(end === "Invalid date") throw "Invalid effective date.";
            item.pay = tmp[PAY];
            item.point = tmp[POINT];
            item.effective_begin = begin;
            item.effective_end = end;
            item.product_code = EOL(tmp[CODE]);
            item.on_system = EOL(tmp[SYSTEM]); 
            item.excel_name = newName; 
            item.excel_line = i; 
            rows.push(item);
          }
        }
        db.delete('member_point_reword', {}).then(function(){
          return oraConn.connect({ user: 'tcradio_stock' }).then(function(ora) {
            var sql = 'DELETE FROM member_point_reword';
            return oraConn.query(ora, sql, {}, true).then(function() { oraConn.close(ora); });
          });
        }).then(function(){
          return oraConn.connect({ user: 'tcradio_repair' }).then(function(ora) {
            var sql = 'DELETE FROM member_point_reword';
            return oraConn.query(ora, sql, {}, true).then(function() { oraConn.close(ora); });
          });
        }).then(function(){
          return oraConn.connect({ user: 'mini_stock' }).then(function(ora) {
            var sql = 'DELETE FROM member_point_reword';
            return oraConn.query(ora, sql, {}, true).then(function() { oraConn.close(ora); });
          });
        }).then(function(){
          var oradb = null;
          return oraConn.connect({ user: 'tcradio_stock' }).then(function(o) {
            oradb = o;
            all = [];
            for (var i = 0; i < rows.length; i++) { 
              var data = {
                on_system: rows[i].on_system,
                pay: rows[i].pay,
                point: rows[i].point,
                product_code: rows[i].product_code,
                effective_begin: rows[i].effective_begin,
                effective_end: rows[i].effective_end,
                created_by: req.session.data.staff.id
              }
              // .catch(function(ex){ console.log('ex',ex); })
              all.push(db.insert('member_point_reword', data));
              all.push(oraConn.query(oradb, member_point_reword, rows[i], true));
            }
            return q.all(all);
          }).then(function(){
            error = false;
            return oraConn.close(oradb);
          }).catch(function(ex){
            error = true;
            exMessage = 'Oracle disconnect.'
            return oraConn.close(oradb);
          });

        }).then(function(){
          var oradb = null;
          return oraConn.connect({ user: 'tcradio_repair' }).then(function(o) {
            oradb = o;
            all = [];
            for (var i = 0; i < rows.length; i++) { 
              all.push(oraConn.query(oradb, member_point_reword, rows[i], true));
            }
            return q.all(all);
          }).then(function(){
            error = false;
            return oraConn.close(oradb);
          }).catch(function(ex){
            error = true;
            exMessage = 'Oracle disconnect.'
            return oraConn.close(oradb);
          });

        }).then(function(){
          var oradb = null;
          return oraConn.connect({ user: 'mini_stock' }).then(function(o) {
            oradb = o;
            all = [];
            for (var i = 0; i < rows.length; i++) { 
              all.push(oraConn.query(oradb, member_point_reword, rows[i], true));
            }
            return q.all(all);
          }).then(function(){
            error = false;
            return oraConn.close(oradb);
          }).catch(function(ex){
            error = true;
            exMessage = 'Oracle disconnect.'
            return oraConn.close(oradb);
          });

        }).then(function(){
          res.send({ status: !error, message: exMessage }); 
        }).catch(function(ex){
          exMessage = ex.toString();
          console.log('ex', ex);
          res.send({ status: false, message: exMessage }); 
        });
      } catch(e) { 
        exMessage = e.toString();
        res.send({ status: false, message: exMessage }); 
      }
    });
    src.on('error', function(err) { res.send({ status: false, exMessage: 'copy file error' }); });
  } else {
    res.send({ status: false, exMessage: 'file type unknow.' });
  }
});

router.post('/fare_zone', upload.single('fare'), function(req, res) {
    console.log("Load Fare zone");
    var $scope = {};
    $scope.itemLists = [];
    var db = conn.connect();
    var exMessage = '';
    //console.log("req = ",req.file.mimetype);
    // if(req.file.mimetype == 'application/vnd.ms-excel')
    if(req.file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        var newName = moment().format('YYYY-MM-DD_hh-mm-ss') + '_' + req.file.originalname;
        //console.log("newName file Name = ", newName);
        var filename = './dist/public/uploads/' + newName;
        var src = fs.createReadStream(req.file.path);
        src.pipe(fs.createWriteStream(filename));
        src.on('end', function() { 
            var error = false;
            var obj = xlsx.parse(filename); // parses a file 
            console.log("Data From Excell 0 = ", obj[0]);
            try{
                var items = obj[0].data;
                var head = items[0];
                console.log("head = ", head);
                //var SYSTEM = -1, CODE = -1, DATE = -1,  POINT = -1, PAY = -1;
                var countryOrigin = -1, cityOrigin = -1,districtOrigin = -1, countryDestination = -1, cityDestination = -1, districtDestination = -1, zone = -1;
                var EOL = function(data){ return data.replace(/\n|\r/, ''); }
                for (var i = 0; i < head.length; i++) {
                    switch(head[i]) {
                        case 'country_origin': countryOrigin = i; break;
                        case 'city_origin': cityOrigin = i; break;
                        case 'district_origin': districtOrigin = i; break;
                        case 'country_destination': countryDestination = i; break;
                        case 'city_destination': cityDestination = i; break;
                        case 'district_destination': districtDestination = i; break;
                        case 'zone': zone = i; break;
                    }
                }
                
                if(countryOrigin < 0 || cityOrigin < 0 || districtOrigin < 0 || countryDestination < 0 || cityDestination < 0 || districtDestination < 0 || zone < 0) {
                    throw 'Column name not match';
                }
                
                for(var i = 1; i < items.length; i++){
                    var tmp = items[i];
                    var item = {};
                    item.country_origin = tmp[countryOrigin];
                    item.city_origin = tmp[cityOrigin];
                    item.district_origin = tmp[districtOrigin];
                    item.country_destination = tmp[countryDestination];
                    item.city_destination = tmp[cityDestination];
                    item.district_destination = tmp[districtDestination];
                    item.zone = tmp[zone];
                    item.file_name = newName;
                    item.line_no = i;     
                    
                    $scope.itemLists.push(item);
                }
                
                console.log("$scope.itemLists = ", $scope.itemLists);
                var insertZonefare = function(){
                    console.log("insertZonefare");
                    var rows = $scope.itemLists;
                    all = [];
                        for (var i = 0; i < rows.length; i++) { 
                            if(rows[i].country_origin == undefined){
                                continue;
                            }
                            var data = {
                                country_origin: rows[i].country_origin,
                                city_origin: rows[i].city_origin,
                                district_origin: rows[i].district_origin,
                                country_destination: rows[i].country_destination,
                                city_destination: rows[i].city_destination,
                                district_destination: rows[i].district_destination,
                                zone: rows[i].zone,
                                file_name: rows[i].file_name,
                                line_no: rows[i].line_no
                        }
                        // .catch(function(ex){ console.log('ex',ex); })
                            all.push(db.insert('excel_zone', data));
                        }
                        return q.all(all);
                }
                
                db.delete('excel_zone', {})
                .then(insertZonefare)
                .then(function(){
                    //db.commit();
                    res.send({ 
                        status: true, 
                        message: exMessage 
                    }); 
                }).catch(function(ex){
                    //db.rollback();
                    exMessage = ex.toString();
                    console.log("this massage1");
                    console.log('ex', ex);
                    res.send({ 
                        status: false, 
                        message: exMessage 
                    }); 
                });
            }catch(e){ 
                console.log("this massage2");
                exMessage = e.toString();
                res.send({ status: false, message: exMessage }); 
            }
        });
        src.on('error', function(err) { res.send({ status: false, exMessage: 'copy file error' }); });
    } else {
        res.send({ status: false, exMessage: 'file type unknow.' });
    }
});




router.post('/fare_rate', upload.single('fare'), function(req, res) {
    console.log("Load Fare zone");
    var $scope = {};
    $scope.itemLists = [];
    var db = conn.connect();
    var exMessage = '';
    //console.log("req = ",req.file.mimetype);
    // if(req.file.mimetype == 'application/vnd.ms-excel')
    if(req.file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        var newName = moment().format('YYYY-MM-DD_hh-mm-ss') + '_' + req.file.originalname;
        //console.log("newName file Name = ", newName);
        var filename = './dist/public/uploads/' + newName;
        var src = fs.createReadStream(req.file.path);
        src.pipe(fs.createWriteStream(filename));
        src.on('end', function() { 
            var error = false;
            var obj = xlsx.parse(filename); // parses a file 
            console.log("Data From Excell 0 = ", obj[0]);
            try{
                var items = obj[0].data;
                var head = items[0];
                console.log("head = ", head);
                //var SYSTEM = -1, CODE = -1, DATE = -1,  POINT = -1, PAY = -1;
                var zone = -1, service_type = -1, thb = -1, usd = -1;
                var EOL = function(data){ return data.replace(/\n|\r/, ''); }
                for (var i = 0; i < head.length; i++) {
                    switch(head[i]) {
                        case 'zone': zone = i; break;
                        case 'service_type': service_type = i; break;
                        case 'thb': thb = i; break;
                        case 'usd': usd = i; break;
                    }
                }
                
                if(zone < 0 || service_type < 0 || thb < 0 || usd < 0) {
                    throw 'Column name not match';
                }
                
                for(var i = 1; i < items.length; i++){
                    var tmp = items[i];
                    var item = {};
                    item.zone = tmp[zone];
                    item.service_type = tmp[service_type];
                    item.thb = tmp[thb];
                    item.usd = tmp[usd];
                    item.file_name = newName;
                    item.line_no = i;     
                    
                    $scope.itemLists.push(item);
                }
                
                console.log("$scope.itemLists = ", $scope.itemLists);
                var insertRatefare = function(){
                    console.log("insertRatefare");
                    var rows = $scope.itemLists;
                    all = [];
                        for (var i = 0; i < rows.length; i++) { 
                            if(rows[i].zone == undefined){
                                continue;
                            }
                            var data = {
                                zone: rows[i].zone,
                                service_type: rows[i].service_type,
                                thb: rows[i].thb,
                                usd: rows[i].usd,
                                file_name: rows[i].file_name,
                                line_no: rows[i].line_no
                        }
                        // .catch(function(ex){ console.log('ex',ex); })
                            console.log("data rate = ", data);
                            all.push(db.insert('excel_rate', data));
                        }
                        return q.all(all);
                }
                
                db.delete('excel_rate', {})
                .then(insertRatefare)
                .then(function(){
                    //db.commit();
                    res.send({ 
                        status: true, 
                        message: exMessage 
                    }); 
                }).catch(function(ex){
                    //db.rollback();
                    exMessage = ex.toString();
                    console.log("this massage1");
                    console.log('ex', ex);
                    res.send({ 
                        status: false, 
                        message: exMessage 
                    }); 
                });
            }catch(e){ 
                console.log("this massage2");
                exMessage = e.toString();
                res.send({ status: false, message: exMessage }); 
            }
        });
        src.on('error', function(err) { res.send({ status: false, exMessage: 'copy file error' }); });
    } else {
        res.send({ status: false, exMessage: 'file type unknow.' });
    }
});


module.exports = router;
