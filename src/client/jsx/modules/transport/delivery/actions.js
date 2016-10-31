module.exports = require('reflux').createActions({
  'listDelivery': {children: ['done','error']},
  'saveDelivery': {children:['done','error']},
  'updatePickup': {children:['done','error']},
  'addBarcode': {children:['done','error']},
  'savePickupReceipt': {children:['done','error']},
  'getDeliveryItemById': {children:['done','error']},
  'updateDelivery': {children:['done','error']},
  'addBarcodeRecipt': {children:['done','error']},
  'saveDeliveryReceipt': {children:['done','error']},
  'genDeliveryReport': {children:['done','error']}
});
