const routeConfig = {
  path: 'payment-tracking',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./payment-tracking/payment.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./payment-tracking/payment-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./payment-tracking/routes')
      ])
    })
  }
}

module.exports = routeConfig


// const routeConfig = {
//   path: 'payment-tracking',
//   getComponent(location, cb) {
//     require.ensure([], (require) => {
//       cb(null, require('./app.jsx').Index)
//     })
//   },
//   getIndexRoute(location, cb) {
//     require.ensure([], (require) => {
//       cb(null, {component: require('./app.jsx').Dashboard})
//     })
//   },
//   getChildRoutes(location, cb) {
//     require.ensure([], (require) => {
//       cb(null, [
//         require('./payment-tracking/routes')
//       ])
//     })
//   }
// }
//
// module.exports = routeConfig
