var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var redeemActions     = require('./redeem-actions');

var contractStore = Reflux.createStore({
  listenables: [redeemActions],

  // redeemActions.list
  onList: function(param) {
    ajaxActions.request('/api/installment/contract/listRedeem', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      redeemActions.list.done(res.data, res.opt);
      menuActions.updateCount('contract', res.opt.totalRows);
    } else {
      redeemActions.list.error(res.msg);
    }
  },

  onExport: function(param) {
    ajaxActions.request('/api/installment/contract/exportRedeem', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      redeemActions.export.done(res.file);
    } else {
      redeemActions.export.error();
    }
  }

});

module.exports = contractStore;
