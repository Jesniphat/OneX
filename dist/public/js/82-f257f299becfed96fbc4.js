webpackJsonp([82,135],{

/***/ 825:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facetList': { children: ['done', 'error'] },
	  'genrate': { children: ['done', 'error'] },
	  'facetDetail': { children: ['done', 'error'] },
	  'commissionDetail': { children: ['done', 'error'] },
	  'saveCommission': { children: ['done', 'error'] },
	  'voidCommission': { children: ['done', 'error'] },
	  'paidCommission': { children: ['done', 'error'] }
	});

/***/ },

/***/ 875:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widget = __webpack_require__(377);

	var helper = system.helper;
	var storage = system.storage;

	var actions = __webpack_require__(825);

	var FlexGrid = widget.FlexGrid;
	var FlexDropdown = widget.FlexDropdown;
	var FlexIcon = widget.FlexIcon;
	var FlexTextInput = widget.FlexTextInput;

	var storageKey = 'installment.commission-close.list';

	var Generator = React.createClass({
	  displayName: 'Generator',

	  mixins: [Reflux.listenTo(actions.list.done, 'onListDoneAction'), Reflux.listenTo(actions.facetList.done, 'onFacetListDoneAction')],

	  getInitialState: function getInitialState() {
	    var today = new Date();
	    var prevDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15);
	    var option = storage.load(storageKey, { term_month: ('0' + (prevDay.getMonth() + 1)).substr(-2), term_year: '' + prevDay.getFullYear() });

	    return {
	      data: [],
	      shop_id: option.shop_id,
	      term_year: option.term_year,
	      term_month: option.term_month,
	      shopList: [],
	      yearList: [],
	      fields: [{ name: 'shop_name', title: 'installment.commission-close.list.shop', width: '100px' }, { name: 'display_name', title: 'installment.commission-close.list.display_name', width: '150px' }, { name: 'cost_term', title: 'installment.commission-close.list.cost', format: 'money', width: '96px' }, { name: 'amount', title: 'installment.commission-close.list.amount', format: 'money', width: '96px' }, { name: 'profit', title: 'installment.commission-close.list.profit', format: 'money', width: '96px' }, { name: 'receipt_amount', title: 'installment.commission-close.list.contract_amount', className: 'right', width: '96px' }, { name: 'actions', type: 'actions', width: 2 * 24 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'installment.commission-close.detail', param: {
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
	    actions.list();
	    actions.facetList();
	  },

	  onListDoneAction: function onListDoneAction(result) {
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
	    for (var i = 0; i < 12; i++) {
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
	          React.createElement(T, { content: 'installment.commission-close.title.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel7 flex' },
	          React.createElement(
	            'div',
	            { className: 'can-grow' },
	            React.createElement(FlexDropdown, {
	              field: { id: 'term_month', label: 'installment.commission-close.filter_term_month', list: monthList },
	              data: this.state,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'no-shrink', style: { width: '160px' } },
	            React.createElement(FlexDropdown, {
	              field: { id: 'term_year', label: 'installment.commission-close.filter_term_year', list: this.state.yearList },
	              data: this.state,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'no-shrink', style: { width: '250px' } },
	            React.createElement(FlexDropdown, {
	              field: { id: 'shop_id', label: 'installment.commission-close.filter_shop', list: this.state.shopList },
	              data: this.state,
	              onChange: this.handleChange
	            })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel10' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'installment-commission-close-list',
	          listAction: actions.list,
	          exportAction: actions.export,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'display_name',
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