var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var pendingActions     = require('./pending-actions');

var contractStore = Reflux.createStore({
  listenables: [pendingActions],

  // pendingActions.list
  onList: function(param) {
    ajaxActions.request('/api/installment/contract/listPending', param, function(res) {
      if (res.status===true) {
        pendingActions.list.done(res.data, res.opt);
        menuActions.updateCount('contract', res.opt.totalRows);
      } else {
        pendingActions.list.error(res.msg);
      }
    });
  },

  onExport: function(param) {
    ajaxActions.request('/api/installment/contract/exportPending', param, function(res) {
      if (res.status===true) {
        pendingActions.export.done(res.file);
      } else {
        pendingActions.export.error();
      }
    });
  },

});

module.exports = contractStore;
