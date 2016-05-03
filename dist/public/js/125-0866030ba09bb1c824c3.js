webpackJsonp([125,135],{

/***/ 1021:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var actions = __webpack_require__(1022);
	var store = __webpack_require__(1023);

	var Approve = {};

	tr.registerTranslations('en', __webpack_require__(1024));
	tr.registerTranslations('th', __webpack_require__(1025));

	Approve.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('approve.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// Approve.Routes = (
	//   <Route name="manager.approve" path="cd" handler={Approve.Index}>
	//     <Router.DefaultRoute name="manager.approve.list" handler={require('./approve-list.jsx')}/>
	//     <Route name="manager.approve.screen" path="screen/:id?" handler={require('./approve-screen.jsx')}/>
	//   </Route>
	// );

	module.exports = Approve;

/***/ },

/***/ 1022:
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
	  'save': { children: ['done', 'error'] }
	});

/***/ },

/***/ 1023:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var approveActions = __webpack_require__(1022);

	var approveStore = Reflux.createStore({
	  listenables: [approveActions],

	  onList: function onList(param) {
	    ajaxActions.request('/api/manager/approve/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {

	    if (res.status === true) {
	      approveActions.list.done(res.data, res.opt);
	      menuActions.updateCount('approve', res.opt.totalRows);
	    } else {
	      approveActions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/manager/approve/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      approveActions.export.done(res.file);
	    } else {
	      approveActions.export.error(res.error);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/manager/approve/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      approveActions.getById.done({
	        cashDaily: res.cashDaily,
	        paymentTerm: res.paymentTerm,
	        refContract: res.refContract
	      });
	    } else {
	      approveActions.getById.error(res.msg);
	    }
	  },

	  onDdlList: function onDdlList() {
	    ajaxActions.request('/api/manager/approve/ddlList', {}, this.doneDdlList);
	  },

	  doneDdlList: function doneDdlList(res) {
	    if (res.status === true) {
	      approveActions.ddlList.done(res.data);
	    } else {
	      approveActions.ddlList.error(res.error);
	    }
	  },

	  onGetDataMain: function onGetDataMain(id) {
	    console.log('id:', id);
	    ajaxActions.request('/api/manager/approve/getDataMain', { id: id, shop_id: system.sessionStore.getSession().shop.id }, this.doneGetDataMain);
	  },

	  doneGetDataMain: function doneGetDataMain(res) {
	    if (res.status === true) {
	      approveActions.getDataMain.done(res.data);
	    } else {
	      approveActions.getDataMain.error(res.error);
	    }
	  },

	  onGetBank: function onGetBank() {
	    ajaxActions.request('/api/manager/approve/getBank', {}, this.doneGetBank);
	  },

	  doneGetBank: function doneGetBank(res) {
	    if (res.status === true) {
	      approveActions.getBank.done(res.data);
	    } else {
	      approveActions.getBank.error(res.error);
	    }
	  },

	  onGetDataTable: function onGetDataTable(date) {
	    ajaxActions.request('/api/manager/approve/getDataTable', { date: date }, this.doneGetDataTable);
	  },

	  doneGetDataTable: function doneGetDataTable(res) {
	    if (res.status === true) {
	      approveActions.getDataTable.done(res.data);
	    } else {
	      approveActions.getDataTable.error(res.error);
	    }
	  },

	  onGetDataDetail: function onGetDataDetail(id) {
	    ajaxActions.request('/api/manager/approve/getDataDetail', { id: id }, this.doneGetDataDetail);
	  },

	  doneGetDataDetail: function doneGetDataDetail(res) {
	    if (res.status === true) {
	      approveActions.getDataDetail.done(res.data);
	    } else {
	      approveActions.getDataDetail.error(res.error);
	    }
	  },
	  onSave: function onSave(param) {
	    ajaxActions.request('/api/manager/approve/save', param, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      approveActions.save.done(res.data);
	    } else {
	      approveActions.save.error(res.error);
	    }
	  }
	});

	module.exports = approveStore;

/***/ },

/***/ 1024:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 1025:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  approve: {
	    created_by: 'วันที่นำส่ง',
	    shop_code: 'สาขา',
	    shop_tel: 'เบอร์โทร',
	    approve_date: 'วันที่ตรวจ',
	    cnNoClose: 'ค้างตรวจ',
	    cnClose: 'ตรวจเรียบร้อยแล้ว',
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
	      index: 'ตรวจสอบเงินหน้าร้าน',
	      list: ' '
	    },
	    stat: {
	      cd_created_at: 'วันที่สร้าง',
	      cd_updated_at: 'วันที่แก้ไข',
	      cd_close_date: 'วันที่ปิดยอด',
	      cd_approve_date: 'วันที่อนุมัติ'
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
	  confirm: 'ยืนยัน'
	};

/***/ }

});