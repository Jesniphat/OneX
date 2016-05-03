const routeConfig = {
  path: 'grant',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./grant.jsx').Index)
    })
  }
}

module.exports = routeConfig
