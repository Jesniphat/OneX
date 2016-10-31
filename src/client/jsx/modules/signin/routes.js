const routeConfig = [
  { path: '/',
    component: require('./index.jsx'),
    indexRoute: { component: require('./form.jsx') },
    getChildRoutes(location, cb) {
      require.ensure([], function(require) {
        cb(null, [
          {path: ':access', component: require('./form.jsx')},
          {path: 'forgot', component: require('./forgot.jsx')},
        ])
      })
    }
  }
]

module.exports = routeConfig
