webpackJsonp([32,31,135],{

/***/ 649:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'listPickup': { children: ['done', 'error'] },
	  'exportPickupList': { children: ['done', 'error'] },
	  'getSearchBookingWait': { children: ['done', 'error'] }
	});

/***/ },

/***/ 653:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);
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
	var pickupListActions = __webpack_require__(649);
	var ReFlux = __webpack_require__(337);

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

/***/ 654:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);

	var system = __webpack_require__(356);
	var widget = __webpack_require__(379);
	var sessionStore = system.sessionStore;
	var toasterActions = system.toasterActions;
	var infoPanelActions = system.infoPanelActions;
	var dialogActions = system.dialogActions;
	var helper = system.helper;
	var systemStore = system.systemStore;

	var actions = __webpack_require__(649);

	var FlexDropdown = widget.FlexDropdown;
	var FlexTextInput = widget.FlexTextInput;
	var FlexButton = widget.FlexButton;
	var FlexDataTable = widget.FlexDataTable;
	var FlexCheckbox = widget.FlexCheckbox;

	var s_data_reset = {
	  booking_no: "",
	  customer: "",
	  waybill: "",
	  pickup_date: new Date().toJSON().slice(0, 10),
	  district: ""
	};

	var Screen = React.createClass({
	  displayName: 'Screen',

	  mixins: [
	  // Reflux.listenTo(actions.getPV.done, 'onGetPVDoneActon'),
	  Reflux.listenTo(actions.getSearchBookingWait.done, 'onGetSearchBookingWaitDoneAction'), Reflux.listenTo(actions.getSearchBookingWait.error, 'onGetSearchBookingWaitErrorAction')],

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
	            React.createElement(
	              'span',
	              null,
	              row.booking_no
	            )
	          )
	        );
	      } }, { name: 'product', label: 'bookingSearchTable.customer', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            { className: 'ellipsis', title: row.firstname },
	            row.firstname
	          )
	        );
	      } }, { name: 'cost', label: 'bookingSearchTable.qty', width: '88px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            { className: 'right green' },
	            row.item_qty || 1
	          )
	        );
	      } }, { name: 'chk', label: React.createElement('span', {
	        className: 'flaticon-right244',
	        title: tr.translate('finance.pv.search_table.select_all'),
	        onClick: function onClick() {
	          me.addAllToPickup();
	        }
	      }), raw: true, width: '32px', render: function render(row, i) {
	        if (row.status == 'WAIT_ASSIGN' || me.state.prevItems[row.stockin_id]) {
	          return React.createElement('span', { className: 'flaticon-right237', onClick: function onClick() {
	              me.addToPickup(row, i);
	            } });
	        } else {
	          return null;
	        }
	      } }];

	    this.pickupTable = [{ name: 'code', label: 'pickupTable.booking_no', width: '160px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            null,
	            React.createElement(
	              'span',
	              { className: 'blue' },
	              row.booking_no
	            )
	          )
	        );
	      } }, { name: 'product', label: 'pickupTable.customer', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline', style: { whiteSpace: 'normal' } },
	          row.firstname
	        );
	      } }, { name: 'serial', label: 'pickupTable.package_content', width: '160px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            { className: 'green' },
	            row.package_contents
	          )
	        );
	      } }, { name: 'cost', label: 'pickupTable.qty', width: '104px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            { className: 'right' },
	            row.item_qty || 1
	          )
	        );
	      } }, { name: 'chk', label: React.createElement('span', {
	        className: 'flaticon-clear5',
	        title: tr.translate('pickupTable.remove_all'),
	        onClick: function onClick() {
	          me.removeAllFromVoucher();
	        }
	      }), raw: true, width: '32px', render: function render(row, i) {
	        return React.createElement('span', { className: 'flaticon-clear5', onClick: function onClick() {
	            me.removeFromVoucher(row, i);
	          } });
	      } }];

	    return {
	      s_data: helper.clone(s_data_reset),
	      p_data: {},
	      pv: {
	        id: id,
	        code: '',
	        document_date: helper.dateToString(new Date()),
	        booking_id: 0,
	        booking: '',
	        staff_id: staff.id,
	        staff: staff.display_name,
	        remark: '',
	        status: 'DRAFT',
	        total_amount: 0,
	        vat_amount: 0,
	        cn_code: '',
	        cn_amount: 0,
	        net_amount: 0
	      },
	      bookingBox: [],
	      pvItems: [],
	      prevItems: {},
	      prev_status: 'DRAFT'
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    //infoPanelActions.show('finance.pv.list', null);
	  },

	  handleSearchChange: function handleSearchChange(id, value) {
	    this.state.s_data[id] = value;
	    this.setState({
	      filter: this.state.filter
	    });
	  },

	  doSearch: function doSearch() {
	    console.log(this.state.s_data);
	    var obj = this.state.s_data;
	    actions.getSearchBookingWait(obj);
	  },

	  onGetSearchBookingWaitDoneAction: function onGetSearchBookingWaitDoneAction(result) {
	    console.log("onGetSearchBookingWaitDoneAction = ", result);

	    if (result.length == 0) {
	      toasterActions.pop({
	        type: 'warning',
	        message: 'ไม่พบรายการตามที่ระบุ'
	      });
	    }

	    var existing = {};
	    this.state.pvItems.forEach(function (item) {
	      existing[item.id] = true;
	    });

	    this.setState({
	      bookingBox: result.filter(function (row) {
	        return !existing[row.id];
	      })
	    });
	    // console.log("bookingBox = ", this.state.bookingBox);
	    this.state.pv.booking_id = result[0].id;
	    this.state.pv.booking_no = result[0].booking_no;
	    this.setState({
	      pv: this.state.pv
	    });
	    console.log('Code:', this.state.pv.booking_no, ',id:', this.state.pv.booking_id);
	  },

	  onGetSearchBookingWaitErrorAction: function onGetSearchBookingWaitErrorAction(error) {
	    toasterActions.pop({
	      type: 'warning',
	      message: error
	    });
	  },

	  addToPickup: function addToPickup(row, i) {
	    this.state.pvItems.unshift(this.state.bookingBox[i]);
	    this.state.bookingBox.splice(i, 1);
	    this.setState({
	      pvItems: this.state.pvItems,
	      bookingBox: this.state.bookingBox
	    });
	    console.log("addToPickup : ", this.state.pvItems);
	  },

	  addAllToPickup: function addAllToPickup() {
	    var cnt = 0;
	    this.state.bookingBox.forEach(function (row) {
	      if (row.status == 'WAIT_ASSIGN') {
	        this.state.pvItems.unshift(row);
	        cnt++;
	      }
	    }.bind(this));
	    var len = this.state.bookingBox.length;
	    for (var i = len - 1; i >= 0; i--) {
	      if (this.state.bookingBox[i].status == 'WAIT_ASSIGN') {
	        this.state.bookingBox.splice(i, 1);
	      }
	    }
	    if (cnt == 0) {
	      toasterActions.pop({
	        type: 'warning',
	        message: 'ไม่มีรายการที่จะเพิ่ม'
	      });
	    } else {
	      this.setState({
	        pvItems: this.state.pvItems,
	        bookingBox: this.state.bookingBox
	      });
	    }
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
	        qty: prev.qty + row.item_qty
	      };
	    }, searchSummary);
	    var bookingBoxFooter = React.createElement(
	      'tr',
	      null,
	      React.createElement(
	        'td',
	        { className: 'right' },
	        React.createElement('div', { style: { width: "103px" } })
	      ),
	      React.createElement(
	        'td',
	        { className: 'right' },
	        React.createElement(
	          'div',
	          { style: { width: "109px" } },
	          searchSummary.count,
	          ' Booking'
	        )
	      ),
	      React.createElement(
	        'td',
	        { className: 'right' },
	        React.createElement(
	          'div',
	          { style: { width: "79px" } },
	          searchSummary.qty,
	          ' Item'
	        )
	      ),
	      React.createElement(
	        'td',
	        null,
	        React.createElement('div', { style: { width: "40px" } })
	      )
	    );

	    var pickupSummary = {
	      count: 0,
	      qty: 0,
	      amount: 0,
	      vat_amount: 0
	    };
	    pickupSummary = this.state.pvItems.reduce(function (prev, row) {
	      return {
	        count: prev.count + 1,
	        qty: prev.qty + row.qty,
	        amount: prev.amount + row.qty * row.cost,
	        vat_amount: prev.vat_amount + row.vat_amount
	      };
	    }, pickupSummary);

	    this.state.pv.total_amount = pickupSummary.amount;
	    this.state.pv.vat_amount = pickupSummary.vat_amount;
	    this.state.pv.net_amount = this.state.pv.total_amount + this.state.pv.vat_amount - this.state.pv.cn_amount;

	    var pickupFooter = React.createElement(
	      'tr',
	      null,
	      React.createElement(
	        'td',
	        null,
	        'รวมรายการ'
	      ),
	      React.createElement(
	        'td',
	        { className: 'right' },
	        pickupSummary.count,
	        ' รายการ'
	      ),
	      React.createElement(
	        'td',
	        { className: 'right' },
	        pickupSummary.qty,
	        ' ชิ้น'
	      ),
	      React.createElement(
	        'td',
	        { className: 'right blue', style: { fontSize: '16px' } },
	        helper.numberFormat(pickupSummary.amount, 2)
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
	              data: this.state.s_data,
	              onChange: this.handleSearchChange
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexTextInput, {
	              field: this.fields.customer,
	              data: this.state.s_data,
	              onChange: this.handleSearchChange
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
	              data: this.state.p_data,
	              onChange: this.handleFilterChange
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexTextInput, {
	              field: this.fields.pickup_date_set,
	              data: this.state.p_data,
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
	              data: this.state.p_data,
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
	              data: this.state.s_data,
	              onChange: this.handleSearchChange
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexTextInput, {
	              field: this.fields.pickup_date,
	              data: this.state.s_data,
	              onChange: this.handleSearchChange
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
	              data: this.state.p_data,
	              onChange: this.handleFilterChange
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexTextInput, {
	              field: this.fields.driver,
	              data: this.state.p_data,
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
	              data: this.state.s_data,
	              onChange: this.handleSearchChange
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexButton, { icon: 'search100',
	              label: 'pickupEdit.search',
	              'default': true,
	              onClick: this.doSearch
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
	              data: this.state.p_data,
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
	        ),
	        React.createElement(
	          'div',
	          { className: 'box6' },
	          React.createElement(
	            'div',
	            { className: 'panel6', style: { borderLeft: '1px solid #eee', paddingLeft: '7px' } },
	            React.createElement(FlexDataTable, {
	              fields: this.pickupTable,
	              data: this.state.pvItems,
	              key: 'stockin_id',
	              displayRows: 8,
	              footer: pickupFooter
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