var React       = require('react');
var cn          = require('classnames');
var T           = require('react-translate-component');
var DatePicker  = require('react-datepicker');
var moment      = require('moment');

var FlexTextInput = React.createClass({
  getDefaultProps: function() {
    return {
      type:'text',
      autoSelect:true
    }
  },

  _getValue: function(props) {
    var value = '';
    if (props.field && props.field.id) {
      var tmp = props.field.id.split('.');
      value = props.data[tmp[0]];
      for (var i = 1; i < tmp.length; i++) {
        value = value[tmp[i]];
      }
    }
    return value;
  },

  getInitialState: function() {
    return {
      gotFocus:false,
      value:this._getValue(this.props)
    }
  },

  handleChange:function(e, value, forceUpdate) {
    if (this.props.live || forceUpdate) {
      if (typeof this.props.onChange==='function') {
        value =  value || e.target.value;
        if (this.props.type=='number') {
          value = toNumber(value, 0);
        }
        this.props.onChange(this.props.field.id, value, e);
      }
    } else {
//      console.log('update value', value || e.target.value);
      this.setState({
        value: value || e.target.value
      });
    }
  },

  handleBlur: function(e) {
//    console.log('handleBlur');
    this.setState({
      gotFocus:false
    }, function() {
//      console.log(!!!this.props.live, typeof this.props.onChange==='function', this._getValue(this.props), this.state.value);
      if (!!!this.props.live && typeof this.props.onChange==='function' && this._getValue(this.props) != this.state.value) {
//        console.log('onchange', this.props.field.id, this.state.value);
        this.props.onChange(this.props.field.id, this.state.value, e);
      }
      if (typeof this.props.onBlur==='function') {
        this.props.onBlur(this.props.field.id, e);
      }
    }.bind(this));
  },

  handleFocus:function() {
    this.setState({
      gotFocus:true
    }, function() {
      if (typeof this.props.onFocus==='function') {
        this.props.onFocus(this.props.field.id, e.target.value, e);
      }
      if (this.props.autoSelect){
        setTimeout(function(){
          if(this.state.gotFocus == true){
            this.refs[this.props.field.id].select();
          }
        }.bind(this),100)
      }
    }.bind(this));
  },

  handleKeyUp: function(e) {
    this.setState({ gotRequired:true });
    if (typeof this.props.onKeyUp==='function') {
      this.props.onKeyUp(this.props.field.id, e.target.value, e);
    }
    if (e.keyCode===13) {
      if (typeof this.props.onEnter === 'function') {
        this.props.onEnter(this.props.field.id, e.target.value, e);
      }
    }
  },

  handleKeyDown: function(e) {
    this.setState({ gotRequired:true });
    if (typeof this.props.onKeyDown==='function') {
      this.props.onKeyDown(this.props.field.id, e.target.value, e);
    }
  },

  handleKeyPress: function(e) {
    this.setState({ gotRequired:true });
    if (typeof this.props.onKeyPress==='function') {
      this.props.onKeyPress(this.props.field.id, e.target.value, e);
    }
  },

  setFocus: function() {
    setTimeout(function() {
      this.refs[this.props.field.id].focus();
      this.refs[this.props.field.id].select();
    }.bind(this), 0);
  },

  componentWillReceiveProps: function(nextProps) {
    var value = this._getValue(nextProps);
    if (value != this.state.value) {
      this.state.value = value;
    }
  },

  // shouldComponentUpdate: function(nextProps, nextState) {
  //   // if (nextProps==this.props) {
  //   //   return false;
  //   // }
  //   // console.log('should', this.state.value);
  //   var value = this._getValue(nextProps);
  //   if (value != this.state.value) {
  //     this.state.value = value;
  //   }
  //
  //   // if (nextProps.data
  //   //   && nextProps.field
  //   //   && nextProps.field.id) {
  //   //
  //   //   var value = null;
  //   //   var value2 = null;
  //   //
  //   //   if (nextProps.field.id) {
  //   //     if (nextProps.field.id.indexOf('.')>0) {
  //   //       var tmp = nextProps.field.id.split('.');
  //   //       value = nextProps.data[tmp[0]][tmp[1]];
  //   //       value2 = this.props.data[tmp[0]][tmp[1]];
  //   //       if (value == value2) {
  //   //         return false;
  //   //       }
  //   //     } else {
  //   //       if (nextProps.data[nextProps.field.id] == this.props.data[nextProps.field.id]) {
  //   //         return false;
  //   //       }
  //   //     }
  //   //   }
  //   // }
  //
  //   return true;
  // },

  render:function() {
    var field = this.props.field || {};
    var value = this.state.value;
    
    field.type = field.type || 'text';

    var props = {
      type: field.type=='numberinput' ? 'number' : (field.type=='number' ? 'text' : field.type),
      id: field.id,
      ref: field.id,
      value: field.readonly && typeof field.render==='function' ? field.render(this.props.data) : value,
      disabled: field.readonly,
      className: 'input-text',
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      required: field.required,
      maxLength: field.maxLength,
      tabIndex: field.tabIndex,
      pattern: field.pattern,
      autoFocus: field.autofocus,
      autoComplete: false,
      readOnly: field.readonly,
      onKeyUp: this.handleKeyUp,
      onKeyDown: this.handleKeyDown,
      onKeyPress: this.handleKeyPress,
      autoSelect: this.autoSelect || true,
      step: field.step
    }
    if (field.type=='numberinput') {
      if (typeof field.min == 'number') {
        props.min = field.min;
      }
      if (typeof field.max == 'number') {
        props.max = field.max;
      }
    }
    if (field.type=='number') {
      if (this.state.gotFocus) {
//        console.log('value=', props.value);
//        props.value = (''+props.value).replace(/[^\d\.]/, '');
      } else {
        value = toNumber(value, 0);
        props.value = numberFormat(value, this.props.digit || 2);
      }
    }
    var style = {};
    if (field.width) {
      style.width = field.width+'px';
    }
    return (
      <div className={cn('field', {noicon:!field.icon, readonly:field.readonly, disabled:field.disabled, required:field.required, number:field.type.substr(0,6)=='number'})} style={style}>
        {field.icon ? <span className={'flaticon-'+field.icon+' icon-small field-icon'}></span> : null}
        {field.nolabel===true?null:<T content={field.label} component="label" className="label" htmlFor={field.id}/>}
        {field.type=='date' ? (
          <DatePicker
            dateFormat="DD/MM/YYYY"
            selected={moment(value).isValid() ? moment(value) : moment(new Date())}
            onChange={function(date) {this.handleChange(null, date==null ? '' : date.format('YYYY-MM-DD'), true)}.bind(this)}
            />) : <input {...props} /> }
        <span className="flaticon-check52 valid icon-small"></span><span className="flaticon-clear5 invalid icon-small"></span>
      </div>
    );
//

  }
});

var toNumber = function(s, n) {
	if (typeof s==='number') {
		return s;
	}
	var num = 0;
	if (typeof s==='string') {
		s = s.replace(/[^\d\.]/mig, '');
		num = parseFloat(s);
	}
	if (isNaN(num)) {
		if (typeof n == 'number') {
			return n;
		} else {
			return 0;
		}
	}
	return num;
}

var numberFormat = function(number, n, s, c) {
	if (typeof number != 'number') {
		return number;
	}
    var re = '\\d(?=(\\d{3})+' + (n > 0 ? '\\D' : '$') + ')',
        num = number.toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

module.exports = FlexTextInput;
