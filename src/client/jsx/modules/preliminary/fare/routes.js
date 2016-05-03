const routeConfig = {
  path: 'fare',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./fare.jsx'))
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./fare.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'import_point', component: require('./farepoint_import.jsx')},
        {path:'import_reword', component: require('./farereword_import.jsx')}
      ])
    })
  }
}

module.exports = routeConfig