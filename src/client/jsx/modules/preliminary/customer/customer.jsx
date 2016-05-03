var React         = require('react');
var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');

var customerActions  = require('./actions');
var customerStore    = require('./store');

var Customer = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


Customer.Index = React.createClass({
  componentDidMount: function() {
    //systemActions.setPageHeader('');
  },

  render: function() {
    return this.props.children
  }
});

// Customer.List = require('./customer-list.jsx');
// Customer.Edit = require('./customer-edit.jsx');


// Customer.Routes = (
//   <Route name="preliminary.customer" path="customer" handler={Customer.Index}>
//     <Router.DefaultRoute name="preliminary.customer.list" path="customer-list" handler={Customer.List}/>
//     <Route name="preliminary.customer.edit" path="edit/:id" handler={Customer.Edit}/>
//   </Route>
// );

module.exports = Customer;
