var express     = require('express');
var router      = express.Router();
var path        = require('path');
var fs          = require('fs');
var q           = require('q');
var bodyParser  = require('body-parser');
var cookie      = require('react-cookie');

var conn        = require('../lib/db');

router.use(express.static(path.normalize(__dirname + '/../public')));

var checkSession = function(req, res, next) {
  if (!req.session.data) {
    res.redirect('/');
    return;
  }
  next();
};

var checkSessionApi = function(req, res, next) {
  if (!req.session.data) {
    res.send({status:false,session:false});
    return;
  }
  next();
}

router.get('/', function(req, res) {
  cookie.plugToRequest(req, res);
  cookie.save('SS_LANG', process.env['SS_LANG']);
  
  fs.readFile(path.resolve(__dirname, '../views/index.html'), 'utf8', function(err, data) {
    if (err) {
      res.send({status:false, error:err})
      return
    }

    var title;
    var css = [];
    var scripts = [];
    switch(req.originalUrl.replace(/\//ig, ''))
    {
      case 'booking-transport': 
        title = 'One-X &reg;'; 
        css = [
          '/css/foundation.min.css',
          '/css/app.css',
          '/css/main.css',
          '/css/transport.css'
        ]
        scripts = [
          '/js/jquery.min.js',
          '/js/common.js',
          '/js/vendors.js',
          '/js/mui.js',
          '/js/bookingtransport.js',
          '/js/foundation.min.js',
          '/js/app.js',
        ]
        break;
      case 'securestock': 
        title = 'Secure Stock &reg;';
        css = [
          '/semantic/semantic.min.css',
          '/css/main.css',
          '/css/app.css',
          '/css/transport.css'
        ]
        scripts = [
          '/js/jquery.min.js',
          '/semantic/semantic.min.js',
          '/js/common.js',
          '/js/vendors.js',
          '/js/mui.js',
          '/js/securestock.js',
          '/js/app.js'
        ]

        break;
    }

    var scriptHtml = '<script src="'
      + scripts.join('"></script>\n<script src="')
      + '"></script>'
    data = data.replace('#SCRIPT#', scriptHtml)

    var cssHtml = '<link rel="stylesheet" href="'
      + css.join('">\n<link rel="stylesheet" href="')
      + '">'
    data = data.replace('#CSS#', cssHtml);
    data = data.replace('#TITLE#', title);
    res.send(data)
  })
})


router.post('/api/*', [bodyParser.json()], function(req, res, next){
  next();
});

router.use('/api/setting', require('./setting/setting'));
router.use('/api/installment', require('./installment/installment'));
router.use('/api/receipt', require('./receipt/receipt'));
router.use('/api/finance', require('./finance/finance'));
router.use('/api/system', require('./system/system'));
router.use('/api/info', require('./info/info'));
router.use('/api/report', require('./report/report'));
router.use('/api/cashDaily', require('./cashDaily/cashDaily'));
router.use('/api/manager', require('./manager/manager'));
router.use('/api/sell', require('./sell/sell'));
router.use('/oracle/', require('./oracle/oracle'));
router.use('/api/preliminary', require('./preliminary/preliminary'));
router.use('/api/upload', require('./upload/upload'));
router.use('/api/manager', require('./manager/manager'));
router.use('/api/newcustomer', require('./newcustomer/newcustomer'));
router.use('/api/bookingtransport', require('./bookingtransport/bookingtransport'));
router.use('/api/member', require('./member/search'));
router.use('/ui/customer', require('./ui/customer'));
router.use('/ui/staff', require('./ui/staff'));
module.exports = router;
