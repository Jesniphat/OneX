var React         = require('react');
var Reflux        = require('reflux');

var system        = require('ss-system');
var systemActions = system.systemActions; //require('./actions');


var PageHeaderPanel = React.createClass({
  mixins:[
    Reflux.listenTo(systemActions.setPageHeader, 'onSetPageHeaderAction')
  ],

  getInitialState: function() {
    return {
      title:null,
      items:[]
    };
  },

  onSetPageHeaderAction: function(title) {
    this.setState({
      title:title
    });
  },

  render: function() {
    var title = null;
    if (this.state.title) {
      title = (
        <h1>{this.state.title}</h1>
      );
    }
    return (
      <div className="content-header">
        <div className="panelf">{title}</div>
      </div>
    );
  }
});

module.exports = PageHeaderPanel;
