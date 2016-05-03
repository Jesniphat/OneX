const routeConfig = {
  path: 'payment_voucher',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null,  require('./payment_voucher.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./payment_voucher-screen.jsx')})
    })
  }
}

module.exports = routeConfig
