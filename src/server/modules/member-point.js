var express     = require('express');
var router      = express.Router();
var path        = require('path');
var bodyParser  = require('body-parser');
var q           = require('q');
var fs           = require('fs');
var dbo        = require('../lib/db_ora');
var helper      = require('../lib/helper');
var cookie      = require('react-cookie');

router.get('/', function(req, res) {
  cookie.plugToRequest(req, res);
  cookie.save('SS_LANG', process.env['SS_LANG']);
  // if (!req.params.sid) {
  //   res.redirect('/signin-customer/' + req.sessionID);
  //   return;
  // }
  fs.readFile(path.resolve(__dirname, '../views/index.html'), 'utf8', function(err, data) {
    if (err) {
      res.send({status:false, error:err})
      return
    }
    var scripts = [
      '/js/jquery.min.js',
      '/semantic/semantic.min.js',
      '/js/common.js',
      '/js/vendors.js',
      '/js/mui.js',
      '/js/member.js',
      '/js/app.js'
    ]
    var scriptHtml = '<script src="'
      + scripts.join('"></script>\n<script src="')
      + '"></script>'
    data = data.replace('#SCRIPT#', scriptHtml)

    var css = [
      '/semantic/semantic.min.css',
    ]
    var cssHtml = '<link rel="stylesheet" href="'
      + css.join('">\n<link rel="stylesheet" href="')
      + '">'

    data = data.replace('#CSS#', cssHtml)
    data = data.replace('#TITLE#', 'Pieare&reg; Member Point')
    res.send(data)
  })

});
module.exports = router;
