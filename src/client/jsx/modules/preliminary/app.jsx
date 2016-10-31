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
    systemActions.setTheme(1);
    systemActions.updateTopPanel({
      code:'pos',
      name:'Client setting',
      icon:'front17'
    });
    menuActions.show([
      {id:'dashboard', index:true, route:'/preliminary', label:'preliminary.menu.dashboard', icon:'show6',acl:['M_PRELIMINARY_DASHBOAD', 'M_CUSTOMER']},
      {id:'customer', route:'/preliminary/customer', label:'preliminary.menu.customer', icon:'users25',acl:['M_PRELIMINARY_CUSTOMER']},
      {id:'group_product', route:'/preliminary/group_product', label:'preliminary.menu.group_product', icon:'website12',acl:['M_PRELIMINARY_PRODUCT_GROUP']},
      {id:'import_point', route:'/preliminary/fare/import_point', label:'preliminary.menu.fare_point', icon:'import',acl:['M_PRELIMINARY_FAREPOINT']},
      {id:'import_reword', route:'/preliminary/fare/import_reword', label:'preliminary.menu.fare_reword', icon:'import',acl:['M_PRELIMINARY_FAREREWORD']}
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
            <T content="preliminary.title.index"/>
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
//   <Route name="preliminary" path="preliminary" handler={App.Index}>
//     <Router.DefaultRoute name="preliminary.dashboard" handler={App.Dashboard}/>
//     {Customer.Routes}
//     {ProductGroup.Routes}
//   </Route>
// );
//
// gอากลับไปใส่ด้วย {id:'group_product', route:'/preliminary/group_product', label:'preliminary.menu.group_product', icon:'website12',acl:['M_PRELIMINARY_PRODUCT_GROUP']}

module.exports = App;
