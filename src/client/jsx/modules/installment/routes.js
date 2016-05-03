const routeConfig = {
  path: 'installment',
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
        require('./inspection/routes'),
        require('./contract/routes'),
        require('./recontract/routes'),
        require('./barcode/routes-generator'),
        require('./barcode/routes-print'),
        require('./commission-open/routes'),
        require('./commission-close-new/routes'),
        require('./others/routes'),
        require('./report-commission-open/routes'),
        require('./report-commission-close/routes')
      ])
    })
  }
}

module.exports = routeConfig
