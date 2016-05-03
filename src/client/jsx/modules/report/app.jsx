var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var DefaultRoute  = Router.DefaultRoute;
var RouteHandler  = Router.RouteHandler;
var tr            = require('counterpart');
var T             = require('react-translate-component');

var system        = require('ss-system');
var systemActions = system.systemActions; //require('../system/actions');
var menuActions   = system.menuActions; //require('../system/actions/menu');
var infoPanelActions  = system.infoPanelActions;

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var App = {};

App.Index = React.createClass({
  componentDidMount: function() {
    // systemActions.setTheme(2);
    systemActions.updateTopPanel({
      code:'report',
      name:'รายงาน',
      icon:'web37'
    });
    menuActions.show([
      {id:'dashboard', index: true, route:'/report/dashboard', label:'report.menu.dashboard', icon:'show6',acl:['M_REPORT_DASHBOARD']},
      {id:'commissionclose', route:'/report/report-commission-close', label:'report.menu.commissionclose', icon:'show6',acl:['M_REPORT_COMMISSIONOPEN']},
      {id:'commissionopen', route:'/report/report-commission-open', label:'report.menu.commissionopen', icon:'show6',acl:['M_REPORT_COMMISSIONCLOSE']}
    ]);
  },
  render: function() {
    return this.props.children;
  }
});

App.Dashboard = React.createClass({
  componentDidMount:function() {
    // infoPanelActions.hide();
    systemActions.setPageHeader(tr.translate('report.title.index'));
  },
  render: function() {
    return (
      <div>
        <div className="box10 flex">
          <div className="panel5">
            &nbsp;
          </div>
        </div>
      </div>
    );
  }
});

// var Others            = require('./others/others.jsx');
// var CommissionClose   = require('./report-commission-close/commission.jsx');
// var CommissionOpen    = require('./report-commission-open/commission.jsx');

// App.Routes = (
//   <Route name="report" path="report" handler={App.Index}>
//     <Router.DefaultRoute name="report.dashboard" handler={App.Dashboard}/>
//     {CommissionClose.Routes}
//     {CommissionOpen.Routes}
//   </Route>
// );

module.exports = App;
