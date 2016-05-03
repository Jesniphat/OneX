webpackJsonp([79,135],{

/***/ 828:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facetList': { children: ['done', 'error'] },
	  'facetDetail': { children: ['done', 'error'] },
	  'commissionDetail': { children: ['done', 'error'] },
	  'saveCommission': { children: ['done', 'error'] },
	  'voidCommission': { children: ['done', 'error'] },
	  'paidCommission': { children: ['done', 'error'] }
	});

/***/ },

/***/ 880:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widget = __webpack_require__(379);

	var helper = system.helper;
	var storage = system.storage;

	var commissionActions = __webpack_require__(828);

	var FlexGrid = widget.FlexGrid;
	var FlexDropdown = widget.FlexDropdown;
	var FlexIcon = widget.FlexIcon;
	var FlexTextInput = widget.FlexTextInput;

	var storageKey = 'installment.commission-open.list';

	var Generator = React.createClass({
	  displayName: 'Generator',

	  mixins: [Reflux.listenTo(commissionActions.list.done, 'onListDoneAction'), Reflux.listenTo(commissionActions.facetList.done, 'onFacetListDoneAction')],

	  getInitialState: function getInitialState() {
	    var today = new Date();
	    var prevDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15);
	    var option = storage.load(storageKey, { shop_id: 0, term_month: ('0' + (prevDay.getMonth() + 1)).substr(-2), term_year: '' + prevDay.getFullYear() });

	    return {
	      data: [],
	      shop_id: option.shop_id,
	      term_year: option.term_year,
	      term_month: option.term_month,
	      shopList: [],
	      yearList: [],
	      fields: [{ name: 'sell_staff_name', title: 'installment.commission-open.sell_staff_name' }, { name: 'num_contract', title: 'installment.commission-open.num_contract', width: '48px', className: 'right' }, { name: 'sum_product_price', title: 'installment.commission-open.sum_product_price', width: '100px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.sum_product_price, 2);
	        } }, { name: 'sum_payment_price', title: 'installment.commission-open.sum_payment_price', width: '100px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.sum_payment_price, 2);
	        } }, { name: 'sum_cost', title: 'installment.commission-open.sum_cost', width: '100px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.sum_cost, 2);
	        } }, { name: 'sum_fee', title: 'installment.commission-open.sum_fee', width: '72px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.sum_fee, 2);
	        } }, { name: 'sum_install_cost', title: 'installment.commission-open.sum_install_cost', width: '72px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.sum_install_cost, 2);
	        } }, { name: 'sum_profit', title: 'installment.commission-open.sum_profit', width: '100px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.sum_profit, 2);
	        } }, { name: 'paid_amount', title: 'installment.commission-open.paid_amount', width: '68px', className: 'right', render: function render(row) {
	          return row.paid_amount > 0 ? helper.numberFormat(row.paid_amount, 2) : '-';
	        } }, { name: 'authorized_date', title: 'installment.commission-open.authorized_date', width: '80px', render: function render(row) {
	          if (!row.authorized_date) {
	            return '';
	          }
	          return tr.localize(new Date(row.authorized_date), { type: 'date', format: 'short' });
	        } }, { name: 'actions', type: 'actions', width: 2 * 24 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'installment.commission-open.detail', param: {
	                staff_id: row.id,
	                term_year: this.state.term_year,
	                term_month: this.state.term_month,
	                shop_id: this.state.shop_id
	              }, icon: 'right244', title: 'action.select' })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    //    commissionActions.list();
	    commissionActions.facetList();
	  },

	  onListDoneAction: function onListDoneAction(result) {
	    console.log('listDone');
	    this.setState({
	      data: result.data
	    });
	  },

	  onFacetListDoneAction: function onFacetListDoneAction(result) {
	    this.setState({
	      shopList: result.shops.map(function (row) {
	        return { value: row.id, text: row.code + ' ' + row.name };
	      }),
	      yearList: result.years.map(function (row) {
	        return { value: row.term_year, text: row.term_year };
	      })
	    });
	  },

	  handleChange: function handleChange(id, value) {
	    this.state[id] = value;
	    var obj = {
	      term_month: this.state.term_month,
	      term_year: this.state.term_year,
	      shop_id: this.state.shop_id
	    };
	    storage.save(storageKey, obj);
	    this.setState(obj, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  render: function render() {
	    var monthList = [];
	    var thMonth = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
	    for (i = 0; i < 12; i++) {
	      monthList.push({
	        value: ('0' + (i + 1)).substr(-2),
	        text: thMonth[i]
	      });
	    };
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex flex-form' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'installment.commission-open.title.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel4 flex' },
	          React.createElement(
	            'div',
	            { className: 'can-grow' },
	            React.createElement(FlexDropdown, {
	              field: { id: 'term_month', label: 'installment.commission-open.filter_term_month', list: monthList },
	              data: this.state,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'no-shrink', style: { width: '160px' } },
	            React.createElement(FlexDropdown, {
	              field: { id: 'term_year', label: 'installment.commission-open.filter_term_year', list: this.state.yearList },
	              data: this.state,
	              onChange: this.handleChange
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop_id', label: 'installment.commission-open.filter_shop', list: this.state.shopList },
	            data: this.state,
	            onChange: this.handleChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel10' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'installment-commission-open-list',
	          listAction: commissionActions.list,
	          exportAction: commissionActions.export,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'sell_staff_name',
	          sortDir: 'ASC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: {
	            shop_id: this.state.shop_id,
	            term_year: this.state.term_year,
	            term_month: this.state.term_month
	          }
	        })
	      )
	    );
	  }
	});

	module.exports = Generator;

/***/ }

});