var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var cdActions       = require('./actions');
var toasterActions  = system.toasterActions;
var cashDailyStore = Reflux.createStore({
  listenables: [cdActions],

  onList: function(param) {
    ajaxActions.request('/api/finance/cd/list', param, this.doneList);
  },

  doneList: function(res) {

    if (res.status===true) {
       cdActions.list.done(res.data, res.opt);
      menuActions.updateCount('cd', res.opt.totalRows);
    } else {
       cdActions.list.error(res.error);
    }
  },
  // contractActions.list
  onExport: function(param) {
    ajaxActions.request('/api/finance/cd/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
       cdActions.export.done(res.file);
    } else {
      cdActions.export.error(res.error);
    }
  },

  onGetById: function(id) {
    ajaxActions.request('/api/finance/cd/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {
    if (res.status===true) {
      cdActions.getById.done({
        cashDaily: res.cashDaily,
        paymentTerm: res.paymentTerm,
        refContract: res.refContract
      });
    } else {
      cdActions.getById.error(res.msg);
    }
  },

  onDdlList: function() {
    ajaxActions.request('/api/finance/cd/ddlList', {}, this.doneDdlList);
  },

  doneDdlList: function(res) {
    if (res.status===true) {
      cdActions.ddlList.done(res.data);
    } else {
      cdActions.ddlList.error(res.error);
    }
  },

  onGetDataMain: function(id) {
    console.log('id:',id);
    ajaxActions.request('/api/finance/cd/getDataMain', {id:id,shop_id:system.sessionStore.getSession().shop.id}, this.doneGetDataMain);
  },

  doneGetDataMain: function(res) {
    if (res.status===true) {
      cdActions.getDataMain.done(res.data);
    } else {
      cdActions.getDataMain.error(res.error);
    }
  },


  onGetBank: function() {
    ajaxActions.request('/api/finance/cd/getBank', {}, this.doneGetBank);
  },

  doneGetBank: function(res) {
    if (res.status===true) {
      cdActions.getBank.done(res.data);
    } else {
      cdActions.getBank.error(res.error);
    }
  },

  onGetDataTable: function(date) {
    ajaxActions.request('/api/finance/cd/getDataTable', {date:date}, this.doneGetDataTable);
  },

  doneGetDataTable: function(res) {
    if (res.status===true) {
      cdActions.getDataTable.done(res.data);
    } else {
      cdActions.getDataTable.error(res.error);
    }
  },

  onGetDataDetail: function(id) {
    ajaxActions.request('/api/finance/cd/getDataDetail', {id:id}, this.doneGetDataDetail);
  },

  doneGetDataDetail: function(res) {
    if (res.status===true) {
      cdActions.getDataDetail.done(res.data);
    } else {
      cdActions.getDataDetail.error(res.error);
    }
  },

  onSave: function(param) {
    ajaxActions.request('/api/finance/cd/save', param, this.doneSave);
  },

  doneSave: function(res) {
    if (res.status===true) {
      cdActions.save.done(res.data);
    } else {
      cdActions.save.error(res.error);
    }
  },

  onGetBranch: function() {
    ajaxActions.request('/api/finance/cd/getBranch', {}, this.doneGetBranch);
  },
  doneGetBranch: function(res) {
    if (res.status === true) {
      cdActions.getBranch.done(res.data);
    } else {
      cdActions.getBranch.error(res.msg);
    }
  },

  onPdfExport: function(name, param) {
    param.report_name = name;
    ajaxActions.request('/api/finance/cd/exportReport', { data: param}, this.donePdfExport);
  },
  donePdfExport: function(res) {

    console.log('res:',res);
    if (res.status === true) {
      cdActions.pdfExport.done(res.data.exports);
    } else {
      toasterActions.pop({
        type:'success',
        message:'ไม่พบข้อมูลที่อยู่ในช่วงเวลาที่ระบุ'
      });
      cdActions.pdfExport.error(res.msg);
    }
  },
  onExportProfitLoss: function(name, param) {
    param.report_name = name;
    ajaxActions.request('/api/finance/cd/exportProfitLoss', { data: param}, this.doneExportProfitLoss);
  },
  doneExportProfitLoss: function(res) {

    console.log('res:',res);
    if (res.status === true) {
      cdActions.exportProfitLoss.done(res.data.exports);
    } else {
      toasterActions.pop({
        type:'success',
        message:'ไม่พบข้อมูลที่อยู่ในช่วงเวลาที่ระบุ'
      });
      cdActions.exportProfitLoss.error(res.msg);
    }
  }

});

module.exports = cashDailyStore;
