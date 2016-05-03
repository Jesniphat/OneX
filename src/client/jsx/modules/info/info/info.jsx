var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');

var systemActions = system.systemActions;
/*
var infoActions = require('./actions');
var infoStore   = require('./store');
*/
var Info      = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

Info.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('info.title.index'));
  },
  render: function() {
    return (
      <Router.RouteHandler/>
    );
  }
});

// Info.Totalinfo = require('./total.jsx');
// Info.Stockinfo = require('./stock.jsx');
// Info.Stockininfo = require('./stockin.jsx');
//Info.Aginginfo = require('./aging.jsx');
// Info.Transferinfo = require('./transfer.jsx');
// Info.Selldetailinfo = require('./selldetail.jsx');
// Info.Returninfo = require('./return.jsx');


// Info.Routes = (
//   <Route name="info.info" path="info" handler={Info.Index}>
//     <Router.DefaultRoute name="info.info.aging" handler={require('./aging.jsx')}/>
//     <Route name="info.info.total" path="total" handler={require('./total.jsx')}/>
//     <Route name="info.info.stock" path="stock" handler={ require('./stock.jsx')}/>
//     <Route name="info.info.stockin" path="stockin" handler={ require('./stockin.jsx')}/>
//     <Route name="info.info.transfer" path="transfer" handler={ require('./transfer.jsx')}/>
//     <Route name="info.info.selldetail" path="selldetail" handler={ require('./selldetail.jsx')}/>
//     <Route name="info.info.return" path="return" handler={ require('./return.jsx')}/>
//   </Route>
// );


// Info.Routes = [
//     <Route name="info.aging" path="aging/:id?" handler={require('./aging.jsx')}/>,
//     <Route name="info.total" path="total" handler={require('./total.jsx')}/>,
//     <Route name="info.stock" path="stock" handler={ require('./stock.jsx')}/>,
//     <Route name="info.stockin" path="stockin" handler={ require('./stockin.jsx')}/>,
//     <Route name="info.transfer" path="transfer" handler={ require('./transfer.jsx')}/>,
//     <Route name="info.selldetail" path="selldetail" handler={ require('./selldetail.jsx')}/>,
//     <Route name="info.return" path="return" handler={ require('./return.jsx')}/>
// ];

module.exports = Info;
