var React         = require('react');
var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var systemActions = system.systemActions; //require('../../system/actions');
var menuActions   = system.menuActions;
var infoPanelActions  = system.infoPanelActions;

var reportActions  = require('./actions');
var reportStore    = require('./store');

var NewReport = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


NewReport.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader("Transport");
    systemActions.setTheme(1);
    systemActions.updateTopPanel({
      code:'pos',
      name:'Transport',
      icon:'world96'
    });
    menuActions.show([
      // {id:'dashboard', route:'/report-transport', label:'transport.menu.dashboard', icon:'show6',acl:['pos']},
      // {id:'intransit_report', route:'/report-transport/report', label:'transport.menu.report', icon:'clipboard99',acl:['M_TRANSPORT_REPORT']}
      {id:'intransit_report', route:'/report-transport', label:'transport.menu.report', icon:'clipboard99',acl:['M_TRANSPORT_REPORT']}
    ]);
  },
  render: function() {
    return this.props.children
  }
});

// NewReport.New = require('./Report-new.jsx');

// NewReport.Routes = (
//   <Route name="newReport.Report" path="add_Report/edit/:id?" handler={NewReport.Index}>
//     <Router.DefaultRoute name="newReport.Report.new" handler={NewReport.New}/>
//   </Route>
// );

module.exports = NewReport;
