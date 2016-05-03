var system =require('ss-system');

var ajaxActions     = system.ajaxActions;// require('../../../actions/ajax');
var ajaxStore       = system.ajaxStore;// require('../../../stores/ajax');
var menuActions     = system.menuActions;// require('../../../actions/menu');
var Reflux          = require('reflux');
var receiptActions  = require('./actions');

var receiptStore = Reflux.createStore({
  listenables: [receiptActions],

  onCheckredeem: function(param) {
    ajaxActions.request('/api/receipt/checkredeem', param, this.doneCheckredeem);
  },

  doneCheckredeem: function(res) {
    if (res.status===true) {
      receiptActions.checkredeem.done(res.data);
    } else {
      receiptActions.checkredeem.error(res.error);
    }
  },

});

module.exports = receiptStore;
