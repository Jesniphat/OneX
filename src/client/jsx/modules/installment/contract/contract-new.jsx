var React     = require('react');
var Reflux    = require('reflux');
var Router    = require('react-router');
var Link      = Router.Link;
var T         = require('react-translate-component');
var tr        = require('counterpart');

var system            = require('ss-system');
var widgets           = require('ss-widget');

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

var ContractNew = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(actions.getSellInfo.done, 'onGetSellInfoDoneAction'),
    Reflux.listenTo(systemActions.readIDCard.done, 'onReadIDCardDoneAction'),
    Reflux.listenTo(systemActions.readIDCard.error, 'onReadIDCardErrorAction'),
    Reflux.listenTo(systemActions.readIDCardPhoto.done, 'onReadIDCardPhotoDoneAction'),
    Reflux.listenTo(systemActions.readIDCardPhoto.error, 'onReadIDCardPhotoErrorAction'),
    Reflux.listenTo(actions.saveNew.done, 'onSaveNewDoneAction'),
    Reflux.listenTo(actions.saveNew.error, 'onSaveNewErrorAction'),
    Reflux.listenTo(actions.getContractID.done, 'onGetContractIDDoneAction'),
    Reflux.listenTo(actions.getById.done, 'onGetByIdDoneAction'),
    Reflux.listenTo(actions.getPersonCard.done, 'onGetPersonCardDoneAction'),
    Reflux.listenTo(actions.getPersonCard.error, 'onGetPersonCardErrorAction'),
    Reflux.listenTo(actions.getPersonCardCo.done, 'onGetPersonCardCoDoneAction'),
    Reflux.listenTo(actions.getPersonCardCo.error, 'onGetPersonCardCoErrorAction')
  ],

  getInitialState: function() {
    var sellId = parseInt(this.context.router.getCurrentParams().sellId);
    var sellType = this.context.router.getCurrentParams().sellType;
    var contractref = this.context.router.getCurrentParams().contractref == undefined ? '': this.context.router.getCurrentParams().contractref ;
    var sellold = this.context.router.getCurrentParams().sellold == undefined ? '':this.context.router.getCurrentParams().sellold ;
    //console.log('contractref=',contractref);
    var fields = {
      code: {
        id:'code',
        type:'dropdown',
        label:'contract.code',
        readonly:false,
        list: []
      },
      code_ref: {
        id:'contract_ref',
        type:'dropdown',
        label:'contract.code',
        readonly:false,
        list: []
      },
      sign_date: {
        id: 'sign_date',
        type: 'date',
        label: 'contract.sign_date',
        require:true
      },
      shop_code: {
        id: 'shop_code',
        type: 'text',
        label: 'contract.shop_code',
        readonly:true
      },
      contract_ref: {
        id: 'contract_ref',
        type: 'text',
        label: 'contract.contract_ref',
        readonly:true
      },
      customer: {
        nationid: {
          id:'customer.nationid',
          type:'text',
          label:'person.nationid',
          required:true,
          pattern:'^[0-9]{13}$'
        },
        prename: {
          id:'customer.prename',
          type:'text',
          label:'person.prename'
//          width:160
        },
        firstname: {
          id:'customer.firstname',
          type:'text',
          label:'person.firstname',
//          width:196,
          required:true,
          readonly:true
        },
        lastname: {
          id:'customer.lastname',
          type:'text',
          label:'person.lastname',
//          width:196,
          required:true,
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
          id:'customer.mobile',
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
        }
      },
      co: {
        nationid: {
          id:'co.nationid',
          type:'text',
          label:'person.nationid',
          required:true,
          pattern:'^[0-9]{13}$'
        },
        prename: {
          id:'co.prename',
          type:'text',
          label:'person.prename'
//          width:160
        },
        firstname: {
          id:'co.firstname',
          type:'text',
          label:'person.firstname',
//          width:196,
          required:true,
          readonly:true
        },
        lastname: {
          id:'co.lastname',
          type:'text',
          label:'person.lastname',
//          width:196,
          required:true,
          readonly:true
        }
      },
      product: {
        id:'product_detail',
        type:'text',
        label:'contract.product',
        readonly:true
      },
      payment_month: {
        id:'payment_month',
        type:'numberinput',
        label:'contract.payment_month',
        required:true,
        min:1,
        max:60
      },
      payment_price: {
        id:'payment_price',
        type:'numberinput',
        label:'contract.payment_price',
        readonly:true
      },
      fee: {
        id:'fee',
        type:'numberinput',
        label:'contract.fee',
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
        min:1,
        max:31,
        label:'contract.payment_on_day',
        required:true
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
        type:'numberinput',
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
      co_mobile: {
        id:'co_mobile',
        type:'text',
        label:'contract.mobile'
      },
      co_email: {
        id:'co_email',
        type:'email',
        label:'contract.email'
      },
      co_relation: {
        id:'co_relation',
        type:'text',
        label:'contract.co_relation'
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
      }
    };

    return {
      sellId:sellId,
      fields:fields,
      flagSell:false,
      flagEdit:sellType == 'NORMAL'? false : true,
      prefix_code:'',
      contractref:contractref,
      sellold:sellold,
      data:{
        customer:{
          gender:'N/A',
          marital_status:'N/A',
          birth:'1980-01-01',
          age:30,
          mobile:'',
          email:''
        },
        cardAddr:{},
        customerAddr:{},
        workAddr:{},
        co:{},
        coCardAddr:{},
        coAddr:{},
        coWorkAddr:{},
        doc_send_to:'HOME',
        addr_owner:'02',
        addr_with:'02',
        addr_person:2,
        cusIDCard:{},
        coIDCard:{},
        contract_ref:''
      },
      currentTab: 'customer_status',
      paymentFields: [
        {name:'no', type:'number', label:'contract.term.num', readonly:true, width:'80px'},
        {name:'date', type:'date', label:'contract.term.due_date', width:'200px', render:function(row) {
          return tr.localize(new Date(row.date), {type:'date', format:'long'});
        }},
        {name:'amount', type:'number', label:'contract.term.due_amount', render:function(row) {
          return helper.numberFormat(parseFloat(row.amount),2);
        }}
      ],
      paymentData:[
      ],
      sellInfo: {
        sell_date:'',
        receipt_no:'',
        shop_name:'',
        product_description:'',
        product_serial:'',
        price:0,
        cost:0,
        main_price:0,
        down_payment:0,
        remain_price:0,
        sell_staff:'',
        finance_staff:''
      }
    };
  },

  onGetSellInfoDoneAction: function(data) {
    if (data==null) {
      return;
    }
    // console.log(this.state.flagEdit);
    // console.log(data);

    var sellInfo = data.sell;

    var name = sellInfo.company_name.trim().split(/\s+/g).map(function(item) {
      return item.trim();
    });
    //console.log('sellref=',this.state.contractref);
    this.state.data.code = '';
    this.state.data.ref_code = sellInfo.contract_ref;
    this.state.data.contract_ref = this.state.contractref != '' ? this.state.contractref:'' ;
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

    this.state.data.finance_staff_id = sellInfo.finance_staff_id;
    this.state.data.sell_staff_id = sellInfo.sell_staff_id;
    console.log('sell_staff_id=', sellInfo.sell_staff_id, 'finance_staff_id=', sellInfo.finance_staff_id);

    this.state.data.product_detail = sellInfo.product_description;
    this.state.data.product_serial = sellInfo.product_serial;
    this.state.data.payment_down = parseFloat(sellInfo.down_payment);
    this.state.data.total_price = parseFloat(sellInfo.price);
    this.state.data.cost = parseFloat(sellInfo.cost);
    this.state.data.payment_price = parseFloat(sellInfo.remain_price);
    this.state.data.fee = this.state.data.payment_price > 3000 ? 200 : 100;
    this.state.data.install_cost = parseFloat(sellInfo.install_cost);

    var d = new Date(sellInfo.sell_date);
    this.state.data.payment_on_day = d.getDate();

    // guess month
    // for (var i = 12; i >= 1; i--) {
    //   if (this.state.data.payment_price == Math.floor(this.state.data.payment_price / i) * i) {
    //     this.state.data.payment_month = i;
    //     break;
    //   }
    // }
    // if (this.state.data.payment_month==1) {
    //   this.state.data.payment_month = 12;
    // }

    this.state.data.payment_month ='';

    this.state.data.payment_per_month = Math.floor(this.state.data.payment_price / this.state.data.payment_month);
    this.state.data.fee = this.state.data.payment_month <= 3 ? 100 : 200;

    if (data.person != null) {
      this.state.data.customer.prename = data.person.prename;
      this.state.data.customer.birth = data.person.birth.substr(0, 10);
      this.state.data.customer.gender = data.person.gender;
      this.state.data.customer.marital_status = data.person.marital_status;
      this.state.data.customer.mobile = data.person.mobile;
      this.state.data.customer.email = data.person.email;
      this.state.data.customer.lineid = data.person.lineid;
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

    if (this.state.flagEdit == true){

      this.state.fields.code.list = data.used_barcode.map(function(item) {
        return {value:item,text:item.substr(0, 10)+'-'+item.substr(10,5) + '-'+item.substr(15,2)}
      });
      this.state.fields.code.list.unshift({value:'', text:''});

    }else{
      if (data.flagSell == true){
        this.state.fields.code.list.unshift({value:'สดพิเศษ', text:'สดพิเศษ'});
        this.state.data.code = 'สดพิเศษ';
        this.state.data.ref_code ='สดพิเศษ';
        this.state.data.co.nationid = '0000000000000';
        this.state.data.co.prename = '';
        this.state.data.co.firstname = 'สดพิเศษ';
        this.state.data.co.lastname = 'สดพิเศษ';
        this.state.data.fee = 0;
      }else{
        this.state.fields.code.list = data.barcode.map(function(item) {
          return {value:item,text:item.substr(0, 10)+'-'+item.substr(10,5) + '-'+item.substr(15,2)}
        });
        this.state.fields.code.list.unshift({value:'', text:''});
      }
    }

    sellInfo.sell_date = sellInfo.sell_date.substr(0, 10);
    sellInfo.price = helper.numberFormat(sellInfo.price, 2);
    sellInfo.cost = helper.numberFormat(sellInfo.cost, 2);
    sellInfo.main_price = helper.numberFormat(sellInfo.main_price, 2);
    sellInfo.down_payment = helper.numberFormat(sellInfo.down_payment, 2);
    sellInfo.install_cost = helper.numberFormat(sellInfo.install_cost, 2);
    sellInfo.remain_price = helper.numberFormat(sellInfo.remain_price, 2);

    this.state.fields.code.readonly = data.flagSell;

    this.setState({
      data:this.state.data,
      sellInfo:sellInfo,
      flagSell:data.flagSell,
      fields:this.state.fields,
      prefix_code:data.prefix_code
    }, function() {
      this.doGenPayment();
    }.bind(this));

      console.log(this.state.data);

  },

  onReadIDCardDoneAction: function(info) {
    this.state.data[this.currentCard] = info;
    var addr = '';
    if (this.currentCard=='cusIDCard') {
      addr = 'cardAddr';
      this.state.data.customer.nationid = info.nationid;
      this.state.data.customer.prename = info.prenameTH;
      this.state.data.customer.firstname = info.firstnameTH;
      this.state.data.customer.lastname = info.lastnameTH;
      this.state.data.customer.birth = info.birth;
      this.state.data.customer.gender = info.gender;
      this.state.data.customer.age = calcAge(info.birth);

    } else if (this.currentCard=='coIDCard') {
      addr = 'coCardAddr';
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
    //this.state.data.cusIDCard = this.state.data.coIDCard;
    var obj = {
      data: this.state.data,
    }
    obj[this.currentCard+'PhotoLoading'] = true;
    this.setState(obj);
    console.log('jack',this.state.data);
    systemActions.readIDCardPhoto();
  },

  onReadIDCardErrorAction: function(e) {
    toasterActions.pop({
      type:'warning',
      message:'result.idcard.error'
    });
  },

  onReadIDCardPhotoDoneAction: function(info) {
//    console.log('onReadIDCardPhotoDoneAction', info);
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
    this.context.router.goBack();
  },

  onSaveNewErrorAction: function(e) {
    toasterActions.pop({
      type:'warning',
      message:e
    });
  },

  doContractSave: function() {
    // check required
    console.log(this.state);
    var err = [];
    if (!this.state.data.code) {
      err.push('contract.error.code_required');
    }
    if (!this.state.data.sign_date) {
      err.push('contract.error.sign_date_required');
    }
    if (!this.state.data.customer) {
      err.push('contract.error.customer_required');
    } else {
      if (!this.state.data.customer.nationid || this.state.data.customer.nationid.length != 13) {
        err.push('contract.error.customer_nationid_invalid');
      }
      if (!this.state.data.customer.firstname) {
        err.push('contract.error.customer_firstname_required');
      }
      if (!this.state.data.customer.lastname) {
        err.push('contract.error.customer_lastname_required');
      }
    }
    if (!this.state.data.co) {
      err.push('contract.error.co_required');
    } else {
      if (!this.state.data.co.nationid || this.state.data.co.nationid.length != 13) {
        err.push('contract.error.co_nationid_invalid');
      }
      if (!this.state.data.co.firstname) {
        err.push('contract.error.co_firstname_required');
      }
      if (!this.state.data.co.lastname) {
        err.push('contract.error.co_lastname_required');
      }
    }
    console.log('data:',this.state.sellInfo);
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
        data: this.state.data,
        paymentData: this.state.paymentData,
        cusPhoto: this.customerPhotoData,
        coPhoto: this.coPhotoData,
        flagSell: this.state.flagSell,
        prefix_code: this.state.prefix_code,
        sellInfo:this.state.sellInfo,
        contractref:this.state.contractref,
        sellold:this.state.sellold
      };
      //console.log('datajack=',obj);
      actions.saveNew(obj);
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
    infoPanelActions.show('installment.contract.pending', (
      <a href="#">Expand</a>
    ));
    actions.getSellInfo(this.state.sellId);

  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  handleChange: function(id, value) {
    var tmp = id.split('.');
    if (tmp.length==2) {
      this.state.data[tmp[0]][tmp[1]] = value;
    } else {
      this.state.data[id] = value;
    }
    // calc age
    if (id==='customer.birth') {
      this.state.data.customer.age = calcAge(value);
    }

    var genPayment = false;
    if (id==='payment_month') {
      var month = parseInt(value);
      var price = parseFloat(this.state.data.payment_price);
      if (month > 0) {
        var per_month = Math.floor(price / month);
        this.state.data['payment_per_month'] = per_month;
      }
      this.state.data.fee = month <= 3 ? 100 : 200;
      genPayment = true;
    }
    if (id==='payment_per_month' || id==='payment_on_day' || id==='sign_date') {
      genPayment = true;
    }

    if (id==='homeAddrCopyFrom' && value=='fromCard') {
      this.state.data.customerAddr = helper.clone(this.state.data.cardAddr);
    } else if (id==='coHomeAddrCopyFrom') {
      if (value==='fromCard') {
        this.state.data.coAddr = helper.clone(this.state.data.coCardAddr);
      } else if (value==='fromCustomer') {
        this.state.data.coAddr = helper.clone(this.state.data.customerAddr);
      }
    } else if (id==='coWorkAddrCopyFrom') {
      if (value==='fromWork') {
        this.state.data.coWorkAddr = helper.clone(this.state.data.workAddr);
        this.state.data.co_work_company = this.state.data.work_company;
      }
    }
    this.setState({
      data: this.state.data
    }, function() {
      if (genPayment) {
        this.doGenPayment();
      }
    }.bind(this));

    if (this.state.flagEdit == true){

        if (id==='code') {
          var contract = value;

          console.log(contract);
          actions.getContractID(contract);
        }
    }

  },

  handleTabClick: function(id) {
    this.setState({
      currentTab:id
    });
  },

  handleIDCardChange: function(card, data) {
    console.log(data);
    if (data.photoData) {
//      console.log('photoData', data.photoData);
      if (card=='customer') {
        this.customerPhotoData = data.photoData;
      } else {
        this.coPhotoData = data.photoData;
      }
    }
  },

  doGenPayment: function() {
    var payment = [];
    var amount = Math.floor(this.state.data.payment_per_month);
    var total = 0;
    var month = parseInt(this.state.data.payment_month);
    var today = new Date(this.state.data.sign_date);
    var mm = today.getMonth();
    var day = parseInt(this.state.data.payment_on_day);

    //var main_price = this.state.sellInfo.main_price;
    var down_price = this.state.data.payment_down;
    var cost = this.state.data.cost;
    var install_cost = this.state.data.install_cost;
    var fee = this.state.data.fee;
    var cost_term = parseFloat(((cost + install_cost + fee ) - down_price) / month);

    for (var i = 0; i < month; i++) {
      if (i == month-1) {
        amount = parseFloat(this.state.data.payment_price) - total;
      }
      var date = new Date(today.getFullYear(), mm+i+1, day);
      if (date.getMonth() != (mm+i+1)%12) {
        date = new Date(today.getFullYear(), mm+i+2, 0);
      }

      payment.push({
        no: i+1,
        date: date.getFullYear()+'-'+('0'+(date.getMonth()+1)).substr(-2)+'-'+('0'+date.getDate()).substr(-2),
        amount: amount,
        cost_term:cost_term
      });
      total += amount;
    }
    this.setState({
      paymentData: payment
    });

    //console.log('paymentData=',this.state.paymentData);

  },

  readIDCard: function(card) {
   //console.log('read id card');
    this.currentCard = card;
    this.setState({
      currentTab: card=='cusIDCard' ? 'customer_status' : 'co_status'
    }, function() {
      systemActions.readIDCard();
    });

  },

  paymentTableChange: function(row_i, field_id, value) {
    console.log(row_id, field_id, value);
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

  copyAddress: function(id) {
    if (id==='homeAddrCopyFrom' && this.state.data.homeAddrCopyFrom=='fromCard') {
      this.state.data.customerAddr = helper.clone(this.state.data.cardAddr);
    } else if (id==='coHomeAddrCopyFrom') {
      if (this.state.data.coHomeAddrCopyFrom==='fromCard') {
        this.state.data.coAddr = helper.clone(this.state.data.coCardAddr);
      } else if (this.state.data.coHomeAddrCopyFrom==='fromCustomer') {
        this.state.data.coAddr = helper.clone(this.state.data.customerAddr);
      }
    } else if (id==='coWorkAddrCopyFrom') {
      if (this.state.data.coWorkAddrCopyFrom==='fromWork') {
        this.state.data.coWorkAddr = helper.clone(this.state.data.workAddr);
      }
    }
    this.setState({
      data: this.state.data
    });
  },

  onGetContractIDDoneAction: function(data){
    actions.getById(data.contract_id);
  },

  onGetByIdDoneAction: function(data){
    //data: this.state.data
    this.state.data.customer.nationid = data.contract.customer.nationid;
    this.state.data.customer.prename = data.contract.customer.prename;
    this.state.data.customer.firstname = data.contract.customer.firstname;
    this.state.data.customer.lastname = data.contract.customer.lastname;
    this.state.data.customer.birth = data.contract.customer.birth;
    this.state.data.customer.age = data.contract.customer.age;
    this.state.data.customer.gender = data.contract.customer.gender;
    this.state.data.customer.marital_status = data.contract.customer.marital_status;
    this.state.data.customer.mobile = data.contract.customer.mobile;
    this.state.data.customer.email = data.contract.customer.email;

    this.state.data.co.nationid = data.contract.co.nationid;
    this.state.data.co.prename = data.contract.co.prename;
    this.state.data.co.firstname = data.contract.co.firstname;
    this.state.data.co.lastname = data.contract.co.lastname;

    this.state.data.cus_addr_owner = data.contract.cus_addr_owner;
    this.state.data.cus_addr_with = data.contract.cus_addr_with;
    this.state.data.cus_addr_person = data.contract.cus_addr_person;
    this.state.data.work_company = data.contract.work_company;
    this.state.data.work_type = data.contract.work_type;
    this.state.data.work_type_other = data.contract.work_type_other;
    this.state.data.work_detail = data.contract.work_detail;
    this.state.data.work_department = data.contract.work_department;
    this.state.data.work_position = data.contract.work_position;
    this.state.data.work_time = data.contract.work_time;
    this.state.data.work_year = data.contract.work_year;
    this.state.data.work_salary = data.contract.work_salary;
    this.state.data.work_income = data.contract.work_income;
    this.state.data.work_income_source = data.contract.work_income_source;
    this.state.data.work_prev_company = data.contract.work_prev_company;
    this.state.data.work_prev_addr = data.contract.work_prev_addr;
    this.state.data.work_prev_department = data.contract.work_prev_department;
    this.state.data.work_prev_tel = data.contract.work_prev_tel;
    this.state.data.co_mobile = data.contract.co_mobile;
    this.state.data.co_email = data.contract.co_email;
    this.state.data.co_relation = data.contract.co_relation;
    this.state.data.co_work_company = data.contract.co_work_company;
    this.state.data.co_work_detail = data.contract.co_work_detail;
    this.state.data.co_work_department = data.contract.co_work_department;
    this.state.data.co_work_position = data.contract.co_work_position;
    this.state.data.co_work_time = data.contract.co_work_time;
    this.state.data.co_work_year = data.contract.co_work_year;
    this.state.data.co_work_salary = data.contract.co_work_salary;
    this.state.data.co_work_income = data.contract.co_work_income;
    this.state.data.co_work_income_source = data.contract.co_work_income_source;

    this.setState({
      data:this.state.data
    });
    console.log(data);

    console.log(this.state.data.customer.nationid)
  },

  onGetPersonCardDoneAction: function(data){
    var addr = '';
    addr = 'cardAddr';
    var newObj = JSON.parse(data.idcard_info);

    if (this.state.data.customer.firstname == newObj.firstnameTH && this.state.data.customer.lastname == newObj.lastnameTH){
      this.state.data.cusIDCard = newObj.idcard_info;
      this.state.data.customer.nationid = newObj.nationid;
      this.state.data.customer.prename = newObj.prenameTH;
      this.state.data.customer.firstname = newObj.firstnameTH;
      this.state.data.customer.lastname = newObj.lastnameTH;
      this.state.data.customer.birth = newObj.birth;
      this.state.data.customer.gender = newObj.gender;
      this.state.data.customer.age = calcAge(newObj.birth);
      //JSONObject jsonObj = new JSONObject(data.idcard_info);
      if (!this.state.data[addr].addr1) {
        var tmp = [];
        if (newObj.address.houseNo) {
          tmp.push(newObj.address.houseNo);
        }

        if (newObj.address.villageNo) {
          tmp.push(newObj.address.villageNo);
        }
        this.state.data[addr].addr1 = tmp.join(' ');

        tmp = [];
        if (newObj.address.lane) {
          tmp.push(newObj.address.lane);
        }
        if (newObj.address.road) {
          tmp.push(newObj.address.road);
        }
        if (newObj.address.unknown) {
          tmp.push(newObj.address.unknown);
        }
        this.state.data[addr].addr2 = tmp.join(' ');
        this.state.data[addr].tambon = newObj.address.tambon;

        this.state.data[addr].amphur = newObj.address.amphur;
        this.state.data[addr].province = newObj.address.province;
      }
      this.state.data.cusIDCard = newObj;

      var co_id = newObj.nationid, photoCoIDCard = '';
      var path = window.location.protocol + '//' + window.location.host + '/idcard/photo';
      if (!co_id || co_id.length != 13) {
        photoCoIDCard = path + '.png';
      } else {
        photoCoIDCard = path + '/' + co_id.substr(-1) + '/' + co_id.substr(-2,1) + '/' + co_id + '.jpg';
      }

      this.state.cusIDCardPhoto = photoCoIDCard

      this.setState({
        data:this.state.data,
        cusIDCardPhoto:this.state.cusIDCardPhoto
      });
    }else{

      if(this.state.data.customer.firstname != data.firstname && this.state.data.customer.lastname != data.lastname){
        toasterActions.pop({
          type:'warning',
          message:'ชื่อผู้เช่าไม่ถูกต้อง'
        });
        this.state.data.cusIDCard = '';
        this.setState({
          data:this.state.data
        });
      }
    }
    console.log(this.state.data);
  },

  onGetPersonCardErrorAction: function(e) {
    var a = this;
    dialogActions.show({
        title: 'ยืนยัน',
        content: 'ลูกค้าต้องผ่านการเช็คประวัติแล้วเท่านั้น',
        actions:[
          {id:'ok', icon:'check52', label:'action.confirm', default:true}
        ]
      }, function(isCancel, action_id) {

        a.context.router.transitionTo('installment.contract', {id:0});
      });
  },

  onGetPersonCardCoDoneAction: function(data){
    var addr = '';
    addr = 'coCardAddr';

    console.log('jack test = ',data)

    var newObj = JSON.parse(data.idcard_info);
      console.log('jack test2 = ',newObj)
    if (newObj.firstnameTH == undefined ||newObj.lastnameTH == undefined ){
      this.state.data.co.nationid = data.nationid;
      this.state.data.co.firstname = data.firstname;
      this.state.data.co.lastname = data.lastname;
    }else{
      this.state.data.co.nationid = newObj.nationid;
      this.state.data.co.firstname = newObj.firstnameTH;
      this.state.data.co.lastname = newObj.lastnameTH;
      this.state.data.co.prename = newObj.prenameTH;
    }

    if (!this.state.data[addr].addr1) {
      var tmp = [];
      if (newObj.address.houseNo) {
        tmp.push(newObj.address.houseNo);
      }

      if (newObj.address.villageNo) {
        tmp.push(newObj.address.villageNo);
      }
      this.state.data[addr].addr1 = tmp.join(' ');

      tmp = [];
      if (newObj.address.lane) {
        tmp.push(newObj.address.lane);
      }
      if (newObj.address.road) {
        tmp.push(newObj.address.road);
      }
      if (newObj.address.unknown) {
        tmp.push(newObj.address.unknown);
      }
      this.state.data[addr].addr2 = tmp.join(' ');
      this.state.data[addr].tambon = newObj.address.tambon;

      this.state.data[addr].amphur = newObj.address.amphur;
      this.state.data[addr].province = newObj.address.province;
    }

    this.setState({
      data:this.state.data
    });
  },

  onGetPersonCardCoErrorAction: function(e) {
    var a = this;
    dialogActions.show({
        title: 'ยืนยัน',
        content: 'ลูกค้าต้องผ่านการเช็คประวัติแล้วเท่านั้น',
        actions:[
          {id:'ok', icon:'check52', label:'action.confirm', default:true}
        ]
      }, function(isCancel, action_id) {

        a.context.router.transitionTo('installment.contract', {id:0});
      });
  },

  nationidEnter: function(id,value){
    console.log('Enter',id,' ',value);
    if(id=='co.nationid'){
      actions.getPersonCardCo(value);
    }else{
      actions.getPersonCard(value);
    }

    // actions.getPersonCard(value);
  },

  render: function() {
    var fields = this.state.fields;
    var contractLine = (
      <div className="boxf flex">
        <div className="panel4 flex no-shrink">
          <T content="contract.contract" className="no-shrink" style={{width:'80px'}}/>
          <div className="no-shrink" style={{width:'8px'}}></div>
          <FlexDropdown
            field={this.state.fields.code} data={this.state.data} onChange={this.handleChange}
            readonly={this.state.flagSell}
            />
        </div>
        <div className="panelf flex">
          <div className="box2 no-shrink">
            <FlexTextInput field={this.state.fields.sign_date} data={this.state.data} onChange={this.handleChange}/>
          </div>
          <div style={{width:'2px'}}></div>
          <div style={{width:'206px'}}>
            <FlexTextInput field={this.state.fields.shop_code} data={this.state.data}/>
          </div>
          <div style={{width:'2px'}}></div>
            <div style={{width:'206px'}}>
            <FlexTextInput field={this.state.fields.contract_ref} data={this.state.data}/>
            </div>
        </div>
      </div>
    )
    var customerLine = (
      <div className="boxf flex">
        <div className="panel4 flex no-shrink">
          <T content="contract.customer" className="no-shrink" style={{width:'80px'}}/>
          <div className="no-shrink" style={{width:'8px'}}></div>
          <FlexTextInput
              field={this.state.fields.customer.nationid}
              data={this.state.data}
              onChange={this.handleChange}
              onEnter={this.nationidEnter}
              />
        </div>
        <div className="panelf flex">
          <div className="box2 no-shrink">
            <FlexTextInput field={this.state.fields.customer.prename} data={this.state.data} onChange={this.handleChange}/>
          </div>
          <div style={{width:'4px'}}></div>
          <FlexTextInput field={this.state.fields.customer.firstname} data={this.state.data} onChange={this.handleChange}/>
          <div style={{width:'4px'}}></div>
          <FlexTextInput field={this.state.fields.customer.lastname} data={this.state.data} onChange={this.handleChange}/>
        </div>
      </div>
    );
    var customerCoLine = (
      <div className="boxf flex">
        <div className="panel4 flex no-shrink">
          <T content="contract.co" className="no-shrink" style={{width:'80px'}}/>
          <div className="no-shrink" style={{width:'8px'}}></div>
          <FlexTextInput field={fields.co.nationid}
              data={this.state.data}
              onChange={this.handleChange}
              onEnter={this.nationidEnter}
              />
        </div>
        <div className="panelf flex">
          <div className="box2 no-shrink"><FlexTextInput field={fields.co.prename} data={this.state.data} onChange={this.handleChange}/></div>
          <div style={{width:'4px'}}></div>
          <FlexTextInput field={fields.co.firstname} data={this.state.data} onChange={this.handleChange}/>
          <div style={{width:'4px'}}></div>
          <FlexTextInput field={fields.co.lastname} data={this.state.data} onChange={this.handleChange}/>
        </div>
      </div>
    );

    var productLine = (
      <div className="boxf flex">
        <div className="panel4 flex no-shrink">
          <T content="contract.product" className="no-shrink" style={{width:'80px'}}/>
          <div className="no-shrink" style={{width:'8px'}}></div>
          <FlexTextInput field={fields.product} data={this.state.data} onChange={this.handleChange}/>
        </div>
        <div className="panelf flex">
          <div className="box2 no-shrink">
            <FlexTextInput field={{id:'payment_month', type:'text', label:'contract.payment_month', readonly:true}} data={this.state.data} onChange={this.handleChange}/>
          </div>
          <div style={{width:'4px'}}></div>
          <FlexTextInput field={{id:'payment_price', type:'text', label:'contract.payment_price', readonly:true}} data={this.state.data} onChange={this.handleChange}/>
          <div style={{width:'4px'}}></div>
          <FlexTextInput field={{id:'payment_per_month', type:'text', label:'contract.payment_per_month', readonly:true}} data={this.state.data} onChange={this.handleChange}/>
        </div>
      </div>
    );

    var list = [
      {id:'customer_status', icon:'user157', text:'contract.customer'},
      {id:'address_status', icon:'shared1', text:'contract.address_status'},
      {id:'work_status', icon:'work3', text:'contract.work_status'},
      {id:'co_status', icon:'add184', text:'contract.co'},
      {id:'coaddress_status', icon:'shared1', text:'contract.coaddress_status'},
      {id:'cowork_status', icon:'work3', text:'contract.cowork_status'},
      {id:'product_status', icon:'download166', text:'contract.product_status'},
      {id:'payment_status', icon:'connection21', text:'contract.payment_status'},
    ];


    var obj = this.state.fields.customer;
    obj.addr_type = this.state.fields.addr_type;
    obj.addr_with = this.state.fields.addr_with;
    obj.addr_person = this.state.fields.addr_person;

    var customerInfo = component.customerInfo(
      this.state.fields.customer, this.state.data, {
        CARD: this.state.data.cardAddr.addr_text,
        HOME: this.state.data.customerAddr.addr_text,
        WORK: this.state.data.workAddr.addr_text,
        COCARD: this.state.data.coCardAddr.addr_text,
        COHOME: this.state.data.coAddr.addr_text,
        COWORK: this.state.data.coWorkAddr.addr_text
      }, this.handleChange
    );
    var customerAddressStatus = component.customerAddressStatus(
      this.state.fields, this.state.data, this.handleChange, null, this.copyAddress
    );

    var customerJobStatus = component.customerJobStatus(
      this.state.fields, this.state.data, this.handleChange
    );

    var customerCoInfo = component.customerCoInfo(
      this.state.fields, this.state.data, this.handleChange
    );

    var productView = (
      <div className="box8 flex">
        <div className="panel4">
          <FlexTextInput field={{id:'sell_date',type:'date',label:'sell.sell_date',readonly:true}} data={this.state.sellInfo}/>
          <FlexTextInput field={{id:'receipt_no',type:'text',label:'sell.receipt_no',readonly:true}} data={this.state.sellInfo}/>
          <FlexTextInput field={{id:'product_description',type:'text',label:'sell.description',readonly:true}} data={this.state.sellInfo}/>
          <FlexTextInput field={{id:'product_serial',type:'text',label:'sell.serial',readonly:true}} data={this.state.sellInfo}/>
          <FlexTextInput field={{id:'sell_staff',type:'text',label:'sell.sell_staff',readonly:true}} data={this.state.sellInfo}/>
          <FlexTextInput field={{id:'finance_staff',type:'text',label:'sell.finance_staff',readonly:true}} data={this.state.sellInfo}/>
        </div>
        <div className="panel4">
          <FlexTextInput field={{id:'price',type:'number',label:'sell.price',readonly:true}} data={this.state.sellInfo}/>
          <FlexTextInput field={{id:'cost',type:'number',label:'sell.cost',readonly:true}} data={this.state.sellInfo}/>
          <FlexTextInput field={{id:'main_price',type:'number',label:'sell.main_price',readonly:true}} data={this.state.sellInfo}/>
          <FlexTextInput field={{id:'down_payment',type:'number',label:'sell.down_payment',readonly:true}} data={this.state.sellInfo}/>
          <FlexTextInput field={{id:'install_cost',type:'number',label:'sell.install_cost',readonly:true}} data={this.state.sellInfo}/>
          <FlexTextInput field={{id:'remain_price',type:'number',label:'sell.remain_price',readonly:true}} data={this.state.sellInfo}/>
        </div>
      </div>
    );

    var paymentForm = (
      <div className="box2">
        <div className="panel2">
          <FlexTextInput field={this.state.fields.payment_month} data={this.state.data} onChange={this.handleChange}/>
        </div>
        <div className="panel2">
          <FlexTextInput field={this.state.fields.payment_price} data={this.state.data} onChange={this.handleChange}/>
        </div>
        <div className="panel2">
          <FlexTextInput field={this.state.fields.fee} data={this.state.data} onChange={this.handleChange}/>
        </div>
        <div className="panel2">
          <FlexTextInput field={this.state.fields.payment_per_month} data={this.state.data} onChange={this.handleChange}/>
        </div>
        <div className="panel2">
          <FlexTextInput field={this.state.fields.payment_on_day} data={this.state.data} onChange={this.handleChange}/>
        </div>
      </div>
    );
    // <div className="panel2">
    //   <FlexButton label="contract.gen_payment" onClick={this.doGenPayment} icon="list89"/>
    // </div>

    var paymentTable = (
      <div className="panel6">
        <FlexDataTable
          fields={this.state.paymentFields}
          data={this.state.paymentData}
          displayRows={6}
          onChange={this.paymentTableChange}
          />
      </div>
    );

    return (
      <div className="content-page flex-form">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="contract.title.new" component="h2" />
          </div>
          <div className="panel2 no-shrink">
            <FlexButton icon="save20" label="action.save" default={true}
              onClick={this.doContractSave}/>
          </div>
        </div>
        <div className="content-body boxf">
          <form ref="frm">
            {contractLine}
            {customerLine}
            {customerCoLine}
            {productLine}
            <div className="panelf">
              <FlexTab list={list} selected={this.state.currentTab} onClick={this.handleTabClick}/>
            </div>
            <div style={{display:this.state.currentTab=='customer_status'?'block':'none'}}>
              <div className="flex">
                {customerInfo}
                <div className="panelf can-grow">
                  <NationIDCard
                    idcard={this.state.data.cusIDCard}
                    photoPath={this.state.cusIDCardPhoto}
                    photoLoading={this.state.cusIDCardPhotoLoading}
                    onChange={function(data) {this.handleIDCardChange('customer', data)}.bind(this)}
                  />
                </div>
              </div>
            </div>
            <div style={{display:this.state.currentTab=='address_status'?'block':'none'}}>
              {customerAddressStatus}
            </div>
            <div style={{display:this.state.currentTab=='work_status'?'block':'none'}}>
              <div className="flex">
                {customerJobStatus}
                <div className="box5">
                  <div className="panel5" style={{paddingBottom:'0'}}>
                    <FlexTextInput field={this.state.fields.work_company} data={this.state.data} onChange={this.handleChange}/>
                  </div>
                  <AddressInfo ref="workAddr" otherLabel="contract.address.fax" onChange={function(data) {
                      this.handleChange('workAddr', data);
                    }.bind(this)}
                    data={this.state.data.workAddr}
                    />
                </div>
              </div>
            </div>
            <div style={{display:this.state.currentTab=='co_status'?'block':'none'}}>
              <div className="flex">
                <div className="panel6 no-shrink">
                  <div className="flex" style={{paddingBottom:'4px'}}>
                    <FlexTextInput field={this.state.fields.co_mobile} data={this.state.data} onChange={this.handleChange}/>
                    <div style={{width:'4px'}}></div>
                    <FlexTextInput field={this.state.fields.co_email} data={this.state.data} onChange={this.handleChange}/>
                  </div>
                  <FlexTextInput field={this.state.fields.co_relation} data={this.state.data} onChange={this.handleChange}/>
                </div>
                <div className="panelf can-grow">
                  <NationIDCard
                    idcard={this.state.data.coIDCard}
                    photoPath={this.state.coIDCardPhoto}
                    photoLoading={this.state.coIDCardPhotoLoading}
                    onChange={function(data) {this.handleIDCardChange('co', data)}.bind(this)}
                  />
                </div>
              </div>
            </div>
            <div style={{display:this.state.currentTab=='coaddress_status'?'block':'none'}}>
              <div className="flex">
                <div className="box5">
                  <T content="contract.address.card_address" component="div" className="panelf section-header" style={{fontWeight:'bold'}}/>
                  <AddressInfo ref="coCardAddr"  otherLabel="contract.address.year"
                    onChange={function(data) {
                        this.handleChange('coCardAddr', data);
                      }.bind(this)
                    }
                    data={this.state.data.coCardAddr}
                    />
                </div>
                <div className="box5">
                  <div className="flex">
                    <T content="contract.address.home_address" component="div" className="panelf section-header can-grow" style={{fontWeight:'bold'}}/>
                    <div className="no-shrink panel3 flex">
                      <FlexDropdown
                        field={{
                          id:'coHomeAddrCopyFrom',
                          label:'contract.address.copy_from',
                          list:[
                            {value:'custom', text:'กำหนดเอง'},
                            {value:'fromCard',text:'ที่อยู่บัตรประชาชน'},
                            {value:'fromCustomer',text:'ที่อยู่ผู้เช่าซื้อ'}
                          ]
                        }}
                        data={this.state.data}
                        onChange={this.handleChange}
                        />
                      <FlexIcon
                        icon="copy31"
                        className="no-shrink"
                        title="contract.read_id"
                        onClick={function() {this.copyAddress('coHomeAddrCopyFrom')}.bind(this)}
                        style={{padding:'4px'}}
                        />
                    </div>
                  </div>

                  <AddressInfo ref="coAddr"  otherLabel="contract.address.year"
                    onChange={function(data) {
                        this.handleChange('coAddr', data);
                      }.bind(this)
                    }
                    data={this.state.data.coAddr}
                    />
                </div>
              </div>
            </div>
            <div style={{display:this.state.currentTab=='cowork_status'?'block':'none'}}>
              <div className="flex">
                <div className="box5">
                  <div className="flex">
                    <T content="contract.address.work_address" component="div" className="panelf section-header can-grow" style={{fontWeight:'bold'}}/>
                    <FlexIcon
                      icon="copy31"
                      className="no-shrink"
                      title="contract.read_id"
                      onClick={function() {this.copyWork('coWorkAddrCopyFrom')}.bind(this)}
                      style={{padding:'4px'}}
                      />
                  </div>
                  <div className="panel5">
                    <FlexTextInput field={this.state.fields.co_work_company} data={this.state.data} onChange={this.handleChange}/>
                  </div>
                  {customerCoInfo}
                </div>
                <div className="box5">
                  <div className="flex">
                    <T content="contract.address.work_address" component="div" className="panelf section-header can-grow" style={{fontWeight:'bold'}}/>
                    <div className="no-shrink panel3 flex">
                      <FlexDropdown
                        field={{
                          id:'coWorkAddrCopyFrom',
                          label:'contract.address.copy_from',
                          list:[
                            {value:'custom', text:'กำหนดเอง'},
                            {value:'fromWork',text:'ที่ทำงานผู้เช่าซื้อ'},
                          ]
                        }}
                        data={this.state.data}
                        onChange={this.handleChange}
                        />
                      <FlexIcon
                        icon="copy31"
                        className="no-shrink"
                        title="contract.read_id"
                        onClick={function() {this.copyAddress('coWorkAddrCopyFrom')}.bind(this)}
                        style={{padding:'4px'}}
                        />
                    </div>
                  </div>
                  <AddressInfo ref="coWorkAddr" otherLabel="contract.address.fax" onChange={function(data) {
                      this.handleChange('coWorkAddr', data);
                    }.bind(this)}
                    data={this.state.data.coWorkAddr}
                    />
                </div>
              </div>
            </div>
            <div style={{display:this.state.currentTab=='product_status'?'block':'none'}}>
              {productView}
            </div>
            <div style={{display:this.state.currentTab=='payment_status'?'block':'none'}}>
              <div className="flex">
                {paymentForm}
                {paymentTable}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = ContractNew;
