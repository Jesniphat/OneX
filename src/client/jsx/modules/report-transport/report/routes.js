const routeConfig = {
  path: 'report',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./report.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./report-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./report-list.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
