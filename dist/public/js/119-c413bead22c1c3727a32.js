webpackJsonp([119,135],{

/***/ 991:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'exportclose': { children: ['done', 'error'] }
	});

/***/ },

/***/ 994:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widgets = __webpack_require__(377);

	var helper = system.helper;
	var systemActions = system.systemActions;
	var storage = system.storage;
	var systemStore = system.systemStore;
	var storageKey = 'report.commission.listclose';

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;

	var commissionActions = __webpack_require__(991);

	var CommissionList = React.createClass({
	  displayName: 'CommissionList',


	  getInitialState: function getInitialState() {
	    //    var shops = system.acl.getShopAcl();
	    var shops = systemStore.getMaster().shops.map(function (shop) {
	      return {
	        value: shop.id,
	        text: shop.code + ' ' + shop.name
	      };
	    });
	    shops.unshift({ value: '*', text: '* ทุกสาขา' });
	    var monthYear = tr.localize(new Date(), { type: 'date', format: 'monthYear' });
	    var opt = storage.load(storageKey, { shop: '' });
	    if (opt.shop == '') {
	      opt.shop = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    }

	    return {
	      data: {
	        shop: opt.shop,
	        paid_amount: 0
	      },
	      shopList: shops,
	      fields: [{ name: 'name', title: 'commision.shop_name', width: '80px' }, { name: 'code', title: 'commision.receipt_code', width: '120px' }, { name: 'paid_period', title: 'commision.paid_period', width: '80px' }, { name: 'display_name', title: 'commision.staff_name', width: '120px' }, { name: 'pay_date', type: 'daterange', title: 'commision.pay_date', width: '100px', render: function render(row) {
	          return tr.localize(new Date(row.pay_date.substr(0, 10)), { type: 'date', format: 'short' });
	        } }, { name: 'cost_term', title: 'commision.cost_term', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.cost_term, 2);
	        } }, { name: 'amount', title: 'commision.amount', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.amount, 2);
	        } }, { name: 'profit', title: 'commision.profit', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.profit, 2);
	        } }, { name: 'actions', type: 'actions', width: 2 * 15 + 'px' }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    if (commissionActions.list) {
	      this.onListUnsubscribe = commissionActions.list.done.listen(this.onListDone);
	    } else if (this.props.actions && this.props.actions.list) {
	      this.onListUnsubscribe = this.props.actions.list.done.listen(this.onListDone);
	    }
	    console.log(system.sessionStore.getSession());
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    if (this.onListUnsubscribe) {
	      this.onListUnsubscribe();
	    }
	  },

	  onListDone: function onListDone(data, opt) {
	    this.state.data.paid_amount = opt.paid_amount;
	    this.setState({
	      data: this.state.data
	    });
	  },

	  handleChange: function handleChange(id, value) {
	    this.state.data[id] = value;
	    console.log('select brach=', value);
	    storage.save(storageKey, {
	      shop: this.state.data.shop
	    });
	    this.setState({
	      data: this.state.data
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  render: function render() {

	    var footnote = React.createElement(
	      'div',
	      null,
	      ' | ยอดที่ต้องจ่ายทั้งหมด ',
	      helper.numberFormat(this.state.data.paid_amount, 2),
	      ' บาท'
	    );
	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'report.commission.title', component: 'h2' })
	        ),
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
	          id: 'report-commission-listclose',
	          listAction: commissionActions.list,
	          exportAction: commissionActions.exportclose,
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
	            shop: this.state.data.shop == '*' ? null : this.state.data.shop
	          },
	          footer: footnote
	        })
	      )
	    );
	  }
	});

	module.exports = CommissionList;

/***/ }

});