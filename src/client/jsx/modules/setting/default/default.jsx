var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');

var grantActions  = require('./actions');
var grantStore    = require('./store');

var DefaultSetting  = require('./default-setting.jsx');


var Grant = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Grant.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('default.title.index'));
  },
  render: function() {
    return this.props.children
  }
});

// Grant.Routes = (
//   <Route name="setting.grant" path="grant" handler={Grant.Index}/>
// );

module.exports = Grant;
