module.exports = require('reflux').createActions({
  'fareUpload': {children:['done','error']},
  'listFareZone': {children:['done','error']},
  'listFareRate': {children:['done','error']}
});
