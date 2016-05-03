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
var systemStore       = system.systemStore;
var sessionStore      = system.sessionStore;

var sellActions   = require('./sell-actions');
var sellStore     = require('./sell-store');

var FlexGrid      = widgets.FlexGrid;
var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;
var FlexDropdown  = widgets.FlexDropdown;

var ContractList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    var shops = system.acl.getShopAcl();
    if (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']})) {
      shops.unshift({code:'*', name:'ทุกสาขา'});
    }
    return {
      data: {
        shop:shops.length > 0 ? shops[0].code : ''
      },
      fields: [
        {name:'sell_date', type:'date', title:'info.sell_date', width:'105px',render:function(row) {
          return tr.localize(new Date(row.sell_date), { type:'date'});
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
        {name:'sales_staff', title:'info.sales_staff', width:'100px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="installment.contract.new" param={{sellId:row.id}} icon="right244" title="action.select"></FlexIcon>
          </div>);
        }.bind(this)}
      ]
    }
  },

  componentDidMount: function() {
  },

  handleShopChange: function(id, value) {
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
        text:item.code+' '+item.name
      };
    });

    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="contract.title.list_bysales" component="h2" />
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
            actions={sellActions}
            fields={this.state.fields}
            pk="id"
            sortBy="sell_date"
            sortDir="DESC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{shop:this.state.data.shop=='*' ? null : this.state.data.shop}}
            />
        </div>
      </div>
    );
  }
});

module.exports = ContractList;
