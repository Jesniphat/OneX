var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;
var Actions = require('./actions');

var contractStore = Reflux.createStore({
  listenables: [Actions],

  // contractActions.list
  onList: function(param) {
    ajaxActions.request('/api/info/contract/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      Actions.list.done(res.data, res.opt);
      menuActions.updateCount('info.sell', res.opt.totalRows);
    } else {
      Actions.list.error(res.error);
    }
  },
  // contractActions.list
  onExport: function(param) {
    ajaxActions.request('/api/info/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      Actions.export.done(res.file);
    } else {
      Actions.export.error(res.error);
    }
  },

  onGetById: function(id) {
    ajaxActions.request('/api/info/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {

    if (res.status===true) {
      Actions.getById.done({
        closeCost: res.closeCost
      });
    } else {
      Actions.getById.error(res.msg);
    }
  },

});

module.exports = contractStore;
