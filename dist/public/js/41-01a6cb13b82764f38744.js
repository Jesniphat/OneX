webpackJsonp([41,135],{

/***/ 711:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getPV': { children: ['done', 'error'] },
	  'queryForWaitList': { children: ['done', 'error'] },
	  'queryForSupplier': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'print': { children: ['done', 'error'] }
	});

/***/ },

/***/ 715:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var systemActions = system.systemActions;
	var infoPanelActions = system.infoPanelActions;
	var helper = system.helper;

	var actions = __webpack_require__(711);

	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexGrid = widgets.FlexGrid;

	var PaymentVoucherList = React.createClass({
	  displayName: 'PaymentVoucherList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    return {
	      fields: [{ name: 'code', title: 'finance.pv.list.code', width: '96px' }, { name: 'document_date', title: 'finance.pv.list.document_date', width: '88px', render: function render(row) {
	          return tr.localize(new Date(row.document_date), { type: 'date', format: 'short' });
	        } }, { name: 'approve_date', type: 'daterange', title: 'finance.pv.list.approve_date', width: '88px', render: function render(row) {
	          return row.approve_date == '0000-00-00' ? React.createElement(T, { content: 'finance.pv.status_not_yet_approve', component: 'i' }) : tr.localize(new Date(row.approve_date), { type: 'date', format: 'short' });
	        } }, { name: 'total_amount', title: 'finance.pv.list.total_amount', width: '96px', format: 'money' }, { name: 'supplier_code', title: 'finance.pv.list.supplier_code' },
	      //        {name:'vat_amount',title:'finance.pv.list.vat_amount',width:'80px',format:'money'},
	      { name: 'cn_amount', title: 'finance.pv.list.cn_amount', width: '80px', format: 'money' }, { name: 'net_amount', title: 'finance.pv.list.net_amount', width: '96px', format: 'money' }, { name: 'cn_code', title: 'finance.pv.list.cn_code', width: '96px' }, { name: 'staff', title: 'finance.pv.list.staff' }, { name: 'remark', title: 'finance.pv.list.remark' }, { name: 'status', title: 'finance.pv.list.status', type: 'lov', width: '100px', list: [{ value: 'DRAFT', text: tr.translate('finance.pv.list.status_DRAFT') }, { value: 'PROPOSE', text: tr.translate('finance.pv.list.status_PROPOSE') }, { value: 'APPROVE', text: tr.translate('finance.pv.list.status_APPROVE') }, { value: 'REJECT', text: tr.translate('finance.pv.list.status_REJECT') }, { value: 'PAID', text: tr.translate('finance.pv.list.status_PAID') }, { value: 'VOID', text: tr.translate('finance.pv.list.status_VOID') }], render: function render(row) {
	          return tr.translate('finance.pv.list.status_' + row.status);
	        } }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function render(row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'finance.pv.screen', param: { id: row.id }, icon: 'create3', title: 'action.edit' })
	          );
	        } }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    infoPanelActions.hide();
	  },

	  doPaymentVoucherNew: function doPaymentVoucherNew() {
	    this.context.router.transitionTo('finance.pv.screen', { id: 0 });
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
	          React.createElement(T, { content: 'finance.pv.title.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'boxf flex no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel2 no-shrink' },
	            React.createElement(FlexButton, { icon: 'add184', label: 'finance.pv.action.new',
	              onClick: this.doPaymentVoucherNew })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          id: 'finance-pv-list',
	          listAction: actions.list,
	          exportAction: actions.export,
	          facetAction: actions.facetList,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'code',
	          sortDir: 'DESC',
	          limit: 50,
	          displayRows: 10,
	          checkbox: false,
	          search: true
	        })
	      )
	    );
	  }
	});

	module.exports = PaymentVoucherList;

/***/ }

});