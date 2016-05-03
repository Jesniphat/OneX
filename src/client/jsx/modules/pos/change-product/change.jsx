var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var changeStore    = require('./store');
var Change = {};

var system = require('ss-system');
var systemActions = system.systemActions;

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Change.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('pos.change.search'));
},

  render: function() {
    return this.props.children;
  }
});

// Change.screen = require('./change-screen.jsx');

// Change.Routes = (
//   <Route name="pos.change-product.change" path="change" handler={Change.Index}>
//      <Router.DefaultRoute name="pos.change-product.screen" path="change" handler={Change.screen}/>
//   </Route>
// );

module.exports = Change;
