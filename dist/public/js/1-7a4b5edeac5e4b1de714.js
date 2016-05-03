webpackJsonp([1,135],{

/***/ 510:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'transport',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(2, function (require) {
	      cb(null, __webpack_require__(511).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(2/* duplicate */, function (require) {
	      cb(null, { component: __webpack_require__(511).Dashboard });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(3, function (require) {
	      cb(null, [__webpack_require__(514), __webpack_require__(530), __webpack_require__(537), __webpack_require__(608), __webpack_require__(613), __webpack_require__(620), __webpack_require__(626), __webpack_require__(632), __webpack_require__(635), __webpack_require__(637), __webpack_require__(639), __webpack_require__(641), __webpack_require__(643), __webpack_require__(645), __webpack_require__(647)]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ }

});