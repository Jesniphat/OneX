webpackJsonp([14,135],{

/***/ 613:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions; //require('../../system/actions');

	var bookingListActions = __webpack_require__(614);
	var bookingListStore = __webpack_require__(615);

	var LoadFare = {};

	tr.registerTranslations('en', __webpack_require__(616));
	tr.registerTranslations('th', __webpack_require__(617));

	LoadFare.Index = React.createClass({
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

	module.exports = LoadFare;

/***/ },

/***/ 614:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'listWaitClearCreditCard': { children: ['done', 'error'] },
	  'exportWaitClearCreditCard': { children: ['done', 'error'] },
	  'listWaitAssign': { children: ['done', 'error'] },
	  'exportWaitAssign': { children: ['done', 'error'] },
	  'listInprocess': { children: ['done', 'error'] },
	  'exportInprocess': { children: ['done', 'error'] },
	  'listInTransit': { children: ['done', 'error'] },
	  'exportInTransit': { children: ['done', 'error'] },
	  'listArrived': { children: ['done', 'error'] },
	  'exportArrived': { children: ['done', 'error'] },
	  'listDelivered': { children: ['done', 'error'] },
	  'exportDelivered': { children: ['done', 'error'] },
	  'listException': { children: ['done', 'error'] },
	  'exportException': { children: ['done', 'error'] },
	  'listCancel': { children: ['done', 'error'] },
	  'exportCancel': { children: ['done', 'error'] },
	  'cancelBooking': { children: ['done', 'error'] },
	  'changeStatusBooking': { children: ['done', 'error'] },
	  'getDialogData': { children: ['done', 'error'] },
	  'saveAddition': { children: ['done', 'error'] },
	  'sentDocToEmail': { children: ['done', 'error'] },
	  'getDialogDetailList': { children: ['done', 'error'] },
	  'getDialogItemList': { children: ['done', 'error'] }
	});

/***/ },

/***/ 615:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);
	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var sellActions = system.sellActions; //require('./actions');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var bookingListActions = __webpack_require__(614);

	var bookingList = Reflux.createStore({
	  listenables: [bookingListActions],

	  onListWaitAssign: function onListWaitAssign(param) {
	    console.log('request');
	    ajaxActions.request('/api/bookingtransport/listWaitAssign', param, this.doneListWaitAssign);
	  },
	  //'/api/bookingtransport/listWaitAssign'
	  doneListWaitAssign: function doneListWaitAssign(res) {
	    if (res.status === true) {
	      bookingListActions.listWaitAssign.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        bookingListActions.listWaitAssign.error(res.error);
	      }
	  },

	  onListWaitClearCreditCard: function onListWaitClearCreditCard(param) {
	    ajaxActions.request('/api/bookingtransport/listWaitClearCreditCard', param, this.doneListWaitClearCreditCard);
	  },
	  doneListWaitClearCreditCard: function doneListWaitClearCreditCard(res) {
	    if (res.status === true) {
	      bookingListActions.listWaitClearCreditCard.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        bookingListActions.listWaitClearCreditCard.error(res.error);
	      }
	  },
	  //listInprocess
	  onListInprocess: function onListInprocess(param) {
	    ajaxActions.request('/api/bookingtransport/listInprocess', param, this.doneListInprocess);
	  },
	  doneListInprocess: function doneListInprocess(res) {
	    if (res.status === true) {
	      bookingListActions.listInprocess.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        bookingListActions.listInprocess.error(res.error);
	      }
	  },
	  //InTransit
	  onListInTransit: function onListInTransit(param) {
	    ajaxActions.request('/api/bookingtransport/listInTransit', param, this.doneListInTransit);
	  },
	  doneListInTransit: function doneListInTransit(res) {
	    if (res.status === true) {
	      bookingListActions.listInTransit.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        bookingListActions.listInTransit.error(res.error);
	      }
	  },
	  // listArrived
	  onListArrived: function onListArrived(param) {
	    ajaxActions.request('/api/bookingtransport/listArrived', param, this.doneListArrived);
	  },
	  doneListArrived: function doneListArrived(res) {
	    if (res.status === true) {
	      bookingListActions.listArrived.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        bookingListActions.listArrived.error(res.error);
	      }
	  },
	  // listDelivered
	  onListDelivered: function onListDelivered(param) {
	    ajaxActions.request('/api/bookingtransport/listDelivered', param, this.doneListDelivered);
	  },
	  doneListDelivered: function doneListDelivered(res) {
	    if (res.status === true) {
	      bookingListActions.listDelivered.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        bookingListActions.listDelivered.error(res.error);
	      }
	  },
	  // listException
	  onListException: function onListException(param) {
	    ajaxActions.request('/api/bookingtransport/listException', param, this.doneListException);
	  },
	  doneListException: function doneListException(res) {
	    if (res.status === true) {
	      bookingListActions.listException.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        bookingListActions.listException.error(res.error);
	      }
	  },
	  // listCancel
	  onListCancel: function onListCancel(param) {
	    ajaxActions.request('/api/bookingtransport/listCancel', param, this.doneListCancel);
	  },
	  doneListCancel: function doneListCancel(res) {
	    if (res.status === true) {
	      bookingListActions.listCancel.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        bookingListActions.listCancel.error(res.error);
	      }
	  },

	  onCancelBooking: function onCancelBooking(res) {
	    ajaxActions.request('/api/bookingtransport/cancelBooking', res, this.doneCancelBooking);
	  },
	  doneCancelBooking: function doneCancelBooking(res) {
	    if (res.status === true) {
	      bookingListActions.cancelBooking.done(res.data);
	    } else {
	      bookingListActions.cancelBooking.error(res.error);
	    }
	  },

	  onChangeStatusBooking: function onChangeStatusBooking(res) {
	    ajaxActions.request('/api/bookingtransport/changeStatusBooking', res, this.doneChangeStatus);
	  },
	  doneChangeStatus: function doneChangeStatus(res) {
	    if (res.status === true) {
	      bookingListActions.changeStatusBooking.done(res.data);
	    } else {
	      bookingListActions.changeStatusBooking.error(res.error);
	    }
	  },

	  onGetDialogData: function onGetDialogData(bookingId) {
	    //console.log("req Dialog = ", req);
	    var req = { booking_id: bookingId };
	    ajaxActions.request('/api/bookingtransport/getDialogData', req, this.doneGetDialogData);
	  },
	  doneGetDialogData: function doneGetDialogData(res) {
	    if (res.status === true) {
	      bookingListActions.getDialogData.done(res.data);
	    } else {
	      bookingListActions.getDialogData.error(res.error);
	    }
	  },

	  onSaveAddition: function onSaveAddition(saveData) {
	    ajaxActions.request('/api/bookingtransport/saveAddition', saveData, this.doneSaveAddition);
	  },
	  doneSaveAddition: function doneSaveAddition(res) {
	    if (res.status === true) {
	      bookingListActions.saveAddition.done(res.data);
	    } else {
	      bookingListActions.saveAddition.error(res.error);
	    }
	  },

	  onSentDocToEmail: function onSentDocToEmail(data) {
	    ajaxActions.request('/api/bookingtransport/sentDocToEmail', data, this.doneSentDocToEmail);
	  },
	  doneSentDocToEmail: function doneSentDocToEmail(res) {
	    if (res.status === true) {
	      bookingListActions.sentDocToEmail.done(res.data);
	    } else {
	      bookingListActions.sentDocToEmail.error(res.error);
	    }
	  },

	  onGetDialogDetailList: function onGetDialogDetailList(data) {
	    var req = { booking_id: data };
	    ajaxActions.request('/api/bookingtransport/getDialogDetailList', req, this.doneGetDialogDetailList);
	  },
	  doneGetDialogDetailList: function doneGetDialogDetailList(res) {
	    if (res.status === true) {
	      // console.log("Detail = ", res.data.bookingDetail_data);
	      bookingListActions.getDialogDetailList.done(res.data.bookingDetail_data);
	    } else {
	      bookingListActions.getDialogDetailList.error(res.error);
	    }
	  },

	  onGetDialogItemList: function onGetDialogItemList(data) {
	    var req = { booking_id: data };
	    ajaxActions.request('/api/bookingtransport/getDialogItemList', req, this.doneGetDialogItemList);
	  },
	  doneGetDialogItemList: function doneGetDialogItemList(res) {
	    if (res.status === true) {
	      // console.log("Detail = ", res.data.bookingDetail_data);
	      bookingListActions.getDialogItemList.done(res.data.bookingItem_data);
	    } else {
	      bookingListActions.getDialogItemList.error(res.error);
	    }
	  }

	});

	module.exports = bookingList;

/***/ },

/***/ 616:
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

/***/ 617:
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