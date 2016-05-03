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
    systemActions.setTheme(3);
    systemActions.updateTopPanel({
      code:'stock',
      name:'คลังสินค้า',
      icon:'web37'
    });
    menuActions.show([
      {id:'dashboard', route:'/stock', label:'stock.menu.dashboard', icon:'show6',acl:['M_STOCK_DASHBOARD']},
      {id:'customer', route:'/stock/customer', label:'stock.menu.customer', icon:'show6',acl:['M_STOCK_STAFF']}
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
            <T content="stock.title.index"/>
          </div>
          <div className="panel5">
            &nbsp;
          </div>
        </div>
      </div>
    );
  }
});

// var Customer = require('./customer/customer.jsx');


// App.Routes = (
//   <Route name="stock" path="stock" handler={App.Index}>
//     <Router.DefaultRoute name="stock.dashboard" handler={App.Dashboard}/>
//     {Customer.Routes}
//   </Route>
// );

module.exports = App;
