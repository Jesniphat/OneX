webpackJsonp([58,135],{

/***/ 784:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'saveNew': { children: ['done', 'error'] },
	  'delete': { children: ['done', 'error'] },
	  'getSellInfo': { children: ['done', 'error'] },
	  'getBarcode': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'listClose': { children: ['done', 'error'] },
	  'exportClose': { children: ['done', 'error'] },
	  'getCloseReturn': { children: ['done', 'error'] },
	  'getListCollection': { children: ['done', 'error'] },
	  'saveCollection': { children: ['done', 'error'] },
	  'getMobileNumber': { children: ['done', 'error'] },
	  'exportDunning': { children: ['done', 'error'] },
	  'printCollectionReport': { children: ['done', 'error'] },
	  'listClosediscount': { children: ['done', 'error'] },
	  'exportClosediscount': { children: ['done', 'error'] },
	  'saveClosediscount': { children: ['done', 'error'] },
	  'closeCaStaffList': { children: ['done', 'error'] },
	  'saveCloseCa': { children: ['done', 'error'] },
	  'getContractID': { children: ['done', 'error'] },
	  'getPersonCard': { children: ['done', 'error'] }
	});

/***/ },

/***/ 788:
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
	var storageKey = 'pos.recontract.list';

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var toasterActions = system.toasterActions;
	var dialogActions = system.dialogActions;
	var contractActions = __webpack_require__(784);

	var ContractList = React.createClass({
	  displayName: 'ContractList',


	  getInitialState: function getInitialState() {
	    var shops = system.acl.getShopAcl();
	    var monthYear = tr.localize(new Date(), { type: 'date', format: 'monthYear' });

	    var opt = storage.load(storageKey, { current_status: 'ALL', shop: '' });
	    if (opt.shop == '') {
	      opt.shop = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    }

	    return {
	      data: {
	        shop: opt.shop,
	        current_status: opt.current_status
	      },
	      currentStatusField: {
	        id: 'current_status',
	        label: 'contract.filter_current_status',
	        list: [{ value: 'ALL', text: tr.translate('contract.current_status.ALL') }, { value: 'NORMAL', text: tr.translate('contract.current_status.NORMAL') }, { value: 'DEBT', text: tr.translate('contract.current_status.DEBT') }, { value: 'CLOSE_CANCEL', text: tr.translate('contract.current_status.CLOSE_CANCEL') }, { value: 'CLOSE_NORMAL', text: tr.translate('contract.current_status.CLOSE_NORMAL') }, { value: 'CLOSE_RETURN', text: tr.translate('contract.current_status.CLOSE_RETURN') }, { value: 'CLOSE_CONFISCATE', text: tr.translate('contract.current_status.CLOSE_CONFISCATE') }, { value: 'CLOSE_BAD_DEBT', text: tr.translate('contract.current_status.CLOSE_BAD_DEBT') }]
	      },
	      fields: [{ name: 'status', title: 'contract.contract_status', width: '86px',
	        sort: false, search: false, text: monthYear, render: function render(row) {
	          var today = new Date();
	          var from_date = new Date(today.getFullYear(), today.getMonth() - 9, 1, 0, 0, 0);
	          var year = from_date.getFullYear();
	          var month = from_date.getMonth();
	          var fromYearMonth = year * 100 + month;
	          var to_date = new Date(today.getFullYear(), today.getMonth() + 3, 1, 0, 0, 0);
	          var toYearMonth = to_date.getFullYear() * 100 + to_date.getMonth();
	          var paymentList = {};
	          row.payments.forEach(function (payment) {
	            var d = new Date(payment.due_date.substr(0, 10));
	            var ym = d.getFullYear() * 100 + d.getMonth();
	            paymentList['' + ym] = payment;
	          });
	          var list = [];
	          var ym = year * 100 + month;
	          while (ym < toYearMonth) {
	            if (!paymentList['' + ym]) {
	              list.push(React.createElement('li', { key: ym, className: 'type_EMPTY' }));
	              month++;
	              if (month == 12) {
	                year++;
	                month = 0;
	              }
	              ym = year * 100 + month;
	              continue;
	            }
	            var className = 'status_' + paymentList['' + ym].term_status + (paymentList['' + ym].close_status == 'NORMAL' ? '' : ' ' + paymentList['' + ym].close_status);
	            var title = 'DUE DATE: ' + paymentList['' + ym].due_date.substr(0, 10) + '\nPAID DATE: ' + paymentList['' + ym].paid_date.substr(0, 10) + '\nDUE AMOUNT: ' + paymentList['' + ym].due_amount + '\nPAID AMOUNT: ' + paymentList['' + ym].paid_amount + '\nSTATUS: ' + paymentList['' + ym].term_status + '\nCLOSE STATUS: ' + paymentList['' + ym].close_status;
	            list.push(React.createElement('li', { key: ym, className: className, title: title }));
	            month++;
	            if (month == 12) {
	              year++;
	              month = 0;
	            }
	            ym = year * 100 + month;
	          }
	          return React.createElement(
	            'ul',
	            { className: 'contract_status small' },
	            list
	          );
	        } }, { name: 'code', title: 'contract.code', width: '150px', render: function render(row) {
	          if (!row.code || row.code.length != 16) {
	            return row.code;
	          }
	          return row.code.substr(8, 6);
	        } }, { name: 'shop_name', title: 'contract.shop_name', width: '80px' }, { name: 'sign_date', type: 'daterange', title: 'contract.sign_date', width: '88px', render: function render(row) {
	          //console.log(row.sign_date.substr(0,10));
	          return tr.localize(new Date(row.sign_date.substr(0, 10)), { type: 'date', format: 'short' });
	        } }, { name: 'cus_name', title: 'contract.customer', width: '120px' }, { name: 'product_detail', title: 'contract.product_detail' }, { name: 'payment_price', title: 'contract.payment_price', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.payment_price, 2);
	        } }, { name: 'total_paid', title: 'contract.total_paid', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.total_paid, 2);
	        } }, { name: 'balance', title: 'contract.payment_balance', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.balance, 2);
	        } }, { name: 'over_day', title: 'contract.over_day', width: '100px', className: 'center', render: function render(row) {
	          return row.over_day;
	        } }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          var f = function () {
	            this.onReturnContract(row);
	          }.bind(this);
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { onClick: f },
	              React.createElement(FlexIcon, { icon: 'clear5', title: 'action.select' })
	            )
	          );
	        }.bind(this) }]
	    };
	  },

	  onReturnContract: function onReturnContract(row) {
	    dialogActions.show({
	      title: 'contract.confirm_return_title',
	      content: React.createElement(
	        'div',
	        null,
	        'คุณต้องการยกเลิกและคืน เลขที่สัญญา ',
	        row.code,
	        ' นี้หรือไม่'
	      ),
	      actions: [{ id: 'ok', icon: 'check52', label: 'action.confirm' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	    }, function (isCancel, action_id) {
	      if (isCancel || action_id == 'cancel') {
	        return;
	      }

	      var obj = {
	        contract_id: row.id,
	        contract_code: row.code
	      };
	      //console.log(obj);
	      //actions.voidPayment(obj);
	    });
	  },

	  componentDidMount: function componentDidMount() {
	    console.log(system.sessionStore.getSession());
	  },

	  handleChange: function handleChange(id, value) {

	    this.state.data[id] = value;
	    storage.save(storageKey, {
	      current_status: this.state.data.current_status,
	      shop: this.state.data.shop
	    });
	    this.setState({
	      data: this.state.data
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  render: function render() {
	    var list = system.acl.getShopAcl().map(function (item) {
	      return {
	        value: item.code,
	        text: item.name
	      };
	    });
	    if (system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] })) {
	      list.unshift({ value: '*', text: '* ทุกสาขา' });
	    }
	    var footnote = React.createElement(
	      'ul',
	      { className: 'contract_status_legend' },
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_WAIT' }),
	        React.createElement(T, { content: 'contract.status.WAIT', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_WAIT_PARTIAL' }),
	        React.createElement(T, { content: 'contract.status.WAIT_PARTIAL', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_WAIT_PAID' }),
	        React.createElement(T, { content: 'contract.status.WAIT_PAID', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_OVERDUE' }),
	        React.createElement(T, { content: 'contract.status.OVERDUE', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_OVERDUE_PARTIAL' }),
	        React.createElement(T, { content: 'contract.status.OVERDUE_PARTIAL', component: 'div', className: 'ellipsis' })
	      ),
	      React.createElement(
	        'li',
	        null,
	        React.createElement('div', { className: 'status_OVERDUE_PAID' }),
	        React.createElement(T, { content: 'contract.status.OVERDUE_PAID', component: 'div', className: 'ellipsis' })
	      )
	    );
	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'contract.title.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: this.state.currentStatusField,
	            data: this.state.data,
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'contract.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'pos-recontract-list',
	          listAction: contractActions.list,
	          exportAction: contractActions.export,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'code',
	          sortDir: 'ASC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: {
	            today: helper.dateToString(new Date()),
	            shop: this.state.data.shop == '*' ? null : this.state.data.shop,
	            current_status: this.state.data.current_status
	          },
	          footer: footnote
	        })
	      )
	    );
	  }
	});

	module.exports = ContractList;

/***/ }

});