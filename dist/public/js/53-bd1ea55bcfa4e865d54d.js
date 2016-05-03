webpackJsonp([53,135],{

/***/ 743:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getInitData': { children: ['done', 'error'] },
	  'getProductDetail': { children: ['done', 'error'] },
	  'getCustomerDetail': { children: ['done', 'error'] },
	  'saveData': { children: ['done', 'error'] },
	  'dateChange': { children: ['done', 'error'] }
	});

/***/ },

/***/ 744:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);
	var ajax = system.ajaxActions; //require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var actions = __webpack_require__(743);

	var sellStore = Reflux.createStore({
	  listenables: [actions],

	  // pendingActions.list
	  onList: function onList(param) {
	    ajax.request('/api/sell/list', param, function (res) {
	      actions.list.done(res.data, res.opt);
	    });
	  },

	  onExport: function onExport(param) {
	    ajax.request('/api/installment/contract/exportPending', param, function (res) {
	      if (res.status === true) {
	        actions.export.done(res.file);
	      } else {
	        actions.export.error();
	      }
	    });
	  },
	  // actions.list
	  onGetInitData: function onGetInitData(param) {
	    ajax.request('/api/sell/init', param, actions.getInitData.done);
	  },

	  onDateChange: function onDateChange(param) {
	    ajax.request('/api/sell/checkOndate', param, actions.dateChange.done);
	  },

	  onGetProductDetail: function onGetProductDetail(param) {
	    ajax.request('/api/sell/search-product', param, actions.getProductDetail.done);
	  },

	  onGetCustomerDetail: function onGetCustomerDetail(id, shop_id) {
	    ajax.request('/api/sell/search-customer', { company_id: id, shop_id: shop_id }, actions.getCustomerDetail.done);
	  },

	  onGetById: function onGetById(id) {
	    ajax.request('/api/sell/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      actions.getById.done(res.data);
	    } else {
	      actions.getById.error(res.msg);
	    }
	  },

	  onSaveData: function onSaveData(data) {
	    ajax.request('/api/sell/save', data, actions.saveData.done);
	  },

	  onFacetEdit: function onFacetEdit() {
	    ajax.request('/api/sell/facetEdit', {}, this.doneFacetEdit);
	  },

	  doneFacetEdit: function doneFacetEdit(res) {
	    if (res.status === true) {
	      actions.facetEdit.done(res.data);
	    } else {
	      actions.facetEdit.error(res.error);
	    }
	  }

	});

	module.exports = sellStore;

/***/ },

/***/ 770:
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

	var systemActions = system.systemActions;
	var infoPanelActions = system.infoPanelActions;
	var dialogActions = system.dialogActions;
	var toasterActions = system.toasterActions;
	var helper = system.helper;
	var storage = system.storage;
	// var systemStore       = system.systemStore;
	// var sessionStore      = system.sessionStore;

	var actions = __webpack_require__(743);
	var pendingStore = __webpack_require__(744);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexDropdown = widgets.FlexDropdown;

	var storageKey = 'installment.contract.pending';

	var List = React.createClass({
	  displayName: 'List',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    var shops = system.acl.getShopAcl();
	    var option = storage.load(storageKey, { shop_code: '' });
	    var shop_code = '';

	    if (option.shop_code == '') {
	      shop_code = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    } else {
	      shop_code = option.shop_code;
	    }

	    return {
	      data: {
	        shop: shop_code
	      },
	      fields: [{ name: 'sell_date', type: 'text', title: 'info.sell_date', width: '92px', render: function render(row) {
	          return tr.localize(new Date(row.sell_date), { type: 'date', format: 'short' });
	        } }, { name: 'shop_name', title: 'info.shop_name', width: '110px' }, { name: 'company_name', title: 'info.company_name', width: '125px' }, { name: 'product_serial', title: 'info.serial', width: '125px' }, { name: 'product_description', title: 'info.description' }, { name: 'down_payment', title: 'info.down_payment', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.down_payment, 2);
	        } }, { name: 'remain_price', title: 'info.remain_price', width: '80px', className: 'right', render: function render(row) {
	          return helper.numberFormat(row.remain_price, 2);
	        } }, { name: 'sales_staff', title: 'info.sell_staff', width: '100px' }, { name: 'flag', title: 'info.flag', hint: 'info.flag_hint', width: '24px', sort: false }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: "/pos/sell/" + row.id, icon: 'right244', title: 'action.select' })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {},

	  handleShopChange: function handleShopChange(id, value) {
	    storage.save(storageKey, { shop_code: value });
	    this.setState({
	      data: {
	        shop: value
	      }
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
	  },

	  doSellNew: function doSellNew() {
	    this.props.history.pushState(null, '/pos/sell/0');
	  },

	  render: function render() {
	    var list = system.acl.getShopAcl().map(function (item) {
	      return {
	        value: item.code,
	        text: item.code + ' ' + item.name
	      };
	    });
	    if (system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] })) {
	      list.unshift({ value: '*', text: '* ทุกสาขา' });
	    }

	    var footnote = React.createElement(
	      'div',
	      null,
	      React.createElement(T, { content: 'info.footer.special' })
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
	          React.createElement(T, { content: 'info.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'info.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleShopChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink flex-form' },
	          React.createElement(FlexButton, {
	            label: 'info.new',
	            icon: 'add186',
	            'default': false,
	            onClick: this.doSellNew })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'sell-list',
	          listAction: actions.list,
	          exportAction: actions.export,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'sell_date',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: { shop: this.state.data.shop == '*' ? null : this.state.data.shop },
	          footer: footnote
	        })
	      )
	    );
	  }
	});

	module.exports = List;

/***/ }

});