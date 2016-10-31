const routeConfig = {
  path: 'customer',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./customer.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./customer-new.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./customer-new.jsx')}
      ])
    })
  }
}

module.exports = routeConfig