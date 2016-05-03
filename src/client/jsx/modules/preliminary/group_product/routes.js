const routeConfig = {
  path: 'group_product',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./group_product.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./group_product_list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'edit/:id', component: require('./group_product_edit.jsx')}
      ])
    })
  }
}

module.exports = routeConfig