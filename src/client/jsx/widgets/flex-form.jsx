var React           = require('react');
var ReactDOM        = require('react-dom');
var $               = require('jquery');

var FlexForm = React.createClass({
  getInitialState:function() {
    var formId = this.props.id || 'form_' + parseInt(Math.random()*10000000);
    var state = {
      id:formId,
      data:{},
    };
    var max = -1;
    for(var i in this.props.fields) {
      if (this.props.fields[i].tabIndex > max) {
        max = this.props.fields[i].tabIndex;
      }
    }
    state.lastTabIndex = max;
    return state;
  },

  handleKeyUp: function(e) {
    var $target;
    var nextIndex;

    if (e.keyCode==16) {
      this.isShift=false;
    }

    if (e.keyCode==13 && e.target.type=='button') {
      return;
    }

    if ((e.keyCode==13 && this.isShift !== true) || e.keyCode==40) {
      if (e.target.tabIndex >= this.state.lastTabIndex) {
        nextIndex = 1;
      } else {
        nextIndex = e.target.tabIndex+1;
      }

      $target = $('#' + this.state.id + ' [tabindex=' + nextIndex + ']');

      if ($target.length==0) {
        return;
      }

      $target.focus();
    } else if ((e.keyCode==13 && this.isShift === true) || e.keyCode == 38) {
      if (e.target.tabIndex <= 1) {
        nextIndex = this.state.lastTabIndex;
      } else {
        nextIndex = e.target.tabIndex - 1;
      }

      $target = $('#' + this.state.id + ' [tabindex=' + nextIndex + ']');

      if ($target.length==0) {
        return;
      }
      $target.focus();
    }
  },

  handleKeyDown:function(e) {
    if (e.keyCode==16) { // SHIFT
      this.isShift = true//shift
    }
  },

  handleChange: function(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e);
    }
  },

  isValid: function() {
    var form = ReactDOM.findDOMNode(this.refs[this.state.id]);
    return form.checkValidity();
  },

  render: function() {
    var props = {
      id: this.state.id,
      ref: this.state.id,
      method: 'post',
      className: 'flex-form',
      onKeyDown: this.handleKeyDown,
      onKeyUp: this.handleKeyUp,
      onChange: this.handleChange
    };

    return (
      <form {...props}>
        {this.props.children}
      </form>
    )
  }
});

module.exports = FlexForm;
