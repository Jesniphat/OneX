webpackJsonp([40,135],{

/***/ 710:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var actions = __webpack_require__(711);
	var store = __webpack_require__(712);

	var PaymentVoucher = {};

	tr.registerTranslations('en', __webpack_require__(713));
	tr.registerTranslations('th', __webpack_require__(714));

	PaymentVoucher.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('finance.pv.title.index'));
	  },
	  render: function render() {
	    return React.createElement(Router.RouteHandler, null);
	  }
	});

	// PaymentVoucher.Routes = (
	//   <Route name="finance.pv" path="pv" handler={PaymentVoucher.Index}>
	//     <Router.DefaultRoute name="finance.pv.list" handler={require('./pv-list.jsx')}/>
	//     <Route name="finance.pv.screen" path="/screen/:id?" handler={require('./pv-screen.jsx')}/>
	//   </Route>
	// );

	module.exports = PaymentVoucher;

/***/ },

/***/ 711:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getPV': { children: ['done', 'error'] },
	  'queryForWaitList': { children: ['done', 'error'] },
	  'queryForSupplier': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'print': { children: ['done', 'error'] }
	});

/***/ },

/***/ 712:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var pvActions = __webpack_require__(711);

	var paymentVoucherStore = Reflux.createStore({
	  listenables: [pvActions],

	  onList: function onList(param) {
	    ajaxActions.request('/api/finance/pv/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      pvActions.list.done(res.data, res.opt);
	    } else {
	      pvActions.list.error(res.error);
	    }
	  },

	  onGetPV: function onGetPV(id) {
	    ajaxActions.request('/api/finance/pv/getPV', { id: id }, this.doneGetPV);
	  },

	  doneGetPV: function doneGetPV(res) {
	    if (res.status === true) {
	      pvActions.getPV.done({
	        pv: res.pv,
	        pv_items: res.pv_items
	      });
	    } else {
	      pvActions.getPV.error(res.error);
	    }
	  },

	  onQueryForWaitList: function onQueryForWaitList(param) {
	    ajaxActions.request('/api/finance/pv/queryForWaitList', param, this.doneQueryForWaitList);
	  },

	  doneQueryForWaitList: function doneQueryForWaitList(res) {
	    if (res.status === true) {
	      pvActions.queryForWaitList.done(res.data);
	    } else {
	      pvActions.queryForWaitList.error(res.error);
	    }
	  },

	  onQueryForSupplier: function onQueryForSupplier(param) {
	    ajaxActions.request('/api/finance/pv/queryForSupplier', param, this.doneQueryForSupplier);
	  },

	  doneQueryForSupplier: function doneQueryForSupplier(res) {
	    if (res.status === true) {
	      pvActions.queryForSupplier.done(res.data);
	    } else {
	      pvActions.queryForSupplier.error(res.error);
	    }
	  },

	  onSave: function onSave(param) {
	    ajaxActions.request('/api/finance/pv/save', param, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      pvActions.save.done(res.pv);
	    } else {
	      pvActions.save.error(res.error);
	    }
	  },

	  onPrint: function onPrint(param) {
	    ajaxActions.request('/api/finance/pv/genReport', param, this.donePrint);
	  },

	  donePrint: function donePrint(res) {
	    if (res.status === true) {
	      pvActions.print.done(res.data);
	    } else {
	      pvActions.print.error(res.error);
	    }
	  },

	  onFacet: function onFacet() {
	    ajaxActions.request('/api/finance/pv/facet', {}, this.doneFacet);
	  },

	  doneFacet: function doneFacet(res) {
	    if (res.status === true) {
	      pvActions.facet.done(res);
	    } else {
	      pvActions.facet.error(res.error);
	    }
	  }
	});

	module.exports = paymentVoucherStore;

/***/ },

/***/ 713:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 714:
/***/ function(module, exports) {

	'use strict';

	var _pv;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	module.exports = {
	  finance: {
	    pv: (_pv = {
	      title: {
	        index: 'ใบสำคัญจ่าย',
	        list: 'รายการใบสำคัญจ่าย'
	      },
	      action: {
	        new: 'สร้าง'
	      },
	      list: {
	        code: 'เลขที่',
	        document_date: 'วันที่',
	        approve_date: 'วันที่อนุมัติ',
	        total_amount: 'ยอดเงิน',
	        vat_amount: 'VAT',
	        cn_code: 'C/N',
	        cn_amount: 'ลดหนี้',
	        net_amount: 'จ่ายสุทธิ',
	        staff: 'ผู้ทำรายการ',
	        status: 'สถานะ',
	        status_DRAFT: 'ร่าง',
	        status_PROPOSE: 'เสนออนุมัติ',
	        status_APPROVE: 'อนุมัติ',
	        status_REJECT: 'ไม่อนุมัติ',
	        status_PAID: 'จ่ายแล้ว',
	        status_VOID: 'ยกเลิก',
	        remark: 'หมายเหตุ',
	        supplier_code: 'ผู้จัดจำหน่าย'
	      },
	      status_not_yet_approve: 'รออนุมัติ',
	      date_in: 'วันที่รับสินค้า',
	      invoice_date: 'วันที่ใบแจ้งหนี้',
	      document_date: 'ทำจ่ายวันที่',
	      invoice_code: 'เลขที่ใบแจ้งหนี้',
	      po_code: 'เลขที่ PO',
	      supplier: 'ซื้อจาก',
	      product: 'สินค้า',
	      shop: 'สาขา'
	    }, _defineProperty(_pv, 'document_date', 'วันที่ทำจ่าย'), _defineProperty(_pv, 'paid_status', 'สถานะ'), _defineProperty(_pv, 'paid_status_ALL', 'ทุกสถานะ'), _defineProperty(_pv, 'paid_status_W', 'รอทำจ่าย'), _defineProperty(_pv, 'paid_status_F', 'ทำจ่ายแล้ว'), _defineProperty(_pv, 'remark', 'หมายเหตุ'), _defineProperty(_pv, 'chk_all', 'เลือกทั้งหมด'), _defineProperty(_pv, 'search_table', {
	      code: 'PO / INV',
	      product: 'สินค้า',
	      serial_barcode: 'S/N บาร์โค้ด',
	      qty: 'จำนวน',
	      cost: 'ทุนซื้อ',
	      select_all: 'เลือกทั้งหมด'
	    }), _defineProperty(_pv, 'voucher_table', {
	      code: 'PO / INV',
	      product: 'สินค้า',
	      serial_barcode: 'S/N บาร์โค้ด',
	      qty: 'จำนวน',
	      cost: 'ทุนซื้อ',
	      vat: 'VAT',
	      select_all: 'เอาออกทั้งหมด'
	    }), _defineProperty(_pv, 'voucher', {
	      code: 'เลขที่',
	      document_date: 'วันที่ทำจ่าย',
	      supplier: 'ผู้ขาย',
	      staff: 'การเงิน',
	      remark: 'หมายเหตุ',
	      total_amount: 'ยอดรวมก่อน VAT',
	      vat_amount: 'VAT',
	      cn_code: 'เลขที่ C/N',
	      cn_amount: 'C/N',
	      net_amount: 'ยอดสุทธิ',
	      status: 'สถานะ',
	      status_DRAFT: 'ร่าง (DRAFT)',
	      status_PROPOSE: 'เสนออนุมัติ (PROPOSE)',
	      status_APPROVE: 'อนุมัติ (APPROVE)',
	      status_REJECT: 'ไม่อนุมัติ (REJECT)',
	      status_PAID: 'จ่ายแล้ว (PAID)',
	      status_VOID: 'ยกเลิก (VOID)'
	    }), _pv)
	  }
	};

/***/ }

});