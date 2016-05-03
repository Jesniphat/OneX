var Reflux          = require('reflux');
var system          = require('ss-system');

var ajaxActions     = system.ajaxActions;
var menuActions     = system.menuActions;

var profileActions    = require('./actions');

var profileStore = Reflux.createStore({
  listenables: [profileActions],

  onChangePass: function(param) {
    ajaxActions.request('/api/system/profile/changePass', param, this.didChangePass);
  },

  didChangePass: function(res) {
    if (res.status === true) {
      profileActions.changePass.done();
      return;
    }
    profileActions.changePass.error(res.error);
  },
});

module.exports = profileStore;
