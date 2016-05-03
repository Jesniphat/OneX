module.exports = require('reflux').createActions({
  'list': {children:['done','error']},
  'export': {children:['done','error']},
  'getPV': {children:['done','error']},
  'queryForWaitList': {children:['done', 'error']},
  'queryForSupplier': {children:['done', 'error']},
  'facet': {children:['done', 'error']},
  'save': {children:['done','error']},
  'print': {children:['done','error']}
});
