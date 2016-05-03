webpackJsonp([96,135],{

/***/ 898:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'delete': { children: ['done', 'error'] }
	});

/***/ },

/***/ 899:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var shopActions = __webpack_require__(898);

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

/***/ 925:
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
	var helper = system.helper; //equire('../../../../../server/lib/helper');
	var dialogActions = system.dialogActions; //require('../../system/actions/dialog');
	var toasterActions = system.toasterActions; //require('../../system/actions/toaster');

	var shopActions = __webpack_require__(898);
	var shopStore = __webpack_require__(899);

	var FlexForm = widgets.FlexForm; // require('../../../widgets/flex-form.jsx');
	var FlexIcon = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
	var FlexTextInput = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');
	var FlexDropdown = widgets.FlexDropdown; //require('../../../widgets/flex-dropdown.jsx');
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

	var resetData = {
	  id: 0,
	  code: '',
	  name: '',
	  location: '',
	  tel: '',
	  fax: ''
	};

	var ShopEdit = React.createClass({
	  displayName: 'ShopEdit',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [Reflux.listenTo(shopActions.getById.done, 'onGetByIdDoneAction'), Reflux.listenTo(shopActions.save.done, 'onSaveDoneAction'), Reflux.listenTo(shopActions.save.error, 'onSaveErrorAction')],
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
	    var id = parseInt(this.context.router.getCurrentParams().id);
	    if (isNaN(id)) {
	      id = 0;
	    }
	    var fields = {
	      code: {
	        id: 'code',
	        type: 'text',
	        label: 'shop.code',
	        icon: 'user158',
	        required: true,
	        autofocus: true,
	        pattern: '.{2,}',
	        tabIndex: 1
	      },
	      prefix_barcode: {
	        id: 'prefix_barcode',
	        type: 'text',
	        label: 'shop.prefix_barcode',
	        icon: 'user158',
	        pattern: '^[0-9]{2}$',
	        tabIndex: 2,
	        readonly: id > 0
	      },
	      name: {
	        id: 'name',
	        type: 'text',
	        label: 'shop.name',
	        icon: 'user158',
	        required: true,
	        tabIndex: 3
	      },
	      location: {
	        id: 'location',
	        type: 'text',
	        label: 'shop.location',
	        icon: 'user158',
	        tabIndex: 4
	      },
	      tel: {
	        id: 'tel',
	        type: 'text',
	        label: 'shop.tel',
	        icon: 'user158',
	        tabIndex: 5
	      },
	      fax: {
	        id: 'fax',
	        type: 'text',
	        label: 'shop.fax',
	        icon: 'user158',
	        tabIndex: 6
	      },
	      is_active: {
	        id: 'is_active',
	        type: 'dropdown',
	        label: 'shop.is_active',
	        icon: 'user158',
	        list: [{ value: 'YES', text: 'ACTIVE' }, { value: 'NO', text: 'INACTIVE' }],
	        tabIndex: 7
	      },
	      save: {
	        id: 'save',
	        tabIndex: 8
	      }
	    };

	    return {
	      id: id,
	      data: helper.clone(resetData),
	      origData: helper.clone(resetData),
	      fields: fields,
	      isLock: false
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    shopActions.getById(this.context.router.getCurrentParams().id);
	    infoPanelActions.show('setting.shop', null);
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  formHasUnsavedData: function formHasUnsavedData() {
	    return JSON.stringify(this.state.data) != JSON.stringify(this.state.origData);
	  },

	  onGetByIdDoneAction: function onGetByIdDoneAction(data) {
	    this.state.fields.prefix_barcode.readonly = data.prefix_barcode.trim() != '';
	    console.log('data:', data);
	    var obj = {
	      data: data,
	      origData: helper.clone(data),
	      fields: this.state.fields
	    };

	    this.setState(obj);

	    infoPanelActions.show('setting.shop', React.createElement(
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

	  doShopSave: function doShopSave() {
	    // validate
	    var data = this.state.data;
	    var err = [];
	    if (data.code == '') {
	      err.push(tr.translate('shop.error.code_empty'));
	    }
	    if (data.name == '') {
	      err.push(tr.translate('shop.error.name_empty'));
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
	    shopActions.save(this.state.data);
	  },

	  handleChange: function handleChange(id, newValue) {
	    var data = this.state.data;
	    data[id] = newValue;
	    this.setState({
	      data: data,
	      isValid: this.refs.shopForm.isValid()
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
	          React.createElement(T, { content: this.state.data.id == 0 ? 'shop.title.new' : 'shop.title.edit', component: 'h2' })
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
	              onClick: this.doShopSave
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
	          { ref: 'shopForm', fields: this.state.fields, data: this.state.data },
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
	                React.createElement(FlexTextInput, { ref: 'prefix_barcode', field: this.state.fields.prefix_barcode, data: this.state.data, onChange: this.handleChange })
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box6' },
	            React.createElement(
	              'div',
	              { className: 'panel6' },
	              React.createElement(FlexTextInput, { ref: 'name', field: this.state.fields.name, data: this.state.data, onChange: this.handleChange })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box6' },
	            React.createElement(
	              'div',
	              { className: 'panel6' },
	              React.createElement(FlexTextInput, { ref: 'location', field: this.state.fields.location, data: this.state.data, onChange: this.handleChange })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box6 flex' },
	            React.createElement(
	              'div',
	              { className: 'box3' },
	              React.createElement(
	                'div',
	                { className: 'panel3' },
	                React.createElement(FlexTextInput, { ref: 'tel', field: this.state.fields.tel, data: this.state.data, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'box3' },
	              React.createElement(
	                'div',
	                { className: 'panel3' },
	                React.createElement(FlexTextInput, { ref: 'fax', field: this.state.fields.fax, data: this.state.data, onChange: this.handleChange })
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box6 flex' },
	            React.createElement(
	              'div',
	              { className: 'box3' },
	              React.createElement(
	                'div',
	                { className: 'panel3' },
	                React.createElement(FlexDropdown, { ref: 'is_active', field: this.state.fields.is_active, data: this.state.data, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'box3' },
	              React.createElement('div', { className: 'panel3' })
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = ShopEdit;

/***/ }

});