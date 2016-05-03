const routeConfig = {
  path: 'receipt',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./receipt.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./receipt-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'edit/:id/:contract_code/:redeem', component: require('./receipt-screen.jsx')},
        {path:'deptlist', component: require('./receipt-deptlist.jsx')},
        {path:'history/:id', component: require('./receipt-history.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
