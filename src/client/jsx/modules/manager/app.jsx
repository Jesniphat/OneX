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
    systemActions.updateTopPanel({
      code:'approve',
      name:'ผู้บริหาร',
      icon:'user157'
    });

    menuActions.show([
      {id:'dashboard', route:'/manager', label:'manager.menu.dashboard', icon:'show6',acl:['M_MANAGER']},
      {id:'approve', route:'/manager/approve', label:'manager.menu.approve', icon:'email107',acl:['M_MANAGER_APPROVE']}
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
            <T content="manager.title.index"/>
          </div>
          <div className="panel5">
            &nbsp;
          </div>
        </div>
      </div>
    );
  }
});

// var Approve = require('./approve/approve.jsx');
// App.Routes = (
//   <Route name="manager" path="manager" handler={App.Index}>
//     <Router.DefaultRoute name="manager.dashboard" handler={App.Dashboard}/>
//     {Approve.Routes}
//   </Route>
// );

module.exports = App;
