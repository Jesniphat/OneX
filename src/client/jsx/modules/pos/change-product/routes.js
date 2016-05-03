const routeConfig = {
  path: 'change',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./change.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./change-screen.jsx')})
    })
  }
}

module.exports = routeConfig
