const routeConfig = {
  path: 'report-commission-close',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./commission.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./commission-close-list.jsx')})
    })
  }
}

module.exports = routeConfig
