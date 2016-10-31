module.exports = require('reflux').createActions({
  'listIntransit': {children: ['done','error']},
  'saveIntransit': {children:['done','error']},
  'updatePickup': {children:['done','error']},
  'addBarcode': {children:['done','error']},
  'savePickupReceipt': {children:['done','error']},
  'getIntransitItemById': {children:['done','error']},
  'updateIntransit': {children:['done','error']},
  'addBarcodeRecipt': {children:['done','error']},
  'saveIntransitReceipt': {children:['done','error']},
  'genReport': {children:['done','error']},
  'genBarcode': {children:['done','error']},
  'saveExceptionIntransit': {children:['done','error']},
  'getDistrict': {children:['done','error']}
});
