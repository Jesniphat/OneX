const routeConfig = [
  { path: '/',
    component: require('./index.jsx'),
    indexRoute: { component: require('./form.jsx') },
    getChildRoutes(location, cb) {
      require.ensure([], function(require) {
        cb(null, [
          {path: 'forgot', component: require('./forgot.jsx')},
          {path: 'register', component: require('./register.jsx')},
          {path: 'finishbooking/:id', component: require('./finish_booking.jsx')},
        ])
      })
    }
  }
]

module.exports = routeConfig
