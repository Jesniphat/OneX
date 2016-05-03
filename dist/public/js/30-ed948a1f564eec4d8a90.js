webpackJsonp([30,135],{

/***/ 640:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions; //require('../../system/actions');

	var pickupListActions = __webpack_require__(641);
	var pickupListStore = __webpack_require__(642);

	var Pickup = {};

	tr.registerTranslations('en', __webpack_require__(643));
	tr.registerTranslations('th', __webpack_require__(644));

	Pickup.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    //systemActions.setPageHeader("Load Fare");
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	//LoadFare.Screen = require('./loadfare-screen.jsx');

	// LoadFare.Routes = (
	//   <Route name="transport.loadfare" path="loadfare" handler={LoadFare.Index}>
	//     <Router.DefaultRoute name="transport.loadfare.screen" path="loadfare-screen" handler={LoadFare.Screen}/>
	//   </Route>
	// );

	module.exports = Pickup;

/***/ },

/***/ 641:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'listPickup': { children: ['done', 'error'] },
	  'exportPickupList': { children: ['done', 'error'] }
	});

/***/ },

/***/ 642:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);
	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var sellActions = system.sellActions; //require('./actions');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var pickupListActions = __webpack_require__(641);

	var pickupList = Reflux.createStore({
	  listenables: [pickupListActions],

	  onListPickup: function onListPickup(param) {
	    console.log('request');
	    ajaxActions.request('/api/bookingtransport/listPickUp', param, this.doneListPickup);
	  },
	  //'/api/bookingtransport/listWaitAssign'
	  doneListPickup: function doneListPickup(res) {
	    if (res.status === true) {
	      pickupListActions.listPickup.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        pickupListActions.listPickup.error(res.error);
	      }
	  }

	});

	module.exports = pickupList;

/***/ },

/***/ 643:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  pickupEdit: {
	    booking_no: 'Booking No.',
	    customer: 'Customer',
	    pickup_no: 'Pickup No.',
	    pickup_date_set: 'Pickup date',
	    waybill: 'Waybill',
	    pickup_date: 'Pickup date',
	    prepare_by: 'Prepare by',
	    driver: 'Driver',
	    save: 'SAVE',
	    district: 'District',
	    remark: 'Remark',
	    print: 'PRINT',
	    search: 'SEARCH'
	  },
	  bookingSearchTable: {
	    booking_no: 'Booking No.',
	    customer: 'Customer',
	    qty: 'Qty',
	    select_all: 'Select all'
	  }
	};

/***/ },

/***/ 644:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  transport: {
	    head: {
	      headName: 'Load Fare'
	    }
	  }
	};

/***/ }

});