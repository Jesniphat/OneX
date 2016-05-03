const routeConfig = {
  path: 'bookingArrived',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./booking-list.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./booking-arrived-screen.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./booking-arrived-screen.jsx')},
        {path:'edit/:id', component: require('./booking-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig