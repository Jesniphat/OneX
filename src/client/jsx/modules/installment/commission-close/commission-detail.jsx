var React         = require('react');
var Reflux        = require('reflux');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var actions       = require('./actions');

var helper        = system.helper;
var toasterActions = system.toasterActions;
var infoPanelActions  = system.infoPanelActions;

var FlexDataTable = widgets.FlexDataTable;
var FlexTextInput = widgets.FlexTextInput;
var FlexDropdown  = widgets.FlexDropdown;
var FlexButton    = widgets.FlexButton;
var FlexTab       = widgets.FlexTab;

var statusName = {
  NORMAL: 'ปกติ',
  DEBT:'ค้างชำระ',
  CLOSE_CANCEL:'ปิด/ยกเลิก',
  CLOSE_NORMAL:'ปิด/ปกติ',
  CLOSE_RETURN:'ปิด/คืนของ',
  CLOSE_CONFISCATE:'ปิด/ยึดของ',
  CLOSE_BAD_DEBT:'ปิด/หนี้สูญ'
};

var CommissionDetail = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(actions.facetDetail.done, 'onFacetDetailDoneAction'),
    Reflux.listenTo(actions.facetDetail.error, 'onFacetDetailErrorAction'),
    Reflux.listenTo(actions.commissionDetail.done, 'onCommissionDetailDoneAction'),
    Reflux.listenTo(actions.commissionDetail.error, 'onCommissionDetailErrorAction'),
    Reflux.listenTo(actions.saveCommission.done, 'onSaveCommissionDoneAction'),
    Reflux.listenTo(actions.saveCommission.error, 'onSaveCommissionErrorAction')
  ],

  getInitialState: function() {
    var param = this.context.router.getCurrentParams();
    var paid_year = parseInt(param.term_year);
    var paid_month = parseInt(param.term_month)+1;
    if (paid_month > 12) {
      paid_year++;
      paid_month = 1;
    }

    return {
      term_year: param.term_year,
      term_month: param.term_month,
      paid_year: ''+paid_year,
      paid_month: ('0'+paid_month).substr(-2),
      shop_id: parseInt(param.shop_id),
      data: {},
      chkAll:true,
      commissionPayment: [],
      selectedTab:'normal',
      tabList: [
        {id:'normal',text:'NORMAL',raw:true},
        {id:'cancel',text:'CANCEL',raw:true},
        {id:'return',text:'RETURN',raw:true},
        {id:'confiscate',text:'CONFISCATE',raw:true},
        {id:'bad_debt',text:'BAD_DEBT',raw:true},
      ],
      normal_list:[],
      cancel_list:[],
      return_list:[],
      confiscate_list:[],
      bad_debt_list:[],
      commissionPaymentFields: [
        {name:'summary_period', label:'installment.commission-close.payment.summary_period', width:48},
        {name:'paid_period', label:'installment.commission-close.payment.paid_period', width:48},
        {name:'num_contract', label:'installment.commission-close.payment.num_contract', width:32},
        {name:'profit_amount', label:'installment.commission-close.payment.profit_amount', width:80, className:'right', render:function(row) {
          return helper.numberFormat(row.profit_amount, 2);
        }},
        {name:'paid_pct', label:'installment.commission-close.payment.paid_pct', width:56, className:'right', render:function(row) {
          return helper.numberFormat(row.paid_pct,2);
        }},
        {name:'paid_amount', label:'installment.commission-close.payment.paid_amount', width:80, className:'right', render:function(row) {
          return helper.numberFormat(row.paid_amount,2);
        }},
        {name:'authorized_date', label:'installment.commission-close.payment.authorized_date', width:72, render:function(row) {
          return tr.localize(new Date(row.authorized_date), {type:'date', format:'short'});
        }},
        {name:'remark', label:'installment.commission-close.payment.remark'}
      ],
      contractFields: [
        {name:'chk',raw:true, label: null, width:24,render:function(row, i) {
          return (
            <input type="checkbox"
              checked={row.chk && row.comm_close_payment_id==0 }
              disabled={row.comm_close_payment_id>0}
              onChange={
                function() {
                  this.toggleCheckBox(i);
                }.bind(this)
              }/>);
        }.bind(this)},
        {name:'no',label:'installment.commission-close.contract.no',width:40,className:'right',render:function(row,i) {
          return i+1;
        }},
        {name:'close_date', label:'installment.commission-close.contract.close_date', width:80, render:function(row) {
          return tr.localize(new Date(row.close_date), {type:'date',format:'short'});
        }},
        {name:'sell_date', label:'installment.commission-close.contract.close_date', width:80, render:function(row) {
          return tr.localize(new Date(row.sell_date), {type:'date',format:'short'});
        }},
        {name:'code', label:'installment.commission-close.contract.code', width:72, render:function(row) {
          return <span title={row.code}>{row.code.substr(8,2)+'-'+row.code.substr(10,5)}</span>;
        }},
        {name:'product', label:'installment.commission-close.contract.product'},
        {name:'total_paid', label:'installment.commission-close.contract.total_paid', width:80, className:'right', render: function(row) {
          return helper.numberFormat(row.total_paid, 2);
        }},
        {name:'cost', label:'installment.commission-close.contract.cost', width:80, className:'right', render: function(row) {
          return helper.numberFormat(row.cost, 2);
        }},
        {name:'fee', label:'installment.commission-close.contract.fee', width:64, className:'right', render: function(row) {
          return helper.numberFormat(row.fee, 2);
        }},
        {name:'install_cost', label:'installment.commission-close.contract.install_cost', width:64, className:'right', render:function(row) {
          return helper.numberFormat(row.install_cost, 2);
        }},
        {name:'profit', label:'installment.commission-close.contract.profit', width:80, className:'right', render: function(row) {
          return helper.numberFormat(row.profit, 2);
        }},
        {name:'current_status', label:'installment.commission-close.contract.status', width:60, render:function(row) {
          return statusName[row.current_status];
        }},
        {name:'paid_status', label:'installment.commission-close.contract.commision_paid', width:64, render:function(row) {
          if (row.comm_close_payment_id==0) {
            return '';
          }
          return row.paid_period;
        }}
      ],
      fields: {
        profit_amount: {
          id:'profit_amount',
          label:'installment.commission-close.profit_amount',
          readonly:true,
          render: function(row) {
            return helper.numberFormat(row.profit_amount, 2);
          }
        },
        num_contract: {
          id:'num_contract',
          type:'number',
          label:'installment.commission-close.total_contract',
          readonly:true
        },
        paid_pct: {
          id:'paid_pct',
          type:'number',
          label:'installment.commission-close.paid_pct'
        },
        paid_amount: {
          id:'paid_amount',
          label:'installment.commission-close.paid_amount',
          readonly:true,
          render: function(row) {
            return helper.numberFormat(row.paid_amount, 2);
          }
        },
        term_year: {
          id:'paid_year',
          type:'number',
          label:'installment.commission-close.term_year'
        },
        term_month: {
          id:'paid_month',
          type:'number',
          label:'installment.commission-close.term_month'
        },
        remark: {
          id:'remark',
          label:'installment.commission-close.remark'
        }
      },
      shopField: {
        id:'shop_id',
        label:'installment.commission-close.filter_shop',
        list:[]
      },
      staffField: {
        id:'staff_id',
        label:'installment.commission-close.filter_staff',
        list:[]
      }
    }
  },

  componentDidMount: function() {
    this.doRefreshFacet();
    this.doRefresh();
    infoPanelActions.show('installment.commission-close.list', null);
  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  checkAll: function() {
    this.state.chkAll = !this.state.chkAll;
    this.state.contractList.forEach(function(contract) {
      if (contract.comm_close_payment_id==0) {
        contract.chk = this.state.chkAll;
      }
    }.bind(this));
    this.calculatePayment();
  },

  toggleCheckBox: function(i) {
    this.state.contractList[i].chk = !this.state.contractList[i].chk;
    this.state.chkAll = true;
    for (var j = 0; j < this.state.contractList.length; j++) {
      if (!this.state.contractList[j].chk && this.state.contractList[j].comm_close_payment_id==0) {
        this.state.chkAll = false;
        break;
      }
    }
    this.calculatePayment();
    // this.setState({
    //   chkAll: this.state.chkAll,
    //   contractList: this.state.contractList
    // });
  },

  doRefreshFacet: function() {
    actions.facetDetail({
      term_year: this.state.term_year,
      term_month: this.state.term_month
    });
  },

  doRefresh: function() {
    actions.commissionDetail({
      shop_id: this.state.shop_id,
      term_year: this.state.term_year,
      term_month: this.state.term_month,
    })
  },

  onFacetDetailDoneAction: function(result) {
    this.state.shopField.list = result.shops.map(function(shop) {
      return {value:shop.id, text:shop.code+' '+shop.name};
    }.bind(this));
    this.setState({
      shopField: this.state.shopField
    });
  },

  onFacetDetailErrorAction: function(err) {
    toasterActions.pop({
      type:'warning',
      message:err
    });
  },

  calculatePayment: function() {
    var profit_amount = 0;
    var num_contract = 0;
    this.state.contractList.forEach(function(row) {
      if (row.chk) {
        profit_amount += row.profit;
        num_contract++;
      }
    });
    var paid_amount = parseFloat((profit_amount * this.state.paid_pct / 100.0).toFixed(2));
    this.setState({
      contractList: this.state.contractList,
      num_contract: num_contract,
      profit_amount: profit_amount,
      paid_amount: paid_amount
    });
  },

  onCommissionDetailDoneAction: function(result) {
//    result.contracts[0].comm_close_payment_id = 5;
    var obj = {
      normal_list:[],
      cancel_list:[],
      return_list:[],
      confiscate_list:[],
      bad_debt_list:[],
      commissionPayment: result.commissions
    };
    result.contracts.forEach(function(row) {
      if (row.comm_close_payment_id==0) {
        row.chk = true;
      } else {
        row.chk = false;
      }
      obj[row.status.substr(6).toLowerCase()+'_list'].push(row);
    });
    console.log(obj);
    this.setState(obj, function() {
//      this.calculatePayment();
    }.bind(this));
  },

  onCommissionDetailErrorAction: function(e) {
    toasterActions.pop({
      type: 'warning',
      message:e
    });
  },

  doCommissionSave: function() {
    var list = [];
    this.state.contractList.forEach(function(contract) {
      if (contract.chk) {
        list.push(contract.id);
      }
    });
    var param = {
      staff_id:this.state.staff_id,
      summary_period:this.state.term_year.substr(-2) + '/' + this.state.term_month,
      paid_period:this.state.paid_year.substr(-2) + '/' + this.state.paid_month,
      num_contract:this.state.num_contract,
      profit_amount:this.state.profit_amount,
      paid_pct:this.state.paid_pct,
      paid_amount:this.state.paid_amount,
      authorized_date:helper.dateToString(new Date()),
      remark:this.state.remark,
      contracts:list
    };
    actions.saveCommission(param);
  },

  onSaveCommissionDoneAction: function() {
    this.doRefresh();
    toasterActions.pop({
      type:'success',
      message:'result.save.ok'
    });
  },

  onSaveCommissionErrorAction: function(e) {
    toasterActions.pop({
      type:'warning',
      message:e
    });
  },

  handleShopChange: function(id, value) {
    if (this.shopList[value]) {
      var found = false;
      this.state.staffField.list = this.shopList[value].staffs.map(function(staff) {
        if (staff.id == this.state.staff_id) {
          found = true;
        }
        return {
          value: staff.id,
          text: staff.name + ' (' + staff.num_con + ')'
        };
      }.bind(this));

      if (!found) {
        this.state.staff_id = 0;
      }
    } else {
      this.state.staff_id = 0;
    }
    this.setState({
      shop_id: this.state.shiop_id,
      staff_id: this.state.staff_id,
      staffField: this.state.staffField
    });
  },

  handleStaffChange: function(id, value) {
    this.setState({
      staff_id: value
    }, function() {
      this.doRefresh();
    }.bind(this));
  },

  handleChangePct: function(id, value) {
    var pct = parseFloat(value);
    if (isNaN(pct) || pct < 0) {
      pct = 0;
    }
    this.state.paid_pct = pct;
    this.calculatePayment();
  },

  handleChange: function(id, value) {
    if (id=='term_month') {
      if (value >= 12) {
        value = 12;
      }
      if (value < 1) {
        value = 1;
      }
      value = ('0'+value).substr(-2);
    }
    this.state[id] = value;
    var obj = {};
    obj[id] = value;
    this.setState(obj);
  },

  handleTabClick: function(id) {
    this.setState({
      selectedTab: id
    });
  },

  render: function() {
    this.state.contractFields[0].label = (<input type="checkbox" checked={this.state.chkAll} onChange={this.checkAll}/>);
    return (
      <div>
        <div className="content-header box10 flex flex-form">
          <div className="panelf can-grow">
            <T content="installment.commission-close.title.detail" component="h2" />
          </div>
          <div className="panel2 right">
            {this.state.term_year + '/' + this.state.term_month}
          </div>
          <div className="panel3 flex">
            <FlexDropdown
              field={this.state.shopField}
              data={this.state}
              onChange={this.handleShopChange}
              />
          </div>
        </div>
        <div className="box10 flex-form">
          <div className="panel10">
            XXX
          </div>
          <div className="panel10">
            <FlexTab list={this.state.tabList} selected={this.state.selectedTab} onClick={this.handleTabClick}/>
          </div>
          <div className="panel10" style={{display:this.state.selectedTab=='normal'?null:'none'}}>
            <FlexDataTable
              fields={this.state.contractFields}
              data={this.state.normal_list}
              displayRows={6}
              />
          </div>
          <div className="panel10" style={{display:this.state.selectedTab=='cancel'?null:'none'}}>
            <FlexDataTable
              fields={this.state.contractFields}
              data={this.state.cancel_list}
              displayRows={6}
              />
          </div>
          <div className="panel10" style={{display:this.state.selectedTab=='return'?null:'none'}}>
            <FlexDataTable
              fields={this.state.contractFields}
              data={this.state.return_list}
              displayRows={6}
              />
          </div>
          <div className="panel10" style={{display:this.state.selectedTab=='confiscate'?null:'none'}}>
            <FlexDataTable
              fields={this.state.contractFields}
              data={this.state.confiscate_list}
              displayRows={6}
              />
          </div>
          <div className="panel10" style={{display:this.state.selectedTab=='bad_debt'?null:'none'}}>
            <FlexDataTable
              fields={this.state.contractFields}
              data={this.state.bad_debt_list}
              displayRows={6}
              />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CommissionDetail;
