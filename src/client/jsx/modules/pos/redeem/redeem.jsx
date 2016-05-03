var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var redeemStore    = require('./store');
var Redeem = {};

var system = require('ss-system');
var systemActions = system.systemActions;

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Redeem.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('pos.redeem.search'));
},

  render: function() {
    return this.props.children;
  }
});

// Redeem.screen = require('./redeem-screen.jsx');

// Redeem.Routes = (
//   <Route name="pos.redeem" path="redeem" handler={Redeem.Index}>
//      <Router.DefaultRoute name="pos.redeem.screen" path="redeem" handler={Redeem.screen}/>
//   </Route>
// );

module.exports = Redeem;
