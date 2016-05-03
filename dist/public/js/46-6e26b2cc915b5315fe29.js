webpackJsonp([46,135],{

/***/ 727:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var barcodeActions = __webpack_require__(728);
	var barcodeStore = __webpack_require__(729);

	var BillingReceive = {};

	tr.registerTranslations('en', __webpack_require__(730));
	tr.registerTranslations('th', __webpack_require__(731));

	BillingReceive.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('finance.billing_receive.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// BillingReceive.Routes = (
	//   <Route name="finance.billing_receive" path="billing_receive" handler={BillingReceive.Index}>
	//     <Router.DefaultRoute name="finance.billing_receive.screen" handler={require('./billing_receive-screen.jsx')}/>
	//   </Route>
	// );

	module.exports = BillingReceive;

/***/ },

/***/ 728:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'query': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] }
	});

/***/ },

/***/ 729:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var billingActions = __webpack_require__(728);

	var billingStore = Reflux.createStore({
	  listenables: [billingActions],

	  onQuery: function onQuery(param) {
	    ajaxActions.request('/api/finance/billing_receive/query', param, this.doneQuery);
	  },

	  doneQuery: function doneQuery(res) {
	    if (res.status === true) {
	      billingActions.list.done(res.data, res.opt);
	    } else {
	      billingActions.list.error(res.error);
	    }
	  },

	  onFacet: function onFacet() {
	    ajaxActions.request('/api/finance/billing_receive/facet', {}, this.doneFacet);
	  },

	  doneFacet: function doneFacet(res) {
	    if (res.status === true) {
	      billingActions.facet.done(res);
	    } else {
	      billingActions.facet.error(res.error);
	    }
	  }
	});

	module.exports = billingStore;

/***/ },

/***/ 730:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 731:
/***/ function(module, exports) {

	'use strict';

	var _billing_receive;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	module.exports = {
	  finance: {
	    billing_receive: (_billing_receive = {
	      title: {
	        index: 'รับวางบิล'
	      },
	      date_in: 'วันที่รับสินค้า',
	      invoice_date: 'วันที่ใบแจ้งหนี้',
	      paid_date: 'ทำจ่ายวันที่',
	      invoice_code: 'เลขที่ใบแจ้งหนี้',
	      supplier: 'ซื้อจาก'
	    }, _defineProperty(_billing_receive, 'paid_date', 'วันที่ทำจ่าย'), _defineProperty(_billing_receive, 'paid_status', 'สถานะ'), _defineProperty(_billing_receive, 'paid_status_ALL', 'ทุกสถานะ'), _defineProperty(_billing_receive, 'paid_status_W', 'รอทำจ่าย'), _defineProperty(_billing_receive, 'paid_status_F', 'ทำจ่ายแล้ว'), _defineProperty(_billing_receive, 'remark', 'หมายเหตุ'), _defineProperty(_billing_receive, 'chk_all', 'เลือกทั้งหมด'), _defineProperty(_billing_receive, 'items', {
	      date_in: 'วันที่รับเข้า',
	      shop: 'สาขา',
	      po: 'PO',
	      invoice: 'ใบแจ้งหนี้',
	      invoice_date: 'วันที่',
	      supplier: 'ซื้อจาก',
	      product: 'สินค้า',
	      serial: 'S/N',
	      barcode: 'บาร์โค้ด',
	      qty: 'จำนวน',
	      cost: 'ทุนซื้อ',
	      remark: 'หมายเหตุ',
	      paid_date: 'วันที่จ่าย',
	      bill_no: 'ใบที่',
	      check: 'เลือก'
	    }), _billing_receive)
	  }
	};

/***/ }

});