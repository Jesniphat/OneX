const routeConfig = {
  path: 'report-commission-open',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./commission.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./commission-open-list.jsx')})
    })
  }
}

module.exports = routeConfig
