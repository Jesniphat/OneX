webpackJsonp([115,135],{

/***/ 986:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'fareUpload': { children: ['done', 'error'] },
	  'listFarePoint': { children: ['done', 'error'] },
	  'listFareReword': { children: ['done', 'error'] }
	});

/***/ },

/***/ 990:
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

	var action = __webpack_require__(986);
	var ReFlux = __webpack_require__(337);

	var ProductGroup = React.createClass({
	  displayName: 'ProductGroup',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [ReFlux.listenTo(action.listFarePoint.done, 'onListFarePointDone')],
	  getInitialState: function getInitialState() {
	    return {
	      Items: []
	    };
	  },

	  onListFarePointDone: function onListFarePointDone(data) {
	    var i = 1;
	    this.setState({ Items: data.map(function (item) {
	        item.no = i++;return item;
	      }) });
	  },
	  componentDidMount: function componentDidMount() {
	    action.listFarePoint();
	    systemActions.setPageHeader(tr.translate('preliminary.fare.point_import'));
	  },
	  tableFare: [//No. Group Code Effective Customer level Every Purchase Point
	  { name: 'no', label: 'preliminary.table.no', width: '48px' }, { name: 'on_system', label: 'preliminary.table.system', width: '140px' }, { name: 'effective', label: 'preliminary.table.effective' }, { name: 'unit', label: 'preliminary.table.unit', width: '120px' }, { name: 'purchase', label: 'preliminary.table.purchase', width: '140px' }, { name: 'point', label: 'preliminary.table.point', width: '100px' }],
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

/***/ 991:
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

	var action = __webpack_require__(986);
	var ReFlux = __webpack_require__(337);

	var ProductGroup = React.createClass({
	  displayName: 'ProductGroup',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [ReFlux.listenTo(action.listFareReword.done, 'onListFareRewordDone')],
	  getInitialState: function getInitialState() {
	    return {
	      Items: []
	    };
	  },
	  onListFareRewordDone: function onListFareRewordDone(data) {
	    var i = 1;
	    this.setState({ Items: data.map(function (item) {
	        item.no = i++;return item;
	      }) });
	  },
	  componentDidMount: function componentDidMount() {
	    action.listFareReword();
	    systemActions.setPageHeader(tr.translate('preliminary.fare.reword_import'));
	  },
	  tableFare: [//No. Group Code Effective Customer level Every Purchase Point
	  { name: 'no', label: 'preliminary.table.no', width: '48px' }, { name: 'on_system', label: 'preliminary.table.system' }, { name: 'product_code', label: 'preliminary.table.code' }, { name: 'effective', label: 'preliminary.table.effective' }, { name: 'point', label: 'preliminary.table.point', width: '100px' }, { name: 'pay', label: 'preliminary.table.pay', width: '140px' }],
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