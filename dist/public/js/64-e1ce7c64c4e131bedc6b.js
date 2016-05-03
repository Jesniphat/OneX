webpackJsonp([64,135],{

/***/ 749:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var redeemStore = __webpack_require__(750);
	var Redeem = {};

	var system = __webpack_require__(354);
	var systemActions = system.systemActions;

	tr.registerTranslations('en', __webpack_require__(752));
	tr.registerTranslations('th', __webpack_require__(753));

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

/***/ 750:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions; // require('../../../actions/ajax');
	var ajaxStore = system.ajaxStore; // require('../../../stores/ajax');
	var menuActions = system.menuActions; // require('../../../actions/menu');
	var Reflux = __webpack_require__(335);
	var receiptActions = __webpack_require__(751);

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

/***/ 751:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'checkredeem': { children: ['done', 'error'] }
	});

/***/ },

/***/ 752:
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

/***/ 753:
/***/ function(module, exports) {

	'use strict';

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
	    redeem: {
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
	      discount: 'ส่วนลด',
	      title: {
	        history: 'รายการประวัติการชำระ'
	      }
	    },
	    action: {
	      redeem: {
	        confirm: 'ไถ่ถอน'
	      }
	    }
	  }
	};

/***/ }

});