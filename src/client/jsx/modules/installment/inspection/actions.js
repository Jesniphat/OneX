module.exports = require('reflux').createActions({
  inspect: {children:['done', 'error']},
  genContractForm: {children:['done','error']},
  savePerson: {children:['done','error']},
  savePersonPhoto: {children:['done','error']},
  getPersonOracle: {children:['done','error']}
});
