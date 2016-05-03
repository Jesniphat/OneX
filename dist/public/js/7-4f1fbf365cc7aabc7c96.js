webpackJsonp([7,135],{

/***/ 524:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'getMemberType': { children: ['done', 'error'] },
	  'getCustomerData': { children: ['done', 'error'] },
	  'getContactListData': { children: ['done', 'error'] },
	  'getBillingListData': { children: ['done', 'error'] },
	  'saveCustomers': { children: ['done', 'error'] },
	  'editCustomers': { children: ['done', 'error'] },
	  'deleteCustomers': { children: ['done', 'error'] },
	  'getCurrencyFromBase': { children: ['done', 'error'] }
	});

/***/ },

/***/ 528:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widgets = __webpack_require__(377);
	var toasterActions = system.toasterActions;
	var helper = system.helper; // require('../../../../../server/lib/Helper');
	var systemActions = system.systemActions; // require('../../system/actions');
	var infoPanelActions = system.infoPanelActions; // require('../../../actions/info-panel');
	var Router = __webpack_require__(160);
	var actions = __webpack_require__(524);

	var T = __webpack_require__(381);
	var dialogActions = system.dialogActions;
	var FlexTextInput = widgets.FlexTextInput; // require('../../../widgets/flex-text-input.jsx');
	var FlexButton = widgets.FlexButton; // require('../../../widgets/flex-button.jsx');
	var FlexDisplayTable = widgets.FlexDisplayTable; // require('../../../widgets/flex-display-table.jsx');
	var FlexDropdown = widgets.FlexDropdown; // require('../../../widgets/flex-dropdown.jsx');
	var FlexIcon = widgets.FlexIcon;
	var FlexTab = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');
	var FlexCheckbox = widgets.FlexCheckbox;
	var FlexRadioGroup = widgets.FlexRadioGroup;

	var ReFlux = __webpack_require__(335);
	var resetData = {
	  id: '',
	  customer_id: '',
	  code: 'XX0001',
	  date: new Date().toJSON().slice(0, 10),
	  remark: '',
	  product: '',
	  customer_code: '',
	  tax_num: '',
	  member_code: '',
	  names: '',
	  last_name: '',
	  password: '',
	  repassword: '',
	  e_mail: '',
	  note: '',
	  birthday: '',
	  credit_term: 1,
	  serviceChargeText: '',
	  serviceChargeAmount: 0,
	  discount: '0',
	  contactId: 0,
	  contactPersonId: 0,
	  defaultAddrNo: '',
	  defaultAddrSoi: '',
	  defaultAddrTambon: '',
	  defaultAddrAmphur: '',
	  defaultAddrProvince: '',
	  defaultAddrZipCode: '',
	  defaultAddrPhone: '',
	  contactName: '',
	  contactPosition: '',
	  contactAddr1: '',
	  contactAddr2: '',
	  contactTambon: '',
	  contactAmphur: '',
	  contactProvince: '',
	  contactZipcode: '',
	  contactEmail: '',
	  contactPhoneNo: '',
	  contactLineId: '',
	  contactRemark: '',
	  billingPersonId: 0,
	  billingCode: '',
	  billingName: '',
	  billingAddr1: '',
	  billingAddr2: '',
	  billingTambon: '',
	  billingAmper: '',
	  billingProvince: '',
	  billingZipcode: '',
	  billingOtherNo: '',
	  billingLiveYear: '',
	  billingRemark: '',
	  billingSend: '',
	  billingNote: '',
	  billingPayment: '',
	  default_billing: 'N',
	  customerTypeFieldList: 'PERSON',
	  customerIdTypeList: 'nationid',
	  credit_term_status: 'APPROVE',
	  customerGenderList: 'N/A',
	  customerTitleList: 'N/A',
	  is_active_list: 'YES',
	  paymentTypeList: 'credit',
	  currencyList: '1'
	};
	var CustomerEdit = React.createClass({
	  displayName: 'CustomerEdit',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [
	  // ReFlux.listenTo(actions.getPaymentTerm.done,'onGetPaymentTermDoneAction'),
	  // ReFlux.listenTo(actions.getMemberType.done,'onGetMemberTypeDoneAction'),
	  ReFlux.listenTo(actions.getCustomerData.done, 'onGetCustomerDataDoneAction'), ReFlux.listenTo(actions.getContactListData.done, 'onGetContactListDataDoneAction'), ReFlux.listenTo(actions.getBillingListData.done, 'onGetBillingListDataDoneAction'), ReFlux.listenTo(actions.saveCustomers.done, 'onSaveCustomersDoneAction'), ReFlux.listenTo(actions.saveCustomers.error, 'onSaveCustomersErrorAction'), ReFlux.listenTo(actions.editCustomers.done, 'onEditCustomersDoneAction'), ReFlux.listenTo(actions.editCustomers.error, 'onEditCustomersErrorAction'), ReFlux.listenTo(actions.getCurrencyFromBase.done, 'onGetCurrencyFromBaseDoneAction')],
	  getInitialState: function getInitialState() {
	    console.log("system = ", system);
	    //console.log(this.context.router.getCurrentParams().id);
	    console.log(system.sessionStore.getSession().staff.id);
	    if (system.sessionStore.getSession().staff.id == 'unidentified' || system.sessionStore.getSession().staff.id == null || system.sessionStore.getSession().staff.id == 0 || system.sessionStore.getSession().staff.id == '0') {
	      var person_id = '0';
	      var cTab = 'tab1';
	    } else {
	      var person_id = system.sessionStore.getSession().staff.id;
	      var cTab = 'tab3';
	    }
	    //console.log(person_id);
	    return {
	      data: helper.clone(resetData),
	      edit_data: {
	        person_id: person_id
	      },
	      is_active: {
	        id: 'is_active_list',
	        label: 'newcustomer.add_new_customer.is_active',
	        list: [{ value: 'YES', text: 'YES' }, { value: 'NO', text: 'NO' }]
	      },
	      credit_term_status: {
	        id: 'credit_term_status',
	        label: 'newcustomer.add_new_customer.credit_term_status',
	        list: [{ value: 'APPROVE', text: tr.translate('newcustomer.newsList.AP') }, { value: 'WAITAPPROVE', text: tr.translate('newcustomer.newsList.NAP') }]
	      },
	      customerTypeField: {
	        id: 'customerTypeFieldList',
	        label: 'newcustomer.add_new_customer.customer_type',
	        list: [{ value: 'PERSON', text: tr.translate('newcustomer.customer_type_list.type_person') }, { value: 'COMPANY', text: tr.translate('newcustomer.customer_type_list.type_company') }]
	      },
	      customerTitle: {
	        id: 'customerTitleList',
	        label: 'newcustomer.add_new_customer.titel',
	        list: [{ value: 'N/A', text: 'N/A' }, { value: 'Mr.', text: 'Mr.' }, { value: 'Miss', text: 'Miss' }, { value: 'Mrs.', text: 'Mrs.' }]
	      },
	      customerIdType: {
	        id: 'customerIdTypeList',
	        label: 'newcustomer.add_new_customer.type_id',
	        list: [{ value: 'nationid', text: 'Card ID' }, { value: 'passport', text: 'Passport' }, { value: 'tax_id', text: 'TAX ID' }]
	      },
	      customerGender: {
	        id: 'customerGenderList',
	        label: 'newcustomer.add_new_customer.gender',
	        list: [{ value: 'N/A', text: 'N/A' }, { value: 'M', text: 'male' }, { value: 'F', text: 'female' }]
	      },
	      paymentType: {
	        id: 'paymentTypeList',
	        label: 'newcustomer.add_new_customer.paymentTeprList',
	        list: [{ value: 'credit', text: 'Credit' }, { value: 'billing', text: 'Billing' }]
	      },
	      currency: {
	        id: 'currencyList',
	        label: 'newcustomer.add_new_customer.currency',
	        list: []
	      },

	      contactListData: [],
	      billingListData: [],
	      curTab: cTab,
	      flagSave: false,
	      flagBillingList: 'N',
	      flagBillingListId: '',
	      flagContactList: 'N',
	      flagContactListId: ''
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    actions.getCurrencyFromBase();
	    //systemActions.setPageHeader(tr.translate('others.title.index'));
	    //actions.getMemberType();
	    if (this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0') {
	      console.log("Get Data");
	      actions.getCustomerData(this.state.edit_data);
	      actions.getContactListData(this.state.edit_data);
	      actions.getBillingListData(this.state.edit_data);
	    }
	  },

	  // onGetMemberTypeDoneAction: function(data){
	  //   //console.log(data);
	  //   var list = data.memberType.map(function(row) {
	  //     return {
	  //         value: row.value,
	  //         text: row.text
	  //     }
	  //   });
	  //   console.log(list);
	  //   this.state.customerIdType.list = list;
	  //   console.log(this.state.customerIdType);
	  //   this.setState({
	  //     customerIdType: this.state.customerIdType
	  //   });
	  //   //console.log(this.state.memberTypeField);
	  // },

	  onGetCurrencyFromBaseDoneAction: function onGetCurrencyFromBaseDoneAction(data) {
	    console.log('ddttaa');
	    var list = data.currencyListFromBase.map(function (row) {
	      return {
	        value: row.value,
	        text: row.text
	      };
	    });
	    console.log(list);
	    this.state.currency.list = list;
	    console.log(this.state.currency);
	    this.setState({
	      currency: this.state.currency
	    });
	    console.log(this.state.currency);
	  },

	  onGetCustomerDataDoneAction: function onGetCustomerDataDoneAction(data) {
	    console.log("onGetCustomerDataDoneAction = ", data);
	    this.state.data.id = data.id;
	    this.state.data.customer_id = data.customer_id;
	    this.state.data.customer_code = data.code;
	    this.state.data.customerTypeFieldList = data.type;
	    this.state.data.customerGenderList = data.gender;
	    this.state.data.customerTitleList = data.prename;
	    this.state.data.names = data.firstname;
	    this.state.data.last_name = data.lastname;
	    this.state.data.password = data.password;
	    this.state.data.repassword = data.password;
	    this.state.data.e_mail = data.email;
	    this.state.data.birthday = data.birth;
	    this.state.data.credit_term = data.credit_term;
	    this.state.data.credit_term_status = data.approve_status;
	    this.state.data.is_active_list = data.get_news;
	    this.state.data.customerIdTypeList = data.costomer_type_id;
	    this.state.data.tax_num = data.id_number;
	    this.state.data.paymentTypeList = data.payment_type;
	    this.state.data.serviceChargeText = data.charge_text;
	    this.state.data.discount = data.discount;
	    this.state.data.serviceChargeAmount = data.charge;
	    this.state.data.defaultAddrNo = data.addr1;
	    this.state.data.defaultAddrSoi = data.addr2;
	    this.state.data.defaultAddrTambon = data.tambon;
	    this.state.data.defaultAddrAmphur = data.amphur;
	    this.state.data.defaultAddrProvince = data.province;
	    this.state.data.defaultAddrZipCode = data.zipcode;
	    this.state.data.defaultAddrPhone = data.tel;
	    this.state.data.currencyList = data.currency_id;
	    this.state.data.memberTypeFieldList = data.memberTypeFieldList;

	    this.setState({
	      data: this.state.data
	    });
	  },

	  onGetContactListDataDoneAction: function onGetContactListDataDoneAction(data) {
	    //console.log(data);
	    this.state.contactListData = data;
	    this.setState({
	      contactListData: this.state.contactListData
	    });
	    console.log(this.state.contactListData);
	  },

	  onGetBillingListDataDoneAction: function onGetBillingListDataDoneAction(data) {
	    this.state.billingListData = data;
	    this.setState({
	      billingListData: this.state.billingListData
	    });
	    console.log(this.state.billingListData);
	  },

	  onSaveCustomersDoneAction: function onSaveCustomersDoneAction(data) {
	    this.setState({
	      data: helper.clone(resetData),
	      contactListData: [],
	      billingListData: []
	    });
	    toasterActions.pop({
	      type: 'success',
	      message: data.done
	    });
	  },
	  onSaveCustomersErrorAction: function onSaveCustomersErrorAction(data) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'เพิ่มข้อมูลไม่สำเร็จ'
	    });
	  },

	  handleChange: function handleChange(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	    //console.log(this.state.data.customerTypeFieldList);
	  },

	  onCodeEnter: function onCodeEnter(id, value) {
	    //console.log(value);
	    //console.log(this.state.data.code);
	    actions.getPaymentTerm(value);
	  },

	  handleListChange: function handleListChange(id, value) {

	    var payment_option = this.state.fieldPaymentOption.list.filter(function (payment) {
	      return payment.value == value;
	    });
	    //console.log(payment_option);
	    // this.state.selectedItemText = payment_option;
	    this.setState({
	      selectedItem: value,
	      selectedItemText: payment_option[0].text
	    });
	  },

	  onKeyUp: function onKeyUp(id, value) {
	    var _chk = 'N';
	    if (id == 'card_id') {
	      //console.log(value);
	      //if(value != ''){
	      this.state.textdata.nationid = value;
	      //}
	    }
	    if (id == 'code') {
	      //if(value != ''){
	      this.state.textdata.contractid = value;
	      //  }
	    }
	    if (id == 'other') {
	      //if(value != ''){
	      this.state.textdata.other = value;
	      //}
	    }
	  },

	  onPrintReceiptDoneAction: function onPrintReceiptDoneAction(data) {
	    window.open(data.pdfFile);
	  },

	  doAddBillingLists: function doAddBillingLists() {
	    if (this.state.flagBillingList == 'N') {
	      var row = {
	        billingCode: this.state.data.billingCode,
	        billingName: this.state.data.billingName,
	        billingAddr1: this.state.data.billingAddr1,
	        billingAddr2: this.state.data.billingAddr2,
	        billingTambon: this.state.data.billingTambon,
	        billingAmper: this.state.data.billingAmper,
	        billingProvince: this.state.data.billingProvince,
	        billingZipcode: this.state.data.billingZipcode,
	        billingOtherNo: this.state.data.billingOtherNo,
	        billingLiveYear: this.state.data.billingLiveYear,
	        billingRemark: this.state.data.billingRemark,
	        billingSend: this.state.data.billingSend,
	        billingNote: this.state.data.billingNote,
	        billingPayment: this.state.data.billingPayment,
	        default_billing: this.state.data.default_billing
	      };
	      //console.log(row);
	      this.state.billingListData.push(row);

	      this.setState({
	        billingListData: this.state.billingListData
	      });
	      console.log(this.state.billingListData);
	    } else {
	      console.log('Not thing');
	      var index = this.state.flagBillingListId;
	      this.state.billingListData = this.state.billingListData;
	      console.log(this.state.billingListData[index]);
	      var row = {
	        billingCode: this.state.data.billingCode,
	        billingName: this.state.data.billingName,
	        billingAddr1: this.state.data.billingAddr1,
	        billingAddr2: this.state.data.billingAddr2,
	        billingTambon: this.state.data.billingTambon,
	        billingAmper: this.state.data.billingAmper,
	        billingProvince: this.state.data.billingProvince,
	        billingZipcode: this.state.data.billingZipcode,
	        billingOtherNo: this.state.data.billingOtherNo,
	        billingLiveYear: this.state.data.billingLiveYear,
	        billingRemark: this.state.data.billingRemark,
	        billingSend: this.state.data.billingSend,
	        billingNote: this.state.data.billingNote,
	        billingPayment: this.state.data.billingPayment,
	        default_billing: this.state.data.default_billing
	      };
	      this.state.billingListData[index] = row;

	      this.setState({
	        billingListData: this.state.billingListData
	      });
	      console.log(this.state.billingListData);
	    }
	    this.state.data.billingCode = '';
	    this.state.data.billingName = '';
	    this.state.data.billingAddr1 = '';
	    this.state.data.billingAddr2 = '';
	    this.state.data.billingTambon = '';
	    this.state.data.billingAmper = '';
	    this.state.data.billingProvince = '';
	    this.state.data.billingZipcode = '';
	    this.state.data.billingOtherNo = '';
	    this.state.data.billingLiveYear = '';
	    this.state.data.billingRemark = '';
	    this.state.data.billingSend = '';
	    this.state.data.billingNote = '';
	    this.state.data.billingPayment = '';
	    this.state.data.default_billing = 'N';
	    this.state.flagBillingList = 'N';
	  },

	  onSetDefaultBill: function onSetDefaultBill(i, row) {
	    var x = this.state.billingListData.length;
	    for (var j = 0; j < x; j++) {
	      if (j == i) {
	        if (this.state.billingListData[j].default_billing == 'Y') {
	          var s = 'N';
	        } else if (this.state.billingListData[j].default_billing == 'N') {
	          var s = 'Y';
	        }
	        this.state.billingListData[j].default_billing = s;
	      } else {
	        this.state.billingListData[j].default_billing = 'N';
	      }
	    }
	    this.setState({
	      billingListData: this.state.billingListData
	    });
	    console.log(this.state.billingListData);
	  },

	  onBillingListDelete: function onBillingListDelete(i) {
	    this.state.billingListData.splice(i, 1);
	    this.setState({
	      billingListData: this.state.billingListData
	    });
	  },

	  onBillingListEdit: function onBillingListEdit(i, row) {
	    this.state.flagBillingListId = i;
	    this.state.flagBillingList = 'Y';

	    this.state.data = this.state.data;

	    this.state.data.billingCode = row.billingCode;
	    this.state.data.billingName = row.billingName;
	    this.state.data.billingAddr1 = row.billingAddr1;
	    this.state.data.billingAddr2 = row.billingAddr2;
	    this.state.data.billingTambon = row.billingTambon;
	    this.state.data.billingAmper = row.billingAmper;
	    this.state.data.billingProvince = row.billingProvince;
	    this.state.data.billingZipcode = row.billingZipcode;
	    this.state.data.billingOtherNo = row.billingOtherNo;
	    this.state.data.billingLiveYear = row.billingLiveYear;
	    this.state.data.billingRemark = row.billingRemark;
	    this.state.data.billingSend = row.billingSend;
	    this.state.data.billingNote = row.billingNote;
	    this.state.data.billingPayment = row.billingPayment;
	    this.state.data.default_billing = row.default_billing;

	    this.setState({
	      data: this.state.data
	    });
	  },

	  doAddContactLists: function doAddContactLists() {
	    if (this.state.flagContactList == 'N') {
	      var row = {
	        contactName: this.state.data.contactName,
	        contactPosition: this.state.data.contactPosition,
	        contactAddr1: this.state.data.contactAddr1,
	        contactAddr2: this.state.data.contactAddr2,
	        contactTambon: this.state.data.contactTambon,
	        contactAmphur: this.state.data.contactAmphur,
	        contactProvince: this.state.data.contactProvince,
	        contactZipcode: this.state.data.contactZipcode,
	        contactEmail: this.state.data.contactEmail,
	        contactPhoneNo: this.state.data.contactPhoneNo,
	        contactLineId: this.state.data.contactLineId,
	        contactRemark: this.state.data.contactRemark
	      };
	      //console.log(row);
	      this.state.contactListData.push(row);

	      this.setState({
	        contactListData: this.state.contactListData
	      });
	      console.log(this.state.contactListData);
	    } else {
	      console.log('Not thing');
	      var index = this.state.flagContactListId;
	      this.state.contactListData = this.state.contactListData;
	      console.log(this.state.contactListData[index]);
	      var row = {
	        contactName: this.state.data.contactName,
	        contactPosition: this.state.data.contactPosition,
	        contactAddr1: this.state.data.contactAddr1,
	        contactAddr2: this.state.data.contactAddr2,
	        contactTambon: this.state.data.contactTambon,
	        contactAmphur: this.state.data.contactAmphur,
	        contactProvince: this.state.data.contactProvince,
	        contactZipcode: this.state.data.contactZipcode,
	        contactEmail: this.state.data.contactEmail,
	        contactPhoneNo: this.state.data.contactPhoneNo,
	        contactLineId: this.state.data.contactLineId,
	        contactRemark: this.state.data.contactRemark
	      };
	      this.state.contactListData[index] = row;

	      this.setState({
	        contactListData: this.state.contactListData
	      });
	      console.log(this.state.contactListData);
	    }
	    this.state.data.contactName = '';
	    this.state.data.contactPosition = '';
	    this.state.data.contactAddr1 = '';
	    this.state.data.contactAddr2 = '';
	    this.state.data.contactTambon = '';
	    this.state.data.contactAmphur = '';
	    this.state.data.contactProvince = '';
	    this.state.data.contactZipcode = '';
	    this.state.data.contactEmail = '';
	    this.state.data.contactPhoneNo = '';
	    this.state.data.contactLineId = '';
	    this.state.data.contactRemark = '';

	    this.state.flagContactList = 'N';
	  },

	  onContactListDelete: function onContactListDelete(i) {
	    this.state.contactListData.splice(i, 1);
	    this.setState({
	      contactListData: this.state.contactListData
	    });
	  },

	  onContactListEdit: function onContactListEdit(i, row) {
	    this.state.flagContactListId = i;
	    this.state.flagContactList = 'Y';

	    this.state.data = this.state.data;

	    this.state.data.contactName = row.contactName;
	    this.state.data.contactPosition = row.contactPosition;
	    this.state.data.contactAddr1 = row.contactAddr1;
	    this.state.data.contactAddr2 = row.contactAddr2;
	    this.state.data.contactTambon = row.contactTambon;
	    this.state.data.contactAmphur = row.contactAmphur;
	    this.state.data.contactProvince = row.contactProvince;
	    this.state.data.contactZipcode = row.contactZipcode;
	    this.state.data.contactEmail = row.contactEmail;
	    this.state.data.contactPhoneNo = row.contactPhoneNo;
	    this.state.data.contactLineId = row.contactLineId;
	    this.state.data.contactRemark = row.contactRemark;

	    this.setState({
	      data: this.state.data
	    });
	  },

	  handleTabClick: function handleTabClick(id) {
	    this.setState({
	      curTab: id
	    });
	  },

	  onRePrint: function onRePrint(row) {
	    actions.printReceipt({ contract_id: row.contract_id, receipt_id: row.id });
	  },

	  handleChangeDialog: function handleChangeDialog(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	    dialogActions.update(this.createParameter());
	  },

	  saveCustomer: function saveCustomer() {
	    if (this.state.data.password != this.state.data.repassword) {
	      console.log("Password Not Match");
	      toasterActions.pop({
	        type: 'warning',
	        message: 'Password Not Match'
	      });
	      return;
	    }
	    var obj = {
	      id: this.state.data.id,
	      customer_id: this.state.data.customer_id,
	      customer_code: this.state.data.customer_code,
	      customerTypeFieldList: this.state.data.customerTypeFieldList,
	      customerGenderList: this.state.data.customerGenderList,
	      customerTitleList: this.state.data.customerTitleList,
	      customerIdTypeList: this.state.data.customerIdTypeList,
	      tax_num: this.state.data.tax_num,
	      member_code: this.state.data.member_code,
	      names: this.state.data.names,
	      last_name: this.state.data.last_name,
	      password: this.state.data.password,
	      repassword: this.state.data.repassword,
	      e_mail: this.state.data.e_mail,
	      note: this.state.data.note,
	      birthday: this.state.data.birthday,
	      remark: this.state.data.remark,
	      is_active_list: this.state.data.is_active_list,
	      credit_term: this.state.data.credit_term,
	      credit_term_status: this.state.data.credit_term_status,
	      paymentTypeList: this.state.data.paymentTypeList,
	      currencyList: this.state.data.currencyList,
	      serviceChargeText: this.state.data.serviceChargeText,
	      serviceChargeAmount: this.state.data.serviceChargeAmount,
	      discount: this.state.data.discount,
	      defaultAddrName: this.state.data.names + " " + this.state.data.last_name,
	      defaultAddrNo: this.state.data.defaultAddrNo,
	      defaultAddrSoi: this.state.data.defaultAddrSoi,
	      defaultAddrTambon: this.state.data.defaultAddrTambon,
	      defaultAddrAmphur: this.state.data.defaultAddrAmphur,
	      defaultAddrProvince: this.state.data.defaultAddrProvince,
	      defaultAddrZipCode: this.state.data.defaultAddrZipCode,
	      defaultAddrPhone: this.state.data.defaultAddrPhone,
	      //memberTypeFieldList:this.state.data.memberTypeFieldList,
	      billingListData: this.state.billingListData,
	      contactListData: this.state.contactListData
	    };
	    console.log(this.state.edit_data);
	    if (this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0') {
	      console.log('Edit', obj);
	      actions.editCustomers(obj);
	    } else {
	      console.log('Add', obj);
	      actions.saveCustomers(obj);
	    }
	  },

	  onEditCustomersDoneAction: function onEditCustomersDoneAction(data) {
	    this.setState({
	      data: helper.clone(resetData),
	      contactListData: [],
	      billingListData: []
	    });
	    toasterActions.pop({
	      type: 'success',
	      message: data.done
	    });
	  },
	  onEditCustomersErrorAction: function onEditCustomersErrorAction(errors) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'แก้ไขข้อมูลไม่สำเร็จ'
	    });
	  },

	  render: function render() {
	    var fields = {
	      customer_code: {
	        id: 'customer_code',
	        label: 'newcustomer.add_new_customer.customer_code',
	        readonly: true,
	        maxLength: 6
	      },
	      tax_num: {
	        id: 'tax_num',
	        label: 'newcustomer.add_new_customer.tax_num',
	        required: true,
	        maxLength: 13
	      },
	      member_code: {
	        id: 'member_code',
	        label: 'newcustomer.add_new_customer.member_code'
	      },
	      names: {
	        id: 'names',
	        label: 'newcustomer.add_new_customer.names',
	        required: true
	      },
	      last_name: {
	        id: 'last_name',
	        label: 'newcustomer.add_new_customer.last_name'

	      },
	      password: {
	        id: 'password',
	        type: 'password',
	        label: 'newcustomer.add_new_customer.password',
	        required: true
	      },
	      repassword: {
	        id: 'repassword',
	        type: 'password',
	        label: 'newcustomer.add_new_customer.repassword',
	        required: true
	      },
	      e_mail: {
	        id: 'e_mail',
	        label: 'newcustomer.add_new_customer.e_mail',
	        required: true
	      },
	      note: {
	        id: 'note',
	        label: 'newcustomer.add_new_customer.note'
	      },
	      birthday: {
	        id: 'birthday',
	        label: 'newcustomer.add_new_customer.birthday'
	      },
	      remark: {
	        id: 'remark',
	        label: 'newcustomer.add_new_customer.remark'
	      },
	      news: {
	        id: 'news',
	        label: 'newcustomer.add_new_customer.news'
	      },
	      discount: {
	        id: 'discount',
	        label: 'newcustomer.add_new_customer.discount'
	      },
	      credit_term: {
	        id: 'credit_term',
	        label: 'newcustomer.add_new_customer.credit_term'
	      },
	      defaultAddrNo: {
	        id: 'defaultAddrNo',
	        label: 'newcustomer.add_new_customer.defaultAddrNo'
	      },
	      defaultAddrSoi: {
	        id: 'defaultAddrSoi',
	        label: 'newcustomer.add_new_customer.defaultAddrSoi'
	      },
	      defaultAddrTambon: {
	        id: 'defaultAddrTambon',
	        label: 'newcustomer.add_new_customer.defaultAddrTambon'
	      },
	      defaultAddrAmphur: {
	        id: 'defaultAddrAmphur',
	        label: 'newcustomer.add_new_customer.defaultAddrAmphur'
	      },
	      defaultAddrProvince: {
	        id: 'defaultAddrProvince',
	        label: 'newcustomer.add_new_customer.defaultAddrProvince'
	      },
	      defaultAddrZipCode: {
	        id: 'defaultAddrZipCode',
	        label: 'newcustomer.add_new_customer.defaultAddrZipCode'
	      },
	      defaultAddrPhone: {
	        id: 'defaultAddrPhone',
	        label: 'newcustomer.add_new_customer.defaultAddrPhone'
	      },
	      contactName: {
	        id: 'contactName',
	        label: 'newcustomer.add_new_customer.contactName'
	      },
	      contactPosition: {
	        id: 'contactPosition',
	        label: 'newcustomer.add_new_customer.contactPosition'
	      },
	      contactAddr1: {
	        id: 'contactAddr1',
	        label: 'newcustomer.add_new_customer.contactAddr1'
	      },
	      contactAddr2: {
	        id: 'contactAddr2',
	        label: 'newcustomer.add_new_customer.contactAddr2'
	      },
	      contactTambon: {
	        id: 'contactTambon',
	        label: 'newcustomer.add_new_customer.contactTambon'
	      },
	      contactAmphur: {
	        id: 'contactAmphur',
	        label: 'newcustomer.add_new_customer.contactAmphur'
	      },
	      contactProvince: {
	        id: 'contactProvince',
	        label: 'newcustomer.add_new_customer.contactProvince'
	      },
	      contactZipcode: {
	        id: 'contactZipcode',
	        label: 'newcustomer.add_new_customer.contactZipcode'
	      },
	      contactEmail: {
	        id: 'contactEmail',
	        label: 'newcustomer.add_new_customer.contactEmail'
	      },
	      contactPhoneNo: {
	        id: 'contactPhoneNo',
	        label: 'newcustomer.add_new_customer.contactPhoneNo'
	      },
	      contactLineId: {
	        id: 'contactLineId',
	        label: 'newcustomer.add_new_customer.contactLineId'
	      },
	      contactRemark: {
	        id: 'contactRemark',
	        label: 'newcustomer.add_new_customer.contactRemark'
	      },
	      serviceChargeText: {
	        id: 'serviceChargeText',
	        label: 'newcustomer.add_new_customer.serviceChargeText'
	      },
	      serviceChargeAmount: {
	        id: 'serviceChargeAmount',
	        label: 'newcustomer.add_new_customer.serviceChargeAmount'
	      },
	      billingCode: {
	        id: 'billingCode',
	        label: 'newcustomer.add_new_customer.billingCode'
	      },
	      billingName: {
	        id: 'billingName',
	        label: 'newcustomer.add_new_customer.billingName'
	      },
	      billingAddr1: {
	        id: 'billingAddr1',
	        label: 'newcustomer.add_new_customer.billingAddr1'
	      },
	      billingAddr2: {
	        id: 'billingAddr2',
	        label: 'newcustomer.add_new_customer.billingAddr2'
	      },
	      billingTambon: {
	        id: 'billingTambon',
	        label: 'newcustomer.add_new_customer.billingTambon'
	      },
	      billingAmper: {
	        id: 'billingAmper',
	        label: 'newcustomer.add_new_customer.billingAmper'
	      },
	      billingProvince: {
	        id: 'billingProvince',
	        label: 'newcustomer.add_new_customer.billingProvince'
	      },
	      billingZipcode: {
	        id: 'billingZipcode',
	        label: 'newcustomer.add_new_customer.billingZipcode'
	      },
	      billingOtherNo: {
	        id: 'billingOtherNo',
	        label: 'newcustomer.add_new_customer.billingOtherNo'
	      },
	      billingLiveYear: {
	        id: 'billingLiveYear',
	        label: 'newcustomer.add_new_customer.billingLiveYear'
	      },
	      billingRemark: {
	        id: 'billingRemark',
	        label: 'newcustomer.add_new_customer.billingRemark'
	      },
	      billingSend: {
	        id: 'billingSend',
	        label: 'newcustomer.add_new_customer.billingSend'
	      },
	      billingNote: {
	        id: 'billingNote',
	        label: 'newcustomer.add_new_customer.billingNote'
	      },
	      billingPayment: {
	        id: 'billingPayment',
	        label: 'newcustomer.add_new_customer.billingPayment'
	      },
	      penalty: {
	        id: 'penalty',
	        label: 'pos.receipt.penalty'
	      },
	      other: {
	        id: 'other',
	        label: 'pos.receipt.other',
	        icon: 'smartphone20'
	      },
	      payment_type: {
	        id: 'payment_type',
	        type: 'dropdown',
	        label: 'pos.receipt.type',
	        icon: 'list88',
	        list: [{ value: 'เงินสด', text: 'เงินสด' }, { value: 'บัตรเครดิต', text: 'บัตรเครดิต' }]
	      }
	    };

	    var contactList = [{ name: 'num', label: 'newcustomer.inTable.no', width: 50, render: function render(row, i) {
	        return i + 1;
	      } }, { name: 'contactName', label: 'newcustomer.inTable.contactNameInTable', width: 100, render: function render(row) {
	        return row.contactName;
	      } }, { name: 'contactPhoneNo', label: 'newcustomer.inTable.contactPhoneNoInTable', width: 100, render: function render(row) {
	        return row.contactPhoneNo;
	      } }, { name: 'actions', type: 'actions', width: 2 * 15 + 'px', width: 100, render: function (row, i) {
	        var f = function () {
	          this.onContactListDelete(i);
	        }.bind(this);
	        var g = function () {
	          this.onContactListEdit(i, row);
	        }.bind(this);
	        return React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { onClick: g },
	            React.createElement(FlexIcon, { icon: 'create3', title: 'action.select' })
	          ),
	          React.createElement(
	            'div',
	            { onClick: f },
	            React.createElement(FlexIcon, { icon: 'clear5', title: 'action.select' })
	          )
	        );
	      }.bind(this) }];

	    // {name:'display_name',label:'pos.payment.staff',width:100, className:'right',render:function(row){
	    //   return row.display_name;
	    // }},
	    var billingList = [{ name: 'num', label: 'newcustomer.inTable.no', width: 50, render: function render(row, i) {
	        return i + 1;
	      } }, { name: 'billingCode', label: 'newcustomer.inTable.contactCodeInTableBill', width: 120, render: function render(row) {
	        return row.billingCode;
	      } }, { name: 'actions1', label: 'newcustomer.inTable.defaultBill', type: 'actions', width: 2 * 15 + 'px', width: 50, render: function (row, i) {
	        var h = function () {
	          this.onSetDefaultBill(i, row);
	        }.bind(this);
	        return row.default_billing == 'Y' ? React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { onClick: h },
	            React.createElement(FlexIcon, { icon: 'circle108', title: 'action.select' })
	          )
	        ) : React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { onClick: h },
	            React.createElement(FlexIcon, { icon: 'circle107', title: 'action.select' })
	          )
	        );
	      }.bind(this) }, { name: 'actions', type: 'actions', width: 2 * 15 + 'px', width: 50, render: function (row, i) {
	        var f = function () {
	          this.onBillingListDelete(i);
	        }.bind(this);
	        var g = function () {
	          this.onBillingListEdit(i, row);
	        }.bind(this);
	        return React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { onClick: g },
	            React.createElement(FlexIcon, { icon: 'create3', title: 'action.select' })
	          ),
	          React.createElement(
	            'div',
	            { onClick: f },
	            React.createElement(FlexIcon, { icon: 'clear5', title: 'action.select' })
	          )
	        );
	      }.bind(this) }];

	    if (this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0') {
	      var listTab = [
	      //{id:'tab1', icon:'google134', text:'newcustomer.tab.upload_doc'},
	      //{id:'tab2', icon:'account4', text:'newcustomer.tab.inital_tab'},
	      { id: 'tab3', icon: 'home149', text: 'newcustomer.tab.default_addr_tab' }, { id: 'tab4', icon: 'list89', text: 'newcustomer.tab.billing_data' }, { id: 'tab5', icon: 'user157', text: 'newcustomer.tab.contract_name' }];
	    } else {
	      var listTab = [{ id: 'tab1', icon: 'google134', text: 'newcustomer.tab.upload_doc' }
	      // {id:'tab2', icon:'account4', text:'newcustomer.tab.inital_tab'},
	      // {id:'tab3', icon:'home149', text:'newcustomer.tab.default_addr_tab'},
	      // {id:'tab4', icon:'list89', text:'newcustomer.tab.billing_data'}//,
	      // {id:'tab10', icon:'user157', text:'newcustomer.tab.contract_name'}
	      ];
	    }

	    return React.createElement(
	      'div',
	      { className: 'layout-panel content-page', style: { padding: "0px 35px" } },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement('div', { className: 'panelf can-grow' }),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink flex-form' },
	          React.createElement(FlexButton, {
	            label: 'newcustomer.title.saveCustomerBT',
	            icon: 'add184',
	            'default': true,
	            onClick: this.saveCustomer
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(
	          'div',
	          { className: 'box9 flex flex-form' },
	          React.createElement(
	            'div',
	            { className: 'panel2', style: { 'width': '163px' } },
	            React.createElement(FlexTextInput, {
	              field: fields.customer_code,
	              data: this.state.data,
	              onChange: this.handleChange,
	              onKeyUp: this.onKeyUp,
	              onKeyDown: this.onKeyDown,
	              live: true
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel4', style: { 'width': '348px' } },
	            React.createElement(FlexDropdown, {
	              field: this.state.customerIdType,
	              data: this.state.data,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel4', style: { 'width': '348px' } },
	            React.createElement(FlexTextInput, {
	              field: fields.tax_num,
	              data: this.state.data,
	              onChange: this.handleChange,
	              onKeyUp: this.onKeyUp,
	              onKeyDown: this.onKeyDown,
	              live: true
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel3', style: { display: 'none' } },
	            React.createElement(FlexDropdown, {
	              field: this.state.customerTypeField,
	              data: this.state.data,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel3', style: { display: 'none' } },
	            React.createElement(FlexDropdown, {
	              field: this.state.customerGender,
	              data: this.state.data,
	              onChange: this.handleChange
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box9 flex flex-form' },
	          React.createElement(
	            'div',
	            { className: 'panel2', style: { 'width': '163px' } },
	            React.createElement(FlexDropdown, {
	              style: { 'width': '151px' },
	              field: this.state.customerTitle,
	              data: this.state.data,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel4', style: { 'width': '348px' } },
	            React.createElement(FlexTextInput, {
	              field: fields.names,
	              data: this.state.data,
	              onChange: this.handleChange,
	              onEnter: this.onCodeEnter,
	              onKeyUp: this.onKeyUp
	            })
	          ),
	          React.createElement(
	            'div',
	            { style: this.state.data.customerTypeFieldList == 'PERSON' ? { display: 'block' } : { display: 'none' } },
	            React.createElement(
	              'div',
	              { className: 'panel4', style: { 'width': '348px' } },
	              React.createElement(FlexTextInput, {
	                field: fields.last_name,
	                data: this.state.data,
	                onChange: this.handleChange,
	                onKeyUp: this.onKeyUp
	              })
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box9 flex flex-form' },
	          React.createElement(
	            'div',
	            { className: 'panel3', style: { 'width': '348px' } },
	            React.createElement(FlexTextInput, {
	              field: fields.e_mail,
	              data: this.state.data,
	              onChange: this.handleChange,
	              onKeyUp: this.onKeyUp
	            })
	          ),
	          React.createElement(
	            'div',
	            { style: this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0' ? { display: 'none' } : { display: 'block' } },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, {
	                field: fields.password,
	                data: this.state.data,
	                onChange: this.handleChange,
	                onKeyUp: this.onKeyUp,
	                onKeyDown: this.onKeyDown,
	                live: true
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0' ? { display: 'none' } : { display: 'block' } },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, {
	                field: fields.repassword,
	                data: this.state.data,
	                onChange: this.handleChange,
	                onEnter: this.onCodeEnter,
	                onKeyUp: this.onKeyUp
	              })
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box9 flex flex-form' },
	          React.createElement(
	            'div',
	            { className: 'panel3', style: { display: 'none' } },
	            React.createElement(FlexTextInput, {
	              field: fields.birthday,
	              data: this.state.data,
	              onChange: this.handleChange,
	              onEnter: this.onCodeEnter,
	              onKeyUp: this.onKeyUp
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box9 flex flex-form', style: { display: 'none' } },
	          React.createElement(
	            'div',
	            { className: 'panel3' },
	            React.createElement(FlexDropdown, {
	              field: this.state.is_active,
	              data: this.state.data,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { style: this.state.data.customerTypeFieldList == 'COMPANY' ? { display: 'block' } : { display: 'none' } },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, {
	                field: fields.credit_term,
	                data: this.state.data,
	                onChange: this.handleChange,
	                onEnter: this.onCodeEnter,
	                onKeyUp: this.onKeyUp
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: this.state.data.customerTypeFieldList == 'COMPANY' ? { display: 'block' } : { display: 'none' } },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexDropdown, {
	                field: this.state.credit_term_status,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box9 flex flex-form', style: { display: 'none' } },
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(FlexTextInput, {
	              field: fields.note,
	              data: this.state.data,
	              onChange: this.handleChange,
	              onKeyUp: this.onKeyUp,
	              onKeyDown: this.onKeyDown,
	              live: true
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { style: this.state.data.customerTypeFieldList == 'COMPANY' ? { display: 'none' } : { display: 'none' } },
	          React.createElement(
	            'div',
	            { className: 'box9 flex flex-form' },
	            React.createElement(
	              'div',
	              { className: 'panel3', style: { display: 'none' } },
	              React.createElement(FlexTextInput, {
	                field: fields.member_code,
	                data: this.state.data,
	                onChange: this.handleChange,
	                onKeyUp: this.onKeyUp
	              })
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel9', style: { 'width': '865px' } },
	          React.createElement(FlexTab, { list: listTab, selected: this.state.curTab, onClick: this.handleTabClick })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel9', style: this.state.curTab == 'tab1' ? { display: 'block' } : { display: 'none' } },
	          React.createElement('div', { className: 'box6 flex flex-form' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel9', style: this.state.curTab == 'tab2' ? { display: 'block' } : { display: 'none' } },
	          React.createElement(
	            'div',
	            { className: 'box6 flex flex-form' },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexDropdown, {
	                field: this.state.paymentType,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexDropdown, {
	                field: this.state.currency,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box6 flex flex-form' },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, { field: fields.serviceChargeText,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, { field: fields.discount,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box6 flex flex-form' },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, { field: fields.serviceChargeAmount,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel9', style: this.state.curTab == 'tab3' ? { display: 'block' } : { display: 'none' } },
	          React.createElement(
	            'div',
	            { className: 'box6 flex flex-form' },
	            React.createElement(
	              'div',
	              { className: 'panel6', style: { 'width': '544px' } },
	              React.createElement(FlexTextInput, { field: fields.defaultAddrNo,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box6 flex flex-form', style: { 'width': '544px' } },
	            React.createElement(
	              'div',
	              { className: 'panel6' },
	              React.createElement(FlexTextInput, { field: fields.defaultAddrSoi,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box6 flex flex-form' },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, { field: fields.defaultAddrTambon,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, { field: fields.defaultAddrAmphur,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box6 flex flex-form' },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, { field: fields.defaultAddrProvince,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, { field: fields.defaultAddrZipCode,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box6 flex flex-form' },
	            React.createElement(
	              'div',
	              { className: 'panel3' },
	              React.createElement(FlexTextInput, { field: fields.defaultAddrPhone,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel9', style: this.state.curTab == 'tab4' ? { display: 'block' } : { display: 'none' } },
	          React.createElement(
	            'div',
	            { className: 'box9 flex flex-form' },
	            React.createElement(
	              'div',
	              { className: 'box4' },
	              React.createElement(FlexDisplayTable, {
	                fields: billingList,
	                data: this.state.billingListData,
	                displayRows: 6
	              })
	            ),
	            React.createElement(
	              'div',
	              null,
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel2' },
	                  React.createElement(FlexTextInput, { field: fields.billingCode,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '298px' } },
	                  React.createElement(FlexTextInput, { field: fields.billingName,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5' },
	                React.createElement(
	                  'div',
	                  { className: 'panel5', style: { 'width': '474px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingAddr1,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel5', style: { 'width': '474px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingAddr2,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '237px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingTambon,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '237px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingAmper,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '237px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingProvince,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '237px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingZipcode,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '237px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingOtherNo,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '237px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingLiveYear,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '237px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingRemark,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '237px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingSend,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '237px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingNote,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '237px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.billingPayment,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5' },
	                React.createElement('div', { style: { height: '5px' } }),
	                React.createElement(
	                  'div',
	                  { className: 'box4 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel2', 'no-shrink': true, 'flex-form': true },
	                    React.createElement(FlexButton, {
	                      label: 'newcustomer.button.addContact',
	                      icon: 'add186',
	                      'default': true,
	                      onClick: this.doAddBillingLists
	                    })
	                  )
	                )
	              )
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel9', style: this.state.curTab == 'tab5' ? { display: 'block' } : { display: 'none' } },
	          React.createElement(
	            'div',
	            { className: 'box9 flex flex-form' },
	            React.createElement(
	              'div',
	              { className: 'panel6' },
	              React.createElement(
	                'div',
	                { className: 'box4' },
	                React.createElement(FlexDisplayTable, {
	                  fields: contactList,
	                  data: this.state.contactListData,
	                  displayRows: 6
	                })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel6' },
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '224px' } },
	                  React.createElement(FlexTextInput, { field: fields.contactName,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '224px' } },
	                  React.createElement(FlexTextInput, { field: fields.contactPosition,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel5', style: { 'width': '448px' } },
	                  React.createElement(FlexTextInput, { field: fields.contactAddr1,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel5', style: { 'width': '448px' } },
	                  React.createElement(FlexTextInput, { field: fields.contactAddr2,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '224px' } },
	                  React.createElement(FlexTextInput, { field: fields.contactTambon,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '224px' } },
	                  React.createElement(FlexTextInput, { field: fields.contactAmphur,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '224px' } },
	                  React.createElement(FlexTextInput, { field: fields.contactProvince,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '224px' } },
	                  React.createElement(FlexTextInput, { field: fields.contactZipcode,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '224px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.contactEmail,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '224px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.contactPhoneNo,
	                    data: this.state.data,
	                    onChange: this.handleChange,
	                    autoSelect: true
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box5 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '224px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.contactLineId,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { 'width': '224px' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.contactRemark,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement('div', { style: { height: '5px' } }),
	              React.createElement(
	                'div',
	                { className: 'box4 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel2', 'no-shrink': true, 'flex-form': true },
	                  React.createElement(FlexButton, {
	                    label: 'newcustomer.button.addContact',
	                    icon: 'add186',
	                    'default': true,
	                    onClick: this.doAddContactLists
	                  })
	                )
	              )
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = CustomerEdit;

/***/ }

});