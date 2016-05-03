var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var stockinActions     = require('./stockin-actions');

var infoStore = Reflux.createStore({
  listenables: [stockinActions],

  // pendingActions.list
  onList: function(param) {
    ajaxActions.request('/api/info/listStockininfo', param, this.doneList);
  },

  doneList: function(res) {

    if (res.status===true) {

      stockinActions.list.done(res.data, res.opt);
      menuActions.updateCount('info', res.opt.totalRows);
    } else {

      stockinActions.list.error(res.msg);
    }
  },

  onExport: function(param) {
    console.log('oamrmrmrmfmsdlksadmlfjsajflsajdlkfalskfljka');

    ajaxActions.request('/api/info/exportStockininfo', param, this.doneExport);
  },

  doneExport: function(res) {

    console.log('Status=' + res.status);
    if (res.status===true) {
      stockinActions.export.done(res.file);
    } else {
      stockinActions.export.error();
    }
  }

});

module.exports = infoStore;
