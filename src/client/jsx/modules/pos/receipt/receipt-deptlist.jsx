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
var storageKey = 'pos.receipt.deptlist';

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;

var receiptAction = require('./actions');

var ReceiptDeptList = React.createClass({

  getInitialState: function() {
    var shops = system.acl.getShopAcl();
    var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});

    var opt = storage.load(storageKey, {shop:''});
    if (opt.shop=='') {
      opt.shop = shops.length > 0 ?
        (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '';
    }

    return {
      data: {
        shop: opt.shop
      },
      fields: [
        {name:'system_date', type:'daterange', title:'receipt.sign_date', width:'88px', render:function(row) {
          //console.log(row.sign_date.substr(0,10));
          return tr.localize(new Date(row.system_date.substr(0,10)), { type:'date', format:'short'});
        }},
        {name:'pay_date', type:'daterange', title:'receipt.pay_date', width:'88px', render:function(row) {
          //console.log(row.sign_date.substr(0,10));
          return tr.localize(new Date(row.pay_date.substr(0,10)), { type:'date', format:'short'});
        }},
        {name:'code', title:'receipt.code', width:'150px', render:function(row) {
          if (!row.code || row.code.length != 16) {
            return row.code;
          }
          return row.code.substr(8, 6);
        }},
        {name:'product_detail', title:'receipt.product_detail'},
        {name:'fullname', title:'receipt.customer', width:'120px'},
        {name:'display_name', title:'receipt.pay_staff', width:'120px'},
        {name:'amount', title:'receipt.amount', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.amount,2);
        }},
        {name:'name', title:'receipt.shop_name', width:'80px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="pos.receipt.history" param={{id:row.contract_id}} icon="right244" title="action.select"></FlexIcon>
          </div>);
        }.bind(this)},

      ]
    }
  },

  componentDidMount: function() {
    console.log(system.sessionStore.getSession());
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
    var list = system.acl.getShopAcl().map(function(item) {
      return {
        value:item.code,
        text:item.code+' '+item.name
      };
    });
    if (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']})) {
      list.unshift({value:'*', text:'* ทุกสาขา'});
    }

    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="receipt.title.deptlist" component="h2" />
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexDropdown
              field={{id:'shop',label:'receipt.filter_shop',list:list}}
              data={this.state.data}
              onChange={this.handleChange}
              />
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            ref="grid"
            id="pos-receipt-deptlist"
            listAction={receiptAction.deptList}
            exportAction={receiptAction.exportDept}
            fields={this.state.fields}
            pk="id"
            sortBy="system_date"
            sortDir="ASC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{
              today: helper.dateToString(new Date()),
              shop: (this.state.data.shop=='*' ? null : this.state.data.shop)
            }}
            />
        </div>
      </div>
    );
  }
});

module.exports = ReceiptDeptList;
