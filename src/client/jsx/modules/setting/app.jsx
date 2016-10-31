var React         = require('react');
var Reflux        = require('reflux');
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

var Staff         = require('./staff/staff.jsx');
var Shop          = require('./shop/shop.jsx');
var Department    = require('./department/department.jsx');
var Role          = require('./role/role.jsx');
var Grant         = require('./grant/grant.jsx');
// var Default       = require('.default/default.jsx');

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var App = {};

App.Index = React.createClass({
  mixins: [
    Reflux.listenTo(systemActions.getCounts.done, 'onGetCountDoneAction')
  ],

  onGetCountDoneAction: function(result) {
    for (var i in result) {
      menuActions.updateCount(i, result[i]);
    }
  },
  componentDidMount: function() {
    systemActions.setTheme(6);
    systemActions.updateTopPanel({
      code:'setting',
      name:'Settings',
      icon:'settings49'
    });
    menuActions.show([
      {id:'dashboard', route:'/setting/dashboard', label:'setting.menu.dashboard', icon:'show6',acl:['M_SETTING_DASHBOARD']},
      {id:'staff', route:'/setting/staff', label:'setting.menu.staff', icon:'user157',acl:['M_SETTING_STAFF']},
      {id:'shop', route:'/setting/shop', label:'setting.menu.shop', icon:'web37', acl:['M_SETTING_SHOP']},
      {id:'department', route:'/setting/department', label:'setting.menu.department', icon:'shared1', acl:['M_SETTING_DEPARTMENT']},
      {id:'role', route:'/setting/role', label:'setting.menu.role', icon:'two385', acl:['M_SETTING_ROLE']},
      {id:'grant', route:'/setting/grant', label:'setting.menu.grant', icon:'locked58', acl:['M_SETTING_GRANT']},
      {id:'default', route:'/setting/default', label:'setting.menu.default', icon:'city24', acl:['M_SETTING_DEFAULT']}
    ]);
    systemActions.getCounts({
      request: '/api/setting/counts',
      list:[
        'staff', 'shop', 'department', 'role'
      ]
    });
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
      <div id="content">
        &nbsp;
      </div>
    );
  }
});



// App.Routes = (
//   <Route name="setting" path="setting" handler={App.Index}>
//     <Router.DefaultRoute name="setting.dashboard" handler={App.Dashboard}/>
//     {Staff.Routes}
//     {Shop.Routes}
//     {Department.Routes}
//     {Role.Routes}
//     {Grant.Routes}
//   </Route>
// );



module.exports = App;
