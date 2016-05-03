var React         = require('react');
var Router        = require('react-router');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');

var customerActions  = require('./actions');
var customerStore    = require('./store');

var NewCustomer = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


NewCustomer.Index = React.createClass({
  componentDidMount: function() {
    //systemActions.setPageHeader('');
  },

  render: function() {
    return this.props.children
  }
});

// NewCustomer.New = require('./customer-new.jsx');

// NewCustomer.Routes = (
//   <Route name="newcustomer.customer" path="add_customer/edit/:id?" handler={NewCustomer.Index}>
//     <Router.DefaultRoute name="newcustomer.customer.new" handler={NewCustomer.New}/>
//   </Route>
// );

module.exports = NewCustomer;
