module.exports = require('reflux').createActions({
  'getTaxID': {children:['done', 'error']},
  'getList': {children:['done', 'error']}
});
