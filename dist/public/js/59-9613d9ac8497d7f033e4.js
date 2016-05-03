webpackJsonp([59,135],{

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

/***/ }

});