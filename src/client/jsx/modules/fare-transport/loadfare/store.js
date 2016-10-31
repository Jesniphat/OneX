var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var action  = require('./actions');
var request = require('superagent');

var zonerate = Reflux.createStore({
  listenables: [action],
  onFareUpload: function(file, path) {
    console.log('file', file);
    var req = {};
    if(path == 'zone') {
      req = request.post('/onex/api/upload/fare_zone');
    } else if(path == 'rate') {
      req = request.post('/onex/api/upload/fare_rate');
    }
    req.attach("fare", file);
    req.end(action.fareUpload.done);
  },
// /api/bookingtransport/listWaitAssign'
  onListFareZone: function(){
    console.log("onListFareZone");
    ajaxActions.request('/api/bookingtransport/list_farezone', {}, function(res) {
      action.listFareZone.done(res.data);
    });
  },

  onListFareRate: function(){
    ajaxActions.request('/api/bookingtransport/list_farerate', {}, function(res) {
      action.listFareRate.done(res.data);
    });
  }
});

module.exports = zonerate;
