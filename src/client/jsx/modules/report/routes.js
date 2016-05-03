const routeConfig = {
  path: 'report',
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
        require('./report-commission-close/routes'),
        require('./report-commission-open/routes'),
        require('./others/routes')
      ])
    })
  }
}

module.exports = routeConfig
