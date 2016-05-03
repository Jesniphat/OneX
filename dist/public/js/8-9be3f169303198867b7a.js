webpackJsonp([8,135],{

/***/ 530:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions; //require('../../system/actions');

	var bookingActions = __webpack_require__(531);
	var bookingStore = __webpack_require__(532);

	var LoadFare = {};

	tr.registerTranslations('en', __webpack_require__(533));
	tr.registerTranslations('th', __webpack_require__(534));

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

/***/ 531:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'getAddressList': { children: ['done', 'error'] },
	  'getContentPackageList': { children: ['done', 'error'] },
	  'getDefaultAddr': { children: ['done', 'error'] },
	  'getFromDestination': { children: ['done', 'error'] },
	  'getToDestination': { children: ['done', 'error'] },
	  'getRateType': { children: ['done', 'error'] },
	  'getRate': { children: ['done', 'error'] },
	  'saveBooking': { children: ['done', 'error'] },
	  'saveBillist': { children: ['done', 'error'] },
	  'printReportBooking': { children: ['done', 'error'] },
	  'printBarcodeBooking': { children: ['done', 'error'] },
	  'printInvoiceBooking': { children: ['done', 'error'] },
	  'sentMail': { children: ['done', 'error'] }
	});

/***/ },

/***/ 532:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);
	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var sellActions = system.sellActions; //require('./actions');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var bookingActions = __webpack_require__(531);

	var booking = Reflux.createStore({
	  listenables: [bookingActions],

	  onGetContentPackageList: function onGetContentPackageList() {
	    //console.log('XXX');
	    ajaxActions.request('/api/bookingtransport/getContentPackageList', {}, this.doneGetContentPackageList);
	  },
	  doneGetContentPackageList: function doneGetContentPackageList(res) {
	    if (res.status === true) {
	      //console.log('donegetContentPackageList = ',res.data.packageList);
	      bookingActions.getContentPackageList.done(res.data.packageList);
	    } else {
	      //console.log("getContentPackageList error");
	      bookingActions.getContentPackageList.error(res.msg);
	    }
	  },

	  onGetDefaultAddr: function onGetDefaultAddr(personId) {
	    //console.log("store personId = ",personId);
	    var res = { person_id: personId };
	    ajaxActions.request('/api/bookingtransport/getDefaultAddr', res, this.doneGetDefaultAddr);
	  },
	  doneGetDefaultAddr: function doneGetDefaultAddr(res) {
	    //console.log("ดึงข้อมูลสำเร็จ = ", res);
	    if (res.status === true) {
	      bookingActions.getDefaultAddr.done(res.data.address[0]);
	    } else {
	      console.log("getDefaultAddr error");
	      bookingActions.getDefaultAddr.error(res.msg);
	    }
	  },

	  onGetAddressList: function onGetAddressList(personId) {
	    var res = { person_id: personId };
	    ajaxActions.request('/api/bookingtransport/getAddressList', res, this.doneGetAddressList);
	  },
	  doneGetAddressList: function doneGetAddressList(res) {
	    //console.log("addressList = ",res);
	    if (res.status === true) {
	      bookingActions.getAddressList.done(res.data.addressList);
	    } else {
	      console.log("getAddressList error");
	    }
	  },

	  onGetFromDestination: function onGetFromDestination() {
	    //console.log('onGetFromDestination');
	    ajaxActions.request('/api/bookingtransport/getFromDestination', {}, this.doneGetFromDestination);
	  },
	  doneGetFromDestination: function doneGetFromDestination(res) {
	    if (res.status === true) {
	      bookingActions.getFromDestination.done(res.data.fromDestination);
	    } else {
	      console.log("onGetFromDestination Error = ", res.msg);
	    }
	  },

	  onGetToDestination: function onGetToDestination() {
	    //console.log("onGetToDestination");
	    ajaxActions.request('/api/bookingtransport/getToDestination', {}, this.doneGetToDestination);
	  },
	  doneGetToDestination: function doneGetToDestination(res) {
	    //console.log("Done = ", res);
	    if (res.status === true) {
	      bookingActions.getToDestination.done(res.data.toDestination);
	    } else {
	      console.log("onGetToDestination Error = ", res.msg);
	    }
	  },

	  onGetRateType: function onGetRateType() {
	    ajaxActions.request('/api/bookingtransport/getRateType', {}, this.doneGetRateType);
	  },
	  doneGetRateType: function doneGetRateType(res) {
	    if (res.status === true) {
	      bookingActions.getRateType.done(res.data.rateType);
	    }
	  },

	  onGetRate: function onGetRate(from, to, type) {
	    //console.log("getRate = ", from, to);
	    var res = { from: from, to: to, type: type };
	    ajaxActions.request('/api/bookingtransport/getRate', res, this.doneGetRate);
	  },
	  doneGetRate: function doneGetRate(res) {
	    console.log("done Rate = ", res.data.rate[0]);
	    if (res.status === true) {
	      bookingActions.getRate.done(res.data.rate[0]);
	    } else {
	      console.log("Get Rate Error");
	      bookingActions.getRate.error(res.msg);
	    }
	  },

	  onSaveBooking: function onSaveBooking(req) {
	    console.log("SaveBooking req = ", req);
	    ajaxActions.request('/api/bookingtransport/saveBooking', req, this.doneSaveBooking);
	  },
	  doneSaveBooking: function doneSaveBooking(res) {
	    if (res.status === true) {
	      console.log("Save Booking Complete");
	      bookingActions.saveBooking.done(res.data);
	    } else {
	      console.log("Save Booking Error");
	      bookingActions.saveBooking.error(res.error);
	    }
	  },

	  onSaveBillist: function onSaveBillist(req) {
	    console.log("Add billing Lidt = ", req);
	    ajaxActions.request('/api/bookingtransport/saveBillist', req, this.doneSaveBillist);
	  },
	  doneSaveBillist: function doneSaveBillist(res) {
	    if (res.status === true) {
	      console.log("done SaveBillist");
	      bookingActions.saveBillist.done(res.data);
	    } else {
	      console.log("done SaveBillist Error");
	    }
	  },

	  onPrintReportBooking: function onPrintReportBooking(bookingId) {
	    //console.log('Start Gen Report = ', bookingId);
	    var req = { bookingId: bookingId };
	    ajaxActions.request('/api/bookingtransport/booking_report', req, this.donePrintReportBooking);
	  },
	  donePrintReportBooking: function donePrintReportBooking(res) {
	    if (res.status === true) {
	      console.log("GenReport Complete");
	      bookingActions.printReportBooking.done(res.data);
	    } else {
	      console.log("GenReport Error");
	      bookingActions.printReportBooking.error(res.error);
	    }
	  },

	  onPrintBarcodeBooking: function onPrintBarcodeBooking(bookingId) {
	    console.log('Start Gen Barcode = ', bookingId);
	    var req = { bookingId: bookingId };
	    ajaxActions.request('/api/bookingtransport/booking_barcode', req, this.donePrintBarcodeBooking);
	  },
	  donePrintBarcodeBooking: function donePrintBarcodeBooking(res) {
	    if (res.status === true) {
	      console.log("GenBarcode Complete");
	      bookingActions.printBarcodeBooking.done(res.data);
	    } else {
	      console.log("GenBarcode Error");
	      bookingActions.printBarcodeBooking.error(res.error);
	    }
	  },

	  onPrintInvoiceBooking: function onPrintInvoiceBooking(bookingId) {
	    var req = { bookingId: bookingId };
	    ajaxActions.request('/api/bookingtransport/invoice_report', req, this.donePrintInvoiceBooking);
	  },
	  donePrintInvoiceBooking: function donePrintInvoiceBooking(res) {
	    if (res.status === true) {
	      console.log("GenBarcode Complete");
	      bookingActions.printInvoiceBooking.done(res.data);
	    } else {
	      console.log("GenBarcode Error");
	      bookingActions.printInvoiceBooking.error(res.error);
	    }
	  },

	  onSentMail: function onSentMail(bookingId) {
	    console.log("sentMail");
	    var req = { bookingId: bookingId };
	    ajaxActions.request('/api/bookingtransport/booking_sentMail', req, this.doneSentMail);
	  },
	  doneSentMail: function doneSentMail(res) {
	    console.log("sentMail res");
	    if (res.status === true) {
	      console.log("GenBarcode Complete");
	      bookingActions.sentMail.done(res.data);
	    } else {
	      console.log("GenBarcode Error");
	      bookingActions.sentMail.error(res.error);
	    }
	  }

	});

	module.exports = booking;

/***/ },

/***/ 533:
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

/***/ 534:
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