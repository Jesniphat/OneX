var system =require('ss-system');

var ajaxActions     = system.ajaxActions;// require('../../../actions/ajax');
var ajaxStore       = system.ajaxStore;// require('../../../stores/ajax');
var menuActions     = system.menuActions;// require('../../../actions/menu');
var Reflux          = require('reflux');
var commissionActions  = require('./actions');

var commissionStore = Reflux.createStore({
  listenables: [commissionActions],

  // commissionActions.list
  onList: function(param) {
    ajaxActions.request('/api/report/listclose', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      commissionActions.list.done(res.data, res.opt);
      // console.log('total=',res.opt.totalRows);
      // menuActions.updateCount('report.sell', res.opt.totalRows);
    } else {
      commissionActions.list.error(res.error);
    }
  },
  // contractActions.list
  onExportclose: function(param) {
    console.log('request');
    ajaxActions.request('/api/report/exportclose', param, this.doneExportclose);
  },

  doneExportclose: function(res) {
    if (res.status===true) {
      commissionActions.exportclose.done(res.file);
    } else {
      commissionActions.exportclose.error(res.error);
    }
  },

});

module.exports = commissionStore;
