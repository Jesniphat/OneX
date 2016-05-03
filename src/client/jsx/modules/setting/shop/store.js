var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var shopActions     = require('./actions');

var shopStore = Reflux.createStore({
  listenables: [shopActions],

  // shopActions.list
  onList: function(param) {
    ajaxActions.request('/api/setting/shop/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      shopActions.list.done(res.data, res.opt);
//      menuActions.updateCount('shop', res.opt.totalRows);
    } else {
      shopActions.list.error(res.msg);
    }
  },

  // shopActions.export
  onExport: function(param) {
    ajaxActions.request('/api/setting/shop/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      shopActions.export.done(res.file);
    } else {
      shopActions.export.error(res.msg);
    }
  },

  onGetById: function(id) {
    ajaxActions.request('/api/setting/shop/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {
    if (res.status===true) {
      shopActions.getById.done(res.data);
    } else {
      shopActions.getById.error(res.msg);
    }
  },

  onSave: function(data) {
    ajaxActions.request('/api/setting/shop/save', {data:data}, this.doneSave);
  },

  doneSave: function(res) {
    if (res.status===true) {
      shopActions.save.done(res.data);
//      menuActions.updateCount('shop', res.totalRows);
    } else {
      shopActions.save.error(res.msg);
    }
  },

  onDelete: function(id) {
    ajaxActions.request('/api/setting/shop/delete', {id:id}, this.doneDelete);
  },

  doneDelete: function(res) {
    if (res.status===true) {
      shopActions.delete.done(res.data);
    } else {
      shopActions.delete.error(res.msg);
    }
  }
});

module.exports = shopStore;
