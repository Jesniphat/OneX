var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var tr            = require('counterpart');
var T             = require('react-translate-component');

var system        = require('ss-system');
var systemActions = system.systemActions;
var menuActions   = system.menuActions;
var infoPanelActions  = system.infoPanelActions;

//var LoadFare          = require('./loadfare/loadfare.jsx');

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var App = {};

App.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader("Transport");
    systemActions.setTheme(1);
    systemActions.updateTopPanel({
      code:'pos',
      name:'Transport',
      icon:'world96'
    });
    menuActions.show([
      {id:'dashboard', route:'/report-transport', label:'transport.menu.dashboard', icon:'show6',acl:['pos']},
      {id:'intransit_report', route:'/report-transport/report', label:'transport.menu.report', icon:'clipboard99',acl:['M_TRANSPORT_REPORT']}
    ]);
  },
  render: function() {
    return this.props.children
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
            <T content="transport.title.index"/>
          </div>
          <div className="panel5">
            &nbsp;
          </div>
        </div>
      </div>
    );
  }
});

// App.Routes = (
//   <Route name="transport" path="transport" handler={App.Index}>
//     <Router.DefaultRoute name="transport.dashboard" handler={App.Dashboard}/>
//     {LoadFare.Routes}
//   </Route>
// );
//
//
// {id:'customer', route:'/transport/customer' , label:'transport.menu.customer', icon:'users25',acl:['M_NEWCUSTOMR_CUSTOMER']},

module.exports = App;
