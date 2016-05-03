webpackJsonp([10,135],{

/***/ 601:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions; //require('../../system/actions');

	// var bookingActions  = require('./actions');
	// var bookingStore    = require('./store');

	var Home = {};

	tr.registerTranslations('en', __webpack_require__(602));
	tr.registerTranslations('th', __webpack_require__(603));

	Home.Index = React.createClass({
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

	module.exports = Home;

/***/ },

/***/ 602:
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

/***/ 603:
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