var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var barcodeActions = require('./actions');
var barcodeStore   = require('./store');

var Generator      = {};
var Print      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Generator.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('barcode.title.generator'));
  },
  render: function() {
    return this.props.children;
  }
});

Print.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('barcode.title.print'));
  },
  render: function() {
    return this.props.children;
  }
});

// Generator.Routes = (
//   <Route name="installment.barcode-gen" path="barcode-gen" handler={Generator.Index}>
//     <Router.DefaultRoute name="installment.barcode-gen.generator" handler={require('./barcode-generator.jsx')}/>
//   </Route>
// );

// Print.Routes = (
//   <Route name="installment.barcode-print" path="barcode-print" handler={Print.Index}>
//     <Router.DefaultRoute name="installment.barcode-print.print" handler={require('./barcode-print.jsx')}/>
//   </Route>
// );

module.exports = { Print: Print, Generator: Generator };
