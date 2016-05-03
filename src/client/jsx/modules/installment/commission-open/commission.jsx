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

Barcode = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('installment.commission-open.title.index'));
  },
  render: function() {
    return this.props.children;
  }
});

// Barcode.Routes = (
//   <Route name="installment.commission-open" path="commission-open" handler={Barcode.Index}>
//     <Router.DefaultRoute name="installment.commission-open.list" handler={require('./commission-list.jsx')}/>
//     <Route name="installment.commission-open.detail" path="detail/:term_year/:term_month/:shop_id/:staff_id" handler={require('./commission-detail.jsx')}/>
//   </Route>
// );

module.exports = Barcode;
