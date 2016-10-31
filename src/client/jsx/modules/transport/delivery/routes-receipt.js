const routeConfig = {
  path: 'delivery-receipt',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./delivery.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./delivery-receipt.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./delivery-receipt.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
