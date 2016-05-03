webpackJsonp([120,135],{

/***/ 1004:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var receiptStore = __webpack_require__(1005);
	var Commission = {};

	var system = __webpack_require__(356);
	var systemActions = system.systemActions;

	tr.registerTranslations('en', __webpack_require__(1007));
	tr.registerTranslations('th', __webpack_require__(1008));

	Commission.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('report.commission.searchopen'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	// Commission.List = require('./commission-open-list.jsx');

	// Commission.Routes = (
	//   <Route name="report.report-commission-open" path="report-commission-open" handler={Commission.Index}>
	//      <Router.DefaultRoute name="report.report-commission-open.list" path="list" handler={Commission.List}/>
	//   </Route>
	// );

	module.exports = Commission;

/***/ },

/***/ 1005:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions; // require('../../../actions/ajax');
	var ajaxStore = system.ajaxStore; // require('../../../stores/ajax');
	var menuActions = system.menuActions; // require('../../../actions/menu');
	var Reflux = __webpack_require__(337);
	var commissionActions = __webpack_require__(1006);

	var commissionStore = Reflux.createStore({
	  listenables: [commissionActions],

	  // commissionActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/report/listopen', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      commissionActions.list.done(res.data, res.opt);
	    } else {
	      commissionActions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExportopen: function onExportopen(param) {
	    ajaxActions.request('/api/report/exportopen', param, this.doneExportopen);
	  },

	  doneExportopen: function doneExportopen(res) {
	    if (res.status === true) {
	      commissionActions.exportopen.done(res.file);
	    } else {
	      commissionActions.exportopen.error(res.error);
	    }
	  }

	});

	module.exports = commissionStore;

/***/ },

/***/ 1006:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'exportopen': { children: ['done', 'error'] }
	});

/***/ },

/***/ 1007:
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

/***/ 1008:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  commision: {
	    search: 'สรุปค่าคอมเปิด',
	    contract_code: 'เลขที่สัญญา',
	    shop_name: 'สาขา',
	    sell_staff: 'พนักงานขาย',
	    product_detail: 'สินค้า',
	    product_serial: 'serial',
	    cost: 'ทุนพนักงาน',
	    install_cost: 'ค่าติดตั้ง',
	    fee: 'ค่าทำสัญญา',
	    total_price: 'ราคาขาย',
	    profit: 'กำไร',
	    paid_period: 'เดือนที่จ่าย',
	    cus_name: 'ผู้เช่าซื้อ',
	    sign_date: 'วันที่ขาย'
	  }
	};

/***/ }

});