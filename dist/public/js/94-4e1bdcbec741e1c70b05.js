webpackJsonp([94,135],{

/***/ 889:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions; //require('../../system/actions');

	var shopActions = __webpack_require__(890);
	var shopStore = __webpack_require__(891);

	var Shop = {};

	tr.registerTranslations('en', __webpack_require__(892));
	tr.registerTranslations('th', __webpack_require__(893));

	Shop.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('shop.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// return (
	//       <Router.RouteHandler/>
	//     );
	// Shop.List = require('./shop-list.jsx');
	// Shop.Edit = require('./shop-edit.jsx');

	// Shop.Routes = (
	//   <Route name="setting.shop" path="shop" handler={Shop.Index}>
	//     <Router.DefaultRoute name="setting.shop.list" handler={Shop.List}/>
	//     <Route name="setting.shop.edit" path=":id" handler={Shop.Edit}/>
	//   </Route>
	// );

	module.exports = Shop;

/***/ },

/***/ 890:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'delete': { children: ['done', 'error'] }
	});

/***/ },

/***/ 891:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var shopActions = __webpack_require__(890);

	var shopStore = Reflux.createStore({
	  listenables: [shopActions],

	  // shopActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/setting/shop/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      shopActions.list.done(res.data, res.opt);
	      //      menuActions.updateCount('shop', res.opt.totalRows);
	    } else {
	        shopActions.list.error(res.msg);
	      }
	  },

	  // shopActions.export
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/setting/shop/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      shopActions.export.done(res.file);
	    } else {
	      shopActions.export.error(res.msg);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/setting/shop/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      shopActions.getById.done(res.data);
	    } else {
	      shopActions.getById.error(res.msg);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/setting/shop/save', { data: data }, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      shopActions.save.done(res.data);
	      //      menuActions.updateCount('shop', res.totalRows);
	    } else {
	        shopActions.save.error(res.msg);
	      }
	  },

	  onDelete: function onDelete(id) {
	    ajaxActions.request('/api/setting/shop/delete', { id: id }, this.doneDelete);
	  },

	  doneDelete: function doneDelete(res) {
	    if (res.status === true) {
	      shopActions.delete.done(res.data);
	    } else {
	      shopActions.delete.error(res.msg);
	    }
	  }
	});

	module.exports = shopStore;

/***/ },

/***/ 892:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  shop: {}
	};

/***/ },

/***/ 893:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  shop: {
	    code: 'รหัส',
	    prefix_barcode: 'บาร์โค้ด',
	    name: 'ชื่อสาขา',
	    location: 'ที่ตั้ง',
	    tel: 'โทรศัพท์',
	    fax: 'โทรสาร',
	    is_active: 'สถานะ',
	    status: {
	      yes: 'ACTIVE',
	      no: 'INACTIVE'
	    },
	    title: {
	      index: 'สาขา',
	      list: 'รายการสาขา',
	      edit: 'แก้ไขข้อมูลสาขา',
	      new: 'เพิ่มสาขา'
	    },
	    action: {
	      new: 'เพิ่มสาขาใหม่'
	    }
	  }
	};

/***/ }

});