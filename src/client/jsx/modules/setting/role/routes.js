const routeConfig = {
  path: 'role',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./role.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./role-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:':id', component: require('./role-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
