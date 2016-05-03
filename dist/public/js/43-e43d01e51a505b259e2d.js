webpackJsonp([43,135],{

/***/ 718:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var actions = __webpack_require__(719);
	var store = __webpack_require__(720);

	var CashDaily = {};

	tr.registerTranslations('en', __webpack_require__(721));
	tr.registerTranslations('th', __webpack_require__(722));

	CashDaily.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('cd.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// CashDaily.Routes = (
	//   <Route name="finance.cd" path="cd" handler={CashDaily.Index}>
	//     <Router.DefaultRoute name="finance.cd.list" handler={require('./cd-list.jsx')}/>
	//     <Route name="finance.cd.screen" path="screen/:id?" handler={require('./cd-screen.jsx')}/>
	//   </Route>
	// );

	module.exports = CashDaily;

/***/ },

/***/ 719:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'ddlList': { children: ['done', 'error'] },
	  'getBank': { children: ['done', 'error'] },
	  'getDataTable': { children: ['done', 'error'] },
	  'getDataMain': { children: ['done', 'error'] },
	  'getDataDetail': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'getBranch': { children: ['done', 'error'] },
	  'pdfExport': { children: ['done', 'error'] },
	  'exportProfitLoss': { children: ['done', 'error'] }
	});

/***/ },

/***/ 720:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var cdActions = __webpack_require__(719);
	var toasterActions = system.toasterActions;
	var cashDailyStore = Reflux.createStore({
	  listenables: [cdActions],

	  onList: function onList(param) {
	    ajaxActions.request('/api/finance/cd/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {

	    if (res.status === true) {
	      cdActions.list.done(res.data, res.opt);
	      menuActions.updateCount('cd', res.opt.totalRows);
	    } else {
	      cdActions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/finance/cd/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      cdActions.export.done(res.file);
	    } else {
	      cdActions.export.error(res.error);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/finance/cd/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      cdActions.getById.done({
	        cashDaily: res.cashDaily,
	        paymentTerm: res.paymentTerm,
	        refContract: res.refContract
	      });
	    } else {
	      cdActions.getById.error(res.msg);
	    }
	  },

	  onDdlList: function onDdlList() {
	    ajaxActions.request('/api/finance/cd/ddlList', {}, this.doneDdlList);
	  },

	  doneDdlList: function doneDdlList(res) {
	    if (res.status === true) {
	      cdActions.ddlList.done(res.data);
	    } else {
	      cdActions.ddlList.error(res.error);
	    }
	  },

	  onGetDataMain: function onGetDataMain(id) {
	    console.log('id:', id);
	    ajaxActions.request('/api/finance/cd/getDataMain', { id: id, shop_id: system.sessionStore.getSession().shop.id }, this.doneGetDataMain);
	  },

	  doneGetDataMain: function doneGetDataMain(res) {
	    if (res.status === true) {
	      cdActions.getDataMain.done(res.data);
	    } else {
	      cdActions.getDataMain.error(res.error);
	    }
	  },

	  onGetBank: function onGetBank() {
	    ajaxActions.request('/api/finance/cd/getBank', {}, this.doneGetBank);
	  },

	  doneGetBank: function doneGetBank(res) {
	    if (res.status === true) {
	      cdActions.getBank.done(res.data);
	    } else {
	      cdActions.getBank.error(res.error);
	    }
	  },

	  onGetDataTable: function onGetDataTable(date) {
	    ajaxActions.request('/api/finance/cd/getDataTable', { date: date }, this.doneGetDataTable);
	  },

	  doneGetDataTable: function doneGetDataTable(res) {
	    if (res.status === true) {
	      cdActions.getDataTable.done(res.data);
	    } else {
	      cdActions.getDataTable.error(res.error);
	    }
	  },

	  onGetDataDetail: function onGetDataDetail(id) {
	    ajaxActions.request('/api/finance/cd/getDataDetail', { id: id }, this.doneGetDataDetail);
	  },

	  doneGetDataDetail: function doneGetDataDetail(res) {
	    if (res.status === true) {
	      cdActions.getDataDetail.done(res.data);
	    } else {
	      cdActions.getDataDetail.error(res.error);
	    }
	  },

	  onSave: function onSave(param) {
	    ajaxActions.request('/api/finance/cd/save', param, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      cdActions.save.done(res.data);
	    } else {
	      cdActions.save.error(res.error);
	    }
	  },

	  onGetBranch: function onGetBranch() {
	    ajaxActions.request('/api/finance/cd/getBranch', {}, this.doneGetBranch);
	  },
	  doneGetBranch: function doneGetBranch(res) {
	    if (res.status === true) {
	      cdActions.getBranch.done(res.data);
	    } else {
	      cdActions.getBranch.error(res.msg);
	    }
	  },

	  onPdfExport: function onPdfExport(name, param) {
	    param.report_name = name;
	    ajaxActions.request('/api/finance/cd/exportReport', { data: param }, this.donePdfExport);
	  },
	  donePdfExport: function donePdfExport(res) {

	    console.log('res:', res);
	    if (res.status === true) {
	      cdActions.pdfExport.done(res.data.exports);
	    } else {
	      toasterActions.pop({
	        type: 'success',
	        message: 'ไม่พบข้อมูลที่อยู่ในช่วงเวลาที่ระบุ'
	      });
	      cdActions.pdfExport.error(res.msg);
	    }
	  },
	  onExportProfitLoss: function onExportProfitLoss(name, param) {
	    param.report_name = name;
	    ajaxActions.request('/api/finance/cd/exportProfitLoss', { data: param }, this.doneExportProfitLoss);
	  },
	  doneExportProfitLoss: function doneExportProfitLoss(res) {

	    console.log('res:', res);
	    if (res.status === true) {
	      cdActions.exportProfitLoss.done(res.data.exports);
	    } else {
	      toasterActions.pop({
	        type: 'success',
	        message: 'ไม่พบข้อมูลที่อยู่ในช่วงเวลาที่ระบุ'
	      });
	      cdActions.exportProfitLoss.error(res.msg);
	    }
	  }

	});

	module.exports = cashDailyStore;

/***/ },

/***/ 721:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 722:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  cd: {
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
	      index: 'ทำรายการรับเงินจากสาขา',
	      list: 'รายการนำส่งเงินรอตรวจสอบ'
	    },
	    stat: {
	      cd_created_at: 'สร้าง',
	      cd_updated_at: 'แก้ไข',
	      cd_close_date: 'ปิดยอด',
	      cd_approve_date: 'อนุมัติ'
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
	  reports: {
	    title: {
	      index: 'รายงาน'
	    },
	    param: {
	      date: 'วันที่'
	    },
	    header: {
	      summary: 'รายงาน',
	      parameter: 'ตัวกรองข้อมูล',
	      preview: 'ตัวอย่าง'
	    },
	    summaryIncomeShop: 'สรุปการรับเงินหน้าร้าน',
	    profit_loss: 'รายงานกำไร-ขาดทุน'
	  }
	};

/***/ }

});