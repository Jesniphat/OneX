var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var bookingListActions  = require('./actions');

var bookingList = Reflux.createStore({
    listenables: [bookingListActions],

  onListWaitAssign: function(param) {
    console.log('request');
    ajaxActions.request('/api/bookingtransport/listWaitAssign', param, this.doneListWaitAssign);
  },
//'/api/bookingtransport/listWaitAssign'
  doneListWaitAssign: function(res) {
    if (res.status===true) {
      bookingListActions.listWaitAssign.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      bookingListActions.listWaitAssign.error(res.error);
    }
  },

  onListWaitClearCreditCard: function(param) {
      ajaxActions.request('/api/bookingtransport/listWaitClearCreditCard', param, this.doneListWaitClearCreditCard);
  },
  doneListWaitClearCreditCard: function(res) {
    if (res.status===true) {
      bookingListActions.listWaitClearCreditCard.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      bookingListActions.listWaitClearCreditCard.error(res.error);
    }
  },
  //listInprocess
  onListInprocess: function(param) {
      ajaxActions.request('/api/bookingtransport/listInprocess', param, this.doneListInprocess);
  },
  doneListInprocess: function(res) {
    if (res.status===true) {
      bookingListActions.listInprocess.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      bookingListActions.listInprocess.error(res.error);
    }
  },
  //InTransit
  onListInTransit: function(param) {
      ajaxActions.request('/api/bookingtransport/listInTransit', param, this.doneListInTransit);
  },
  doneListInTransit: function(res) {
    if (res.status===true) {
      bookingListActions.listInTransit.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      bookingListActions.listInTransit.error(res.error);
    }
  },
  // listArrived
  onListArrived: function(param) {
      ajaxActions.request('/api/bookingtransport/listArrived', param, this.doneListArrived);
  },
  doneListArrived: function(res) {
    if (res.status===true) {
      bookingListActions.listArrived.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      bookingListActions.listArrived.error(res.error);
    }
  },
  // listDelivered
  onListDelivered: function(param) {
      ajaxActions.request('/api/bookingtransport/listDelivered', param, this.doneListDelivered);
  },
  doneListDelivered: function(res) {
    if (res.status===true) {
      bookingListActions.listDelivered.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      bookingListActions.listDelivered.error(res.error);
    }
  },
  // listException
  onListException: function(param) {
      ajaxActions.request('/api/bookingtransport/listException', param, this.doneListException);
  },
  doneListException: function(res) {
    if (res.status===true) {
      bookingListActions.listException.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      bookingListActions.listException.error(res.error);
    }
  },
  // listCancel
  onListCancel: function(param) {
      ajaxActions.request('/api/bookingtransport/listCancel', param, this.doneListCancel);
  },
  doneListCancel: function(res) {
    if (res.status===true) {
      bookingListActions.listCancel.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      bookingListActions.listCancel.error(res.error);
    }
  },

  onCancelBooking: function(res){
    ajaxActions.request('/api/bookingtransport/cancelBooking', res, this.doneCancelBooking);
  },
  doneCancelBooking: function(res){
    if (res.status === true) {
      bookingListActions.cancelBooking.done(res.data);
    }else {
      bookingListActions.cancelBooking.error(res.error);
    }
  },

  onChangeStatusBooking: function(res) {
    ajaxActions.request('/api/bookingtransport/changeStatusBooking', res, this.doneChangeStatus);
  },
  doneChangeStatus: function(res){
      if (res.status === true){
          bookingListActions.changeStatusBooking.done(res.data);
      }else{
          bookingListActions.changeStatusBooking.error(res.error);
      }
  },

  onGetDialogData: function(bookingId) {
      //console.log("req Dialog = ", req);
      var req = {booking_id:bookingId};
      ajaxActions.request('/api/bookingtransport/getDialogData', req, this.doneGetDialogData);
  },
  doneGetDialogData: function (res) {
      if(res.status === true){
          bookingListActions.getDialogData.done(res.data);
      }else{
          bookingListActions.getDialogData.error(res.error);
      }
  },

  onSaveAddition: function(saveData) {
    ajaxActions.request('/api/bookingtransport/saveAddition', saveData, this.doneSaveAddition);
  },
  doneSaveAddition: function(res) {
    if(res.status === true){
        bookingListActions.saveAddition.done(res.data);
    }else {
        bookingListActions.saveAddition.error(res.error);
    }
  },

  onSentDocToEmail: function(data){
    ajaxActions.request('/api/bookingtransport/sentDocToEmail', data, this.doneSentDocToEmail);
  },
  doneSentDocToEmail: function(res){
    if(res.status === true){
        bookingListActions.sentDocToEmail.done(res.data);
    }else {
        bookingListActions.sentDocToEmail.error(res.error);
    }
  },

  onGetDialogDetailList: function(data){
    var req = {booking_id:data};
    ajaxActions.request('/api/bookingtransport/getDialogDetailList', req, this.doneGetDialogDetailList);
  },
  doneGetDialogDetailList: function(res){
    if(res.status === true){
      // console.log("Detail = ", res.data.bookingDetail_data);
      bookingListActions.getDialogDetailList.done(res.data.bookingDetail_data);
    }else {
      bookingListActions.getDialogDetailList.error(res.error);
    }
  },

  onGetDialogItemList: function(data){
    var req = {booking_id:data};
    ajaxActions.request('/api/bookingtransport/getDialogItemList', req, this.doneGetDialogItemList);
  },
  doneGetDialogItemList: function(res){
    if(res.status === true){
      // console.log("Detail = ", res.data.bookingDetail_data);
      bookingListActions.getDialogItemList.done(res.data.bookingItem_data);
    }else {
      bookingListActions.getDialogItemList.error(res.error);
    }
  }

});

module.exports = bookingList;
