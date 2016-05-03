var system =require('ss-system');

var ajaxActions     = system.ajaxActions;// require('../../../actions/ajax');
var ajaxStore       = system.ajaxStore;// require('../../../stores/ajax');
var menuActions     = system.menuActions;// require('../../../actions/menu');
var Reflux          = require('reflux');
var commissionActions  = require('./actions');

var commissionStore = Reflux.createStore({
  listenables: [commissionActions],

  // commissionActions.list
  onList: function(param) {
    ajaxActions.request('/api/report/listopen', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      commissionActions.list.done(res.data, res.opt);
    } else {
      commissionActions.list.error(res.error);
    }
  },
  // contractActions.list
  onExportopen: function(param) {
    ajaxActions.request('/api/report/exportopen', param, this.doneExportopen);
  },

  doneExportopen: function(res) {
    if (res.status===true) {
      commissionActions.exportopen.done(res.file);
    } else {
      commissionActions.exportopen.error(res.error);
    }
  },

});

module.exports = commissionStore;
