module.exports = require('reflux').createActions({
  'listPickup': {children: ['done','error']},
  'exportPickupList': {children:['done', 'error']},
  'getSearchBookingWait': {children:['done', 'error']},
  'savePickup': {children:['done','error']},
  'updatePickup': {children:['done','error']},
  'getPU': {children:['done','error']},
  'addBarcode': {children:['done','error']},
  'savePickupReceipt': {children:['done','error']}
});
