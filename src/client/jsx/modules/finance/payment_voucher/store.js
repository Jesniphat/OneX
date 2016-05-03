var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var paymentVoucherActions = require('./actions');

var paymentVoucherStore = Reflux.createStore({
  listenables: [paymentVoucherActions],

  onQueryForWaitList: function(param) {
    ajaxActions.request('/api/finance/payment-voucher/queryForWaitList', param, this.doneQueryForWaitList);
  },

  doneQueryForWaitList: function(res) {
    if (res.status===true) {
      paymentVoucherActions.queryForWaitList.done(res.data);
    } else {
      paymentVoucherActions.queryForWaitList.error(res.error);
    }
  },

  onQueryForSupplier: function(param) {
    ajaxActions.request('/api/finance/payment-voucher/queryForSupplier', param, this.doneQueryForSupplier);
  },

  doneQueryForSupplier: function(res) {
    if (res.status===true) {
      paymentVoucherActions.queryForSupplier.done(res.data);
    } else {
      paymentVoucherActions.queryForSupplier.error(res.error);
    }
  },


  onFacet: function() {
    ajaxActions.request('/api/finance/payment_voucher/facet', {}, this.doneFacet);
  },

  doneFacet: function(res) {
    if (res.status === true) {
      paymentVoucherActions.facet.done(res);
    } else {
      paymentVoucherActions.facet.error(res.error);
    }
  }
});

module.exports = paymentVoucherStore;
