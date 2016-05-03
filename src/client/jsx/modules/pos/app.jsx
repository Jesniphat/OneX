var React         = require('react');
var Router        = require('react-router');
var tr            = require('counterpart');
var T             = require('react-translate-component');

var system        = require('ss-system');
var systemActions = system.systemActions;
var menuActions   = system.menuActions;
var infoPanelActions  = system.infoPanelActions;

var Sell          = require('./sell/sell.jsx');
var Receipt       = require('./receipt/receipt.jsx');
var CashDaily     = require('./cashDaily/cashDaily.jsx');
var Redeem       = require('./redeem/redeem.jsx');
var Change       = require('./change-product/change.jsx');

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

var App = {};

App.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setTheme(1);
    systemActions.updateTopPanel({
      code:'pos',
      name:'ขายหน้าร้าน',
      icon:'front17'
    });
    menuActions.show([
      {id:'dashboard', index: true, route:'/pos', label:'pos.menu.dashboard', icon:'show6',acl:['M_POS_DASHBOARD']},
      {id:'sell', route:'/pos/sell', label:'pos.menu.sell', icon:'show6',acl:['M_POS_SELL']},
      {id:'receipt', index: true, route:'/pos/receipt', label:'pos.menu.receipt', icon:'show6',acl:['M_POS_RECEIPT']},
      {id:'deptlist', route:'/pos/receipt/deptlist', label:'pos.menu.receipt_dept', icon:'show6',acl:['M_POS_RECEIPT_DEPT']},
      {id:'redeem', route:'/pos/redeem', label:'pos.menu.redeem', icon:'show6',acl:['M_POS_REDEEM']},
      {id:'changeProduct', route:'/pos/change', label:'pos.menu.change', icon:'show6',acl:['M_POS_CHANGE']},
      {id:'cashDailylist', route:'/pos/cashDaily', label:'pos.menu.cashDaily', icon:'change3',acl:['M_POS_CASHDAILY']}
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
            <T content="pos.title.index"/>
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
//   <Route name="pos" path="pos" handler={App.Index}>
//     <Router.DefaultRoute name="pos.dashboard" handler={App.Dashboard}/>
//     {Sell.Routes}
//     {Receipt.Routes}
//     {CashDaily.Routes}
//     {Redeem.Routes}
//     {Change.Routes}
//   </Route>
// );

module.exports = App;
