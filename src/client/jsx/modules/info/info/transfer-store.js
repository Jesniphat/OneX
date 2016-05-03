var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var transferActions     = require('./transfer-actions');

var infoStore = Reflux.createStore({
  listenables: [transferActions],

  // pendingActions.list
  onList: function(param) {
    ajaxActions.request('/api/info/listTransferinfo', param, this.doneList);
  },

  doneList: function(res) {

    if (res.status===true) {

      transferActions.list.done(res.data, res.opt);
      menuActions.updateCount('info', res.opt.totalRows);
    } else {

      transferActions.list.error(res.msg);
    }
  },

  onExport: function(param) {
    ajaxActions.request('/api/info/exportTransferinfo', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      transferActions.export.done(res.file);
    } else {
      transferActions.export.error();
    }
  }

});

module.exports = infoStore;
