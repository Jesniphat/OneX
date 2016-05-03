var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');

var sellActions  = require('./actions');
var sellStore    = require('./store');

var Sell = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


Sell = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(null);
	},

  render: function() {
    return this.props.children;
  }
});

module.exports = Sell;
