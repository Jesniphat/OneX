var React         = require('react');
var T             = require('react-translate-component');

var ActionButton = React.createClass({
  handleClick: function(e) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e);
    }
  },

  render: function() {
    return (
      <div className="action-button flex" onClick={this.handleClick}>
        <div className={'flaticon-' + this.props.icon + ' icon normal'}></div>
        <T content={this.props.label} component="div" className='text'/>
      </div>
    );
  }
});

module.exports = ActionButton;
