var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions; //require('../../system/actions');

var shopActions   = require('./actions');
var shopStore     = require('./store');

var Shop = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


Shop.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('shop.title.index'));
  },
  render: function() {
    return this.props.children
  }
});

// return (
//       <Router.RouteHandler/>
//     );
// Shop.List = require('./shop-list.jsx');
// Shop.Edit = require('./shop-edit.jsx');


// Shop.Routes = (
//   <Route name="setting.shop" path="shop" handler={Shop.Index}>
//     <Router.DefaultRoute name="setting.shop.list" handler={Shop.List}/>
//     <Route name="setting.shop.edit" path=":id" handler={Shop.Edit}/>
//   </Route>
// );

module.exports = Shop;
