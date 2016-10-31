var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var pickupListActions  = require('./actions');

var pickupList = Reflux.createStore({
    listenables: [pickupListActions],

  onListPickup: function(param) {
    console.log('request');
    ajaxActions.request('/api/bookingtransport/pickup/listPickUp', param, this.doneListPickup);
  },
//'/api/bookingtransport/listWaitAssign'
  doneListPickup: function(res) {
    if (res.status===true) {
      pickupListActions.listPickup.done(res.data, res.opt);
      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
    } else {
      pickupListActions.listPickup.error(res.error);
    }
  },

  onGetSearchBookingWait: function(req){
    //console.log("req Search = ", req);
    ajaxActions.request('/api/bookingtransport/pickup/getSearchBookingWait', req, this.doneGetSearchBookingWait);
  },
  doneGetSearchBookingWait: function(res){
    //console.log("doneGetSearchBookingWait = ", res);
    if(res.status===true){
      pickupListActions.getSearchBookingWait.done(res.data);
    } else {
      pickupListActions.getSearchBookingWait.error(res.error);
    }

  },

  onSavePickup: function(req) {
    ajaxActions.request('/api/bookingtransport/pickup/savePickup', req, this.doneSavePickup);
  },
  doneSavePickup: function(res) {
    if (res.status===true){
      pickupListActions.savePickup.done(res.data);
    } else {
      pickupListActions.savePickup.error(res.error);
    }
  },

  onUpdatePickup: function(req) {
    ajaxActions.request('/api/bookingtransport/pickup/updatePickup', req, this.doneUpdatePickup);
  },
  doneUpdatePickup: function(res) {
    if (res.status===true){
      pickupListActions.updatePickup.done(res.data);
    } else {
      pickupListActions.updatePickup.error(res.error);
    }
  },

  onGetPU: function(req){
    ajaxActions.request('/api/bookingtransport/pickup/getPU', {id:req}, this.doneGetPU);
  },
  doneGetPU: function(res){
    if (res.status === true){
      // pickupListActions.getPU.done(res.data);
      pickupListActions.getPU.done({
        pu:res.pu,
        pu_items:res.pu_items
      });
    } else {
      pickupListActions.getPU.error(res.error)
    }
  },

  onAddBarcode: function(req) {
    ajaxActions.request('/api/bookingtransport/pickup/addBarcode', req, this.doneAddBarcode);
  },
  doneAddBarcode: function(res){
    if(res.status === true){
      if(res.item_no != 'x'){
        pickupListActions.addBarcode.done(res.item_no);
      }else {
        pickupListActions.addBarcode.error(res.item_no);
      }
    }else {
      pickupListActions.addBarcode.error(res.error);
    }
  },

  onSavePickupReceipt: function(req) {
    ajaxActions.request('/api/bookingtransport/pickup/savePickupReceipt', req, this.doneSavePickupReceipt);
  },
  doneSavePickupReceipt: function(res){
    if(res.status === true){
      pickupListActions.savePickupReceipt.done(res.item_no);
    }else {
      pickupListActions.savePickupReceipt.error(res.error);
    }
  },

  onCancelPickup: function(req) {
    ajaxActions.request('/api/bookingtransport/pickup/cancelPickup', req, this.doneCancelPickup);
  },
  doneCancelPickup: function(res){
    if(res.status === true){
      pickupListActions.cancelPickup.done(res.pickup_id);
    }else {
      pickupListActions.cancelPickup.error(res.error);
    }
  },

  onGenPrintPickup: function(req) {
    ajaxActions.request('/api/bookingtransport/pickup/genPrintPickup', req, this.doneGenPrintPickup);
  },
  doneGenPrintPickup: function(res) {
    console.log("doneGenPrintPickup = ", res);
    if(res.status === true){
      pickupListActions.genPrintPickup.done(res.data)
    }else {
      pickupListActions.genPrintPickup.error(res.error)
    }
  },

  onGetAutoComplete: function(req) {
    ajaxActions.request('/api/bookingtransport/pickup/getAutoComplete', req, this.doneGetAutoComplete);
  },
  doneGetAutoComplete: function(res) {
    // console.log("AutoComplete res = ", res);
    if(res.status == true){
      pickupListActions.getAutoComplete.done(res.data);
    }else {
      console.log("error = ", res.error);
      pickupListActions.getAutoComplete.error(res.error);
    }
  }

});

module.exports = pickupList;
