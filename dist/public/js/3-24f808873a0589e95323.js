webpackJsonp([3,135],{

/***/ 508:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'loadfare',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(4, function (require) {
	      cb(null, __webpack_require__(509).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(4/* duplicate */, function (require) {
	      cb(null, { component: __webpack_require__(509) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(5, function (require) {
	      cb(null, [{ path: 'zone', component: __webpack_require__(520) }, { path: 'rate', component: __webpack_require__(521) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 522:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'customer',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(6, function (require) {
	      cb(null, __webpack_require__(523).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(7, function (require) {
	      cb(null, { component: __webpack_require__(528) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(7/* duplicate */, function (require) {
	      cb(null, [{ component: __webpack_require__(528) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 529:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'booking',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(8, function (require) {
	      cb(null, __webpack_require__(530).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(9, function (require) {
	      cb(null, { component: __webpack_require__(535) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(9/* duplicate */, function (require) {
	      cb(null, [{ component: __webpack_require__(535) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 600:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'home',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(10, function (require) {
	      cb(null, __webpack_require__(601).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(11, function (require) {
	      cb(null, { component: __webpack_require__(604) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(11/* duplicate */, function (require) {
	      cb(null, [{ component: __webpack_require__(604) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 605:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'report',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(12, function (require) {
	      cb(null, __webpack_require__(606).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(13, function (require) {
	      cb(null, { component: __webpack_require__(611) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(13/* duplicate */, function (require) {
	      cb(null, [{ path: 'booking_id/:id', component: __webpack_require__(611) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 612:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingList',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14, function (require) {
	      cb(null, __webpack_require__(613).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    !/* require.ensure */(function (require) {
	      cb(null, {});
	    }(__webpack_require__));
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    !/* require.ensure */(function (require) {
	      cb(null, [{}]);
	    }(__webpack_require__));
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 618:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingWaitCredit',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(613).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(15, function (require) {
	      cb(null, { component: __webpack_require__(619) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(15/* duplicate */, function (require) {
	      cb(null, [{ component: __webpack_require__(619) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 624:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingWaitAssign',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(613).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(16, function (require) {
	      cb(null, { component: __webpack_require__(625) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(17, function (require) {
	      cb(null, [{ component: __webpack_require__(625) }, { path: 'edit/:id', component: __webpack_require__(626) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 627:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingInprocess',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(613).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(18, function (require) {
	      cb(null, { component: __webpack_require__(628) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(19, function (require) {
	      cb(null, [{ component: __webpack_require__(628) }, { path: 'edit/:id', component: __webpack_require__(626) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 629:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingIntransit',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(613).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(20, function (require) {
	      cb(null, { component: __webpack_require__(630) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(21, function (require) {
	      cb(null, [{ component: __webpack_require__(630) }, { path: 'edit/:id', component: __webpack_require__(626) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 631:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingArrived',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(613).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(22, function (require) {
	      cb(null, { component: __webpack_require__(632) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(23, function (require) {
	      cb(null, [{ component: __webpack_require__(632) }, { path: 'edit/:id', component: __webpack_require__(626) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 633:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingDelivered',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(613).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(24, function (require) {
	      cb(null, { component: __webpack_require__(634) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(25, function (require) {
	      cb(null, [{ component: __webpack_require__(634) }, { path: 'edit/:id', component: __webpack_require__(626) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 635:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingException',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(613).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(26, function (require) {
	      cb(null, { component: __webpack_require__(636) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(27, function (require) {
	      cb(null, [{ component: __webpack_require__(636) }, { path: 'edit/:id', component: __webpack_require__(626) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 637:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingCancel',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(613).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(28, function (require) {
	      cb(null, { component: __webpack_require__(638) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(29, function (require) {
	      cb(null, [{ component: __webpack_require__(638) }, { path: 'edit/:id', component: __webpack_require__(626) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 639:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'pickup',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(30, function (require) {
	      cb(null, __webpack_require__(640).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(31, function (require) {
	      cb(null, { component: __webpack_require__(645) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(32, function (require) {
	      cb(null, [{ component: __webpack_require__(645) }, { path: 'pickup_edit/:id', component: __webpack_require__(646) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ }

});