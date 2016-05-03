const routeConfig = {
  path: 'staff',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./staff.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./staff-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:':id', component: require('./staff-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
