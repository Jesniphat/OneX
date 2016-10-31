var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var paymentTrackingAction  = require('./actions');

var bookingList = Reflux.createStore({
    listenables: [paymentTrackingAction],

  onListPayment: function(param) {
    console.log('request');
    ajaxActions.request('/api/bookingtransport/payment_tracking/listPayment', param, this.doneListPayment);
  },
//'/api/bookingtransport/listWaitAssign'
  doneListPayment: function(res) {
    if (res.status===true) {
      paymentTrackingAction.listPayment.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      paymentTrackingAction.listPayment.error(res.error);
    }
  },

  onExport: function(param) {
    console.log("Export = ", param);
    ajaxActions.request('/api/bookingtransport/payment_tracking/export', param, this.doneExport);
  },
  doneExport: function(res) {
    if (res.status===true) {
      paymentTrackingAction.export.done(res.file);
    } else {
      paymentTrackingAction.export.error(res.msg);
    }
  },

  onCancelBooking: function(res){
    ajaxActions.request('/api/bookingtransport/cancelBooking', res, this.doneCancelBooking);
  },
  doneCancelBooking: function(res){
    if (res.status === true) {
      paymentTrackingAction.cancelBooking.done(res.data);
    }else {
      paymentTrackingAction.cancelBooking.error(res.error);
    }
  },

  onChangePaidBooking: function(req) {
    ajaxActions.request('/api/bookingtransport/payment_tracking/changePaidBooking', req, this.doneChangePaidBooking);
  },
  doneChangePaidBooking: function(res){
    console.log(res);
      if (res.status === true){
          paymentTrackingAction.changePaidBooking.done(res.data);
      }else{
          paymentTrackingAction.changePaidBooking.error(res.error);
      }
  },

  onChangePaidBookingList: function(req) {
    ajaxActions.request('/api/bookingtransport/payment_tracking/changePaidBookingList', req, this.doneChangePaidBookingList);
  },
  doneChangePaidBookingList: function(res){
    console.log(res);
      if (res.status === true){
          paymentTrackingAction.changePaidBookingList.done(res.data);
      }else{
          paymentTrackingAction.changePaidBookingList.error(res.error);
      }
  },

  onGetDialogData: function(bookingId) {
      //console.log("req Dialog = ", req);
      var req = {booking_id:bookingId};
      ajaxActions.request('/api/bookingtransport/getDialogData', req, this.doneGetDialogData);
  },
  doneGetDialogData: function (res) {
      if(res.status === true){
          paymentTrackingAction.getDialogData.done(res.data);
      }else{
          paymentTrackingAction.getDialogData.error(res.error);
      }
  },

  onSaveAddition: function(saveData) {
    ajaxActions.request('/api/bookingtransport/saveAddition', saveData, this.doneSaveAddition);
  },
  doneSaveAddition: function(res) {
    if(res.status === true){
        paymentTrackingAction.saveAddition.done(res.data);
    }else {
        paymentTrackingAction.saveAddition.error(res.error);
    }
  },

  onSentDocToEmail: function(data){
    ajaxActions.request('/api/bookingtransport/sentDocToEmail', data, this.doneSentDocToEmail);
  },
  doneSentDocToEmail: function(res){
    if(res.status === true){
        paymentTrackingAction.sentDocToEmail.done(res.data);
    }else {
        paymentTrackingAction.sentDocToEmail.error(res.error);
    }
  },

  onGetDialogDetailList: function(data){
    var req = {booking_id:data};
    ajaxActions.request('/api/bookingtransport/getDialogDetailList', req, this.doneGetDialogDetailList);
  },
  doneGetDialogDetailList: function(res){
    if(res.status === true){
      // console.log("Detail = ", res.data.bookingDetail_data);
      paymentTrackingAction.getDialogDetailList.done(res.data.bookingDetail_data);
    }else {
      paymentTrackingAction.getDialogDetailList.error(res.error);
    }
  },

  onGetDialogItemList: function(data){
    var req = {booking_id:data};
    ajaxActions.request('/api/bookingtransport/getDialogItemList', req, this.doneGetDialogItemList);
  },
  doneGetDialogItemList: function(res){
    if(res.status === true){
      // console.log("Detail = ", res.data.bookingDetail_data);
      paymentTrackingAction.getDialogItemList.done(res.data.bookingItem_data);
    }else {
      paymentTrackingAction.getDialogItemList.error(res.error);
    }
  }

});

module.exports = bookingList;
