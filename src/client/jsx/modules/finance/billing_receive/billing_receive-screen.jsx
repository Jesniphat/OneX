var React       = require('react');
var Reflux      = require('reflux');
var tr          = require('counterpart');

var system      = require('ss-system');
var widget      = require('ss-widget');

var infoPanelActions  = system.infoPanelActions;
var billingActions  = require('./actions');

var FlexDropdown  = widget.FlexDropdown;
var FlexTextInput = widget.FlexTextInput;
var FlexButton    = widget.FlexButton;
var FlexDataTable = widget.FlexDataTable;
var FlexInputRange = widget.FlexInputRange;
var FlexCheckbox  = widget.FlexCheckbox;

var Screen = React.createClass({
  mixins: [
    Reflux.listenTo(billingActions.query.done, 'onQueryDoneAction'),
    Reflux.listenTo(billingActions.facet.done, 'onFacetDoneAction')
  ],

  getInitialState: function() {
    this.fields = {
      dateInFrom: {
        id:'dateInFrom',
        type:'date',
        label:'finance.billing_receive.date_in_from'
      },
      dateInTo: {
        id:'dateInTo',
        type:'date',
        label:'finance.billing_receive.date_in_to'
      },
      invoiceDateFrom: {
        id:'invoiceDateFrom',
        type:'date',
        label:'finance.billing_receive.invoice_date_from'
      },
      invoiceDateTo: {
        id:'invoiceDateTo',
        type:'date',
        label:'finance.billing_receive.invoice_date_to'
      },
      paidDateFrom: {
        id:'paidDateFrom',
        type:'date',
        label:'finance.billing_receive.paid_date_from'
      },
      paidDateTo: {
        id:'paidDateTo',
        type:'date',
        label:'finance.billing_receive.paid_date_to'
      },
      invoiceCode: {
        id:'invoiceCode',
        type:'text',
        label:'finance.billing_receive.invoice_code'
      },
      supplier: {
        id:'supplier',
        type:'text',
        label:'finance.billing_receive.supplier'
      },
      paidStatus: {
        id:'paidStatus',
        label:'finance.billing_receive.paid_status',
        list: [
          {value:'ALL', text:'ทั้งหมด'},
          {value:'W', text:tr.translate('finance.billing_receive.paid_status_W')},
          {value:'F', text:tr.translate('finance.billing_receive.paid_status_F')}
        ]
      },
      paidDate: {
        id:'paidDate',
        type:'date',
        label:'finance.billing_receive.paid_date'
      },
      remark: {
        id:'remark',
        type:'text',
        label:'finance.billing_receive.remark'
      },
      chkAll: {
        id:'chkAll',
        label:'finance.billing_receive.chk_all'
      }
    };
    this.itemFields = [
      {name:'date_in',type:'date',label:'finance.billing_receive.items.date_in',width:'80px'},
      {name:'shop_code',label:'finance.billing_receive.items.shop',width:'60px'},
      {name:'po_code',label:'finance.billing_receive.items.po',width:'100px'},
      {name:'invoice_code',label:'finance.billing_receive.items.invoice',width:'100px'},
      {name:'invoice_date',type:'date',label:'finance.billing_receive.items.invoice_date',width:'80px'},
      {name:'supplier_name',label:'finance.billing_receive.items.supplier',width:'80px'},
      {name:'product',label:'finance.billing_receive.items.product'},
      {name:'serial',label:'finance.billing_receive.items.serial',width:'80px'},
      {name:'barcode',label:'finance.billing_receive.items.barcode',width:'60px'},
      {name:'qty',type:'number',label:'finance.billing_receive.items.qty',width:'56px'},
      {name:'cost',type:'number',label:'finance.billing_receive.items.cost',width:'80px',render:function(row) {
        return helper.numberFormat(row.cost,2);
      }},
      {name:'remark',label:'finance.billing_receive.items.remark',width:'88px'},
      {name:'paid_date',type:'date',label:'finance.billing_receive.items.paid_date',width:'80px'},
      {name:'bill_no',type:'number',label:'finance.billing_receive.items.bill_no',width:'40px'},
      {name:'chk',type:'custom',label:'finance.billing_receive.items.check',width:'48px',render:function() {
        return (<input type="checkbox"/>);
      }}
    ];
    return {
      filter: {
        dateInFrom:'',
        dateInTo:'',
        invoiceDateFrom:'',
        invoiceDateTo:'',
        paidDateFrom:'',
        paidDateTo:'',
        invoiceCode:'',
        paidStatus:'W'
      },
      paidDate: '2015-07-20',
      chkAll:true,
      remark:'',
      itemData:[]
    };
  },

  componentDidMount: function() {
    infoPanelActions.show('finance.dashboard.index', null);
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

  handleChange: function(id, value) {
    var obj = {};
    obj[id] = value;
    this.setState(obj);
  },

  handleFilterChange: function(id, value) {
    console.log('id=', id, ',value=', value);
    this.state.filter[id] = value;
    this.setState({
      filter: this.state.filter
    });
  },


  render: function() {
    return (
      <div className="flex-form">
        <div className="flex-form flex">

        </div>
        <div className="box10 flex">
          <div className="box8">
            <div className="flex">
              <div className="panel2">
                <div className="title">
                  ค้นหารายการ
                </div>
              </div>
              <div className="panel6 flex">
                <FlexInputRange
                  type="date"
                  label="finance.billing_receive.date_in"
                  id_from="dateInFrom"
                  id_to="dateInTo"
                  onChange={this.handleFilterChange}
                  data_from={this.state.filter.dateInFrom}
                  data_to={this.state.filter.dateInTo}
                  />
                <div className="no-shrink" style={{width:'8px'}}></div>
                <FlexInputRange
                  type="date"
                  label="finance.billing_receive.paid_date"
                  id_from="paidDateFrom"
                  id_to="paidDateTo"
                  onChange={this.handleFilterChange}
                  data_from={this.state.filter.paidDateFrom}
                  data_to={this.state.filter.paidDateTo}
                  />
              </div>
            </div>
            <div className="panel8 flex">
              <div style={{width:'230px'}} className="no-shrink">
                <FlexTextInput
                  field={this.fields.invoiceCode}
                  data={this.state.filter}
                  onChange={this.handleFilterChange}
                  />
              </div>
              <div className="no-shrink" style={{width:'8px'}}></div>
              <div style={{width:'230px'}} className="no-shrink">
                <FlexTextInput
                  field={this.fields.supplier}
                  data={this.state.filter}
                  onChange={this.handleFilterChange}
                  />
              </div>
              <div className="no-shrink" style={{width:'8px'}}></div>
              <FlexInputRange
                type="date"
                label="finance.billing_receive.invoice_date"
                id_from="invoiceDateFrom"
                id_to="invoiceDateTo"
                onChange={this.handleFilterChange}
                data_from={this.state.filter.invoiceDateFrom}
                data_to={this.state.filter.invoiceDateTo}
                />
            </div>
          </div>
          <div className="box2">
            <div className="panel2">
              <FlexDropdown
                field={this.fields.paidStatus}
                data={this.state.filter}
                onChange={this.handleFilterChange}
                />
            </div>
            <div className="panel2">
              <FlexButton icon="search100" label="action.search" default={true}
                onClick={this.doQuery}/>
            </div>
          </div>
        </div>
        <div className="panel10" style={{height:'2px',minHeight:'2px'}}><div style={{height:'0',borderTop:'2px solid #ccc'}}></div></div>
        <div className="box10 flex">
          <div className="panel2">
            <FlexTextInput
              field={this.fields.paidDate}
              data={this.state}
              onChange={this.handleChange}
              />
          </div>
          <div className="panel2">
            <FlexCheckbox
              field={this.fields.chkAll}
              data={this.state}
              onChange={this.handleChange}
              />
          </div>
          <div className="panel4">
            <FlexTextInput
              field={this.fields.remark}
              data={this.state}
              onChange={this.handleChange}
              />
          </div>
          <div className="panel2">
            <FlexButton icon="email107" label="action.save" default={true}
              onClick={this.doSave}/>
          </div>
        </div>
        <div className="panel12">
          <FlexDataTable
            fields={this.itemFields}
            data={this.state.itemData}
            displayRows={10}
            />
        </div>
      </div>
    )
  }
});

module.exports = Screen;
