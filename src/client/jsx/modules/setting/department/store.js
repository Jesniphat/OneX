var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; // require('../../system/actions/ajax');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var departmentActions  = require('./actions');

var departmentStore = Reflux.createStore({
  listenables: [departmentActions],

  // departmentActions.list
  onList: function(param) {
    ajaxActions.request('/api/setting/department/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      departmentActions.list.done(res.data, res.opt);
//      menuActions.updateCount('department', res.opt.totalRows);
    } else {
      departmentActions.list.error(res.msg);
    }
  },

  // departmentActions.export
  onExport: function(param) {
    ajaxActions.request('/api/setting/department/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      departmentActions.export.done(res.file);
    } else {
      departmentActions.export.error(res.msg);
    }
  },

  onGetById: function(id) {
    ajaxActions.request('/api/setting/department/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {
    if (res.status===true) {
      departmentActions.getById.done(res.data);
    } else {
      departmentActions.getById.error(res.msg);
    }
  },

  onSave: function(data) {
    ajaxActions.request('/api/setting/department/save', {data:data}, this.doneSave);
  },

  doneSave: function(res) {
    if (res.status===true) {
      departmentActions.save.done(res.data);
//      menuActions.updateCount('department', res.totalRows);
    } else {
      departmentActions.save.error(res.msg);
    }
  },

  onDelete: function(id) {
    ajaxActions.request('/api/setting/department/delete', {id:id}, this.doneDelete);
  },

  doneDelete: function(res) {
    if (res.status===true) {
      departmentActions.delete.done(res.data);
    } else {
      departmentActions.delete.error(res.msg);
    }
  }
});

module.exports = departmentStore;
