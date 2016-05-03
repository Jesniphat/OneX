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

var pendingActions   = require('./pending-actions');
var pendingStore     = require('./pending-store');

var FlexGrid      = widgets.FlexGrid;
var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;
var FlexDropdown  = widgets.FlexDropdown;

var storageKey = 'installment.contract.pending';

var ContractList = React.createClass({
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
        shop: shop_code
      },
      fields: [
        {name:'sell_date', type:'text', title:'info.sell_date', width:'92px',render:function(row) {
          return tr.localize(new Date(row.sell_date), { type:'date', format:'short'});
        }},
        {name:'shop_name', title:'info.shop_name', width:'110px'},
        {name:'company_name', title:'info.company_name', width:'125px'},
        {name:'product_serial', title:'info.serial', width:'125px'},
        {name:'product_description', title:'info.description'},

        {name:'down_payment', title:'info.down_payment', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.down_payment,2);
        }},
        {name:'remain_price', title:'info.remain_price', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.remain_price,2);
        }},
        {name:'sales_staff', title:'info.sell_staff', width:'100px'},
        {name:'flag', title:'info.flag', hint:'info.flag_hint', width:'24px', sort:false},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="installment.contract.new" param={{sellId:row.id,sellType:'NORMAL'}} icon="right244" title="action.select"></FlexIcon>
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

  doContractNew: function() {
    this.context.router.transitionTo('setting.contract.edit', {id:0});
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

    var footnote = (
      <div><T content="contract.footer.special" /></div>
    )

    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="contract.title.list_pending" component="h2" />
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexDropdown
              field={{id:'shop',label:'contract.filter_shop',list:list}}
              data={this.state.data}
              onChange={this.handleShopChange}
              />
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            ref="grid"
            id="installment-contract-pending"
            listAction={pendingActions.list}
            exportAction={pendingActions.export}
            fields={this.state.fields}
            pk="id"
            sortBy="sell_date"
            sortDir="DESC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{shop: (this.state.data.shop=='*' ? null : this.state.data.shop)}}
            footer={footnote}
            />
        </div>
      </div>
    );
  }
});

module.exports = ContractList;
