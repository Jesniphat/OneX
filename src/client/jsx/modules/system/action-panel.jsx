var React         = require('react');
var Reflux        = require('reflux');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var actionPanelActions = system.actionPanelActions; //require('./actions/action-panel');
var dialogActions = system.dialogActions; // require('./actions/dialog');
var systemActions = system.systemActions; //require('./actions');
var ActionButton  = widgets.ActionButton; //require('../../widgets/action-button.jsx');

var ActionPanel = React.createClass({
  mixins: [
    Reflux.listenTo(actionPanelActions.setShortcut, 'onSetShortcutAction'),
    Reflux.listenTo(actionPanelActions.setMain, 'onSetMainAction'),
    Reflux.listenTo(actionPanelActions.setSpecial, 'onSetSpecialAction'),
    Reflux.listenTo(systemActions.signout.done, 'onSignoutDoneAction')
  ],

  getInitialState: function() {
    return {
      shortcut:[],
      main:[],
      special:[]
    };
  },

  handleSignOut: function() {
    dialogActions.show({
      title:'dialog.title.confirm_to_signout',
      content:'ยืนยันการออกจากระบบ',
      actions:[
        {id:'confirm', icon:'check52', label:'dialog.confirm'},
        {id:'cancel', icon:'close47', label:'dialog.cancel', default:true}
      ]
    }, function(isCancel, id) {
      if (isCancel==true || id=='cancel') {
        return;
      }
      systemActions.signout();
    });
  },

  _genActionButton: function(list) {
    return list.map(function(item) {
      return (<ActionButton icon={item.icon} label={item.label} onClick={item.onClick}/>);
    });
  },

  onSignoutDoneAction: function() {
    window.location.href = '/signin';
  },

  onSetShortcutAction: function(list) {
    this.setState({
      shortcut: list
    });
  },

  onSetMainAction: function(list) {
    this.setState({
      main: list
    });
  },

  onSetSpecialAction: function(list) {
    this.setState({
      special: list
    });
  },
  // <div className="shortcut-actions">
  //   <div className="flex">
  //     {this._genActionButton(this.state.shortcut)}
  //   </div>
  // </div>
  // <div className="flex box6">
  //   <div className="panel6 flex">
  //     {this._genActionButton(this.state.main)}
  //   </div>
  // </div>
  // <div className="flex box3">
  //   <div className="panel3 flex">
  //     {this._genActionButton(this.state.special)}
  //   </div>
  // </div>
  render: function() {
    return (
      <div id="action-panel" className="flex">
        <div className="flex box1">
          <div className="panel1 flex">
            <ActionButton icon="exit13" label="logout" onClick={this.handleSignOut}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ActionPanel;
