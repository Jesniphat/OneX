webpackJsonp([81,135],{

/***/ 824:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions;

	var commissionActions = __webpack_require__(825);
	var commissionStore = __webpack_require__(826);

	var Barcode = {};

	tr.registerTranslations('en', __webpack_require__(827));
	tr.registerTranslations('th', __webpack_require__(828));

	Barcode = React.createClass({
	  displayName: 'Barcode',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('installment.commission-close.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// Barcode.Routes = (
	//   <Route name="installment.commission-close" path="commission-close" handler={Barcode.Index}>
	//     <Router.DefaultRoute name="installment.commission-close.list" handler={require('./commission-list.jsx')}/>
	//     <Route name="installment.commission-close.detail" path="detail/:term_year/:term_month/:shop_id/:staff_id" handler={require('./commission-detail.jsx')}/>
	//   </Route>
	// );

	module.exports = Barcode;

/***/ },

/***/ 825:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facetList': { children: ['done', 'error'] },
	  'genrate': { children: ['done', 'error'] },
	  'facetDetail': { children: ['done', 'error'] },
	  'commissionDetail': { children: ['done', 'error'] },
	  'saveCommission': { children: ['done', 'error'] },
	  'voidCommission': { children: ['done', 'error'] },
	  'paidCommission': { children: ['done', 'error'] }
	});

/***/ },

/***/ 826:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var commissionActions = __webpack_require__(825);

	var commissionStore = Reflux.createStore({
	  listenables: [commissionActions],

	  // commissionActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/installment/commission-close/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      console.log('data=', res.data);
	      commissionActions.list.done(res.data, res.opt);
	      //      menuActions.updateCount('commission.sell', res.opt.totalRows);
	    } else {
	        commissionActions.list.error(res.error);
	      }
	  },
	  // commissionActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/installment/commission-close/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      commissionActions.export.done(res.file);
	    } else {
	      commissionActions.export.error(res.error);
	    }
	  },

	  onFacetList: function onFacetList() {
	    ajaxActions.request('/api/installment/commission-close/facetList', {}, this.doneFacetList);
	  },

	  doneFacetList: function doneFacetList(res) {
	    if (res.status === true) {
	      commissionActions.facetList.done(res);
	    } else {
	      commissionActions.facetList.error(res.error);
	    }
	  },

	  onFacetDetail: function onFacetDetail(param) {
	    ajaxActions.request('/api/installment/commission-close/facetDetail', param, this.doneFacetDetail);
	  },

	  doneFacetDetail: function doneFacetDetail(res) {
	    if (res.status === true) {
	      commissionActions.facetDetail.done(res);
	    } else {
	      commissionActions.facetDetail.error(res.error);
	    }
	  },

	  onCommissionDetail: function onCommissionDetail(param) {
	    ajaxActions.request('/api/installment/commission-close/commissionDetail', param, this.doneCommissionDetail);
	  },

	  doneCommissionDetail: function doneCommissionDetail(res) {
	    if (res.status === true) {
	      commissionActions.commissionDetail.done(res);
	    } else {
	      commissionActions.commissionDetail.error(res.error);
	    }
	  },

	  onSaveCommission: function onSaveCommission(param) {
	    ajaxActions.request('/api/installment/commission-close/saveCommission', param, this.doneSaveCommission);
	  },

	  doneSaveCommission: function doneSaveCommission(res) {
	    if (res.status === true) {
	      commissionActions.saveCommission.done(res);
	    } else {
	      commissionActions.saveCommission.error(res.error);
	    }
	  },

	  onVoidCommission: function onVoidCommission(id) {
	    ajaxActions.request('/api/installment/commission-close/voidCommission', { id: id }, this.doneVoidCommission);
	  },

	  doneVoidCommission: function doneVoidCommission(res) {
	    if (res.status === true) {
	      commissionActions.voidCommission.done();
	    } else {
	      commissionActions.voidCommission.error(res.error);
	    }
	  },

	  onPaidCommission: function onPaidCommission(id) {
	    ajaxActions.request('/api/installment/commission-close/paidCommission', { id: id }, this.donePaidCommission);
	  },

	  donePaidCommission: function donePaidCommission(res) {
	    if (res.status === true) {
	      commissionActions.paidCommission.done();
	    } else {
	      commissionActions.paidCommission.error(res.error);
	    }
	  }

	});

	module.exports = commissionStore;

/***/ },

/***/ 827:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  commission: {}
	};

/***/ },

/***/ 828:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  installment: {
	    "commission-close": {
	      title: {
	        index: 'ค่าคอมปิดสัญญา',
	        list: 'รายการสรุปค่าคอมปิดสัญญา',
	        detail: 'รายละเอียดการปิดสัญญา'
	      },
	      list: {
	        shop: 'สาขา',
	        display_name: 'ชื่อพนักงาน',
	        cost: 'ทุนรวม',
	        amount: 'ราคารวม',
	        profit: 'กำไรรวม',
	        contract_amount: 'จำนวนสัญญา'
	      },
	      sell_staff_name: 'พนักงานขาย',
	      sign_date: 'วันที่ขาย',
	      code: 'สัญญา',
	      cus_fullname: 'ลูกค้า',
	      sum_product_price: 'ขายสุทธิ',
	      sum_payment_price: 'ผ่อนร้าน',
	      sum_cost: 'ทุนขาย',
	      sum_fee: 'ค่าสัญญา',
	      sum_install_cost: 'ค่าติดตั้ง',
	      sum_profit: 'กำไร',
	      paid_status: 'จ่ายแล้ว?',
	      authorized_date: 'วันที่',
	      num_receipt: '#',
	      filter_shop: 'สาขา',
	      filter_term_year: ' ',
	      filter_term_month: ' ',
	      filter_staff: ' ',
	      total_profit: 'กำไรรวม',
	      profit_amount: 'กำไรรวม',
	      total_contract: 'จำนวนสัญญา',
	      paid_pct: '% จ่าย',
	      paid_amount: 'จำนวนเงินจ่าย',
	      term_year: 'งวดการจ่าย',
	      term_month: 'เดือน',
	      authorized_date: 'วันที่',
	      remark: 'บันทึกข้อความ',
	      payment_term: 'งวด',
	      closeca: 'หักค่าสัญญาหนีหนี้',
	      payment: {
	        summary_period: 'สรุป',
	        paid_period: 'จ่าย',
	        num_receipt: '#',
	        profit_amount: 'กำไรรวม',
	        paid_pct: '%',
	        paid_amount: 'จำนวนเงิน',
	        authorized_date: 'อนุมัติ',
	        remark: 'หมายเหตุ',
	        status: 'สถานะ',
	        status_READY: 'พร้อมจ่าย',
	        status_PAID: 'จ่ายแล้ว',
	        status_VOID: 'ยกเลิก',
	        other_paid: 'หัก/จ่ายอื่น ๆ'
	      },
	      contract: {
	        no: 'ที่',
	        close_date: 'ปิดวันที่',
	        code: 'เลขที่',
	        customer: 'ลูกค้า',
	        product: 'สินค้า',
	        total_paid: 'ยอดจ่าย',
	        cost: 'ทุนขาย',
	        fee: 'ค่าสัญญา',
	        install_cost: 'ค่าติดตั้ง',
	        profit: 'กำไร',
	        payment_month: '#งวด',
	        status: 'สถานะ',
	        commision_paid: 'จ่าย'
	      },
	      receipt: {
	        no: 'ที่',
	        contract_code: 'เลขที่สัญญา',
	        cus_name: 'ชื่อผู้เช่าซื้อ',
	        close_date: 'วันที่ปิด',
	        sell_date: 'วันที่ขาย',
	        pay_date: 'วันที่รับเงิน',
	        code: 'เลขที่',
	        shop_name: 'สาขา',
	        cost: 'ทุนประจำงวด',
	        amount: 'ยอดเงินรับ',
	        profit: 'กำไร',
	        finance_name: 'ชื่อไฟแนนซ์'
	      }
	    }
	  }
	};

/***/ }

});