const routeConfig = {
  path: 'pv',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./pv.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./pv-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path: '/screen/:id?', component: require('./pv-screen.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
