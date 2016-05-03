var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var actions = require('./actions');
var store   = require('./store');

var CashDaily      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

CashDaily.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('cd.title.index'));
  },
  render: function() {
    return this.props.children;
  }
});

// CashDaily.Routes = (
//   <Route name="finance.cd" path="cd" handler={CashDaily.Index}>
//     <Router.DefaultRoute name="finance.cd.list" handler={require('./cd-list.jsx')}/>
//     <Route name="finance.cd.screen" path="screen/:id?" handler={require('./cd-screen.jsx')}/>
//   </Route>
// );

module.exports = CashDaily;
