const routeConfig = {
  path: 'report-transport',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./report/report.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./report/report-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./report/routes'),
      ])
    })
  }
}

module.exports = routeConfig




// const routeConfig = {
//   path: 'report-transport',
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
//         require('./report/routes'),
//       ])
//     })
//   }
// }
//
// module.exports = routeConfig
