const routeConfig = {
  path: 'report',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./report.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./report-gen.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'booking_id/:id',component: require('./report-gen.jsx')}
      ])
    })
  }
}

module.exports = routeConfig