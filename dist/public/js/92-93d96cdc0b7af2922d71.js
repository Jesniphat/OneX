webpackJsonp([92,135],{

/***/ 885:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facetList': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'facetEdit': { children: ['done', 'error'] }
	});

/***/ },

/***/ 886:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);
	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var staffActions = __webpack_require__(885);

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

/***/ 913:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widgets = __webpack_require__(377);

	var systemActions = system.systemActions;
	var infoPanelActions = widgets.infoPanelActions;
	var helper = system.helper;

	var staffActions = __webpack_require__(885);
	var staffStore = __webpack_require__(886);

	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexGrid = widgets.FlexGrid;

	var StaffList = React.createClass({
	  displayName: 'StaffList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    return {
	      fields: [{ name: 'user', title: 'staff.user', width: '100px' }, { name: 'suffix_barcode', title: 'staff.suffix_barcode', width: '120px', render: function render(row) {
	          return 'XX' + row.suffix_barcode;
	        } }, { name: 'nickname', title: 'staff.nickname', width: '120px' }, { name: 'display_name', title: 'staff.display_name' }, { name: 'department', title: 'staff.department', type: 'lov', width: '100px' }, { name: 'shop', title: 'staff.shop', type: 'lov', width: '160px' }, { name: 'last_login', title: 'staff.last_login', type: 'date', width: '160px', render: function render(row) {
	          //          return helper.thShortDateTime(row.last_login);
	          if (row.last_login.substr(0, 4) == '0000') {
	            return React.createElement(
	              'i',
	              null,
	              tr.translate('staff.never_login')
	            );
	          }
	          return tr.localize(new Date(row.last_login), { format: 'short' });
	        } }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function render(row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'setting.staff.edit', param: { id: row.id }, icon: 'create3', title: 'action.edit' }),
	            React.createElement(FlexIcon, { to: 'setting.staff.edit', param: { id: row.id }, icon: 'rubbish', title: 'action.delete' })
	          );
	        } }]
	    };
	  },

	  componentDidMount: function componentDidMount() {},

	  doStaffNew: function doStaffNew() {
	    this.context.router.transitionTo('setting.staff.edit', { id: 0 });
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
	          React.createElement(T, { content: 'staff.title.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'boxf flex no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel2 no-shrink' },
	            React.createElement(FlexButton, { icon: 'add184', label: 'staff.action.new',
	              onClick: this.doStaffNew })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          id: 'setting-staff-list',
	          listAction: staffActions.list,
	          exportAction: staffActions.export,
	          facetAction: staffActions.facetList,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'user',
	          sortDir: 'ASC',
	          limit: 50,
	          displayRows: 10,
	          checkbox: false,
	          search: true
	        })
	      )
	    );
	  }
	});

	module.exports = StaffList;

/***/ }

});