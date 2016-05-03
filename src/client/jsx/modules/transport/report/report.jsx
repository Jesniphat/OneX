var React         = require('react');
var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');

var reportActions  = require('./actions');
var reportStore    = require('./store');

var NewReport = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


NewReport.Index = React.createClass({
  componentDidMount: function() {
    //systemActions.setPageHeader('');
  },

  render: function() {
    return this.props.children
  }
});

// NewReport.New = require('./Report-new.jsx');

// NewReport.Routes = (
//   <Route name="newReport.Report" path="add_Report/edit/:id?" handler={NewReport.Index}>
//     <Router.DefaultRoute name="newReport.Report.new" handler={NewReport.New}/>
//   </Route>
// );

module.exports = NewReport;