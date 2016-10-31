module.exports = require('reflux').createActions({
  'getMemberType': {children:['done', 'error']},
  'getCustomerData': {children:['done', 'error']},
  'getContactListData': {children:['done','error']},
  'getBillingListData': {children:['done','error']},
  'saveCustomers': {children:['done', 'error']},
  'editCustomers': {children:['done', 'error']},
  'deleteCustomers': {children:['done', 'error']},
  'getCurrencyFromBase': {children:['done', 'error']}
});
