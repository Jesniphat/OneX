var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var action  = require('./actions');
var request = require('superagent');

var zonerate = Reflux.createStore({
  listenables: [action],
  onDocUpload: function(file, path) {
    console.log('file', file);
    var req = {};
    if(path == 'doc1') {
      req = request.post('/onex/api/upload/doc1');
    }
    // else if(path == 'rate') {
    //   req = request.post('/onex/api/upload/fare_rate');
    // }
    req.attach("doc1", file);
    // req.end(action.fareUpload.done);
  }
});

module.exports = zonerate;
