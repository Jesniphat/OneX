var Reflux          = require('reflux');

var system          = require('ss-system');

var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var menuActions     = system.menuActions; //require('../../system/actions/menu');

var grantActions    = require('./actions');

var grantStore = Reflux.createStore({
  listenables: [grantActions],

  onFacetSetting: function() {
    ajaxActions.request('/api/setting/grant/facetSetting', {}, this.doneFacetSetting);
  },

  doneFacetSetting: function(res) {
    if (res.status===true) {
      grantActions.facetSetting.done(res.data);
    } else {
      grantActions.facetSetting.error(res.error);
    }
  },

  onSave: function(data) {
    ajaxActions.request('/api/setting/grant/save', {data:data}, this.doneSave);
  },

  doneSave: function(res) {
    if (res.status===true) {
      grantActions.save.done(res.data);
//      menuActions.updateCount('grant', res.totalRows);
    } else {
      grantActions.save.error(res.msg);
    }
  }

});

module.exports = grantStore;
