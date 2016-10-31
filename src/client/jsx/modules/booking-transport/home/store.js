var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var homeActions  = require('./actions');

var home = Reflux.createStore({
  listenables: [homeActions],

  onGetAllBooking: function(req) {
    // console.log('onGetAllBooking = ', res);
    ajaxActions.request('/api/bookingtransport/home/allBooking', req, this.doneGetAllBooking);
  },
  doneGetAllBooking: function(res) {
    console.log("respont = ", res);
    if (res.status===true) {
      homeActions.getAllBooking.done(res);
    } else {
      homeActions.getAllBooking.error(res.error);
    }
  },

  onGetCityList: function(req){
    ajaxActions.request('/api/bookingtransport/home/getCityList', req, this.doneGetCityList);
  },
  doneGetCityList: function(res) {
    // console.log(res);
    if(res.status === true){
      homeActions.getCityList.done(res);
    }else {
      homeActions.getCityList.error(res.error);
    }
  },

  onGetDialogData: function(bookingId) {
      //console.log("req Dialog = ", req);
      var req = {booking_id:bookingId};
      ajaxActions.request('/api/bookingtransport/getDialogData', req, this.doneGetDialogData);
  },
  doneGetDialogData: function (res) {
      if(res.status === true){
          homeActions.getDialogData.done(res.data);
      }else{
          homeActions.getDialogData.error(res.error);
      }
  },

  onGetDialogDetailList: function(data){
    var req = {booking_id:data};
    ajaxActions.request('/api/bookingtransport/getDialogDetailList', req, this.doneGetDialogDetailList);
  },
  doneGetDialogDetailList: function(res){
    if(res.status === true){
      // console.log("Detail = ", res.data.bookingDetail_data);
      homeActions.getDialogDetailList.done(res.data.bookingDetail_data);
    }else {
      homeActions.getDialogDetailList.error(res.error);
    }
  },

  onGetDialogItemList: function(data){
    var req = {booking_id:data};
    ajaxActions.request('/api/bookingtransport/getDialogItemList', req, this.doneGetDialogItemList);
  },
  doneGetDialogItemList: function(res){
    if(res.status === true){
      // console.log("Detail = ", res.data.bookingDetail_data);
      homeActions.getDialogItemList.done(res.data.bookingItem_data);
    }else {
      homeActions.getDialogItemList.error(res.error);
    }
  },

  onSentDocToEmail: function(data){
    ajaxActions.request('/api/bookingtransport/sentDocToEmail', data, this.doneSentDocToEmail);
  },
  doneSentDocToEmail: function(res){
    if(res.status === true){
        homeActions.sentDocToEmail.done(res.data);
    }else {
        homeActions.sentDocToEmail.error(res.error);
    }
  },

  onExportExl: function(req){
    console.log("export Exl = ");
    console.log(req);
    ajaxActions.request('/api/bookingtransport/home/export', req, this.doneExportExl);
  },
  doneExportExl: function(res){
    console.log(res);
    if (res.status===true) {
      homeActions.exportExl.done(res.file);
    } else {
      homeActions.exportExl.error(res.msg);
    }
  }


});

module.exports = home;
