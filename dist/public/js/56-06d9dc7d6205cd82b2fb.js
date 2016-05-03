webpackJsonp([56,135],{

/***/ 741:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
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

/***/ 756:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'checkproduct': { children: ['done', 'error'] },
	  'saveCloseChange': { children: ['done', 'error'] }
	});

/***/ },

/***/ 765:
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

	var actions = __webpack_require__(766);
	var actionsReceipt = __webpack_require__(741);
	var actionsRedeem = __webpack_require__(756);
	var AddressInfo = __webpack_require__(767);

	var component = __webpack_require__(768);

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
	  CLOSE_BAD_DEBT: 'rounded56',
	  CLOSE_CHANGE: 'circle108'
	};
	var statusColor = {
	  NORMAL: 'green',
	  DEBT: 'orange',
	  CLOSE_CANCEL: 'green',
	  CLOSE_NORMAL: 'green',
	  CLOSE_RETURN: 'green',
	  CLOSE_CONFISCATE: 'orange',
	  CLOSE_BAD_DEBT: 'red',
	  CLOSE_CHANGE: 'green'
	};

	var formatContractCode = function formatContractCode(code) {
	  if (!code || code.length != 16) {
	    return code;
	  }
	  return code.substr(0, 5) + '-' + code.substr(5, 3) + '-' + code.substr(8, 6) + '-' + code.substr(14, 2);
	};

	var RedeemScreen = React.createClass({
	  displayName: 'RedeemScreen',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(actionsRedeem.checkproduct.done, 'onCheckproductDoneAction'), Reflux.listenTo(actionsRedeem.saveCloseChange.done, 'onSaveCloseChangeDoneAction'), Reflux.listenTo(actions.getById.done, 'onGetByIdDoneAction'), Reflux.listenTo(actionsRedeem.checkproduct.error, 'onCheckproductErrorAction'), Reflux.listenTo(actionsReceipt.getPaymentTerm.done, 'onGetPaymentTermDoneAction'), Reflux.listenTo(actionsReceipt.getHistoryPaymentTerm.done, 'onGetHistoryPaymentTermDoneAction'), Reflux.listenTo(actionsReceipt.printReceipt.done, 'onPrintReceiptDoneAction')],

	  getInitialState: function getInitialState() {
	    var id = parseInt(1);
	    var flagRedeem = 'Y';
	    return {
	      id: id,
	      listProductData: [],
	      listPaymentHistory: [],
	      nationid: '',
	      disabledRedeem: true,
	      contract: {
	        customer: {},
	        co: {},
	        cardAddr: {},
	        customerAddr: {},
	        workAddr: {},
	        coCardAddr: {},
	        coAddr: {},
	        coWorkAddr: {},
	        return: {},
	        txt_code: '',
	        barcode: '',
	        newsell_id: ''
	      },
	      return: {},
	      expand: {
	        customer: false,
	        co: false,
	        payment_term: false
	      },
	      paymentTerm: [],
	      refContract: [],
	      returndetail: [],
	      fields: {
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
	        },
	        work_prev_company: {
	          id: 'work_prev_company',
	          type: 'tex',
	          label: 'contract.work_prev_company'
	        },
	        work_prev_addr: {
	          id: 'work_prev_addr',
	          type: 'tex',
	          label: 'contract.work_prev_addr'
	        },
	        work_prev_department: {
	          id: 'work_prev_department',
	          type: 'tex',
	          label: 'contract.work_prev_department'
	        },
	        work_prev_tel: {
	          id: 'work_prev_tel',
	          type: 'tex',
	          label: 'contract.work_prev_tel'
	        },
	        payment_month: {
	          id: 'payment_month',
	          type: 'number',
	          label: 'contract.payment_month',
	          required: true,
	          min: 2,
	          max: 60
	        },
	        payment_price: {
	          id: 'payment_price',
	          type: 'text',
	          label: 'contract.payment_price',
	          readonly: true
	        },
	        payment_per_month: {
	          id: 'payment_per_month',
	          type: 'number',
	          label: 'contract.payment_per_month',
	          required: true
	        },
	        payment_on_day: {
	          id: 'payment_on_day',
	          type: 'number',
	          min: 1,
	          max: 31,
	          label: 'contract.payment_on_day',
	          required: true
	        },
	        close_return_newcost: {
	          id: 'new_cost',
	          type: 'number',
	          label: 'close_return.newcost',
	          required: true
	        },
	        close_return_oldcost: {
	          id: 'cost',
	          type: 'number',
	          label: 'close_return.oldcost',
	          readonly: true
	        },
	        close_return_paid: {
	          id: 'total_paid',
	          type: 'number',
	          label: 'close_return.paid',
	          readonly: true
	        },
	        close_return_balance: {
	          id: 'balance',
	          type: 'number',
	          label: 'close_return.balance',
	          readonly: true
	        },
	        close_return_contract_free: {
	          id: 'fee',
	          type: 'number',
	          label: 'close_return.contract_free',
	          readonly: true
	        },
	        close_return_install_free: {
	          id: 'install_cost',
	          type: 'number',
	          label: 'close_return.install_free',
	          readonly: true
	        },
	        close_return_profit_loss: {
	          id: 'profit_loss',
	          type: 'number',
	          label: 'close_return.profit_loss',
	          required: true
	        },
	        close_return_sell_id: {
	          id: 'sell_id',
	          type: 'text',
	          label: 'close_return.sell_id',
	          readonly: true
	        },
	        close_return_sign_date: {
	          id: 'sign_date',
	          type: 'text',
	          label: 'close_return.sign_date',
	          readonly: true
	        },
	        close_return_product_serial: {
	          id: 'product_serial',
	          type: 'text',
	          label: 'close_return.product_serial',
	          readonly: true
	        },
	        close_return_product_detail: {
	          id: 'product_detail',
	          type: 'text',
	          label: 'close_return.product_detail',
	          readonly: true
	        },
	        close_return_cus_name: {
	          id: 'cus_name',
	          type: 'text',
	          label: 'close_return.cus_name',
	          readonly: true
	        },
	        close_return_product_condition: {
	          id: 'product_condition',
	          type: 'text',
	          label: 'close_return.product_condition'
	        },
	        close_return_remark: {
	          id: 'remark',
	          type: 'text',
	          label: 'close_return.remark'
	        },
	        close_return_return_date: {
	          id: 'return_date',
	          type: 'text',
	          label: 'close_return.return_date',
	          readonly: true
	        },
	        collection_date: {
	          id: 'due_date',
	          label: 'collection.due_date',
	          type: 'date',
	          required: true
	        },
	        collection_type: {
	          id: 'call_type',
	          type: 'dropdown',
	          label: 'collection.call_type',
	          list: [{ value: 'โทหาคนซื้อ', text: 'โทหาคนซื้อ' }, { value: 'โทรหาคนค้ำ', text: 'โทรหาคนค้ำ' }, { value: 'โทรหาอื่น ๆ', text: 'โทรหาอื่น ๆ' }]
	        },
	        collection_number: {
	          id: 'call_number',
	          type: 'dropdown',
	          label: 'collection.call_number',
	          list: []
	        },
	        collection_print: {
	          id: 'collection_print',
	          type: 'dropdown',
	          label: 'collection.print_file',
	          list: [{ value: '1', text: 'รอบ 1 ด่วนที่สุด' }, { value: '2', text: 'รอบ 2 สำนักงานบังคับคดี' }]
	        },
	        collection_call_remark: {
	          id: 'call_remark',
	          label: 'collection.call_remark',
	          type: 'text',
	          required: true
	        }
	      },
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
	        } }],
	      collection: [{ name: 'rownum', type: 'number', label: 'collection.collection_list.num', readonly: true, width: 40 }, { name: 'system_date', label: 'collection.collection_list.call_date', width: 150, render: function render(row) {
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
	        } }],
	      curTab: 'tab1'
	    };
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

	  onCheckproductDoneAction: function onCheckproductDoneAction(data) {
	    this.state.disabledRedeem = false;
	    this.setState({
	      nationid: data.nation_id,
	      disabledRedeem: this.state.disabledRedeem
	    });
	    //console.log('jack=',data);
	    actions.getById(data.contract_id);
	    actionsReceipt.getPaymentTerm({ contractid: data.contract_id });
	    actionsReceipt.getHistoryPaymentTerm({ contractid: data.contract_id });
	  },

	  onSaveCloseChangeDoneAction: function onSaveCloseChangeDoneAction(data) {
	    toasterActions.pop({
	      type: 'success',
	      message: 'ปิดสัญญาเรียบร้อย'
	    });

	    this.context.router.transitionTo('installment.contract');
	  },

	  onCheckproductErrorAction: function onCheckproductErrorAction(data) {
	    this.state.disabledRedeem = true;
	    this.setState({
	      disabledRedeem: true
	    });
	    toasterActions.pop({
	      type: 'warning',
	      message: 'เลขที่สัญญาหรือบาโค๊ดสินค้าไม่ถูกต้อง'
	    });
	  },

	  onGetByIdDoneAction: function onGetByIdDoneAction(data) {
	    console.log(data);
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
	    data.contract.txt_code = this.state.contract.txt_code;
	    data.contract.barcode = this.state.contract.barcode;
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
	    console.log(this.state.contract.current_status);
	    //infoPanelActions.show('installment.contract.list', null);
	    // actions.getById(this.state.id);
	    // actionsReceipt.getPaymentTerm({contractid:this.state.id});
	    // actionsReceipt.getHistoryPaymentTerm({contractid:this.state.id});
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    //infoPanelActions.hide();
	  },

	  textEnter: function textEnter() {
	    if (this.state.contract.txt_code != '' && this.state.contract.barcode != '' && this.state.contract.newsell_id != '') {
	      var obj = {
	        code: this.state.contract.txt_code,
	        barcode: this.state.contract.barcode,
	        newsell_id: this.state.contract.newsell_id
	      };
	      actionsRedeem.checkproduct(obj);
	    } else {
	      this.state.disabledRedeem = true;
	      this.setState({
	        disabledRedeem: this.state.disabledRedeem
	      });
	      toasterActions.pop({
	        type: 'warning',
	        message: 'กรุณากรอกเลขที่สัญญา บาโค๊ดสินค้าและเลขที่ใบขาย'
	      });
	    }
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

	    this.setState({
	      contract: this.state.contract
	    });
	  },

	  handleTermChange: function handleTermChange(row_i, field_id, value) {
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
	  },

	  doCollectionSave: function doCollectionSave() {
	    this.state.collection.staff_id = system.sessionStore.getSession().staff.id;
	    this.state.collection.shop_id = system.sessionStore.getSession().staff.shop_id;
	  },

	  onSaveCollectionDoneAction: function onSaveCollectionDoneAction() {
	    toasterActions.pop({
	      type: 'success',
	      message: 'result.save.ok'
	    });
	  },

	  onGetPaymentTermDoneAction: function onGetPaymentTermDoneAction(data) {
	    //console.log(this.state.contract.id);
	    this.setState({
	      listProductData: data.contract
	      //paymentData:data.payment
	    });

	    //this.state.data.product = row.product_detail;
	  },

	  onGetHistoryPaymentTermDoneAction: function onGetHistoryPaymentTermDoneAction(data) {

	    console.log(data.paymentHistory);

	    this.setState({
	      listPaymentHistory: data.paymentHistory
	      //paymentData:data.payment
	    });
	  },

	  onPrintReceiptDoneAction: function onPrintReceiptDoneAction(data) {
	    window.open(data.pdfFile);
	  },

	  onRePrint: function onRePrint(row) {
	    actionsReceipt.printReceipt({ contract_id: row.contract_id, receipt_id: row.id });
	  },

	  doCloseChange: function doCloseChange() {
	    //console.log('close change');
	    this.context.router.transitionTo('installment.contract.new', { sellId: this.state.contract.newsell_id, sellType: 'NORMAL', contract_ref: this.state.contract.code, sellold: this.state.contract.sell_id });
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
	        return row.remark;
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
	      { className: 'contract-section layout-panel' },
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
	              React.createElement(T, { content: contract.current_status == undefined ? '' : 'installment.contract.current_status.' + contract.current_status })
	            )
	          ),
	          React.createElement(
	            'div',
	            null,
	            'เริ่มสัญญา:',
	            React.createElement(
	              'span',
	              { style: { color: 'blue', padding: '0 8px' } },
	              contract.sign_date == undefined ? '' : tr.localize(new Date(contract.sign_date), { type: 'date', format: 'long' })
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

	    var fields = {
	      txt_code: {
	        id: 'txt_code',
	        type: 'text',
	        label: 'pos.change.code',
	        icon: 'list88',
	        required: true
	      },
	      barcode: {
	        id: 'barcode',
	        type: 'text',
	        label: 'pos.change.barcode',
	        icon: 'list88',
	        required: true
	      },
	      sell_id: {
	        id: 'newsell_id',
	        type: 'text',
	        label: 'pos.change.sell_id',
	        icon: 'list88',
	        required: true
	      }
	    };

	    return React.createElement(
	      'div',
	      { className: 'content-page flex-form' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink' },
	          React.createElement(FlexTextInput, {
	            field: fields.txt_code,
	            data: this.state.contract,
	            onChange: this.handleChange,
	            onEnter: this.textEnter,
	            live: true
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink' },
	          React.createElement(FlexTextInput, {
	            field: fields.barcode,
	            data: this.state.contract,
	            onChange: this.handleChange,
	            onEnter: this.textEnter,
	            live: true
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink' },
	          React.createElement(FlexTextInput, {
	            field: fields.sell_id,
	            data: this.state.contract,
	            onChange: this.handleChange,
	            onEnter: this.textEnter,
	            live: true
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink' },
	          React.createElement(FlexButton, { icon: 'forward19', label: 'pos.action.confirm',
	            'default': true,
	            onClick: this.doCloseChange,
	            disabled: this.state.disabledRedeem
	          })
	        )
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
	  }
	});

	module.exports = RedeemScreen;

/***/ },

/***/ 766:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
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

/***/ 767:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var widgets = __webpack_require__(377);
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

/***/ 768:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  customerInfo: __webpack_require__(769),
	  customerAddressStatus: __webpack_require__(770),
	  customerJobStatus: __webpack_require__(771),
	  customerCoInfo: __webpack_require__(772),
	  coAddressStatus: __webpack_require__(773),
	  coJobStatus: __webpack_require__(772)
	};

/***/ },

/***/ 769:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var tr = __webpack_require__(207);
	var widgets = __webpack_require__(377);

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

/***/ 770:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var widgets = __webpack_require__(377);
	var T = __webpack_require__(381);

	var FlexDropdown = widgets.FlexDropdown;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexIcon = widgets.FlexIcon;
	var AddressInfo = __webpack_require__(767);

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

/***/ 771:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var widgets = __webpack_require__(377);

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

/***/ 772:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var widgets = __webpack_require__(377);

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

/***/ 773:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var widgets = __webpack_require__(377);
	var T = __webpack_require__(381);

	var FlexDropdown = widgets.FlexDropdown;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexIcon = widgets.FlexIcon;
	var AddressInfo = __webpack_require__(767);

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

/***/ }

});