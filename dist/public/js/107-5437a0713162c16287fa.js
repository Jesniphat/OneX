webpackJsonp([107,135],{

/***/ 970:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'customer',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(108, function (require) {
	      cb(null, __webpack_require__(958).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(109, function (require) {
	      cb(null, { component: __webpack_require__(971) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(110, function (require) {
	      cb(null, [{ path: 'edit/:id', component: __webpack_require__(972) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 973:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'group_product',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(111, function (require) {
	      cb(null, __webpack_require__(963).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(112, function (require) {
	      cb(null, { component: __webpack_require__(974) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(113, function (require) {
	      cb(null, [{ path: 'edit/:id', component: __webpack_require__(975) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 976:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'fare',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(114, function (require) {
	      cb(null, __webpack_require__(977));
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(114/* duplicate */, function (require) {
	      cb(null, { component: __webpack_require__(977) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(115, function (require) {
	      cb(null, [{ path: 'import_point', component: __webpack_require__(982) }, { path: 'import_reword', component: __webpack_require__(983) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ }

});