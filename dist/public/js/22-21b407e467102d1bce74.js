webpackJsonp([22,135],{

/***/ 614:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'listWaitClearCreditCard': { children: ['done', 'error'] },
	  'exportWaitClearCreditCard': { children: ['done', 'error'] },
	  'listWaitAssign': { children: ['done', 'error'] },
	  'exportWaitAssign': { children: ['done', 'error'] },
	  'listInprocess': { children: ['done', 'error'] },
	  'exportInprocess': { children: ['done', 'error'] },
	  'listInTransit': { children: ['done', 'error'] },
	  'exportInTransit': { children: ['done', 'error'] },
	  'listArrived': { children: ['done', 'error'] },
	  'exportArrived': { children: ['done', 'error'] },
	  'listDelivered': { children: ['done', 'error'] },
	  'exportDelivered': { children: ['done', 'error'] },
	  'listException': { children: ['done', 'error'] },
	  'exportException': { children: ['done', 'error'] },
	  'listCancel': { children: ['done', 'error'] },
	  'exportCancel': { children: ['done', 'error'] },
	  'cancelBooking': { children: ['done', 'error'] },
	  'changeStatusBooking': { children: ['done', 'error'] },
	  'getDialogData': { children: ['done', 'error'] },
	  'saveAddition': { children: ['done', 'error'] },
	  'sentDocToEmail': { children: ['done', 'error'] },
	  'getDialogDetailList': { children: ['done', 'error'] },
	  'getDialogItemList': { children: ['done', 'error'] }
	});

/***/ },

/***/ 632:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _dialog = __webpack_require__(329);

	var _dialog2 = _interopRequireDefault(_dialog);

	var _flatButton = __webpack_require__(330);

	var _flatButton2 = _interopRequireDefault(_flatButton);

	var _raisedButton = __webpack_require__(334);

	var _raisedButton2 = _interopRequireDefault(_raisedButton);

	var _tabs = __webpack_require__(620);

	var _tabs2 = _interopRequireDefault(_tabs);

	var _tab = __webpack_require__(623);

	var _tab2 = _interopRequireDefault(_tab);

	var _textField = __webpack_require__(536);

	var _textField2 = _interopRequireDefault(_textField);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	var actions = __webpack_require__(614);

	var FlexGrid = widgets.FlexGrid;
	var FlexIcon = widgets.FlexIcon;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
	var FlexTextInput = widgets.FlexTextInput;


	//var customerAction = require('./actions');
	var bookingListActions = __webpack_require__(614);
	var ReFlux = __webpack_require__(335);

	var resetData = {
	    additionDetail: '',
	    additionAmount: '',
	    additionRemark: '',
	    email: '',
	    booking_id: 0
	};

	var customContentStyle = {
	    width: '70%',
	    maxWidth: 'none'
	};

	var tabStyles = {
	    headline: {
	        fontSize: 24,
	        paddingTop: 3,
	        marginBottom: 5,
	        fontWeight: 400
	    }
	};

	var textFieldsNonHr = {
	    height: "25px",
	    width: "100%",
	    border: "1px solid lightgray",
	    borderRadius: '4px',
	    padding: "0px 3px 0px 3px",
	    fontSize: '14px'
	};

	var dialogReset = {
	    booking_date: "2016-04-11 13:12:16",
	    booking_name: "Notebook,Smart Phone",
	    booking_no: "16040062",
	    from_place: "Bang Bon",
	    id: 162,
	    package_contents: "",
	    pickup_place: "",
	    receipient: "",
	    sender: "",
	    to_place: "",
	    waybill: "",
	    senderName: "",
	    toName: "",
	    senderAddr: "",
	    toAddr: "",
	    name: "",
	    invoice_addr: "",
	    shipment: "",
	    barcode: "",
	    invoice: "",
	    discount: "",
	    total_amount: "",
	    charge_amount: "",
	    currency: "",
	    status: ""
	};

	var hideStyles = {
	    errorStyle: {
	        bottom: '0px',
	        fontSize: '14px',
	        color: 'red'
	    },
	    okStyle: {
	        bottom: '0px',
	        fontSize: '14px'
	    }
	};

	var CustomerList = React.createClass({
	    displayName: 'CustomerList',

	    contextTypes: {
	        router: React.PropTypes.func
	    },
	    mixins: [ReFlux.listenTo(bookingListActions.cancelBooking.done, 'onCancelBookingDoneAction'), ReFlux.listenTo(bookingListActions.cancelBooking.error, 'onCancelBookingErrorAction'), ReFlux.listenTo(bookingListActions.changeStatusBooking.done, 'onChangeStatusBookingDoneAction'), ReFlux.listenTo(bookingListActions.changeStatusBooking.error, 'onChangeStatusBookingErrorAction'), ReFlux.listenTo(bookingListActions.getDialogData.done, 'onGetDialogDataDoneAction'), ReFlux.listenTo(bookingListActions.getDialogData.error, 'onGetDialogDataDoneError'), ReFlux.listenTo(bookingListActions.getDialogDetailList.done, 'onGetDialogDetailListDoneAction'), ReFlux.listenTo(bookingListActions.getDialogItemList.done, 'onGetDialogItemListDoneAction'), ReFlux.listenTo(bookingListActions.getDialogItemList.error, 'onGetDialogItemListErrorAction'), ReFlux.listenTo(bookingListActions.getDialogDetailList.error, 'onGetDialogDetailListErrorAction'), ReFlux.listenTo(bookingListActions.saveAddition.done, 'onSaveAdditionDoneAction'), ReFlux.listenTo(bookingListActions.saveAddition.error, 'onSaveAdditionErrorAction'), ReFlux.listenTo(bookingListActions.sentDocToEmail.done, 'onSentDocToEmailDoneAction'), ReFlux.listenTo(bookingListActions.sentDocToEmail.error, 'onSentDocToEmailErrorAction')],
	    getInitialState: function getInitialState() {
	        //    var shops = system.acl.getShopAcl();
	        // var shops = systemStore.getMaster().shops.map(function(shop) {
	        //   return {
	        //     value: shop.code,
	        //     text: shop.code+' '+shop.name
	        //   }
	        // });
	        // shops.unshift({value:'*',text:'* เธ—เธธเธเธชเธฒเธเธฒ'});
	        // var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});

	        // var opt = storage.load(storageKey, {current_status:'ALL', shop:''});
	        // if (opt.shop=='') {
	        //   opt.shop = shops.length > 0 ?
	        //     (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '';
	        // }

	        return {
	            dialogOpen: false,
	            tabValue: 'service',
	            data: helper.clone(resetData),
	            checkAmount: false,
	            amountFalse: "Amount",
	            amountTrue: "This field is required and must be the number.",
	            bookingList: helper.clone(dialogReset),
	            detailRow: '',
	            itemRow: '',
	            // shop: opt.shop,
	            // current_status: opt.current_status
	            fields: [{ name: 'booking_no', title: 'transport.booking_no' }, { name: 'customer_name', title: 'transport.customer_name' }, { name: 'pickup_place', title: 'transport.pickup_place' }, //, width:'80px'
	            { name: 'pickup_date', title: 'transport.pickup_date' }, { name: 'type', title: 'transport.type' }, { name: 'real_delivery_date', title: 'transport.real_delivery_date' }, { name: 'booking_date', title: 'transport.booking_date' }, { name: 'actions', type: 'actions', width: 3 * 28 + 8 + 'px', render: function (row) {
	                    var e = function () {
	                        this.dialogBookingOpen(row.id);
	                    }.bind(this);
	                    var f = function () {
	                        this.onCancelBooking(row);
	                    }.bind(this);
	                    var g = function () {
	                        this.onToWaitAssign(row);
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

	    setDetailRow: function setDetailRow(dataTable) {
	        //console.log(dataTable);
	        return dataTable.map(function (row, index) {
	            return React.createElement(
	                'tr',
	                null,
	                React.createElement(
	                    'td',
	                    { style: { borderBottom: "1px solid lightgray", borderRight: "1px solid lightgray" } },
	                    React.createElement('span', { style: { lineHeight: "25px", paddingLeft: "3px" } }),
	                    row.booking_name
	                ),
	                React.createElement(
	                    'td',
	                    { style: { textAlign: "right", borderBottom: "1px solid lightgray", borderRight: "1px solid lightgray" } },
	                    React.createElement(
	                        'span',
	                        { style: { lineHeight: "25px", paddingRight: "3px" } },
	                        helper.numberFormat(row.total_price, 2)
	                    )
	                ),
	                React.createElement(
	                    'td',
	                    { style: { textAlign: "right", borderBottom: "1px solid lightgray" } },
	                    React.createElement(
	                        'span',
	                        { style: { lineHeight: "25px", paddingRight: "3px" } },
	                        this.state.bookingList.currency
	                    )
	                )
	            );
	        }.bind(this));
	    },

	    setItemRow: function setItemRow(dataTable) {
	        return dataTable.map(function (row, index) {
	            return React.createElement(
	                'tr',
	                null,
	                React.createElement(
	                    'td',
	                    { style: { textAlign: "center" } },
	                    React.createElement(
	                        'span',
	                        { style: { lineHeight: "21px" } },
	                        index + 1,
	                        '.'
	                    )
	                ),
	                React.createElement(
	                    'td',
	                    { style: { textAlign: "center" } },
	                    React.createElement(
	                        'span',
	                        { style: { lineHeight: "21px" } },
	                        row.barcode
	                    )
	                ),
	                React.createElement(
	                    'td',
	                    { style: { textAlign: "center" } },
	                    React.createElement(
	                        'span',
	                        { style: { lineHeight: "21px" } },
	                        row.pickup_date
	                    )
	                ),
	                React.createElement(
	                    'td',
	                    { style: { textAlign: "center" } },
	                    React.createElement(
	                        'span',
	                        { style: { lineHeight: "21px" } },
	                        row.real_delivery_date
	                    )
	                ),
	                React.createElement(
	                    'td',
	                    { style: { textAlign: "center" } },
	                    React.createElement(
	                        'span',
	                        { style: { lineHeight: "21px" } },
	                        row.real_delivery_date
	                    )
	                ),
	                React.createElement(
	                    'td',
	                    { style: { textAlign: "center" } },
	                    React.createElement(
	                        'span',
	                        { style: { lineHeight: "21px" } },
	                        row.accepted_date
	                    )
	                )
	            );
	        }.bind(this));
	    },

	    componentDidMount: function componentDidMount() {
	        console.log(system.sessionStore.getSession());
	    },

	    addCustomer: function addCustomer(row) {
	        console.log('add_customer');
	        this.props.history.pushState(null, '/preliminary/customer/edit/0');
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
	            bookingListActions.cancelBooking(row);
	        });
	    },

	    onToWaitAssign: function onToWaitAssign(row) {
	        console.log("onToWaitAssign = ", row);
	        dialogActions.show({
	            title: 'preliminary.title.confirm_to_change_status',
	            content: 'Do you want to change status booking NO. ' + row.booking_no + ' to Wait assign?',
	            actions: [{ id: 'ok', icon: 'check52', label: 'dialog.confirm' }, { id: 'cancel', icon: 'close47', label: 'dialog.cancel', default: true }]
	        }, function (isCancel, action_id) {
	            if (isCancel || action_id == 'cancel') {
	                return;
	            }
	            console.log('CHANGE');
	            bookingListActions.changeStatusBooking(row);
	        });
	    },

	    onCancelBookingDoneAction: function onCancelBookingDoneAction(data) {
	        toasterActions.pop({
	            type: 'success',
	            message: data.done
	        });
	        this.refs.grid.doRefresh();
	    },

	    onCancelBookingErrorAction: function onCancelBookingErrorAction(errors) {
	        toasterActions.pop({
	            type: 'warning',
	            message: 'เธฅเธเธเนเธญเธกเธนเธฅเนเธกเนเธชเธณเน€เธฃเนเธ ' + errors
	        });
	    },

	    onChangeStatusBookingDoneAction: function onChangeStatusBookingDoneAction(data) {
	        toasterActions.pop({
	            type: 'success',
	            message: data.done
	        });
	        this.refs.grid.doRefresh();
	    },

	    onChangeStatusBookingErrorAction: function onChangeStatusBookingErrorAction(errors) {
	        toasterActions.pop({
	            type: 'warning',
	            message: 'เธฅเธเธเนเธญเธกเธนเธฅเนเธกเนเธชเธณเน€เธฃเนเธ ' + errors
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

	    dialogBookingOpen: function dialogBookingOpen(bookingId) {
	        console.log(bookingId);
	        actions.getDialogData(bookingId);
	        //this.setState({dialogOpen: true});
	    },
	    dialogBookingClose: function dialogBookingClose() {
	        this.setState({ dialogOpen: false });
	    },

	    onGetDialogDataDoneAction: function onGetDialogDataDoneAction(res) {
	        console.log("My Dialog data = ", res.booking_data[0]);
	        var bData = res.booking_data[0];
	        //console.log("senderNameNum = ",senderNameNum,senderStr);
	        bData.senderName = bData.sender.substring(0, bData.sender.indexOf('. '));
	        bData.toName = bData.receipient.substring(0, bData.receipient.indexOf('. '));

	        //var res = str.replace("Microsoft", "W3Schools");
	        var a = bData.sender.substring(bData.sender.indexOf('. ') + 2);
	        var b = bData.receipient.substring(bData.receipient.indexOf('. ') + 2);
	        //this.state.bookingList = bData;
	        bData.senderAddr = a.replace('. ', ' ');
	        bData.toAddr = b.replace('. ', ' ');
	        bData.shipment = "/output/shipment_" + bData.id + ".pdf";
	        bData.barcode = "/output/barcode_" + bData.id + ".pdf";
	        bData.invoice = "/output/invoice_" + bData.id + ".pdf";
	        this.setState({
	            bookingList: bData
	        });
	        console.log("This state ", this.state.bookingList);
	        actions.getDialogDetailList(bData.id);
	    },

	    onGetDialogDetailListDoneAction: function onGetDialogDetailListDoneAction(data) {
	        //  console.log("List Detail = ",data);
	        this.setState({
	            detailRow: this.setDetailRow(data)
	        });
	        actions.getDialogItemList(this.state.bookingList.id);
	    },

	    onGetDialogItemListDoneAction: function onGetDialogItemListDoneAction(data) {
	        console.log("List Item = ", data);
	        this.setState({
	            itemRow: this.setItemRow(data)
	        });
	        this.setState({ dialogOpen: true });
	    },

	    handleChangeTab: function handleChangeTab(value) {
	        //   console.log("xxccc = ", value);
	        this.setState({
	            tabValue: value
	        });
	    },

	    handleChangeFlaxTextInput: function handleChangeFlaxTextInput(event) {
	        //console.log(event);
	        this.state.data[event.target.id] = event.target.value;
	        this.setState({
	            data: this.state.data
	        });
	        // console.log("This Data = ", this.state.data);
	    },

	    saveAddition: function saveAddition() {
	        if (isNaN(this.state.data.additionAmount) || this.state.data.additionAmount == "") {
	            this.state.data.additionAmount = "";
	            this.refs.additionAmount.setValue("");
	            this.setState({
	                data: this.state.data
	            });
	            this.setState({
	                checkAmount: true
	            });
	            return;
	        }
	        console.log(this.state.bookingList.id);
	        this.state.data.booking_id = this.state.bookingList.id;
	        this.setState({
	            data: this.state.data
	        });
	        console.log("Save Addition = ", this.state.data);
	        actions.saveAddition(this.state.data);
	    },

	    onSaveAdditionDoneAction: function onSaveAdditionDoneAction(data) {
	        toasterActions.pop({
	            type: 'success',
	            message: data.done
	        });

	        this.state.data.additionAmount = "";
	        this.state.data.additionDetail = "";
	        this.state.data.additionRemark = "";
	        this.refs.additionAmount.setValue("");
	        this.refs.additionDetail.setValue("");
	        this.refs.additionRemark.setValue("");
	        this.setState({
	            data: this.state.data
	        });

	        this.setState({
	            checkAmount: false
	        });

	        this.setState({ dialogOpen: false });
	    },

	    onSaveAdditionErrorAction: function onSaveAdditionErrorAction(data) {
	        toasterActions.pop({
	            type: 'warning',
	            message: "Can't edit booking " + errors
	        });
	    },

	    sentDocToEmail: function sentDocToEmail() {
	        var docData = {
	            email: this.state.data.email,
	            booking_id: this.state.bookingList.id
	        };
	        //console.log("sant Email = ", docData);
	        actions.sentDocToEmail(docData);
	    },

	    onSentDocToEmailDoneAction: function onSentDocToEmailDoneAction(data) {
	        toasterActions.pop({
	            type: 'success',
	            message: data.rs
	        });
	    },
	    onSentDocToEmailErrorAction: function onSentDocToEmailErrorAction(data) {
	        toasterActions.pop({
	            type: 'warning',
	            message: "Can't sent Email " + data.errors
	        });
	    },

	    render: function render() {
	        var actions = [React.createElement(_raisedButton2.default, {
	            label: 'OK',
	            primary: true,
	            onTouchTap: this.dialogBookingClose
	        })];

	        var fields = {
	            additionDetail: {
	                id: 'additionDetail',
	                label: 'transport.textFields.additionDetail'
	            }
	        };

	        return React.createElement(
	            'div',
	            { className: 'layout-panel content-page' },
	            React.createElement(
	                'div',
	                { className: 'content-header boxf flex' },
	                React.createElement(
	                    'div',
	                    { className: 'panelf can-grow' },
	                    React.createElement(T, { content: 'transport.title.headBookingList', component: 'h3' })
	                ),
	                React.createElement('div', { className: 'panel2 no-shrink flex-form' })
	            ),
	            React.createElement(
	                'div',
	                { style: { minHeight: '540px', width: '1094px' } },
	                React.createElement(
	                    'div',
	                    { className: 'content-body panelf', style: { minHeight: '543px' } },
	                    React.createElement(
	                        'div',
	                        { style: { height: '32px' } },
	                        React.createElement('div', { className: 'flaticon-automatic3 normal icon', style: { height: '32px', float: 'left' } }),
	                        React.createElement(
	                            'label',
	                            { style: { height: '32px', display: 'block', float: 'left', fontSize: '1.1em', paddingTop: '8px' } },
	                            React.createElement(
	                                'b',
	                                null,
	                                'Arrived'
	                            )
	                        )
	                    ),
	                    React.createElement('div', { stule: { clear: 'both' } }),
	                    React.createElement(
	                        'div',
	                        null,
	                        React.createElement(FlexGrid, {
	                            ref: 'grid',
	                            id: 'transport-bookingList-listArrived',
	                            listAction: bookingListActions.listArrived,
	                            exportAction: bookingListActions.exportArrived,
	                            fields: this.state.fields,
	                            pk: 'id',
	                            sortBy: 'booking_no',
	                            sortDir: 'ASC',
	                            limit: 50,
	                            checkbox: false,
	                            search: true,
	                            displayRows: 12
	                        })
	                    )
	                )
	            ),
	            React.createElement(
	                _dialog2.default,
	                {
	                    actions: actions,
	                    modal: true,
	                    contentStyle: customContentStyle,
	                    open: this.state.dialogOpen
	                },
	                React.createElement(
	                    'div',
	                    { className: '1boxindialog', style: { width: '908px', height: '400px', overflow: 'scroll' } },
	                    React.createElement(
	                        'div',
	                        { className: 'headBox', style: { width: '895px', height: '160px', border: '1px solid black', borderRadius: '5px', position: 'relative' } },
	                        React.createElement(
	                            'div',
	                            { className: 'leftBox', style: { width: '370px', height: '160px', borderRight: 'solid 1px black', float: 'left' } },
	                            React.createElement(
	                                'div',
	                                { style: { width: '130px', height: '120px', float: 'left', paddingTop: '8px', paddingLeft: '11px' } },
	                                React.createElement('img', { src: '/img/icon_staff.png', alt: 'staff_icon', height: '100px', width: '100px' })
	                            ),
	                            React.createElement(
	                                'table',
	                                { style: { height: '120px', width: '237px', float: 'left' } },
	                                React.createElement(
	                                    'tbody',
	                                    null,
	                                    React.createElement(
	                                        'tr',
	                                        null,
	                                        React.createElement(
	                                            'td',
	                                            null,
	                                            'Booking No.: ',
	                                            this.state.bookingList.booking_no
	                                        )
	                                    ),
	                                    React.createElement(
	                                        'tr',
	                                        null,
	                                        React.createElement(
	                                            'td',
	                                            null,
	                                            'Waybill No.: ',
	                                            this.state.bookingList.waybill
	                                        )
	                                    ),
	                                    React.createElement(
	                                        'tr',
	                                        null,
	                                        React.createElement(
	                                            'td',
	                                            null,
	                                            'Booking date: ',
	                                            this.state.bookingList.booking_date
	                                        )
	                                    ),
	                                    React.createElement(
	                                        'tr',
	                                        null,
	                                        React.createElement(
	                                            'td',
	                                            null,
	                                            React.createElement(
	                                                'b',
	                                                null,
	                                                this.state.bookingList.name
	                                            )
	                                        )
	                                    )
	                                )
	                            ),
	                            React.createElement('div', { style: { clear: 'both' } }),
	                            React.createElement(
	                                'div',
	                                { style: { width: '368px', height: '36px', float: 'left' } },
	                                React.createElement(
	                                    'table',
	                                    { style: { height: '35px', width: '367px' } },
	                                    React.createElement(
	                                        'tbody',
	                                        null,
	                                        React.createElement(
	                                            'tr',
	                                            null,
	                                            React.createElement(
	                                                'td',
	                                                { style: { textAlign: 'center' } },
	                                                React.createElement(
	                                                    'strong',
	                                                    null,
	                                                    this.state.bookingList.status
	                                                )
	                                            )
	                                        )
	                                    )
	                                )
	                            )
	                        ),
	                        React.createElement(
	                            'div',
	                            { className: 'leftBox', style: { width: '520px', height: '160px', float: 'left' } },
	                            React.createElement(
	                                'div',
	                                { style: { width: '100%', height: '50%', float: 'left', borderBottom: '1px solid black' } },
	                                React.createElement(
	                                    'div',
	                                    { style: { width: '16%', height: '100%', float: 'left', padding: '16px 0px 0px 3px' } },
	                                    React.createElement('img', { src: '/img/TruckBlack.png', alt: 'staff_icon', height: '45px', width: '70px' })
	                                ),
	                                React.createElement(
	                                    'div',
	                                    { style: { width: '84%', height: '100%', float: 'left' } },
	                                    React.createElement(
	                                        'table',
	                                        { style: { height: '70px', width: '430px' } },
	                                        React.createElement(
	                                            'tbody',
	                                            null,
	                                            React.createElement(
	                                                'tr',
	                                                null,
	                                                React.createElement(
	                                                    'td',
	                                                    null,
	                                                    React.createElement(
	                                                        'strong',
	                                                        null,
	                                                        'From : ',
	                                                        this.state.bookingList.from_place
	                                                    )
	                                                )
	                                            ),
	                                            React.createElement(
	                                                'tr',
	                                                null,
	                                                React.createElement(
	                                                    'td',
	                                                    null,
	                                                    this.state.bookingList.senderName
	                                                )
	                                            ),
	                                            React.createElement(
	                                                'tr',
	                                                null,
	                                                React.createElement(
	                                                    'td',
	                                                    null,
	                                                    this.state.bookingList.senderAddr
	                                                )
	                                            )
	                                        )
	                                    )
	                                )
	                            ),
	                            React.createElement('div', { style: { clear: 'both' } }),
	                            React.createElement(
	                                'div',
	                                { style: { width: '100%', height: '50%', float: 'left' } },
	                                React.createElement(
	                                    'div',
	                                    { style: { width: '16%', height: '100%', float: 'left', padding: '5px 0px 0px 15px' } },
	                                    React.createElement('img', { src: '/img/delivery.png', alt: 'delivery_icon', height: '60px', width: '58px' })
	                                ),
	                                React.createElement(
	                                    'div',
	                                    { style: { width: '84%', height: '100%', float: 'left' } },
	                                    React.createElement(
	                                        'table',
	                                        { style: { height: '70px', width: '430px' } },
	                                        React.createElement(
	                                            'tbody',
	                                            null,
	                                            React.createElement(
	                                                'tr',
	                                                null,
	                                                React.createElement(
	                                                    'td',
	                                                    null,
	                                                    React.createElement(
	                                                        'strong',
	                                                        null,
	                                                        'To : ',
	                                                        this.state.bookingList.to_place
	                                                    )
	                                                )
	                                            ),
	                                            React.createElement(
	                                                'tr',
	                                                null,
	                                                React.createElement(
	                                                    'td',
	                                                    null,
	                                                    this.state.bookingList.toName
	                                                )
	                                            ),
	                                            React.createElement(
	                                                'tr',
	                                                null,
	                                                React.createElement(
	                                                    'td',
	                                                    null,
	                                                    this.state.bookingList.toAddr
	                                                )
	                                            )
	                                        )
	                                    )
	                                )
	                            )
	                        )
	                    ),
	                    React.createElement('div', { style: { clear: 'both' } }),
	                    React.createElement(
	                        'div',
	                        { className: 'TabBox', style: { width: '895px', minHeight: '227px', border: '1px solid black', borderRadius: '5px', position: 'relative', marginTop: '3px' } },
	                        React.createElement(
	                            _tabs2.default,
	                            {
	                                value: this.state.tabValue
	                            },
	                            React.createElement(
	                                _tab2.default,
	                                { label: 'Service', value: 'service', id: 'service', onClick: this.handleChangeTab.bind(this, "service"), style: { height: '30px' } },
	                                React.createElement(
	                                    'div',
	                                    null,
	                                    React.createElement(
	                                        'div',
	                                        { style: { width: "365px", height: "25px", border: '1px solid black', borderRadius: '3px', margin: '5px 0px 0px 5px', paddingLeft: '3px', backgroundColor: 'lightgray' } },
	                                        React.createElement(
	                                            'p',
	                                            null,
	                                            'Package content: ',
	                                            this.state.bookingList.booking_name
	                                        )
	                                    ),
	                                    React.createElement(
	                                        'div',
	                                        { style: { width: "882px", height: "25px", border: '1px solid black', borderRadius: '3px', margin: '5px 0px 0px 5px', paddingLeft: '3px', backgroundColor: 'lightgray' } },
	                                        React.createElement(
	                                            'p',
	                                            null,
	                                            this.state.bookingList.package_contents
	                                        )
	                                    ),
	                                    React.createElement(
	                                        'div',
	                                        { style: { marginTop: "10px" } },
	                                        React.createElement(
	                                            'table',
	                                            { style: { width: "888px", marginLeft: "2px" } },
	                                            React.createElement(
	                                                'thead',
	                                                { style: { borderBottom: '2px solid lightgray' } },
	                                                React.createElement(
	                                                    'tr',
	                                                    null,
	                                                    React.createElement(
	                                                        'th',
	                                                        { scope: 'col' },
	                                                        'NO.'
	                                                    ),
	                                                    React.createElement(
	                                                        'th',
	                                                        { scope: 'col' },
	                                                        'Barcode'
	                                                    ),
	                                                    React.createElement(
	                                                        'th',
	                                                        { scope: 'col' },
	                                                        'Pickup date'
	                                                    ),
	                                                    React.createElement(
	                                                        'th',
	                                                        { scope: 'col' },
	                                                        'Delivery date'
	                                                    ),
	                                                    React.createElement(
	                                                        'th',
	                                                        { scope: 'col' },
	                                                        'Receipt date'
	                                                    ),
	                                                    React.createElement(
	                                                        'th',
	                                                        { scope: 'col' },
	                                                        'Accepted date'
	                                                    )
	                                                )
	                                            ),
	                                            React.createElement(
	                                                'tbody',
	                                                null,
	                                                this.state.itemRow
	                                            )
	                                        )
	                                    )
	                                )
	                            ),
	                            React.createElement(
	                                _tab2.default,
	                                { label: 'Package & Billing', value: 'package', id: 'package', onClick: this.handleChangeTab.bind(this, "package"), style: { height: '30px' } },
	                                React.createElement(
	                                    'div',
	                                    null,
	                                    React.createElement(
	                                        'div',
	                                        { style: { width: "888px", minHeight: "150px", paddingTop: "5px" } },
	                                        React.createElement(
	                                            'div',
	                                            { style: { width: "60%", minHeight: "150px", float: "left", padding: "0px 8px 1px 8px", borderRight: "1px solid black" } },
	                                            React.createElement(
	                                                'table',
	                                                { style: { width: "510px" } },
	                                                React.createElement(
	                                                    'thead',
	                                                    { style: { borderBottom: '2px solid lightgray' } },
	                                                    React.createElement(
	                                                        'tr',
	                                                        null,
	                                                        React.createElement(
	                                                            'th',
	                                                            { style: { width: "60%", textAlign: "left", borderRight: "1px solid lightgray" } },
	                                                            React.createElement(
	                                                                'span',
	                                                                { style: { lineHeight: "25px", paddingLeft: "3px" } },
	                                                                'Description'
	                                                            )
	                                                        ),
	                                                        React.createElement(
	                                                            'th',
	                                                            { style: { width: "20%", textAlign: "center", borderRight: "1px solid lightgray" } },
	                                                            React.createElement(
	                                                                'span',
	                                                                { style: { lineHeight: "25px" } },
	                                                                'Amount'
	                                                            )
	                                                        ),
	                                                        React.createElement(
	                                                            'th',
	                                                            { style: { width: "20%", textAlign: "center" } },
	                                                            React.createElement(
	                                                                'span',
	                                                                { style: { lineHeight: "25px" } },
	                                                                'Currency'
	                                                            )
	                                                        )
	                                                    )
	                                                ),
	                                                React.createElement(
	                                                    'tbody',
	                                                    null,
	                                                    this.state.detailRow
	                                                ),
	                                                React.createElement(
	                                                    'tfoot',
	                                                    null,
	                                                    React.createElement(
	                                                        'tr',
	                                                        null,
	                                                        React.createElement(
	                                                            'td',
	                                                            { style: { borderBottom: "1px solid lightgray", borderRight: "1px solid lightgray" } },
	                                                            React.createElement(
	                                                                'span',
	                                                                { style: { lineHeight: "25px", paddingLeft: "3px" } },
	                                                                'Discount'
	                                                            )
	                                                        ),
	                                                        React.createElement(
	                                                            'td',
	                                                            { style: { textAlign: "right", borderBottom: "1px solid lightgray", borderRight: "1px solid lightgray" } },
	                                                            React.createElement(
	                                                                'span',
	                                                                { style: { lineHeight: "25px", paddingRight: "3px" } },
	                                                                helper.numberFormat(this.state.bookingList.discount, 2)
	                                                            )
	                                                        ),
	                                                        React.createElement(
	                                                            'td',
	                                                            { style: { textAlign: "right", borderBottom: "1px solid lightgray" } },
	                                                            React.createElement(
	                                                                'span',
	                                                                { style: { lineHeight: "25px", paddingRight: "3px" } },
	                                                                this.state.bookingList.currency
	                                                            )
	                                                        )
	                                                    ),
	                                                    React.createElement(
	                                                        'tr',
	                                                        null,
	                                                        React.createElement(
	                                                            'td',
	                                                            { style: { borderBottom: "1px solid lightgray", borderRight: "1px solid lightgray" } },
	                                                            React.createElement(
	                                                                'span',
	                                                                { style: { lineHeight: "25px", paddingLeft: "3px" } },
	                                                                'Surcharge'
	                                                            )
	                                                        ),
	                                                        React.createElement(
	                                                            'td',
	                                                            { style: { textAlign: "right", borderBottom: "1px solid lightgray", borderRight: "1px solid lightgray" } },
	                                                            React.createElement(
	                                                                'span',
	                                                                { style: { lineHeight: "25px", paddingRight: "3px" } },
	                                                                helper.numberFormat(this.state.bookingList.charge_amount, 2)
	                                                            )
	                                                        ),
	                                                        React.createElement(
	                                                            'td',
	                                                            { style: { textAlign: "right", borderBottom: "1px solid lightgray" } },
	                                                            React.createElement(
	                                                                'span',
	                                                                { style: { lineHeight: "25px", paddingRight: "3px" } },
	                                                                this.state.bookingList.currency
	                                                            )
	                                                        )
	                                                    )
	                                                )
	                                            ),
	                                            React.createElement('br', null),
	                                            React.createElement(
	                                                'div',
	                                                { style: { width: "510px", height: "25px", border: '1px solid lightgray', borderRadius: '3px', paddingLeft: '3px', backgroundColor: '#e2e2e2' } },
	                                                React.createElement(
	                                                    'table',
	                                                    { style: { width: "100%" } },
	                                                    React.createElement(
	                                                        'thead',
	                                                        null,
	                                                        React.createElement(
	                                                            'tr',
	                                                            null,
	                                                            React.createElement(
	                                                                'th',
	                                                                { style: { width: "60%", textAlign: "left" } },
	                                                                React.createElement(
	                                                                    'span',
	                                                                    { style: { lineHeight: "25px", paddingLeft: "3px" } },
	                                                                    'Total amount'
	                                                                )
	                                                            ),
	                                                            React.createElement(
	                                                                'th',
	                                                                { style: { width: "20%", textAlign: "right" } },
	                                                                React.createElement(
	                                                                    'span',
	                                                                    { style: { lineHeight: "25px", paddingRight: "3px" } },
	                                                                    helper.numberFormat(this.state.bookingList.total_amount, 2)
	                                                                )
	                                                            ),
	                                                            React.createElement(
	                                                                'th',
	                                                                { style: { width: "20%", textAlign: "right" } },
	                                                                React.createElement(
	                                                                    'span',
	                                                                    { style: { lineHeight: "25px", paddingRight: "3px" } },
	                                                                    this.state.bookingList.currency
	                                                                )
	                                                            )
	                                                        )
	                                                    )
	                                                )
	                                            )
	                                        ),
	                                        React.createElement(
	                                            'div',
	                                            { style: { width: "40%", minHeight: "150px", float: "left", padding: "0px 8px 1px 8px" } },
	                                            React.createElement(
	                                                'div',
	                                                { style: { width: '100%' } },
	                                                React.createElement(
	                                                    'p',
	                                                    null,
	                                                    React.createElement(
	                                                        'b',
	                                                        null,
	                                                        'Additional charge'
	                                                    )
	                                                ),
	                                                React.createElement('br', null),
	                                                React.createElement(_textField2.default, {
	                                                    id: 'additionDetail',
	                                                    ref: 'additionDetail',
	                                                    underlineShow: false,
	                                                    style: textFieldsNonHr,
	                                                    onChange: this.handleChangeFlaxTextInput,
	                                                    hintText: 'Detail',
	                                                    hintStyle: { bottom: '0px', fontSize: '14px' }
	                                                })
	                                            ),
	                                            React.createElement(
	                                                'div',
	                                                { style: { width: '100%', marginTop: "3px" } },
	                                                React.createElement(_textField2.default, {
	                                                    id: 'additionAmount',
	                                                    ref: 'additionAmount',
	                                                    underlineShow: false,
	                                                    style: textFieldsNonHr,
	                                                    onChange: this.handleChangeFlaxTextInput,
	                                                    hintText: this.state.checkAmount == true ? this.state.amountTrue : this.state.amountFalse,
	                                                    hintStyle: this.state.checkAmount == true ? hideStyles.errorStyle : hideStyles.okStyle
	                                                })
	                                            ),
	                                            React.createElement(
	                                                'div',
	                                                { style: { width: '100%', marginTop: "3px" } },
	                                                React.createElement(_textField2.default, {
	                                                    id: 'additionRemark',
	                                                    ref: 'additionRemark',
	                                                    underlineShow: false,
	                                                    style: textFieldsNonHr,
	                                                    onChange: this.handleChangeFlaxTextInput,
	                                                    hintText: 'Remark',
	                                                    hintStyle: { bottom: '0px', fontSize: '14px' }
	                                                })
	                                            ),
	                                            React.createElement(
	                                                'div',
	                                                { style: { width: '100%', marginTop: "5px" } },
	                                                React.createElement(_raisedButton2.default, {
	                                                    label: 'save',
	                                                    primary: true,
	                                                    style: { height: "28px", fontSize: "12px", float: "right" },
	                                                    onClick: this.saveAddition
	                                                })
	                                            )
	                                        )
	                                    ),
	                                    React.createElement('br', null),
	                                    React.createElement('div', { style: { clear: 'both' } }),
	                                    React.createElement(
	                                        'div',
	                                        { style: { width: "888px", minHeight: "60px", marginTop: "10px" } },
	                                        React.createElement(
	                                            'p',
	                                            { style: { marginLeft: "8px" } },
	                                            React.createElement(
	                                                'b',
	                                                null,
	                                                'Invoice name & address'
	                                            )
	                                        ),
	                                        React.createElement(
	                                            'div',
	                                            { style: { width: "59%", minHeight: "60px", float: "left", margin: "0px 8px 5px 8px", border: "1px solid lightgray", backgroundColor: "#e2e2e2", borderRadius: "3px", padding: "3px" } },
	                                            React.createElement(
	                                                'p',
	                                                { style: { padding: "0px 8px 0px 8px" } },
	                                                React.createElement(
	                                                    'span',
	                                                    { style: { lineHeight: "21px" } },
	                                                    React.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.bookingList.invoice_addr } })
	                                                )
	                                            )
	                                        )
	                                    )
	                                )
	                            ),
	                            React.createElement(
	                                _tab2.default,
	                                { label: 'Document', value: 'document', id: 'document', onClick: this.handleChangeTab.bind(this, "document"), style: { height: '30px' } },
	                                React.createElement(
	                                    'div',
	                                    null,
	                                    React.createElement(
	                                        'div',
	                                        { style: { width: "888px", minHeight: "150px", marginTop: "10px" } },
	                                        React.createElement(
	                                            'div',
	                                            { style: { width: "50%", minHeight: "107px", float: "left", margin: "0px 8px 5px 8px", borderRight: "1px solid black" } },
	                                            React.createElement(
	                                                'p',
	                                                null,
	                                                React.createElement(
	                                                    'b',
	                                                    null,
	                                                    'Print document'
	                                                )
	                                            ),
	                                            React.createElement(
	                                                'div',
	                                                { style: { marginLeft: "8px" } },
	                                                React.createElement(
	                                                    'a',
	                                                    { href: this.state.bookingList.shipment, target: '_blank' },
	                                                    React.createElement('img', { src: '/img/PDF-icon.png', alt: 'Smiley face', width: '23', height: '23' }),
	                                                    'Print shipment waybill'
	                                                )
	                                            ),
	                                            React.createElement(
	                                                'div',
	                                                { style: { marginLeft: "8px", marginTop: "3px" } },
	                                                React.createElement(
	                                                    'a',
	                                                    { href: this.state.bookingList.barcode, target: '_blank' },
	                                                    React.createElement('img', { src: '/img/PDF-icon.png', alt: 'Smiley face', width: '23', height: '23' }),
	                                                    'Print shipment label'
	                                                )
	                                            ),
	                                            React.createElement(
	                                                'div',
	                                                { style: { marginLeft: "8px", marginTop: "3px" } },
	                                                React.createElement(
	                                                    'a',
	                                                    { href: this.state.bookingList.invoice, target: '_blank' },
	                                                    React.createElement('img', { src: '/img/PDF-icon.png', alt: 'Smiley face', width: '23', height: '23' }),
	                                                    'Print proforma invoice / temporary receipt'
	                                                )
	                                            )
	                                        ),
	                                        React.createElement(
	                                            'div',
	                                            { style: { width: "45%", minHeight: "100px", float: "left", margin: "0px 8px 5px 8px" } },
	                                            React.createElement(
	                                                'p',
	                                                null,
	                                                React.createElement(
	                                                    'b',
	                                                    null,
	                                                    'Send document via Email (all document)'
	                                                )
	                                            ),
	                                            React.createElement(
	                                                'div',
	                                                { style: { marginLeft: "8px", width: '100%', marginTop: "3px" } },
	                                                React.createElement(_textField2.default, {
	                                                    id: 'email',
	                                                    ref: 'email',
	                                                    underlineShow: false,
	                                                    style: { height: "25px",
	                                                        width: "300px",
	                                                        border: "1px solid lightgray",
	                                                        borderRadius: '4px',
	                                                        padding: "0px 3px 0px 3px",
	                                                        fontSize: '14px' },
	                                                    onChange: this.handleChangeFlaxTextInput,
	                                                    hintText: 'Email',
	                                                    hintStyle: { bottom: '0px', fontSize: '14px' }
	                                                }),
	                                                React.createElement(_raisedButton2.default, {
	                                                    label: 'sent',
	                                                    secondary: true,
	                                                    style: { height: "24px", fontSize: "12px", float: "right" },
	                                                    onClick: this.sentDocToEmail
	                                                })
	                                            )
	                                        )
	                                    )
	                                )
	                            )
	                        )
	                    )
	                )
	            )
	        );
	    }
	});

	module.exports = CustomerList;

/***/ }

});