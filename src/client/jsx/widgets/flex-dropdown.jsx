var React = require('react');
var cn    = require('classnames');
var T     = require('react-translate-component');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.data[this.props.field.id]
    };
  },

  handleChange: function(e) {
    this.setState({value:e.target.value});
    if (typeof this.props.onChange==='function') {
      this.props.onChange(this.props.field.id, e.target.value);
    }
  },

  // shouldComponentUpdate: function(nextProps, nextState) {
  //   if (nextProps.data
  //     && nextProps.field
  //     && nextProps.field.id
  //     && nextProps.data[nextProps.field.id]==this.props.data[this.props.field.id]
  //     && JSON.stringify(nextProps.field.list)==JSON.stringify(this.props.field.list)
  //   ) {
  //     return false;
  //   }
  //   return true;
  // },

  render: function() {
    var field = this.props.field || {};
    var attrs = {};

    field.icon = field.icon || 'round52';
    field.list = field.list || [];
    var optionList = field.list.map(function(item) {
      return (<option key={item.value} value={item.value}>{item.text}</option>);
    });

    return (
      <div className={cn('field', {readonly:field.readonly, disabled:field.disabled, required:field.required})}>
        <span className={'flaticon-'+field.icon+' icon-small field-icon'}></span>
        <label className="label" htmlFor={field.id}><T content={field.label}/></label>
        <select
          id={field.id}
          ref={field.id}
          value={this.props.data[this.props.field.id]}
          className="dropdown"
          onChange={this.handleChange}
          required={field.required}
          tabIndex={field.tabIndex}
          autoFocus={field.autofocus}
          disabled={field.disabled ? "disabled" : null }
          >
          {optionList}
        </select>
      </div>
    );
  }
});
