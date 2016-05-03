var React     = require('react');
var Reflux    = require('reflux');
var Router    = require('react-router');
var Link      = Router.Link;
var T         = require('react-translate-component');
var tr        = require('counterpart');

var system            = require('ss-system');
var widgets           = require('ss-widget');

var acl               = system.acl;
var helper            = system.helper;
var systemActions     = system.systemActions;
var infoPanelActions  = system.infoPanelActions;
var dialogActions     = system.dialogActions;
var toasterActions    = system.toasterActions;

var FlexButton      = widgets.FlexButton;
var FlexTab         = widgets.FlexTab;
var FlexTextInput   = widgets.FlexTextInput;
var FlexDropdown    = widgets.FlexDropdown;
var FlexIcon        = widgets.FlexIcon;
var FlexDataTable   = widgets.FlexDataTable;
var FlexRadioGroup  = widgets.FlexRadioGroup;
var NationIDCard    = widgets.NationIDCard;

var actions       = require('./actions');
var AddressInfo   = require('./address-info.jsx');

var component       = require('./widgets/index');

var calcAge = function(value) {
  var today = new Date();
  var d = new Date(value);
  var age = today.getFullYear()-d.getFullYear();
  if (d.getMonth() > today.getMonth() || d.getMonth()==today.getMonth() && d.getDate() > today.getDate()) {
    age--;
  }
  return age;
};

var statusIcon = {
  NORMAL: 'circle108',
  DEBT:'round54',
  CLOSE_CANCEL:'circle108',
  CLOSE_NORMAL:'circle108',
  CLOSE_RETURN:'circle108',
  CLOSE_CONFISCATE:'round54',
  CLOSE_BAD_DEBT:'rounded56'
};
var statusColor = {
  NORMAL:'green',
  DEBT:'orange',
  CLOSE_CANCEL:'green',
  CLOSE_NORMAL:'green',
  CLOSE_RETURN:'green',
  CLOSE_CONFISCATE:'orange',
  CLOSE_BAD_DEBT:'red'
};

var formatContractCode = function(code) {
  if (!code || code.length < 16 || code.length > 17) {
    return code;
  }
  if (code.length==16) {
    return code.substr(0,9)+'-'+code.substr(9,5)+'-'+code.substr(14,2);
  }
  if (code.length==17) {
    return code.substr(0,10)+'-'+code.substr(10,5)+'-'+code.substr(15,2);
  }
}

var ContractEdit = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(actions.getById.done, 'onGetByIdDoneAction'),
    Reflux.listenTo(actions.save.done, 'onSaveDoneAction'),
    Reflux.listenTo(actions.save.error, 'onSaveErrorAction'),
    Reflux.listenTo(actions.getCloseReturn.done, 'onGetCloseReturnDoneAction'),
    Reflux.listenTo(actions.getListCollection.done, 'onGetListCollectionDoneAction'),
    Reflux.listenTo(actions.saveCollection.done, 'onSaveCollectionDoneAction'),
    Reflux.listenTo(actions.getMobileNumber.done, 'onGetMobileNumberDoneAction'),
    Reflux.listenTo(actions.printCollectionReport.done, 'onPrintCollectionReportDoneAction'),
    Reflux.listenTo(actions.closeCaStaffList.done, 'onCloseCaStaffListDoneAction'),
    Reflux.listenTo(actions.saveCloseCa.done, 'onSaveCloseCaDoneAction')
  ],

  getInitialState: function() {
    var id = parseInt(this.context.router.getCurrentParams().id);
    var flagClose = this.context.router.getCurrentParams().close;
    var flagDunning = this.context.router.getCurrentParams().dunning;
    var pageBack = this.context.router.getCurrentParams().pageback;

    if (!pageBack) {
      pageBack = 'installment.contract.list';
    }

    var default_today = new Date();
    default_today.setMonth(default_today.getMonth() + 0);
    var _valueToday = default_today.toJSON().slice(5,7) +'/'+ default_today.toJSON().slice(0,4);
    //console.log(_valueToday);
    return {
      id:id,
      flagClose:flagClose,
      flagDunning:flagDunning,
      pageBack:pageBack,
      genPaymentTerm:false,
      contract:{
        permission_save: true,
        customer:{},
        co:{},
        cardAddr:{},
        customerAddr:{},
        workAddr:{},
        coCardAddr:{},
        coAddr:{},
        coWorkAddr:{},
        return:{},
        dataSaveCollection:{
          due_date:new Date().toJSON().slice(0,10).replace(/-/ig,'/'),
          call_number:'',
          call_remark:'',
          call_type:'โทรหาคนซื้อ',
          shop_id:'',
          staff_id:system.sessionStore.getSession().staff.id,
          contract_id:id,
          collection_send:'1',
          collection_statusca:'N',
          call_name:''
        },
        dataSaveCloseCA:{
          id:'',
          closeca_staff:'',
          closeca_date:new Date().toJSON().slice(0,10),
          closeca_effective: _valueToday,
          closeca_staff:'',
          over_day:'',
          last_paid:'',
          closeca_profit_lost:0,
          install_cost:0,
          closeca_percent:0,
          closeca_amount:0,
          closeca_staff_percent:0,
          closeca_staff_amount:0,
          closeca_remark:''
        },
        payment_month:'',
        payment_price:'',
        payment_per_month:'',
        payment_on_day:'',
        fee:'',
        start_date:''
      },
      return:{},
      expand:{
        customer:false,
        co:false,
        payment_term:false,
        close_return:flagClose == 'Y' ? 'true' : false,
        collection:flagDunning == 'Y' ? 'true' : false,
        closeca:false
      },
      paymentTerm:[],
      refContract:[],
      returndetail:[],
      dataCollection:[],
      fields: {
        nationid: {
          id:'customer.nationid',
          type:'text',
          label:'person.nationid',
          // required:true,
          // pattern:'^[0-9]{13}$'
          readonly:true
        },
        prename: {
          id:'customer.prename',
          type:'text',
          label:'person.prename',
          width:160,
          readonly:true
        },
        firstname: {
          id:'customer.firstname',
          type:'text',
          label:'person.firstname',
//          required:true
          readonly:true
        },
        lastname: {
          id:'customer.lastname',
          type:'text',
          label:'person.lastname',
//          required:true
          readonly:true
        },
        birth: {
          id:'customer.birth',
          type:'date',
          label:'person.birth',
          icon:'user158'
        },
        age: {
          id:'customer.age',
          type:'text',
          label:'contract.age',
          icon:'user158',
          readonly:true
        },
        gender: {
          id:'customer.gender',
          type:'dropdown',
          label:'person.gender',
          width:272,
          list:[
            {value:'M', text:'person.gender_M'},
            {value:'F', text:'person.gender_F'},
            {value:'N/A', text:'person.gender_NA'}
          ]
        },
        marital_status: {
          id:'customer.marital_status',
          type:'dropdown',
          label:'person.marital_status',
          width:272,
          list:[
            {value:'SINGLE', text:'person.marital_status_SINGLE'},
            {value:'MARRIED', text:'person.marital_status_MARRIED'},
            {value:'N/A', text:'person.marital_status_NA'}
          ]
        },
        mobile: {
          id:'cus_mobile',
          type:'text',
          label:'contract.mobile',
          icon:'user158',
          pattern:'^0[0-9]{9}$'
        },
        email: {
          id:'customer.email',
          type:'email',
          label:'contract.email',
          icon:'user158'
        },
        co_nationid: {
          id:'co.nationid',
          type:'text',
          label:'person.nationid'
          // required:true,
          // pattern:'^[0-9]{13}$'
        },
        co_prename: {
          id:'co.prename',
          type:'text',
          label:'person.prename'
        },
        co_firstname: {
          id:'co.firstname',
          type:'text',
          label:'person.firstname'
          // required:truำ
        },
        co_lastname: {
          id:'co.lastname',
          type:'text',
          label:'person.lastname'
//          width:196,
          // required:true
        },
        co_mobile: {
          id:'co.mobile',
          type:'text',
          label:'contract.mobile'
        },
        co_email: {
          id:'co.email',
          type:'email',
          label:'contract.email'
        },
        co_work_company: {
          id:'co_work_company',
          type:'text',
          label:'contract.work_company'
        },
        co_work_detail: {
          id:'co_work_detail',
          type:'text',
          label:'contract.work_detail'
        },
        co_work_department: {
          id:'co_work_department',
          type:'text',
          label:'contract.work_department'
        },
        co_work_position: {
          id:'co_work_position',
          type:'text',
          label:'contract.work_position'
        },
        co_work_time: {
          id:'co_work_time',
          type:'text',
          label:'contract.work_time'
        },
        co_work_year: {
          id:'co_work_year',
          type:'number',
          label:'contract.work_year'
        },
        co_work_salary: {
          id:'co_work_salary',
          type:'number',
          label:'contract.work_salary'
        },
        co_work_income: {
          id:'co_work_income',
          type:'number',
          label:'contract.work_income'
        },
        co_work_income_source: {
          id:'co_work_income_source',
          type:'text',
          label:'contract.work_income_source'
        },
        addr_type: {
          id:'cus_addr_owner',
          type:'text',
          label:'contract.addr_type',
          list:[
            {value:'01', text:'เจ้าของบ้าน'},
            {value:'02', text:'บ้านญาติ'},
            {value:'03', text:'บ้านพักสวัสดิการ'},
            {value:'04', text:'เช่าเอกชน'},
            {value:'05', text:'เช่าการเคหะ'},
            {value:'06', text:'บ้านบิดามารดา'}
          ]
        },
        addr_with: {
          id:'cus_addr_with',
          type:'text',
          label:'contract.addr_with',
          list:[
            {value:'01', text:'คนเดียว'},
            {value:'02', text:'บิดามารดา'},
            {value:'03', text:'ญาติ'},
            {value:'04', text:'คู่สมรส'},
            {value:'05', text:'เพื่อน'}
          ]
        },
        addr_person: {
          id:'cus_addr_person',
          type:'text',
          label:'contract.addr_person',
          pattern:'^[0-9]{1,2}$',
          icon:'user158'
        },
        work_company: {
          id:'work_company',
          type:'text',
          label:'contract.work_company'
        },
        work_type: {
          id:'work_type',
          type:'text',
          label:'contract.work_type'
        },
        work_type_other: {
          id:'work_type_other',
          type:'text',
          label:'contract.work_type_other'
        },
        work_detail: {
          id:'work_detail',
          type:'text',
          label:'contract.work_detail'
        },
        work_department: {
          id:'work_department',
          type:'text',
          label:'contract.work_department'
        },
        work_position: {
          id:'work_position',
          type:'text',
          label:'contract.work_position'
        },
        work_time: {
          id:'work_time',
          type:'text',
          label:'contract.work_time'
        },
        work_year: {
          id:'work_year',
          type:'number',
          label:'contract.work_year'
        },
        work_salary: {
          id:'work_salary',
          type:'number',
          label:'contract.work_salary'
        },
        work_income: {
          id:'work_income',
          type:'number',
          label:'contract.work_income'
        },
        work_income_source: {
          id:'work_income_source',
          type:'text',
          label:'contract.work_income_source'
        },
        work_prev_company: {
          id:'work_prev_company',
          type:'tex',
          label:'contract.work_prev_company'
        },
        work_prev_company: {
          id:'work_prev_company',
          type:'tex',
          label:'contract.work_prev_company'
        },
        work_prev_addr: {
          id:'work_prev_addr',
          type:'tex',
          label:'contract.work_prev_addr'
        },
        work_prev_department: {
          id:'work_prev_department',
          type:'tex',
          label:'contract.work_prev_department'
        },
        work_prev_tel: {
          id:'work_prev_tel',
          type:'tex',
          label:'contract.work_prev_tel'
        },
        payment_month: {
          id:'payment_month',
          type:'numberinput',
          label:'contract.payment_month',
          require:true,
          min:1,
          max:60
        },
        payment_price: {
          id:'payment_price',
          type:'numberinput',
          label:'contract.payment_price',
          readonly:true
        },
        payment_per_month: {
          id:'payment_per_month',
          type:'numberinput',
          label:'contract.payment_per_month',
          readonly:true
        },
        payment_on_day: {
          id:'payment_on_day',
          type:'numberinput',
          require:true,
          min:1,
          max:31,
          label:'contract.payment_on_day'
        },
        close_return_newcost: {
          id:'new_cost',
          type:'number',
          label:'close_return.newcost',
          required:true
        },
        close_return_oldcost: {
          id:'cost',
          type:'number',
          label:'close_return.oldcost',
          readonly:true
        },
        close_return_paid: {
          id:'total_paid',
          type:'number',
          label:'close_return.paid',
          readonly:true
        },
        close_return_balance: {
          id:'balance',
          type:'number',
          label:'close_return.balance',
          readonly:true
        },
        close_return_contract_free: {
          id:'fee',
          type:'number',
          label:'close_return.contract_free',
          readonly:true
        },
        close_return_install_free: {
          id:'install_cost',
          type:'number',
          label:'close_return.install_free',
          readonly:true
        },
        close_return_profit_loss:{
          id:'profit_loss',
          type:'number',
          label:'close_return.profit_loss',
          required:true
        },
        close_return_sell_id:{
          id:'sell_id',
          type:'text',
          label:'close_return.sell_id',
          readonly:true
        },
        close_return_sign_date:{
          id:'sign_date',
          type:'text',
          label:'close_return.sign_date',
          readonly:true
        },
        close_return_product_serial:{
          id:'product_serial',
          type:'text',
          label:'close_return.product_serial',
          readonly:true
        },
        close_return_product_detail:{
          id:'product_detail',
          type:'text',
          label:'close_return.product_detail',
          readonly:true
        },
        close_return_cus_name:{
          id:'cus_name',
          type:'text',
          label:'close_return.cus_name',
          readonly:true
        },
        close_return_product_condition:{
          id:'product_condition',
          type:'text',
          label:'close_return.product_condition'
        },
        close_return_remark:{
          id:'remark',
          type:'text',
          label:'close_return.remark'
        },
        close_return_return_date:{
          id:'return_date',
          type:'text',
          label:'close_return.return_date',
          readonly:true
        },
        collection_date:{
          id:'dataSaveCollection.due_date',
          label:'collection.due_date',
          type:'date',
          required:true
        },
        collection_type:{
          id:'dataSaveCollection.call_type',
          type:'dropdown',
          label:'collection.call_type',
          list:[
            {value:'โทรหาผู้ซื้อ', text:'โทรหาผู้ซื้อ'},
            {value:'โทรหาผู้ซื้ออื่น ๆ', text:'โทรหาผู้ซื้ออื่น ๆ'},
            {value:'โทรหาผู้ค้ำ', text:'โทรหาผู้ค้ำ'},
            {value:'โทรหาผู้ค้ำอื่น ๆ', text:'โทรหาผู้ค้ำอื่น ๆ'}
          ]
        },
        collection_number:{
          id:'dataSaveCollection.call_number',
          type:'text',
          label:'collection.call_number',
          readonly:true
        },
        collection_print:{
          id:'dataSaveCollection.collection_print',
          type:'dropdown',
          label:'collection.print_file',
          list:[
            {value:'1', text:'รอบ 1 ด่วนที่สุด'},
            {value:'2', text:'รอบ 2 สำนักงานบังคับคดี'}
          ]
        },
        collection_send:{
          id:'dataSaveCollection.collection_send',
          type:'dropdown',
          label:'collection.send_print',
          list:[
            {value:'1', text:'ลูกค้า'},
            {value:'2', text:'ผู้ค้ำประกัน'}
          ]
        },
        collection_statusca:{
          id:'dataSaveCollection.collection_statusca',
          type:'dropdown',
          label:'collection.statusca',
          list:[
            {value:'Y', text:'แจ้งหนีหนี้ CA'},
            {value:'N', text:'ยกเลิกแจ้งหนีหนี้ CA'}
          ]
        },
        collection_call_remark:{
          id:'dataSaveCollection.call_remark',
          label:'collection.call_remark',
          type:'text',
          required:true
        },
        collection_call_name:{
          id:'dataSaveCollection.call_name',
          label:'collection.call_name',
          type:'text',
          readonly:true
        },
        closeca_contract_code:{
          id:'code',
          type:'text',
          label:'closeca.contract_code',
          readonly:true
        },
        closeca_sell_id:{
          id:'sell_id',
          type:'text',
          label:'closeca.sell_id',
          readonly:true
        },
        closeca_sign_date:{
          id:'sign_date',
          type:'text',
          label:'closeca.sign_date',
          readonly:true
        },
        closeca_date:{
          id:'dataSaveCloseCA.closeca_date',
          type:'date',
          label:'closeca.closeca_date'
        },
        closeca_serial:{
          id:'product_serial',
          type:'text',
          label:'closeca.product_serial',
          readonly:true
        },
        closeca_product:{
          id:'product_detail',
          type:'text',
          label:'closeca.product_detail',
          readonly:true
        },
        closeca_nationid:{
          id:'customer.nationid',
          type:'text',
          label:'closeca.nationid',
          readonly:true
        },
        closeca_cus_name:{
          id:'customer.fullname',
          type:'text',
          label:'closeca.cus_name',
          readonly:true
        },
        closeca_totalprice:{
          id:'total_price',
          type:'text',
          label:'closeca.total_price',
          readonly:true
        },
        closeca_cost:{
          id:'cost',
          type:'text',
          label:'closeca.cost',
          readonly:true
        },
        closeca_new_cost:{
          id:'new_cost',
          type:'text',
          label:'closeca.new_cost',
          readonly:true
        },
        closeca_installcost:{
          id:'dataSaveCloseCA.install_cost',
          type:'text',
          label:'closeca.install_cost'
        },
        closeca_fee:{
          id:'fee',
          type:'text',
          label:'closeca.fee',
          readonly:true
        },
        closeca_totalpaid:{
          id:'total_paid',
          type:'text',
          label:'closeca.total_paid',
          readonly:true
        },
        closeca_profit_lost:{
          id:'closeca_profit_lost',
          type:'text',
          label:'closeca.profit_lost',
          readonly:true
        },
        closeca_overday:{
          id:'over_day',
          type:'text',
          label:'closeca.over_day',
          readonly:true
        },
        closeca_lastpaid:{
          id:'last_paid',
          type:'text',
          label:'closeca.last_paid',
          readonly:true
        },
        closeca_remark:{
          id:'dataSaveCloseCA.closeca_remark',
          type:'text',
          label:'closeca.closeca_remark'
        },
        closeca_staff_percent:{
          id:'dataSaveCloseCA.closeca_staff_percent',
          type:'text',
          label:'closeca.closeca_staff_percent'
        },
        closeca_staff_amount:{
          id:'dataSaveCloseCA.closeca_staff_amount',
          type:'text',
          label:'closeca.closeca_staff_amount',
          readonly:true
        },
        closeca_percent:{
          id:'dataSaveCloseCA.closeca_percent',
          type:'text',
          label:'closeca.closeca_percent',
          readonly:true
        },
        closeca_amount:{
          id:'dataSaveCloseCA.closeca_amount',
          type:'text',
          label:'closeca.closeca_amount',
          readonly:true
        }
      },
      termFields: [
        {name:'term_num', type:'number', label:'contract.term.num', readonly:true, width:40},
        {name:'due_date', type:'date', label:'contract.term.due_date', width:120, render:function(row) {
          return tr.localize(new Date(row.due_date), {type:'date', format:'short'});
        }},
        {name:'due_amount', type:'number', label:'contract.term.due_amount', width:96, className:'right', render:function(row) {
          return helper.numberFormat(parseFloat(row.due_amount),2);
        }},
        {name:'paid_amount', type:'number', label:'contract.term.paid_amount', width:96, className:'right', render:function(row) {
          return helper.numberFormat(parseFloat(row.paid_amount),2);
        }},
        {name:'paid_date', type:'date', label:'contract.term.paid_date', width:88, render:function(row) {
          if (row.paid_date=='0000-00-00') {
            return '';
          }
          return tr.localize(new Date(row.paid_date), {type:'date', format:'short'});
        }},
        {name:'term_status', label:'contract.term.term_status', width:160, render:function(row) {
          return tr.translate('contract.term.term_status_'+row.term_status);
        }},
        {name:'ref_payment_codes', label:'contract.term.ref_code', render: function(row) {
          return row.ref_payment_codes
        }}//,
        // {name:'due_status', label:'contract.term.due_status', render:function(row) {
        //   return row.due_status;
        // }}
      ],
      return_detail:[
        {name:'rownum', type:'number', label:'close_return.return_detail.num', readonly:true, width:40},
        {name:'product', label:'close_return.return_detail.product', width:150, render: function(row) {
          return row.product
        }},
        {name:'serial', label:'close_return.return_detail.serial', width:120, render: function(row) {
          return row.serial
        }},
        {name:'oldcost', type:'number', label:'close_return.return_detail.oldcost', width:80, className:'right', render:function(row) {
          return helper.numberFormat(parseFloat(row.newcost),2);
        }}
      ],
      collection:[
        {name:'rownum', type:'number', label:'collection.collection_list.num', readonly:true, width:40, render: function(row,i){
          return i+1;
        }},
        {name:'system_date', label:'collection.collection_list.call_date', width:150, render: function(row) {
          return tr.localize(new Date(row.system_date), {type:'date', format:'short'});
        }},
        {name:'call_type', label:'collection.collection_list.call_type', width:150, render: function(row) {
          return row.call_type
        }},
        {name:'call_number', label:'collection.collection_list.call_number', width:120, render: function(row) {
          return row.call_number
        }},
        {name:'due_date', label:'collection.collection_list.due_date', width:150, render: function(row) {
          return tr.localize(new Date(row.due_date), {type:'date', format:'short'});
        }},
        {name:'call_remark', type:'number', label:'collection.collection_list.call_remark', width:150, render:function(row) {
          return <div title={row.call_remark}>{row.call_remark}</div>;
        }},
        {name:'display_name', type:'number', label:'collection.collection_list.staff_name', width:80, className:'center', render:function(row) {
          return row.display_name;
        }}
      ],
      printCollection:{
        id:id,
        sendto:'1'
      },
      closeca_staffname: {
        id:'dataSaveCloseCA.closeca_staff',
        label:'closeca.closeca_staffname',
        list:[]
      },
      closeca_effective:{
        id:'dataSaveCloseCA.closeca_effective',
        label:'closeca.closeca_effective',
        list:[]
      }
    };
  },

  changeContract: function(id) {
    actions.getById(id);
  },

  onSaveDoneAction: function() {
    console.log('success');
    toasterActions.pop({
      type:'success',
      message:'result.save.ok'
    });
  },

  onSaveErrorAction: function() {
    toasterActions.pop({
      type:'warning',
      message:'result.save.error'
    });
  },

  onGetCloseReturnDoneAction :function(data) {
    console.log('onGetCloseReturnDoneAction=',data);
    this.setState({
      return: data.return[0],
      returndetail: data.return_detail,
      stock_shop: data.stock_shop[0]
    });

  },

  onGetByIdDoneAction: function(data) {
    var listRef = data.refContract.map(function(row) {
      if (row.id!=this.state.id && this.state.flagClose=="Y"){
        return ("");
      }

      // console.log('Row:',row,'rowID :',row.id,'ID :',this.state.id,'FlagClose',this.state.flagClose);
      if (row.id!=this.state.id && this.state.flagClose=="Y"){
        return ("");
      }
      return (
        <li key={row.id} className={row.id==this.state.id ? 'selected':null} onClick={function() {this.changeContract(row.id)}.bind(this)}>
          <div style={{fontSize:'95%'}}>{formatContractCode(row.code)}</div>
          <div className="flex">
            <div className="flex can-grow">
              <div className="flaticon-user157 tiny no-shrink"></div>
              <T content={'contract.' + row.role} component="nobr" className="status-text can-grow"/>
            </div>
            <div className={'flex status_' + row.current_status} style={{width:'72px'}}>
              <div className="flaticon-circle108 tiny no-shrink"></div>
              <T content={'contract.current_status.' + row.current_status} component="div" className="status-text"/>
            </div>
          </div>
        </li>
      );
    }.bind(this));
    infoPanelActions.show(this.state.pageBack, (
      <div className="flex can-grow" style={{flexDirection:'column'}}>
        <ul style={{overflowY:'auto'}} className="contract-list can-grow">
          {listRef}
        </ul>
        <div className="no-shrink" style={{borderTop:'2px solid blue'}}>
          <ul>
            <li><a href="#" className="flex"><span className="flaticon-two375"></span><T content="contract.view.summary" style={{paddingLeft:'8px'}}/></a></li>
            <li><a href="#" className="flex"><span className="flaticon-two375"></span><T content="contract.view.customer" style={{paddingLeft:'8px'}}/></a></li>
            <li><a href="#" className="flex"><span className="flaticon-two375"></span><T content="contract.view.payment" style={{paddingLeft:'8px'}}/></a></li>
            <li><a href="#" className="flex"><span className="flaticon-two375"></span><T content="contract.view.call" style={{paddingLeft:'8px'}}/></a></li>
          </ul>
        </div>
      </div>
    ));
    if (data.contract.customer.idcard_info) {
      data.contract.customer.idcard_info = JSON.parse(data.contract.customer.idcard_info);
    } else {
      data.contract.customer.idcard_info = {};
    }
    if (data.contract.co.idcard_info) {
      data.contract.co.idcard_info = JSON.parse(data.contract.co.idcard_info);
    } else {
      data.contract.co.idcard_info = {};
    }
    if(!data.contract.address.HOME){
      data.contract.address.HOME = {};
    }
    if(!data.contract.address.WORK){
      data.contract.address.WORK = {};
    }
    if(!data.contract.address.COHOME){
      data.contract.address.COHOME = {};
    }
    data.contract.customer.age = calcAge(data.contract.customer.birth);
    data.contract.cardAddr = data.contract.address.CARD;
    data.contract.customerAddr = data.contract.address.HOME;
    data.contract.workAddr = data.contract.address.WORK;
    data.contract.coCardAddr = data.contract.address.COCARD;
    data.contract.coAddr = data.contract.address.COHOME;
    data.contract.coWorkAddr = data.contract.address.COWORK;
    data.contract.profit_loss = 0;
    data.contract.dataSaveCollection = this.state.contract.dataSaveCollection;

    //console.log(data);
    data.contract.dataSaveCloseCA = this.state.contract.dataSaveCloseCA;
    data.contract.dataSaveCloseCA.over_day = data.contract.closeca.over_day;
    data.contract.dataSaveCloseCA.last_paid = data.contract.closeca.last_paid;
    data.contract.dataSaveCloseCA.id = data.contract.id;
    data.contract.dataSaveCloseCA.closeca_staff = data.contract.closeca_staff == null? data.contract.finance_staff_id:data.contract.closeca_staff;
    data.contract.dataSaveCloseCA.closeca_remark = data.contract.closeca_remark;
    data.contract.dataSaveCloseCA.install_cost = data.contract.install_cost;
    data.contract.dataSaveCloseCA.closeca_staff_percent = data.contract.closeca_staff_percent;
    data.contract.dataSaveCloseCA.closeca_staff_amount = data.contract.closeca_staff_amount;
    data.contract.dataSaveCloseCA.closeca_percent = data.contract.closeca_percent;
    data.contract.dataSaveCloseCA.closeca_amount = data.contract.closeca_amount;
    data.contract.dataSaveCloseCA.install_cost = data.contract.install_cost;
    data.contract.dataSaveCloseCA.closeca_date = data.contract.closeca_date == '0000-00-00' ? data.contract.dataSaveCloseCA.closeca_date : data.contract.closeca_date;
    data.contract.dataSaveCloseCA.closeca_effective = data.contract.closeca_effective == '' || data.contract.closeca_effective == '0000-00-00' ? data.contract.dataSaveCloseCA.closeca_effective : data.contract.closeca_effective ;

    var _CloseProfitlost =  parseFloat(data.contract.total_paid) - (parseFloat(data.contract.install_cost) + parseFloat(data.contract.fee) + parseFloat(data.contract.cost));

    data.contract.dataSaveCloseCA.closeca_profit_lost = _CloseProfitlost;

    for (var i = 0; i <= data.paymentTerm.length - 1; i++) {
      if (data.paymentTerm[i].term_status != 'WAIT') {
        this.state.fields.payment_month.readonly = true;
        this.state.fields.payment_on_day.readonly = true;
        break;
      }
    }

    data.contract.start_date = data.paymentTerm[0].due_date;
    var path = window.location.protocol + '//' + window.location.host + '/idcard/photo';

    var co_id = data.contract.co.idcard_info.nationid, photoCoIDCard = '';
    if (!co_id || co_id.length != 13) {
      photoCoIDCard = path + '.png';
    } else {
      photoCoIDCard = path + '/' + co_id.substr(-1) + '/' + co_id.substr(-2,1) + '/' + co_id + '.jpg';
    }

    var cus_id = data.contract.customer.idcard_info.nationid, photoCusIDCard = '';
    if (!cus_id || cus_id.length != 13) {
      photoCusIDCard = path + '.png';
    } else {
      photoCusIDCard = path + '/' + cus_id.substr(-1) + '/' + cus_id.substr(-2,1) + '/' + cus_id + '.jpg';
    }


    data.contract.permission_save = acl.hasMAcl(['M_INSTALLMENT_CONTRACT_CLOSE_CA']);

    //data.contract.co.mobile = this.state.contract.co.mobile;
    console.log('data=', data.contract);
    this.setState({
      coIDCardPhoto: photoCoIDCard,
      cusIDCardPhoto: photoCusIDCard,
      id: data.contract.id,
      contract: data.contract,
      paymentTerm: data.paymentTerm,
      fields: this.state.fields
    });
    console.log(this.state.paymentTerm);
    if(this.state.flagClose == 'Y'){
      console.log('sendparam=',this.state.contract);
      actions.getCloseReturn(this.state.contract);
    }

    this.calculateCloseCA();

  },

  onGetSellInfoDoneAction: function(data) {
    if (data==null) {
      return;
    }

    var sellInfo = data.sell;
    var name = sellInfo.company_name.trim().split(/\s+/g).map(function(item) {
      return item.trim();
    });

    this.state.data.code = data.barcode.length > 0 ? data.barcode[0] : '';
    this.state.data.ref_code = sellInfo.contract_ref;
    this.state.data.sell_id = sellInfo.id;
    //console.log(this.state.data.sell_id);
    this.state.data.sell_date = sellInfo.sell_date.substr(0, 10);
    this.state.data.sign_date = sellInfo.sell_date.substr(0, 10);
    this.state.data.shop_code = sellInfo.shop_code;
    this.state.data.customer.ref_id = sellInfo.company_id;
    var tmp =  sellInfo.company_code.trim();
    if (tmp.length == 13) {
      this.state.data.customer.idcard = tmp;
    } else {
      this.state.data.customer.mobile = tmp;
    }

    if (name.length==1) {
      this.state.data.customer.firstname = name[0];
    } else if (name.length==2) {
      this.state.data.customer.firstname = name[0];
      this.state.data.customer.lastname = name[1];
    } else if (name[0]=='คุณ') {
      this.state.data.customer.prename = name[0];
      this.state.data.customer.firstname = name[1];
      this.state.data.customer.lastname = name[2];
    } else if (name.length >= 3) {
      this.state.data.customer.firstname = name[0];
      name.shift();
      this.state.data.customer.lastname = name.join(' ');
    }
    this.state.data.product_detail = sellInfo.product_description;
    this.state.data.product_serial = sellInfo.product_serial;
    this.state.data.payment_down = parseFloat(sellInfo.down_payment);
    this.state.data.cost = parseFloat(sellInfo.cost);
    this.state.data.payment_price = parseFloat(sellInfo.remain_price);

    var d = new Date(sellInfo.sell_date);
    this.state.data.payment_on_day = d.getDate();

    // guess month
    for (var i = 12; i >= 1; i--) {
      if (this.state.data.payment_price == Math.floor(this.state.data.payment_price / i) * i) {
        this.state.data.payment_month = i;
        break;
      }
    }
    if (this.state.data.payment_month==1) {
      this.state.data.payment_month = 12;
    }

    this.state.data.payment_per_month = Math.floor(this.state.data.payment_price / this.state.data.payment_month);

    if (data.person != null) {
      this.state.data.customer.prename = data.person.prename;
      this.state.data.customer.birth = data.person.birth.substr(0, 10);
      this.state.data.customer.gender = data.person.gender;
      this.state.data.customer.marital_status = data.person.marital_status;
      this.state.data.customer.mobile = data.person.mobile;
      this.state.data.customer.email = data.person.email;
      this.state.data.customer.lineid = data.person.lineid;
    }

    if (data.address.CARD != null) {
      this.state.data.cardAddr = {
        addr1: data.address.CARD.addr1,
        addr2: data.address.CARD.addr2,
        tambon: data.address.CARD.tambon,
        amphur: data.address.CARD.amphur,
        province: data.address.CARD.province,
        zipcode: data.address.CARD.zipcode,
        tel: data.address.CARD.tel
      };
    }
    if (data.address.HOME != null) {
      this.state.data.customerAddr = {
        addr1: data.address.HOME.addr1,
        addr2: data.address.HOME.addr2,
        tambon: data.address.HOME.tambon,
        amphur: data.address.HOME.amphur,
        province: data.address.HOME.province,
        zipcode: data.address.HOME.zipcode,
        tel: data.address.HOME.tel
      };
    }

    if (data.address.WORK != null) {
      this.state.data.workAddr = {
        addr1: data.address.WORK.addr1,
        addr2: data.address.WORK.addr2,
        tambon: data.address.WORK.tambon,
        amphur: data.address.WORK.amphur,
        province: data.address.WORK.province,
        zipcode: data.address.WORK.zipcode,
        tel: data.address.WORK.tel
      };
    }

    if (data.address.COCARD != null) {
      this.state.data.coCardAddr = {
        addr1: data.address.CARD.addr1,
        addr2: data.address.CARD.addr2,
        tambon: data.address.CARD.tambon,
        amphur: data.address.CARD.amphur,
        province: data.address.CARD.province,
        zipcode: data.address.CARD.zipcode,
        tel: data.address.CARD.tel
      };
    }
    if (data.address.COHOME != null) {
      this.state.data.coAddr = {
        addr1: data.address.HOME.addr1,
        addr2: data.address.HOME.addr2,
        tambon: data.address.HOME.tambon,
        amphur: data.address.HOME.amphur,
        province: data.address.HOME.province,
        zipcode: data.address.HOME.zipcode,
        tel: data.address.HOME.tel
      };
    }

    if (data.address.COWORK != null) {
      this.state.data.coWorkAddr = {
        addr1: data.address.WORK.addr1,
        addr2: data.address.WORK.addr2,
        tambon: data.address.WORK.tambon,
        amphur: data.address.WORK.amphur,
        province: data.address.WORK.province,
        zipcode: data.address.WORK.zipcode,
        tel: data.address.WORK.tel
      };
    }

    this.state.fields.code.list = data.barcode.map(function(item) {
      return {value:item,text:item}
    });

    sellInfo.sell_date = sellInfo.sell_date.substr(0, 10);
    sellInfo.price = helper.numberFormat(sellInfo.price, 2);
    sellInfo.cost = helper.numberFormat(sellInfo.cost, 2);
    sellInfo.main_price = helper.numberFormat(sellInfo.main_price, 2);
    sellInfo.down_payment = helper.numberFormat(sellInfo.down_payment, 2);
    sellInfo.remain_price = helper.numberFormat(sellInfo.remain_price, 2);

    this.setState({
      data:this.state.data,
      sellInfo:sellInfo
    }, function() {
      this.doGenPayment(this.state.contract.start_date);
    }.bind(this));
  },

  onReadIDCardDoneAction: function(info) {
    this.state.data[this.currentCard] = info;
    var addr = '';
    if (this.currentCard=='cusIDCard') {
      addr = 'customerAddr';
      this.state.data.customer.nationid = info.nationid;
      this.state.data.customer.prename = info.prenameTH;
      this.state.data.customer.firstname = info.firstnameTH;
      this.state.data.customer.lastname = info.lastnameTH;
      this.state.data.customer.birth = info.birth;
      this.state.data.customer.gender = info.gender;
      this.state.data.customer.age = calcAge(info.birth);

    } else if (this.currentCard=='coIDCard') {
      addr = 'coAddr';
      this.state.data.co.nationid = info.nationid;
      this.state.data.co.prename = info.prenameTH;
      this.state.data.co.firstname = info.firstnameTH;
      this.state.data.co.lastname = info.lastnameTH;
      this.state.data.co.age = calcAge(info.birth);
    }
    if (!this.state.data[addr].addr1) {
      var tmp = [];
      if (info.address.houseNo) {
        tmp.push(info.address.houseNo);
      }
      if (info.address.villageNo) {
        tmp.push(info.villageNo);
      }
      this.state.data[addr].addr1 = tmp.join(' ');

      tmp = [];
      if (info.address.lane) {
        tmp.push(info.address.lane);
      }
      if (info.address.road) {
        tmp.push(info.address.road);
      }
      if (info.address.unknown) {
        tmp.push(info.address.unknown);
      }
      this.state.data[addr].addr2 = tmp.join(' ');

      // tmp = info.address.tambon.substr(0,4);
      // if (tmp=='ตำบล' || tmp=='แขวง') {
      //   this.state.data[addr].tambon = info.address.tambon.substr(4);
      // } else {
        this.state.data[addr].tambon = info.address.tambon;
      // }

      this.state.data[addr].amphur = info.address.amphur;
      this.state.data[addr].province = info.address.province;
    }

    var obj = {
      data: this.state.data,
    }
    obj[this.currentCard+'PhotoLoading'] = true;
    this.setState(obj);
    systemActions.readIDCardPhoto();
  },

  onReadIDCardErrorAction: function(e) {
    toasterActions.pop({
      type:'warning',
      message:'result.idcard.error'
    });
  },

  onReadIDCardPhotoDoneAction: function(info) {
    var obj = {};

    obj[this.currentCard + 'Photo'] = info.photoPath;
    obj[this.currentCard + 'PhotoLoading'] = false;
    obj[(this.currentCard=='cusIDCard' ? 'customer' : 'co') + 'Photo'] = '';
    this.setState(obj);
  },

  onReadIDCardPhotoErrorAction: function(e) {
    toasterActions.pop({
      type:'warning',
      message:'result.idcard.photo_error'
    });
  },

  onSaveNewDoneAction: function() {
    toasterActions.pop({
      type:'success',
      message: 'result.save.ok'
    });
  },

  onSaveNewErrorAction: function(e) {
    toasterActions.pop({
      type:'warning',
      message:e
    });
  },

  doContractSave: function() {
    // check required
    console.log('contractSave :',this.state);
    var err = [];
    if (this.state.contract.customer.nationid.length != 13) {
      err.push('contract.error.nationid_invalid');
    }
    if (!this.state.contract.customer.firstname) {
      err.push('contract.error.customer_invalid');
    }
    if (!this.state.contract.customer.lastname) {
      err.push('contract.error.customer_invalid');
    }
    if (this.state.contract.co.nationid.length != 13) {
      err.push('contract.error.co_nationid_invalid');
    }
    if (!this.state.contract.co.firstname) {
      err.push('contract.error.co_firstname_required');
    }
    if (!this.state.contract.co.lastname) {
      err.push('contract.error.co_lastname_required');
    }

    if (err.length > 0) {
      dialogActions.show({
        title:'ข้อมูลไม่ถูกต้อง',
        content: (
          <ul>
            {err.map(function(item, i) {
              return (
                <li key={i}>{item}</li>
              )
            }.bind(this))}
          </ul>
        ),
        actions: [
          {id:'ok', icon:'check52', label:'action.close'}
        ]
      }, function(id) {

      });
      return;
    }

    dialogActions.show({
      title:'ยืนยัน',
      content: (
        <ul>
          {err.map(function(item, i) {
            return (
              <li key={i}>{item}</li>
            )
          }.bind(this))}
        </ul>
      ),
      actions: [
        {id:'save', icon:'check52', label:'action.save'},
        {id:'cancel', icon:'close47', label:'action.cancel', default:true}
      ]
    }, function(isCancel, id) {
      if (isCancel || id=='cancel') {
        return;
      }
      var obj = {
        contract: this.state.contract,
        paymentTerm: this.state.paymentTerm,
        genPaymentTerm: this.state.genPaymentTerm
      };
      obj.flagClose = 'N';
      if(this.state.flagClose == 'Y'){
        console.log('save=',this.state.stock_shop);
        obj.stock_shop = this.state.stock_shop;
        obj.stock_shop.new_cost = this.state.contract.new_cost;
        //obj.status = this.state.return.return_status;
        obj.flagClose = this.state.flagClose;
        obj.return = this.state.return;
      }
      //console.log('jacktest=',obj);
      actions.save(obj);
    }.bind(this));
  },

  scrollTo: function(e, id) {
    e.preventDefault();
    if (!this.refs[id]){
      return;
    }
    this.refs[id].getDOMNode().scrollIntoView();
  },

  componentDidMount: function() {
    console.log('componentDidMount');
    infoPanelActions.show('installment.contract.list', null);
    actions.getById(this.state.id);
    actions.getListCollection(this.state.id);

    console.log('id:',this.state.id);
    actions.getMobileNumber({id:this.state.id,type:'โทรหาผู้ซื้อ'});
    actions.closeCaStaffList(this.state.id);
    this.genCloseCAMouth();
  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  // handleChange: function(id, value) {
  //   var tmp = id.split('.');
  //   if (typeof value === 'string') {
  //     value = value.trim();
  //   }
  //   if (tmp.length==2) {
  //     this.state.contract[tmp[0]][tmp[1]] = value;
  //   } else {
  //
  //     this.state.contract[id] = value;
  //   }
  //
  //   // calc age
  //   if (id==='customer.birth') {
  //     this.state.contract.customer.age = calcAge(value);
  //   }
  //
  //   var genPayment = false;
  //   if (id==='payment_month') {
  //     var month = parseInt(value);
  //     var price = parseFloat(this.state.contract.payment_price);
  //     if (month > 0) {
  //       var per_month = Math.floor(price / month);
  //       this.state.contract['payment_per_month'] = per_month;
  //     }
  //     genPayment = true;
  //   }
  //   if (id==='payment_per_month' || id==='payment_on_day') {
  //     genPayment = true;
  //   }
  //
  //   if (id==='customer.birth') {
  //     this.state.contract.customer.age = calcAge(value);
  //   }
  //
  //   console.log('updateState');
  //   this.setState({
  //     contract: this.state.contract
  //   });
  // },

  handleTabClick: function(id) {
    this.setState({
      currentTab:id
    });
  },

  handleIDCardChange: function(card, data) {
//    console.log(data);
    if (data.photoData) {
//      console.log('photoData', data.photoData);
      if (card=='customer') {
        this.customerPhotoData = data.photoData;
      } else {
        this.coPhotoData = data.photoData;
      }
    }
  },

  doGenPayment: function(_mm) {
    var payment = [];
    var amount = Math.floor(this.state.contract.payment_per_month);
    var total = 0;
    var month = parseInt(this.state.contract.payment_month);
    var today = new Date(_mm);
    var mm = today.getMonth();
    var sellID = this.state.contract.sell_id;
    //console.log(sellID);
    var down_price = this.state.contract.down_payment;
    var cost = this.state.contract.cost;
    var install_cost = this.state.contract.install_cost;
    var fee = this.state.contract.fee;
    var cost_term = parseFloat(((cost + install_cost + fee ) - down_price) / month);

    var day = parseInt(this.state.contract.payment_on_day);

    for (var i = 0; i < month; i++) {
      if (i == month-1) {
        amount = parseFloat(this.state.contract.payment_price) - total;
      }
      var date = new Date(today.getFullYear(), mm+i, day);
      if (date.getMonth() != (mm+i)%12) {
        date = new Date(today.getFullYear(), mm+i+1, 0);
      }
      payment.push({
        term_num: i+1,
        due_date: date.getFullYear()+'-'+('0'+(date.getMonth()+1)).substr(-2)+'-'+('0'+date.getDate()).substr(-2),
        due_amount: amount,
        paid_amount: '0',
        paid_date: '0000-00-00',
        term_status: 'WAIT',
        ref_payment_codes:'',
        sell_id: sellID,
        cost_term: cost_term
      });
      total += amount;
    }

    this.setState({
      paymentTerm: payment
    });
  },

  readIDCard: function(card) {
//    console.log('read id card');
    this.currentCard = card;
    this.setState({
      currentTab: card=='cusIDCard' ? 'customer_status' : 'co_status'
    }, function() {
      systemActions.readIDCard();
    });
  },

  paymentTableChange: function(row_i, field_id, value) {
    if (row_i==this.state.paymentData.length-1
      && field_id=='amount') {
      return;
    }
    if (field_id=='amount') {
      // calculate last payment
      var old=this.state.paymentData[row_i]['amount'];
      var new_value = parseFloat(value);
      var diff = new_value - old;
      this.state.paymentData[row_i]['amount'] = new_value;
      this.state.paymentData[this.state.paymentData.length-1]['amount'] -= diff;
    } else {
      this.state.paymentData[row_i][field_id]=value;
    }

    this.setState({
      paymentData: this.state.paymentData
    });
  },

  handleChange: function(id, value) {
    var tmp = id.split('.');
    if (tmp.length==2) {
      this.state.contract[tmp[0]][tmp[1]] = value;
    } else {
      this.state.contract[id] = value;
    }
    // calc age
    if (id==='customer.birth') {
      this.state.contract.customer.age = calcAge(value);
    }

    if (id==='dataSaveCloseCA.install_cost') {
      this.state.contract.customer.age = calcAge(value);
    }

    if (id === 'dataSaveCloseCA.install_cost' || id === 'dataSaveCloseCA.closeca_staff_percent'){
      this.calculateCloseCA();
    }

    this.state.data = this.state.data;

    var genPayment = false;

    if (id==='payment_month') {
      var month = parseInt(value);
      var price = parseFloat(this.state.contract.payment_price);
      if (month > 0) {
        var per_month = Math.floor(price / month);
        this.state.contract['payment_per_month'] = per_month;
      }
      this.state.contract.fee = month <= 3 ? 100 : 200;
      genPayment = true;

    }

    if (id==='payment_on_day') {
      genPayment = true;
    }

    this.setState({
        contract: this.state.contract,
        genPaymentTerm: genPayment
    }, function() {
      if (genPayment) {
        this.doGenPayment(this.state.contract.start_date);
      }
    }.bind(this));

  },

  handleTermChange: function(row_i, field_id, value) {
    if (row_i==this.state.paymentTerm.length-1
      && field_id=='due_amount') {
      return;
    }
    if (this.state.paymentTerm[row_i]['term_status'] != 'WAIT') {
      return;
    }
    if (field_id=='due_amount') {
      // calculate last payment
      var old=this.state.paymentTerm[row_i]['due_amount'];
      var new_value = parseFloat(value);
      var diff = new_value - old;
      this.state.paymentTerm[row_i]['due_amount'] = new_value;
      this.state.paymentTerm[this.state.paymentTerm.length-1]['due_amount'] -= diff;
    } else {
      this.state.paymentTerm[row_i][field_id]=value;
    }

    this.setState({
      paymentTerm: this.state.paymentTerm
    });
  },

  toggleExpand: function(section) {

    this.state.expand[section] = !this.state.expand[section];
    this.setState({
      expand: this.state.expand
    });

  },

  calProfitLost:function(){
    console.log(this.state.expand.close_return);
    var _NewCost = 0
    console.log('new_cost :',this.state.contract.new_cost);
    if (this.state.contract.new_cost != ''){
      _NewCost = parseFloat(this.state.contract.new_cost);
    }
    //var _NewCost = parseFloat(this.state.contract.new_cost);
    var _Balance = parseFloat(this.state.contract.cost - this.state.contract.total_paid);
    var _Fee = parseFloat(this.state.contract.fee);
    var _IntallCost = parseFloat(this.state.contract.install_cost);

    this.state.contract.profit_loss = _NewCost - (_Balance + _Fee + _IntallCost);

    this.setState({
      contract: this.state.contract
    });

  },

  doCollectionSave: function(){

    if (this.state.contract.dataSaveCollection.call_number == '' || this.state.contract.dataSaveCollection.call_remark == ''){
      toasterActions.pop({
        type:'warning',
        message:'result.save.error'
      });
    }else{
      actions.saveCollection(this.state.contract.dataSaveCollection);
    }

  },

  onSaveCollectionDoneAction: function() {

    toasterActions.pop({
      type:'success',
      message:'result.save.ok'
    });
    this.state.contract.dataSaveCollection.call_remark='';

    actions.getListCollection(this.state.id);

  },

  onGetListCollectionDoneAction: function(data){

    this.setState({
      dataCollection: data.collection
    });

  },

  onGetMobileNumberDoneAction: function(data){

    // this.state.fields.collection_number.list = data.mobilenumber.map(function(row) {
    //   return {
    //     value: row.mobile,
    //     text: row.mobile
    //   }
    // });
    //
    // console.log('mobile :',data);
     this.state.contract.dataSaveCollection.call_number = data.mobilenumber[0].number;
     this.state.contract.dataSaveCollection.call_name = data.mobilenumber[0].fullname;

     this.setState({
       contract: this.state.contract
     });


  },

  handleListChange: function(id, value) {

    var tmp = id.split('.');
    if (tmp.length==2) {
      this.state.contract[tmp[0]][tmp[1]] = value;
    } else {
      this.state.contract[id] = value;
    }

    this.setState({
      contract: this.state.contract
    });

    if (id === 'dataSaveCollection.call_type') {
      if(value == 'โทรหาผู้ซื้ออื่น ๆ' || value == 'โทรหาผู้ค้ำอื่น ๆ'){
        this.state.fields.collection_number.readonly = false;
      }else{
        this.state.fields.collection_number.readonly = true;
        actions.getMobileNumber({id:this.state.id,type:value});
      }
      this.state.fields = this.state.fields;
      this.setState({
        fields: this.state.fields
      });
    }

  },

  onPrintCollectionReportDoneAction: function(data){
    window.open(data.pdfFile);
  },

  onPrintCollectionReport: function(){

    this.state.printCollection.id = this.state.id;
    this.state.printCollection.sendto = this.state.contract.dataSaveCollection.collection_send;
    //console.log(this.state.printCollection);
    actions.printCollectionReport(this.state.printCollection);
  },

  onSaveStatusCa: function(){
    actions.saveStatusCA(this.state);
  },

  onCloseCaStaffListDoneAction: function(data){
    this.state.closeca_staffname.list = data.closecastaff.map(function(row) {
      return {
        value: row.id,
        text: row.name
      }
    });
    this.setState({
      closeca_staffname: this.state.closeca_staffname
    });
  },

  calculateCloseCA: function(){
    //this.state.contract.dataSaveCloseCA = this.state.contract.dataSaveCloseCA
    var _ProfitLost =  parseFloat(this.state.contract.total_paid) - (parseFloat(this.state.contract.dataSaveCloseCA.install_cost) + parseFloat( this.state.contract.fee) + parseFloat(this.state.contract.cost));

    this.state.contract.dataSaveCloseCA.closeca_profit_lost = _ProfitLost;
    //var _ProfitLost = parseFloat(this.state.contract.dataSaveCloseCA.closeca_profit_lost);
    var _StaffPer = parseFloat(this.state.contract.dataSaveCloseCA.closeca_staff_percent);
    var _StaffAmount = parseFloat((_StaffPer * _ProfitLost)/100);

    //this.state.contract.dataSaveCloseCA = this.state.contract.dataSaveCloseCA
    this.state.contract.dataSaveCloseCA.closeca_percent = 100 - _StaffPer;
    this.state.contract.dataSaveCloseCA.closeca_staff_amount = _StaffAmount * -1;
    this.state.contract.dataSaveCloseCA.closeca_amount = (_ProfitLost - _StaffAmount) * -1;

    this.setState({
      contract:this.state.contract
    });
  },

  genCloseCAMouth: function(){

    for (i = 0; i < 12; i++) {
      var today = new Date();
      today.setMonth(today.getMonth() + i);
      var _value = today.toJSON().slice(5,7) +'/'+ today.toJSON().slice(0,4);

      this.state.closeca_effective.list.push({value:_value,text:_value});
    }

    this.setState({
      closeca_effective: this.state.closeca_effective
    });
  },

  doCloseCASave: function(){
    console.log(this.state.contract.dataSaveCloseCA);
    actions.saveCloseCa(this.state.contract.dataSaveCloseCA);
  },

  onSaveCloseCaDoneAction: function() {
    toasterActions.pop({
      type:'success',
      message:'result.save.ok'
    });
    //this.state.contract.dataSaveCollection.call_remark='';
    //actions.saveCloseCa(this.state.id);
  },

  render: function() {
    var fields = this.state.fields;
    var contract = this.state.contract;
    var customer = contract.customer || {};
    var co = contract.co || {};
    var paymentTerm = this.state.paymentTerm || [];

    var paymentStatus = paymentTerm.map(function(term) {
      return (
        <li key={term.id} className={'status_' + term.term_status + (term.close_status=='NORMAL'?'':' '+term.close_status)} title={
            'DUE DATE: ' + term.due_date + '\n'
            + 'PAID DATE: ' + term.paid_date + '\n'
            + 'DUE AMOUNT: ' + helper.numberFormat(term.due_amount, 2) + '\n'
            + 'PAID AMOUNT: ' + helper.numberFormat(term.paid_amount, 2) + '\n'
            + 'STATUS: ' + term.term_status}></li>
      );
    });

    //var _photoCard = "//localhost:9001/idcard/photo/" + customer.nationid + ".jpg";

    var contractSummary = (
      <div className="contract-section">
        <div className="flex">
          <div className="panel1 no-shrink">
            <img src={this.state.cusIDCardPhoto} style={{width:'80px'}}/>
          </div>
          <div className="panel4 flex-v">
            <div className="ellipsis" style={{fontSize:'18pt',height:'40px',lineHeight:'48px'}}>{customer.fullname}</div>
            <div className="ellipsis">{helper.formatNationID(customer.nationid)}</div>
            <div className="ellipsis">ผู้เช่าซื้อร่วม {co.fullname}</div>
          </div>
          <div className="panel5 flex-v">
            <div className="flex">
              <div className="can-grow" style={{fontSize:'18pt',height:'40px',lineHeight:'48px'}}>{formatContractCode(contract.code)}</div>
              <div className="can-grow" style={{fontSize:'18pt',height:'40px',lineHeight:'48px',textAlign:'right',color:statusColor[contract.current_status]}}>
                <span className={'flaticon-'+statusIcon[contract.current_status]}></span>
                <T content={'installment.contract.current_status.'+contract.current_status}/>
              </div>
            </div>
            <div>
              เริ่มสัญญา:<span style={{color:'blue',padding:'0 8px'}}>{tr.localize(new Date(contract.sign_date), {type:'date', format:'long'})}</span>
            งวดสุดท้าย: <span style={{color:'blue', padding:'0 8px'}}>{paymentTerm.length==0 ?
              '' : tr.localize(new Date(paymentTerm[paymentTerm.length-1].due_date), {type:'date', format:'long'})}</span>
            </div>
            <div>
              <ul className="contract_status2">{paymentStatus}</ul>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="panel5">
            <div className="ellipsis blue" style={{fontSize:'18pt',height:'40px',lineHeight:'48px'}}>{contract.product_detail}</div>
            <div>S/N: <span className="blue">{contract.product_serial}</span></div>
          </div>
          <div className="panel5 flex">
            <div className="can-grow">
              <div className="flex">
                <div className="can-grow">ราคาสินค้า</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.total_price,2)}</span> บาท</div>
              </div>
              <div className="flex">
                <div className="can-grow">ดาวน์</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.down_payment,2)}</span> บาท</div>
              </div>
              <div className="flex">
                <div className="can-grow">ราคาผ่อน</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.payment_price,2)}</span> บาท</div>
              </div>
              <div className="flex">
                <div className="can-grow">ต้นทุน</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.cost,2)}</span> บาท</div>
              </div>
              <div className="flex">
                <div className="can-grow">ค่าติดตั้ง</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.install_cost,2)}</span> บาท</div>
              </div>
            </div>
            <div className="no-shrink" style={{padding:'0 4px'}}></div>
            <div className="can-grow">
              <div className="flex">
                <div className="can-grow">ชำระต่อเดือน</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.payment_per_month,2)}</span> บาท</div>
              </div>
              <div className="flex">
                <div className="can-grow">ชำระแล้ว</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.total_paid,2)}</span> บาท</div>
              </div>
              <div className="flex">
                <div className="can-grow">ส่วนลด</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.payment_price-contract.discount,2)}</span> บาท</div>
              </div>
              <div className="flex">
                <div className="can-grow">คงเหลือ</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.payment_price-(contract.total_paid-contract.down_payment),2)}</span> บาท</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.payment_price-(contract.total_paid - contract.down_payment),2)}</span> บาท</div>
              </div>
              <div className="flex">
                <div className="can-grow">ค่าทำสัญญา</div>
                <div className="right no-shrink"><span className="blue">{helper.numberFormat(contract.fee,2)}</span> บาท</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="panel2">
            <div className="flex" >
              <div className="can-grow">เลขที่ขาย</div>
              <div className="left no-shrink">{contract.sell_id}</div>
            </div>
            <div className="flex" >
              <div className="can-grow">วันที่ขาย</div>
              <div className="left no-shrink">{tr.localize(new Date(contract.sell_date), {type:'date', format:'short'})}</div>
            </div>
            <div className="flex" >
              <div className="can-grow">พนักงานขาย</div>
              <div className="left no-shrink">{contract.sell_staff_name}</div>
            </div>
          </div>
          <div className="panel2">
            <div className="flex" >
              <div className="can-grow">สาขาที่ทำสัญญา</div>
              <div className="left no-shrink">{contract.shop_name}</div>
            </div>
            <div className="flex" >
              <div className="can-grow">พนักงานไฟแนนซ์</div>
              <div className="left no-shrink">{contract.finance_staff_name}</div>
            </div>
          </div>
        </div>
      </div>
    );

    var customerProfile = (
      <div className="contract-section" style={this.state.expand.customer ? {
          marginTop:'8px',
          borderRadius:'8px 8px 0 0',
          borderBottom:'1px solid blue'
        } : {marginTop:'8px'} }>
        <div className={this.state.expand.customer ? 'none' : 'flex'}>
          <div className="box10 flex">
            <div className="panel2">
              <div className="section-header can-grow flex" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('customer')}.bind(this)}>
                <div className="can-grow">ผู้เช่าซื้อ</div>
                <div className="flaticon-expand38 no-shrink" style={{marginTop:'4px'}}></div>
              </div>
            </div>
            <div className="panel8">ข้อมูลผู้เช่าซื้อโดยสรุป</div>
          </div>
        </div>
        <div className={this.state.expand.customer ? 'flex' : 'none'}>
          <div className="box6 no-shrink">
            <div className="panel6 flex">
              <div className="section-header can-grow flex" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('customer')}.bind(this)}>
                <div className="can-grow">ผู้เช่าซื้อ</div>
                <div className="flaticon-expand39 no-shrink" style={{marginTop:'4px'}}></div>
              </div>
              <div className="panel4 flex">
                <FlexTextInput field={this.state.fields.nationid} data={this.state.contract} onChange={this.handleChange}/>
                <FlexIcon icon="framed1" className="no-shrink" title="contract.read_id" onClick={
                    function() {
                      toasterActions.pop({
                        type:'warning',
                        message:'result.idcard.disabled'
                      });
                      return;
                      this.readIDCard('cusIDCard')
                    }.bind(this)
                  } style={{padding:'4px'}}/>
              </div>
            </div>
            <div className="panel6 flex">
              <div style={{width:"160px", flexShrink:0}}>
                <FlexTextInput field={this.state.fields.prename} data={this.state.contract} onChange={this.handleChange}/>
              </div>
              <div style={{width:'4px'}}></div>
              <FlexTextInput field={this.state.fields.firstname} data={this.state.contract} onChange={this.handleChange}/>
              <div style={{width:'4px'}}></div>
              <FlexTextInput field={this.state.fields.lastname} data={this.state.contract} onChange={this.handleChange}/>
            </div>
            {
              component.customerInfo(this.state.fields, this.state.contract, {
                HOME: this.state.contract.customerAddr.addr_text,
                WORK: this.state.contract.workAddr.addr_text
              }, this.handleChange)
            }
          </div>
          <div className="panel4">
            <NationIDCard
              idcard={this.state.contract.customer.idcard_info || {}}
              photoPath={this.state.cusIDCardPhoto}
              photoLoading={this.state.cusIDCardPhotoLoading}
              onChange={function(data) {this.handleIDCardChange('customer', data)}.bind(this)}
            />
          </div>
        </div>
      </div>
    );
    var customerAddress = (
      <div className={(this.state.expand.customer ? 'flex' : 'none') + ' contract-section'} style={{borderTop:'none', borderBottom:'none', borderRadius:'0px'}}>
        {component.customerAddressStatus(
              this.state.fields, this.state.contract, this.handleChange, true
        )}
      </div>
    );
    var customerWork = (
      <div  className={(this.state.expand.customer ? 'flex' : 'none') + ' contract-section'} style={{borderRadius:'0 0 8px 8px', borderTop:'1px solid blue'}}>
        <div className="box5">
          <div className="panel5">
            <T content="contract.work_status" component="div" className="section-header"/>
          </div>
          <div className="panel5" style={{paddingBottom:'0'}}>
            <FlexTextInput field={this.state.fields.work_company} data={this.state.contract} onChange={this.handleChange}/>
          </div>
          <AddressInfo ref="workAddr" otherLabel="contract.address.fax" onChange={function(data) {
              this.handleChange('workAddr', data);
            }.bind(this)}
            data={this.state.contract.workAddr}
            />
        </div>
        {component.customerJobStatus(
          this.state.fields, this.state.contract, this.handleChange
        )}
      </div>
    );

    var coProfile = (
      <div className="contract-section" style={{marginTop:'8px'}}>
        <div className={this.state.expand.co ? 'none' : 'flex'}>
          <div className="box10 flex">
            <div className="panel2">
              <div className="section-header can-grow flex" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('co')}.bind(this)}>
                <div className="can-grow">ผู้เช่าซื้อร่วม</div>
                <div className="flaticon-expand38 no-shrink" style={{marginTop:'4px'}}></div>
              </div>
            </div>
            <div className="panel8">ข้อมูลผู้เช่าซื้อร่วมโดยสรุป</div>
          </div>
        </div>
        <div className={this.state.expand.co ? 'flex' : 'none'}>
          <div className="box6 no-shrink">
            <div className="panel6 flex">
              <div className="section-header can-grow flex" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('co')}.bind(this)}>
                <div className="can-grow">ผู้เช่าซื้อร่วม</div>
                <div className="flaticon-expand39 no-shrink" style={{marginTop:'4px'}}></div>
              </div>
              <div className="panel4 flex">
                <FlexTextInput field={this.state.fields.co_nationid} data={this.state.contract} onChange={this.handleChange}/>
                <FlexIcon icon="framed1" className="no-shrink" title="contract.read_id" onClick={
                    function() {
                      toasterActions.pop({
                        type:'warning',
                        message:'result.idcard.disabled'
                      });
                      return;
                      this.readIDCard('cusIDCard')
                    }.bind(this)
                  } style={{padding:'4px'}}/>
              </div>
            </div>
            <div className="panel6 flex">
              <div style={{width:"160px", flexShrink:0}}>
                <FlexTextInput field={this.state.fields.co_prename} data={this.state.contract} onChange={this.handleChange}/>
              </div>
              <div style={{width:'4px'}}></div>
              <FlexTextInput field={this.state.fields.co_firstname} data={this.state.contract} onChange={this.handleChange}/>
              <div style={{width:'4px'}}></div>
              <FlexTextInput field={this.state.fields.co_lastname} data={this.state.contract} onChange={this.handleChange}/>
            </div>
            <div className="panel6 flex">
              <div style={{width:'280px'}}>
                <FlexTextInput field={this.state.fields.co_mobile} data={this.state.contract} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
          <div className="panel4">
            <NationIDCard
              idcard={this.state.contract.co.idcard_info || {}}
              photoPath={this.state.coIDCardPhoto}
              photoLoading={this.state.cusIDCardPhotoLoading}
              onChange={function(data) {this.handleIDCardChange('co', data)}.bind(this)}
            />
          </div>
        </div>

      </div>
    );

    var coAddress = (
      <div className={(this.state.expand.co ? 'flex' : 'none') + ' contract-section'} style={{borderTop:'none', borderBottom:'none', borderRadius:'0px'}}>
        {component.coAddressStatus(
              this.state.fields, this.state.contract, this.handleChange, true
        )}
      </div>
    );

    var coWork = (
      <div  className={(this.state.expand.co ? 'flex' : 'none') + ' contract-section'} style={{borderRadius:'0 0 8px 8px', borderTop:'1px solid blue'}}>
        <div className="box5">
          <div className="panel5">
            <T content="contract.work_status" component="div" className="section-header"/>
          </div>
          <div className="panel5" style={{paddingBottom:'0'}}>
            <FlexTextInput field={this.state.fields.co_work_company} data={this.state.contract} onChange={this.handleChange}/>
          </div>
          <AddressInfo ref="coWorkAddr" otherLabel="contract.address.fax" onChange={function(data) {
              this.handleChange('coWorkAddr', data);
            }.bind(this)}
            data={this.state.contract.coWorkAddr}
            />
        </div>
        {component.coJobStatus(
          this.state.fields, this.state.contract, this.handleChange
        )}
      </div>
    );

    var editPaymentMonth = (<div style={{width:"30px"}}><FlexTextInput
      field={this.state.fields.close_return_newcost}
      data={this.state.contract}
      onChange={this.handleChange}
      onKeyUp={this.calProfitLost}
      /></div>)

    var paymentTermSummary = (
      <div className="box2">
        <div className="panel2">
          <div className="flex section-header" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('payment_term')}.bind(this)}>
            <T content="contract.payment_status" component="div" className="can-grow"/>
            <div className="flaticon-expand39 no-shrink" style={{marginTop:'4px'}}></div>
          </div>
        </div>
        <div className="panel2 flex">
          <FlexTextInput
            field={this.state.fields.payment_month}
            data={this.state.contract}
            onChange={this.handleChange}
            />
        </div>
        <div className="panel2 flex">
          <FlexTextInput
            field={this.state.fields.payment_price}
            data={this.state.contract}
            onChange={this.handleChange}
            />
        </div>
        <div className="panel2 flex">
          <FlexTextInput
            field={this.state.fields.payment_per_month}
            data={this.state.contract}
            onChange={this.handleChange}
            />
        </div>
        <div className="panel2 flex">
          <FlexTextInput
            field={this.state.fields.payment_on_day}
            data={this.state.contract}
            onChange={this.handleChange}
            />
        </div>
      </div>
    )
    var paymentTerms = (
      <div className="panel8 no-shrink">
        <FlexDataTable
          fields={this.state.termFields}
          data={paymentTerm}
          displayRows={6}
          canEdit={function(row, field) {
            if (paymentTerm[row].term_status != 'WAIT'
              || paymentTerm[row].close_status != 'NORMAL') {
                return false;
            }
            if (row < paymentTerm.length-1 && field=='due_date') {
              return true;
            }
            if (row == paymentTerm.length-1 && field=='due_date') {
              return true;
            }
            return false;
          }.bind(this)}
          onChange={this.handleTermChange}
          />
      </div>
    );

    var paymentTermSection = (
      <div className="contract-section" style={{marginTop:'8px'}}>
        <div className={'box10 ' + (this.state.expand.payment_term ? 'none' : 'flex')}>
          <div className="panel2">
            <div className="flex no-shrink section-header can-grow" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('payment_term')}.bind(this)}>
              <T content="contract.payment_status" component="div" className="can-grow"/>
              <div className="flaticon-expand38 no-shrink" style={{marginTop:'4px'}}></div>
            </div>
          </div>
          <div className="panel8 can-grow">ข้อมูลงวดการจ่ายโดยสรุป</div>
        </div>
        <div className={this.state.expand.payment_term ? 'flex' : 'none'}>
          {paymentTermSummary}
          {paymentTerms}
        </div>
      </div>
    );

    var paymentDetail = (
      <div className="panel6 no-shrink">
        <div className="section-header">Payment Details</div>
      </div>
    );

    var closeReturn = (

      <div className="contract-section" style={{marginTop:'8px'}}>
        <div className={this.state.expand.close_return ? 'none' : 'flex'}>
          <div className="box10 flex">
            <div className="panel2">
              <div className="section-header can-grow flex" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('close_return')}.bind(this)}>
                <div className="can-grow">ปิดสัญญายึด/คืน</div>
                <div className="flaticon-expand38 no-shrink" style={{marginTop:'4px'}}></div>
              </div>
            </div>
            <div className="panel8">ข้อมูลปิดสัญญายึด/คืนของ</div>
          </div>
        </div>
        <div className={this.state.expand.close_return ? 'flex' : 'none'}>
          <div className="box6 no-shrink">
            <div className="panel6 flex">
              <div className="section-header can-grow flex" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('close_return')}.bind(this)}>
                <div className="can-grow">ปิดสัญญาคืนของ</div>
                <div className="flaticon-expand39 no-shrink" style={{marginTop:'4px'}}></div>
              </div>
            </div>
            <div className="box10 flex">
              <div className="panel3">
                <div style={{width:"280px", flexShrink:0}}>
                  <FlexTextInput
                    field={this.state.fields.close_return_newcost}
                    data={this.state.contract}
                    onChange={this.handleChange}
                    onKeyUp={this.calProfitLost}
                    live={true}
                    />
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <div style={{width:"280px", flexShrink:0}}>
                  <FlexTextInput field={this.state.fields.close_return_oldcost} data={this.state.contract} onChange={this.handleChange}/>
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <div style={{width:"280px", flexShrink:0}}>
                  <FlexTextInput field={this.state.fields.close_return_paid} data={this.state.contract} onChange={this.handleChange}/>
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <div style={{width:"280px", flexShrink:0}}>
                  <FlexTextInput field={this.state.fields.close_return_balance} data={{balance:helper.numberFormat(this.state.contract.cost - this.state.contract.total_paid, 2)}} onChange={this.handleChange}/>
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <div style={{width:"280px", flexShrink:0}}>
                  <FlexTextInput field={this.state.fields.close_return_contract_free} data={this.state.contract} onChange={this.handleChange}/>
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <div style={{width:"280px", flexShrink:0}}>
                  <FlexTextInput field={this.state.fields.close_return_install_free} data={this.state.contract} onChange={this.handleChange}/>
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <div style={{width:"280px", flexShrink:0}}>
                  <FlexTextInput field={this.state.fields.close_return_profit_loss} data={this.state.contract} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="panel6">
                <div className="flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.close_return_sell_id} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"8px", flexShrink:0}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.close_return_product_detail} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <div className="flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.close_return_sign_date} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"8px", flexShrink:0}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.close_return_cus_name} data={{cus_name:this.state.contract.customer.fullname}} onChange={this.handleChange}/>
                  </div>
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <div className="flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.close_return_product_serial} data={this.state.return} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"8px", flexShrink:0}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.close_return_product_condition} data={this.state.return} onChange={this.handleChange}/>
                  </div>
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <div className="flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.co_nationid} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"8px", flexShrink:0}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.close_return_remark} data={this.state.return} onChange={this.handleChange}/>
                  </div>
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <div className="flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.close_return_return_date} data={this.state.return} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"8px", flexShrink:0}}></div>
                </div>
                <div style={{height:"4px", flexShrink:0}}></div>
                <FlexDataTable
                  fields={this.state.return_detail}
                  data={this.state.returndetail}
                  displayRows={3}
                  />
              </div>
            </div>
          </div>
          <div className="panel4">
          </div>
        </div>
      </div>
    );

    var collection = (

      <div className="contract-section" style={{marginTop:'8px'}}>
        <div className={this.state.expand.collection ? 'none' : 'flex'}>
          <div className="box10 flex">
            <div className="panel2">
              <div className="section-header can-grow flex" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('collection')}.bind(this)}>
                <div className="can-grow">โทรตามหนี้</div>
                <div className="flaticon-expand38 no-shrink" style={{marginTop:'4px'}}></div>
              </div>
            </div>
            <div className="panel8">ข้อมูลโทรตามหนี้</div>
          </div>
        </div>
        <div className={this.state.expand.collection ? 'flex' : 'none'}>
          <div className="box6 no-shrink">
            <div className="panel6 flex">
              <div className="section-header can-grow flex" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('collection')}.bind(this)}>
                <div className="can-grow">โทรตามหนี้</div>
                <div className="flaticon-expand39 no-shrink" style={{marginTop:'4px'}}></div>
              </div>
            </div>
            <div className="box10">
              <div className="panel9">
                <h2>1.บันทึกรายการโทรตามหนี้</h2>
              </div>
              <div className="panel10 flex">
                <div className="panel8 flex no-shrink">
                  <FlexDropdown
                    field={this.state.fields.collection_type}
                    data={this.state.contract}
                    onChange={this.handleListChange}
                    />
                  <div style={{width:"4px", flexShrink:0}}></div>
                  <FlexTextInput field={this.state.fields.collection_number} data={this.state.contract} onChange={this.handleChange} />
                  <div style={{height:"4px", flexShrink:0}}></div>
                </div>
              </div>
              <div className="panel10 flex">
                <div className="panel8 flex no-shrink">
                  <FlexTextInput field={this.state.fields.collection_date} data={this.state.contract} onChange={this.handleChange} />
                  <div style={{width:"4px", flexShrink:0}}></div>
                  <FlexTextInput field={this.state.fields.collection_call_name} data={this.state.contract} onChange={this.handleChange}/>
                  <div style={{height:"4px", flexShrink:0}}></div>
                </div>
              </div>
              <div className="panel10 flex">
                <div className="panel10 flex no-shrink">
                    <FlexTextInput field={this.state.fields.collection_call_remark} data={this.state.contract} onChange={this.handleChange}/>
                      <div className="panel2 no-shrink">
                        <FlexButton
                          label="collection.save"
                          icon="save20"
                          default={true}
                          onClick={this.doCollectionSave}
                          />
                      </div>
                </div>
              </div>
              <div className="panel10">
                <FlexDataTable
                  fields={this.state.collection}
                  data={this.state.dataCollection}
                  displayRows={5}
                  />
              </div>
              <div className="panel9">
                <h2>2.พิมพ์เอกสาร</h2>
              </div>
              <div className="panel9 flex no-shrink">
                <div className="panel3 flex no-shrink">
                  <FlexDropdown
                    field={this.state.fields.collection_send}
                    data={this.state.contract}
                    onChange={this.handleListChange}
                    />
                </div>
                <div className="panel2 flex no-shrink">
                  <FlexButton
                    label="collection.print"
                    icon="printer88"
                    default={true}
                    onClick={this.onPrintCollectionReport}
                    />
                </div>
              </div>
            </div>
          </div>
          <div className="panel4">
          </div>
        </div>
      </div>
    );

    var closeca = (

      <div className="contract-section" style={{marginTop:'8px'}}>
        <div className={this.state.expand.closeca ? 'none' : 'flex'}>
          <div className="box10 flex">
            <div className="panel2">
              <div className="section-header can-grow flex" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('closeca')}.bind(this)}>
                <div className="can-grow">ปิดสัญญาหนีหนี้</div>
                <div className="flaticon-expand38 no-shrink" style={{marginTop:'4px'}}></div>
              </div>
            </div>
            <div className="panel8">ข้อมูลปิดสัญญาหนีหนี้</div>
          </div>
        </div>
        <div className={this.state.expand.closeca ? 'flex' : 'none'}>
          <div className="box6 no-shrink">
            <div className="panel6 flex">
              <div className="section-header can-grow flex" style={{cursor:'pointer'}} onClick={function() {this.toggleExpand('closeca')}.bind(this)}>
                <div className="can-grow">ปิดสัญญาหนีหนี้</div>
                <div className="flaticon-expand39 no-shrink" style={{marginTop:'4px'}}></div>
              </div>
            </div>
            <div className="panel10">
              <div className="panel10 flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_contract_code} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_sell_id} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_sign_date} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
              </div>
              <div className="panel10 flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_serial} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"565px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_product} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
              </div>
              <div className="panel10 flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_nationid} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"565px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_cus_name} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
              </div>
              <div className="panel10 flex">
                  <div style={{width:"208px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_overday} data={this.state.contract.dataSaveCloseCA} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"208px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_lastpaid} data={this.state.contract.dataSaveCloseCA} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                    <div style={{width:"208px", flexShrink:0}}>
                      <FlexDropdown
                        field={this.state.closeca_effective}
                        data={{'dataSaveCloseCA.closeca_effective':this.state.contract.dataSaveCloseCA.closeca_effective}}
                        onChange={this.handleListChange}
                        />
                    </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"208px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_date} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
              </div>
              <div className="panel10 flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_totalprice} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"565px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_remark} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
              </div>
              <div className="panel10 flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_cost} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_new_cost} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
              </div>
              <div className="panel10 flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_installcost} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexDropdown
                      field={this.state.closeca_staffname}
                      data={{'dataSaveCloseCA.closeca_staff':this.state.contract.dataSaveCloseCA.closeca_staff}}
                      onChange={this.handleListChange}
                      />
                  </div>
              </div>
              <div className="panel10 flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_fee} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_staff_percent} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_staff_amount} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
              </div>
              <div className="panel10 flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_totalpaid} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_percent} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"5px"}}></div>
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_amount} data={this.state.contract} onChange={this.handleChange}/>
                  </div>
              </div>
              <div className="panel10 flex">
                  <div style={{width:"280px", flexShrink:0}}>
                    <FlexTextInput field={this.state.fields.closeca_profit_lost} data={this.state.contract.dataSaveCloseCA} onChange={this.handleChange}/>
                  </div>
                  <div style={{width:"378px", flexShrink:0}}></div>
                  <div style={{width:"192px", flexShrink:0}}>
                    {function(){
                      if (this.state.contract.permission_save) {
                        return (
                          <FlexButton icon="save20" label="closeca.saveca" default={true}
                            disabled={this.state.contract.current_status == 'CLOSE_BAD_DEBT' ? true : false }
                            onClick={this.doCloseCASave}/>
                        )
                      }
                    }.call(this)}
                  </div>
              </div>
            </div>
          </div>
          <div className="panel4">
          </div>
        </div>
      </div>
    );

    var _shopName = system.sessionStore.getSession().shop.code + " " + system.sessionStore.getSession().shop.name;

    return (
      <div className="content-page flex-form">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="contract.title.view" component="h2" />
          </div>
          <div className="panel3 no-shrink">
            <div style={{textAlign:'center', border:'1px solid silver', height:'30px', lineHeight:'36px', fontSize:'14pt'}}>{_shopName}</div>
          </div>
          <div className="panel2 no-shrink">
            <FlexButton icon="save20"
              label="action.save"
              default={true}
              disabled={this.state.contract.current_status != 'DEBT' && this.state.contract.current_status != 'NORMAL' ? true : false }
              onClick={this.doContractSave}/>
          </div>
        </div>
        <div className="content-body boxf">
          <form ref="frm">
            {contractSummary}
            {customerProfile}
            {customerAddress}
            {customerWork}
            {coProfile}
            {coAddress}
            {coWork}
            {paymentTermSection}
            {this.state.flagClose == 'Y'? closeReturn : ""}
            {collection}
            {closeca}
          </form>
        </div>
      </div>
    );
  }
});

module.exports = ContractEdit;
