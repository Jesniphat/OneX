module.exports = require('reflux').createActions({
  'list': {children:['done', 'error']},
  'export': {children:['done', 'error']},
  'facet': {children:['done', 'error']},
  'reprint': {children:['done', 'error']},
  'generate': {children:['done', 'error']}
});
