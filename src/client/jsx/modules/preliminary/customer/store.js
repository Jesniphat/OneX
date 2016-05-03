var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var customersActions  = require('./actions');

var customer = Reflux.createStore({
  listenables: [customersActions],

  // customerList
  onList: function(param) {
    console.log('request');
    ajaxActions.request('/api/preliminary/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      customersActions.list.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      customersActions.list.error(res.error);
    }
  },
  // onExport: function(param) {
  //   ajaxActions.request('/api/receipt/export', param, this.doneExport);
  // },
  //
  // doneExport: function(res) {
  //   if (res.status===true) {
  //     paymentActions.export.done(res.file);
  //   } else {
  //     paymentActions.export.error(res.error);
  //   }
  // },

  onGetMemberType: function() {
    //console.log('XXX');
    ajaxActions.request('/api/preliminary/getMemberType', {}, this.doneGetMemberType);
  },
  doneGetMemberType: function(res) {
    if (res.status === true) {
      //console.log('doneGetMemberType',res);
      customersActions.getMemberType.done(res.data);
    } else {
      customersActions.getMemberType.error(res.msg);
    }
  },

  onGetCurrencyFromBase: function() {
    console.log('ddttaa');
    ajaxActions.request('/api/preliminary/getCurrencyFromBase', {}, this.doneGetCurrencyFromBase);
  },
  doneGetCurrencyFromBase: function(res) {
    console.log('currency done');
    console.log(res);
    if (res.status === true) {
      customersActions.getCurrencyFromBase.done(res.data);
    } else {
      console.log("can't get Currency data.",res.msg);
    }
  },

  onGetCustomerData: function(res) {
    ajaxActions.request('/api/preliminary/getCustomerData', res, this.doneGetCustomerData);
  },
  doneGetCustomerData: function(res) {
    //console.log(res.data.customerData[0]);
    if (res.status === true) {
      console.log(res.data.customerData[0],'check_jes');
      customersActions.getCustomerData.done(res.data.customerData[0]);
    } else {
      customersActions.getCustomerData.error(res.msg);
    }
  },

  onGetContactListData: function(res) {
    ajaxActions.request('/api/preliminary/getContactListData', res, this.doneGetContactListData);
  },
  doneGetContactListData: function(res) {
    //console.log(res.data.contactListData,'jesCheck');
    if (res.status === true) {
      //console.log('doneGetMemberType');
      customersActions.getContactListData.done(res.data.contactListData);
    } else {
      customersActions.getContactListData.error(res.msg);
    }
  },

  onGetBillingListData: function(res) {
    ajaxActions.request('/api/preliminary/getBillingListData', res, this.doneGetBillingListData);
  },
  doneGetBillingListData: function(res) {
    //console.log("Billing = ",res.data.billingListDatas);
    if (res.status === true) {
      //console.log('doneGetMemberType');
      customersActions.getBillingListData.done(res.data.billingListDatas);
    } else {
      customersActions.getBillingListData.error(res.msg);
    }
  },

  onSaveCustomers: function(res) {
    console.log(res,'Jes Test');
    ajaxActions.request('/api/preliminary/saveCustomers', res, this.doneSaveCustomers);
  },
  doneSaveCustomers: function(res){
    if (res.status === true) {
      console.log('POUYT');
      customersActions.saveCustomers.done(res.data);
    }else {
      customersActions.saveCustomers.error(res.error);
    }
  },

  onEditCustomers: function(res){
    console.log('Jes Edit',res);
    ajaxActions.request('/api/preliminary/editCustomers', res, this.doneEditCustomers);
  },
  doneEditCustomers: function(res){
    if (res.status === true) {
      customersActions.editCustomers.done(res.data);
    }else {
      console.log(res);
      customersActions.editCustomers.error(res.error);
    }
  },

  onDeleteCustomers: function(res){
    ajaxActions.request('/api/preliminary/deleteCustomers', res, this.doneDeteleCustomers);
  },
  doneDeteleCustomers: function(res){
    if (res.status === true) {
      customersActions.deleteCustomers.done(res.data);
    }else {
      customersActions.deleteCustomers.error(res.error);
    }
  }
});

module.exports = customer;
