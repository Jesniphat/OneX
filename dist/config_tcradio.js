module.exports = {
  color: 'default',
  server: {
    port: 9000
  },
  webpack: {
    port: 3000,
  },
  session: {
    secret: 'ss_tcradio',
    options: {
      host: '10.0.1.175',// Host name for database connection.
      port: 3306,// Port number for database connection.
      user: 'ss_tcradio',// Database user.
      password: 'ss2015',// Password for the above database user.
      database: 'ss_tcradio',// Database name.
      checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
      expiration: 15*60*1000,// The maximum age of a valid session; milliseconds.
      autoReconnect: true,// Whether or not to re-establish a database connection after a disconnect.
      reconnectDelay: [
          500,// Time between each attempt in the first group of reconnection attempts; milliseconds.
          1000,// Time between each attempt in the second group of reconnection attempts; milliseconds.
          5000,// Time between each attempt in the third group of reconnection attempts; milliseconds.
          30000,// Time between each attempt in the fourth group of reconnection attempts; milliseconds.
          300000// Time between each attempt in the fifth group of reconnection attempts; milliseconds.
      ],
      reconnectDelayGroupSize: 5,// Number of reconnection attempts per reconnect delay value.
      maxReconnectAttempts: 25,// Maximum number of reconnection attempts. Set to 0 for unlimited.
      useConnectionPooling: false,// Whether or not to use connection pooling.
      keepAlive: true,// Whether or not to send keep-alive pings on the database connection.
      keepAliveInterval: 30000,// How frequently keep-alive pings will be sent; milliseconds.
      createDatabaseTable: true // Whether or not to create the sessions database table, if one does not already exist.
    }
  },
  db: {
    host: '10.0.1.175',
    port: 3306,
    schema: 'ss_tcradio',
    user: 'ss_tcradio',
    pass: 'ss2015',
    debug: false,
    connLimit: 100,
    charset: 'utf8_unicode_ci'
  },
  oracledb: {
    param: {
      user          : "tcradio_stock",
      password      : ":ug8up;",
      connectString : "118.174.40.150/ORCL",
      poolMax: 20,
      poolMin: 2,
      poolIncrement: 2,
      poolTimeout: 30
    },
    maxRows : 100000
  }
}