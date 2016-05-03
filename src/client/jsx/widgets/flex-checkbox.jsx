var React = require('react');
var cn    = require('classnames');
var T     = require('react-translate-component');

var FlexCheckbox = React.createClass({
  handleChange:function(e) {
    if (typeof this.props.onChange==='function') {
      this.props.onChange(this.props.field.id, e.target.checked);
    }
  },

  render:function() {
    var field = this.props.field;
    var attrs = {};
    field.icon = field.icon || 'round52';
    return (
      <div className={cn('field', {readonly:field.readonly, disabled:field.disabled, required:field.required})}>
        <input
          type="checkbox"
          id={field.id}
          ref={field.id}
          checked={this.props.data[this.props.field.id]}
          className="checkbox"
          onChange={this.handleChange}
          tabIndex={field.tabIndex}
          />
        <span className="flaticon-blank31 icon-small unchecked"></span>
        <span className="flaticon-black399 icon-small checked"></span>
        {field.raw ? <label htmlFor={field.id} className="label">{field.label}</label> : <T content={field.label} component="label" className="label" htmlFor={field.id}/>}
      </div>
    );
  }
});

module.exports = FlexCheckbox;
