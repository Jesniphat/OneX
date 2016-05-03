webpackJsonp([90,135],{

/***/ 912:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'staff',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(91, function (require) {
	      cb(null, __webpack_require__(884).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(92, function (require) {
	      cb(null, { component: __webpack_require__(913) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(93, function (require) {
	      cb(null, [{ path: ':id', component: __webpack_require__(914) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 915:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'shop',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(94, function (require) {
	      cb(null, __webpack_require__(889).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(95, function (require) {
	      cb(null, { component: __webpack_require__(916) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(96, function (require) {
	      cb(null, [{ path: ':id', component: __webpack_require__(917) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 918:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'department',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(97, function (require) {
	      cb(null, __webpack_require__(894).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(98, function (require) {
	      cb(null, { component: __webpack_require__(919) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(99, function (require) {
	      cb(null, [{ path: ':id', component: __webpack_require__(920) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 921:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'role',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(100, function (require) {
	      cb(null, __webpack_require__(899).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(101, function (require) {
	      cb(null, { component: __webpack_require__(922) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(102, function (require) {
	      cb(null, [{ path: ':id', component: __webpack_require__(923) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 924:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'grant',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(103, function (require) {
	      cb(null, __webpack_require__(904).Index);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ }

});