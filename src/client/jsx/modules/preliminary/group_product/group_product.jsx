var React         = require('react');
var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var systemActions = system.systemActions; //require('../../system/actions');

var customerActions  = require('./actions');
var customerStore    = require('./store');

var GroupProduct = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


GroupProduct.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('preliminary.group_product.head'));
  },

  render: function() {
    return this.props.children;
  }
});

module.exports = GroupProduct;
