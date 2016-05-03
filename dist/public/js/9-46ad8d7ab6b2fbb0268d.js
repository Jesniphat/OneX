webpackJsonp([9,135],{

/***/ 531:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'getAddressList': { children: ['done', 'error'] },
	  'getContentPackageList': { children: ['done', 'error'] },
	  'getDefaultAddr': { children: ['done', 'error'] },
	  'getFromDestination': { children: ['done', 'error'] },
	  'getToDestination': { children: ['done', 'error'] },
	  'getRateType': { children: ['done', 'error'] },
	  'getRate': { children: ['done', 'error'] },
	  'saveBooking': { children: ['done', 'error'] },
	  'saveBillist': { children: ['done', 'error'] },
	  'printReportBooking': { children: ['done', 'error'] },
	  'printBarcodeBooking': { children: ['done', 'error'] },
	  'printInvoiceBooking': { children: ['done', 'error'] },
	  'sentMail': { children: ['done', 'error'] }
	});

/***/ },

/***/ 535:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _textField = __webpack_require__(536);

	var _textField2 = _interopRequireDefault(_textField);

	var _timePicker = __webpack_require__(544);

	var _timePicker2 = _interopRequireDefault(_timePicker);

	var _radioButton = __webpack_require__(552);

	var _radioButton2 = _interopRequireDefault(_radioButton);

	var _radioButtonGroup = __webpack_require__(558);

	var _radioButtonGroup2 = _interopRequireDefault(_radioButtonGroup);

	var _checkbox = __webpack_require__(559);

	var _checkbox2 = _interopRequireDefault(_checkbox);

	var _favorite = __webpack_require__(562);

	var _favorite2 = _interopRequireDefault(_favorite);

	var _favoriteBorder = __webpack_require__(563);

	var _favoriteBorder2 = _interopRequireDefault(_favoriteBorder);

	var _raisedButton = __webpack_require__(334);

	var _raisedButton2 = _interopRequireDefault(_raisedButton);

	var _table = __webpack_require__(564);

	var _table2 = _interopRequireDefault(_table);

	var _tableHeaderColumn = __webpack_require__(565);

	var _tableHeaderColumn2 = _interopRequireDefault(_tableHeaderColumn);

	var _tableRow = __webpack_require__(566);

	var _tableRow2 = _interopRequireDefault(_tableRow);

	var _tableHeader = __webpack_require__(567);

	var _tableHeader2 = _interopRequireDefault(_tableHeader);

	var _tableRowColumn = __webpack_require__(568);

	var _tableRowColumn2 = _interopRequireDefault(_tableRowColumn);

	var _tableBody = __webpack_require__(569);

	var _tableBody2 = _interopRequireDefault(_tableBody);

	var _tableFooter = __webpack_require__(570);

	var _tableFooter2 = _interopRequireDefault(_tableFooter);

	var _toggle = __webpack_require__(571);

	var _toggle2 = _interopRequireDefault(_toggle);

	var _floatingActionButton = __webpack_require__(572);

	var _floatingActionButton2 = _interopRequireDefault(_floatingActionButton);

	var _add = __webpack_require__(573);

	var _add2 = _interopRequireDefault(_add);

	var _selectField = __webpack_require__(574);

	var _selectField2 = _interopRequireDefault(_selectField);

	var _menuItem = __webpack_require__(301);

	var _menuItem2 = _interopRequireDefault(_menuItem);

	var _DropDownMenu = __webpack_require__(577);

	var _DropDownMenu2 = _interopRequireDefault(_DropDownMenu);

	var _flatButton = __webpack_require__(330);

	var _flatButton2 = _interopRequireDefault(_flatButton);

	var _dialog = __webpack_require__(329);

	var _dialog2 = _interopRequireDefault(_dialog);

	var _datePicker = __webpack_require__(580);

	var _datePicker2 = _interopRequireDefault(_datePicker);

	var _fontIcon = __webpack_require__(320);

	var _fontIcon2 = _interopRequireDefault(_fontIcon);

	var _colors = __webpack_require__(266);

	var _colors2 = _interopRequireDefault(_colors);

	var _autoComplete = __webpack_require__(597);

	var _autoComplete2 = _interopRequireDefault(_autoComplete);

	var _iconButton = __webpack_require__(317);

	var _iconButton2 = _interopRequireDefault(_iconButton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var React = __webpack_require__(2);

	// import {TextField, DatePicker, RadioButton, RadioButtonGroup, RaisedButton, Table, TableHeaderColumn, TableRow, TableHeader,
	//         TableRowColumn, TableBody, TableFooter, Toggle, Checkbox, ActionFavorite, ActionFavoriteBorder, FloatingActionButton,
	//         ContentAdd, SelectField, DropDownMenu, FlatButton, Dialog} from '../../../mui.jsx'
	// const MenuItem = require('material-ui/lib/menus/menu-item');

	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widgets = __webpack_require__(377);
	var toasterActions = system.toasterActions;
	var helper = system.helper; // require('../../../../../server/lib/Helper');
	var systemActions = system.systemActions; // require('../../system/actions');
	var infoPanelActions = system.infoPanelActions; // require('../../../actions/info-panel');
	var Router = __webpack_require__(160);
	var actions = __webpack_require__(531);

	var T = __webpack_require__(381);
	// var dialogActions = system.dialogActions;
	var FlexTextInput = widgets.FlexTextInput; // require('../../../widgets/flex-text-input.jsx');
	var FlexButton = widgets.FlexButton; // require('../../../widgets/flex-button.jsx');
	var FlexDisplayTable = widgets.FlexDisplayTable; // require('../../../widgets/flex-display-table.jsx');
	var FlexDropdown = widgets.FlexDropdown; // require('../../../widgets/flex-dropdown.jsx');
	var FlexIcon = widgets.FlexIcon;
	var FlexTab = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');
	var FlexCheckbox = widgets.FlexCheckbox;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var Link = Router.Link;

	var ReFlux = __webpack_require__(335);

	var styles = {
	  block: {
	    maxWidth: '100%'
	  },
	  radioButton: {
	    marginBottom: 3
	  },
	  RaisedButtonStyle: {
	    margin: 3,
	    'min-width': 5,
	    width: '100%'
	  },
	  RaisedButtonNextStyle: {
	    margin: 3,
	    width: '100%'
	  },
	  RaisedButtonAddStyle: {
	    width: '100%'
	  },
	  propContainerStyle: {
	    width: 200,
	    overflow: 'hidden',
	    margin: '20px auto 0'
	  },
	  propToggleHeader: {
	    margin: '20px auto 10px'
	  },
	  checkbox: {
	    marginBottom: 3,
	    width: '100%'
	  }
	};

	var iconStyles = {
	  marginRight: 24
	};

	//var initialData = null;
	var tableData = [];
	var packageList = [];
	//var addressList = [];
	var addressListValue = [];
	var flagChangeAdress = "NO";

	var LoadFareScreen = React.createClass({
	  displayName: 'LoadFareScreen',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [
	  //ReFlux.listenTo(actions.getInitialData.done,'onGetInitialData'),
	  ReFlux.listenTo(actions.getAddressList.done, 'onGetAddressListDoneAction'), ReFlux.listenTo(actions.getDefaultAddr.done, 'onGetDefaultAddrDoneAction'), ReFlux.listenTo(actions.getContentPackageList.done, 'onContentGetPackageListDoneAction'), ReFlux.listenTo(actions.getFromDestination.done, 'onGetFromDestinationDoneAction'), ReFlux.listenTo(actions.getToDestination.done, 'onGetToDestination'), ReFlux.listenTo(actions.getRateType.done, 'onGetRateTypeDoneAction'), ReFlux.listenTo(actions.getRate.done, 'onGetGetRateDoneAction'), ReFlux.listenTo(actions.saveBooking.done, 'onSaveBookingDoneAction'), ReFlux.listenTo(actions.saveBooking.error, 'onSaveBookingErrorAction'), ReFlux.listenTo(actions.saveBillist.done, 'onSaveBillistDoneAction'), ReFlux.listenTo(actions.printReportBooking.done, 'onPrintReportBookingDoneAction'), ReFlux.listenTo(actions.printReportBooking.error, 'onPrintReportBookingErrorAction'), ReFlux.listenTo(actions.printBarcodeBooking.done, 'onPrintBarcodeBookingDoneAction'), ReFlux.listenTo(actions.printBarcodeBooking.error, 'onPrintBarcodeBookingErrorAction'), ReFlux.listenTo(actions.printInvoiceBooking.done, 'onPrintInvoiceBookingDoneAction'), ReFlux.listenTo(actions.printInvoiceBooking.error, 'onPrintInvoiceBookingErrorAction'), ReFlux.listenTo(actions.sentMail.done, 'onSentMailDoneAction'), ReFlux.listenTo(actions.sentMail.error, 'onSentMailErrorAction')],

	  getInitialState: function getInitialState() {
	    //console.log("getSession = ",system.sessionStore.getSession().staff);
	    var personId = system.sessionStore.getSession().staff.id;
	    var personType = system.sessionStore.getSession().staff.type;
	    var isPaymentType = true;
	    if (personType == "COMPANY") {
	      isPaymentType = false;
	    } else {
	      isPaymentType = true;
	    }
	    return {
	      isPaymentType: isPaymentType,
	      personType: personType,
	      personId: personId,
	      fixedHeader: true,
	      fixedFooter: false,
	      selectAllSelected: false,
	      hAdjustForCheckbox: false,
	      stripedRows: false,
	      showRowHover: false,
	      selectable: false,
	      multiSelectable: false,
	      adjustForCheckbox: false,
	      enableSelectAll: false,
	      deselectOnClickaway: false,
	      displaySelectAll: false,
	      displayRowCheckbox: false,
	      tableProductRow: '',
	      totalAmount: 0,
	      itemQty: 0,
	      total_weight: 0,
	      total_volume_weight: 0,
	      packageListValue: {
	        list: null,
	        value: null,
	        text: null,
	        isLock: true
	      },
	      fromList: {
	        autoList: [],
	        list: null,
	        value: '',
	        text: null
	      },
	      toList: {
	        autoList: [],
	        list: null,
	        value: '',
	        text: null
	      },
	      rateType: {
	        list: null,
	        value: null
	      },
	      myList: null,
	      addressList: null,
	      rate: null,
	      initialData: null,
	      currencyCodeTemp: 'THB',
	      dialogMessage: "",
	      openDialog: false,
	      disableAddressList: true,
	      openBillingDialog: false,
	      openAddressDialog: false,
	      discount: 0,
	      surCharge: 0,
	      checkDataTable: 0,
	      enableNext: false,
	      disabledTo: true,
	      disabledPickUp: true,
	      disabledInvoice: true,
	      disabledDatePick: true,
	      disabledDlType: true,
	      textField: {
	        senderValues: '',
	        receipientValues: '',
	        picUpPlaceValues: '',
	        invoiceName: ''
	      }
	    };
	  },

	  ProductRow: function ProductRow(dataTable) {
	    console.log("dataTable = ", dataTable);
	    return dataTable.map(function (row, index) {
	      return React.createElement(
	        _tableRow2.default,
	        { key: index, style: { 'background-color': '#fff' } },
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { 'width': '22%', 'padding': '0px', 'padding-left': '3px' } },
	          row.nameList
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { textAlign: 'center', 'width': '10%', 'padding': '0px', 'padding-left': '3px' } },
	          row.qty
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { textAlign: 'center', 'width': '10%', 'padding': '0px', 'padding-left': '3px' } },
	          row.width,
	          ' cm.'
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { textAlign: 'center', 'width': '10%', 'padding': '0px', 'padding-left': '3px' } },
	          row.depth,
	          ' cm.'
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { textAlign: 'center', 'width': '10%', 'padding': '0px', 'padding-left': '3px' } },
	          row.height,
	          ' cm.'
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { textAlign: 'center', 'width': '10%', 'padding': '0px', 'padding-left': '3px' } },
	          row.weight,
	          ' kg.'
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { textAlign: 'right', 'width': '10%', 'mso-number-format': 'General', 'padding': '0px', 'padding-left': '3px' } },
	          helper.numberFormat(row.amount, 2)
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { textAlign: 'center', 'width': '10%', 'padding': '0px', 'padding-left': '3px' } },
	          row.currency
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { textAlign: 'center', 'width': '8%', 'padding': '0px', 'padding-left': '3px' } },
	          React.createElement(
	            'div',
	            null,
	            React.createElement(_iconButton2.default, { iconClassName: 'flaticon-cancel19 normal icon', onMouseDown: this.deleteContent.bind(this, index) })
	          )
	        )
	      );
	    }.bind(this));
	  },
	  componentDidMount: function componentDidMount() {
	    console.log(this.state.personId);
	    actions.getAddressList(this.state.personId);
	    actions.getDefaultAddr(this.state.personId);
	    actions.getContentPackageList();
	    actions.getFromDestination();
	    actions.getToDestination();
	    actions.getRateType();
	    this.setState({
	      tableProductRow: this.ProductRow(tableData)
	    });
	    // this.sumTotal();
	    // styles.RaisedButtonStyle.margin = 10; test set data ข้างบน
	    //this.refs.sender.focus();
	  },

	  changeRate: function changeRate() {
	    console.log("Go ChangeRate");
	    if (this.state.rateType.value != null && this.state.fromList.value != "" && this.state.toList.value != "") {
	      console.log("Chacke change Rate", "Reat = ", this.state.rateType.value, "  from = ", this.state.fromList.value, "  to = ", this.state.toList.value);
	      actions.getRate(this.state.fromList.value, this.state.toList.value, this.state.rateType.value);
	    }
	  },

	  calNewRate: function calNewRate() {
	    for (var i = 0; i < tableData.length; i++) {
	      var rateAmount = 0;
	      if (this.state.initialData.currency_code == 'USD') {
	        rateAmount = this.state.rate.usd;
	      } else if (this.state.initialData.currency_code == 'THB') {
	        rateAmount = this.state.rate.thb;
	      }
	      var total = 0;
	      if (tableData[i].size >= tableData[i].weight) {
	        total = tableData[i].size * rateAmount;
	      } else {
	        total = tableData[i].weight * rateAmount;
	      }
	      console.log("total = ", total);

	      var qty = tableData[i].qty;
	      var totalAmount = total * qty;

	      tableData[i].amount = totalAmount;
	      tableData[i].total_price = totalAmount;
	    }

	    this.sumTotal();
	  },

	  sumTotal: function sumTotal() {
	    console.log("SumTotal", tableData.length);
	    var initialData = this.state.initialData;
	    console.log("get initail = ", initialData);
	    var total = 0;
	    var itemQty = 0;
	    var total_weight = 0;
	    var total_volume_weight = 0;
	    for (var i = 0; i < tableData.length; i++) {
	      total = parseFloat(total) + parseFloat(tableData[i].amount);
	      itemQty = parseFloat(itemQty) + parseFloat(tableData[i].qty);
	      total_weight = parseFloat(total_weight) + parseFloat(tableData[i].weight) * parseFloat(tableData[i].qty);
	      total_volume_weight = parseFloat(total_volume_weight) + parseFloat(tableData[i].volume_weight) * parseFloat(tableData[i].qty);
	      console.log("total_weight_row = ", total_weight);
	      console.log("total_volume_weight_row = ", total_volume_weight);
	    }

	    console.log("total_weight = ", total_weight);
	    console.log("total_volume_weight = ", total_volume_weight);

	    this.setState({
	      checkDataTable: tableData.length
	    });

	    var discountAmount = 0;
	    var totalAmount = 0;
	    initialData.discountPercent = 0;
	    if (initialData.discount_type == 'baht') {
	      discountAmount = initialData.discount;
	      totalAmount = total - initialData.discount;
	    } else {
	      var d = initialData.discount;
	      discountAmount = total * d.substring(0, d.length - 1) / 100;
	      initialData.discountPercent = d.substring(0, d.length - 1);
	      totalAmount = total - discountAmount;
	    }

	    totalAmount = totalAmount + initialData.charge;
	    console.log("totalAmount = ", total);
	    this.setState({
	      totalAmount: totalAmount
	    });
	    this.setState({
	      itemQty: itemQty
	    });

	    this.setState({
	      total_weight: total_weight
	    });

	    this.setState({
	      total_volume_weight: total_volume_weight
	    });

	    initialData.discountAmount = discountAmount;

	    this.state.initialData = initialData;
	    this.setState({
	      initialData: this.state.initialData
	    });

	    this.setState({
	      discount: discountAmount
	    });

	    this.setState({
	      surCharge: initialData.charge
	    });
	  },

	  changeAddress: function changeAddress(index) {
	    this.dialogAddressOpen();
	    console.log("Change Address = ", index);
	    flagChangeAdress = index;
	    this.state.disableAddressList = false;
	    this.setState({
	      disableAddressList: this.state.disableAddressList
	    });

	    this.onGetAddressListDoneAction(addressListValue);
	  },

	  setAddress: function setAddress(index) {
	    console.log("set Address = ", index, "set to = ", flagChangeAdress);
	    console.log("See Address = ", addressListValue[index].address);
	    if (flagChangeAdress != "NO" && this.state.disableAddressList != true) {
	      if (flagChangeAdress == 'sender') {
	        this.state.textField.senderValues = addressListValue[index].address;
	        this.state.textField.picUpPlaceValues = addressListValue[index].address;
	        this.setState({
	          textField: this.state.textField
	        });
	        this.checkDisabledTo();
	      } else if (flagChangeAdress == 'receipient') {
	        //this.refs.receipient.setValue(addressListValue[index].address);
	        this.state.textField.receipientValues = addressListValue[index].address;
	        this.setState({
	          textField: this.state.textField
	        });
	        this.checkDisabledPickUp();
	      } else if (flagChangeAdress == 'picUpPlace') {
	        //this.refs.picUpPlace.setValue(addressListValue[index].address);
	        this.state.textField.picUpPlaceValues = addressListValue[index].address;
	        this.setState({
	          textField: this.state.textField
	        });
	        this.checkDisabledInvoice();
	      } else if (flagChangeAdress == 'invoiceName') {
	        console.log("Set invoiceName");
	        //this.refs.invoiceName.setValue(addressListValue[index].address);
	        this.state.textField.invoiceNameValues = addressListValue[index].address;
	        this.setState({
	          textField: this.state.textField
	        });
	        this.checkDisabledDatePick();
	      }
	      flagChangeAdress = "NO";
	      this.state.disableAddressList = true;
	      this.setState({
	        disableAddressList: this.state.disableAddressList
	      });
	      //this.onGetAddressListDoneAction(addressListValue);
	    } else {
	        console.log("Don't Click Change");
	      }

	    this.dialogAddressClose();
	  },

	  radioPackage: function radioPackage(e, value) {
	    console.log("radioPackage = ", value);
	    if (value == 'Document') {
	      this.state.packageListValue.isLock = true;
	      console.log("ddfs", this.refs.packageList);
	    } else {
	      this.state.packageListValue.isLock = false;
	    }

	    this.setState({
	      packageListValue: this.state.packageListValue
	    });
	    //console.log(this.state.packageListValue);
	  },

	  calContent: function calContent() {
	    console.log("cal Rate = ", this.state.rate, "Inintail Data = ", this.state.initialData);
	    console.log("New PackageList = ", this.refs.packageList);

	    var isSame = false;

	    if (this.state.fromList.value == '' || this.state.fromList.value == null) {
	      var text = "Please select from.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    } else if (this.state.toList.value == '' || this.state.toList.value == null) {
	      var text = "Please select To.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    } else if (this.refs.rateType.props.value == null || this.refs.rateType.props.value == "") {
	      var text = "Please select Dalivery type";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    }

	    var contentName = null;
	    var contentId = null;
	    if (this.refs.package.getSelectedValue() == 'Document') {
	      contentId = -1;
	      contentName = this.refs.package.getSelectedValue();
	    } else {
	      contentId = this.refs.packageList.props.value;
	      contentName = this.state.packageListValue.text;
	    }
	    console.log("contentName = ", contentName);

	    var width = this.refs.width.getValue();
	    var depth = this.refs.depth.getValue();
	    var height = this.refs.height.getValue();

	    if (isNaN(width) || isNaN(depth) || isNaN(height) || isNaN(this.refs.weight.getValue()) || isNaN(this.refs.qty.getValue())) {
	      var text = "Please ensure dimensions support filling by number only.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    }

	    var size = width * depth * height / 6000;
	    console.log("size = ", size);

	    var weight = this.refs.weight.getValue();

	    if (width == '' || width == null || depth == '' || depth == null || height == '' || height == null || weight == '' || weight == null) {
	      var text = "Please Insert width, depth, height and weight";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    }

	    var rateAmount = 0;
	    if (this.state.initialData.currency_code == 'USD') {
	      rateAmount = this.state.rate.usd;
	    } else if (this.state.initialData.currency_code == 'THB') {
	      rateAmount = this.state.rate.thb;
	    }

	    var total = 0;
	    if (size >= weight) {
	      total = size * rateAmount;
	    } else {
	      total = weight * rateAmount;
	    }
	    console.log("total = ", total);

	    var qty = this.refs.qty.getValue();
	    var totalAmount = total * qty;
	    //  + " (W" + width + " x D" + depth + " x H" + height + ", " + weight + "KG.)"
	    for (var i = 0; i < tableData.length; i++) {
	      if (tableData[i].name == contentName && tableData[i].width == width && tableData[i].depth == depth && tableData[i].height == height && tableData[i].weight == weight) {
	        tableData[i].amount += parseFloat(totalAmount);
	        tableData[i].qty += parseFloat(qty);
	        tableData[i].volume_weight += parseFloat(size);
	        // tableData[i].weight += parseFloat(weight);
	        tableData[i].total_price += parseFloat(totalAmount);
	        isSame = true;
	      }
	    }

	    if (isSame == false) {
	      tableData.push({ nameList: contentName,
	        name: contentName,
	        contentId: contentId,
	        packageType: this.refs.package.getSelectedValue(),
	        packageContent: this.refs.content.getValue(),
	        amount: totalAmount,
	        currency: this.state.initialData.currency_code,
	        qty: parseFloat(qty),
	        width: parseFloat(width),
	        depth: parseFloat(depth),
	        height: parseFloat(height),
	        volume_weight: parseFloat(size),
	        weight: parseFloat(weight),
	        total_price: parseFloat(totalAmount)
	      });
	    }

	    this.setState({
	      tableProductRow: this.ProductRow(tableData)
	    });

	    this.sumTotal();

	    this.refs.width.setValue(null);
	    this.refs.depth.setValue(null);
	    this.refs.height.setValue(null);
	    this.refs.weight.setValue(null);
	    this.refs.qty.setValue(null);
	    this.refs.content.setValue("");
	  },

	  deleteContent: function deleteContent(index) {
	    console.log("click Table");
	    tableData.splice(index, 1);
	    this.setState({
	      tableProductRow: this.ProductRow(tableData)
	    });
	    this.sumTotal();
	  },

	  onGetGetRateDoneAction: function onGetGetRateDoneAction(rate) {
	    this.state.rate = rate;
	    this.setState({
	      rate: this.state.rate
	    });

	    console.log("onGetGetRateDoneAction = ", this.state.rate);
	    if (tableData.length > 0) {
	      console.log("tableData Data = ", tableData);
	      this.calNewRate();
	    }
	  },

	  onGetAddressListDoneAction: function onGetAddressListDoneAction(addrList) {
	    console.log("addressList = ", addrList);
	    addressListValue = addrList;

	    var addressList = [];
	    for (var i = 0; i < addrList.length; i++) {
	      addressList.push(React.createElement(
	        'div',
	        { id: i, style: { padding: '5px', float: 'left', width: '237' }, onMouseDown: this.setAddress.bind(this, i) },
	        React.createElement(
	          'div',
	          { style: { 'border': '1px solid lightgray', 'padding': '5px', 'width': '100%', 'height': '70px' } },
	          addrList[i].address
	        )
	      ));
	    }

	    this.state.addressList = addressList;
	    this.setState({
	      addressList: this.state.addressList
	    });
	  },

	  onGetDefaultAddrDoneAction: function onGetDefaultAddrDoneAction(addr) {
	    //this.refs.sender.setValue(addr.address);
	    this.state.textField.senderValues = addr.address;
	    this.state.textField.picUpPlaceValues = addr.address;
	    this.state.textField.invoiceNameValues = addr.address;

	    this.state.initialData = addr;
	    this.setState({
	      textField: this.state.textField
	    });
	    // this.refs.picUpPlace.setValue(addr.address);
	    // this.refs.invoiceName.setValue(addr.address);
	    // console.log("addr = " ,addr);
	    this.setState({
	      initialData: this.state.initialData
	    });

	    this.setState({
	      currencyCodeTemp: addr.currency_code
	    });
	  },

	  onContentGetPackageListDoneAction: function onContentGetPackageListDoneAction(listData) {
	    var list = listData.map(function (row) {
	      return {
	        value: row.value,
	        text: row.text
	      };
	    });
	    console.log(list, list.length);
	    var packageList = [];
	    for (var i = 0; i < list.length; i++) {
	      packageList.push(React.createElement(_menuItem2.default, { key: list[i].value, value: list[i].value, primaryText: list[i].text }));
	    }
	    this.state.packageListValue.list = packageList;
	    this.setState({
	      packageListValue: this.state.packageListValue
	    });
	  },

	  onGetFromDestinationDoneAction: function onGetFromDestinationDoneAction(listData) {
	    console.log("GetFromList = ", listData);
	    var list = listData.map(function (row) {
	      return {
	        value: row.value,
	        text: row.text
	      };
	    });
	    console.log(list, list.length);

	    var fromList = [];
	    for (var j = 0; j < list.length; j++) {
	      fromList.push(React.createElement(_menuItem2.default, { key: list[j].value, value: list[j].value, primaryText: list[j].text }));
	      // fromAutoList.push({
	      //   text: list[j].text,
	      //   value: (
	      //         <MenuItem
	      //           primaryText={list[j].text}
	      //         />
	      //       ),
	      //   });
	    }
	    this.state.fromList.list = fromList;
	    this.setState({
	      fromList: this.state.fromList
	    });
	  },

	  onGetToDestination: function onGetToDestination(listData) {
	    var list = listData.map(function (row) {
	      return {
	        value: row.value,
	        text: row.text
	      };
	    });
	    console.log(list, list.length);

	    var toList = [];
	    for (var j = 0; j < list.length; j++) {
	      toList.push(React.createElement(_menuItem2.default, { key: list[j].value, value: list[j].value, primaryText: list[j].text }));
	      // toAutoList.push({
	      //   text: list[j].text,
	      //   value: (
	      //         <MenuItem
	      //           primaryText={list[j].text}
	      //         />
	      //       ),
	      //   });
	    }

	    this.state.toList.list = toList;
	    this.setState({
	      toList: this.state.toList
	    });
	  },

	  onGetRateTypeDoneAction: function onGetRateTypeDoneAction(res) {
	    console.log(res);
	    var list = res.map(function (row) {
	      return {
	        value: row.service_type,
	        text: row.service_type
	      };
	    });
	    console.log(list, list.length);
	    var rateTypes = [];
	    for (var i = 0; i < list.length; i++) {
	      rateTypes.push(React.createElement(_menuItem2.default, { value: list[i].value, primaryText: list[i].text }));
	    }
	    this.state.rateType.list = rateTypes;
	    this.setState({
	      rateType: this.state.rateType
	    });
	  },

	  handleChangepackageList: function handleChangepackageList(event, index, value, textContent) {
	    console.log("event = ", event, " index = ", index, " value = ", value, "text = ", event.target.textContent);
	    //console.log(this.state.packageListValue);
	    this.state.packageListValue.value = value;
	    this.state.packageListValue.text = event.target.textContent;
	    this.setState({
	      packageListValue: this.state.packageListValue
	    });
	  },

	  handleChangeFromList: function handleChangeFromList(event, index, value) {
	    //console.log("event = ",event," index = ",index, " value = ", value);
	    //console.log(this.state.packageListValue);
	    this.state.fromList.value = value;
	    this.setState({
	      fromList: this.state.fromList
	    });
	    this.checkDisabledTo();
	    //this.changeRate();
	  },

	  handleChangeToList: function handleChangeToList(event, index, value) {
	    //console.log("event = ",event," index = ",index, " value = ", value);
	    //var from = this.refs.fromText.getValue();
	    // if(from == '' || from == null){
	    //   toasterActions.pop({
	    //     type:'warning',
	    //     message:'กรุณาระบุสถานที่ส่งของก่อน'
	    //   });

	    //   return
	    // }

	    this.state.toList.value = value;
	    this.setState({
	      toList: this.state.toList
	    });
	    this.checkDisabledPickUp();
	    //this.changeRate();
	    // var to = value;
	    // console.log("From and To = ", from,to);

	    // actions.getRate(from,to);
	  },

	  handleChangeRateType: function handleChangeRateType(evenn, index, value) {
	    var from = this.state.fromList.value;
	    var to = this.state.toList.value;
	    this.state.rateType.value = value;
	    this.setState({
	      rateType: this.state.rateType
	    });

	    var rate = value;
	    //console.log("From and To = ", from,to,rate);
	    this.changeRate();
	  },

	  handleChangeTextField: function handleChangeTextField(id, event) {
	    // console.log("even = ",event.target.value);
	    // console.log("id = ", id);
	    this.state.textField[id] = event.target.value;
	    this.setState({
	      textField: this.state.textField
	    });
	  },

	  saveBooking: function saveBooking() {
	    console.log('saveBooking');
	    console.log("refs = ", this.refs);
	    if (this.state.enableNext === false) {
	      var text = "Please accept the booking conditions.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    }

	    if (this.state.fromList.value == '' || this.state.fromList.value == null) {
	      var text = "Please select from.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    } else if (this.state.toList.value == '' || this.state.toList.value == null) {
	      var text = "Please select To.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    } else if (this.refs.sender.getValue() == '') {
	      var text = "Sender is not valid.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    } else if (this.refs.receipient.getValue() == '') {
	      var text = "Receipient is not valid.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    } else if (this.refs.picUpPlace.getValue() == '' || this.refs.picUpPlace.getValue() == null) {
	      var text = "Picup Place is not valid.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    } else if (this.refs.rateType.props.value == null || this.refs.rateType.props.value == "") {
	      var text = "Please select Dalivery type";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    } else if (tableData.length < 1) {
	      var text = "Don't have product to sent.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    } else if (this.refs.invoiceName.getValue() == '' || this.refs.invoiceName.getValue() == null) {
	      var text = "Invoice Name is not valid.";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    } else if (this.refs.picUpDate.getDate() == '' || this.refs.picUpDate.getDate() == null) {
	      var text = "Please select Pickup Date";
	      this.setState({
	        dialogMessage: text
	      });
	      this.dialogOpen();
	      return;
	    }
	    var pickupDateData = this.refs.picUpDate.getDate();
	    var getYears = pickupDateData.getFullYear().toString();
	    var getMonths = (pickupDateData.getMonth() + 1).toString(); // getMonth() is zero-based
	    var getDays = pickupDateData.getDate().toString();
	    var fullPickupDate = getYears + "-" + (getMonths[1] ? getMonths : "0" + getMonths[0]) + "-" + (getDays[1] ? getDays : "0" + getDays[0]);

	    var obj = {
	      from: this.state.fromList.value,
	      sender: this.refs.sender.getValue(),
	      to: this.state.toList.value,
	      receipient: this.refs.receipient.getValue(),
	      picUpDate: fullPickupDate,
	      picUpPlace: this.refs.picUpPlace.getValue(),
	      deliveryDate: "",
	      content: this.refs.content.getValue(),
	      bookingItem: tableData,
	      totalAmount: this.state.totalAmount,
	      invoiceName: this.refs.invoiceName.getValue(),
	      paymentType: this.refs.paymentType.getSelectedValue(),
	      discount_amount: this.state.initialData.discountAmount,
	      discount_percent: this.state.initialData.discount_type == 'percent' ? this.state.initialData.discountPercent : "0",
	      charge_amount: this.state.initialData.charge,
	      receipt_type: 'BILLING',
	      currency_id: this.state.initialData.currency_code == 'USD' ? '2' : '1',
	      zone: this.state.rate.zone,
	      rate: this.state.initialData.currency_code == 'USD' ? this.state.rate.usd : this.state.rate.thb,
	      customer_id: this.state.initialData.id,
	      itemQty: this.state.itemQty,
	      total_weight: this.state.total_weight,
	      total_volume_weight: this.state.total_volume_weight,
	      deliveryType: this.state.rateType.value
	    };

	    console.log("Obj = ", obj);

	    actions.saveBooking(obj);
	    //actions.sentMail();
	  },
	  onSaveBookingDoneAction: function onSaveBookingDoneAction(data) {
	    console.log("Booking ID = ", data.booking_id);
	    toasterActions.pop({
	      type: 'success',
	      message: data.done
	    });
	    actions.printReportBooking(data.booking_id);
	  },
	  onSaveBookingErrorAction: function onSaveBookingErrorAction(data) {
	    alert("Save Booking Error");
	    toasterActions.pop({
	      type: 'warning',
	      message: 'Can not Save Booking'
	    });
	  },
	  onPrintReportBookingDoneAction: function onPrintReportBookingDoneAction(data) {
	    window.open(data.pdfFile);
	    actions.printBarcodeBooking(data.bookingId);
	  },
	  onPrintReportBookingErrorAction: function onPrintReportBookingErrorAction(data) {
	    console.log("Error GenReport");
	  },
	  onPrintBarcodeBookingDoneAction: function onPrintBarcodeBookingDoneAction(data) {
	    window.open(data.pdfFile);
	    actions.printInvoiceBooking(data.bookingId);
	  },
	  onPrintBarcodeBookingErrorAction: function onPrintBarcodeBookingErrorAction(data) {
	    console.log("Error Genbarcode");
	  },
	  onPrintInvoiceBookingDoneAction: function onPrintInvoiceBookingDoneAction(data) {
	    actions.sentMail(data.bookingId);
	    window.open(data.pdfFile);
	    //window.location.href='/signin-transport/#/finishbooking/' + data.bookingId;
	  },
	  onPrintInvoiceBookingErrorAction: function onPrintInvoiceBookingErrorAction(data) {
	    console.log("Error Invoice");
	  },
	  onSentMailDoneAction: function onSentMailDoneAction(data) {
	    window.location.href = '/signin-transport/#/finishbooking/' + data.bookingId;
	  },
	  onSentMailErrorAction: function onSentMailErrorAction(data) {
	    console.log("Error can't sent email");
	  },

	  onSaveBillistDoneAction: function onSaveBillistDoneAction() {
	    //alert("Save list complete");
	    actions.getAddressList(this.state.personId);
	    toasterActions.pop({
	      type: 'success',
	      message: 'Save list complete'
	    });
	    actions.getDefaultAddr(this.state.personId);
	  },

	  dialogOpen: function dialogOpen() {
	    this.setState({
	      openDialog: true
	    });
	  },

	  dialogClose: function dialogClose() {
	    this.setState({
	      openDialog: false
	    });
	  },

	  dialogBilOpen: function dialogBilOpen() {
	    console.log("Open billing");
	    this.setState({
	      openBillingDialog: true
	    });
	  },

	  dialogBilClose: function dialogBilClose() {
	    this.setState({
	      openBillingDialog: false
	    });
	  },

	  dialogAddBilling: function dialogAddBilling() {
	    console.log("Add billing");
	    var billist = {
	      billingCode: this.refs.billingCode.getValue(),
	      billingName: this.refs.billingName.getValue(),
	      billingAddr1: this.refs.billingAddr1.getValue(),
	      billingAddr2: this.refs.billingAddr2.getValue(),
	      billingTambon: this.refs.billingTambon.getValue(),
	      billingAmpher: this.refs.billingAmpher.getValue(),
	      billingProvince: this.refs.billingProvince.getValue(),
	      billingZipCode: this.refs.billingZipCode.getValue(),
	      billingTel: this.refs.billingTel.getValue(),
	      personId: this.state.initialData.id
	    };
	    console.log(billist);

	    actions.saveBillist(billist);

	    this.setState({
	      openBillingDialog: false
	    });
	  },

	  dialogAddressOpen: function dialogAddressOpen() {
	    console.log("Open Address");
	    this.setState({
	      openAddressDialog: true
	    });
	  },

	  dialogAddressClose: function dialogAddressClose() {
	    this.setState({
	      openAddressDialog: false
	    });
	  },

	  agreeBox: function agreeBox(e, value) {
	    console.log("e = ", e);
	    console.log("v = ", value);

	    this.setState({
	      enableNext: value
	    });
	    //this.doNext(value);
	  },

	  linkCon: function linkCon() {
	    console.log("ssssl");
	    window.location.href = 'www.kapook.com';
	  },

	  checkDisabledTo: function checkDisabledTo(event) {
	    this.changeRate();
	    console.log("checkDisabledTo", event);
	    var check = true;
	    if (event == undefined) {
	      //console.log("1")
	      if (this.state.fromList.value == '' || this.state.fromList.value == undefined) {
	        //console.log("2")
	        check = true;
	      } else {
	        //console.log("3")
	        check = false;
	      }
	    } else if (event == '') {
	      //console.log("4")
	      check = true;
	    } else {
	      console.log("5 = ", event, "ssss = ", this.state.fromList.value);
	      if (this.state.fromList.value == "") {
	        check = true;
	      } else {
	        check = false;
	      }
	    }

	    if (this.state.textField.senderValues == '' || check == true) {
	      //console.log("tyi1");
	      this.setState({
	        disabledTo: true
	      });
	    } else {
	      //console.log("tyi2",this.state.textField.senderValues,"2",this.refs.fromText.getValue());
	      this.setState({
	        disabledTo: false
	      });
	    }
	    this.checkDisabledPickUp();
	    this.checkDisabledInvoice();
	    this.checkDisabledDatePick();
	  },

	  checkDisabledPickUp: function checkDisabledPickUp(event) {
	    this.changeRate();
	    console.log("checkDisabledPickUp", event);
	    var check = true;
	    if (event == undefined) {
	      if (this.state.toList.value == '' || this.state.toList.value == undefined) {
	        check = true;
	      } else {
	        check = false;
	      }
	    } else if (event == '') {
	      check = true;
	    } else {
	      if (this.state.toList.value == "") {
	        check = true;
	      } else {
	        check = false;
	      }
	    }

	    if (this.state.textField.receipientValues == '' || check == true || this.state.fromList.value == '' || this.state.fromList.value == undefined || this.state.textField.senderValues == '') {
	      //console.log("tyi1");
	      this.setState({
	        disabledPickUp: true
	      });
	    } else {
	      //console.log("tyi2");
	      this.setState({
	        disabledPickUp: false
	      });
	      console.log("Goto Focus");
	      this.refs.picUpPlace.focus();
	    }
	    this.checkDisabledInvoice();
	    this.checkDisabledDatePick();
	  },

	  checkDisabledInvoice: function checkDisabledInvoice() {
	    console.log(this.state.textField.picUpPlaceValues);
	    if (this.state.textField.picUpPlaceValues == '' || this.state.textField.picUpPlaceValues == undefined || this.state.toList.value == '' || this.state.toList.value == undefined || this.state.textField.receipientValues == '' || this.state.fromList.value == '' || this.state.fromList.value == undefined || this.state.textField.senderValues == '') {
	      this.setState({
	        disabledInvoice: true
	      });
	    } else {
	      this.setState({
	        disabledInvoice: false
	      });
	    }
	    this.checkDisabledDatePick();
	  },

	  checkDisabledDatePick: function checkDisabledDatePick() {
	    if (this.state.textField.invoiceNameValues == '' || this.state.textField.invoiceNameValues == undefined || this.state.textField.picUpPlaceValues == '' || this.state.textField.picUpPlaceValues == undefined || this.state.toList.value == '' || this.state.toList.value == undefined || this.state.textField.receipientValues == '' || this.state.fromList.value == '' || this.state.fromList.value == undefined || this.state.textField.senderValues == '') {
	      this.setState({
	        disabledDatePick: true
	      });
	    } else {
	      this.setState({
	        disabledDatePick: false
	      });
	    }
	  },

	  checkDisabledDlType: function checkDisabledDlType(event, value) {
	    // console.log("Get = ",this.refs.picUpDate.getDate());
	    // console.log("event = ",event);
	    console.log("value = ", value);
	    if (value == undefined || value == null) {
	      this.setState({
	        disabledDlType: true
	      });
	    } else {
	      this.setState({
	        disabledDlType: false
	      });
	    }
	  },

	  formatDate: function formatDate(date) {
	    console.log("Date Format = ", date);
	    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
	  },

	  disabledAddBt: function disabledAddBt() {},

	  render: function render() {
	    // some text
	    var dialogAddBillingAction = [React.createElement(_flatButton2.default, {
	      label: 'Cancel',
	      secondary: true,
	      onTouchTap: this.dialogBilClose
	    }), React.createElement(_flatButton2.default, {
	      label: 'Submit',
	      primary: true,
	      keyboardFocused: true,
	      onTouchTap: this.dialogAddBilling
	    })];

	    var dialogChangeAddressAction = [React.createElement(_flatButton2.default, {
	      label: 'ADD',
	      primary: true,
	      onTouchTap: this.dialogBilOpen
	    }), React.createElement(_flatButton2.default, {
	      label: 'Close',
	      secondary: true,
	      onTouchTap: this.dialogAddressClose
	    })];

	    var dialogActions = [React.createElement(_flatButton2.default, {
	      label: 'OK',
	      primary: true,
	      keyboardFocused: true,
	      onTouchTap: this.dialogClose
	    })];
	    return React.createElement(
	      'div',
	      { className: 'layout-panel content-page', style: { margin: 'auto' } },
	      React.createElement(
	        'div',
	        { style: { overflow: 'scroll' } },
	        React.createElement(
	          _dialog2.default,
	          {
	            title: 'Change Address',
	            actions: dialogChangeAddressAction,
	            modal: false,
	            open: this.state.openAddressDialog
	          },
	          React.createElement(
	            'div',
	            { className: 'row', style: { maxHeight: '397px', overflow: 'scroll' } },
	            this.state.addressList
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        null,
	        React.createElement(
	          _dialog2.default,
	          {
	            title: 'Add Billing List',
	            actions: dialogAddBillingAction,
	            modal: false,
	            open: this.state.openBillingDialog,
	            onRequestClose: this.dialogAddressClose
	          },
	          React.createElement(
	            'div',
	            null,
	            React.createElement(_textField2.default, {
	              ref: 'billingCode',
	              hintText: 'Code/Branch'
	            }),
	            React.createElement(
	              'label',
	              { style: { 'margin-left': '20px' } },
	              ' '
	            ),
	            React.createElement(_textField2.default, {
	              ref: 'billingName',
	              hintText: 'Name'
	            }),
	            React.createElement('br', null),
	            React.createElement(_textField2.default, {
	              ref: 'billingAddr1',
	              hintText: 'NO./Building/Village'
	            }),
	            React.createElement(
	              'label',
	              { style: { 'margin-left': '20px' } },
	              ' '
	            ),
	            React.createElement(_textField2.default, {
	              ref: 'billingAddr2',
	              hintText: 'Alley/Road'
	            }),
	            React.createElement('br', null),
	            React.createElement(_textField2.default, {
	              ref: 'billingTambon',
	              hintText: 'Tambon'
	            }),
	            React.createElement(
	              'label',
	              { style: { 'margin-left': '20px' } },
	              ' '
	            ),
	            React.createElement(_textField2.default, {
	              ref: 'billingAmpher',
	              hintText: 'Amphur'
	            }),
	            React.createElement('br', null),
	            React.createElement(_textField2.default, {
	              ref: 'billingProvince',
	              hintText: 'Province'
	            }),
	            React.createElement(
	              'label',
	              { style: { 'margin-left': '20px' } },
	              ' '
	            ),
	            React.createElement(_textField2.default, {
	              ref: 'billingZipCode',
	              hintText: 'Zipcode'
	            }),
	            React.createElement('br', null),
	            React.createElement(_textField2.default, {
	              ref: 'billingTel',
	              hintText: 'Tel'
	            }),
	            React.createElement(
	              'label',
	              { style: { 'margin-left': '20px' } },
	              ' '
	            )
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        null,
	        React.createElement(
	          _dialog2.default,
	          {
	            title: 'Warning',
	            actions: dialogActions,
	            modal: false,
	            open: this.state.openDialog,
	            onRequestClose: this.dialogOpen
	          },
	          React.createElement(
	            'p',
	            { style: { 'color': '#636363' } },
	            this.state.dialogMessage
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'main-box', style: { width: '985px', height: '602px', backgroundColor: '#F5F5F5', overflow: 'scroll', padding: '10px' } },
	        React.createElement(
	          'div',
	          { className: 'row' },
	          React.createElement(
	            'div',
	            { className: 'columns', style: {
	                backgroundColor: '#FFE',
	                border: 'solid 1px lightgray',
	                height: '38px',
	                padding: '9px 15px 0px 15px',
	                width: '957px' }
	            },
	            React.createElement(
	              'p',
	              { style: { textAlign: 'center', fontSize: '0.8em' } },
	              'Welcome to One-X your GSM Logistics partner we offer you an easy online shipping solution.'
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'row' },
	          React.createElement(
	            'div',
	            { className: 'columns', style: {
	                height: '38px',
	                padding: '9px 15px 0px 15px',
	                width: '957px' }
	            },
	            React.createElement(
	              'p',
	              { style: { textAlign: 'center', fontSize: '1.0em' } },
	              'Get a ouote and prepare a shipment'
	            )
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'row1', style: { width: '957' } },
	          React.createElement(
	            'div',
	            { className: 'large-6 columns1', style: { border: 'solid 1px lightgray', backgroundColor: '#ffffff', width: '473px', float: 'left' } },
	            React.createElement(
	              'div',
	              { className: 'row1', style: { width: '100%' } },
	              React.createElement('div', { className: 'gps', style: { width: '8%', float: 'left', height: '72px' } }),
	              React.createElement(
	                'div',
	                { className: 'large-10 columns1', style: { width: '92%', height: '72px', float: 'left', padding: '20px 15px 0px 15px' } },
	                React.createElement(
	                  'p',
	                  null,
	                  'From'
	                ),
	                React.createElement(
	                  _selectField2.default,
	                  {
	                    ref: 'fromText',
	                    value: this.state.fromList.value,
	                    onChange: this.handleChangeFromList,
	                    style: { fontSize: '1.0em' },
	                    hintText: 'From'
	                  },
	                  this.state.fromList.list
	                )
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'row1', style: { width: '100%' } },
	              React.createElement('div', { style: { width: '8%', float: 'left', height: '72px' } }),
	              React.createElement(
	                'div',
	                { className: 'large-10 columns1', style: { width: '92%', float: 'left', padding: '0px 15px' } },
	                React.createElement(_textField2.default, {
	                  ref: 'sender',
	                  value: this.state.textField.senderValues,
	                  style: { 'width': '100%', fontSize: '1.0em' },
	                  floatingLabelText: 'Sender',
	                  hintText: 'Sender',
	                  multiLine: true,
	                  rows: 2,
	                  onChange: this.handleChangeTextField.bind(this, "senderValues"),
	                  onBlur: this.checkDisabledTo
	                })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'row align-right1', style: { width: '100%' } },
	              React.createElement(
	                'div',
	                { style: { padding: '0px 15px 3px 0px', width: '250px', float: 'right' } },
	                React.createElement(_flatButton2.default, {
	                  label: 'Click here to change address',
	                  style: { fontSize: '0.5em', float: 'right' },
	                  onMouseDown: this.changeAddress.bind(this, "sender")
	                })
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: this.state.disabledTo == true ? { border: 'solid 1px lightgray', backgroundColor: '#F5F5F5', width: '473px', float: 'right' } : { border: 'solid 1px lightgray', backgroundColor: '#ffffff', width: '473px', float: 'right' } },
	            React.createElement(
	              'div',
	              { style: { width: '100%' } },
	              React.createElement('div', { className: 'gps', style: { width: '8%', float: 'left', height: '72px' } }),
	              React.createElement(
	                'div',
	                { className: 'large-10 columns1', style: { width: '92%', height: '72px', float: 'left', padding: '20px 15px 0px 15px' } },
	                React.createElement(
	                  'p',
	                  null,
	                  'To'
	                ),
	                React.createElement(
	                  _selectField2.default,
	                  {
	                    ref: 'toText',
	                    value: this.state.toList.value,
	                    onChange: this.handleChangeToList,
	                    style: { fontSize: '1.0em' },
	                    hintText: 'To',
	                    disabled: this.state.disabledTo
	                  },
	                  this.state.toList.list
	                )
	              )
	            ),
	            React.createElement(
	              'div',
	              null,
	              React.createElement('div', { style: { width: '8%', float: 'left', height: '72px' } }),
	              React.createElement(
	                'div',
	                { style: { width: '92%', float: 'left', padding: '0px 15px' } },
	                React.createElement(_textField2.default, {
	                  ref: 'receipient',
	                  value: this.state.textField.receipientValues,
	                  style: { 'width': '100%', fontSize: '1.0em' },
	                  floatingLabelText: 'Recipient',
	                  hintText: 'Recipient',
	                  multiLine: true,
	                  rows: 4,
	                  disabled: this.state.disabledTo,
	                  onChange: this.handleChangeTextField.bind(this, "receipientValues"),
	                  onBlur: this.checkDisabledPickUp
	                })
	              )
	            ),
	            React.createElement(
	              'div',
	              null,
	              React.createElement(
	                'div',
	                { style: { padding: '0px 15px 3px 0px', width: '250px', float: 'right' } },
	                React.createElement(_flatButton2.default, {
	                  label: 'Click here to change address',
	                  style: { fontSize: '0.5em', float: 'right' },
	                  onMouseDown: this.changeAddress.bind(this, "receipient"),
	                  disabled: this.state.disabledTo
	                })
	              )
	            )
	          )
	        ),
	        React.createElement('div', { style: { clear: 'both' } }),
	        React.createElement(
	          'div',
	          { style: { marginTop: '5px', width: '957px' } },
	          React.createElement(
	            'div',
	            { style: this.state.disabledPickUp == true ? { border: 'solid 1px lightgray', backgroundColor: '#F5F5F5', width: '473px', minHeight: '32px', float: 'left' } : { border: 'solid 1px lightgray', backgroundColor: '#ffffff', width: '473px', minHeight: '32px', float: 'left' } },
	            React.createElement(
	              'div',
	              { style: { backgroundColor: '#e2e2e2', width: '100%', height: '32px' } },
	              React.createElement('div', { className: 'pickUpIcon', style: { width: '8%', height: '32px', float: 'left' } }),
	              React.createElement(
	                'div',
	                { className: 'large-10 columns1', style: { width: '92%', height: '32px', float: 'left', padding: '0px 15px' } },
	                React.createElement(
	                  'p',
	                  { style: { paddingTop: '10px' } },
	                  'PICKUP PLACE'
	                )
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'row1', style: { width: '100%' } },
	              React.createElement('div', { style: { width: '8%', minHeight: '32px', float: 'left' } }),
	              React.createElement(
	                'div',
	                { className: 'large-10 columns1', style: { width: '92%', float: 'left', padding: '0px 15px' } },
	                React.createElement(_textField2.default, {
	                  value: this.state.textField.picUpPlaceValues,
	                  ref: 'picUpPlace',
	                  style: { 'width': '100%', fontSize: '1.0em' },
	                  floatingLabelText: 'Pickup Place',
	                  hintText: 'Pickup Place',
	                  multiLine: true,
	                  rows: 2,
	                  onChange: this.handleChangeTextField.bind(this, "picUpPlaceValues"),
	                  disabled: this.state.disabledPickUp,
	                  onBlur: this.checkDisabledInvoice
	                })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'row align-right1', style: { width: '100%' } },
	              React.createElement(
	                'div',
	                { className: 'column small-81', style: { padding: '0px 15px 3px 0px', width: '250px', float: 'right' } },
	                React.createElement(_flatButton2.default, {
	                  label: 'Click here to change address',
	                  style: { fontSize: '0.5em', float: 'right' },
	                  onMouseDown: this.changeAddress.bind(this, "picUpPlace"),
	                  disabled: this.state.disabledPickUp
	                })
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'large-6 columns1', style: this.state.disabledInvoice == true ? { border: 'solid 1px lightgray', backgroundColor: '#F5F5F5', width: '473px', minHeight: '32px', float: 'right' } : { border: 'solid 1px lightgray', backgroundColor: '#ffffff', width: '473px', minHeight: '32px', float: 'right' } },
	            React.createElement(
	              'div',
	              { className: 'row', style: { backgroundColor: '#e2e2e2', width: '100%', height: '32px' } },
	              React.createElement('div', { className: 'invoiceIcon', style: { width: '8%', float: 'left', height: '32px' } }),
	              React.createElement(
	                'div',
	                { className: 'large-10 columns1', style: { width: '92%', height: '32px', float: 'left', padding: '0px 15px' } },
	                React.createElement(
	                  'p',
	                  { style: { paddingTop: '10px' } },
	                  'INVOICE NAME'
	                )
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'row1', style: { width: '100%' } },
	              React.createElement('div', { style: { width: '8%', minHeight: '32px', float: 'left' } }),
	              React.createElement(
	                'div',
	                { className: 'large-10 columns1', style: { width: '92%', float: 'left', padding: '0px 15px' } },
	                React.createElement(_textField2.default, {
	                  value: this.state.textField.invoiceNameValues,
	                  ref: 'invoiceName',
	                  style: { 'width': '100%', fontSize: '1.0em' },
	                  floatingLabelText: 'Invoice Name',
	                  hintText: 'Invoice Name',
	                  multiLine: true,
	                  rows: 1,
	                  onChange: this.handleChangeTextField.bind(this, "invoiceNameValues"),
	                  disabled: this.state.disabledInvoice,
	                  onBlur: this.checkDisabledDatePick
	                })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'row align-right1', style: { width: '100%' } },
	              React.createElement(
	                'div',
	                { className: 'column small-81', style: { padding: '0px 15px 3px 0px', width: '250px', float: 'right' } },
	                React.createElement(_flatButton2.default, {
	                  label: 'Click here to change address',
	                  style: { fontSize: '0.5em', float: 'right' },
	                  onMouseDown: this.changeAddress.bind(this, "invoiceName"),
	                  disabled: this.state.disabledInvoice
	                })
	              )
	            )
	          )
	        ),
	        React.createElement('div', { style: { clear: 'both' } }),
	        React.createElement(
	          'div',
	          { style: this.state.disabledDatePick == true ? { marginTop: '5px', border: 'solid 1px lightgray', backgroundColor: '#F5F5F5', width: '957px' } : { marginTop: '5px', border: 'solid 1px lightgray', backgroundColor: '#ffffff', width: '957px' } },
	          React.createElement(
	            'div',
	            { style: { width: '100%', float: 'left', marginTop: '10px', paddingLeft: '10px' } },
	            React.createElement(
	              'p',
	              null,
	              'Package & Shipment Detail'
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: { marginTop: '10px', width: '100%', float: 'left' } },
	            React.createElement(
	              'div',
	              { style: { width: '50%', float: 'left' } },
	              React.createElement('div', { className: 'dateIcon', style: { width: '8%', height: '32px', float: 'left' } }),
	              React.createElement(
	                'div',
	                { className: 'large-10 columns2', style: { width: '92%', height: '32px', padding: '0px 15px', float: 'left' } },
	                React.createElement(
	                  'p',
	                  { style: { paddingTop: '10px' } },
	                  React.createElement(
	                    'b',
	                    null,
	                    'Date Pickup'
	                  )
	                )
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: { marginTop: '10px', width: '100%', float: 'left' } },
	            React.createElement(
	              'div',
	              { style: { width: '50%', float: 'left' } },
	              React.createElement('div', { style: { width: '8%', minHeight: '32px', float: 'left' } }),
	              React.createElement(
	                'div',
	                { className: 'large-10 columns2', style: { width: '92%', padding: '0px 15px', float: 'left' } },
	                React.createElement(_datePicker2.default, {
	                  ref: 'picUpDate',
	                  hintText: 'Date',
	                  mode: 'landscape',
	                  formatDate: this.formatDate,
	                  style: { fontSize: '1.0em' },
	                  disabled: this.state.disabledDatePick,
	                  onChange: this.checkDisabledDlType
	                })
	              )
	            )
	          ),
	          React.createElement('div', { style: { clear: 'both' } }),
	          React.createElement(
	            'div',
	            { style: { width: '100%', float: 'left' } },
	            React.createElement(
	              'div',
	              { style: { width: '473px', minHeight: '32px', float: 'left', marginTop: '5px' } },
	              React.createElement(
	                'div',
	                { style: { width: '100%', float: 'left' } },
	                React.createElement('div', { className: 'pickUpIcon', style: { width: '8%', height: '32px', float: 'left' } }),
	                React.createElement(
	                  'div',
	                  { className: 'large-10 columns', style: { width: '92%', height: '32px', float: 'left', padding: '0px 15px' } },
	                  React.createElement(
	                    'p',
	                    { style: { paddingTop: '10px' } },
	                    React.createElement(
	                      'b',
	                      null,
	                      'Package Contents'
	                    )
	                  )
	                )
	              ),
	              React.createElement(
	                'div',
	                { style: { width: '100%', float: 'left' } },
	                React.createElement('div', { style: { width: '8%', float: 'left', minHeight: '32px' } }),
	                React.createElement(
	                  'div',
	                  { style: { width: '92%', float: 'left', padding: '0px 15px' } },
	                  React.createElement(
	                    _radioButtonGroup2.default,
	                    { ref: 'package', name: 'package', defaultSelected: 'Document', onChange: this.radioPackage },
	                    React.createElement(_radioButton2.default, {
	                      value: 'Document',
	                      label: 'Document',
	                      style: styles.radioButton
	                    }),
	                    React.createElement(_radioButton2.default, {
	                      value: 'Product',
	                      label: 'Parcel',
	                      style: styles.radioButton
	                    })
	                  )
	                ),
	                React.createElement('div', { style: { width: '8%', float: 'left', minHeight: '32px' } }),
	                React.createElement(
	                  'div',
	                  { style: { width: '92%', float: 'left', padding: '0px 15px', minHeight: '98px' } },
	                  React.createElement(
	                    _selectField2.default,
	                    {
	                      ref: 'packageList',
	                      value: this.state.packageListValue.value,
	                      onChange: this.handleChangepackageList,
	                      disabled: this.state.packageListValue.isLock,
	                      style: { fontSize: '1.0em' },
	                      hintText: 'Select Contents'
	                    },
	                    this.state.packageListValue.list
	                  ),
	                  React.createElement(_textField2.default, {
	                    style: { 'width': '100%', fontSize: '1.0em' },
	                    ref: 'content',
	                    hintText: 'Content'
	                  })
	                )
	              )
	            ),
	            React.createElement(
	              'div',
	              { style: { width: '473px', minHeight: '32px', float: 'right', marginTop: '5px' } },
	              React.createElement(
	                'div',
	                { style: { width: '100%' } },
	                React.createElement('div', { className: 'boxIcon', style: { width: '8%', float: 'left', height: '32px' } }),
	                React.createElement(
	                  'div',
	                  { style: { width: '92%', height: '32px', float: 'left', padding: '0px 15px' } },
	                  React.createElement(
	                    'p',
	                    { style: { paddingTop: '10px' } },
	                    React.createElement(
	                      'b',
	                      null,
	                      'Delivery type'
	                    )
	                  )
	                )
	              ),
	              React.createElement(
	                'div',
	                { style: { width: '100%' } },
	                React.createElement('div', { style: { width: '8%', float: 'left', minHeight: '32px' } }),
	                React.createElement(
	                  'div',
	                  { style: { width: '92%', float: 'left', padding: '0px 15px' } },
	                  React.createElement(
	                    _selectField2.default,
	                    {
	                      ref: 'rateType',
	                      value: this.state.rateType.value,
	                      onChange: this.handleChangeRateType,
	                      hintText: 'Delivery type',
	                      disabled: this.state.disabledDlType
	                    },
	                    this.state.rateType.list
	                  )
	                )
	              )
	            )
	          ),
	          React.createElement('div', { style: { clear: 'both' } }),
	          React.createElement(
	            'div',
	            { style: { marginTop: '15px', width: '957px' } },
	            React.createElement(
	              'div',
	              { style: { width: '100%', float: 'left' } },
	              React.createElement('div', { className: 'kg', style: { width: '4%', float: 'left', height: '32px' } }),
	              React.createElement(
	                'div',
	                { style: { width: '96%', height: '32px', paddingLeft: '13px', float: 'left', padding: '0px 15px' } },
	                React.createElement(
	                  'p',
	                  { style: { paddingTop: '10px' } },
	                  React.createElement(
	                    'b',
	                    null,
	                    'Dimension'
	                  )
	                )
	              )
	            ),
	            React.createElement(
	              'div',
	              { style: { paddingLeft: '35px', paddingRight: '150px', width: '100%', float: 'left' } },
	              React.createElement(
	                'div',
	                { style: { padding: '0px 15px', width: '134px', float: 'left' } },
	                React.createElement(_textField2.default, {
	                  ref: 'width',
	                  style: { 'width': '100%' },
	                  floatingLabelText: 'Width (cm.)'
	                })
	              ),
	              React.createElement(
	                'div',
	                { style: { padding: '0px 15px', width: '134px', float: 'left' } },
	                React.createElement(_textField2.default, {
	                  ref: 'depth',
	                  style: { 'width': '100%' },
	                  floatingLabelText: 'Depth (cm.)'
	                })
	              ),
	              React.createElement(
	                'div',
	                { style: { padding: '0px 15px', width: '134px', float: 'left' } },
	                React.createElement(_textField2.default, {
	                  ref: 'height',
	                  style: { 'width': '100%' },
	                  floatingLabelText: 'Height (cm.)'
	                })
	              ),
	              React.createElement(
	                'div',
	                { style: { padding: '0px 15px', width: '134px', float: 'left' } },
	                React.createElement(_textField2.default, {
	                  ref: 'weight',
	                  style: { 'width': '100%' },
	                  floatingLabelText: 'Weight (kg.)'
	                })
	              ),
	              React.createElement(
	                'div',
	                { style: { padding: '0px 15px', width: '134px', float: 'left' } },
	                React.createElement(_textField2.default, {
	                  ref: 'qty',
	                  style: { 'width': '100%' },
	                  floatingLabelText: 'QTY'
	                })
	              ),
	              React.createElement(
	                'div',
	                { style: { padding: '25px 10px 0px 10px', width: '100px', float: 'right' } },
	                React.createElement(
	                  _floatingActionButton2.default,
	                  {
	                    mini: true,
	                    secondary: true,
	                    style: { marginRight: 20 },
	                    onMouseDown: this.calContent
	                  },
	                  React.createElement(_add2.default, null)
	                )
	              )
	            )
	          ),
	          React.createElement('div', { style: { clear: 'both' } }),
	          React.createElement(
	            'div',
	            { style: { marginTop: '15px', padding: '0px 15px', width: '100%', float: 'right' } },
	            React.createElement(_textField2.default, {
	              disabled: true,
	              hintText: 'Pricing',
	              style: { 'width': '100%' }
	            })
	          ),
	          React.createElement('div', { style: { clear: 'both' } }),
	          React.createElement(
	            'div',
	            { style: { marginTop: '15px', padding: '0px 30px 0px 30px', width: '100%', float: 'left' } },
	            React.createElement(
	              'div',
	              { style: this.state.checkDataTable > 0 ? { display: 'block' } : { 'display': 'none' } },
	              React.createElement(
	                _table2.default,
	                {
	                  fixedHeader: this.state.fixedHeader,
	                  fixedFooter: this.state.fixedFooter,
	                  selectable: this.state.selectable,
	                  multiSelectable: this.state.multiSelectable,
	                  displaySelectAll: this.state.displaySelectAll,
	                  onRowSelection: this._onRowSelection,
	                  style: { marginBottom: '0px' }
	                },
	                React.createElement(
	                  _tableHeader2.default,
	                  { selectAllSelected: this.state.selectAllSelected,
	                    adjustForCheckbox: this.state.hAdjustForCheckbox,
	                    displaySelectAll: this.state.displayRowCheckbox
	                  },
	                  React.createElement(
	                    _tableRow2.default,
	                    { style: { 'padding': '0px', 'height': '49px', 'border-bottom': '1px dotted #e2e2e2' } },
	                    React.createElement(
	                      _tableHeaderColumn2.default,
	                      { style: { textAlign: 'left', 'width': '22%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      React.createElement(
	                        'h4',
	                        { style: { textAlign: 'left' } },
	                        'CONTENT'
	                      )
	                    ),
	                    React.createElement(
	                      _tableHeaderColumn2.default,
	                      { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      React.createElement(
	                        'h4',
	                        { style: { textAlign: 'center' } },
	                        'QTY'
	                      )
	                    ),
	                    React.createElement(
	                      _tableHeaderColumn2.default,
	                      { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      React.createElement(
	                        'h4',
	                        { style: { textAlign: 'center' } },
	                        'WIDTH'
	                      )
	                    ),
	                    React.createElement(
	                      _tableHeaderColumn2.default,
	                      { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      React.createElement(
	                        'h4',
	                        { style: { textAlign: 'center' } },
	                        'DEPTH'
	                      )
	                    ),
	                    React.createElement(
	                      _tableHeaderColumn2.default,
	                      { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      React.createElement(
	                        'h4',
	                        { style: { textAlign: 'center' } },
	                        'HEIGHT'
	                      )
	                    ),
	                    React.createElement(
	                      _tableHeaderColumn2.default,
	                      { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      React.createElement(
	                        'h4',
	                        { style: { textAlign: 'center' } },
	                        'WEIGHT'
	                      )
	                    ),
	                    React.createElement(
	                      _tableHeaderColumn2.default,
	                      { style: { textAlign: 'right', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      React.createElement(
	                        'h4',
	                        { style: { textAlign: 'center' } },
	                        'AMOUNT'
	                      )
	                    ),
	                    React.createElement(
	                      _tableHeaderColumn2.default,
	                      { style: { textAlign: 'center', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      React.createElement(
	                        'h4',
	                        { style: { textAlign: 'center' } },
	                        'CURRENTCY'
	                      )
	                    ),
	                    React.createElement(_tableHeaderColumn2.default, { style: { 'min-width': '103px', 'width': '8%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } })
	                  )
	                ),
	                React.createElement(
	                  _tableBody2.default,
	                  {
	                    deselectOnClickaway: this.state.deselectOnClickaway,
	                    showRowHover: this.state.showRowHover,
	                    stripedRows: this.state.stripedRows,
	                    displayRowCheckbox: this.state.displayRowCheckbox
	                  },
	                  this.state.tableProductRow
	                ),
	                React.createElement(
	                  _tableFooter2.default,
	                  {
	                    adjustForCheckbox: this.state.adjustForCheckbox
	                  },
	                  React.createElement(
	                    _tableRow2.default,
	                    null,
	                    React.createElement(
	                      _tableRowColumn2.default,
	                      { style: { textAlign: 'left', 'width': '22%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      'Surcharge'
	                    ),
	                    React.createElement(_tableRowColumn2.default, { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(
	                      _tableRowColumn2.default,
	                      { style: { textAlign: 'right', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      helper.numberFormat(this.state.surCharge, 2)
	                    ),
	                    React.createElement(
	                      _tableRowColumn2.default,
	                      { style: { textAlign: 'center', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      this.state.currencyCodeTemp
	                    ),
	                    React.createElement(_tableRowColumn2.default, { style: { 'min-width': '103px', 'width': '8%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } })
	                  ),
	                  React.createElement(
	                    _tableRow2.default,
	                    null,
	                    React.createElement(
	                      _tableRowColumn2.default,
	                      { style: { textAlign: 'left', 'width': '22%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      'Discount'
	                    ),
	                    React.createElement(_tableRowColumn2.default, { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(
	                      _tableRowColumn2.default,
	                      { style: { textAlign: 'right', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      '-',
	                      helper.numberFormat(this.state.discount, 2)
	                    ),
	                    React.createElement(
	                      _tableRowColumn2.default,
	                      { style: { textAlign: 'center', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      this.state.currencyCodeTemp
	                    ),
	                    React.createElement(_tableRowColumn2.default, { style: { 'min-width': '103px', 'width': '8%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } })
	                  ),
	                  React.createElement(
	                    _tableRow2.default,
	                    null,
	                    React.createElement(
	                      _tableRowColumn2.default,
	                      { style: { textAlign: 'left', 'width': '22%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      'Total'
	                    ),
	                    React.createElement(_tableRowColumn2.default, { style: { textAlign: 'right', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { textAlign: 'right', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { textAlign: 'right', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { textAlign: 'right', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(_tableRowColumn2.default, { style: { textAlign: 'right', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } }),
	                    React.createElement(
	                      _tableRowColumn2.default,
	                      { style: { textAlign: 'right', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      helper.numberFormat(this.state.totalAmount, 2)
	                    ),
	                    React.createElement(
	                      _tableRowColumn2.default,
	                      { style: { textAlign: 'center', 'width': '10%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } },
	                      this.state.currencyCodeTemp
	                    ),
	                    React.createElement(_tableRowColumn2.default, { style: { 'min-width': '103px', 'width': '8%', 'padding': '0px', 'padding-left': '3px', 'vertical-align': 'middle' } })
	                  )
	                )
	              )
	            )
	          ),
	          React.createElement('div', { style: { clear: 'both' } }),
	          React.createElement(
	            'div',
	            { style: { marginTop: '15px', padding: '0px 15px', float: 'left', width: '100%' } },
	            React.createElement(_textField2.default, {
	              disabled: true,
	              hintText: 'Payment',
	              style: { 'width': '100%' }
	            })
	          ),
	          React.createElement('div', { style: { clear: 'both' } }),
	          React.createElement(
	            'div',
	            { style: { marginTop: '15px', padding: '0px 15px', float: 'left', width: '100%' } },
	            React.createElement(
	              _radioButtonGroup2.default,
	              { ref: 'paymentType', name: 'paymentType', defaultSelected: this.state.isPaymentType == true ? "credit" : "billing" },
	              React.createElement(_radioButton2.default, {
	                value: 'credit',
	                label: 'CREDIT CARD',
	                style: styles.radioButton
	              }),
	              React.createElement(_radioButton2.default, {
	                value: 'billing',
	                label: 'BILLING',
	                disabled: this.state.isPaymentType,
	                style: styles.radioButton
	              })
	            )
	          ),
	          React.createElement('div', { style: { clear: 'both' } }),
	          React.createElement(
	            'div',
	            { style: { marginTop: '15px', padding: '0px 15px', float: 'left', width: '100%' } },
	            React.createElement(
	              'div',
	              { style: { width: '25px', 'float': 'left' } },
	              React.createElement(_checkbox2.default, {
	                onCheck: this.agreeBox,
	                checked: this.state.enableNext,
	                style: styles.checkbox
	              })
	            ),
	            React.createElement(
	              'div',
	              { style: { 'float': 'left', 'height': '24px', 'padding-top': '5px', 'margin-left': '7px' } },
	              'I have read and agree to the ',
	              React.createElement(
	                'a',
	                { href: 'http://www.w3schools.com' },
	                'Terms & Condition'
	              )
	            )
	          ),
	          React.createElement('div', { style: { clear: 'both' } }),
	          React.createElement(
	            'div',
	            { style: { marginTop: '15px', padding: '0px 15px', float: 'left', width: '100%' } },
	            React.createElement(
	              'div',
	              { style: { marginBottom: '30px', width: '100px', float: 'right' } },
	              React.createElement(_raisedButton2.default, {
	                label: 'Next',
	                onMouseDown: this.saveBooking,
	                primary: true,
	                style: styles.RaisedButtonNextStyle,
	                disabled: this.state.disabledDatePick
	              })
	            )
	          ),
	          React.createElement('div', { style: { clear: 'both' } })
	        )
	      )
	    );
	  }
	});

	module.exports = LoadFareScreen;

	// <div className="row">
	//   <div className="large-12 columns">
	//     <TextField
	//         ref="search"
	//         style={{'width':'100%'}}
	//         floatingLabelText="Search"
	//         hintText="Search"
	//       />
	//   </div>
	// </div>

	// <div style={{'border': '2px solid #e2e2e2','border-radius':'8px','padding': '3px','margin': '5px'}}>

	//             </div>
	// <div style={{'border': '2px solid #e2e2e2','border-radius':'8px','padding': '3px','margin': '5px'}}>

	// </div>

/***/ },

/***/ 544:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _stylePropable = __webpack_require__(231);

	var _stylePropable2 = _interopRequireDefault(_stylePropable);

	var _windowListenable = __webpack_require__(296);

	var _windowListenable2 = _interopRequireDefault(_windowListenable);

	var _timePickerDialog = __webpack_require__(545);

	var _timePickerDialog2 = _interopRequireDefault(_timePickerDialog);

	var _textField = __webpack_require__(536);

	var _textField2 = _interopRequireDefault(_textField);

	var _getMuiTheme = __webpack_require__(268);

	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	var emptyTime = new Date();
	emptyTime.setHours(0);
	emptyTime.setMinutes(0);
	emptyTime.setSeconds(0);
	emptyTime.setMilliseconds(0);

	var TimePicker = _react2.default.createClass({
	  displayName: 'TimePicker',

	  propTypes: {
	    /**
	     * If true, automatically accept and close the picker on set minutes.
	     */
	    autoOk: _react2.default.PropTypes.bool,

	    /**
	     * This is the initial time value of the component.
	     */
	    defaultTime: _react2.default.PropTypes.object,

	    /**
	     * Tells the component to display the picker in
	     * ampm (12hr) format or 24hr format.
	     */
	    format: _react2.default.PropTypes.oneOf(['ampm', '24hr']),

	    /**
	     * Callback function that is fired when the time
	     * value changes. The time value is passed in a Date
	     * Object.Since there is no particular event associated
	     * with the change the first argument will always be null
	     * and the second argument will be the new Date instance.
	     */
	    onChange: _react2.default.PropTypes.func,

	    /**
	     * Fired when the timepicker dialog is dismissed.
	     */
	    onDismiss: _react2.default.PropTypes.func,

	    /**
	     * Callback function that is fired when the timepicker field gains focus.
	     */
	    onFocus: _react2.default.PropTypes.func,

	    /**
	     * Fired when the timepicker dialog is shown.
	     */
	    onShow: _react2.default.PropTypes.func,

	    /**
	     * Callback for touch tap event.
	     */
	    onTouchTap: _react2.default.PropTypes.func,

	    /**
	     * It's technically more correct to refer to
	     * "12 noon" and "12 midnight" rather than
	     * "12 a.m." and "12 p.m." and it avoids real
	     * confusion between different locales. By default
	     * (for compatibility reasons) TimePicker uses
	     * (12 a.m./12 p.m.) To use (noon/midnight) set pedantic={true}.
	     */
	    pedantic: _react2.default.PropTypes.bool,

	    /**
	     * Override the inline-styles of the root element.
	     */
	    style: _react2.default.PropTypes.object,

	    /**
	     * Override the inline-styles of TimePicker's TextField element.
	     */
	    textFieldStyle: _react2.default.PropTypes.object
	  },

	  contextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  mixins: [_stylePropable2.default, _windowListenable2.default],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      defaultTime: null,
	      format: 'ampm',
	      pedantic: false,
	      autoOk: false,
	      style: {}
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      time: this.props.defaultTime || emptyTime,
	      dialogTime: new Date(),
	      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
	    };
	  },

	  windowListeners: {
	    'keyup': '_handleWindowKeyUp'
	  },

	  formatTime: function formatTime(date) {
	    var hours = date.getHours();
	    var mins = date.getMinutes().toString();

	    if (this.props.format === 'ampm') {
	      var isAM = hours < 12;
	      hours = hours % 12;
	      var additional = isAM ? ' am' : ' pm';
	      hours = (hours || 12).toString();

	      if (mins.length < 2) mins = '0' + mins;

	      if (this.props.pedantic) {
	        // Treat midday/midnight specially http://www.nist.gov/pml/div688/times.cfm
	        if (hours === '12' && mins === '00') {
	          return additional === ' pm' ? '12 noon' : '12 midnight';
	        }
	      }

	      return hours + (mins === '00' ? '' : ':' + mins) + additional;
	    }

	    hours = hours.toString();

	    if (hours.length < 2) hours = '0' + hours;
	    if (mins.length < 2) mins = '0' + mins;

	    return hours + ':' + mins;
	  },
	  getTime: function getTime() {
	    return this.state.time;
	  },
	  setTime: function setTime(time) {
	    this.setState({ time: time ? time : emptyTime });
	  },

	  /**
	   * Alias for `openDialog()` for an api consistent with TextField.
	   */
	  focus: function focus() {
	    this.openDialog();
	  },
	  openDialog: function openDialog() {
	    this.setState({
	      dialogTime: this.getTime()
	    });

	    this.refs.dialogWindow.show();
	  },
	  _handleDialogAccept: function _handleDialogAccept(t) {
	    this.setTime(t);
	    if (this.props.onChange) this.props.onChange(null, t);
	  },
	  _handleInputFocus: function _handleInputFocus(e) {
	    e.target.blur();
	    if (this.props.onFocus) this.props.onFocus(e);
	  },
	  _handleInputTouchTap: function _handleInputTouchTap(e) {
	    e.preventDefault();

	    this.openDialog();

	    if (this.props.onTouchTap) this.props.onTouchTap(e);
	  },
	  render: function render() {
	    var _props = this.props;
	    var autoOk = _props.autoOk;
	    var format = _props.format;
	    var onFocus = _props.onFocus;
	    var onTouchTap = _props.onTouchTap;
	    var onShow = _props.onShow;
	    var onDismiss = _props.onDismiss;
	    var style = _props.style;
	    var textFieldStyle = _props.textFieldStyle;

	    var other = _objectWithoutProperties(_props, ['autoOk', 'format', 'onFocus', 'onTouchTap', 'onShow', 'onDismiss', 'style', 'textFieldStyle']);

	    var time = this.state.time;

	    return _react2.default.createElement(
	      'div',
	      { style: this.prepareStyles(style) },
	      _react2.default.createElement(_textField2.default, _extends({}, other, {
	        style: textFieldStyle,
	        ref: 'input',
	        value: time === emptyTime ? null : this.formatTime(time),
	        onFocus: this._handleInputFocus,
	        onTouchTap: this._handleInputTouchTap
	      })),
	      _react2.default.createElement(_timePickerDialog2.default, {
	        ref: 'dialogWindow',
	        initialTime: this.state.dialogTime,
	        onAccept: this._handleDialogAccept,
	        onShow: onShow,
	        onDismiss: onDismiss,
	        format: format,
	        autoOk: autoOk
	      })
	    );
	  }
	});

	exports.default = TimePicker;
	module.exports = exports['default'];

/***/ },

/***/ 545:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _stylePropable = __webpack_require__(231);

	var _stylePropable2 = _interopRequireDefault(_stylePropable);

	var _windowListenable = __webpack_require__(296);

	var _windowListenable2 = _interopRequireDefault(_windowListenable);

	var _keyCode = __webpack_require__(260);

	var _keyCode2 = _interopRequireDefault(_keyCode);

	var _clock = __webpack_require__(546);

	var _clock2 = _interopRequireDefault(_clock);

	var _dialog = __webpack_require__(329);

	var _dialog2 = _interopRequireDefault(_dialog);

	var _flatButton = __webpack_require__(330);

	var _flatButton2 = _interopRequireDefault(_flatButton);

	var _getMuiTheme = __webpack_require__(268);

	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	var TimePickerDialog = _react2.default.createClass({
	  displayName: 'TimePickerDialog',

	  propTypes: {
	    autoOk: _react2.default.PropTypes.bool,
	    format: _react2.default.PropTypes.oneOf(['ampm', '24hr']),
	    initialTime: _react2.default.PropTypes.object,
	    onAccept: _react2.default.PropTypes.func,
	    onDismiss: _react2.default.PropTypes.func,
	    onShow: _react2.default.PropTypes.func
	  },

	  contextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  mixins: [_stylePropable2.default, _windowListenable2.default],

	  getInitialState: function getInitialState() {
	    return {
	      open: false,
	      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
	    };
	  },
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },

	  //to update theme inside state whenever a new theme is passed down
	  //from the parent / owner using context
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({ muiTheme: newMuiTheme });
	  },

	  windowListeners: {
	    keyup: '_handleWindowKeyUp'
	  },

	  getTheme: function getTheme() {
	    return this.state.muiTheme.timePicker;
	  },
	  show: function show() {
	    if (this.props.onShow && !this.state.open) this.props.onShow();
	    this.setState({
	      open: true
	    });
	  },
	  dismiss: function dismiss() {
	    if (this.props.onDismiss && this.state.open) this.props.onDismiss();
	    this.setState({
	      open: false
	    });
	  },
	  _handleOKTouchTap: function _handleOKTouchTap() {
	    this.dismiss();
	    if (this.props.onAccept) {
	      this.props.onAccept(this.refs.clock.getSelectedTime());
	    }
	  },
	  _handleWindowKeyUp: function _handleWindowKeyUp(event) {
	    if (this.state.open) {
	      switch (event.keyCode) {
	        case _keyCode2.default.ENTER:
	          this._handleOKTouchTap();
	          break;
	      }
	    }
	  },
	  render: function render() {
	    var _props = this.props;
	    var initialTime = _props.initialTime;
	    var onAccept = _props.onAccept;
	    var format = _props.format;
	    var autoOk = _props.autoOk;

	    var other = _objectWithoutProperties(_props, ['initialTime', 'onAccept', 'format', 'autoOk']);

	    var styles = {
	      root: {
	        fontSize: 14,
	        color: this.getTheme().clockColor
	      },
	      dialogContent: {
	        width: 280
	      },
	      body: {
	        padding: 0
	      }
	    };

	    var actions = [_react2.default.createElement(_flatButton2.default, {
	      key: 0,
	      label: 'Cancel',
	      secondary: true,
	      onTouchTap: this.dismiss
	    }), _react2.default.createElement(_flatButton2.default, {
	      key: 1,
	      label: 'OK',
	      secondary: true,
	      onTouchTap: this._handleOKTouchTap
	    })];

	    var onClockChangeMinutes = autoOk === true ? this._handleOKTouchTap : undefined;

	    return _react2.default.createElement(
	      _dialog2.default,
	      _extends({}, other, {
	        ref: 'dialogWindow',
	        style: this.mergeStyles(styles.root),
	        bodyStyle: styles.body,
	        actions: actions,
	        contentStyle: styles.dialogContent,
	        repositionOnUpdate: false,
	        open: this.state.open,
	        onRequestClose: this.dismiss
	      }),
	      _react2.default.createElement(_clock2.default, {
	        ref: 'clock',
	        format: format,
	        initialTime: initialTime,
	        onChangeMinutes: onClockChangeMinutes
	      })
	    );
	  }
	});

	exports.default = TimePickerDialog;
	module.exports = exports['default'];

/***/ },

/***/ 546:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _stylePropable = __webpack_require__(231);

	var _stylePropable2 = _interopRequireDefault(_stylePropable);

	var _timeDisplay = __webpack_require__(547);

	var _timeDisplay2 = _interopRequireDefault(_timeDisplay);

	var _clockHours = __webpack_require__(548);

	var _clockHours2 = _interopRequireDefault(_clockHours);

	var _clockMinutes = __webpack_require__(551);

	var _clockMinutes2 = _interopRequireDefault(_clockMinutes);

	var _getMuiTheme = __webpack_require__(268);

	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Clock = _react2.default.createClass({
	  displayName: 'Clock',

	  propTypes: {
	    format: _react2.default.PropTypes.oneOf(['ampm', '24hr']),
	    initialTime: _react2.default.PropTypes.object,
	    isActive: _react2.default.PropTypes.bool,
	    mode: _react2.default.PropTypes.oneOf(['hour', 'minute']),
	    onChangeHours: _react2.default.PropTypes.func,
	    onChangeMinutes: _react2.default.PropTypes.func
	  },

	  contextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  mixins: [_stylePropable2.default],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      initialTime: new Date()
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)(),
	      selectedTime: this.props.initialTime,
	      mode: 'hour'
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({
	      muiTheme: newMuiTheme,
	      selectedTime: nextProps.initialTime
	    });
	  },
	  _setMode: function _setMode(mode) {
	    var _this = this;

	    setTimeout(function () {
	      _this.setState({
	        mode: mode
	      });
	    }, 100);
	  },
	  _setAffix: function _setAffix(affix) {
	    if (affix === this._getAffix()) return;

	    var hours = this.state.selectedTime.getHours();

	    if (affix === 'am') {
	      this.handleChangeHours(hours - 12, affix);
	      return;
	    }

	    this.handleChangeHours(hours + 12, affix);
	  },
	  _getAffix: function _getAffix() {
	    if (this.props.format !== 'ampm') return '';

	    var hours = this.state.selectedTime.getHours();
	    if (hours < 12) {
	      return 'am';
	    }

	    return 'pm';
	  },
	  handleChangeHours: function handleChangeHours(hours, finished) {
	    var _this2 = this;

	    var time = new Date(this.state.selectedTime);
	    var affix = undefined;

	    if (typeof finished === 'string') {
	      affix = finished;
	      finished = undefined;
	    }
	    if (!affix) {
	      affix = this._getAffix();
	    }
	    if (affix === 'pm' && hours < 12) {
	      hours += 12;
	    }

	    time.setHours(hours);
	    this.setState({
	      selectedTime: time
	    });

	    var onChangeHours = this.props.onChangeHours;

	    if (finished) {
	      setTimeout(function () {
	        _this2.setState({
	          mode: 'minute'
	        });
	        if (typeof onChangeHours === 'function') {
	          onChangeHours(time);
	        }
	      }, 100);
	    }
	  },
	  handleChangeMinutes: function handleChangeMinutes(minutes) {
	    var time = new Date(this.state.selectedTime);
	    time.setMinutes(minutes);
	    this.setState({
	      selectedTime: time
	    });

	    var onChangeMinutes = this.props.onChangeMinutes;

	    if (typeof onChangeMinutes === 'function') {
	      setTimeout(function () {
	        onChangeMinutes(time);
	      }, 0);
	    }
	  },
	  getSelectedTime: function getSelectedTime() {
	    return this.state.selectedTime;
	  },
	  render: function render() {
	    var clock = null;

	    var styles = {
	      root: {},

	      container: {
	        height: 280,
	        padding: 10,
	        position: 'relative'
	      },

	      circle: {
	        position: 'absolute',
	        top: 20,
	        width: 260,
	        height: 260,
	        borderRadius: '100%',
	        backgroundColor: this.state.muiTheme.timePicker.clockCircleColor
	      }
	    };

	    if (this.state.mode === 'hour') {
	      clock = _react2.default.createElement(_clockHours2.default, { key: 'hours',
	        format: this.props.format,
	        onChange: this.handleChangeHours,
	        initialHours: this.state.selectedTime.getHours()
	      });
	    } else {
	      clock = _react2.default.createElement(_clockMinutes2.default, { key: 'minutes',
	        onChange: this.handleChangeMinutes,
	        initialMinutes: this.state.selectedTime.getMinutes()
	      });
	    }

	    return _react2.default.createElement(
	      'div',
	      { style: this.prepareStyles(styles.root) },
	      _react2.default.createElement(_timeDisplay2.default, {
	        selectedTime: this.state.selectedTime,
	        mode: this.state.mode,
	        format: this.props.format,
	        affix: this._getAffix(),
	        onSelectAffix: this._setAffix,
	        onSelectHour: this._setMode.bind(this, 'hour'),
	        onSelectMin: this._setMode.bind(this, 'minute')
	      }),
	      _react2.default.createElement(
	        'div',
	        { style: this.prepareStyles(styles.container) },
	        _react2.default.createElement('div', { style: this.prepareStyles(styles.circle) }),
	        clock
	      )
	    );
	  }
	});

	exports.default = Clock;
	module.exports = exports['default'];

/***/ },

/***/ 547:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _stylePropable = __webpack_require__(231);

	var _stylePropable2 = _interopRequireDefault(_stylePropable);

	var _getMuiTheme = __webpack_require__(268);

	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	var TimeDisplay = _react2.default.createClass({
	  displayName: 'TimeDisplay',

	  propTypes: {
	    affix: _react2.default.PropTypes.oneOf(['', 'pm', 'am']),
	    format: _react2.default.PropTypes.oneOf(['ampm', '24hr']),
	    mode: _react2.default.PropTypes.oneOf(['hour', 'minute']),
	    onSelectAffix: _react2.default.PropTypes.func,
	    onSelectHour: _react2.default.PropTypes.func,
	    onSelectMin: _react2.default.PropTypes.func,
	    selectedTime: _react2.default.PropTypes.object.isRequired
	  },

	  contextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  mixins: [_stylePropable2.default],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      mode: 'hour',
	      affix: ''
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      transitionDirection: 'up',
	      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
	    };
	  },
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var direction = undefined;
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({ muiTheme: newMuiTheme });

	    if (nextProps.selectedTime !== this.props.selectedTime) {
	      direction = nextProps.selectedTime > this.props.selectedTime ? 'up' : 'down';

	      this.setState({
	        transitionDirection: direction
	      });
	    }
	  },
	  sanitizeTime: function sanitizeTime() {
	    var hour = this.props.selectedTime.getHours();
	    var min = this.props.selectedTime.getMinutes().toString();

	    if (this.props.format === 'ampm') {
	      hour %= 12;
	      hour = hour || 12;
	    }

	    hour = hour.toString();
	    if (hour.length < 2) hour = '0' + hour;
	    if (min.length < 2) min = '0' + min;

	    return [hour, min];
	  },
	  getTheme: function getTheme() {
	    return this.state.muiTheme.timePicker;
	  },
	  render: function render() {
	    var _this = this;

	    var _props = this.props;
	    var selectedTime = _props.selectedTime;
	    var mode = _props.mode;
	    var affix = _props.affix;

	    var other = _objectWithoutProperties(_props, ['selectedTime', 'mode', 'affix']);

	    var styles = {
	      root: {
	        position: 'relative',
	        width: 280,
	        height: '100%'
	      },

	      box: {
	        padding: '14px 0',
	        borderTopLeftRadius: 2,
	        borderTopRightRadius: 2,
	        backgroundColor: this.getTheme().headerColor,
	        color: 'white'
	      },

	      text: {
	        margin: '6px 0',
	        lineHeight: '58px',
	        height: 58,
	        fontSize: 58,
	        display: 'flex',
	        justifyContent: 'center',
	        alignItems: 'baseline'
	      },

	      time: {
	        margin: '0 10px'
	      },

	      affix: {
	        flex: 1,
	        position: 'relative',
	        lineHeight: '17px',
	        height: 17,
	        fontSize: 17
	      },

	      affixTop: {
	        position: 'absolute',
	        top: -20,
	        left: 0
	      },

	      clickable: {
	        cursor: 'pointer'
	      },

	      inactive: {
	        opacity: 0.7
	      }
	    };

	    var _sanitizeTime = this.sanitizeTime();

	    var _sanitizeTime2 = _slicedToArray(_sanitizeTime, 2);

	    var hour = _sanitizeTime2[0];
	    var min = _sanitizeTime2[1];

	    var buttons = [];
	    if (this.props.format === 'ampm') {
	      buttons = [_react2.default.createElement(
	        'div',
	        {
	          key: 'pm',
	          style: this.prepareStyles(styles.clickable, affix === 'pm' ? {} : styles.inactive),
	          onTouchTap: function onTouchTap() {
	            return _this.props.onSelectAffix('pm');
	          }
	        },
	        "PM"
	      ), _react2.default.createElement(
	        'div',
	        {
	          key: 'am',
	          style: this.prepareStyles(styles.affixTop, styles.clickable, affix === 'am' ? {} : styles.inactive),
	          onTouchTap: function onTouchTap() {
	            return _this.props.onSelectAffix('am');
	          }
	        },
	        "AM"
	      )];
	    }

	    return _react2.default.createElement(
	      'div',
	      _extends({}, other, { style: this.prepareStyles(styles.root) }),
	      _react2.default.createElement(
	        'div',
	        { style: this.prepareStyles(styles.box) },
	        _react2.default.createElement(
	          'div',
	          { style: this.prepareStyles(styles.text) },
	          _react2.default.createElement('div', { style: this.prepareStyles(styles.affix) }),
	          _react2.default.createElement(
	            'div',
	            { style: this.prepareStyles(styles.time) },
	            _react2.default.createElement(
	              'span',
	              {
	                style: this.prepareStyles(styles.clickable, mode === 'hour' ? {} : styles.inactive),
	                onTouchTap: this.props.onSelectHour
	              },
	              hour
	            ),
	            _react2.default.createElement(
	              'span',
	              null,
	              ':'
	            ),
	            _react2.default.createElement(
	              'span',
	              {
	                style: this.prepareStyles(styles.clickable, mode === 'minute' ? {} : styles.inactive),
	                onTouchTap: this.props.onSelectMin
	              },
	              min
	            )
	          ),
	          _react2.default.createElement(
	            'div',
	            { style: this.prepareStyles(styles.affix) },
	            buttons
	          )
	        )
	      )
	    );
	  }
	});

	exports.default = TimeDisplay;
	module.exports = exports['default'];

/***/ },

/***/ 548:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(159);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _stylePropable = __webpack_require__(231);

	var _stylePropable2 = _interopRequireDefault(_stylePropable);

	var _clockNumber = __webpack_require__(549);

	var _clockNumber2 = _interopRequireDefault(_clockNumber);

	var _clockPointer = __webpack_require__(550);

	var _clockPointer2 = _interopRequireDefault(_clockPointer);

	var _getMuiTheme = __webpack_require__(268);

	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function rad2deg(rad) {
	  return rad * 57.29577951308232;
	}

	function getTouchEventOffsetValues(e) {
	  var el = e.target;
	  var boundingRect = el.getBoundingClientRect();

	  var offset = {
	    offsetX: e.clientX - boundingRect.left,
	    offsetY: e.clientY - boundingRect.top
	  };

	  return offset;
	}

	var ClockHours = _react2.default.createClass({
	  displayName: 'ClockHours',

	  propTypes: {
	    format: _react2.default.PropTypes.oneOf(['ampm', '24hr']),
	    initialHours: _react2.default.PropTypes.number,
	    onChange: _react2.default.PropTypes.func
	  },

	  contextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  mixins: [_stylePropable2.default],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      initialHours: new Date().getHours(),
	      onChange: function onChange() {},
	      format: 'ampm'
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
	    };
	  },
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var clockElement = _reactDom2.default.findDOMNode(this.refs.mask);

	    this.center = {
	      x: clockElement.offsetWidth / 2,
	      y: clockElement.offsetHeight / 2
	    };

	    this.basePoint = {
	      x: this.center.x,
	      y: 0
	    };
	  },

	  //to update theme inside state whenever a new theme is passed down
	  //from the parent / owner using context
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({ muiTheme: newMuiTheme });
	  },

	  center: { x: 0, y: 0 },
	  basePoint: { x: 0, y: 0 },

	  isMousePressed: function isMousePressed(e) {
	    if (typeof e.buttons === 'undefined') {
	      return e.nativeEvent.which;
	    }

	    return e.buttons;
	  },
	  handleUp: function handleUp(e) {
	    e.preventDefault();
	    this.setClock(e.nativeEvent, true);
	  },
	  handleMove: function handleMove(e) {
	    e.preventDefault();
	    if (this.isMousePressed(e) !== 1) return;
	    this.setClock(e.nativeEvent, false);
	  },
	  handleTouchMove: function handleTouchMove(e) {
	    e.preventDefault();
	    this.setClock(e.changedTouches[0], false);
	  },
	  handleTouchEnd: function handleTouchEnd(e) {
	    e.preventDefault();
	    this.setClock(e.changedTouches[0], true);
	  },
	  setClock: function setClock(e, finish) {
	    if (typeof e.offsetX === 'undefined') {
	      var offset = getTouchEventOffsetValues(e);

	      e.offsetX = offset.offsetX;
	      e.offsetY = offset.offsetY;
	    }

	    var hours = this.getHours(e.offsetX, e.offsetY);

	    this.props.onChange(hours, finish);
	  },
	  getHours: function getHours(offsetX, offsetY) {
	    var step = 30;
	    var x = offsetX - this.center.x;
	    var y = offsetY - this.center.y;
	    var cx = this.basePoint.x - this.center.x;
	    var cy = this.basePoint.y - this.center.y;

	    var atan = Math.atan2(cx, cy) - Math.atan2(x, y);

	    var deg = rad2deg(atan);
	    deg = Math.round(deg / step) * step;
	    deg %= 360;

	    var value = Math.floor(deg / step) || 0;

	    var delta = Math.pow(x, 2) + Math.pow(y, 2);
	    var distance = Math.sqrt(delta);

	    value = value || 12;
	    if (this.props.format === '24hr') {
	      if (distance < 90) {
	        value += 12;
	        value %= 24;
	      }
	    } else {
	      value %= 12;
	    }

	    return value;
	  },
	  _getSelected: function _getSelected() {
	    var hour = this.props.initialHours;

	    if (this.props.format === 'ampm') {
	      hour %= 12;
	      hour = hour || 12;
	    }

	    return hour;
	  },
	  _getHourNumbers: function _getHourNumbers() {
	    var _this = this;

	    var style = {
	      pointerEvents: 'none'
	    };
	    var hourSize = this.props.format === 'ampm' ? 12 : 24;

	    var hours = [];
	    for (var i = 1; i <= hourSize; i++) {
	      hours.push(i % 24);
	    }

	    return hours.map(function (hour) {
	      var isSelected = _this._getSelected() === hour;
	      return _react2.default.createElement(_clockNumber2.default, {
	        key: hour,
	        style: style,
	        isSelected: isSelected,
	        type: 'hour',
	        value: hour
	      });
	    });
	  },
	  render: function render() {
	    var styles = {
	      root: {
	        height: '100%',
	        width: '100%',
	        borderRadius: '100%',
	        position: 'relative',
	        pointerEvents: 'none',
	        boxSizing: 'border-box'
	      },

	      hitMask: {
	        height: '100%',
	        width: '100%',
	        pointerEvents: 'auto'
	      }
	    };

	    var hours = this._getSelected();
	    var numbers = this._getHourNumbers();

	    return _react2.default.createElement(
	      'div',
	      { ref: 'clock', style: this.prepareStyles(styles.root) },
	      _react2.default.createElement(_clockPointer2.default, { hasSelected: true, value: hours, type: 'hour' }),
	      numbers,
	      _react2.default.createElement('div', {
	        ref: 'mask', style: this.prepareStyles(styles.hitMask), onTouchMove: this.handleTouchMove,
	        onTouchEnd: this.handleTouchEnd, onMouseUp: this.handleUp, onMouseMove: this.handleMove
	      })
	    );
	  }
	});

	exports.default = ClockHours;
	module.exports = exports['default'];

/***/ },

/***/ 549:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _stylePropable = __webpack_require__(231);

	var _stylePropable2 = _interopRequireDefault(_stylePropable);

	var _getMuiTheme = __webpack_require__(268);

	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ClockNumber = _react2.default.createClass({
	  displayName: 'ClockNumber',

	  propTypes: {
	    isSelected: _react2.default.PropTypes.bool,
	    onSelected: _react2.default.PropTypes.func,
	    type: _react2.default.PropTypes.oneOf(['hour', 'minute']),
	    value: _react2.default.PropTypes.number
	  },

	  contextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  mixins: [_stylePropable2.default],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      value: 0,
	      type: 'minute',
	      isSelected: false
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
	    };
	  },
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },

	  //to update theme inside state whenever a new theme is passed down
	  //from the parent / owner using context
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({ muiTheme: newMuiTheme });
	  },
	  getTheme: function getTheme() {
	    return this.state.muiTheme.timePicker;
	  },
	  render: function render() {
	    var pos = this.props.value;
	    var inner = false;

	    if (this.props.type === 'hour') {
	      inner = pos < 1 || pos > 12;
	      pos %= 12;
	    } else {
	      pos = pos / 5;
	    }

	    var positions = [[0, 5], [54.5, 16.6], [94.4, 59.5], [109, 114], [94.4, 168.5], [54.5, 208.4], [0, 223], [-54.5, 208.4], [-94.4, 168.5], [-109, 114], [-94.4, 59.5], [-54.5, 19.6]];

	    var innerPositions = [[0, 40], [36.9, 49.9], [64, 77], [74, 114], [64, 151], [37, 178], [0, 188], [-37, 178], [-64, 151], [-74, 114], [-64, 77], [-37, 50]];

	    var styles = {
	      root: {
	        display: 'inline-block',
	        position: 'absolute',
	        width: 32,
	        height: 32,
	        borderRadius: '100%',
	        left: 'calc(50% - 16px)',
	        top: 10,
	        textAlign: 'center',
	        paddingTop: 5,
	        userSelect: 'none', /* Chrome all / Safari all */
	        fontSize: '1.1em',
	        pointerEvents: 'none',
	        boxSizing: 'border-box'
	      }
	    };

	    if (this.props.isSelected) {
	      styles.root.backgroundColor = this.getTheme().accentColor;
	      styles.root.color = this.getTheme().selectTextColor;
	    }

	    var transformPos = positions[pos];

	    if (inner) {
	      styles.root.width = 28;
	      styles.root.height = 28;
	      styles.root.left = 'calc(50% - 14px)';
	      transformPos = innerPositions[pos];
	    }

	    var _transformPos = transformPos;

	    var _transformPos2 = _slicedToArray(_transformPos, 2);

	    var x = _transformPos2[0];
	    var y = _transformPos2[1];

	    styles.root.transform = 'translate(' + x + 'px, ' + y + 'px)';

	    return _react2.default.createElement(
	      'span',
	      { style: this.prepareStyles(styles.root) },
	      this.props.value
	    );
	  }
	});

	exports.default = ClockNumber;
	module.exports = exports['default'];

/***/ },

/***/ 550:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _stylePropable = __webpack_require__(231);

	var _stylePropable2 = _interopRequireDefault(_stylePropable);

	var _getMuiTheme = __webpack_require__(268);

	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ClockPointer = _react2.default.createClass({
	  displayName: 'ClockPointer',

	  propTypes: {
	    hasSelected: _react2.default.PropTypes.bool,
	    type: _react2.default.PropTypes.oneOf(['hour', 'minute']),
	    value: _react2.default.PropTypes.number
	  },

	  contextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  mixins: [_stylePropable2.default],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      value: null,
	      type: 'minute',
	      hasSelected: false
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      inner: this.isInner(this.props.value),
	      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
	    };
	  },
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({
	      inner: this.isInner(nextProps.value),
	      muiTheme: newMuiTheme
	    });
	  },
	  isInner: function isInner(value) {
	    if (this.props.type !== 'hour') {
	      return false;
	    }
	    return value < 1 || value > 12;
	  },
	  getAngle: function getAngle() {
	    if (this.props.type === 'hour') {
	      return this.calcAngle(this.props.value, 12);
	    }

	    return this.calcAngle(this.props.value, 60);
	  },
	  calcAngle: function calcAngle(value, base) {
	    value %= base;
	    var angle = 360 / base * value;
	    return angle;
	  },
	  getTheme: function getTheme() {
	    return this.state.muiTheme.timePicker;
	  },
	  render: function render() {
	    if (this.props.value === null) {
	      return _react2.default.createElement('span', null);
	    }

	    var angle = this.getAngle();

	    var styles = {
	      root: {
	        height: '30%',
	        background: this.getTheme().accentColor,
	        width: 2,
	        left: 'calc(50% - 1px)',
	        position: 'absolute',
	        bottom: '50%',
	        transformOrigin: 'bottom',
	        pointerEvents: 'none',
	        transform: 'rotateZ(' + angle + 'deg)'
	      },
	      mark: {
	        background: this.getTheme().selectTextColor,
	        border: '4px solid ' + this.getTheme().accentColor,
	        width: 7,
	        height: 7,
	        position: 'absolute',
	        top: -5,
	        left: -6,
	        borderRadius: '100%'
	      }
	    };

	    if (!this.state.inner) {
	      styles.root.height = '40%';
	    }

	    if (this.props.hasSelected) {
	      styles.mark.display = 'none';
	    }

	    return _react2.default.createElement(
	      'div',
	      { style: this.prepareStyles(styles.root) },
	      _react2.default.createElement('div', { style: this.prepareStyles(styles.mark) })
	    );
	  }
	});

	exports.default = ClockPointer;
	module.exports = exports['default'];

/***/ },

/***/ 551:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(159);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _stylePropable = __webpack_require__(231);

	var _stylePropable2 = _interopRequireDefault(_stylePropable);

	var _clockNumber = __webpack_require__(549);

	var _clockNumber2 = _interopRequireDefault(_clockNumber);

	var _clockPointer = __webpack_require__(550);

	var _clockPointer2 = _interopRequireDefault(_clockPointer);

	var _getMuiTheme = __webpack_require__(268);

	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function rad2deg(rad) {
	  return rad * 57.29577951308232;
	}

	function getTouchEventOffsetValues(e) {
	  var el = e.target;
	  var boundingRect = el.getBoundingClientRect();

	  var offset = {
	    offsetX: e.clientX - boundingRect.left,
	    offsetY: e.clientY - boundingRect.top
	  };

	  return offset;
	}

	var ClockMinutes = _react2.default.createClass({
	  displayName: 'ClockMinutes',

	  propTypes: {
	    initialMinutes: _react2.default.PropTypes.number,
	    onChange: _react2.default.PropTypes.func
	  },

	  contextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  mixins: [_stylePropable2.default],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      initialMinutes: new Date().getMinutes(),
	      onChange: function onChange() {}
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
	    };
	  },
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var clockElement = _reactDom2.default.findDOMNode(this.refs.mask);

	    this.center = {
	      x: clockElement.offsetWidth / 2,
	      y: clockElement.offsetHeight / 2
	    };

	    this.basePoint = {
	      x: this.center.x,
	      y: 0
	    };
	  },

	  //to update theme inside state whenever a new theme is passed down
	  //from the parent / owner using context
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({ muiTheme: newMuiTheme });
	  },

	  center: { x: 0, y: 0 },
	  basePoint: { x: 0, y: 0 },

	  isMousePressed: function isMousePressed(e) {
	    if (typeof e.buttons === 'undefined') {
	      return e.nativeEvent.which;
	    }
	    return e.buttons;
	  },
	  handleUp: function handleUp(e) {
	    e.preventDefault();
	    this.setClock(e.nativeEvent, true);
	  },
	  handleMove: function handleMove(e) {
	    e.preventDefault();
	    if (this.isMousePressed(e) !== 1) return;
	    this.setClock(e.nativeEvent, false);
	  },
	  handleTouch: function handleTouch(e) {
	    e.preventDefault();
	    this.setClock(e.changedTouches[0], false);
	  },
	  setClock: function setClock(e, finish) {
	    if (typeof e.offsetX === 'undefined') {
	      var offset = getTouchEventOffsetValues(e);

	      e.offsetX = offset.offsetX;
	      e.offsetY = offset.offsetY;
	    }

	    var minutes = this.getMinutes(e.offsetX, e.offsetY);

	    this.props.onChange(minutes, finish);
	  },
	  getMinutes: function getMinutes(offsetX, offsetY) {
	    var step = 6;
	    var x = offsetX - this.center.x;
	    var y = offsetY - this.center.y;
	    var cx = this.basePoint.x - this.center.x;
	    var cy = this.basePoint.y - this.center.y;

	    var atan = Math.atan2(cx, cy) - Math.atan2(x, y);

	    var deg = rad2deg(atan);
	    deg = Math.round(deg / step) * step;
	    deg %= 360;

	    var value = Math.floor(deg / step) || 0;

	    return value;
	  },
	  _getMinuteNumbers: function _getMinuteNumbers() {
	    var minutes = [];
	    for (var i = 0; i < 12; i++) {
	      minutes.push(i * 5);
	    }
	    var selectedMinutes = this.props.initialMinutes;
	    var hasSelected = false;

	    var numbers = minutes.map(function (minute) {
	      var isSelected = selectedMinutes === minute;
	      if (isSelected) hasSelected = true;
	      return _react2.default.createElement(_clockNumber2.default, {
	        key: minute, isSelected: isSelected, type: 'minute',
	        value: minute
	      });
	    });

	    return {
	      numbers: numbers,
	      hasSelected: hasSelected,
	      selected: selectedMinutes
	    };
	  },
	  render: function render() {
	    var styles = {
	      root: {
	        height: '100%',
	        width: '100%',
	        borderRadius: '100%',
	        position: 'relative',
	        pointerEvents: 'none',
	        boxSizing: 'border-box'
	      },

	      hitMask: {
	        height: '100%',
	        width: '100%',
	        pointerEvents: 'auto'
	      }
	    };

	    var minutes = this._getMinuteNumbers();

	    return _react2.default.createElement(
	      'div',
	      { ref: 'clock', style: this.prepareStyles(styles.root) },
	      _react2.default.createElement(_clockPointer2.default, { value: minutes.selected, type: 'minute' }),
	      minutes.numbers,
	      _react2.default.createElement('div', { ref: 'mask', style: this.prepareStyles(styles.hitMask), hasSelected: minutes.hasSelected,
	        onTouchMove: this.handleTouch, onTouchEnd: this.handleTouch,
	        onMouseUp: this.handleUp, onMouseMove: this.handleMove
	      })
	    );
	  }
	});

	exports.default = ClockMinutes;
	module.exports = exports['default'];

/***/ },

/***/ 597:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(159);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _stylePropable = __webpack_require__(231);

	var _stylePropable2 = _interopRequireDefault(_stylePropable);

	var _keyCode = __webpack_require__(260);

	var _keyCode2 = _interopRequireDefault(_keyCode);

	var _textField = __webpack_require__(536);

	var _textField2 = _interopRequireDefault(_textField);

	var _menu = __webpack_require__(256);

	var _menu2 = _interopRequireDefault(_menu);

	var _menuItem = __webpack_require__(301);

	var _menuItem2 = _interopRequireDefault(_menuItem);

	var _divider = __webpack_require__(598);

	var _divider2 = _interopRequireDefault(_divider);

	var _popover = __webpack_require__(295);

	var _popover2 = _interopRequireDefault(_popover);

	var _propTypes = __webpack_require__(255);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _deprecatedPropType = __webpack_require__(333);

	var _deprecatedPropType2 = _interopRequireDefault(_deprecatedPropType);

	var _getMuiTheme = __webpack_require__(268);

	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	var AutoComplete = _react2.default.createClass({
	  displayName: 'AutoComplete',

	  propTypes: {
	    /**
	     * Location of the anchor for the auto complete.
	     */
	    anchorOrigin: _propTypes2.default.origin,

	    /**
	     * Whether or not the auto complete is animated as it is toggled.
	     */
	    animated: _react2.default.PropTypes.bool,

	    /**
	     * Array of strings or nodes used to populate the list.
	     */
	    dataSource: _react2.default.PropTypes.array,

	    /**
	     * Disables focus ripple when true.
	     */
	    disableFocusRipple: _react2.default.PropTypes.bool,

	    /**
	     * Override style prop for error.
	     */
	    errorStyle: _react2.default.PropTypes.object,

	    /**
	     * The error content to display.
	     */
	    errorText: _react2.default.PropTypes.string,

	    /**
	     * Function used to filter the auto complete.
	     */
	    filter: _react2.default.PropTypes.func,

	    /**
	     * The content to use for adding floating label element.
	     */
	    floatingLabelText: _react2.default.PropTypes.string,

	    /**
	     * If true, the field receives the property `width: 100%`.
	     */
	    fullWidth: _react2.default.PropTypes.bool,

	    /**
	     * The hint content to display.
	     */
	    hintText: _react2.default.PropTypes.string,

	    /**
	     * Override style for list.
	     */
	    listStyle: _react2.default.PropTypes.object,

	    /**
	     * Delay for closing time of the menu.
	     */
	    menuCloseDelay: _react2.default.PropTypes.number,

	    /**
	     * Props to be passed to menu.
	     */
	    menuProps: _react2.default.PropTypes.object,

	    /**
	     * Override style for menu.
	     */
	    menuStyle: _react2.default.PropTypes.object,

	    /**
	     * Gets called when list item is clicked or pressed enter.
	     */
	    onNewRequest: _react2.default.PropTypes.func,

	    /**
	     * Gets called each time the user updates the text field.
	     */
	    onUpdateInput: _react2.default.PropTypes.func,

	    /**
	     * Auto complete menu is open if true.
	     */
	    open: _react2.default.PropTypes.bool,

	    /**
	     * Text being input to auto complete.
	     */
	    searchText: _react2.default.PropTypes.string,
	    showAllItems: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.bool, 'showAllItems is deprecated, use noFilter instead'),

	    /**
	     * Override the inline-styles of the root element.
	     */
	    style: _react2.default.PropTypes.object,

	    /**
	     * Origin for location of target.
	     */
	    targetOrigin: _propTypes2.default.origin,

	    /**
	     * Delay for touch tap event closing of auto complete.
	     */
	    touchTapCloseDelay: _react2.default.PropTypes.number,

	    /**
	     * If true, will update when focus event triggers.
	     */
	    triggerUpdateOnFocus: _react2.default.PropTypes.bool,
	    updateWhenFocused: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.bool, 'updateWhenFocused has been renamed to triggerUpdateOnFocus')
	  },

	  contextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2.default.PropTypes.object
	  },

	  mixins: [_stylePropable2.default],

	  getDefaultProps: function getDefaultProps() {
	    return {
	      anchorOrigin: {
	        vertical: 'bottom',
	        horizontal: 'left'
	      },
	      targetOrigin: {
	        vertical: 'top',
	        horizontal: 'left'
	      },
	      animated: true,
	      fullWidth: false,
	      open: false,
	      searchText: '',
	      menuCloseDelay: 100,
	      disableFocusRipple: true,
	      onUpdateInput: function onUpdateInput() {},
	      onNewRequest: function onNewRequest() {},
	      filter: function filter(searchText, key) {
	        return searchText !== '' && key.includes(searchText);
	      },
	      triggerUpdateOnFocus: false
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      searchText: this.props.searchText,
	      open: this.props.open,
	      anchorEl: null,
	      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
	    };
	  },
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this.focusOnInput = false;
	    this.requestsList = [];
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (this.props.searchText !== nextProps.searchText) {
	      this.setState({
	        searchText: nextProps.searchText
	      });
	    }
	  },

	  componentClickAway: function componentClickAway() {
	    this._close();
	    this.focusOnInput = false;
	  },
	  _open: function _open() {
	    this.setState({
	      open: true,
	      anchorEl: _reactDom2.default.findDOMNode(this.refs.searchTextField)
	    });
	  },
	  _close: function _close() {
	    this.setState({
	      open: false,
	      anchorEl: null
	    });
	  },
	  setValue: function setValue(textValue) {
	    this.setState({
	      searchText: textValue
	    });
	  },
	  getValue: function getValue() {
	    return this.state.searchText;
	  },
	  _updateRequests: function _updateRequests(searchText) {

	    this.setState({
	      searchText: searchText,
	      open: true,
	      anchorEl: _reactDom2.default.findDOMNode(this.refs.searchTextField)
	    });

	    this.focusOnInput = true;

	    this.props.onUpdateInput(searchText, this.props.dataSource);
	  },
	  _handleItemTouchTap: function _handleItemTouchTap(e, child) {
	    var _this = this;

	    setTimeout(function () {
	      _this._close();
	    }, this.props.touchTapCloseDelay);

	    var dataSource = this.props.dataSource;

	    var chosenRequest = undefined;
	    var index = undefined;
	    var searchText = undefined;
	    if (typeof dataSource[0] === 'string') {
	      chosenRequest = this.requestsList[parseInt(child.key, 10)];
	      index = dataSource.indexOf(chosenRequest);
	      searchText = dataSource[index];
	    } else {
	      chosenRequest = child.key;
	      index = dataSource.indexOf(dataSource.filter(function (item) {
	        return chosenRequest === item.text;
	      })[0]);
	      searchText = chosenRequest;
	    }

	    this.setState({ searchText: searchText });

	    this.props.onNewRequest(chosenRequest, index, dataSource);
	  },
	  _handleKeyDown: function _handleKeyDown(e) {
	    switch (e.keyCode) {
	      case _keyCode2.default.ESC:
	        this._close();
	        break;
	      case _keyCode2.default.DOWN:
	        if (this.focusOnInput && this.state.open) {
	          e.preventDefault();
	          this.focusOnInput = false;
	          this._open();
	        }
	        break;
	      default:
	        break;
	    }
	  },
	  render: function render() {
	    var _this2 = this;

	    var _props = this.props;
	    var anchorOrigin = _props.anchorOrigin;
	    var animated = _props.animated;
	    var style = _props.style;
	    var errorStyle = _props.errorStyle;
	    var floatingLabelText = _props.floatingLabelText;
	    var hintText = _props.hintText;
	    var fullWidth = _props.fullWidth;
	    var menuStyle = _props.menuStyle;
	    var menuProps = _props.menuProps;
	    var listStyle = _props.listStyle;
	    var targetOrigin = _props.targetOrigin;

	    var other = _objectWithoutProperties(_props, ['anchorOrigin', 'animated', 'style', 'errorStyle', 'floatingLabelText', 'hintText', 'fullWidth', 'menuStyle', 'menuProps', 'listStyle', 'targetOrigin']);

	    var _state = this.state;
	    var open = _state.open;
	    var anchorEl = _state.anchorEl;

	    var styles = {
	      root: {
	        display: 'inline-block',
	        position: 'relative',
	        width: this.props.fullWidth ? '100%' : 256
	      },
	      input: {},
	      error: {},
	      menu: {
	        width: '100%'
	      },
	      list: {
	        display: 'block',
	        width: this.props.fullWidth ? '100%' : 256
	      }
	    };

	    var textFieldProps = {
	      style: this.mergeStyles(styles.input, style),
	      floatingLabelText: floatingLabelText,
	      hintText: !hintText && !floatingLabelText ? '' : hintText,
	      fullWidth: true,
	      multiLine: false,
	      errorStyle: this.mergeStyles(styles.error, errorStyle)
	    };

	    var mergedRootStyles = this.mergeStyles(styles.root, style);
	    var mergedMenuStyles = this.mergeStyles(styles.menu, menuStyle);

	    var requestsList = [];

	    this.props.dataSource.map(function (item) {
	      //showAllItems is deprecated, will be removed in the future
	      if (_this2.props.showAllItems) {
	        requestsList.push(item);
	        return;
	      }

	      switch (typeof item === 'undefined' ? 'undefined' : _typeof(item)) {
	        case 'string':
	          if (_this2.props.filter(_this2.state.searchText, item, item)) {
	            requestsList.push(item);
	          }
	          break;
	        case 'object':
	          if (typeof item.text === 'string') {
	            if (_this2.props.filter(_this2.state.searchText, item.text, item)) {
	              requestsList.push(item);
	            }
	          }
	          break;
	      }
	    });

	    this.requestsList = requestsList;

	    var menu = open && requestsList.length > 0 ? _react2.default.createElement(
	      _menu2.default,
	      _extends({}, menuProps, {
	        ref: 'menu',
	        key: 'dropDownMenu',
	        autoWidth: false,
	        onEscKeyDown: this._close,
	        initiallyKeyboardFocused: false,
	        onItemTouchTap: this._handleItemTouchTap,
	        listStyle: this.mergeStyles(styles.list, listStyle),
	        style: mergedMenuStyles
	      }),
	      requestsList.map(function (request, index) {
	        switch (typeof request === 'undefined' ? 'undefined' : _typeof(request)) {
	          case 'string':
	            return _react2.default.createElement(_menuItem2.default, {
	              disableFocusRipple: _this2.props.disableFocusRipple,
	              innerDivStyle: { overflow: 'hidden' },
	              key: index,
	              value: request,
	              primaryText: request
	            });
	          case 'object':
	            if (typeof request.text === 'string') {
	              return _react2.default.cloneElement(request.value, {
	                key: request.text,
	                disableFocusRipple: _this2.props.disableFocusRipple
	              });
	            }
	            return _react2.default.cloneElement(request, {
	              key: index,
	              disableFocusRipple: _this2.props.disableFocusRipple
	            });
	          default:
	            return null;
	        }
	      })
	    ) : null;

	    var popoverStyle = undefined;
	    if (anchorEl && fullWidth) {
	      popoverStyle = { width: anchorEl.clientWidth };
	    }

	    return _react2.default.createElement(
	      'div',
	      {
	        style: this.prepareStyles(mergedRootStyles),
	        onKeyDown: this._handleKeyDown
	      },
	      _react2.default.createElement(
	        'div',
	        {
	          style: {
	            width: '100%'
	          }
	        },
	        _react2.default.createElement(_textField2.default, _extends({}, other, {
	          ref: 'searchTextField',
	          value: this.state.searchText,
	          onEnterKeyDown: function onEnterKeyDown() {
	            setTimeout(function () {
	              _this2._close();
	            }, _this2.props.touchTapCloseDelay);
	            _this2.props.onNewRequest(_this2.state.searchText);
	          },
	          onChange: function onChange(e) {
	            var searchText = e.target.value;
	            _this2._updateRequests(searchText);
	          },
	          onBlur: function onBlur() {
	            if (_this2.focusOnInput && open) _this2.refs.searchTextField.focus();
	          },
	          onFocus: function onFocus() {
	            if (!open && (_this2.props.triggerUpdateOnFocus || _this2.props.updateWhenFocused //this line will be removed in the future
	             || _this2.requestsList > 0)) {
	              _this2._updateRequests(_this2.state.searchText);
	            }
	            _this2.focusOnInput = true;
	          }

	        }, textFieldProps))
	      ),
	      _react2.default.createElement(
	        _popover2.default,
	        {
	          style: popoverStyle,
	          anchorOrigin: anchorOrigin,
	          targetOrigin: targetOrigin,
	          open: open,
	          anchorEl: anchorEl,
	          useLayerForClickAway: false,
	          onRequestClose: this._close
	        },
	        menu
	      )
	    );
	  }
	});

	AutoComplete.levenshteinDistance = function (searchText, key) {
	  var current = [];
	  var prev = undefined;
	  var value = undefined;

	  for (var i = 0; i <= key.length; i++) {
	    for (var j = 0; j <= searchText.length; j++) {
	      if (i && j) {
	        if (searchText.charAt(j - 1) === key.charAt(i - 1)) value = prev;else value = Math.min(current[j], current[j - 1], prev) + 1;
	      } else {
	        value = i + j;
	      }
	      prev = current[j];
	      current[j] = value;
	    }
	  }
	  return current.pop();
	};

	AutoComplete.noFilter = function () {
	  return true;
	};

	AutoComplete.defaultFilter = AutoComplete.caseSensitiveFilter = function (searchText, key) {
	  return searchText !== '' && key.includes(searchText);
	};

	AutoComplete.caseInsensitiveFilter = function (searchText, key) {
	  return key.toLowerCase().includes(searchText.toLowerCase());
	};

	AutoComplete.levenshteinDistanceFilter = function (distanceLessThan) {
	  if (distanceLessThan === undefined) return AutoComplete.levenshteinDistance;else if (typeof distanceLessThan !== 'number') {
	    throw 'Error: AutoComplete.levenshteinDistanceFilter is a filter generator, not a filter!';
	  }
	  return function (s, k) {
	    return AutoComplete.levenshteinDistance(s, k) < distanceLessThan;
	  };
	};

	AutoComplete.fuzzyFilter = function (searchText, key) {
	  if (searchText.length === 0) return false;
	  var subMatchKey = key.substring(0, searchText.length);
	  var distance = AutoComplete.levenshteinDistance(searchText.toLowerCase(), subMatchKey.toLowerCase());
	  return searchText.length > 3 ? distance < 2 : distance === 0;
	};

	AutoComplete.Item = _menuItem2.default;
	AutoComplete.Divider = _divider2.default;

	exports.default = AutoComplete;
	module.exports = exports['default'];

/***/ }

});