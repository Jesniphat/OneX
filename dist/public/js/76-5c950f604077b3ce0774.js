webpackJsonp([76,135],{

/***/ 815:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] },
	  'reprint': { children: ['done', 'error'] },
	  'generate': { children: ['done', 'error'] }
	});

/***/ },

/***/ 868:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var T = __webpack_require__(381);

	var system = __webpack_require__(354);
	var widget = __webpack_require__(377);

	var barcodeActions = __webpack_require__(815);

	var dialogActions = system.dialogActions;

	var FlexGrid = widget.FlexGrid;
	var FlexDropdown = widget.FlexDropdown;
	var FlexTextInput = widget.FlexTextInput;
	var FlexButton = widget.FlexButton;

	var Generator = React.createClass({
	  displayName: 'Generator',

	  mixins: [Reflux.listenTo(barcodeActions.facet.done, 'onFacetDoneAction'), Reflux.listenTo(barcodeActions.generate.done, 'onGenBarcode_DoneAction')],

	  getInitialState: function getInitialState() {
	    return {
	      data: [],
	      shopList: [],
	      shop_id: null,
	      year: (new Date().getFullYear() + 543).toString(),
	      qty: '100',
	      fields: [{ name: 'shop_code', title: 'barcode.shop_code', width: '120px' }, { name: 'shop_name', title: 'barcode.shop_name' }, { name: 'year', title: 'barcode.year' }, { name: 'last_barcode', title: 'barcode.last_barcode', width: '200px' }, { name: 'count_total', title: 'barcode.count_total', width: '120px' }, { name: 'count_used', title: 'barcode.count_used', width: '120px' }, { name: 'count_available', title: 'barcode.count_available', width: '120px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement('div', { className: 'flex' });
	        }.bind(this) }],
	      btn_print: { disabled: false }
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    barcodeActions.facet();
	  },

	  onFacetDoneAction: function onFacetDoneAction(result) {
	    var state = {};
	    for (var i = 0; i < result.shops.length; i++) {
	      state = { shop_id: result.shops[i].id, shop_code: result.shops[i].prefix_barcode };
	      break;
	    }

	    this.setState({
	      shop_id: state.shop_id,
	      shop_code: state.shop_code,
	      shopList: result.shops
	    });
	  },

	  onGenBarcode_DoneAction: function onGenBarcode_DoneAction() {
	    this.setState({
	      btn_print: { disabled: false },
	      data: this.state.data
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  doGenBarcode_WorkAction: function doGenBarcode_WorkAction() {
	    if (this.state.btn_print.disabled == false) {

	      dialogActions.show({
	        title: 'ยืนยัน',
	        content: React.createElement(T, { content: 'barcode.confirm_dialog', component: 'div' }),
	        actions: [{ id: 'save', icon: 'check52', label: 'action.print', default: true }, { id: 'cancel', icon: 'close47', label: 'action.cancel' }]
	      }, function (isCancel, id) {
	        if (isCancel || id == 'cancel') {
	          return;
	        }
	        this.setState({ btn_print: { disabled: true } });
	        barcodeActions.generate({
	          shop_id: this.state.shop_id,
	          shop_code: this.state.shop_code,
	          year: this.state.year,
	          qty: this.state.qty
	        });
	      }.bind(this));
	    }
	  },

	  handleChange: function handleChange(id, value) {
	    this.state[id] = value;
	    this.setState({
	      year: this.state.year,
	      qty: this.state.qty
	    });
	  },

	  handleShopChange: function handleShopChange(id, value) {
	    var shop_id = 0;
	    for (var i = 0; i < this.state.shopList.length; i++) {
	      if (this.state.shopList[i].prefix_barcode === value) {
	        shop_id = this.state.shopList[i].id;
	        break;
	      }
	    }
	    //barcodeActions.list({ shop_id: shop_id, year: this.state.year});

	    this.setState({
	      shop_id: shop_id,
	      shop_code: value,
	      data: this.state.data
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'flex-form flex' },
	        React.createElement(
	          'div',
	          { className: 'panel4' },
	          React.createElement(FlexDropdown, {
	            field: {
	              id: 'shop_code',
	              label: 'barcode.shop_code',
	              list: this.state.shopList.map(function (item) {
	                return {
	                  value: item.prefix_barcode,
	                  text: item.code + ' ' + item.name + ' (' + item.prefix_barcode + ')'
	                };
	              })
	            },
	            data: { shop_code: this.state.shop_code },
	            onChange: this.handleShopChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2' },
	          React.createElement(FlexTextInput, {
	            field: { id: 'year', label: 'barcode.year', pattern: '^(25|26)[0-9]{2}$' },
	            data: { year: this.state.year },
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2' },
	          React.createElement(FlexTextInput, {
	            field: { id: 'qty', label: 'barcode.qty', type: 'number' },
	            data: { qty: this.state.qty },
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2' },
	          React.createElement(FlexButton, {
	            icon: 'printer88', label: 'action.print', 'default': true,
	            field: this.state.btn_print,
	            onClick: this.doGenBarcode_WorkAction })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel10' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'installment-barcode-list',
	          listAction: barcodeActions.list,
	          exportAction: barcodeActions.export,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'shop_code',
	          sortDir: 'ASC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: {
	            shop_id: this.state.shop_id
	          }
	        })
	      )
	    );
	  }
	});

	module.exports = Generator;

/***/ }

});