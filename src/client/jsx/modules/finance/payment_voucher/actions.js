module.exports = require('reflux').createActions({
  'queryForWaitList': {children:['done', 'error']},
  'queryForSupplier': {children:['done', 'error']},
  'facet': {children:['done', 'error']}
});
