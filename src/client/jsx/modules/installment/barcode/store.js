var Reflux          = require('reflux');
var $               = require('jquery');
var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var barcodeActions = require('./actions');

var barcodeStore = Reflux.createStore({
  listenables: [barcodeActions],

  // barcodeActions.list
  onList: function(param) {
    console.log('onList');
    ajaxActions.request('/api/installment/barcode/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      barcodeActions.list.done(res.data, res.opt);
    } else {
      barcodeActions.list.error(res.error);
    }
  },
  // barcodeActions.list
  onExport: function(param) {
    ajaxActions.request('/api/installment/barcode/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      barcodeActions.export.done(res.file);
    } else {
      barcodeActions.export.error(res.error);
    }
  },

  onFacet: function() {
    ajaxActions.request('/api/installment/barcode/facet', {}, this.doneFacet);
  },

  doneFacet: function(res) {
    if (res.status === true) {
      barcodeActions.facet.done(res);
    } else {
      barcodeActions.facet.error(res.error);
    }
  },

  onGetBarcode: function(param) {
    ajaxActions.request('/api/installment/barcode/listBarcode', param, this.doneGetBarcode);
  },

  doneGetBarcode: function(res) {
    if (res.status===true) {
      barcodeActions.getBarcode.done(res.data);
    } else {
      barcodeActions.getBarcode.error(res.error);
    }
  },

  onGenerate: function(param) {
    ajaxActions.request('/api/installment/barcode/generate', param, this.doneGenerate);
  },

  doneGenerate: function(res) {
    if (res.status===true) {
      $.ajax({
        url:'//localhost:9001/barcode/ttp244',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(res.barcode),
        type:'POST',
        dataType:'json',
        success: function(result) { 
          barcodeActions.generate.done(result); 
        },
        error: function() { 
          barcodeActions.generate.done({ status: false }); 
        }
      });
    } else {
      barcodeActions.generate.done({ status: false });
    }
  },

  onReprint: function(param) {
    ajaxActions.request('/api/installment/barcode/reprint', param, this.doneReprint);
  },

  doneReprint: function(res) {
    if (res.status===true) {
      $.ajax({
        url:'//localhost:9001/barcode/ttp244',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(res.barcode),
        type:'POST',
        dataType:'json',
        success: function(result) {
          console.log(result); 
          barcodeActions.reprint.done(result); 
        },
        error: function() { 
          barcodeActions.reprint.done({ status: false, message: 'กรุณา Restart Service และ เชื่อต่อเครื่องพิมพ์อีกครั้ง' });
        }
      });
    } else {
      barcodeActions.reprint.done({ status: false });
    }
  },
  onGetById: function(id) {
    ajaxActions.request('/api/barcode/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {
    if (res.status===true) {
      barcodeActions.getById.done({
        barcode: res.barcode,
        paymentTerm: res.paymentTerm,
        refContract: res.refContract
      });
    } else {
      barcodeActions.getById.error(res.msg);
    }
  },

  onSaveNew: function(data) {
    ajaxActions.request('/api/barcode/saveNew', data, this.doneSaveNew);
  },

  doneSaveNew: function(res) {
    if (res.status===true) {
      barcodeActions.saveNew.done(res.data);
//      menuActions.updateCount('barcode', res.totalRows);
    } else {
      barcodeActions.saveNew.error(res.error);
    }
  },

  onDelete: function(id) {
    ajaxActions.request('/api/barcode/delete', {id:id}, this.doneDelete);
  },

  doneDelete: function(res) {
    if (res.status===true) {
      barcodeActions.delete.done(res.data);
    } else {
      barcodeActions.delete.error(res.msg);
    }
  },

  onGetSellInfo: function(id) {
    ajaxActions.request('/api/barcode/sellInfo', {id:id}, this.doneGetSellInfo);
  },

  doneGetSellInfo: function(res) {
    if (res.status===true) {
      barcodeActions.getSellInfo.done(res.data);
    } else {
      barcodeActions.getSellInfo.error(res.error);
    }
  },

  onSave: function(data) {
    ajaxActions.request('/api/barcode/save', data, this.doneSave);
  },
  doneSave: function(res) {
    if (res.status===true) {
      barcodeActions.save.done(res.data);
    } else {
      barcodeActions.save.error(res.error);
    }
  }
});

module.exports = barcodeStore;
