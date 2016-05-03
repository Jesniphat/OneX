webpackJsonp([91,135],{

/***/ 892:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions; //require('../../system/actions');

	var staffActions = __webpack_require__(893);
	var staffStore = __webpack_require__(894);

	var Staff = {};

	tr.registerTranslations('en', __webpack_require__(895));
	tr.registerTranslations('th', __webpack_require__(896));

	Staff.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('staff.title.index'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	// Staff.List = require('./staff-list.jsx');
	// Staff.Edit = require('./staff-edit.jsx');

	// Staff.Routes = (
	//   <Route name="setting.staff" path="staff" handler={Staff.Index}>
	//     <Router.DefaultRoute name="setting.staff.list" handler={Staff.List}/>
	//     <Route name="setting.staff.edit" path=":id" handler={Staff.Edit}/>
	//   </Route>
	// );

	module.exports = Staff;

/***/ },

/***/ 893:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facetList': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'facetEdit': { children: ['done', 'error'] }
	});

/***/ },

/***/ 894:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);
	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var staffActions = __webpack_require__(893);

	var staffStore = Reflux.createStore({
	  listenables: [staffActions],

	  // staffActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/setting/staff/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      staffActions.list.done(res.data, res.opt);
	      //      menuActions.updateCount('staff', res.opt.totalRows);
	    } else {
	        staffActions.list.error(res.error);
	      }
	  },

	  // staffActions.export
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/setting/staff/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      staffActions.export.done(res.file);
	    } else {
	      staffActions.export.error(res.msg);
	    }
	  },

	  onFacetList: function onFacetList() {
	    ajaxActions.request('/api/setting/staff/facetList', {}, this.doneFacetList);
	  },

	  doneFacetList: function doneFacetList(res) {
	    if (res.status === true) {
	      staffActions.facetList.done(res.data);
	    } else {
	      staffActions.facetList.error(res.error);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/setting/staff/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      staffActions.getById.done(res.data);
	    } else {
	      staffActions.getById.error(res.msg);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/setting/staff/save', { data: data }, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      staffActions.save.done(res.user);
	      //      menuActions.updateCount('branch', res.totalRows);
	    } else {
	        staffActions.save.error(res.error);
	      }
	  },

	  onFacetEdit: function onFacetEdit() {
	    ajaxActions.request('/api/setting/staff/facetEdit', {}, this.doneFacetEdit);
	  },

	  doneFacetEdit: function doneFacetEdit(res) {
	    if (res.status === true) {
	      staffActions.facetEdit.done(res.data);
	    } else {
	      staffActions.facetEdit.error(res.error);
	    }
	  }

	});

	module.exports = staffStore;

/***/ },

/***/ 895:
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

/***/ 896:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    title: {
	      index: 'พนักงาน',
	      list: 'รายการพนักงาน',
	      edit: 'แก้ไขข้อมูลพนักงาน',
	      new: 'เพิ่มพนักงานใหม่'
	    },
	    user: 'ชื่อผู้ใช้',
	    pass: 'รหัสผ่าน',
	    suffix_barcode: 'รหัสบาร์โค้ด',
	    nickname: 'ชื่อเล่น',
	    display_name: 'ชื่อเต็ม',
	    last_login: 'ใช้งานครั้งสุดท้ายเมื่อ',
	    last_ip: 'IP ล่าสุด',
	    department: 'แผนก',
	    shop: 'สาขาหลัก',
	    email: 'อีเมล',
	    mobile: 'เบอร์มือถือ',
	    photo: 'เลือกรูป',
	    is_active: 'สถานะ',
	    action: {
	      new: 'เพิ่มพนักงาน'
	    },
	    never_login: 'ไม่เคยใช้งาน'
	  }
	};

/***/ }

});