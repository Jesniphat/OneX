var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var tr            = require('counterpart');
var T             = require('react-translate-component');

var system        = require('ss-system');
var systemActions = system.systemActions;
var menuActions   = system.menuActions;
var infoPanelActions  = system.infoPanelActions;

var Customer          = require('./customer/customer.jsx');
var ProductGroup      = require('./group_product/group_product.jsx');

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var App = {};

App.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setTheme(4);
    systemActions.updateTopPanel({
      code:'pos',
      name:'ข้อมูลลูกค้า',
      icon:'front17'
    });
    menuActions.show([
      {id:'dashboard', index:true, route:'/member', label:'member.menu.dashboard', icon:'show6',acl:['M_MEMBER_DASHBOAD']},
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
            <T content="member.title.index"/>
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
//   <Route name="member" path="member" handler={App.Index}>
//     <Router.DefaultRoute name="member.dashboard" handler={App.Dashboard}/>
//     {Customer.Routes}
//     {ProductGroup.Routes}
//   </Route>
// );

module.exports = App;
