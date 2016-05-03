const routeConfig = {
  path: 'pickup',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./pickup.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./pickup-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./pickup-list.jsx')},
        {path:'pickup_edit/:id', component: require('./pickup-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
