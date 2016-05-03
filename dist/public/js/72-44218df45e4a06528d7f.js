webpackJsonp([72,135],{

/***/ 774:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'saveNew': { children: ['done', 'error'] },
	  'delete': { children: ['done', 'error'] },
	  'getSellInfo': { children: ['done', 'error'] },
	  'getBarcode': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'listClose': { children: ['done', 'error'] },
	  'exportClose': { children: ['done', 'error'] },
	  'getCloseReturn': { children: ['done', 'error'] },
	  'getListCollection': { children: ['done', 'error'] },
	  'saveCollection': { children: ['done', 'error'] },
	  'getMobileNumber': { children: ['done', 'error'] },
	  'exportDunning': { children: ['done', 'error'] },
	  'printCollectionReport': { children: ['done', 'error'] },
	  'listClosediscount': { children: ['done', 'error'] },
	  'exportClosediscount': { children: ['done', 'error'] },
	  'saveClosediscount': { children: ['done', 'error'] },
	  'closeCaStaffList': { children: ['done', 'error'] },
	  'saveCloseCa': { children: ['done', 'error'] },
	  'getContractID': { children: ['done', 'error'] },
	  'getPersonCard': { children: ['done', 'error'] },
	  'getPersonCardCo': { children: ['done', 'error'] }
	});

/***/ },

/***/ 775:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var widgets = __webpack_require__(379);
	var FlexTextInput = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');

	var AddressInfo = React.createClass({
	  displayName: 'AddressInfo',

	  getInitialState: function getInitialState(key, value) {
	    return {
	      fields: {
	        addr1: {
	          id: 'addr1',
	          type: 'text',
	          label: 'contract.address.addr1',
	          icon: 'user158'
	        },
	        addr2: {
	          id: 'addr2',
	          type: 'text',
	          label: 'contract.address.addr2',
	          icon: 'user158'
	        },
	        tambon: {
	          id: 'tambon',
	          type: 'text',
	          label: 'contract.address.tambon',
	          icon: 'user158'
	        },
	        amphur: {
	          id: 'amphur',
	          type: 'text',
	          label: 'contract.address.amphur',
	          icon: 'user158'
	        },
	        province: {
	          id: 'province',
	          type: 'text',
	          label: 'contract.address.province',
	          icon: 'user158'
	        },
	        zipcode: {
	          id: 'zipcode',
	          type: 'text',
	          label: 'contract.address.zipcode',
	          icon: 'user158',
	          pattern: '^[0-9]{5}$'
	        },
	        tel: {
	          id: 'tel',
	          type: 'text',
	          label: 'contract.address.tel',
	          icon: 'user158',
	          pattern: '^0[0-9]{8,9}$'
	        },
	        other: {
	          id: 'other',
	          type: 'text',
	          label: this.props.otherLabel || 'contract.address.other',
	          icon: 'user158'
	        }
	      },
	      data: {}
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(props) {
	    if (props.data) {
	      this.state.data = props.data;
	      this.state.data['addr_text'] = this.getAddressString();
	      this.setState({
	        data: props.data
	      });
	    }
	  },
	  getData: function getData() {
	    return this.state.data;
	  },

	  getAddressString: function getAddressString() {
	    var tmp = [];
	    ['addr1', 'addr2', 'tambon', 'amphur', 'province', 'zipcode'].forEach(function (id) {
	      if (this.state.data[id]) {
	        tmp.push(this.state.data[id].trim());
	      }
	    }.bind(this));
	    return tmp.join(' ');
	  },

	  setData: function setData(data) {
	    this.state.data = data;
	    this.state.data['addr_text'] = this.getAddressString();
	    this.setState({
	      data: data
	    });
	  },

	  handleChange: function handleChange(key, value) {
	    this.state.data[key] = value;
	    this.state.data['addr_text'] = this.getAddressString();
	    this.setState({
	      data: this.state.data
	    });
	    if (typeof this.props.onChange === 'function') {
	      this.props.onChange(JSON.parse(JSON.stringify(this.state.data)));
	    }
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'panelf' },
	      React.createElement(
	        'div',
	        { style: { paddingBottom: '4px' } },
	        React.createElement(FlexTextInput, { field: this.state.fields.addr1, data: this.state.data, onChange: this.handleChange })
	      ),
	      React.createElement(
	        'div',
	        { style: { paddingBottom: '4px' } },
	        React.createElement(FlexTextInput, { field: this.state.fields.addr2, data: this.state.data, onChange: this.handleChange })
	      ),
	      React.createElement(
	        'div',
	        { className: 'flex', style: { paddingBottom: '4px' } },
	        React.createElement(FlexTextInput, { field: this.state.fields.tambon, data: this.state.data, onChange: this.handleChange }),
	        React.createElement('div', { style: { width: '4px' } }),
	        React.createElement(FlexTextInput, { field: this.state.fields.amphur, data: this.state.data, onChange: this.handleChange })
	      ),
	      React.createElement(
	        'div',
	        { className: 'flex', style: { paddingBottom: '4px' } },
	        React.createElement(FlexTextInput, { field: this.state.fields.province, data: this.state.data, onChange: this.handleChange }),
	        React.createElement('div', { style: { width: '4px' } }),
	        React.createElement(FlexTextInput, { field: this.state.fields.zipcode, data: this.state.data, onChange: this.handleChange })
	      ),
	      React.createElement(
	        'div',
	        { className: 'flex' },
	        React.createElement(FlexTextInput, { field: this.state.fields.tel, data: this.state.data, onChange: this.handleChange }),
	        React.createElement('div', { style: { width: '4px' } }),
	        React.createElement(FlexTextInput, { field: this.state.fields.other, data: this.state.data, onChange: this.handleChange })
	      )
	    );
	  }
	});

	module.exports = AddressInfo;

/***/ },

/***/ 776:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  customerInfo: __webpack_require__(777),
	  customerAddressStatus: __webpack_require__(778),
	  customerJobStatus: __webpack_require__(779),
	  customerCoInfo: __webpack_require__(780),
	  coAddressStatus: __webpack_require__(781),
	  coJobStatus: __webpack_require__(780)
	};

/***/ },

/***/ 777:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var tr = __webpack_require__(207);
	var widgets = __webpack_require__(379);

	var FlexTextInput = widgets.FlexTextInput;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var FlexDropdown = widgets.FlexDropdown;

	module.exports = function (fields, data, addr, handleChange) {
	  // var doc_send_to_field = {
	  //   id:'doc_send_to',
	  //   label:'contract.doc_send_to',
	  //   raw:true,
	  //   list: [
	  //     {value:'HOME', text: tr.translate('contract.doc_send_to_HOME') + ' ('+(addr.HOME || '')+')'},
	  //     {value:'WORK', text: tr.translate('contract.doc_send_to_WORK') + ' ('+(addr.WORK|| '')+')'}
	  //   ]
	  // }
	  return React.createElement(
	    'div',
	    { className: 'panel6' },
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.birth, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' }, className: 'no-shrink' }),
	      React.createElement(FlexTextInput, { field: fields.age, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px', height: '32px' } },
	      React.createElement(FlexRadioGroup, { field: fields.gender, data: data, className: 'box3 flex', onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' }, className: 'no-shrink' }),
	      React.createElement(FlexRadioGroup, { field: fields.marital_status, data: data, className: 'box3 flex', onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.mobile, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' }, className: 'no-shrink' }),
	      React.createElement(FlexTextInput, { field: fields.email, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { style: { paddingBottom: '4px' } },
	      React.createElement(FlexDropdown, { field: fields.addr_type, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { style: { paddingBottom: '4px' } },
	      React.createElement(FlexDropdown, { field: fields.addr_with, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.addr_person, data: data, onChange: handleChange })
	    )
	  );
	  // <div>
	  //   <FlexRadioGroup field={doc_send_to_field} data={data} onChange={handleChange} itemClassName="ellipsis"/>
	  // </div>
	};

/***/ },

/***/ 778:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var widgets = __webpack_require__(379);
	var T = __webpack_require__(383);

	var FlexDropdown = widgets.FlexDropdown;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexIcon = widgets.FlexIcon;
	var AddressInfo = __webpack_require__(775);

	module.exports = function (fields, data, handleChange, hasHeader, copyAddressFn) {
	  var header = null;
	  if (hasHeader === true) {
	    header = React.createElement(
	      'div',
	      { style: { paddingBottom: '4px' } },
	      React.createElement(T, { content: 'contract.address_status', className: 'section-header', component: 'div' })
	    );
	  }
	  return React.createElement(
	    'div',
	    { className: 'flex' },
	    React.createElement(
	      'div',
	      { className: 'box5' },
	      header,
	      React.createElement(T, { content: 'contract.address.card_address', component: 'div', className: 'panelf section-header', style: { fontWeight: 'bold' } }),
	      React.createElement(AddressInfo, { ref: 'cardAddr', otherLabel: 'contract.address.year', onChange: function onChange(newData) {
	          handleChange('cardAddr', newData);
	        },
	        data: data.cardAddr
	      })
	    ),
	    React.createElement(
	      'div',
	      { className: 'box5' },
	      React.createElement(
	        'div',
	        { className: 'flex' },
	        React.createElement(T, { content: 'contract.address.home_address', component: 'div', className: 'panelf section-header can-grow', style: { fontWeight: 'bold' } }),
	        React.createElement(
	          'div',
	          { className: 'no-shrink panel3 flex' },
	          React.createElement(FlexDropdown, {
	            field: {
	              id: 'homeAddrCopyFrom',
	              label: 'contract.address.copy_from',
	              list: [{ value: 'custom', text: 'กำหนดเอง' }, { value: 'fromCard', text: 'ที่อยู่บัตรประชาชน' }]
	            },
	            data: data,
	            onChange: handleChange
	          }),
	          typeof copyAddressFn == 'function' ? React.createElement(FlexIcon, {
	            icon: 'copy31',
	            className: 'no-shrink',
	            title: 'contract.read_id',
	            onClick: function () {
	              copyAddressFn('homeAddrCopyFrom');
	            }.bind(this),
	            style: { padding: '4px' }
	          }) : null
	        )
	      ),
	      React.createElement(AddressInfo, { ref: 'customerAddr', otherLabel: 'contract.address.year', onChange: function onChange(newData) {
	          //            data.customerAddr = newData;
	          handleChange('customerAddr', newData);
	        },
	        data: data.customerAddr
	      })
	    )
	  );
	};

/***/ },

/***/ 779:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var widgets = __webpack_require__(379);

	var FlexTextInput = widgets.FlexTextInput;

	module.exports = function (fields, data, handleChange) {
	  return React.createElement(
	    'div',
	    { className: 'panel5' },
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.work_type, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' } }),
	      React.createElement(FlexTextInput, { field: fields.work_type_other, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.work_detail, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' } }),
	      React.createElement(FlexTextInput, { field: fields.work_department, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.work_position, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' } }),
	      React.createElement(FlexTextInput, { field: fields.work_time, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.work_year, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' } }),
	      React.createElement(FlexTextInput, { field: fields.work_salary, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.work_income, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' } }),
	      React.createElement(FlexTextInput, { field: fields.work_income_source, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.work_prev_company, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.work_prev_addr, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { className: 'flex' },
	      React.createElement(FlexTextInput, { field: fields.work_prev_department, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' } }),
	      React.createElement(FlexTextInput, { field: fields.work_prev_tel, data: data, onChange: handleChange })
	    )
	  );
	};

/***/ },

/***/ 780:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var widgets = __webpack_require__(379);

	var FlexTextInput = widgets.FlexTextInput;

	module.exports = function (fields, data, handleChange) {
	  return React.createElement(
	    'div',
	    { className: 'panel5' },
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.co_work_detail, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' } }),
	      React.createElement(FlexTextInput, { field: fields.co_work_department, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.co_work_position, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' } }),
	      React.createElement(FlexTextInput, { field: fields.co_work_time, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { className: 'flex', style: { paddingBottom: '4px' } },
	      React.createElement(FlexTextInput, { field: fields.co_work_year, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' } }),
	      React.createElement(FlexTextInput, { field: fields.co_work_salary, data: data, onChange: handleChange })
	    ),
	    React.createElement(
	      'div',
	      { className: 'flex' },
	      React.createElement(FlexTextInput, { field: fields.co_work_income, data: data, onChange: handleChange }),
	      React.createElement('div', { style: { width: '4px' } }),
	      React.createElement(FlexTextInput, { field: fields.co_work_income_source, data: data, onChange: handleChange })
	    )
	  );
	};

/***/ },

/***/ 781:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var widgets = __webpack_require__(379);
	var T = __webpack_require__(383);

	var FlexDropdown = widgets.FlexDropdown;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexIcon = widgets.FlexIcon;
	var AddressInfo = __webpack_require__(775);

	module.exports = function (fields, data, handleChange, hasHeader, copyAddressFn) {
	  var header = null;
	  if (hasHeader === true) {
	    header = React.createElement(
	      'div',
	      { style: { paddingBottom: '4px' } },
	      React.createElement(T, { content: 'contract.address_status', className: 'section-header', component: 'div' })
	    );
	  }
	  return React.createElement(
	    'div',
	    { className: 'flex' },
	    React.createElement(
	      'div',
	      { className: 'box5' },
	      header,
	      React.createElement(T, { content: 'contract.address.card_address', component: 'div', className: 'panelf section-header', style: { fontWeight: 'bold' } }),
	      React.createElement(AddressInfo, { ref: 'coCardAddr', otherLabel: 'contract.address.year', onChange: function onChange(newData) {
	          handleChange('coCardAddr', newData);
	        },
	        data: data.coCardAddr
	      })
	    ),
	    React.createElement(
	      'div',
	      { className: 'box5' },
	      React.createElement(
	        'div',
	        { className: 'flex' },
	        React.createElement(T, { content: 'contract.address.home_address', component: 'div', className: 'panelf section-header can-grow', style: { fontWeight: 'bold' } }),
	        React.createElement(
	          'div',
	          { className: 'no-shrink panel3 flex' },
	          React.createElement(FlexDropdown, {
	            field: {
	              id: 'homeAddrCopyFrom',
	              label: 'contract.address.copy_from',
	              list: [{ value: 'custom', text: 'กำหนดเอง' }, { value: 'fromCard', text: 'ที่อยู่บัตรประชาชน' }]
	            },
	            data: data,
	            onChange: handleChange
	          }),
	          typeof copyAddressFn == 'function' ? React.createElement(FlexIcon, {
	            icon: 'copy31',
	            className: 'no-shrink',
	            title: 'contract.read_id',
	            onClick: function () {
	              copyAddressFn('homeAddrCopyFrom');
	            }.bind(this),
	            style: { padding: '4px' }
	          }) : null
	        )
	      ),
	      React.createElement(AddressInfo, { ref: 'coAddr', otherLabel: 'contract.address.year', onChange: function onChange(newData) {
	          //            data.customerAddr = newData;
	          handleChange('coAddr', newData);
	        },
	        data: data.coAddr
	      })
	    )
	  );
	};

/***/ },

/***/ 862:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var helper = system.helper;
	var systemActions = system.systemActions;
	var infoPanelActions = system.infoPanelActions;
	var dialogActions = system.dialogActions;
	var toasterActions = system.toasterActions;

	var FlexButton = widgets.FlexButton;
	var FlexTab = widgets.FlexTab;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexIcon = widgets.FlexIcon;
	var FlexDataTable = widgets.FlexDataTable;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var NationIDCard = widgets.NationIDCard;

	var actions = __webpack_require__(774);
	var AddressInfo = __webpack_require__(775);

	var component = __webpack_require__(776);

	var calcAge = function calcAge(value) {
	  var today = new Date();
	  var d = new Date(value);
	  var age = today.getFullYear() - d.getFullYear();
	  if (d.getMonth() > today.getMonth() || d.getMonth() == today.getMonth() && d.getDate() > today.getDate()) {
	    age--;
	  }
	  return age;
	};

	var ContractNew = React.createClass({
	  displayName: 'ContractNew',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(actions.getSellInfo.done, 'onGetSellInfoDoneAction'), Reflux.listenTo(systemActions.readIDCard.done, 'onReadIDCardDoneAction'), Reflux.listenTo(systemActions.readIDCard.error, 'onReadIDCardErrorAction'), Reflux.listenTo(systemActions.readIDCardPhoto.done, 'onReadIDCardPhotoDoneAction'), Reflux.listenTo(systemActions.readIDCardPhoto.error, 'onReadIDCardPhotoErrorAction'), Reflux.listenTo(actions.saveNew.done, 'onSaveNewDoneAction'), Reflux.listenTo(actions.saveNew.error, 'onSaveNewErrorAction'), Reflux.listenTo(actions.getContractID.done, 'onGetContractIDDoneAction'), Reflux.listenTo(actions.getById.done, 'onGetByIdDoneAction'), Reflux.listenTo(actions.getPersonCard.done, 'onGetPersonCardDoneAction'), Reflux.listenTo(actions.getPersonCard.error, 'onGetPersonCardErrorAction'), Reflux.listenTo(actions.getPersonCardCo.done, 'onGetPersonCardCoDoneAction'), Reflux.listenTo(actions.getPersonCardCo.error, 'onGetPersonCardCoErrorAction')],

	  getInitialState: function getInitialState() {
	    var _fields;

	    var sellId = parseInt(this.context.router.getCurrentParams().sellId);
	    var sellType = this.context.router.getCurrentParams().sellType;
	    var contractref = this.context.router.getCurrentParams().contractref == undefined ? '' : this.context.router.getCurrentParams().contractref;
	    var sellold = this.context.router.getCurrentParams().sellold == undefined ? '' : this.context.router.getCurrentParams().sellold;
	    //console.log('contractref=',contractref);
	    var fields = (_fields = {
	      code: {
	        id: 'code',
	        type: 'dropdown',
	        label: 'contract.code',
	        readonly: false,
	        list: []
	      },
	      code_ref: {
	        id: 'contract_ref',
	        type: 'dropdown',
	        label: 'contract.code',
	        readonly: false,
	        list: []
	      },
	      sign_date: {
	        id: 'sign_date',
	        type: 'date',
	        label: 'contract.sign_date',
	        require: true
	      },
	      shop_code: {
	        id: 'shop_code',
	        type: 'text',
	        label: 'contract.shop_code',
	        readonly: true
	      },
	      contract_ref: {
	        id: 'contract_ref',
	        type: 'text',
	        label: 'contract.contract_ref',
	        readonly: true
	      },
	      customer: {
	        nationid: {
	          id: 'customer.nationid',
	          type: 'text',
	          label: 'person.nationid',
	          required: true,
	          pattern: '^[0-9]{13}$'
	        },
	        prename: {
	          id: 'customer.prename',
	          type: 'text',
	          label: 'person.prename'
	          //          width:160
	        },
	        firstname: {
	          id: 'customer.firstname',
	          type: 'text',
	          label: 'person.firstname',
	          //          width:196,
	          required: true,
	          readonly: true
	        },
	        lastname: {
	          id: 'customer.lastname',
	          type: 'text',
	          label: 'person.lastname',
	          //          width:196,
	          required: true,
	          readonly: true
	        },
	        birth: {
	          id: 'customer.birth',
	          type: 'date',
	          label: 'person.birth',
	          icon: 'user158'
	        },
	        age: {
	          id: 'customer.age',
	          type: 'text',
	          label: 'contract.age',
	          icon: 'user158',
	          readonly: true
	        },
	        gender: {
	          id: 'customer.gender',
	          type: 'dropdown',
	          label: 'person.gender',
	          width: 272,
	          list: [{ value: 'M', text: 'person.gender_M' }, { value: 'F', text: 'person.gender_F' }, { value: 'N/A', text: 'person.gender_NA' }]
	        },
	        marital_status: {
	          id: 'customer.marital_status',
	          type: 'dropdown',
	          label: 'person.marital_status',
	          width: 272,
	          list: [{ value: 'SINGLE', text: 'person.marital_status_SINGLE' }, { value: 'MARRIED', text: 'person.marital_status_MARRIED' }, { value: 'N/A', text: 'person.marital_status_NA' }]
	        },
	        mobile: {
	          id: 'customer.mobile',
	          type: 'text',
	          label: 'contract.mobile',
	          icon: 'user158',
	          pattern: '^0[0-9]{9}$'
	        },
	        email: {
	          id: 'customer.email',
	          type: 'email',
	          label: 'contract.email',
	          icon: 'user158'
	        }
	      },
	      co: {
	        nationid: {
	          id: 'co.nationid',
	          type: 'text',
	          label: 'person.nationid',
	          required: true,
	          pattern: '^[0-9]{13}$'
	        },
	        prename: {
	          id: 'co.prename',
	          type: 'text',
	          label: 'person.prename'
	          //          width:160
	        },
	        firstname: {
	          id: 'co.firstname',
	          type: 'text',
	          label: 'person.firstname',
	          //          width:196,
	          required: true,
	          readonly: true
	        },
	        lastname: {
	          id: 'co.lastname',
	          type: 'text',
	          label: 'person.lastname',
	          //          width:196,
	          required: true,
	          readonly: true
	        }
	      },
	      product: {
	        id: 'product_detail',
	        type: 'text',
	        label: 'contract.product',
	        readonly: true
	      },
	      payment_month: {
	        id: 'payment_month',
	        type: 'numberinput',
	        label: 'contract.payment_month',
	        required: true,
	        min: 1,
	        max: 60
	      },
	      payment_price: {
	        id: 'payment_price',
	        type: 'numberinput',
	        label: 'contract.payment_price',
	        readonly: true
	      },
	      fee: {
	        id: 'fee',
	        type: 'numberinput',
	        label: 'contract.fee',
	        readonly: true
	      },
	      payment_per_month: {
	        id: 'payment_per_month',
	        type: 'numberinput',
	        label: 'contract.payment_per_month',
	        readonly: true
	      },
	      payment_on_day: {
	        id: 'payment_on_day',
	        type: 'numberinput',
	        min: 1,
	        max: 31,
	        label: 'contract.payment_on_day',
	        required: true
	      },

	      addr_type: {
	        id: 'cus_addr_owner',
	        type: 'text',
	        label: 'contract.addr_type',
	        list: [{ value: '01', text: 'เจ้าของบ้าน' }, { value: '02', text: 'บ้านญาติ' }, { value: '03', text: 'บ้านพักสวัสดิการ' }, { value: '04', text: 'เช่าเอกชน' }, { value: '05', text: 'เช่าการเคหะ' }, { value: '06', text: 'บ้านบิดามารดา' }]
	      },
	      addr_with: {
	        id: 'cus_addr_with',
	        type: 'text',
	        label: 'contract.addr_with',
	        list: [{ value: '01', text: 'คนเดียว' }, { value: '02', text: 'บิดามารดา' }, { value: '03', text: 'ญาติ' }, { value: '04', text: 'คู่สมรส' }, { value: '05', text: 'เพื่อน' }]
	      },
	      addr_person: {
	        id: 'cus_addr_person',
	        type: 'numberinput',
	        label: 'contract.addr_person',
	        pattern: '^[0-9]{1,2}$',
	        icon: 'user158'
	      },
	      work_company: {
	        id: 'work_company',
	        type: 'text',
	        label: 'contract.work_company'
	      },
	      work_type: {
	        id: 'work_type',
	        type: 'text',
	        label: 'contract.work_type'
	      },
	      work_type_other: {
	        id: 'work_type_other',
	        type: 'text',
	        label: 'contract.work_type_other'
	      },
	      work_detail: {
	        id: 'work_detail',
	        type: 'text',
	        label: 'contract.work_detail'
	      },
	      work_department: {
	        id: 'work_department',
	        type: 'text',
	        label: 'contract.work_department'
	      },
	      work_position: {
	        id: 'work_position',
	        type: 'text',
	        label: 'contract.work_position'
	      },
	      work_time: {
	        id: 'work_time',
	        type: 'text',
	        label: 'contract.work_time'
	      },
	      work_year: {
	        id: 'work_year',
	        type: 'number',
	        label: 'contract.work_year'
	      },
	      work_salary: {
	        id: 'work_salary',
	        type: 'number',
	        label: 'contract.work_salary'
	      },
	      work_income: {
	        id: 'work_income',
	        type: 'number',
	        label: 'contract.work_income'
	      },
	      work_income_source: {
	        id: 'work_income_source',
	        type: 'text',
	        label: 'contract.work_income_source'
	      },
	      work_prev_company: {
	        id: 'work_prev_company',
	        type: 'tex',
	        label: 'contract.work_prev_company'
	      }
	    }, _defineProperty(_fields, 'work_prev_company', {
	      id: 'work_prev_company',
	      type: 'tex',
	      label: 'contract.work_prev_company'
	    }), _defineProperty(_fields, 'work_prev_addr', {
	      id: 'work_prev_addr',
	      type: 'tex',
	      label: 'contract.work_prev_addr'
	    }), _defineProperty(_fields, 'work_prev_department', {
	      id: 'work_prev_department',
	      type: 'tex',
	      label: 'contract.work_prev_department'
	    }), _defineProperty(_fields, 'work_prev_tel', {
	      id: 'work_prev_tel',
	      type: 'tex',
	      label: 'contract.work_prev_tel'
	    }), _defineProperty(_fields, 'co_mobile', {
	      id: 'co_mobile',
	      type: 'text',
	      label: 'contract.mobile'
	    }), _defineProperty(_fields, 'co_email', {
	      id: 'co_email',
	      type: 'email',
	      label: 'contract.email'
	    }), _defineProperty(_fields, 'co_relation', {
	      id: 'co_relation',
	      type: 'text',
	      label: 'contract.co_relation'
	    }), _defineProperty(_fields, 'co_work_company', {
	      id: 'co_work_company',
	      type: 'text',
	      label: 'contract.work_company'
	    }), _defineProperty(_fields, 'co_work_detail', {
	      id: 'co_work_detail',
	      type: 'text',
	      label: 'contract.work_detail'
	    }), _defineProperty(_fields, 'co_work_department', {
	      id: 'co_work_department',
	      type: 'text',
	      label: 'contract.work_department'
	    }), _defineProperty(_fields, 'co_work_position', {
	      id: 'co_work_position',
	      type: 'text',
	      label: 'contract.work_position'
	    }), _defineProperty(_fields, 'co_work_time', {
	      id: 'co_work_time',
	      type: 'text',
	      label: 'contract.work_time'
	    }), _defineProperty(_fields, 'co_work_year', {
	      id: 'co_work_year',
	      type: 'number',
	      label: 'contract.work_year'
	    }), _defineProperty(_fields, 'co_work_salary', {
	      id: 'co_work_salary',
	      type: 'number',
	      label: 'contract.work_salary'
	    }), _defineProperty(_fields, 'co_work_income', {
	      id: 'co_work_income',
	      type: 'number',
	      label: 'contract.work_income'
	    }), _defineProperty(_fields, 'co_work_income_source', {
	      id: 'co_work_income_source',
	      type: 'text',
	      label: 'contract.work_income_source'
	    }), _fields);

	    return {
	      sellId: sellId,
	      fields: fields,
	      flagSell: false,
	      flagEdit: sellType == 'NORMAL' ? false : true,
	      prefix_code: '',
	      contractref: contractref,
	      sellold: sellold,
	      data: {
	        customer: {
	          gender: 'N/A',
	          marital_status: 'N/A',
	          birth: '1980-01-01',
	          age: 30,
	          mobile: '',
	          email: ''
	        },
	        cardAddr: {},
	        customerAddr: {},
	        workAddr: {},
	        co: {},
	        coCardAddr: {},
	        coAddr: {},
	        coWorkAddr: {},
	        doc_send_to: 'HOME',
	        addr_owner: '02',
	        addr_with: '02',
	        addr_person: 2,
	        cusIDCard: {},
	        coIDCard: {},
	        contract_ref: ''
	      },
	      currentTab: 'customer_status',
	      paymentFields: [{ name: 'no', type: 'number', label: 'contract.term.num', readonly: true, width: '80px' }, { name: 'date', type: 'date', label: 'contract.term.due_date', width: '200px', render: function render(row) {
	          return tr.localize(new Date(row.date), { type: 'date', format: 'long' });
	        } }, { name: 'amount', type: 'number', label: 'contract.term.due_amount', render: function render(row) {
	          return helper.numberFormat(parseFloat(row.amount), 2);
	        } }],
	      paymentData: [],
	      sellInfo: {
	        sell_date: '',
	        receipt_no: '',
	        shop_name: '',
	        product_description: '',
	        product_serial: '',
	        price: 0,
	        cost: 0,
	        main_price: 0,
	        down_payment: 0,
	        remain_price: 0,
	        sell_staff: '',
	        finance_staff: ''
	      }
	    };
	  },

	  onGetSellInfoDoneAction: function onGetSellInfoDoneAction(data) {
	    if (data == null) {
	      return;
	    }
	    // console.log(this.state.flagEdit);
	    // console.log(data);

	    var sellInfo = data.sell;

	    var name = sellInfo.company_name.trim().split(/\s+/g).map(function (item) {
	      return item.trim();
	    });
	    //console.log('sellref=',this.state.contractref);
	    this.state.data.code = '';
	    this.state.data.ref_code = sellInfo.contract_ref;
	    this.state.data.contract_ref = this.state.contractref != '' ? this.state.contractref : '';
	    this.state.data.sell_id = sellInfo.id;
	    //console.log(this.state.data.sell_id);
	    this.state.data.sell_date = sellInfo.sell_date.substr(0, 10);
	    this.state.data.sign_date = sellInfo.sell_date.substr(0, 10);
	    this.state.data.shop_code = sellInfo.shop_code;
	    this.state.data.customer.ref_id = sellInfo.company_id;
	    var tmp = sellInfo.company_code.trim();
	    if (tmp.length == 13) {
	      this.state.data.customer.idcard = tmp;
	    } else {
	      this.state.data.customer.mobile = tmp;
	    }
	    if (name.length == 1) {
	      this.state.data.customer.firstname = name[0];
	    } else if (name.length == 2) {
	      this.state.data.customer.firstname = name[0];
	      this.state.data.customer.lastname = name[1];
	    } else if (name[0] == 'คุณ') {
	      this.state.data.customer.prename = name[0];
	      this.state.data.customer.firstname = name[1];
	      this.state.data.customer.lastname = name[2];
	    } else if (name.length >= 3) {
	      this.state.data.customer.firstname = name[0];
	      name.shift();
	      this.state.data.customer.lastname = name.join(' ');
	    }

	    this.state.data.finance_staff_id = sellInfo.finance_staff_id;
	    this.state.data.sell_staff_id = sellInfo.sell_staff_id;
	    console.log('sell_staff_id=', sellInfo.sell_staff_id, 'finance_staff_id=', sellInfo.finance_staff_id);

	    this.state.data.product_detail = sellInfo.product_description;
	    this.state.data.product_serial = sellInfo.product_serial;
	    this.state.data.payment_down = parseFloat(sellInfo.down_payment);
	    this.state.data.total_price = parseFloat(sellInfo.price);
	    this.state.data.cost = parseFloat(sellInfo.cost);
	    this.state.data.payment_price = parseFloat(sellInfo.remain_price);
	    this.state.data.fee = this.state.data.payment_price > 3000 ? 200 : 100;
	    this.state.data.install_cost = parseFloat(sellInfo.install_cost);

	    var d = new Date(sellInfo.sell_date);
	    this.state.data.payment_on_day = d.getDate();

	    // guess month
	    // for (var i = 12; i >= 1; i--) {
	    //   if (this.state.data.payment_price == Math.floor(this.state.data.payment_price / i) * i) {
	    //     this.state.data.payment_month = i;
	    //     break;
	    //   }
	    // }
	    // if (this.state.data.payment_month==1) {
	    //   this.state.data.payment_month = 12;
	    // }

	    this.state.data.payment_month = '';

	    this.state.data.payment_per_month = Math.floor(this.state.data.payment_price / this.state.data.payment_month);
	    this.state.data.fee = this.state.data.payment_month <= 3 ? 100 : 200;

	    if (data.person != null) {
	      this.state.data.customer.prename = data.person.prename;
	      this.state.data.customer.birth = data.person.birth.substr(0, 10);
	      this.state.data.customer.gender = data.person.gender;
	      this.state.data.customer.marital_status = data.person.marital_status;
	      this.state.data.customer.mobile = data.person.mobile;
	      this.state.data.customer.email = data.person.email;
	      this.state.data.customer.lineid = data.person.lineid;
	    }

	    if (data.address.HOME != null) {
	      this.state.data.customerAddr = {
	        addr1: data.address.HOME.addr1,
	        addr2: data.address.HOME.addr2,
	        tambon: data.address.HOME.tambon,
	        amphur: data.address.HOME.amphur,
	        province: data.address.HOME.province,
	        zipcode: data.address.HOME.zipcode,
	        tel: data.address.HOME.tel
	      };
	    }

	    if (data.address.WORK != null) {
	      this.state.data.workAddr = {
	        addr1: data.address.WORK.addr1,
	        addr2: data.address.WORK.addr2,
	        tambon: data.address.WORK.tambon,
	        amphur: data.address.WORK.amphur,
	        province: data.address.WORK.province,
	        zipcode: data.address.WORK.zipcode,
	        tel: data.address.WORK.tel
	      };
	    }

	    if (this.state.flagEdit == true) {

	      this.state.fields.code.list = data.used_barcode.map(function (item) {
	        return { value: item, text: item.substr(0, 10) + '-' + item.substr(10, 5) + '-' + item.substr(15, 2) };
	      });
	      this.state.fields.code.list.unshift({ value: '', text: '' });
	    } else {
	      if (data.flagSell == true) {
	        this.state.fields.code.list.unshift({ value: 'สดพิเศษ', text: 'สดพิเศษ' });
	        this.state.data.code = 'สดพิเศษ';
	        this.state.data.ref_code = 'สดพิเศษ';
	        this.state.data.co.nationid = '0000000000000';
	        this.state.data.co.prename = '';
	        this.state.data.co.firstname = 'สดพิเศษ';
	        this.state.data.co.lastname = 'สดพิเศษ';
	        this.state.data.fee = 0;
	      } else {
	        this.state.fields.code.list = data.barcode.map(function (item) {
	          return { value: item, text: item.substr(0, 10) + '-' + item.substr(10, 5) + '-' + item.substr(15, 2) };
	        });
	        this.state.fields.code.list.unshift({ value: '', text: '' });
	      }
	    }

	    sellInfo.sell_date = sellInfo.sell_date.substr(0, 10);
	    sellInfo.price = helper.numberFormat(sellInfo.price, 2);
	    sellInfo.cost = helper.numberFormat(sellInfo.cost, 2);
	    sellInfo.main_price = helper.numberFormat(sellInfo.main_price, 2);
	    sellInfo.down_payment = helper.numberFormat(sellInfo.down_payment, 2);
	    sellInfo.install_cost = helper.numberFormat(sellInfo.install_cost, 2);
	    sellInfo.remain_price = helper.numberFormat(sellInfo.remain_price, 2);

	    this.state.fields.code.readonly = data.flagSell;

	    this.setState({
	      data: this.state.data,
	      sellInfo: sellInfo,
	      flagSell: data.flagSell,
	      fields: this.state.fields,
	      prefix_code: data.prefix_code
	    }, function () {
	      this.doGenPayment();
	    }.bind(this));

	    console.log(this.state.data);
	  },

	  onReadIDCardDoneAction: function onReadIDCardDoneAction(info) {
	    this.state.data[this.currentCard] = info;
	    var addr = '';
	    if (this.currentCard == 'cusIDCard') {
	      addr = 'cardAddr';
	      this.state.data.customer.nationid = info.nationid;
	      this.state.data.customer.prename = info.prenameTH;
	      this.state.data.customer.firstname = info.firstnameTH;
	      this.state.data.customer.lastname = info.lastnameTH;
	      this.state.data.customer.birth = info.birth;
	      this.state.data.customer.gender = info.gender;
	      this.state.data.customer.age = calcAge(info.birth);
	    } else if (this.currentCard == 'coIDCard') {
	      addr = 'coCardAddr';
	      this.state.data.co.nationid = info.nationid;
	      this.state.data.co.prename = info.prenameTH;
	      this.state.data.co.firstname = info.firstnameTH;
	      this.state.data.co.lastname = info.lastnameTH;
	      this.state.data.co.age = calcAge(info.birth);
	    }
	    if (!this.state.data[addr].addr1) {
	      var tmp = [];
	      if (info.address.houseNo) {
	        tmp.push(info.address.houseNo);
	      }
	      if (info.address.villageNo) {
	        tmp.push(info.villageNo);
	      }
	      this.state.data[addr].addr1 = tmp.join(' ');

	      tmp = [];
	      if (info.address.lane) {
	        tmp.push(info.address.lane);
	      }
	      if (info.address.road) {
	        tmp.push(info.address.road);
	      }
	      if (info.address.unknown) {
	        tmp.push(info.address.unknown);
	      }
	      this.state.data[addr].addr2 = tmp.join(' ');

	      // tmp = info.address.tambon.substr(0,4);
	      // if (tmp=='ตำบล' || tmp=='แขวง') {
	      //   this.state.data[addr].tambon = info.address.tambon.substr(4);
	      // } else {
	      this.state.data[addr].tambon = info.address.tambon;
	      // }

	      this.state.data[addr].amphur = info.address.amphur;
	      this.state.data[addr].province = info.address.province;
	    }
	    //this.state.data.cusIDCard = this.state.data.coIDCard;
	    var obj = {
	      data: this.state.data
	    };
	    obj[this.currentCard + 'PhotoLoading'] = true;
	    this.setState(obj);
	    console.log('jack', this.state.data);
	    systemActions.readIDCardPhoto();
	  },

	  onReadIDCardErrorAction: function onReadIDCardErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.idcard.error'
	    });
	  },

	  onReadIDCardPhotoDoneAction: function onReadIDCardPhotoDoneAction(info) {
	    //    console.log('onReadIDCardPhotoDoneAction', info);
	    var obj = {};
	    obj[this.currentCard + 'Photo'] = info.photoPath;
	    obj[this.currentCard + 'PhotoLoading'] = false;
	    obj[(this.currentCard == 'cusIDCard' ? 'customer' : 'co') + 'Photo'] = '';
	    this.setState(obj);
	  },

	  onReadIDCardPhotoErrorAction: function onReadIDCardPhotoErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.idcard.photo_error'
	    });
	  },

	  onSaveNewDoneAction: function onSaveNewDoneAction() {
	    toasterActions.pop({
	      type: 'success',
	      message: 'result.save.ok'
	    });
	    this.context.router.goBack();
	  },

	  onSaveNewErrorAction: function onSaveNewErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: e
	    });
	  },

	  doContractSave: function doContractSave() {
	    // check required
	    console.log(this.state);
	    var err = [];
	    if (!this.state.data.code) {
	      err.push('contract.error.code_required');
	    }
	    if (!this.state.data.sign_date) {
	      err.push('contract.error.sign_date_required');
	    }
	    if (!this.state.data.customer) {
	      err.push('contract.error.customer_required');
	    } else {
	      if (!this.state.data.customer.nationid || this.state.data.customer.nationid.length != 13) {
	        err.push('contract.error.customer_nationid_invalid');
	      }
	      if (!this.state.data.customer.firstname) {
	        err.push('contract.error.customer_firstname_required');
	      }
	      if (!this.state.data.customer.lastname) {
	        err.push('contract.error.customer_lastname_required');
	      }
	    }
	    if (!this.state.data.co) {
	      err.push('contract.error.co_required');
	    } else {
	      if (!this.state.data.co.nationid || this.state.data.co.nationid.length != 13) {
	        err.push('contract.error.co_nationid_invalid');
	      }
	      if (!this.state.data.co.firstname) {
	        err.push('contract.error.co_firstname_required');
	      }
	      if (!this.state.data.co.lastname) {
	        err.push('contract.error.co_lastname_required');
	      }
	    }
	    console.log('data:', this.state.sellInfo);
	    if (err.length > 0) {
	      dialogActions.show({
	        title: 'ข้อมูลไม่ถูกต้อง',
	        content: React.createElement(
	          'ul',
	          null,
	          err.map(function (item, i) {
	            return React.createElement(
	              'li',
	              { key: i },
	              item
	            );
	          }.bind(this))
	        ),
	        actions: [{ id: 'ok', icon: 'check52', label: 'action.close' }]
	      }, function (id) {});
	      return;
	    }

	    dialogActions.show({
	      title: 'ยืนยัน',
	      content: React.createElement(
	        'ul',
	        null,
	        err.map(function (item, i) {
	          return React.createElement(
	            'li',
	            { key: i },
	            item
	          );
	        }.bind(this))
	      ),
	      actions: [{ id: 'save', icon: 'check52', label: 'action.save' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	    }, function (isCancel, id) {
	      if (isCancel || id == 'cancel') {
	        return;
	      }
	      var obj = {
	        data: this.state.data,
	        paymentData: this.state.paymentData,
	        cusPhoto: this.customerPhotoData,
	        coPhoto: this.coPhotoData,
	        flagSell: this.state.flagSell,
	        prefix_code: this.state.prefix_code,
	        sellInfo: this.state.sellInfo,
	        contractref: this.state.contractref,
	        sellold: this.state.sellold
	      };
	      //console.log('datajack=',obj);
	      actions.saveNew(obj);
	    }.bind(this));
	  },

	  scrollTo: function scrollTo(e, id) {
	    e.preventDefault();
	    if (!this.refs[id]) {
	      return;
	    }
	    this.refs[id].getDOMNode().scrollIntoView();
	  },

	  componentDidMount: function componentDidMount() {
	    infoPanelActions.show('installment.contract.pending', React.createElement(
	      'a',
	      { href: '#' },
	      'Expand'
	    ));
	    actions.getSellInfo(this.state.sellId);
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  handleChange: function handleChange(id, value) {
	    var tmp = id.split('.');
	    if (tmp.length == 2) {
	      this.state.data[tmp[0]][tmp[1]] = value;
	    } else {
	      this.state.data[id] = value;
	    }
	    // calc age
	    if (id === 'customer.birth') {
	      this.state.data.customer.age = calcAge(value);
	    }

	    var genPayment = false;
	    if (id === 'payment_month') {
	      var month = parseInt(value);
	      var price = parseFloat(this.state.data.payment_price);
	      if (month > 0) {
	        var per_month = Math.floor(price / month);
	        this.state.data['payment_per_month'] = per_month;
	      }
	      this.state.data.fee = month <= 3 ? 100 : 200;
	      genPayment = true;
	    }
	    if (id === 'payment_per_month' || id === 'payment_on_day' || id === 'sign_date') {
	      genPayment = true;
	    }

	    if (id === 'homeAddrCopyFrom' && value == 'fromCard') {
	      this.state.data.customerAddr = helper.clone(this.state.data.cardAddr);
	    } else if (id === 'coHomeAddrCopyFrom') {
	      if (value === 'fromCard') {
	        this.state.data.coAddr = helper.clone(this.state.data.coCardAddr);
	      } else if (value === 'fromCustomer') {
	        this.state.data.coAddr = helper.clone(this.state.data.customerAddr);
	      }
	    } else if (id === 'coWorkAddrCopyFrom') {
	      if (value === 'fromWork') {
	        this.state.data.coWorkAddr = helper.clone(this.state.data.workAddr);
	        this.state.data.co_work_company = this.state.data.work_company;
	      }
	    }
	    this.setState({
	      data: this.state.data
	    }, function () {
	      if (genPayment) {
	        this.doGenPayment();
	      }
	    }.bind(this));

	    if (this.state.flagEdit == true) {

	      if (id === 'code') {
	        var contract = value;

	        console.log(contract);
	        actions.getContractID(contract);
	      }
	    }
	  },

	  handleTabClick: function handleTabClick(id) {
	    this.setState({
	      currentTab: id
	    });
	  },

	  handleIDCardChange: function handleIDCardChange(card, data) {
	    console.log(data);
	    if (data.photoData) {
	      //      console.log('photoData', data.photoData);
	      if (card == 'customer') {
	        this.customerPhotoData = data.photoData;
	      } else {
	        this.coPhotoData = data.photoData;
	      }
	    }
	  },

	  doGenPayment: function doGenPayment() {
	    var payment = [];
	    var amount = Math.floor(this.state.data.payment_per_month);
	    var total = 0;
	    var month = parseInt(this.state.data.payment_month);
	    var today = new Date(this.state.data.sign_date);
	    var mm = today.getMonth();
	    var day = parseInt(this.state.data.payment_on_day);

	    //var main_price = this.state.sellInfo.main_price;
	    var down_price = this.state.data.payment_down;
	    var cost = this.state.data.cost;
	    var install_cost = this.state.data.install_cost;
	    var fee = this.state.data.fee;
	    var cost_term = parseFloat((cost + install_cost + fee - down_price) / month);

	    for (var i = 0; i < month; i++) {
	      if (i == month - 1) {
	        amount = parseFloat(this.state.data.payment_price) - total;
	      }
	      var date = new Date(today.getFullYear(), mm + i + 1, day);
	      if (date.getMonth() != (mm + i + 1) % 12) {
	        date = new Date(today.getFullYear(), mm + i + 2, 0);
	      }

	      payment.push({
	        no: i + 1,
	        date: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2) + '-' + ('0' + date.getDate()).substr(-2),
	        amount: amount,
	        cost_term: cost_term
	      });
	      total += amount;
	    }
	    this.setState({
	      paymentData: payment
	    });

	    //console.log('paymentData=',this.state.paymentData);
	  },

	  readIDCard: function readIDCard(card) {
	    //console.log('read id card');
	    this.currentCard = card;
	    this.setState({
	      currentTab: card == 'cusIDCard' ? 'customer_status' : 'co_status'
	    }, function () {
	      systemActions.readIDCard();
	    });
	  },

	  paymentTableChange: function paymentTableChange(row_i, field_id, value) {
	    console.log(row_id, field_id, value);
	    if (row_i == this.state.paymentData.length - 1 && field_id == 'amount') {
	      return;
	    }
	    if (field_id == 'amount') {
	      // calculate last payment
	      var old = this.state.paymentData[row_i]['amount'];
	      var new_value = parseFloat(value);
	      var diff = new_value - old;
	      this.state.paymentData[row_i]['amount'] = new_value;
	      this.state.paymentData[this.state.paymentData.length - 1]['amount'] -= diff;
	    } else {
	      this.state.paymentData[row_i][field_id] = value;
	    }

	    this.setState({
	      paymentData: this.state.paymentData
	    });
	  },

	  copyAddress: function copyAddress(id) {
	    if (id === 'homeAddrCopyFrom' && this.state.data.homeAddrCopyFrom == 'fromCard') {
	      this.state.data.customerAddr = helper.clone(this.state.data.cardAddr);
	    } else if (id === 'coHomeAddrCopyFrom') {
	      if (this.state.data.coHomeAddrCopyFrom === 'fromCard') {
	        this.state.data.coAddr = helper.clone(this.state.data.coCardAddr);
	      } else if (this.state.data.coHomeAddrCopyFrom === 'fromCustomer') {
	        this.state.data.coAddr = helper.clone(this.state.data.customerAddr);
	      }
	    } else if (id === 'coWorkAddrCopyFrom') {
	      if (this.state.data.coWorkAddrCopyFrom === 'fromWork') {
	        this.state.data.coWorkAddr = helper.clone(this.state.data.workAddr);
	      }
	    }
	    this.setState({
	      data: this.state.data
	    });
	  },

	  onGetContractIDDoneAction: function onGetContractIDDoneAction(data) {
	    actions.getById(data.contract_id);
	  },

	  onGetByIdDoneAction: function onGetByIdDoneAction(data) {
	    //data: this.state.data
	    this.state.data.customer.nationid = data.contract.customer.nationid;
	    this.state.data.customer.prename = data.contract.customer.prename;
	    this.state.data.customer.firstname = data.contract.customer.firstname;
	    this.state.data.customer.lastname = data.contract.customer.lastname;
	    this.state.data.customer.birth = data.contract.customer.birth;
	    this.state.data.customer.age = data.contract.customer.age;
	    this.state.data.customer.gender = data.contract.customer.gender;
	    this.state.data.customer.marital_status = data.contract.customer.marital_status;
	    this.state.data.customer.mobile = data.contract.customer.mobile;
	    this.state.data.customer.email = data.contract.customer.email;

	    this.state.data.co.nationid = data.contract.co.nationid;
	    this.state.data.co.prename = data.contract.co.prename;
	    this.state.data.co.firstname = data.contract.co.firstname;
	    this.state.data.co.lastname = data.contract.co.lastname;

	    this.state.data.cus_addr_owner = data.contract.cus_addr_owner;
	    this.state.data.cus_addr_with = data.contract.cus_addr_with;
	    this.state.data.cus_addr_person = data.contract.cus_addr_person;
	    this.state.data.work_company = data.contract.work_company;
	    this.state.data.work_type = data.contract.work_type;
	    this.state.data.work_type_other = data.contract.work_type_other;
	    this.state.data.work_detail = data.contract.work_detail;
	    this.state.data.work_department = data.contract.work_department;
	    this.state.data.work_position = data.contract.work_position;
	    this.state.data.work_time = data.contract.work_time;
	    this.state.data.work_year = data.contract.work_year;
	    this.state.data.work_salary = data.contract.work_salary;
	    this.state.data.work_income = data.contract.work_income;
	    this.state.data.work_income_source = data.contract.work_income_source;
	    this.state.data.work_prev_company = data.contract.work_prev_company;
	    this.state.data.work_prev_addr = data.contract.work_prev_addr;
	    this.state.data.work_prev_department = data.contract.work_prev_department;
	    this.state.data.work_prev_tel = data.contract.work_prev_tel;
	    this.state.data.co_mobile = data.contract.co_mobile;
	    this.state.data.co_email = data.contract.co_email;
	    this.state.data.co_relation = data.contract.co_relation;
	    this.state.data.co_work_company = data.contract.co_work_company;
	    this.state.data.co_work_detail = data.contract.co_work_detail;
	    this.state.data.co_work_department = data.contract.co_work_department;
	    this.state.data.co_work_position = data.contract.co_work_position;
	    this.state.data.co_work_time = data.contract.co_work_time;
	    this.state.data.co_work_year = data.contract.co_work_year;
	    this.state.data.co_work_salary = data.contract.co_work_salary;
	    this.state.data.co_work_income = data.contract.co_work_income;
	    this.state.data.co_work_income_source = data.contract.co_work_income_source;

	    this.setState({
	      data: this.state.data
	    });
	    console.log(data);

	    console.log(this.state.data.customer.nationid);
	  },

	  onGetPersonCardDoneAction: function onGetPersonCardDoneAction(data) {
	    var addr = '';
	    addr = 'cardAddr';
	    var newObj = JSON.parse(data.idcard_info);

	    if (this.state.data.customer.firstname == newObj.firstnameTH && this.state.data.customer.lastname == newObj.lastnameTH) {
	      this.state.data.cusIDCard = newObj.idcard_info;
	      this.state.data.customer.nationid = newObj.nationid;
	      this.state.data.customer.prename = newObj.prenameTH;
	      this.state.data.customer.firstname = newObj.firstnameTH;
	      this.state.data.customer.lastname = newObj.lastnameTH;
	      this.state.data.customer.birth = newObj.birth;
	      this.state.data.customer.gender = newObj.gender;
	      this.state.data.customer.age = calcAge(newObj.birth);
	      //JSONObject jsonObj = new JSONObject(data.idcard_info);
	      if (!this.state.data[addr].addr1) {
	        var tmp = [];
	        if (newObj.address.houseNo) {
	          tmp.push(newObj.address.houseNo);
	        }

	        if (newObj.address.villageNo) {
	          tmp.push(newObj.address.villageNo);
	        }
	        this.state.data[addr].addr1 = tmp.join(' ');

	        tmp = [];
	        if (newObj.address.lane) {
	          tmp.push(newObj.address.lane);
	        }
	        if (newObj.address.road) {
	          tmp.push(newObj.address.road);
	        }
	        if (newObj.address.unknown) {
	          tmp.push(newObj.address.unknown);
	        }
	        this.state.data[addr].addr2 = tmp.join(' ');
	        this.state.data[addr].tambon = newObj.address.tambon;

	        this.state.data[addr].amphur = newObj.address.amphur;
	        this.state.data[addr].province = newObj.address.province;
	      }
	      this.state.data.cusIDCard = newObj;

	      var co_id = newObj.nationid,
	          photoCoIDCard = '';
	      var path = window.location.protocol + '//' + window.location.host + '/idcard/photo';
	      if (!co_id || co_id.length != 13) {
	        photoCoIDCard = path + '.png';
	      } else {
	        photoCoIDCard = path + '/' + co_id.substr(-1) + '/' + co_id.substr(-2, 1) + '/' + co_id + '.jpg';
	      }

	      this.state.cusIDCardPhoto = photoCoIDCard;

	      this.setState({
	        data: this.state.data,
	        cusIDCardPhoto: this.state.cusIDCardPhoto
	      });
	    } else {

	      if (this.state.data.customer.firstname != data.firstname && this.state.data.customer.lastname != data.lastname) {
	        toasterActions.pop({
	          type: 'warning',
	          message: 'ชื่อผู้เช่าไม่ถูกต้อง'
	        });
	        this.state.data.cusIDCard = '';
	        this.setState({
	          data: this.state.data
	        });
	      }
	    }
	    console.log(this.state.data);
	  },

	  onGetPersonCardErrorAction: function onGetPersonCardErrorAction(e) {
	    var a = this;
	    dialogActions.show({
	      title: 'ยืนยัน',
	      content: 'ลูกค้าต้องผ่านการเช็คประวัติแล้วเท่านั้น',
	      actions: [{ id: 'ok', icon: 'check52', label: 'action.confirm', default: true }]
	    }, function (isCancel, action_id) {

	      a.context.router.transitionTo('installment.contract', { id: 0 });
	    });
	  },

	  onGetPersonCardCoDoneAction: function onGetPersonCardCoDoneAction(data) {
	    var addr = '';
	    addr = 'coCardAddr';

	    console.log('jack test = ', data);

	    var newObj = JSON.parse(data.idcard_info);
	    console.log('jack test2 = ', newObj);
	    if (newObj.firstnameTH == undefined || newObj.lastnameTH == undefined) {
	      this.state.data.co.nationid = data.nationid;
	      this.state.data.co.firstname = data.firstname;
	      this.state.data.co.lastname = data.lastname;
	    } else {
	      this.state.data.co.nationid = newObj.nationid;
	      this.state.data.co.firstname = newObj.firstnameTH;
	      this.state.data.co.lastname = newObj.lastnameTH;
	      this.state.data.co.prename = newObj.prenameTH;
	    }

	    if (!this.state.data[addr].addr1) {
	      var tmp = [];
	      if (newObj.address.houseNo) {
	        tmp.push(newObj.address.houseNo);
	      }

	      if (newObj.address.villageNo) {
	        tmp.push(newObj.address.villageNo);
	      }
	      this.state.data[addr].addr1 = tmp.join(' ');

	      tmp = [];
	      if (newObj.address.lane) {
	        tmp.push(newObj.address.lane);
	      }
	      if (newObj.address.road) {
	        tmp.push(newObj.address.road);
	      }
	      if (newObj.address.unknown) {
	        tmp.push(newObj.address.unknown);
	      }
	      this.state.data[addr].addr2 = tmp.join(' ');
	      this.state.data[addr].tambon = newObj.address.tambon;

	      this.state.data[addr].amphur = newObj.address.amphur;
	      this.state.data[addr].province = newObj.address.province;
	    }

	    this.setState({
	      data: this.state.data
	    });
	  },

	  onGetPersonCardCoErrorAction: function onGetPersonCardCoErrorAction(e) {
	    var a = this;
	    dialogActions.show({
	      title: 'ยืนยัน',
	      content: 'ลูกค้าต้องผ่านการเช็คประวัติแล้วเท่านั้น',
	      actions: [{ id: 'ok', icon: 'check52', label: 'action.confirm', default: true }]
	    }, function (isCancel, action_id) {

	      a.context.router.transitionTo('installment.contract', { id: 0 });
	    });
	  },

	  nationidEnter: function nationidEnter(id, value) {
	    console.log('Enter', id, ' ', value);
	    if (id == 'co.nationid') {
	      actions.getPersonCardCo(value);
	    } else {
	      actions.getPersonCard(value);
	    }

	    // actions.getPersonCard(value);
	  },

	  render: function render() {
	    var fields = this.state.fields;
	    var contractLine = React.createElement(
	      'div',
	      { className: 'boxf flex' },
	      React.createElement(
	        'div',
	        { className: 'panel4 flex no-shrink' },
	        React.createElement(T, { content: 'contract.contract', className: 'no-shrink', style: { width: '80px' } }),
	        React.createElement('div', { className: 'no-shrink', style: { width: '8px' } }),
	        React.createElement(FlexDropdown, {
	          field: this.state.fields.code, data: this.state.data, onChange: this.handleChange,
	          readonly: this.state.flagSell
	        })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panelf flex' },
	        React.createElement(
	          'div',
	          { className: 'box2 no-shrink' },
	          React.createElement(FlexTextInput, { field: this.state.fields.sign_date, data: this.state.data, onChange: this.handleChange })
	        ),
	        React.createElement('div', { style: { width: '2px' } }),
	        React.createElement(
	          'div',
	          { style: { width: '206px' } },
	          React.createElement(FlexTextInput, { field: this.state.fields.shop_code, data: this.state.data })
	        ),
	        React.createElement('div', { style: { width: '2px' } }),
	        React.createElement(
	          'div',
	          { style: { width: '206px' } },
	          React.createElement(FlexTextInput, { field: this.state.fields.contract_ref, data: this.state.data })
	        )
	      )
	    );
	    var customerLine = React.createElement(
	      'div',
	      { className: 'boxf flex' },
	      React.createElement(
	        'div',
	        { className: 'panel4 flex no-shrink' },
	        React.createElement(T, { content: 'contract.customer', className: 'no-shrink', style: { width: '80px' } }),
	        React.createElement('div', { className: 'no-shrink', style: { width: '8px' } }),
	        React.createElement(FlexTextInput, {
	          field: this.state.fields.customer.nationid,
	          data: this.state.data,
	          onChange: this.handleChange,
	          onEnter: this.nationidEnter
	        })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panelf flex' },
	        React.createElement(
	          'div',
	          { className: 'box2 no-shrink' },
	          React.createElement(FlexTextInput, { field: this.state.fields.customer.prename, data: this.state.data, onChange: this.handleChange })
	        ),
	        React.createElement('div', { style: { width: '4px' } }),
	        React.createElement(FlexTextInput, { field: this.state.fields.customer.firstname, data: this.state.data, onChange: this.handleChange }),
	        React.createElement('div', { style: { width: '4px' } }),
	        React.createElement(FlexTextInput, { field: this.state.fields.customer.lastname, data: this.state.data, onChange: this.handleChange })
	      )
	    );
	    var customerCoLine = React.createElement(
	      'div',
	      { className: 'boxf flex' },
	      React.createElement(
	        'div',
	        { className: 'panel4 flex no-shrink' },
	        React.createElement(T, { content: 'contract.co', className: 'no-shrink', style: { width: '80px' } }),
	        React.createElement('div', { className: 'no-shrink', style: { width: '8px' } }),
	        React.createElement(FlexTextInput, { field: fields.co.nationid,
	          data: this.state.data,
	          onChange: this.handleChange,
	          onEnter: this.nationidEnter
	        })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panelf flex' },
	        React.createElement(
	          'div',
	          { className: 'box2 no-shrink' },
	          React.createElement(FlexTextInput, { field: fields.co.prename, data: this.state.data, onChange: this.handleChange })
	        ),
	        React.createElement('div', { style: { width: '4px' } }),
	        React.createElement(FlexTextInput, { field: fields.co.firstname, data: this.state.data, onChange: this.handleChange }),
	        React.createElement('div', { style: { width: '4px' } }),
	        React.createElement(FlexTextInput, { field: fields.co.lastname, data: this.state.data, onChange: this.handleChange })
	      )
	    );

	    var productLine = React.createElement(
	      'div',
	      { className: 'boxf flex' },
	      React.createElement(
	        'div',
	        { className: 'panel4 flex no-shrink' },
	        React.createElement(T, { content: 'contract.product', className: 'no-shrink', style: { width: '80px' } }),
	        React.createElement('div', { className: 'no-shrink', style: { width: '8px' } }),
	        React.createElement(FlexTextInput, { field: fields.product, data: this.state.data, onChange: this.handleChange })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panelf flex' },
	        React.createElement(
	          'div',
	          { className: 'box2 no-shrink' },
	          React.createElement(FlexTextInput, { field: { id: 'payment_month', type: 'text', label: 'contract.payment_month', readonly: true }, data: this.state.data, onChange: this.handleChange })
	        ),
	        React.createElement('div', { style: { width: '4px' } }),
	        React.createElement(FlexTextInput, { field: { id: 'payment_price', type: 'text', label: 'contract.payment_price', readonly: true }, data: this.state.data, onChange: this.handleChange }),
	        React.createElement('div', { style: { width: '4px' } }),
	        React.createElement(FlexTextInput, { field: { id: 'payment_per_month', type: 'text', label: 'contract.payment_per_month', readonly: true }, data: this.state.data, onChange: this.handleChange })
	      )
	    );

	    var list = [{ id: 'customer_status', icon: 'user157', text: 'contract.customer' }, { id: 'address_status', icon: 'shared1', text: 'contract.address_status' }, { id: 'work_status', icon: 'work3', text: 'contract.work_status' }, { id: 'co_status', icon: 'add184', text: 'contract.co' }, { id: 'coaddress_status', icon: 'shared1', text: 'contract.coaddress_status' }, { id: 'cowork_status', icon: 'work3', text: 'contract.cowork_status' }, { id: 'product_status', icon: 'download166', text: 'contract.product_status' }, { id: 'payment_status', icon: 'connection21', text: 'contract.payment_status' }];

	    var obj = this.state.fields.customer;
	    obj.addr_type = this.state.fields.addr_type;
	    obj.addr_with = this.state.fields.addr_with;
	    obj.addr_person = this.state.fields.addr_person;

	    var customerInfo = component.customerInfo(this.state.fields.customer, this.state.data, {
	      CARD: this.state.data.cardAddr.addr_text,
	      HOME: this.state.data.customerAddr.addr_text,
	      WORK: this.state.data.workAddr.addr_text,
	      COCARD: this.state.data.coCardAddr.addr_text,
	      COHOME: this.state.data.coAddr.addr_text,
	      COWORK: this.state.data.coWorkAddr.addr_text
	    }, this.handleChange);
	    var customerAddressStatus = component.customerAddressStatus(this.state.fields, this.state.data, this.handleChange, null, this.copyAddress);

	    var customerJobStatus = component.customerJobStatus(this.state.fields, this.state.data, this.handleChange);

	    var customerCoInfo = component.customerCoInfo(this.state.fields, this.state.data, this.handleChange);

	    var productView = React.createElement(
	      'div',
	      { className: 'box8 flex' },
	      React.createElement(
	        'div',
	        { className: 'panel4' },
	        React.createElement(FlexTextInput, { field: { id: 'sell_date', type: 'date', label: 'sell.sell_date', readonly: true }, data: this.state.sellInfo }),
	        React.createElement(FlexTextInput, { field: { id: 'receipt_no', type: 'text', label: 'sell.receipt_no', readonly: true }, data: this.state.sellInfo }),
	        React.createElement(FlexTextInput, { field: { id: 'product_description', type: 'text', label: 'sell.description', readonly: true }, data: this.state.sellInfo }),
	        React.createElement(FlexTextInput, { field: { id: 'product_serial', type: 'text', label: 'sell.serial', readonly: true }, data: this.state.sellInfo }),
	        React.createElement(FlexTextInput, { field: { id: 'sell_staff', type: 'text', label: 'sell.sell_staff', readonly: true }, data: this.state.sellInfo }),
	        React.createElement(FlexTextInput, { field: { id: 'finance_staff', type: 'text', label: 'sell.finance_staff', readonly: true }, data: this.state.sellInfo })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel4' },
	        React.createElement(FlexTextInput, { field: { id: 'price', type: 'number', label: 'sell.price', readonly: true }, data: this.state.sellInfo }),
	        React.createElement(FlexTextInput, { field: { id: 'cost', type: 'number', label: 'sell.cost', readonly: true }, data: this.state.sellInfo }),
	        React.createElement(FlexTextInput, { field: { id: 'main_price', type: 'number', label: 'sell.main_price', readonly: true }, data: this.state.sellInfo }),
	        React.createElement(FlexTextInput, { field: { id: 'down_payment', type: 'number', label: 'sell.down_payment', readonly: true }, data: this.state.sellInfo }),
	        React.createElement(FlexTextInput, { field: { id: 'install_cost', type: 'number', label: 'sell.install_cost', readonly: true }, data: this.state.sellInfo }),
	        React.createElement(FlexTextInput, { field: { id: 'remain_price', type: 'number', label: 'sell.remain_price', readonly: true }, data: this.state.sellInfo })
	      )
	    );

	    var paymentForm = React.createElement(
	      'div',
	      { className: 'box2' },
	      React.createElement(
	        'div',
	        { className: 'panel2' },
	        React.createElement(FlexTextInput, { field: this.state.fields.payment_month, data: this.state.data, onChange: this.handleChange })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel2' },
	        React.createElement(FlexTextInput, { field: this.state.fields.payment_price, data: this.state.data, onChange: this.handleChange })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel2' },
	        React.createElement(FlexTextInput, { field: this.state.fields.fee, data: this.state.data, onChange: this.handleChange })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel2' },
	        React.createElement(FlexTextInput, { field: this.state.fields.payment_per_month, data: this.state.data, onChange: this.handleChange })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel2' },
	        React.createElement(FlexTextInput, { field: this.state.fields.payment_on_day, data: this.state.data, onChange: this.handleChange })
	      )
	    );
	    // <div className="panel2">
	    //   <FlexButton label="contract.gen_payment" onClick={this.doGenPayment} icon="list89"/>
	    // </div>

	    var paymentTable = React.createElement(
	      'div',
	      { className: 'panel6' },
	      React.createElement(FlexDataTable, {
	        fields: this.state.paymentFields,
	        data: this.state.paymentData,
	        displayRows: 6,
	        onChange: this.paymentTableChange
	      })
	    );

	    return React.createElement(
	      'div',
	      { className: 'content-page flex-form' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'contract.title.new', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink' },
	          React.createElement(FlexButton, { icon: 'save20', label: 'action.save', 'default': true,
	            onClick: this.doContractSave })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body boxf' },
	        React.createElement(
	          'form',
	          { ref: 'frm' },
	          contractLine,
	          customerLine,
	          customerCoLine,
	          productLine,
	          React.createElement(
	            'div',
	            { className: 'panelf' },
	            React.createElement(FlexTab, { list: list, selected: this.state.currentTab, onClick: this.handleTabClick })
	          ),
	          React.createElement(
	            'div',
	            { style: { display: this.state.currentTab == 'customer_status' ? 'block' : 'none' } },
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              customerInfo,
	              React.createElement(
	                'div',
	                { className: 'panelf can-grow' },
	                React.createElement(NationIDCard, {
	                  idcard: this.state.data.cusIDCard,
	                  photoPath: this.state.cusIDCardPhoto,
	                  photoLoading: this.state.cusIDCardPhotoLoading,
	                  onChange: function (data) {
	                    this.handleIDCardChange('customer', data);
	                  }.bind(this)
	                })
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: { display: this.state.currentTab == 'address_status' ? 'block' : 'none' } },
	            customerAddressStatus
	          ),
	          React.createElement(
	            'div',
	            { style: { display: this.state.currentTab == 'work_status' ? 'block' : 'none' } },
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              customerJobStatus,
	              React.createElement(
	                'div',
	                { className: 'box5' },
	                React.createElement(
	                  'div',
	                  { className: 'panel5', style: { paddingBottom: '0' } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.work_company, data: this.state.data, onChange: this.handleChange })
	                ),
	                React.createElement(AddressInfo, { ref: 'workAddr', otherLabel: 'contract.address.fax', onChange: function (data) {
	                    this.handleChange('workAddr', data);
	                  }.bind(this),
	                  data: this.state.data.workAddr
	                })
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: { display: this.state.currentTab == 'co_status' ? 'block' : 'none' } },
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'panel6 no-shrink' },
	                React.createElement(
	                  'div',
	                  { className: 'flex', style: { paddingBottom: '4px' } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.co_mobile, data: this.state.data, onChange: this.handleChange }),
	                  React.createElement('div', { style: { width: '4px' } }),
	                  React.createElement(FlexTextInput, { field: this.state.fields.co_email, data: this.state.data, onChange: this.handleChange })
	                ),
	                React.createElement(FlexTextInput, { field: this.state.fields.co_relation, data: this.state.data, onChange: this.handleChange })
	              ),
	              React.createElement(
	                'div',
	                { className: 'panelf can-grow' },
	                React.createElement(NationIDCard, {
	                  idcard: this.state.data.coIDCard,
	                  photoPath: this.state.coIDCardPhoto,
	                  photoLoading: this.state.coIDCardPhotoLoading,
	                  onChange: function (data) {
	                    this.handleIDCardChange('co', data);
	                  }.bind(this)
	                })
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: { display: this.state.currentTab == 'coaddress_status' ? 'block' : 'none' } },
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'box5' },
	                React.createElement(T, { content: 'contract.address.card_address', component: 'div', className: 'panelf section-header', style: { fontWeight: 'bold' } }),
	                React.createElement(AddressInfo, { ref: 'coCardAddr', otherLabel: 'contract.address.year',
	                  onChange: function (data) {
	                    this.handleChange('coCardAddr', data);
	                  }.bind(this),
	                  data: this.state.data.coCardAddr
	                })
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5' },
	                React.createElement(
	                  'div',
	                  { className: 'flex' },
	                  React.createElement(T, { content: 'contract.address.home_address', component: 'div', className: 'panelf section-header can-grow', style: { fontWeight: 'bold' } }),
	                  React.createElement(
	                    'div',
	                    { className: 'no-shrink panel3 flex' },
	                    React.createElement(FlexDropdown, {
	                      field: {
	                        id: 'coHomeAddrCopyFrom',
	                        label: 'contract.address.copy_from',
	                        list: [{ value: 'custom', text: 'กำหนดเอง' }, { value: 'fromCard', text: 'ที่อยู่บัตรประชาชน' }, { value: 'fromCustomer', text: 'ที่อยู่ผู้เช่าซื้อ' }]
	                      },
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    }),
	                    React.createElement(FlexIcon, {
	                      icon: 'copy31',
	                      className: 'no-shrink',
	                      title: 'contract.read_id',
	                      onClick: function () {
	                        this.copyAddress('coHomeAddrCopyFrom');
	                      }.bind(this),
	                      style: { padding: '4px' }
	                    })
	                  )
	                ),
	                React.createElement(AddressInfo, { ref: 'coAddr', otherLabel: 'contract.address.year',
	                  onChange: function (data) {
	                    this.handleChange('coAddr', data);
	                  }.bind(this),
	                  data: this.state.data.coAddr
	                })
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: { display: this.state.currentTab == 'cowork_status' ? 'block' : 'none' } },
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'box5' },
	                React.createElement(
	                  'div',
	                  { className: 'flex' },
	                  React.createElement(T, { content: 'contract.address.work_address', component: 'div', className: 'panelf section-header can-grow', style: { fontWeight: 'bold' } }),
	                  React.createElement(FlexIcon, {
	                    icon: 'copy31',
	                    className: 'no-shrink',
	                    title: 'contract.read_id',
	                    onClick: function () {
	                      this.copyWork('coWorkAddrCopyFrom');
	                    }.bind(this),
	                    style: { padding: '4px' }
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel5' },
	                  React.createElement(FlexTextInput, { field: this.state.fields.co_work_company, data: this.state.data, onChange: this.handleChange })
	                ),
	                customerCoInfo
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5' },
	                React.createElement(
	                  'div',
	                  { className: 'flex' },
	                  React.createElement(T, { content: 'contract.address.work_address', component: 'div', className: 'panelf section-header can-grow', style: { fontWeight: 'bold' } }),
	                  React.createElement(
	                    'div',
	                    { className: 'no-shrink panel3 flex' },
	                    React.createElement(FlexDropdown, {
	                      field: {
	                        id: 'coWorkAddrCopyFrom',
	                        label: 'contract.address.copy_from',
	                        list: [{ value: 'custom', text: 'กำหนดเอง' }, { value: 'fromWork', text: 'ที่ทำงานผู้เช่าซื้อ' }]
	                      },
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    }),
	                    React.createElement(FlexIcon, {
	                      icon: 'copy31',
	                      className: 'no-shrink',
	                      title: 'contract.read_id',
	                      onClick: function () {
	                        this.copyAddress('coWorkAddrCopyFrom');
	                      }.bind(this),
	                      style: { padding: '4px' }
	                    })
	                  )
	                ),
	                React.createElement(AddressInfo, { ref: 'coWorkAddr', otherLabel: 'contract.address.fax', onChange: function (data) {
	                    this.handleChange('coWorkAddr', data);
	                  }.bind(this),
	                  data: this.state.data.coWorkAddr
	                })
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: { display: this.state.currentTab == 'product_status' ? 'block' : 'none' } },
	            productView
	          ),
	          React.createElement(
	            'div',
	            { style: { display: this.state.currentTab == 'payment_status' ? 'block' : 'none' } },
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              paymentForm,
	              paymentTable
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = ContractNew;

/***/ },

/***/ 863:
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
	var dialogActions = system.dialogActions;
	var toasterActions = system.toasterActions;
	var helper = system.helper;
	var storage = system.storage;
	// var systemStore       = system.systemStore;
	// var sessionStore      = system.sessionStore;

	var pendingActions = __webpack_require__(864);
	var pendingStore = __webpack_require__(865);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexDropdown = widgets.FlexDropdown;

	var storageKey = 'installment.contract.pending';

	var ContractList = React.createClass({
	  displayName: 'ContractList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    var shops = system.acl.getShopAcl();
	    var option = storage.load(storageKey, { shop_code: '' });
	    var shop_code = '';

	    if (option.shop_code == '') {
	      shop_code = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    } else {
	      shop_code = option.shop_code;
	    }

	    return {
	      data: {
	        shop: shop_code
	      },
	      fields: [{ name: 'sell_date', type: 'text', title: 'info.sell_date', width: '92px', render: function render(row) {
	          return tr.localize(new Date(row.sell_date), { type: 'date', format: 'short' });
	        } }, { name: 'shop_name', title: 'info.shop_name', width: '110px' }, { name: 'company_name', title: 'info.company_name', width: '125px' }, { name: 'product_serial', title: 'info.serial', width: '125px' }, { name: 'product_description', title: 'info.description' }, { name: 'down_payment', title: 'info.down_payment', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.down_payment, 2);
	        } }, { name: 'remain_price', title: 'info.remain_price', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.remain_price, 2);
	        } }, { name: 'sales_staff', title: 'info.sell_staff', width: '100px' }, { name: 'flag', title: 'info.flag', hint: 'info.flag_hint', width: '24px', sort: false }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'installment.contract.new', param: { sellId: row.id, sellType: 'NORMAL' }, icon: 'right244', title: 'action.select' })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {},

	  handleShopChange: function handleShopChange(id, value) {
	    storage.save(storageKey, { shop_code: value });
	    this.setState({
	      data: {
	        shop: value
	      }
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  doContractNew: function doContractNew() {
	    this.context.router.transitionTo('setting.contract.edit', { id: 0 });
	  },

	  render: function render() {
	    var list = system.acl.getShopAcl().map(function (item) {
	      return {
	        value: item.code,
	        text: item.code + ' ' + item.name
	      };
	    });
	    if (system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] })) {
	      list.unshift({ value: '*', text: '* ทุกสาขา' });
	    }

	    var footnote = React.createElement(
	      'div',
	      null,
	      React.createElement(T, { content: 'contract.footer.special' })
	    );

	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'contract.title.list_pending', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'contract.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleShopChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'installment-contract-pending',
	          listAction: pendingActions.list,
	          exportAction: pendingActions.export,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'sell_date',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: { shop: this.state.data.shop == '*' ? null : this.state.data.shop },
	          footer: footnote
	        })
	      )
	    );
	  }
	});

	module.exports = ContractList;

/***/ },

/***/ 864:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] }
	});

/***/ },

/***/ 865:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var pendingActions = __webpack_require__(864);

	var contractStore = Reflux.createStore({
	  listenables: [pendingActions],

	  // pendingActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/installment/contract/listPending', param, function (res) {
	      if (res.status === true) {
	        pendingActions.list.done(res.data, res.opt);
	        menuActions.updateCount('contract', res.opt.totalRows);
	      } else {
	        pendingActions.list.error(res.msg);
	      }
	    });
	  },

	  onExport: function onExport(param) {
	    ajaxActions.request('/api/installment/contract/exportPending', param, function (res) {
	      if (res.status === true) {
	        pendingActions.export.done(res.file);
	      } else {
	        pendingActions.export.error();
	      }
	    });
	  }

	});

	module.exports = contractStore;

/***/ },

/***/ 866:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var acl = system.acl;
	var helper = system.helper;
	var systemActions = system.systemActions;
	var infoPanelActions = system.infoPanelActions;
	var dialogActions = system.dialogActions;
	var toasterActions = system.toasterActions;

	var FlexButton = widgets.FlexButton;
	var FlexTab = widgets.FlexTab;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexIcon = widgets.FlexIcon;
	var FlexDataTable = widgets.FlexDataTable;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var NationIDCard = widgets.NationIDCard;

	var actions = __webpack_require__(774);
	var AddressInfo = __webpack_require__(775);

	var component = __webpack_require__(776);

	var calcAge = function calcAge(value) {
	  var today = new Date();
	  var d = new Date(value);
	  var age = today.getFullYear() - d.getFullYear();
	  if (d.getMonth() > today.getMonth() || d.getMonth() == today.getMonth() && d.getDate() > today.getDate()) {
	    age--;
	  }
	  return age;
	};

	var statusIcon = {
	  NORMAL: 'circle108',
	  DEBT: 'round54',
	  CLOSE_CANCEL: 'circle108',
	  CLOSE_NORMAL: 'circle108',
	  CLOSE_RETURN: 'circle108',
	  CLOSE_CONFISCATE: 'round54',
	  CLOSE_BAD_DEBT: 'rounded56'
	};
	var statusColor = {
	  NORMAL: 'green',
	  DEBT: 'orange',
	  CLOSE_CANCEL: 'green',
	  CLOSE_NORMAL: 'green',
	  CLOSE_RETURN: 'green',
	  CLOSE_CONFISCATE: 'orange',
	  CLOSE_BAD_DEBT: 'red'
	};

	var formatContractCode = function formatContractCode(code) {
	  if (!code || code.length < 16 || code.length > 17) {
	    return code;
	  }
	  if (code.length == 16) {
	    return code.substr(0, 9) + '-' + code.substr(9, 5) + '-' + code.substr(14, 2);
	  }
	  if (code.length == 17) {
	    return code.substr(0, 10) + '-' + code.substr(10, 5) + '-' + code.substr(15, 2);
	  }
	};

	var ContractEdit = React.createClass({
	  displayName: 'ContractEdit',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(actions.getById.done, 'onGetByIdDoneAction'), Reflux.listenTo(actions.save.done, 'onSaveDoneAction'), Reflux.listenTo(actions.save.error, 'onSaveErrorAction'), Reflux.listenTo(actions.getCloseReturn.done, 'onGetCloseReturnDoneAction'), Reflux.listenTo(actions.getListCollection.done, 'onGetListCollectionDoneAction'), Reflux.listenTo(actions.saveCollection.done, 'onSaveCollectionDoneAction'), Reflux.listenTo(actions.getMobileNumber.done, 'onGetMobileNumberDoneAction'), Reflux.listenTo(actions.printCollectionReport.done, 'onPrintCollectionReportDoneAction'), Reflux.listenTo(actions.closeCaStaffList.done, 'onCloseCaStaffListDoneAction'), Reflux.listenTo(actions.saveCloseCa.done, 'onSaveCloseCaDoneAction')],

	  getInitialState: function getInitialState() {
	    var _dataSaveCloseCA, _fields;

	    var id = parseInt(this.context.router.getCurrentParams().id);
	    var flagClose = this.context.router.getCurrentParams().close;
	    var flagDunning = this.context.router.getCurrentParams().dunning;
	    var pageBack = this.context.router.getCurrentParams().pageback;

	    if (!pageBack) {
	      pageBack = 'installment.contract.list';
	    }

	    var default_today = new Date();
	    default_today.setMonth(default_today.getMonth() + 0);
	    var _valueToday = default_today.toJSON().slice(5, 7) + '/' + default_today.toJSON().slice(0, 4);
	    //console.log(_valueToday);
	    return {
	      id: id,
	      flagClose: flagClose,
	      flagDunning: flagDunning,
	      pageBack: pageBack,
	      genPaymentTerm: false,
	      contract: {
	        permission_save: true,
	        customer: {},
	        co: {},
	        cardAddr: {},
	        customerAddr: {},
	        workAddr: {},
	        coCardAddr: {},
	        coAddr: {},
	        coWorkAddr: {},
	        return: {},
	        dataSaveCollection: {
	          due_date: new Date().toJSON().slice(0, 10).replace(/-/ig, '/'),
	          call_number: '',
	          call_remark: '',
	          call_type: 'โทรหาคนซื้อ',
	          shop_id: '',
	          staff_id: system.sessionStore.getSession().staff.id,
	          contract_id: id,
	          collection_send: '1',
	          collection_statusca: 'N',
	          call_name: ''
	        },
	        dataSaveCloseCA: (_dataSaveCloseCA = {
	          id: '',
	          closeca_staff: '',
	          closeca_date: new Date().toJSON().slice(0, 10),
	          closeca_effective: _valueToday
	        }, _defineProperty(_dataSaveCloseCA, 'closeca_staff', ''), _defineProperty(_dataSaveCloseCA, 'over_day', ''), _defineProperty(_dataSaveCloseCA, 'last_paid', ''), _defineProperty(_dataSaveCloseCA, 'closeca_profit_lost', 0), _defineProperty(_dataSaveCloseCA, 'install_cost', 0), _defineProperty(_dataSaveCloseCA, 'closeca_percent', 0), _defineProperty(_dataSaveCloseCA, 'closeca_amount', 0), _defineProperty(_dataSaveCloseCA, 'closeca_staff_percent', 0), _defineProperty(_dataSaveCloseCA, 'closeca_staff_amount', 0), _defineProperty(_dataSaveCloseCA, 'closeca_remark', ''), _dataSaveCloseCA),
	        payment_month: '',
	        payment_price: '',
	        payment_per_month: '',
	        payment_on_day: '',
	        fee: '',
	        start_date: ''
	      },
	      return: {},
	      expand: {
	        customer: false,
	        co: false,
	        payment_term: false,
	        close_return: flagClose == 'Y' ? 'true' : false,
	        collection: flagDunning == 'Y' ? 'true' : false,
	        closeca: false
	      },
	      paymentTerm: [],
	      refContract: [],
	      returndetail: [],
	      dataCollection: [],
	      fields: (_fields = {
	        nationid: {
	          id: 'customer.nationid',
	          type: 'text',
	          label: 'person.nationid',
	          // required:true,
	          // pattern:'^[0-9]{13}$'
	          readonly: true
	        },
	        prename: {
	          id: 'customer.prename',
	          type: 'text',
	          label: 'person.prename',
	          width: 160,
	          readonly: true
	        },
	        firstname: {
	          id: 'customer.firstname',
	          type: 'text',
	          label: 'person.firstname',
	          //          required:true
	          readonly: true
	        },
	        lastname: {
	          id: 'customer.lastname',
	          type: 'text',
	          label: 'person.lastname',
	          //          required:true
	          readonly: true
	        },
	        birth: {
	          id: 'customer.birth',
	          type: 'date',
	          label: 'person.birth',
	          icon: 'user158'
	        },
	        age: {
	          id: 'customer.age',
	          type: 'text',
	          label: 'contract.age',
	          icon: 'user158',
	          readonly: true
	        },
	        gender: {
	          id: 'customer.gender',
	          type: 'dropdown',
	          label: 'person.gender',
	          width: 272,
	          list: [{ value: 'M', text: 'person.gender_M' }, { value: 'F', text: 'person.gender_F' }, { value: 'N/A', text: 'person.gender_NA' }]
	        },
	        marital_status: {
	          id: 'customer.marital_status',
	          type: 'dropdown',
	          label: 'person.marital_status',
	          width: 272,
	          list: [{ value: 'SINGLE', text: 'person.marital_status_SINGLE' }, { value: 'MARRIED', text: 'person.marital_status_MARRIED' }, { value: 'N/A', text: 'person.marital_status_NA' }]
	        },
	        mobile: {
	          id: 'cus_mobile',
	          type: 'text',
	          label: 'contract.mobile',
	          icon: 'user158',
	          pattern: '^0[0-9]{9}$'
	        },
	        email: {
	          id: 'customer.email',
	          type: 'email',
	          label: 'contract.email',
	          icon: 'user158'
	        },
	        co_nationid: {
	          id: 'co.nationid',
	          type: 'text',
	          label: 'person.nationid'
	          // required:true,
	          // pattern:'^[0-9]{13}$'
	        },
	        co_prename: {
	          id: 'co.prename',
	          type: 'text',
	          label: 'person.prename'
	        },
	        co_firstname: {
	          id: 'co.firstname',
	          type: 'text',
	          label: 'person.firstname'
	          // required:truำ
	        },
	        co_lastname: {
	          id: 'co.lastname',
	          type: 'text',
	          label: 'person.lastname'
	          //          width:196,
	          // required:true
	        },
	        co_mobile: {
	          id: 'co.mobile',
	          type: 'text',
	          label: 'contract.mobile'
	        },
	        co_email: {
	          id: 'co.email',
	          type: 'email',
	          label: 'contract.email'
	        },
	        co_work_company: {
	          id: 'co_work_company',
	          type: 'text',
	          label: 'contract.work_company'
	        },
	        co_work_detail: {
	          id: 'co_work_detail',
	          type: 'text',
	          label: 'contract.work_detail'
	        },
	        co_work_department: {
	          id: 'co_work_department',
	          type: 'text',
	          label: 'contract.work_department'
	        },
	        co_work_position: {
	          id: 'co_work_position',
	          type: 'text',
	          label: 'contract.work_position'
	        },
	        co_work_time: {
	          id: 'co_work_time',
	          type: 'text',
	          label: 'contract.work_time'
	        },
	        co_work_year: {
	          id: 'co_work_year',
	          type: 'number',
	          label: 'contract.work_year'
	        },
	        co_work_salary: {
	          id: 'co_work_salary',
	          type: 'number',
	          label: 'contract.work_salary'
	        },
	        co_work_income: {
	          id: 'co_work_income',
	          type: 'number',
	          label: 'contract.work_income'
	        },
	        co_work_income_source: {
	          id: 'co_work_income_source',
	          type: 'text',
	          label: 'contract.work_income_source'
	        },
	        addr_type: {
	          id: 'cus_addr_owner',
	          type: 'text',
	          label: 'contract.addr_type',
	          list: [{ value: '01', text: 'เจ้าของบ้าน' }, { value: '02', text: 'บ้านญาติ' }, { value: '03', text: 'บ้านพักสวัสดิการ' }, { value: '04', text: 'เช่าเอกชน' }, { value: '05', text: 'เช่าการเคหะ' }, { value: '06', text: 'บ้านบิดามารดา' }]
	        },
	        addr_with: {
	          id: 'cus_addr_with',
	          type: 'text',
	          label: 'contract.addr_with',
	          list: [{ value: '01', text: 'คนเดียว' }, { value: '02', text: 'บิดามารดา' }, { value: '03', text: 'ญาติ' }, { value: '04', text: 'คู่สมรส' }, { value: '05', text: 'เพื่อน' }]
	        },
	        addr_person: {
	          id: 'cus_addr_person',
	          type: 'text',
	          label: 'contract.addr_person',
	          pattern: '^[0-9]{1,2}$',
	          icon: 'user158'
	        },
	        work_company: {
	          id: 'work_company',
	          type: 'text',
	          label: 'contract.work_company'
	        },
	        work_type: {
	          id: 'work_type',
	          type: 'text',
	          label: 'contract.work_type'
	        },
	        work_type_other: {
	          id: 'work_type_other',
	          type: 'text',
	          label: 'contract.work_type_other'
	        },
	        work_detail: {
	          id: 'work_detail',
	          type: 'text',
	          label: 'contract.work_detail'
	        },
	        work_department: {
	          id: 'work_department',
	          type: 'text',
	          label: 'contract.work_department'
	        },
	        work_position: {
	          id: 'work_position',
	          type: 'text',
	          label: 'contract.work_position'
	        },
	        work_time: {
	          id: 'work_time',
	          type: 'text',
	          label: 'contract.work_time'
	        },
	        work_year: {
	          id: 'work_year',
	          type: 'number',
	          label: 'contract.work_year'
	        },
	        work_salary: {
	          id: 'work_salary',
	          type: 'number',
	          label: 'contract.work_salary'
	        },
	        work_income: {
	          id: 'work_income',
	          type: 'number',
	          label: 'contract.work_income'
	        },
	        work_income_source: {
	          id: 'work_income_source',
	          type: 'text',
	          label: 'contract.work_income_source'
	        },
	        work_prev_company: {
	          id: 'work_prev_company',
	          type: 'tex',
	          label: 'contract.work_prev_company'
	        }
	      }, _defineProperty(_fields, 'work_prev_company', {
	        id: 'work_prev_company',
	        type: 'tex',
	        label: 'contract.work_prev_company'
	      }), _defineProperty(_fields, 'work_prev_addr', {
	        id: 'work_prev_addr',
	        type: 'tex',
	        label: 'contract.work_prev_addr'
	      }), _defineProperty(_fields, 'work_prev_department', {
	        id: 'work_prev_department',
	        type: 'tex',
	        label: 'contract.work_prev_department'
	      }), _defineProperty(_fields, 'work_prev_tel', {
	        id: 'work_prev_tel',
	        type: 'tex',
	        label: 'contract.work_prev_tel'
	      }), _defineProperty(_fields, 'payment_month', {
	        id: 'payment_month',
	        type: 'numberinput',
	        label: 'contract.payment_month',
	        require: true,
	        min: 1,
	        max: 60
	      }), _defineProperty(_fields, 'payment_price', {
	        id: 'payment_price',
	        type: 'numberinput',
	        label: 'contract.payment_price',
	        readonly: true
	      }), _defineProperty(_fields, 'payment_per_month', {
	        id: 'payment_per_month',
	        type: 'numberinput',
	        label: 'contract.payment_per_month',
	        readonly: true
	      }), _defineProperty(_fields, 'payment_on_day', {
	        id: 'payment_on_day',
	        type: 'numberinput',
	        require: true,
	        min: 1,
	        max: 31,
	        label: 'contract.payment_on_day'
	      }), _defineProperty(_fields, 'close_return_newcost', {
	        id: 'new_cost',
	        type: 'number',
	        label: 'close_return.newcost',
	        required: true
	      }), _defineProperty(_fields, 'close_return_oldcost', {
	        id: 'cost',
	        type: 'number',
	        label: 'close_return.oldcost',
	        readonly: true
	      }), _defineProperty(_fields, 'close_return_paid', {
	        id: 'total_paid',
	        type: 'number',
	        label: 'close_return.paid',
	        readonly: true
	      }), _defineProperty(_fields, 'close_return_balance', {
	        id: 'balance',
	        type: 'number',
	        label: 'close_return.balance',
	        readonly: true
	      }), _defineProperty(_fields, 'close_return_contract_free', {
	        id: 'fee',
	        type: 'number',
	        label: 'close_return.contract_free',
	        readonly: true
	      }), _defineProperty(_fields, 'close_return_install_free', {
	        id: 'install_cost',
	        type: 'number',
	        label: 'close_return.install_free',
	        readonly: true
	      }), _defineProperty(_fields, 'close_return_profit_loss', {
	        id: 'profit_loss',
	        type: 'number',
	        label: 'close_return.profit_loss',
	        required: true
	      }), _defineProperty(_fields, 'close_return_sell_id', {
	        id: 'sell_id',
	        type: 'text',
	        label: 'close_return.sell_id',
	        readonly: true
	      }), _defineProperty(_fields, 'close_return_sign_date', {
	        id: 'sign_date',
	        type: 'text',
	        label: 'close_return.sign_date',
	        readonly: true
	      }), _defineProperty(_fields, 'close_return_product_serial', {
	        id: 'product_serial',
	        type: 'text',
	        label: 'close_return.product_serial',
	        readonly: true
	      }), _defineProperty(_fields, 'close_return_product_detail', {
	        id: 'product_detail',
	        type: 'text',
	        label: 'close_return.product_detail',
	        readonly: true
	      }), _defineProperty(_fields, 'close_return_cus_name', {
	        id: 'cus_name',
	        type: 'text',
	        label: 'close_return.cus_name',
	        readonly: true
	      }), _defineProperty(_fields, 'close_return_product_condition', {
	        id: 'product_condition',
	        type: 'text',
	        label: 'close_return.product_condition'
	      }), _defineProperty(_fields, 'close_return_remark', {
	        id: 'remark',
	        type: 'text',
	        label: 'close_return.remark'
	      }), _defineProperty(_fields, 'close_return_return_date', {
	        id: 'return_date',
	        type: 'text',
	        label: 'close_return.return_date',
	        readonly: true
	      }), _defineProperty(_fields, 'collection_date', {
	        id: 'dataSaveCollection.due_date',
	        label: 'collection.due_date',
	        type: 'date',
	        required: true
	      }), _defineProperty(_fields, 'collection_type', {
	        id: 'dataSaveCollection.call_type',
	        type: 'dropdown',
	        label: 'collection.call_type',
	        list: [{ value: 'โทรหาผู้ซื้อ', text: 'โทรหาผู้ซื้อ' }, { value: 'โทรหาผู้ซื้ออื่น ๆ', text: 'โทรหาผู้ซื้ออื่น ๆ' }, { value: 'โทรหาผู้ค้ำ', text: 'โทรหาผู้ค้ำ' }, { value: 'โทรหาผู้ค้ำอื่น ๆ', text: 'โทรหาผู้ค้ำอื่น ๆ' }]
	      }), _defineProperty(_fields, 'collection_number', {
	        id: 'dataSaveCollection.call_number',
	        type: 'text',
	        label: 'collection.call_number',
	        readonly: true
	      }), _defineProperty(_fields, 'collection_print', {
	        id: 'dataSaveCollection.collection_print',
	        type: 'dropdown',
	        label: 'collection.print_file',
	        list: [{ value: '1', text: 'รอบ 1 ด่วนที่สุด' }, { value: '2', text: 'รอบ 2 สำนักงานบังคับคดี' }]
	      }), _defineProperty(_fields, 'collection_send', {
	        id: 'dataSaveCollection.collection_send',
	        type: 'dropdown',
	        label: 'collection.send_print',
	        list: [{ value: '1', text: 'ลูกค้า' }, { value: '2', text: 'ผู้ค้ำประกัน' }]
	      }), _defineProperty(_fields, 'collection_statusca', {
	        id: 'dataSaveCollection.collection_statusca',
	        type: 'dropdown',
	        label: 'collection.statusca',
	        list: [{ value: 'Y', text: 'แจ้งหนีหนี้ CA' }, { value: 'N', text: 'ยกเลิกแจ้งหนีหนี้ CA' }]
	      }), _defineProperty(_fields, 'collection_call_remark', {
	        id: 'dataSaveCollection.call_remark',
	        label: 'collection.call_remark',
	        type: 'text',
	        required: true
	      }), _defineProperty(_fields, 'collection_call_name', {
	        id: 'dataSaveCollection.call_name',
	        label: 'collection.call_name',
	        type: 'text',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_contract_code', {
	        id: 'code',
	        type: 'text',
	        label: 'closeca.contract_code',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_sell_id', {
	        id: 'sell_id',
	        type: 'text',
	        label: 'closeca.sell_id',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_sign_date', {
	        id: 'sign_date',
	        type: 'text',
	        label: 'closeca.sign_date',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_date', {
	        id: 'dataSaveCloseCA.closeca_date',
	        type: 'date',
	        label: 'closeca.closeca_date'
	      }), _defineProperty(_fields, 'closeca_serial', {
	        id: 'product_serial',
	        type: 'text',
	        label: 'closeca.product_serial',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_product', {
	        id: 'product_detail',
	        type: 'text',
	        label: 'closeca.product_detail',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_nationid', {
	        id: 'customer.nationid',
	        type: 'text',
	        label: 'closeca.nationid',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_cus_name', {
	        id: 'customer.fullname',
	        type: 'text',
	        label: 'closeca.cus_name',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_totalprice', {
	        id: 'total_price',
	        type: 'text',
	        label: 'closeca.total_price',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_cost', {
	        id: 'cost',
	        type: 'text',
	        label: 'closeca.cost',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_new_cost', {
	        id: 'new_cost',
	        type: 'text',
	        label: 'closeca.new_cost',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_installcost', {
	        id: 'dataSaveCloseCA.install_cost',
	        type: 'text',
	        label: 'closeca.install_cost'
	      }), _defineProperty(_fields, 'closeca_fee', {
	        id: 'fee',
	        type: 'text',
	        label: 'closeca.fee',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_totalpaid', {
	        id: 'total_paid',
	        type: 'text',
	        label: 'closeca.total_paid',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_profit_lost', {
	        id: 'closeca_profit_lost',
	        type: 'text',
	        label: 'closeca.profit_lost',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_overday', {
	        id: 'over_day',
	        type: 'text',
	        label: 'closeca.over_day',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_lastpaid', {
	        id: 'last_paid',
	        type: 'text',
	        label: 'closeca.last_paid',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_remark', {
	        id: 'dataSaveCloseCA.closeca_remark',
	        type: 'text',
	        label: 'closeca.closeca_remark'
	      }), _defineProperty(_fields, 'closeca_staff_percent', {
	        id: 'dataSaveCloseCA.closeca_staff_percent',
	        type: 'text',
	        label: 'closeca.closeca_staff_percent'
	      }), _defineProperty(_fields, 'closeca_staff_amount', {
	        id: 'dataSaveCloseCA.closeca_staff_amount',
	        type: 'text',
	        label: 'closeca.closeca_staff_amount',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_percent', {
	        id: 'dataSaveCloseCA.closeca_percent',
	        type: 'text',
	        label: 'closeca.closeca_percent',
	        readonly: true
	      }), _defineProperty(_fields, 'closeca_amount', {
	        id: 'dataSaveCloseCA.closeca_amount',
	        type: 'text',
	        label: 'closeca.closeca_amount',
	        readonly: true
	      }), _fields),
	      termFields: [{ name: 'term_num', type: 'number', label: 'contract.term.num', readonly: true, width: 40 }, { name: 'due_date', type: 'date', label: 'contract.term.due_date', width: 120, render: function render(row) {
	          return tr.localize(new Date(row.due_date), { type: 'date', format: 'short' });
	        } }, { name: 'due_amount', type: 'number', label: 'contract.term.due_amount', width: 96, className: 'right', render: function render(row) {
	          return helper.numberFormat(parseFloat(row.due_amount), 2);
	        } }, { name: 'paid_amount', type: 'number', label: 'contract.term.paid_amount', width: 96, className: 'right', render: function render(row) {
	          return helper.numberFormat(parseFloat(row.paid_amount), 2);
	        } }, { name: 'paid_date', type: 'date', label: 'contract.term.paid_date', width: 88, render: function render(row) {
	          if (row.paid_date == '0000-00-00') {
	            return '';
	          }
	          return tr.localize(new Date(row.paid_date), { type: 'date', format: 'short' });
	        } }, { name: 'term_status', label: 'contract.term.term_status', width: 160, render: function render(row) {
	          return tr.translate('contract.term.term_status_' + row.term_status);
	        } }, { name: 'ref_payment_codes', label: 'contract.term.ref_code', render: function render(row) {
	          return row.ref_payment_codes;
	        } } //,
	      // {name:'due_status', label:'contract.term.due_status', render:function(row) {
	      //   return row.due_status;
	      // }}
	      ],
	      return_detail: [{ name: 'rownum', type: 'number', label: 'close_return.return_detail.num', readonly: true, width: 40 }, { name: 'product', label: 'close_return.return_detail.product', width: 150, render: function render(row) {
	          return row.product;
	        } }, { name: 'serial', label: 'close_return.return_detail.serial', width: 120, render: function render(row) {
	          return row.serial;
	        } }, { name: 'oldcost', type: 'number', label: 'close_return.return_detail.oldcost', width: 80, className: 'right', render: function render(row) {
	          return helper.numberFormat(parseFloat(row.newcost), 2);
	        } }],
	      collection: [{ name: 'rownum', type: 'number', label: 'collection.collection_list.num', readonly: true, width: 40, render: function render(row, i) {
	          return i + 1;
	        } }, { name: 'system_date', label: 'collection.collection_list.call_date', width: 150, render: function render(row) {
	          return tr.localize(new Date(row.system_date), { type: 'date', format: 'short' });
	        } }, { name: 'call_type', label: 'collection.collection_list.call_type', width: 150, render: function render(row) {
	          return row.call_type;
	        } }, { name: 'call_number', label: 'collection.collection_list.call_number', width: 120, render: function render(row) {
	          return row.call_number;
	        } }, { name: 'due_date', label: 'collection.collection_list.due_date', width: 150, render: function render(row) {
	          return tr.localize(new Date(row.due_date), { type: 'date', format: 'short' });
	        } }, { name: 'call_remark', type: 'number', label: 'collection.collection_list.call_remark', width: 150, render: function render(row) {
	          return React.createElement(
	            'div',
	            { title: row.call_remark },
	            row.call_remark
	          );
	        } }, { name: 'display_name', type: 'number', label: 'collection.collection_list.staff_name', width: 80, className: 'center', render: function render(row) {
	          return row.display_name;
	        } }],
	      printCollection: {
	        id: id,
	        sendto: '1'
	      },
	      closeca_staffname: {
	        id: 'dataSaveCloseCA.closeca_staff',
	        label: 'closeca.closeca_staffname',
	        list: []
	      },
	      closeca_effective: {
	        id: 'dataSaveCloseCA.closeca_effective',
	        label: 'closeca.closeca_effective',
	        list: []
	      }
	    };
	  },

	  changeContract: function changeContract(id) {
	    actions.getById(id);
	  },

	  onSaveDoneAction: function onSaveDoneAction() {
	    console.log('success');
	    toasterActions.pop({
	      type: 'success',
	      message: 'result.save.ok'
	    });
	  },

	  onSaveErrorAction: function onSaveErrorAction() {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.save.error'
	    });
	  },

	  onGetCloseReturnDoneAction: function onGetCloseReturnDoneAction(data) {
	    console.log('onGetCloseReturnDoneAction=', data);
	    this.setState({
	      return: data.return[0],
	      returndetail: data.return_detail,
	      stock_shop: data.stock_shop[0]
	    });
	  },

	  onGetByIdDoneAction: function onGetByIdDoneAction(data) {
	    var listRef = data.refContract.map(function (row) {
	      if (row.id != this.state.id && this.state.flagClose == "Y") {
	        return "";
	      }

	      // console.log('Row:',row,'rowID :',row.id,'ID :',this.state.id,'FlagClose',this.state.flagClose);
	      if (row.id != this.state.id && this.state.flagClose == "Y") {
	        return "";
	      }
	      return React.createElement(
	        'li',
	        { key: row.id, className: row.id == this.state.id ? 'selected' : null, onClick: function () {
	            this.changeContract(row.id);
	          }.bind(this) },
	        React.createElement(
	          'div',
	          { style: { fontSize: '95%' } },
	          formatContractCode(row.code)
	        ),
	        React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { className: 'flex can-grow' },
	            React.createElement('div', { className: 'flaticon-user157 tiny no-shrink' }),
	            React.createElement(T, { content: 'contract.' + row.role, component: 'nobr', className: 'status-text can-grow' })
	          ),
	          React.createElement(
	            'div',
	            { className: 'flex status_' + row.current_status, style: { width: '72px' } },
	            React.createElement('div', { className: 'flaticon-circle108 tiny no-shrink' }),
	            React.createElement(T, { content: 'contract.current_status.' + row.current_status, component: 'div', className: 'status-text' })
	          )
	        )
	      );
	    }.bind(this));
	    infoPanelActions.show(this.state.pageBack, React.createElement(
	      'div',
	      { className: 'flex can-grow', style: { flexDirection: 'column' } },
	      React.createElement(
	        'ul',
	        { style: { overflowY: 'auto' }, className: 'contract-list can-grow' },
	        listRef
	      ),
	      React.createElement(
	        'div',
	        { className: 'no-shrink', style: { borderTop: '2px solid blue' } },
	        React.createElement(
	          'ul',
	          null,
	          React.createElement(
	            'li',
	            null,
	            React.createElement(
	              'a',
	              { href: '#', className: 'flex' },
	              React.createElement('span', { className: 'flaticon-two375' }),
	              React.createElement(T, { content: 'contract.view.summary', style: { paddingLeft: '8px' } })
	            )
	          ),
	          React.createElement(
	            'li',
	            null,
	            React.createElement(
	              'a',
	              { href: '#', className: 'flex' },
	              React.createElement('span', { className: 'flaticon-two375' }),
	              React.createElement(T, { content: 'contract.view.customer', style: { paddingLeft: '8px' } })
	            )
	          ),
	          React.createElement(
	            'li',
	            null,
	            React.createElement(
	              'a',
	              { href: '#', className: 'flex' },
	              React.createElement('span', { className: 'flaticon-two375' }),
	              React.createElement(T, { content: 'contract.view.payment', style: { paddingLeft: '8px' } })
	            )
	          ),
	          React.createElement(
	            'li',
	            null,
	            React.createElement(
	              'a',
	              { href: '#', className: 'flex' },
	              React.createElement('span', { className: 'flaticon-two375' }),
	              React.createElement(T, { content: 'contract.view.call', style: { paddingLeft: '8px' } })
	            )
	          )
	        )
	      )
	    ));
	    if (data.contract.customer.idcard_info) {
	      data.contract.customer.idcard_info = JSON.parse(data.contract.customer.idcard_info);
	    } else {
	      data.contract.customer.idcard_info = {};
	    }
	    if (data.contract.co.idcard_info) {
	      data.contract.co.idcard_info = JSON.parse(data.contract.co.idcard_info);
	    } else {
	      data.contract.co.idcard_info = {};
	    }
	    if (!data.contract.address.HOME) {
	      data.contract.address.HOME = {};
	    }
	    if (!data.contract.address.WORK) {
	      data.contract.address.WORK = {};
	    }
	    if (!data.contract.address.COHOME) {
	      data.contract.address.COHOME = {};
	    }
	    data.contract.customer.age = calcAge(data.contract.customer.birth);
	    data.contract.cardAddr = data.contract.address.CARD;
	    data.contract.customerAddr = data.contract.address.HOME;
	    data.contract.workAddr = data.contract.address.WORK;
	    data.contract.coCardAddr = data.contract.address.COCARD;
	    data.contract.coAddr = data.contract.address.COHOME;
	    data.contract.coWorkAddr = data.contract.address.COWORK;
	    data.contract.profit_loss = 0;
	    data.contract.dataSaveCollection = this.state.contract.dataSaveCollection;

	    //console.log(data);
	    data.contract.dataSaveCloseCA = this.state.contract.dataSaveCloseCA;
	    data.contract.dataSaveCloseCA.over_day = data.contract.closeca.over_day;
	    data.contract.dataSaveCloseCA.last_paid = data.contract.closeca.last_paid;
	    data.contract.dataSaveCloseCA.id = data.contract.id;
	    data.contract.dataSaveCloseCA.closeca_staff = data.contract.closeca_staff == null ? data.contract.finance_staff_id : data.contract.closeca_staff;
	    data.contract.dataSaveCloseCA.closeca_remark = data.contract.closeca_remark;
	    data.contract.dataSaveCloseCA.install_cost = data.contract.install_cost;
	    data.contract.dataSaveCloseCA.closeca_staff_percent = data.contract.closeca_staff_percent;
	    data.contract.dataSaveCloseCA.closeca_staff_amount = data.contract.closeca_staff_amount;
	    data.contract.dataSaveCloseCA.closeca_percent = data.contract.closeca_percent;
	    data.contract.dataSaveCloseCA.closeca_amount = data.contract.closeca_amount;
	    data.contract.dataSaveCloseCA.install_cost = data.contract.install_cost;
	    data.contract.dataSaveCloseCA.closeca_date = data.contract.closeca_date == '0000-00-00' ? data.contract.dataSaveCloseCA.closeca_date : data.contract.closeca_date;
	    data.contract.dataSaveCloseCA.closeca_effective = data.contract.closeca_effective == '' || data.contract.closeca_effective == '0000-00-00' ? data.contract.dataSaveCloseCA.closeca_effective : data.contract.closeca_effective;

	    var _CloseProfitlost = parseFloat(data.contract.total_paid) - (parseFloat(data.contract.install_cost) + parseFloat(data.contract.fee) + parseFloat(data.contract.cost));

	    data.contract.dataSaveCloseCA.closeca_profit_lost = _CloseProfitlost;

	    for (var i = 0; i <= data.paymentTerm.length - 1; i++) {
	      if (data.paymentTerm[i].term_status != 'WAIT') {
	        this.state.fields.payment_month.readonly = true;
	        this.state.fields.payment_on_day.readonly = true;
	        break;
	      }
	    }

	    data.contract.start_date = data.paymentTerm[0].due_date;
	    var path = window.location.protocol + '//' + window.location.host + '/idcard/photo';

	    var co_id = data.contract.co.idcard_info.nationid,
	        photoCoIDCard = '';
	    if (!co_id || co_id.length != 13) {
	      photoCoIDCard = path + '.png';
	    } else {
	      photoCoIDCard = path + '/' + co_id.substr(-1) + '/' + co_id.substr(-2, 1) + '/' + co_id + '.jpg';
	    }

	    var cus_id = data.contract.customer.idcard_info.nationid,
	        photoCusIDCard = '';
	    if (!cus_id || cus_id.length != 13) {
	      photoCusIDCard = path + '.png';
	    } else {
	      photoCusIDCard = path + '/' + cus_id.substr(-1) + '/' + cus_id.substr(-2, 1) + '/' + cus_id + '.jpg';
	    }

	    data.contract.permission_save = acl.hasMAcl(['M_INSTALLMENT_CONTRACT_CLOSE_CA']);

	    //data.contract.co.mobile = this.state.contract.co.mobile;
	    console.log('data=', data.contract);
	    this.setState({
	      coIDCardPhoto: photoCoIDCard,
	      cusIDCardPhoto: photoCusIDCard,
	      id: data.contract.id,
	      contract: data.contract,
	      paymentTerm: data.paymentTerm,
	      fields: this.state.fields
	    });
	    console.log(this.state.paymentTerm);
	    if (this.state.flagClose == 'Y') {
	      console.log('sendparam=', this.state.contract);
	      actions.getCloseReturn(this.state.contract);
	    }

	    this.calculateCloseCA();
	  },

	  onGetSellInfoDoneAction: function onGetSellInfoDoneAction(data) {
	    if (data == null) {
	      return;
	    }

	    var sellInfo = data.sell;
	    var name = sellInfo.company_name.trim().split(/\s+/g).map(function (item) {
	      return item.trim();
	    });

	    this.state.data.code = data.barcode.length > 0 ? data.barcode[0] : '';
	    this.state.data.ref_code = sellInfo.contract_ref;
	    this.state.data.sell_id = sellInfo.id;
	    //console.log(this.state.data.sell_id);
	    this.state.data.sell_date = sellInfo.sell_date.substr(0, 10);
	    this.state.data.sign_date = sellInfo.sell_date.substr(0, 10);
	    this.state.data.shop_code = sellInfo.shop_code;
	    this.state.data.customer.ref_id = sellInfo.company_id;
	    var tmp = sellInfo.company_code.trim();
	    if (tmp.length == 13) {
	      this.state.data.customer.idcard = tmp;
	    } else {
	      this.state.data.customer.mobile = tmp;
	    }

	    if (name.length == 1) {
	      this.state.data.customer.firstname = name[0];
	    } else if (name.length == 2) {
	      this.state.data.customer.firstname = name[0];
	      this.state.data.customer.lastname = name[1];
	    } else if (name[0] == 'คุณ') {
	      this.state.data.customer.prename = name[0];
	      this.state.data.customer.firstname = name[1];
	      this.state.data.customer.lastname = name[2];
	    } else if (name.length >= 3) {
	      this.state.data.customer.firstname = name[0];
	      name.shift();
	      this.state.data.customer.lastname = name.join(' ');
	    }
	    this.state.data.product_detail = sellInfo.product_description;
	    this.state.data.product_serial = sellInfo.product_serial;
	    this.state.data.payment_down = parseFloat(sellInfo.down_payment);
	    this.state.data.cost = parseFloat(sellInfo.cost);
	    this.state.data.payment_price = parseFloat(sellInfo.remain_price);

	    var d = new Date(sellInfo.sell_date);
	    this.state.data.payment_on_day = d.getDate();

	    // guess month
	    for (var i = 12; i >= 1; i--) {
	      if (this.state.data.payment_price == Math.floor(this.state.data.payment_price / i) * i) {
	        this.state.data.payment_month = i;
	        break;
	      }
	    }
	    if (this.state.data.payment_month == 1) {
	      this.state.data.payment_month = 12;
	    }

	    this.state.data.payment_per_month = Math.floor(this.state.data.payment_price / this.state.data.payment_month);

	    if (data.person != null) {
	      this.state.data.customer.prename = data.person.prename;
	      this.state.data.customer.birth = data.person.birth.substr(0, 10);
	      this.state.data.customer.gender = data.person.gender;
	      this.state.data.customer.marital_status = data.person.marital_status;
	      this.state.data.customer.mobile = data.person.mobile;
	      this.state.data.customer.email = data.person.email;
	      this.state.data.customer.lineid = data.person.lineid;
	    }

	    if (data.address.CARD != null) {
	      this.state.data.cardAddr = {
	        addr1: data.address.CARD.addr1,
	        addr2: data.address.CARD.addr2,
	        tambon: data.address.CARD.tambon,
	        amphur: data.address.CARD.amphur,
	        province: data.address.CARD.province,
	        zipcode: data.address.CARD.zipcode,
	        tel: data.address.CARD.tel
	      };
	    }
	    if (data.address.HOME != null) {
	      this.state.data.customerAddr = {
	        addr1: data.address.HOME.addr1,
	        addr2: data.address.HOME.addr2,
	        tambon: data.address.HOME.tambon,
	        amphur: data.address.HOME.amphur,
	        province: data.address.HOME.province,
	        zipcode: data.address.HOME.zipcode,
	        tel: data.address.HOME.tel
	      };
	    }

	    if (data.address.WORK != null) {
	      this.state.data.workAddr = {
	        addr1: data.address.WORK.addr1,
	        addr2: data.address.WORK.addr2,
	        tambon: data.address.WORK.tambon,
	        amphur: data.address.WORK.amphur,
	        province: data.address.WORK.province,
	        zipcode: data.address.WORK.zipcode,
	        tel: data.address.WORK.tel
	      };
	    }

	    if (data.address.COCARD != null) {
	      this.state.data.coCardAddr = {
	        addr1: data.address.CARD.addr1,
	        addr2: data.address.CARD.addr2,
	        tambon: data.address.CARD.tambon,
	        amphur: data.address.CARD.amphur,
	        province: data.address.CARD.province,
	        zipcode: data.address.CARD.zipcode,
	        tel: data.address.CARD.tel
	      };
	    }
	    if (data.address.COHOME != null) {
	      this.state.data.coAddr = {
	        addr1: data.address.HOME.addr1,
	        addr2: data.address.HOME.addr2,
	        tambon: data.address.HOME.tambon,
	        amphur: data.address.HOME.amphur,
	        province: data.address.HOME.province,
	        zipcode: data.address.HOME.zipcode,
	        tel: data.address.HOME.tel
	      };
	    }

	    if (data.address.COWORK != null) {
	      this.state.data.coWorkAddr = {
	        addr1: data.address.WORK.addr1,
	        addr2: data.address.WORK.addr2,
	        tambon: data.address.WORK.tambon,
	        amphur: data.address.WORK.amphur,
	        province: data.address.WORK.province,
	        zipcode: data.address.WORK.zipcode,
	        tel: data.address.WORK.tel
	      };
	    }

	    this.state.fields.code.list = data.barcode.map(function (item) {
	      return { value: item, text: item };
	    });

	    sellInfo.sell_date = sellInfo.sell_date.substr(0, 10);
	    sellInfo.price = helper.numberFormat(sellInfo.price, 2);
	    sellInfo.cost = helper.numberFormat(sellInfo.cost, 2);
	    sellInfo.main_price = helper.numberFormat(sellInfo.main_price, 2);
	    sellInfo.down_payment = helper.numberFormat(sellInfo.down_payment, 2);
	    sellInfo.remain_price = helper.numberFormat(sellInfo.remain_price, 2);

	    this.setState({
	      data: this.state.data,
	      sellInfo: sellInfo
	    }, function () {
	      this.doGenPayment(this.state.contract.start_date);
	    }.bind(this));
	  },

	  onReadIDCardDoneAction: function onReadIDCardDoneAction(info) {
	    this.state.data[this.currentCard] = info;
	    var addr = '';
	    if (this.currentCard == 'cusIDCard') {
	      addr = 'customerAddr';
	      this.state.data.customer.nationid = info.nationid;
	      this.state.data.customer.prename = info.prenameTH;
	      this.state.data.customer.firstname = info.firstnameTH;
	      this.state.data.customer.lastname = info.lastnameTH;
	      this.state.data.customer.birth = info.birth;
	      this.state.data.customer.gender = info.gender;
	      this.state.data.customer.age = calcAge(info.birth);
	    } else if (this.currentCard == 'coIDCard') {
	      addr = 'coAddr';
	      this.state.data.co.nationid = info.nationid;
	      this.state.data.co.prename = info.prenameTH;
	      this.state.data.co.firstname = info.firstnameTH;
	      this.state.data.co.lastname = info.lastnameTH;
	      this.state.data.co.age = calcAge(info.birth);
	    }
	    if (!this.state.data[addr].addr1) {
	      var tmp = [];
	      if (info.address.houseNo) {
	        tmp.push(info.address.houseNo);
	      }
	      if (info.address.villageNo) {
	        tmp.push(info.villageNo);
	      }
	      this.state.data[addr].addr1 = tmp.join(' ');

	      tmp = [];
	      if (info.address.lane) {
	        tmp.push(info.address.lane);
	      }
	      if (info.address.road) {
	        tmp.push(info.address.road);
	      }
	      if (info.address.unknown) {
	        tmp.push(info.address.unknown);
	      }
	      this.state.data[addr].addr2 = tmp.join(' ');

	      // tmp = info.address.tambon.substr(0,4);
	      // if (tmp=='ตำบล' || tmp=='แขวง') {
	      //   this.state.data[addr].tambon = info.address.tambon.substr(4);
	      // } else {
	      this.state.data[addr].tambon = info.address.tambon;
	      // }

	      this.state.data[addr].amphur = info.address.amphur;
	      this.state.data[addr].province = info.address.province;
	    }

	    var obj = {
	      data: this.state.data
	    };
	    obj[this.currentCard + 'PhotoLoading'] = true;
	    this.setState(obj);
	    systemActions.readIDCardPhoto();
	  },

	  onReadIDCardErrorAction: function onReadIDCardErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.idcard.error'
	    });
	  },

	  onReadIDCardPhotoDoneAction: function onReadIDCardPhotoDoneAction(info) {
	    var obj = {};

	    obj[this.currentCard + 'Photo'] = info.photoPath;
	    obj[this.currentCard + 'PhotoLoading'] = false;
	    obj[(this.currentCard == 'cusIDCard' ? 'customer' : 'co') + 'Photo'] = '';
	    this.setState(obj);
	  },

	  onReadIDCardPhotoErrorAction: function onReadIDCardPhotoErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.idcard.photo_error'
	    });
	  },

	  onSaveNewDoneAction: function onSaveNewDoneAction() {
	    toasterActions.pop({
	      type: 'success',
	      message: 'result.save.ok'
	    });
	  },

	  onSaveNewErrorAction: function onSaveNewErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: e
	    });
	  },

	  doContractSave: function doContractSave() {
	    // check required
	    console.log('contractSave :', this.state);
	    var err = [];
	    if (this.state.contract.customer.nationid.length != 13) {
	      err.push('contract.error.nationid_invalid');
	    }
	    if (!this.state.contract.customer.firstname) {
	      err.push('contract.error.customer_invalid');
	    }
	    if (!this.state.contract.customer.lastname) {
	      err.push('contract.error.customer_invalid');
	    }
	    if (this.state.contract.co.nationid.length != 13) {
	      err.push('contract.error.co_nationid_invalid');
	    }
	    if (!this.state.contract.co.firstname) {
	      err.push('contract.error.co_firstname_required');
	    }
	    if (!this.state.contract.co.lastname) {
	      err.push('contract.error.co_lastname_required');
	    }

	    if (err.length > 0) {
	      dialogActions.show({
	        title: 'ข้อมูลไม่ถูกต้อง',
	        content: React.createElement(
	          'ul',
	          null,
	          err.map(function (item, i) {
	            return React.createElement(
	              'li',
	              { key: i },
	              item
	            );
	          }.bind(this))
	        ),
	        actions: [{ id: 'ok', icon: 'check52', label: 'action.close' }]
	      }, function (id) {});
	      return;
	    }

	    dialogActions.show({
	      title: 'ยืนยัน',
	      content: React.createElement(
	        'ul',
	        null,
	        err.map(function (item, i) {
	          return React.createElement(
	            'li',
	            { key: i },
	            item
	          );
	        }.bind(this))
	      ),
	      actions: [{ id: 'save', icon: 'check52', label: 'action.save' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	    }, function (isCancel, id) {
	      if (isCancel || id == 'cancel') {
	        return;
	      }
	      var obj = {
	        contract: this.state.contract,
	        paymentTerm: this.state.paymentTerm,
	        genPaymentTerm: this.state.genPaymentTerm
	      };
	      obj.flagClose = 'N';
	      if (this.state.flagClose == 'Y') {
	        console.log('save=', this.state.stock_shop);
	        obj.stock_shop = this.state.stock_shop;
	        obj.stock_shop.new_cost = this.state.contract.new_cost;
	        //obj.status = this.state.return.return_status;
	        obj.flagClose = this.state.flagClose;
	        obj.return = this.state.return;
	      }
	      //console.log('jacktest=',obj);
	      actions.save(obj);
	    }.bind(this));
	  },

	  scrollTo: function scrollTo(e, id) {
	    e.preventDefault();
	    if (!this.refs[id]) {
	      return;
	    }
	    this.refs[id].getDOMNode().scrollIntoView();
	  },

	  componentDidMount: function componentDidMount() {
	    console.log('componentDidMount');
	    infoPanelActions.show('installment.contract.list', null);
	    actions.getById(this.state.id);
	    actions.getListCollection(this.state.id);

	    console.log('id:', this.state.id);
	    actions.getMobileNumber({ id: this.state.id, type: 'โทรหาผู้ซื้อ' });
	    actions.closeCaStaffList(this.state.id);
	    this.genCloseCAMouth();
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  // handleChange: function(id, value) {
	  //   var tmp = id.split('.');
	  //   if (typeof value === 'string') {
	  //     value = value.trim();
	  //   }
	  //   if (tmp.length==2) {
	  //     this.state.contract[tmp[0]][tmp[1]] = value;
	  //   } else {
	  //
	  //     this.state.contract[id] = value;
	  //   }
	  //
	  //   // calc age
	  //   if (id==='customer.birth') {
	  //     this.state.contract.customer.age = calcAge(value);
	  //   }
	  //
	  //   var genPayment = false;
	  //   if (id==='payment_month') {
	  //     var month = parseInt(value);
	  //     var price = parseFloat(this.state.contract.payment_price);
	  //     if (month > 0) {
	  //       var per_month = Math.floor(price / month);
	  //       this.state.contract['payment_per_month'] = per_month;
	  //     }
	  //     genPayment = true;
	  //   }
	  //   if (id==='payment_per_month' || id==='payment_on_day') {
	  //     genPayment = true;
	  //   }
	  //
	  //   if (id==='customer.birth') {
	  //     this.state.contract.customer.age = calcAge(value);
	  //   }
	  //
	  //   console.log('updateState');
	  //   this.setState({
	  //     contract: this.state.contract
	  //   });
	  // },

	  handleTabClick: function handleTabClick(id) {
	    this.setState({
	      currentTab: id
	    });
	  },

	  handleIDCardChange: function handleIDCardChange(card, data) {
	    //    console.log(data);
	    if (data.photoData) {
	      //      console.log('photoData', data.photoData);
	      if (card == 'customer') {
	        this.customerPhotoData = data.photoData;
	      } else {
	        this.coPhotoData = data.photoData;
	      }
	    }
	  },

	  doGenPayment: function doGenPayment(_mm) {
	    var payment = [];
	    var amount = Math.floor(this.state.contract.payment_per_month);
	    var total = 0;
	    var month = parseInt(this.state.contract.payment_month);
	    var today = new Date(_mm);
	    var mm = today.getMonth();
	    var sellID = this.state.contract.sell_id;
	    //console.log(sellID);
	    var down_price = this.state.contract.down_payment;
	    var cost = this.state.contract.cost;
	    var install_cost = this.state.contract.install_cost;
	    var fee = this.state.contract.fee;
	    var cost_term = parseFloat((cost + install_cost + fee - down_price) / month);

	    var day = parseInt(this.state.contract.payment_on_day);

	    for (var i = 0; i < month; i++) {
	      if (i == month - 1) {
	        amount = parseFloat(this.state.contract.payment_price) - total;
	      }
	      var date = new Date(today.getFullYear(), mm + i, day);
	      if (date.getMonth() != (mm + i) % 12) {
	        date = new Date(today.getFullYear(), mm + i + 1, 0);
	      }
	      payment.push({
	        term_num: i + 1,
	        due_date: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2) + '-' + ('0' + date.getDate()).substr(-2),
	        due_amount: amount,
	        paid_amount: '0',
	        paid_date: '0000-00-00',
	        term_status: 'WAIT',
	        ref_payment_codes: '',
	        sell_id: sellID,
	        cost_term: cost_term
	      });
	      total += amount;
	    }

	    this.setState({
	      paymentTerm: payment
	    });
	  },

	  readIDCard: function readIDCard(card) {
	    //    console.log('read id card');
	    this.currentCard = card;
	    this.setState({
	      currentTab: card == 'cusIDCard' ? 'customer_status' : 'co_status'
	    }, function () {
	      systemActions.readIDCard();
	    });
	  },

	  paymentTableChange: function paymentTableChange(row_i, field_id, value) {
	    if (row_i == this.state.paymentData.length - 1 && field_id == 'amount') {
	      return;
	    }
	    if (field_id == 'amount') {
	      // calculate last payment
	      var old = this.state.paymentData[row_i]['amount'];
	      var new_value = parseFloat(value);
	      var diff = new_value - old;
	      this.state.paymentData[row_i]['amount'] = new_value;
	      this.state.paymentData[this.state.paymentData.length - 1]['amount'] -= diff;
	    } else {
	      this.state.paymentData[row_i][field_id] = value;
	    }

	    this.setState({
	      paymentData: this.state.paymentData
	    });
	  },

	  handleChange: function handleChange(id, value) {
	    var tmp = id.split('.');
	    if (tmp.length == 2) {
	      this.state.contract[tmp[0]][tmp[1]] = value;
	    } else {
	      this.state.contract[id] = value;
	    }
	    // calc age
	    if (id === 'customer.birth') {
	      this.state.contract.customer.age = calcAge(value);
	    }

	    if (id === 'dataSaveCloseCA.install_cost') {
	      this.state.contract.customer.age = calcAge(value);
	    }

	    if (id === 'dataSaveCloseCA.install_cost' || id === 'dataSaveCloseCA.closeca_staff_percent') {
	      this.calculateCloseCA();
	    }

	    this.state.data = this.state.data;

	    var genPayment = false;

	    if (id === 'payment_month') {
	      var month = parseInt(value);
	      var price = parseFloat(this.state.contract.payment_price);
	      if (month > 0) {
	        var per_month = Math.floor(price / month);
	        this.state.contract['payment_per_month'] = per_month;
	      }
	      this.state.contract.fee = month <= 3 ? 100 : 200;
	      genPayment = true;
	    }

	    if (id === 'payment_on_day') {
	      genPayment = true;
	    }

	    this.setState({
	      contract: this.state.contract,
	      genPaymentTerm: genPayment
	    }, function () {
	      if (genPayment) {
	        this.doGenPayment(this.state.contract.start_date);
	      }
	    }.bind(this));
	  },

	  handleTermChange: function handleTermChange(row_i, field_id, value) {
	    if (row_i == this.state.paymentTerm.length - 1 && field_id == 'due_amount') {
	      return;
	    }
	    if (this.state.paymentTerm[row_i]['term_status'] != 'WAIT') {
	      return;
	    }
	    if (field_id == 'due_amount') {
	      // calculate last payment
	      var old = this.state.paymentTerm[row_i]['due_amount'];
	      var new_value = parseFloat(value);
	      var diff = new_value - old;
	      this.state.paymentTerm[row_i]['due_amount'] = new_value;
	      this.state.paymentTerm[this.state.paymentTerm.length - 1]['due_amount'] -= diff;
	    } else {
	      this.state.paymentTerm[row_i][field_id] = value;
	    }

	    this.setState({
	      paymentTerm: this.state.paymentTerm
	    });
	  },

	  toggleExpand: function toggleExpand(section) {

	    this.state.expand[section] = !this.state.expand[section];
	    this.setState({
	      expand: this.state.expand
	    });
	  },

	  calProfitLost: function calProfitLost() {
	    console.log(this.state.expand.close_return);
	    var _NewCost = 0;
	    console.log('new_cost :', this.state.contract.new_cost);
	    if (this.state.contract.new_cost != '') {
	      _NewCost = parseFloat(this.state.contract.new_cost);
	    }
	    //var _NewCost = parseFloat(this.state.contract.new_cost);
	    var _Balance = parseFloat(this.state.contract.cost - this.state.contract.total_paid);
	    var _Fee = parseFloat(this.state.contract.fee);
	    var _IntallCost = parseFloat(this.state.contract.install_cost);

	    this.state.contract.profit_loss = _NewCost - (_Balance + _Fee + _IntallCost);

	    this.setState({
	      contract: this.state.contract
	    });
	  },

	  doCollectionSave: function doCollectionSave() {

	    if (this.state.contract.dataSaveCollection.call_number == '' || this.state.contract.dataSaveCollection.call_remark == '') {
	      toasterActions.pop({
	        type: 'warning',
	        message: 'result.save.error'
	      });
	    } else {
	      actions.saveCollection(this.state.contract.dataSaveCollection);
	    }
	  },

	  onSaveCollectionDoneAction: function onSaveCollectionDoneAction() {

	    toasterActions.pop({
	      type: 'success',
	      message: 'result.save.ok'
	    });
	    this.state.contract.dataSaveCollection.call_remark = '';

	    actions.getListCollection(this.state.id);
	  },

	  onGetListCollectionDoneAction: function onGetListCollectionDoneAction(data) {

	    this.setState({
	      dataCollection: data.collection
	    });
	  },

	  onGetMobileNumberDoneAction: function onGetMobileNumberDoneAction(data) {

	    // this.state.fields.collection_number.list = data.mobilenumber.map(function(row) {
	    //   return {
	    //     value: row.mobile,
	    //     text: row.mobile
	    //   }
	    // });
	    //
	    // console.log('mobile :',data);
	    this.state.contract.dataSaveCollection.call_number = data.mobilenumber[0].number;
	    this.state.contract.dataSaveCollection.call_name = data.mobilenumber[0].fullname;

	    this.setState({
	      contract: this.state.contract
	    });
	  },

	  handleListChange: function handleListChange(id, value) {

	    var tmp = id.split('.');
	    if (tmp.length == 2) {
	      this.state.contract[tmp[0]][tmp[1]] = value;
	    } else {
	      this.state.contract[id] = value;
	    }

	    this.setState({
	      contract: this.state.contract
	    });

	    if (id === 'dataSaveCollection.call_type') {
	      if (value == 'โทรหาผู้ซื้ออื่น ๆ' || value == 'โทรหาผู้ค้ำอื่น ๆ') {
	        this.state.fields.collection_number.readonly = false;
	      } else {
	        this.state.fields.collection_number.readonly = true;
	        actions.getMobileNumber({ id: this.state.id, type: value });
	      }
	      this.state.fields = this.state.fields;
	      this.setState({
	        fields: this.state.fields
	      });
	    }
	  },

	  onPrintCollectionReportDoneAction: function onPrintCollectionReportDoneAction(data) {
	    window.open(data.pdfFile);
	  },

	  onPrintCollectionReport: function onPrintCollectionReport() {

	    this.state.printCollection.id = this.state.id;
	    this.state.printCollection.sendto = this.state.contract.dataSaveCollection.collection_send;
	    //console.log(this.state.printCollection);
	    actions.printCollectionReport(this.state.printCollection);
	  },

	  onSaveStatusCa: function onSaveStatusCa() {
	    actions.saveStatusCA(this.state);
	  },

	  onCloseCaStaffListDoneAction: function onCloseCaStaffListDoneAction(data) {
	    this.state.closeca_staffname.list = data.closecastaff.map(function (row) {
	      return {
	        value: row.id,
	        text: row.name
	      };
	    });
	    this.setState({
	      closeca_staffname: this.state.closeca_staffname
	    });
	  },

	  calculateCloseCA: function calculateCloseCA() {
	    //this.state.contract.dataSaveCloseCA = this.state.contract.dataSaveCloseCA
	    var _ProfitLost = parseFloat(this.state.contract.total_paid) - (parseFloat(this.state.contract.dataSaveCloseCA.install_cost) + parseFloat(this.state.contract.fee) + parseFloat(this.state.contract.cost));

	    this.state.contract.dataSaveCloseCA.closeca_profit_lost = _ProfitLost;
	    //var _ProfitLost = parseFloat(this.state.contract.dataSaveCloseCA.closeca_profit_lost);
	    var _StaffPer = parseFloat(this.state.contract.dataSaveCloseCA.closeca_staff_percent);
	    var _StaffAmount = parseFloat(_StaffPer * _ProfitLost / 100);

	    //this.state.contract.dataSaveCloseCA = this.state.contract.dataSaveCloseCA
	    this.state.contract.dataSaveCloseCA.closeca_percent = 100 - _StaffPer;
	    this.state.contract.dataSaveCloseCA.closeca_staff_amount = _StaffAmount * -1;
	    this.state.contract.dataSaveCloseCA.closeca_amount = (_ProfitLost - _StaffAmount) * -1;

	    this.setState({
	      contract: this.state.contract
	    });
	  },

	  genCloseCAMouth: function genCloseCAMouth() {

	    for (i = 0; i < 12; i++) {
	      var today = new Date();
	      today.setMonth(today.getMonth() + i);
	      var _value = today.toJSON().slice(5, 7) + '/' + today.toJSON().slice(0, 4);

	      this.state.closeca_effective.list.push({ value: _value, text: _value });
	    }

	    this.setState({
	      closeca_effective: this.state.closeca_effective
	    });
	  },

	  doCloseCASave: function doCloseCASave() {
	    console.log(this.state.contract.dataSaveCloseCA);
	    actions.saveCloseCa(this.state.contract.dataSaveCloseCA);
	  },

	  onSaveCloseCaDoneAction: function onSaveCloseCaDoneAction() {
	    toasterActions.pop({
	      type: 'success',
	      message: 'result.save.ok'
	    });
	    //this.state.contract.dataSaveCollection.call_remark='';
	    //actions.saveCloseCa(this.state.id);
	  },

	  render: function render() {
	    var fields = this.state.fields;
	    var contract = this.state.contract;
	    var customer = contract.customer || {};
	    var co = contract.co || {};
	    var paymentTerm = this.state.paymentTerm || [];

	    var paymentStatus = paymentTerm.map(function (term) {
	      return React.createElement('li', { key: term.id, className: 'status_' + term.term_status + (term.close_status == 'NORMAL' ? '' : ' ' + term.close_status), title: 'DUE DATE: ' + term.due_date + '\n' + 'PAID DATE: ' + term.paid_date + '\n' + 'DUE AMOUNT: ' + helper.numberFormat(term.due_amount, 2) + '\n' + 'PAID AMOUNT: ' + helper.numberFormat(term.paid_amount, 2) + '\n' + 'STATUS: ' + term.term_status });
	    });

	    //var _photoCard = "//localhost:9001/idcard/photo/" + customer.nationid + ".jpg";

	    var contractSummary = React.createElement(
	      'div',
	      { className: 'contract-section' },
	      React.createElement(
	        'div',
	        { className: 'flex' },
	        React.createElement(
	          'div',
	          { className: 'panel1 no-shrink' },
	          React.createElement('img', { src: this.state.cusIDCardPhoto, style: { width: '80px' } })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel4 flex-v' },
	          React.createElement(
	            'div',
	            { className: 'ellipsis', style: { fontSize: '18pt', height: '40px', lineHeight: '48px' } },
	            customer.fullname
	          ),
	          React.createElement(
	            'div',
	            { className: 'ellipsis' },
	            helper.formatNationID(customer.nationid)
	          ),
	          React.createElement(
	            'div',
	            { className: 'ellipsis' },
	            'ผู้เช่าซื้อร่วม ',
	            co.fullname
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel5 flex-v' },
	          React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { className: 'can-grow', style: { fontSize: '18pt', height: '40px', lineHeight: '48px' } },
	              formatContractCode(contract.code)
	            ),
	            React.createElement(
	              'div',
	              { className: 'can-grow', style: { fontSize: '18pt', height: '40px', lineHeight: '48px', textAlign: 'right', color: statusColor[contract.current_status] } },
	              React.createElement('span', { className: 'flaticon-' + statusIcon[contract.current_status] }),
	              React.createElement(T, { content: 'installment.contract.current_status.' + contract.current_status })
	            )
	          ),
	          React.createElement(
	            'div',
	            null,
	            'เริ่มสัญญา:',
	            React.createElement(
	              'span',
	              { style: { color: 'blue', padding: '0 8px' } },
	              tr.localize(new Date(contract.sign_date), { type: 'date', format: 'long' })
	            ),
	            'งวดสุดท้าย: ',
	            React.createElement(
	              'span',
	              { style: { color: 'blue', padding: '0 8px' } },
	              paymentTerm.length == 0 ? '' : tr.localize(new Date(paymentTerm[paymentTerm.length - 1].due_date), { type: 'date', format: 'long' })
	            )
	          ),
	          React.createElement(
	            'div',
	            null,
	            React.createElement(
	              'ul',
	              { className: 'contract_status2' },
	              paymentStatus
	            )
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'flex' },
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          React.createElement(
	            'div',
	            { className: 'ellipsis blue', style: { fontSize: '18pt', height: '40px', lineHeight: '48px' } },
	            contract.product_detail
	          ),
	          React.createElement(
	            'div',
	            null,
	            'S/N: ',
	            React.createElement(
	              'span',
	              { className: 'blue' },
	              contract.product_serial
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel5 flex' },
	          React.createElement(
	            'div',
	            { className: 'can-grow' },
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ราคาสินค้า'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.total_price, 2)
	                ),
	                ' บาท'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ดาวน์'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.down_payment, 2)
	                ),
	                ' บาท'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ราคาผ่อน'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.payment_price, 2)
	                ),
	                ' บาท'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ต้นทุน'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.cost, 2)
	                ),
	                ' บาท'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ค่าติดตั้ง'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.install_cost, 2)
	                ),
	                ' บาท'
	              )
	            )
	          ),
	          React.createElement('div', { className: 'no-shrink', style: { padding: '0 4px' } }),
	          React.createElement(
	            'div',
	            { className: 'can-grow' },
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ชำระต่อเดือน'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.payment_per_month, 2)
	                ),
	                ' บาท'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ชำระแล้ว'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.total_paid, 2)
	                ),
	                ' บาท'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ส่วนลด'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.payment_price - contract.discount, 2)
	                ),
	                ' บาท'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'คงเหลือ'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.payment_price - (contract.total_paid - contract.down_payment), 2)
	                ),
	                ' บาท'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.payment_price - (contract.total_paid - contract.down_payment), 2)
	                ),
	                ' บาท'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ค่าทำสัญญา'
	              ),
	              React.createElement(
	                'div',
	                { className: 'right no-shrink' },
	                React.createElement(
	                  'span',
	                  { className: 'blue' },
	                  helper.numberFormat(contract.fee, 2)
	                ),
	                ' บาท'
	              )
	            )
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'flex' },
	        React.createElement(
	          'div',
	          { className: 'panel2' },
	          React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { className: 'can-grow' },
	              'เลขที่ขาย'
	            ),
	            React.createElement(
	              'div',
	              { className: 'left no-shrink' },
	              contract.sell_id
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { className: 'can-grow' },
	              'วันที่ขาย'
	            ),
	            React.createElement(
	              'div',
	              { className: 'left no-shrink' },
	              tr.localize(new Date(contract.sell_date), { type: 'date', format: 'short' })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { className: 'can-grow' },
	              'พนักงานขาย'
	            ),
	            React.createElement(
	              'div',
	              { className: 'left no-shrink' },
	              contract.sell_staff_name
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2' },
	          React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { className: 'can-grow' },
	              'สาขาที่ทำสัญญา'
	            ),
	            React.createElement(
	              'div',
	              { className: 'left no-shrink' },
	              contract.shop_name
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { className: 'can-grow' },
	              'พนักงานไฟแนนซ์'
	            ),
	            React.createElement(
	              'div',
	              { className: 'left no-shrink' },
	              contract.finance_staff_name
	            )
	          )
	        )
	      )
	    );

	    var customerProfile = React.createElement(
	      'div',
	      { className: 'contract-section', style: this.state.expand.customer ? {
	          marginTop: '8px',
	          borderRadius: '8px 8px 0 0',
	          borderBottom: '1px solid blue'
	        } : { marginTop: '8px' } },
	      React.createElement(
	        'div',
	        { className: this.state.expand.customer ? 'none' : 'flex' },
	        React.createElement(
	          'div',
	          { className: 'box10 flex' },
	          React.createElement(
	            'div',
	            { className: 'panel2' },
	            React.createElement(
	              'div',
	              { className: 'section-header can-grow flex', style: { cursor: 'pointer' }, onClick: function () {
	                  this.toggleExpand('customer');
	                }.bind(this) },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ผู้เช่าซื้อ'
	              ),
	              React.createElement('div', { className: 'flaticon-expand38 no-shrink', style: { marginTop: '4px' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel8' },
	            'ข้อมูลผู้เช่าซื้อโดยสรุป'
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: this.state.expand.customer ? 'flex' : 'none' },
	        React.createElement(
	          'div',
	          { className: 'box6 no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel6 flex' },
	            React.createElement(
	              'div',
	              { className: 'section-header can-grow flex', style: { cursor: 'pointer' }, onClick: function () {
	                  this.toggleExpand('customer');
	                }.bind(this) },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ผู้เช่าซื้อ'
	              ),
	              React.createElement('div', { className: 'flaticon-expand39 no-shrink', style: { marginTop: '4px' } })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel4 flex' },
	              React.createElement(FlexTextInput, { field: this.state.fields.nationid, data: this.state.contract, onChange: this.handleChange }),
	              React.createElement(FlexIcon, { icon: 'framed1', className: 'no-shrink', title: 'contract.read_id', onClick: function () {
	                  toasterActions.pop({
	                    type: 'warning',
	                    message: 'result.idcard.disabled'
	                  });
	                  return;
	                  this.readIDCard('cusIDCard');
	                }.bind(this), style: { padding: '4px' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6 flex' },
	            React.createElement(
	              'div',
	              { style: { width: "160px", flexShrink: 0 } },
	              React.createElement(FlexTextInput, { field: this.state.fields.prename, data: this.state.contract, onChange: this.handleChange })
	            ),
	            React.createElement('div', { style: { width: '4px' } }),
	            React.createElement(FlexTextInput, { field: this.state.fields.firstname, data: this.state.contract, onChange: this.handleChange }),
	            React.createElement('div', { style: { width: '4px' } }),
	            React.createElement(FlexTextInput, { field: this.state.fields.lastname, data: this.state.contract, onChange: this.handleChange })
	          ),
	          component.customerInfo(this.state.fields, this.state.contract, {
	            HOME: this.state.contract.customerAddr.addr_text,
	            WORK: this.state.contract.workAddr.addr_text
	          }, this.handleChange)
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel4' },
	          React.createElement(NationIDCard, {
	            idcard: this.state.contract.customer.idcard_info || {},
	            photoPath: this.state.cusIDCardPhoto,
	            photoLoading: this.state.cusIDCardPhotoLoading,
	            onChange: function (data) {
	              this.handleIDCardChange('customer', data);
	            }.bind(this)
	          })
	        )
	      )
	    );
	    var customerAddress = React.createElement(
	      'div',
	      { className: (this.state.expand.customer ? 'flex' : 'none') + ' contract-section', style: { borderTop: 'none', borderBottom: 'none', borderRadius: '0px' } },
	      component.customerAddressStatus(this.state.fields, this.state.contract, this.handleChange, true)
	    );
	    var customerWork = React.createElement(
	      'div',
	      { className: (this.state.expand.customer ? 'flex' : 'none') + ' contract-section', style: { borderRadius: '0 0 8px 8px', borderTop: '1px solid blue' } },
	      React.createElement(
	        'div',
	        { className: 'box5' },
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          React.createElement(T, { content: 'contract.work_status', component: 'div', className: 'section-header' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel5', style: { paddingBottom: '0' } },
	          React.createElement(FlexTextInput, { field: this.state.fields.work_company, data: this.state.contract, onChange: this.handleChange })
	        ),
	        React.createElement(AddressInfo, { ref: 'workAddr', otherLabel: 'contract.address.fax', onChange: function (data) {
	            this.handleChange('workAddr', data);
	          }.bind(this),
	          data: this.state.contract.workAddr
	        })
	      ),
	      component.customerJobStatus(this.state.fields, this.state.contract, this.handleChange)
	    );

	    var coProfile = React.createElement(
	      'div',
	      { className: 'contract-section', style: { marginTop: '8px' } },
	      React.createElement(
	        'div',
	        { className: this.state.expand.co ? 'none' : 'flex' },
	        React.createElement(
	          'div',
	          { className: 'box10 flex' },
	          React.createElement(
	            'div',
	            { className: 'panel2' },
	            React.createElement(
	              'div',
	              { className: 'section-header can-grow flex', style: { cursor: 'pointer' }, onClick: function () {
	                  this.toggleExpand('co');
	                }.bind(this) },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ผู้เช่าซื้อร่วม'
	              ),
	              React.createElement('div', { className: 'flaticon-expand38 no-shrink', style: { marginTop: '4px' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel8' },
	            'ข้อมูลผู้เช่าซื้อร่วมโดยสรุป'
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: this.state.expand.co ? 'flex' : 'none' },
	        React.createElement(
	          'div',
	          { className: 'box6 no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel6 flex' },
	            React.createElement(
	              'div',
	              { className: 'section-header can-grow flex', style: { cursor: 'pointer' }, onClick: function () {
	                  this.toggleExpand('co');
	                }.bind(this) },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ผู้เช่าซื้อร่วม'
	              ),
	              React.createElement('div', { className: 'flaticon-expand39 no-shrink', style: { marginTop: '4px' } })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel4 flex' },
	              React.createElement(FlexTextInput, { field: this.state.fields.co_nationid, data: this.state.contract, onChange: this.handleChange }),
	              React.createElement(FlexIcon, { icon: 'framed1', className: 'no-shrink', title: 'contract.read_id', onClick: function () {
	                  toasterActions.pop({
	                    type: 'warning',
	                    message: 'result.idcard.disabled'
	                  });
	                  return;
	                  this.readIDCard('cusIDCard');
	                }.bind(this), style: { padding: '4px' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6 flex' },
	            React.createElement(
	              'div',
	              { style: { width: "160px", flexShrink: 0 } },
	              React.createElement(FlexTextInput, { field: this.state.fields.co_prename, data: this.state.contract, onChange: this.handleChange })
	            ),
	            React.createElement('div', { style: { width: '4px' } }),
	            React.createElement(FlexTextInput, { field: this.state.fields.co_firstname, data: this.state.contract, onChange: this.handleChange }),
	            React.createElement('div', { style: { width: '4px' } }),
	            React.createElement(FlexTextInput, { field: this.state.fields.co_lastname, data: this.state.contract, onChange: this.handleChange })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel6 flex' },
	            React.createElement(
	              'div',
	              { style: { width: '280px' } },
	              React.createElement(FlexTextInput, { field: this.state.fields.co_mobile, data: this.state.contract, onChange: this.handleChange })
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel4' },
	          React.createElement(NationIDCard, {
	            idcard: this.state.contract.co.idcard_info || {},
	            photoPath: this.state.coIDCardPhoto,
	            photoLoading: this.state.cusIDCardPhotoLoading,
	            onChange: function (data) {
	              this.handleIDCardChange('co', data);
	            }.bind(this)
	          })
	        )
	      )
	    );

	    var coAddress = React.createElement(
	      'div',
	      { className: (this.state.expand.co ? 'flex' : 'none') + ' contract-section', style: { borderTop: 'none', borderBottom: 'none', borderRadius: '0px' } },
	      component.coAddressStatus(this.state.fields, this.state.contract, this.handleChange, true)
	    );

	    var coWork = React.createElement(
	      'div',
	      { className: (this.state.expand.co ? 'flex' : 'none') + ' contract-section', style: { borderRadius: '0 0 8px 8px', borderTop: '1px solid blue' } },
	      React.createElement(
	        'div',
	        { className: 'box5' },
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          React.createElement(T, { content: 'contract.work_status', component: 'div', className: 'section-header' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel5', style: { paddingBottom: '0' } },
	          React.createElement(FlexTextInput, { field: this.state.fields.co_work_company, data: this.state.contract, onChange: this.handleChange })
	        ),
	        React.createElement(AddressInfo, { ref: 'coWorkAddr', otherLabel: 'contract.address.fax', onChange: function (data) {
	            this.handleChange('coWorkAddr', data);
	          }.bind(this),
	          data: this.state.contract.coWorkAddr
	        })
	      ),
	      component.coJobStatus(this.state.fields, this.state.contract, this.handleChange)
	    );

	    var editPaymentMonth = React.createElement(
	      'div',
	      { style: { width: "30px" } },
	      React.createElement(FlexTextInput, {
	        field: this.state.fields.close_return_newcost,
	        data: this.state.contract,
	        onChange: this.handleChange,
	        onKeyUp: this.calProfitLost
	      })
	    );

	    var paymentTermSummary = React.createElement(
	      'div',
	      { className: 'box2' },
	      React.createElement(
	        'div',
	        { className: 'panel2' },
	        React.createElement(
	          'div',
	          { className: 'flex section-header', style: { cursor: 'pointer' }, onClick: function () {
	              this.toggleExpand('payment_term');
	            }.bind(this) },
	          React.createElement(T, { content: 'contract.payment_status', component: 'div', className: 'can-grow' }),
	          React.createElement('div', { className: 'flaticon-expand39 no-shrink', style: { marginTop: '4px' } })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel2 flex' },
	        React.createElement(FlexTextInput, {
	          field: this.state.fields.payment_month,
	          data: this.state.contract,
	          onChange: this.handleChange
	        })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel2 flex' },
	        React.createElement(FlexTextInput, {
	          field: this.state.fields.payment_price,
	          data: this.state.contract,
	          onChange: this.handleChange
	        })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel2 flex' },
	        React.createElement(FlexTextInput, {
	          field: this.state.fields.payment_per_month,
	          data: this.state.contract,
	          onChange: this.handleChange
	        })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel2 flex' },
	        React.createElement(FlexTextInput, {
	          field: this.state.fields.payment_on_day,
	          data: this.state.contract,
	          onChange: this.handleChange
	        })
	      )
	    );
	    var paymentTerms = React.createElement(
	      'div',
	      { className: 'panel8 no-shrink' },
	      React.createElement(FlexDataTable, {
	        fields: this.state.termFields,
	        data: paymentTerm,
	        displayRows: 6,
	        canEdit: function (row, field) {
	          if (paymentTerm[row].term_status != 'WAIT' || paymentTerm[row].close_status != 'NORMAL') {
	            return false;
	          }
	          if (row < paymentTerm.length - 1 && field == 'due_date') {
	            return true;
	          }
	          if (row == paymentTerm.length - 1 && field == 'due_date') {
	            return true;
	          }
	          return false;
	        }.bind(this),
	        onChange: this.handleTermChange
	      })
	    );

	    var paymentTermSection = React.createElement(
	      'div',
	      { className: 'contract-section', style: { marginTop: '8px' } },
	      React.createElement(
	        'div',
	        { className: 'box10 ' + (this.state.expand.payment_term ? 'none' : 'flex') },
	        React.createElement(
	          'div',
	          { className: 'panel2' },
	          React.createElement(
	            'div',
	            { className: 'flex no-shrink section-header can-grow', style: { cursor: 'pointer' }, onClick: function () {
	                this.toggleExpand('payment_term');
	              }.bind(this) },
	            React.createElement(T, { content: 'contract.payment_status', component: 'div', className: 'can-grow' }),
	            React.createElement('div', { className: 'flaticon-expand38 no-shrink', style: { marginTop: '4px' } })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel8 can-grow' },
	          'ข้อมูลงวดการจ่ายโดยสรุป'
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: this.state.expand.payment_term ? 'flex' : 'none' },
	        paymentTermSummary,
	        paymentTerms
	      )
	    );

	    var paymentDetail = React.createElement(
	      'div',
	      { className: 'panel6 no-shrink' },
	      React.createElement(
	        'div',
	        { className: 'section-header' },
	        'Payment Details'
	      )
	    );

	    var closeReturn = React.createElement(
	      'div',
	      { className: 'contract-section', style: { marginTop: '8px' } },
	      React.createElement(
	        'div',
	        { className: this.state.expand.close_return ? 'none' : 'flex' },
	        React.createElement(
	          'div',
	          { className: 'box10 flex' },
	          React.createElement(
	            'div',
	            { className: 'panel2' },
	            React.createElement(
	              'div',
	              { className: 'section-header can-grow flex', style: { cursor: 'pointer' }, onClick: function () {
	                  this.toggleExpand('close_return');
	                }.bind(this) },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ปิดสัญญายึด/คืน'
	              ),
	              React.createElement('div', { className: 'flaticon-expand38 no-shrink', style: { marginTop: '4px' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel8' },
	            'ข้อมูลปิดสัญญายึด/คืนของ'
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: this.state.expand.close_return ? 'flex' : 'none' },
	        React.createElement(
	          'div',
	          { className: 'box6 no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel6 flex' },
	            React.createElement(
	              'div',
	              { className: 'section-header can-grow flex', style: { cursor: 'pointer' }, onClick: function () {
	                  this.toggleExpand('close_return');
	                }.bind(this) },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ปิดสัญญาคืนของ'
	              ),
	              React.createElement('div', { className: 'flaticon-expand39 no-shrink', style: { marginTop: '4px' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box10 flex' },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, {
	                  field: this.state.fields.close_return_newcost,
	                  data: this.state.contract,
	                  onChange: this.handleChange,
	                  onKeyUp: this.calProfitLost,
	                  live: true
	                })
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.close_return_oldcost, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.close_return_paid, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.close_return_balance, data: { balance: helper.numberFormat(this.state.contract.cost - this.state.contract.total_paid, 2) }, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.close_return_contract_free, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.close_return_install_free, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.close_return_profit_loss, data: this.state.contract, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel6' },
	              React.createElement(
	                'div',
	                { className: 'flex' },
	                React.createElement(
	                  'div',
	                  { style: { width: "280px", flexShrink: 0 } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.close_return_sell_id, data: this.state.contract, onChange: this.handleChange })
	                ),
	                React.createElement('div', { style: { width: "8px", flexShrink: 0 } }),
	                React.createElement(
	                  'div',
	                  { style: { width: "280px", flexShrink: 0 } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.close_return_product_detail, data: this.state.contract, onChange: this.handleChange })
	                )
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { className: 'flex' },
	                React.createElement(
	                  'div',
	                  { style: { width: "280px", flexShrink: 0 } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.close_return_sign_date, data: this.state.contract, onChange: this.handleChange })
	                ),
	                React.createElement('div', { style: { width: "8px", flexShrink: 0 } }),
	                React.createElement(
	                  'div',
	                  { style: { width: "280px", flexShrink: 0 } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.close_return_cus_name, data: { cus_name: this.state.contract.customer.fullname }, onChange: this.handleChange })
	                )
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { className: 'flex' },
	                React.createElement(
	                  'div',
	                  { style: { width: "280px", flexShrink: 0 } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.close_return_product_serial, data: this.state.return, onChange: this.handleChange })
	                ),
	                React.createElement('div', { style: { width: "8px", flexShrink: 0 } }),
	                React.createElement(
	                  'div',
	                  { style: { width: "280px", flexShrink: 0 } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.close_return_product_condition, data: this.state.return, onChange: this.handleChange })
	                )
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { className: 'flex' },
	                React.createElement(
	                  'div',
	                  { style: { width: "280px", flexShrink: 0 } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.co_nationid, data: this.state.contract, onChange: this.handleChange })
	                ),
	                React.createElement('div', { style: { width: "8px", flexShrink: 0 } }),
	                React.createElement(
	                  'div',
	                  { style: { width: "280px", flexShrink: 0 } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.close_return_remark, data: this.state.return, onChange: this.handleChange })
	                )
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { className: 'flex' },
	                React.createElement(
	                  'div',
	                  { style: { width: "280px", flexShrink: 0 } },
	                  React.createElement(FlexTextInput, { field: this.state.fields.close_return_return_date, data: this.state.return, onChange: this.handleChange })
	                ),
	                React.createElement('div', { style: { width: "8px", flexShrink: 0 } })
	              ),
	              React.createElement('div', { style: { height: "4px", flexShrink: 0 } }),
	              React.createElement(FlexDataTable, {
	                fields: this.state.return_detail,
	                data: this.state.returndetail,
	                displayRows: 3
	              })
	            )
	          )
	        ),
	        React.createElement('div', { className: 'panel4' })
	      )
	    );

	    var collection = React.createElement(
	      'div',
	      { className: 'contract-section', style: { marginTop: '8px' } },
	      React.createElement(
	        'div',
	        { className: this.state.expand.collection ? 'none' : 'flex' },
	        React.createElement(
	          'div',
	          { className: 'box10 flex' },
	          React.createElement(
	            'div',
	            { className: 'panel2' },
	            React.createElement(
	              'div',
	              { className: 'section-header can-grow flex', style: { cursor: 'pointer' }, onClick: function () {
	                  this.toggleExpand('collection');
	                }.bind(this) },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'โทรตามหนี้'
	              ),
	              React.createElement('div', { className: 'flaticon-expand38 no-shrink', style: { marginTop: '4px' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel8' },
	            'ข้อมูลโทรตามหนี้'
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: this.state.expand.collection ? 'flex' : 'none' },
	        React.createElement(
	          'div',
	          { className: 'box6 no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel6 flex' },
	            React.createElement(
	              'div',
	              { className: 'section-header can-grow flex', style: { cursor: 'pointer' }, onClick: function () {
	                  this.toggleExpand('collection');
	                }.bind(this) },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'โทรตามหนี้'
	              ),
	              React.createElement('div', { className: 'flaticon-expand39 no-shrink', style: { marginTop: '4px' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box10' },
	            React.createElement(
	              'div',
	              { className: 'panel9' },
	              React.createElement(
	                'h2',
	                null,
	                '1.บันทึกรายการโทรตามหนี้'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { className: 'panel8 flex no-shrink' },
	                React.createElement(FlexDropdown, {
	                  field: this.state.fields.collection_type,
	                  data: this.state.contract,
	                  onChange: this.handleListChange
	                }),
	                React.createElement('div', { style: { width: "4px", flexShrink: 0 } }),
	                React.createElement(FlexTextInput, { field: this.state.fields.collection_number, data: this.state.contract, onChange: this.handleChange }),
	                React.createElement('div', { style: { height: "4px", flexShrink: 0 } })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { className: 'panel8 flex no-shrink' },
	                React.createElement(FlexTextInput, { field: this.state.fields.collection_date, data: this.state.contract, onChange: this.handleChange }),
	                React.createElement('div', { style: { width: "4px", flexShrink: 0 } }),
	                React.createElement(FlexTextInput, { field: this.state.fields.collection_call_name, data: this.state.contract, onChange: this.handleChange }),
	                React.createElement('div', { style: { height: "4px", flexShrink: 0 } })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { className: 'panel10 flex no-shrink' },
	                React.createElement(FlexTextInput, { field: this.state.fields.collection_call_remark, data: this.state.contract, onChange: this.handleChange }),
	                React.createElement(
	                  'div',
	                  { className: 'panel2 no-shrink' },
	                  React.createElement(FlexButton, {
	                    label: 'collection.save',
	                    icon: 'save20',
	                    'default': true,
	                    onClick: this.doCollectionSave
	                  })
	                )
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10' },
	              React.createElement(FlexDataTable, {
	                fields: this.state.collection,
	                data: this.state.dataCollection,
	                displayRows: 5
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel9' },
	              React.createElement(
	                'h2',
	                null,
	                '2.พิมพ์เอกสาร'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel9 flex no-shrink' },
	              React.createElement(
	                'div',
	                { className: 'panel3 flex no-shrink' },
	                React.createElement(FlexDropdown, {
	                  field: this.state.fields.collection_send,
	                  data: this.state.contract,
	                  onChange: this.handleListChange
	                })
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel2 flex no-shrink' },
	                React.createElement(FlexButton, {
	                  label: 'collection.print',
	                  icon: 'printer88',
	                  'default': true,
	                  onClick: this.onPrintCollectionReport
	                })
	              )
	            )
	          )
	        ),
	        React.createElement('div', { className: 'panel4' })
	      )
	    );

	    var closeca = React.createElement(
	      'div',
	      { className: 'contract-section', style: { marginTop: '8px' } },
	      React.createElement(
	        'div',
	        { className: this.state.expand.closeca ? 'none' : 'flex' },
	        React.createElement(
	          'div',
	          { className: 'box10 flex' },
	          React.createElement(
	            'div',
	            { className: 'panel2' },
	            React.createElement(
	              'div',
	              { className: 'section-header can-grow flex', style: { cursor: 'pointer' }, onClick: function () {
	                  this.toggleExpand('closeca');
	                }.bind(this) },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ปิดสัญญาหนีหนี้'
	              ),
	              React.createElement('div', { className: 'flaticon-expand38 no-shrink', style: { marginTop: '4px' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel8' },
	            'ข้อมูลปิดสัญญาหนีหนี้'
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: this.state.expand.closeca ? 'flex' : 'none' },
	        React.createElement(
	          'div',
	          { className: 'box6 no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel6 flex' },
	            React.createElement(
	              'div',
	              { className: 'section-header can-grow flex', style: { cursor: 'pointer' }, onClick: function () {
	                  this.toggleExpand('closeca');
	                }.bind(this) },
	              React.createElement(
	                'div',
	                { className: 'can-grow' },
	                'ปิดสัญญาหนีหนี้'
	              ),
	              React.createElement('div', { className: 'flaticon-expand39 no-shrink', style: { marginTop: '4px' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel10' },
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_contract_code, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_sell_id, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_sign_date, data: this.state.contract, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_serial, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "565px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_product, data: this.state.contract, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_nationid, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "565px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_cus_name, data: this.state.contract, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { style: { width: "208px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_overday, data: this.state.contract.dataSaveCloseCA, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "208px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_lastpaid, data: this.state.contract.dataSaveCloseCA, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "208px", flexShrink: 0 } },
	                React.createElement(FlexDropdown, {
	                  field: this.state.closeca_effective,
	                  data: { 'dataSaveCloseCA.closeca_effective': this.state.contract.dataSaveCloseCA.closeca_effective },
	                  onChange: this.handleListChange
	                })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "208px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_date, data: this.state.contract, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_totalprice, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "565px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_remark, data: this.state.contract, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_cost, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_new_cost, data: this.state.contract, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_installcost, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexDropdown, {
	                  field: this.state.closeca_staffname,
	                  data: { 'dataSaveCloseCA.closeca_staff': this.state.contract.dataSaveCloseCA.closeca_staff },
	                  onChange: this.handleListChange
	                })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_fee, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_staff_percent, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_staff_amount, data: this.state.contract, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_totalpaid, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_percent, data: this.state.contract, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "5px" } }),
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_amount, data: this.state.contract, onChange: this.handleChange })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel10 flex' },
	              React.createElement(
	                'div',
	                { style: { width: "280px", flexShrink: 0 } },
	                React.createElement(FlexTextInput, { field: this.state.fields.closeca_profit_lost, data: this.state.contract.dataSaveCloseCA, onChange: this.handleChange })
	              ),
	              React.createElement('div', { style: { width: "378px", flexShrink: 0 } }),
	              React.createElement(
	                'div',
	                { style: { width: "192px", flexShrink: 0 } },
	                function () {
	                  if (this.state.contract.permission_save) {
	                    return React.createElement(FlexButton, { icon: 'save20', label: 'closeca.saveca', 'default': true,
	                      disabled: this.state.contract.current_status == 'CLOSE_BAD_DEBT' ? true : false,
	                      onClick: this.doCloseCASave });
	                  }
	                }.call(this)
	              )
	            )
	          )
	        ),
	        React.createElement('div', { className: 'panel4' })
	      )
	    );

	    var _shopName = system.sessionStore.getSession().shop.code + " " + system.sessionStore.getSession().shop.name;

	    return React.createElement(
	      'div',
	      { className: 'content-page flex-form' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'contract.title.view', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink' },
	          React.createElement(
	            'div',
	            { style: { textAlign: 'center', border: '1px solid silver', height: '30px', lineHeight: '36px', fontSize: '14pt' } },
	            _shopName
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink' },
	          React.createElement(FlexButton, { icon: 'save20',
	            label: 'action.save',
	            'default': true,
	            disabled: this.state.contract.current_status != 'DEBT' && this.state.contract.current_status != 'NORMAL' ? true : false,
	            onClick: this.doContractSave })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body boxf' },
	        React.createElement(
	          'form',
	          { ref: 'frm' },
	          contractSummary,
	          customerProfile,
	          customerAddress,
	          customerWork,
	          coProfile,
	          coAddress,
	          coWork,
	          paymentTermSection,
	          this.state.flagClose == 'Y' ? closeReturn : "",
	          collection,
	          closeca
	        )
	      )
	    );
	  }
	});

	module.exports = ContractEdit;

/***/ },

/***/ 867:
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

	var helper = system.helper;
	var systemActions = system.systemActions;

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;

	var contractActions = __webpack_require__(774);

	var ContractList = React.createClass({
	  displayName: 'ContractList',

	  getInitialState: function getInitialState() {
	    var shops = system.acl.getShopAcl();
	    var monthYear = tr.localize(new Date(), { type: 'date', format: 'monthYear' });
	    return {
	      data: {
	        shop: shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '',
	        type: '*'
	      },
	      fields: [
	      // {name:'status', title:'contract.contract_status', width:'86px'
	      //   , sort:false, search:false, text:monthYear, render:function(row) {
	      //   var today = new Date();
	      //   var from_date = new Date(today.getFullYear(), today.getMonth()-9, 1, 0, 0, 0);
	      //   var year = from_date.getFullYear();
	      //   var month = from_date.getMonth();
	      //   var fromYearMonth = year * 100+month;
	      //   var to_date = new Date(today.getFullYear(), today.getMonth()+3, 1, 0, 0, 0);
	      //   var toYearMonth = to_date.getFullYear() * 100 + to_date.getMonth();
	      //   var paymentList = {};
	      //   row.payments.forEach(function(payment) {
	      //     var d = new Date(payment.due_date.substr(0,10));
	      //     var ym = d.getFullYear() * 100 + d.getMonth();
	      //     paymentList[''+ym] = payment;
	      //   });
	      //   var list = [];
	      //   var ym = year*100+month;
	      //   while (ym < toYearMonth) {
	      //     if (!paymentList[''+ym]) {
	      //       list.push(<li key={ym} className="type_EMPTY"></li>);
	      //       month++;
	      //       if (month==12) {
	      //         year++;
	      //         month=0;
	      //       }
	      //       ym = year*100+month;
	      //       continue;
	      //     }
	      //     var className = 'status_' + paymentList[''+ym].term_status
	      //       + (paymentList[''+ym].close_status=='NORMAL' ? '' : ' ' + paymentList[''+ym].close_status);
	      //     var title = 'DUE DATE: ' + paymentList[''+ym].due_date.substr(0,10)
	      //       + '\nPAID DATE: ' + paymentList[''+ym].paid_date.substr(0, 10)
	      //       + '\nDUE AMOUNT: ' + paymentList[''+ym].due_amount
	      //       + '\nPAID AMOUNT: ' + paymentList[''+ym].paid_amount
	      //       + '\nSTATUS: ' + paymentList[''+ym].term_status
	      //       + '\nCLOSE STATUS: ' + paymentList[''+ym].close_status;
	      //     list.push(<li key={ym} className={className} title={title}></li>);
	      //     month++;
	      //     if (month==12) {
	      //       year++;
	      //       month=0;
	      //     }
	      //     ym = year*100+month;
	      //   }
	      //   return (
	      //     <ul className="contract_status small">
	      //       {list}
	      //     </ul>
	      //   )
	      // }},
	      { name: 'return_date', type: 'date', title: 'contract.sign_date', width: '88px', render: function render(row) {
	          //console.log(row.sign_date.substr(0,10));
	          return tr.localize(new Date(row.return_date.substr(0, 10)), { type: 'date', format: 'short' });
	        } }, { name: 'mysql_contract_code', title: 'contract.contract', width: '150px', render: function render(row) {
	          return row.mysql_contract_code;
	        } }, { name: 'sell_date', type: 'date', title: 'contract.sell_date', width: '88px', render: function render(row) {
	          //console.log(row.sign_date.substr(0,10));
	          return tr.localize(new Date(row.sell_date.substr(0, 10)), { type: 'date', format: 'short' });
	        } }, { name: 'name', title: 'contract.shop_name', width: '100px' }, { name: 'cus_name', title: 'contract.cus_name', width: '150px' }, { name: 'description', title: 'contract.product_detail' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'installment.contract.edit', param: { id: row.contract_id, pageback: 'installment.contract.close', close: 'Y' }, icon: 'right244', title: 'action.select' })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    //console.log(system.sessionStore.getSession());
	    //console.log(this.state.data);
	  },

	  handleChange: function handleChange(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  render: function render() {
	    var list = system.acl.getShopAcl().map(function (item) {
	      return {
	        value: item.code,
	        text: item.code + ' ' + item.name
	      };
	    });
	    if (system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] })) {
	      list.unshift({ value: '*', text: '* ทุกสาขา' });
	    }

	    var list_type = [{
	      value: '*',
	      text: '* ทุกประเภท'
	    }, {
	      value: 'CLOSE_RETURN',
	      text: 'ปิดคืนของ'
	    }, {
	      value: 'CLOSE_CONFISCATE',
	      text: 'ปิดยึดของ'
	    }];

	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'contract.title.close', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'type', label: 'contract.filter_type', list: list_type },
	            data: this.state.data,
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'contract.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'installment-contract-close',
	          listAction: contractActions.listClose,
	          exportAction: contractActions.exportClose,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'return_date',
	          sortDir: 'ASC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: {
	            shop: this.state.data.shop == '*' ? null : this.state.data.shop,
	            return_status: this.state.data.type == '*' ? null : this.state.data.type
	          }
	        })
	      )
	    );
	  }
	});

	module.exports = ContractList;

/***/ },

/***/ 868:
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

	var helper = system.helper;
	var systemActions = system.systemActions;
	var storage = system.storage;
	var storageKey = 'installment.contract.closediscount';

	var toasterActions = system.toasterActions;
	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;

	var contractActions = __webpack_require__(774);
	var ReFlux = __webpack_require__(337);

	var ContractList = React.createClass({
	  displayName: 'ContractList',

	  mixins: [ReFlux.listenTo(contractActions.saveClosediscount.done, 'onSaveClosediscountDoneAction')],
	  getInitialState: function getInitialState() {
	    var shops = system.acl.getShopAcl();
	    var monthYear = tr.localize(new Date(), { type: 'date', format: 'monthYear' });

	    var opt = storage.load(storageKey, { shop: '' });
	    if (opt.shop == '') {
	      opt.shop = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    }

	    return {
	      data: {
	        shop: opt.shop
	      },
	      fields: [
	      // {name:'status', title:'contract.contract_status', width:'86px'
	      //   , sort:false, search:false, text:monthYear, render:function(row) {
	      //   var today = new Date();
	      //   var from_date = new Date(today.getFullYear(), today.getMonth()-9, 1, 0, 0, 0);
	      //   var year = from_date.getFullYear();
	      //   var month = from_date.getMonth();
	      //   var fromYearMonth = year * 100+month;
	      //   var to_date = new Date(today.getFullYear(), today.getMonth()+3, 1, 0, 0, 0);
	      //   var toYearMonth = to_date.getFullYear() * 100 + to_date.getMonth();
	      //   var paymentList = {};
	      //   row.payments.forEach(function(payment) {
	      //     var d = new Date(payment.due_date.substr(0,10));
	      //     var ym = d.getFullYear() * 100 + d.getMonth();
	      //     paymentList[''+ym] = payment;
	      //   });
	      //   var list = [];
	      //   var ym = year*100+month;
	      //   while (ym < toYearMonth) {
	      //     if (!paymentList[''+ym]) {
	      //       list.push(<li key={ym} className="type_EMPTY"></li>);
	      //       month++;
	      //       if (month==12) {
	      //         year++;
	      //         month=0;
	      //       }
	      //       ym = year*100+month;
	      //       continue;
	      //     }
	      //     var className = 'status_' + paymentList[''+ym].term_status
	      //       + (paymentList[''+ym].close_status=='NORMAL' ? '' : ' ' + paymentList[''+ym].close_status);
	      //     var title = 'DUE DATE: ' + paymentList[''+ym].due_date.substr(0,10)
	      //       + '\nPAID DATE: ' + paymentList[''+ym].paid_date.substr(0, 10)
	      //       + '\nDUE AMOUNT: ' + paymentList[''+ym].due_amount
	      //       + '\nPAID AMOUNT: ' + paymentList[''+ym].paid_amount
	      //       + '\nSTATUS: ' + paymentList[''+ym].term_status
	      //       + '\nCLOSE STATUS: ' + paymentList[''+ym].close_status;
	      //     list.push(<li key={ym} className={className} title={title}></li>);
	      //     month++;
	      //     if (month==12) {
	      //       year++;
	      //       month=0;
	      //     }
	      //     ym = year*100+month;
	      //   }
	      //   return (
	      //     <ul className="contract_status small">
	      //       {list}
	      //     </ul>
	      //   )
	      // }},
	      { name: 'code', title: 'contract.code', width: '150px', render: function render(row) {
	          if (!row.code || row.code.length != 16) {
	            return row.code;
	          }
	          return row.code.substr(8, 6);
	        } }, { name: 'shop_name', title: 'contract.shop_name', width: '80px' },
	      // {name:'sign_date', type:'daterange', title:'contract.sign_date', width:'88px', render:function(row) {
	      //   //console.log(row.sign_date.substr(0,10));
	      //   return tr.localize(new Date(row.sign_date.substr(0,10)), { type:'date', format:'short'});
	      // }},
	      { name: 'cus_name', title: 'contract.customer', width: '120px' }, { name: 'cus_mobile', title: 'contract.cus_mobile', width: '90px' }, { name: 'product_detail', title: 'contract.product_detail' }, { name: 'last_paid', type: 'daterange', title: 'contract.last_paid', width: '100px', render: function render(row) {
	          //console.log(row.sign_date.substr(0,10));
	          var last_date = '';
	          if (row.last_paid == null || row.last_paid == '0000-00-00') {
	            last_date = '';
	          } else {
	            last_date = tr.localize(new Date(row.last_paid.substr(0, 10)), { type: 'date', format: 'short' });
	          }
	          return last_date;
	        } }, { name: 'payment_price', title: 'contract.payment_price', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.payment_price, 2);
	        } }, { name: 'total_paid', title: 'contract.total_paid', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.total_paid, 2);
	        } }, { name: 'discount', title: 'contract.discount', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.discount, 2);
	        } }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          var f = function () {
	            this.onUpdateCloseDiscount(row);
	          }.bind(this);
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { onClick: f },
	              React.createElement(FlexIcon, { icon: 'save20', title: 'action.select' })
	            )
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    console.log(system.sessionStore.getSession());
	  },

	  onSaveClosediscountDoneAction: function onSaveClosediscountDoneAction() {
	    toasterActions.pop({
	      type: 'success',
	      message: 'บันทึกข้อมูลเรียบร้อย'
	    });
	    this.refs.grid.doRefresh();
	  },

	  handleChange: function handleChange(id, value) {

	    this.state.data[id] = value;
	    storage.save(storageKey, {
	      shop: this.state.data.shop
	    });
	    this.setState({
	      data: this.state.data
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  onUpdateCloseDiscount: function onUpdateCloseDiscount(row) {
	    //console.log('update');
	    contractActions.saveClosediscount(row.id);
	  },

	  render: function render() {
	    var list = system.acl.getShopAcl().map(function (item) {
	      return {
	        value: item.code,
	        text: item.code + ' ' + item.name
	      };
	    });
	    if (system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] })) {
	      list.unshift({ value: '*', text: '* ทุกสาขา' });
	    }
	    var footnote = React.createElement(
	      'ul',
	      { className: 'contract_status_legend' },
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_WAIT' }),
	        React.createElement(T, { content: 'contract.status.WAIT', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_WAIT_PARTIAL' }),
	        React.createElement(T, { content: 'contract.status.WAIT_PARTIAL', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_WAIT_PAID' }),
	        React.createElement(T, { content: 'contract.status.WAIT_PAID', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_OVERDUE' }),
	        React.createElement(T, { content: 'contract.status.OVERDUE', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_OVERDUE_PARTIAL' }),
	        React.createElement(T, { content: 'contract.status.OVERDUE_PARTIAL', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_OVERDUE_PAID' }),
	        React.createElement(T, { content: 'contract.status.OVERDUE_PAID', component: 'div', className: 'ellipsis' })
	      )
	    );
	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'contract.title.closediscount', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'contract.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'installment-contract-discount',
	          listAction: contractActions.listClosediscount,
	          exportAction: contractActions.exportClosediscount,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'code',
	          sortDir: 'ASC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: {
	            today: helper.dateToString(new Date()),
	            shop: this.state.data.shop == '*' ? null : this.state.data.shop
	          },
	          footer: footnote
	        })
	      )
	    );
	  }
	});

	module.exports = ContractList;

/***/ },

/***/ 869:
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

	var helper = system.helper;
	var systemActions = system.systemActions;
	var storage = system.storage;
	var storageKey = 'installment.contract.dunning';

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;

	var contractActions = __webpack_require__(774);

	var ContractList = React.createClass({
	  displayName: 'ContractList',


	  getInitialState: function getInitialState() {
	    var shops = system.acl.getShopAcl();
	    var monthYear = tr.localize(new Date(), { type: 'date', format: 'monthYear' });

	    var opt = storage.load(storageKey, { current_status: 'DEBT', shop: '' });
	    if (opt.shop == '') {
	      opt.shop = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    }

	    return {
	      data: {
	        shop: opt.shop,
	        current_status: opt.current_status
	      },
	      currentStatusField: {
	        id: 'current_status',
	        label: 'contract.filter_current_status',
	        list: [{ value: 'DEBT', text: tr.translate('contract.current_status.DEBT') }]
	      },
	      fields: [{ name: 'status', title: 'contract.contract_status', width: '86px',
	        sort: false, search: false, text: monthYear, render: function render(row) {
	          var today = new Date();
	          var from_date = new Date(today.getFullYear(), today.getMonth() - 9, 1, 0, 0, 0);
	          var year = from_date.getFullYear();
	          var month = from_date.getMonth();
	          var fromYearMonth = year * 100 + month;
	          var to_date = new Date(today.getFullYear(), today.getMonth() + 3, 1, 0, 0, 0);
	          var toYearMonth = to_date.getFullYear() * 100 + to_date.getMonth();
	          var paymentList = {};
	          row.payments.forEach(function (payment) {
	            var d = new Date(payment.due_date.substr(0, 10));
	            var ym = d.getFullYear() * 100 + d.getMonth();
	            paymentList['' + ym] = payment;
	          });
	          var list = [];
	          var ym = year * 100 + month;
	          while (ym < toYearMonth) {
	            if (!paymentList['' + ym]) {
	              list.push(React.createElement('li', { key: ym, className: 'type_EMPTY' }));
	              month++;
	              if (month == 12) {
	                year++;
	                month = 0;
	              }
	              ym = year * 100 + month;
	              continue;
	            }
	            var className = 'status_' + paymentList['' + ym].term_status + (paymentList['' + ym].close_status == 'NORMAL' ? '' : ' ' + paymentList['' + ym].close_status);
	            var title = 'DUE DATE: ' + paymentList['' + ym].due_date.substr(0, 10) + '\nPAID DATE: ' + paymentList['' + ym].paid_date.substr(0, 10) + '\nDUE AMOUNT: ' + paymentList['' + ym].due_amount + '\nPAID AMOUNT: ' + paymentList['' + ym].paid_amount + '\nSTATUS: ' + paymentList['' + ym].term_status + '\nCLOSE STATUS: ' + paymentList['' + ym].close_status;
	            list.push(React.createElement('li', { key: ym, className: className, title: title }));
	            month++;
	            if (month == 12) {
	              year++;
	              month = 0;
	            }
	            ym = year * 100 + month;
	          }
	          return React.createElement(
	            'ul',
	            { className: 'contract_status small' },
	            list
	          );
	        } }, { name: 'code', title: 'contract.code', width: '150px', render: function render(row) {
	          if (!row.code || row.code.length != 16) {
	            return row.code;
	          }
	          return row.code.substr(8, 6);
	        } }, { name: 'shop_name', title: 'contract.shop_name', width: '60px' }, { name: 'sign_date', type: 'daterange', title: 'contract.sign_date', width: '88px', render: function render(row) {
	          //console.log(row.sign_date.substr(0,10));
	          return tr.localize(new Date(row.sign_date.substr(0, 10)), { type: 'date', format: 'short' });
	        } }, { name: 'cus_name', title: 'contract.customer', width: '100px' }, { name: 'product_detail', title: 'contract.product_detail' }, { name: 'finance', title: 'contract.finance', width: '80px', className: 'center', render: function render(row) {
	          return row.finance;
	        } }, { name: 'last_paid', type: 'daterange', title: 'contract.last_paid', width: '100px', render: function render(row) {
	          //console.log(row.sign_date.substr(0,10));
	          var last_date = '';
	          if (row.last_paid == null || row.last_paid == '0000-00-00') {
	            last_date = '';
	          } else {
	            last_date = tr.localize(new Date(row.last_paid.substr(0, 10)), { type: 'date', format: 'short' });
	          }
	          return last_date;
	        } }, { name: 'amount_term', title: 'contract.amount_term', width: '80px', className: 'center', render: function render(row) {
	          //console.log(row.sign_date.substr(0,10));
	          var amount_term = '';
	          if (row.amount_term != 0) {
	            amount_term = row.amount_term;
	          }
	          return amount_term;
	        } }, { name: 'over_day', title: 'contract.over_day', width: '50px', className: 'center', render: function render(row) {
	          return row.over_day;
	        } }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'installment.contract.edit', param: { id: row.id, pageback: 'installment.contract.dunning', dunning: 'Y' }, icon: 'right244', title: 'action.select' })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    console.log(system.sessionStore.getSession());
	  },

	  handleChange: function handleChange(id, value) {

	    this.state.data[id] = value;
	    storage.save(storageKey, {
	      current_status: this.state.data.current_status,
	      shop: this.state.data.shop
	    });
	    this.setState({
	      data: this.state.data
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  render: function render() {
	    var list = system.acl.getShopAcl().map(function (item) {
	      return {
	        value: item.code,
	        text: item.code + ' ' + item.name
	      };
	    });
	    if (system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] })) {
	      list.unshift({ value: '*', text: '* ทุกสาขา' });
	    }
	    var footnote = React.createElement(
	      'ul',
	      { className: 'contract_status_legend' },
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_WAIT' }),
	        React.createElement(T, { content: 'contract.status.WAIT', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_WAIT_PARTIAL' }),
	        React.createElement(T, { content: 'contract.status.WAIT_PARTIAL', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_WAIT_PAID' }),
	        React.createElement(T, { content: 'contract.status.WAIT_PAID', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_OVERDUE' }),
	        React.createElement(T, { content: 'contract.status.OVERDUE', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_OVERDUE_PARTIAL' }),
	        React.createElement(T, { content: 'contract.status.OVERDUE_PARTIAL', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_OVERDUE_PAID' }),
	        React.createElement(T, { content: 'contract.status.OVERDUE_PAID', component: 'div', className: 'ellipsis' })
	      )
	    );
	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'contract.title.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: this.state.currentStatusField,
	            data: this.state.data,
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'contract.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'installment-contract-dunning',
	          listAction: contractActions.list,
	          exportAction: contractActions.exportDunning,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'over_day',
	          sortDir: 'desc',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: {
	            today: helper.dateToString(new Date()),
	            shop: this.state.data.shop == '*' ? null : this.state.data.shop,
	            current_status: this.state.data.current_status
	          },
	          footer: footnote
	        })
	      )
	    );
	  }
	});

	module.exports = ContractList;

/***/ },

/***/ 870:
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
	var dialogActions = system.dialogActions;
	var toasterActions = system.toasterActions;
	var helper = system.helper;
	var storage = system.storage;
	// var systemStore       = system.systemStore;
	// var sessionStore      = system.sessionStore;

	var redeemActions = __webpack_require__(871);
	var redeemStore = __webpack_require__(872);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexDropdown = widgets.FlexDropdown;

	var storageKey = 'installment.contract.redeem';

	var ContractList = React.createClass({
	  displayName: 'ContractList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    var shops = system.acl.getShopAcl();
	    var option = storage.load(storageKey, { shop_code: '' });
	    var shop_code = '';

	    if (option.shop_code == '') {
	      shop_code = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    } else {
	      shop_code = option.shop_code;
	    }

	    return {
	      data: {
	        shop: shop_code
	      },
	      fields: [{ name: 'sell_date', type: 'text', title: 'info.sell_date', width: '92px', render: function render(row) {
	          return tr.localize(new Date(row.sell_date), { type: 'date', format: 'short' });
	        } }, { name: 'shop_name', title: 'info.shop_name', width: '110px' }, { name: 'company_name', title: 'info.company_name', width: '125px' }, { name: 'product_serial', title: 'info.serial', width: '125px' }, { name: 'product_description', title: 'info.description' }, { name: 'down_payment', title: 'info.down_payment', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.down_payment, 2);
	        } }, { name: 'remain_price', title: 'info.remain_price', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.remain_price, 2);
	        } }, { name: 'sales_staff', title: 'info.sales_staff', width: '100px' }, { name: 'flag', title: 'info.flag', hint: 'info.flag_hint', width: '24px', sort: false }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'installment.contract.new', param: { sellId: row.id }, icon: 'right244', title: 'action.select' })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {},

	  handleShopChange: function handleShopChange(id, value) {
	    storage.save(storageKey, { shop_code: value });
	    this.setState({
	      data: {
	        shop: value
	      }
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  doContractNew: function doContractNew() {
	    this.context.router.transitionTo('setting.contract.edit', { id: 0 });
	  },

	  render: function render() {
	    var list = system.acl.getShopAcl().map(function (item) {
	      return {
	        value: item.code,
	        text: item.code + ' ' + item.name
	      };
	    });
	    if (system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] })) {
	      list.unshift({ value: '*', text: '* ทุกสาขา' });
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
	          React.createElement(T, { content: 'contract.title.list_redeem', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'contract.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleShopChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'installment-contract-redeem',
	          listAction: redeemActions.list,
	          exportAction: redeemActions.export,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'sell_date',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: { shop: this.state.data.shop == '*' ? null : this.state.data.shop }
	        })
	      )
	    );
	  }
	});

	module.exports = ContractList;

/***/ },

/***/ 871:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] }
	});

/***/ },

/***/ 872:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var redeemActions = __webpack_require__(871);

	var contractStore = Reflux.createStore({
	  listenables: [redeemActions],

	  // redeemActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/installment/contract/listRedeem', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      redeemActions.list.done(res.data, res.opt);
	      menuActions.updateCount('contract', res.opt.totalRows);
	    } else {
	      redeemActions.list.error(res.msg);
	    }
	  },

	  onExport: function onExport(param) {
	    ajaxActions.request('/api/installment/contract/exportRedeem', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      redeemActions.export.done(res.file);
	    } else {
	      redeemActions.export.error();
	    }
	  }

	});

	module.exports = contractStore;

/***/ }

});