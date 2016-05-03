var React         = require('react');
var Reflux        = require('reflux');

var Router        = require('react-router');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var DialogW        = widgets.Dialog;
var Toaster       = widgets.Toaster;

var TopPanel      = require('./top-panel.jsx');
var ModulePanel   = require('./module-panel.jsx');
var MenuPanel     = require('./menu-panel.jsx');
var InfoPanel     = require('./info-panel.jsx');
var PageHeaderPanel = require('./page-header-panel.jsx');

var dialogActions = system.dialogActions;
var infoPanelActions = system.infoPanelActions;

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

// var Manager       = require('../manager/app.jsx');
// var Finance       = require('../finance/app.jsx');
// var Pos           = require('../pos/app.jsx');
// var Installment   = require('../installment/app.jsx');
// var Stock         = require('../stock/app.jsx');
// var Setting       = require('../setting/app.jsx');
// var Info          = require('../info/app.jsx');
// var Preliminary   = require('../preliminary/app.jsx');
// var Report   = require('../report/app.jsx');
// var Manager   = require('../manager/app.jsx');

////////////////////////////////////////////////////////////
// DO NOT REMOVE FOLLOWING CODE
////////////////////////////////////////////////////////////
var sessionActions  = system.sessionActions;
var sessionStore    = system.sessionStore;
var ajaxStore       = system.ajaxStore;
var systemActions   = system.systemActions;
var systemStore     = system.systemStore;

////////////////////////////////////////////////////////////

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


var App = React.createClass({
  mixins: [
    Reflux.listenTo(systemActions.setTheme, 'onSetThemeAction'),
    Reflux.listenTo(systemActions.getMaster.done, 'onGetMasterDoneAction'),
    Reflux.listenTo(systemActions.requestSignOut, 'onRequestSignOutAction'),
    Reflux.listenTo(systemActions.signout.done, 'onSignoutDoneAction'),
    Reflux.listenTo(systemActions.ping.done, 'onPingDoneAction'),
    Reflux.listenTo(infoPanelActions.show, 'onInfoPanelShowAction'),
    Reflux.listenTo(infoPanelActions.hide, 'onInfoPanelHideAction'),
    Reflux.listenTo(sessionActions.load.done, 'onSessionLoadDoneAction')
  ],
  childContextTypes : {
    muiTheme: React.PropTypes.object,
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
    };
  },

  getInitialState: function() {
    return {
      theme:1,
      isShow:false,
      sessionReady: false,
      masterReady: false,
      sessionID:null
    };
  },

  oniniModuleDoneAction: function(start){
    this.props.history.pushState(null, start.code);
    this.handleMenuClick({ stopPropagation:function(){} }, start);
  },

  componentDidMount: function() {
    sessionActions.load();
    $('.app.dimmer').transition('hide');
  },

  onSignoutDoneAction: function() {
    window.location.href='/signin';
  },

  onSetThemeAction: function(theme) {
    this.setState({theme:theme});
  },

  onSessionLoadDoneAction: function(session) {
    this.setState({
      sessionID: session.sessionID,
      sessionReady: true
    });
    systemActions.getMaster();
    setInterval(function() {
      this.ping();
    }.bind(this), 15000);
  },

  onGetMasterDoneAction: function(data, start) {
    this.setState({
      masterReady: true
    });
  },

  onRequestSignOutAction: function() {
    this.handleOpen();
    // dialogActions.show({
    //   title:'dialog.title.confirm_to_signout',
    //   content:'ยืนยันการออกจากระบบ',
    //   actions:[ 
    //     {id:'confirm', icon:'check52', label:'dialog.confirm'},
    //     {id:'cancel', icon:'close47', label:'dialog.cancel', default:true}
    //   ]
    // }, function(isCancel, id) {
    //   if (isCancel==true || id=='cancel') {
    //     return;
    //   }
    //   
    // });

  },
  handleOpen: function() {
    this.setState({open: true});
  },

  handleClose: function(){
    this.setState({open: false});
  },
  onInfoPanelShowAction:function(backRouteName, content) {
    this.setState({
      isShow:true,
    });
  },

  onInfoPanelHideAction:function(content) {
    this.setState({
      isShow:false,
    });
  },

  onPingDoneAction: function(sessionID) {
//    console.log(this.state.sessionID, sessionID);
    if (this.state.sessionID != sessionID) {
      console.log('FORCE SIGNOUT');
      systemActions.signout.done();
    }
  },

  handleOnBodyClick: function(e) {
    systemActions.bodyClick();
  },

  ping: function() {
    systemActions.ping();
  },

  render: function() {

    var actions = [
      <FlatButton
        label={tr.translate('dialog.cancel')}
        primary={true}
        onClick={this.handleClose} />,
      <FlatButton
        label={tr.translate('dialog.confirm')}
        onClick={(function(){
          systemActions.signout();
        })} />,
    ];

    return (
      <div id="body" onClick={this.handleOnBodyClick} className={(this.state.isShow?'extend':'')+' layout-panel'}>
        <div className="ui active dimmer app">
          <div className="ui indeterminate text loader">Please wait...</div>
        </div>
        <TopPanel/>
        <MenuPanel/>
        <div id="content-panel">
          <div id="inner-content">
            <PageHeaderPanel/>
            {this.state.sessionReady && this.state.masterReady ? this.props.children : null}
          </div>
          <InfoPanel/>
          <Toaster/>
        </div>
        <div>
          <DialogW/>
        </div>
        <div>
          <Dialog
            title={tr.translate('dialog.title.confirm_to_signout')}
            actions={actions}
            open={this.state.open}>{tr.translate('dialog.title.confirm_to_exit')}</Dialog>
        </div>
      </div>
    );
  }
});

module.exports = App
