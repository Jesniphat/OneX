var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var bookingReportActions  = require('./actions');

var customer = Reflux.createStore({
  listenables: [bookingReportActions],

  onGenReport: function(bookingId) {
    console.log('Start Gen Report = ', bookingId);
    var req = {bookingId:bookingId};
    ajaxActions.request('/api/bookingtransport/booking_report', req, this.doneGenReport);
  },
  doneGenReport: function(res) {
      console.log("Done GenReport")
    // if (res.status === true) {
    //   //console.log('doneGetMemberType');
    //   bookingReportActions.getMemberType.done(res.data);
    // } else {
    //   bookingReportActions.getMemberType.error(res.msg);
    // }
  },

});

module.exports = customer;
