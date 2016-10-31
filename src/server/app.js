var express       = require('express');
var session       = require('express-session');
var apiApp        = require('./modules/api');
var signinApp     = require('./modules/signin');

var customerApp   = require('./modules/signin-customer');
var memberPointApp   = require('./modules/member-point');
var transportApp   = require('./modules/signin-transport');
var RegisterApp   = require('./modules/customer');
var FinishBooking = require('./modules/finish-booking');
var FinishPayment = require('./modules/finish-payment');

var path          = require('path');
var db            = require('./lib/db');
// var SessionStore = require('express-mysql-session');
var app           = express();
var orawrap       = require('orawrap');
var MySQLStore    = require('connect-mysql')(session);
// var sync          = require('./modules/sync/sync');
var cookie  = require('react-cookie');

console.log(process.argv);
var config;
if (process.argv[2]) {
  config          = require('./config_' + process.argv[2]);
} else {
  config          = require('./config');
}

console.log('NLS_LANG =', process.env['NLS_LANG'], 'SS_LANG =', process.env['SS_LANG'], 'SS =', process.env['SS']);

//var sessionStore = new SessionStore(config.session.options);

var restartTimer = null;

app.use(session({
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: 15*60*1000
  },
  store: new MySQLStore({
    pool: db.getPool(),
    cleanup: true
  })
}));

app.use(express.static(path.normalize(__dirname + '/public')));

app.use('/onex/', apiApp);
app.use('/booking-transport/', apiApp);

app.use('/signin', signinApp);
app.use('/signin-customer', customerApp);
app.use('/signin-transport', transportApp);
app.use('/register', RegisterApp);
app.use('/finish-booking', FinishBooking);
app.use('/finish-payment', FinishPayment);
app.use('/member-point', memberPointApp);

app.get('/', function(req, res) {
  cookie.plugToRequest(req, res);
  cookie.save('SS_LANG', process.env['SS_LANG']);

  if (!req.session.data) {
    res.redirect('/signin/' + req.sessionID);
    return;
  }

  res.redirect('/onex/');
});



app.get('/restart/:pass/:time?', function(req, res) {

  if (req.params.pass != 'ss2015') {
    res.send({status:false});
    return;
  }

  var delay = 5;
  if (typeof req.params.time != 'undefined') {
    var tmp = parseInt(req.params.time);
    if (!isNaN(tmp)) {
      delay = tmp;
    }
  }

  if (restartTimer != null) {
    clearTimeout(restartTimer);
    restartTimer = null;
  }

  if (delay===0) {
    res.send({status:true,msg:'Server restart was cancelled.'});
    return;
  }

  restartTimer = setTimeout(function() {
    process.exit(1);
  }, delay*1000);

  res.send({status:true,msg:'Server will restart in ' + delay + ' second.\r\nUse 0 to cancelled'});
});


orawrap.createPool(config.oracledb.param, function(err, pool) {
   if (err) throw err;
   app.listen(config.server.port);
});
