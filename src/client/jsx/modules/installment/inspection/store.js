var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var inspectionActions = require('./actions');

var inspectionStore = Reflux.createStore({
  listenables: [inspectionActions],

  onInspect: function(param) {
    ajaxActions.request('/api/installment/inspection/inspect', param, this.doneInspect);
  },

  doneInspect: function(res) {
    if (res.status===true) {
      inspectionActions.inspect.done(res.data);
    } else {
      inspectionActions.inspect.error(res.error);
    }
  },

  onGenContractForm: function(param) {
    ajaxActions.request('/api/installment/inspection/genForm', param, this.doneGenContractForm);
  },

  doneGenContractForm: function(res) {
    if (res.status===true) {
      inspectionActions.genContractForm.done(res.data);
    } else {
      inspectionActions.genContractForm.error(res.error);
    }
  },

  // inspectionActions.list
  onList: function(param) {
    ajaxActions.request('/api/installment/inspection/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      inspectionActions.list.done(res.data, res.opt);
    } else {
      inspectionActions.list.error(res.error);
    }
  },

  onSavePerson: function(param) {
    ajaxActions.request('/api/installment/inspection/savePerson', param, this.doneSavePerson);
  },

  doneSavePerson: function(res) {
    if (res.status===true) {
      inspectionActions.savePerson.done(res.id);
    } else {
      inspectionActions.savePerson.error(res.error);
    }
  },

  onSavePersonPhoto: function(param) {
    ajaxActions.request('/api/installment/inspection/savePersonPhoto', param, this.doneSavePersonPhoto);
  },

  doneSavePersonPhoto: function(res) {
    if (res.status===true) {
      inspectionActions.savePersonPhoto.done(res.id);
    } else {
      inspectionActions.savePersonPhoto.error(res.error);
    }
  },

  onGetPersonOracle: function(param) {
    ajaxActions.request('/api/installment/inspection/getPersonOracle', param, this.doneGetPersonOracle);
  },

  doneGetPersonOracle: function(res) {
    inspectionActions.getPersonOracle.done(res);
  },

});

module.exports = inspectionStore;
