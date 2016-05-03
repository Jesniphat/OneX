const routeConfig = {
  path: 'pos',
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
        require('./sell/routes'),
        require('./change-product/routes'),
        require('./recontract/routes'),
        require('./receipt/routes'),
        require('./cashDaily/routes'),
        require('./redeem/routes')
      ])
    })
  }
}
module.exports = routeConfig
