webpackJsonp([97,135],{

/***/ 894:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions; //require('../../system/actions');

	var departmentActions = __webpack_require__(895);
	var departmentStore = __webpack_require__(896);

	var Department = {};

	tr.registerTranslations('en', __webpack_require__(897));
	tr.registerTranslations('th', __webpack_require__(898));

	Department.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('department.title.index'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	// Department.List = require('./department-list.jsx');
	// Department.Edit = require('./department-edit.jsx');

	// Department.Routes = (
	//   <Route name="setting.department" path="department" handler={Department.Index}>
	//     <Router.DefaultRoute name="setting.department.list" handler={Department.List}/>
	//     <Route name="setting.department.edit" path=":id" handler={Department.Edit}/>
	//   </Route>
	// );

	module.exports = Department;

/***/ },

/***/ 895:
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

/***/ 896:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);
	var ajaxActions = system.ajaxActions; // require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var departmentActions = __webpack_require__(895);

	var departmentStore = Reflux.createStore({
	  listenables: [departmentActions],

	  // departmentActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/setting/department/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      departmentActions.list.done(res.data, res.opt);
	      //      menuActions.updateCount('department', res.opt.totalRows);
	    } else {
	        departmentActions.list.error(res.msg);
	      }
	  },

	  // departmentActions.export
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/setting/department/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      departmentActions.export.done(res.file);
	    } else {
	      departmentActions.export.error(res.msg);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/setting/department/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      departmentActions.getById.done(res.data);
	    } else {
	      departmentActions.getById.error(res.msg);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/setting/department/save', { data: data }, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      departmentActions.save.done(res.data);
	      //      menuActions.updateCount('department', res.totalRows);
	    } else {
	        departmentActions.save.error(res.msg);
	      }
	  },

	  onDelete: function onDelete(id) {
	    ajaxActions.request('/api/setting/department/delete', { id: id }, this.doneDelete);
	  },

	  doneDelete: function doneDelete(res) {
	    if (res.status === true) {
	      departmentActions.delete.done(res.data);
	    } else {
	      departmentActions.delete.error(res.msg);
	    }
	  }
	});

	module.exports = departmentStore;

/***/ },

/***/ 897:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  department: {}
	};

/***/ },

/***/ 898:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  department: {
	    code: 'รหัส',
	    name: 'ชื่อแผนก',
	    title: {
	      index: 'แผนก',
	      list: 'รายการแผนก',
	      edit: 'แก้ไขข้อมูลแผนก',
	      new: 'เพิ่มแผนกใหม่'
	    },
	    action: {
	      new: 'เพิ่มแผนกใหม่'
	    }
	  }
	};

/***/ }

});