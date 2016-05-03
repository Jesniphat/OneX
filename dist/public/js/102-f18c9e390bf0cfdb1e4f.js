webpackJsonp([102,135],{

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

/***/ 931:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var infoPanelActions = system.infoPanelActions; //require('../../system/actions/info-panel');
	var helper = system.helper; //require('../../../../../server/lib/helper');
	var dialogActions = system.dialogActions; //require('../../system/actions/dialog');
	var toasterActions = system.toasterActions; //require('../../system/actions/toaster');

	var roleActions = __webpack_require__(908);
	var roleStore = __webpack_require__(909);

	var FlexForm = widgets.FlexForm; //require('../../../widgets/flex-form.jsx');
	var FlexIcon = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
	var FlexTextInput = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');
	var FlexDropdown = widgets.FlexDropdown; //require('../../../widgets/flex-dropdown.jsx');
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
	var FlexCheckbox = widgets.FlexCheckbox; //require('../../../widgets/flex-checkbox.jsx');

	var resetData = {
	  id: 0,
	  code: '',
	  name: '',
	  p: {}
	};

	var RoleEdit = React.createClass({
	  displayName: 'RoleEdit',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [Reflux.listenTo(roleActions.getById.done, 'onGetByIdDoneAction'), Reflux.listenTo(roleActions.save.done, 'onSaveDoneAction'), Reflux.listenTo(roleActions.save.error, 'onSaveErrorAction'), Reflux.listenTo(roleActions.facetEdit.done, 'onFacetEditDoneAction'), Reflux.listenTo(roleActions.facetEdit.error, 'onFacetEditErrorAction')],
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
	        label: 'role.code',
	        icon: 'user158',
	        required: true,
	        autofocus: true,
	        pattern: '.{2,}',
	        tabIndex: 1
	      },
	      name: {
	        id: 'name',
	        type: 'text',
	        label: 'role.name',
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
	      isLock: false,
	      list: {}
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    roleActions.facetEdit();
	    if (this.state.id) {
	      roleActions.getById(this.context.router.getCurrentParams().id);
	    }
	    infoPanelActions.show('setting.role', null);
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  formHasUnsavedData: function formHasUnsavedData() {
	    return JSON.stringify(this.state.data) != JSON.stringify(this.state.origData);
	  },

	  onFacetEditDoneAction: function onFacetEditDoneAction(data) {
	    this.setState({
	      list: data
	    });
	  },

	  onFacetEditErrorAction: function onFacetEditErrorAction() {},

	  onGetByIdDoneAction: function onGetByIdDoneAction(data) {
	    this.setState({
	      data: data,
	      origData: helper.clone(data)
	    });
	    infoPanelActions.show('setting.role', React.createElement(
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

	  doRoleSave: function doRoleSave() {
	    // validate
	    var data = this.state.data;
	    var err = [];
	    if (data.code == '') {
	      err.push(tr.translate('role.error.code_empty'));
	    }
	    if (data.name == '') {
	      err.push(tr.translate('role.error.name_empty'));
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
	    roleActions.save(this.state.data);
	  },

	  handleChange: function handleChange(id, newValue) {
	    var data = this.state.data;
	    data[id] = newValue;
	    this.setState({
	      data: data,
	      isValid: this.refs.roleForm.isValid()
	    });
	  },

	  togglePermission: function togglePermission(p_id) {
	    this.state.data.p[p_id] = !!!this.state.data.p[p_id];
	    this.setState({
	      data: this.state.data
	    });
	  },

	  renderPermssion: function renderPermssion() {
	    var list = this.state.list;
	    console.log('list=', list);
	    var out = [];
	    for (var mod_code in list) {
	      var tmp = [];
	      var p_list = list[mod_code].p;
	      var cnt = 0;
	      var total = 0;
	      for (var p_code in p_list) {
	        if (p_code == 'null') {
	          continue;
	        }
	        tmp.push(React.createElement(
	          'li',
	          { key: p_code },
	          React.createElement(FlexCheckbox, {
	            field: { id: p_list[p_code].id, type: 'checkbox', label: p_list[p_code].name, raw: true },
	            data: this.state.data.p,
	            onChange: this.togglePermission
	          })
	        ));
	        cnt += this.state.data.p[p_list[p_code].id] ? 1 : 0;
	        total++;
	      }
	      out.push(React.createElement(
	        'li',
	        { key: list[mod_code].m.code },
	        React.createElement(
	          'div',
	          { className: 'module-name' },
	          list[mod_code].m.code + ' ' + list[mod_code].m.name,
	          ' (',
	          cnt + '/' + total,
	          ')'
	        ),
	        React.createElement(
	          'ul',
	          { className: 'flex' },
	          tmp
	        )
	      ));
	    }
	    return React.createElement(
	      'ul',
	      { className: 'module-permission' },
	      out
	    );
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
	          React.createElement(T, { content: this.state.data.id == 0 ? 'role.title.new' : 'role.title.edit', component: 'h2' })
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
	              onClick: this.doRoleSave
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
	          { ref: 'roleForm', fields: this.state.fields, data: this.state.data },
	          React.createElement(
	            'div',
	            { className: 'box10 flex' },
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
	          ),
	          React.createElement(
	            'div',
	            { className: 'box10' },
	            React.createElement(
	              'div',
	              { className: 'panel10' },
	              this.renderPermssion()
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = RoleEdit;

/***/ }

});