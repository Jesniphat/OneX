var Reflux          = require('reflux');
var sessionActions  = require('../actions/session');
var ajaxActions     = require('../actions/ajax');
var ajaxStore       = require('./ajax');

var sessionStore = Reflux.createStore({
  listenables: [sessionActions],

  getSession: function() {
      return this.sessionData || null;
  },

  onLoad: function() {
    ajaxActions.request('/api/system/sessionInfo', {}, this.didLoad);
  },

  didLoad: function(res) {
    if (res.status===true) {
      this.sessionData = res.session;
      sessionActions.load.done(res.session);
      this.trigger(res.session);
      return;
    }
    sessionActions.load.error(res.msg);
  },

  onKeepAlive: function() {
    ajaxActions.request('/api/system/keepAlive', {}, this.didKeepAlive);
  },

  didKeepAlive: function(res) {
    if (res.status===true) {
      sessionActions.keepAlive.done(res.session);
      return;
    }
    sessionActions.keepAlive.error(res.error);
  },

  onUpdateSession: function(param) {
    ajaxActions.request('/api/system/sessionUpdate', param, this.didUpdateSession);
  },

  didUpdateSession: function(res) {
    if (res.status===true) {
      this.sessionData = res.session;
      sessionActions.updateSession.done(res.session);
      return;
    }
    sessionActions.updateSession.error(res.error);
  }
});

module.exports = sessionStore;
