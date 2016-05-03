webpackJsonp([3,135],{

/***/ 514:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'loadfare',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(4, function (require) {
	      cb(null, __webpack_require__(515).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(4/* duplicate */, function (require) {
	      cb(null, { component: __webpack_require__(515) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(5, function (require) {
	      cb(null, [{ path: 'zone', component: __webpack_require__(528) }, { path: 'rate', component: __webpack_require__(529) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 530:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'customer',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(6, function (require) {
	      cb(null, __webpack_require__(531).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(7, function (require) {
	      cb(null, { component: __webpack_require__(536) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(7/* duplicate */, function (require) {
	      cb(null, [{ component: __webpack_require__(536) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 537:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'booking',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(8, function (require) {
	      cb(null, __webpack_require__(538).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(9, function (require) {
	      cb(null, { component: __webpack_require__(543) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(9/* duplicate */, function (require) {
	      cb(null, [{ component: __webpack_require__(543) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 608:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'home',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(10, function (require) {
	      cb(null, __webpack_require__(609).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(11, function (require) {
	      cb(null, { component: __webpack_require__(612) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(11/* duplicate */, function (require) {
	      cb(null, [{ component: __webpack_require__(612) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 613:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'report',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(12, function (require) {
	      cb(null, __webpack_require__(614).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(13, function (require) {
	      cb(null, { component: __webpack_require__(619) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(13/* duplicate */, function (require) {
	      cb(null, [{ path: 'booking_id/:id', component: __webpack_require__(619) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 620:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingList',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14, function (require) {
	      cb(null, __webpack_require__(621).Index);
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

/***/ 626:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingWaitCredit',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(621).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(15, function (require) {
	      cb(null, { component: __webpack_require__(627) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(15/* duplicate */, function (require) {
	      cb(null, [{ component: __webpack_require__(627) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 632:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingWaitAssign',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(621).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(16, function (require) {
	      cb(null, { component: __webpack_require__(633) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(17, function (require) {
	      cb(null, [{ component: __webpack_require__(633) }, { path: 'edit/:id', component: __webpack_require__(634) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 635:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingInprocess',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(621).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(18, function (require) {
	      cb(null, { component: __webpack_require__(636) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(19, function (require) {
	      cb(null, [{ component: __webpack_require__(636) }, { path: 'edit/:id', component: __webpack_require__(634) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 637:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingIntransit',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(621).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(20, function (require) {
	      cb(null, { component: __webpack_require__(638) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(21, function (require) {
	      cb(null, [{ component: __webpack_require__(638) }, { path: 'edit/:id', component: __webpack_require__(634) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 639:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingArrived',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(621).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(22, function (require) {
	      cb(null, { component: __webpack_require__(640) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(23, function (require) {
	      cb(null, [{ component: __webpack_require__(640) }, { path: 'edit/:id', component: __webpack_require__(634) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 641:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingDelivered',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(621).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(24, function (require) {
	      cb(null, { component: __webpack_require__(642) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(25, function (require) {
	      cb(null, [{ component: __webpack_require__(642) }, { path: 'edit/:id', component: __webpack_require__(634) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 643:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingException',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(621).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(26, function (require) {
	      cb(null, { component: __webpack_require__(644) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(27, function (require) {
	      cb(null, [{ component: __webpack_require__(644) }, { path: 'edit/:id', component: __webpack_require__(634) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 645:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'bookingCancel',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(14/* duplicate */, function (require) {
	      cb(null, __webpack_require__(621).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(28, function (require) {
	      cb(null, { component: __webpack_require__(646) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(29, function (require) {
	      cb(null, [{ component: __webpack_require__(646) }, { path: 'edit/:id', component: __webpack_require__(634) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ },

/***/ 647:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = {
	  path: 'pickup',
	  getComponent: function getComponent(location, cb) {
	    __webpack_require__.e/* nsure */(30, function (require) {
	      cb(null, __webpack_require__(648).Index);
	    });
	  },
	  getIndexRoute: function getIndexRoute(location, cb) {
	    __webpack_require__.e/* nsure */(31, function (require) {
	      cb(null, { component: __webpack_require__(653) });
	    });
	  },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(32, function (require) {
	      cb(null, [{ component: __webpack_require__(653) }, { path: 'pickup_edit/:id', component: __webpack_require__(654) }]);
	    });
	  }
	};

	module.exports = routeConfig;

/***/ }

});