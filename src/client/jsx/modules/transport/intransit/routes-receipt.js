const routeConfig = {
  path: 'pickup-receipt',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./pickup.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./pickup-receipt.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./pickup-receipt.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
