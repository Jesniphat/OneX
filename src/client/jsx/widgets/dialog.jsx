var React         = require('react');
var Reflux        = require('reflux');
var T             = require('react-translate-component');
var $             = require('jquery');

var dialogActions = require('ss-system').dialogActions;

var FlexButton    = require('./flex-button.jsx');

var Dialog = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [
    Reflux.listenTo(dialogActions.show, 'onShowAction'),
    Reflux.listenTo(dialogActions.update,'onUpdateAction')
  ],

  getInitialState: function() {
    return {
      isShow: false,
      title:null,
      content:null,
      actions:[],
      cb: null
    }
  },

  componentDidMount: function() {
    $('.flex-button .default').focus();
  },

  onShowAction: function(options, cb) {

    console.log('options:',options);
    var opt = {
      isShow:true
    };
    if (options.title) {
      opt.title = options.title;
    }
    if (options.content) {
      opt.content = options.content;
    }
    if (options.actions) {
      opt.actions = options.actions;
    }
    if (typeof cb === 'function') {
      opt.cb = cb;
    }
    this.setState(opt);
  },

  onUpdateAction: function(content){
    this.setState({
      content: content
    });
    this.setState(this.state);
  },

  closeDialog: function(isCancel, id) {
    dialogActions.close(isCancel);
    this.setState({
      isShow:false
    });
    if (typeof this.state.cb === 'function') {
      this.state.cb(isCancel, id);
    }
  },

  handleButtonClick: function(action) {
    if (typeof action.onClick==='function') {
      action.onClick().then(function(result) {
        if (result === false) {
          console.log('NOT CLOSE DIALOG');
        } else {
          this.closeDialog(false, action.id);
        }
      })
    } else {
      this.closeDialog(false, action.id);
    }
  },

  render: function() {
    var actions = this.state.actions.map(function(action) {
      action.icon = action.icon || 'check52';
      return (
        <div key={action.id} className="button">
          <FlexButton icon={action.icon} label={action.label} default={action.default} onClick={
              function() {
                this.handleButtonClick(action);
              }.bind(this)
            }/>
        </div>
      );
    }.bind(this));

    return (
      <div className={'dialog-screen'+(this.state.isShow?' show':'')}>
        <div className="dialog">
          <div className="title flex">
            <T content={this.state.title} component="div" className="text ellipsis"/>
            <a href="#" onClick={function(e) {e.preventDefault(); this.closeDialog(true)}.bind(this)} className="close flaticon-close47">
            </a>
          </div>
          <div className="content">
            {this.state.content}
          </div>
          <div className="actions flex">
            {actions}
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Dialog;
