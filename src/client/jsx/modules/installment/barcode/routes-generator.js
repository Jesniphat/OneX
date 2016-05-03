const routeConfig = {
  path: 'barcode-gen',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./barcode.jsx').Generator.Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./barcode-generator.jsx')})
    })
  }
}
module.exports = routeConfig
