var React       = require('react');
var cn          = require('classnames');
var T           = require('react-translate-component');
var DatePicker  = require('react-datepicker');
var moment      = require('moment');

var FlexInputRange = React.createClass({
  getInitialState: function() {
    return {}
  },

  handleChange: function(id, value) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.props['id_'+id], value);
    }
  },
  handleKeyUp: function(id, e) {
    if (typeof this.props.onKeyUp==='function') {
      this.props.onKeyUp(this.props.field.id, e.target.value, e);
    }
    if (e.keyCode===13) {
      if (typeof this.props.onEnter === 'function') {
        this.props.onEnter(this.props.field.id, e.target.value, e);
      }
    }
  },
  render: function() {
    return (
      <div className="flex-input-range">
        <div className="flex inner">
          {
            this.props.type=='date' ?
            <DatePicker
              dateFormat="DD/MM/YYYY"
              selected={moment(this.props.data_from).isValid() ? moment(this.props.data_from) : ''}
              onChange={function(date) {this.handleChange('from', date==null ? '' : date.format('YYYY-MM-DD'))}.bind(this)}
              onKeyDown={function(e) {this.handleKeyUp('from', e)}.bind(this)}
              /> :
            <input
              type={'text'}
              onChange={function(e) {this.handleChange('from', e.target.value)}.bind(this)}
              onKeyDown={function(e) {this.handleKeyUp('from', e)}.bind(this)}
              value={this.props.data_from}
              />
          }
          <span className="separater">-</span>
          {
            this.props.type=='date' ?
            <DatePicker
              dateFormat="DD/MM/YYYY"
              selected={moment(this.props.data_to).isValid() ? moment(this.props.data_to) : ''}
              onChange={function(date) {this.handleChange('to', date==null ? '' : date.format('YYYY-MM-DD'))}.bind(this)}
              onKeyDown={function(e) {this.handleKeyUp('to', e)}.bind(this)}
              /> :
            <input
              type={'text'}
              onChange={function(e) {this.handleChange('to', e.target.value)}.bind(this)}
              onKeyDown={function(e) {this.handleKeyUp('to', e)}.bind(this)}
              value={this.props.data_to}
              />
          }
          {this.props.label ? <T content={this.props.label} component="label" /> : null}
        </div>
      </div>
    )
  }
});

module.exports = FlexInputRange;
