var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var sellActions     = require('./sell-actions');

var contractStore = Reflux.createStore({
  listenables: [sellActions],

  // sellActions.list
  onList: function(param) {
    ajaxActions.request('/api/contract/listPending', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      sellActions.list.done(res.data, res.opt);
      menuActions.updateCount('contract', res.opt.totalRows);
    } else {
      sellActions.list.error(res.msg);
    }
  }

});

module.exports = contractStore;
