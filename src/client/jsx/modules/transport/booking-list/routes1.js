const routeConfig = {
  path: 'bookingWaitCredit',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./booking-list.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./booking-waitcredit-screen.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./booking-waitcredit-screen.jsx')}
      ])
    })
  }
}

module.exports = routeConfig