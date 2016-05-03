webpackJsonp([111,135],{

/***/ 963:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var systemActions = system.systemActions; //require('../../system/actions');

	var customerActions = __webpack_require__(964);
	var customerStore = __webpack_require__(965);

	var GroupProduct = {};

	tr.registerTranslations('en', __webpack_require__(966));
	tr.registerTranslations('th', __webpack_require__(967));

	GroupProduct.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('preliminary.group_product.head'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	module.exports = GroupProduct;

/***/ },

/***/ 964:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'groupProductSave': { children: ['done', 'error'] },
	  'groupProductList': { children: ['done', 'error'] },
	  'groupProductItem': { children: ['done', 'error'] },
	  'allProductItem': { children: ['done', 'error'] },
	  'allGroupItem': { children: ['done', 'error'] },
	  'getGroupProudct': { children: ['done', 'error'] },
	  'groupProductDelete': { children: ['done', 'error'] }
	});

/***/ },

/***/ 965:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);
	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var sellActions = system.sellActions; //require('./actions');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var productAction = __webpack_require__(964);

	var product = Reflux.createStore({
	  listenables: [productAction],

	  // customerList
	  onGroupProductList: function onGroupProductList(param) {
	    ajaxActions.request('/api/preliminary/group_product_list', param, function (res) {
	      productAction.groupProductList.done(res.data, res.opt);
	    });
	  },

	  // customerList
	  onGroupProductItem: function onGroupProductItem(param) {
	    ajaxActions.request('/api/preliminary/product_group_item', param, function (res) {
	      console.log('product_group_item', res);
	      productAction.groupProductItem.done(res.data, res.opt);
	    });
	  },
	  // }
	  onAllProductItem: function onAllProductItem(param) {
	    ajaxActions.request('/api/preliminary/product_all_item', param, function (res) {
	      console.log('product_all_item', res);
	      productAction.allProductItem.done(res.data, res.opt);
	    });
	  },
	  onAllGroupItem: function onAllGroupItem(param) {
	    ajaxActions.request('/api/preliminary/group_all_item', param, function (res) {
	      console.log('group_all_item', res);
	      productAction.allGroupItem.done(res.data, res.opt);
	    });
	  },
	  onGetGroupProudct: function onGetGroupProudct(param) {
	    ajaxActions.request('/api/preliminary/group_proudct', param, function (res) {
	      productAction.getGroupProudct.done(res);
	    });
	  },

	  onGroupProductSave: function onGroupProductSave(param, group) {
	    ajaxActions.request('/api/preliminary/group_proudct_save', { param: param, items: group }, function (res) {
	      console.log('group_proudct_save', res);
	      productAction.groupProductSave.done(res);
	    });
	  },
	  onGroupProductDelete: function onGroupProductDelete(param) {
	    ajaxActions.request('/api/preliminary/group_proudct_delete', param, function (res) {
	      console.log('group_proudct_delete', res);
	      productAction.groupProductDelete.done(res);
	    });
	  }
	});

	module.exports = product;

/***/ },

/***/ 966:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    user: 'Username',
	    pass: 'Password',
	    display_name: 'Display Name',
	    last_login: 'Last Login',
	    last_ip: 'Last IP'
	  }
	};

/***/ },

/***/ 967:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  preliminary: {
	    menu: {
	      dashboard: 'ภาพรวม'
	    },
	    group_product: {
	      search_group: 'ค้นหาข้อมูล',
	      search_prod: 'ค้นหาข้อมูล',
	      name: 'ชื่อกลุ่มโปรโมชั่น',
	      code: 'รหัสกลุ่มโปรโมชั่น',
	      oracle_db: 'ฐานข้อมูล',
	      db_stock: 'Stock',
	      db_mini: 'มินิ',
	      db_repair: 'ซ่อม'
	    },
	    group_product_list: {
	      leftList: 'Product Selected',
	      rightList: 'Choose Product'
	    }
	  }

	};

/***/ }

});