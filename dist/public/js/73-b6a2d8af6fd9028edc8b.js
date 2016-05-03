webpackJsonp([73,135],{

/***/ 829:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions;

	var recontractActions = __webpack_require__(830);
	var recontractStore = __webpack_require__(831);

	var Recontract = {};

	tr.registerTranslations('en', __webpack_require__(832));
	tr.registerTranslations('th', __webpack_require__(833));

	Recontract = React.createClass({
	  displayName: 'Recontract',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('contract.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	//Recontract.List = require('./recontract-list.jsx');

	// Recontract.Routes = (
	//   <Route name="installment.recontract" path="recontract" handler={Recontract.Index}>
	//     <Router.DefaultRoute name="installment.recontract.list" path="list" handler={Recontract.List}/>
	//   </Route>
	// );

	module.exports = Recontract;

/***/ },

/***/ 830:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'listRecontract': { children: ['done', 'error'] },
	  'exportRecontract': { children: ['done', 'error'] },
	  'saveRecontract': { children: ['done', 'error'] }
	});

/***/ },

/***/ 831:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var contractActions = __webpack_require__(830);

	var contractStore = Reflux.createStore({
	  listenables: [contractActions],

	  // contractActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/installment/contract/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      contractActions.list.done(res.data, res.opt);
	      menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	      contractActions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/installment/contract/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      contractActions.export.done(res.file);
	    } else {
	      contractActions.export.error(res.error);
	    }
	  },
	  onGetBarcode: function onGetBarcode(param) {
	    ajaxActions.request('/api/installment/contract/listBarcode', param, this.doneGetBarcode);
	  },

	  doneGetBarcode: function doneGetBarcode(res) {
	    if (res.status === true) {
	      contractActions.getBarcode.done(res.data, res.opt);
	    } else {
	      contractActions.getBarcode.error(res.error);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/installment/contract/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      contractActions.getById.done({
	        contract: res.contract,
	        paymentTerm: res.paymentTerm,
	        refContract: res.refContract
	      });
	    } else {
	      contractActions.getById.error(res.msg);
	    }
	  },

	  onSaveNew: function onSaveNew(data) {
	    ajaxActions.request('/api/installment/contract/saveNew', data, this.doneSaveNew);
	  },

	  doneSaveNew: function doneSaveNew(res) {
	    if (res.status === true) {
	      contractActions.saveNew.done(res.data);
	      //      menuActions.updateCount('contract', res.totalRows);
	    } else {
	        contractActions.saveNew.error(res.error);
	      }
	  },

	  onDelete: function onDelete(id) {
	    ajaxActions.request('/api/installment/contract/delete', { id: id }, this.doneDelete);
	  },

	  doneDelete: function doneDelete(res) {
	    if (res.status === true) {
	      contractActions.delete.done(res.data);
	    } else {
	      contractActions.delete.error(res.msg);
	    }
	  },

	  onGetSellInfo: function onGetSellInfo(id) {
	    ajaxActions.request('/api/installment/contract/sellInfo', { id: id }, this.doneGetSellInfo);
	  },

	  doneGetSellInfo: function doneGetSellInfo(res) {
	    if (res.status === true) {
	      contractActions.getSellInfo.done(res.data);
	    } else {
	      contractActions.getSellInfo.error(res.error);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/installment/contract/save', data, this.doneSave);
	  },
	  doneSave: function doneSave(res) {
	    console.log(res.status);
	    if (res.status === true) {
	      contractActions.save.done(res.data);
	    } else {
	      contractActions.save.error(res.error);
	    }
	  },

	  // contractActions.Close
	  onListClose: function onListClose(param) {
	    ajaxActions.request('/api/installment/contract/listClose', param, this.doneListClose);
	  },

	  doneListClose: function doneListClose(res) {
	    if (res.status === true) {
	      contractActions.listClose.done(res.data, res.opt);
	      //menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	        contractActions.listClose.error(res.error);
	      }
	  },

	  onExportClose: function onExportClose(param) {
	    ajaxActions.request('/api/installment/contract/exportClose', param, this.doneExportClose);
	  },

	  doneExportClose: function doneExportClose(res) {
	    if (res.status === true) {
	      contractActions.exportClose.done(res.file);
	    } else {
	      contractActions.exportClose.error(res.error);
	    }
	  },

	  onGetCloseReturn: function onGetCloseReturn(param) {
	    console.log('request');
	    ajaxActions.request('/api/installment/contract/getCloseReturn', param, this.doneGetCloseReturn);
	  },

	  doneGetCloseReturn: function doneGetCloseReturn(res) {
	    if (res.status === true) {
	      contractActions.getCloseReturn.done(res.data);
	    } else {
	      contractActions.getCloseReturn.error(res.error);
	    }
	  },

	  onSaveCollection: function onSaveCollection(param) {
	    ajaxActions.request('/api/installment/contract/saveCollection', param, this.doneSaveCollection);
	  },

	  doneSaveCollection: function doneSaveCollection(res) {
	    if (res.status === true) {
	      contractActions.saveCollection.done(res.data);
	    } else {
	      contractActions.saveCollection.error(res.error);
	    }
	  },

	  onGetListCollection: function onGetListCollection(id) {
	    ajaxActions.request('/api/installment/contract/getListCollection', { id: id }, this.doneGetListCollection);
	  },

	  doneGetListCollection: function doneGetListCollection(res) {
	    if (res.status === true) {
	      contractActions.getListCollection.done(res.data);
	    } else {
	      contractActions.getListCollection.error(res.error);
	    }
	  },

	  onGetMobileNumber: function onGetMobileNumber(param) {
	    //console.log('onPaymentOptionList');
	    ajaxActions.request('/api/installment/contract/getMobileNumber', param, this.doneGetMobileNumber);
	  },

	  doneGetMobileNumber: function doneGetMobileNumber(res) {
	    if (res.status === true) {
	      contractActions.getMobileNumber.done(res.data);
	    } else {
	      contractActions.getMobileNumber.error(res.error);
	    }
	  },

	  onPrintCollectionReport: function onPrintCollectionReport(res) {
	    ajaxActions.request('/api/installment/contract/printCollectionReport', res, this.donePrintCollectionReport);
	  },

	  donePrintCollectionReport: function donePrintCollectionReport(res) {
	    if (res.status === true) {
	      contractActions.printCollectionReport.done(res.data);
	    } else {
	      contractActions.printCollectionReport.error(res.error);
	    }
	  },

	  onExportDunning: function onExportDunning(param) {
	    ajaxActions.request('/api/installment/contract/exportDunning', param, this.doneExportDunning);
	  },

	  doneExportDunning: function doneExportDunning(res) {
	    if (res.status === true) {
	      contractActions.exportDunning.done(res.file);
	    } else {
	      contractActions.exportDunning.error(res.error);
	    }
	  },

	  onListClosediscount: function onListClosediscount(param) {
	    ajaxActions.request('/api/installment/contract/listClosediscount', param, this.doneListClosediscount);
	  },

	  doneListClosediscount: function doneListClosediscount(res) {
	    if (res.status === true) {
	      contractActions.listClosediscount.done(res.data, res.opt);
	      menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	      contractActions.listClosediscount.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExportClosediscount: function onExportClosediscount(param) {
	    ajaxActions.request('/api/installment/contract/exportClosediscount', param, this.doneExportClosediscount);
	  },

	  doneExportClosediscount: function doneExportClosediscount(res) {
	    if (res.status === true) {
	      contractActions.exportClosediscount.done(res.file);
	    } else {
	      contractActions.exportClosediscount.error(res.error);
	    }
	  },

	  onSaveClosediscount: function onSaveClosediscount(id) {
	    console.log('request');
	    ajaxActions.request('/api/installment/contract/saveClosediscount', { id: id }, this.doneSaveClosediscount);
	  },

	  doneSaveClosediscount: function doneSaveClosediscount(res) {
	    if (res.status === true) {
	      contractActions.saveClosediscount.done(res);
	    } else {
	      contractActions.saveClosediscount.error(res.error);
	    }
	  },

	  onCloseCaStaffList: function onCloseCaStaffList(id) {
	    ajaxActions.request('/api/installment/contract/closeCaStaffList', { id: id }, this.doneCloseCaStaffList);
	  },

	  doneCloseCaStaffList: function doneCloseCaStaffList(res) {
	    if (res.status === true) {
	      contractActions.closeCaStaffList.done(res.data);
	    } else {
	      contractActions.closeCaStaffList.error(res.error);
	    }
	  },

	  onSaveCloseCa: function onSaveCloseCa(param) {
	    ajaxActions.request('/api/installment/contract/saveCloseCa', param, this.doneSaveCloseCa);
	  },

	  doneSaveCloseCa: function doneSaveCloseCa(res) {
	    if (res.status === true) {
	      contractActions.saveCloseCa.done(res);
	    } else {
	      contractActions.saveCloseCa.error(res.error);
	    }
	  },

	  onGetContractID: function onGetContractID(contract_code) {
	    //console.log('onPaymentOptionList');
	    ajaxActions.request('/api/installment/contract/getContractID', { code: contract_code }, this.doneGetContractID);
	  },

	  doneGetContractID: function doneGetContractID(res) {
	    if (res.status === true) {
	      contractActions.getContractID.done(res.data);
	    } else {
	      contractActions.getContractID.error(res.error);
	    }
	  },

	  onGetPersonCard: function onGetPersonCard(nationid) {
	    ajaxActions.request('/api/installment/contract/getPersonCard', { nationid: nationid }, this.doneGetPersonCard);
	  },

	  doneGetPersonCard: function doneGetPersonCard(res) {
	    if (res.status === true) {
	      contractActions.getPersonCard.done(res.data.person_card);
	    } else {
	      contractActions.getPersonCard.error(res.error);
	    }
	  },

	  onSaveRecontract: function onSaveRecontract(data) {
	    ajaxActions.request('/api/installment/contract/saveRecontract', data, this.doneSaveRecontract);
	  },

	  doneSaveRecontract: function doneSaveRecontract(res) {
	    if (res.status === true) {
	      contractActions.saveRecontract.done(res.data);
	    } else {
	      contractActions.saveRecontract.error(res.error);
	    }
	  },

	  onListRecontract: function onListRecontract(param) {
	    ajaxActions.request('/api/installment/contract/listRecontract', param, this.doneListRecontract);
	  },

	  doneListRecontract: function doneListRecontract(res) {
	    if (res.status === true) {
	      contractActions.listRecontract.done(res.data, res.opt);
	      menuActions.updateCount('contract.sell', res.opt.totalRows);
	    } else {
	      contractActions.listRecontract.error(res.error);
	    }
	  },

	  onExportRecontract: function onExportRecontract(param) {
	    ajaxActions.request('/api/installment/contract/exportRecontract', param, this.doneExportRecontract);
	  },

	  doneExportRecontract: function doneExportRecontract(res) {
	    if (res.status === true) {
	      contractActions.exportRecontract.done(res.file);
	    } else {
	      contractActions.exportRecontract.error(res.error);
	    }
	  }

	});

	module.exports = contractStore;

/***/ },

/***/ 832:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 833:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  installment: {
	    contract: {
	      current_status: {
	        NORMAL: 'ปกติ',
	        DEBT: 'ค้างชำระ',
	        CLOSE_CANCEL: 'ปิด/ยกเลิก',
	        CLOSE_NORMAL: 'ปิด/ปกติ',
	        CLOSE_RETURN: 'ปิด/คืนของ',
	        CLOSE_CONFISCATE: 'ปิด/ยึดคืน',
	        CLOSE_BAD_DEBT: 'ปิด/หนี้สูญ'
	      }
	    }
	  },
	  info: {
	    sell_date: 'วันที่ขาย',
	    receipt_no: 'ใบเสร็จ',
	    shop_name: 'สาขา',
	    contract_ref: 'เลขที่สัญญา',
	    company_name: 'ลูกค้า',
	    description: 'สินค้า',
	    serial: 'S/N',
	    price: 'ราคาขาย',
	    cost: 'ราคาทุน',
	    down_payment: 'ดาวน์',
	    remain_price: 'ยอดจัด',
	    finance_staff: 'พนักงานไฟแนนซ์',
	    sell_staff: 'พนักงานขาย',
	    flag: '*',
	    flag_hint: 'สดพิเศษ'
	  },
	  sell: {
	    sell_date: 'วันที่',
	    receipt_no: 'ใบเสร็จ',
	    description: 'ข้อมูลสินค้า',
	    serial: 'ซีเรียล',
	    sales_staff: 'พนักงานขาย',
	    finance_staff: 'พนักงานสินเชื่อ',
	    price: 'ราคาสินค้าทั้งหมด',
	    cost: 'ทุน',
	    main_price: 'ราคาสินค้าที่ผ่อน',
	    down_payment: 'ดาวน์',
	    fee: 'ค่าทำสัญญา',
	    install_cost: 'ค่าติดตั้ง',
	    remain_price: 'ยอดจัด'
	  },
	  contract: {
	    contract: 'สัญญา',
	    filter_shop: 'สาขา',
	    filter_current_status: 'สถานะ',
	    filter_selltype: 'สถานะขาย',
	    code: 'เลขที่',
	    sign_date: 'วันที่ทำ',
	    shop_code: 'รหัสสาขา',
	    shop_name: 'สาขา',
	    contract_status: 'สถานะ',
	    doc_send_to: 'จัดส่งเอกสารที่',
	    doc_send_to_HOME: 'บ้าน',
	    doc_send_to_WORK: 'ที่ทำงาน',
	    customer: 'ผู้เช่าซื้อ',
	    cus_mobile: 'เบอร์โทร',
	    co: 'ผู้เช่าซื้อร่วม',
	    coaddress_status: 'ที่อยู่',
	    cowork_status: 'การงาน',
	    product: 'สินค้า',
	    serial: 'S/N',
	    product_detail: 'รายละเอียดสินค้า',
	    address_status: 'ที่อยู่',
	    work_status: 'การงาน',
	    product_status: 'ข้อมูลสินค้า',
	    payment_status: 'งวดการชำระ',
	    payment_month: 'จำนวนงวด',
	    payment_on_day: 'ชำระทุกวันที่',
	    payment_price: 'ยอดจัด',
	    fee: 'ค่าทำสัญญา',
	    payment_per_month: 'ชำระเดือนละ',
	    total_paid: 'ชำระแล้ว',
	    payment_balance: 'คงเหลือ',
	    nationid: 'บัตรประชาชน',
	    pname: 'คำนำหน้า',
	    name: 'ชื่อ',
	    lname: 'นามสกุล',
	    nation_id: 'บัตรประชาชน',
	    birth: 'วันเกิด',
	    age: 'อายุ',
	    gender: 'เพศ',
	    marital_status: 'สถานภาพ',
	    over_day: 'เกินกำหนด',
	    finance: 'ไฟแนนซ์',
	    last_paid: 'ชำระล่าสุด',
	    amount_term: 'งวดค้าง',
	    return_date: 'วันที่ยึด',
	    discount: 'ส่วนลด',
	    address: {
	      copy_from: 'คัดลอกจาก',
	      card_address: 'ที่อยู่ตามบัตรประชาชน',
	      home_address: 'ที่อยู่ปัจจุบัน',
	      work_address: 'ที่อยู่ที่ทำงาน',
	      addr1: 'เลขที่/อาคาร/หมู่บ้าน',
	      addr2: 'ซอย/ถนน',
	      tambon: 'แขวง/ตำบล',
	      amphur: 'เขต/อำเภอ',
	      province: 'จังหวัด',
	      zipcode: 'รหัสไปรษณีย์',
	      tel: 'เบอร์อื่น ๆ',
	      fax: 'โทรสาร',
	      year: 'ปีที่อาศัย'
	    },
	    addr_type: 'สถานภาพที่อยู่',
	    addr_with: 'อาศัยอยู่กับ',
	    addr_person: 'จำนวนผู้อาศัยด้วย',
	    addr_month: 'เดือนที่อาศัย',
	    tel: 'โทรศัพท์',
	    mobile: 'มือถือ',
	    email: 'อีเมล',
	    co_relation: 'ความสัมพันธ์',
	    work_company: 'บริษัท/ห้างร้าน',
	    work_addr1: 'เลขที่/หมู่ที่/อาคาร/ชั้น',
	    work_addr2: 'ซอย/ถนน',
	    work_type: 'ประเภทธุรกิจ',
	    work_type_other: 'อื่น ๆ',
	    work_detail: 'ลักษณะงาน',
	    work_department: 'แผนก',
	    work_position: 'ตำแหน่ง',
	    work_time: 'เวลาที่สะดวก',
	    work_year: 'อายุงาน(ปี)',
	    work_salary: 'ฐานเงินเดือน',
	    work_income: 'รายได้อื่น ๆ',
	    work_income_source: 'แหล่งที่มารายได้อื่น ๆ',
	    work_prev_company: 'สถานที่ทำงานเดิม',
	    work_prev_addr: 'ที่ตั้ง',
	    work_prev_department: 'แผนก',
	    work_prev_tel: 'โทรศัพท์',
	    confirm_return_title: 'ยกเลิกและคืนเลขที่สัญญา',
	    title: {
	      index: 'สัญญาเช่าซื้อ'
	    },
	    action: {
	      new: 'เพิ่มสาขาใหม่'
	    },
	    person_info: 'ข้อมูลส่วนตัว',
	    work_info: 'สภานภาพการงาน',
	    card_info: 'บัตรประชาชน',
	    gen_payment: 'สร้างงวดชำระ',
	    payment: {
	      date: 'วันที่ชำระ',
	      amount: 'ยอดชำระ'
	    },
	    status: {
	      WAIT: 'รอจ่าย',
	      WAIT_PARTIAL: 'ชำระบางส่วน',
	      WAIT_PAID: 'ชำระแล้ว',
	      OVERDUE: 'เกินกำหนด',
	      OVERDUE_PARTIAL: 'เกิน, ชำระบางส่วน',
	      OVERDUE_PAID: 'เกิน, ชำระแล้ว'
	    },
	    current_status: {
	      ALL: 'ทุกสถานะ',
	      NORMAL: 'ปกติ',
	      DEBT: 'ค้างชำระ',
	      CLOSE_NORMAL: 'ปิดสัญญา ปกติ',
	      CLOSE_CANCEL: 'ปิดสัญญา ยกเลิก',
	      CLOSE_RETURN: 'ปิดสัญญา คืนของ',
	      CLOSE_CONFISCATE: 'ปิดสัญญา ยึดของคืน',
	      CLOSE_BAD_DEBT: 'ปิดสัญญา ตัดหนี้สูญ'
	    },

	    view: {
	      summary: 'ภาพรวม',
	      customer: 'ข้อมูลลูกค้า',
	      payment: 'งวดชำระ',
	      call: 'การติดตาม'
	    },
	    term: {
	      num: 'งวด',
	      due_date: 'กำหนดชำระ',
	      due_amount: 'ยอดชำระ',
	      paid_date: 'วันที่ชำระ',
	      paid_amount: 'ชำระแล้ว',
	      term_status: 'สถานะการชำระ',
	      ref_code: 'เลขที่ใบเสร็จอ้างอิง',
	      term_status_WAIT: 'รอชำระ',
	      term_status_WAIT_PARTIAL: 'ชำระบางส่วน',
	      term_status_WAIT_PAID: 'ชำระแล้ว',
	      term_status_OVERDUE: 'เกินกำหนด',
	      term_status_OVERDUE_PARTIAL: 'ชำระบางส่วน เกินกำหนด',
	      term_status_OVERDUE_PAID: 'ชำระแล้ว เกินกำหนด'
	    },
	    filter_type: 'ประเภทการคืน',
	    footer: {
	      special: '| * หมายถึง สดพิเศษ'
	    }
	  },
	  close_return: {
	    newcost: 'ราคาทุนใหม่',
	    oldcost: 'ราคาทุนเดิม',
	    paid: 'ชำระแล้ว',
	    balance: 'คงเหลือ',
	    contract_free: 'ค่าทำสัญญา',
	    install_free: 'ค่าติดตั้ง',
	    profit_loss: 'กำไรขาดทุน',
	    sell_id: 'เลขที่ขาย',
	    sign_date: 'วันที่ขาย',
	    product_serial: 'Serial No',
	    product_detial: 'สินค้า',
	    product_condition: 'สภาพสินค้า',
	    remark: 'หมายเหตุ',
	    return_date: 'วันที่ยึดสินค้า',
	    return_detail: {
	      num: 'ลำดับ',
	      product: 'สินค้า',
	      serial: 'Serial No',
	      newcost: 'ทุนใหม่',
	      oldcost: 'ทุนเดิม'
	    }
	  },
	  collection: {
	    call_date: 'วันที่โทรตาม',
	    call_number: 'เบอร์โทร',
	    call_remark: 'ข้อความ',
	    due_date: 'วันนัดชำระ',
	    call_type: 'ประเภทการโทร',
	    save: 'บันทึกตามหนี้',
	    print: 'พิมพ์เอกสาร',
	    print_file: 'เอกสาร',
	    send_print: 'ส่งถึง',
	    statusca: 'สถานะ',
	    saveca: 'บันทึกแจ้งหนีหนี้ CA',
	    call_name: 'ชื่อผู้ซื้อ/ชื่อผู้ค้ำ',
	    collection_list: {
	      num: 'ลำดับ',
	      call_date: 'วันที่โทรตาม',
	      due_date: 'วันนัดชำระ',
	      call_number: 'เบอร์โทร',
	      call_type: 'ประเภทการโทร',
	      call_remark: 'ข้อความ',
	      staff_name: 'พนักงาน'
	    }
	  },
	  closeca: {
	    contract_code: 'เลขที่สัญญา',
	    paid: 'ชำระแล้ว',
	    cost: 'ราคาทุน',
	    fee: 'ค่าทำสัญญา',
	    install_cost: 'ค่าติดตั้ง',
	    total_paid: 'ชำระแล้ว',
	    profit_lost: 'กำไรขาดทุน',
	    sell_id: 'เลขที่ขาย',
	    sign_date: 'วันที่ขาย',
	    closeca_effective: 'หัก/จ่าย เดือน',
	    closeca_date: 'วันที่ปิด CA',
	    product_serial: 'Serial No',
	    product_detail: 'สินค้า',
	    closeca_remark: 'หมายเหตุ',
	    nationid: 'เลขที่บัตรประชาชน',
	    cus_name: 'ชือลูกค้า',
	    over_day: 'จำนวนวันเกิน',
	    last_paid: 'วันที่จ่ายล่าสุด',
	    closeca_staffname: 'พนักงานผู้รับผิดชอบ',
	    closeca_staff_percent: 'หักพนักงาน(%)',
	    closeca_staff_amount: 'หักพนักงานเป็นเงิน',
	    closeca_percent: 'บริษัทรับผิดชอบ(%)',
	    closeca_amount: 'บริษัทรับผิดชอบเป็นเงิน',
	    saveca: 'ปิดสัญญาหนีหนี้CA'
	  }
	};

/***/ }

});