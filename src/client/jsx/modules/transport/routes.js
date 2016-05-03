const routeConfig = {
  path: 'transport',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./app.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./app.jsx').Dashboard})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./loadfare/routes'),
        require('./customer/routes'),
        require('./booking/routes'),
        require('./home/routes'),
        require('./report/routes'),
        require('./booking-list/routes'),
        require('./booking-list/routes1'),
        require('./booking-list/routes2'),
        require('./booking-list/routes3'),
        require('./booking-list/routes4'),
        require('./booking-list/routes5'),
        require('./booking-list/routes6'),
        require('./booking-list/routes7'),
        require('./booking-list/routes8'),
        require('./pickup/routes'),
        require('./pickup/routes-receipt'),
        require('./intransit/routes')
      ])
    })
  }
}

module.exports = routeConfig
