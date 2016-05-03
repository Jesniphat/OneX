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
    systemActions.setPageHeader(tr.translate('finance.payment_voucher.title.index'));
  },
  render: function() {
    return this.props.children;
  }
});

// PaymentVoucher.Routes = (
//   <Route name="finance.payment_voucher" path="payment_voucher" handler={PaymentVoucher.Index}>
//     <Router.DefaultRoute name="finance.payment_voucher.screen" handler={require('./payment_voucher-screen.jsx')}/>
//   </Route>
// );

module.exports = PaymentVoucher;
