var React       = require('react');
var Reflux      = require('reflux');
var tr          = require('counterpart');
var T           = require('react-translate-component');

var system      = require('ss-system');
var widget      = require('ss-widget');
var sessionStore      = system.sessionStore;
var toasterActions    = system.toasterActions;
var infoPanelActions  = system.infoPanelActions;
var helper        = system.helper;

var actions  = require('./actions');

var FlexDropdown  = widget.FlexDropdown;
var FlexTextInput = widget.FlexTextInput;
var FlexButton    = widget.FlexButton;
var FlexDataTable = widget.FlexDataTable;
var FlexCheckbox  = widget.FlexCheckbox;

var Screen = React.createClass({
  mixins: [
    Reflux.listenTo(actions.queryForWaitList.done, 'onQueryForWaitListDoneAction'),
    Reflux.listenTo(actions.queryForWaitList.error, 'onQueryForWaitListErrorAction'),
    Reflux.listenTo(actions.queryForSupplier.done, 'onQueryForSupplierDoneAction'),
    Reflux.listenTo(actions.queryForSupplier.error, 'onQueryForSupplierErrorAction'),
    Reflux.listenTo(actions.facet.done, 'onFacetDoneAction')
  ],

  getInitialState: function() {
    var me = this;
    var staff = sessionStore.getSession().staff;
    this.searchFields = {
      invoice_code: {
        id:'invoice_code',
        type:'text',
        label:'finance.payment_voucher.invoice_code'
      },
      po_code: {
        id:'po_code',
        type:'text',
        label:'finance.payment_voucher.po_code'
      },
      invoice_date: {
        id:'invoice_date',
        type:'text',
        label:'finance.payment_voucher.invoice_date'
      },
      supplier: {
        id:'supplier',
        type:'text',
        label:'finance.payment_voucher.supplier'
      }
    };
    this.searchTable = [
      {name:'code',label:'finance.payment_voucher.search_table.code',width:'112px',render:function(row) {
        return (
          <div className="multiline">
            <div>P:<span className="green">{row.po_code}</span></div>
            <div>I:<span className="blue">{row.invoice_code}</span></div>
          </div>
        );
      }},
      {name:'product',label:'finance.payment_voucher.search_table.product',render:function(row) {
        return (
          <div className="multiline" style={{height:'40px',whiteSpace:'normal'}}>{row.product}</div>
        );
      }},
      {name:'serial',label:'finance.payment_voucher.search_table.serial_barcode',width:'160px',render:function(row) {
        return (
          <div className="multiline">
            <div className="green">S:{row.serial}</div>
            <div className="blue">B:{row.barcode}</div>
          </div>
        );
      }},
      {name:'cost',label:'finance.payment_voucher.search_table.cost',width:'88px',render:function(row) {
        return (
          <div className="multiline">
            <div className="right">{row.qty || 1} x</div>
            <div className="right">{helper.numberFormat(row.cost,2)}</div>
          </div>
        );
      }},
      {name:'chk',label:(
          <span
            className="flaticon-right244"
            title={tr.translate('finance.payment_voucher.search_table.select_all')}
            onClick={function() {me.addAllToVouher()}}
            />
        ),raw:true,width:'32px',render:function(row, i) {
          if (row.status=='W') {
            return (<span className="flaticon-right237" onClick={function(){me.addToVoucher(row, i)}}/>);
          } else {
            return null;
          }
      }}
    ];

    this.voucherFields = {
      code: {
        id:'code',
        type:'text',
        label:'finance.payment_voucher.voucher.code',
        readonly:true
      },
      paid_date: {
        id:'paid_date',
        type:'date',
        label:'finance.payment_voucher.voucher.paid_date'
      },
      supplier: {
        id:'supplier',
        type:'text',
        label:'finance.payment_voucher.voucher.supplier',
        readonly:true
      },
      staff: {
        id:'staff',
        type:'text',
        label:'finance.payment_voucher.voucher.staff',
        readonly:true
      },
      remark: {
        id:'remark',
        type:'text',
        label:'finance.payment_voucher.voucher.remark'
      },
      total_amount: {
        id:'total_amount',
        type:'number',
        label:'finance.payment_voucher.voucher.total_amount'
      },
      vat_amount: {
        id:'vat_amount',
        type:'number',
        label:'finance.payment_voucher.voucher.vat_amount'
      },
      cn_code: {
        id:'cn_code',
        type:'text',
        label:'finance.payment_voucher.voucher.cn_code'
      },
      cn_amount: {
        id:'cn_amount',
        type:'number',
        label:'finance.payment_voucher.voucher.cn_amount'
      },
      net_amount: {
        id:'net_amount',
        type:'number',
        label:'finance.payment_voucher.voucher.net_amount',
        readonly:true,
        render:function(row) {
          return helper.numberFormat(row.net_amount, 2);
        }
      },
      status: {
        id:'status',
        list:[
          {value:'DRAFT', text:tr.translate('finance.payment_voucher.voucher.status_DRAFT')},
          {value:'PROPOSE', text:tr.translate('finance.payment_voucher.voucher.status_PROPOSE')}
        ]
      }
    };

    this.voucherTable = [
      {name:'code',label:'finance.payment_voucher.voucher_table.code',width:'112px',render:function(row) {
        return (
          <div className="multiline">
            <div>P:<span className="green">{row.po_code}</span></div>
            <div>I:<span className="blue">{row.invoice_code}</span></div>
          </div>
        );
      }},
      {name:'product',label:'finance.payment_voucher.voucher_table.product',render:function(row) {
        return (
          <div className="multiline" style={{height:'40px',whiteSpace:'normal'}}>{row.product}</div>
        );
      }},
      {name:'serial',label:'finance.payment_voucher.voucher_table.serial_barcode',width:'160px',render:function(row) {
        return (
          <div className="multiline">
            <div className="green">S:{row.serial}</div>
            <div className="blue">B:{row.barcode}</div>
          </div>
        );
      }},
      {name:'cost',label:'finance.payment_voucher.voucher_table.cost',width:'88px',render:function(row) {
        return (
          <div className="multiline">
            <div className="right">{row.qty || 1} x</div>
            <div className="right blue">{helper.numberFormat(row.cost,2)}</div>
          </div>
        );
      }},
      {name:'vat_amount',label:'finance.payment_voucher.voucher_table.vat',width:'72px',render:function(row) {
        return (
          <div className="multiline">
            <div className="right">{helper.numberFormat(row.vat_rate,2)+'%'}</div>
            <div className="right blue">{helper.numberFormat(row.vat_amount,2)}</div>
          </div>
        );
      }},
      {name:'chk',label:(
          <span
            className="flaticon-clear5"
            title={tr.translate('finance.payment_voucher.voucher_table.remove_all')}
            onClick={function() {me.removeAllFromVoucher()}}
            />
        ),raw:true,width:'32px',render:function(row, i) {
        return (<span className="flaticon-clear5" onClick={function() {me.removeFromVoucher(row, i)}}/>);
      }}
    ];

    return {
      filter: {
        po_code:'',
        invoice_code:'',
        invoice_date:'',
        supplier:''
      },
      voucher: {
        code:'',
        paid_date:helper.dateToString(new Date()),
        supplier_id:0,
        supplier:'',
        staff_id:staff.id,
        staff:staff.display_name,
        remark:'',
        status:'DRAFT',
        total_amount:0,
        vat_amount:0,
        cn_code:'',
        cn_amount:0,
        net_amount:0
      },
      searchItems:[],
      voucherItems:[],
      prevStatus:'DRAFT'
    };
  },

  componentDidMount: function() {
    infoPanelActions.show('finance.dashboard', null);
  },

  onQueryDoneAction: function(result) {
    this.setState({
      data: result.data
    });
  },

  onFacetDoneAction: function(result) {
    this.setState({
      shopList: result.shops
    });
  },

  handleEnter: function(id, value) {
    actions.queryForWaitList({
      po_code: this.state.filter.po_code,
      invoice_code: this.state.filter.invoice_code,
      supplier: this.state.filter.supplier
    });
  },

  handleFilterChange: function(id, value) {
    this.state.filter[id] = value;
    this.setState({
      filter: this.state.filter
    });
  },

  handleVoucherChange: function(id, value) {
    if (id=='cn_amount') {
      value = helper.toNumber(value, 0);
    }
    this.state.voucher[id] = value;
    this.setState({
      voucher: this.state.voucher
    });
  },
  doQueryWaitingList: function() {
    if (this.state.filter.invoice_date) {
      actions.queyrForSupplier({
        date: this.state.filter.invoice_date
      });
      return;
    }
    actions.queryForWaitList({
      po_code: this.state.filter.po_code,
      invoice_code: this.state.filter.invoice_code,
      supplier: this.state.filter.supplier
    });
  },
  onQueryForWaitListDoneAction: function(result) {
    if (result.length==0) {
      toasterActions.pop({
        type:'warning',
        message:'ไม่พบรายการตามที่ระบุ'
      });
    }
    var existing = {};
    this.state.voucherItems.forEach(function(item) {
      existing[item.id] = true;
    });
    this.setState({
      searchItems: result.filter(function(row) {
        return !existing[row.id]
      })
    });
  },
  onQueryForWaitListErrorAction: function(error) {
    toasterActions.pop({
      type:'warning',
      message:error
    });
  },
  onQueryForSupplierDoneAction: function(result) {
  },
  onQueryForSupplierErrorAction: function(error) {
    toasterActions.pop({
      type:'warning',
      message:error
    });
  },
  addToVoucher: function(row, i) {
    this.state.voucherItems.unshift(this.state.searchItems[i]);
    this.state.searchItems.splice(i,1);
    this.setState({
      voucherItems: this.state.voucherItems,
      searchItems: this.state.searchItems
    });
  },
  addAllToVouher: function() {
    this.state.searchItems.forEach(function(row) {
      this.state.voucherItems.unshift(row);
    }.bind(this));
    var len = this.state.searchItems.length;
    for (var i = len-1; i >= 0; i--) {
      this.state.searchItems.splice(i,1);
    }
    this.setState({
      voucherItems: this.state.voucherItems,
      searchItems: this.state.searchItems
    });
  },
  removeFromVoucher: function(row, i) {
    this.state.voucherItems.splice(i, 1);
    this.setState({
      voucherItems: this.state.voucherItems
    });
  },
  removeAllFromVoucher: function() {
    this.setState({
      voucherItems:[]
    });
  },

  canSave: function() {

  },

  canPrint: function() {
    if (this.state.voucher.id) {
      return true;
    }
    return false;
  },

  doSave: function() {
    // check required
    if (this.state.voucherItems.length==0) {
      toasterActions.pop({type:'warning',message:'ยังไม่มีรายการ'});
      return;
    }
    var cn_amount = helper.toNumber(this.state.voucher.cn_amount);
    if (!isNaN(cn_amount) && cn_amount > 0 && this.state.voucher.cn_code.trim()=='') {
      toasterActions.pop({type:'warning',message:'กรุณาระบุ CREDIT NOTE'});
      this.refs.cn_code.setFocus();
      return;
    }
    if (this.state.voucher.cn_code.trim()==''
      && (isNaN(cn_amount) || cn_amount==0)) {
      this.refs.cn_amount.setFocus();
      return;
    }
    var net_amount = helper.toNumber(this.state.voucher.net_amount);
    if (isNaN(net_amount) || net_amount < 0) {
      toasterActions.pop({type:'warning',message:'ยอดเงินติดลบไม่ได้'});
      this.refs.net_amount.setFocus();
      return;
    }
  },

  doPrint: function() {
    console.log('doPrint');
  },
  render: function() {
    var searchSummary = {
      count:0,
      qty:0,
      amount:0
    };
    searchSummary = this.state.searchItems.reduce(function(prev, row) {
      return {
        count: prev.count+1,
        qty: prev.qty + row.qty,
        amount: prev.amount + row.qty*row.cost
      }
    }, searchSummary);
    var searchFooter = (
      <tr>
        <td>รวมรายการ</td>
        <td className="right">{searchSummary.count} รายการ</td>
        <td className="right">{searchSummary.qty} ชิ้น</td>
        <td className="right">{helper.numberFormat(searchSummary.amount,2)}</td>
        <td></td>
      </tr>
    );

    var voucherSummary = {
      count:0,
      qty:0,
      amount:0,
      vat_amount:0
    };

    voucherSummary = this.state.voucherItems.reduce(function(prev, row) {
      return {
        count: prev.count+1,
        qty: prev.qty + row.qty,
        amount: prev.amount + row.qty*row.cost,
        vat_amount: prev.vat_amount + row.vat_amount
      };
    }, voucherSummary);

    this.state.voucher.total_amount = voucherSummary.amount;
    this.state.voucher.vat_amount = voucherSummary.vat_amount;
    this.state.voucher.net_amount = this.state.voucher.total_amount + this.state.voucher.vat_amount - this.state.voucher.cn_amount;

    var voucherFooter = (
      <tr>
        <td>รวมรายการ</td>
        <td className="right">{voucherSummary.count} รายการ</td>
        <td className="right">{voucherSummary.qty} ชิ้น</td>
        <td className="right blue" style={{fontSize:'16px'}}>{helper.numberFormat(voucherSummary.amount,2)}</td>
        <td className="right green">{helper.numberFormat(voucherSummary.vat_amount,2)}</td>
        <td></td>
      </tr>
    );
    return (
      <div className="flex-form">
        <div className="flex-form flex">

        </div>
        <div className="box12 flex">
          <div className="box5">
            <div className="panel5 flex">
              <FlexTextInput
                field={this.searchFields.po_code}
                data={this.state.filter}
                onChange={this.handleFilterChange}
                onEnter={this.handleEnter}
                />
              <div style={{width:'8px'}} className="no-shrink"></div>
              <FlexTextInput
                field={this.searchFields.supplier}
                data={this.state.filter}
                onChange={this.handleFilterChange}
                />
            </div>
            <div className="panel5 flex">
              <FlexTextInput
                field={this.searchFields.invoice_code}
                data={this.state.filter}
                onChange={this.handleFilterChange}
                />
              <div style={{width:'8px'}} className="no-shrink"></div>
                <FlexTextInput
                  field={this.searchFields.invoice_date}
                  data={this.state.filter}
                  onChange={this.handleFilterChange}
                  />
            </div>
            <div className="panel5 flex">
              <FlexButton icon="search100" label="action.search" default={true}
                onClick={this.doQueryWaitingList}/>
            </div>
          </div>
          <div className="box7 flex">
            <div className="box5">
              <div className="panel5 flex">
                <FlexTextInput
                  field={this.voucherFields.code}
                  data={this.state.voucher}
                  onChange={this.handleVoucherChange}
                  />
                <div style={{width:'8px'}} className="no-shrink"></div>
                <FlexTextInput
                  field={this.voucherFields.paid_date}
                  data={this.state.voucher}
                  onChange={this.handleVoucherChange}
                  />
              </div>
              <div className="panel5 flex">
                <FlexTextInput
                  field={this.voucherFields.supplier}
                  data={this.state.voucher}
                  onChange={this.handleVoucherChange}
                  />
                <div style={{width:'8px'}} className="no-shrink"></div>
                <FlexTextInput
                  field={this.voucherFields.staff}
                  data={this.state.voucher}
                  onChange={this.handleVoucherChange}
                  />
              </div>
              <div className="panel5 flex">
                <FlexTextInput
                  field={this.voucherFields.remark}
                  data={this.state.voucher}
                  onChange={this.handleVoucherChange}
                  />
              </div>
            </div>
            <div className="box2">
              <div className="panel2">
                {this.state.voucher.status=='DRAFT' || this.state.voucher.status=='PROPOSE'
                  ? (
                    <FlexDropdown
                      field={this.voucherFields.status}
                      data={this.state.voucher}
                      onChange={this.handleVoucherChange}
                      />
                  ) : (
                    <T
                      content={'finance.payment_voucher.voucher.status_' + this.state.voucher.status}
                      component="div"
                      className={'title center '+(this.state.voucher.status=='REJECT' || this.state.voucher.status=='VOID' ? 'red':'blue')}/>
                  )
                }
              </div>
              <div className="panel2">
                <FlexButton icon="email107" label="action.save" default={true}
                  onClick={this.doSave}/>
              </div>
              <div className="panel2">
                <FlexButton icon="printer88" label="action.print" default={false}
                  onClick={this.doPrint}
                  disabled={!this.canPrint()}/>
              </div>
            </div>
          </div>
        </div>
        <div className="box12 flex">
          <div className="panel5" style={{borderRight:'1px solid #eee',paddingRight:'7px'}}>
            <FlexDataTable
              fields={this.searchTable}
              data={this.state.searchItems}
              key="id"
              displayRows={8}
              footer={searchFooter}
              />
          </div>
          <div className="panel7" style={{borderLeft:'1px solid #eee',paddingLeft:'7px'}}>
            <FlexDataTable
              fields={this.voucherTable}
              data={this.state.voucherItems}
              key="id"
              displayRows={8}
              footer={voucherFooter}
              />
            <div className="flex" style={{paddingTop:'4px'}}>
              <div className="can-grow"></div>
              <div className="no-shrink" style={{width:'228px'}}>
                <FlexTextInput
                  ref="cn_code"
                  field={this.voucherFields.cn_code}
                  data={this.state.voucher}
                  />
              </div>
              <div className="no-shrink" style={{width:'8px'}}></div>
              <div className="no-shrink" style={{width:'228px'}}>
                <FlexTextInput
                  ref="cn_amount"
                  field={this.voucherFields.cn_amount}
                  data={this.state.voucher}
                  onChange={this.handleVoucherChange}
                  />
              </div>
            </div>
            <div className="flex" style={{paddingTop:'4px'}}>
              <div className="can-grow"></div>
              <div className="no-shrink" style={{width:'228px'}}>
                <FlexTextInput
                  field={this.voucherFields.net_amount}
                  data={this.state.voucher}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Screen;
