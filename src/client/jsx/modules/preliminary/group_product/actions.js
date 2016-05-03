module.exports = require('reflux').createActions({
  'groupProductSave': {children:['done','error']},
  'groupProductList': {children:['done', 'error']},
  'groupProductItem': {children:['done', 'error']},
  'allProductItem': {children:['done', 'error']},
  'allGroupItem': {children:['done', 'error']},
  'getGroupProudct': {children:['done', 'error']},
  'groupProductDelete': {children:['done', 'error']}
});
