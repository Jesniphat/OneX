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

var Info          = require('./info/info.jsx');

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var App = {};

App.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setTheme(3);
    systemActions.updateTopPanel({
      code:'info',
      name:'info',
      icon:'view12'
    });
    menuActions.show([
      {id:'dashboard', route:'/info/dashboard', label:'info.menu.dashboard', icon:'show6',acl:['M_INFO_DASHBOARD']},
      {id:'infototal', route:'/info/total', label:'info.menu.total', icon:'show6',acl:['M_INFO_TOTAL']},
      {id:'infostockinfo', route:'/info/stock', label:'info.menu.stock', icon:'show6',acl:['M_INFO_STOCK']},
      {id:'infostockin', route:'/info/stockin', label:'info.menu.stockin', icon:'show6',acl:['M_INFO_STOCKIN']},
      {id:'infoaginginfo', route:'/info/aging/0', label:'info.menu.aging', icon:'show6',acl:['M_INFO_AGING']},
      {id:'infotransfer', route:'/info/transfer', label:'info.menu.transfer', icon:'show6',acl:['M_INFO_TRANSFER']},
      {id:'infoselldetail', route:'/info/selldetail', label:'info.menu.selldetail', icon:'show6',acl:['M_INFO_SELLDETAIL']},
      {id:'inforeturn', route:'/info/return', label:'info.menu.return', icon:'show6',acl:['M_INFO_RETURN']}
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
            <T content="info.title.index"/>
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
//   <Route name="info" path="info" handler={App.Index}>
//        <Router.DefaultRoute name="info.dashboard" handler={App.Dashboard}/>
//        {Info.Routes}
//   </Route>
// );

module.exports = App;
