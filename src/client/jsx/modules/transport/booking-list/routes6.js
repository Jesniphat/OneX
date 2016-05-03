const routeConfig = {
  path: 'bookingDelivered',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./booking-list.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./booking-delivered-screen.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./booking-delivered-screen.jsx')},
        {path:'edit/:id', component: require('./booking-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig