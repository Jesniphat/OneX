webpackJsonp([2,135],{

/***/ 511:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);

	var system = __webpack_require__(356);
	var systemActions = system.systemActions;
	var menuActions = system.menuActions;
	var infoPanelActions = system.infoPanelActions;

	//var LoadFare          = require('./loadfare/loadfare.jsx');

	tr.registerTranslations('en', __webpack_require__(512));
	tr.registerTranslations('th', __webpack_require__(513));

	var App = {};

	App.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader("Transport");
	    systemActions.setTheme(1);
	    systemActions.updateTopPanel({
	      code: 'pos',
	      name: 'Transport',
	      icon: 'world96'
	    });
	    menuActions.show([{ id: 'dashboard', route: '/transport', label: 'transport.menu.dashboard', icon: 'show6', acl: ['pos'] }, { id: 'loadfareZone', route: '/transport/loadfare/zone', label: 'transport.menu.loadfareZone', icon: 'download166', acl: ['pos'] }, { id: 'loadfareRate', route: '/transport/loadfare/rate', label: 'transport.menu.loadfareRate', icon: 'download166', acl: ['pos'] }, { id: 'bookingList', route: '/transport/bookingList', label: 'transport.menu.bookingList', icon: 'list88', acl: ['transport'] }, { id: 'bookingWaitCredit', route: '/transport/bookingWaitCredit', label: 'transport.menu.bookingWaitCredit', icon: '', acl: ['transport'] }, { id: 'bookingWaitAssign', route: '/transport/bookingWaitAssign', label: 'transport.menu.bookingWaitAssign', icon: '', acl: ['M_NEWCUSTOMR_CUSTOMER'] }, { id: 'bookingInprocess', route: '/transport/bookingInprocess', label: 'transport.menu.inprocess', icon: '', acl: ['M_NEWCUSTOMR_CUSTOMER'] }, { id: 'bookingIntransit', route: '/transport/bookingIntransit', label: 'transport.menu.intransit', icon: '', acl: ['M_NEWCUSTOMR_CUSTOMER'] }, { id: 'bookingArrived', route: '/transport/bookingArrived', label: 'transport.menu.arrived', icon: '', acl: ['M_NEWCUSTOMR_CUSTOMER'] }, { id: 'bookingDelivered', route: '/transport/bookingDelivered', label: 'transport.menu.delivered', icon: '', acl: ['M_NEWCUSTOMR_CUSTOMER'] }, { id: 'bookingException', route: '/transport/bookingException', label: 'transport.menu.exception', icon: '', acl: ['M_NEWCUSTOMR_CUSTOMER'] }, { id: 'bookingCancel', route: '/transport/bookingCancel', label: 'transport.menu.cancel', icon: '', acl: ['M_NEWCUSTOMR_CUSTOMER'] }, { id: 'booking', route: '/transport/booking', label: 'transport.menu.booking', icon: 'users25', acl: ['M_NEWCUSTOMR_CUSTOMER'] }, { id: 'pickup', route: '/transport/pickup', label: 'transport.menu.pickup', icon: 'shopping231', acl: ['M_NEWCUSTOMR_CUSTOMER'] }]);
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	App.Dashboard = React.createClass({
	  displayName: 'Dashboard',

	  componentDidMount: function componentDidMount() {
	    infoPanelActions.hide();
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          React.createElement(T, { content: 'transport.title.index' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel5' },
	          ' '
	        )
	      )
	    );
	  }
	});

	// App.Routes = (
	//   <Route name="transport" path="transport" handler={App.Index}>
	//     <Router.DefaultRoute name="transport.dashboard" handler={App.Dashboard}/>
	//     {LoadFare.Routes}
	//   </Route>
	// );
	//
	//
	// {id:'customer', route:'/transport/customer' , label:'transport.menu.customer', icon:'users25',acl:['M_NEWCUSTOMR_CUSTOMER']},

	module.exports = App;

/***/ },

/***/ 512:
/***/ function(module, exports) {

	'use strict';

	var _transport;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	module.exports = {
	  transport: (_transport = {
	    title: {
	      index: 'Overview',
	      loadfareScreen: 'Load Fare',
	      bookingScreen: 'New Courier',
	      headBookingList: 'Booking list',
	      confirm_to_change_status: 'Change status.',
	      confirm_to_delete: 'Delete.',
	      headPickupList: 'Pickup List',
	      newPickup: 'New pickup'
	    },
	    head: {
	      headName: 'Load Fare'
	    },
	    menu: {
	      dashboard: 'Overview',
	      loadfareZone: 'Load fare zone',
	      loadfareRate: 'Load fare rate',
	      customer: 'Customer',
	      bookingList: 'Booking list',
	      bookingWaitCredit: 'Wait confirm credit card',
	      bookingWaitAssign: 'Wait assign',
	      inprocess: "In process",
	      intransit: "In transit",
	      arrived: "Arrived",
	      delivered: "Delivered",
	      exception: 'Exception',
	      cancel: 'Cancel',
	      booking: 'Booking',
	      pickup: 'Pickup'
	    },
	    fare: {
	      title: 'Load Fare'
	    },
	    booking_no: 'Booking NO.',
	    customer_name: 'Customer name',
	    pickup_place: 'Pickup place',
	    pickup_date: 'Pickup date',
	    type: 'Customer type',
	    real_delivery_date: 'Delivery date',
	    booking_date: 'Booking date',
	    textFields: {
	      additionDetail: 'Detail'
	    },
	    pickup_no: 'Pickup No.'
	  }, _defineProperty(_transport, 'pickup_date', 'Pickup date'), _defineProperty(_transport, 'city_district', 'City-districk'), _defineProperty(_transport, 'prepare_by', 'Prepare by'), _defineProperty(_transport, 'driver', 'Driver'), _defineProperty(_transport, 'plan_qty', 'Plan qty'), _defineProperty(_transport, 'pickup_qty', 'Pickup qty'), _defineProperty(_transport, 'status', 'Status'), _transport),
	  page: {
	    pageNumber: 'Pagenumber',
	    rowNumber: 'Rownumber',
	    perPage: 'Perpage',
	    rows: 'Rows'
	  },
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
	      contactAddr1: 'No./Moo',
	      contactAddr2: 'Soi/Road',
	      contactTambon: 'Tambon',
	      contactAmphur: 'Amphur',
	      contactProvince: 'Province',
	      contactZipcode: 'Zipcode',
	      contactEmail: 'Email',
	      contactPhoneNo: 'Tel.',
	      contactLineId: 'Line ID',
	      contactRemark: 'Note',
	      billingCode: 'Code',
	      billingName: 'Name',
	      billingTax: 'Tax ID',
	      billingAddr1: 'No/Building/Village',
	      billingAddr2: 'Street/Road',
	      billingTambon: 'Tambon',
	      billingAmper: 'Amphur',
	      billingProvince: 'Province',
	      billingZipcode: 'Zipcode',
	      billingOtherNo: 'Tel.',
	      billingLiveYear: 'Years living',
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
	      contract_name: 'Contract Name',
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
	      addContact: 'Add/Update'
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

/***/ 513:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  transport: {
	    title: {
	      index: 'Overview',
	      loadfareScreen: 'Load Fare'
	    },
	    head: {
	      headName: 'Load Fare'
	    },
	    menu: {
	      dashboard: 'ภาพรวม',
	      loadfareZone: 'อัพโหลดข้อมูลโซน',
	      loadfareRate: 'อัพโหลดข้อมูลเรท',
	      customer: 'ข้อมูลลูกค้า',
	      bookingList: 'รายการบุ๊กกิ๊ง',
	      booking: 'บุ๊กกิ๊ง'
	    }
	  },
	  page: {
	    pageNumber: 'Pagenumber',
	    rowNumber: 'Rownumber',
	    perPage: 'Perpage',
	    rows: 'Rows'
	  },
	  newcustomer: {
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
	      addContact: 'Add/Update'
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