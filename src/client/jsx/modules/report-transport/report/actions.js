module.exports = require('reflux').createActions({
  'genReportManifest': {children:['done', 'error']},
  'genReportSummaryCustomer': {children:['done', 'error']},
  'testReport': {children:['done','error']},
  'getCustomerList': {children:['done','error']},
  'getDistrict': {children:['done','error']}
});
