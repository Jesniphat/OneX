const routeConfig = {
  path: 'intransit',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./intransit.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./intransit-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./intransit-list.jsx')},
        {path:'intransit_edit/:id', component: require('./intransit-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
