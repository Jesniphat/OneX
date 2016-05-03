var React = require('react');
var cn    = require('classnames');
var T     = require('react-translate-component');

var FlexButton = React.createClass({
  getInitialState:function() {
    return {
      pressed:false
    };
  },
  handleClick:function(e) {
    e.preventDefault();
    if (this.props.disabled) {
      e.stopPropagation();
      return;
    }
    if (typeof this.props.onClick==='function') {
      this.props.onClick(e.target.value);
    }
  },
  render:function() {
    var field = this.props.field || {};
    var classList = cn('flex-button', 'flex', {
      default:this.props.default,
      disabled:this.props.disabled,
      pressed:this.state.pressed
    });

    return (
      <a href="#"
        className={classList}
        onClick={this.handleClick}
        tabIndex={field.tabIndex}
        type="button"
        style={this.props.label == undefined ? { width: 32, 'margin-left': 21 } : {} }
        >
        <span className={'flaticon-'+this.props.icon+' icon-small'} style={this.props.label == undefined ? { border: 'none' } : {} }></span>
        {this.props.label != undefined ? (<T className="label ellipsis" content={this.props.label}/>): null }
      </a>
    );
  }
});

module.exports = FlexButton;
