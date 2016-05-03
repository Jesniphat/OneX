webpackJsonp([124,135],{

/***/ 1020:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'cd',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(125, function (require) {
	      cb(null, __webpack_require__(1021).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(126, function (require) {
	      cb(null, { component: __webpack_require__(1026) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(127, function (require) {
	      cb(null, [{ path: 'screen/:id?', component: __webpack_require__(1027) }]);
	    });
	  }
	};

/***/ }

});