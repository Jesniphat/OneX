var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var deliveryListActions  = require('./actions');

var deliveryList = Reflux.createStore({
    listenables: [deliveryListActions],

  onListDelivery: function(param) {
    console.log('request = ', param);
    ajaxActions.request('/api/bookingtransport/delivery/listDelivery', param, this.doneListDelivery);
  },
  doneListDelivery: function(res) {
    if (res.status===true) {
      deliveryListActions.listDelivery.done(res.data, res.opt);
    } else {
      deliveryListActions.listDelivery.error(res.error);
    }
  },

  onSaveDelivery: function(req) {
    ajaxActions.request('/api/bookingtransport/delivery/saveDelivery', req, this.doneSaveDelivery);
  },
  doneSaveDelivery: function(res) {
    if (res.status===true){
      deliveryListActions.saveDelivery.done(res.data);
    } else {
      deliveryListActions.saveDelivery.error(res.error);
    }
  },

  onAddBarcode: function(req) {
    ajaxActions.request('/api/bookingtransport/delivery/addBarcode', req, this.doneAddBarcode);
  },
  doneAddBarcode: function(res){
    if(res.status === true){
      if(res.item_no != 'x'){
        deliveryListActions.addBarcode.done(res.item_no);
      }else {
        deliveryListActions.addBarcode.error(res.item_no);
      }
    }else {
      deliveryListActions.addBarcode.error(res.error);
    }
  },

  onGetDeliveryItemById: function(req) {
    var id = {delivery_id:req};
    ajaxActions.request('/api/bookingtransport/delivery/getDeliveryItemById', id, this.doneGetDeliveryItemById);
  },
  doneGetDeliveryItemById: function(res){
    // console.log(res);
    if(res.status === true){
      deliveryListActions.getDeliveryItemById.done(res);
    }else {
      deliveryListActions.getDeliveryItemById.error(res.error);
    }
  },

  onUpdateDelivery: function(req) {
    ajaxActions.request('/api/bookingtransport/delivery/updateDelivery', req, this.doneUpdateDelivery);
  },
  doneUpdateDelivery: function(res){
    // console.log(res);
    if(res.status === true){
      deliveryListActions.updateDelivery.done(res.data);
    }else {
      deliveryListActions.updateDelivery.error(res);
    }
  },

  onAddBarcodeRecipt: function(req) {
    // console.log("addBarcodeRecipt = ", req);
    ajaxActions.request('/api/bookingtransport/delivery/addBarcodeRecipt', req, this.doneAddBarcodeRecipt);
  },
  doneAddBarcodeRecipt: function(res) {
    // console.log("doneAddBarcodeRecipt = ", res);
    if(res.status === true){
      if(res.item_no != 'x'){
        deliveryListActions.addBarcodeRecipt.done(res.item_no);
      }else {
        deliveryListActions.addBarcodeRecipt.error(res.item_no);
      }
    }else {
      deliveryListActions.addBarcodeRecipt.error(res.error);
    }
  },

  onSaveDeliveryReceipt: function(req) {
    // console.log("saveIntransitReceipt req = ", req);
      ajaxActions.request('/api/bookingtransport/delivery/saveDeliveryReceipt', req, this.doneSaveDeliveryReceipt);
  },
  doneSaveDeliveryReceipt: function(res) {
    if(res.status === true){
      deliveryListActions.saveDeliveryReceipt.done(res.item_no);
    }else {
      deliveryListActions.saveDeliveryReceipt.error(res.error);
    }
  },

  onGenDeliveryReport: function(req) {
    ajaxActions.request('/api/bookingtransport/delivery/genDeliveryReport', req, this.doneGenDeliveryReport);
  },
  doneGenDeliveryReport: function(res) {
    // console.log(res);
    if (res.status===true){
      deliveryListActions.genDeliveryReport.done(res.data);
    } else {
      deliveryListActions.genDeliveryReport.error(res.error);
    }
  }

});

module.exports = deliveryList;
