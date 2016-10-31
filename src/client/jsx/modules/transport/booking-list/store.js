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

  onExportWaitAssign: function(param) {
    ajaxActions.request('/api/bookingtransport/exportWaitAssign', param, this.doneExportWaitAssign);
  },
  doneExportWaitAssign:function(res){
    if (res.status===true) {
      console.log("export status done");
      bookingListActions.exportWaitAssign.done(res.file);
    } else {
      bookingListActions.exportWaitAssign.error(res.msg);
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

  onExportWaitClearCreditCard: function(param) {
    ajaxActions.request('/api/bookingtransport/exportWaitClearCreditCard', param, this.doneExportWaitClearCreditCard);
  },
  doneExportWaitClearCreditCard:function(res){
    if (res.status===true) {
      console.log("export status done");
      bookingListActions.exportWaitClearCreditCard.done(res.file);
    } else {
      bookingListActions.exportWaitClearCreditCard.error(res.msg);
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

  onExportInprocess: function(param) {
    ajaxActions.request('/api/bookingtransport/exportInprocess', param, this.doneExportInprocess);
  },
  doneExportInprocess:function(res){
    if (res.status===true) {
      console.log("export status done");
      bookingListActions.exportInprocess.done(res.file);
    } else {
      bookingListActions.exportInprocess.error(res.msg);
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

  onExportInTransit: function(param) {
    ajaxActions.request('/api/bookingtransport/exportInTransit', param, this.doneExportInTransit);
  },
  doneExportInTransit:function(res){
    if (res.status===true) {
      console.log("export status done");
      bookingListActions.exportInTransit.done(res.file);
    } else {
      bookingListActions.exportInTransit.error(res.msg);
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

  onExportArrived: function(param) {
    ajaxActions.request('/api/bookingtransport/exportArrived', param, this.doneExportArrived);
  },
  doneExportArrived:function(res){
    if (res.status===true) {
      console.log("export status done");
      bookingListActions.exportArrived.done(res.file);
    } else {
      bookingListActions.exportArrived.error(res.msg);
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

  // exportDelivered
  onExportDelivered: function(param) {
    ajaxActions.request('/api/bookingtransport/exportDelivered', param, this.doneExportDelivered);
  },
  doneExportDelivered:function(res){
    if (res.status===true) {
      console.log("export status done");
      bookingListActions.exportDelivered.done(res.file);
    } else {
      bookingListActions.exportDelivered.error(res.msg);
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

  // exportException
  onExportException: function(param) {
    ajaxActions.request('/api/bookingtransport/exportException', param, this.doneExportException);
  },
  doneExportException:function(res){
    if (res.status===true) {
      console.log("export status done");
      bookingListActions.exportException.done(res.file);
    } else {
      bookingListActions.exportException.error(res.msg);
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

  // exportCancel
  onExportCancel: function(param) {
    ajaxActions.request('/api/bookingtransport/exportCancel', param, this.doneExportCancel);
  },
  doneExportCancel:function(res){
    if (res.status===true) {
      console.log("export status done");
      bookingListActions.exportCancel.done(res.file);
    } else {
      bookingListActions.exportCancel.error(res.msg);
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
