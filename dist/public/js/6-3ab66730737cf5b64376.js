webpackJsonp([6,135],{

/***/ 523:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions; //require('../../system/actions');

	var customerActions = __webpack_require__(524);
	var customerStore = __webpack_require__(525);

	var NewCustomer = {};

	tr.registerTranslations('en', __webpack_require__(526));
	tr.registerTranslations('th', __webpack_require__(527));

	NewCustomer.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    //systemActions.setPageHeader('');
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	// NewCustomer.New = require('./customer-new.jsx');

	// NewCustomer.Routes = (
	//   <Route name="newcustomer.customer" path="add_customer/edit/:id?" handler={NewCustomer.Index}>
	//     <Router.DefaultRoute name="newcustomer.customer.new" handler={NewCustomer.New}/>
	//   </Route>
	// );

	module.exports = NewCustomer;

/***/ },

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

/***/ 525:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);
	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var sellActions = system.sellActions; //require('./actions');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var customersActions = __webpack_require__(524);

	var customer = Reflux.createStore({
	  listenables: [customersActions],

	  onGetMemberType: function onGetMemberType() {
	    //console.log('XXX');
	    ajaxActions.request('/api/newcustomer/getMemberType', {}, this.doneGetMemberType);
	  },
	  doneGetMemberType: function doneGetMemberType(res) {
	    if (res.status === true) {
	      //console.log('doneGetMemberType');
	      customersActions.getMemberType.done(res.data);
	    } else {
	      customersActions.getMemberType.error(res.msg);
	    }
	  },

	  onGetCurrencyFromBase: function onGetCurrencyFromBase() {
	    console.log('ddttaa');
	    ajaxActions.request('/api/newcustomer/getCurrencyFromBase', {}, this.doneGetCurrencyFromBase);
	  },
	  doneGetCurrencyFromBase: function doneGetCurrencyFromBase(res) {
	    console.log('currency done');
	    console.log(res);
	    if (res.status === true) {
	      customersActions.getCurrencyFromBase.done(res.data);
	    } else {
	      console.log("can't get Currency data.", res.msg);
	    }
	  },

	  onGetCustomerData: function onGetCustomerData(res) {
	    ajaxActions.request('/api/newcustomer/getCustomerData', res, this.doneGetCustomerData);
	  },
	  doneGetCustomerData: function doneGetCustomerData(res) {
	    //console.log(res.data.customerData[0]);
	    if (res.status === true) {
	      console.log(res.data.customerData[0], 'check_jes');
	      customersActions.getCustomerData.done(res.data.customerData[0]);
	    } else {
	      customersActions.getCustomerData.error(res.msg);
	    }
	  },

	  onGetContactListData: function onGetContactListData(res) {
	    ajaxActions.request('/api/newcustomer/getContactListData', res, this.doneGetContactListData);
	  },
	  doneGetContactListData: function doneGetContactListData(res) {
	    //console.log(res.data.contactListData,'jesCheck');
	    if (res.status === true) {
	      //console.log('doneGetMemberType');
	      customersActions.getContactListData.done(res.data.contactListData);
	    } else {
	      customersActions.getContactListData.error(res.msg);
	    }
	  },

	  onGetBillingListData: function onGetBillingListData(res) {
	    ajaxActions.request('/api/newcustomer/getBillingListData', res, this.doneGetBillingListData);
	  },
	  doneGetBillingListData: function doneGetBillingListData(res) {
	    //console.log("Billing = ",res.data.billingListDatas);
	    if (res.status === true) {
	      //console.log('doneGetMemberType');
	      customersActions.getBillingListData.done(res.data.billingListDatas);
	    } else {
	      customersActions.getBillingListData.error(res.msg);
	    }
	  },

	  onSaveCustomers: function onSaveCustomers(res) {
	    console.log(res, 'Jes Test');
	    ajaxActions.request('/api/newcustomer/saveCustomers', res, this.doneSaveCustomers);
	  },
	  doneSaveCustomers: function doneSaveCustomers(res) {
	    if (res.status === true) {
	      console.log('POUYT');
	      customersActions.saveCustomers.done(res.data);
	    } else {
	      customersActions.saveCustomers.error(res.error);
	    }
	  },

	  onEditCustomers: function onEditCustomers(res) {
	    console.log('Jes Edit', res);
	    ajaxActions.request('/api/newcustomer/editCustomers', res, this.doneEditCustomers);
	  },
	  doneEditCustomers: function doneEditCustomers(res) {
	    if (res.status === true) {
	      customersActions.editCustomers.done(res.data);
	    } else {
	      console.log(res);
	      customersActions.editCustomers.error(res.error);
	    }
	  },

	  onDeleteCustomers: function onDeleteCustomers(res) {
	    ajaxActions.request('/api/newcustomer/deleteCustomers', res, this.doneDeteleCustomers);
	  },
	  doneDeteleCustomers: function doneDeteleCustomers(res) {
	    if (res.status === true) {
	      customersActions.deleteCustomers.done(res.data);
	    } else {
	      customersActions.deleteCustomers.error(res.error);
	    }
	  }

	});

	module.exports = customer;

/***/ },

/***/ 526:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  newcustomer: {
	    title: {
	      index: 'Overview',
	      head: 'Customer List',
	      addCustomerBT: 'Add Customer',
	      headNew: 'Add/Edit Customer',
	      headProd: 'GROUP LIST',
	      headProdEdit: 'GROUP SETTING',
	      saveCustomerBT: 'SAVE',
	      editCustomerBT: 'Edit',
	      confirm_to_delete: 'Delete',
	      addProductGroupBT: 'Add Product Group',
	      addheader: 'Add Header'
	    },
	    menu: {
	      dashboard: 'Overview',
	      customer: 'Edit Customer',
	      addheader: 'Add Header',
	      receipt: 'รับชำระค่างวด',
	      receipt_dept: 'ค้นหาประวัติชำระ',
	      productGroup: 'กลุ่มสินค้า',
	      product: 'เพิ่มสินค้า'
	    },
	    customer_code: 'Code',
	    type: 'Customer Type',
	    fullname: 'Fullname',
	    nation: 'Customer Type',
	    last_uses_at: 'ใช้บริการครั้งสุดท้ายเมื่อ',
	    shop_name: 'ที่สาขา',
	    prod_group_id: 'รหัสกลุ่มสินค้า',
	    prod_group_name: 'ชื่อกลุ่มสินค้า',
	    prod_group_description: 'รายละเอียดกลุ่มสินค้า',
	    add_new_customer: {
	      customer_code: 'Code',
	      tax_num: 'ID',
	      member_code: 'Member Code',
	      titel: 'Title',
	      names: 'Name',
	      last_name: 'Lastname',
	      password: 'Password',
	      repassword: 'Re-Password',
	      e_mail: 'Email',
	      note: 'Note',
	      birthday: 'Birthday',
	      remark: 'Remark',
	      is_active: 'Is Active',
	      gender: 'Gender',
	      credit_term: 'Credit Term',
	      defaultAddrNo: 'No.',
	      defaultAddrSoi: 'Soi/Road',
	      defaultAddrTambon: 'Tambon',
	      defaultAddrAmphur: 'Amphur',
	      defaultAddrProvince: 'Province',
	      defaultAddrZipCode: 'ZipCode',
	      defaultAddrPhone: 'Phone',
	      contactName: 'Name',
	      contactPosition: 'Position',
	      contactEmail: 'Email',
	      contactPhoneNo: 'Tel.',
	      contactLineId: 'Line ID',
	      contactRemark: 'Note',
	      billingCode: 'Code',
	      billingName: 'Name',
	      billingTax: 'Tax ID',
	      billingAddr1: 'เลขที่/อาคาร/หมู่บ้าน',
	      billingAddr2: 'ซอย/ถนน',
	      billingTambon: 'แขวง/ตำบล',
	      billingAmper: 'อำเถอ',
	      billingProvince: 'จังหวัด',
	      billingZipcode: 'รหัสไปรษณีย์',
	      billingOtherNo: 'เบอร์อื่นๆ',
	      billingLiveYear: 'ปีที่อาศัย',
	      billingRemark: 'Remark',
	      billingSend: 'Transporter',
	      billingNote: 'Note',
	      billingPayment: 'Payment',
	      customer_type: 'Customer Type',
	      type_id: 'Type ID',
	      credit_term_status: 'Status',
	      paymentTeprList: 'Payment',
	      currency: 'Currency',
	      serviceChargeText: 'Service Charge Text',
	      serviceChargeAmount: 'Service Charge Amount',
	      discount: 'Discount'
	    },
	    tab: {
	      inital_tab: 'Inital',
	      default_addr_tab: 'Default Address',
	      billing_data: 'Billing Name',
	      contract_name: 'ชื่อผู้ติดต่อ',
	      upload_doc: 'Upload document'
	    },
	    inTable: {
	      no: 'No.',
	      contactNameInTable: 'Name',
	      contactPhoneNoInTable: 'Tel.',
	      contactCodeInTableBill: 'Code',
	      defaultBill: 'Default'
	    },
	    button: {
	      addContact: 'เพิ่มรายการ'
	    },
	    customer_type_list: {
	      type_person: 'บุคคล',
	      type_company: 'บริษัท'
	    },
	    newsList: {
	      yes: 'รับ',
	      no: 'ไม่รับ',
	      AP: 'อนุมัติ',
	      NAP: 'รออนุมัติ'
	    },
	    prod_group: {
	      name: 'Group Name'
	    },
	    prodGroupList: {
	      leftList: 'Product Code',
	      rightList: 'In List'
	    }
	  }
	};

/***/ },

/***/ 527:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  preliminary: {
	    title: {
	      index: 'ภาพรวม',
	      head: 'รายการลูกค้า',
	      addCustomerBT: 'เพิ่มลูกค้า',
	      headNew: 'เพิ่ม/แก้ไข ข้อมูลลูกค้า',
	      headProd: 'GROUP LIST',
	      headProdEdit: 'GROUP SETTING',
	      saveCustomerBT: 'บันทึก',
	      editCustomerBT: 'แก้ไข',
	      confirm_to_delete: 'ลบข้อมูลสมาชิก',
	      addProductGroupBT: 'เพิ่มกลุ่มสินค้า'
	    },
	    menu: {
	      dashboard: 'ภาพรวม',
	      customer: 'ลูกค้า',
	      receipt: 'รับชำระค่างวด',
	      receipt_dept: 'ค้นหาประวัติชำระ',
	      productGroup: 'กลุ่มสินค้า',
	      product: 'เพิ่มสินค้า'
	    },
	    customer_code: 'รหัสลูกค้า',
	    type: 'ประเภทลูกค้า',
	    fullname: 'ชื่อเต็ม',
	    nation: 'ประเภทสมาชิก',
	    last_uses_at: 'ใช้บริการครั้งสุดท้ายเมื่อ',
	    shop_name: 'ที่สาขา',
	    prod_group_id: 'รหัสกลุ่มสินค้า',
	    prod_group_name: 'ชื่อกลุ่มสินค้า',
	    prod_group_description: 'รายละเอียดกลุ่มสินค้า',
	    add_new_customer: {
	      customer_code: 'รหัส',
	      tax_num: 'เลขที่บัตรประชาชน',
	      member_code: 'รหัสสมาชิก',
	      sex: 'คำนำหน้า',
	      names: 'ชื่อ',
	      last_name: 'นามสกุล',
	      phone: 'เบอร์โทร',
	      fax: 'เบอร์แฟ๊กซ์',
	      e_mail: 'อีเมลล์',
	      line_id: 'LineID',
	      birthday: 'วันเกิด',
	      olds: 'อายุ',
	      news: 'รับข่าวสาร',
	      credit_term: 'เครดิตเทอม',
	      contactName: 'ชื่อ',
	      contactPosition: 'ตำแหน่ง',
	      contactEmail: 'อีเมลล์',
	      contactPhoneNo: 'เบอร์โทร',
	      contactLineId: 'Line ID',
	      contactRemark: 'บันทึก',
	      billingCode: 'รหัส',
	      billingName: 'ชื่อ',
	      billingTax: 'เลขประจำตัวผู้เสียภาษี',
	      billingAddr1: 'เลขที่/อาคาร/หมู่บ้าน',
	      billingAddr2: 'ซอย/ถนน',
	      billingTambon: 'แขวง/ตำบล',
	      billingAmper: 'อำเถอ',
	      billingProvince: 'จังหวัด',
	      billingZipcode: 'รหัสไปรษณีย์',
	      billingOtherNo: 'เบอร์อื่นๆ',
	      billingLiveYear: 'ปีที่อาศัย',
	      billingRemark: 'หมายเหตุ',
	      billingSend: 'การจัดส่ง',
	      billingNote: 'บันทึก',
	      billingPayment: 'การจ่ายเงิน',
	      customer_type: 'ประเภท',
	      member_type: 'ประเภทสมาชิก',
	      credit_term_status: 'สถานะ'
	    },
	    tab: {
	      billing_data: 'ชื่อและที่อยู่ที่ใช้ในการออกบิล',
	      contract_name: 'ชื่อผู้ติดต่อ'
	    },
	    inTable: {
	      contactNameInTable: 'ชื่อ',
	      contactPhoneNoInTable: 'เบอร์โทร',
	      contactCodeInTableBill: 'รหัส',
	      defaultBill: 'ที่อยู่หลัก'
	    },
	    button: {
	      addContact: 'เพิ่มรายการ'
	    },
	    customer_type_list: {
	      type_person: 'บุคคล',
	      type_company: 'บริษัท'
	    },
	    newsList: {
	      yes: 'รับ',
	      no: 'ไม่รับ',
	      AP: 'อนุมัติ',
	      NAP: 'รออนุมัติ'
	    },
	    prod_group: {
	      name: 'Group Name'
	    },
	    prodGroupList: {
	      leftList: 'Product Code',
	      rightList: 'In List'
	    }
	  }
	};

/***/ }

});