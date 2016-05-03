var React           = require('react');
var Reflux          = require('reflux');
var T               = require('react-translate-component');
var cn              = require('classnames');
var tr              = require('counterpart');


var system          = require('ss-system');
var systemActions   = system.systemActions; //require('./actions');
var sessionActions  = system.sessionActions;
var sessionStore    = system.sessionStore; // require('./stores/session');

var ShopInfo = React.createClass({
  mixins: [
    Reflux.listenTo(sessionStore, 'onSessionLoaded'),
    Reflux.listenTo(sessionActions.updateSession.done, 'onSessionLoaded'),
    Reflux.listenTo(systemActions.bodyClick, 'onBodyClickAction'),
    Reflux.listenTo(systemActions.getMaster.done, 'onGetMasterDoneAction')
  ],

  getInitialState: function() {
    this.shops = null;
    this.session = null;
    return {
      shop: {},
      shopList:[],
      isShow: false
    }
  },

  onBodyClickAction: function() {
    this.setState({
      isShow: false
    });
  },

  onSessionLoaded: function(session) {
    this.session = session;
    this.updateShopList();
    console.log(session);
    this.setState({
      sessionID: session.sessionID,
      sessionReady: true
    });
  },

  onGetMasterDoneAction: function(data) {
    this.shops = data.shops;
    this.updateShopList();
  },

  onToggleModuleMenu: function(e) {
    e.stopPropagation();
    this.setState({
      isShow: !this.state.isShow
    });
  },

  updateShopList: function() {
    if (this.shops === null) {
      return;
    }
    if (this.session === null) {
      return;
    }

    var shopList = [];
    for (var i = 0; i < this.shops.length; i++) {
      if (typeof this.session.acl[this.shops[i].code] === 'undefined') {
        continue;
      }
      shopList.push({
        id: this.shops[i].id,
        code: this.shops[i].code,
        name: this.shops[i].name
      });
    }
    this.setState({
      shop: this.session.shop,
      shopList: shopList
    });
  },

  handleShopClick: function(e, item) {
    //console.log(item);
    e.preventDefault();
    sessionActions.updateSession({
      'shop': {id:item.id,code:item.code, name:item.name}
    });
  },

  render: function() {
    $('.ui.shop-picker.dropdown').dropdown();
    var list = this.state.shopList.map(function(item) {
      return (
        <li key={item.code}>
          <a href="#" onClick={function(e) {this.handleShopClick(e, item)}.bind(this)}>
            <div className="flaticon-bookmark45"></div>
            <div className="text ellipsis">{item.code+' '+item.name}</div>
          </a>
        </li>
      )
    }.bind(this));

    var label = this.state.shopList.map(function(item) {
      return (
        <div key={item.code} className={"item "+(item.code==this.state.shop.code?'active selected':'')} data-value={item.code+' '+item.name}  onClick={function(e) {this.handleShopClick(e, item)}.bind(this)}>
          <div className="ui green empty circular label"></div>
          {(item.code != item.name ? (item.code || '') + ' ' : '') + (item.name || '')}
        </div>
      )
    }.bind(this));

    var item = this.state.shop;
    return (
      <div className="ui labeled top right pointing shop-picker dropdown" id="shop-picker" style={{ padding: '9px' }}>
        <i className="building icon" style={{ fontSize: '18px' }}></i>
        <span className="text">
          {item.code!=undefined?(<div className="ui green empty circular label"></div>):null}
          {(item.code != item.name ? (item.code || '') + ' ' : '') + (item.name || '')}
        </span>
        <div className="menu" style={{ borderRadius: '0px', borderTop: 'none', marginTop: '0px' }}>
          <div className="ui icon search input">
            <i className="search icon"></i>
            <input type="text" placeholder="Search branch..."/>
          </div>
          <div className="divider"></div>
          <div className="header">
            <i className="building icon"></i>
            Branch Label
          </div>
          <div className="scrolling menu">
            {label}
          </div>
        </div>
      </div>
    );
    // return (
    //   <div id="shop-picker">
    //     <div className="inner flex" onClick={this.onToggleModuleMenu}>
    //       <div className="icon flaticon-bookmark45"></div>
    //       <div className="title ellipsis">{this.state.shop.code + ' ' + this.state.shop.name}</div>
    //     </div>

    //     <div id="shop-menu" className={this.state.isShow ? 'show' :null}>
    //       <div className="inner" style={{maxHeight:'400px', overflowY:'auto'}}>
    //         <ul>
    //           {list}
    //         </ul>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
});

module.exports = ShopInfo;
