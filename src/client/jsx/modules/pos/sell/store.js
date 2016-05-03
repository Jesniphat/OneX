var Reflux          = require('reflux');

var system          = require('ss-system');
var ajax            = system.ajaxActions; //require('../../system/actions/ajax');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var actions     = require('./actions');

var sellStore = Reflux.createStore({
  listenables: [actions],

  // pendingActions.list
  onList: function(param) {
    ajax.request('/api/sell/list', param, function(res) {
        actions.list.done(res.data, res.opt);
    });
  },

  onExport: function(param) {
    ajax.request('/api/installment/contract/exportPending', param, function(res) {
      if (res.status===true) {
        actions.export.done(res.file);
      } else {
        actions.export.error();
      }
    });
  },
  // actions.list 
  onGetInitData: function(param) {
    ajax.request('/api/sell/init', param, actions.getInitData.done);
  },

  onDateChange: function(param) {
    ajax.request('/api/sell/checkOndate', param, actions.dateChange.done);
  },

  onGetProductDetail: function(param) {
    ajax.request('/api/sell/search-product', param, actions.getProductDetail.done);
  },
  
  onGetCustomerDetail: function(id, shop_id) {
    ajax.request('/api/sell/search-customer', { company_id: id, shop_id: shop_id }, actions.getCustomerDetail.done);
  },

  onGetById: function(id) {
    ajax.request('/api/sell/getById', {id:id}, this.doneGetById);
  },

  doneGetById: function(res) {
    if (res.status===true) {
      actions.getById.done(res.data);
    } else {
      actions.getById.error(res.msg);
    }
  },

  onSaveData: function(data) {
    ajax.request('/api/sell/save', data, actions.saveData.done);
  },

  onFacetEdit: function() {
    ajax.request('/api/sell/facetEdit', {}, this.doneFacetEdit);
  },

  doneFacetEdit: function(res) {
    if (res.status===true) {
      actions.facetEdit.done(res.data);
    } else {
      actions.facetEdit.error(res.error);
    }
  }

});

module.exports = sellStore;
