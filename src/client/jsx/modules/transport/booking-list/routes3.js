const routeConfig = {
  path: 'bookingInprocess',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./booking-list.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./booking-inprocess-screen.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./booking-inprocess-screen.jsx')},
        {path:'edit/:id', component: require('./booking-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig