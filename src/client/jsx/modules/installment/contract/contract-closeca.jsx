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

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;

var contractActions = require('./actions');

var ContractList = React.createClass({
  getInitialState: function() {
    var shops = system.acl.getShopAcl();
    var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});
    return {
      data: {
        shop:shops.length > 0 ?
          (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '',
        type:'*'
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
        {name:'return_date', type:'date', title:'contract.sign_date', width:'88px', render:function(row) {
          //console.log(row.sign_date.substr(0,10));
          return tr.localize(new Date(row.return_date.substr(0,10)), { type:'date', format:'short'});
        }},
        {name:'contract', title:'contract.contract', width:'120px'},
        {name:'name', title:'contract.shop_name', width:'100px'},
        {name:'description', title:'contract.product_detail'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="installment.contract.edit" param={{id:row.contract_id,pageback:'installment.contract.close',close:'Y'}} icon="right244" title="action.select"></FlexIcon>
          </div>);
        }.bind(this)},
      ]
    }
  },

  componentDidMount: function() {
    //console.log(system.sessionStore.getSession());
    //console.log(this.state.data);
  },

  handleChange: function(id, value) {
    this.state.data[id] = value;
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

    var list_type = [
      {
        value:'*',
        text:'* ทุกประเภท'
      },
      {
        value:'CLOSE_RETURN',
        text:'ปิดคืนของ'
      },
      {
        value:'CLOSE_CONFISCATE',
        text:'ปิดยึดของ'
      }
    ];

    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="contract.title.close" component="h2" />
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexDropdown
              field={{id:'type',label:'contract.filter_type',list:list_type}}
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
            id="installment-contract-close"
            listAction={contractActions.listClose}
            exportAction={contractActions.exportClose}
            fields={this.state.fields}
            pk="id"
            sortBy="return_date"
            sortDir="ASC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{
              shop: (this.state.data.shop=='*' ? null : this.state.data.shop),
              return_status: (this.state.data.type=='*' ? null : this.state.data.type)
            }}
            />
        </div>
      </div>
    );
  }
});

module.exports = ContractList;
