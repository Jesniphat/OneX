const routeConfig = {
  path: 'loadfare',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./loadfare.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./loadfare.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'zone', component: require('./loadfare-zone.jsx')},
        {path:'rate', component: require('./loadfare-rate.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
