webpackJsonp([101,135],{

/***/ 900:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'delete': { children: ['done', 'error'] },
	  'facetEdit': { children: ['done', 'error'] }
	});

/***/ },

/***/ 901:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');

	var roleActions = __webpack_require__(900);

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

/***/ 922:
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

	var systemActions = system.systemActions;
	var infoPanelActions = system.infoPanelActions;
	var dialogActions = system.dialogActions;
	var toasterActions = system.toasterActions;

	var roleActions = __webpack_require__(900);
	var roleStore = __webpack_require__(901);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;

	var RoleList = React.createClass({
	  displayName: 'RoleList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(roleActions.delete.done, 'onDeleteDoneAction'), Reflux.listenTo(roleActions.delete.error, 'onDeleteErrorAction')],

	  getInitialState: function getInitialState() {
	    return {
	      fields: [{ name: 'code', title: 'role.code', width: '100px' }, { name: 'name', title: 'role.name' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'setting.role.edit', param: { id: row.id }, icon: 'create3', title: 'action.edit' }),
	            React.createElement(FlexIcon, { icon: 'rubbish', title: 'action.delete', onClick: function (e) {
	                this.doDelete(e, row.id);
	              }.bind(this) })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {},

	  doRoleNew: function doRoleNew() {
	    this.context.router.transitionTo('setting.role.edit', { id: 0 });
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
	      roleActions.delete(id);
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
	          React.createElement(T, { content: 'role.title.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'boxf flex no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel2 no-shrink' },
	            React.createElement(FlexButton, { icon: 'add184', label: 'role.action.new',
	              onClick: this.doRoleNew })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          id: 'setting-role-list',
	          ref: 'grid',
	          listAction: roleActions.list,
	          exportAction: roleActions.export,
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

	module.exports = RoleList;

/***/ }

});