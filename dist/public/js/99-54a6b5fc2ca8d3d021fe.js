webpackJsonp([99,135],{

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

/***/ 920:
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

	var infoPanelActions = system.infoPanelActions; //require('../../system/actions/info-panel');
	var helper = system.helper; // require('../../../../../server/lib/helper');
	var dialogActions = system.dialogActions; //require('../../system/actions/dialog');
	var toasterActions = system.toasterActions; //require('../../system/actions/toaster');

	var departmentActions = __webpack_require__(895);
	var departmentStore = __webpack_require__(896);

	var FlexForm = widgets.FlexForm; //require('../../../widgets/flex-form.jsx');
	var FlexIcon = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
	var FlexTextInput = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');
	var FlexDropdown = widgets.FlexDropdown; //require('../../../widgets/flex-dropdown.jsx');
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

	var resetData = {
	  id: 0,
	  code: '',
	  name: ''
	};

	var DepartmentEdit = React.createClass({
	  displayName: 'DepartmentEdit',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [Reflux.listenTo(departmentActions.getById.done, 'onGetByIdDoneAction'), Reflux.listenTo(departmentActions.save.done, 'onSaveDoneAction'), Reflux.listenTo(departmentActions.save.error, 'onSaveErrorAction')],
	  statics: {
	    willTransitionFrom: function willTransitionFrom(transition, component, cb) {
	      if (component.formHasUnsavedData()) {
	        dialogActions.show({
	          title: 'dialog.title.confirm_to_exit',
	          content: 'ข้อมูลยังไม่ถูกบันทึก ยืนยันการออกจากหน้าจอนี้',
	          actions: [{ id: 'ok', icon: 'check52', label: 'dialog.confirm' }, { id: 'cancel', icon: 'close47', label: 'dialog.cancel', default: true }]
	        }, function (isCancel, id) {
	          if (isCancel == true || id == 'cancel') {
	            transition.abort();
	            cb();
	          } else {
	            // confirm to go
	            transition.retry();
	            cb();
	          }
	        });
	      } else {
	        transition.retry();
	        cb();
	      }
	    }
	  },

	  getInitialState: function getInitialState() {
	    var fields = {
	      code: {
	        id: 'code',
	        type: 'text',
	        label: 'department.code',
	        icon: 'user158',
	        required: true,
	        autofocus: true,
	        pattern: '.{2,}',
	        tabIndex: 1
	      },
	      name: {
	        id: 'name',
	        type: 'text',
	        label: 'department.name',
	        icon: 'user158',
	        required: true,
	        tabIndex: 2
	      },
	      save: {
	        id: 'save',
	        tabIndex: 6
	      }
	    };

	    var id = parseInt(this.context.router.getCurrentParams().id);

	    return {
	      id: id,
	      data: helper.clone(resetData),
	      origData: helper.clone(resetData),
	      fields: fields,
	      isLock: false
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    departmentActions.getById(this.context.router.getCurrentParams().id);
	    infoPanelActions.show('setting.department', null);
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  formHasUnsavedData: function formHasUnsavedData() {
	    return JSON.stringify(this.state.data) != JSON.stringify(this.state.origData);
	  },

	  onGetByIdDoneAction: function onGetByIdDoneAction(data) {
	    this.setState({
	      data: data,
	      origData: helper.clone(data)
	    });
	    infoPanelActions.show('setting.department', React.createElement(
	      'dl',
	      { className: 'dl' },
	      React.createElement(
	        'dt',
	        null,
	        React.createElement(T, { content: 'row.created_at' })
	      ),
	      React.createElement(
	        'dd',
	        null,
	        data.created_at.substr(0, 4) == '0000' ? '-' : tr.localize(new Date(data.created_at), { format: 'short' })
	      ),
	      React.createElement(
	        'dt',
	        null,
	        React.createElement(T, { content: 'row.updated_at' })
	      ),
	      React.createElement(
	        'dd',
	        null,
	        data.updated_at.substr(0, 4) == '0000' ? '-' : tr.localize(new Date(data.updated_at), { format: 'short' })
	      )
	    ));
	  },

	  onSaveDoneAction: function onSaveDoneAction(data) {
	    this.setState({
	      isLock: false,
	      data: helper.clone(resetData),
	      origData: helper.clone(resetData)
	    });
	    toasterActions.pop({
	      type: 'success',
	      message: 'result.save_done'
	    });
	  },

	  onSaveErrorAction: function onSaveErrorAction(data) {
	    this.setState({
	      isLock: false
	    });
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.save_failed'
	    });
	  },

	  doDepartmentSave: function doDepartmentSave() {
	    // validate
	    var data = this.state.data;
	    var err = [];
	    if (data.code == '') {
	      err.push(tr.translate('department.error.code_empty'));
	    }
	    if (data.name == '') {
	      err.push(tr.translate('department.error.name_empty'));
	    }
	    if (err.length > 0) {
	      toasterActions.pop({
	        type: 'warning',
	        message: err.join('\r\n')
	      });
	      return;
	    }

	    this.setState({
	      isLock: true
	    });
	    departmentActions.save(this.state.data);
	  },

	  handleChange: function handleChange(id, newValue) {
	    var data = this.state.data;
	    data[id] = newValue;
	    this.setState({
	      data: data,
	      isValid: this.refs.departmentForm.isValid()
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
	          React.createElement(T, { content: this.state.data.id == 0 ? 'department.title.new' : 'department.title.edit', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'boxf flex no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel2 no-shrink' },
	            React.createElement(FlexButton, {
	              label: 'action.save',
	              field: this.state.fields.save,
	              icon: 'save20',
	              'default': true,
	              onClick: this.doDepartmentSave
	            })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body boxf lockable' + (this.state.isLock ? ' lock' : '') },
	        React.createElement('div', { className: 'lock' }),
	        React.createElement(
	          FlexForm,
	          { ref: 'departmentForm', fields: this.state.fields, data: this.state.data },
	          React.createElement(
	            'div',
	            { className: 'box6 flex' },
	            React.createElement(
	              'div',
	              { className: 'box3' },
	              React.createElement(
	                'div',
	                { className: 'panel3' },
	                React.createElement(FlexTextInput, { ref: 'code', field: this.state.fields.code, data: this.state.data, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'box3' },
	              React.createElement(
	                'div',
	                { className: 'panel3' },
	                React.createElement(FlexTextInput, { ref: 'name', field: this.state.fields.name, data: this.state.data, onChange: this.handleChange })
	              )
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = DepartmentEdit;

/***/ }

});