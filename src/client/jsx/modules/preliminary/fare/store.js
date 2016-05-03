var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var action  = require('./actions');
var request = require('superagent');

var product = Reflux.createStore({
  listenables: [action],
  onFareUpload: function(file, path) {
    console.log('file', file);
    var req = {};
    if(path == 'import_point') {
      req = request.post('/securestock/api/upload/fare_point');
    } else if(path == 'import_reword') {
      req = request.post('/securestock/api/upload/fare_reword');
    }
    req.attach("fare", file);
    req.end(action.fareUpload.done);
  },
  onListFarePoint: function() {
    ajaxActions.request('/api/preliminary/list_farepoint', {}, function(res) {
      action.listFarePoint.done(res.data);
    });
  },
  onListFareReword: function() {
    ajaxActions.request('/api/preliminary/list_farereword', {}, function(res) {
      action.listFareReword.done(res.data);
    });
  }
});

module.exports = product;
