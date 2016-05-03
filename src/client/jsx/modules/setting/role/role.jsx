var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');

var roleActions  = require('./actions');
var roleStore    = require('./store');

var Role = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


Role.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('role.title.index'));
  },
  render: function() {
    return this.props.children
  }
});

// Role.List = require('./role-list.jsx');
// Role.Edit = require('./role-edit.jsx');


// Role.Routes = (
//   <Route name="setting.role" path="role" handler={Role.Index}>
//     <Router.DefaultRoute name="setting.role.list" handler={Role.List}/>
//     <Route name="setting.role.edit" path=":id" handler={Role.Edit}/>
//   </Route>
// );

module.exports = Role;
