var React = require('react');
var tr = require('counterpart');

var system = require('ss-system');
var widgets = require('ss-widget');
var toasterActions = system.toasterActions;
var helper = system.helper;// require('../../../../../server/lib/Helper');
var systemActions = system.systemActions;// require('../../system/actions');
var infoPanelActions = system.infoPanelActions;// require('../../../actions/info-panel');
var Router    = require('react-router');
var actions = require('./actions');

var FlexTextInput = widgets.FlexTextInput;// require('../../../widgets/flex-text-input.jsx');
var FlexButton    = widgets.FlexButton;// require('../../../widgets/flex-button.jsx');
var FlexDisplayTable    = widgets.FlexDisplayTable;// require('../../../widgets/flex-display-table.jsx');
var FlexDropdown  = widgets.FlexDropdown;// require('../../../widgets/flex-dropdown.jsx');
var FlexIcon = widgets.FlexIcon;
var FlexTab  = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');
var FlexCheckbox  = widgets.FlexCheckbox;
var FlexRadioGroup  = widgets.FlexRadioGroup;

var ReFlux = require('reflux');

var PaymentScreen = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState:function(){

    var nationid = this.context.router.getCurrentParams().id;
    var contractcode = this.context.router.getCurrentParams().contract_code;
    //console.log(nationid);
    return{
        data:{
          code:'',
          date:new Date().toJSON().slice(0,10).replace(/-/ig,'/'),
          amount:0.00,
          penalty:0.00,
          remark:'',
          product:'',
          card_id:nationid,
          status_discount:false
        },
        expand:{
          history:false,
          term:true
        },
        listTextFileData:[
          {numrow:'1',pos_tax_id:'D000991D9408A000830068',code:'555800233',location:'055357A',paid_date:'20150514113204',paid_amount:'1240'},
          {numrow:'2',pos_tax_id:'D000991D9408A000830068',code:'555800233',location:'055357A',paid_date:'20150514113204',paid_amount:'1240'},
          {numrow:'3',pos_tax_id:'D000991D9408A000830068',code:'555800233',location:'055357A',paid_date:'20150514113204',paid_amount:'1240'},
          {numrow:'4',pos_tax_id:'D000991D9408A000830068',code:'555800233',location:'055357A',paid_date:'20150514113204',paid_amount:'1240'},
          {numrow:'5',pos_tax_id:'D000991D9408A000830068',code:'555800233',location:'055357A',paid_date:'20150514113204',paid_amount:'1240'}
        ],
        paymentData:[],
        listPaymentHistory:[],
        field: {
          cust_id:{
            id:'cust_id',
            label:'pos.receipt.card_id',
            required:true,
            icon:'user158'
          }
        },
        fieldPaymentOption: {
          id:'list',
          icon:'user157',
          label:'pos.receipt.paymentoption',
          list:[]
        },
        selectedItem:1,
        selectedItemText:'เงินสด',
        paymentoption:[],
        textdata:{
          nationid:nationid,
          contractid:contractcode,
          other:''
        },
        selectData:{
          sellid:'',
          contractid:''
        },
        dataSave:{
          pay_date:'',
          pay_staff:'',
          shop_id:'',
          company_id:'',
          sell_id:'',
          cash:'',
          cr_card:'',
          transfer:'',
          balance:'',
          remark:'',
          contract_id:'',
          receipt_item:[],
          totalamount:0,
          status_discount:'N'
        },
        receipt_item:[],
        curTab:'tab1'
    }
  },

  onProductList:function(row){

    this.state.selectData.sellid=row.sell_id;
    this.state.selectData.contractid=row.id;
    this.state.dataSave.balance = row.balance;
    this.state.dataSave.from_system = row.from_system ;
    this.state.data.code = row.code;
    //console.log(row.product_detail);

    this.state.data.product = row.product_detail;
    console.log(this.state.data);
    this.state.receipt_item=[];
    this.state.dataSave.totalamount=0;
    actions.getPaymentTerm(this.state.selectData);

  },

  componentDidMount: function() {
  //  systemActions.setPageHeader('Hello World');
    actions.paymentOptionList();

    infoPanelActions.show('pos.receipt.list',
      <div className="box10">

      </div>
    );

    actions.getContractList(this.state.textdata);
    actions.getContractDetail(this.state.textdata);

  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  handleChange:function(id, value){
        this.state.data[id] = value;
        this.setState({
          data: this.state.data
        });
  },

  onCodeEnter:function(id,value){
    //console.log(value);
    //console.log(this.state.data.code);
    actions.getPaymentTerm(value);
  },

  handleListChange: function(id, value) {

    var payment_option = this.state.fieldPaymentOption.list.filter(function(payment) {
      return payment.value == value;
    });
    //console.log(payment_option);
    // this.state.selectedItemText = payment_option;
    this.setState({
      selectedItem: value,
      selectedItemText: payment_option[0].text
    });
  },

  onKeyUp:function(id,value){
    var _chk = 'N';
    if (id == 'card_id'){
      //console.log(value);
      //if(value != ''){
        this.state.textdata.nationid = value;
      //}
    }
    if (id == 'code'){
      //if(value != ''){
        this.state.textdata.contractid = value;
    //  }
    }
    if (id == 'other'){
      //if(value != ''){
        this.state.textdata.other = value;
      //}
    }
    if (this.state.textdata.nationid.length == 13){
      console.log(this.state.textdata.nationid.length);
      if (this.state.textdata.nationid != '' || this.state.textdata.contractid != '' || this.state.textdata.other != ''){
        actions.getContractList(this.state.textdata);
      }
    }

  },

  onPrintReceiptDoneAction: function(data){
    window.open(data.pdfFile);
  },

  doAddPayment: function(){
    //console.log(this.state.dataSave.amount);
    var _chkSave = 'Y';

    if (this.state.selectData.contractid == '' ){
      _chkSave = 'N';
      toasterActions.pop({
        type:'warning',
        message:'กรุณาเลือกสัญญาที่ต้องการชำระเงิน'
      });
    }

    if (this.state.data.date == '' && _chkSave =='Y'){
      _chkSave = 'N';
      toasterActions.pop({
        type:'warning',
        message:'กรุณาเลือกวันที่ชำระเงิน'
      });
    }

    if ((typeof this.state.data.amount == "undefined" || this.state.data.amount == 0 ) && _chkSave =='Y'){
      _chkSave = 'N';
      toasterActions.pop({
        type:'warning',
        message:'กรุณากรอกจำนวนเงิน'
      });
    }

    if (_chkSave == 'Y'){

      var TotalAmount = parseFloat(this.state.data.amount);
      var TotalPenalty = parseFloat(this.state.data.penalty);

      for (var i = 0; i < this.state.receipt_item.length; i++){
        TotalAmount = TotalAmount + parseFloat(this.state.receipt_item[i].amount);
        TotalPenalty = TotalPenalty + parseFloat(this.state.receipt_item[i].penalty);
      };

      var row = {
        num: (this.state.receipt_item.length + 1),
        pay_date: this.state.data.date,
        amount: this.state.data.amount,
        penalty: this.state.data.penalty,
        payment_option_id: this.state.selectedItem,
        paymentoption: this.state.selectedItemText,
        remark: this.state.data.remark
      };

      this.state.dataSave.amount = TotalAmount;
      this.state.dataSave.penalty = TotalPenalty;
      this.state.receipt_item.push(row);
      //console.log(this.state.dataSave.penalty);
      this.state.dataSave.totalamount = (TotalAmount + TotalPenalty);

      this.setState({
        receipt_item: this.state.receipt_item
      });

      this.state.data.amount=0;
      this.state.data.penalty=0;
      this.state.data.remark='';
      //console.log(this.state.dataSave.amount);
    }
  },

  onPaymentDelete:function(i){

    this.state.receipt_item.splice(i,1);

    var TotalAmount = 0;
    var TotalPenalty = 0;

    for (var i = 0; i < this.state.receipt_item.length; i++){
      TotalAmount = TotalAmount + parseFloat(this.state.receipt_item[i].amount);
      TotalPenalty = TotalPenalty + parseFloat(this.state.receipt_item[i].penalty);
    };
    this.state.dataSave.amount = TotalAmount;
    this.state.dataSave.penalty = TotalPenalty;

    this.state.dataSave.totalamount = (TotalAmount + TotalPenalty);

    this.setState({
      receipt_item: this.state.receipt_item
    });
  },

  doPaymentSave:function(){

    var _chkSave = 'Y';

    if (this.state.receipt_item.length == 0){
      _chkSave = 'N';
      toasterActions.pop({
        type:'warning',
        message:'กรุณาทำรายการชำระเงิน'
      });
    }

    if (_chkSave == 'Y'){
      this.state.dataSave.pay_date=this.state.data.date;
      this.state.dataSave.pay_staff = system.sessionStore.getSession().staff.id;
      this.state.dataSave.shop_id=system.sessionStore.getSession().staff.shop_id;
      this.state.dataSave.company_id='0';
      this.state.dataSave.sell_id=this.state.selectData.sellid;
      // this.state.dataSave.cash='0';
      // this.state.dataSave.cr_card='0';
      // this.state.dataSave.transfer='0';
      this.state.dataSave.code_year = new Date().toJSON().slice(2,7).replace('-','');
      this.state.dataSave.code_year_oracle = system.sessionStore.getSession().shop.code + '-R' + new Date().toJSON().slice(0,7).replace('-','') + '/';
      this.state.dataSave.payment_type = 'CONTRACT';

      //this.state.dataSave.penalty=this.state.data.penalty;
      this.state.dataSave.remark=this.state.data.remark;
      this.state.dataSave.contract_id=this.state.selectData.contractid;
      this.state.dataSave.receipt_item=this.state.receipt_item;
      this.state.dataSave.description = this.state.data.product;
      this.state.dataSave.status_discount = this.state.data.status_discount == true? 'Y':'N';

      actions.savePayment(this.state.dataSave);
    }
  },

  onRePrint:function(row){
    actions.printReceipt({contract_id:row.contract_id,receipt_id:row.id});
  },

  render: function() {

    var fields = {
      card_id:{
        id:'card_id',
        label:'pos.receipt.card_id',
        required:true,
        icon:'user158',
        maxLength:13,
        pattern:'^[0-9]{13}$'
      },
      code:{
        id:'code',
        label:'pos.receipt.code',
        icon:'list88'
      },
      amount:{
        id:'amount',
        label:'pos.receipt.amount',
        autofocus:true,
        required:true
      },
      totalamount:{
        id:'totalamount',
        label:'pos.receipt.totalamount',
        readonly:true
      },
      date:{
        id:'date',
        label:'pos.receipt.date',
        type:'date',
        icon:'user158',
        required:true
      },
      penalty:{
        id:'penalty',
        label:'pos.receipt.penalty'
      },
      other:{
        id:'other',
        label:'pos.receipt.other',
        icon:'smartphone20'
      },
      payment_type:{
        id:'payment_type',
        type:'dropdown',
        label:'pos.receipt.type',
        icon:'list88',
        list: [
          {value:'เงินสด', text:'เงินสด'},
          {value:'บัตรเครดิต', text:'บัตรเครดิต'}
        ]
      },
      remark:{
        id:'remark',
        label:'pos.receipt.remark',
        icon:'list88'
      },
      status_discount:{
        id:'status_discount',
        label:'pos.receipt.status_discount',
        type:'checkbox'
      }
    };

    var textFileField = [
      {name:'num',label:'pos.receipt.no',width:40,render:function(row){
        return row.numrow;
      }},
      {name:'pos_tax_id',label:'pos.receipt.no',width:150,render:function(row){
        return row.pos_tax_id;
      }},
      {name:'code',label:'pos.receipt.no',width:150,render:function(row){
        return row.code;
      }},
      {name:'paid_date',label:'pos.receipt.date',width:150,render:function(row){
        var pay_date = '-';
        if (row.paid_date != '0000-00-00'){
          pay_date = <div>{tr.localize(new Date(row.paid_date),{type:'date',format:'long'})}<span style={{color:"red"}}>{row.diffday}</span></div>;
        }
        return pay_date;
      }},
      {name:'paid_amount',label:'pos.receipt.paid_amount',width:100, className:'right',render:function(row){
        return <div><div className="right" style={{width:"80px"}} >{helper.numberFormat(row.paid_amount,2)}</div></div>;
      }},
    ];

    return(
      <div className="content-page">
        <div className="content-body panelf">
          <div className="panelf can-grow">
            <div>{this.state.data.product}</div>
          </div>
          <div className="box10 flex flex-form">
            <div className="panel4">
                <FlexTextInput
                  field={fields.card_id}
                  data={this.state.data}
                  onChange={this.handleChange}
                  onKeyUp={this.onKeyUp}
                  onKeyDown={this.onKeyDown}
                  />
            </div>
          </div>
          <div className="panel10">
            <FlexDisplayTable
                fields={textFileField}
                data={this.state.listTextFileData}
                displayRows={10}
            />
          </div>
        </div>
      </div>

    );
  }
});

module.exports = PaymentScreen;
