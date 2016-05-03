var React         = require('react');
var Router        = require('react-router');
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
    systemActions.setTheme(3);
    systemActions.updateTopPanel({
      code:'finance',
      name:'การเงิน',
      icon:'email107'
    });

    menuActions.show([
      {id:'dashboard', route:'/finance/dashboard', label:'finance.menu.dashboard', icon:'show6',acl:['M_FINANCE_DASHBOARD']},
      {id:'pv', route:'/finance/pv', label:'finance.menu.pv', icon:'email107',acl:['M_FINANCE_PV']},
      {id:'cd', route:'/finance/cd', label:'finance.menu.cd', icon:'email107',acl:['M_FINANCE_CD']},
      {id:'report', route:'/finance/report', label:'finance.menu.report', icon:'show6',acl:['M_FINANCE_REPORT']}
//      {id:'billing_receive', route:'finance.billing_receive', label:'finance.menu.billing_receive', icon:'email107',acl:['M_FINANCE_BILLING_RECEIVE']}
    ]);
  },
  render: function() {
    return this.props.children;
  }
});

App.Dashboard = React.createClass({
  componentDidMount:function() {
    infoPanelActions.hide();
  },
  render: function() {
    return (
      <div>
        <div className="box10 flex">
          <div className="panel5">
            <T content="finance.title.index"/>
          </div>
          <div className="panel5">
            &nbsp;
          </div>
        </div>
      </div>
    );
  }
});

// var PaymentVoucher = require('./pv/pv.jsx');
// var CashDaily = require('./cd/cd.jsx');
// var Report = require('./cd/report.jsx');

// App.Routes = (
//   <Route name="finance" path="finance" handler={App.Index}>
//     <Router.DefaultRoute name="finance.dashboard" handler={App.Dashboard}/>
//     {PaymentVoucher.Routes}
//     {CashDaily.Routes}
//     {Report.Routes}
//   </Route>
// );

module.exports = App;
