const routeConfig = {
  path: 'contract',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./contract.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./contract-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'new/:sellId/:sellType?', component: require('./contract-new.jsx')},
        {path:'pending', component: require('./contract-pending.jsx')},
        {path:'edit/:id/:pageback?/:close?/:dunning?', component: require('./contract-edit.jsx')},
        {path:'close', component: require('./contract-close.jsx')},
        {path:'closediscount', component: require('./contract-closediscount.jsx')},
        {path:'dunning', component: require('./contract-dunning.jsx')},
        {path:'redeem', component: require('./contract-redeem.jsx')}
      ])
    })
  }
}
module.exports = routeConfig
