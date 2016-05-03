var React   = require('react');
var Router  = require('react-router');
var Link    = Router.Link;
var tr      = require('counterpart');

var FlexIcon = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
//    console.log('handleClick');
    if (typeof this.props.onClick==='function') {
      this.props.onClick(e);
    }
  },
  render: function() {
    var style = {};
    if (this.props.style) {
      style = this.props.style;
    }
    if (this.props.to) {
      return (
        <Link
          to={this.props.to}
          params={this.props.param}
          className="flex-icon"
          title={tr(this.props.title)}
          style={style}
          >
          <span className={'flaticon-' + this.props.icon}></span>
        </Link>
      );
    } else {
      return (
        <a href="#"
          className="flex-icon"
          title={tr(this.props.title)}
          onClick={this.handleClick}
          style={style}
          >
          <span className={'flaticon-' + this.props.icon}></span>
        </a>
      );
    }
  }
})
module.exports = FlexIcon;
