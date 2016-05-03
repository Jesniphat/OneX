var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var totalActions     = require('./total-actions');

var infoStore = Reflux.createStore({
  listenables: [totalActions],

  // pendingActions.list
  onList: function(param) {
    ajaxActions.request('/api/info/listTotalinfo', param, this.doneList);
  },

  doneList: function(res) {

    if (res.status===true) {

      totalActions.list.done(res.data, res.opt);
      menuActions.updateCount('info', res.opt.totalRows);
    } else {

      totalActions.list.error(res.msg);
    }
  },

  onExport: function(param) {
    ajaxActions.request('/api/info/exportTotalinfo', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      totalActions.export.done(res.file);
    } else {
      totalActions.export.error();
    }
  }

});

module.exports = infoStore;
