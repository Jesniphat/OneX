const routeConfig = [
  { path: '/',
    component: require('./index.jsx'),
    indexRoute: { component: require('./search.jsx') },
    getChildRoutes(location, cb) {
      require.ensure([], function(require) {
        cb(null, [
          {path: '/:member', component: require('./point-list.jsx')},
        ])
      })
    }
  }
]

module.exports = routeConfig
