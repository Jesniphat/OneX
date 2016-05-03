var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');

var staffActions  = require('./actions');
var staffStore    = require('./store');

var Staff = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


Staff.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('staff.title.index'));
  },

  render: function() {
    return this.props.children
  }
});

// Staff.List = require('./staff-list.jsx');
// Staff.Edit = require('./staff-edit.jsx');


// Staff.Routes = (
//   <Route name="setting.staff" path="staff" handler={Staff.Index}>
//     <Router.DefaultRoute name="setting.staff.list" handler={Staff.List}/>
//     <Route name="setting.staff.edit" path=":id" handler={Staff.Edit}/>
//   </Route>
// );

module.exports = Staff;
