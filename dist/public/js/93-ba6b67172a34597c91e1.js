webpackJsonp([93,135],{

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

/***/ 922:
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

	var systemActions = system.systemActions;
	var infoPanelActions = system.infoPanelActions;
	var helper = system.helper;
	var dialogActions = system.dialogActions;
	var toasterActions = system.toasterActions;

	var staffActions = __webpack_require__(893);
	var staffStore = __webpack_require__(894);

	var FlexForm = widgets.FlexForm;
	var FlexIcon = widgets.FlexIcon;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexButton = widgets.FlexButton;

	var resetData = {
	  id: 0,
	  user: '',
	  display_name: '',
	  email: '',
	  mobile: '',
	  department_id: 0,
	  shop_id: 0,
	  pass: '',
	  pass2: '',
	  is_active: 'YES'
	};

	var StaffEdit = React.createClass({
	  displayName: 'StaffEdit',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(staffActions.getById.done, 'onGetByIdDoneAction'), Reflux.listenTo(staffActions.getById.error, 'onGetByIdErrorAction'), Reflux.listenTo(staffActions.save.done, 'onSaveDoneAction'), Reflux.listenTo(staffActions.save.error, 'onSaveErrorAction'), Reflux.listenTo(staffActions.facetEdit.done, 'onFacetEditDoneAction'), Reflux.listenTo(staffActions.facetEdit.error, 'onFacetEditErrorAction')],

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
	      user: {
	        id: 'user',
	        type: 'text',
	        label: 'staff.user',
	        icon: 'user158',
	        readonly: true
	      },
	      suffix_barcode: {
	        id: 'suffix_barcode',
	        type: 'text',
	        label: 'staff.suffix_barcode',
	        icon: 'user158',
	        readonly: true,
	        render: function render(row) {
	          return 'XX' + (row.suffix_barcode || '####');
	        }
	      },
	      nickname: {
	        id: 'nickname',
	        type: 'text',
	        label: 'staff.nickname',
	        icon: 'user158',
	        required: true,
	        tabIndex: 2
	      },
	      display_name: {
	        id: 'display_name',
	        type: 'text',
	        label: 'staff.display_name',
	        icon: 'user158',
	        tabIndex: 3
	      },
	      email: {
	        id: 'email',
	        type: 'email',
	        label: 'staff.email',
	        icon: 'user158',
	        tabIndex: 4
	      },
	      mobile: {
	        id: 'mobile',
	        type: 'text',
	        label: 'staff.mobile',
	        icon: 'user158',
	        pattern: '^08[0-9]{8}$',
	        tabIndex: 5
	      },
	      department_id: {
	        id: 'department_id',
	        type: 'dropdown',
	        label: 'staff.department',
	        icon: 'user158',
	        list: [],
	        tabIndex: 6
	      },
	      shop_id: {
	        id: 'shop_id',
	        type: 'dropdown',
	        label: 'staff.shop',
	        icon: 'user158',
	        list: [],
	        tabIndex: 7
	      },
	      is_active: {
	        id: 'is_active',
	        type: 'dropdown',
	        label: 'staff.is_active',
	        icon: 'user158',
	        list: [{ value: 'YES', text: 'ACTIVE' }, { value: 'NO', text: 'INACTIVE' }],
	        tabIndex: 8
	      }
	    };
	    var id = parseInt(this.context.router.getCurrentParams().id);
	    var tabIndex = 8;
	    if (id == 0) {
	      fields.pass = {
	        id: 'pass',
	        type: 'password',
	        label: 'staff.pass',
	        icon: 'user158',
	        required: true,
	        pattern: '.{4,}',
	        tabIndex: 8
	      };
	      fields.pass2 = {
	        id: 'pass2',
	        type: 'password',
	        label: 'staff.pass',
	        icon: 'user158',
	        required: true,
	        pattern: '.{4,}',
	        tabIndex: 9
	      };
	      tabIndex = 10;
	    };

	    fields.save = {
	      id: 'save',
	      type: 'button',
	      label: 'action.save',
	      tabIndex: tabIndex
	    };

	    return {
	      id: id,
	      data: helper.clone(resetData),
	      origData: helper.clone(resetData),
	      fields: fields,
	      isLock: false
	    };
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(prop) {
	    console.log(prop);
	  },

	  componentDidMount: function componentDidMount() {
	    staffActions.facetEdit();
	    if (this.state.id) {
	      staffActions.getById(this.context.router.getCurrentParams().id);
	    }

	    // actionPanelActions.setShortcut([]);
	    // actionPanelActions.setMain([
	    //   {icon:'verification24', label:'action.save', onClick:this.onStaffSave}
	    // ]);
	    //    actionPanelActions.setSpecial([]);
	    infoPanelActions.show('setting.staff', null);
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  formHasUnsavedData: function formHasUnsavedData() {
	    return JSON.stringify(this.state.data) != JSON.stringify(this.state.origData);
	  },

	  onFacetEditDoneAction: function onFacetEditDoneAction(data) {
	    if (data.department != null) {
	      this.state.fields['department_id'].list = data.department;
	    }
	    if (data.shop != null) {
	      this.state.fields['shop_id'].list = data.shop;
	    }
	    if (this.state.id) {
	      this.setState({
	        fields: this.state.fields
	      });
	    } else {
	      if (data.department != null && data.department.length > 0) {
	        this.state.data.department_id = data.department[0].value;
	        console.log('department_id', data.department[0].value);
	      }
	      if (data.shop != null && data.shop.length > 0) {
	        this.state.data.shop_id = data.shop[0].value;
	      }
	      this.setState({
	        fields: this.state.fields,
	        data: this.state.data,
	        origData: helper.clone(this.state.data)
	      });
	    }
	  },

	  onFacetEditErrorAction: function onFacetEditErrorAction() {},

	  onGetByIdDoneAction: function onGetByIdDoneAction(data) {
	    this.setState({
	      data: data,
	      origData: helper.clone(data)
	    });
	    infoPanelActions.show('setting.staff', React.createElement(
	      'dl',
	      { className: 'dl' },
	      React.createElement(
	        'dt',
	        null,
	        React.createElement(T, { content: 'staff.last_login' })
	      ),
	      React.createElement(
	        'dd',
	        null,
	        data.last_login.substr(0, 4) == '0000' ? tr.translate('staff.never_login') : tr.localize(new Date(data.last_login), { format: 'short' })
	      ),
	      React.createElement(
	        'dt',
	        null,
	        React.createElement(T, { content: 'staff.last_ip' })
	      ),
	      React.createElement(
	        'dd',
	        null,
	        data.last_ip
	      ),
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

	  onGetByIdErrorAction: function onGetByIdErrorAction(data) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.get_data_failed'
	    });
	  },

	  onSaveDoneAction: function onSaveDoneAction(data) {
	    toasterActions.pop({
	      type: 'success',
	      message: 'result.save_done'
	    });

	    if (!this.state.id) {
	      dialogActions.show({
	        title: 'result.save_done',
	        content: 'User : ' + data,
	        actions: [{ id: 'ok', icon: 'check52', label: 'action.confirm', default: true }]
	      });
	    }

	    this.setState({
	      isLock: false,
	      data: helper.clone(resetData),
	      origData: helper.clone(resetData)
	      //      origData: helper.clone(this.state.data)
	    });

	    //staffActions.getById(data);

	    this.context.router.transitionTo('setting.staff.edit', { id: data });
	  },

	  onSaveErrorAction: function onSaveErrorAction(error) {
	    this.setState({
	      isLock: false
	    }, function () {
	      if (typeof error === 'undefined') {
	        toasterActions.pop({
	          type: 'warning',
	          message: 'ERROR'
	        });
	        return;
	      }

	      var msg = [];

	      if (typeof error.map === 'function') {
	        msg = error.map(function (item) {
	          var tmp = item;
	          try {
	            tmp = tr.translate(item);
	          } catch (e) {}
	          return tmp;
	        });
	      } else {
	        var tmp = error;
	        try {
	          tmp = tr.translate(error);
	        } catch (e) {}
	        msg.push(tmp);
	      }
	      toasterActions.pop({
	        type: 'warning',
	        message: msg.join("\n")
	      });
	    });
	  },

	  doStaffSave: function doStaffSave() {
	    // validate
	    var data = this.state.data;
	    var err = [];
	    // if (data.user=='') {
	    //   err.push(tr.translate('staff.error.user_empty'));
	    // }
	    if (data.display_name == '') {
	      err.push(tr.translate('staff.error.display_name_empty'));
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

	    staffActions.save(this.state.data);
	  },

	  handleChange: function handleChange(id, newValue) {
	    var data = this.state.data;
	    data[id] = newValue;
	    this.setState({
	      data: data,
	      isValid: this.refs.staffForm.isValid()
	    });
	  },

	  render: function render() {
	    var passwdShow = null;

	    //console.log(this.context.router.getCurrentParams());

	    if (system.sessionStore.getSession().staff.id == 1) {
	      passwdShow = React.createElement(
	        'div',
	        { className: 'box6 flex' },
	        React.createElement(
	          'div',
	          { className: 'panel3' },
	          React.createElement(
	            'h2',
	            null,
	            'Password : ',
	            this.state.data.pass2
	          )
	        )
	      );
	    }

	    var passwordSetup = null;
	    if (this.state.id == 0) {
	      passwordSetup = React.createElement(
	        'div',
	        { className: 'box6 flex' },
	        React.createElement(
	          'div',
	          { className: 'panel3' },
	          React.createElement(FlexTextInput, { ref: 'pass', field: this.state.fields.pass, data: this.state.data, onChange: this.handleChange })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3' },
	          React.createElement(FlexTextInput, { ref: 'pass2', field: this.state.fields.pass2, data: this.state.data, onChange: this.handleChange })
	        )
	      );
	    }
	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: this.state.data.id == 0 ? 'staff.title.new' : 'staff.title.edit', component: 'h2' })
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
	              onClick: this.doStaffSave
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
	          { ref: 'staffForm', fields: this.state.fields, data: this.state.data },
	          React.createElement(
	            'div',
	            { className: 'box8 flex' },
	            React.createElement(
	              'div',
	              { className: 'box6' },
	              React.createElement(
	                'div',
	                { className: 'box6 flex' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexTextInput, { ref: 'user', field: this.state.fields.user, data: this.state.data, onChange: this.handleChange })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexTextInput, { ref: 'user', field: this.state.fields.suffix_barcode, data: this.state.data, onChange: this.handleChange })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box6 flex' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexTextInput, { ref: 'nickname', field: this.state.fields.nickname, data: this.state.data, onChange: this.handleChange })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexTextInput, { ref: 'display_name', field: this.state.fields.display_name, data: this.state.data, onChange: this.handleChange })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box6 flex' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexTextInput, { ref: 'email', field: this.state.fields.email, data: this.state.data, onChange: this.handleChange })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexTextInput, { ref: 'mobile', field: this.state.fields.mobile, data: this.state.data, onChange: this.handleChange })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box6 flex' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexDropdown, { ref: 'department_id', field: this.state.fields.department_id, data: this.state.data, onChange: this.handleChange })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexDropdown, { ref: 'shop_id', field: this.state.fields.shop_id, data: this.state.data, onChange: this.handleChange })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box6 flex' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexDropdown, { ref: 'is_active', field: this.state.fields.is_active, data: this.state.data, onChange: this.handleChange })
	                ),
	                React.createElement('div', { className: 'panel3' })
	              ),
	              passwordSetup,
	              passwdShow
	            ),
	            React.createElement('div', { className: 'box2' })
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = StaffEdit;

/***/ }

});