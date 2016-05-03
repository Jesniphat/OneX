var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var receiptStore    = require('./store');
var Commission = {};

var system = require('ss-system');
var systemActions = system.systemActions;

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Commission.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('report.commission.searchopen'));
},

  render: function() {
    return this.props.children;
  }
});

// Commission.List = require('./commission-open-list.jsx');

// Commission.Routes = (
//   <Route name="report.report-commission-open" path="report-commission-open" handler={Commission.Index}>
//      <Router.DefaultRoute name="report.report-commission-open.list" path="list" handler={Commission.List}/>
//   </Route>
// );

module.exports = Commission;
