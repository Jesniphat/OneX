webpackJsonp([112,135],{

/***/ 964:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'groupProductSave': { children: ['done', 'error'] },
	  'groupProductList': { children: ['done', 'error'] },
	  'groupProductItem': { children: ['done', 'error'] },
	  'allProductItem': { children: ['done', 'error'] },
	  'allGroupItem': { children: ['done', 'error'] },
	  'getGroupProudct': { children: ['done', 'error'] },
	  'groupProductDelete': { children: ['done', 'error'] }
	});

/***/ },

/***/ 974:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widgets = __webpack_require__(377);
	var toasterActions = system.toasterActions;
	var helper = system.helper;
	var systemActions = system.systemActions;
	var dialogActions = system.dialogActions;
	var storage = system.storage;
	var systemStore = system.systemStore;
	var storageKey = 'preliminary.group_product.list';
	var infoPanelActions = system.infoPanelActions;

	// import FontIcon from 'material-ui/lib/font-icon'
	// import FlatButton from 'material-ui/lib/flat-button';
	// import RaisedButton from 'material-ui/lib/raised-button';
	// import FloatingActionButton from 'material-ui/lib/floating-action-button';

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexTextInput = widgets.FlexTextInput; // require('../../../widgets/flex-text-input.jsx');
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

	var productAction = __webpack_require__(964);
	var ReFlux = __webpack_require__(335);

	var ProductGroupList = React.createClass({
	  displayName: 'ProductGroupList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [ReFlux.listenTo(productAction.groupProductDelete.done, 'onGroupProductDeletetDoneAction')],
	  onGroupProductDeletetDoneAction: function onGroupProductDeletetDoneAction(data) {
	    this.refs.grid.doRefresh();
	  },
	  getInitialState: function getInitialState() {
	    //    var shops = system.acl.getShopAcl();
	    // var shops = systemStore.getMaster().shops.map(function(shop) {
	    //   return {
	    //     value: shop.code,
	    //     text: shop.code+' '+shop.name
	    //   }
	    // });
	    // shops.unshift({value:'*',text:'* ทุกสาขา'});
	    // var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});

	    // var opt = storage.load(storageKey, {current_status:'ALL', shop:''});
	    // if (opt.shop=='') {
	    //   opt.shop = shops.length > 0 ?
	    //     (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '';
	    // }
	    return {
	      fields: [{ name: 'code', title: 'preliminary.prod_group_id', width: 110 }, { name: 'name', title: 'preliminary.prod_group_name' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          var f = function () {
	            productAction.groupProductDelete(row);
	          }.bind(this);
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              null,
	              React.createElement(FlexIcon, { to: "/preliminary/group_product/edit/" + row.id, icon: 'create3', title: 'action.select' })
	            ),
	            React.createElement(
	              'div',
	              { onClick: f },
	              React.createElement(FlexIcon, { icon: 'rubbish', title: 'action.select' })
	            )
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    // console.log(system.sessionStore.getSession());
	  },

	  addProductGroup: function addProductGroup(row) {
	    // console.log('add_productGroup');
	    this.props.history.pushState(null, '/preliminary/group_product/edit/0');
	  },

	  handleChange: function handleChange(id, value) {
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

	  handleChange: function handleChange(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	    //console.log(this.state.data.customerTypeFieldList);
	  },

	  render: function render() {
	    var fields = {
	      prodGroupName: {
	        id: 'prodGroupName',
	        label: 'preliminary.prod_group.name',
	        required: true,
	        maxLength: 6
	      }
	    };
	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement('div', { className: 'boxf can-grow' }),
	        React.createElement(
	          'div',
	          { className: 'box2 no-shrink' },
	          React.createElement(FlexButton, {
	            label: 'preliminary.title.cancelCustomerBT',
	            icon: 'add186',
	            'default': false,
	            label: 'preliminary.title.addProductGroupBT',
	            onClick: this.addProductGroup })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'layout-panel content-body panelf' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'preliminary-productgroup-list',
	          listAction: productAction.groupProductList,
	          fields: this.state.fields,
	          pk: 'id',
	          sortBy: 'code',
	          sortDir: 'ASC',
	          limit: 50,
	          checkbox: false,
	          search: true,
	          displayRows: 10
	        })
	      )
	    );
	  }
	});

	module.exports = ProductGroupList;

/***/ }

});