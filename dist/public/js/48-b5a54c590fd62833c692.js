webpackJsonp([48,135],{

/***/ 726:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions;

	var actions = __webpack_require__(727);
	var store = __webpack_require__(728);

	var PaymentVoucher = {};

	tr.registerTranslations('en', __webpack_require__(729));
	tr.registerTranslations('th', __webpack_require__(730));

	PaymentVoucher.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('finance.payment_voucher.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// PaymentVoucher.Routes = (
	//   <Route name="finance.payment_voucher" path="payment_voucher" handler={PaymentVoucher.Index}>
	//     <Router.DefaultRoute name="finance.payment_voucher.screen" handler={require('./payment_voucher-screen.jsx')}/>
	//   </Route>
	// );

	module.exports = PaymentVoucher;

/***/ },

/***/ 727:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'queryForWaitList': { children: ['done', 'error'] },
	  'queryForSupplier': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] }
	});

/***/ },

/***/ 728:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var paymentVoucherActions = __webpack_require__(727);

	var paymentVoucherStore = Reflux.createStore({
	  listenables: [paymentVoucherActions],

	  onQueryForWaitList: function onQueryForWaitList(param) {
	    ajaxActions.request('/api/finance/payment-voucher/queryForWaitList', param, this.doneQueryForWaitList);
	  },

	  doneQueryForWaitList: function doneQueryForWaitList(res) {
	    if (res.status === true) {
	      paymentVoucherActions.queryForWaitList.done(res.data);
	    } else {
	      paymentVoucherActions.queryForWaitList.error(res.error);
	    }
	  },

	  onQueryForSupplier: function onQueryForSupplier(param) {
	    ajaxActions.request('/api/finance/payment-voucher/queryForSupplier', param, this.doneQueryForSupplier);
	  },

	  doneQueryForSupplier: function doneQueryForSupplier(res) {
	    if (res.status === true) {
	      paymentVoucherActions.queryForSupplier.done(res.data);
	    } else {
	      paymentVoucherActions.queryForSupplier.error(res.error);
	    }
	  },

	  onFacet: function onFacet() {
	    ajaxActions.request('/api/finance/payment_voucher/facet', {}, this.doneFacet);
	  },

	  doneFacet: function doneFacet(res) {
	    if (res.status === true) {
	      paymentVoucherActions.facet.done(res);
	    } else {
	      paymentVoucherActions.facet.error(res.error);
	    }
	  }
	});

	module.exports = paymentVoucherStore;

/***/ },

/***/ 729:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 730:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  finance: {
	    payment_voucher: {
	      title: {
	        index: 'รับวางบิล'
	      },
	      date_in: 'วันที่รับสินค้า',
	      invoice_date: 'วันที่ใบแจ้งหนี้',
	      paid_date: 'ทำจ่ายวันที่',
	      invoice_code: 'เลขที่ใบแจ้งหนี้',
	      po_code: 'เลขที่ PO',
	      supplier: 'ซื้อจาก',
	      paid_date: 'วันที่ทำจ่าย',
	      paid_status: 'สถานะ',
	      paid_status_ALL: 'ทุกสถานะ',
	      paid_status_W: 'รอทำจ่าย',
	      paid_status_F: 'ทำจ่ายแล้ว',
	      remark: 'หมายเหตุ',
	      chk_all: 'เลือกทั้งหมด',
	      search_table: {
	        code: 'PO / INV',
	        product: 'สินค้า',
	        serial_barcode: 'S/N บาร์โค้ด',
	        qty: 'จำนวน',
	        cost: 'ทุนซื้อ',
	        select_all: 'เลือกทั้งหมด'
	      },
	      voucher_table: {
	        code: 'PO / INV',
	        product: 'สินค้า',
	        serial_barcode: 'S/N บาร์โค้ด',
	        qty: 'จำนวน',
	        cost: 'ทุนซื้อ',
	        vat: 'VAT',
	        select_all: 'เอาออกทั้งหมด'
	      },
	      voucher: {
	        code: 'เลขที่',
	        paid_date: 'วันที่จ่าย',
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
	        status_ACCEPT: 'อนุมัติ (ACCEPT)',
	        status_REJECT: 'ไม่อนุมัติ (REJECT)',
	        status_PAID: 'จ่ายแล้ว (PAID)',
	        status_VOID: 'ยกเลิก (VOID)'
	      }
	    }
	  }
	};

/***/ }

});