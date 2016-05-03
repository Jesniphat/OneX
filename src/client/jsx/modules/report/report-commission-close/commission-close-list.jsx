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
var storageKey = 'report.commission.listclose';

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
        {name:'name', title:'commision.shop_name', width:'80px'},
        {name:'code', title:'commision.receipt_code', width:'120px'},
        {name:'paid_period', title:'commision.paid_period', width:'80px'},
        {name:'display_name', title:'commision.staff_name', width:'120px'},
        {name:'pay_date', type:'daterange', title:'commision.pay_date', width:'100px', render:function(row) {
          return tr.localize(new Date(row.pay_date.substr(0,10)), { type:'date', format:'short'});
        }},
        {name:'cost_term', title:'commision.cost_term', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.cost_term,2);
        }},
        {name:'amount', title:'commision.amount', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.amount,2);
        }},
        {name:'profit', title:'commision.profit', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.profit,2);
        }},
        {name:'actions', type:'actions', width:(2*15)+'px'}
      ]
    }
  },

  componentDidMount: function() {
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
    console.log('select brach=',value);
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
            <T content="report.commission.title" component="h2" />
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
            id="report-commission-listclose"
            listAction={commissionActions.list}
            exportAction={commissionActions.exportclose}
            fields={this.state.fields}
            pk="id"
            sortBy="code"
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
