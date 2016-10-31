module.exports = require("reflux").createActions({
  'toggleModuleMenu': {},
  'bodyClick': {},
  'getMaster': {children:['done', 'error']},
  'iniModule': {children:['done', 'error']},
  'requestSignOut':{},
  'signout': {children:['done', 'error']},
  'signoutTransport': {children:['done', 'error']},
  'ping': {children:['done', 'error']},
  'setTheme': {},
  'updateTopPanel': {},
  'setPageHeader':{},
  'getIDCardReaders':{children:['done','error']},
  'readIDCard':{children:['done', 'error']},
  'readIDCardPhoto':{children:['done', 'error']},
  'getCounts':{children:['done', 'error']},
  'printerList':{children:['done', 'error']},
  'print':{children:['done','error']}
});
