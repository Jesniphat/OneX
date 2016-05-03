var React           = require('react');
var Reflux          = require('reflux');
var q               = require('q');
var tr              = require('counterpart');
var Router          = require('react-router');
var Link            = Router.Link;
var T               = require('react-translate-component');

var system          = require('ss-system');
var widgets         = require('ss-widget');

var sessionStore    = system.sessionStore; // require('./stores/session');
var systemActions   = system.systemActions; //require('./actions');
var dialogActions   = system.dialogActions;
var toasterActions  = system.toasterActions;

var FlexTextInput   = widgets.FlexTextInput;

var UserPanel = React.createClass({
  mixins: [
    Reflux.listenTo(systemActions.bodyClick, 'onBodyClickAction'),
    Reflux.listenTo(sessionStore, 'onSessionLoadedAction')
  ],

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      display_name: 'SS สมศักดิ์ แซ่ลิ้ม',
      photo: 'img/photo.jpg',
      isShow:false,
      data: {
        old_pass:'',
        new_pass:'',
        new_pass2:''
      }
    };
  },

  onSessionLoadedAction: function(session) {
    this.setState({
      display_name: session.staff.display_name
    });
  },

  onBodyClickAction: function() {
    this.setState({
      isShow: false
    });
  },

  onToggleModuleMenu: function(e) {
    e.stopPropagation();
    this.setState({
      isShow: !this.state.isShow
    });
  },

  handleMenuClick: function(e, item) {
    e.stopPropagation();
    e.preventDefault();
    if (item === 'signout') {
      systemActions.requestSignOut();
    } else if (item === 'change_pass') {
      this.context.router.transitionTo('system.profile.change_pass');
    }
    this.setState({
      isShow: false,
    });
  },

  handleChange: function(id, value) {
    console.log('handleChange', id, value);
    this.state.data[id] = value;
    this.setState({
      data: this.state.data
    });
  },


  render: function() {
    return (
      <div id="user-panel">
        <div className="inner" onClick={this.onToggleModuleMenu}>
          <div className="name ellipsis">{this.state.display_name}</div>
          <img src="img/photo.jpg" className="photo"/>
        </div>
        <div id="user-menu" className={this.state.isShow ? 'show' :null}>
          <div className="inner">
            <ul>
              <li key="changePass">
                <a href="#" onClick={function(e) {this.handleMenuClick(e, 'change_pass')}.bind(this)}>
                  <div className={'flaticon-locked58 small icon'}></div>
                  <T content="user.changePass" className="text ellipsis" component="div"/>
                </a>
              </li>
              <li key="signout">
                <a href="#" onClick={function(e) {this.handleMenuClick(e, 'signout')}.bind(this)}>
                  <div className={'flaticon-exit13 small icon'}></div>
                  <T content="action.signout" className="text ellipsis" component="div"/>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = UserPanel;
