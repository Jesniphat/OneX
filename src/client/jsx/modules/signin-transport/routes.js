const routeConfig = [
  { path: '/',
    component: require('./index.jsx'),
    indexRoute: { component: require('./form.jsx') },
    getChildRoutes(location, cb) {
      require.ensure([], function(require) {
        cb(null, [
          {path: 'forgot', component: require('./forgot.jsx')},
          {path: 'register', component: require('./register.jsx')},
          {path: 'finishbooking/:id/:page', component: require('./finish_booking.jsx')},
          {path: 'finishpayment/:rs/:bookingId', component: require('./finish_payment.jsx')},
        ])
      })
    }
  }
]

module.exports = routeConfig
