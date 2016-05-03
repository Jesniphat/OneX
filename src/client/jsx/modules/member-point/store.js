var Reflux          = require('reflux');

var system          = require('ss-system');
var ajax            = system.ajaxActions; //require('../../system/actions/ajax');
var actions         = require('./actions');

module.exports = Reflux.createStore({
  listenables: [actions],
  onGetTaxID: function(param) {
    ajax.request('/api/member/search', param, actions.getTaxID.done);
  },
  onGetList: function(param) {
    ajax.request('/api/member/list', param, actions.getList.done);
  },

});