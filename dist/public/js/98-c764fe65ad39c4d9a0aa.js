webpackJsonp([98,135],{

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

/***/ 919:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widgets = __webpack_require__(377);

	var systemActions = system.systemActions; //require('../../system/actions');
	var dialogActions = system.dialogActions; //require('../../system/actions/dialog');
	var toasterActions = system.toasterActions; //require('../../system/actions/toaster');

	var departmentActions = __webpack_require__(895);
	var departmentStore = __webpack_require__(896);

	var FlexGrid = widgets.FlexGrid; //require('../../../widgets/flex-grid.jsx');
	var FlexIcon = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

	var DepartmentList = React.createClass({
	  displayName: 'DepartmentList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(departmentActions.delete.done, 'onDeleteDoneAction'), Reflux.listenTo(departmentActions.delete.error, 'onDeleteErrorAction')],

	  getInitialState: function getInitialState() {
	    return {
	      fields: [{ name: 'code', title: 'department.code', width: '100px' }, { name: 'name', title: 'department.name' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'setting.department.edit', param: { id: row.id }, icon: 'create3', title: 'action.edit' }),
	            React.createElement(FlexIcon, { icon: 'rubbish', title: 'action.delete', onClick: function (e) {
	                console.log('onClick');this.doDelete(e, row.id);
	              }.bind(this) })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {},

	  doDepartmentNew: function doDepartmentNew() {
	    this.context.router.transitionTo('setting.department.edit', { id: 0 });
	  },

	  doDelete: function doDelete(e, id) {
	    e.preventDefault();
	    dialogActions.show({
	      title: 'dialog.title.confirm_to_delete',
	      content: 'ข้อมูลจะถูกลบถาวร ยืนยันหรือไม่',
	      actions: [{ id: 'ok', icon: 'check52', label: 'dialog.confirm' }, { id: 'cancel', icon: 'close47', label: 'dialog.cancel', default: true }]
	    }, function (isCancel, action_id) {
	      if (isCancel || action_id == 'cancel') {
	        return;
	      }
	      departmentActions.delete(id);
	    });
	  },

	  onDeleteDoneAction: function onDeleteDoneAction() {
	    toasterActions.pop({
	      type: 'success',
	      message: 'delete.ok'
	    });
	    this.refs.grid.doRefresh();
	    //    console.log(this.refs);
	  },

	  onDeleteErrorAction: function onDeleteErrorAction(result) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'error.delete'
	    });
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'department.title.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'boxf flex no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel2 no-shrink' },
	            React.createElement(FlexButton, { icon: 'add184', label: 'department.action.new',
	              onClick: this.doDepartmentNew })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          id: 'setting-department-list',
	          ref: 'grid',
	          listAction: departmentActions.list,
	          exportAction: departmentActions.export,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'code',
	          sortDir: 'ASC',
	          limit: 10,
	          checkbox: false,
	          search: true
	        })
	      )
	    );
	  }
	});

	module.exports = DepartmentList;

/***/ }

});