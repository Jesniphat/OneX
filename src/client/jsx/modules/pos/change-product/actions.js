module.exports = require('reflux').createActions({
  'checkproduct': {children:['done', 'error']},
  'saveCloseChange': {children:['done', 'error']}
  });
