var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var commissionActions = require('./actions');

var commissionStore = Reflux.createStore({
  listenables: [commissionActions],

  // commissionActions.list
  onList: function(param) {
    ajaxActions.request('/api/installment/commission-close/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      commissionActions.list.done(res.data, res.opt);
//      menuActions.updateCount('commission.sell', res.opt.totalRows);
    } else {
      commissionActions.list.error(res.error);
    }
  },
  // commissionActions.list
  onExport: function(param) {
    ajaxActions.request('/api/installment/commission-close/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      commissionActions.export.done(res.file);
    } else {
      commissionActions.export.error(res.error);
    }
  },

  onFacetList: function() {
    ajaxActions.request('/api/installment/commission-close/facetList', {}, this.doneFacetList);
  },

  doneFacetList: function(res) {
    if (res.status === true) {
      commissionActions.facetList.done(res);
    } else {
      commissionActions.facetList.error(res.error);
    }
  },

  onFacetDetail: function(param) {
    ajaxActions.request('/api/installment/commission-close/facetDetail', param, this.doneFacetDetail);
  },

  doneFacetDetail: function(res) {
    if (res.status === true) {
      commissionActions.facetDetail.done(res);
    } else {
      commissionActions.facetDetail.error(res.error);
    }
  },

  onCommissionDetail: function(param) {
    ajaxActions.request('/api/installment/commission-close/commissionDetail', param, this.doneCommissionDetail);
  },

  doneCommissionDetail: function(res) {
    if (res.status === true) {
      commissionActions.commissionDetail.done(res);
    } else {
      commissionActions.commissionDetail.error(res.error);
    }
  },

  onSaveCommission: function(param) {
    ajaxActions.request('/api/installment/commission-close/saveCommission', param, this.doneSaveCommission);
  },

  doneSaveCommission: function(res) {
    if (res.status === true) {
      commissionActions.saveCommission.done(res);
    } else {
      commissionActions.saveCommission.error(res.error);
    }
  }

});

module.exports = commissionStore;
