webpackJsonp([1,135],{

/***/ 504:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'transport',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(2, function (require) {
	      cb(null, __webpack_require__(505).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(2/* duplicate */, function (require) {
	      cb(null, { component: __webpack_require__(505).Dashboard });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(3, function (require) {
	      cb(null, [__webpack_require__(508), __webpack_require__(522), __webpack_require__(529), __webpack_require__(600), __webpack_require__(605), __webpack_require__(612), __webpack_require__(618), __webpack_require__(624), __webpack_require__(627), __webpack_require__(629), __webpack_require__(631), __webpack_require__(633), __webpack_require__(635), __webpack_require__(637), __webpack_require__(639)]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ }

});