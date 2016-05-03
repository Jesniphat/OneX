const routeConfig = {
  path: 'redeem',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./redeem.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./redeem-screen.jsx')})
    })
  }
}

module.exports = routeConfig
