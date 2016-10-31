const routeConfig = {
  path: 'payment-tracking',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./payment.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./payment-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./payment-list.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
