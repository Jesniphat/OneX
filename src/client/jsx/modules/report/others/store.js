var Reflux          = require('reflux');

var system          = require('ss-system');
var toasterActions  = system.toasterActions;
var ajaxActions     = system.ajaxActions; // require('../../system/actions/ajax');
var menuActions     = system.menuActions; //require('../../system/actions/menu');
var customerActions = require('./actions');

var customerStore = Reflux.createStore({
  listenables: [customerActions],

  onGetBranch: function() {
    ajaxActions.request('/api/report/getBranch', {}, this.doneGetBranch);
  },
  doneGetBranch: function(res) {
    if (res.status === true) {
      customerActions.getBranch.done(res.data);
    } else {
      customerActions.getBranch.error(res.msg);
    }
  },

  onPdfExport: function(name, param) {
    param.report_name = name;
    ajaxActions.request('/api/report/export', { data: param}, this.donePdfExport);
  },
  donePdfExport: function(res) {
    if (res.status === true) {
      customerActions.pdfExport.done(res.data.exports);
    } else {
      toasterActions.pop({
        type:'success',
        message:'ไม่พบข้อมูลที่อยู่ในช่วงเวลาที่ระบุ'
      });
      customerActions.pdfExport.error(res.msg);
    }
  },

  onPlExport: function(name, param) {
    param.report_name = name;
    ajaxActions.request('/api/report/exportProfitLoss', { data: param}, this.donePlExport);
  },

  donePlExport: function(res) {
    if (res.status === true) {
      customerActions.plExport.done(res.data.exports);
    } else {
      toasterActions.pop({
        type:'success',
        message:'ไม่พบข้อมูลที่อยู่ในช่วงเวลาที่ระบุ'
      });
      customerActions.plExport.error(res.msg);
    }
  }



});

module.exports = customerStore;
