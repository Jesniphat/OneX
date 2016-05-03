var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var stockActions     = require('./stock-actions');

var infoStore = Reflux.createStore({
  listenables: [stockActions],

  // pendingActions.list
  onList: function(param) {
    console.log('param:',param);
    ajaxActions.request('/api/info/listStockinfo', param, this.doneList);
  },

  doneList: function(res) {
    console.log('res:',res);
    if (res.status===true) {

      stockActions.list.done(res.data, res.opt,res.clCost);
      menuActions.updateCount('info', res.opt.totalRows);
    } else {

      stockActions.list.error(res.msg);
    }
  },

  onExport: function(param) {
    ajaxActions.request('/api/info/exportStockinfo', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      stockActions.export.done(res.file);
    } else {
      stockActions.export.error();
    }
  },

  onGetById: function(id) {
    ajaxActions.request('/api/info/getById', {id:system.sessionStore.getSession().staff.id}, this.doneGetById);
  },

  doneGetById: function(res) {
    console.log('resksksks:',res);
    if (res.status===true) {
      stockActions.getById.done(res.data.closeCost);
    } else {
      cashDailyActions.getById.error(res.msg);
    }
  },

});

module.exports = infoStore;
