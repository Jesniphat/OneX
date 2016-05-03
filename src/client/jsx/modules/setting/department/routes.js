const routeConfig = {
  path: 'department',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./department.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./department-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:':id', component: require('./department-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
