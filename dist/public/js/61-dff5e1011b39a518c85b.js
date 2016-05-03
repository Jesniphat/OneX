webpackJsonp([61,135],{

/***/ 749:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'paymentOptionList': { children: ['done', 'error'] },
	  'facetList': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'facetEdit': { children: ['done', 'error'] },
	  'getPaymentTerm': { children: ['done', 'error'] },
	  'getContractList': { children: ['done', 'error'] },
	  'savePayment': { children: ['done', 'error'] },
	  'printReceipt': { children: ['done', 'error'] },
	  'getContractDetail': { children: ['done', 'error'] },
	  'deptList': { children: ['done', 'error'] },
	  'getHistoryPaymentTerm': { children: ['done', 'error'] },
	  'exportDept': { children: ['done', 'error'] },
	  'saveProduct': { children: ['done', 'error'] },
	  'getDataProduct': { children: ['done', 'error'] },
	  'getFinanceList': { children: ['done', 'error'] },
	  'voidPayment': { children: ['done', 'error'] },
	  'checkOndate': { children: ['done', 'error'] },
	  'checkCloseCashDaily': { children: ['done', 'error'] }
	});

/***/ },

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

/***/ 791:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);
	var toasterActions = system.toasterActions;
	var helper = system.helper; // require('../../../../../server/lib/Helper');
	var systemActions = system.systemActions; // require('../../system/actions');
	var infoPanelActions = system.infoPanelActions; // require('../../../actions/info-panel');
	var Router = __webpack_require__(160);
	var actions = __webpack_require__(749);

	var dialogActions = system.dialogActions;
	var FlexTextInput = widgets.FlexTextInput; // require('../../../widgets/flex-text-input.jsx');
	var FlexButton = widgets.FlexButton; // require('../../../widgets/flex-button.jsx');
	var FlexDisplayTable = widgets.FlexDisplayTable; // require('../../../widgets/flex-display-table.jsx');
	var FlexDropdown = widgets.FlexDropdown; // require('../../../widgets/flex-dropdown.jsx');
	var FlexIcon = widgets.FlexIcon;
	var FlexTab = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');
	var FlexCheckbox = widgets.FlexCheckbox;
	var FlexRadioGroup = widgets.FlexRadioGroup;

	var ReFlux = __webpack_require__(337);

	var PaymentScreen = React.createClass({
	  displayName: 'PaymentScreen',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [ReFlux.listenTo(actions.getPaymentTerm.done, 'onGetPaymentTermDoneAction'), ReFlux.listenTo(actions.paymentOptionList.done, 'onGetPaymentOptionDoneAction'), ReFlux.listenTo(actions.getContractList.done, 'onGetContractListDoneAction'), ReFlux.listenTo(actions.savePayment.done, 'onSavePaymentDoneAction'), ReFlux.listenTo(actions.printReceipt.done, 'onPrintReceiptDoneAction'), ReFlux.listenTo(actions.getContractDetail.done, 'onGetContractDetailDoneAction'), ReFlux.listenTo(actions.getHistoryPaymentTerm.done, 'onGetHistoryPaymentTermDoneAction'), ReFlux.listenTo(actions.getFinanceList.done, 'onGetFinanceListDoneAction'), ReFlux.listenTo(actions.voidPayment.done, 'onVoidPaymentDoneAction'), ReFlux.listenTo(actions.voidPayment.error, 'onVoidPaymentErrorAction'), ReFlux.listenTo(actions.checkOndate.done, 'onCheckOndateDoneAction'), ReFlux.listenTo(actions.checkCloseCashDaily.done, 'onCheckCloseCashDailyDoneAction')],
	  getInitialState: function getInitialState() {

	    var nationid = this.context.router.getCurrentParams().id;
	    var contractcode = this.context.router.getCurrentParams().contract_code;
	    var flagRedeem = this.context.router.getCurrentParams().redeem;
	    this.flagDupSave = false;
	    //console.log(nationid);
	    return {
	      checkSave: false,
	      contract_status: 'NORMAL',
	      data: {
	        code: '',
	        date: system.sessionStore.getSession().staff.cur_date,
	        amount: 0.00,
	        penalty: 0.00,
	        remark: '',
	        product: '',
	        card_id: nationid,
	        status_discount: false,
	        confirm_discount: '',
	        confirm_savedup: '',
	        max_termnum: ''
	      },
	      expand: {
	        history: false,
	        term: true
	      },
	      listProductData: [],
	      paymentData: [],
	      max_paiddate: '0000-00-00',
	      listPaymentHistory: [],
	      field: {
	        cust_id: {
	          id: 'cust_id',
	          label: 'pos.receipt.card_id',
	          required: true,
	          icon: 'user158'
	        }
	      },
	      fieldPaymentOption: {
	        id: 'list',
	        icon: 'user157',
	        label: 'pos.receipt.paymentoption',
	        list: []
	      },
	      fieldFinanceList: {
	        id: 'financelist',
	        icon: 'user157',
	        label: 'pos.receipt.financelist',
	        list: []
	      },
	      selectedItem: 1,
	      selectedItemText: 'เงินสด',
	      selectedFinanceItem: '',
	      selectedFinanceItemText: '',
	      paymentoption: [],
	      textdata: {
	        nationid: nationid,
	        contractid: contractcode,
	        other: ''
	      },
	      selectData: {
	        sellid: '',
	        contractid: ''
	      },
	      dataSave: {
	        pay_date: '',
	        pay_staff: '',
	        shop_id: '',
	        company_id: '',
	        sell_id: '',
	        cash: '',
	        cr_card: '',
	        transfer: '',
	        balance: '',
	        remark: '',
	        contract_id: '',
	        receipt_item: [],
	        totalamount: 0,
	        status_discount: 'N',
	        cust_name: '',
	        contract_code: '',
	        finance_staff: '',
	        receipt_remark: '',
	        receipt_option: '',
	        flagRedeem: flagRedeem
	      },
	      receipt_item: [],
	      curTab: 'tab1',
	      flagSave: false
	    };
	  },

	  onGetPaymentOptionDoneAction: function onGetPaymentOptionDoneAction(data) {
	    this.state.fieldPaymentOption.list = data.paymentoption.map(function (row) {
	      return {
	        value: row.id,
	        text: row.name
	      };
	    });
	    this.setState({
	      fieldPaymentOption: this.state.fieldPaymentOption
	    });
	  },

	  onGetFinanceListDoneAction: function onGetFinanceListDoneAction(data) {
	    console.log('jack=', data);
	    this.state.fieldFinanceList.list = data.financelist.map(function (row) {
	      return {
	        value: row.id,
	        text: row.display_name
	      };
	    });

	    this.setState({
	      selectedFinanceItem: data.finance_staff_id,
	      fieldFinanceList: this.state.fieldFinanceList
	    });
	  },

	  onVoidPaymentDoneAction: function onVoidPaymentDoneAction(res) {
	    if (res.status === true) {
	      toasterActions.pop({
	        type: 'success',
	        message: 'ยกเลิกรายการชำระเงินสำเร็จ'
	      });
	      actions.getContractList(this.state.textdata);
	      actions.getPaymentTerm(this.state.selectData);
	      actions.getHistoryPaymentTerm(this.state.selectData);
	      this.flagDupSave = false;
	      this.state.data.amount = 0;
	      this.state.data.penalty = 0;
	      this.state.data.remark = '';
	      this.state.receipt_item = [];
	      this.state.dataSave.totalamount = 0;
	      this.setState({
	        flagSave: false
	      });
	    } else {
	      console.log('jack error');
	      toasterActions.pop({
	        type: 'warning',
	        message: 'ยกเลิกรายการชำระเงิน ไม่สำเร็จ'
	      });
	    }
	  },

	  onVoidPaymentErrorAction: function onVoidPaymentErrorAction(res) {
	    if (res.status === false) {
	      toasterActions.pop({
	        type: 'warning',
	        message: 'ยกเลิกรายการชำระเงิน ไม่สำเร็จ'
	      });
	      actions.getHistoryPaymentTerm(this.state.selectData);
	      this.flagDupSave = false;
	      this.state.data.amount = 0;
	      this.state.data.penalty = 0;
	      this.state.data.remark = '';
	      this.state.receipt_item = [];
	      this.state.dataSave.totalamount = 0;
	      this.setState({
	        flagSave: false
	      });
	    }
	  },

	  onProductList: function onProductList(row) {

	    this.state.selectData.sellid = row.sell_id;
	    this.state.selectData.contractid = row.id;
	    this.state.dataSave.balance = row.balance;
	    this.state.dataSave.from_system = row.from_system;
	    this.state.data.code = row.code;
	    //console.log(row.product_detail);

	    this.state.data.product = row.product_detail;
	    console.log(this.state.data);
	    this.state.receipt_item = [];
	    this.state.dataSave.totalamount = 0;
	    actions.getPaymentTerm(this.state.selectData);
	  },

	  onGetContractListDoneAction: function onGetContractListDoneAction(data) {

	    //console.log('donelist', data);
	    var $scope = {};
	    //  console.log('status=',data.contractlist);
	    this.state.contract_status = data.contractlist[0].current_status;
	    //  console.log('checkSave :',this.state.checkSave);
	    if (data.contractlist[0].current_status == 'NORMAL' || data.contractlist[0].current_status == 'DEBT') {
	      this.state.checkSave = false;
	    } else {
	      this.state.checkSave = true;
	    }

	    var person = data.person.map(function (row, i) {
	      $scope.cust_name = row.fullname;
	      return React.createElement(
	        'div',
	        { key: i, className: 'flex-v no-shrink' },
	        React.createElement(
	          'div',
	          { style: { borderBottom: "solid 1px #000", width: "170px" } },
	          React.createElement(
	            'h2',
	            null,
	            '2.เลือกรายการ'
	          )
	        ),
	        React.createElement('div', { style: { height: "5px" } }),
	        React.createElement(
	          'div',
	          null,
	          row.fullname
	        ),
	        React.createElement(
	          'div',
	          null,
	          row.nationid
	        ),
	        React.createElement('div', { style: { height: "5px", borderBottom: "solid 1px #000", width: "170px" } })
	      );
	    });
	    var list = data.contractlist.map(function (row, i) {
	      var f = function () {
	        this.onProductList(row);
	      }.bind(this);
	      return React.createElement(
	        'table',
	        { key: row.id, style: { width: "150px", fontSize: "14px", borderSpacing: "0", cursor: "pointer" } },
	        React.createElement(
	          'tr',
	          { onClick: f, style: i % 2 == 0 ? { backgroundColor: "#f9f9f9" } : { backgroundColor: "#fff" } },
	          React.createElement('td', { colSpan: '2', style: { height: "5px" } })
	        ),
	        React.createElement(
	          'tr',
	          { onClick: f, style: i % 2 == 0 ? { backgroundColor: "#f9f9f9" } : { backgroundColor: "#fff" } },
	          React.createElement(
	            'td',
	            { colSpan: '2' },
	            i + 1,
	            '.',
	            row.product_detail
	          )
	        ),
	        React.createElement(
	          'tr',
	          { onClick: f, style: i % 2 == 0 ? { backgroundColor: "#f9f9f9" } : { backgroundColor: "#fff" } },
	          React.createElement(
	            'td',
	            null,
	            'ยอดจัด'
	          ),
	          React.createElement(
	            'td',
	            { style: { textAlign: "right" } },
	            helper.numberFormat(row.payment_price, 2)
	          )
	        ),
	        React.createElement(
	          'tr',
	          { onClick: f, style: i % 2 == 0 ? { backgroundColor: "#f9f9f9" } : { backgroundColor: "#fff" } },
	          React.createElement(
	            'td',
	            { style: { borderBottom: "dotted 1px #cbcbcb" } },
	            'ค้าง'
	          ),
	          React.createElement(
	            'td',
	            { style: { textAlign: "right", borderBottom: "dotted 1px #cbcbcb" } },
	            helper.numberFormat(row.balance, 2)
	          )
	        )
	      );
	    }.bind(this));

	    infoPanelActions.show('pos.receipt.list', React.createElement(
	      'div',
	      { className: 'flex-v' },
	      person,
	      React.createElement(
	        'div',
	        { className: 'flex-v can-grow', style: { overflowY: 'auto' } },
	        list
	      )
	    ));

	    this.state.dataSave.cust_name = $scope.cust_name;

	    this.setState({
	      checkSave: this.state.checkSave,
	      contract_status: this.state.contract_status,
	      dataSave: this.state.dataSave
	    });
	  },

	  componentDidMount: function componentDidMount() {
	    //  systemActions.setPageHeader('Hello World');
	    actions.paymentOptionList();
	    infoPanelActions.show('pos.receipt.list', React.createElement('div', { className: 'box10' }));

	    actions.getContractList(this.state.textdata);
	    actions.getContractDetail(this.state.textdata);
	    actions.checkCloseCashDaily();
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  handleChange: function handleChange(id, value) {
	    //console.log('data=',value);
	    if (id == 'date') {
	      var curDate = new Date(system.sessionStore.getSession().staff.cur_date);
	      var selectDate = new Date(value);
	      if (selectDate > curDate) {
	        value = system.sessionStore.getSession().staff.cur_date;
	        toasterActions.pop({
	          type: 'warning',
	          message: 'ไม่สามารถเลือกวันที่ล่วงหน้าได้'
	        });
	      } else {
	        if (selectDate != curDate) {
	          var obj = { selectDate: value };
	          actions.checkOndate(obj);
	        }
	      }
	    }

	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	  },

	  onCodeEnter: function onCodeEnter(id, value) {
	    //console.log(value);
	    //console.log(this.state.data.code);
	    actions.getPaymentTerm(value);
	  },

	  onGetPaymentTermDoneAction: function onGetPaymentTermDoneAction(data) {
	    //console.log(system.sessionStore.getSession());
	    var flagSave = data.flagSave;
	    if (this.state.checkSave == true) {
	      flagSave = true;
	    }

	    this.setState({
	      listProductData: data.contract,
	      paymentData: data.payment,
	      max_paiddate: data.max_paiddate,
	      checkSave: flagSave
	    });
	  },

	  handleListChange: function handleListChange(id, value) {

	    if (id == 'financelist') {
	      var _financeList = this.state.fieldFinanceList.list.filter(function (finance) {
	        return finance.value == value;
	      });

	      this.setState({
	        selectedFinanceItem: value,
	        selectedFinanceItemText: _financeList[0].text
	      });
	    } else {
	      var payment_option = this.state.fieldPaymentOption.list.filter(function (payment) {
	        return payment.value == value;
	      });

	      this.setState({
	        selectedItem: value,
	        selectedItemText: payment_option[0].text
	      });
	    }
	  },

	  onKeyUp: function onKeyUp(id, value) {
	    var _chk = 'N';
	    if (id == 'card_id') {
	      //console.log(value);
	      //if(value != ''){
	      this.state.textdata.nationid = value;
	      //}
	    }
	    if (id == 'code') {
	      //if(value != ''){
	      this.state.textdata.contractid = value;
	      //  }
	    }
	    if (id == 'other') {
	      //if(value != ''){
	      this.state.textdata.other = value;
	      //}
	    }
	    if (this.state.textdata.nationid.length == 13) {
	      console.log(this.state.textdata.nationid.length);
	      if (this.state.textdata.nationid != '' || this.state.textdata.contractid != '' || this.state.textdata.other != '') {
	        actions.getContractList(this.state.textdata);
	      }
	    }
	  },

	  onSavePaymentDoneAction: function onSavePaymentDoneAction(data) {
	    toasterActions.pop({
	      type: 'success',
	      message: 'บันทึกข้อมูลเรียบร้อย'
	    });
	    actions.getContractList(this.state.textdata);
	    actions.getPaymentTerm(this.state.selectData);
	    actions.getHistoryPaymentTerm(this.state.selectData);
	    this.state.dataSave.receipt_id = data.receipt_id;
	    //console.log(this.state.data.receipt_id);
	    //console.log('print');
	    actions.printReceipt(this.state.dataSave);

	    this.state.data.amount = 0;
	    this.state.data.penalty = 0;
	    this.state.data.remark = '';
	    this.state.receipt_item = [];
	    this.state.dataSave.totalamount = 0;
	    this.flagDupSave = false;
	    this.setState({
	      flagSave: false
	    });

	    if (this.state.dataSave.flagRedeem == 'Y') {
	      console.log('redirect');
	      this.context.router.transitionTo('pos.receipt.screen', { id: this.state.textdata.nationid, contract_code: this.state.textdata.contractid, redeem: 'N' });
	    }
	  },

	  onGetContractDetailDoneAction: function onGetContractDetailDoneAction(data) {

	    //console.log(data);
	    //this.state.data.code = data.contractdetail[0].code;
	    this.state.selectData.sellid = data.contractdetail[0].sell_id;
	    this.state.selectData.contractid = data.contractdetail[0].id;
	    this.state.dataSave.balance = data.contractdetail[0].balance;
	    this.state.dataSave.from_system = data.contractdetail[0].from_system;
	    this.state.data.code = data.contractdetail[0].code;
	    //console.log(row.product_detail);
	    this.state.data.product = data.contractdetail[0].product_detail;
	    this.state.data.status_discount = data.contractdetail[0].status_discount == 'Y' ? true : false;
	    //console.log(this.state.data);
	    this.state.receipt_item = [];
	    actions.getPaymentTerm(this.state.selectData);

	    actions.getHistoryPaymentTerm(this.state.selectData);

	    this.setState({
	      selectedFinanceItem: data.contractdetail[0].finance_staff_id
	    });
	    var contracttype = data.contractdetail[0].type;
	    var shop_id = system.sessionStore.getSession().shop.id;
	    var contract_id = data.contractdetail[0].id;
	    var finance_id = data.contractdetail[0].finance_staff_id;
	    var sell_staff_id = data.contractdetail[0].sell_staff_id;
	    actions.getFinanceList(shop_id, contract_id, finance_id, contracttype, sell_staff_id);
	  },

	  onPrintReceiptDoneAction: function onPrintReceiptDoneAction(data) {
	    window.open(data.pdfFile);
	  },

	  doAddPayment: function doAddPayment() {
	    //console.log(this.state.dataSave.amount);
	    var _chkSave = 'Y';

	    if (this.state.selectData.contractid == '') {
	      _chkSave = 'N';
	      toasterActions.pop({
	        type: 'warning',
	        message: 'กรุณาเลือกสัญญาที่ต้องการชำระเงิน'
	      });
	    }

	    if (this.state.data.date == '' && _chkSave == 'Y') {
	      _chkSave = 'N';
	      toasterActions.pop({
	        type: 'warning',
	        message: 'กรุณาเลือกวันที่ชำระเงิน'
	      });
	    }

	    if ((typeof this.state.data.amount == "undefined" || this.state.data.amount == 0) && _chkSave == 'Y') {
	      _chkSave = 'N';
	      toasterActions.pop({
	        type: 'warning',
	        message: 'กรุณากรอกจำนวนเงิน'
	      });
	    }

	    if (_chkSave == 'Y') {

	      var TotalAmount = parseFloat(this.state.data.amount);
	      var TotalPenalty = parseFloat(this.state.data.penalty);
	      var ReceiptRemark = '';
	      for (var i = 0; i < this.state.receipt_item.length; i++) {
	        TotalAmount = TotalAmount + parseFloat(this.state.receipt_item[i].amount);
	        TotalPenalty = TotalPenalty + parseFloat(this.state.receipt_item[i].penalty);
	        if (ReceiptRemark != '') {
	          ReceiptRemark = ReceiptRemark + this.state.receipt_item[i].remark;
	        } else {
	          ReceiptRemark = this.state.receipt_item[i].remark;
	        }
	      };

	      var row = {
	        num: this.state.receipt_item.length + 1,
	        pay_date: this.state.data.date,
	        amount: this.state.data.amount,
	        penalty: this.state.data.penalty,
	        payment_option_id: this.state.selectedItem,
	        paymentoption: this.state.selectedItemText,
	        remark: this.state.data.remark
	      };

	      this.state.dataSave.amount = TotalAmount;
	      this.state.dataSave.penalty = TotalPenalty;
	      this.state.receipt_item.push(row);
	      //console.log(this.state.dataSave.penalty);
	      this.state.dataSave.totalamount = TotalAmount + TotalPenalty;

	      this.setState({
	        receipt_item: this.state.receipt_item
	      });

	      this.state.data.amount = 0;
	      this.state.data.penalty = 0;
	      this.state.data.remark = '';
	      //console.log(this.state.dataSave.amount);
	    }
	  },

	  onPaymentDelete: function onPaymentDelete(i) {

	    this.state.receipt_item.splice(i, 1);

	    var TotalAmount = 0;
	    var TotalPenalty = 0;

	    for (var i = 0; i < this.state.receipt_item.length; i++) {
	      TotalAmount = TotalAmount + parseFloat(this.state.receipt_item[i].amount);
	      TotalPenalty = TotalPenalty + parseFloat(this.state.receipt_item[i].penalty);
	    };
	    this.state.dataSave.amount = TotalAmount;
	    this.state.dataSave.penalty = TotalPenalty;

	    this.state.dataSave.totalamount = TotalAmount + TotalPenalty;

	    this.setState({
	      receipt_item: this.state.receipt_item
	    });
	  },

	  doPaymentSave: function doPaymentSave() {
	    console.log('flagDupSave:', this.flagDupSave);
	    //console.log(system.sessionStore.getSession().shop.id);
	    if (this.flagDupSave == false) {

	      this.setState({
	        flagSave: this.state.flagSave == false ? true : this.state.flagSave
	      });

	      this.flagDupSave = this.flagDupSave == false ? true : this.flagDupSave;

	      var _chkSave = 'Y';

	      if (this.state.receipt_item.length == 0) {
	        _chkSave = 'N';
	        this.flagDupSave = false;
	        this.setState({
	          flagSave: false
	        });
	        toasterActions.pop({
	          type: 'warning',
	          message: 'กรุณาทำรายการชำระเงิน'
	        });
	      }

	      if (_chkSave == 'Y') {

	        if (this.state.data.status_discount === true) {
	          var a = this;
	          dialogActions.show({
	            title: 'receipt.confirm_discount_title',
	            content: this.createParameter(),
	            actions: [{ id: 'ok', icon: 'check52', label: 'action.confirm' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	          }, function (isCancel, action_id) {
	            if (isCancel || action_id == 'cancel') {
	              a.flagDupSave = false;
	              a.setState({
	                flagSave: false
	              });
	              return;
	            } else {
	              a.onActionSave();
	            }
	          });
	        } else {
	          //console.log('max_paiddate:',this.state.max_paiddate);
	          //console.log('cur_date:',system.sessionStore.getSession().staff.cur_date);
	          if (this.state.max_paiddate == this.state.data.date) {
	            var a = this;
	            dialogActions.show({
	              title: 'receipt.confirm_savedup_title',
	              content: this.createParameterSaveDup(),
	              actions: [{ id: 'ok', icon: 'check52', label: 'action.confirm' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	            }, function (isCancel, action_id) {
	              if (isCancel || action_id == 'cancel') {
	                a.flagDupSave = false;
	                a.setState({
	                  flagSave: false
	                });
	                return;
	              } else {
	                if (a.state.data.confirm_savedup != '') {
	                  a.onActionSave();
	                } else {
	                  a.flagDupSave = false;
	                  a.setState({
	                    flagSave: false
	                  });
	                  toasterActions.pop({
	                    type: 'warning',
	                    message: 'กรุณากรอกข้อความยืนยัน'
	                  });
	                }
	              }
	            });
	          } else {
	            console.log('111111111');
	            this.onActionSave();
	          }
	        }
	      }
	    }
	  },

	  onActionSave: function onActionSave() {

	    var chkSavePayment = 'Y';

	    if (this.state.data.status_discount === true) {

	      if (this.state.data.confirm_discount == this.state.dataSave.balance - this.state.dataSave.amount) {} else {
	        chkSavePayment = 'N';
	        this.flagDupSave = false;
	        this.setState({
	          flagSave: false
	        });
	        toasterActions.pop({
	          type: 'warning',
	          message: 'ยอดปิดส่วนลดไม่ถูกต้อง'
	        });
	      }
	    }
	    if (chkSavePayment == 'Y') {

	      var ReceiptRemark = '';
	      var ReceiptOption = '';
	      for (var i = 0; i < this.state.receipt_item.length; i++) {

	        if (ReceiptRemark != '') {
	          ReceiptRemark = ReceiptRemark + ',' + this.state.receipt_item[i].remark;
	        } else {
	          ReceiptRemark = this.state.receipt_item[i].remark;
	        }

	        if (ReceiptOption != '') {
	          ReceiptOption = ReceiptOption + ',' + this.state.receipt_item[i].paymentoption;
	        } else {
	          ReceiptOption = this.state.receipt_item[i].paymentoption;
	        }
	      };

	      this.state.dataSave.pay_date = this.state.data.date;
	      this.state.dataSave.pay_staff = system.sessionStore.getSession().staff.id;
	      this.state.dataSave.shop_id = system.sessionStore.getSession().shop.id;
	      this.state.dataSave.company_id = '0';
	      this.state.dataSave.sell_id = this.state.selectData.sellid;
	      // this.state.dataSave.cash='0';
	      // this.state.dataSave.cr_card='0';
	      // this.state.dataSave.transfer='0';
	      this.state.dataSave.code_year = new Date().toJSON().slice(2, 7).replace('-', '');
	      this.state.dataSave.code_year_oracle = system.sessionStore.getSession().shop.code + '-R' + new Date().toJSON().slice(0, 7).replace('-', '') + '/';
	      this.state.dataSave.payment_type = 'CONTRACT';

	      //this.state.dataSave.penalty=this.state.data.penalty;
	      this.state.dataSave.remark = this.state.data.remark;
	      this.state.dataSave.contract_id = this.state.selectData.contractid;
	      this.state.dataSave.receipt_item = this.state.receipt_item;
	      this.state.dataSave.description = this.state.data.product;
	      this.state.dataSave.status_discount = this.state.data.status_discount == true ? 'Y' : 'N';
	      this.state.dataSave.contract_code = this.state.textdata.contractid;
	      this.state.dataSave.finance_staff = this.state.selectedFinanceItem;
	      this.state.dataSave.receipt_remark = ReceiptRemark + this.state.data.confirm_savedup;
	      this.state.dataSave.receipt_option = ReceiptOption;
	      //this.state.dataSave.flagRedeem = this.state.dataSave.flagRedeem;
	      // console.log(this.state.dataSave);
	      actions.savePayment(this.state.dataSave);
	    }
	  },

	  onGetHistoryPaymentTermDoneAction: function onGetHistoryPaymentTermDoneAction(data) {
	    //console.log(data.paymentHistory);
	    this.setState({
	      listPaymentHistory: data.paymentHistory
	      //paymentData:data.payment
	    });
	  },

	  handleTabClick: function handleTabClick(id) {
	    this.setState({
	      curTab: id
	    });
	  },

	  onRePrint: function onRePrint(row) {
	    actions.printReceipt({ contract_id: row.contract_id, receipt_id: row.id });
	  },

	  onVoid: function onVoid(row) {
	    var contract_id = this.state.selectData.contractid;
	    dialogActions.show({
	      title: 'receipt.confirm_void_title',
	      content: React.createElement(
	        'div',
	        null,
	        'คุณต้องการยกเลิกรายการ ใบเสร็จเลขที่ ',
	        row.code,
	        ' นี้หรือไม่ เป็นจำนวนเงินทั้งสิ้น ',
	        helper.numberFormat(row.amount, 2),
	        ' บาท'
	      ),
	      actions: [{ id: 'ok', icon: 'check52', label: 'action.confirm' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	    }, function (isCancel, action_id) {
	      if (isCancel || action_id == 'cancel') {
	        return;
	      }

	      var obj = {
	        contract_id: contract_id,
	        receipt_id: row.id,
	        receipt_code: row.code,
	        void_staff: system.sessionStore.getSession().staff.id,
	        term_num: row.term_num
	      };
	      //console.log(obj);
	      actions.voidPayment(obj);
	    });
	    //actions.printReceipt({contract_id:row.contract_id,receipt_id:row.id});
	  },

	  toggleDiscount: function toggleDiscount(p_id) {
	    this.state.data[p_id] = !!!this.state.data[p_id];
	    console.log(this.state.data[p_id]);
	    this.setState({
	      data: this.state.data
	    });
	  },

	  handleChangeDialog: function handleChangeDialog(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	    dialogActions.update(this.createParameter());
	  },

	  handleChangeDialogDup: function handleChangeDialogDup(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	    dialogActions.update(this.createParameterSaveDup());
	  },

	  createParameter: function createParameter() {
	    var field = {
	      confirm_discount: {
	        id: 'confirm_discount',
	        label: 'receipt.confirm_discount',
	        required: true
	      }
	    };

	    var obj = React.createElement('div', { className: 'flex-form', style: { width: 300, margin: '0 auto' } });

	    param = React.createElement(
	      'div',
	      null,
	      React.createElement(FlexTextInput, {
	        field: field.confirm_discount,
	        data: this.state.data,
	        onChange: this.handleChangeDialog
	      })
	    );

	    if (param != null) {
	      // Hack React. //
	      if (obj._store.originalProps.children == undefined) obj._store.originalProps.children = [];
	      if (obj._store.props.children == undefined) obj._store.props.children = [];

	      obj._store.originalProps.children.push(param);
	      obj._store.props.children.push(param);
	      // Hack React. //
	    }

	    return obj;
	  },

	  createParameterSaveDup: function createParameterSaveDup() {
	    var field = {
	      confirm_savedup: {
	        id: 'confirm_savedup',
	        label: 'receipt.confirm_savedup',
	        required: true
	      }
	    };

	    var obj = React.createElement('div', { className: 'flex-form', style: { width: 350, margin: '0 auto' } });

	    param = React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        null,
	        'วันนี้มีการบันทึกค่างวดเข้ามาแล้ว ต้องการบันทึกอีกหรือไม่'
	      ),
	      React.createElement(
	        'div',
	        { style: { height: '4px' } },
	        '่'
	      ),
	      React.createElement(FlexTextInput, {
	        field: field.confirm_savedup,
	        data: this.state.data,
	        onChange: this.handleChangeDialogDup
	      })
	    );

	    if (param != null) {
	      // Hack React. //
	      if (obj._store.originalProps.children == undefined) obj._store.originalProps.children = [];
	      if (obj._store.props.children == undefined) obj._store.props.children = [];

	      obj._store.originalProps.children.push(param);
	      obj._store.props.children.push(param);
	      // Hack React. //
	    }

	    return obj;
	  },

	  onCheckOndateDoneAction: function onCheckOndateDoneAction(data) {

	    if (this.state.contract_status == 'NORMAL' || this.state.contract_status == 'DEBT') {
	      this.state.checkSave = data.flagSave;
	    }
	    //console.log('flagSave:',data.flagSave);
	    if (data.flagSave == true) {
	      toasterActions.pop({
	        type: 'warning',
	        message: 'ไม่สามารถทำรายการย้อนหลังได้'
	      });
	    }

	    this.setState({
	      checkSave: this.state.checkSave
	    });
	  },

	  onCheckCloseCashDailyDoneAction: function onCheckCloseCashDailyDoneAction(data) {
	    if (data.flagLink == 'Y') {
	      this.context.router.transitionTo('pos.cashDaily.list', {});
	    }
	  },

	  render: function render() {

	    var fields = {
	      card_id: {
	        id: 'card_id',
	        label: 'pos.receipt.card_id',
	        required: true,
	        icon: 'user158',
	        maxLength: 13,
	        pattern: '^[0-9]{13}$'
	      },
	      code: {
	        id: 'code',
	        label: 'pos.receipt.code',
	        icon: 'list88'
	      },
	      amount: {
	        id: 'amount',
	        label: 'pos.receipt.amount',
	        autofocus: true,
	        required: true
	      },
	      totalamount: {
	        id: 'totalamount',
	        label: 'pos.receipt.totalamount',
	        readonly: true
	      },
	      date: {
	        id: 'date',
	        type: 'date',
	        label: 'pos.receipt.date',
	        icon: 'user158'
	      },
	      penalty: {
	        id: 'penalty',
	        label: 'pos.receipt.penalty'
	      },
	      other: {
	        id: 'other',
	        label: 'pos.receipt.other',
	        icon: 'smartphone20'
	      },
	      payment_type: {
	        id: 'payment_type',
	        type: 'dropdown',
	        label: 'pos.receipt.type',
	        icon: 'list88',
	        list: [{ value: 'เงินสด', text: 'เงินสด' }, { value: 'บัตรเครดิต', text: 'บัตรเครดิต' }]
	      },
	      remark: {
	        id: 'remark',
	        label: 'pos.receipt.remark',
	        icon: 'list88'
	      },
	      status_discount: {
	        id: 'status_discount',
	        label: 'pos.receipt.status_discount',
	        type: 'checkbox'
	      }
	    };

	    var productField = [{ name: 'term_num', label: 'pos.receipt.no', width: 40, render: function render(row) {
	        return row.term_num;
	      } }, { name: 'due_date', label: 'pos.receipt.due_date', width: 150, render: function render(row) {
	        var date = tr.localize(new Date(row.due_date), { type: 'date', format: 'long' });
	        if (row.paid_date == '0000-00-00') {
	          date = React.createElement(
	            'div',
	            null,
	            tr.localize(new Date(row.due_date), { type: 'date', format: 'long' }),
	            React.createElement(
	              'span',
	              { style: { color: "red" } },
	              row.diffday
	            )
	          );
	        }
	        return date;
	      } }, { name: 'paid_date', label: 'pos.receipt.date', width: 150, render: function render(row) {
	        var pay_date = '-';
	        if (row.paid_date != '0000-00-00') {
	          pay_date = React.createElement(
	            'div',
	            null,
	            tr.localize(new Date(row.paid_date), { type: 'date', format: 'long' }),
	            React.createElement(
	              'span',
	              { style: { color: "red" } },
	              row.diffday
	            )
	          );
	        }
	        return pay_date;
	      } }, { name: 'due_amount', label: 'pos.receipt.due_amount', width: 100, render: function render(row) {
	        return React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'div',
	            { className: 'right', style: { width: "80px" } },
	            helper.numberFormat(row.due_amount, 2)
	          )
	        );
	      } }, { name: 'paid_amount', label: 'pos.receipt.paid_amount', width: 100, className: 'right', render: function render(row) {
	        return React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'div',
	            { className: 'right', style: { width: "80px" } },
	            helper.numberFormat(row.paid_amount, 2)
	          )
	        );
	      } }, { name: 'balance', label: 'pos.receipt.balance', width: 100, className: 'right', render: function render(row) {
	        var _balance = '-';
	        if (row.balance != '-') {
	          _balance = React.createElement(
	            'div',
	            null,
	            React.createElement(
	              'div',
	              { className: 'right', style: { width: "80px" } },
	              helper.numberFormat(row.balance, 2)
	            )
	          );
	        }
	        return _balance;
	      } }, { name: 'discount', label: 'pos.receipt.discount', width: 100, className: 'right', render: function render(row) {
	        return React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'div',
	            { className: 'right', style: { width: "80px" } },
	            helper.numberFormat(row.discount, 2)
	          )
	        );
	      } }];

	    var paymentTermField = [{ name: 'num', label: 'pos.receipt.no', width: 40, render: function render(row, i) {
	        return i + 1;
	      } }, { name: 'pay_date', label: 'pos.receipt.date', width: 120, render: function render(row) {
	        return React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'div',
	            { className: 'left', style: { width: "100px" } },
	            tr.localize(new Date(row.pay_date), { type: 'date', format: 'long' })
	          )
	        );
	      } }, { name: 'amount', label: 'pos.receipt.paid_amount', width: 60, render: function render(row) {
	        return React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'div',
	            { className: 'right', style: { width: "60px" } },
	            helper.numberFormat(row.amount, 2)
	          )
	        );
	      } }, { name: 'penalty', label: 'pos.receipt.penalty', width: 60, render: function render(row) {
	        return React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'div',
	            { className: 'right', style: { width: "60px" } },
	            helper.numberFormat(row.penalty, 2)
	          )
	        );
	      } }, { name: 'paymentoption', label: 'pos.receipt.paymentoption', width: 60, render: function render(row) {
	        return row.paymentoption;
	      } }, { name: 'remark', label: 'pos.receipt.remark', width: 100, render: function render(row) {
	        return row.remark;
	      } }, { name: 'actions', type: 'actions', width: 2 * 15 + 'px', render: function (row, i) {
	        var f = function () {
	          this.onPaymentDelete(i);
	        }.bind(this);
	        return React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { onClick: f },
	            React.createElement(FlexIcon, { icon: 'clear5', title: 'action.select' })
	          )
	        );
	      }.bind(this) }];

	    // {name:'display_name',label:'pos.payment.staff',width:100, className:'right',render:function(row){
	    //   return row.display_name;
	    // }},
	    var paymentHistory = [{ name: 'code', label: 'pos.receipt.receipt_code', width: 150, render: function render(row) {
	        return row.status == 'VOID' ? React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'del',
	            null,
	            row.code
	          )
	        ) : React.createElement(
	          'div',
	          null,
	          row.code
	        );
	      } }, { name: 'system_date', label: 'pos.receipt.system_date', type: 'date', width: 120, render: function render(row) {
	        return tr.localize(new Date(row.system_date), { type: 'datetime', format: 'short' });
	      } }, { name: 'pay_date', label: 'pos.receipt.date', width: 100, render: function render(row) {
	        return tr.localize(new Date(row.pay_date), { type: 'date', format: 'short' });
	      } }, { name: 'term_num', label: 'pos.receipt.term', width: 50, render: function render(row) {
	        return row.term_num;
	      } }, { name: 'option_name', label: 'pos.receipt.payment_option', width: 90, render: function render(row) {
	        return row.option_name;
	      } }, { name: 'amount', label: 'pos.receipt.amount', width: 90, render: function render(row) {
	        return React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'div',
	            { className: 'right', style: { width: "70px" } },
	            helper.numberFormat(row.amount, 2)
	          )
	        );
	      } }, { name: 'penalty', label: 'pos.receipt.penalty', width: 70, render: function render(row) {
	        return React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'div',
	            { className: 'right', style: { width: "60px" } },
	            helper.numberFormat(row.penalty, 2)
	          )
	        );
	      } }, { name: 'remark', label: 'pos.receipt.remark', width: 90, render: function render(row) {
	        return React.createElement(
	          'div',
	          { title: row.remark },
	          row.remark
	        );
	      } }, { name: 'display_name', label: 'pos.receipt.staff', width: 80, render: function render(row) {
	        return row.display_name;
	      } }, { name: 'actions', type: 'actions', width: 2 * 40 + 'px', render: function (row, i) {
	        var f = function () {
	          this.onRePrint(row);
	        }.bind(this);
	        var v = function () {
	          this.onVoid(row);
	        }.bind(this);
	        //console.log('staff:',system.sessionStore.getSession().staff);
	        return row.code != '' ? React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { onClick: f },
	            React.createElement(FlexIcon, { icon: 'printer88', title: 'action.print' })
	          ),
	          row.status == 'NORMAL' && row.check_date == 'Y' && row.void == 'Y' ? React.createElement(
	            'div',
	            { onClick: v },
	            React.createElement(FlexIcon, { icon: 'do10', title: 'action.void' })
	          ) : ''
	        ) : '';
	      }.bind(this) }];

	    var listTab = [{ id: 'tab1', icon: 'bubble8', text: 'pos.receipt.paymentterm' }, { id: 'tab2', icon: 'bubble8', text: 'pos.receipt.paymenthistory' }];

	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow flex' },
	          React.createElement(
	            'div',
	            { className: 'panel8' },
	            this.state.data.product
	          ),
	          React.createElement(
	            'div',
	            null,
	            this.state.dataSave.flagRedeem == 'Y' ? React.createElement(
	              'div',
	              { style: { color: 'red', textAlign: 'right' } },
	              'ชำระค่าไถ่ถอนสินค้า'
	            ) : ''
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box10 flex flex-form' },
	          React.createElement(
	            'div',
	            { className: 'panel4' },
	            React.createElement(FlexTextInput, {
	              field: fields.card_id,
	              data: this.state.data,
	              onChange: this.handleChange,
	              onKeyUp: this.onKeyUp,
	              onKeyDown: this.onKeyDown,
	              live: true
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel4' },
	            React.createElement(FlexTextInput, {
	              field: fields.code,
	              data: this.state.data,
	              onChange: this.handleChange,
	              onEnter: this.onCodeEnter,
	              onKeyUp: this.onKeyUp
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel4' },
	            React.createElement(FlexTextInput, {
	              field: fields.other,
	              data: this.state.data,
	              onChange: this.handleChange,
	              onKeyUp: this.onKeyUp
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel10' },
	          React.createElement(FlexTab, { list: listTab, selected: this.state.curTab, onClick: this.handleTabClick })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel10', style: this.state.curTab == 'tab1' ? { display: 'block' } : { display: 'none' } },
	          React.createElement(FlexDisplayTable, {
	            fields: productField,
	            data: this.state.listProductData,
	            displayRows: 4
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel10', style: this.state.curTab == 'tab2' ? { display: 'block' } : { display: 'none' } },
	          React.createElement(FlexDisplayTable, {
	            fields: paymentHistory,
	            data: this.state.listPaymentHistory,
	            displayRows: 5
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'box10 flex flex-form' },
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(
	              'h2',
	              null,
	              'รายการชำระ'
	            ),
	            React.createElement(
	              'div',
	              { className: 'box6' },
	              React.createElement(FlexDisplayTable, {
	                fields: paymentTermField,
	                data: this.state.receipt_item,
	                displayRows: 6
	              }),
	              React.createElement(FlexTextInput, {
	                field: fields.totalamount,
	                data: this.state.dataSave
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel4' },
	            React.createElement(
	              'div',
	              { className: 'box4' },
	              React.createElement(
	                'h2',
	                null,
	                '3.รับชำระ'
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel4 flex' },
	                React.createElement(
	                  'div',
	                  { style: { width: '200px' } },
	                  React.createElement(FlexTextInput, { field: fields.date, data: this.state.data, onChange: this.handleChange })
	                ),
	                React.createElement('div', { style: { width: '8px' } }),
	                React.createElement(
	                  'div',
	                  { style: { width: '170px' } },
	                  React.createElement(FlexDropdown, {
	                    field: this.state.fieldPaymentOption,
	                    data: { list: this.state.selectedItem },
	                    onChange: this.handleListChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel4' },
	                React.createElement(FlexDropdown, {
	                  field: this.state.fieldFinanceList,
	                  data: { financelist: this.state.selectedFinanceItem },
	                  onChange: this.handleListChange
	                })
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel4' },
	                React.createElement(FlexTextInput, {
	                  field: fields.amount,
	                  data: this.state.data,
	                  onChange: this.handleChange,
	                  autoSelect: true
	                })
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel4' },
	                React.createElement(FlexTextInput, {
	                  field: fields.penalty,
	                  data: this.state.data,
	                  onChange: this.handleChange,
	                  autoSelect: true
	                })
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel4' },
	                React.createElement(FlexTextInput, { field: fields.remark, data: this.state.data, onChange: this.handleChange })
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel4' },
	                React.createElement(FlexCheckbox, {
	                  field: fields.status_discount,
	                  data: this.state.data,
	                  onChange: this.toggleDiscount
	                })
	              ),
	              React.createElement('div', { style: { height: '5px' } }),
	              React.createElement(
	                'div',
	                { className: 'box4 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel2' },
	                  React.createElement(FlexButton, {
	                    label: 'pos.action.add',
	                    icon: 'add186',
	                    'default': true,
	                    onClick: this.doAddPayment,
	                    disabled: this.state.checkSave
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel2' },
	                  React.createElement(FlexButton, {
	                    label: 'action.save',
	                    icon: 'save20',
	                    'default': true,
	                    onClick: this.doPaymentSave,
	                    disabled: this.state.checkSave
	                  })
	                )
	              )
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = PaymentScreen;

/***/ },

/***/ 792:
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
	var storageKey = 'pos.receipt.deptlist';

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;

	var receiptAction = __webpack_require__(749);

	var ReceiptDeptList = React.createClass({
	  displayName: 'ReceiptDeptList',


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
	      fields: [{ name: 'system_date', type: 'daterange', title: 'receipt.sign_date', width: '88px', render: function render(row) {
	          //console.log(row.sign_date.substr(0,10));
	          return tr.localize(new Date(row.system_date.substr(0, 10)), { type: 'date', format: 'short' });
	        } }, { name: 'pay_date', type: 'daterange', title: 'receipt.pay_date', width: '88px', render: function render(row) {
	          //console.log(row.sign_date.substr(0,10));
	          return tr.localize(new Date(row.pay_date.substr(0, 10)), { type: 'date', format: 'short' });
	        } }, { name: 'code', title: 'receipt.code', width: '150px', render: function render(row) {
	          if (!row.code || row.code.length != 16) {
	            return row.code;
	          }
	          return row.code.substr(8, 6);
	        } }, { name: 'product_detail', title: 'receipt.product_detail' }, { name: 'fullname', title: 'receipt.customer', width: '120px' }, { name: 'display_name', title: 'receipt.pay_staff', width: '120px' }, { name: 'amount', title: 'receipt.amount', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.amount, 2);
	        } }, { name: 'name', title: 'receipt.shop_name', width: '80px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'pos.receipt.history', param: { id: row.contract_id }, icon: 'right244', title: 'action.select' })
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

	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'receipt.title.deptlist', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'receipt.filter_shop', list: list },
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
	          id: 'pos-receipt-deptlist',
	          listAction: receiptAction.deptList,
	          exportAction: receiptAction.exportDept,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'system_date',
	          sortDir: 'ASC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: {
	            today: helper.dateToString(new Date()),
	            shop: this.state.data.shop == '*' ? null : this.state.data.shop
	          }
	        })
	      )
	    );
	  }
	});

	module.exports = ReceiptDeptList;

/***/ },

/***/ 793:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _React$createClass;

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
	var FlexDisplayTable = widgets.FlexDisplayTable; // require('../../../widgets/flex-display-table.jsx');

	var actions = __webpack_require__(774);
	var actionsReceipt = __webpack_require__(749);
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
	  if (!code || code.length != 16) {
	    return code;
	  }
	  return code.substr(0, 5) + '-' + code.substr(5, 3) + '-' + code.substr(8, 6) + '-' + code.substr(14, 2);
	};

	var ContractEdit = React.createClass((_React$createClass = {
	  displayName: 'ContractEdit',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(actions.getById.done, 'onGetByIdDoneAction'), Reflux.listenTo(actions.save.done, 'onSaveDoneAction'), Reflux.listenTo(actions.save.error, 'onSaveErrorAction'), Reflux.listenTo(actions.getCloseReturn.done, 'onGetCloseReturnDoneAction'), Reflux.listenTo(actions.getListCollection.done, 'onGetListCollectionDoneAction'), Reflux.listenTo(actions.saveCollection.done, 'onSaveCollectionDoneAction'), Reflux.listenTo(actionsReceipt.getPaymentTerm.done, 'onGetPaymentTermDoneAction'), Reflux.listenTo(actionsReceipt.getHistoryPaymentTerm.done, 'onGetHistoryPaymentTermDoneAction'), Reflux.listenTo(actionsReceipt.printReceipt.done, 'onPrintReceiptDoneAction')],

	  getInitialState: function getInitialState() {
	    var _fields, _ref;

	    var id = parseInt(this.context.router.getCurrentParams().id);
	    var flagClose = this.context.router.getCurrentParams().close;
	    var pageBack = this.context.router.getCurrentParams().pageback;
	    if (!pageBack) {
	      pageBack = 'installment.contract.list';
	    }
	    //console.log(flagClose);
	    return _ref = {
	      id: id,
	      flagClose: flagClose,
	      pageBack: pageBack,
	      listProductData: [],
	      listPaymentHistory: [],
	      contract: {
	        customer: {},
	        co: {},
	        cardAddr: {},
	        customerAddr: {},
	        workAddr: {},
	        coCardAddr: {},
	        coAddr: {},
	        coWorkAddr: {},
	        return: {}
	      },
	      return: {},
	      expand: {
	        customer: false,
	        co: false,
	        payment_term: false,
	        close_return: flagClose == 'Y' ? 'true' : false
	      },
	      paymentTerm: [],
	      refContract: [],
	      returndetail: [],
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
	        },
	        co_nationid: {
	          id: 'co.nationid',
	          type: 'text',
	          label: 'person.nationid',
	          // required:true,
	          // pattern:'^[0-9]{13}$'
	          readonly: true
	        },
	        co_prename: {
	          id: 'co.prename',
	          type: 'text',
	          label: 'person.prename',
	          readonly: true
	        },
	        co_firstname: {
	          id: 'co.firstname',
	          type: 'text',
	          label: 'person.firstname',
	          // required:true
	          readonly: true
	        },
	        co_lastname: {
	          id: 'co.lastname',
	          type: 'text',
	          label: 'person.lastname',
	          //          width:196,
	          // required:true
	          readonly: true
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
	          type: 'number',
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
	        type: 'number',
	        label: 'contract.payment_month',
	        required: true,
	        min: 2,
	        max: 60
	      }), _defineProperty(_fields, 'payment_price', {
	        id: 'payment_price',
	        type: 'text',
	        label: 'contract.payment_price',
	        readonly: true
	      }), _defineProperty(_fields, 'payment_per_month', {
	        id: 'payment_per_month',
	        type: 'number',
	        label: 'contract.payment_per_month',
	        required: true
	      }), _defineProperty(_fields, 'payment_on_day', {
	        id: 'payment_on_day',
	        type: 'number',
	        min: 1,
	        max: 31,
	        label: 'contract.payment_on_day',
	        required: true
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
	        id: 'due_date',
	        label: 'collection.due_date',
	        type: 'date',
	        required: true
	      }), _defineProperty(_fields, 'collection_type', {
	        id: 'call_type',
	        type: 'dropdown',
	        label: 'collection.call_type',
	        list: [{ value: 'โทหาคนซื้อ', text: 'โทหาคนซื้อ' }, { value: 'โทรหาคนค้ำ', text: 'โทรหาคนค้ำ' }, { value: 'โทรหาอื่น ๆ', text: 'โทรหาอื่น ๆ' }]
	      }), _defineProperty(_fields, 'collection_number', {
	        id: 'call_number',
	        type: 'dropdown',
	        label: 'collection.call_number',
	        list: []
	      }), _defineProperty(_fields, 'collection_print', {
	        id: 'collection_print',
	        type: 'dropdown',
	        label: 'collection.print_file',
	        list: [{ value: '1', text: 'รอบ 1 ด่วนที่สุด' }, { value: '2', text: 'รอบ 2 สำนักงานบังคับคดี' }]
	      }), _defineProperty(_fields, 'collection_call_remark', {
	        id: 'call_remark',
	        label: 'collection.call_remark',
	        type: 'text',
	        required: true
	      }), _fields),
	      collection: {
	        call_date: new Date().toJSON().slice(0, 10).replace(/-/ig, '/'),
	        call_number: '',
	        call_remark: '',
	        shop_id: '',
	        staff_id: '',
	        contract_id: ''
	      },
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
	        } }, { name: 'paid_status', label: 'contract.term.paid_status', width: 160, render: function render(row) {
	          return row.paid_status;
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
	        } }]
	    }, _defineProperty(_ref, 'collection', [{ name: 'rownum', type: 'number', label: 'collection.collection_list.num', readonly: true, width: 40 }, { name: 'system_date', label: 'collection.collection_list.call_date', width: 150, render: function render(row) {
	        return row.product;
	      } }, { name: 'call_type', label: 'collection.collection_list.call_type', width: 150, render: function render(row) {
	        return row.product;
	      } }, { name: 'call_number', label: 'collection.collection_list.call_number', width: 120, render: function render(row) {
	        return row.serial;
	      } }, { name: 'due_date', label: 'collection.collection_list.due_date', width: 150, render: function render(row) {
	        return row.product;
	      } }, { name: 'call_remark', type: 'number', label: 'collection.collection_list.call_remark', width: 150, render: function render(row) {
	        return helper.numberFormat(parseFloat(row.newcost), 2);
	      } }, { name: 'staff_name', type: 'number', label: 'collection.collection_list.staff_name', width: 80, className: 'center', render: function render(row) {
	        return helper.numberFormat(parseFloat(row.newcost), 2);
	      } }]), _defineProperty(_ref, 'curTab', 'tab1'), _ref;
	  },

	  changeContract: function changeContract(id) {
	    actions.getById(id);
	  },

	  onSaveDoneAction: function onSaveDoneAction() {
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

	    this.setState({
	      return: data.return[0],
	      returndetail: data.return_detail,
	      stock_shop: data.stock_shop[0]
	    });

	    //console.log(this.state.stock_shop);
	  },

	  onGetByIdDoneAction: function onGetByIdDoneAction(data) {
	    var listRef = data.refContract.map(function (row) {
	      return React.createElement(
	        'li',
	        { key: row.id, className: row.id == this.state.id ? 'selected' : null, onClick: function () {
	            this.changeContract(row.id);
	          }.bind(this) },
	        React.createElement(
	          'div',
	          { style: { fontWeight: 'bold' } },
	          row.code
	        ),
	        React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { className: 'flex can-grow' },
	            React.createElement('div', { className: 'flaticon-user157 tiny no-shrink' }),
	            React.createElement(T, { content: 'contract.customer', component: 'nobr', className: 'status-text can-grow' })
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
	    infoPanelActions.show('pos.receipt.deptlist', '');

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

	    var path = window.location.protocol + '//' + window.location.host + '/idcard/photo';
	    var cus_id = data.contract.customer.idcard_info.nationid;
	    var photoCoIDCard = '';
	    if (!cus_id || cus_id.length != 13) {
	      photoCoIDCard = path + '.png';
	    } else {
	      photoCoIDCard = path + '/' + cus_id.substr(-1) + '/' + cus_id.substr(-2, 1) + '/' + cus_id + '.jpg';
	    }

	    this.state.cusIDCardPhoto = photoCoIDCard;
	    this.setState({
	      id: data.contract.id,
	      contract: data.contract,
	      paymentTerm: data.paymentTerm,
	      cusIDCardPhoto: this.state.cusIDCardPhoto
	    });

	    if (this.state.flagClose == 'Y') {
	      actions.getCloseReturn(this.state.contract);
	    }
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
	      this.doGenPayment();
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
	    console.log(this.state);
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
	        paymentTerm: this.state.paymentTerm
	      };
	      if (this.state.flagClose == 'Y') {
	        console.log(this.state.contract.new_cost);
	        obj.stock_shop = this.state.stock_shop;
	        //obj.stock_shop.new_cost = this.state.contract.new_cost;
	        //obj.status = this.state.return.return_status;
	        obj.flagClose = this.state.flagClose;
	        obj.return = this.state.return;
	      }
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
	    console.log(this.state.id);
	    infoPanelActions.show('installment.contract.list', null);
	    actions.getById(this.state.id);
	    actionsReceipt.getPaymentTerm({ contractid: this.state.id });
	    actionsReceipt.getHistoryPaymentTerm({ contractid: this.state.id });
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  handleChange: function handleChange(id, value) {
	    var tmp = id.split('.');
	    if (typeof value === 'string') {
	      value = value.trim();
	    }
	    if (tmp.length == 2) {
	      this.state.contract[tmp[0]][tmp[1]] = value;
	    } else {

	      this.state.contract[id] = value;
	    }

	    // calc age
	    if (id === 'customer.birth') {
	      this.state.contract.customer.age = calcAge(value);
	    }

	    var genPayment = false;
	    if (id === 'payment_month') {
	      var month = parseInt(value);
	      var price = parseFloat(this.state.contract.payment_price);
	      if (month > 0) {
	        var per_month = Math.floor(price / month);
	        this.state.contract['payment_per_month'] = per_month;
	      }
	      genPayment = true;
	    }
	    if (id === 'payment_per_month' || id === 'payment_on_day') {
	      genPayment = true;
	    }

	    console.log('updateState');
	    this.setState({
	      contract: this.state.contract
	    });
	  },

	  handleTabClick: function handleTabClick(id) {
	    this.setState({
	      curTab: id
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

	  doGenPayment: function doGenPayment() {
	    var payment = [];
	    var amount = Math.floor(this.state.data.payment_per_month);
	    var total = 0;
	    var month = parseInt(this.state.data.payment_month);
	    var today = new Date();
	    var mm = today.getMonth();
	    var day = parseInt(this.state.data.payment_on_day);
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
	        amount: amount
	      });
	      total += amount;
	    }
	    this.setState({
	      paymentData: payment
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
	  }

	}, _defineProperty(_React$createClass, 'handleChange', function handleChange(id, value) {
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

	  this.setState({
	    contract: this.state.contract
	  });
	}), _defineProperty(_React$createClass, 'handleTermChange', function handleTermChange(row_i, field_id, value) {
	  if (row_i == this.state.paymentTerm.length - 1 && field_id == 'due_amount') {
	    return;
	  }
	  if (this.state.paymentTerm[row_i]['due_status'] != 'WAIT') {
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
	}), _defineProperty(_React$createClass, 'toggleExpand', function toggleExpand(section) {

	  this.state.expand[section] = !this.state.expand[section];
	  this.setState({
	    expand: this.state.expand
	  });
	}), _defineProperty(_React$createClass, 'calProfitLost', function calProfitLost() {
	  console.log(this.state.expand.close_return);
	  var _NewCost = 0;

	  if (this.state.contract.new_cost != '') {
	    _NewCost = parseFloat(this.state.contract.new_cost);
	  }
	  //var _NewCost = parseFloat(this.state.contract.new_cost);
	  var _Balance = parseFloat(this.state.contract.balance);
	  var _Fee = parseFloat(this.state.contract.fee);
	  var _IntallCost = parseFloat(this.state.contract.install_cost);

	  this.state.contract.profit_loss = _NewCost - (_Balance + _Fee + _IntallCost);

	  this.setState({
	    contract: this.state.contract
	  });
	}), _defineProperty(_React$createClass, 'doCollectionSave', function doCollectionSave() {
	  this.state.collection.staff_id = system.sessionStore.getSession().staff.id;
	  this.state.collection.shop_id = system.sessionStore.getSession().staff.shop_id;
	}), _defineProperty(_React$createClass, 'onSaveCollectionDoneAction', function onSaveCollectionDoneAction() {
	  toasterActions.pop({
	    type: 'success',
	    message: 'result.save.ok'
	  });
	}), _defineProperty(_React$createClass, 'onGetPaymentTermDoneAction', function onGetPaymentTermDoneAction(data) {
	  //console.log(this.state.contract.id);
	  this.setState({
	    listProductData: data.contract
	    //paymentData:data.payment
	  });

	  //this.state.data.product = row.product_detail;
	}), _defineProperty(_React$createClass, 'onGetHistoryPaymentTermDoneAction', function onGetHistoryPaymentTermDoneAction(data) {

	  console.log(data.paymentHistory);

	  this.setState({
	    listPaymentHistory: data.paymentHistory
	    //paymentData:data.payment
	  });
	}), _defineProperty(_React$createClass, 'onPrintReceiptDoneAction', function onPrintReceiptDoneAction(data) {
	  window.open(data.pdfFile);
	}), _defineProperty(_React$createClass, 'onRePrint', function onRePrint(row) {
	  actionsReceipt.printReceipt({ contract_id: row.contract_id, receipt_id: row.id });
	}), _defineProperty(_React$createClass, 'render', function render() {
	  var fields = this.state.fields;
	  var contract = this.state.contract;
	  var customer = contract.customer || {};
	  var co = contract.co || {};
	  var paymentTerm = this.state.paymentTerm || [];

	  var paymentStatus = paymentTerm.map(function (term) {
	    return React.createElement('li', { key: term.id, className: 'status_' + term.term_status + (term.close_status == 'NORMAL' ? '' : ' ' + term.close_status), title: 'DUE DATE: ' + term.due_date + '\n' + 'PAID DATE: ' + term.paid_date + '\n' + 'DUE AMOUNT: ' + helper.numberFormat(term.due_amount, 2) + '\n' + 'PAID AMOUNT: ' + helper.numberFormat(term.paid_amount, 2) + '\n' + 'STATUS: ' + term.term_status });
	  });

	  var productField = [{ name: 'term_num', label: 'pos.receipt.no', width: 40, render: function render(row) {
	      return row.term_num;
	    } }, { name: 'due_date', label: 'pos.receipt.due_date', width: 150, render: function render(row) {
	      var date = tr.localize(new Date(row.due_date), { type: 'date', format: 'long' });
	      if (row.paid_date == '0000-00-00') {
	        date = React.createElement(
	          'div',
	          null,
	          tr.localize(new Date(row.due_date), { type: 'date', format: 'long' }),
	          React.createElement(
	            'span',
	            { style: { color: "red" } },
	            row.diffday
	          )
	        );
	      }
	      return date;
	    } }, { name: 'paid_date', label: 'pos.receipt.date', width: 150, render: function render(row) {
	      var pay_date = '-';
	      if (row.paid_date != '0000-00-00') {
	        pay_date = React.createElement(
	          'div',
	          null,
	          tr.localize(new Date(row.paid_date), { type: 'date', format: 'long' }),
	          React.createElement(
	            'span',
	            { style: { color: "red" } },
	            row.diffday
	          )
	        );
	      }
	      return pay_date;
	    } }, { name: 'due_amount', label: 'pos.receipt.due_amount', width: 150, render: function render(row) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'right', style: { width: "80px" } },
	          helper.numberFormat(row.due_amount, 2)
	        )
	      );
	    } }, { name: 'paid_amount', label: 'pos.receipt.paid_amount', width: 150, className: 'right', render: function render(row) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'right', style: { width: "80px" } },
	          helper.numberFormat(row.paid_amount, 2)
	        )
	      );
	    } }, { name: 'balance', label: 'pos.receipt.balance', width: 150, className: 'right', render: function render(row) {
	      var _balance = '-';
	      if (row.balance != '-') {
	        _balance = React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'div',
	            { className: 'right', style: { width: "80px" } },
	            helper.numberFormat(row.balance, 2)
	          )
	        );
	      }
	      return _balance;
	    } }, { name: 'discount', label: 'pos.receipt.discount', width: 100, className: 'right', render: function render(row) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'right', style: { width: "80px" } },
	          helper.numberFormat(row.discount, 2)
	        )
	      );
	    } }];

	  var paymentHistory = [{ name: 'code', label: 'pos.receipt.receipt_code', width: 150, render: function render(row) {
	      return row.status == 'VOID' ? React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'del',
	          null,
	          row.code
	        )
	      ) : React.createElement(
	        'div',
	        null,
	        row.code
	      );
	    } }, { name: 'system_date', label: 'pos.receipt.system_date', type: 'date', width: 120, render: function render(row) {
	      return tr.localize(new Date(row.system_date), { type: 'datetime', format: 'short' });
	    } }, { name: 'pay_date', label: 'pos.receipt.date', width: 100, render: function render(row) {
	      return tr.localize(new Date(row.pay_date), { type: 'date', format: 'short' });
	    } }, { name: 'term_num', label: 'pos.receipt.term', width: 50, render: function render(row) {
	      return row.term_num;
	    } }, { name: 'option_name', label: 'pos.receipt.payment_option', width: 190, render: function render(row) {
	      return row.option_name;
	    } }, { name: 'amount', label: 'pos.receipt.amount', width: 90, render: function render(row) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'right', style: { width: "80px" } },
	          helper.numberFormat(row.amount, 2)
	        )
	      );
	    } }, { name: 'penalty', label: 'pos.receipt.penalty', width: 90, render: function render(row) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'right', style: { width: "80px" } },
	          helper.numberFormat(row.penalty, 2)
	        )
	      );
	    } }, { name: 'remark', label: 'pos.receipt.remark', width: 130, render: function render(row) {
	      return React.createElement(
	        'div',
	        { title: row.remark },
	        row.remark
	      );
	    } }, { name: 'display_name', label: 'pos.receipt.staff', width: 80, render: function render(row) {
	      return row.display_name;
	    } }, { name: 'actions', type: 'actions', width: 2 * 20 + 'px', render: function (row) {
	      var f = function () {
	        this.onRePrint(row);
	      }.bind(this);
	      return row.code != '' ? React.createElement(
	        'div',
	        { className: 'flex' },
	        React.createElement(
	          'div',
	          { onClick: f },
	          React.createElement(FlexIcon, { icon: 'printer88', title: 'action.select' })
	        )
	      ) : '';
	    }.bind(this) }];

	  var list = [{ id: 'tab1', icon: 'bubble8', text: 'pos.receipt.paymentterm' }, { id: 'tab2', icon: 'bubble8', text: 'pos.receipt.paymenthistory' }];

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
	          { style: { fontSize: '18pt', height: '40px', lineHeight: '48px' } },
	          customer.fullname
	        ),
	        React.createElement(
	          'div',
	          null,
	          helper.formatNationID(customer.nationid)
	        ),
	        React.createElement(
	          'div',
	          null,
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
	              'รวมดอกเบี้ย'
	            ),
	            React.createElement(
	              'div',
	              { className: 'right no-shrink' },
	              React.createElement(
	                'span',
	                { className: 'blue' },
	                '0.00'
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
	              'คงเหลือ'
	            ),
	            React.createElement(
	              'div',
	              { className: 'right no-shrink' },
	              React.createElement(
	                'span',
	                { className: 'blue' },
	                helper.numberFormat(contract.payment_price - contract.total_paid, 2)
	              ),
	              ' บาท'
	            )
	          )
	        )
	      )
	    ),
	    React.createElement(
	      'div',
	      { className: 'panel10' },
	      React.createElement(FlexTab, { list: list, selected: this.state.curTab, onClick: this.handleTabClick })
	    ),
	    React.createElement(
	      'div',
	      { className: 'panel10', style: this.state.curTab == 'tab1' ? { display: 'block' } : { display: 'none' } },
	      React.createElement(FlexDisplayTable, {
	        fields: productField,
	        data: this.state.listProductData,
	        displayRows: 5
	      })
	    ),
	    React.createElement(
	      'div',
	      { className: 'panel10', style: this.state.curTab == 'tab2' ? { display: 'block' } : { display: 'none' } },
	      React.createElement(FlexDisplayTable, {
	        fields: paymentHistory,
	        data: this.state.listPaymentHistory,
	        displayRows: 10
	      })
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
	        component.customerCoInfo(this.state.fields, this.state.contract, this.handleChange)
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel4' },
	        React.createElement(NationIDCard, {
	          idcard: this.state.contract.co.idcard_info || {},
	          photoPath: this.state.cusIDCardPhoto,
	          photoLoading: this.state.cusIDCardPhotoLoading,
	          onChange: function (data) {
	            this.handleIDCardChange('co', data);
	          }.bind(this)
	        })
	      )
	    ),
	    React.createElement(
	      'div',
	      { className: this.state.expand.co ? 'box6' : 'none' },
	      React.createElement(AddressInfo, { ref: 'coAddr', otherLabel: 'contract.address.year',
	        onChange: function (data) {
	          this.handleChange('coAddr', data);
	        }.bind(this),
	        data: this.state.contract.coAddr
	      })
	    )
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
	        React.createElement(T, { content: 'pos.receipt.title.history', component: 'h2' })
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel3 no-shrink' },
	        React.createElement(
	          'div',
	          { style: { textAlign: 'center', border: '1px solid silver', height: '30px', lineHeight: '36px', fontSize: '14pt' } },
	          'RK1 รังสิต 1'
	        )
	      ),
	      React.createElement('div', { className: 'panel2 no-shrink' })
	    ),
	    React.createElement(
	      'div',
	      { className: 'content-body boxf' },
	      React.createElement(
	        'form',
	        { ref: 'frm' },
	        contractSummary
	      )
	    )
	  );
	}), _React$createClass));

	module.exports = ContractEdit;

/***/ }

});