const routeConfig = {
  path: 'cd',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null,  require('./cd.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./cd-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path: '/screen/:id?', component: require('./cd-screen.jsx')},
        {path: '/report'
          , component: require('./report.jsx').Index
          , indexRoute: {component: require('./report.jsx').List}}
      ])
    })
  }
}

module.exports = routeConfig
