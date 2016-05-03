var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var pvActions       = require('./actions');

var paymentVoucherStore = Reflux.createStore({
  listenables: [pvActions],

  onList: function(param) {
    ajaxActions.request('/api/finance/pv/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      pvActions.list.done(res.data, res.opt);
    } else {
      pvActions.list.error(res.error);
    }
  },

  onGetPV: function(id) {
    ajaxActions.request('/api/finance/pv/getPV', {id:id}, this.doneGetPV);
  },

  doneGetPV: function(res) {
    if (res.status===true) {
      pvActions.getPV.done({
        pv:res.pv,
        pv_items:res.pv_items
      });
    } else {
      pvActions.getPV.error(res.error);
    }
  },

  onQueryForWaitList: function(param) {
    ajaxActions.request('/api/finance/pv/queryForWaitList', param, this.doneQueryForWaitList);
  },

  doneQueryForWaitList: function(res) {
    if (res.status===true) {
      pvActions.queryForWaitList.done(res.data);
    } else {
      pvActions.queryForWaitList.error(res.error);
    }
  },

  onQueryForSupplier: function(param) {
    ajaxActions.request('/api/finance/pv/queryForSupplier', param, this.doneQueryForSupplier);
  },

  doneQueryForSupplier: function(res) {
    if (res.status===true) {
      pvActions.queryForSupplier.done(res.data);
    } else {
      pvActions.queryForSupplier.error(res.error);
    }
  },

  onSave: function(param) {
    ajaxActions.request('/api/finance/pv/save', param, this.doneSave);
  },

  doneSave: function(res) {
    if (res.status===true) {
      pvActions.save.done(res.pv);
    } else {
      pvActions.save.error(res.error);
    }
  },

  onPrint: function(param) {
    ajaxActions.request('/api/finance/pv/genReport', param, this.donePrint);
  },

  donePrint: function(res) {
    if (res.status===true) {
      pvActions.print.done(res.data);
    } else {
      pvActions.print.error(res.error);
    }
  },

  onFacet: function() {
    ajaxActions.request('/api/finance/pv/facet', {}, this.doneFacet);
  },

  doneFacet: function(res) {
    if (res.status === true) {
      pvActions.facet.done(res);
    } else {
      pvActions.facet.error(res.error);
    }
  }
});

module.exports = paymentVoucherStore;
