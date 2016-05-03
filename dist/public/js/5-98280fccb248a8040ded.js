webpackJsonp([5,135],{

/***/ 518:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'fareUpload': { children: ['done', 'error'] },
	  'listFareZone': { children: ['done', 'error'] },
	  'listFareRate': { children: ['done', 'error'] }
	});

/***/ },

/***/ 528:
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
	var infoPanelActions = system.infoPanelActions;

	var FlexGrid = widgets.FlexGrid;
	var FlexDisplayTable = widgets.FlexDisplayTable; // require('../../../widgets/flex-display-table.jsx');
	var FlexIcon = widgets.FlexIcon;
	var FlexTextInput = widgets.FlexTextInput; // require('../../../widgets/flex-text-input.jsx');
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
	var FlexDataTable = widgets.FlexDataTable;
	var FlexCheckbox = widgets.FlexCheckbox;

	var action = __webpack_require__(518);
	var ReFlux = __webpack_require__(337);

	var ProductGroup = React.createClass({
	  displayName: 'ProductGroup',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [ReFlux.listenTo(action.listFareZone.done, 'onListFareZoneDone')],
	  getInitialState: function getInitialState() {
	    return {
	      Items: []
	    };
	  },

	  onListFareZoneDone: function onListFareZoneDone(data) {
	    var i = 1;
	    this.setState({ Items: data.map(function (item) {
	        item.no = i++;return item;
	      }) });
	  },
	  componentDidMount: function componentDidMount() {
	    action.listFareZone();
	    systemActions.setPageHeader(tr.translate('fareZoneTable.zone_import'));
	  },
	  tableFare: [//No. Group Code Effective Customer level Every Purchase Point
	  { name: 'no', label: 'fareZoneTable.no', width: '48px' }, { name: 'country_origin', label: 'fareZoneTable.country_origin', width: 'auto' }, { name: 'city_origin', label: 'fareZoneTable.city_origin' }, { name: 'district_origin', label: 'fareZoneTable.district_origin', width: 'auto' }, { name: 'country_destination', label: 'fareZoneTable.country_destination', width: 'auto' }, { name: 'city_destination', label: 'fareZoneTable.city_destination', width: 'auto' }, { name: 'district_destination', label: 'fareZoneTable.district_destination', width: 'auto' }, { name: 'zone', label: 'fareZoneTable.zone', width: 'auto' }],
	  render: function render() {

	    return React.createElement(
	      'div',
	      null,
	      React.createElement(FlexDataTable, {
	        fields: this.tableFare,
	        data: this.state.Items,
	        displayRows: 7 })
	    );
	  }
	});

	module.exports = ProductGroup;

/***/ },

/***/ 529:
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
	var infoPanelActions = system.infoPanelActions;

	var FlexGrid = widgets.FlexGrid;
	var FlexDisplayTable = widgets.FlexDisplayTable; // require('../../../widgets/flex-display-table.jsx');
	var FlexIcon = widgets.FlexIcon;
	var FlexTextInput = widgets.FlexTextInput; // require('../../../widgets/flex-text-input.jsx');
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
	var FlexDataTable = widgets.FlexDataTable;
	var FlexCheckbox = widgets.FlexCheckbox;

	var action = __webpack_require__(518);
	var ReFlux = __webpack_require__(337);

	var ProductGroup = React.createClass({
	  displayName: 'ProductGroup',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [ReFlux.listenTo(action.listFareRate.done, 'onListFareZoneDone')],
	  getInitialState: function getInitialState() {
	    return {
	      Items: []
	    };
	  },

	  onListFareZoneDone: function onListFareZoneDone(data) {
	    var i = 1;
	    this.setState({ Items: data.map(function (item) {
	        item.no = i++;return item;
	      }) });
	  },
	  componentDidMount: function componentDidMount() {
	    action.listFareRate();
	    systemActions.setPageHeader(tr.translate('fareRateTable.rate_import'));
	  },
	  tableFare: [//No. Group Code Effective Customer level Every Purchase Point
	  { name: 'no', label: 'fareRateTable.no', width: '48px' }, { name: 'zone', label: 'fareRateTable.zone', width: 'auto' }, { name: 'service_type', label: 'fareRateTable.service_type', width: 'auto' }, { name: 'thb', label: 'fareRateTable.thb', width: 'auto' }, { name: 'usd', label: 'fareRateTable.usd' }],
	  render: function render() {

	    return React.createElement(
	      'div',
	      null,
	      React.createElement(FlexDataTable, {
	        fields: this.tableFare,
	        data: this.state.Items,
	        displayRows: 7 })
	    );
	  }
	});

	module.exports = ProductGroup;

/***/ }

});