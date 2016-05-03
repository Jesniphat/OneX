webpackJsonp([116,135],{

/***/ 993:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var DefaultRoute = Router.DefaultRoute;
	var RouteHandler = Router.RouteHandler;
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);

	var system = __webpack_require__(356);
	var systemActions = system.systemActions; //require('../system/actions');
	var menuActions = system.menuActions; //require('../system/actions/menu');
	var infoPanelActions = system.infoPanelActions;

	tr.registerTranslations('en', __webpack_require__(994));
	tr.registerTranslations('th', __webpack_require__(995));

	var App = {};

	App.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    // systemActions.setTheme(2);
	    systemActions.updateTopPanel({
	      code: 'report',
	      name: 'รายงาน',
	      icon: 'web37'
	    });
	    menuActions.show([{ id: 'dashboard', index: true, route: '/report/dashboard', label: 'report.menu.dashboard', icon: 'show6', acl: ['M_REPORT_DASHBOARD'] }, { id: 'commissionclose', route: '/report/report-commission-close', label: 'report.menu.commissionclose', icon: 'show6', acl: ['M_REPORT_COMMISSIONOPEN'] }, { id: 'commissionopen', route: '/report/report-commission-open', label: 'report.menu.commissionopen', icon: 'show6', acl: ['M_REPORT_COMMISSIONCLOSE'] }]);
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	App.Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  componentDidMount: function componentDidMount() {
	    // infoPanelActions.hide();
	    systemActions.setPageHeader(tr.translate('report.title.index'));
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
	          ' '
	        )
	      )
	    );
	  }
	});

	// var Others            = require('./others/others.jsx');
	// var CommissionClose   = require('./report-commission-close/commission.jsx');
	// var CommissionOpen    = require('./report-commission-open/commission.jsx');

	// App.Routes = (
	//   <Route name="report" path="report" handler={App.Index}>
	//     <Router.DefaultRoute name="report.dashboard" handler={App.Dashboard}/>
	//     {CommissionClose.Routes}
	//     {CommissionOpen.Routes}
	//   </Route>
	// );

	module.exports = App;

/***/ },

/***/ 994:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  report: {
	    menu: {
	      dashboard: 'Dashboard',
	      staff: 'Staffs',
	      permission: 'Permissions',
	      branch: 'Branch'
	    }
	  }
	};

/***/ },

/***/ 995:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  report: {
	    title: {
	      index: 'รายงานสรุป'
	    },
	    menu: {
	      dashboard: 'ภาพรวม',
	      commissionopen: 'รายงานค่าคอมเปิด',
	      commissionclose: 'รายงานค่าคอมปิด'
	    },
	    print: 'พิมพ์',
	    commission: {
	      search: 'สรุปค่าคอมปิด',
	      title: 'รายการค่าคอมปิดทั้งหมด',
	      searchopen: 'สรุปค่าคอมเปิด',
	      titleopen: 'รายการค่าคอมเปิดทั้งหมด'
	    }
	  }
	};

/***/ }

});