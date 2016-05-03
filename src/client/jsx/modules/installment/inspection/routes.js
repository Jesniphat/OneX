const routeConfig = {
  path: 'inspection',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./inspection.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./inspection-detail.jsx')})
    })
  }
}

module.exports = routeConfig
