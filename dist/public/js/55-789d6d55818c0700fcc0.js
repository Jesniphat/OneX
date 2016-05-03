webpackJsonp([55,135],{

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

/***/ }

});