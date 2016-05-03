module.exports = require('reflux').createActions({
  'list': {children:['done', 'error']},
  'export': {children:['done', 'error']},
  'getById': {children:['done', 'error']},
  'save': {children:['done', 'error']},
  'delete': {children:['done', 'error']},
  'facetEdit': {children:['done', 'error']}
});
