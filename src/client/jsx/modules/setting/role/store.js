var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var menuActions     = system.menuActions; //require('../../system/actions/menu');

var roleActions     = require('./actions');

var roleStore = Reflux.createStore({
  listenables: [roleActions],

  // roleActions.list
  onList: function(param) {
    ajaxActions.request('/api/setting/role/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      roleActions.list.done(res.data, res.opt);
//      menuActions.updateCount('role', res.opt.totalRows);
    } else {
      roleActions.list.error(res.msg);
    }
  },

  // roleActions.export
  onExport: function(param) {
    ajaxActions.request('/api/setting/role/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      roleActions.export.done(res.file);
    } else {
      roleActions.export.error(res.msg);
    }
  },

  onGetById: function(id) {
    ajaxActions.request('/api/setting/role/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {
    if (res.status===true) {
      roleActions.getById.done(res.data);
    } else {
      roleActions.getById.error(res.msg);
    }
  },

  onSave: function(data) {
    ajaxActions.request('/api/setting/role/save', {data:data}, this.doneSave);
  },

  doneSave: function(res) {
    if (res.status===true) {
      roleActions.save.done(res.data);
//      menuActions.updateCount('role', res.totalRows);
    } else {
      roleActions.save.error(res.msg);
    }
  },

  onDelete: function(id) {
    ajaxActions.request('/api/setting/role/delete', {id:id}, this.doneDelete);
  },

  doneDelete: function(res) {
    if (res.status===true) {
      roleActions.delete.done(res.data);
    } else {
      roleActions.delete.error(res.msg);
    }
  },

  onFacetEdit: function() {
    ajaxActions.request('/api/setting/role/facetEdit', {}, this.doneFacetEdit);
  },

  doneFacetEdit: function(res) {
    if (res.status===true) {
      roleActions.facetEdit.done(res.data);
    } else {
      roleActions.facetEdit.error(res.error);
    }
  }
});

module.exports = roleStore;
