var React   = require('react');
var Reflux  = require('reflux');
var T       = require('react-translate-component');


var FlexTab = React.createClass({
  handleClick: function(e, id) {
    e.preventDefault();
    if (typeof this.props.onClick == 'function') {
      this.props.onClick(id);
    }
  },
  render: function() {
    var tabs = this.props.list.map(function(item) {
      return (
        <li key={item.id}>
          <a href="#" className={'tab flex'+(item.id==this.props.selected?' active':'')} onClick={function(e) {this.handleClick(e, item.id)}.bind(this)}>
            <div className={'flaticon-'+item.icon+' icon'}></div>
            {item.raw ? (<div className="text ellipsis">{item.text}</div>) : (<T content={item.text} component="div" className="text ellipsis"/>)}
          </a>
        </li>
      );
    }.bind(this));
    return (
      <ul className="flex-tab">
        {tabs}
      </ul>
    );
  }
});

module.exports = FlexTab;
