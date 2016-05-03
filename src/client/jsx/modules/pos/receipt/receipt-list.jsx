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
var storageKey = 'pos.receipt.list';

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;

var receiptAction = require('./actions');

var ReceiptList = React.createClass({

  getInitialState: function() {
//    var shops = system.acl.getShopAcl();
    var shops = systemStore.getMaster().shops.map(function(shop) {
      return {
        value: shop.code,
        text: shop.code+' '+shop.name
      }
    });
    shops.unshift({value:'*',text:'* ทุกสาขา'});
    var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});

    var opt = storage.load(storageKey, {current_status:'ALL', shop:''});
    if (opt.shop=='') {
      opt.shop = shops.length > 0 ?
        (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '';
    }

    return {
      data: {
        shop: opt.shop,
        current_status: opt.current_status
      },
      shopList: shops,
      currentStatusField: {
        id:'current_status',
        label:'receipt.filter_current_status',
        list:[
          {value:'ALL', text:tr.translate('receipt.current_status.ALL')},
          {value:'NORMAL', text:tr.translate('receipt.current_status.NORMAL')},
          {value:'DEBT', text:tr.translate('receipt.current_status.DEBT')},
          {value:'CLOSE_NORMAL', text:tr.translate('receipt.current_status.CLOSE_NORMAL')},
          {value:'CLOSE_RETURN', text:tr.translate('receipt.current_status.CLOSE_RETURN')},
          {value:'CLOSE_CONFISCATE', text:tr.translate('receipt.current_status.CLOSE_CONFISCATE')},
          {value:'CLOSE_BAD_DEBT', text:tr.translate('receipt.current_status.CLOSE_BAD_DEBT')}
        ]
      },
      fields: [
        {name:'status', title:'receipt.contract_status', width:'86px'
          , sort:false, search:false, text:monthYear, render:function(row) {
          var today = new Date();
          var from_date = new Date(today.getFullYear(), today.getMonth()-9, 1, 0, 0, 0);
          var year = from_date.getFullYear();
          var month = from_date.getMonth();
          var fromYearMonth = year * 100+month;
          var to_date = new Date(today.getFullYear(), today.getMonth()+3, 1, 0, 0, 0);
          var toYearMonth = to_date.getFullYear() * 100 + to_date.getMonth();
          var paymentList = {};
          row.payments.forEach(function(payment) {
            var d = new Date(payment.due_date.substr(0,10));
            var ym = d.getFullYear() * 100 + d.getMonth();
            paymentList[''+ym] = payment;
          });
          var list = [];
          var ym = year*100+month;
          while (ym < toYearMonth) {
            if (!paymentList[''+ym]) {
              list.push(<li key={ym} className="type_EMPTY"></li>);
              month++;
              if (month==12) {
                year++;
                month=0;
              }
              ym = year*100+month;
              continue;
            }
            var className = 'status_' + paymentList[''+ym].term_status
              + (paymentList[''+ym].close_status=='NORMAL' ? '' : ' ' + paymentList[''+ym].close_status);
            var title = 'DUE DATE: ' + paymentList[''+ym].due_date.substr(0,10)
              + '\nPAID DATE: ' + paymentList[''+ym].paid_date.substr(0, 10)
              + '\nDUE AMOUNT: ' + paymentList[''+ym].due_amount
              + '\nPAID AMOUNT: ' + paymentList[''+ym].paid_amount
              + '\nSTATUS: ' + paymentList[''+ym].term_status
              + '\nCLOSE STATUS: ' + paymentList[''+ym].close_status;
            list.push(<li key={ym} className={className} title={title}></li>);
            month++;
            if (month==12) {
              year++;
              month=0;
            }
            ym = year*100+month;
          }
          return (
            <ul className="contract_status small">
              {list}
            </ul>
          )
        }},
        {name:'code', title:'receipt.code', width:'150px', render:function(row) {
          if (!row.code || row.code.length != 16) {
            return row.code;
          }
          return row.code.substr(8, 6);
        }},
        {name:'shop_name', title:'receipt.shop_name', width:'60px'},
        {name:'sign_date', type:'daterange', title:'receipt.sign_date', width:'88px', render:function(row) {
          //console.log(row.sign_date.substr(0,10));
          return tr.localize(new Date(row.sign_date.substr(0,10)), { type:'date', format:'short'});
        }},
        {name:'cus_name', title:'receipt.customer', width:'120px'},
        {name:'cus_mobile', title:'receipt.cus_tel', width:'80px'},
        {name:'product_detail', title:'receipt.product_detail'},
        {name:'payment_price', title:'receipt.payment_price', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.payment_price,2);
        }},
        {name:'total_paid', title:'receipt.total_paid', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.total_paid,2);
        }},
        {name:'balance', title:'receipt.payment_balance', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.balance,2);
        }},
        {name:'current_status', title:'receipt.cur_status', width:'60px', className:'center',search:false , render:function(row){

          var list_status =[
            {value:'NORMAL', text:tr.translate('receipt.current_status.NORMAL')},
            {value:'DEBT', text:tr.translate('receipt.current_status.DEBT')},
            {value:'CLOSE_NORMAL', text:tr.translate('receipt.current_status.CLOSE_NORMAL')},
            {value:'CLOSE_RETURN', text:tr.translate('receipt.current_status.CLOSE_RETURN')},
            {value:'CLOSE_CONFISCATE', text:tr.translate('receipt.current_status.CLOSE_CONFISCATE')},
            {value:'CLOSE_BAD_DEBT', text:tr.translate('receipt.current_status.CLOSE_BAD_DEBT')},
            {value:'CLOSE_CANCEL', text:tr.translate('receipt.current_status.CLOSE_CANCEL')},
          ]
          //console.log(row.current_status);
          return list_status.filter(function(status) {return status.value == row.current_status;})[0].text;
          //row.current_status == 'NORMAL' ? tr.translate('receipt.current_status.NORMAL'):tr.translate('receipt.current_status.DEBT');

        }},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="pos.receipt.screen" param={{id:row.nationid,contract_code:row.code,redeem:'N'}} icon="right244" title="action.select"></FlexIcon>
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
      current_status: this.state.data.current_status,
      shop: this.state.data.shop
    });
    this.setState({
      data: this.state.data
    }, function() {
      this.refs.grid.doRefresh();
    });
  },

  GenStatusText: function(status){

    if(status == 'NORMAL'){
      return tr.translate('receipt.current_status.NORMAL');
    }else if(status == 'DEBT'){
      return tr.translate('receipt.current_status.DEPT');
    }else if(status == 'CLOSE_NORMAL'){
      return tr.translate('receipt.current_status.CLOSE_NORMAL');
    }else if(status == 'CLOSE_RETURN'){
      return tr.translate('receipt.current_status.CLOSE_RETURN');
    }else if(status == 'CLOSE_CONFISCATE'){
      return tr.translate('receipt.current_status.CLOSE_CONFISCATE');
    }else{
      return tr.translate('receipt.current_status.CLOSE_BAD_DEBT');
    }

  },

  render: function() {
    // var list = system.acl.getShopAcl().map(function(item) {
    //   return {
    //     value:item.code,
    //     text:item.name
    //   };
    // });
    // if (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']})) {
    //   list.unshift({value:'*', text:'* ทุกสาขา'});
    // }
    var footnote = (
      <ul className="contract_status_legend">
        <li><div className="status_WAIT"></div><T content="receipt.status.WAIT" component="div" className="ellipsis"/></li>
        <li><div className="status_WAIT_PARTIAL"></div><T content="receipt.status.WAIT_PARTIAL" component="div" className="ellipsis"/></li>
        <li><div className="status_WAIT_PAID"></div><T content="receipt.status.WAIT_PAID" component="div" className="ellipsis"/></li>
        <li><div className="status_OVERDUE"></div><T content="receipt.status.OVERDUE" component="div" className="ellipsis"/></li>
        <li><div className="status_OVERDUE_PARTIAL"></div><T content="receipt.status.OVERDUE_PARTIAL" component="div" className="ellipsis"/></li>
        <li><div className="status_OVERDUE_PAID"></div><T content="receipt.status.OVERDUE_PAID" component="div" className="ellipsis"/></li>
      </ul>
    )
    return (
      <div className="content-page layout-panel">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="receipt.title.list" component="h2" />
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexDropdown
              field={this.state.currentStatusField}
              data={this.state.data}
              onChange={this.handleChange}
              />
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
            id="pos-receipt-list"
            listAction={receiptAction.list}
            exportAction={receiptAction.export}
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
              shop: (this.state.data.shop=='*' ? null : this.state.data.shop),
              current_status: (this.state.data.current_status=='ALL' ? null : this.state.data.current_status)
            }}
            footer={footnote}
            />
        </div>
      </div>
    );
  }
});

module.exports = ReceiptList;
