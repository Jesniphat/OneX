const routeConfig = [
  { path: '/',
    component: require('./index.jsx'),
    indexRoute: { component: require('./form.jsx') },
    getChildRoutes(location, cb) {
      require.ensure([], function(require) {
        cb(null, [
          {path: ':param', component: require('./form.jsx')},
          {path: 'forgot', component: require('./forgot.jsx')},
        ])
      })
    }
  }
]

module.exports = routeConfig
