const routeConfig = {
  path: 'grant',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./grant.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./grant-setting.jsx')})
    })
  }
}

module.exports = routeConfig
