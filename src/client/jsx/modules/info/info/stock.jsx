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

var stockActions   = require('./stock-actions');
var stockStore     = require('./stock-store');

var FlexGrid      = widgets.FlexGrid;
var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;
var FlexDropdown  = widgets.FlexDropdown;
var FlexCheckbox  = widgets.FlexCheckbox;

var storageKey = 'info.info.stockinfo';

var InfoList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(stockActions.getById.done,'onGetByIdDoneAction')
  ],


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

    var clCost = "YES"

    return {
      data: {
        shop: system.sessionStore.getSession().shop.code,
        closeCost:clCost
      },
      fields: [
        {name:'sh_code', title:'info.total.shop_code', width:'80px'},
        {name:'p_group', title:'info.total.p_group', width:'80px'},
        {name:'p_code', title:'info.total.p_code', width:'80px'},
        {name:'p_desc', title:'info.total.product_name',width:'100px',render:function(row){
          return <div title={row.p_desc}>{row.p_desc}</div>;
        }.bind(this)},
        {name:'c_code', title:'info.total.com_code', width:'80px'},
        {name:'spec', title:'info.total.spec', width:'80px'},
        {name:'serial', title:'info.total.serial', width:'120px'},
        {name:'date_in', title:'info.total.date_in',className:'center', width:'110px'},
        {name:'barcode', title:'info.total.barcode',className:'center', width:'100px'},
        {name:'qty', title:'info.total.total',className:'right', width:'60px'},
        // {name:'qty_yn', title:'info.total.total', width:'60px',render:function(){
        //   return (  <FlexCheckbox />)
        // }.bind(this)},
        {name:'po_cost', title:'info.total.po_cost',className:'right', width:'80px',render:function(row){
          var Results = ""
          if (this.state.data.closeCost =="NO") {
            Results = helper.numberFormat(row.po_cost,2);
          }else {
            Results = "";
          }
          return Results
        }.bind(this)},
        {name:'cost', title:'info.total.cost',className:'right', width:'80px',render:function(row){
          var Results = ""
          if (this.state.data.closeCost =="NO") {
            Results = helper.numberFormat(row.cost,2);
          }else {
            Results = ""
          }
          return Results
        }.bind(this)},
        {name:'vat', title:'info.total.vat',className:'right', width:'60px'},
        {name:'status', title:'info.total.status',className:'right', width:'60px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
          </div>);
        }.bind(this)}
      ]
    }
  },

  componentDidMount: function() {
    stockActions.getById();
  },

  onGetByIdDoneAction: function(data){

    if (data==false){
      this.state.data.closeCost = "YES";
    }else{
      this.state.data.closeCost = "NO";
    }

    this.setState({
      data: {
        closeCost: this.state.data.closeCost
      }
    });

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
            <T content="title.list_stockinfo" component="h2" />
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
            id="info-info-stockinfo"
            listAction={stockActions.list}
            exportAction={stockActions.export}
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
