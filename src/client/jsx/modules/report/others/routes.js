const routeConfig = {
  path: 'others',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./others.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./others.jsx').List})
    })
  }
}
module.exports = routeConfig
