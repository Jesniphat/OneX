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
var storageKey = 'installment.contract.dunning';

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;

var contractActions = require('./actions');

var ContractList = React.createClass({

  getInitialState: function() {
    var shops = system.acl.getShopAcl();
    var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});

    var opt = storage.load(storageKey, {current_status:'DEBT', shop:''});
    if (opt.shop=='') {
      opt.shop = shops.length > 0 ?
        (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '';
    }

    return {
      data: {
        shop: opt.shop,
        current_status: opt.current_status
      },
      currentStatusField: {
        id:'current_status',
        label:'contract.filter_current_status',
        list:[
          {value:'DEBT', text:tr.translate('contract.current_status.DEBT')}
        ]
      },
      fields: [
        {name:'status', title:'contract.contract_status', width:'86px'
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
        {name:'code', title:'contract.code', width:'150px', render:function(row) {
          if (!row.code || row.code.length != 16) {
            return row.code;
          }
          return row.code.substr(8, 6);
        }},
        {name:'shop_name', title:'contract.shop_name', width:'60px'},
        {name:'sign_date', type:'daterange', title:'contract.sign_date', width:'88px', render:function(row) {
          //console.log(row.sign_date.substr(0,10));
          return tr.localize(new Date(row.sign_date.substr(0,10)), { type:'date', format:'short'});
        }},
        {name:'cus_name', title:'contract.customer', width:'100px'},
        {name:'product_detail', title:'contract.product_detail'},
        {name:'finance', title:'contract.finance', width:'80px', className:'center' , render:function(row) {
          return row.finance;
        }},
        {name:'last_paid', type:'daterange', title:'contract.last_paid', width:'100px', render:function(row) {
          //console.log(row.sign_date.substr(0,10));
          var last_date = '';
          if (row.last_paid == null || row.last_paid == '0000-00-00'){
            last_date='';
          }else {
            last_date = tr.localize(new Date(row.last_paid.substr(0,10)), { type:'date', format:'short'});
          }
          return last_date;
        }},
        {name:'amount_term', title:'contract.amount_term', width:'80px', className:'center', render:function(row) {
          //console.log(row.sign_date.substr(0,10));
          var amount_term = '';
          if (row.amount_term != 0){
            amount_term = row.amount_term;
          }
          return amount_term;
        }},
        {name:'over_day', title:'contract.over_day', width:'50px', className:'center' , render:function(row) {
          return row.over_day;
        }},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="installment.contract.edit" param={{id:row.id,pageback:'installment.contract.dunning',dunning:'Y'}} icon="right244" title="action.select"></FlexIcon>
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
    var footnote = (
      <ul className="contract_status_legend">
        <li><div className="status_WAIT"></div><T content="contract.status.WAIT" component="div" className="ellipsis"/></li>
        <li><div className="status_WAIT_PARTIAL"></div><T content="contract.status.WAIT_PARTIAL" component="div" className="ellipsis"/></li>
        <li><div className="status_WAIT_PAID"></div><T content="contract.status.WAIT_PAID" component="div" className="ellipsis"/></li>
        <li><div className="status_OVERDUE"></div><T content="contract.status.OVERDUE" component="div" className="ellipsis"/></li>
        <li><div className="status_OVERDUE_PARTIAL"></div><T content="contract.status.OVERDUE_PARTIAL" component="div" className="ellipsis"/></li>
        <li><div className="status_OVERDUE_PAID"></div><T content="contract.status.OVERDUE_PAID" component="div" className="ellipsis"/></li>
      </ul>
    )
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="contract.title.list" component="h2" />
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
              field={{id:'shop',label:'contract.filter_shop',list:list}}
              data={this.state.data}
              onChange={this.handleChange}
              />
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            ref="grid"
            id="installment-contract-dunning"
            listAction={contractActions.list}
            exportAction={contractActions.exportDunning}
            fields={this.state.fields}
            pk="id"
            sortBy="over_day"
            sortDir="desc"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{
              today: helper.dateToString(new Date()),
              shop: (this.state.data.shop=='*' ? null : this.state.data.shop),
              current_status: this.state.data.current_status
            }}
            footer={footnote}
            />
        </div>
      </div>
    );
  }
});

module.exports = ContractList;
