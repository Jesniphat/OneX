webpackJsonp([95,135],{

/***/ 898:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getById': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'delete': { children: ['done', 'error'] }
	});

/***/ },

/***/ 899:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var shopActions = __webpack_require__(898);

	var shopStore = Reflux.createStore({
	  listenables: [shopActions],

	  // shopActions.list
	  onList: function onList(param) {
	    ajaxActions.request('/api/setting/shop/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      shopActions.list.done(res.data, res.opt);
	      //      menuActions.updateCount('shop', res.opt.totalRows);
	    } else {
	        shopActions.list.error(res.msg);
	      }
	  },

	  // shopActions.export
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/setting/shop/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      shopActions.export.done(res.file);
	    } else {
	      shopActions.export.error(res.msg);
	    }
	  },

	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/setting/shop/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      shopActions.getById.done(res.data);
	    } else {
	      shopActions.getById.error(res.msg);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/setting/shop/save', { data: data }, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      shopActions.save.done(res.data);
	      //      menuActions.updateCount('shop', res.totalRows);
	    } else {
	        shopActions.save.error(res.msg);
	      }
	  },

	  onDelete: function onDelete(id) {
	    ajaxActions.request('/api/setting/shop/delete', { id: id }, this.doneDelete);
	  },

	  doneDelete: function doneDelete(res) {
	    if (res.status === true) {
	      shopActions.delete.done(res.data);
	    } else {
	      shopActions.delete.error(res.msg);
	    }
	  }
	});

	module.exports = shopStore;

/***/ },

/***/ 924:
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

	var systemActions = system.systemActions; //require('../../system/actions');
	var infoPanelActions = system.infoPanelActions; //require('../../system/actions/info-panel');
	var dialogActions = system.dialogActions; //require('../../system/actions/dialog');
	var toasterActions = system.toasterActions; //require('../../system/actions/toaster');

	var shopActions = __webpack_require__(898);
	var shopStore = __webpack_require__(899);

	var FlexGrid = widgets.FlexGrid; //require('../../../widgets/flex-grid.jsx');
	var FlexIcon = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

	var ShopList = React.createClass({
	  displayName: 'ShopList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(shopActions.delete.done, 'onDeleteDoneAction'), Reflux.listenTo(shopActions.delete.error, 'onDeleteErrorAction')],

	  getInitialState: function getInitialState() {
	    return {
	      fields: [{ name: 'code', title: 'shop.code', width: '100px' }, { name: 'prefix_barcode', title: 'shop.prefix_barcode', width: '80px' }, { name: 'name', title: 'shop.name', width: '200px' }, { name: 'location', title: 'shop.location' }, { name: 'tel', title: 'shop.tel', width: '120px' }, { name: 'fax', title: 'shop.fax', width: '120px' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(FlexIcon, { to: 'setting.shop.edit', param: { id: row.id }, icon: 'create3', title: 'action.edit' }),
	            React.createElement(FlexIcon, { icon: 'rubbish', title: 'action.delete', onClick: function (e) {
	                this.doDelete(e, row.id);
	              }.bind(this) })
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {},

	  doShopNew: function doShopNew() {
	    this.context.router.transitionTo('setting.shop.edit', { id: 0 });
	  },

	  doDelete: function doDelete(e, id) {
	    e.preventDefault();

	    dialogActions.show({
	      title: 'dialog.title.confirm_to_delete',
	      content: 'ข้อมูลจะถูกลบถาวร ยืนยันหรือไม่',
	      actions: [{ id: 'ok', icon: 'check52', label: 'dialog.confirm' }, { id: 'cancel', icon: 'close47', label: 'dialog.cancel', default: true }]
	    }, function (isCancel, action_id) {
	      if (isCancel || action_id == 'cancel') {
	        return;
	      }
	      shopActions.delete(id);
	    });
	  },

	  onDeleteDoneAction: function onDeleteDoneAction() {
	    toasterActions.pop({
	      type: 'success',
	      message: 'delete.ok'
	    });
	    this.refs.grid.doRefresh();
	    //    console.log(this.refs);
	  },

	  onDeleteErrorAction: function onDeleteErrorAction(result) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'error.delete'
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
	          React.createElement(T, { content: 'shop.title.list', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'boxf flex no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel2 no-shrink' },
	            React.createElement(FlexButton, { icon: 'add186', label: 'shop.action.new',
	              onClick: this.doShopNew })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(FlexGrid, {
	          id: 'setting-shop-list',
	          ref: 'grid',
	          listAction: shopActions.list,
	          exportAction: shopActions.export,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'code',
	          sortDir: 'ASC',
	          limit: 10,
	          checkbox: false,
	          search: true
	        })
	      )
	    );
	  }
	});

	module.exports = ShopList;

/***/ }

});