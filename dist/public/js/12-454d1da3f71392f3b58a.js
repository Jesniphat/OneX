webpackJsonp([12,135],{

/***/ 614:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions; //require('../../system/actions');

	var reportActions = __webpack_require__(615);
	var reportStore = __webpack_require__(616);

	var NewReport = {};

	tr.registerTranslations('en', __webpack_require__(617));
	tr.registerTranslations('th', __webpack_require__(618));

	NewReport.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    //systemActions.setPageHeader('');
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	// NewReport.New = require('./Report-new.jsx');

	// NewReport.Routes = (
	//   <Route name="newReport.Report" path="add_Report/edit/:id?" handler={NewReport.Index}>
	//     <Router.DefaultRoute name="newReport.Report.new" handler={NewReport.New}/>
	//   </Route>
	// );

	module.exports = NewReport;

/***/ },

/***/ 615:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'genReport': { children: ['done', 'error'] }
	});

/***/ },

/***/ 616:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);
	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var sellActions = system.sellActions; //require('./actions');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var bookingReportActions = __webpack_require__(615);

	var customer = Reflux.createStore({
	  listenables: [bookingReportActions],

	  onGenReport: function onGenReport(bookingId) {
	    console.log('Start Gen Report = ', bookingId);
	    var req = { bookingId: bookingId };
	    ajaxActions.request('/api/bookingtransport/booking_report', req, this.doneGenReport);
	  },
	  doneGenReport: function doneGenReport(res) {
	    console.log("Done GenReport");
	    // if (res.status === true) {
	    //   //console.log('doneGetMemberType');
	    //   bookingReportActions.getMemberType.done(res.data);
	    // } else {
	    //   bookingReportActions.getMemberType.error(res.msg);
	    // }
	  }

	});

	module.exports = customer;

/***/ },

/***/ 617:
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

/***/ 618:
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