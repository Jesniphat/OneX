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

var dialogActions = system.dialogActions;
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
  mixins:[
    ReFlux.listenTo(actions.getPaymentTerm.done,'onGetPaymentTermDoneAction'),
    ReFlux.listenTo(actions.paymentOptionList.done,'onGetPaymentOptionDoneAction'),
    ReFlux.listenTo(actions.getContractList.done,'onGetContractListDoneAction'),
    ReFlux.listenTo(actions.savePayment.done,'onSavePaymentDoneAction'),
    ReFlux.listenTo(actions.printReceipt.done,'onPrintReceiptDoneAction'),
    ReFlux.listenTo(actions.getContractDetail.done,'onGetContractDetailDoneAction'),
    ReFlux.listenTo(actions.getHistoryPaymentTerm.done,'onGetHistoryPaymentTermDoneAction'),
    ReFlux.listenTo(actions.getFinanceList.done,'onGetFinanceListDoneAction'),
    ReFlux.listenTo(actions.voidPayment.done,'onVoidPaymentDoneAction'),
    ReFlux.listenTo(actions.voidPayment.error,'onVoidPaymentErrorAction'),
    ReFlux.listenTo(actions.checkOndate.done,'onCheckOndateDoneAction'),
    ReFlux.listenTo(actions.checkCloseCashDaily.done,'onCheckCloseCashDailyDoneAction')
  ],
  getInitialState:function(){

    var nationid = this.context.router.getCurrentParams().id;
    var contractcode = this.context.router.getCurrentParams().contract_code;
    var flagRedeem = this.context.router.getCurrentParams().redeem;
    this.flagDupSave = false;
    //console.log(nationid);
    return{
        checkSave:false,
        contract_status:'NORMAL',
        data:{
          code:'',
          date:system.sessionStore.getSession().staff.cur_date,
          amount:0.00,
          penalty:0.00,
          remark:'',
          product:'',
          card_id:nationid,
          status_discount:false,
          confirm_discount:'',
          confirm_savedup:'',
          max_termnum:''
        },
        expand:{
          history:false,
          term:true
        },
        listProductData:[],
        paymentData:[],
        max_paiddate:'0000-00-00',
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
        fieldFinanceList: {
          id:'financelist',
          icon:'user157',
          label:'pos.receipt.financelist',
          list:[]
        },
        selectedItem:1,
        selectedItemText:'เงินสด',
        selectedFinanceItem:'',
        selectedFinanceItemText:'',
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
          status_discount:'N',
          cust_name:'',
          contract_code:'',
          finance_staff:'',
          receipt_remark:'',
          receipt_option:'',
          flagRedeem:flagRedeem
        },
        receipt_item:[],
        curTab:'tab1',
        flagSave:false
    }
  },

  onGetPaymentOptionDoneAction: function(data){
    this.state.fieldPaymentOption.list = data.paymentoption.map(function(row) {
      return {
        value: row.id,
        text: row.name
      }
    });
    this.setState({
      fieldPaymentOption: this.state.fieldPaymentOption
    });
  },

  onGetFinanceListDoneAction: function(data){
    console.log('jack=',data);
    this.state.fieldFinanceList.list = data.financelist.map(function(row) {
      return {
        value: row.id,
        text: row.display_name
      }
    });

    this.setState({
      selectedFinanceItem: data.finance_staff_id,
      fieldFinanceList: this.state.fieldFinanceList
    });

  },

  onVoidPaymentDoneAction: function(res){
    if (res.status===true){
      toasterActions.pop({
        type:'success',
        message:'ยกเลิกรายการชำระเงินสำเร็จ'
      });
      actions.getContractList(this.state.textdata);
      actions.getPaymentTerm(this.state.selectData);
      actions.getHistoryPaymentTerm(this.state.selectData);
      this.flagDupSave = false;
      this.state.data.amount=0;
      this.state.data.penalty=0;
      this.state.data.remark='';
      this.state.receipt_item=[];
      this.state.dataSave.totalamount = 0;
      this.setState({
        flagSave : false
      });
    }else{
      console.log('jack error');
      toasterActions.pop({
        type:'warning',
        message:'ยกเลิกรายการชำระเงิน ไม่สำเร็จ'
      });
    }

  },

  onVoidPaymentErrorAction:function(res){
    if (res.status===false){
      toasterActions.pop({
        type:'warning',
        message:'ยกเลิกรายการชำระเงิน ไม่สำเร็จ'
      });
      actions.getHistoryPaymentTerm(this.state.selectData);
      this.flagDupSave = false;
      this.state.data.amount=0;
      this.state.data.penalty=0;
      this.state.data.remark='';
      this.state.receipt_item=[];
      this.state.dataSave.totalamount = 0;
      this.setState({
        flagSave : false
      });
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

  onGetContractListDoneAction: function(data){

    //console.log('donelist', data);
    var $scope = {};
  //  console.log('status=',data.contractlist);
    this.state.contract_status = data.contractlist[0].current_status;
  //  console.log('checkSave :',this.state.checkSave);
    if (data.contractlist[0].current_status == 'NORMAL' || data.contractlist[0].current_status == 'DEBT'){
      this.state.checkSave = false;
    }else{
      this.state.checkSave = true;
    }

    var person = data.person.map(function(row,i){
      $scope.cust_name = row.fullname;
      return (<div key={i} className="flex-v no-shrink">
        <div style={{borderBottom:"solid 1px #000",width:"170px"}}>
          <h2>2.เลือกรายการ</h2>
        </div>
        <div style={{height:"5px"}}></div>
        <div>{row.fullname}</div><div >{row.nationid}</div>
        <div style={{height:"5px",borderBottom:"solid 1px #000",width:"170px"}}></div>
        </div>);
    });
    var list = data.contractlist.map(function(row,i){
        var f = function() {
          this.onProductList(row)
        }.bind(this);
        return (<table key={row.id} style={{width:"150px",fontSize:"14px",borderSpacing:"0",cursor:"pointer"}}>
          <tr onClick={f} style={(i%2 == 0)?{backgroundColor:"#f9f9f9"}:{backgroundColor:"#fff"}}>
            <td colSpan="2" style={{height:"5px"}}></td>
          </tr>
          <tr onClick={f} style={(i%2 == 0)?{backgroundColor:"#f9f9f9"}:{backgroundColor:"#fff"}}>
            <td colSpan="2">{i+1}.{row.product_detail}</td>
          </tr>
          <tr onClick={f} style={(i%2 == 0)?{backgroundColor:"#f9f9f9"}:{backgroundColor:"#fff"}}>
            <td >ยอดจัด</td>
            <td style={{textAlign:"right"}}>{helper.numberFormat(row.payment_price,2)}</td>
          </tr>
          <tr onClick={f} style={(i%2 == 0)?{backgroundColor:"#f9f9f9"}:{backgroundColor:"#fff"}}>
            <td style={{borderBottom:"dotted 1px #cbcbcb"}}>ค้าง</td>
            <td style={{textAlign:"right",borderBottom:"dotted 1px #cbcbcb"}}>{helper.numberFormat(row.balance,2)}</td>
          </tr>
        </table>
        );
    }.bind(this));

    infoPanelActions.show('pos.receipt.list',
      <div className="flex-v">
        {person}
        <div  className="flex-v can-grow" style={{overflowY:'auto'}}>
          {list}
        </div>
      </div>
      );

      this.state.dataSave.cust_name = $scope.cust_name;

      this.setState({
        checkSave:this.state.checkSave,
        contract_status:this.state.contract_status,
        dataSave:this.state.dataSave
      });

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
    actions.checkCloseCashDaily();

  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  handleChange:function(id, value){
      //console.log('data=',value);
      if (id == 'date'){
        var curDate = new Date(system.sessionStore.getSession().staff.cur_date);
        var selectDate = new Date(value);
        if(selectDate > curDate){
          value = system.sessionStore.getSession().staff.cur_date;
          toasterActions.pop({
            type:'warning',
            message:'ไม่สามารถเลือกวันที่ล่วงหน้าได้'
          });
        }else{
          if(selectDate != curDate){
            var obj = {selectDate:value};
            actions.checkOndate(obj);
          }
        }
      }

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

  onGetPaymentTermDoneAction:function(data){
    //console.log(system.sessionStore.getSession());
    var flagSave = data.flagSave;
        if (this.state.checkSave == true){
          flagSave = true;
        }

    this.setState({
      listProductData:data.contract,
      paymentData:data.payment,
      max_paiddate:data.max_paiddate,
      checkSave: flagSave
    });

  },

  handleListChange: function(id, value) {

    if (id == 'financelist'){
      var _financeList = this.state.fieldFinanceList.list.filter(function(finance) {
        return finance.value == value;
      });

      this.setState({
        selectedFinanceItem: value,
        selectedFinanceItemText: _financeList[0].text
      });
    }else{
      var payment_option = this.state.fieldPaymentOption.list.filter(function(payment) {
        return payment.value == value;
      });

      this.setState({
        selectedItem: value,
        selectedItemText: payment_option[0].text
      });
    }
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

  onSavePaymentDoneAction: function(data){
    toasterActions.pop({
      type:'success',
      message:'บันทึกข้อมูลเรียบร้อย'
    });
    actions.getContractList(this.state.textdata);
    actions.getPaymentTerm(this.state.selectData);
    actions.getHistoryPaymentTerm(this.state.selectData);
    this.state.dataSave.receipt_id = data.receipt_id;
    //console.log(this.state.data.receipt_id);
    //console.log('print');
    actions.printReceipt(this.state.dataSave);

    this.state.data.amount=0;
    this.state.data.penalty=0;
    this.state.data.remark='';
    this.state.receipt_item=[];
    this.state.dataSave.totalamount = 0;
    this.flagDupSave = false;
    this.setState({
      flagSave : false
    });

    if(this.state.dataSave.flagRedeem == 'Y'){
      console.log('redirect');
      this.context.router.transitionTo('pos.receipt.screen', {id:this.state.textdata.nationid,contract_code:this.state.textdata.contractid,redeem:'N'});
    }

  },

  onGetContractDetailDoneAction: function(data){

    //console.log(data);
    //this.state.data.code = data.contractdetail[0].code;
    this.state.selectData.sellid=data.contractdetail[0].sell_id;
    this.state.selectData.contractid=data.contractdetail[0].id;
    this.state.dataSave.balance = data.contractdetail[0].balance;
    this.state.dataSave.from_system = data.contractdetail[0].from_system ;
    this.state.data.code = data.contractdetail[0].code;
    //console.log(row.product_detail);
    this.state.data.product = data.contractdetail[0].product_detail;
    this.state.data.status_discount = data.contractdetail[0].status_discount == 'Y'? true : false;
    //console.log(this.state.data);
    this.state.receipt_item=[];
    actions.getPaymentTerm(this.state.selectData);

    actions.getHistoryPaymentTerm(this.state.selectData);

    this.setState({
      selectedFinanceItem:data.contractdetail[0].finance_staff_id
    });
    var contracttype = data.contractdetail[0].type;
    var shop_id = system.sessionStore.getSession().shop.id;
    var contract_id = data.contractdetail[0].id;
    var finance_id = data.contractdetail[0].finance_staff_id;
    var sell_staff_id = data.contractdetail[0].sell_staff_id;
    actions.getFinanceList(shop_id,contract_id,finance_id,contracttype,sell_staff_id);

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
      var ReceiptRemark = '';
      for (var i = 0; i < this.state.receipt_item.length; i++){
        TotalAmount = TotalAmount + parseFloat(this.state.receipt_item[i].amount);
        TotalPenalty = TotalPenalty + parseFloat(this.state.receipt_item[i].penalty);
        if(ReceiptRemark != ''){
          ReceiptRemark = ReceiptRemark + this.state.receipt_item[i].remark;
        }else{
          ReceiptRemark = this.state.receipt_item[i].remark;
        }
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
    console.log('flagDupSave:',this.flagDupSave);
    //console.log(system.sessionStore.getSession().shop.id);
    if (this.flagDupSave == false){

      this.setState({
        flagSave : this.state.flagSave == false ? true : this.state.flagSave
      });

      this.flagDupSave = this.flagDupSave == false ? true : this.flagDupSave;

      var _chkSave = 'Y';

      if (this.state.receipt_item.length == 0){
        _chkSave = 'N';
        this.flagDupSave = false;
        this.setState({
          flagSave : false
        });
        toasterActions.pop({
          type:'warning',
          message:'กรุณาทำรายการชำระเงิน'
        });
      }

      if (_chkSave == 'Y'){

        if(this.state.data.status_discount === true){
        var a = this;
        dialogActions.show({
            title: 'receipt.confirm_discount_title',
            content: this.createParameter(),
            actions:[
              {id:'ok', icon:'check52', label:'action.confirm'},
              {id:'cancel', icon:'close47', label:'action.cancel', default:true}
            ]
          }, function(isCancel, action_id) {
            if (isCancel || action_id=='cancel') {
              a.flagDupSave = false;
              a.setState({
                flagSave : false
              });
              return;
            }else{
                a.onActionSave();
            }
          });
        }else{
          //console.log('max_paiddate:',this.state.max_paiddate);
          //console.log('cur_date:',system.sessionStore.getSession().staff.cur_date);
          if (this.state.max_paiddate == this.state.data.date){
            var a = this;
            dialogActions.show({
                title: 'receipt.confirm_savedup_title',
                content: this.createParameterSaveDup(),
                actions:[
                  {id:'ok', icon:'check52', label:'action.confirm'},
                  {id:'cancel', icon:'close47', label:'action.cancel', default:true}
                ]
              }, function(isCancel, action_id) {
                if (isCancel || action_id=='cancel') {
                  a.flagDupSave = false;
                  a.setState({
                    flagSave : false
                  });
                  return;
                }else{
                  if (a.state.data.confirm_savedup != ''){
                      a.onActionSave();
                  }else{
                    a.flagDupSave = false;
                    a.setState({
                      flagSave : false
                    });
                    toasterActions.pop({
                      type:'warning',
                      message:'กรุณากรอกข้อความยืนยัน'
                    });
                  }
                }
              });
          }else{
            console.log('111111111');
            this.onActionSave();
          }
        }
      }
    }

  },

  onActionSave: function(){

    var chkSavePayment = 'Y';

    if (this.state.data.status_discount === true ){

      if (this.state.data.confirm_discount == (this.state.dataSave.balance - this.state.dataSave.amount)){

      }else{
        chkSavePayment = 'N';
        this.flagDupSave = false;
        this.setState({
          flagSave : false
        });
        toasterActions.pop({
          type:'warning',
          message:'ยอดปิดส่วนลดไม่ถูกต้อง'
        });
      }
    }
    if (chkSavePayment == 'Y'){

      var ReceiptRemark = '';
      var ReceiptOption = '';
      for (var i = 0; i < this.state.receipt_item.length; i++){

        if(ReceiptRemark != ''){
          ReceiptRemark = ReceiptRemark + ',' + this.state.receipt_item[i].remark;
        }else{
          ReceiptRemark = this.state.receipt_item[i].remark;
        }

        if(ReceiptOption != ''){
          ReceiptOption = ReceiptOption + ',' + this.state.receipt_item[i].paymentoption;
        }else{
          ReceiptOption = this.state.receipt_item[i].paymentoption;
        }

      };

      this.state.dataSave.pay_date=this.state.data.date;
      this.state.dataSave.pay_staff = system.sessionStore.getSession().staff.id;
      this.state.dataSave.shop_id=system.sessionStore.getSession().shop.id;
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
      this.state.dataSave.contract_code = this.state.textdata.contractid;
      this.state.dataSave.finance_staff = this.state.selectedFinanceItem;
      this.state.dataSave.receipt_remark = ReceiptRemark + this.state.data.confirm_savedup;
      this.state.dataSave.receipt_option = ReceiptOption;
      //this.state.dataSave.flagRedeem = this.state.dataSave.flagRedeem;
      // console.log(this.state.dataSave);
      actions.savePayment(this.state.dataSave);
    }
  },

  onGetHistoryPaymentTermDoneAction:function(data){
    //console.log(data.paymentHistory);
    this.setState({
      listPaymentHistory:data.paymentHistory
      //paymentData:data.payment
    });
  },

  handleTabClick: function(id) {
    this.setState({
      curTab:id
    });
  },

  onRePrint:function(row){
    actions.printReceipt({contract_id:row.contract_id,receipt_id:row.id});
  },

  onVoid:function(row){
    var contract_id = this.state.selectData.contractid;
    dialogActions.show({
        title: 'receipt.confirm_void_title',
        content: <div>คุณต้องการยกเลิกรายการ ใบเสร็จเลขที่ {row.code} นี้หรือไม่ เป็นจำนวนเงินทั้งสิ้น {helper.numberFormat(row.amount,2)} บาท</div>,
        actions:[
          {id:'ok', icon:'check52', label:'action.confirm'},
          {id:'cancel', icon:'close47', label:'action.cancel', default:true}
        ]
      }, function(isCancel, action_id) {
        if (isCancel || action_id=='cancel') {
          return;
        }

        var obj = {
          contract_id:contract_id,
          receipt_id:row.id,
          receipt_code:row.code,
          void_staff:system.sessionStore.getSession().staff.id,
          term_num:row.term_num
        }
        //console.log(obj);
        actions.voidPayment(obj);
      });
    //actions.printReceipt({contract_id:row.contract_id,receipt_id:row.id});
  },

  toggleDiscount:function(p_id) {
    this.state.data[p_id] = !!!this.state.data[p_id];
    console.log(this.state.data[p_id]);
    this.setState({
      data:this.state.data
    });
  },

  handleChangeDialog:function(id, value){
        this.state.data[id] = value;
        this.setState({
          data: this.state.data
        });
        dialogActions.update(this.createParameter());
  },

  handleChangeDialogDup:function(id, value){
        this.state.data[id] = value;
        this.setState({
          data: this.state.data
        });
        dialogActions.update(this.createParameterSaveDup());
  },

  createParameter: function()
  {
    var field = {
      confirm_discount: {
        id:'confirm_discount',
        label:'receipt.confirm_discount',
        required:true
      }
    }

    var obj = (
      <div className="flex-form" style={{ width:300,margin:'0 auto'}}></div>
    );

    param = (
              <div>
                <FlexTextInput
                  field={field.confirm_discount}
                  data={this.state.data}
                  onChange={this.handleChangeDialog}
                  />
              </div>
            );

    if(param != null) {
      // Hack React. //
      if(obj._store.originalProps.children == undefined) obj._store.originalProps.children = [];
      if(obj._store.props.children == undefined) obj._store.props.children = [];

      obj._store.originalProps.children.push(param);
      obj._store.props.children.push(param);
      // Hack React. //
    }

    return obj;
  },

  createParameterSaveDup: function()
  {
    var field = {
      confirm_savedup: {
        id:'confirm_savedup',
        label:'receipt.confirm_savedup',
        required:true
      }
    }

    var obj = (
      <div className="flex-form" style={{ width:350,margin:'0 auto'}}></div>
    );

    param = (
              <div>
                <div>วันนี้มีการบันทึกค่างวดเข้ามาแล้ว ต้องการบันทึกอีกหรือไม่</div>
                <div style={{height:'4px'}}>่</div>
                <FlexTextInput
                  field={field.confirm_savedup}
                  data={this.state.data}
                  onChange={this.handleChangeDialogDup}
                  />
              </div>
            );

    if(param != null) {
      // Hack React. //
      if(obj._store.originalProps.children == undefined) obj._store.originalProps.children = [];
      if(obj._store.props.children == undefined) obj._store.props.children = [];

      obj._store.originalProps.children.push(param);
      obj._store.props.children.push(param);
      // Hack React. //
    }

    return obj;
  },

  onCheckOndateDoneAction: function(data) {

    if (this.state.contract_status == 'NORMAL' || this.state.contract_status == 'DEBT'){
        this.state.checkSave = data.flagSave;
    }
  //console.log('flagSave:',data.flagSave);
    if (data.flagSave == true){
      toasterActions.pop({
        type:'warning',
        message:'ไม่สามารถทำรายการย้อนหลังได้'
      });
    }

    this.setState({
      checkSave:this.state.checkSave
    });

  },

  onCheckCloseCashDailyDoneAction: function(data){
    if(data.flagLink == 'Y'){
        this.context.router.transitionTo('pos.cashDaily.list', {});
    }
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
        type:'date',
        label:'pos.receipt.date',
        icon:'user158'
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

    var productField = [
      {name:'term_num',label:'pos.receipt.no',width:40,render:function(row){
        return row.term_num;
      }},
      {name:'due_date',label:'pos.receipt.due_date',width:150,render:function(row){
        var date = tr.localize(new Date(row.due_date),{type:'date',format:'long'})
        if (row.paid_date == '0000-00-00'){
          date = <div>{tr.localize(new Date(row.due_date),{type:'date',format:'long'})}<span style={{color:"red"}}>{row.diffday}</span></div>;
        }
        return date;
      }},
      {name:'paid_date',label:'pos.receipt.date',width:150,render:function(row){
        var pay_date = '-';
        if (row.paid_date != '0000-00-00'){
          pay_date = <div>{tr.localize(new Date(row.paid_date),{type:'date',format:'long'})}<span style={{color:"red"}}>{row.diffday}</span></div>;
        }
        return pay_date;
      }},
      {name:'due_amount',label:'pos.receipt.due_amount',width:100 ,render:function(row){
        return <div><div className="right" style={{width:"80px"}} >{helper.numberFormat(row.due_amount,2)}</div></div>;
      }},
      {name:'paid_amount',label:'pos.receipt.paid_amount',width:100, className:'right',render:function(row){
        return <div><div className="right" style={{width:"80px"}} >{helper.numberFormat(row.paid_amount,2)}</div></div>;
      }},
      {name:'balance',label:'pos.receipt.balance',width:100, className:'right',render:function(row){
        var _balance = '-';
        if (row.balance != '-'){
          _balance = <div><div className="right" style={{width:"80px"}} >{helper.numberFormat(row.balance,2)}</div></div>;
        }
        return _balance;
      }},
      {name:'discount',label:'pos.receipt.discount',width:100, className:'right',render:function(row){
        return <div><div className="right" style={{width:"80px"}} >{helper.numberFormat(row.discount,2)}</div></div>;
      }},
    ];

    var paymentTermField = [
      {name:'num',label:'pos.receipt.no',width:40,render:function(row, i){
        return (i+1);
      }},
      {name:'pay_date',label:'pos.receipt.date',width:120,render:function(row){
        return <div><div className="left" style={{width:"100px"}} >{tr.localize(new Date(row.pay_date),{type:'date',format:'long'})}</div></div>;
      }},
      {name:'amount',label:'pos.receipt.paid_amount',width:60, render:function(row){
        return <div><div className="right" style={{width:"60px"}} >{helper.numberFormat(row.amount,2)}</div></div>;
      }},
      {name:'penalty',label:'pos.receipt.penalty',width:60 ,render:function(row){
        return <div><div className="right" style={{width:"60px"}}>{helper.numberFormat(row.penalty,2)}</div></div>;
      }},
      {name:'paymentoption',label:'pos.receipt.paymentoption',width:60, render:function(row){
        return row.paymentoption;
      }},
      {name:'remark',label:'pos.receipt.remark',width:100, render:function(row){
        return row.remark;
      }},
      {name:'actions', type:'actions', width:(2*15)+'px', render:function(row,i) {
        var f = function() {
          this.onPaymentDelete(i)
        }.bind(this);
        return (<div className="flex">
            <div onClick={f}>
              <FlexIcon icon="clear5" title="action.select"></FlexIcon>
            </div>
        </div>);
      }.bind(this)},
      // {name:'display_name',label:'pos.payment.staff',width:100, className:'right',render:function(row){
      //   return row.display_name;
      // }},
    ];

    var paymentHistory = [
      {name:'code',label:'pos.receipt.receipt_code',width:150,render:function(row){
        return row.status == 'VOID' ? <div><del>{row.code}</del></div> : <div>{row.code}</div>;
      }},
      {name:'system_date',label:'pos.receipt.system_date', type:'date' ,width:120,render:function(row){
        return tr.localize(new Date(row.system_date),{type:'datetime',format:'short'});
      }},
      {name:'pay_date',label:'pos.receipt.date',width:100,render:function(row){
        return tr.localize(new Date(row.pay_date),{type:'date',format:'short'});
      }},
      {name:'term_num',label:'pos.receipt.term',width:50,render:function(row){
        return row.term_num;
      }},
      {name:'option_name',label:'pos.receipt.payment_option',width:90,render:function(row){
        return row.option_name;
      }},
      {name:'amount',label:'pos.receipt.amount',width:90 ,render:function(row){
        return <div><div className="right" style={{width:"70px"}} >{helper.numberFormat(row.amount,2)}</div></div>;
      }},
      {name:'penalty',label:'pos.receipt.penalty',width:70 ,render:function(row){
        return <div><div className="right" style={{width:"60px"}} >{helper.numberFormat(row.penalty,2)}</div></div>;
      }},
      {name:'remark',label:'pos.receipt.remark',width:90,render:function(row){
        return <div title={row.remark}>{row.remark}</div>;
      }},
      {name:'display_name',label:'pos.receipt.staff',width:80,render:function(row){
        return row.display_name;
      }},
      {name:'actions', type:'actions', width:(2*40)+'px', render:function(row,i) {
        var f = function() {
          this.onRePrint(row)
        }.bind(this);
        var v = function() {
          this.onVoid(row)
        }.bind(this);
        //console.log('staff:',system.sessionStore.getSession().staff);
        return row.code !='' ? (<div className="flex">
            <div onClick={f}>
              <FlexIcon icon="printer88" title="action.print"></FlexIcon>
            </div>
            {row.status == 'NORMAL' && row.check_date == 'Y' && row.void == 'Y' ? (
              <div onClick={v}>
                <FlexIcon icon="do10" title="action.void"></FlexIcon>
              </div>
            ) : ''}
        </div>) : '';
      }.bind(this)},
    ];

    var listTab = [
      {id:'tab1', icon:'bubble8', text:'pos.receipt.paymentterm'},
      {id:'tab2', icon:'bubble8', text:'pos.receipt.paymenthistory'}
    ];

    return(
      <div className="content-page layout-panel">
        <div className="content-body panelf">
          <div className="panelf can-grow flex">
            <div className="panel8">{this.state.data.product}</div>
            <div>{this.state.dataSave.flagRedeem == 'Y' ? <div style={{color:'red',textAlign:'right'}}>ชำระค่าไถ่ถอนสินค้า</div>:''}</div>
          </div>
          <div className="box10 flex flex-form">
            <div className="panel4">
                <FlexTextInput
                  field={fields.card_id}
                  data={this.state.data}
                  onChange={this.handleChange}
                  onKeyUp={this.onKeyUp}
                  onKeyDown={this.onKeyDown}
                  live={true}
                  />
            </div>
            <div className="panel4">
                <FlexTextInput
                  field={fields.code}
                  data={this.state.data}
                  onChange={this.handleChange}
                  onEnter={this.onCodeEnter}
                  onKeyUp={this.onKeyUp}
                  />
            </div>
            <div className="panel4">
                <FlexTextInput
                  field={fields.other}
                  data={this.state.data}
                  onChange={this.handleChange}
                  onKeyUp={this.onKeyUp}
                  />
            </div>
          </div>
          <div className="panel10">
            <FlexTab list={listTab} selected={this.state.curTab} onClick={this.handleTabClick}/>
          </div>
            <div className="panel10" style={this.state.curTab=='tab1' ? {display:'block'} : {display:'none'}}>
              <FlexDisplayTable
                  fields={productField}
                  data={this.state.listProductData}
                  displayRows={4}
              />
            </div>
            <div className="panel10" style={this.state.curTab=='tab2' ? {display:'block'} : {display:'none'}}>
              <FlexDisplayTable
                  fields={paymentHistory}
                  data={this.state.listPaymentHistory}
                  displayRows={5}
              />
            </div>
          <div className="box10 flex flex-form">
            <div className="panel6">
              <h2>รายการชำระ</h2>
              <div className="box6">
                <FlexDisplayTable
                    fields={paymentTermField}
                    data={this.state.receipt_item}
                    displayRows={6}
                />
                <FlexTextInput
                  field={fields.totalamount}
                  data={this.state.dataSave}
                  />
              </div>
            </div>
            <div className="panel4">
                    <div className="box4">
                      <h2>3.รับชำระ</h2>
                      <div className="panel4 flex">
                        <div style={{width:'200px'}}>
                          <FlexTextInput field={fields.date} data={this.state.data} onChange={this.handleChange} />
                        </div>
                        <div style={{width:'8px'}}></div>
                        <div style={{width:'170px'}}>
                          <FlexDropdown
                            field={this.state.fieldPaymentOption}
                            data={{list:this.state.selectedItem}}
                            onChange={this.handleListChange}
                            />
                        </div>
                      </div>
                      <div className="panel4">
                        <FlexDropdown
                          field={this.state.fieldFinanceList}
                          data={{financelist:this.state.selectedFinanceItem}}
                          onChange={this.handleListChange}
                          />
                      </div>
                      <div className="panel4">
                          <FlexTextInput
                            field={fields.amount}
                            data={this.state.data}
                            onChange={this.handleChange}
                            autoSelect={true}
                            />
                      </div>
                      <div className="panel4">
                          <FlexTextInput
                            field={fields.penalty}
                            data={this.state.data}
                            onChange={this.handleChange}
                            autoSelect={true}
                            />
                      </div>
                      <div className="panel4">
                          <FlexTextInput field={fields.remark} data={this.state.data} onChange={this.handleChange} />
                      </div>
                      <div className="panel4">
                            <FlexCheckbox
                              field={fields.status_discount}
                              data={this.state.data}
                              onChange={this.toggleDiscount}
                              />
                      </div>
                      <div style={{height:'5px'}}></div>
                      <div className="box4 flex flex-form">
                        <div className="panel2">
                          <FlexButton
                            label="pos.action.add"
                            icon="add186"
                            default={true}
                            onClick={this.doAddPayment}
                            disabled = {this.state.checkSave}
                            />
                        </div>
                        <div className="panel2">
                          <FlexButton
                            label="action.save"
                            icon="save20"
                            default={true}
                            onClick={this.doPaymentSave}
                            disabled = {this.state.checkSave}
                            />
                        </div>
                      </div>
                    </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
});

module.exports = PaymentScreen;
