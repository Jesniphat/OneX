const routeConfig = {
  path: 'cashDaily',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./cashDaily.jsx').Index)
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'list', component: require('./cashDaily-list.jsx')},
        {path:'edit/:id/:sendStatus', component: require('./cashDaily-edit.jsx')},
        {path:'insertOld', component: require('./cashDaily-insertOld.jsx')}
      ])
    })
  }
}

module.exports = routeConfig
