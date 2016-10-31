module.exports = require('reflux').createActions({
  'listPayment': {children: ['done','error']},
  'export': {children:['done', 'error']},
  'cancelBooking': {children:['done', 'error']},
  'changePaidBooking': {children:['done', 'error']},
  'getDialogData': {children:['done', 'error']},
  'saveAddition': {children:['done','error']},
  'sentDocToEmail': {children:['done','error']},
  'getDialogDetailList': {children:['done','error']},
  'getDialogItemList': {children:['done','error']},
  'changePaidBookingList': {children:['done','error']}
});
