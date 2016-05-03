webpackJsonp([62,135],{

/***/ 744:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions;

	var cashDailyActions = __webpack_require__(745);
	var cashDailyStore = __webpack_require__(746);

	var CashDaily = {};

	tr.registerTranslations('en', __webpack_require__(747));
	tr.registerTranslations('th', __webpack_require__(748));

	CashDaily.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('cashDaily.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// CashDaily.List = require('./cashDaily-list.jsx');
	// CashDaily.Edit = require('./cashDaily-edit.jsx');
	// CashDaily.insertOld = require('./cashDaily-insertOld.jsx');

	// CashDaily.Routes = (
	//   <Route name="pos.cashDaily" path="cashDaily" handler={CashDaily.Index}>
	//     <Route name="pos.cashDaily.list" path="list" handler={CashDaily.List}/>
	//     <Route name="pos.cashDaily.edit" path="edit/:id/:sendStatus" handler={CashDaily.Edit}/>
	//     <Route name="pos.cashDaily.insertOld" path="insertOld" handler={CashDaily.insertOld}/>
	//   </Route>
	// );

	module.exports = CashDaily;

/***/ },

/***/ 745:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'ddlList': { children: ['done', 'error'] },
	  'getBank': { children: ['done', 'error'] },
	  'getDataTable': { children: ['done', 'error'] },
	  'getDataMain': { children: ['done', 'error'] },
	  'getDataDetail': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'insertOld': { children: ['done', 'error'] }
	  // 'getData':{children:['done','error']}
	});

/***/ },

/***/ 746:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var cashDailyActions = __webpack_require__(745);

	var cashDailyStore = Reflux.createStore({
	  listenables: [cashDailyActions],

	  // contractActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/cashDaily/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {

	    if (res.status === true) {
	      cashDailyActions.list.done(res.data, res.opt);
	      menuActions.updateCount('cashDaily', res.opt.totalRows);
	    } else {
	      cashDailyActions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/cashDaily/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      cashDailyActions.export.done(res.file);
	    } else {
	      cashDailyActions.export.error(res.error);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/cashDaily/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      cashDailyActions.getById.done({
	        cashDaily: res.cashDaily,
	        paymentTerm: res.paymentTerm,
	        refContract: res.refContract
	      });
	    } else {
	      cashDailyActions.getById.error(res.msg);
	    }
	  },

	  onDdlList: function onDdlList() {
	    ajaxActions.request('/api/cashDaily/ddlList', {}, this.doneDdlList);
	  },

	  doneDdlList: function doneDdlList(res) {
	    if (res.status === true) {
	      cashDailyActions.ddlList.done(res.data);
	    } else {
	      cashDailyActions.ddlList.error(res.error);
	    }
	  },

	  onGetDataMain: function onGetDataMain(id, status) {
	    console.log('id:', id);
	    ajaxActions.request('/api/cashDaily/getDataMain', { id: id, shop_id: system.sessionStore.getSession().shop.id, status: status }, this.doneGetDataMain);
	  },

	  doneGetDataMain: function doneGetDataMain(res) {
	    if (res.status === true) {
	      cashDailyActions.getDataMain.done(res.data);
	    } else {
	      cashDailyActions.getDataMain.error(res.error);
	    }
	  },

	  onGetBank: function onGetBank() {
	    ajaxActions.request('/api/cashDaily/getBank', {}, this.doneGetBank);
	  },

	  doneGetBank: function doneGetBank(res) {
	    if (res.status === true) {
	      cashDailyActions.getBank.done(res.data);
	    } else {
	      cashDailyActions.getBank.error(res.error);
	    }
	  },

	  onGetDataTable: function onGetDataTable(date) {
	    ajaxActions.request('/api/cashDaily/getDataTable', { date: date }, this.doneGetDataTable);
	  },

	  doneGetDataTable: function doneGetDataTable(res) {
	    if (res.status === true) {
	      cashDailyActions.getDataTable.done(res.data);
	    } else {
	      cashDailyActions.getDataTable.error(res.error);
	    }
	  },

	  onGetDataDetail: function onGetDataDetail(id) {
	    ajaxActions.request('/api/cashDaily/getDataDetail', { id: id }, this.doneGetDataDetail);
	  },

	  doneGetDataDetail: function doneGetDataDetail(res) {
	    if (res.status === true) {
	      cashDailyActions.getDataDetail.done(res.data);
	    } else {
	      cashDailyActions.getDataDetail.error(res.error);
	    }
	  },

	  onSave: function onSave(param) {
	    ajaxActions.request('/api/cashDaily/save', param, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    console.log('res:', res);
	    if (res.status === true) {
	      cashDailyActions.save.done(res.id, res.status, 'ปิดกะ');
	    } else {
	      cashDailyActions.save.error(res.error, 'รอปิดกะ');
	    }
	  },

	  onInsertOld: function onInsertOld(param) {
	    ajaxActions.request('/api/cashDaily/insertOld', param, this.doneInsertOld);
	  },

	  doneInsertOld: function doneInsertOld(res) {
	    if (res.status === true) {
	      cashDailyActions.insertOld.done(res.data);
	    } else {
	      cashDailyActions.insertOld.error(res.error);
	    }
	  }

	});

	module.exports = cashDailyStore;

/***/ },

/***/ 747:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  staff: {
	    user: 'Username',
	    pass: 'Password',
	    display_name: 'Display Name',
	    last_login: 'Last Login',
	    last_ip: 'Last IP'
	  },
	  status: {
	    status1: 'รอปิดกะ',
	    status2: 'ปิดกะ',
	    status3: 'รอตรวจสอบ',
	    status4: 'เปิดให้แก้ไข',
	    status5: 'ปิดยอด',
	    status6: 'อนุมัติ'
	  }
	};

/***/ },

/***/ 748:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  cashDaily: {
	    created_by: 'วันที่นำส่ง',
	    shop_code: 'สาขา',
	    shop_tel: 'เบอร์โทร',
	    approve_date: 'วันที่ตรวจ',
	    remark: 'หมายเหตุ',
	    status: 'สถานะ',
	    cash_on_report: 'ยอดนำส่ง',
	    c_on_report: 'เงินสดที่ต้องได้รับ',
	    pastday_pending_transfer: 'ค้างโอนจากวันอื่น',
	    cash_transfer: 'ร้านโอนเงิน',
	    bank: 'ธนาคาร',
	    doc_ref: 'เลขที่อ้างอิง',
	    today_pending_transfer: 'ค้างโอนวันนี้',
	    receive_pending_transfer: 'ร้านคืนค้างโอน',
	    total_pending_transfer: 'รวมค้างโอน',
	    title: {
	      index: 'ปิดกะนำส่งเงิน',
	      list: 'รายการรอปิดกะ'
	    },
	    stat: {
	      cd_created_at: 'สร้าง',
	      cd_updated_at: 'แก้ไข',
	      cd_close_date: 'ปิดยอด',
	      cd_approve_date: 'อนุมัติ',
	      cd_history: 'วันที่ค้างโอน',
	      cd_amount: 'ยอดเงิน'
	    },
	    table: {
	      type: 'ประเภท',
	      old: 'ยกมา',
	      sell: 'ขาย',
	      return: 'คืน',
	      finance: 'รับค่างวด',
	      income: 'รับ',
	      expense: 'จ่าย',
	      cash_transfer: 'ยอดนำส่ง'
	    }
	  },
	  status: {
	    status1: 'รอปิดกะ',
	    status2: 'ปิดกะ',
	    status3: 'รอตรวจสอบ',
	    status4: 'เปิดให้แก้ไข',
	    status5: 'ปิดยอด',
	    status6: 'อนุมัติ'
	  },
	  dialog: {
	    confirm: 'ยืนยัน'
	  }
	};

/***/ }

});