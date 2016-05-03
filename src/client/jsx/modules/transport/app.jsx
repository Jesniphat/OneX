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
      {id:'dashboard', route:'/transport', label:'transport.menu.dashboard', icon:'show6',acl:['pos']},
      {id:'loadfareZone', route:'/transport/loadfare/zone', label:'transport.menu.loadfareZone', icon:'download166',acl:['pos']},
      {id:'loadfareRate', route:'/transport/loadfare/rate', label:'transport.menu.loadfareRate', icon:'download166',acl:['pos']},
      {id:'bookingList', route:'/transport/bookingList', label:'transport.menu.bookingList',icon:'list88',acl:['transport']},
      {id:'bookingWaitCredit', route:'/transport/bookingWaitCredit', label:'transport.menu.bookingWaitCredit',icon:'keyboard53',acl:['transport']},
      {id:'bookingWaitAssign', route:'/transport/bookingWaitAssign' , label:'transport.menu.bookingWaitAssign', icon:'keyboard53',acl:['M_NEWCUSTOMR_CUSTOMER']},
      {id:'bookingInprocess', route:'/transport/bookingInprocess' , label:'transport.menu.inprocess', icon:'keyboard53',acl:['M_NEWCUSTOMR_CUSTOMER']},
      {id:'bookingIntransit', route:'/transport/bookingIntransit' , label:'transport.menu.intransit', icon:'keyboard53',acl:['M_NEWCUSTOMR_CUSTOMER']},
      {id:'bookingArrived', route:'/transport/bookingArrived' , label:'transport.menu.arrived', icon:'keyboard53',acl:['M_NEWCUSTOMR_CUSTOMER']},
      {id:'bookingDelivered', route:'/transport/bookingDelivered' , label:'transport.menu.delivered', icon:'keyboard53',acl:['M_NEWCUSTOMR_CUSTOMER']},
      {id:'bookingException', route:'/transport/bookingException' , label:'transport.menu.exception', icon:'keyboard53',acl:['M_NEWCUSTOMR_CUSTOMER']},
      {id:'bookingCancel', route:'/transport/bookingCancel' , label:'transport.menu.cancel', icon:'keyboard53',acl:['M_NEWCUSTOMR_CUSTOMER']},
      {id:'booking', route:'/transport/booking' , label:'transport.menu.booking', icon:'users25',acl:['M_NEWCUSTOMR_CUSTOMER']},
      {id:'pickup', route:'/transport/pickup', label:'transport.menu.pickup', icon:'shopping231',acl:['M_NEWCUSTOMR_CUSTOMER']},
      {id:'pickupReceipt', route:'/transport/pickup-receipt', label:'transport.menu.pickupReceipt', icon:'keyboard53',acl:['M_NEWCUSTOMR_CUSTOMER']},
      {id:'pickup', route:'/transport/intransit', label:'transport.menu.intransit', icon:'shopping231',acl:['M_NEWCUSTOMR_CUSTOMER']},
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
