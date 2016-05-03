webpackJsonp([44,135],{

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

/***/ 723:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var storage = system.storage;
	var systemStore = system.systemStore;
	var systemActions = system.systemActions;
	var infoPanelActions = system.infoPanelActions;
	var helper = system.helper;
	var storageKey = 'finance.cd.list';

	var actions = __webpack_require__(719);

	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexGrid = widgets.FlexGrid;
	var FlexDropdown = widgets.FlexDropdown;

	var CashDailyList = React.createClass({
	  displayName: 'CashDailyList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    var shops = systemStore.getMaster().shops.map(function (shop) {
	      return {
	        value: shop.code,
	        text: shop.code + ' ' + shop.name
	      };
	    });
	    shops.unshift({ value: '*', text: '* ทุกสาขา' });
	    var monthYear = tr.localize(new Date(), { type: 'date', format: 'monthYear' });
	    var staff_id = system.sessionStore.getSession().staff.id;

	    var opt = storage.load(storageKey, { current_status: 'ALL', shop: '' });
	    if (opt.shop == '') {
	      opt.shop = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    }

	    return {
	      data: {
	        shop: opt.shop,
	        staff_id: staff_id
	      },
	      shopList: shops,
	      fields: [{ name: 'on_date', type: 'daterange', title: 'cashDaily.created_by', width: '70px', render: function render(row) {
	          return tr.localize(new Date(row.on_date), { type: 'date', format: 'short' });
	        } }, { name: 'sh_name', title: 'cashDaily.shop_code', width: '70px' }, { name: 'cash_transfer', title: 'cashDaily.cash_on_report', width: '70px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.cash_transfer, 2);
	        } }, { name: 'sh_tel', title: 'cashDaily.shop_tel', width: '70px' }, { name: 'approve_date', type: 'daterange', title: 'cashDaily.approve_date', width: '70px' }, { name: 'remark', title: 'cashDaily.remark', width: '150px' }, { name: 'cd_status', title: 'cashDaily.status', type: 'lov', width: '50px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'finance.cd.screen', param: { id: row.cash_daily_id }, icon: 'right244', title: 'action.select' })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this.state.data.shop_id = system.sessionStore.getSession().shop.id;
	  },

	  handleChange: function handleChange(id, value) {
	    console.log(value);
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

	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'cd.title.list', component: 'h2' })
	        ),
	        React.createElement('div', { className: 'panel3 no-shrink flex-form' }),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'receipt.filter_shop', list: this.state.shopList },
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
	          id: 'finance-cd-list',
	          listAction: actions.list,
	          exportAction: actions.export,
	          facetAction: actions.ddlList,
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
	            shop: this.state.data.shop == '*' ? null : this.state.data.shop,
	            staff_id: this.state.data.staff_id
	          }
	        })
	      )
	    );
	  }
	});

	module.exports = CashDailyList;

/***/ }

});