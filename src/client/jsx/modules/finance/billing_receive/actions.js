module.exports = require('reflux').createActions({
  'query': {children:['done', 'error']},
  'facet': {children:['done', 'error']}
});
