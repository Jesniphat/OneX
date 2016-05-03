const routeConfig = {
  path: 'barcode-print',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./barcode.jsx').Print.Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./barcode-print.jsx')})
    })
  }
}
module.exports = routeConfig
