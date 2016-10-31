const routeConfig = {
  path: 'default',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./default.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./default-setting.jsx')})
    })
  }
}

module.exports = routeConfig
