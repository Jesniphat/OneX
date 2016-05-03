var React         = require('react');
var Router        = require('react-router');


var Index = React.createClass({
  render: function() {
    return (
      <div id="signin-app" className="layout-panel box6 flex">
        <div className="box6 content">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Index;
