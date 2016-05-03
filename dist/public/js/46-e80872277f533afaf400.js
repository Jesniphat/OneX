webpackJsonp([46,135],{

/***/ 719:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions;

	var barcodeActions = __webpack_require__(720);
	var barcodeStore = __webpack_require__(721);

	var BillingReceive = {};

	tr.registerTranslations('en', __webpack_require__(722));
	tr.registerTranslations('th', __webpack_require__(723));

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

/***/ 720:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'query': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] }
	});

/***/ },

/***/ 721:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var billingActions = __webpack_require__(720);

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

/***/ 722:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 723:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  finance: {
	    billing_receive: {
	      title: {
	        index: 'รับวางบิล'
	      },
	      date_in: 'วันที่รับสินค้า',
	      invoice_date: 'วันที่ใบแจ้งหนี้',
	      paid_date: 'ทำจ่ายวันที่',
	      invoice_code: 'เลขที่ใบแจ้งหนี้',
	      supplier: 'ซื้อจาก',
	      paid_date: 'วันที่ทำจ่าย',
	      paid_status: 'สถานะ',
	      paid_status_ALL: 'ทุกสถานะ',
	      paid_status_W: 'รอทำจ่าย',
	      paid_status_F: 'ทำจ่ายแล้ว',
	      remark: 'หมายเหตุ',
	      chk_all: 'เลือกทั้งหมด',
	      items: {
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
	      }
	    }
	  }
	};

/***/ }

});