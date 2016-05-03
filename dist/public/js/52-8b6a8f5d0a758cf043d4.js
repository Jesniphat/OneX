webpackJsonp([52,135],{

/***/ 734:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions; //require('../../system/actions');

	var sellActions = __webpack_require__(735);
	var sellStore = __webpack_require__(736);

	var Sell = {};

	tr.registerTranslations('en', __webpack_require__(737));
	tr.registerTranslations('th', __webpack_require__(738));

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

/***/ 735:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getInitData': { children: ['done', 'error'] },
	  'getProductDetail': { children: ['done', 'error'] },
	  'getCustomerDetail': { children: ['done', 'error'] },
	  'saveData': { children: ['done', 'error'] },
	  'dateChange': { children: ['done', 'error'] }
	});

/***/ },

/***/ 736:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);
	var ajax = system.ajaxActions; //require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var actions = __webpack_require__(735);

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

/***/ 737:
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

/***/ 738:
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

/***/ }

});