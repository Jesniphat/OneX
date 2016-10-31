var React           = require('react');
var Reflux          = require('reflux');

var ModulePanel     = require('./module-panel.jsx');
var ShopInfo        = require('./shop-info.jsx');
var AjaxInfo        = require('./ajax-info.jsx');
var PeriodInfo      = require('./period-info.jsx');
var UserPanel       = require('./user-panel.jsx');
var IDCardInfo      = require('./idcard-info.jsx');
var PrinterInfo     = require('./printer-info.jsx');

var TopPanel = React.createClass({
  render: function() {
    return (
      <div id="top-panel">
        <div className="logo" style={{ fontSize: '26px', lineHeight: '37px', padding: '0px 68px 0px 29px' }}>
          <i><b>One</b>Express</i><sup style={{ fontSize: 16 }}>&trade;</sup>
        </div>
        <ModulePanel/>
        <div id="system-tray-panel">
          <div className="inner">
            <ShopInfo/>
            <PeriodInfo/>
            <div id="status-panel" className="flex">
              <PrinterInfo/>
              <IDCardInfo/>
              <AjaxInfo/>
            </div>
          </div>
        </div>
        <UserPanel/>
      </div>
    );
  }
});

module.exports = TopPanel;
