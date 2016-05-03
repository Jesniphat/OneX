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
var xlsx        = require('node-xlsx');
var nsReport    = require('../../../lib/nsreport');

router.post('/inspect', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {
    person: null,
    contracts: [],
    addresses: []
  };

  var getPerson = function() {
    console.log('getPerson');
    var sql = "SELECT * FROM person WHERE nationid=:nationid";
    return db.query(sql, {nationid:req.body.id}).then(function(rows) {
      if (rows.length==0) {
        $scope.person = null;
      } else {
        $scope.person = rows[0];
      }
    });
  }

  var getContracts = function() {
    console.log('getContracts');
    if ($scope.person==null) {
      var dfd = q.defer();
      dfd.resolve();
      return dfd.promise;
    }
    var sql = "SELECT c.id, c.code, c.sign_date, c.close_date, c.payment_price, "
      + "c.product_detail product, c.total_paid, c.balance, "
      + "sh.code shop_code, sh.name shop_name, "
      + "c.current_status, if(c.cus_person_id=:id,'cus','co') role_type "
      + "FROM contract c "
      + "LEFT JOIN shop sh ON c.shop_id=sh.id "
      + "WHERE c.cus_person_id=:id OR c.co_person_id=:id "
      + "ORDER BY c.sign_date DESC"
    return db.query(sql, {id:$scope.person.id}).then(function(rows) {
      $scope.contracts = rows;
    });
  }

  var getTerms = function() {
    console.log('getTerms');
    if ($scope.contracts.length==0) {
      var dfd = q.defer();
      dfd.resolve();
      return dfd.promise;
    }
    var ids = $scope.contracts.map(function(row) {
      return row.id;
    });

    var sql = "SELECT id, contract_id, term_num, due_date, due_amount, "
      + "paid_date, paid_amount, term_status, close_status "
      + "FROM payment_term WHERE contract_id IN ("
      + ids.join(',') + ") ORDER BY contract_id, term_num";

    return db.query(sql, {}).then(function(rows) {
      var terms = {};

      rows.forEach(function(row) {
        if (typeof terms[row.contract_id]==='undefined') {
          terms[row.contract_id] = [];
        }
        terms[row.contract_id].push(row);
      });

      $scope.contracts.forEach(function(row) {
        if (typeof terms[row.id]==='undefined') {
          return;
        }
        row.terms = terms[row.id];
      });
    });
  };

  var getAddresses = function() {
    console.log('getAddresses');
    if ($scope.contracts.length==0) {
      var dfd = q.defer();
      dfd.resolve();
      return dfd.promise;
    }
    var ids = $scope.contracts.map(function(row) {
      return row.id;
    });
    var sql = "SELECT MAX(id) id, type, addr1, addr2, tambon, amphur, province, zipcode, tel, other, full_address FROM address WHERE contract_id IN ("
      + ids.join(',') + ") AND type IN ('HOME','WORK') "
      + "AND full_address <> '' "
      + "GROUP BY type, full_address";
    return db.query(sql, {}).then(function(rows) {
      $scope.addresses = rows;
    });
  };

  getPerson()
    .then(getContracts)
    .then(function() {
      return q.all([getTerms(), getAddresses()]);
    }).then(function() {
    res.send({
      status:true,
      data: {
        ref: req.body.ref,
        person: $scope.person,
        contracts: $scope.contracts,
        addresses: $scope.addresses
      }
    });
  }).catch(function(e) {
    console.log(e);
    res.send({
      status:false,
      error:e
    });
  })

});

router.post('/genForm', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {
    cus:{},
    co:{},
    contract:{},
    homeAddr:{},
    workAddr:{},
    coHomeAddr:{},
    coWorkAddr:{}
  };
  var param = req.body;
  var saveInspect = function(data) {
    var sql = "INSERT INTO contract_inspect (inspect_date, nationid, "
      + "contract_id, home_addr_id, work_addr_id) VALUES (NOW(), "
      + ":nationid, :contract_id, :home_addr_id, :work_addr_id)";
    return db.query(sql, {
      nationid:data.nationid,
      contract_id:data.contract_id || 0,
      home_addr_id:data.home_addr_id,
      work_addr_id:data.work_addr_id
    });
  };
  var getContract = function() {
    var sql = "SELECT * FROM contract WHERE id=:id";
    return db.query(sql, {id:param.cus.contract_id}).then(function(rows) {
      if (rows.length > 0) {
        $scope.contract = rows[0];
      }
    });
  }
  var getPersons = function() {
    var sql = "SELECT * FROM person WHERE nationid IN (:cus_nationid, :co_nation_id)";
    return db.query(sql, {
      cus_nationid:param.cus.nationid,
      co_nation_id:param.co.nationid
    }).then(function(rows) {
      rows.forEach(function(row) {
        if (row.nationid==param.cus.nationid) {
          $scope.cus = row;
        } else if (row.nationid==param.co.nationid) {
          $scope.co = row;
        }
      });
    });
  };
  var getAddresses = function() {
    var sql = "SELECT * FROM address WHERE id IN (:id1, :id2, :id3, :id4)";
    return db.query(sql, {
      id1:param.cus.home_addr_id,
      id2:param.cus.work_addr_id,
      id3:param.co.home_addr_id,
      id4:param.co.work_addr_id
    }).then(function(rows) {
      rows.forEach(function(row) {
        if (row.id==param.cus.home_addr_id) {
          $scope.homeAddr = row;
        } else if (row.id==param.cus.work_addr_id) {
          $scope.workAddr = row;
        } else if (row.id==param.co.home_addr_id) {
          $scope.coHomeAddr = row;
        } else {
          $scope.coWorkAddr = row;
        }
      });
    });
  };
  var renderReport1 = function() {
    var dfd = q.defer();
    $scope.pdfFile = 'contract_form1_'+ helper.newUUID() + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../../public/output/' + $scope.pdfFile);
    var report  = new nsReport();
    console.log($scope.cus);
    var birth = toThaiDate($scope.cus.birth, true);
    var data = {
      'cus.fullname': $scope.cus.fullname || '',
      'cus.age': calcAge($scope.cus.birth),
      'cus.birth_dd': birth.dd,
      'cus.birth_mm': birth.mm,
      'cus.birth_yy': birth.yy,
      'cus.gender': $scope.cus.gender || 'N/A',
      'cus.marital_status':$scope.cus.marital_status || 'N/A',
      'cus.nationid': formatNationID($scope.cus.nationid || ''),
      'homeAddr.line1': $scope.homeAddr.line1 || '',
      'homeAddr.line2': $scope.homeAddr.line2 || '',
      'homeAddr.tambon': $scope.homeAddr.tambon || '',
      'homeAddr.amphur': $scope.homeAddr.amphur || '',
      'homeAddr.province': $scope.homeAddr.province || '',
      'homeAddr.zipcode': $scope.homeAddr.zipcode || '',
      'homeAddr.tel': $scope.homeAddr.tel || '',
      'homeAddr.other': $scope.homeAddr.other || '',
      'cus.mobile': $scope.cus.mobile || '',
      'cus.addr_owner': $scope.contract.cus_addr_owner || '',
      'cus.addr_with': $scope.contract.cus_addr_with || '',
      'cus.addr_person': $scope.contract.cus_addr_person || '',
      'cus.work_company': $scope.contract.work_company || '',
      'workAddr.line': (($scope.workAddr.line1 || '') + ' ' + ($scope.workAddr.line2 || '')).trim(),
      'workAddr.tambon': $scope.workAddr.tambon || '',
      'workAddr.amphur': $scope.workAddr.amphur || '',
      'workAddr.province': $scope.workAddr.province || '',
      'workAddr.zipcode': $scope.workAddr.zipcode || '',
      'workAddr.tel': $scope.workAddr.tel || '',
      'workAddr.other': $scope.workAddr.other || '',
      'cus.work_type': $scope.contract.work_type || '',
      'cus.work_detail': $scope.contract.work_detail || '',
      'cus.work_department': $scope.contract.work_department || '',
      'cus.work_position': $scope.contract.work_position || '',
      'cus.work_time': $scope.contract.work_time || '',
      'cus.work_year': $scope.contract.work_year || '',
      'cus.work_salary': $scope.contract.work_salary || '',
      'cus.work_income': $scope.contract.work_income || '',
      'cus.work_income_source': $scope.contract.work_income_source || '',
      'cus.work_prev_company': $scope.contract.work_prev_company || '',
      'cus.work_prev_addr': $scope.contract.work_prev_addr || '',
      'cus.work_prev_department': $scope.contract.work_prev_department || '',
      'cus.work_prev_tel': $scope.contract.work_prev_tel || '',
      'co.fullname': $scope.co.fullname || '',
      'cus.relation': $scope.contract.co_relation || '',
      'coHomeAddr.line1': $scope.coHomeAddr.line1 || '',
      'coHomeAddr.line2': $scope.coHomeAddr.line2 || '',
      'coHomeAddr.tambon': $scope.coHomeAddr.tambon || '',
      'coHomeAddr.amphur': $scope.coHomeAddr.amphur || '',
      'coHomeAddr.province': $scope.coHomeAddr.province || '',
      'coHomeAddr.zipcode': $scope.coHomeAddr.zipcode || '',
      'coHomeAddr.tel': $scope.coHomeAddr.tel || '',
      'co.mobile': $scope.co.mobile || '',
      'coHomeAddr.other': $scope.coHomeAddr.other || '',
      'co.nationid': $scope.co.nationid || '',
      'co.work_company': '',
      'co.work_detail': '',
      'co.work_department':'',
      'co.work_position':'',
      'co.work_time':'',
      'co.work_year':'',
      'co.work_salary':'',
      'co.work_address':''
    };
    var report  = new nsReport();
    var doc = report.createDocument(require('./reports/form1.js'), [data]);
    var stream = fs.createWriteStream(pdfFullPath);
    doc.pipe(stream);
    doc.end();
    stream.on('finish', function() {
      console.log('done');
      dfd.resolve();
    });
    stream.on('error', function(e) {
      console.log('reject', e);
      dfd.reject();
    });
    return dfd.promise;
  }
  var renderReport2 = function() {
    var dfd = q.defer();
    $scope.pdfFile = 'contract_form2_'+ helper.newUUID() + '.pdf';
    var pdfFullPath = path.normalize(__dirname + '/../../../public/output/' + $scope.pdfFile);
    var report  = new nsReport();

    var data = {
      'fullname': $scope.cus.fullname || '',
      'shop_name': req.session.data.shop.name,
      'code':''
    };
    var report  = new nsReport();
    var doc = report.createDocument(require('./reports/form2.js'), [data]);
    var stream = fs.createWriteStream(pdfFullPath);
    doc.pipe(stream);
    doc.end();
    stream.on('finish', function() {
      console.log('done');
      dfd.resolve();
    });
    stream.on('error', function(e) {
      console.log('reject', e);
      dfd.reject();
    });
    return dfd.promise;
  }
  q.all([
    saveInspect(param.cus),
    saveInspect(param.co),
    getContract(),
    getPersons(),
    getAddresses()
  ]).then(function() {
    return param.type=='form1' ? renderReport1() : renderReport2()
  }).then(function() {
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

router.post('/savePerson', [bodyParser.json()], function(req, res) {
  var db = mysqlConn.connect();
  var $scope = {
    id: null
  };
  var savePerson = function() {
    var sql = "INSERT INTO person(nationid, type, prename, firstname, lastname, "
      + "fullname, idcard_info, passport, passport_info, nation, birth, gender, "
      + "marital_status, mobile, email, lineid) VALUES("
      + ":nationid, :type, :prename, :firstname, :lastname, :fullname, "
      + ":idcard_info, :passport, :passport_info, :nation, :birth, :gender, "
      + ":marital_status, :mobile, :email, :lineid) ON DUPLICATE KEY UPDATE "
      + "type=VALUES(type), prename=VALUES(prename), firstname=VALUES(firstname), "
      + "lastname=VALUES(lastname), fullname=VALUES(fullname), idcard_info=VALUES(idcard_info), "
      + "passport=VALUES(passport), passport_info=VALUES(passport_info), nation=VALUES(nation), "
      + "birth=VALUES(birth), gender=VALUES(gender), marital_status=VALUES(marital_status), "
      + "mobile=VALUES(mobile), email=VALUES(email), lineid=VALUES(lineid)";
    return db.query(sql, {
      nationid: req.body.nationid,
      type: req.body.type || 'PERSON',
      prename: req.body.prename || '',
      firstname: req.body.firstname || '',
      lastname: req.body.lastname || '',
      fullname: req.body.fullname || '',
      idcard_info: !req.body.idcard_info ? '{}' :
        typeof req.body.idcard_info=='string' ? req.body.idcard_info : JSON.stringify(req.body.idcard_info),
      passport: req.body.passport || '',
      passport_info: !req.body.passport_info ? '{}' :
        typeof req.body.passport_info=='string' ? req.body.passport_info : JSON.stringify(req.body.passport_info),
      nation: req.body.nation || 'THA',
      birth: req.body.birth || '0000-00-00',
      gender: req.body.gender || 'N/A',
      marital_status: req.body.marital_status || 'N/A',
      mobile: req.body.mobile || '',
      email: req.body.email || '',
      lineid: req.body.lineid || ''
    }, function(result) {
      console.log(result);
//      $scope.id = result.insertId;
    });
  }

  router.post('/savePersonPhoto', [bodyParser.json()], function(req, res) {
    var $scope = {
      photoPath:null
    };

    var savePhotoData = function(nationid, data) {
      var dfd = q.defer();
      var pos = data.indexOf(',');
      if (pos===-1) {
        return;
      }
      var filepath = path.normalize(__dirname + '/../../../public/idcard/photo/'
          + req.body.nationid.substr(-1) + '/' + req.body.nationid.substr(-2,1));
      console.log('update_dir=', filepath);
      $scope.photoPath = '/idcard/photo/' + req.body.nationid.substr(-1) + '/'
        + req.body.nationid.substr(-2,1) + '/' + req.body.nationid + '.jpg';
      //console.log(filepath);
      mkdirp(filepath, function (err) {
        if (err) {
          console.error(err);
          dfd.reject(err);
          return;
        }
        fs.writeFile(filepath + '/' + req.body.nationid+'.jpg', data.substr(pos+1), 'base64', function(err) {
          if (err) {
            dfd.reject(err);
            console.log(err);
            return;
          }
          dfd.resolve();
        });
      });
      return dfd.promise;
    }
    if (!req.body.photoData) {
      res.send({
        status:false,
        error:'NO PHOTO DATA'
      });
      return;
    }
    savePhotoData(req.body.nationid, req.body.photoData).then(function() {
      res.send({
        status:true,
        photoPath:$scope.photoPath
      });
    }).catch(function(e) {
      res.send({
        status:false,
        error:e
      });
    })
  });


  savePerson().then(function() {
    res.send({
      status:true,
      id: $scope.id
    });
  }).catch(function(e) {
    res.send({
      status:false,
      error:e
    });
  })
});

router.post('/getPersonOracle', [bodyParser.json()], function(req, res) {

  oraConn.connect().then(function(oradb) {
    var $scope = {};
    var db = mysqlConn.connect();

    var checkPerson = function() {
      var sql = "select id from person where nationid = :nationid";
      return db.query(sql, {nationid:req.body.nationid}).then(function(result) {

        if (result.length > 0) {
          $scope.checkdup = true;
        }else{
          $scope.checkdup = false;
        }
      });
    }

    var getCustomerOracle = function() {
      var sql = "select nationid,'' prenameTH, "
                + " TRIM(substr(name,0,INSTR(name, ' ', -1))) firstnameTH ,TRIM(substr(name,INSTR(name, ' ', -1))) lastnameTH "
                + " from company where type = 'C' and approve_yn = 'Y' and nationid = :nationid";
      return oraConn.query(oradb,sql, {nationid:req.body.nationid}).then(function(result) {

        if (result.rows.length > 0) {
          $scope.return = true;
          $scope.addcust = {
            d: result.rows,
            f: result.metaData.map(function(fld) {
              return fld.name.toLowerCase();
            })
          };
          console.log('result=',$scope.addcust);
        }else{
          $scope.return = false;
        }
      });
    }
    checkPerson().then(function(){
      if ($scope.checkdup == true){
        $scope.return=false;
        $scope.addcust={};
        return false;
      }else{
        return getCustomerOracle()
      }
    }).then(function() {
      console.log('111111111');
      oraConn.close(oradb);
      res.send({
        status:$scope.return,
        addcust: $scope.addcust
      });
    }).catch(function(e){
      console.log('2222222');
      oraConn.close(oradb);
      res.send({
        status:false,
        error:e
      });
    });
  });
});

var toThaiDate = function(date, short) {
  if (date=='0000-00-00' || date=='') {
    return {dd:'', mm:'', yy:''};
  }
  try {
    var d = new Date(date);
  } catch (e) {
    return {dd:'', mm:'', yy:''};
  }
  var thMonthShort = [
    'ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'
  ];
  var thMonthLong = [
    'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'
  ];

  return {
    dd: ''+d.getDate(),
    mm: short ? thMonthShort[d.getMonth()] : thMonthLong[d.getMonth()],
    yy: ''+(d.getFullYear()+543)
  };
}

var formatNationID = function(nationid) {
  if (nationid.length != 13) {
    return nationid;
  }
  return nationid.substr(0,1)+'-'+nationid.substr(1,4)+'-'
      + nationid.substr(5,5)+'-'+nationid.substr(10,2)
      + '-' + nationid.substr(12,1);
}

var calcAge = function(value) {
  var today = new Date();
  try {
    console.log(value);
    var d = new Date(value);

  } catch (e) {
    return '';
  }
  var age = today.getFullYear()-d.getFullYear();
  if (d.getMonth() > today.getMonth() || d.getMonth()==today.getMonth() && d.getDate() > today.getDate()) {
    age--;
  }
  return age;
};

module.exports = router;
