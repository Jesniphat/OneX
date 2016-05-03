var q = require('q');
var mysql = require('mysql');
var mysqlWrap = require('mysql-wrap');
var config = require('./config');

var pool = mysql.createPool({
  connectionLimit: config.db.connLimit || 100,
  host: config.db.host || 'localhost',
  port: config.db.port || 3306,
  database: config.db.schema || 'mysql',
  user: config.db.user || 'root',
  password: config.db.pass || '',
  debug: config.db.debug || false,
  supportBigNumbers: true
});

var conn = mysqlWrap(pool);

module.exports = conn;
