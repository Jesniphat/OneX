const routeConfig = {
  path: 'home',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./home.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./home-screen.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./home-screen.jsx')}
      ])
    })
  }
}

module.exports = routeConfig