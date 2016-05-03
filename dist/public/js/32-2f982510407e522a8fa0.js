webpackJsonp([32,31,135],{

/***/ 641:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'listPickup': { children: ['done', 'error'] },
	  'exportPickupList': { children: ['done', 'error'] }
	});

/***/ },

/***/ 645:
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
	//var storageKey = 'transport.bookingList.listWaitAssign';
	var infoPanelActions = system.infoPanelActions;

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

	//var customerAction = require('./actions');
	var pickupListActions = __webpack_require__(641);
	var ReFlux = __webpack_require__(335);

	var PickupList = React.createClass({
	  displayName: 'PickupList',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [
	    // ReFlux.listenTo(pickupListActions.cancelBooking.done,'onCancelBookingDoneAction'),
	    // ReFlux.listenTo(pickupListActions.cancelBooking.error,'onCancelBookingErrorAction')
	  ],
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
	      data: {
	        // shop: opt.shop,
	        // current_status: opt.current_status
	      },
	      fields: [{ name: 'pickup_no', title: 'transport.pickup_no' }, { name: 'pickup_date', title: 'transport.pickup_date' }, { name: 'city_district', title: 'transport.city_district' }, //, width:'80px'
	      { name: 'prepare_by', title: 'transport.prepare_by' }, { name: 'driver', title: 'transport.driver' }, { name: 'plan_qty', title: 'transport.plan_qty' }, { name: 'pickup_qty', title: 'transport.pickup_qty' }, { name: 'status', title: 'transport.status' }, { name: 'actions', type: 'actions', width: 2 * 28 + 8 + 'px', render: function (row) {
	          var e = function () {
	            this.onLinkToEdit(row.id);
	          }.bind(this);
	          return React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { onClick: e },
	              React.createElement(FlexIcon, { icon: 'bed24', title: 'action.select' })
	            )
	          );
	        }.bind(this) }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    console.log(system.sessionStore.getSession());
	  },

	  newPickup: function newPickup(row) {
	    console.log('add_customer');
	    this.props.history.pushState(null, '/transport/pickup/pickup_edit/0');
	  },

	  onLinkToEdit: function onLinkToEdit(id) {
	    console.log("Edit booking id = ", id);
	    this.props.history.pushState(null, '/transport/bookingList/edit/' + id);
	  },

	  onCancelBooking: function onCancelBooking(row) {
	    console.log('onCancelBooking = ', row);
	    dialogActions.show({
	      title: 'preliminary.title.confirm_to_delete',
	      content: 'Do you want to cancel ' + row.booking_no + '?',
	      actions: [{ id: 'ok', icon: 'check52', label: 'dialog.confirm' }, { id: 'cancel', icon: 'close47', label: 'dialog.cancel', default: true }]
	    }, function (isCancel, action_id) {
	      if (isCancel || action_id == 'cancel') {
	        return;
	      }
	      console.log('DELETE');
	      pickupListActions.cancelBooking(row);
	    });
	  },

	  handleChange: function handleChange(id, value) {
	    console.log("handleChange");
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
	          React.createElement(T, { content: 'transport.title.headPickupList', component: 'h3' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink flex-form' },
	          React.createElement(FlexButton, {
	            label: 'transport.title.newPickup',
	            icon: 'add184',
	            'default': true,
	            onClick: this.newPickup
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { style: { width: '1094px' } },
	        React.createElement(
	          'div',
	          { className: 'content-body panelf', style: { minHeight: '543px' } },
	          React.createElement('div', { stule: { clear: 'both' } }),
	          React.createElement(
	            'div',
	            null,
	            React.createElement(FlexGrid, {
	              ref: 'grid',
	              id: 'pickup_list',
	              listAction: pickupListActions.listPickup,
	              exportAction: pickupListActions.exportPickupList,
	              fields: this.state.fields,
	              pk: 'id',
	              sortBy: 'pickup_no',
	              sortDir: 'ASC',
	              limit: 50,
	              checkbox: false,
	              search: true,
	              displayRows: 12
	            })
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = PickupList;

/***/ },

/***/ 646:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(381);

	var system = __webpack_require__(354);
	var widget = __webpack_require__(377);
	var sessionStore = system.sessionStore;
	var toasterActions = system.toasterActions;
	var infoPanelActions = system.infoPanelActions;
	var dialogActions = system.dialogActions;
	var helper = system.helper;
	var systemStore = system.systemStore;

	var actions = __webpack_require__(641);

	var FlexDropdown = widget.FlexDropdown;
	var FlexTextInput = widget.FlexTextInput;
	var FlexButton = widget.FlexButton;
	var FlexDataTable = widget.FlexDataTable;
	var FlexCheckbox = widget.FlexCheckbox;

	var Screen = React.createClass({
	  displayName: 'Screen',

	  mixins: [
	    // Reflux.listenTo(actions.getPV.done, 'onGetPVDoneActon'),
	  ],

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    var id = this.props.params.id;
	    console.log('id', id);
	    var me = this;
	    var staff = sessionStore.getSession().staff;
	    console.log('staff', staff);

	    this.fields = {
	      booking_no: {
	        id: 'booking_no',
	        type: 'text',
	        label: 'pickupEdit.booking_no'
	      },
	      customer: {
	        id: 'customer',
	        type: 'text',
	        label: 'pickupEdit.customer'
	      },
	      pickup_no: {
	        id: 'pickup_no',
	        type: 'text',
	        label: 'pickupEdit.pickup_no'
	      },
	      pickup_date_set: {
	        id: 'pickup_date_set',
	        type: 'date',
	        label: 'pickupEdit.pickup_date_set'
	      },
	      waybill: {
	        id: 'waybill',
	        type: 'text',
	        label: 'pickupEdit.waybill'
	      },
	      pickup_date: {
	        id: 'pickup_date',
	        type: 'date',
	        label: 'pickupEdit.pickup_date'
	      },
	      prepare_by: {
	        id: 'prepare_by',
	        type: 'text',
	        label: 'pickupEdit.prepare_by'
	      },
	      driver: {
	        id: 'driver',
	        type: 'text',
	        label: 'pickupEdit.driver'
	      },
	      district: {
	        id: 'district',
	        type: 'text',
	        label: 'pickupEdit.district'
	      },
	      remark: {
	        id: 'remark',
	        type: 'text',
	        label: 'pickupEdit.remark'
	      }
	    };

	    this.bookingBoxTable = [{ name: 'code', label: 'bookingSearchTable.booking_no', width: '112px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            null,
	            'P:',
	            React.createElement(
	              'span',
	              { className: 'green' },
	              row.po_code
	            )
	          ),
	          React.createElement(
	            'div',
	            null,
	            'I:',
	            React.createElement(
	              'span',
	              { className: 'blue' },
	              row.invoice_code
	            )
	          )
	        );
	      } }, { name: 'product', label: 'bookingSearchTable.customer', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            { className: 'ellipsis', title: row.product },
	            row.product
	          ),
	          React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { className: 'ellipsis' },
	              'S:',
	              React.createElement(
	                'span',
	                { className: 'green', title: row.serial },
	                row.serial
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'can-grow no-shrink right' },
	              'B:',
	              React.createElement(
	                'span',
	                { className: 'blue' },
	                row.barcode
	              )
	            )
	          )
	        );
	      } }, { name: 'cost', label: 'bookingSearchTable.qty', width: '88px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            { className: 'right green' },
	            row.qty || 1,
	            ' x'
	          ),
	          React.createElement(
	            'div',
	            { className: 'right blue' },
	            helper.numberFormat(row.cost, 2)
	          )
	        );
	      } }, { name: 'chk', label: React.createElement('span', {
	        className: 'flaticon-right244',
	        title: tr.translate('bookingSearchTable.select_all'),
	        onClick: function onClick() {
	          me.addAllToVouher();
	        }
	      }), raw: true, width: '32px', render: function render(row, i) {
	        return React.createElement('span', { className: 'flaticon-right237', onClick: function onClick() {
	            me.addToVoucher(row, i);
	          } });
	      } }];

	    return {
	      data: {
	        po_code: '',
	        invoice_code: '',
	        invoice_date: '',
	        supplier: '',
	        product: '',
	        shop_code: ''
	      },
	      bookingBox: [{ po_code: 'a', invoice_code: 'b', product: 'C', serial: 'D', barcode: 'E', qty: 5, cost: 10, stockin_id: '1', amount: 200 }]
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    //infoPanelActions.show('finance.pv.list', null);
	  },

	  handleFilterChange: function handleFilterChange(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      filter: this.state.filter
	    });
	  },

	  render: function render() {
	    var searchSummary = {
	      count: 0,
	      qty: 0,
	      amount: 0
	    };
	    searchSummary = this.state.bookingBox.reduce(function (prev, row) {
	      return {
	        count: prev.count + 1,
	        qty: prev.qty + row.qty,
	        amount: prev.amount + row.qty * row.cost
	      };
	    }, searchSummary);
	    var bookingBoxFooter = React.createElement(
	      'tr',
	      null,
	      React.createElement(
	        'td',
	        { colSpan: '2', className: 'right' },
	        searchSummary.count,
	        ' รายการ'
	      ),
	      React.createElement(
	        'td',
	        { className: 'right' },
	        searchSummary.qty,
	        ' ชิ้น'
	      ),
	      React.createElement(
	        'td',
	        { className: 'right' },
	        helper.numberFormat(searchSummary.amount, 2)
	      ),
	      React.createElement('td', null)
	    );

	    return React.createElement(
	      'div',
	      { className: 'flex-form' },
	      React.createElement(
	        'div',
	        { className: 'box10' },
	        React.createElement(
	          'div',
	          { className: 'panel5 flex' },
	          React.createElement(
	            'p',
	            null,
	            'Pickup schedule'
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'box4' },
	          React.createElement(
	            'div',
	            { className: 'panel4 flex' },
	            React.createElement(FlexTextInput, {
	              field: this.fields.booking_no,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexTextInput, {
	              field: this.fields.customer,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box4' },
	          React.createElement(
	            'div',
	            { className: 'panel4 flex' },
	            React.createElement(FlexTextInput, {
	              field: this.fields.pickup_no,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexTextInput, {
	              field: this.fields.pickup_date_set,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box2' },
	          React.createElement(
	            'div',
	            { className: 'panel2 flex' },
	            React.createElement(FlexTextInput, {
	              field: this.fields.status,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'box4' },
	          React.createElement(
	            'div',
	            { className: 'panel4 flex' },
	            React.createElement(FlexTextInput, {
	              field: this.fields.waybill,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexTextInput, {
	              field: this.fields.pickup_date,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box4' },
	          React.createElement(
	            'div',
	            { className: 'panel4 flex' },
	            React.createElement(FlexTextInput, {
	              field: this.fields.prepare_by,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexTextInput, {
	              field: this.fields.driver,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box2' },
	          React.createElement(
	            'div',
	            { className: 'panel2 flex' },
	            React.createElement(FlexButton, { icon: 'email107',
	              label: 'pickupEdit.save',
	              'default': true,
	              onClick: this.doSave
	            })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'box4' },
	          React.createElement(
	            'div',
	            { className: 'panel4 flex' },
	            React.createElement(FlexTextInput, {
	              field: this.fields.district,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexButton, { icon: 'email107',
	              label: 'pickupEdit.search',
	              'default': true,
	              onClick: this.doSave
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box4' },
	          React.createElement(
	            'div',
	            { className: 'panel4 flex' },
	            React.createElement(FlexTextInput, {
	              field: this.fields.remark,
	              data: this.state.data,
	              onChange: this.handleFilterChange
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box2' },
	          React.createElement(
	            'div',
	            { className: 'panel2 flex' },
	            React.createElement(FlexButton, { icon: 'printer88',
	              label: 'pickupEdit.print',
	              onClick: this.doPrint
	            })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'box10 flex' },
	        React.createElement(
	          'div',
	          { className: 'box4' },
	          React.createElement(
	            'div',
	            { className: 'panel4', style: { borderRight: '1px solid #eee', paddingRight: '1px' } },
	            React.createElement(FlexDataTable, {
	              fields: this.bookingBoxTable,
	              data: this.state.bookingBox,
	              key: 'stockin_id',
	              displayRows: 8,
	              footer: bookingBoxFooter
	            })
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = Screen;

/***/ }

});