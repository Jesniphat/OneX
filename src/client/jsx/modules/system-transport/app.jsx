var React         = require('react');
var Reflux        = require('reflux');

var Router        = require('react-router');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var DialogW        = widgets.Dialog;
var Toaster       = widgets.Toaster;

// var TopPanel      = require('./top-panel.jsx');
// var ModulePanel   = require('./module-panel.jsx');
// var MenuPanel     = require('./menu-panel.jsx');
// var InfoPanel     = require('./info-panel.jsx');
// var PageHeaderPanel = require('./page-header-panel.jsx');

var dialogActions = system.dialogActions;
var infoPanelActions = system.infoPanelActions;

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import ContentFilter from 'material-ui/lib/svg-icons/content/filter-list';
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

//////////////////////////////////////////////////////////
// DO NOT REMOVE FOLLOWING CODE
//////////////////////////////////////////////////////////
var sessionActions  = system.sessionActions;
var sessionStore    = system.sessionStore;
var ajaxStore       = system.ajaxStore;
var systemActions   = system.systemActions;
var systemStore     = system.systemStore;

// ////////////////////////////////////////////////////////////

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));

//var AppBar            = require('material-ui/lib/app-bar');
//var IconButton        = require('material-ui/lib/icon-button');
//var NavigationClose   = require('material-ui/lib/svg-icons/navigation/close');
//var FlatButton        = require('material-ui/lib/flat-button');

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
   mixins: [
    Reflux.listenTo(systemActions.setTheme, 'onSetThemeAction'),
    Reflux.listenTo(systemActions.getMaster.done, 'onGetMasterDoneAction'),
    Reflux.listenTo(systemActions.requestSignOut, 'onRequestSignOutAction'),
    Reflux.listenTo(systemActions.signout.done, 'onSignoutDoneAction'),
    Reflux.listenTo(systemActions.ping.done, 'onPingDoneAction'),
    Reflux.listenTo(infoPanelActions.show, 'onInfoPanelShowAction'),
    Reflux.listenTo(infoPanelActions.hide, 'onInfoPanelHideAction'),
    Reflux.listenTo(sessionActions.load.done, 'onSessionLoadDoneAction'),
    Reflux.listenTo(systemActions.signoutTransport.done, 'onSignoutTransportDoneAction')
   ],

  getInitialState: function() {
    return {
      theme:1,
      isShow:false,
      sessionReady: false,
      masterReady: false,
      sessionID:null,
      modules:[],
      valueSingle: '1',
      valueMultiple: ['3', '5'],
    };
  },

  componentDidMount: function() {
    console.log("componentDidMount ++");
    sessionActions.load();
  },

  onSignoutDoneAction: function() {
    window.location.href='/signin-transport';
  },

  onSetThemeAction: function(theme) {
    this.setState({theme:theme});
  },

  onSessionLoadDoneAction: function(session) {
    console.log("onSessionLoadDoneAction jessss = ",session);
    this.setState({
      sessionID: session.sessionID,
      sessionReady: true
    });
    systemActions.getMaster();
    setInterval(function() {
      this.ping();
    }.bind(this), 15000);
  },

  onGetMasterDoneAction: function(data) {
    this.setState({
      masterReady: true
    });
  },

  signOut: function() {
    console.log("singOut");
    systemActions.signoutTransport();
  },

  onSignoutTransportDoneAction: function() {
    window.location.href = '/signin-transport';
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
    //   systemActions.signout();
    // });
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
   console.log(this.state.sessionID, sessionID);
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

  clickLink: function() {
    console.log("ClickLink");
  },

//   handleChangeSingle: function(event, value){
//     this.setState({
//       valueSingle: value,
//     });
//   },
//
  handleOpen: function() {
    this.setState({open: true});
  },

  handleClose: function(){
    this.setState({open: false});
  },

  handleChangeMultiple: function(value, event){
    console.log("value = ", value);
    console.log("event = ", event);
    if(value == '1'){
        window.location.href='/booking-transport/#/booking-transport/home';
    }else if(value == '2'){
        window.location.href='/booking-transport/#/booking-transport/booking/booking_new/0';
    }else if(value == '3'){
        window.location.href='/booking-transport/#/booking-transport/customer';
    }
    this.setState({
      valueSingle: value,
    });
  },

  // handleMenuClick: function(item) {
  //   //e.stopPropagation();
  //   this.setState({
  //     isShow: false,
  //     info: {
  //       code: item.code,
  //       name: item.name,
  //       icon: item.icon
  //     }
  //   });
  // },

        // <div className="onex-sidebar" style={{'height':'620px'}}>
        //   <div id='cssmenu'>
        //     <ul>
        //        <li className='active has-sub'>
        //           <Link to={"/transport/home"}>
        //             <div>Home</div>
        //           </Link>
        //        </li>
        //        <li>
        //           <Link to={"/transport/booking"} onClick={this.clickLink}>
        //             <div>Booking</div>
        //           </Link>
        //        </li>
        //        <li>
        //           <Link to={"/transport/customer"}>
        //             <div>Edit Profile</div>
        //           </Link>
        //        </li>
        //     </ul>
        //   </div>
        // </div>

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
      <div id="body-onex">
        <div className="onex-top-bar" style={{paddingTop:'5px',paddingBottom:'5px'}}>
          <div className="onex-top-bar-left" style={{marginLeft:'150px'}}>
            <IconMenu
            iconButtonElement={<IconButton><ContentFilter /></IconButton>}
            value={this.state.valueSingle}
            >
                <MenuItem value="1" primaryText="Home" onClick={this.handleChangeMultiple.bind(this, "1")}/>
                <MenuItem value="2" primaryText="Booking" onClick={this.handleChangeMultiple.bind(this, "2")}/>
                <MenuItem value="3" primaryText="Edit Profile" onClick={this.handleChangeMultiple.bind(this, "3")}/>
            </IconMenu>
          </div>

          <div className="top-bar-right">
            <ul className="menu">
              <li><div className="space" style={{paddingTop:'16px',paddingRight:'39px'}}><a href="#" onClick={this.signOut}><u>Sign out</u></a></div></li>
            </ul>
          </div>
        </div>

        <div className="onex-content" style={{margin:'auto'}}>
          <div className="set-content" style={{height:'580px',margin:'auto'}}>
            <div id="content-panel-front" style={{'height':'620px'}}>
              <div id="inner-content" style={{'height':'618px'}}>
                {this.state.sessionReady && this.state.masterReady ? this.props.children : null}
              </div>
              <Toaster/>
            </div>
          </div>
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

// var Profile = require('./profile/profile.jsx');



// var routes = (
//   <Route name="app" path="/" handler={App.Index}>
//     {Finance.Routes}
//     {Pos.Routes}
//     {Installment.Routes}
//     {Stock.Routes}
//     {Setting.Routes}
//     {Profile.Routes}
//     {Info.Routes}
//     {Preliminary.Routes}
//     {Report.Routes}
//     {Manager.Routes}
//   </Route>
// );

module.exports = App
