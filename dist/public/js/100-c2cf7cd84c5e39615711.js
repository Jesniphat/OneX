webpackJsonp([100,135],{

/***/ 907:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions; //require('../../system/actions');

	var roleActions = __webpack_require__(908);
	var roleStore = __webpack_require__(909);

	var Role = {};

	tr.registerTranslations('en', __webpack_require__(910));
	tr.registerTranslations('th', __webpack_require__(911));

	Role.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('role.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// Role.List = require('./role-list.jsx');
	// Role.Edit = require('./role-edit.jsx');

	// Role.Routes = (
	//   <Route name="setting.role" path="role" handler={Role.Index}>
	//     <Router.DefaultRoute name="setting.role.list" handler={Role.List}/>
	//     <Route name="setting.role.edit" path=":id" handler={Role.Edit}/>
	//   </Route>
	// );

	module.exports = Role;

/***/ },

/***/ 908:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'delete': { children: ['done', 'error'] },
	  'facetEdit': { children: ['done', 'error'] }
	});

/***/ },

/***/ 909:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');

	var roleActions = __webpack_require__(908);

	var roleStore = Reflux.createStore({
	  listenables: [roleActions],

	  // roleActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/setting/role/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      roleActions.list.done(res.data, res.opt);
	      //      menuActions.updateCount('role', res.opt.totalRows);
	    } else {
	        roleActions.list.error(res.msg);
	      }
	  },

	  // roleActions.export
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/setting/role/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      roleActions.export.done(res.file);
	    } else {
	      roleActions.export.error(res.msg);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/setting/role/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      roleActions.getById.done(res.data);
	    } else {
	      roleActions.getById.error(res.msg);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/setting/role/save', { data: data }, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      roleActions.save.done(res.data);
	      //      menuActions.updateCount('role', res.totalRows);
	    } else {
	        roleActions.save.error(res.msg);
	      }
	  },

	  onDelete: function onDelete(id) {
	    ajaxActions.request('/api/setting/role/delete', { id: id }, this.doneDelete);
	  },

	  doneDelete: function doneDelete(res) {
	    if (res.status === true) {
	      roleActions.delete.done(res.data);
	    } else {
	      roleActions.delete.error(res.msg);
	    }
	  },

	  onFacetEdit: function onFacetEdit() {
	    ajaxActions.request('/api/setting/role/facetEdit', {}, this.doneFacetEdit);
	  },

	  doneFacetEdit: function doneFacetEdit(res) {
	    if (res.status === true) {
	      roleActions.facetEdit.done(res.data);
	    } else {
	      roleActions.facetEdit.error(res.error);
	    }
	  }
	});

	module.exports = roleStore;

/***/ },

/***/ 910:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  branch: {}
	};

/***/ },

/***/ 911:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  role: {
	    code: 'รหัส',
	    name: 'ชื่อกลุ่มสิทธิ์',
	    title: {
	      index: 'กลุ่มสิทธิ์',
	      list: 'รายการกลุ่มสิทธิ์',
	      edit: 'แก้ไขข้อมูลกลุ่มสิทธิ์',
	      new: 'เพิ่มกลุ่มสิทธิ์'
	    },
	    action: {
	      new: 'เพิ่มกลุ่มสิทธิ์ใหม่'
	    }
	  }
	};

/***/ }

});