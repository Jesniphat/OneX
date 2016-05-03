module.exports = require("reflux").createActions({
  'load':{children:['done', 'error']},
  'keepAlive':{children:['done', 'error']},
  'updateSession':{children:['done', 'error']}
});
