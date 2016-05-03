module.exports = require('reflux').createActions({
  'facetSetting': {children:['done', 'error']},
  'save': {children:['done', 'error']}
});
