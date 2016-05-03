var system =require('ss-system');

var ajaxActions     = system.ajaxActions;// require('../../../actions/ajax');
var ajaxStore       = system.ajaxStore;// require('../../../stores/ajax');
var menuActions     = system.menuActions;// require('../../../actions/menu');
var Reflux          = require('reflux');
var paymentActions  = require('./actions');

var paymentStore = Reflux.createStore({
  listenables: [paymentActions],

  onPaymentOptionList: function() {
    //console.log('onPaymentOptionList');
    ajaxActions.request('/api/receipt/paymentOptionList', {}, this.donePaymentOptionList);
  },

  donePaymentOptionList: function(res) {
    if (res.status===true) {
      paymentActions.paymentOptionList.done(res.data);
    } else {
      paymentActions.paymentOptionList.error(res.error);
    }
  },

  onGetFinanceList: function(shop_id,contract_id,finance_id,contracttype,sell_staff_id) {
    //console.log('onPaymentOptionList');
    ajaxActions.request('/api/receipt/financeList', {shop_id:shop_id,contract_id:contract_id,finance_id:finance_id,contracttype:contracttype,sell_staff_id:sell_staff_id}, this.doneGetFinanceList);
  },

  doneGetFinanceList: function(res) {
    if (res.status===true) {
      paymentActions.getFinanceList.done(res.data);
    } else {
      paymentActions.getFinanceList.error(res.error);
    }
  },

  onSavePayment:  function(res){
    ajaxActions.request('/api/receipt/savePayment', res, this.doneSavePayment);
  },

  doneSavePayment: function(res) {
    if (res.status===true) {
      paymentActions.savePayment.done(res.data);
    } else {
      paymentActions.savePayment.error(res.error);
    }
  },

  onGetContractList: function(res){
    ajaxActions.request('/api/receipt/getContractList', res, this.doneGetContractList);
  },

  doneGetContractList: function(res) {
    if (res.status===true) {
      paymentActions.getContractList.done(res.data);
    } else {
      paymentActions.getContractList.error(res.error);
    }
  },

  onGetPaymentTerm:function(res){
    ajaxActions.request('/api/receipt/getPaymentTerm', res, this.doneGetPaymentTerm);
  },

  doneGetPaymentTerm:function(result){
    if(result.status===true){
      paymentActions.getPaymentTerm.done(result.data);
    }else{
      paymentActions.getPaymentTerm.error(result.error);
    }
  },

  // paymentActions.list
  onList: function(param) {
    console.log('request');
    ajaxActions.request('/api/receipt/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      paymentActions.list.done(res.data, res.opt);
      menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      paymentActions.list.error(res.error);
    }
  },
  // contractActions.list
  onExport: function(param) {
    ajaxActions.request('/api/receipt/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      paymentActions.export.done(res.file);
    } else {
      paymentActions.export.error(res.error);
    }
  },

  onGetContractDetail: function(param) {
    ajaxActions.request('/api/receipt/getContractDetail', param, this.doneGetContractDetail);
  },

  doneGetContractDetail: function(res) {
    if (res.status===true) {
      paymentActions.getContractDetail.done(res.data);
    } else {
      paymentActions.getContractDetail.error(res.error);
    }
  },

  onPrintReceipt: function(res){
    ajaxActions.request('/api/receipt/receipt_report', res, this.donePrintReceipt);
  },

  donePrintReceipt: function(res) {
    if (res.status===true) {
      paymentActions.printReceipt.done(res.data);
    } else {
      paymentActions.printReceipt.error(res.error);
    }
  },

  onDeptList: function(param) {
    ajaxActions.request('/api/receipt/deptList', param, this.doneDeptList);
  },

  doneDeptList: function(res) {
    if (res.status===true) {
      paymentActions.deptList.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      paymentActions.deptList.error(res.error);
    }
  },

  onGetHistoryPaymentTerm:function(res){
    ajaxActions.request('/api/receipt/getHistoryPaymentTerm', res, this.doneGetHistoryPaymentTerm);
  },

  doneGetHistoryPaymentTerm:function(result){
    if(result.status===true){
      paymentActions.getHistoryPaymentTerm.done(result.data);
    }else{
      paymentActions.getHistoryPaymentTerm.error(result.error);
    }
  },

  onExportDept: function(param) {
    ajaxActions.request('/api/receipt/exportDept', param, this.doneExportDept);
  },

  doneExportDept: function(res) {
    if (res.status===true) {
      paymentActions.exportDept.done(res.file);
    } else {
      paymentActions.exportDept.error(res.error);
    }
  },

  onSaveProduct: function(data) {
    ajaxActions.request('/api/receipt/saveproduct', data, this.doneSaveProduct);
  },

  doneSaveProduct: function(res) {
    if (res.status===true) {
      paymentActions.saveProduct.done(res.data);
    } else {
      paymentActions.saveProduct.error(res.error);
    }
  },

  onGetDataProduct: function() {
    ajaxActions.request('/api/receipt/getdataproduct', {}, this.doneGetDataProduct);
  },

  doneGetDataProduct: function(res) {
    if (res.status===true) {
      paymentActions.getDataProduct.done(res.data);
    } else {
      paymentActions.getDataProduct.error(res.error);
    }
  },

  onVoidPayment: function(param) {
    ajaxActions.request('/api/receipt/voidpayment', param, this.doneVoidPayment);
  },

  doneVoidPayment: function(res) {
    if (res.status===true) {
      paymentActions.voidPayment.done(res);
    } else {
      paymentActions.voidPayment.error(res);
    }
  },

  onCheckOndate: function(param) {
    ajaxActions.request('/api/receipt/checkOndate', param, this.doneCheckOndate);
  },

  doneCheckOndate: function(res) {
    if (res.status===true) {
      paymentActions.checkOndate.done(res.data);
    } else {
      paymentActions.checkOndate.error(res.error);
    }
  },

  onCheckCloseCashDaily: function() {
    ajaxActions.request('/api/receipt/checkCloseCashDaily', {}, this.doneCheckCloseCashDaily);
  },

  doneCheckCloseCashDaily: function(res) {
    if (res.status===true) {
      paymentActions.checkCloseCashDaily.done(res.data);
    } else {
      paymentActions.checkCloseCashDaily.error(res.error);
    }
  }

});

module.exports = paymentStore;
