const routeConfig = {
  path: 'intransit-receipt',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./intransit.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./intransit-receipt.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./intransit-receipt.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
