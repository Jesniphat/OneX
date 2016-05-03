webpackJsonp([45,135],{

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

/***/ },

/***/ 724:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);

	var system = __webpack_require__(356);
	var widget = __webpack_require__(379);
	var sessionStore = system.sessionStore;
	var toasterActions = system.toasterActions;
	var infoPanelActions = system.infoPanelActions;
	var dialogActions = system.dialogActions;
	var helper = system.helper;
	var systemStore = system.systemStore;

	var actions = __webpack_require__(719);

	var FlexDropdown = widget.FlexDropdown;
	var FlexTextInput = widget.FlexTextInput;
	var FlexButton = widget.FlexButton;
	var FlexDataTable = widget.FlexDataTable;
	var FlexCheckbox = widget.FlexCheckbox;
	var FlexDisplayTable = widget.FlexDisplayTable;

	var Screen = React.createClass({
	  displayName: 'Screen',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(actions.getBank.done, 'onGetBankDoneAction'), Reflux.listenTo(actions.getDataDetail.done, 'onGetDataDetailDoneAction'), Reflux.listenTo(actions.getDataMain.done, 'onGetDataMainDoneAction'), Reflux.listenTo(actions.save.done, 'onSaveDoneAction')],

	  getInitialState: function getInitialState() {

	    var id = parseInt(this.context.router.getCurrentParams().id);
	    var flagClose = this.context.router.getCurrentParams().close;
	    var flagDunning = this.context.router.getCurrentParams().dunning;
	    var pageBack = this.context.router.getCurrentParams().pageback;
	    if (!pageBack) {
	      pageBack = 'finance.cd.list';
	    }

	    var default_today = new Date();
	    default_today.setMonth(default_today.getMonth() + 0);
	    var _valueToday = default_today.toJSON().slice(5, 7) + '/' + default_today.toJSON().slice(0, 4);
	    //console.log(_valueToday);
	    return {
	      id: id,
	      flagClose: flagClose,
	      flagDunning: flagDunning,
	      pageBack: pageBack,
	      genPaymentTerm: false,
	      selectedItem: 1,
	      selectedStatus: 'รอตรวจสอบ',
	      data: {
	        cash_daily_on_date_id: '',
	        cash_daily_id: '',
	        bank: '',
	        bank_ref: '',
	        on_date: '',
	        cash_on_report: 0,
	        cash_transfer: 0,
	        receive_pending_transfer: 0,
	        today_pending_transfer: 0,
	        pastday_pending_transfer: 0,
	        total_pending_transfer: 0,
	        remark: '',
	        doc_ref: '',
	        status: 'รอตรวจสอบ',
	        head_on_date: '',
	        shop_id: ''
	      },
	      datatable: [],
	      statdata: {
	        status: '',
	        created_at: '',
	        updated_at: '',
	        cd_balance_date: '',
	        approve_date: ''
	      },
	      bank: {
	        id: 'bank',
	        label: 'cashDaily.bank',
	        type: 'dropdown',
	        list: [],
	        readonly: true
	      },
	      searchDate: '',
	      status: {
	        id: 'status',
	        list: [{ value: 'รอตรวจสอบ', text: 'รอตรวจสอบ' }, { value: 'เปิดให้แก้ไข', text: 'เปิดให้แก้ไข' }, { value: 'ปิดยอด', text: 'ปิดยอด' }]
	      }
	    };
	  },

	  componentDidMount: function componentDidMount() {

	    infoPanelActions.show('finance.cd.list', React.createElement('div', { className: 'box10 flex-form' }));

	    actions.getBank();
	    actions.getDataMain(this.state.id);
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  onGetBankDoneAction: function onGetBankDoneAction(data) {
	    this.state.bank.list = data.bank.map(function (row) {
	      return {
	        value: row.value,
	        text: row.text
	      };
	    });

	    this.state.data.bank = this.state.bank.list[this.state.selectedItem - 1].value;
	    this.state.data.bank_ref = this.state.bank.list[this.state.selectedItem - 1].text;
	    this.setState({
	      bank: this.state.bank
	    });
	  },

	  onGetDataMainDoneAction: function onGetDataMainDoneAction(data) {
	    this.state.data.on_date = data.Main[0].on_date;
	    this.state.data.head_on_date = 'ประจำวันที่ ' + tr.localize(new Date(data.Main[0].on_date), { type: 'date', format: 'short' }) + ' - ' + data.Main[0].sh_name;
	    this.state.statdata.created_at = tr.localize(new Date(data.Main[0].created_at), { type: 'datetime', format: 'short' });
	    this.state.statdata.updated_at = tr.localize(new Date(data.Main[0].updated_at), { type: 'datetime', format: 'short' });

	    if (data.Main[0].approve_date == '-') {
	      this.state.statdata.approve_date = data.Main[0].approve_date;
	    } else {
	      this.state.statdata.approve_date = tr.localize(new Date(data.Main[0].approve_date), { type: 'datetime', format: 'short' });
	    }

	    if (data.Main[0].cd_balance_date == '-') {
	      this.state.statdata.cd_balance_date = data.Main[0].cd_balance_date;
	    } else {
	      this.state.statdata.cd_balance_date = tr.localize(new Date(data.Main[0].cd_balance_date), { type: 'datetime', format: 'short' });
	    }

	    this.state.statdata.status = data.Main[0].status;
	    this.state.searchDate = data.Main[0].created_at;
	    this.state.data.cash_daily_id = data.Main[0].cash_daily_id;
	    this.state.data.cash_daily_on_date_id = data.Main[0].cash_daily_on_date_id;
	    //Form Price
	    this.state.data.cash_on_report = data.Main[0].cash_on_report;
	    this.state.data.cash_transfer = data.Main[0].cash_transfer;
	    this.state.data.receive_pending_transfer = data.Main[0].receive_pending_transfer;
	    this.state.data.today_pending_transfer = data.Main[0].today_pending_transfer;
	    this.state.data.pastday_pending_transfer = data.Main[0].pastday_pending_transfer;
	    this.state.data.total_pending_transfer = data.Main[0].total_pending_transfer;

	    this.state.data.doc_ref = data.Main[0].doc_ref;
	    this.state.data.remark = data.Main[0].remark;

	    this.state.selectedItem = data.Main[0].bank_id;
	    this.state.selectedStatus = data.Main[0].status;
	    this.state.data.shop_id = data.Main[0].shop_id;

	    this.setState({
	      data: this.state.data,
	      statdata: this.state.statdata,
	      searchDate: this.state.searchDate,
	      cash_daily_id: this.state.data.cash_daily_id,
	      selectedItem: this.state.selectedItem,
	      selectedStatus: this.state.selectedStatus
	    });

	    var color = 'yellow';

	    if (this.state.statdata.status == 'อนุมัติ' || this.state.statdata.status == 'ปิดยอด') {
	      color = '#b2e388';
	    } else {
	      color = 'yellow';
	    }

	    actions.getDataDetail(this.state.cash_daily_id);

	    // <dl className="dl" style={{overflowY:'auto'}}>
	    //   <dt><T content="cashDaily.stat.cd_created_at"/></dt>
	    //   <dd>{this.state.statdata.created_at}</dd>
	    //   <dt><T content="cashDaily.stat.cd_updated_at"/></dt>
	    //   <dd>{this.state.statdata.updated_at}</dd>
	    //   <dt><T content="cashDaily.stat.cd_close_date"/></dt>
	    //   <dd>{this.state.statdata.close_at}</dd>
	    //   <dt><T content="cashDaily.stat.cd_approve_date"/></dt>
	    //   <dd>{this.state.statdata.approve_date}</dd>
	    // </dl>
	    //
	    //
	    // var leftStat = data.Main.map(function(rows,i){
	    //     return (<div className="flex-v can-grow" style={{overflowY:'auto'}}>
	    //       <div style={{backgroundColor:color,textAlign:'center',height:'30px'}}>
	    //           <h2>{rows.status}</h2>
	    //       </div>
	    //       <div>
	    //           <table style={{width:'100%'}}>
	    //             <tr style={{height:'20px'}}>
	    //               <td style={{textAlign:'left'}}><T content="cashDaily.stat.cd_created_at"/>
	    //               </td>
	    //               <td style={{textAlign:'right'}}>{rows.created_at}
	    //               </td>
	    //             </tr>
	    //             <tr style={{height:'20px'}}>
	    //               <td style={{textAlign:'left'}}>
	    //                 <T content="cashDaily.stat.cd_updated_at"/>
	    //               </td>
	    //               <td style={{textAlign:'right'}}>
	    //                 {rows.updated_at}
	    //               </td>
	    //             </tr>
	    //           </table>
	    //       </div>
	    //       <div className="flex-form">
	    //         <FlexDropdown
	    //           field={this.state.status}
	    //           data={{status:this.state.selectedStatus}}
	    //           onChange={this.handleStatusChange}
	    //           />
	    //       </div>
	    //     </div>
	    //     );
	    // }.bind(this));
	    //
	    // console.log({leftStat})
	    //
	    // infoPanelActions.show('finance.cd.List',
	    //   <div className="flex-v can-grow" style={{overflowY:'auto'}}>
	    //     {leftStat}
	    //   </div>);
	    console.log('data:', data.HistoryClose);
	    var list = data.HistoryClose.map(function (row, i) {
	      var onDate = tr.localize(new Date(row.on_date), { type: 'date', format: 'short' });
	      var cashAmount = helper.numberFormat(row.cashAmount, 2);

	      return React.createElement(
	        'tr',
	        { style: { height: '20px' } },
	        React.createElement(
	          'td',
	          { style: { textAlign: 'left' } },
	          onDate
	        ),
	        React.createElement(
	          'td',
	          { style: { textAlign: 'right' } },
	          cashAmount
	        )
	      );
	    }.bind(this));

	    infoPanelActions.show('finance.cd.list', React.createElement(
	      'div',
	      { className: 'flex-v can-grow', style: { overflowY: 'auto' } },
	      React.createElement(
	        'div',
	        { style: { backgroundColor: color, textAlign: 'center', height: '30px' } },
	        React.createElement(
	          'h2',
	          null,
	          this.state.statdata.status
	        )
	      ),
	      React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'table',
	          { style: { width: '100%' } },
	          React.createElement(
	            'tr',
	            { style: { height: '20px' } },
	            React.createElement(
	              'td',
	              { style: { textAlign: 'left' } },
	              React.createElement(T, { content: 'cashDaily.stat.cd_created_at' })
	            ),
	            React.createElement(
	              'td',
	              { style: { textAlign: 'right' } },
	              this.state.statdata.created_at
	            )
	          ),
	          React.createElement(
	            'tr',
	            { style: { height: '20px' } },
	            React.createElement(
	              'td',
	              { style: { textAlign: 'left' } },
	              React.createElement(T, { content: 'cashDaily.stat.cd_updated_at' })
	            ),
	            React.createElement(
	              'td',
	              { style: { textAlign: 'right' } },
	              this.state.statdata.updated_at
	            )
	          ),
	          React.createElement(
	            'tr',
	            { style: { height: '20px' } },
	            React.createElement(
	              'td',
	              { style: { textAlign: 'left' } },
	              React.createElement(T, { content: 'cashDaily.stat.cd_close_date' })
	            ),
	            React.createElement(
	              'td',
	              { style: { textAlign: 'right' } },
	              this.state.statdata.cd_balance_date
	            )
	          ),
	          React.createElement(
	            'tr',
	            { style: { height: '20px' } },
	            React.createElement(
	              'td',
	              { style: { textAlign: 'left' } },
	              React.createElement(T, { content: 'cashDaily.stat.cd_approve_date' })
	            ),
	            React.createElement(
	              'td',
	              { style: { textAlign: 'right' } },
	              this.state.statdata.approve_date
	            )
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { style: { textAlign: 'center', height: '30px' } },
	        ' '
	      ),
	      React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'table',
	          { style: { width: '100%' } },
	          React.createElement(
	            'tr',
	            { style: { height: '20px' } },
	            React.createElement(
	              'td',
	              { style: { textAlign: 'left' } },
	              React.createElement(T, { content: 'cashDaily.stat.cd_history' })
	            ),
	            React.createElement(
	              'td',
	              { style: { textAlign: 'right' } },
	              React.createElement(T, { content: 'cashDaily.stat.cd_amount' })
	            )
	          ),
	          list
	        )
	      )
	    ));

	    // <div className="flex-form">
	    //   <FlexDropdown
	    //     field={this.state.status}
	    //     data={{status:this.state.selectedStatus}}
	    //     onChange={this.handleStatusChange}
	    //     />
	    // </div>
	    //
	  },

	  handleStatusChange: function handleStatusChange(id, value) {
	    this.state.data.status = value;
	    this.state.selectedStatus = value;

	    this.setState({
	      data: this.state.data,
	      selectedStatus: this.state.selectedStatus
	    });

	    //
	    // var color = 'yellow';
	    //
	    // if(this.state.statdata.status=='อนุมัติ' || this.state.statdata.status =='ปิดยอด'){
	    //   color ='#b2e388';
	    // }else{
	    //   color ='yellow';
	    // }

	    // infoPanelActions.show('finance.cd.list', (
	    //   <div className="flex-v can-grow" style={{overflowY:'auto'}}>
	    //     <div style={{backgroundColor:color,textAlign:'center',height:'30px'}}>
	    //         <h2>{this.state.statdata.status}</h2>
	    //     </div>
	    //     <div>
	    //         <table style={{width:'100%'}}>
	    //           <tr style={{height:'20px'}}>
	    //             <td style={{textAlign:'left'}}><T content="cashDaily.stat.cd_created_at"/>
	    //             </td>
	    //             <td style={{textAlign:'right'}}>{this.state.statdata.created_at}
	    //             </td>
	    //           </tr>
	    //           <tr style={{height:'20px'}}>
	    //             <td style={{textAlign:'left'}}>
	    //               <T content="cashDaily.stat.cd_updated_at"/>
	    //             </td>
	    //             <td style={{textAlign:'right'}}>
	    //               {this.state.statdata.updated_at}
	    //             </td>
	    //           </tr>
	    //         </table>
	    //     </div>
	    //     <div className="flex-form">
	    //       <FlexDropdown
	    //         field={this.state.status}
	    //         data={{status:this.state.selectedStatus}}
	    //         onChange={this.handleStatusChange}
	    //         />
	    //     </div>
	    //   </div>
	    // )).bind(this);
	  },

	  handleListChange: function handleListChange(id, value) {

	    this.state.data.bank = value;

	    this.state.data.bank_ref = this.state.bank.list[value - 1].text;
	    //
	    // this.state.bank.forEach(function(rows){
	    //   if(rows.value==value){
	    //     this.state.data.bank_ref = rows.text;
	    //   };
	    // });
	  },

	  onKeyUp: function onKeyUp(id, value) {
	    if (id == 'cash_transfer') {
	      this.state.data.cash_transfer = value;
	    } else {
	      this.state.data.pastday_pending_transfer = value;
	    }

	    var amount = parseFloat(this.state.data.cash_on_report || 0) - parseFloat(this.state.data.cash_transfer || 0);

	    if (amount > 0) {
	      this.state.data.today_pending_transfer = amount;
	      this.state.data.receive_pending_transfer = '0';
	    } else if (amount < 0) {
	      this.state.data.today_pending_transfer = '0';
	      this.state.data.receive_pending_transfer = parseFloat(amount || 0) * parseFloat(-1);
	    } else {
	      this.state.data.today_pending_transfer = '0';
	      this.state.data.receive_pending_transfer = '0';
	    }

	    this.state.data.total_pending_transfer = parseFloat(this.state.data.pastday_pending_transfer || 0) + parseFloat(this.state.data.today_pending_transfer || 0) - parseFloat(this.state.data.receive_pending_transfer || 0);
	    this.setState({
	      today_pending_transfer: this.state.data.today_pending_transfer,
	      receive_pending_transfer: this.state.data.receive_pending_transfer,
	      cash_transfer: this.state.data.cash_transfer,
	      pastday_pending_transfer: this.state.data.pastday_pending_transfer,
	      total_pending_transfer: this.state.data.total_pending_transfer
	    });
	  },

	  onGetDataDetailDoneAction: function onGetDataDetailDoneAction(data) {

	    this.state.datatable = data.dataDetail.map(function (row) {
	      return {
	        type: row.receive_by,
	        old: helper.numberFormat(row.old, 0),
	        sell: helper.numberFormat(row.sell, 0),
	        return: helper.numberFormat(row.returnx, 0),
	        installment: helper.numberFormat(row.installment, 0),
	        income: helper.numberFormat(row.income, 0),
	        expense: helper.numberFormat(row.expense, 0),
	        cash_transfer: helper.numberFormat(row.transfer, 0)
	        // old:row.old,
	        // sell:row.sell,
	        // return:row.returnx,
	        // installment:row.installment,
	        // income:row.income,
	        // expense:row.expense,
	        // cash_transfer:row.transfer
	      };
	    });
	    this.setState({
	      datatable: this.state.datatable
	    });
	  },

	  doSave: function doSave() {
	    // check required
	    dialogActions.show({
	      title: 'ยืนยัน',
	      content: 'ยืนยันการเปลี่ยนสถานะเป็น ' + this.state.data.status,
	      actions: [{ id: 'save', icon: 'check52', label: 'action.confirm' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	    }, function (isCancel, id) {
	      if (isCancel || id == 'cancel') {
	        return;
	      }
	      actions.save({
	        data: this.state.data,
	        staff_id: system.sessionStore.getSession().staff.id
	      });
	    }.bind(this));
	  },

	  onSaveDoneAction: function onSaveDoneAction(data) {
	    this.doRefresh();
	  },

	  doRefresh: function doRefresh() {
	    actions.getBank();
	    actions.getDataMain(this.state.id);
	  },

	  handleChange: function handleChange(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	  },

	  checkStatus: function checkStatus() {
	    if (this.state.statdata.status == 'รอปิดกะ' || this.state.statdata.status == 'ปิดยอด') {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  render: function render() {

	    var field = {
	      on_date: {
	        id: 'on_date',
	        type: 'text',
	        readonly: true,
	        textAlign: 'center'
	      },
	      cash_on_report: {
	        id: 'cash_on_report',
	        label: 'cashDaily.c_on_report',
	        type: 'text',
	        readonly: true
	      },
	      cash_transfer: {
	        id: 'cash_transfer',
	        label: 'cashDaily.cash_transfer',
	        type: 'text',
	        readonly: true
	      },
	      doc_ref: {
	        id: 'doc_ref',
	        label: 'cashDaily.doc_ref',
	        type: 'text',
	        readonly: true
	      },
	      today_pending_transfer: {
	        id: 'today_pending_transfer',
	        label: 'cashDaily.today_pending_transfer',
	        type: 'text',
	        readonly: true
	      },
	      pastday_pending_transfer: {
	        id: 'pastday_pending_transfer',
	        label: 'cashDaily.pastday_pending_transfer',
	        type: 'text',
	        readonly: true
	      },
	      total_pending_transfer: {
	        id: 'total_pending_transfer',
	        label: 'cashDaily.total_pending_transfer',
	        type: 'text',
	        readonly: true
	      },
	      receive_pending_transfer: {
	        id: 'receive_pending_transfer',
	        label: 'cashDaily.receive_pending_transfer',
	        type: 'text',
	        readonly: true
	      },
	      remark: {
	        id: 'remark',
	        label: 'cashDaily.remark',
	        type: 'text'
	      }

	    };

	    var fieldTable = [{ name: 'type', label: 'cashDaily.table.type', width: '50px' },
	    // {name:'old', title:'cashDaily.table.old', width:'40px', className:'right', render:function(row) {
	    //   return helper.numberFormat(row.old,2);
	    // }},
	    // {name:'sell', title:'cashDaily.table.sell', width:'40px', className:'right', render:function(row) {
	    //   return helper.numberFormat(row.sell,2);
	    // }},
	    // {name:'return', title:'cashDaily.table.return', width:'40px', className:'right', render:function(row) {
	    //   return helper.numberFormat(row.return,2);
	    // }},
	    // {name:'installment', title:'cashDaily.table.installment', width:'40px', className:'right', render:function(row) {
	    //   return helper.numberFormat(row.installment,2);
	    // }},
	    // {name:'income', title:'cashDaily.table.income', width:'40px', className:'right', render:function(row) {
	    //   return helper.numberFormat(row.income,2);
	    // }},
	    // {name:'expense', title:'cashDaily.table.expense', width:'40px', className:'right', render:function(row) {
	    //   return helper.numberFormat(row.expense,2);
	    // }},
	    // {name:'cash_transfer', title:'cashDaily.table.cash_transfer', width:'40px', className:'right', render:function(row) {
	    //   return helper.numberFormat(row.cash_transfer,2);
	    // }},
	    { name: 'old', label: 'cashDaily.table.old', width: '40px' }, { name: 'sell', label: 'cashDaily.table.sell', width: '40px' }, { name: 'return', label: 'cashDaily.table.return', width: '40px' }, { name: 'installment', label: 'cashDaily.table.finance', width: '40px' }, { name: 'income', label: 'cashDaily.table.income', width: '40px' }, { name: 'expense', label: 'cashDaily.table.expense', width: '40px' }, { name: 'cash_transfer', label: 'cashDaily.table.cash_transfer', width: '40px' }];

	    var dataa = [{ 'type': 'เงินสด', 'old': '-', 'sell': '100', 'return': '100', 'finance': '100', 'income': '100', 'expense': '100', 'cash_transfer': '100' }];

	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(
	          'div',
	          { className: 'box10 flex flex-form' },
	          React.createElement(
	            'div',
	            { className: 'panel6' },
	            React.createElement(
	              'div',
	              { 'class': 'panel8', style: { height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.05)' } },
	              React.createElement('input', { className: 'input-text', disabled: true, value: this.state.data.head_on_date, style: { textAlign: 'center', height: '25px', width: '100%' } })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel2' },
	            React.createElement(FlexDropdown, {
	              field: this.state.status,
	              data: { status: this.state.selectedStatus },
	              onChange: this.handleStatusChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel2' },
	            React.createElement(FlexButton, {
	              label: 'action.save',
	              icon: 'save20',
	              onClick: this.doSave,
	              'default': true,
	              disabled: this.checkStatus()
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box10 flex flex-form' },
	          React.createElement(
	            'div',
	            { className: 'panel3', style: { borderRight: '1px solid #eee', paddingRight: '7px' } },
	            React.createElement(
	              'div',
	              { className: 'panel3', style: { paddingLeft: 0 } },
	              React.createElement(FlexTextInput, {
	                field: field.cash_on_report,
	                data: this.state.data
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3', style: { paddingLeft: 0 } },
	              React.createElement(FlexTextInput, {
	                field: field.pastday_pending_transfer,
	                data: this.state.data,
	                onKeyUp: this.onKeyUp

	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3', style: { paddingLeft: 0 } },
	              React.createElement(FlexTextInput, {
	                field: field.cash_transfer,
	                data: this.state.data,
	                onKeyUp: this.onKeyUp

	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3', style: { paddingLeft: 0 } },
	              React.createElement(FlexDropdown, {
	                field: this.state.bank,
	                data: { bank: this.state.selectedItem },
	                onChange: this.handleListChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3', style: { paddingLeft: 0 } },
	              React.createElement(FlexTextInput, {
	                field: field.doc_ref,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3', style: { paddingLeft: 0 } },
	              React.createElement(FlexTextInput, {
	                field: field.today_pending_transfer,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3', style: { paddingLeft: 0 } },
	              React.createElement(FlexTextInput, {
	                field: field.receive_pending_transfer,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3', style: { paddingLeft: 0 } },
	              React.createElement(FlexTextInput, {
	                field: field.total_pending_transfer,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel7', style: { borderLeft: '1px solid #eee', paddingLeft: '7px' } },
	            React.createElement(
	              'h2',
	              null,
	              'สรุปยอดรายวันร้าน'
	            ),
	            React.createElement(
	              'div',
	              { className: 'box7' },
	              React.createElement(FlexDisplayTable, {
	                fields: fieldTable,
	                data: this.state.datatable,
	                displayRows: 10
	              }),
	              React.createElement(FlexTextInput, {
	                field: field.remark,
	                data: this.state.data,
	                onChange: this.handleChange
	              })
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = Screen;

/***/ },

/***/ 725:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);
	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var FlexButton = widgets.FlexButton;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexDropdown = widgets.FlexDropdown;

	var dialogActions = system.dialogActions;
	var systemActions = system.systemActions; //require('../../system/actions');
	var infoPanelActions = system.infoPanelActions;

	var actions = __webpack_require__(719);
	var customerStore = __webpack_require__(720);

	var Report = {};

	tr.registerTranslations('en', __webpack_require__(721));
	tr.registerTranslations('th', __webpack_require__(722));

	Report.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('reports.title.index'));
	  },

	  render: function render() {
	    return React.createElement(Router.RouteHandler, null);
	  }
	});

	Report.List = React.createClass({
	  displayName: 'List',

	  mixins: [Reflux.listenTo(actions.getBranch.done, 'onGetBranchAction'), Reflux.listenTo(actions.pdfExport.done, 'onPDFExport'), Reflux.listenTo(actions.exportProfitLoss.done, 'onExportProfitLoss')],
	  getInitialState: function getInitialState() {
	    var listMonth = [],
	        listYear = [],
	        listYearAll = [],
	        yearStart = 2557;
	    var THMonth = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

	    for (var i = 0; i < 12; i++) {
	      listMonth.push({ value: i + 1, text: THMonth[i] });
	    };

	    listYearAll.push({ value: 'ALL', text: 'ALL' });
	    for (var i = 0; i < 10; i++) {
	      listYear.push({ value: yearStart + i - 543, text: yearStart + i });
	      listYearAll.push({ value: yearStart + i - 543, text: yearStart + i });
	    };

	    var y = new Date().getFullYear(),
	        m = new Date().getMonth() + 1;

	    return {
	      report: null,
	      Parameter: React.createElement('div', null),
	      preview: '',
	      param: {
	        date_from: '2015/01/01',
	        date_to: '2015/12/01',
	        date: '2015/01/01',
	        branch: 'ALL',
	        month: m,
	        year: y,
	        year_all: y,
	        day: 0
	      },
	      branchItem: {
	        id: 'branch',
	        icon: 'user157',
	        label: 'others.param.branch',
	        list: []
	      },
	      monthItem: {
	        id: 'month',
	        icon: 'user157',
	        label: 'others.param.month',
	        list: listMonth
	      },
	      yearItem: {
	        id: 'year',
	        icon: 'user157',
	        label: 'others.param.year',
	        list: listYear
	      },
	      yearAllItem: {
	        id: 'year_all',
	        icon: 'user157',
	        label: 'others.param.year_all',
	        list: listYearAll
	      },
	      list: ['income_customer', 'profit_loss'],
	      class: {}
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    infoPanelActions.show('finance', null);
	    systemActions.setPageHeader('reports.title.index');
	    actions.getBranch();
	    this.onResetCSSReport();
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },
	  onResetCSSReport: function onResetCSSReport(name_active) {
	    for (var i = 0; i < this.state.list.length; i++) {
	      this.state.class[this.state.list[i]] = 'report-list';
	    }
	    if (name_active != undefined) this.state.class[name_active] = 'report-list report-active';
	    this.setState({ class: this.state.class });
	  },
	  onGetBranchAction: function onGetBranchAction(data) {

	    var list = data.branch.map(function (row) {
	      return { value: row.value, text: row.text };
	    });
	    this.state.branchItem.list = list;
	    this.setState({
	      branchItem: { list: list }
	    });
	  },
	  onPDFExport: function onPDFExport(filename) {
	    window.open(filename);
	  },
	  onExportProfitLoss: function onExportProfitLoss(filename) {
	    window.open(filename);
	  },
	  handleChange: function handleChange(id, value) {
	    console.log(id, value);
	    this.state.param[id] = value;
	    this.setState({
	      param: this.state.param,
	      Parameter: this.createParameter(this.state.report)
	    });
	  },
	  createParameter: function createParameter(name) {
	    this.state.report = name || this.state.report || 'summary';

	    var report = {
	      summaryIncomeShop: ['date'],
	      profit_loss: ['month', 'year']
	    };

	    var field = {
	      date_from: { id: 'date_from', label: 'reports.param.date_from', type: 'date' },
	      date_to: { id: 'date_to', label: 'reports.param.date_to', type: 'date' },
	      date: { id: 'date_to', label: 'reports.param.date', type: 'date' }
	    };

	    var obj = React.createElement('div', { className: 'flex-form', style: { padding: '10px 10px' } });
	    var btn = React.createElement(
	      'div',
	      { style: { marginTop: 8 } },
	      React.createElement(FlexButton, {
	        icon: 'printer88', label: 'action.print', 'default': true,
	        field: this.state.btn_print,
	        onClick: this.doSubmit })
	    );

	    if (obj._store.originalProps.children == undefined) obj._store.originalProps.children = [];
	    if (obj._store.props.children == undefined) obj._store.props.children = [];
	    obj._store.originalProps.children.push(btn);
	    obj._store.props.children.push(btn);

	    for (var i = 0; i < report[this.state.report].length; i++) {
	      var param = null;
	      switch (report[this.state.report][i]) {
	        case 'branch':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexDropdown, { field: this.state.branchItem, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	        case 'month':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexDropdown, { field: this.state.monthItem, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	        case 'year':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexDropdown, { field: this.state.yearItem, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	        case 'year_all':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexDropdown, { field: this.state.yearAllItem, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	        case 'period_date':
	          param = React.createElement(
	            'div',
	            null,
	            React.createElement(
	              'div',
	              { style: { marginTop: 8 } },
	              React.createElement(FlexTextInput, { field: field.date_from, data: this.state.param, onChange: this.handleChange })
	            ),
	            React.createElement(
	              'div',
	              { style: { marginTop: 8 } },
	              React.createElement(FlexTextInput, { field: field.date_to, data: this.state.param, onChange: this.handleChange })
	            )
	          );
	          break;
	        case 'date':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexTextInput, { field: field.date, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	      }
	      if (param != null) {
	        // Hack React. //
	        obj._store.originalProps.children.push(param);
	        obj._store.props.children.push(param);
	        // Hack React. //
	      }
	    }

	    return obj;
	  },

	  doPrint: function doPrint(name, label) {
	    this.state.preview = '/img/reports/' + name + '.jpg';
	    this.setState({ Parameter: this.createParameter(name), preview: this.state.preview });
	    this.onResetCSSReport(name);
	  },

	  doSubmit: function doSubmit() {
	    var getState = this.state;
	    console.log('State:', getState);
	    if (getState.report == 'profit_loss') {
	      console.log('profit_loss');
	      actions.exportProfitLoss(getState.report, getState.param);
	    } else {
	      console.log('else');
	      actions.pdfExport(getState.report, getState.param);
	    }
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'box12 flex' },
	        React.createElement(
	          'div',
	          { className: 'box4' },
	          React.createElement(T, { content: 'reports.header.summary', component: 'h2' }),
	          React.createElement(T, { content: 'reports.summaryIncomeShop', component: 'div', className: this.state.class.income_customer,
	            onClick: function (e) {
	              this.doPrint('summaryIncomeShop', 'finance.name.income_customer');
	            }.bind(this) }),
	          React.createElement(T, { content: 'reports.profit_loss', component: 'div', className: this.state.class.profit_loss,
	            onClick: function (e) {
	              this.doPrint('profit_loss', 'finance.name.profit_loss');
	            }.bind(this) })
	        ),
	        React.createElement(
	          'div',
	          { className: 'box3' },
	          React.createElement(T, { content: 'reports.header.parameter', component: 'h2' }),
	          this.state.Parameter
	        ),
	        React.createElement(
	          'div',
	          { className: 'box5' },
	          React.createElement(T, { content: 'reports.header.preview', component: 'h2' }),
	          React.createElement('img', { src: this.state.preview, width: '500' })
	        )
	      )
	    );
	  }

	});

	// Report.Routes = (
	//   <Route name="finance.report" path="report" handler={Report.Index}>
	//     <Router.DefaultRoute name="finance.report.list" handler={Report.List}/>
	//   </Route>
	// );

	module.exports = Report;

/***/ }

});