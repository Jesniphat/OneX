module.exports = require('reflux').createActions({
  'save': {children:['done', 'error']},
  'facetSetting': {children:['done', 'error']}
});
