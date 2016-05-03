webpackJsonp([105,135],{

/***/ 940:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = [{ path: 'aging/:id?', component: __webpack_require__(941) }, { path: 'total', component: __webpack_require__(946) }, { path: 'stock', component: __webpack_require__(949) }, { path: 'stockin', component: __webpack_require__(952) }, { path: 'transfer', component: __webpack_require__(955) }, { path: 'selldetail', component: __webpack_require__(958) }, { path: 'return', component: __webpack_require__(961) }];

/***/ },

/***/ 941:
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

	var agingActions = __webpack_require__(942);
	var agingStore = __webpack_require__(943);

	var Actions = __webpack_require__(944);
	var Store = __webpack_require__(945);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexCheckbox = widgets.FlexCheckbox;

	var storageKey = 'info.info.aging';

	var InfoAging = React.createClass({
	  displayName: 'InfoAging',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    var idSt = parseInt(this.props.params.id);

	    var shops = system.acl.getShopAcl();
	    var option = storage.load(storageKey, { shop_code: '' });
	    var shop_code = '';

	    if (option.shop_code == '') {
	      shop_code = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    } else {
	      shop_code = option.shop_code;
	    }

	    var chkQtyYn = true;
	    var clCost = "YES";
	    return {
	      data: {
	        shop: system.sessionStore.getSession().shop.code,
	        clCost: clCost
	      },
	      fields: [{ name: 'sh_code', title: 'info.total.shop_code', width: '70px' }, { name: 'p_code', title: 'info.total.p_code', width: '80px' }, { name: 'p_desc', title: 'info.total.product_name', width: '100px' }, { name: 'c_code', title: 'info.total.com_code', width: '100px' }, { name: 'spec', title: 'info.total.spec', width: '80px' }, { name: 'serial', title: 'info.total.serial', width: '100px' }, { name: 'date_in', title: 'info.total.date_in', className: 'center', width: '100px' }, { name: 'barcode', title: 'info.total.barcode', width: '90px' }, { name: 'qty', title: 'info.total.total', className: 'right', width: '60px' },
	      // {name:'qty_yn', title:'info.total.total', width:'60px',render:function(){
	      //   return (  <FlexCheckbox />)
	      // }.bind(this)},
	      { name: 'cost', title: 'info.total.cost', className: 'right', width: '85px', render: function (row) {
	          return helper.numberFormat(row.cost, 2);
	        }.bind(this) }, { name: 'po_cost', title: 'info.total.po_cost', className: 'right', width: '85px', render: function (row) {
	          var Results = "";
	          if (clCost == "YES") {
	            Results = helper.numberFormat(row.po_cost, 2);
	          } else {
	            Results = "";
	          }
	          return Results;
	        }.bind(this) }, { name: 'prod_age_month', title: 'info.total.prod_age_month', className: 'right', width: '60px' }, { name: 'prod_age_day', title: 'info.total.prod_age_day', className: 'right', width: '40px' }, { name: 'vat', title: 'info.total.vat', className: 'right', width: '60px' }, { name: 'status', title: 'info.total.status', className: 'center', width: '60px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement('div', { className: 'flex' });
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    var st = this.state.idSt;
	    Actions.getById(st);
	  },

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

	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'title.list_aginginfo', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'info.total.shop_code', list: list },
	            data: this.state.data,
	            onChange: this.handleShopChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'info-info-aging',
	          listAction: agingActions.list,
	          exportAction: agingActions.export,
	          fields: this.state.fields,
	          sortBy: 'sh_code',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: { shop: this.state.data.shop == '*' ? null : this.state.data.shop }
	        })
	      )
	    );
	  }
	});

	module.exports = InfoAging;

/***/ },

/***/ 942:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] }
	});

/***/ },

/***/ 943:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var agingActions = __webpack_require__(942);

	var infoStore = Reflux.createStore({
	  listenables: [agingActions],

	  // pendingActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/info/listAginginfo', param, this.doneList);
	  },

	  doneList: function doneList(res) {

	    if (res.status === true) {

	      agingActions.list.done(res.data, res.opt);
	      menuActions.updateCount('info', res.opt.totalRows);
	    } else {

	      agingActions.list.error(res.msg);
	    }
	  },

	  onExport: function onExport(param) {
	    ajaxActions.request('/api/info/exportAginginfo', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      agingActions.export.done(res.file);
	    } else {
	      agingActions.export.error();
	    }
	  }

	});

	module.exports = infoStore;

/***/ },

/***/ 944:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] }
	});

/***/ },

/***/ 945:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var Actions = __webpack_require__(944);

	var contractStore = Reflux.createStore({
	  listenables: [Actions],

	  // contractActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/info/contract/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      Actions.list.done(res.data, res.opt);
	      menuActions.updateCount('info.sell', res.opt.totalRows);
	    } else {
	      Actions.list.error(res.error);
	    }
	  },
	  // contractActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/info/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      Actions.export.done(res.file);
	    } else {
	      Actions.export.error(res.error);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/info/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {

	    if (res.status === true) {
	      Actions.getById.done({
	        closeCost: res.closeCost
	      });
	    } else {
	      Actions.getById.error(res.msg);
	    }
	  }

	});

	module.exports = contractStore;

/***/ },

/***/ 946:
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

	var totalActions = __webpack_require__(947);
	var totalStore = __webpack_require__(948);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexDropdown = widgets.FlexDropdown;

	var storageKey = 'info.info.totalinfo';

	var InfoTotal = React.createClass({
	  displayName: 'InfoTotal',

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
	        shop: system.sessionStore.getSession().shop.code,
	        date_from: '2014-01-11',
	        date_to: '2016-01-11'
	      },
	      fields: [{ name: 'sh_name', title: 'info.total.shop_code', width: '110px' }, { name: 'c_name', title: 'info.total.com_code', width: '200px' }, { name: 'p_code', title: 'info.total.p_code', width: '200px' }, { name: 'p_desc', title: 'info.total.product_name' }, { name: 'total', className: 'right', title: 'info.total.total', width: '70px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement('div', { className: 'flex' });
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    console.log('date=', system.sessionStore.getSession().staff.cur_date);
	    var curDate = new Date(system.sessionStore.getSession().staff.cur_date);
	    //console.log('curdate=',curDate.setDate(curDate.getDate()+730));
	  },

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

	  handleChange: function handleChange(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
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

	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'title.list_totalinfo', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'info.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleShopChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'info-info-total',
	          listAction: totalActions.list,
	          exportAction: totalActions.export,
	          fields: this.state.fields,
	          sortBy: 'sh_code',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: { shop: this.state.data.shop == '*' ? null : this.state.data.shop,
	            date_from: this.state.data.date_from,
	            date_to: this.state.data.date_to
	          }
	        })
	      )
	    );
	  }
	});

	module.exports = InfoTotal;

/***/ },

/***/ 947:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] }
	});

/***/ },

/***/ 948:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var totalActions = __webpack_require__(947);

	var infoStore = Reflux.createStore({
	  listenables: [totalActions],

	  // pendingActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/info/listTotalinfo', param, this.doneList);
	  },

	  doneList: function doneList(res) {

	    if (res.status === true) {

	      totalActions.list.done(res.data, res.opt);
	      menuActions.updateCount('info', res.opt.totalRows);
	    } else {

	      totalActions.list.error(res.msg);
	    }
	  },

	  onExport: function onExport(param) {
	    ajaxActions.request('/api/info/exportTotalinfo', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      totalActions.export.done(res.file);
	    } else {
	      totalActions.export.error();
	    }
	  }

	});

	module.exports = infoStore;

/***/ },

/***/ 949:
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

	var stockActions = __webpack_require__(950);
	var stockStore = __webpack_require__(951);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexCheckbox = widgets.FlexCheckbox;

	var storageKey = 'info.info.stockinfo';

	var InfoList = React.createClass({
	  displayName: 'InfoList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(stockActions.getById.done, 'onGetByIdDoneAction')],

	  getInitialState: function getInitialState() {
	    var shops = system.acl.getShopAcl();
	    var option = storage.load(storageKey, { shop_code: '' });
	    var shop_code = '';

	    if (option.shop_code == '') {
	      shop_code = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    } else {
	      shop_code = option.shop_code;
	    }

	    var chkQtyYn = true;

	    var clCost = "YES";

	    return {
	      data: {
	        shop: system.sessionStore.getSession().shop.code,
	        closeCost: clCost
	      },
	      fields: [{ name: 'sh_code', title: 'info.total.shop_code', width: '80px' }, { name: 'p_group', title: 'info.total.p_group', width: '80px' }, { name: 'p_code', title: 'info.total.p_code', width: '80px' }, { name: 'p_desc', title: 'info.total.product_name', width: '100px', render: function (row) {
	          return React.createElement(
	            'div',
	            { title: row.p_desc },
	            row.p_desc
	          );
	        }.bind(this) }, { name: 'c_code', title: 'info.total.com_code', width: '80px' }, { name: 'spec', title: 'info.total.spec', width: '80px' }, { name: 'serial', title: 'info.total.serial', width: '120px' }, { name: 'date_in', title: 'info.total.date_in', className: 'center', width: '110px' }, { name: 'barcode', title: 'info.total.barcode', className: 'center', width: '100px' }, { name: 'qty', title: 'info.total.total', className: 'right', width: '60px' },
	      // {name:'qty_yn', title:'info.total.total', width:'60px',render:function(){
	      //   return (  <FlexCheckbox />)
	      // }.bind(this)},
	      { name: 'po_cost', title: 'info.total.po_cost', className: 'right', width: '80px', render: function (row) {
	          var Results = "";
	          if (this.state.data.closeCost == "NO") {
	            Results = helper.numberFormat(row.po_cost, 2);
	          } else {
	            Results = "";
	          }
	          return Results;
	        }.bind(this) }, { name: 'cost', title: 'info.total.cost', className: 'right', width: '80px', render: function (row) {
	          var Results = "";
	          if (this.state.data.closeCost == "NO") {
	            Results = helper.numberFormat(row.cost, 2);
	          } else {
	            Results = "";
	          }
	          return Results;
	        }.bind(this) }, { name: 'vat', title: 'info.total.vat', className: 'right', width: '60px' }, { name: 'status', title: 'info.total.status', className: 'right', width: '60px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement('div', { className: 'flex' });
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    stockActions.getById();
	  },

	  onGetByIdDoneAction: function onGetByIdDoneAction(data) {

	    if (data == false) {
	      this.state.data.closeCost = "YES";
	    } else {
	      this.state.data.closeCost = "NO";
	    }

	    this.setState({
	      data: {
	        closeCost: this.state.data.closeCost
	      }
	    });
	  },

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

	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'title.list_stockinfo', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'info.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleShopChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'info-info-stockinfo',
	          listAction: stockActions.list,
	          exportAction: stockActions.export,
	          fields: this.state.fields,
	          sortBy: 'sh_code',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: { shop: this.state.data.shop == '*' ? null : this.state.data.shop }
	        })
	      )
	    );
	  }
	});

	module.exports = InfoList;

/***/ },

/***/ 950:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] }
	});

/***/ },

/***/ 951:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var stockActions = __webpack_require__(950);

	var infoStore = Reflux.createStore({
	  listenables: [stockActions],

	  // pendingActions.list
	  onList: function onList(param) {
	    console.log('param:', param);
	    ajaxActions.request('/api/info/listStockinfo', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    console.log('res:', res);
	    if (res.status === true) {

	      stockActions.list.done(res.data, res.opt, res.clCost);
	      menuActions.updateCount('info', res.opt.totalRows);
	    } else {

	      stockActions.list.error(res.msg);
	    }
	  },

	  onExport: function onExport(param) {
	    ajaxActions.request('/api/info/exportStockinfo', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      stockActions.export.done(res.file);
	    } else {
	      stockActions.export.error();
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/info/getById', { id: system.sessionStore.getSession().staff.id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    console.log('resksksks:', res);
	    if (res.status === true) {
	      stockActions.getById.done(res.data.closeCost);
	    } else {
	      cashDailyActions.getById.error(res.msg);
	    }
	  }

	});

	module.exports = infoStore;

/***/ },

/***/ 952:
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

	var stockinActions = __webpack_require__(953);
	var stockinStore = __webpack_require__(954);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexCheckbox = widgets.FlexCheckbox;

	var storageKey = 'info.info.stockininfo';

	var InfoList = React.createClass({
	  displayName: 'InfoList',

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

	    var chkQtyYn = true;
	    var clCost = "YES";
	    return {
	      data: {
	        shop: system.sessionStore.getSession().shop.code
	      },
	      fields: [{ name: 'sh_code', title: 'info.total.shop_code', width: '70px' }, { name: 'timestamp', title: 'info.total.date_in', width: '150px', render: function render(row) {
	          return row.timestamp;
	        } }, { name: 'po_no', title: 'info.total.po_no', width: '110px' }, { name: 'ref_inv', title: 'info.total.ref_inv', width: '110px' }, { name: 'ref_date', title: 'info.total.ref_date', width: '110px', render: function render(row) {
	          return row.ref_date;
	        } }, { name: 'c_code', title: 'info.total.com_code', width: '100px' }, { name: 'p_code', title: 'info.total.p_code', width: '80px' }, { name: 'p_desc', title: 'info.total.product_name', width: '100px' }, { name: 'spec', title: 'info.total.spec', width: '80px' }, { name: 'serial', title: 'info.total.serial', width: '100px' }, { name: 'barcode', title: 'info.total.barcode', width: '90px' }, { name: 'qty', title: 'info.total.total', className: "right", width: '60px' },
	      // {name:'qty_yn', title:'info.total.total', width:'60px',render:function(){
	      //   return (  <FlexCheckbox />)
	      // }.bind(this)},
	      { name: 'cost', title: 'info.total.po_cost', className: "right", width: '70px', render: function (row) {
	          var Results = "";
	          if (clCost == "YES") {
	            Results = helper.numberFormat(row.cost, 2);
	          } else {
	            Results = "";
	          }
	          return Results;
	        }.bind(this) }, { name: 'vat', title: 'info.total.vat', className: "right", width: '60px' }, { name: 'voucher_payment_status', title: 'info.total.voucher_payment_status', width: '100px' }, { name: 'nickname', title: 'info.total.bystaff', width: '60px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement('div', { className: 'flex' });
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

	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'title.list_stockininfo', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'info.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleShopChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'info-info-stockin',
	          listAction: stockinActions.list,
	          exportAction: stockinActions.export,
	          fields: this.state.fields,
	          sortBy: 'sd_id',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: { shop: this.state.data.shop == '*' ? null : this.state.data.shop }
	        })
	      )
	    );
	  }
	});

	module.exports = InfoList;

/***/ },

/***/ 953:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] }
	});

/***/ },

/***/ 954:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var stockinActions = __webpack_require__(953);

	var infoStore = Reflux.createStore({
	  listenables: [stockinActions],

	  // pendingActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/info/listStockininfo', param, this.doneList);
	  },

	  doneList: function doneList(res) {

	    if (res.status === true) {

	      stockinActions.list.done(res.data, res.opt);
	      menuActions.updateCount('info', res.opt.totalRows);
	    } else {

	      stockinActions.list.error(res.msg);
	    }
	  },

	  onExport: function onExport(param) {
	    console.log('oamrmrmrmfmsdlksadmlfjsajflsajdlkfalskfljka');

	    ajaxActions.request('/api/info/exportStockininfo', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {

	    console.log('Status=' + res.status);
	    if (res.status === true) {
	      stockinActions.export.done(res.file);
	    } else {
	      stockinActions.export.error();
	    }
	  }

	});

	module.exports = infoStore;

/***/ },

/***/ 955:
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

	var transferActions = __webpack_require__(956);
	var transferStore = __webpack_require__(957);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexCheckbox = widgets.FlexCheckbox;

	var storageKey = 'info.info.transfer';

	var InfoList = React.createClass({
	  displayName: 'InfoList',

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

	    var clCost = "YES";

	    return {
	      data: {
	        from_shop: system.sessionStore.getSession().shop.code
	      },
	      fields: [{ name: 'trans_date', title: 'info.total.date_in', width: '120px' }, { name: 'remark', title: 'info.total.remark', width: '110px' }, { name: 'from_shop', title: 'info.total.from_shop', width: '110px' }, { name: 'to_shop', title: 'info.total.to_shop', width: '110px' }, { name: 'c_code', title: 'info.total.com_code', width: '100px' }, { name: 'p_code', title: 'info.total.p_code', width: '80px' }, { name: 'p_desc', title: 'info.total.product_name', width: '100px' }, { name: 'spec', title: 'info.total.spec', width: '80px' }, { name: 'serial', title: 'info.total.serial', width: '100px' }, { name: 'barcode', title: 'info.total.barcode', width: '90px' }, { name: 'qty', className: 'right', title: 'info.total.total', width: '60px' },
	      // {name:'qty_yn', title:'info.total.total', width:'60px',render:function(){
	      //   return (  <FlexCheckbox />)
	      // }.bind(this)},
	      { name: 'cost', className: 'right', title: 'info.total.po_cost', width: '100px', render: function (row) {
	          var Results = "";
	          if (clCost == "YES") {
	            Results = helper.numberFormat(row.cost, 2);
	          } else {
	            Results = "";
	          }
	          return Results;
	        }.bind(this) }, { name: 'vat', className: 'right', title: 'info.total.vat', width: '60px' }, { name: 'nickname', title: 'info.total.bystaff', width: '60px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement('div', { className: 'flex' });
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {},

	  handleShopChange: function handleShopChange(id, value) {
	    storage.save(storageKey, { shop_code: value });
	    this.setState({
	      data: {
	        from_shop: value
	      }
	    }, function () {
	      this.refs.grid.doRefresh();
	    });
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

	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'title.list_transferinfo', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'from_shop', label: 'info.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleShopChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'info-info-transfer',
	          listAction: transferActions.list,
	          exportAction: transferActions.export,
	          fields: this.state.fields,
	          sortBy: 'transfer_detail_id',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: { from_shop: this.state.data.from_shop == '*' ? null : this.state.data.from_shop }
	        })
	      )
	    );
	  }
	});

	module.exports = InfoList;

/***/ },

/***/ 956:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] }
	});

/***/ },

/***/ 957:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var transferActions = __webpack_require__(956);

	var infoStore = Reflux.createStore({
	  listenables: [transferActions],

	  // pendingActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/info/listTransferinfo', param, this.doneList);
	  },

	  doneList: function doneList(res) {

	    if (res.status === true) {

	      transferActions.list.done(res.data, res.opt);
	      menuActions.updateCount('info', res.opt.totalRows);
	    } else {

	      transferActions.list.error(res.msg);
	    }
	  },

	  onExport: function onExport(param) {
	    ajaxActions.request('/api/info/exportTransferinfo', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      transferActions.export.done(res.file);
	    } else {
	      transferActions.export.error();
	    }
	  }

	});

	module.exports = infoStore;

/***/ },

/***/ 958:
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

	var selldetailActions = __webpack_require__(959);
	var selldetailStore = __webpack_require__(960);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexCheckbox = widgets.FlexCheckbox;

	var storageKey = 'info.info.selldetailinfo';

	var InfoList = React.createClass({
	  displayName: 'InfoList',

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

	    var chkQtyYn = true;
	    var clCost = "YES";
	    return {
	      data: {
	        shop: system.sessionStore.getSession().shop.code
	      },
	      fields: [{ name: 'id', title: 'info.total.id', width: '110px' }, { name: 'sell_date', title: 'info.total.sell_date', width: '110px' }, { name: 'sales_name', title: 'info.total.sales_name', width: '110px' }, { name: 'sh_code', title: 'info.total.shop_code', width: '70px' }, { name: 'c_code', title: 'info.total.customer_code', width: '100px' }, { name: 'c_tel', title: 'info.total.c_tell', width: '100px' }, { name: 'status', title: 'info.total.status', width: '70px' }, { name: 'contract_ref', title: 'info.total.contract_ref', width: '120px' }, { name: 'remark', title: 'info.total.remark', width: '80px' }, { name: 's_code', title: 'info.total.com_code', width: '100px' }, { name: 'p_desc', title: 'info.total.product_name', width: '150px' }, { name: 'serial', title: 'info.total.serial', width: '100px' }, { name: 'barcode', title: 'info.total.barcode', width: '90px' }, { name: 'qty', className: 'right', title: 'info.total.total', width: '60px' }, { name: 'price', className: 'right', title: 'info.total.price', width: '100px', render: function render(row) {
	          return helper.numberFormat(row.price, 2);
	        } }, { name: 'cost', className: 'right', title: 'info.total.po_cost', width: '100px', render: function (row) {
	          var Results = "";
	          if (clCost == "YES") {
	            Results = helper.numberFormat(row.cost, 2);
	          } else {
	            Results = "";
	          }
	          return Results;
	        }.bind(this) }, { name: 'profit', className: 'right', title: 'info.total.profit', width: '100px', render: function render(row) {
	          return helper.numberFormat(row.profit, 2);
	        } }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement('div', { className: 'flex' });
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

	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'title.list_selldetailinfo', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'info.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleShopChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'info-info-selldetail',
	          listAction: selldetailActions.list,
	          exportAction: selldetailActions.export,
	          fields: this.state.fields,
	          sortBy: 'sd_id',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: { shop: this.state.data.shop == '*' ? null : this.state.data.shop }
	        })
	      )
	    );
	  }
	});

	module.exports = InfoList;

/***/ },

/***/ 959:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] }
	});

/***/ },

/***/ 960:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var selldetailActions = __webpack_require__(959);

	var infoStore = Reflux.createStore({
	  listenables: [selldetailActions],

	  // pendingActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/info/listSelldetailinfo', param, this.doneList);
	  },

	  doneList: function doneList(res) {

	    if (res.status === true) {

	      selldetailActions.list.done(res.data, res.opt);
	      menuActions.updateCount('info', res.opt.totalRows);
	    } else {

	      selldetailActions.list.error(res.msg);
	    }
	  },

	  onExport: function onExport(param) {
	    ajaxActions.request('/api/info/exportSelldetailinfo', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      selldetailActions.export.done(res.file);
	    } else {
	      selldetailActions.export.error();
	    }
	  }

	});

	module.exports = infoStore;

/***/ },

/***/ 961:
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

	var returnActions = __webpack_require__(962);
	var returnStore = __webpack_require__(963);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexButton = widgets.FlexButton;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexCheckbox = widgets.FlexCheckbox;

	var storageKey = 'info.info.returninfo';

	var InfoList = React.createClass({
	  displayName: 'InfoList',

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

	    var chkQtyYn = true;
	    var clCost = "YES";
	    return {
	      data: {
	        shop: system.sessionStore.getSession().shop.code
	      },
	      fields: [{ name: 'sh_code', title: 'info.total.shop_code', width: '80px' }, { name: 'return_date', title: 'info.total.date_in', width: '150px' }, { name: 'nickname', title: 'info.total.bystaff', width: '110px' }, { name: 'c_code', title: 'info.total.return_com_code', width: '110px' }, { name: 'p_code', title: 'info.total.p_code', width: '100px' }, { name: 'spec', title: 'info.total.spec', width: '80px' }, { name: 'serial', title: 'info.total.serial', width: '100px' }, { name: 'barcode', title: 'info.total.barcode', width: '90px' }, { name: 'qty', className: 'right', title: 'info.total.total', width: '60px' },
	      // {name:'qty_yn', title:'info.total.total', width:'60px',render:function(){
	      //   return (  <FlexCheckbox />)
	      // }.bind(this)},
	      { name: 'price', className: 'right', title: 'info.total.price', width: '100px', render: function render(row) {
	          return helper.numberFormat(row.price, 2);
	        } }, { name: 'sell_date', title: 'info.total.sell_date', width: '110px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement('div', { className: 'flex' });
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

	    return React.createElement(
	      'div',
	      { className: 'content-page layout-panel' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'title.list_returninfo', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel3 no-shrink flex-form' },
	          React.createElement(FlexDropdown, {
	            field: { id: 'shop', label: 'info.filter_shop', list: list },
	            data: this.state.data,
	            onChange: this.handleShopChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'info-info-returninfo',
	          listAction: returnActions.list,
	          exportAction: returnActions.export,
	          fields: this.state.fields,
	          sortBy: 'sh_code',
	          sortDir: 'DESC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10,
	          filters: { shop: this.state.data.shop == '*' ? null : this.state.data.shop }
	        })
	      )
	    );
	  }
	});

	module.exports = InfoList;

/***/ },

/***/ 962:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] }
	});

/***/ },

/***/ 963:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;

	var returnActions = __webpack_require__(962);

	var infoStore = Reflux.createStore({
	  listenables: [returnActions],

	  // pendingActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/info/listReturninfo', param, this.doneList);
	  },

	  doneList: function doneList(res) {

	    if (res.status === true) {

	      returnActions.list.done(res.data, res.opt);
	      menuActions.updateCount('info', res.opt.totalRows);
	    } else {

	      returninfoActions.list.error(res.msg);
	    }
	  },

	  onExport: function onExport(param) {
	    ajaxActions.request('/api/info/exportReturninfo', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      returnActions.export.done(res.file);
	    } else {
	      returnActions.export.error();
	    }
	  }

	});

	module.exports = infoStore;

/***/ }

});