var Reflux          = require('reflux');

var system          = require('ss-system');
var ajaxActions     = system.ajaxActions; //require('../../system/actions/ajax');
var sellActions     = system.sellActions; //require('./actions');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var reportActions  = require('./actions');

var customer = Reflux.createStore({
  listenables: [reportActions],

  onGenReportManifest: function(req) {
    console.log('Start Gen Report = ', req);
    ajaxActions.request('/api/bookingtransport/report_action/genReportManifest', req, this.doneGenReportManifest);
  },
  doneGenReportManifest: function(res) {
    console.log("Done GenReport = ", res)
    if(res.status === true){
      reportActions.genReportManifest.done(res.data)
    }else {
      reportActions.genReportManifest.error(res.error)
    }
  },

  onGenReportSummaryCustomer: function(req) {
    ajaxActions.request('/api/bookingtransport/report_action/genReportSummaryCustomer', req, this.doneGenReportSummaryCustomer);
  },
  doneGenReportSummaryCustomer: function(res) {
    console.log("Done GenReport = ", res)
    if(res.status === true){
      reportActions.genReportSummaryCustomer.done(res.data)
    }else {
      reportActions.genReportSummaryCustomer.error(res.error)
    }
  },

  onTestReport: function(req) {
    ajaxActions.request('/api/bookingtransport/invoice_report', req, this.donePrintReportBooking);
  },
  donePrintReportBooking: function(res){
    console.log("res = ", res);
  },

  onGetCustomerList: function(req) {
    ajaxActions.request('/api/bookingtransport/report_action/getCustomerList', req, this.doneGetCustomerList);
  },
  doneGetCustomerList: function(res){
    if(res.status === true){
      reportActions.getCustomerList.done(res.data);
    }else {
      console.log("error : ", res.error);
      reportActions.getCustomerList.error(res.error);
    }
  },

  onGetDistrict: function(req) {
    ajaxActions.request('/api/bookingtransport/intransit/getDistrict', req, this.doneGetDistrict);
  },
  doneGetDistrict: function(res) {
    if(res.status===true){
      reportActions.getDistrict.done(res.data);
    }else {
      reportActions.getDistrict.error(res.error);
    }
  }


});

module.exports = customer;
