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
      // {id:'loadfareZone', route:'/transport/loadfare/zone', label:'transport.menu.loadfareZone', icon:'download166',acl:['M_TRANSPORT_FARE']},
      // {id:'loadfareRate', route:'/transport/loadfare/rate', label:'transport.menu.loadfareRate', icon:'download166',acl:['M_TRANSPORT_FARE']},
      {id:'bookingList', route:'/transport/bookingList', label:'transport.menu.bookingList',icon:'list88',acl:['M_TRANSPORT_BOOKING']},
      {id:'bookingWaitCredit', route:'/transport/bookingWaitCredit', label:'transport.menu.bookingWaitCredit',icon:'horizontal39',acl:['M_TRANSPORT_BOOKING']},
      {id:'bookingWaitAssign', route:'/transport/bookingWaitAssign' , label:'transport.menu.bookingWaitAssign', icon:'horizontal39',acl:['M_TRANSPORT_BOOKING']},
      {id:'bookingInprocess', route:'/transport/bookingInprocess' , label:'transport.menu.inprocess', icon:'horizontal39',acl:['M_TRANSPORT_BOOKING']},
      {id:'bookingIntransit', route:'/transport/bookingIntransit' , label:'transport.menu.intransit', icon:'horizontal39',acl:['M_TRANSPORT_BOOKING']},
      {id:'bookingArrived', route:'/transport/bookingArrived' , label:'transport.menu.arrived', icon:'horizontal39',acl:['M_TRANSPORT_BOOKING']},
      {id:'bookingDelivered', route:'/transport/bookingDelivered' , label:'transport.menu.delivered', icon:'horizontal39',acl:['M_TRANSPORT_BOOKING']},
      {id:'bookingException', route:'/transport/bookingException' , label:'transport.menu.exception', icon:'horizontal39',acl:['M_TRANSPORT_BOOKING']},
      {id:'bookingCancel', route:'/transport/bookingCancel' , label:'transport.menu.cancel', icon:'horizontal39',acl:['M_TRANSPORT_BOOKING']},
      // {id:'booking', route:'/transport/booking' , label:'transport.menu.booking', icon:'users25',acl:['M_TRANSPORT_BOOKING']},
      {id:'pickup', route:'/transport/pickup', label:'transport.menu.pickup', icon:'shopping231',acl:['M_TRANSPORT_PROCESS']},
      {id:'pickupReceipt', route:'/transport/pickup-receipt', label:'transport.menu.pickupReceipt', icon:'keyboard53',acl:['M_TRANSPORT_PROCESS']},
      {id:'intransit', route:'/transport/intransit', label:'transport.menu.intransit', icon:'black401',acl:['M_TRANSPORT_PROCESS']},
      {id:'intransitReceipt', route:'/transport/intransit-receipt', label:'transport.menu.intransitReceipt', icon:'keyboard53',acl:['M_TRANSPORT_PROCESS']},
      {id:'delivery', route:'/transport/delivery', label:'transport.menu.delivery', icon:'car147',acl:['M_TRANSPORT_PROCESS']},
      {id:'deliveryReceipt', route:'/transport/delivery-receipt', label:'transport.menu.deliveryReceipt', icon:'keyboard53',acl:['M_TRANSPORT_PROCESS']},
      // {id:'intransit_report', route:'/transport/report', label:'transport.menu.report', icon:'clipboard99',acl:['M_TRANSPORT_REPORT']},
      // {id:'payment_tracking', route:'/transport/payment-tracking', label:'transport.menu.payment_tracking', icon:'credit98',acl:['M_TRANSPORT_PROCESS']},
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
