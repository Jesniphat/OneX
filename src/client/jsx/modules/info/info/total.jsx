var React         = require('react');
var Reflux        = require('reflux');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var systemActions     = system.systemActions;
var infoPanelActions  = system.infoPanelActions;
var dialogActions     = system.dialogActions;
var toasterActions    = system.toasterActions;
var helper            = system.helper;
var storage           = system.storage;
// var systemStore       = system.systemStore;
// var sessionStore      = system.sessionStore;

var totalActions   = require('./total-actions');
var totalStore     = require('./total-store');

var FlexGrid      = widgets.FlexGrid;
var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;
var FlexTextInput = widgets.FlexTextInput;
var FlexDropdown  = widgets.FlexDropdown;

var storageKey = 'info.info.totalinfo';

var InfoTotal = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    var shops = system.acl.getShopAcl();
    var option = storage.load(storageKey, {shop_code:''});
    var shop_code = '';

    if (option.shop_code=='') {
      shop_code = shops.length > 0 ?
        (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '';
    } else {
      shop_code = option.shop_code;
    }

    return {
      data: {
        shop: system.sessionStore.getSession().shop.code,
        date_from:'2014-01-11',
        date_to:'2016-01-11'
      },
      fields: [
        {name:'sh_name', title:'info.total.shop_code', width:'110px'},
        {name:'c_name', title:'info.total.com_code', width:'200px'},
        {name:'p_code', title:'info.total.p_code', width:'200px'},
        {name:'p_desc', title:'info.total.product_name'},
        {name:'total',className:'right', title:'info.total.total', width:'70px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
          </div>);
        }.bind(this)}
      ]
    }
  },

  componentDidMount: function() {
    console.log('date=',system.sessionStore.getSession().staff.cur_date);
    var curDate = new Date(system.sessionStore.getSession().staff.cur_date);
    //console.log('curdate=',curDate.setDate(curDate.getDate()+730));
  },

  handleShopChange: function(id, value) {
    storage.save(storageKey, {shop_code:value});
    this.setState({
      data: {
        shop:value
      }
    }, function() {
      this.refs.grid.doRefresh();
    });
  },

  handleChange: function(id, value) {
    this.state.data[id] = value;
    this.setState({
      data: this.state.data
    });
  },

  render: function() {
    var list = system.acl.getShopAcl().map(function(item) {
      return {
        value:item.code,
        text:item.code + ' ' + item.name
      };
    });
    if (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']})) {
      list.unshift({value:'*', text:'* ทุกสาขา'});
    }

    return (
      <div className="content-page layout-panel">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="title.list_totalinfo" component="h2" />
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexDropdown
              field={{id:'shop',label:'info.filter_shop',list:list}}
              data={this.state.data}
              onChange={this.handleShopChange}
              />
          </div>
        </div>
        <div className="content-body panelf">
            <FlexGrid
              ref="grid"
              id="info-info-total"
              listAction={totalActions.list}
              exportAction={totalActions.export}
              fields={this.state.fields}
              sortBy="sh_code"
              sortDir="DESC"
              limit={50}
              checkbox={false}
              search={true}
              displayRows={10}
              filters={{shop: (this.state.data.shop=='*' ? null : this.state.data.shop),
                date_from:this.state.data.date_from,
                date_to:this.state.data.date_to
              }}
              />
        </div>
      </div>
    );
  }
});

module.exports = InfoTotal;
