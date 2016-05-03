var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var contractActions = require('./actions');
var contractStore   = require('./store');

var Contract      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Contract.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('contract.title.index'));
  },
  render: function() {
    return this.props.children;
  }
});

// Contract.Pending = require('./contract-pending.jsx');
// Contract.New = require('./contract-new.jsx');
// Contract.List = require('./contract-list.jsx');
// Contract.Edit = require('./contract-edit.jsx');
// Contract.Close = require('./contract-close.jsx');
// Contract.CloseDiscount = require('./contract-closediscount.jsx');
// Contract.Dunning = require('./contract-dunning.jsx');
// Contract.Redeem = require('./contract-redeem.jsx');

// Contract.Routes = (
//   <Route name="installment.contract" path="contract" handler={Contract.Index}>
//     <Router.DefaultRoute name="installment.contract.pending" handler={Contract.Pending}/>
//     <Route name="installment.contract.new" path="new/:sellId/:sellType?/:contractref?/:sellold?" handler={Contract.New}/>
//     <Route name="installment.contract.list" path="list" handler={Contract.List}/>
//     <Route name="installment.contract.edit" path="edit/:id/:pageback?/:close?/:dunning?" handler={Contract.Edit}/>
//     <Route name="installment.contract.close" handler={Contract.Close}/>
//     <Route name="installment.contract.closediscount" handler={Contract.CloseDiscount}/>
//     <Route name="installment.contract.dunning" handler={Contract.Dunning}/>
//     <Route name="installment.contract.redeem" handler={Contract.Redeem}/>
//   </Route>
// );

module.exports = Contract;
