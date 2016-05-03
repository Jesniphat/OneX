var React   = require('react');

var Index = React.createClass({
  render: function() {
    return (
      <div className="layout-panel"> 
      <div id="signin-app" className="box7 flex">
        <div className="box2 left-side default">
          <div className="wrap">
            <div className="logo"><i>Secure<b>Stock</b></i>&trade;</div>
            <div className="powered">powered by <a href="http://www.ns.co.th/" target="_blank">Nippon Sysits</a></div>
          </div>
        </div>
        <div className="box5 content">
          {this.props.children}
        </div>
      </div>
      </div>
    );
  }
});

module.exports = Index;
