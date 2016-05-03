var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var recontractActions = require('./actions');
var recontractStore   = require('./store');

var Recontract      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Recontract.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('contract.title.index'));
  },
  render: function() {
    return this.props.children;
  }
});

// Recontract.List = require('./recontract-list.jsx');

// Recontract.Routes = (
//   <Route name="pos.recontract" path="recontract" handler={Recontract.Index}>
//     <Router.DefaultRoute name="pos.recontract.list" path="list" handler={Recontract.List}/>
//   </Route>
// );

module.exports = Recontract;
