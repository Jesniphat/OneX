const routeConfig = {
  path: 'sell',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./sell.jsx'))
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./sell-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:':id', component: require('./sell-screen.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
