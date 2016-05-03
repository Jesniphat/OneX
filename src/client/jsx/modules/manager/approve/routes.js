const routeConfig = {
  path: 'cd',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./approve.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./approve-list.jsx')})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        {path:'screen/:id?', component: require('./approve-screen.jsx')}
      ])
    })
  }
}
