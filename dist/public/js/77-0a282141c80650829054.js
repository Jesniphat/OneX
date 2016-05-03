webpackJsonp([77,135],{

/***/ 815:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] },
	  'reprint': { children: ['done', 'error'] },
	  'generate': { children: ['done', 'error'] }
	});

/***/ },

/***/ 870:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var T = __webpack_require__(381);

	var system = __webpack_require__(354);
	var widget = __webpack_require__(377);

	var barcodeActions = __webpack_require__(815);

	var dialogActions = system.dialogActions;
	var toasterActions = system.toasterActions;

	var FlexGrid = widget.FlexGrid;
	var FlexDropdown = widget.FlexDropdown;
	var FlexTextInput = widget.FlexTextInput;
	var FlexButton = widget.FlexButton;

	var Print = React.createClass({
	  displayName: 'Print',

	  mixins: [Reflux.listenTo(barcodeActions.reprint.done, 'onGenBarcode_DoneAction')],

	  getInitialState: function getInitialState() {
	    return {
	      begin: '',
	      end: '',
	      btn_print: { disabled: false }
	    };
	  },

	  componentDidMount: function componentDidMount() {},
	  onGenBarcode_DoneAction: function onGenBarcode_DoneAction(data) {
	    if (!data.status) {
	      toasterActions.pop({ type: 'success', message: data.message });
	    } else {
	      toasterActions.pop({
	        type: 'success',
	        message: 'กำลังส่งขอ้มูลให้เครื่องพิมพ์ทำงาน'
	      });
	    }
	    this.setState({ btn_print: { disabled: false } });
	  },

	  doGenBarcode_WorkAction: function doGenBarcode_WorkAction() {
	    if (this.state.btn_print.disabled == false) {

	      dialogActions.show({
	        title: 'ยืนยัน',
	        content: React.createElement(T, { content: 'barcode.confirm_dialog', component: 'div' }),
	        actions: [{ id: 'save', icon: 'check52', label: 'action.print', default: true }, { id: 'cancel', icon: 'close47', label: 'action.cancel' }]
	      }, function (isCancel, id) {
	        if (isCancel || id == 'cancel') {
	          return;
	        }
	        this.setState({ btn_print: { disabled: true } });
	        barcodeActions.reprint({
	          begin: this.state.begin,
	          end: this.state.end
	        });
	      }.bind(this));
	    }
	  },

	  handleChange: function handleChange(id, value) {
	    this.state[id] = value;
	    this.setState({
	      begin: this.state.begin,
	      end: this.state.end
	    });
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'flex-form flex' },
	        React.createElement(
	          'div',
	          { className: 'panel4' },
	          React.createElement(FlexTextInput, {
	            field: { id: 'begin', label: 'barcode.begin' },
	            data: { begin: this.state.begin },
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel4' },
	          React.createElement(FlexTextInput, {
	            field: { id: 'end', label: 'barcode.end' },
	            data: { end: this.state.end },
	            onChange: this.handleChange
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2' },
	          React.createElement(FlexButton, {
	            icon: 'printer88', label: 'action.print', 'default': true,
	            field: this.state.btn_print,
	            onClick: this.doGenBarcode_WorkAction })
	        )
	      )
	    );
	  }
	});

	module.exports = Print;

/***/ }

});