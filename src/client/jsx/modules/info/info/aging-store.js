var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var agingActions     = require('./aging-actions');

var infoStore = Reflux.createStore({
  listenables: [agingActions],

  // pendingActions.list
  onList: function(param) {
    ajaxActions.request('/api/info/listAginginfo', param, this.doneList);
  },

  doneList: function(res) {

    if (res.status===true) {

      agingActions.list.done(res.data, res.opt);
      menuActions.updateCount('info', res.opt.totalRows);
    } else {

      agingActions.list.error(res.msg);
    }
  },

  onExport: function(param) {
    ajaxActions.request('/api/info/exportAginginfo', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      agingActions.export.done(res.file);
    } else {
      agingActions.export.error();
    }
  }

});

module.exports = infoStore;
