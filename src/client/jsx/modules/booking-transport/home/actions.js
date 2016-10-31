module.exports = require('reflux').createActions({
  'getAllBooking': {children: ['done','error']},
  'getCityList': {children: ['done','error']},
  'getDialogData': {children:['done', 'error']},
  'getDialogDetailList': {children:['done','error']},
  'getDialogItemList': {children:['done','error']},
  'sentDocToEmail': {children:['done','error']},
  'exportExl': {children: ['done','error']}
});
