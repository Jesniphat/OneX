var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var bookingActions  = require('./actions');

var booking = Reflux.createStore({
  listenables: [bookingActions],

  onList: function(param) {
    console.log('request');
    ajaxActions.request('/api/preliminary/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      bookingActions.list.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      bookingActions.list.error(res.error);
    }
  },

  onGetContentPackageList: function() {
    //console.log('XXX');
    ajaxActions.request('/api/bookingtransport/getContentPackageList', {}, this.doneGetContentPackageList);
  },
  doneGetContentPackageList: function(res) {
    if (res.status === true) {
      //console.log('donegetContentPackageList = ',res.data.packageList);
      bookingActions.getContentPackageList.done(res.data.packageList);
    } else {
      //console.log("getContentPackageList error");
      bookingActions.getContentPackageList.error(res.msg);
    }
  },

  onGetDefaultAddr: function(personId) {
    //console.log("store personId = ",personId);
    var res = {person_id:personId};
    ajaxActions.request('/api/bookingtransport/getDefaultAddr', res, this.doneGetDefaultAddr);
  },
  doneGetDefaultAddr: function(res) {
    //console.log("ดึงข้อมูลสำเร็จ = ", res);
    if (res.status === true) {
      bookingActions.getDefaultAddr.done(res.data.address[0]);
    } else {
      console.log("getDefaultAddr error");
      bookingActions.getDefaultAddr.error(res.msg);
    }
  },

  onGetAddressList: function(personId) {
    var res = {person_id:personId};
    ajaxActions.request('/api/bookingtransport/getAddressList', res, this.doneGetAddressList);
  },
  doneGetAddressList: function(res) {
    //console.log("addressList = ",res);
    if (res.status === true) {
      bookingActions.getAddressList.done(res.data.addressList);
    } else {
      console.log("getAddressList error");
    }
  },

  onGetFromDestination: function() {
    //console.log('onGetFromDestination');
    ajaxActions.request('/api/bookingtransport/getFromDestination', {}, this.doneGetFromDestination);
  },
  doneGetFromDestination: function(res) {
    if (res.status === true){
      bookingActions.getFromDestination.done(res.data.fromDestination);
    } else {
      console.log("onGetFromDestination Error = ", res.msg);
    }
  },

  onGetToDestination: function() {
    //console.log("onGetToDestination");
    ajaxActions.request('/api/bookingtransport/getToDestination', {}, this.doneGetToDestination);
  },
  doneGetToDestination: function(res) {
    //console.log("Done = ", res);
    if (res.status === true){
      bookingActions.getToDestination.done(res.data.toDestination);
    } else {
      console.log("onGetToDestination Error = ", res.msg);
    }
  },

  onGetRateType: function() {
    ajaxActions.request('/api/bookingtransport/getRateType', {}, this.doneGetRateType);
  },
  doneGetRateType: function(res) {
    if (res.status === true){
      bookingActions.getRateType.done(res.data.rateType);
    }
  },

  onGetRate: function(from,to,type) {
    //console.log("getRate = ", from, to);
    var res = {from:from, to:to, type:type};
    ajaxActions.request('/api/bookingtransport/getRate', res, this.doneGetRate);
  },
  doneGetRate: function(res){
    console.log("done Rate = ", res.data.rate[0]);
    if(res.status === true){
      bookingActions.getRate.done(res.data.rate[0]);
    }else{
      console.log("Get Rate Error");
      bookingActions.getRate.error(res.msg);
    }
  },

  onSaveBooking: function(req) {
    console.log("SaveBooking req = ", req);
    ajaxActions.request('/api/bookingtransport/saveBooking', req, this.doneSaveBooking);
  },
  doneSaveBooking: function(res){
    if (res.status === true) {
      console.log("Save Booking Complete");
      bookingActions.saveBooking.done(res.data);
    } else {
      console.log("Save Booking Error");
      bookingActions.saveBooking.error(res.error);
    }
  },

  onSaveBillist: function(req) {
    console.log("Add billing Lidt = ", req);
    ajaxActions.request('/api/bookingtransport/saveBillist', req, this.doneSaveBillist);
  },
  doneSaveBillist: function(res) {
    if (res.status === true){
      console.log("done SaveBillist");
      bookingActions.saveBillist.done(res.data);
    } else {
      console.log("done SaveBillist Error");
    }
  },

  onPrintReportBooking: function(bookingId) {
    //console.log('Start Gen Report = ', bookingId);
    var req = {bookingId:bookingId};
    ajaxActions.request('/api/bookingtransport/booking_report', req, this.donePrintReportBooking);
  },
  donePrintReportBooking: function(res) {
    if (res.status===true) {
      console.log("GenReport Complete");
      bookingActions.printReportBooking.done(res.data);
    } else {
      console.log("GenReport Error");
      bookingActions.printReportBooking.error(res.error);
    }
  },

  onPrintBarcodeBooking: function(bookingId) {
    console.log('Start Gen Barcode = ', bookingId);
    var req = {bookingId:bookingId};
    ajaxActions.request('/api/bookingtransport/booking_barcode', req, this.donePrintBarcodeBooking);
  },
  donePrintBarcodeBooking: function(res) {
    if (res.status===true) {
      console.log("GenBarcode Complete");
      bookingActions.printBarcodeBooking.done(res.data);
    } else {
      console.log("GenBarcode Error");
      bookingActions.printBarcodeBooking.error(res.error);
    }
  },

  onPrintInvoiceBooking: function(bookingId) {
    var req = {bookingId:bookingId};
    ajaxActions.request('/api/bookingtransport/invoice_report', req, this.donePrintInvoiceBooking);
  },
  donePrintInvoiceBooking: function(res) {
     if (res.status===true) {
      console.log("GenBarcode Complete");
      bookingActions.printInvoiceBooking.done(res.data);
    } else {
      console.log("GenBarcode Error");
      bookingActions.printInvoiceBooking.error(res.error);
    }
  },

  onSentMail: function(bookingId) {
    console.log("sentMail");
    var req = {bookingId:bookingId};
    ajaxActions.request('/api/bookingtransport/booking_sentMail', req, this.doneSentMail);
  },
  doneSentMail: function(res) {
    console.log("sentMail res");
    if (res.status===true) {
      console.log("GenBarcode Complete");
      bookingActions.sentMail.done(res.data);
    } else {
      console.log("GenBarcode Error");
      bookingActions.sentMail.error(res.error);
    }
  },

  onGetPersonType: function(req) {
    ajaxActions.request('/api/bookingtransport/getPersonType', req,this.donGetPersonType);
  },
  donGetPersonType: function(res) {
    // console.log(res);
    if(res.status===true){
      bookingActions.getPersonType.done(res.person_type);
    }else {
      bookingActions.getPersonType.error(res.error);
    }
  },

  onGetPickUptime: function(req) {
    ajaxActions.request('/api/bookingtransport/getPickUptime', req, this.doneGetPickUptime);
  },
  doneGetPickUptime: function(res) {
    if(res.status===true){
      bookingActions.getPickUptime.done(res.data.pickupTime);
    }else {
      console.log("onGetPickUptime Error = ", res.msg);
    }
  },

  onGetCompanyProfile: function(req) {
    ajaxActions.request('/api/bookingtransport/getCompanyProfile', req, this.doneGetCompanyProfile);
  },
  doneGetCompanyProfile: function(res) {
    if(res.status===true){
      // console.log("Com P", res.data.conpany_profile[0]);
      bookingActions.getCompanyProfile.done(res.data.conpany_profile[0])
    }else {
      bookingActions.getCompanyProfile.error(res.error);
    }
  }

});

module.exports = booking;
