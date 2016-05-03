var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var returnActions     = require('./return-actions');

var infoStore = Reflux.createStore({
  listenables: [returnActions],

  // pendingActions.list
  onList: function(param) {
    ajaxActions.request('/api/info/listReturninfo', param, this.doneList);
  },

  doneList: function(res) {

    if (res.status===true) {

      returnActions.list.done(res.data, res.opt);
      menuActions.updateCount('info', res.opt.totalRows);
    } else {

      returninfoActions.list.error(res.msg);
    }
  },

  onExport: function(param) {
    ajaxActions.request('/api/info/exportReturninfo', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      returnActions.export.done(res.file);
    } else {
      returnActions.export.error();
    }
  }

});

module.exports = infoStore;
