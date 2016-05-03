var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var receiptStore    = require('./store');
var Receipt = {};

var system = require('ss-system');
var systemActions = system.systemActions;

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Receipt.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('pos.receipt.search'));
},

  render: function() {
    return this.props.children;
  }
});

// Receipt.Screen = require('./receipt-screen.jsx');
// Receipt.List = require('./receipt-list.jsx');
// Receipt.DeptList = require('./receipt-deptlist.jsx');
// Receipt.History = require('./receipt-history.jsx');

// Receipt.Routes = (
//   <Route name="pos.receipt" path="receipt" handler={Receipt.Index}>
//      <Router.DefaultRoute name="pos.receipt.list" path="list" handler={Receipt.List}/>
//      <Route name="pos.receipt.screen" path="edit/:id/:contract_code/:redeem" handler={Receipt.Screen}/>
//      <Route name="pos.receipt.deptlist" path="deptlist"  handler={Receipt.DeptList}/>
//      <Route name="pos.receipt.history" path="history/:id" handler={Receipt.History}/>
//   </Route>
// );

module.exports = Receipt;
