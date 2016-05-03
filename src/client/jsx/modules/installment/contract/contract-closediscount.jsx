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
var storageKey = 'installment.contract.closediscount';

var toasterActions = system.toasterActions;
var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;

var contractActions = require('./actions');
var ReFlux = require('reflux');

var ContractList = React.createClass({
  mixins:[
    ReFlux.listenTo(contractActions.saveClosediscount.done,'onSaveClosediscountDoneAction')
  ],
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
        // {name:'status', title:'contract.contract_status', width:'86px'
        //   , sort:false, search:false, text:monthYear, render:function(row) {
        //   var today = new Date();
        //   var from_date = new Date(today.getFullYear(), today.getMonth()-9, 1, 0, 0, 0);
        //   var year = from_date.getFullYear();
        //   var month = from_date.getMonth();
        //   var fromYearMonth = year * 100+month;
        //   var to_date = new Date(today.getFullYear(), today.getMonth()+3, 1, 0, 0, 0);
        //   var toYearMonth = to_date.getFullYear() * 100 + to_date.getMonth();
        //   var paymentList = {};
        //   row.payments.forEach(function(payment) {
        //     var d = new Date(payment.due_date.substr(0,10));
        //     var ym = d.getFullYear() * 100 + d.getMonth();
        //     paymentList[''+ym] = payment;
        //   });
        //   var list = [];
        //   var ym = year*100+month;
        //   while (ym < toYearMonth) {
        //     if (!paymentList[''+ym]) {
        //       list.push(<li key={ym} className="type_EMPTY"></li>);
        //       month++;
        //       if (month==12) {
        //         year++;
        //         month=0;
        //       }
        //       ym = year*100+month;
        //       continue;
        //     }
        //     var className = 'status_' + paymentList[''+ym].term_status
        //       + (paymentList[''+ym].close_status=='NORMAL' ? '' : ' ' + paymentList[''+ym].close_status);
        //     var title = 'DUE DATE: ' + paymentList[''+ym].due_date.substr(0,10)
        //       + '\nPAID DATE: ' + paymentList[''+ym].paid_date.substr(0, 10)
        //       + '\nDUE AMOUNT: ' + paymentList[''+ym].due_amount
        //       + '\nPAID AMOUNT: ' + paymentList[''+ym].paid_amount
        //       + '\nSTATUS: ' + paymentList[''+ym].term_status
        //       + '\nCLOSE STATUS: ' + paymentList[''+ym].close_status;
        //     list.push(<li key={ym} className={className} title={title}></li>);
        //     month++;
        //     if (month==12) {
        //       year++;
        //       month=0;
        //     }
        //     ym = year*100+month;
        //   }
        //   return (
        //     <ul className="contract_status small">
        //       {list}
        //     </ul>
        //   )
        // }},
        {name:'code', title:'contract.code', width:'150px', render:function(row) {
          if (!row.code || row.code.length != 16) {
            return row.code;
          }
          return row.code.substr(8, 6);
        }},
        {name:'shop_name', title:'contract.shop_name', width:'80px'},
        // {name:'sign_date', type:'daterange', title:'contract.sign_date', width:'88px', render:function(row) {
        //   //console.log(row.sign_date.substr(0,10));
        //   return tr.localize(new Date(row.sign_date.substr(0,10)), { type:'date', format:'short'});
        // }},
        {name:'cus_name', title:'contract.customer', width:'120px'},
        {name:'cus_mobile', title:'contract.cus_mobile', width:'90px'},
        {name:'product_detail', title:'contract.product_detail'},
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
        {name:'payment_price', title:'contract.payment_price', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.payment_price,2);
        }},
        {name:'total_paid', title:'contract.total_paid', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.total_paid,2);
        }},
        {name:'discount', title:'contract.discount', width:'80px', className:'right', render:function(row) {
          return helper.numberFormat(row.discount,2);
        }},

        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          var f = function() {
            this.onUpdateCloseDiscount(row)
          }.bind(this);
          return (<div className="flex">
              <div onClick={f}>
                <FlexIcon icon="save20" title="action.select"></FlexIcon>
              </div>
          </div>);
        }.bind(this)},
      ]
    }
  },

  componentDidMount: function() {
    console.log(system.sessionStore.getSession());
  },

  onSaveClosediscountDoneAction: function() {
    toasterActions.pop({
      type:'success',
      message:'บันทึกข้อมูลเรียบร้อย'
    });
    this.refs.grid.doRefresh();
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

  onUpdateCloseDiscount: function(row) {
    //console.log('update');
    contractActions.saveClosediscount(row.id);

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
            <T content="contract.title.closediscount" component="h2" />
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
            id="installment-contract-discount"
            listAction={contractActions.listClosediscount}
            exportAction={contractActions.exportClosediscount}
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

module.exports = ContractList;
