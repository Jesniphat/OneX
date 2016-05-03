var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var cashDailyActions = require('./actions');

var cashDailyStore = Reflux.createStore({
  listenables: [cashDailyActions],

  // contractActions.list
  onList: function(param) {
    ajaxActions.request('/api/cashDaily/list', param, this.doneList);
  },

  doneList: function(res) {

    if (res.status===true) {
       cashDailyActions.list.done(res.data, res.opt);
      menuActions.updateCount('cashDaily', res.opt.totalRows);
    } else {
       cashDailyActions.list.error(res.error);
    }
  },
  // contractActions.list
  onExport: function(param) {
    ajaxActions.request('/api/cashDaily/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
       cashDailyActions.export.done(res.file);
    } else {
      cashDailyActions.export.error(res.error);
    }
  },

  onGetById: function(id) {
    ajaxActions.request('/api/cashDaily/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {
    if (res.status===true) {
      cashDailyActions.getById.done({
        cashDaily: res.cashDaily,
        paymentTerm: res.paymentTerm,
        refContract: res.refContract
      });
    } else {
      cashDailyActions.getById.error(res.msg);
    }
  },

  onDdlList: function() {
    ajaxActions.request('/api/cashDaily/ddlList', {}, this.doneDdlList);
  },

  doneDdlList: function(res) {
    if (res.status===true) {
      cashDailyActions.ddlList.done(res.data);
    } else {
      cashDailyActions.ddlList.error(res.error);
    }
  },

  onGetDataMain: function(id,status) {
    console.log('id:',id);
    ajaxActions.request('/api/cashDaily/getDataMain', {id:id,shop_id:system.sessionStore.getSession().shop.id,status:status}, this.doneGetDataMain);
  },

  doneGetDataMain: function(res) {
    if (res.status===true) {
      cashDailyActions.getDataMain.done(res.data);
    } else {
      cashDailyActions.getDataMain.error(res.error);
    }
  },


  onGetBank: function() {
    ajaxActions.request('/api/cashDaily/getBank', {}, this.doneGetBank);
  },

  doneGetBank: function(res) {
    if (res.status===true) {
      cashDailyActions.getBank.done(res.data);
    } else {
      cashDailyActions.getBank.error(res.error);
    }
  },

  onGetDataTable: function(date) {
    ajaxActions.request('/api/cashDaily/getDataTable', {date:date}, this.doneGetDataTable);
  },

  doneGetDataTable: function(res) {
    if (res.status===true) {
      cashDailyActions.getDataTable.done(res.data);
    } else {
      cashDailyActions.getDataTable.error(res.error);
    }
  },

  onGetDataDetail: function(id) {
    ajaxActions.request('/api/cashDaily/getDataDetail', {id:id}, this.doneGetDataDetail);
  },

  doneGetDataDetail: function(res) {
    if (res.status===true) {
      cashDailyActions.getDataDetail.done(res.data);
    } else {
      cashDailyActions.getDataDetail.error(res.error);
    }
  },

  onSave: function(param) {
    ajaxActions.request('/api/cashDaily/save', param, this.doneSave);
  },

  doneSave: function(res) {
    console.log('res:',res);
    if (res.status===true) {
      cashDailyActions.save.done(res.id,res.status,'ปิดกะ');
    } else {
      cashDailyActions.save.error(res.error,'รอปิดกะ');
    }
  },

  onInsertOld: function(param) {
    ajaxActions.request('/api/cashDaily/insertOld', param, this.doneInsertOld);
  },

  doneInsertOld: function(res) {
    if (res.status===true) {
      cashDailyActions.insertOld.done(res.data);
    } else {
      cashDailyActions.insertOld.error(res.error);
    }
  },

});



module.exports = cashDailyStore;
