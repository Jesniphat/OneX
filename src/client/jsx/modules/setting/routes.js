const routeConfig = {
  path: 'setting',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./app.jsx').Index)
    })
  },
  getIndexRoute(location, cb) {
    require.ensure([], (require) => {
      cb(null, {component: require('./app.jsx').Dashboard})
    })
  },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./staff/routes'),
        require('./shop/routes'),
        require('./department/routes'),
        require('./role/routes'),
        require('./grant/routes'),
      ])
    })
  }
}

module.exports = routeConfig
