const routeConfig = {
  path: 'commission-close',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./commission.jsx'))
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./commission-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'detail/:term_year/:term_month/:shop_id', component: require('./commission-detail.jsx')}
      ])
    })
  }
}
module.exports = routeConfig
