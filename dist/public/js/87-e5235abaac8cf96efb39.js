webpackJsonp([87,135],{

/***/ 844:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var receiptStore = __webpack_require__(845);
	var Commission = {};

	var system = __webpack_require__(354);
	var systemActions = system.systemActions;

	tr.registerTranslations('en', __webpack_require__(847));
	tr.registerTranslations('th', __webpack_require__(848));

	Commission = React.createClass({
	  displayName: 'Commission',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('report.commission.search'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	//Commission.List = require('./commission-close-list.jsx');

	// Commission.Routes = (
	//   <Route name="installment.report-commission-close" path="report-commission-close" handler={Commission.Index}>
	//      <Router.DefaultRoute name="installment.report-commission-close.list" path="list" handler={Commission.List}/>
	//   </Route>
	// );

	module.exports = Commission;

/***/ },

/***/ 845:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions; // require('../../../actions/ajax');
	var ajaxStore = system.ajaxStore; // require('../../../stores/ajax');
	var menuActions = system.menuActions; // require('../../../actions/menu');
	var Reflux = __webpack_require__(335);
	var commissionActions = __webpack_require__(846);

	var commissionStore = Reflux.createStore({
	  listenables: [commissionActions],

	  // commissionActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/report/listclose', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      commissionActions.list.done(res.data, res.opt);
	      // console.log('total=',res.opt.totalRows);
	      // menuActions.updateCount('report.sell', res.opt.totalRows);
	    } else {
	        commissionActions.list.error(res.error);
	      }
	  },
	  // contractActions.list
	  onExportclose: function onExportclose(param) {
	    console.log('request');
	    ajaxActions.request('/api/report/exportclose', param, this.doneExportclose);
	  },

	  doneExportclose: function doneExportclose(res) {
	    if (res.status === true) {
	      commissionActions.exportclose.done(res.file);
	    } else {
	      commissionActions.exportclose.error(res.error);
	    }
	  }

	});

	module.exports = commissionStore;

/***/ },

/***/ 846:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'exportclose': { children: ['done', 'error'] }
	});

/***/ },

/***/ 847:
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

/***/ 848:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  commision: {
	    search: 'รายงานสรุปค่าคอมปิด',
	    shop_name: 'สาขา',
	    receipt_code: 'เลขที่ใบเสร็จ',
	    staff_name: 'ไฟแนนซ์',
	    pay_date: 'วันที่ทำรายการ',
	    cost_term: 'ทุนประจำงวด',
	    amount: 'ยอดเงินรับ',
	    profit: 'กำไร',
	    paid_period: 'เดือนที่จ่าย'
	  }
	};

/***/ }

});