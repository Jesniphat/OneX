var React           = require('react');
var Reflux          = require('reflux');
var Router          = require('react-router');
var Link            = Router.Link;
var system          = require('ss-system');
var systemActions   = system.systemActions; //require('./actions');

var ModulePanel = React.createClass({
  mixins: [
    Reflux.listenTo(systemActions.bodyClick, 'onBodyClickAction'),
    Reflux.listenTo(systemActions.getMaster.done, 'onGetMasterDoneAction'),
    Reflux.listenTo(systemActions.iniModule.done, 'oniniModuleDoneAction'),
    Reflux.listenTo(systemActions.updateTopPanel, 'onUpdateTopPanelAction')
  ],

  getInitialState: function() {
    return {
      isShow: false,
      start: {},
      modules:[],
      info: {
        code:'',
        name:'',
        icon:''
      }
    };
  },

  onToggleModuleMenu: function(e) {
    e.stopPropagation();
    this.setState({
      isShow: !this.state.isShow
    });
  },

  onGetMasterDoneAction: function(data) {
    var out = [];
    var start = null;
    data.modules.forEach(function(mod) {
      var chk = {};
      chk[mod.code] = [mod.acl_code];
      if (system.acl.hasAcl(chk) || !data.staff) {
        if(!start) start = mod;
        out.push(mod);
      }
    });
    //systemActions.iniModule(start);
    this.setState({
      start: start,
      modules: out
    });
  },
  oniniModuleDoneAction: function(){

  },

  onBodyClickAction: function() {
    this.setState({
      isShow: false
    });
  },

  onUpdateTopPanelAction: function(info) {
    this.setState({
      info: info
    });
  },

  handleMenuClick: function(e, item) {
    e.stopPropagation();
    this.setState({
      isShow: false,
      info: {
        code: item.code,
        name: item.name,
        icon: item.icon
      }
    });
  },

  render: function() {
    var list = this.state.modules.map(function(item) {
      return (
        <li key={item.code}>
          <Link to={item.code} onClick={function(e) {this.handleMenuClick(e, item)}.bind(this)}>
            <div className={'flaticon-'+item.icon+' small icon'}></div>
            <div className="text ellipsis">{item.name}</div>
          </Link>
        </li>
      )
    }.bind(this));
    return (
      <div id="module-panel">
        <div className="inner" onClick={this.onToggleModuleMenu}>
          <div className={'icon flaticon-' + (this.state.info.icon ? this.state.info.icon : 'favorite22') }></div>
          <div className="title heading ellipsis">{this.state.info.name}</div>
        </div>
        <div id="module-menu" className={this.state.isShow ? 'show' :null}>
          <ul>
            {list}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = ModulePanel;
