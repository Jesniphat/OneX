webpackJsonp([38,135],{

/***/ 706:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);

	var system = __webpack_require__(356);
	var systemActions = system.systemActions; //require('../system/actions');
	var menuActions = system.menuActions; //require('../system/actions/menu');
	var infoPanelActions = system.infoPanelActions;

	tr.registerTranslations('en', __webpack_require__(707));
	tr.registerTranslations('th', __webpack_require__(708));

	var App = {};

	App.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setTheme(3);
	    systemActions.updateTopPanel({
	      code: 'finance',
	      name: 'การเงิน',
	      icon: 'email107'
	    });

	    menuActions.show([{ id: 'dashboard', route: '/finance/dashboard', label: 'finance.menu.dashboard', icon: 'show6', acl: ['M_FINANCE_DASHBOARD'] }, { id: 'pv', route: '/finance/pv', label: 'finance.menu.pv', icon: 'email107', acl: ['M_FINANCE_PV'] }, { id: 'cd', route: '/finance/cd', label: 'finance.menu.cd', icon: 'email107', acl: ['M_FINANCE_CD'] }, { id: 'report', route: '/finance/report', label: 'finance.menu.report', icon: 'show6', acl: ['M_FINANCE_REPORT'] }
	    //      {id:'billing_receive', route:'finance.billing_receive', label:'finance.menu.billing_receive', icon:'email107',acl:['M_FINANCE_BILLING_RECEIVE']}
	    ]);
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
	          React.createElement(T, { content: 'finance.title.index' })
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

	// var PaymentVoucher = require('./pv/pv.jsx');
	// var CashDaily = require('./cd/cd.jsx');
	// var Report = require('./cd/report.jsx');

	// App.Routes = (
	//   <Route name="finance" path="finance" handler={App.Index}>
	//     <Router.DefaultRoute name="finance.dashboard" handler={App.Dashboard}/>
	//     {PaymentVoucher.Routes}
	//     {CashDaily.Routes}
	//     {Report.Routes}
	//   </Route>
	// );

	module.exports = App;

/***/ },

/***/ 707:
/***/ function(module, exports) {

	"use strict";

	module.exports = {};

/***/ },

/***/ 708:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  finance: {
	    title: {
	      index: 'การเงิน'
	    },
	    menu: {
	      dashboard: 'ภาพรวม',
	      billing_receive: 'รับวางบิล',
	      pv: 'จ่ายบิล',
	      cd: 'รับเงินจากสาขา',
	      report: 'รายงาน'
	    }
	  }
	};

/***/ }

});