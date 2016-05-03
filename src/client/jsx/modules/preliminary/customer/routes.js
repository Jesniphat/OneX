const routeConfig = {
  path: 'customer',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./customer.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./customer-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'edit/:id', component: require('./customer-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
