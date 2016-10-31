var React         = require('react');
var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');

var pickupListActions  = require('./actions');
var pickupListStore    = require('./store');

var Intransit = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


Intransit.Index = React.createClass({
  componentDidMount: function() {
    //systemActions.setPageHeader("Load Fare");
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

module.exports = Intransit;
