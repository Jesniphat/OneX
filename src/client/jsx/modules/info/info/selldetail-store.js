var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var selldetailActions     = require('./selldetail-actions');

var infoStore = Reflux.createStore({
  listenables: [selldetailActions],

  // pendingActions.list
  onList: function(param) {
    ajaxActions.request('/api/info/listSelldetailinfo', param, this.doneList);
  },

  doneList: function(res) {

    if (res.status===true) {

      selldetailActions.list.done(res.data, res.opt);
      menuActions.updateCount('info', res.opt.totalRows);
    } else {

      selldetailActions.list.error(res.msg);
    }
  },

  onExport: function(param) {
    ajaxActions.request('/api/info/exportSelldetailinfo', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      selldetailActions.export.done(res.file);
    } else {
      selldetailActions.export.error();
    }
  }

});

module.exports = infoStore;
