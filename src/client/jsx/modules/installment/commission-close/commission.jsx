var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var commissionActions = require('./actions');
var commissionStore   = require('./store');

var Barcode      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Barcode.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('installment.commission-close.title.index'));
  },
  render: function() {
    return this.props.children;
  }
});

// Barcode.Routes = (
//   <Route name="installment.commission-close" path="commission-close" handler={Barcode.Index}>
//     <Router.DefaultRoute name="installment.commission-close.list" handler={require('./commission-list.jsx')}/>
//     <Route name="installment.commission-close.detail" path="detail/:term_year/:term_month/:shop_id" handler={require('./commission-detail.jsx')}/>
//   </Route>
// );

module.exports = Barcode;
