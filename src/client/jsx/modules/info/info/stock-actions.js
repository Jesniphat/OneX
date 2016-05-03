module.exports = require('reflux').createActions({
  'list': {children:['done', 'error']},
  'export' : {children:['done', 'error']},
  'getById' : {children:['done', 'error']}
});
