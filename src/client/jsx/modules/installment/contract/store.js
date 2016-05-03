var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var contractActions = require('./actions');

var contractStore = Reflux.createStore({
  listenables: [contractActions],

  // contractActions.list
  onList: function(param) {
    ajaxActions.request('/api/installment/contract/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      contractActions.list.done(res.data, res.opt);
      menuActions.updateCount('contract.sell', res.opt.totalRows);
    } else {
      contractActions.list.error(res.error);
    }
  },
  // contractActions.list
  onExport: function(param) {
    ajaxActions.request('/api/installment/contract/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      contractActions.export.done(res.file);
    } else {
      contractActions.export.error(res.error);
    }
  },
  onGetBarcode: function(param) {
    ajaxActions.request('/api/installment/contract/listBarcode', param, this.doneGetBarcode);
  },

  doneGetBarcode: function(res) {
    if (res.status===true) {
      contractActions.getBarcode.done(res.data, res.opt);
    } else {
      contractActions.getBarcode.error(res.error);
    }
  },

  onGetById: function(id) {
    ajaxActions.request('/api/installment/contract/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {
    if (res.status===true) {
      contractActions.getById.done({
        contract: res.contract,
        paymentTerm: res.paymentTerm,
        refContract: res.refContract
      });
    } else {
      contractActions.getById.error(res.msg);
    }
  },

  onSaveNew: function(data) {
    ajaxActions.request('/api/installment/contract/saveNew', data, this.doneSaveNew);
  },

  doneSaveNew: function(res) {
    if (res.status===true) {
      contractActions.saveNew.done(res.data);
//      menuActions.updateCount('contract', res.totalRows);
    } else {
      contractActions.saveNew.error(res.error);
    }
  },

  onDelete: function(id) {
    ajaxActions.request('/api/installment/contract/delete', {id:id}, this.doneDelete);
  },

  doneDelete: function(res) {
    if (res.status===true) {
      contractActions.delete.done(res.data);
    } else {
      contractActions.delete.error(res.msg);
    }
  },

  onGetSellInfo: function(id) {
    ajaxActions.request('/api/installment/contract/sellInfo', {id:id}, this.doneGetSellInfo);
  },

  doneGetSellInfo: function(res) {
    if (res.status===true) {
      contractActions.getSellInfo.done(res.data);
    } else {
      contractActions.getSellInfo.error(res.error);
    }
  },

  onSave: function(data) {
    ajaxActions.request('/api/installment/contract/save', data, this.doneSave);
  },
  doneSave: function(res) {
    console.log(res.status);
    if (res.status===true) {
      contractActions.save.done(res.data);
    } else {
      contractActions.save.error(res.error);
    }
  },

  // contractActions.Close
  onListClose: function(param) {
    ajaxActions.request('/api/installment/contract/listClose', param, this.doneListClose);
  },

  doneListClose: function(res) {
    if (res.status===true) {
      contractActions.listClose.done(res.data, res.opt);
      //menuActions.updateCount('contract.sell', res.opt.totalRows);
    } else {
      contractActions.listClose.error(res.error);
    }
  },

  onExportClose: function(param) {
    ajaxActions.request('/api/installment/contract/exportClose', param, this.doneExportClose);
  },

  doneExportClose: function(res) {
    if (res.status===true) {
      contractActions.exportClose.done(res.file);
    } else {
      contractActions.exportClose.error(res.error);
    }
  },

  onGetCloseReturn: function(param){
    console.log('request');
    ajaxActions.request('/api/installment/contract/getCloseReturn', param, this.doneGetCloseReturn);
  },

  doneGetCloseReturn: function(res) {
    if (res.status===true) {
      contractActions.getCloseReturn.done(res.data);
    } else {
      contractActions.getCloseReturn.error(res.error);
    }
  },

  onSaveCollection: function(param){
    ajaxActions.request('/api/installment/contract/saveCollection', param, this.doneSaveCollection);
  },

  doneSaveCollection: function(res) {
    if (res.status===true) {
      contractActions.saveCollection.done(res.data);
    } else {
      contractActions.saveCollection.error(res.error);
    }
  },

  onGetListCollection: function(id){
    ajaxActions.request('/api/installment/contract/getListCollection', {id:id}, this.doneGetListCollection);
  },

  doneGetListCollection: function(res) {
    if (res.status===true) {
      contractActions.getListCollection.done(res.data);
    } else {
      contractActions.getListCollection.error(res.error);
    }
  },

  onGetMobileNumber: function(param) {
    //console.log('onPaymentOptionList');
    ajaxActions.request('/api/installment/contract/getMobileNumber', param, this.doneGetMobileNumber);
  },

  doneGetMobileNumber: function(res) {
    if (res.status===true) {
      contractActions.getMobileNumber.done(res.data);
    } else {
      contractActions.getMobileNumber.error(res.error);
    }
  },

  onPrintCollectionReport: function(res){
    ajaxActions.request('/api/installment/contract/printCollectionReport', res, this.donePrintCollectionReport);
  },

  donePrintCollectionReport: function(res) {
    if (res.status===true) {
      contractActions.printCollectionReport.done(res.data);
    } else {
      contractActions.printCollectionReport.error(res.error);
    }
  },

  onExportDunning: function(param) {
    ajaxActions.request('/api/installment/contract/exportDunning', param, this.doneExportDunning);
  },

  doneExportDunning: function(res) {
    if (res.status===true) {
      contractActions.exportDunning.done(res.file);
    } else {
      contractActions.exportDunning.error(res.error);
    }
  },

  onListClosediscount: function(param) {
    ajaxActions.request('/api/installment/contract/listClosediscount', param, this.doneListClosediscount);
  },

  doneListClosediscount: function(res) {
    if (res.status===true) {
      contractActions.listClosediscount.done(res.data, res.opt);
      menuActions.updateCount('contract.sell', res.opt.totalRows);
    } else {
      contractActions.listClosediscount.error(res.error);
    }
  },
  // contractActions.list
  onExportClosediscount: function(param) {
    ajaxActions.request('/api/installment/contract/exportClosediscount', param, this.doneExportClosediscount);
  },

  doneExportClosediscount: function(res) {
    if (res.status===true) {
      contractActions.exportClosediscount.done(res.file);
    } else {
      contractActions.exportClosediscount.error(res.error);
    }
  },

  onSaveClosediscount: function(id){
    console.log('request');
    ajaxActions.request('/api/installment/contract/saveClosediscount', {id:id}, this.doneSaveClosediscount);
  },

  doneSaveClosediscount: function(res) {
    if (res.status===true) {
      contractActions.saveClosediscount.done(res);
    } else {
      contractActions.saveClosediscount.error(res.error);
    }
  },

  onCloseCaStaffList: function(id) {
    ajaxActions.request('/api/installment/contract/closeCaStaffList', {id:id}, this.doneCloseCaStaffList);
  },

  doneCloseCaStaffList: function(res) {
    if (res.status===true) {
      contractActions.closeCaStaffList.done(res.data);
    } else {
      contractActions.closeCaStaffList.error(res.error);
    }
  },

  onSaveCloseCa: function(param) {
    ajaxActions.request('/api/installment/contract/saveCloseCa', param, this.doneSaveCloseCa);
  },

  doneSaveCloseCa: function(res) {
    if (res.status===true) {
      contractActions.saveCloseCa.done(res);
    } else {
      contractActions.saveCloseCa.error(res.error);
    }
  },

  onGetContractID: function(contract_code) {
    //console.log('onPaymentOptionList');
    ajaxActions.request('/api/installment/contract/getContractID', {code:contract_code}, this.doneGetContractID);
  },

  doneGetContractID: function(res) {
    if (res.status===true) {
      contractActions.getContractID.done(res.data);
    } else {
      contractActions.getContractID.error(res.error);
    }
  },

  onGetPersonCard: function(nationid) {
    ajaxActions.request('/api/installment/contract/getPersonCard', {nationid:nationid}, this.doneGetPersonCard);
  },

  doneGetPersonCard: function(res) {
    console.log('res:',res);
    if (res.status===true) {
      contractActions.getPersonCard.done(res.data.person_card);
    } else {
      contractActions.getPersonCard.error(res.error);
    }
  },

  onGetPersonCardCo: function(nationid) {
    ajaxActions.request('/api/installment/contract/getPersonCardCo', {nationid:nationid}, this.doneGetPersonCardCo);
  },

  doneGetPersonCardCo: function(res) {
    console.log('res:',res);
    if (res.status===true) {
      contractActions.getPersonCardCo.done(res.data.person_card);
    } else {
      contractActions.getPersonCardCo.error(res.error);
    }
  },


});



module.exports = contractStore;
