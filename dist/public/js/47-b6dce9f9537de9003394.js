webpackJsonp([47,135],{

/***/ 720:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'query': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] }
	});

/***/ },

/***/ 724:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widget = __webpack_require__(377);

	var infoPanelActions = system.infoPanelActions;
	var billingActions = __webpack_require__(720);

	var FlexDropdown = widget.FlexDropdown;
	var FlexTextInput = widget.FlexTextInput;
	var FlexButton = widget.FlexButton;
	var FlexDataTable = widget.FlexDataTable;
	var FlexInputRange = widget.FlexInputRange;
	var FlexCheckbox = widget.FlexCheckbox;

	var Screen = React.createClass({
	  displayName: 'Screen',

	  mixins: [Reflux.listenTo(billingActions.query.done, 'onQueryDoneAction'), Reflux.listenTo(billingActions.facet.done, 'onFacetDoneAction')],

	  getInitialState: function getInitialState() {
	    this.fields = {
	      dateInFrom: {
	        id: 'dateInFrom',
	        type: 'date',
	        label: 'finance.billing_receive.date_in_from'
	      },
	      dateInTo: {
	        id: 'dateInTo',
	        type: 'date',
	        label: 'finance.billing_receive.date_in_to'
	      },
	      invoiceDateFrom: {
	        id: 'invoiceDateFrom',
	        type: 'date',
	        label: 'finance.billing_receive.invoice_date_from'
	      },
	      invoiceDateTo: {
	        id: 'invoiceDateTo',
	        type: 'date',
	        label: 'finance.billing_receive.invoice_date_to'
	      },
	      paidDateFrom: {
	        id: 'paidDateFrom',
	        type: 'date',
	        label: 'finance.billing_receive.paid_date_from'
	      },
	      paidDateTo: {
	        id: 'paidDateTo',
	        type: 'date',
	        label: 'finance.billing_receive.paid_date_to'
	      },
	      invoiceCode: {
	        id: 'invoiceCode',
	        type: 'text',
	        label: 'finance.billing_receive.invoice_code'
	      },
	      supplier: {
	        id: 'supplier',
	        type: 'text',
	        label: 'finance.billing_receive.supplier'
	      },
	      paidStatus: {
	        id: 'paidStatus',
	        label: 'finance.billing_receive.paid_status',
	        list: [{ value: 'ALL', text: 'ทั้งหมด' }, { value: 'W', text: tr.translate('finance.billing_receive.paid_status_W') }, { value: 'F', text: tr.translate('finance.billing_receive.paid_status_F') }]
	      },
	      paidDate: {
	        id: 'paidDate',
	        type: 'date',
	        label: 'finance.billing_receive.paid_date'
	      },
	      remark: {
	        id: 'remark',
	        type: 'text',
	        label: 'finance.billing_receive.remark'
	      },
	      chkAll: {
	        id: 'chkAll',
	        label: 'finance.billing_receive.chk_all'
	      }
	    };
	    this.itemFields = [{ name: 'date_in', type: 'date', label: 'finance.billing_receive.items.date_in', width: '80px' }, { name: 'shop_code', label: 'finance.billing_receive.items.shop', width: '60px' }, { name: 'po_code', label: 'finance.billing_receive.items.po', width: '100px' }, { name: 'invoice_code', label: 'finance.billing_receive.items.invoice', width: '100px' }, { name: 'invoice_date', type: 'date', label: 'finance.billing_receive.items.invoice_date', width: '80px' }, { name: 'supplier_name', label: 'finance.billing_receive.items.supplier', width: '80px' }, { name: 'product', label: 'finance.billing_receive.items.product' }, { name: 'serial', label: 'finance.billing_receive.items.serial', width: '80px' }, { name: 'barcode', label: 'finance.billing_receive.items.barcode', width: '60px' }, { name: 'qty', type: 'number', label: 'finance.billing_receive.items.qty', width: '56px' }, { name: 'cost', type: 'number', label: 'finance.billing_receive.items.cost', width: '80px', render: function render(row) {
	        return helper.numberFormat(row.cost, 2);
	      } }, { name: 'remark', label: 'finance.billing_receive.items.remark', width: '88px' }, { name: 'paid_date', type: 'date', label: 'finance.billing_receive.items.paid_date', width: '80px' }, { name: 'bill_no', type: 'number', label: 'finance.billing_receive.items.bill_no', width: '40px' }, { name: 'chk', type: 'custom', label: 'finance.billing_receive.items.check', width: '48px', render: function render() {
	        return React.createElement('input', { type: 'checkbox' });
	      } }];
	    return {
	      filter: {
	        dateInFrom: '',
	        dateInTo: '',
	        invoiceDateFrom: '',
	        invoiceDateTo: '',
	        paidDateFrom: '',
	        paidDateTo: '',
	        invoiceCode: '',
	        paidStatus: 'W'
	      },
	      paidDate: '2015-07-20',
	      chkAll: true,
	      remark: '',
	      itemData: []
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    infoPanelActions.show('finance.dashboard.index', null);
	  },

	  onQueryDoneAction: function onQueryDoneAction(result) {
	    this.setState({
	      data: result.data
	    });
	  },

	  onFacetDoneAction: function onFacetDoneAction(result) {
	    this.setState({
	      shopList: result.shops
	    });
	  },

	  handleChange: function handleChange(id, value) {
	    var obj = {};
	    obj[id] = value;
	    this.setState(obj);
	  },

	  handleFilterChange: function handleFilterChange(id, value) {
	    console.log('id=', id, ',value=', value);
	    this.state.filter[id] = value;
	    this.setState({
	      filter: this.state.filter
	    });
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'flex-form' },
	      React.createElement('div', { className: 'flex-form flex' }),
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'box8' },
	          React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { className: 'panel2' },
	              React.createElement(
	                'div',
	                { className: 'title' },
	                'ค้นหารายการ'
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel6 flex' },
	              React.createElement(FlexInputRange, {
	                type: 'date',
	                label: 'finance.billing_receive.date_in',
	                id_from: 'dateInFrom',
	                id_to: 'dateInTo',
	                onChange: this.handleFilterChange,
	                data_from: this.state.filter.dateInFrom,
	                data_to: this.state.filter.dateInTo
	              }),
	              React.createElement('div', { className: 'no-shrink', style: { width: '8px' } }),
	              React.createElement(FlexInputRange, {
	                type: 'date',
	                label: 'finance.billing_receive.paid_date',
	                id_from: 'paidDateFrom',
	                id_to: 'paidDateTo',
	                onChange: this.handleFilterChange,
	                data_from: this.state.filter.paidDateFrom,
	                data_to: this.state.filter.paidDateTo
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel8 flex' },
	            React.createElement(
	              'div',
	              { style: { width: '230px' }, className: 'no-shrink' },
	              React.createElement(FlexTextInput, {
	                field: this.fields.invoiceCode,
	                data: this.state.filter,
	                onChange: this.handleFilterChange
	              })
	            ),
	            React.createElement('div', { className: 'no-shrink', style: { width: '8px' } }),
	            React.createElement(
	              'div',
	              { style: { width: '230px' }, className: 'no-shrink' },
	              React.createElement(FlexTextInput, {
	                field: this.fields.supplier,
	                data: this.state.filter,
	                onChange: this.handleFilterChange
	              })
	            ),
	            React.createElement('div', { className: 'no-shrink', style: { width: '8px' } }),
	            React.createElement(FlexInputRange, {
	              type: 'date',
	              label: 'finance.billing_receive.invoice_date',
	              id_from: 'invoiceDateFrom',
	              id_to: 'invoiceDateTo',
	              onChange: this.handleFilterChange,
	              data_from: this.state.filter.invoiceDateFrom,
	              data_to: this.state.filter.invoiceDateTo
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box2' },
	          React.createElement(
	            'div',
	            { className: 'panel2' },
	            React.createElement(FlexDropdown, {
	              field: this.fields.paidStatus,
	              data: this.state.filter,
	              onChange: this.handleFilterChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel2' },
	            React.createElement(FlexButton, { icon: 'search100', label: 'action.search', 'default': true,
	              onClick: this.doQuery })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel10', style: { height: '2px', minHeight: '2px' } },
	        React.createElement('div', { style: { height: '0', borderTop: '2px solid #ccc' } })
	      ),
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'panel2' },
	          React.createElement(FlexTextInput, {
	            field: this.fields.paidDate,
	            data: this.state,
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2' },
	          React.createElement(FlexCheckbox, {
	            field: this.fields.chkAll,
	            data: this.state,
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel4' },
	          React.createElement(FlexTextInput, {
	            field: this.fields.remark,
	            data: this.state,
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2' },
	          React.createElement(FlexButton, { icon: 'email107', label: 'action.save', 'default': true,
	            onClick: this.doSave })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel12' },
	        React.createElement(FlexDataTable, {
	          fields: this.itemFields,
	          data: this.state.itemData,
	          displayRows: 10
	        })
	      )
	    );
	  }
	});

	module.exports = Screen;

/***/ }

});