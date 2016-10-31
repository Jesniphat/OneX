const routeConfig = {
  path: 'booking-transport',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./booking/booking.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./booking/customer-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./customer/routes'),
        require('./booking/routes'),
        require('./home/routes')
      ])
    })
  }
}

module.exports = routeConfig
