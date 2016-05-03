webpackJsonp([90,135],{

/***/ 920:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'staff',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(91, function (require) {
	      cb(null, __webpack_require__(892).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(92, function (require) {
	      cb(null, { component: __webpack_require__(921) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(93, function (require) {
	      cb(null, [{ path: ':id', component: __webpack_require__(922) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 923:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'shop',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(94, function (require) {
	      cb(null, __webpack_require__(897).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(95, function (require) {
	      cb(null, { component: __webpack_require__(924) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(96, function (require) {
	      cb(null, [{ path: ':id', component: __webpack_require__(925) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 926:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'department',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(97, function (require) {
	      cb(null, __webpack_require__(902).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(98, function (require) {
	      cb(null, { component: __webpack_require__(927) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(99, function (require) {
	      cb(null, [{ path: ':id', component: __webpack_require__(928) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 929:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'role',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(100, function (require) {
	      cb(null, __webpack_require__(907).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(101, function (require) {
	      cb(null, { component: __webpack_require__(930) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(102, function (require) {
	      cb(null, [{ path: ':id', component: __webpack_require__(931) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 932:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'grant',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(103, function (require) {
	      cb(null, __webpack_require__(912).Index);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ }

});