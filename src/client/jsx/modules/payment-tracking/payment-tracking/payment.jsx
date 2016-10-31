var React         = require('react');
var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var systemActions = system.systemActions; //require('../../system/actions');
var menuActions   = system.menuActions;
var infoPanelActions  = system.infoPanelActions;

var paymentTrackingAction  = require('./actions');
var paymentTrackingAction    = require('./store');

var LoadFare = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


LoadFare.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader("Transport");
    systemActions.setTheme(1);
    systemActions.updateTopPanel({
      code:'pos',
      name:'Transport',
      icon:'world96'
    });
    menuActions.show([
      // {id:'dashboard', route:'/payment-tracking', label:'transport.menu.dashboard', icon:'show6',acl:['pos']},
      // {id:'payment_tracking', route:'/payment-tracking/payment-tracking', label:'transport.menu.payment_tracking', icon:'credit98',acl:['M_TRANSPORT_PROCESS']},
      {id:'payment_tracking', route:'/payment-tracking', label:'transport.menu.payment_tracking', icon:'credit98',acl:['M_TRANSPORT_PROCESS']},
    ]);
  },
  render: function() {
    return this.props.children
  }
});

//LoadFare.Screen = require('./loadfare-screen.jsx');


// LoadFare.Routes = (
//   <Route name="transport.loadfare" path="loadfare" handler={LoadFare.Index}>
//     <Router.DefaultRoute name="transport.loadfare.screen" path="loadfare-screen" handler={LoadFare.Screen}/>
//   </Route>
// );

module.exports = LoadFare;


// componentDidMount: function() {
//   //systemActions.setPageHeader("Load Fare");
// },
//
// render: function() {
//   return this.props.children
// }
