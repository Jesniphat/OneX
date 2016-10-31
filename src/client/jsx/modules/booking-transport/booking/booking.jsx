var React         = require('react');

var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');
var menuActions   = system.menuActions;
var bookingActions  = require('./actions');
var bookingStore    = require('./store');

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
      // {id:'dashboard', route:'/booking-transport', label:'transport.menu.dashboard', icon:'show6',acl:['pos']},
      {id:'booking', route:'/booking-transport' , label:'transport.menu.booking', icon:'users25',acl:['M_TRANSPORT_BOOKING']}
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
