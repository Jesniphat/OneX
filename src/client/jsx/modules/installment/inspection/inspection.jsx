var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;

var contractActions = require('./actions');
var contractStore   = require('./store');

var Inspection      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Inspection.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('installment.inspection.title.index'));
  },
  render: function() {
    return this.props.children;
  }
});

Inspection.Detail = require('./inspection-detail.jsx');

// Inspection.Routes = (
//   <Route name="installment.inspection" path="inspection" handler={Inspection.Index}>
//     <Router.DefaultRoute name="installment.inspection.detail" handler={Inspection.Detail}/>
//   </Route>
// );
// console.log('route');

module.exports = Inspection;
