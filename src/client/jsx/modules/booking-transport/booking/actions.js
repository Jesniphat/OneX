module.exports = require('reflux').createActions({
  'list': {children: ['done','error']},
  'getPersonType': {children: ['done','error']},
  'getAddressList': {children: ['done', 'error']},
  'getContentPackageList': {children:['done', 'error']},
  'getDefaultAddr': {children:['done', 'error']},
  'getFromDestination': {children:['done', 'error']},
  'getToDestination': {children:['done', 'error']},
  'getRateType' : {children:['done', 'error']},
  'getRate': {children:['done', 'error']},
  'saveBooking': {children:['done', 'error']},
  'saveBillist': {children:['done', 'error']},
  'printReportBooking': {children:['done', 'error']},
  'printBarcodeBooking': {children:['done', 'error']},
  'printInvoiceBooking': {children:['done', 'error']},
  'sentMail': {children:['done', 'error']},
  'getPickUptime': {children:['done', 'error']},
  'getCompanyProfile': {children:['done', 'error']}
});
