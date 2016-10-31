var React         = require('react');
var Router        = require('react-router');


var Index = React.createClass({
  render: function() {
    return (
      <div className="layout-panel box6 flex">
        <div id="signin-app" className="box6 content" style={{ paddingTop: 40, height: 240 }}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Index;
