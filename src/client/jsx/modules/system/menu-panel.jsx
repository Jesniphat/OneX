var React           = require('react');
var Reflux          = require('reflux');
var Router          = require('react-router');
var Link            = Router.Link;
var T               = require('react-translate-component');
var tr              = require('counterpart');

var system          = require('ss-system');
var sessionStore    = require('./stores/session');

var menuActions      = system.menuActions; //require('./actions/menu');
var infoPanelActions = system.infoPanelActions; //require('./actions/info-panel');
var systemActions    = system.systemActions; //require('./actions');

var MenuPanel = React.createClass({
  mixins: [
    Reflux.listenTo(menuActions.show, 'onShowMenu'),
    Reflux.listenTo(menuActions.updateCount, 'onUpdateCount')
  ],

  getInitialState: function() {
    return {
      menuList: [],
      panelClassName: 'default'
    };
  },

  onShowMenu: function(list, className) {
    this.setState({
      menuList: list,
      panelClassName: className || 'default'
    });
  },

  onUpdateCount: function(id, count) {
    this.state.menuList.forEach(function(menu) {
      if (menu.id==id) {
        menu.count = count;
      }
    });
    this.setState({
      menuList: this.state.menuList
    });
  },

  handleClick: function(text) {
    //systemActions.setPageHeader(text);
  },

  handleSignOut: function(e) {
    e.preventDefault();
    systemActions.requestSignOut();
  },

  render: function() {
    var menuList = this.state.menuList.map(function(menu) {
      var text = null;

      if (typeof menu.count ==='undefined') {
        text = (
          <T content={menu.label} compoent="div" className="text"></T>
        );
      } else {
        text = (
          <div className="text-with-counter">
            <T content={menu.label} compoent="div" className="text"></T>
            <div className="counter">{menu.count||0} รายการ</div>
          </div>
        );
      }

      var session = sessionStore.getSession();
      return (
        <li key={menu.route}>
          {function(){
            console.log(menu.acl, system.acl.hasMAcl(menu.acl));
            if (system.acl.hasMAcl(menu.acl) || (session.user != undefined && /M_CUSTOMER/.exec(menu.acl.join('|')))) {
              return (
                <Link to={menu.route} activeClassName="active" onlyActiveOnIndex={menu.index || false} onClick={this.handleClick(tr.translate(menu.label))}>
                  <span className={'flaticon-' + menu.icon + ' normal icon'} title={tr.translate(menu.label)}></span>
                  <div className="spacer"></div>
                  {text}
                </Link>
              )
            }
          }.call(this)}
        </li>
      );
    }.bind(this));
    return (
      <div ref="menuPanel" id="menu-panel" className={this.state.panelClassName}>
        <ul className="top">
          {menuList}
        </ul>
        <ul className="bottom">
          <li>
            <a href="#" onClick={this.handleSignOut}>
              <span className="flaticon-exit13 normal icon" title={tr.translate('action.signout')}></span>
              <div className="spacer"></div>
              <T content="action.signout" component="div" className="text"/>
            </a>
          </li>
        </ul>
      </div>
    );
  }
});

module.exports = MenuPanel;
