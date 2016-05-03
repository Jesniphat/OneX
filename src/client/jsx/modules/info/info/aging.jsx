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

var agingActions   = require('./aging-actions');
var agingStore     = require('./aging-store');

var Actions   = require('./actions');
var Store     = require('./store');

var FlexGrid      = widgets.FlexGrid;
var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;
var FlexDropdown  = widgets.FlexDropdown;
var FlexCheckbox  = widgets.FlexCheckbox;

var storageKey = 'info.info.aging';

var InfoAging = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    var idSt = parseInt(this.props.params.id);

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
        shop: system.sessionStore.getSession().shop.code,
        clCost:clCost
      },
      fields: [
        {name:'sh_code', title:'info.total.shop_code', width:'70px'},
        {name:'p_code', title:'info.total.p_code', width:'80px'},
        {name:'p_desc', title:'info.total.product_name',width:'100px'},
        {name:'c_code', title:'info.total.com_code', width:'100px'},
        {name:'spec', title:'info.total.spec', width:'80px'},
        {name:'serial', title:'info.total.serial', width:'100px'},
        {name:'date_in', title:'info.total.date_in',className:'center', width:'100px'},
        {name:'barcode', title:'info.total.barcode', width:'90px'},
        {name:'qty', title:'info.total.total',className:'right', width:'60px'},
        // {name:'qty_yn', title:'info.total.total', width:'60px',render:function(){
        //   return (  <FlexCheckbox />)
        // }.bind(this)},
        {name:'cost', title:'info.total.cost',className:'right', width:'85px',render:function(row){
          return helper.numberFormat(row.cost,2);
        }.bind(this)},
        {name:'po_cost', title:'info.total.po_cost',className:'right', width:'85px',render:function(row){
          var Results = ""
          if (clCost =="YES") {
            Results =  helper.numberFormat(row.po_cost,2);
          }else {
            Results = ""
          }
          return Results
        }.bind(this)},
        {name:'prod_age_month', title:'info.total.prod_age_month',className:'right', width:'60px'},
        {name:'prod_age_day', title:'info.total.prod_age_day',className:'right', width:'40px'},
        {name:'vat', title:'info.total.vat',className:'right', width:'60px'},
        {name:'status', title:'info.total.status',className:'center', width:'60px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
          </div>);
        }.bind(this)}
      ]
    }
  },

  componentDidMount: function() {
    var st = this.state.idSt;
    Actions.getById(st);
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
            <T content="title.list_aginginfo" component="h2" />
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexDropdown
              field={{id:'shop',label:'info.total.shop_code',list:list}}
              data={this.state.data}
              onChange={this.handleShopChange}
              />
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            ref="grid"
            id="info-info-aging"
            listAction={agingActions.list}
            exportAction={agingActions.export}
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

module.exports = InfoAging;
