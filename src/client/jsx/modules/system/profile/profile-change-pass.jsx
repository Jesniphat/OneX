var React         = require('react');
var Reflux        = require('reflux');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var systemActions = system.systemActions;
var infoPanelActions = system.infoPanelActions;
var helper        = system.helper;
var dialogActions = system.dialogActions;
var toasterActions = system.toasterActions;

var profileActions  = require('./actions');
var profileStore    = require('./store');

var FlexForm      = widgets.FlexForm;
var FlexIcon      = widgets.FlexIcon;
var FlexTextInput = widgets.FlexTextInput;
var FlexDropdown  = widgets.FlexDropdown;
var FlexButton    = widgets.FlexButton;

var resetData = {
  id:0,
  user:'',
  display_name:'',
  email:'',
  mobile:'',
  department_id:0,
  shop_id:0,
  pass:'',
  pass2:''
};

var ChangePass = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(profileActions.changePass.done, 'onChangePassDoneAction'),
    Reflux.listenTo(profileActions.changePass.error, 'onChangePassErrorAction')
  ],

  getInitialState: function() {
    return {
      old_pass:'',
      new_pass:'',
      new_pass2:''
    }
  },

  handleChange:function(id, value) {
    var obj = {};
    obj[id] = value;
    this.setState(obj);
  },

  doChangePass: function() {
    console.log('doChangePass');
    // check required
    var err = [];
    if (this.state.old_pass=='') {
      err.push('system.profile.change_pass.error.old_pass_required');
    }
    if (this.state.new_pass.length < 4) {
      err.push('system.profile.change_pass.error.new_pass_length');
    }
    if (this.state.new_pass != this.state.new_pass2) {
      err.push('system.profile.change_pass.error.new_pass_mismatch');
    }
    if (err.length > 0) {
      err.forEach(function(e) {
        toasterActions.pop({
          type:'warning',
          message:tr.translate(e)
        });
      });
      return;
    }
    profileActions.changePass({
      old_pass:this.state.old_pass,
      new_pass:this.state.new_pass
    });
  },

  onChangePassDoneAction: function(result) {
    toasterActions.pop({
      type:'success',
      message:tr.translate('system.profile.change_pass.success')
    });
    this.setState({
      old_pass:'',
      new_pass:'',
      new_pass2:''
    });
  },

  onChangePassErrorAction: function(result) {
    toasterActions.pop({
      type:'warning',
      message:tr.translate('system.profile.change_pass.not_sucess')
    });
  },

  render: function() {
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="system.profile.change_pass.title" component="h2" />
          </div>
          <div className="boxf flex no-shrink">
            <div className="panel2 no-shrink">
              <FlexButton
                label="action.confirm"
                field={{id:'save'}}
                icon="save20"
                default={true}
                onClick={this.doChangePass}
                />
            </div>
          </div>
        </div>
        <div className="content-body boxf flex-form">
          <div className="panel4">
            <FlexTextInput
              field={{
                id:'old_pass',
                type:'password',
                label:'system.profile.change_pass.old_pass',
                required:true,
                pattern:'^.{4,}$'
              }}
              data={this.state}
              onChange={this.handleChange}
              />
            <FlexTextInput
              field={{
                id:'new_pass',
                type:'password',
                label:'system.profile.change_pass.new_pass',
                required:true,
                pattern:'^.{4,}$'
              }}
              data={this.state}
              onChange={this.handleChange}
              />
            <FlexTextInput
              field={{
                id:'new_pass2',
                type:'password',
                label:'system.profile.change_pass.new_pass2',
                required:true,
                pattern:'^.{4,}$'
              }}
              data={this.state}
              onChange={this.handleChange}
              />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ChangePass;
