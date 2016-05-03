webpackJsonp([104,135],{

/***/ 926:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var DefaultRoute = Router.DefaultRoute;
	var RouteHandler = Router.RouteHandler;
	var tr = __webpack_require__(207);
	var T = __webpack_require__(381);

	var system = __webpack_require__(354);
	var systemActions = system.systemActions; //require('../system/actions');
	var menuActions = system.menuActions; //require('../system/actions/menu');
	var infoPanelActions = system.infoPanelActions;

	var Info = __webpack_require__(927);

	tr.registerTranslations('en', __webpack_require__(930));
	tr.registerTranslations('th', __webpack_require__(931));

	var App = {};

	App.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setTheme(3);
	    systemActions.updateTopPanel({
	      code: 'info',
	      name: 'info',
	      icon: 'view12'
	    });
	    menuActions.show([{ id: 'dashboard', route: '/info/dashboard', label: 'info.menu.dashboard', icon: 'show6', acl: ['M_INFO_DASHBOARD'] }, { id: 'infototal', route: '/info/total', label: 'info.menu.total', icon: 'show6', acl: ['M_INFO_TOTAL'] }, { id: 'infostockinfo', route: '/info/stock', label: 'info.menu.stock', icon: 'show6', acl: ['M_INFO_STOCK'] }, { id: 'infostockin', route: '/info/stockin', label: 'info.menu.stockin', icon: 'show6', acl: ['M_INFO_STOCKIN'] }, { id: 'infoaginginfo', route: '/info/aging/0', label: 'info.menu.aging', icon: 'show6', acl: ['M_INFO_AGING'] }, { id: 'infotransfer', route: '/info/transfer', label: 'info.menu.transfer', icon: 'show6', acl: ['M_INFO_TRANSFER'] }, { id: 'infoselldetail', route: '/info/selldetail', label: 'info.menu.selldetail', icon: 'show6', acl: ['M_INFO_SELLDETAIL'] }, { id: 'inforeturn', route: '/info/return', label: 'info.menu.return', icon: 'show6', acl: ['M_INFO_RETURN'] }]);
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	App.Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  componentDidMount: function componentDidMount() {
	    infoPanelActions.hide();
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          React.createElement(T, { content: 'info.title.index' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          ' '
	        )
	      )
	    );
	  }
	});

	// App.Routes = (
	//   <Route name="info" path="info" handler={App.Index}>
	//        <Router.DefaultRoute name="info.dashboard" handler={App.Dashboard}/>
	//        {Info.Routes}
	//   </Route>
	// );

	module.exports = App;

/***/ },

/***/ 927:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions;
	/*
	var infoActions = require('./actions');
	var infoStore   = require('./store');
	*/
	var Info = {};

	tr.registerTranslations('en', __webpack_require__(928));
	tr.registerTranslations('th', __webpack_require__(929));

	Info.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('info.title.index'));
	  },
	  render: function render() {
	    return React.createElement(Router.RouteHandler, null);
	  }
	});

	// Info.Totalinfo = require('./total.jsx');
	// Info.Stockinfo = require('./stock.jsx');
	// Info.Stockininfo = require('./stockin.jsx');
	//Info.Aginginfo = require('./aging.jsx');
	// Info.Transferinfo = require('./transfer.jsx');
	// Info.Selldetailinfo = require('./selldetail.jsx');
	// Info.Returninfo = require('./return.jsx');

	// Info.Routes = (
	//   <Route name="info.info" path="info" handler={Info.Index}>
	//     <Router.DefaultRoute name="info.info.aging" handler={require('./aging.jsx')}/>
	//     <Route name="info.info.total" path="total" handler={require('./total.jsx')}/>
	//     <Route name="info.info.stock" path="stock" handler={ require('./stock.jsx')}/>
	//     <Route name="info.info.stockin" path="stockin" handler={ require('./stockin.jsx')}/>
	//     <Route name="info.info.transfer" path="transfer" handler={ require('./transfer.jsx')}/>
	//     <Route name="info.info.selldetail" path="selldetail" handler={ require('./selldetail.jsx')}/>
	//     <Route name="info.info.return" path="return" handler={ require('./return.jsx')}/>
	//   </Route>
	// );

	// Info.Routes = [
	//     <Route name="info.aging" path="aging/:id?" handler={require('./aging.jsx')}/>,
	//     <Route name="info.total" path="total" handler={require('./total.jsx')}/>,
	//     <Route name="info.stock" path="stock" handler={ require('./stock.jsx')}/>,
	//     <Route name="info.stockin" path="stockin" handler={ require('./stockin.jsx')}/>,
	//     <Route name="info.transfer" path="transfer" handler={ require('./transfer.jsx')}/>,
	//     <Route name="info.selldetail" path="selldetail" handler={ require('./selldetail.jsx')}/>,
	//     <Route name="info.return" path="return" handler={ require('./return.jsx')}/>
	// ];

	module.exports = Info;

/***/ },

/***/ 928:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 929:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  info: {
	    sell_date: 'วันที่ขาย',
	    receipt_no: 'ใบเสร็จ',
	    filter_shop: 'สาขา',
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
	    sales_staff: 'พนักงานขาย',
	    flag: '*',
	    total: {
	      shop_code: 'สาขา',
	      com_code: 'ซื้อจาก',
	      return_com_code: 'รหัสลูกค้า',
	      p_code: 'รหัสสินค้า',
	      sales_name: 'พนักงานขาย',
	      profit: 'กำไร',
	      product_name: 'ชื่อสินค้า',
	      total: 'จำนวน',
	      p_group: 'กลุ่มสินค้า',
	      spec: 'ลักษณะ',
	      serial: 'S/N',
	      barcode: 'BARCODE',
	      date_in: 'วันที่ทำรายการ',
	      po_cost: 'ทุนซื้อ',
	      cost: 'ทุนพนง.',
	      vat: 'vat',
	      status: 'สถานะ',
	      prod_age_day: 'วัน',
	      prod_age_month: 'เดือน',
	      ref_date: 'วันที่อ้างอิง',
	      ref_inv: 'ใบกำกับภาษี',
	      po_no: 'ใบสั่งซื้อ',
	      bystaff: 'โดย',
	      remark: 'Remark',
	      from_shop: 'จากสาขา',
	      to_shop: 'ไปสาขา',
	      id: 'เลขที่อ้างอิง',
	      sell_date: 'ขายวันที่',
	      customer_code: 'ลูกค้า',
	      contract_ref: 'เลขที่สัญญา',
	      price: 'ราคาขาย',
	      c_tell: 'เบอร์โทร.',
	      voucher_payment_status: 'สถานะจ่ายเงิน'
	    }
	  },
	  title: {
	    index: 'สัญญาเช่าซื้อ',
	    list_pending: 'รายการขายผ่อนรอเปิดสัญญา',
	    list: 'รายการสัญญาเช่าซื้อทั้งหมด',
	    view: 'รายละเอียดสัญญาเช่าซื้อ',
	    new: 'ทำสัญญาใหม่',
	    close: 'รายการยึด/คืนสินค้าทั้งหมด',
	    closediscount: 'รายการสัญญารอปิดแบบมีส่วนลด',
	    list_totalinfo: 'Info Total',
	    list_stockinfo: 'Info Stock',
	    list_aginginfo: 'Info Aging Stock',
	    list_stockininfo: 'Info Stock In',
	    list_transferinfo: 'Info Transfer',
	    list_selldetailinfo: 'Info Sell Detail',
	    list_returninfo: 'Info Return'
	  }
	};

/***/ },

/***/ 930:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  installment: {
	    menu: {
	      dashboard: 'Dashboard',
	      staff: 'Staffs',
	      permission: 'Permissions',
	      branch: 'Branch'
	    }
	  }
	};

/***/ },

/***/ 931:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  info: {
	    title: {
	      index: 'ภาพรวม'
	    },
	    menu: {
	      dashboard: 'ภาพรวม',
	      total: 'Total Info',
	      stock: 'Stock Info',
	      aging: 'Aging Stock Info',
	      stockin: 'Stock In Info',
	      transfer: 'Transfer Info',
	      selldetail: 'Sell Detail Info',
	      return: 'Return Info'
	    }
	  }
	};

/***/ }

});