var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var billingActions = require('./actions');

var billingStore = Reflux.createStore({
  listenables: [billingActions],

  onQuery: function(param) {
    ajaxActions.request('/api/finance/billing_receive/query', param, this.doneQuery);
  },

  doneQuery: function(res) {
    if (res.status===true) {
      billingActions.list.done(res.data, res.opt);
    } else {
      billingActions.list.error(res.error);
    }
  },

  onFacet: function() {
    ajaxActions.request('/api/finance/billing_receive/facet', {}, this.doneFacet);
  },

  doneFacet: function(res) {
    if (res.status === true) {
      billingActions.facet.done(res);
    } else {
      billingActions.facet.error(res.error);
    }
  }
});

module.exports = billingStore;
