module.exports = require('reflux').createActions({
  'listRecontract': {children:['done', 'error']},
  'exportRecontract': {children:['done', 'error']},
  'saveRecontract': {children:['done', 'error']}
});
