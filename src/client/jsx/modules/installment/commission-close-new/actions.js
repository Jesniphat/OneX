module.exports = require('reflux').createActions({
  'list': {children:['done', 'error']},
  'export': {children:['done', 'error']},
  'facetList': {children:['done', 'error']},
  'genrate': {children:['done', 'error']},
  'facetDetail': {children:['done', 'error']},
  'commissionDetail': {children:['done', 'error']},
  'saveCommission': {children:['done','error']},
  'voidCommission': {children:['done','error']},
  'paidCommission': {children:['done','error']}
});
