webpackJsonp([106,108,111,135],{

/***/ 965:
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

	var Customer = __webpack_require__(966);
	var ProductGroup = __webpack_require__(971);

	tr.registerTranslations('en', __webpack_require__(976));
	tr.registerTranslations('th', __webpack_require__(977));

	var App = {};

	App.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setTheme(1);
	    systemActions.updateTopPanel({
	      code: 'pos',
	      name: 'ข้อมูลลูกค้า',
	      icon: 'front17'
	    });
	    menuActions.show([{ id: 'dashboard', index: true, route: '/preliminary', label: 'preliminary.menu.dashboard', icon: 'show6', acl: ['M_PRELIMINARY_DASHBOAD', 'M_CUSTOMER'] }, { id: 'customer', route: '/preliminary/customer', label: 'preliminary.menu.customer', icon: 'users25', acl: ['M_PRELIMINARY_CUSTOMER'] }, { id: 'group_product', route: '/preliminary/group_product', label: 'preliminary.menu.group_product', icon: 'website12', acl: ['M_PRELIMINARY_PRODUCT_GROUP'] }, { id: 'import_point', route: '/preliminary/fare/import_point', label: 'preliminary.menu.fare_point', icon: 'import', acl: ['M_PRELIMINARY_FAREPOINT'] }, { id: 'import_reword', route: '/preliminary/fare/import_reword', label: 'preliminary.menu.fare_reword', icon: 'import', acl: ['M_PRELIMINARY_FAREREWORD'] }]);
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
	          React.createElement(T, { content: 'preliminary.title.index' })
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
	//   <Route name="preliminary" path="preliminary" handler={App.Index}>
	//     <Router.DefaultRoute name="preliminary.dashboard" handler={App.Dashboard}/>
	//     {Customer.Routes}
	//     {ProductGroup.Routes}
	//   </Route>
	// );
	//
	// gอากลับไปใส่ด้วย {id:'group_product', route:'/preliminary/group_product', label:'preliminary.menu.group_product', icon:'website12',acl:['M_PRELIMINARY_PRODUCT_GROUP']}

	module.exports = App;

/***/ },

/***/ 966:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions; //require('../../system/actions');

	var customerActions = __webpack_require__(967);
	var customerStore = __webpack_require__(968);

	var Customer = {};

	tr.registerTranslations('en', __webpack_require__(969));
	tr.registerTranslations('th', __webpack_require__(970));

	Customer.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    //systemActions.setPageHeader('');
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	// Customer.List = require('./customer-list.jsx');
	// Customer.Edit = require('./customer-edit.jsx');

	// Customer.Routes = (
	//   <Route name="preliminary.customer" path="customer" handler={Customer.Index}>
	//     <Router.DefaultRoute name="preliminary.customer.list" path="customer-list" handler={Customer.List}/>
	//     <Route name="preliminary.customer.edit" path="edit/:id" handler={Customer.Edit}/>
	//   </Route>
	// );

	module.exports = Customer;

/***/ },

/***/ 967:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
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

/***/ 968:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);
	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var sellActions = system.sellActions; //require('./actions');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var customersActions = __webpack_require__(967);

	var customer = Reflux.createStore({
	  listenables: [customersActions],

	  // customerList
	  onList: function onList(param) {
	    console.log('request');
	    ajaxActions.request('/api/preliminary/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      customersActions.list.done(res.data, res.opt);
	      //menuActions.updateCount('receipt.sell', res.opt.totalRows);
	    } else {
	        customersActions.list.error(res.error);
	      }
	  },
	  // onExport: function(param) {
	  //   ajaxActions.request('/api/receipt/export', param, this.doneExport);
	  // },
	  //
	  // doneExport: function(res) {
	  //   if (res.status===true) {
	  //     paymentActions.export.done(res.file);
	  //   } else {
	  //     paymentActions.export.error(res.error);
	  //   }
	  // },

	  onGetMemberType: function onGetMemberType() {
	    //console.log('XXX');
	    ajaxActions.request('/api/preliminary/getMemberType', {}, this.doneGetMemberType);
	  },
	  doneGetMemberType: function doneGetMemberType(res) {
	    if (res.status === true) {
	      //console.log('doneGetMemberType',res);
	      customersActions.getMemberType.done(res.data);
	    } else {
	      customersActions.getMemberType.error(res.msg);
	    }
	  },

	  onGetCurrencyFromBase: function onGetCurrencyFromBase() {
	    console.log('ddttaa');
	    ajaxActions.request('/api/preliminary/getCurrencyFromBase', {}, this.doneGetCurrencyFromBase);
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
	    ajaxActions.request('/api/preliminary/getCustomerData', res, this.doneGetCustomerData);
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
	    ajaxActions.request('/api/preliminary/getContactListData', res, this.doneGetContactListData);
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
	    ajaxActions.request('/api/preliminary/getBillingListData', res, this.doneGetBillingListData);
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
	    ajaxActions.request('/api/preliminary/saveCustomers', res, this.doneSaveCustomers);
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
	    ajaxActions.request('/api/preliminary/editCustomers', res, this.doneEditCustomers);
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
	    ajaxActions.request('/api/preliminary/deleteCustomers', res, this.doneDeteleCustomers);
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

/***/ 969:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  preliminary: {
	    title: {
	      index: 'Overview',
	      head: 'Customer List',
	      addCustomerBT: 'Add Customer',
	      headNew: 'Add/Edit Customer',
	      headProd: 'GROUP LIST',
	      headProdEdit: 'GROUP SETTING',
	      saveCustomerBT: 'Save',
	      editCustomerBT: 'Edit',
	      confirm_to_delete: 'Delete',
	      addProductGroupBT: 'Add Product Group'
	    },
	    list: {
	      nationid: 'Card ID',
	      passport: 'Passport',
	      tax_id: 'TAX_ID',
	      mr: 'Mr.',
	      miss: 'Miss',
	      mrs: 'Mrs.'
	    },
	    menu: {
	      dashboard: 'Overview',
	      customer: 'Customer',
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
	      member_type: 'Member Type',
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
	      initial_tab: 'Initial',
	      default_addr_tab: 'Default Address',
	      billing_data: 'Billing Name',
	      contract_name: 'Contract Name'
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
	      type_person: 'Non Corporate',
	      type_company: 'Corporate'
	    },
	    newsList: {
	      yes: 'รับ',
	      no: 'ไม่รับ',
	      AP: 'Approve',
	      NAP: 'Wait Approve'
	    },
	    prod_group: {
	      name: 'Group Name'
	    },
	    prodGroupList: {
	      leftList: 'Product Code',
	      rightList: 'In List'
	    }
	  },
	  page: {
	    pageNumber: 'Pagenumber',
	    rowNumber: 'Rownumber',
	    perPage: 'Perpage',
	    rows: 'Rows'
	  }
	};

/***/ },

/***/ 970:
/***/ function(module, exports) {

	"use strict";

	module.exports = {};

/***/ },

/***/ 971:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var systemActions = system.systemActions; //require('../../system/actions');

	var customerActions = __webpack_require__(972);
	var customerStore = __webpack_require__(973);

	var GroupProduct = {};

	tr.registerTranslations('en', __webpack_require__(974));
	tr.registerTranslations('th', __webpack_require__(975));

	GroupProduct.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('preliminary.group_product.head'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	module.exports = GroupProduct;

/***/ },

/***/ 972:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'groupProductSave': { children: ['done', 'error'] },
	  'groupProductList': { children: ['done', 'error'] },
	  'groupProductItem': { children: ['done', 'error'] },
	  'allProductItem': { children: ['done', 'error'] },
	  'allGroupItem': { children: ['done', 'error'] },
	  'getGroupProudct': { children: ['done', 'error'] },
	  'groupProductDelete': { children: ['done', 'error'] }
	});

/***/ },

/***/ 973:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);
	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var sellActions = system.sellActions; //require('./actions');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var productAction = __webpack_require__(972);

	var product = Reflux.createStore({
	  listenables: [productAction],

	  // customerList
	  onGroupProductList: function onGroupProductList(param) {
	    ajaxActions.request('/api/preliminary/group_product_list', param, function (res) {
	      productAction.groupProductList.done(res.data, res.opt);
	    });
	  },

	  // customerList
	  onGroupProductItem: function onGroupProductItem(param) {
	    ajaxActions.request('/api/preliminary/product_group_item', param, function (res) {
	      console.log('product_group_item', res);
	      productAction.groupProductItem.done(res.data, res.opt);
	    });
	  },
	  // }
	  onAllProductItem: function onAllProductItem(param) {
	    ajaxActions.request('/api/preliminary/product_all_item', param, function (res) {
	      console.log('product_all_item', res);
	      productAction.allProductItem.done(res.data, res.opt);
	    });
	  },
	  onAllGroupItem: function onAllGroupItem(param) {
	    ajaxActions.request('/api/preliminary/group_all_item', param, function (res) {
	      console.log('group_all_item', res);
	      productAction.allGroupItem.done(res.data, res.opt);
	    });
	  },
	  onGetGroupProudct: function onGetGroupProudct(param) {
	    ajaxActions.request('/api/preliminary/group_proudct', param, function (res) {
	      productAction.getGroupProudct.done(res);
	    });
	  },

	  onGroupProductSave: function onGroupProductSave(param, group) {
	    ajaxActions.request('/api/preliminary/group_proudct_save', { param: param, items: group }, function (res) {
	      console.log('group_proudct_save', res);
	      productAction.groupProductSave.done(res);
	    });
	  },
	  onGroupProductDelete: function onGroupProductDelete(param) {
	    ajaxActions.request('/api/preliminary/group_proudct_delete', param, function (res) {
	      console.log('group_proudct_delete', res);
	      productAction.groupProductDelete.done(res);
	    });
	  }
	});

	module.exports = product;

/***/ },

/***/ 974:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    user: 'Username',
	    pass: 'Password',
	    display_name: 'Display Name',
	    last_login: 'Last Login',
	    last_ip: 'Last IP'
	  }
	};

/***/ },

/***/ 975:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  preliminary: {
	    menu: {
	      dashboard: 'ภาพรวม'
	    },
	    group_product: {
	      search_group: 'ค้นหาข้อมูล',
	      search_prod: 'ค้นหาข้อมูล',
	      name: 'ชื่อกลุ่มโปรโมชั่น',
	      code: 'รหัสกลุ่มโปรโมชั่น',
	      oracle_db: 'ฐานข้อมูล',
	      db_stock: 'Stock',
	      db_mini: 'มินิ',
	      db_repair: 'ซ่อม'
	    },
	    group_product_list: {
	      leftList: 'Product Selected',
	      rightList: 'Choose Product'
	    }
	  }

	};

/***/ },

/***/ 976:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  preliminary: {
	    title: {
	      index: 'Overview',
	      head: 'Customer List',
	      addCustomerBT: 'Add Customer',
	      headNew: 'Add/Edit Customer',
	      headProd: 'GROUP LIST',
	      headProdEdit: 'GROUP SETTING',
	      saveCustomerBT: 'Save',
	      editCustomerBT: 'Edit',
	      confirm_to_delete: 'Delete',
	      addProductGroupBT: 'Add Product Group'
	    },
	    list: {
	      nationid: 'Card ID',
	      passport: 'Passport',
	      tax_id: 'TAX_ID',
	      mr: 'Mr.',
	      miss: 'Miss',
	      mrs: 'Mrs.'
	    },
	    menu: {
	      dashboard: 'Overview',
	      customer: 'Customer',
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
	      member_type: 'Member Type',
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
	      initial_tab: 'Initial',
	      default_addr_tab: 'Default Address',
	      billing_data: 'Billing Name',
	      contract_name: 'Contract Name'
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
	      type_person: 'Non Corporate',
	      type_company: 'Corporate'
	    },
	    newsList: {
	      yes: 'รับ',
	      no: 'ไม่รับ',
	      AP: 'Approve',
	      NAP: 'Wait Approve'
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

/***/ 977:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  preliminary: {
	    title: {
	      index: 'ภาพรวม',
	      head: 'รายการลูกค้า',
	      addCustomerBT: 'เพิ่มลูกค้า',
	      headNew: 'เพิ่ม/แก้ไข ลูกค้า',
	      headProd: 'GROUP LIST',
	      headProdEdit: 'GROUP SETTING',
	      saveCustomerBT: 'บันทึก',
	      editCustomerBT: 'แก้ไข',
	      cancelCustomerBT: 'ยกเลิก',
	      confirm_to_delete: 'ลบ',
	      addProductGroupBT: 'เพิ่มกลุ่มโปรโมชั่น'
	    },
	    list: {
	      nationid: 'เลขประจำตัวประชาชน',
	      passport: 'Passport',
	      tax_id: 'TAX_ID',
	      mr: 'นาย',
	      miss: 'นางสาว',
	      mrs: 'นาง.'
	    },
	    menu: {
	      dashboard: 'ภาพรวม',
	      customer: 'ลูกค้า',
	      receipt: 'รับชำระค่างวด',
	      receipt_dept: 'ค้นหาประวัติชำระ',
	      group_product: 'กลุ่มโปรโมชั่น',
	      fare_point: 'กลุ่มพ้อยต์',
	      fare_reword: 'กลุ่มรางวัล',
	      product: 'เพิ่มสินค้า'
	    },
	    customer_code: 'รหัส',
	    type: 'ประเภทลูกค้า',
	    fullname: 'ชื่อ',
	    nation: 'Customer Type',
	    last_uses_at: 'ใช้บริการครั้งสุดท้ายเมื่อ',
	    shop_name: 'ที่สาขา',
	    prod_group_id: 'รหัสกลุ่มโปรโมชั่น',
	    prod_group_name: 'ชื่อกลุ่มโปรโมชั่น',
	    prod_group_description: 'รายละเอียดกลุ่มโปรโมชั่น',
	    add_new_customer: {
	      member_type: 'ประเภทสมาชิก',
	      customer_code: 'รหัส',
	      tax_num: 'ID',
	      member_code: 'รหัสสมาชิก',
	      titel: 'คำนำหน้า',
	      names: 'ชื่อ',
	      last_name: 'นามสกุล',
	      password: 'รหัสผ่าน',
	      repassword: 'รหัสผ่านซ้ำ',
	      e_mail: 'Email',
	      note: 'บันทึก',
	      birthday: 'วันเกิด',
	      remark: 'หมายเหตุ',
	      is_active: 'สถานะการใช้งาน',
	      gender: 'เพศ',
	      credit_term: 'Credit Term',
	      defaultAddrNo: 'เลขที่/อาคาร/หมู่บ้าน',
	      defaultAddrSoi: 'ซอย/ถนน',
	      defaultAddrTambon: 'แขวง/ตำบล',
	      defaultAddrAmphur: 'เขต/อำเภอ',
	      defaultAddrProvince: 'จังหวัด',
	      defaultAddrZipCode: 'รหัสไปรษณีย์',
	      defaultAddrPhone: 'โทร',
	      contactName: 'ชื่อ',
	      contactPosition: 'ตำแหน่ง',
	      contactAddr1: 'เลขที่/อาคาร/หมู่บ้าน',
	      contactAddr2: 'ซอย/ถนน',
	      contactTambon: 'แขวง/ตำบล',
	      contactAmphur: 'เขต/อำเภอ',
	      contactProvince: 'จังหวัด',
	      contactZipcode: 'รหัสไปรษณีย์',
	      contactEmail: 'Email',
	      contactPhoneNo: 'โทร.',
	      contactLineId: 'Line ID',
	      contactRemark: 'บันทึก',
	      billingCode: 'รหัส',
	      billingName: 'ชื่อ',
	      billingTax: 'เลขประจำตัวผู้เสียภาษี',
	      billingAddr1: 'เลขที่/อาคาร/หมู่บ้าน',
	      billingAddr2: 'ซอย/ถนน',
	      billingTambon: 'แขวง/ตำบล',
	      billingAmper: 'เขต/อำเภอ',
	      billingProvince: 'จังหวัด',
	      billingZipcode: 'รหัสไปรษณีย์',
	      billingOtherNo: 'เบอร์อื่นๆ',
	      billingLiveYear: 'ปีที่อาศัย',
	      billingRemark: 'หมายเหตุ',
	      billingSend: 'การส่ง',
	      billingNote: 'บันทึก',
	      billingPayment: 'ประเภทการจ่ายเงิน',
	      customer_type: 'ประเภทสมาชิก',
	      type_id: 'เลขประจำตัว',
	      credit_term_status: 'สถานะ',
	      paymentTeprList: 'ประเภทการจ่างเงิน',
	      currency: 'สกุลเงิน',
	      serviceChargeText: 'สาเหตุการเพิ่มเงิน',
	      serviceChargeAmount: 'จำนวนเพิ่มเติม',
	      discount: 'ส่วนลด'
	    },
	    tab: {
	      initial_tab: 'ค่าเริ่มต้น',
	      default_addr_tab: 'ที่อยู่หลัก',
	      billing_data: 'ที่อยู่ออกบิล',
	      contract_name: 'ผู้ติดต่อ'
	    },
	    inTable: {
	      no: 'ลำดับ',
	      contactNameInTable: 'ชื่อ',
	      contactPhoneNoInTable: 'โทร.',
	      contactCodeInTableBill: 'รหัส',
	      defaultBill: 'Default'
	    },
	    button: {
	      addContact: 'เพิ่มรายการ'
	    },
	    customer_type_list: {
	      type_person: 'บุลคล',
	      type_company: 'บริษัท'
	    },
	    newsList: {
	      yes: 'รับ',
	      no: 'ไม่รับ',
	      AP: 'Approve',
	      NAP: 'Wait Approve'
	    },
	    group_product: {
	      head: 'ข้อมูลกลุ่มโปรโมชั่น'
	    },
	    group_product_list: {
	      leftList: 'Product Selected',
	      rightList: 'Choose Product'
	    }
	  }
	};

/***/ }

});