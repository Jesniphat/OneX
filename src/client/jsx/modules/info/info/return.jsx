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

var returnActions   = require('./return-actions');
var returnStore     = require('./return-store');

var FlexGrid      = widgets.FlexGrid;
var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;
var FlexDropdown  = widgets.FlexDropdown;
var FlexCheckbox  = widgets.FlexCheckbox;

var storageKey = 'info.info.returninfo';

var InfoList = React.createClass({
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

    var chkQtyYn = true;
  var clCost = "YES";
    return {
      data: {
        shop: system.sessionStore.getSession().shop.code
      },
      fields: [
        {name:'sh_code', title:'info.total.shop_code', width:'80px'},
        {name:'return_date', title:'info.total.date_in', width:'150px'},
        {name:'nickname', title:'info.total.bystaff', width:'110px'},
        {name:'c_code', title:'info.total.return_com_code', width:'110px'},
        {name:'p_code', title:'info.total.p_code', width:'100px'},
        {name:'spec', title:'info.total.spec', width:'80px'},
        {name:'serial', title:'info.total.serial',width:'100px'},
        {name:'barcode', title:'info.total.barcode', width:'90px'},
        {name:'qty',className:'right', title:'info.total.total', width:'60px'},
        // {name:'qty_yn', title:'info.total.total', width:'60px',render:function(){
        //   return (  <FlexCheckbox />)
        // }.bind(this)},
        {name:'price',className:'right', title:'info.total.price', width:'100px',render:function(row){
          return  helper.numberFormat(row.price,2);
        }},
        {name:'sell_date', title:'info.total.sell_date', width:'110px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
          </div>);
        }.bind(this)}
      ]
    }
  },

  componentDidMount: function() {
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
            <T content="title.list_returninfo" component="h2" />
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
            id="info-info-returninfo"
            listAction={returnActions.list}
            exportAction={returnActions.export}
            fields={this.state.fields}
            sortBy="sh_code"
            sortDir="DESC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{shop: (this.state.data.shop=='*' ? null : this.state.data.shop)}}
            />
        </div>
      </div>
    );
  }
});

module.exports = InfoList;
