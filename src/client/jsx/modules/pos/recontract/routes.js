const routeConfig = {
  path: 'recontract',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./recontract.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./recontract-list.jsx')})
    })
  }
}

module.exports = routeConfig
