var system =require('ss-system');

var ajaxActions     = system.ajaxActions;// require('../../../actions/ajax');
var ajaxStore       = system.ajaxStore;// require('../../../stores/ajax');
var menuActions     = system.menuActions;// require('../../../actions/menu');
var Reflux          = require('reflux');
var changeActions  = require('./actions');

var changeStore = Reflux.createStore({
  listenables: [changeActions],

  onCheckproduct: function(param) {

    console.log('test');
    ajaxActions.request('/api/change/checkproduct', param, this.doneCheckproduct);
  },

  doneCheckproduct: function(res) {
    if (res.status===true) {
      changeActions.checkproduct.done(res.data);
    } else {
      changeActions.checkproduct.error(res.error);
    }
  },

  onSaveCloseChange: function(id) {
    ajaxActions.request('/api/installment/change/saveCloseChange', {id:id}, this.doneSaveCloseChange);
  },

  doneSaveCloseChange: function(res) {
    if (res.status===true) {
      changeActions.saveCloseChange.done(res.data);
    } else {
      changeActions.saveCloseChange.error(res.error);
    }
  },

});

module.exports = changeStore;
