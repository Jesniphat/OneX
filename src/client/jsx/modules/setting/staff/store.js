var Reflux          = require('reflux');
var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var staffActions    = require('./actions');

var staffStore = Reflux.createStore({
  listenables: [staffActions],

  // staffActions.list
  onList: function(param) {
    ajaxActions.request('/api/setting/staff/list', param, this.doneList);
  },

  doneList: function(res) {
    if (res.status===true) {
      staffActions.list.done(res.data, res.opt);
//      menuActions.updateCount('staff', res.opt.totalRows);
    } else {
      staffActions.list.error(res.error);
    }
  },

  // staffActions.export
  onExport: function(param) {
    ajaxActions.request('/api/setting/staff/export', param, this.doneExport);
  },

  doneExport: function(res) {
    if (res.status===true) {
      staffActions.export.done(res.file);
    } else {
      staffActions.export.error(res.msg);
    }
  },


  onFacetList: function() {
    ajaxActions.request('/api/setting/staff/facetList', {}, this.doneFacetList);
  },

  doneFacetList: function(res) {
    if (res.status===true) {
      staffActions.facetList.done(res.data);
    } else {
      staffActions.facetList.error(res.error);
    }
  },

  onGetById: function(id) {
    ajaxActions.request('/api/setting/staff/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {
    if (res.status===true) {
      staffActions.getById.done(res.data);
    } else {
      staffActions.getById.error(res.msg);
    }
  },

  onSave: function(data) {
    ajaxActions.request('/api/setting/staff/save', {data:data}, this.doneSave);
  },

  doneSave: function(res) {
    if (res.status===true) {
      staffActions.save.done(res.user);
//      menuActions.updateCount('branch', res.totalRows);
    } else {
      staffActions.save.error(res.error);
    }
  },

  onFacetEdit: function() {
    ajaxActions.request('/api/setting/staff/facetEdit', {}, this.doneFacetEdit);
  },

  doneFacetEdit: function(res) {
    if (res.status===true) {
      staffActions.facetEdit.done(res.data);
    } else {
      staffActions.facetEdit.error(res.error);
    }
  }

});

module.exports = staffStore;
