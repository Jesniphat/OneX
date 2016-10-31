var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var intransitListActions  = require('./actions');

var pickupList = Reflux.createStore({
    listenables: [intransitListActions],

  onListIntransit: function(param) {
    console.log('request');
    ajaxActions.request('/api/bookingtransport/intransit/listIntransit', param, this.doneListIntransit);
  },
//'/api/bookingtransport/listWaitAssign'
  doneListIntransit: function(res) {
    if (res.status===true) {
      intransitListActions.listIntransit.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      intransitListActions.listIntransit.error(res.error);
    }
  },

  onSaveIntransit: function(req) {
    ajaxActions.request('/api/bookingtransport/intransit/saveIntransit', req, this.doneSaveIntransit);
  },
  doneSaveIntransit: function(res) {
    if (res.status===true){
      intransitListActions.saveIntransit.done(res.data);
    } else {
      intransitListActions.saveIntransit.error(res.error);
    }
  },

  onUpdatePickup: function(req) {
    ajaxActions.request('/api/bookingtransport/pickup/updatePickup', req, this.doneUpdatePickup);
  },
  doneUpdatePickup: function(res) {
    if (res.status===true){
      intransitListActions.updatePickup.done(res.data);
    } else {
      intransitListActions.updatePickup.error(res.error);
    }
  },

  onAddBarcode: function(req) {
    ajaxActions.request('/api/bookingtransport/intransit/addBarcode', req, this.doneAddBarcode);
  },
  doneAddBarcode: function(res){
    if(res.status === true){
      if(res.item_no != 'x'){
        intransitListActions.addBarcode.done(res.item_no);
      }else {
        intransitListActions.addBarcode.error(res.item_no);
      }
    }else {
      intransitListActions.addBarcode.error(res.error);
    }
  },

  onSavePickupReceipt: function(req) {
    ajaxActions.request('/api/bookingtransport/pickup/savePickupReceipt', req, this.doneSavePickupReceipt);
  },
  doneSavePickupReceipt: function(res){
    if(res.status === true){
      intransitListActions.savePickupReceipt.done(res.item_no);
    }else {
      intransitListActions.savePickupReceipt.error(res.error);
    }
  },

  onGetIntransitItemById: function(req) {
    var id = {intransit_id:req};
    ajaxActions.request('/api/bookingtransport/intransit/getIntransitItemById', id, this.doneGetIntransitItemById);
  },
  doneGetIntransitItemById: function(res){
    // console.log(res);
    if(res.status === true){
      intransitListActions.getIntransitItemById.done(res);
    }else {
      intransitListActions.getIntransitItemById.error(res.error);
    }
  },

  onUpdateIntransit: function(req) {
    ajaxActions.request('/api/bookingtransport/intransit/updateIntransit', req, this.doneUpdateIntransit);
  },
  doneUpdateIntransit: function(res){
    // console.log(res);
    if(res.status === true){
      intransitListActions.updateIntransit.done(res);
    }else {
      intransitListActions.updateIntransit.error(res);
    }
  },

  onAddBarcodeRecipt: function(req) {
    // console.log("addBarcodeRecipt = ", req);
    ajaxActions.request('/api/bookingtransport/intransit/addBarcodeRecipt', req, this.doneAddBarcodeRecipt);
  },
  doneAddBarcodeRecipt: function(res) {
    // console.log("doneAddBarcodeRecipt = ", res);
    if(res.status === true){
      if(res.item_no != 'x'){
        intransitListActions.addBarcodeRecipt.done(res.item_no);
      }else {
        intransitListActions.addBarcodeRecipt.error(res.item_no);
      }
    }else {
      intransitListActions.addBarcodeRecipt.error(res.error);
    }
  },

  onSaveIntransitReceipt: function(req) {
    // console.log("saveIntransitReceipt req = ", req);
      ajaxActions.request('/api/bookingtransport/intransit/saveIntransitReceipt', req, this.doneSaveIntransitReceipt);
  },
  doneSaveIntransitReceipt: function(res) {
    if(res.status === true){
      intransitListActions.saveIntransitReceipt.done(res.item_no);
    }else {
      intransitListActions.saveIntransitReceipt.error(res.error);
    }
  },

  onGenReport: function(req) {
    ajaxActions.request('/api/bookingtransport/intransit/genReport', req, this.doneGenReport);
  },
  doneGenReport: function(res){
    console.log("testGenReport = ", res);
    if (res.status===true){
      intransitListActions.genReport.done(res.data);
    } else {
      intransitListActions.genReport.error(res.error);
    }
  },

  onGenBarcode: function(req) {
    ajaxActions.request('/api/bookingtransport/intransit/genBarcode', req, this.doneGenBarcode);
  },
  doneGenBarcode: function(res) {
    console.log("genBarcode = ", res);
    if (res.status===true){
      intransitListActions.genBarcode.done(res.data);
    } else {
      intransitListActions.genBarcode.error(res.error);
    }
  },

  onSaveExceptionIntransit: function(req) {
    ajaxActions.request('/api/bookingtransport/intransit/saveExceptionIntransit', req, this.doneSaveExceptionIntransit);
  },
  doneSaveExceptionIntransit: function(res){
    console.log("doneSaveExceptionIntransit = ", res);
    if(res.status===true){
      intransitListActions.saveExceptionIntransit.done(res.data);
    }else {
      intransitListActions.saveExceptionIntransit.error(res.error);
    }
  },

  onGetDistrict: function(req) {
    ajaxActions.request('/api/bookingtransport/intransit/getDistrict', req, this.doneGetDistrict);
  },
  doneGetDistrict: function(res) {
    if(res.status===true){
      intransitListActions.getDistrict.done(res.data);
    }else {
      intransitListActions.getDistrict.error(res.error);
    }
  }

});

module.exports = pickupList;
