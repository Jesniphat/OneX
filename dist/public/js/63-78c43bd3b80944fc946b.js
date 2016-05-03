webpackJsonp([63,135],{

/***/ 753:
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
	  'insertOld': { children: ['done', 'error'] }
	  // 'getData':{children:['done','error']}
	});

/***/ },

/***/ 795:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var helper = system.helper;
	var systemActions = system.systemActions;
	var storage = system.storage;
	var storageKey = 'pos.cashDaily.list';

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;

	var cashDailyActions = __webpack_require__(753);

	var CashDailyList = React.createClass({
	  displayName: 'CashDailyList',


	  getInitialState: function getInitialState() {
	    var shop_id = system.sessionStore.getSession().shop.id;
	    var monthYear = tr.localize(new Date(), { type: 'date', format: 'monthYear' });
	    var staff_id = system.sessionStore.getSession().staff.id;
	    return {
	      data: {
	        shop: '',
	        shop_id: shop_id,
	        staff_id: staff_id
	      },
	      fields: [{ name: 'on_date', title: 'cashDaily.created_by', width: '70px', render: function render(row) {
	          return tr.localize(new Date(row.on_date), { type: 'date', format: 'short' });
	        } }, { name: 'sh_name', title: 'cashDaily.shop_code', width: '70px' }, { name: 'cash_transfer', title: 'cashDaily.cash_on_report', width: '70px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.cash_transfer, 2);
	        } }, { name: 'sh_tel', title: 'cashDaily.shop_tel', width: '70px' }, { name: 'approve_date', title: 'cashDaily.approve_date', width: '70px' }, { name: 'remark', title: 'cashDaily.remark', width: '150px' }, { name: 'cd_status', title: 'cashDaily.status', type: 'lov', width: '50px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'pos.cashDaily.edit', param: { id: row.cash_daily_id, sendStatus: row.cd_status }, icon: 'right244', title: 'action.select' })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this.state.data.shop_id = system.sessionStore.getSession().shop.id;
	  },

	  render: function render() {

	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'cashDaily.title.list', component: 'h2' })
	        ),
	        React.createElement('div', { className: 'panel3 no-shrink flex-form' }),
	        React.createElement('div', { className: 'panel3 no-shrink flex-form' })
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'pos-cashDaily-list',
	          listAction: cashDailyActions.list,
	          exportAction: cashDailyActions.export,
	          facetAction: cashDailyActions.ddlList,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'on_date',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: {
	            today: helper.dateToString(new Date()),
	            shop_id: this.state.data.shop_id,
	            staff_id: this.state.data.staff_id
	          }
	        })
	      )
	    );
	  }
	});

	module.exports = CashDailyList;

/***/ },

/***/ 796:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var helper = system.helper;
	var systemActions = system.systemActions;
	var infoPanelActions = system.infoPanelActions;
	var dialogActions = system.dialogActions;
	var toasterActions = system.toasterActions;

	var FlexButton = widgets.FlexButton;
	var FlexDisplayTable = widgets.FlexDisplayTable;
	var FlexTab = widgets.FlexTab;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexIcon = widgets.FlexIcon;
	var FlexDataTable = widgets.FlexDataTable;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var NationIDCard = widgets.NationIDCard;

	var actions = __webpack_require__(753);

	var CashDailyEdit = React.createClass({
	  displayName: 'CashDailyEdit',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(actions.getBank.done, 'onGetBankDoneAction'), Reflux.listenTo(actions.getDataDetail.done, 'onGetDataDetailDoneAction'), Reflux.listenTo(actions.getDataMain.done, 'onGetDataMainDoneAction'), Reflux.listenTo(actions.save.done, 'onSaveDoneAction')],

	  getInitialState: function getInitialState() {

	    var id = parseInt(this.context.router.getCurrentParams().id);

	    var sendStatus = this.context.router.getCurrentParams().sendStatus;
	    var flagClose = this.context.router.getCurrentParams().close;
	    var flagDunning = this.context.router.getCurrentParams().dunning;
	    var pageBack = this.context.router.getCurrentParams().pageback;
	    if (!pageBack) {
	      pageBack = 'pos.cashDaily.list';
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
	      sendStatus: sendStatus,
	      flagSave: false,
	      data: {
	        cash_daily_id: '',
	        bank: '1',
	        bank_ref: '',
	        on_date: '',
	        cash_on_report: 0,
	        cash_transfer: 0,
	        receive_pending_transfer: 0,
	        today_pending_transfer: 0,
	        pastday_pending_transfer: 0,
	        total_pending_transfer: 0,
	        remark: '',
	        doc_ref: ''
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
	        list: []
	      },
	      searchDate: ''
	    };
	  },

	  componentDidMount: function componentDidMount() {

	    infoPanelActions.show('pos.cashDaily.list', React.createElement('div', { className: 'box10' }));
	    actions.getBank();
	    actions.getDataMain(this.state.id, this.state.sendStatus);
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
	    // this.state.data.bank = this.state.bank.list[this.state.selectedItem-1].value;
	    // this.state.data.bank_ref = this.state.bank.list[this.state.selectedItem-1].text;

	    this.setState({
	      bank: this.state.bank,
	      selectedItem: this.state.selectedItem
	    });
	  },

	  onGetDataMainDoneAction: function onGetDataMainDoneAction(data) {
	    console.log('data:', data);
	    this.state.data.on_date = 'ประจำวันที่ ' + tr.localize(new Date(data.Main[0].on_date), { type: 'date', format: 'short' }) + ' - ' + data.Main[0].sh_name;

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

	    //Form Price
	    this.state.data.cash_on_report = parseInt(data.Main[0].cash_on_report || 0);
	    this.state.data.cash_transfer = parseInt(data.Main[0].cash_transfer || 0);
	    this.state.data.receive_pending_transfer = parseInt(data.Main[0].receive_pending_transfer || 0);
	    this.state.data.today_pending_transfer = parseInt(data.Main[0].today_pending_transfer || 0);

	    this.state.data.pastday_pending_transfer = parseInt(data.Main[0].pastday_pending_transfer || 0);
	    this.state.data.total_pending_transfer = parseInt(data.Main[0].total_pending_transfer || 0);

	    this.state.data.doc_ref = data.Main[0].doc_ref;
	    this.state.data.remark = data.Main[0].remark;

	    if (data.Main[0].bank_id != null) {
	      this.state.selectedItem = data.Main[0].bank_id;
	      //this.state.bank = = data.Main[0].bank_id;
	      this.state.data.bank = data.Main[0].bank_id;
	    } else {
	      this.state.selectedItem = "1";
	      this.state.data.bank = "1";
	    }

	    this.setState({
	      data: this.state.data,
	      statdata: this.state.statdata,
	      searchDate: this.state.searchDate,
	      cash_daily_id: this.state.data.cash_daily_id,
	      selectedItem: this.state.selectedItem,
	      bank: this.state.bank
	    });

	    var color = 'yellow';

	    if (this.state.statdata.status == 'อนุมัติ' || this.state.statdata.status == 'ปิดยอด') {
	      color = '#b2e388';
	    } else {
	      color = 'yellow';
	    }

	    actions.getDataDetail(this.state.cash_daily_id);

	    var amount = parseInt(this.state.data.cash_on_report || 0) - parseInt(this.state.data.cash_transfer || 0);

	    if (amount > 0) {
	      this.state.data.today_pending_transfer = amount;
	      this.state.data.receive_pending_transfer = '0';
	    } else if (amount < 0) {
	      this.state.data.today_pending_transfer = '0';
	      this.state.data.receive_pending_transfer = parseInt(amount || 0) * parseInt(-1);
	    } else {
	      this.state.data.today_pending_transfer = '0';
	      this.state.data.receive_pending_transfer = '0';
	    }

	    this.state.data.total_pending_transfer = parseInt(this.state.data.pastday_pending_transfer || 0) + parseInt(this.state.data.today_pending_transfer || 0) - parseInt(this.state.data.receive_pending_transfer || 0);
	    this.setState({
	      today_pending_transfer: this.state.data.today_pending_transfer,
	      receive_pending_transfer: this.state.data.receive_pending_transfer,
	      cash_transfer: this.state.data.cash_transfer,
	      pastday_pending_transfer: this.state.data.pastday_pending_transfer,
	      total_pending_transfer: this.state.data.total_pending_transfer
	    });

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

	    infoPanelActions.show('pos.cashDaily.list', React.createElement(
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
	  },

	  handleListChange: function handleListChange(id, value) {

	    this.state.data.bank = value;
	    this.state.data.bank_ref = this.state.bank.list[value - 1].text;

	    this.state.selectedItem = value;

	    this.setState({
	      data: this.state.data,
	      selectedItem: this.state.selectedItem
	    });
	  },

	  onKeyUp: function onKeyUp(id, value) {
	    if (id == 'cash_transfer') {
	      this.state.data.cash_transfer = value;
	    } else {
	      this.state.data.pastday_pending_transfer = value;
	    }

	    var amount = parseInt(this.state.data.cash_on_report || 0) - parseInt(this.state.data.cash_transfer || 0);

	    if (amount > 0) {
	      this.state.data.today_pending_transfer = amount;
	      this.state.data.receive_pending_transfer = '0';
	    } else if (amount < 0) {
	      this.state.data.today_pending_transfer = '0';
	      this.state.data.receive_pending_transfer = parseInt(amount || 0) * parseInt(-1);
	    } else {
	      this.state.data.today_pending_transfer = '0';
	      this.state.data.receive_pending_transfer = '0';
	    }

	    this.state.data.total_pending_transfer = parseInt(this.state.data.pastday_pending_transfer || 0) + parseInt(this.state.data.today_pending_transfer || 0) - parseInt(this.state.data.receive_pending_transfer || 0);
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

	      };
	    });
	    this.setState({
	      datatable: this.state.datatable
	    });
	  },

	  doSave: function doSave() {
	    // check required
	    if (this.state.flagSave == false) {
	      dialogActions.show({
	        title: 'dialog.confirm',
	        content: 'ยืนยันการบันทึก',
	        actions: [{ id: 'save', icon: 'check52', label: 'action.confirm' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	      }, function (isCancel, id) {
	        if (isCancel || id == 'cancel') {
	          return;
	        }

	        this.setState({
	          flagSave: true
	        });

	        actions.save({
	          data: this.state.data,
	          staff_id: system.sessionStore.getSession().staff.id
	        });
	      }.bind(this));
	    }
	  },

	  onSaveDoneAction: function onSaveDoneAction(id, data, status) {
	    if (data == true) {
	      toasterActions.pop({
	        type: 'success',
	        message: 'บันทึกเรียบร้อยแล้ว'
	      });
	      this.state.sendStatus = status;
	      this.state.id = id;
	      this.doRefresh();
	    }
	    this.setState({
	      flagSave: false
	    });
	  },

	  doRefresh: function doRefresh() {
	    actions.getBank();
	    actions.getDataMain(this.state.id, this.state.sendStatus);
	  },

	  handleChange: function handleChange(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	  },

	  checkStatus: function checkStatus() {
	    if (this.state.statdata.status == 'รอปิดกะ' || this.state.statdata.status == 'เปิดให้แก้ไข') {
	      return false;
	    } else {
	      return true;
	    }
	  },

	  render: function render() {

	    var field = {
	      on_date: {
	        id: 'on_date',
	        type: 'text',
	        readonly: true,
	        Align: 'center'
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
	        type: 'text'
	      },
	      doc_ref: {
	        id: 'doc_ref',
	        label: 'cashDaily.doc_ref',
	        type: 'text'
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

	    var fieldTable = [{ name: 'type', label: 'cashDaily.table.type', width: '50px' }, { name: 'old', label: 'cashDaily.table.old', width: '40px' }, { name: 'sell', label: 'cashDaily.table.sell', width: '40px' }, { name: 'return', label: 'cashDaily.table.return', width: '40px' }, { name: 'installment', label: 'cashDaily.table.finance', width: '40px' }, { name: 'income', label: 'cashDaily.table.income', width: '40px' }, { name: 'expense', label: 'cashDaily.table.expense', width: '40px' }, { name: 'cash_transfer', label: 'cashDaily.table.cash_transfer', width: '40px' }];

	    var dataa = [{ 'type': 'เงินสด', 'old': '-', 'sell': '100', 'return': '100', 'finance': '100', 'income': '100', 'expense': '100', 'cash_transfer': '100' }];

	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(
	          'div',
	          { className: 'box10 flex flex-form' },
	          React.createElement(
	            'div',
	            { className: 'panel8' },
	            React.createElement(
	              'div',
	              { 'class': 'panel8', style: { height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.05)' } },
	              React.createElement('input', { className: 'input-text', disabled: true, value: this.state.data.on_date, style: { textAlign: 'center', height: '25px', width: '100%' } })
	            )
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
	                onKeyUp: this.onKeyUp,
	                onChange: this.handleChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel3', style: { paddingLeft: 0 } },
	              React.createElement(FlexTextInput, {
	                field: field.cash_transfer,
	                data: this.state.data,
	                onKeyUp: this.onKeyUp,
	                onChange: this.handleChange
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

	module.exports = CashDailyEdit;

/***/ },

/***/ 797:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var helper = system.helper;
	var systemActions = system.systemActions;
	var storage = system.storage;
	var storageKey = 'pos.cashDaily.insertOld';

	var FlexButton = widgets.FlexButton;
	var FlexDisplayTable = widgets.FlexDisplayTable;
	var dialogActions = system.dialogActions;
	var FlexTab = widgets.FlexTab;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexIcon = widgets.FlexIcon;
	var FlexDataTable = widgets.FlexDataTable;
	var FlexRadioGroup = widgets.FlexRadioGroup;

	var cashDailyActions = __webpack_require__(753);

	var CashDailyList = React.createClass({
	  displayName: 'CashDailyList',

	  mixins: [Reflux.listenTo(cashDailyActions.insertOld.done, 'onInsertOldDoneAction')],

	  getInitialState: function getInitialState() {
	    var shop_id = system.sessionStore.getSession().shop.id;
	    var monthYear = tr.localize(new Date(), { type: 'date', format: 'monthYear' });
	    var staff_id = system.sessionStore.getSession().staff.id;
	    return {
	      data: {
	        shop: '',
	        shop_id: shop_id,
	        staff_id: staff_id,
	        dateFrom: '2015-01-01',
	        dateTo: '2015-01-31',
	        flagSave: false
	      },
	      flagSave: false
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this.state.data.shop_id = system.sessionStore.getSession().shop.id;
	  },

	  doSave: function doSave() {
	    // check required

	    console.log('jjjjj', this.state.flagSave);

	    dialogActions.show({
	      title: 'dialog.confirm',
	      content: 'ยืนยันการบันทึก',
	      actions: [{ id: 'save', icon: 'check52', label: 'action.confirm' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	    }, function (isCancel, id) {
	      if (isCancel || id == 'cancel') {

	        return;
	      } else {
	        this.setState({
	          flagSave: true
	        });
	      }

	      cashDailyActions.insertOld({
	        data: this.state.data,
	        staff_id: system.sessionStore.getSession().staff.id
	      });
	    }.bind(this));
	  },

	  onInsertOldDoneAction: function onInsertOldDoneAction(id, data, status) {
	    if (data == true) {
	      toasterActions.pop({
	        type: 'success',
	        message: 'บันทึกเรียบร้อยแล้ว'
	      });
	      // this.state.sendStatus = status;
	      // this.state.id = id;
	      this.doRefresh();
	    }
	    this.setState({
	      flagSave: false
	    });
	  },
	  handleChange: function handleChange(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	  },
	  render: function render() {
	    var field = {
	      dateFrom: {
	        id: 'dateFrom',
	        type: 'text',
	        Align: 'center'
	      },
	      dateTo: {
	        id: 'dateTo',
	        type: 'text',
	        Align: 'center'
	      }
	    };
	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'cashDaily.title.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexTextInput, {
	            field: field.dateFrom,
	            data: this.state.data,
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexTextInput, {
	            field: field.dateTo,
	            data: this.state.data,
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexButton, {
	            label: 'action.save',
	            icon: 'save20',
	            onClick: this.doSave,
	            'default': true
	          })
	        )
	      ),
	      React.createElement('div', { className: 'content-body panelf' })
	    );
	  }
	});

	module.exports = CashDailyList;

/***/ }

});