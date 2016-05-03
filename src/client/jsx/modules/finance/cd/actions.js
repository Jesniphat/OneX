module.exports = require('reflux').createActions({
  'list': {children:['done', 'error']},
  'export': {children:['done', 'error']},
  'ddlList':{children:['done','error']},
  'getBank':{children:['done','error']},
  'getDataTable':{children:['done','error']},
  'getDataMain':{children:['done','error']},
  'getDataDetail':{children:['done','error']},
  'save':{children:['done','error']},
  'getBranch': {children:['done', 'error']},
  'pdfExport': {children:['done', 'error']},
  'exportProfitLoss': {children:['done', 'error']}
});
