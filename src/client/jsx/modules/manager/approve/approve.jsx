var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var actions = require('./actions');
var store   = require('./store');

var Approve      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Approve.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('approve.title.index'));
  },
  render: function() {
    return this.props.children;
  }
});

// Approve.Routes = (
//   <Route name="manager.approve" path="cd" handler={Approve.Index}>
//     <Router.DefaultRoute name="manager.approve.list" handler={require('./approve-list.jsx')}/>
//     <Route name="manager.approve.screen" path="screen/:id?" handler={require('./approve-screen.jsx')}/>
//   </Route>
// );

module.exports = Approve;
