module.exports = require('reflux').createActions({
  'list': {children:['done', 'error']},
  'export': {children:['done', 'error']},
  'getInitData': {children:['done', 'error']},
  'getProductDetail': {children:['done', 'error']},
  'getCustomerDetail': {children:['done', 'error']},
  'saveData': {children:['done', 'error']},
  'dateChange': {children:['done', 'error']}
});
