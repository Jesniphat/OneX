webpackJsonp([31,135],{

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

/***/ }

});