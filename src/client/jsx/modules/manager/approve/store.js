var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var approveActions       = require('./actions');

var approveStore = Reflux.createStore({
  listenables: [approveActions],

  onList: function(param) {
    ajaxActions.request('/api/manager/approve/list', param, this.doneList);
  },

  doneList: function(res) {

    if (res.status===true) {
       approveActions.list.done(res.data, res.opt);
      menuActions.updateCount('approve', res.opt.totalRows);
    } else {
       approveActions.list.error(res.error);
    }
  },
  // contractActions.list
  onExport: function(param) {
    ajaxActions.request('/api/manager/approve/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
       approveActions.export.done(res.file);
    } else {
      approveActions.export.error(res.error);
    }
  },

  onGetById: function(id) {
    ajaxActions.request('/api/manager/approve/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {
    if (res.status===true) {
      approveActions.getById.done({
        cashDaily: res.cashDaily,
        paymentTerm: res.paymentTerm,
        refContract: res.refContract
      });
    } else {
      approveActions.getById.error(res.msg);
    }
  },

  onDdlList: function() {
    ajaxActions.request('/api/manager/approve/ddlList', {}, this.doneDdlList);
  },

  doneDdlList: function(res) {
    if (res.status===true) {
      approveActions.ddlList.done(res.data);
    } else {
      approveActions.ddlList.error(res.error);
    }
  },

  onGetDataMain: function(id) {
    console.log('id:',id);
    ajaxActions.request('/api/manager/approve/getDataMain', {id:id,shop_id:system.sessionStore.getSession().shop.id}, this.doneGetDataMain);
  },

  doneGetDataMain: function(res) {
    if (res.status===true) {
      approveActions.getDataMain.done(res.data);
    } else {
      approveActions.getDataMain.error(res.error);
    }
  },


  onGetBank: function() {
    ajaxActions.request('/api/manager/approve/getBank', {}, this.doneGetBank);
  },

  doneGetBank: function(res) {
    if (res.status===true) {
      approveActions.getBank.done(res.data);
    } else {
      approveActions.getBank.error(res.error);
    }
  },

  onGetDataTable: function(date) {
    ajaxActions.request('/api/manager/approve/getDataTable', {date:date}, this.doneGetDataTable);
  },

  doneGetDataTable: function(res) {
    if (res.status===true) {
      approveActions.getDataTable.done(res.data);
    } else {
      approveActions.getDataTable.error(res.error);
    }
  },

  onGetDataDetail: function(id) {
    ajaxActions.request('/api/manager/approve/getDataDetail', {id:id}, this.doneGetDataDetail);
  },

  doneGetDataDetail: function(res) {
    if (res.status===true) {
      approveActions.getDataDetail.done(res.data);
    } else {
      approveActions.getDataDetail.error(res.error);
    }
  },
  onSave: function(param) {
    ajaxActions.request('/api/manager/approve/save', param, this.doneSave);
  },

  doneSave: function(res) {
    if (res.status===true) {
      approveActions.save.done(res.data);
    } else {
      approveActions.save.error(res.error);
    }
  }
});

module.exports = approveStore;
