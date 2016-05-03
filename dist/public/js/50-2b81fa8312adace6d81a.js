webpackJsonp([50,52,55,59,62,64,135],{

/***/ 741:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);

	var system = __webpack_require__(356);
	var systemActions = system.systemActions;
	var menuActions = system.menuActions;
	var infoPanelActions = system.infoPanelActions;

	var Sell = __webpack_require__(742);
	var Receipt = __webpack_require__(747);
	var CashDaily = __webpack_require__(752);
	var Redeem = __webpack_require__(757);
	var Change = __webpack_require__(762);

	tr.registerTranslations('en', __webpack_require__(767));
	tr.registerTranslations('th', __webpack_require__(768));

	var App = {};

	App.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setTheme(1);
	    systemActions.updateTopPanel({
	      code: 'pos',
	      name: 'ขายหน้าร้าน',
	      icon: 'front17'
	    });
	    menuActions.show([{ id: 'dashboard', index: true, route: '/pos', label: 'pos.menu.dashboard', icon: 'show6', acl: ['M_POS_DASHBOARD'] }, { id: 'sell', route: '/pos/sell', label: 'pos.menu.sell', icon: 'show6', acl: ['M_POS_SELL'] }, { id: 'receipt', index: true, route: '/pos/receipt', label: 'pos.menu.receipt', icon: 'show6', acl: ['M_POS_RECEIPT'] }, { id: 'deptlist', route: '/pos/receipt/deptlist', label: 'pos.menu.receipt_dept', icon: 'show6', acl: ['M_POS_RECEIPT_DEPT'] }, { id: 'redeem', route: '/pos/redeem', label: 'pos.menu.redeem', icon: 'show6', acl: ['M_POS_REDEEM'] }, { id: 'changeProduct', route: '/pos/change', label: 'pos.menu.change', icon: 'show6', acl: ['M_POS_CHANGE'] }, { id: 'cashDailylist', route: '/pos/cashDaily', label: 'pos.menu.cashDaily', icon: 'change3', acl: ['M_POS_CASHDAILY'] }]);
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	App.Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  componentDidMount: function componentDidMount() {
	    infoPanelActions.hide();
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          React.createElement(T, { content: 'pos.title.index' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          ' '
	        )
	      )
	    );
	  }
	});

	// App.Routes = (
	//   <Route name="pos" path="pos" handler={App.Index}>
	//     <Router.DefaultRoute name="pos.dashboard" handler={App.Dashboard}/>
	//     {Sell.Routes}
	//     {Receipt.Routes}
	//     {CashDaily.Routes}
	//     {Redeem.Routes}
	//     {Change.Routes}
	//   </Route>
	// );

	module.exports = App;

/***/ },

/***/ 742:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions; //require('../../system/actions');

	var sellActions = __webpack_require__(743);
	var sellStore = __webpack_require__(744);

	var Sell = {};

	tr.registerTranslations('en', __webpack_require__(745));
	tr.registerTranslations('th', __webpack_require__(746));

	Sell = React.createClass({
	  displayName: 'Sell',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(null);
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	module.exports = Sell;

/***/ },

/***/ 743:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getInitData': { children: ['done', 'error'] },
	  'getProductDetail': { children: ['done', 'error'] },
	  'getCustomerDetail': { children: ['done', 'error'] },
	  'saveData': { children: ['done', 'error'] },
	  'dateChange': { children: ['done', 'error'] }
	});

/***/ },

/***/ 744:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);
	var ajax = system.ajaxActions; //require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var actions = __webpack_require__(743);

	var sellStore = Reflux.createStore({
	  listenables: [actions],

	  // pendingActions.list
	  onList: function onList(param) {
	    ajax.request('/api/sell/list', param, function (res) {
	      actions.list.done(res.data, res.opt);
	    });
	  },

	  onExport: function onExport(param) {
	    ajax.request('/api/installment/contract/exportPending', param, function (res) {
	      if (res.status === true) {
	        actions.export.done(res.file);
	      } else {
	        actions.export.error();
	      }
	    });
	  },
	  // actions.list
	  onGetInitData: function onGetInitData(param) {
	    ajax.request('/api/sell/init', param, actions.getInitData.done);
	  },

	  onDateChange: function onDateChange(param) {
	    ajax.request('/api/sell/checkOndate', param, actions.dateChange.done);
	  },

	  onGetProductDetail: function onGetProductDetail(param) {
	    ajax.request('/api/sell/search-product', param, actions.getProductDetail.done);
	  },

	  onGetCustomerDetail: function onGetCustomerDetail(id, shop_id) {
	    ajax.request('/api/sell/search-customer', { company_id: id, shop_id: shop_id }, actions.getCustomerDetail.done);
	  },

	  onGetById: function onGetById(id) {
	    ajax.request('/api/sell/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      actions.getById.done(res.data);
	    } else {
	      actions.getById.error(res.msg);
	    }
	  },

	  onSaveData: function onSaveData(data) {
	    ajax.request('/api/sell/save', data, actions.saveData.done);
	  },

	  onFacetEdit: function onFacetEdit() {
	    ajax.request('/api/sell/facetEdit', {}, this.doneFacetEdit);
	  },

	  doneFacetEdit: function doneFacetEdit(res) {
	    if (res.status === true) {
	      actions.facetEdit.done(res.data);
	    } else {
	      actions.facetEdit.error(res.error);
	    }
	  }

	});

	module.exports = sellStore;

/***/ },

/***/ 745:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    user: 'Username',
	    pass: 'Password',
	    display_name: 'Display Name',
	    last_login: 'Last Login',
	    last_ip: 'Last IP'
	  }
	};

/***/ },

/***/ 746:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		btn: {
			clear: 'ล้างข้อมูล',
			save: 'บันทึกเอกสาร',
			print: 'พิมพ์เอกสาร'
		},
		icon: {
			browse: 'เลือก'
		},
		info: {
			new: 'สร้าง',
			list: 'ใบขาย',
			filter_shop: 'สาขา',
			sell_date: 'วันที่ขาย',
			receipt_no: 'ใบเสร็จ',
			shop_name: 'สาขา',
			contract_ref: 'เลขที่สัญญา',
			company_name: 'ลูกค้า',
			description: 'สินค้า',
			serial: 'S/N',
			price: 'ราคาขาย',
			cost: 'ราคาทุน',
			down_payment: 'ดาวน์',
			remain_price: 'ยอดจัด',
			finance_staff: 'พนักงานไฟแนนซ์',
			sell_staff: 'พนักงานขาย',
			flag: '*',
			flag_hint: 'สดพิเศษ',
			footer: {
				special: '| * หมายถึง สดพิเศษ'
			}
		},
		sell: {
			list_customer: 'รายชื่อลูกค้าทั้งหมด',
			sell_no: 'เลขที่ขาย',
			sell_current: 'วันที่ขาย',
			cus_name: 'ชื่อลูกค้า',
			cus_code: 'รหัสลูกค้า',
			staff_save: 'บันทึกโดย',
			stock_date: 'วันที่ตัดสต๊อก',
			tel: 'เบอร์โทร',
			deposit: 'เงินมัดจำ',
			staff_sell: 'ขายโดย',
			finance_staff: 'ไฟแนนซ์โดย',
			address: 'ที่อยู่',
			product_name: 'ชื่อสินค้า',
			product_style: 'ลักษณะ',
			setup_type: ' ',
			setup: {
				no: 'ไม่ติดตั้ง',
				in: 'ช่างสยามชัย',
				out: 'ช่างนอก',
				coin: 'ตู้หยอดเหรียญ'
			},
			payment_option: 'ชำระโดย',
			setup_price: 'ค่าติดตั้ง',
			product_unit: 'จำนวน',
			product_price: 'ราคา',
			product: {
				name: 'สินค้า',
				barcode_serial: 'ค้นหา S/N หรือเลข BARCODE',
				serial: 'S/N',
				barcode: 'BARCODE',
				unit: 'จำนวน',
				setup: ' ',
				setup_price: 'ทุนช่างนอก',
				price: 'ราคา'
			},
			payment: {
				pay_by: 'วิธีชำระเงิน',
				amount: 'ราคา'
			},
			pay_ref: 'ธนาคาร/เลขที่บัญชี',
			credit_option: ' ',
			pay_by: 'เลขที่อ้างอิง',
			pay_price: 'ราคา',
			summary_total: 'รวม ',
			summary_unit: ' รายการ',
			summary_remain: 'ยอดคงค้าง',
			summary_text: 'จำนวนเงิน',
			product_text: 'ข้อมูลสินค้า',
			remark: 'หมายเหตุ'
		}
	};

/***/ },

/***/ 747:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var receiptStore = __webpack_require__(748);
	var Receipt = {};

	var system = __webpack_require__(356);
	var systemActions = system.systemActions;

	tr.registerTranslations('en', __webpack_require__(750));
	tr.registerTranslations('th', __webpack_require__(751));

	Receipt.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('pos.receipt.search'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	// Receipt.Screen = require('./receipt-screen.jsx');
	// Receipt.List = require('./receipt-list.jsx');
	// Receipt.DeptList = require('./receipt-deptlist.jsx');
	// Receipt.History = require('./receipt-history.jsx');

	// Receipt.Routes = (
	//   <Route name="pos.receipt" path="receipt" handler={Receipt.Index}>
	//      <Router.DefaultRoute name="pos.receipt.list" path="list" handler={Receipt.List}/>
	//      <Route name="pos.receipt.screen" path="edit/:id/:contract_code/:redeem" handler={Receipt.Screen}/>
	//      <Route name="pos.receipt.deptlist" path="deptlist"  handler={Receipt.DeptList}/>
	//      <Route name="pos.receipt.history" path="history/:id" handler={Receipt.History}/>
	//   </Route>
	// );

	module.exports = Receipt;

/***/ },

/***/ 748:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions; // require('../../../actions/ajax');
	var ajaxStore = system.ajaxStore; // require('../../../stores/ajax');
	var menuActions = system.menuActions; // require('../../../actions/menu');
	var Reflux = __webpack_require__(337);
	var paymentActions = __webpack_require__(749);

	var paymentStore = Reflux.createStore({
	  listenables: [paymentActions],

	  onPaymentOptionList: function onPaymentOptionList() {
	    //console.log('onPaymentOptionList');
	    ajaxActions.request('/api/receipt/paymentOptionList', {}, this.donePaymentOptionList);
	  },

	  donePaymentOptionList: function donePaymentOptionList(res) {
	    if (res.status === true) {
	      paymentActions.paymentOptionList.done(res.data);
	    } else {
	      paymentActions.paymentOptionList.error(res.error);
	    }
	  },

	  onGetFinanceList: function onGetFinanceList(shop_id, contract_id, finance_id, contracttype, sell_staff_id) {
	    //console.log('onPaymentOptionList');
	    ajaxActions.request('/api/receipt/financeList', { shop_id: shop_id, contract_id: contract_id, finance_id: finance_id, contracttype: contracttype, sell_staff_id: sell_staff_id }, this.doneGetFinanceList);
	  },

	  doneGetFinanceList: function doneGetFinanceList(res) {
	    if (res.status === true) {
	      paymentActions.getFinanceList.done(res.data);
	    } else {
	      paymentActions.getFinanceList.error(res.error);
	    }
	  },

	  onSavePayment: function onSavePayment(res) {
	    ajaxActions.request('/api/receipt/savePayment', res, this.doneSavePayment);
	  },

	  doneSavePayment: function doneSavePayment(res) {
	    if (res.status === true) {
	      paymentActions.savePayment.done(res.data);
	    } else {
	      paymentActions.savePayment.error(res.error);
	    }
	  },

	  onGetContractList: function onGetContractList(res) {
	    ajaxActions.request('/api/receipt/getContractList', res, this.doneGetContractList);
	  },

	  doneGetContractList: function doneGetContractList(res) {
	    if (res.status === true) {
	      paymentActions.getContractList.done(res.data);
	    } else {
	      paymentActions.getContractList.error(res.error);
	    }
	  },

	  onGetPaymentTerm: function onGetPaymentTerm(res) {
	    ajaxActions.request('/api/receipt/getPaymentTerm', res, this.doneGetPaymentTerm);
	  },

	  doneGetPaymentTerm: function doneGetPaymentTerm(result) {
	    if (result.status === true) {
	      paymentActions.getPaymentTerm.done(result.data);
	    } else {
	      paymentActions.getPaymentTerm.error(result.error);
	    }
	  },

	  // paymentActions.list
	  onList: function onList(param) {
	    console.log('request');
	    ajaxActions.request('/api/receipt/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      paymentActions.list.done(res.data, res.opt);
	      menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	      paymentActions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/receipt/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      paymentActions.export.done(res.file);
	    } else {
	      paymentActions.export.error(res.error);
	    }
	  },

	  onGetContractDetail: function onGetContractDetail(param) {
	    ajaxActions.request('/api/receipt/getContractDetail', param, this.doneGetContractDetail);
	  },

	  doneGetContractDetail: function doneGetContractDetail(res) {
	    if (res.status === true) {
	      paymentActions.getContractDetail.done(res.data);
	    } else {
	      paymentActions.getContractDetail.error(res.error);
	    }
	  },

	  onPrintReceipt: function onPrintReceipt(res) {
	    ajaxActions.request('/api/receipt/receipt_report', res, this.donePrintReceipt);
	  },

	  donePrintReceipt: function donePrintReceipt(res) {
	    if (res.status === true) {
	      paymentActions.printReceipt.done(res.data);
	    } else {
	      paymentActions.printReceipt.error(res.error);
	    }
	  },

	  onDeptList: function onDeptList(param) {
	    ajaxActions.request('/api/receipt/deptList', param, this.doneDeptList);
	  },

	  doneDeptList: function doneDeptList(res) {
	    if (res.status === true) {
	      paymentActions.deptList.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        paymentActions.deptList.error(res.error);
	      }
	  },

	  onGetHistoryPaymentTerm: function onGetHistoryPaymentTerm(res) {
	    ajaxActions.request('/api/receipt/getHistoryPaymentTerm', res, this.doneGetHistoryPaymentTerm);
	  },

	  doneGetHistoryPaymentTerm: function doneGetHistoryPaymentTerm(result) {
	    if (result.status === true) {
	      paymentActions.getHistoryPaymentTerm.done(result.data);
	    } else {
	      paymentActions.getHistoryPaymentTerm.error(result.error);
	    }
	  },

	  onExportDept: function onExportDept(param) {
	    ajaxActions.request('/api/receipt/exportDept', param, this.doneExportDept);
	  },

	  doneExportDept: function doneExportDept(res) {
	    if (res.status === true) {
	      paymentActions.exportDept.done(res.file);
	    } else {
	      paymentActions.exportDept.error(res.error);
	    }
	  },

	  onSaveProduct: function onSaveProduct(data) {
	    ajaxActions.request('/api/receipt/saveproduct', data, this.doneSaveProduct);
	  },

	  doneSaveProduct: function doneSaveProduct(res) {
	    if (res.status === true) {
	      paymentActions.saveProduct.done(res.data);
	    } else {
	      paymentActions.saveProduct.error(res.error);
	    }
	  },

	  onGetDataProduct: function onGetDataProduct() {
	    ajaxActions.request('/api/receipt/getdataproduct', {}, this.doneGetDataProduct);
	  },

	  doneGetDataProduct: function doneGetDataProduct(res) {
	    if (res.status === true) {
	      paymentActions.getDataProduct.done(res.data);
	    } else {
	      paymentActions.getDataProduct.error(res.error);
	    }
	  },

	  onVoidPayment: function onVoidPayment(param) {
	    ajaxActions.request('/api/receipt/voidpayment', param, this.doneVoidPayment);
	  },

	  doneVoidPayment: function doneVoidPayment(res) {
	    if (res.status === true) {
	      paymentActions.voidPayment.done(res);
	    } else {
	      paymentActions.voidPayment.error(res);
	    }
	  },

	  onCheckOndate: function onCheckOndate(param) {
	    ajaxActions.request('/api/receipt/checkOndate', param, this.doneCheckOndate);
	  },

	  doneCheckOndate: function doneCheckOndate(res) {
	    if (res.status === true) {
	      paymentActions.checkOndate.done(res.data);
	    } else {
	      paymentActions.checkOndate.error(res.error);
	    }
	  },

	  onCheckCloseCashDaily: function onCheckCloseCashDaily() {
	    ajaxActions.request('/api/receipt/checkCloseCashDaily', {}, this.doneCheckCloseCashDaily);
	  },

	  doneCheckCloseCashDaily: function doneCheckCloseCashDaily(res) {
	    if (res.status === true) {
	      paymentActions.checkCloseCashDaily.done(res.data);
	    } else {
	      paymentActions.checkCloseCashDaily.error(res.error);
	    }
	  }

	});

	module.exports = paymentStore;

/***/ },

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

/***/ 750:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    user: 'Username',
	    pass: 'Password',
	    display_name: 'Display Name',
	    last_login: 'Last Login',
	    last_ip: 'Last IP'
	  }
	};

/***/ },

/***/ 751:
/***/ function(module, exports) {

	'use strict';

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	module.exports = {
	  pos: {
	    menu: {
	      dashboard: 'ภาพรวม',
	      sell: 'ขาย',
	      recieve: 'รับเงินค่างวด'
	    },
	    product: {
	      name: 'ชื่อสินค้า',
	      amount: 'ราคา'
	    },
	    receipt: _defineProperty({
	      no: 'ลำดับ',
	      card_id: 'เลขบัตรประชาชน',
	      code: 'เลขที่สัญญา',
	      other: 'ค้นหาสินค้า',
	      due_amount: 'ค่างวด',
	      paid_amount: 'ยอดชำระ',
	      amount: 'จำนวนเงิน',
	      totalamount: 'ราคารวมทั้งสิ้น',
	      date: 'วันที่ชำระเงินล่าสุด',
	      due_date: 'วันครบกำหนด',
	      penalty: 'ค่าปรับ',
	      barcode: 'Barcode',
	      name_product: 'ชื่อสินค้า',
	      balance: 'ยอดค้างชำระ',
	      type: 'ชำระโดย',
	      remark: 'หมายเหตุ',
	      paymentoption: 'ชำระโดย',
	      staff: 'ผู้รับเงิน',
	      title: 'รับชำระ',
	      search: '1.ค้นหา',
	      paymentterm: 'ข้อมูลงวดชำระ',
	      paymenthistory: 'ประวัติการชำระ',
	      receipt_code: 'เลขที่ใบเสร็จ',
	      system_date: 'วันที่ทำรายการ',
	      term: 'งวดที่',
	      payment_option: 'ชำระโดย',
	      financelist: 'ไฟแนนซ์',
	      status_discount: 'ส่งปิดสัญญามีส่วนลด',
	      discount: 'ส่วนลด'
	    }, 'title', {
	      history: 'รายการประวัติการชำระ'
	    }),
	    action: {
	      add: 'เพิ่มรายการชำระ'
	    }
	  }
	};

/***/ },

/***/ 752:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var cashDailyActions = __webpack_require__(753);
	var cashDailyStore = __webpack_require__(754);

	var CashDaily = {};

	tr.registerTranslations('en', __webpack_require__(755));
	tr.registerTranslations('th', __webpack_require__(756));

	CashDaily.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('cashDaily.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// CashDaily.List = require('./cashDaily-list.jsx');
	// CashDaily.Edit = require('./cashDaily-edit.jsx');
	// CashDaily.insertOld = require('./cashDaily-insertOld.jsx');

	// CashDaily.Routes = (
	//   <Route name="pos.cashDaily" path="cashDaily" handler={CashDaily.Index}>
	//     <Route name="pos.cashDaily.list" path="list" handler={CashDaily.List}/>
	//     <Route name="pos.cashDaily.edit" path="edit/:id/:sendStatus" handler={CashDaily.Edit}/>
	//     <Route name="pos.cashDaily.insertOld" path="insertOld" handler={CashDaily.insertOld}/>
	//   </Route>
	// );

	module.exports = CashDaily;

/***/ },

/***/ 753:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'ddlList': { children: ['done', 'error'] },
	  'getBank': { children: ['done', 'error'] },
	  'getDataTable': { children: ['done', 'error'] },
	  'getDataMain': { children: ['done', 'error'] },
	  'getDataDetail': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'insertOld': { children: ['done', 'error'] }
	  // 'getData':{children:['done','error']}
	});

/***/ },

/***/ 754:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var cashDailyActions = __webpack_require__(753);

	var cashDailyStore = Reflux.createStore({
	  listenables: [cashDailyActions],

	  // contractActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/cashDaily/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {

	    if (res.status === true) {
	      cashDailyActions.list.done(res.data, res.opt);
	      menuActions.updateCount('cashDaily', res.opt.totalRows);
	    } else {
	      cashDailyActions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/cashDaily/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      cashDailyActions.export.done(res.file);
	    } else {
	      cashDailyActions.export.error(res.error);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/cashDaily/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      cashDailyActions.getById.done({
	        cashDaily: res.cashDaily,
	        paymentTerm: res.paymentTerm,
	        refContract: res.refContract
	      });
	    } else {
	      cashDailyActions.getById.error(res.msg);
	    }
	  },

	  onDdlList: function onDdlList() {
	    ajaxActions.request('/api/cashDaily/ddlList', {}, this.doneDdlList);
	  },

	  doneDdlList: function doneDdlList(res) {
	    if (res.status === true) {
	      cashDailyActions.ddlList.done(res.data);
	    } else {
	      cashDailyActions.ddlList.error(res.error);
	    }
	  },

	  onGetDataMain: function onGetDataMain(id, status) {
	    console.log('id:', id);
	    ajaxActions.request('/api/cashDaily/getDataMain', { id: id, shop_id: system.sessionStore.getSession().shop.id, status: status }, this.doneGetDataMain);
	  },

	  doneGetDataMain: function doneGetDataMain(res) {
	    if (res.status === true) {
	      cashDailyActions.getDataMain.done(res.data);
	    } else {
	      cashDailyActions.getDataMain.error(res.error);
	    }
	  },

	  onGetBank: function onGetBank() {
	    ajaxActions.request('/api/cashDaily/getBank', {}, this.doneGetBank);
	  },

	  doneGetBank: function doneGetBank(res) {
	    if (res.status === true) {
	      cashDailyActions.getBank.done(res.data);
	    } else {
	      cashDailyActions.getBank.error(res.error);
	    }
	  },

	  onGetDataTable: function onGetDataTable(date) {
	    ajaxActions.request('/api/cashDaily/getDataTable', { date: date }, this.doneGetDataTable);
	  },

	  doneGetDataTable: function doneGetDataTable(res) {
	    if (res.status === true) {
	      cashDailyActions.getDataTable.done(res.data);
	    } else {
	      cashDailyActions.getDataTable.error(res.error);
	    }
	  },

	  onGetDataDetail: function onGetDataDetail(id) {
	    ajaxActions.request('/api/cashDaily/getDataDetail', { id: id }, this.doneGetDataDetail);
	  },

	  doneGetDataDetail: function doneGetDataDetail(res) {
	    if (res.status === true) {
	      cashDailyActions.getDataDetail.done(res.data);
	    } else {
	      cashDailyActions.getDataDetail.error(res.error);
	    }
	  },

	  onSave: function onSave(param) {
	    ajaxActions.request('/api/cashDaily/save', param, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    console.log('res:', res);
	    if (res.status === true) {
	      cashDailyActions.save.done(res.id, res.status, 'ปิดกะ');
	    } else {
	      cashDailyActions.save.error(res.error, 'รอปิดกะ');
	    }
	  },

	  onInsertOld: function onInsertOld(param) {
	    ajaxActions.request('/api/cashDaily/insertOld', param, this.doneInsertOld);
	  },

	  doneInsertOld: function doneInsertOld(res) {
	    if (res.status === true) {
	      cashDailyActions.insertOld.done(res.data);
	    } else {
	      cashDailyActions.insertOld.error(res.error);
	    }
	  }

	});

	module.exports = cashDailyStore;

/***/ },

/***/ 755:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    user: 'Username',
	    pass: 'Password',
	    display_name: 'Display Name',
	    last_login: 'Last Login',
	    last_ip: 'Last IP'
	  },
	  status: {
	    status1: 'รอปิดกะ',
	    status2: 'ปิดกะ',
	    status3: 'รอตรวจสอบ',
	    status4: 'เปิดให้แก้ไข',
	    status5: 'ปิดยอด',
	    status6: 'อนุมัติ'
	  }
	};

/***/ },

/***/ 756:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  cashDaily: {
	    created_by: 'วันที่นำส่ง',
	    shop_code: 'สาขา',
	    shop_tel: 'เบอร์โทร',
	    approve_date: 'วันที่ตรวจ',
	    remark: 'หมายเหตุ',
	    status: 'สถานะ',
	    cash_on_report: 'ยอดนำส่ง',
	    c_on_report: 'เงินสดที่ต้องได้รับ',
	    pastday_pending_transfer: 'ค้างโอนจากวันอื่น',
	    cash_transfer: 'ร้านโอนเงิน',
	    bank: 'ธนาคาร',
	    doc_ref: 'เลขที่อ้างอิง',
	    today_pending_transfer: 'ค้างโอนวันนี้',
	    receive_pending_transfer: 'ร้านคืนค้างโอน',
	    total_pending_transfer: 'รวมค้างโอน',
	    title: {
	      index: 'ปิดกะนำส่งเงิน',
	      list: 'รายการรอปิดกะ'
	    },
	    stat: {
	      cd_created_at: 'สร้าง',
	      cd_updated_at: 'แก้ไข',
	      cd_close_date: 'ปิดยอด',
	      cd_approve_date: 'อนุมัติ',
	      cd_history: 'วันที่ค้างโอน',
	      cd_amount: 'ยอดเงิน'
	    },
	    table: {
	      type: 'ประเภท',
	      old: 'ยกมา',
	      sell: 'ขาย',
	      return: 'คืน',
	      finance: 'รับค่างวด',
	      income: 'รับ',
	      expense: 'จ่าย',
	      cash_transfer: 'ยอดนำส่ง'
	    }
	  },
	  status: {
	    status1: 'รอปิดกะ',
	    status2: 'ปิดกะ',
	    status3: 'รอตรวจสอบ',
	    status4: 'เปิดให้แก้ไข',
	    status5: 'ปิดยอด',
	    status6: 'อนุมัติ'
	  },
	  dialog: {
	    confirm: 'ยืนยัน'
	  }
	};

/***/ },

/***/ 757:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var redeemStore = __webpack_require__(758);
	var Redeem = {};

	var system = __webpack_require__(356);
	var systemActions = system.systemActions;

	tr.registerTranslations('en', __webpack_require__(760));
	tr.registerTranslations('th', __webpack_require__(761));

	Redeem.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('pos.redeem.search'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	// Redeem.screen = require('./redeem-screen.jsx');

	// Redeem.Routes = (
	//   <Route name="pos.redeem" path="redeem" handler={Redeem.Index}>
	//      <Router.DefaultRoute name="pos.redeem.screen" path="redeem" handler={Redeem.screen}/>
	//   </Route>
	// );

	module.exports = Redeem;

/***/ },

/***/ 758:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions; // require('../../../actions/ajax');
	var ajaxStore = system.ajaxStore; // require('../../../stores/ajax');
	var menuActions = system.menuActions; // require('../../../actions/menu');
	var Reflux = __webpack_require__(337);
	var receiptActions = __webpack_require__(759);

	var receiptStore = Reflux.createStore({
	  listenables: [receiptActions],

	  onCheckredeem: function onCheckredeem(param) {
	    ajaxActions.request('/api/receipt/checkredeem', param, this.doneCheckredeem);
	  },

	  doneCheckredeem: function doneCheckredeem(res) {
	    if (res.status === true) {
	      receiptActions.checkredeem.done(res.data);
	    } else {
	      receiptActions.checkredeem.error(res.error);
	    }
	  }

	});

	module.exports = receiptStore;

/***/ },

/***/ 759:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'checkredeem': { children: ['done', 'error'] }
	});

/***/ },

/***/ 760:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    user: 'Username',
	    pass: 'Password',
	    display_name: 'Display Name',
	    last_login: 'Last Login',
	    last_ip: 'Last IP'
	  }
	};

/***/ },

/***/ 761:
/***/ function(module, exports) {

	'use strict';

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	module.exports = {
	  pos: {
	    menu: {
	      dashboard: 'ภาพรวม',
	      sell: 'ขาย',
	      recieve: 'รับเงินค่างวด'
	    },
	    product: {
	      name: 'ชื่อสินค้า',
	      amount: 'ราคา'
	    },
	    redeem: _defineProperty({
	      no: 'ลำดับ',
	      card_id: 'เลขบัตรประชาชน',
	      code: 'เลขที่สัญญา',
	      other: 'ค้นหาสินค้า',
	      due_amount: 'ค่างวด',
	      paid_amount: 'ยอดชำระ',
	      amount: 'จำนวนเงิน',
	      totalamount: 'ราคารวมทั้งสิ้น',
	      date: 'วันที่ชำระเงินล่าสุด',
	      due_date: 'วันครบกำหนด',
	      penalty: 'ค่าปรับ',
	      barcode: 'Barcode',
	      name_product: 'ชื่อสินค้า',
	      balance: 'ยอดค้างชำระ',
	      type: 'ชำระโดย',
	      remark: 'หมายเหตุ',
	      paymentoption: 'ชำระโดย',
	      staff: 'ผู้รับเงิน',
	      title: 'รับชำระ',
	      search: 'ค้นหาสัญญาไถ่ถอน',
	      paymentterm: 'ข้อมูลงวดชำระ',
	      paymenthistory: 'ประวัติการชำระ',
	      receipt_code: 'เลขที่ใบเสร็จ',
	      system_date: 'วันที่ทำรายการ',
	      term: 'งวดที่',
	      payment_option: 'ชำระโดย',
	      financelist: 'ไฟแนนซ์',
	      status_discount: 'ส่งปิดสัญญามีส่วนลด',
	      discount: 'ส่วนลด'
	    }, 'title', {
	      history: 'รายการประวัติการชำระ'
	    }),
	    action: {
	      redeem: {
	        confirm: 'ไถ่ถอน'
	      }
	    }
	  }
	};

/***/ },

/***/ 762:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var changeStore = __webpack_require__(763);
	var Change = {};

	var system = __webpack_require__(356);
	var systemActions = system.systemActions;

	tr.registerTranslations('en', __webpack_require__(765));
	tr.registerTranslations('th', __webpack_require__(766));

	Change.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('pos.change.search'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	// Change.screen = require('./change-screen.jsx');

	// Change.Routes = (
	//   <Route name="pos.change-product.change" path="change" handler={Change.Index}>
	//      <Router.DefaultRoute name="pos.change-product.screen" path="change" handler={Change.screen}/>
	//   </Route>
	// );

	module.exports = Change;

/***/ },

/***/ 763:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions; // require('../../../actions/ajax');
	var ajaxStore = system.ajaxStore; // require('../../../stores/ajax');
	var menuActions = system.menuActions; // require('../../../actions/menu');
	var Reflux = __webpack_require__(337);
	var changeActions = __webpack_require__(764);

	var changeStore = Reflux.createStore({
	  listenables: [changeActions],

	  onCheckproduct: function onCheckproduct(param) {

	    console.log('test');
	    ajaxActions.request('/api/change/checkproduct', param, this.doneCheckproduct);
	  },

	  doneCheckproduct: function doneCheckproduct(res) {
	    if (res.status === true) {
	      changeActions.checkproduct.done(res.data);
	    } else {
	      changeActions.checkproduct.error(res.error);
	    }
	  },

	  onSaveCloseChange: function onSaveCloseChange(id) {
	    ajaxActions.request('/api/installment/change/saveCloseChange', { id: id }, this.doneSaveCloseChange);
	  },

	  doneSaveCloseChange: function doneSaveCloseChange(res) {
	    if (res.status === true) {
	      changeActions.saveCloseChange.done(res.data);
	    } else {
	      changeActions.saveCloseChange.error(res.error);
	    }
	  }

	});

	module.exports = changeStore;

/***/ },

/***/ 764:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'checkproduct': { children: ['done', 'error'] },
	  'saveCloseChange': { children: ['done', 'error'] }
	});

/***/ },

/***/ 765:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    user: 'Username',
	    pass: 'Password',
	    display_name: 'Display Name',
	    last_login: 'Last Login',
	    last_ip: 'Last IP'
	  }
	};

/***/ },

/***/ 766:
/***/ function(module, exports) {

	'use strict';

	var _pos;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	module.exports = {
	  pos: (_pos = {
	    menu: {
	      dashboard: 'ภาพรวม',
	      sell: 'ขาย',
	      recieve: 'รับเงินค่างวด'
	    },
	    product: {
	      name: 'ชื่อสินค้า',
	      amount: 'ราคา'
	    },
	    change: _defineProperty({
	      no: 'ลำดับ',
	      card_id: 'เลขบัตรประชาชน',
	      code: 'เลขที่สัญญา',
	      other: 'ค้นหาสินค้า',
	      due_amount: 'ค่างวด',
	      paid_amount: 'ยอดชำระ',
	      amount: 'จำนวนเงิน',
	      totalamount: 'ราคารวมทั้งสิ้น',
	      date: 'วันที่ชำระเงินล่าสุด',
	      due_date: 'วันครบกำหนด',
	      penalty: 'ค่าปรับ',
	      barcode: 'Barcode',
	      name_product: 'ชื่อสินค้า',
	      balance: 'ยอดค้างชำระ',
	      type: 'ชำระโดย',
	      remark: 'หมายเหตุ',
	      paymentoption: 'ชำระโดย',
	      staff: 'ผู้รับเงิน',
	      title: 'รับชำระ',
	      search: 'ค้นหาสัญญาเปลี่ยนของ',
	      paymentterm: 'ข้อมูลงวดชำระ',
	      paymenthistory: 'ประวัติการชำระ',
	      receipt_code: 'เลขที่ใบเสร็จ',
	      system_date: 'วันที่ทำรายการ',
	      term: 'งวดที่',
	      payment_option: 'ชำระโดย',
	      financelist: 'ไฟแนนซ์',
	      status_discount: 'ส่งปิดสัญญามีส่วนลด',
	      discount: 'ส่วนลด'
	    }, 'title', {
	      history: 'รายการประวัติการชำระ'
	    })
	  }, _defineProperty(_pos, 'change', {
	    search: 'ค้นหาสัญญาเปลี่ยนของ'
	  }), _defineProperty(_pos, 'action', {
	    confirm: 'เปลี่ยนสินค้า'
	  }), _pos)
	};

/***/ },

/***/ 767:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  installment: {
	    menu: {
	      dashboard: 'Dashboard',
	      staff: 'Staffs',
	      permission: 'Permissions',
	      branch: 'Branch'
	    }
	  }
	};

/***/ },

/***/ 768:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  pos: {
	    title: {
	      index: 'ภาพรวม'
	    },
	    menu: {
	      dashboard: 'ภาพรวม',
	      sell: 'ขายหน้าร้าน',
	      receipt: 'รับชำระค่างวด',
	      receipt_dept: 'ค้นหาประวัติชำระ',
	      product: 'เพิ่มสินค้า',
	      redeem: 'ไถ่ถอนสินค้า',
	      cashDaily: 'ปิดกะ',
	      recontract: 'เลือกเลขสัญญาผิด',
	      change: 'เปลี่ยนสินค้า'
	    },
	    change: {
	      code: 'เลขที่สัญญา',
	      barcode: 'BARCODE',
	      sell_id: 'เลขที่ใบขาย'
	    }
	  },
	  receipt: {
	    contract: 'สัญญา',
	    filter_shop: 'สาขา',
	    filter_current_status: 'สถานะ',
	    code: 'เลขที่',
	    sign_date: 'วันที่ทำ',
	    shop_code: 'รหัสสาขา',
	    shop_name: 'สาขา',
	    contract_status: 'สถานะ',
	    doc_send_to: 'จัดส่งเอกสารที่',
	    doc_send_to_HOME: 'บ้าน',
	    doc_send_to_WORK: 'ที่ทำงาน',
	    customer: 'ผู้เช่าซื้อ',
	    cus_tel: 'เบอร์ลูกค้า',
	    co: 'ผู้เช่าซื้อร่วม',
	    coaddress_status: 'ที่อยู่ผู้เช่าซื้อร่วม',
	    product: 'สินค้า',
	    serial: 'S/N',
	    product_detail: 'รายละเอียดสินค้า',
	    address_status: 'ที่อยู่ปัจจุบัน',
	    work_status: 'การงาน',
	    product_status: 'ข้อมูลสินค้า',
	    payment_status: 'งวดการชำระ',
	    payment_month: 'จำนวนงวด',
	    payment_on_day: 'ชำระทุกวันที่',
	    payment_price: 'ยอดจัด',
	    payment_per_month: 'ชำระเดือนละ',
	    total_paid: 'ชำระแล้ว',
	    payment_balance: 'คงเหลือ',
	    nationid: 'บัตรประชาชน',
	    pname: 'คำนำหน้า',
	    name: 'ชื่อ',
	    lname: 'นามสกุล',
	    nation_id: 'บัตรประชาชน',
	    birth: 'วันเกิด',
	    age: 'อายุ',
	    gender: 'เพศ',
	    marital_status: 'สถานภาพ',
	    cur_status: 'สถานะ',
	    pay_date: 'วันที่ชำระ',
	    pay_staff: 'พนักงาน',
	    amount: 'ยอดชำระ',
	    address: {
	      addr1: 'เลขที่/อาคาร/หมู่บ้าน',
	      addr2: 'ซอย/ถนน',
	      tambon: 'แขวง/ตำบล',
	      amphur: 'เขต/อำเภอ',
	      province: 'จังหวัด',
	      zipcode: 'รหัสไปรษณีย์',
	      tel: 'โทรศัพท์',
	      fax: 'โทรสาร',
	      year: 'ปีที่อาศัย'
	    },
	    addr_type: 'สถานภาพที่อยู่',
	    addr_with: 'อาศัยอยู่กับ',
	    addr_person: 'จำนวนผู้อาศัยด้วย',
	    addr_month: 'เดือนที่อาศัย',
	    tel: 'โทรศัพท์',
	    mobile: 'มือถือ',
	    email: 'อีเมล',
	    work_company: 'บริษัท/ห้างร้าน',
	    work_addr1: 'เลขที่/หมู่ที่/อาคาร/ชั้น',
	    work_addr2: 'ซอย/ถนน',
	    work_type: 'ประเภทธุรกิจ',
	    work_type_other: 'อื่น ๆ',
	    work_detail: 'ลักษณะงาน',
	    work_department: 'แผนก',
	    work_position: 'ตำแหน่ง',
	    work_time: 'เวลาที่สะดวก',
	    work_year: 'อายุงาน(ปี)',
	    work_salary: 'ฐานเงินเดือน',
	    work_income: 'รายได้อื่น ๆ',
	    work_income_source: 'แหล่งที่มารายได้อื่น ๆ',
	    work_prev_company: 'สถานที่ทำงานเดิม',
	    work_prev_addr: 'ที่ตั้ง',
	    work_prev_department: 'แผนก',
	    work_prev_tel: 'โทรศัพท์',
	    title: {
	      list: 'รายการสัญญาเช่าซื้อทั้งหมด',
	      deptlist: 'รายการประวัติชำระทั้งหมด'
	    },
	    action: {
	      new: 'เพิ่มสาขาใหม่'
	    },
	    person_info: 'ข้อมูลส่วนตัว',
	    work_info: 'สภานภาพการงาน',
	    card_info: 'บัตรประชาชน',
	    gen_payment: 'สร้างงวดชำระ',
	    payment: {
	      date: 'วันที่ชำระ',
	      amount: 'ยอดชำระ'
	    },
	    status: {
	      WAIT: 'รอจ่าย',
	      WAIT_PARTIAL: 'ชำระบางส่วน',
	      WAIT_PAID: 'ชำระแล้ว',
	      OVERDUE: 'เกินกำหนด',
	      OVERDUE_PARTIAL: 'เกิน, ชำระบางส่วน',
	      OVERDUE_PAID: 'เกิน, ชำระแล้ว'
	    },
	    current_status: {
	      ALL: 'ทุกสถานะ',
	      NORMAL: 'ปกติ',
	      DEBT: 'ค้างชำระ',
	      CLOSE_NORMAL: 'ปิดสัญญา ปกติ',
	      CLOSE_RETURN: 'ปิดสัญญา คืนของ',
	      CLOSE_CONFISCATE: 'ปิดสัญญา ยึดของคืน',
	      CLOSE_BAD_DEBT: 'ปิดสัญญา ตัดหนี้สูญ',
	      CLOSE_CANCEL: 'ปิดสัญญา ยกลิก'
	    },

	    view: {
	      summary: 'ภาพรวม',
	      customer: 'ข้อมูลลูกค้า',
	      payment: 'งวดชำระ',
	      call: 'การติดตาม'
	    },
	    term: {
	      num: 'งวด',
	      due_date: 'กำหนดชำระ',
	      due_amount: 'ยอดชำระ',
	      paid_date: 'วันที่ชำระ',
	      paid_amount: 'ชำระแล้ว',
	      due_status: 'เกินกำหนด',
	      paid_status: 'สถานะการชำระ',
	      ref_code: 'เลขที่ใบเสร็จอ้างอิง'
	    },
	    filter_type: 'ประเภทการคืน',
	    confirm_discount: 'จำนวนเงินส่วนลด',
	    confirm_discount_title: 'ยืนยันการปิดสัญญาแบบมีส่วนลด',
	    confirm_void_title: 'ยืนยันการยกเลิกใบเสร็จ',
	    confirm_button: 'ยืนยัน',
	    confirm_savedup_title: 'ยืนยันการบันทึกรายการค่างวด',
	    confirm_savedup: 'ข้อความยืนยัน'
	  }
	};

/***/ }

});