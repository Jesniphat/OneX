const routeConfig = {
  path: 'shop',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./shop.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./shop-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'shop_edit/:id', component: require('./shop-edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
