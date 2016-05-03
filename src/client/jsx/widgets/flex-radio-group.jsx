var React = require('react');
var cn    = require('classnames');
var T     = require('react-translate-component');

var FlexRadioGroup = React.createClass({
  handleChange:function(e) {
    if (typeof this.props.onChange==='function') {
      this.props.onChange(this.props.field.id, e.target.value);
    }
  },

  render:function() {
    var field = this.props.field;
    var list = field.list.map(function(item) {
      var id = field.id + '_' + item.value;
      var chk = false;
      if (field.id.indexOf('.')>0) {
        var tmp = field.id.split('.');
        if (tmp.length > 1) {
          chk = this.props.data[tmp[0]][tmp[1]]==item.value;
        }
      } else {
        chk = this.props.data[field.id]==item.value;
      }

      return (
        <div key={item.value} className={this.props.itemClassName}>
          <input
            type="radio"
            name={field.id}
            id={id}
            checked={chk}
            value={item.value}
            onChange={this.handleChange}
            />
          {field.raw ? <label htmlFor={id} className="label">{item.text}</label> : <T content={item.text} component="label" className="label" htmlFor={id}/>}
        </div>
      );
    }.bind(this));
    return (
      <div className={'flex-radio-group'+(this.props.className ? ' '+this.props.className : '')}>
        {list}
        {field.label ? <T content={field.label} component="label" className="label"/> : null}
      </div>
    )
  }
});

module.exports = FlexRadioGroup;
