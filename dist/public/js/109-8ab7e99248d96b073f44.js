webpackJsonp([109,135],{

/***/ 959:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getMemberType': { children: ['done', 'error'] },
	  'getCustomerData': { children: ['done', 'error'] },
	  'getContactListData': { children: ['done', 'error'] },
	  'getBillingListData': { children: ['done', 'error'] },
	  'saveCustomers': { children: ['done', 'error'] },
	  'editCustomers': { children: ['done', 'error'] },
	  'deleteCustomers': { children: ['done', 'error'] },
	  'getCurrencyFromBase': { children: ['done', 'error'] }
	});

/***/ },

/***/ 971:
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
	var storageKey = 'preliminary.customer.list';
	var infoPanelActions = system.infoPanelActions;

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

	var customerAction = __webpack_require__(959);
	var ReFlux = __webpack_require__(335);

	var CustomerList = React.createClass({
	  displayName: 'CustomerList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [ReFlux.listenTo(customerAction.deleteCustomers.done, 'onDeleteCustomersDoneAction'), ReFlux.listenTo(customerAction.deleteCustomers.error, 'onDeleteCustomersErrorAction')],
	  getInitialState: function getInitialState() {
	    //    var shops = system.acl.getShopAcl();
	    var shops = systemStore.getMaster().shops.map(function (shop) {
	      return {
	        value: shop.code,
	        text: shop.code + ' ' + shop.name
	      };
	    });
	    shops.unshift({ value: '*', text: '* ทุกสาขา' });
	    var monthYear = tr.localize(new Date(), { type: 'date', format: 'monthYear' });

	    var opt = storage.load(storageKey, { current_status: 'ALL', shop: '' });
	    if (opt.shop == '') {
	      opt.shop = shops.length > 0 ? system.acl.hasAcl({ setting: ['INST_CON_VIEW_ADMIN'] }) ? '*' : shops[0].code : '';
	    }
	    //console.log("Data From Innitail = ", opt.shop, shops, opt);
	    return {
	      data: {
	        shop: opt.shop,
	        current_status: opt.current_status
	      },
	      fields: [{ name: 'customer_code', title: 'preliminary.customer_code' }, { name: 'fullname', title: 'preliminary.fullname' }, { name: 'type', title: 'preliminary.type' }, //, width:'80px'
	      { name: 'member_type_name', title: 'preliminary.nation' },
	      //{name:'last_uses_at', title:'preliminary.last_uses_at'},
	      // {name:'shop_name', title:'preliminary.shop_name'},
	      { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          var e = function () {
	            this.onLinkToEdit(row.person_id);
	          }.bind(this);
	          var f = function () {
	            this.onDeleteCustomer(row);
	          }.bind(this);
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { onClick: e },
	              React.createElement(FlexIcon, { icon: 'create3', title: 'action.select' })
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
	    console.log(system.sessionStore.getSession());
	  },

	  addCustomer: function addCustomer(row) {
	    console.log('add_customer');
	    this.props.history.pushState(null, '/preliminary/customer/edit/0');
	  },

	  onLinkToEdit: function onLinkToEdit(id) {
	    console.log(id);
	    this.props.history.pushState(null, '/preliminary/customer/edit/' + id);
	  },

	  onDeleteCustomer: function onDeleteCustomer(row) {
	    console.log('To Delete some thing', row);
	    dialogActions.show({
	      title: 'preliminary.title.confirm_to_delete',
	      content: 'ต้อการลบขอมูลสมาชิก ' + row.fullname + ' หรือไม่',
	      actions: [{ id: 'ok', icon: 'check52', label: 'dialog.confirm' }, { id: 'cancel', icon: 'close47', label: 'dialog.cancel', default: true }]
	    }, function (isCancel, action_id) {
	      if (isCancel || action_id == 'cancel') {
	        return;
	      }
	      console.log('DELETE');
	      customerAction.deleteCustomers(row);
	    });
	  },

	  onDeleteCustomersDoneAction: function onDeleteCustomersDoneAction(data) {
	    toasterActions.pop({
	      type: 'success',
	      message: data.done
	    });
	    this.refs.grid.doRefresh();
	  },

	  onDeleteCustomersErrorAction: function onDeleteCustomersErrorAction(errors) {
	    toasterActions.pop({
	      type: 'warning',
	      message: 'ลบข้อมูลไม่สำเร็จ ' + errors
	    });
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

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'layout-panel content-page' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'preliminary.title.head', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink flex-form' },
	          React.createElement(FlexButton, {
	            label: 'preliminary.title.addCustomerBT',
	            icon: 'add184',
	            'default': true,
	            onClick: this.addCustomer
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf ' },
	        React.createElement(FlexGrid, {
	          ref: 'grid',
	          id: 'preliminary-customer-list',
	          listAction: customerAction.list,
	          exportAction: customerAction.export,
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
	            shop: this.state.data.shop == '*' ? null : this.state.data.shop,
	            current_status: this.state.data.current_status == 'ALL' ? null : this.state.data.current_status
	          }
	        })
	      )
	    );
	  }
	});

	module.exports = CustomerList;

/***/ }

});