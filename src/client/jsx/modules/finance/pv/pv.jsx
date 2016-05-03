var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var actions = require('./actions');
var store   = require('./store');

var PaymentVoucher      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

PaymentVoucher.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('finance.pv.title.index'));
  },
  render: function() {
    return (
      <Router.RouteHandler/>
    );
  }
});

// PaymentVoucher.Routes = (
//   <Route name="finance.pv" path="pv" handler={PaymentVoucher.Index}>
//     <Router.DefaultRoute name="finance.pv.list" handler={require('./pv-list.jsx')}/>
//     <Route name="finance.pv.screen" path="/screen/:id?" handler={require('./pv-screen.jsx')}/>
//   </Route>
// );

module.exports = PaymentVoucher;
