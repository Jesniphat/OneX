const routeConfig = {
  path: 'delivery',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./delivery.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./delivery-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {component: require('./delivery-list.jsx')},
        {path:'delivery_edit/:id', component: require('./delivery-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
