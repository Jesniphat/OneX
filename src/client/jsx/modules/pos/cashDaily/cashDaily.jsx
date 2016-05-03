var React         = require('react');
var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var cashDailyActions = require('./actions');
var cashDailyStore   = require('./store');

var CashDaily      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

CashDaily.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('cashDaily.title.index'));
  },
  render: function() {
    return this.props.children;
  }
});

// CashDaily.List = require('./cashDaily-list.jsx');
// CashDaily.Edit = require('./cashDaily-edit.jsx');
// CashDaily.insertOld = require('./cashDaily-insertOld.jsx');

// CashDaily.Routes = (
//   <Route name="pos.cashDaily" path="cashDaily" handler={CashDaily.Index}>
//     <Route name="pos.cashDaily.list" path="list" handler={CashDaily.List}/>
//     <Route name="pos.cashDaily.edit" path="edit/:id/:sendStatus" handler={CashDaily.Edit}/>
//     <Route name="pos.cashDaily.insertOld" path="insertOld" handler={CashDaily.insertOld}/>
//   </Route>
// );

module.exports = CashDaily;
