var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var menuActions     = system.menuActions; //require('../../system/actions/menu');

var defaultActions    = require('./actions');

var grantStore = Reflux.createStore({
  listenables: [defaultActions],

  onFacetSetting: function() {
    ajaxActions.request('/api/setting/default/facetSetting', {}, this.doneFacetSetting);
  },

  doneFacetSetting: function(res) {
    if (res.status===true) {
      defaultActions.facetSetting.done(res.data);
    } else {
      defaultActions.facetSetting.error(res.error);
    }
  },

  onSave: function(data) {
    ajaxActions.request('/api/setting/default/save', data, this.doneSave);
  },

  doneSave: function(res) {
    if (res.status===true) {
      defaultActions.save.done(res.data);
    } else {
      defaultActions.save.error(res.msg);
    }
  }

});

module.exports = grantStore;
