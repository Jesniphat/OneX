var React         = require('react');
var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var barcodeActions = require('./actions');
var barcodeStore   = require('./store');

var BillingReceive      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

BillingReceive.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('finance.billing_receive.title.index'));
  },
  render: function() {
    return this.props.children;
  }
});

// BillingReceive.Routes = (
//   <Route name="finance.billing_receive" path="billing_receive" handler={BillingReceive.Index}>
//     <Router.DefaultRoute name="finance.billing_receive.screen" handler={require('./billing_receive-screen.jsx')}/>
//   </Route>
// );

module.exports = BillingReceive;
