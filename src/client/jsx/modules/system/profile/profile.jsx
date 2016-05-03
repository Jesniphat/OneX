var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var profileActions  = require('./actions');
var profileStore    = require('./store');

var Profile = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


Profile.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('system.profile.title.index'));
  },

  render: function() {
    return (
      <Router.RouteHandler/>
    );
  }
});

Profile.Routes = (
  <Route name="system.profile" path="profile" handler={Profile.Index}>
    <Router.DefaultRoute name="sysytem.profile.summary" handler={require('./profile-summary.jsx')}/>
    <Route name="system.profile.change_pass" path="change_pass" handler={require('./profile-change-pass.jsx')}/>
  </Route>
);

module.exports = Profile;
