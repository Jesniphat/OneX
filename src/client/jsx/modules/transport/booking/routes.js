const routeConfig = {
  path: 'booking',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./booking.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./booking-screen.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./booking-screen.jsx')}
      ])
    })
  }
}

module.exports = routeConfig