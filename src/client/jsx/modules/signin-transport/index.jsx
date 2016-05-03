var React         = require('react');
var Router        = require('react-router');


var Index = React.createClass({
  render: function() {
    return this.props.children;
  }
});

module.exports = Index;
