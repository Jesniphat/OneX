module.exports = require('reflux').createActions({
  'fareUpload': {children:['done','error']},
  'listFarePoint': {children:['done','error']},
  'listFareReword': {children:['done','error']}
});

