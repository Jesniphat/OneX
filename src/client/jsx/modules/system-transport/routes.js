const routeConfig = [
  { path: '/',
    component: require('./app.jsx'),
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // require('../finance/routes'),
          //require('../pos/routes')
          // require('../installment/routes'),
          // require('../setting/routes'),
          // require('../info/routes'),
          // require('../preliminary/routes'),
          // require('../report/routes'),
          // require('../manager/routes'),
          require('../booking-transport/routes')
        ]);
      })
  }
}
]
module.exports = routeConfig
