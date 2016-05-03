const routeConfig = {
  path: 'finance',
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
        require('./pv/routes'),
        require('./cd/routes'),
        require('./billing_receive/routes'),
        require('./payment_voucher/routes')
      ])
    })
  }
}

module.exports = routeConfig
