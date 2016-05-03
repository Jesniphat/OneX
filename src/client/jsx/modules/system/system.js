module.exports = {
  systemActions: require('./actions'),
  systemStore: require('./store'),

  ajaxActions: require('./actions/ajax'),
  dialogActions: require('./actions/dialog'),
  dialogLOV: require('./actions/dialog-lov'),
  infoPanelActions: require('./actions/info-panel'),
  menuActions: require('./actions/menu'),
  sessionActions: require('./actions/session'),
  toasterActions: require('./actions/toaster'),

  ajaxStore: require('./stores/ajax'),
  sessionStore: require('./stores/session'),

  helper: require('../../../../server/lib/helper'),
  acl: require('./acl'),
  storage: require('./storage')
};
