var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var productAction  = require('./actions');

var product = Reflux.createStore({
  listenables: [productAction],

  // customerList
  onGroupProductList: function(param) {
    ajaxActions.request('/api/preliminary/group_product_list', param, function(res) {
      productAction.groupProductList.done(res.data, res.opt);
    });
  },

  // customerList
  onGroupProductItem: function(param) {
    ajaxActions.request('/api/preliminary/product_group_item', param, function(res) {
      console.log('product_group_item', res);
      productAction.groupProductItem.done(res.data, res.opt);
    });
  },
// }
  onAllProductItem: function(param) {
    ajaxActions.request('/api/preliminary/product_all_item', param, function(res) {
      console.log('product_all_item', res);
      productAction.allProductItem.done(res.data, res.opt);
    });
  },
  onAllGroupItem: function(param) {
    ajaxActions.request('/api/preliminary/group_all_item', param, function(res) {
      console.log('group_all_item', res);
      productAction.allGroupItem.done(res.data, res.opt);
    });
  },
  onGetGroupProudct: function(param) {
    ajaxActions.request('/api/preliminary/group_proudct', param, function(res) {
      productAction.getGroupProudct.done(res);
    });
  },

  onGroupProductSave: function(param, group) {
    ajaxActions.request('/api/preliminary/group_proudct_save', { param: param, items: group }, function(res) {
      console.log('group_proudct_save', res);
      productAction.groupProductSave.done(res);
    });
  },
  onGroupProductDelete: function(param) {
    ajaxActions.request('/api/preliminary/group_proudct_delete', param, function(res) {
      console.log('group_proudct_delete', res);
      productAction.groupProductDelete.done(res);
    });
  }
});

module.exports = product;
