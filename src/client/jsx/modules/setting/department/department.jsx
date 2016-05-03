var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');

var departmentActions  = require('./actions');
var departmentStore    = require('./store');

var Department = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


Department.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('department.title.index'));
  },

  render: function() {
    return this.props.children
  }
});

// Department.List = require('./department-list.jsx');
// Department.Edit = require('./department-edit.jsx');


// Department.Routes = (
//   <Route name="setting.department" path="department" handler={Department.Index}>
//     <Router.DefaultRoute name="setting.department.list" handler={Department.List}/>
//     <Route name="setting.department.edit" path=":id" handler={Department.Edit}/>
//   </Route>
// );

module.exports = Department;
