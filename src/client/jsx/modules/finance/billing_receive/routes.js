const routeConfig = {
  path: 'billing_receive',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null,  require('./billing_receive.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./billing_receive-screen.jsx')})
    })
  }
}

module.exports = routeConfig