var React     = require('react');
var Reflux    = require('reflux');
var Router    = require('react-router');
var Link      = Router.Link;
var T         = require('react-translate-component');
var tr        = require('counterpart');

var system    = require('ss-system');
var widgets   = require('ss-widget');

var helper    = system.helper;
var systemActions = system.systemActions;
var storage   = system.storage;
var systemStore = system.systemStore;
var storageKey = 'report.commission.listopen';

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;

var commissionActions = require('./actions');

var CommissionList = React.createClass({

  getInitialState: function() {
//    var shops = system.acl.getShopAcl();
    var shops = systemStore.getMaster().shops.map(function(shop) {
      return {
        value: shop.id,
        text: shop.code+' '+shop.name
      }
    });
    shops.unshift({value:'*',text:'* ทุกสาขา'});
    var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});
    var opt = storage.load(storageKey, {shop:''});
    if (opt.shop=='') {
      opt.shop = shops.length > 0 ?
        (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '';
    }

    return {
      data: {
        shop: opt.shop,
        paid_amount:0
      },
      shopList: shops,
      fields: [
        {name:'contract_code', title:'commision.contract_code', width:'120px'},
        {name:'shop_name', title:'commision.shop_name', width:'80px'},
        {name:'paid_period', title:'commision.paid_period', width:'80px'},
        {name:'sell_staff', title:'commision.sell_staff', width:'80px'},
        {name:'product_detail', title:'commision.product_detail', width:'120px'},
        {name:'total_price', title:'commision.total_price', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.total_price,2);
        }},
        {name:'cost', title:'commision.cost', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.cost,2);
        }},
        {name:'install_cost', title:'commision.install_cost', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.install_cost,2);
        }},
        {name:'fee', title:'commision.fee', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.fee,2);
        }},
        {name:'profit', title:'commision.profit', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.profit,2);
        }},
        {name:'actions', type:'actions', width:(2*15)+'px'}
      ]
    }
  },

  componentDidMount: function() {
    console.log(commissionActions.list);
    if (commissionActions.list) {
      this.onListUnsubscribe = commissionActions.list.done.listen(this.onListDone);
    }else if (this.props.actions && this.props.actions.list){
      this.onListUnsubscribe = this.props.actions.list.done.listen(this.onListDone);
    }
    console.log(system.sessionStore.getSession());
  },

  componentWillUnmount: function() {
    if (this.onListUnsubscribe) {
      this.onListUnsubscribe();
    }
  },

  onListDone: function(data,opt) {
    this.state.data.paid_amount = opt.paid_amount;
    this.setState({
      data:this.state.data
    });
  },

  handleChange: function(id, value) {
    this.state.data[id] = value;
    storage.save(storageKey, {
      shop: this.state.data.shop
    });
    this.setState({
      data: this.state.data
    }, function() {
      this.refs.grid.doRefresh();
    });
  },

  render: function() {

    var footnote = (
      <div> | ยอดที่ต้องจ่ายทั้งหมด {helper.numberFormat(this.state.data.paid_amount,2)} บาท</div>
    )
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="report.commission.titleopen" component="h2" />
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexDropdown
              field={{id:'shop',label:'receipt.filter_shop',list:this.state.shopList}}
              data={this.state.data}
              onChange={this.handleChange}
              />
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            ref="grid"
            id="report-commission-listopen"
            listAction={commissionActions.list}
            exportAction={commissionActions.exportopen}
            fields={this.state.fields}
            pk="id"
            sortBy="contract_code"
            sortDir="ASC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{
              today: helper.dateToString(new Date()),
              shop: (this.state.data.shop=='*' ? null : this.state.data.shop)
            }}
            footer={footnote}
            />
        </div>
      </div>
    );
  }
});

module.exports = CommissionList;
