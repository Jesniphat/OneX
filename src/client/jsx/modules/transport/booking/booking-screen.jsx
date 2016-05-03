var React     = require('react');

// import {TextField, DatePicker, RadioButton, RadioButtonGroup, RaisedButton, Table, TableHeaderColumn, TableRow, TableHeader,
//         TableRowColumn, TableBody, TableFooter, Toggle, Checkbox, ActionFavorite, ActionFavoriteBorder, FloatingActionButton,
//         ContentAdd, SelectField, DropDownMenu, FlatButton, Dialog} from '../../../mui.jsx'
// const MenuItem = require('material-ui/lib/menus/menu-item');

import TextField from 'material-ui/lib/text-field';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import Checkbox from 'material-ui/lib/checkbox';
import ActionFavorite from 'material-ui/lib/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/lib/svg-icons/action/favorite-border';
import RaisedButton from 'material-ui/lib/raised-button';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import Toggle from 'material-ui/lib/toggle';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import FontIcon from 'material-ui/lib/font-icon';
import Colors from 'material-ui/lib/styles/colors';
import AutoComplete from 'material-ui/lib/auto-complete';
import IconButton from 'material-ui/lib/icon-button';

var tr = require('counterpart');

var system = require('ss-system');
var widgets = require('ss-widget');
var toasterActions = system.toasterActions;
var helper = system.helper;// require('../../../../../server/lib/Helper');
var systemActions = system.systemActions;// require('../../system/actions');
var infoPanelActions = system.infoPanelActions;// require('../../../actions/info-panel');
var Router    = require('react-router');
var actions = require('./actions');

var T         = require('react-translate-component');
// var dialogActions = system.dialogActions;
var FlexTextInput = widgets.FlexTextInput;// require('../../../widgets/flex-text-input.jsx');
var FlexButton    = widgets.FlexButton;// require('../../../widgets/flex-button.jsx');
var FlexDisplayTable    = widgets.FlexDisplayTable;// require('../../../widgets/flex-display-table.jsx');
var FlexDropdown  = widgets.FlexDropdown;// require('../../../widgets/flex-dropdown.jsx');
var FlexIcon = widgets.FlexIcon;
var FlexTab  = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');
var FlexCheckbox  = widgets.FlexCheckbox;
var FlexRadioGroup  = widgets.FlexRadioGroup;
var Link          = Router.Link;

var ReFlux = require('reflux');

const styles = {
      block: {
        maxWidth: '100%',
      },
      radioButton: {
        marginBottom: 3,
      },
      RaisedButtonStyle: {
        margin: 3,
        'min-width': 5,
        width: '100%',
      },
      RaisedButtonNextStyle: {
        margin: 3,
        width: '100%',
      },
      RaisedButtonAddStyle: {
        width: '100%',
      },
      propContainerStyle: {
        width: 200,
        overflow: 'hidden',
        margin: '20px auto 0',
      },
      propToggleHeader: {
        margin: '20px auto 10px',
      },
      checkbox: {
        marginBottom: 3,
        width: '100%',
      }
    };

    const iconStyles = {
      marginRight: 24,
    };

    //var initialData = null;
    var tableData = [];
    var packageList = [];
    //var addressList = [];
    var addressListValue = [];
    var flagChangeAdress = "NO";

var LoadFareScreen = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins:[
    //ReFlux.listenTo(actions.getInitialData.done,'onGetInitialData'),
    ReFlux.listenTo(actions.getAddressList.done,'onGetAddressListDoneAction'),
    ReFlux.listenTo(actions.getDefaultAddr.done,'onGetDefaultAddrDoneAction'),
    ReFlux.listenTo(actions.getContentPackageList.done,'onContentGetPackageListDoneAction'),
    ReFlux.listenTo(actions.getFromDestination.done,'onGetFromDestinationDoneAction'),
    ReFlux.listenTo(actions.getToDestination.done,'onGetToDestination'),
    ReFlux.listenTo(actions.getRateType.done,'onGetRateTypeDoneAction'),
    ReFlux.listenTo(actions.getRate.done,'onGetGetRateDoneAction'),
    ReFlux.listenTo(actions.saveBooking.done,'onSaveBookingDoneAction'),
    ReFlux.listenTo(actions.saveBooking.error,'onSaveBookingErrorAction'),
    ReFlux.listenTo(actions.saveBillist.done, 'onSaveBillistDoneAction'),
    ReFlux.listenTo(actions.printReportBooking.done, 'onPrintReportBookingDoneAction'),
    ReFlux.listenTo(actions.printReportBooking.error, 'onPrintReportBookingErrorAction'),
    ReFlux.listenTo(actions.printBarcodeBooking.done, 'onPrintBarcodeBookingDoneAction'),
    ReFlux.listenTo(actions.printBarcodeBooking.error, 'onPrintBarcodeBookingErrorAction'),
    ReFlux.listenTo(actions.printInvoiceBooking.done, 'onPrintInvoiceBookingDoneAction'),
    ReFlux.listenTo(actions.printInvoiceBooking.error, 'onPrintInvoiceBookingErrorAction'),
    ReFlux.listenTo(actions.sentMail.done, 'onSentMailDoneAction'),
    ReFlux.listenTo(actions.sentMail.error, 'onSentMailErrorAction')
  ],

  getInitialState:function() {
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
      totalAmount:0,
      itemQty:0,
      total_weight:0,
      total_volume_weight:0,
      packageListValue:{
        list: null,
        value: null,
        text: null,
        isLock: true,
      },
      fromList:{
        autoList: [],
        list: null,
        value: '',
        text: null,
      },
      toList:{
        autoList:[],
        list: null,
        value: '',
        text: null,
      },
      rateType:{
        list: null,
        value: null,
      },
      myList: null,
      addressList: null,
      rate: null,
      initialData: null,
      currencyCodeTemp:'THB',
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
      textField:{
        senderValues: '',
        receipientValues: '',
        picUpPlaceValues:'',
        invoiceName:'',
      }
    }
  },

  ProductRow:function(dataTable){
    console.log("dataTable = ", dataTable);
    return dataTable.map(function(row, index){
      return (<TableRow key={index} style={{'background-color': '#fff'}}>
        <TableRowColumn style={{'width': '22%','padding':'0px','padding-left':'3px'}}>{row.nameList}</TableRowColumn>
        <TableRowColumn style={{textAlign: 'center', 'width': '10%','padding':'0px','padding-left':'3px'}}>{row.qty}</TableRowColumn>
        <TableRowColumn style={{textAlign: 'center', 'width': '10%','padding':'0px','padding-left':'3px'}}>{row.width} cm.</TableRowColumn>
        <TableRowColumn style={{textAlign: 'center', 'width': '10%','padding':'0px','padding-left':'3px'}}>{row.depth} cm.</TableRowColumn>
        <TableRowColumn style={{textAlign: 'center', 'width': '10%','padding':'0px','padding-left':'3px'}}>{row.height} cm.</TableRowColumn>
        <TableRowColumn style={{textAlign: 'center', 'width': '10%','padding':'0px','padding-left':'3px'}}>{row.weight} kg.</TableRowColumn>
        <TableRowColumn style={{textAlign: 'right','width':'10%','mso-number-format':'General','padding':'0px','padding-left':'3px'}}>{helper.numberFormat(row.amount,2)}</TableRowColumn>
        <TableRowColumn style={{textAlign: 'center', 'width': '10%','padding':'0px','padding-left':'3px'}}>{row.currency}</TableRowColumn>
        <TableRowColumn style={{textAlign: 'center', 'width': '8%','padding':'0px','padding-left':'3px'}}>
            <div>
              <IconButton iconClassName="flaticon-cancel19 normal icon" onMouseDown={this.deleteContent.bind(this, index)}/>
            </div>
        </TableRowColumn>
      </TableRow>)
    }.bind(this));
  },
  componentDidMount:function() {
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

  changeRate:function() {
    console.log("Go ChangeRate");
    if((this.state.rateType.value != null)&&(this.state.fromList.value != "")&&(this.state.toList.value != "")) {
      console.log("Chacke change Rate","Reat = ",this.state.rateType.value, "  from = ",this.state.fromList.value ,"  to = ",this.state.toList.value);
      actions.getRate(this.state.fromList.value, this.state.toList.value, this.state.rateType.value);
    }
  },

  calNewRate:function() {
    for(var i=0; i<tableData.length; i++){
      var rateAmount = 0;
      if(this.state.initialData.currency_code == 'USD'){
          rateAmount = this.state.rate.usd;
      } else if(this.state.initialData.currency_code == 'THB'){
          rateAmount = this.state.rate.thb;
      }
      var total = 0;
      if(tableData[i].size >= tableData[i].weight){
        total = tableData[i].size*(rateAmount);
      }else{
        total = tableData[i].weight*(rateAmount);
      }
      console.log("total = ", total);

      var qty = tableData[i].qty;
      var totalAmount = total * qty;

      tableData[i].amount = totalAmount;
      tableData[i].total_price = totalAmount;
    }

    this.sumTotal();
  },

  sumTotal:function() {
    console.log("SumTotal",tableData.length);
    var initialData = this.state.initialData;
    console.log("get initail = ",initialData);
    var total = 0;
    var itemQty = 0;
    var total_weight = 0;
    var total_volume_weight = 0;
    for(var i=0 ; i<tableData.length; i++){
      total = parseFloat(total) + parseFloat(tableData[i].amount);
      itemQty = parseFloat(itemQty) + parseFloat(tableData[i].qty);
      total_weight = parseFloat(total_weight) + (parseFloat(tableData[i].weight)*parseFloat(tableData[i].qty));
      total_volume_weight = parseFloat(total_volume_weight) + (parseFloat(tableData[i].volume_weight)*parseFloat(tableData[i].qty));
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
    if(initialData.discount_type == 'baht'){
      discountAmount = initialData.discount;
      totalAmount = total - initialData.discount;
    }else{
      var d = initialData.discount
      discountAmount = (total * (d.substring(0, d.length-1)))/100;
      initialData.discountPercent = d.substring(0, d.length-1);
      totalAmount = total - discountAmount;
    }

    totalAmount = totalAmount + initialData.charge;
    console.log("totalAmount = ",total)
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

  changeAddress: function(index){
    this.dialogAddressOpen();
    console.log("Change Address = ",index);
    flagChangeAdress = index;
    this.state.disableAddressList = false;
    this.setState({
      disableAddressList: this.state.disableAddressList
    });

    this.onGetAddressListDoneAction(addressListValue);
  },

  setAddress: function(index){
    console.log("set Address = ", index, "set to = ", flagChangeAdress);
    console.log("See Address = ", addressListValue[index].address)
    if(flagChangeAdress != "NO" && this.state.disableAddressList != true){
      if (flagChangeAdress == 'sender'){
        this.state.textField.senderValues = addressListValue[index].address;
        this.state.textField.picUpPlaceValues = addressListValue[index].address;
        this.setState({
          textField: this.state.textField,
        });
        this.checkDisabledTo();
      } else if (flagChangeAdress == 'receipient'){
        //this.refs.receipient.setValue(addressListValue[index].address);
        this.state.textField.receipientValues = addressListValue[index].address;
        this.setState({
          textField: this.state.textField,
        });
        this.checkDisabledPickUp();
      } else if (flagChangeAdress == 'picUpPlace'){
        //this.refs.picUpPlace.setValue(addressListValue[index].address);
        this.state.textField.picUpPlaceValues = addressListValue[index].address;
        this.setState({
          textField: this.state.textField,
        });
        this.checkDisabledInvoice();
      } else if (flagChangeAdress == 'invoiceName'){
        console.log("Set invoiceName")
        //this.refs.invoiceName.setValue(addressListValue[index].address);
        this.state.textField.invoiceNameValues = addressListValue[index].address;
        this.setState({
          textField: this.state.textField,
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

  radioPackage: function(e, value){
    console.log("radioPackage = ", value)
    if(value == 'Document'){
      this.state.packageListValue.isLock = true;
      console.log("ddfs",this.refs.packageList);
    }else{
      this.state.packageListValue.isLock = false;
    }

    this.setState({
      packageListValue: this.state.packageListValue
    });
    //console.log(this.state.packageListValue);

  },

  calContent: function(){
    console.log("cal Rate = ", this.state.rate,"Inintail Data = ", this.state.initialData);
    console.log("New PackageList = ", this.refs.packageList);

    var isSame = false;

    if(this.state.fromList.value == '' || this.state.fromList.value == null){
      var text = "Please select from.";
      this.setState({
        dialogMessage: text
      });
      this.dialogOpen();
      return;
    }  else if (this.state.toList.value == '' || this.state.toList.value == null) {
      var text = "Please select To.";
      this.setState({
        dialogMessage: text
      });
      this.dialogOpen();
      return;
    } else if (this.refs.rateType.props.value == null || this.refs.rateType.props.value == ""){
      var text = "Please select Dalivery type";
      this.setState({
        dialogMessage: text
      });
      this.dialogOpen();
      return;
    }

    var contentName = null;
    var contentId = null;
    if(this.refs.package.getSelectedValue()=='Document'){
      contentId = -1;
      contentName = this.refs.package.getSelectedValue();
    }else{
      contentId = this.refs.packageList.props.value;
      contentName = this.state.packageListValue.text;
    }
    console.log("contentName = ", contentName);

    var width = this.refs.width.getValue();
    var depth = this.refs.depth.getValue();
    var height = this.refs.height.getValue();

    if(isNaN(width) || isNaN(depth) || isNaN(height) || isNaN(this.refs.weight.getValue()) || isNaN(this.refs.qty.getValue())){
      var text = "Please ensure dimensions support filling by number only.";
      this.setState({
        dialogMessage: text
      });
      this.dialogOpen();
      return;
    }

    var size = ((width*depth*height)/6000);
    console.log("size = ",size);

    var weight = this.refs.weight.getValue();

    if(width == '' || width == null || depth == '' || depth == null || height == '' || height == null || weight == '' || weight == null){
      var text = "Please Insert width, depth, height and weight"
      this.setState({
        dialogMessage: text
      });
      this.dialogOpen();
      return;
    }

    var rateAmount = 0;
    if(this.state.initialData.currency_code == 'USD'){
        rateAmount = this.state.rate.usd;
    } else if(this.state.initialData.currency_code == 'THB'){
        rateAmount = this.state.rate.thb;
    }

    var total = 0;
    if(size >= weight){
      total = size*(rateAmount);
    }else{
      total = weight*(rateAmount);
    }
    console.log("total = ", total);

    var qty = this.refs.qty.getValue();
    var totalAmount = total * qty;
    //  + " (W" + width + " x D" + depth + " x H" + height + ", " + weight + "KG.)"
    for(var i = 0; i < tableData.length; i++){
        if(tableData[i].name == contentName && tableData[i].width == width && tableData[i].depth == depth &&
           tableData[i].height == height && tableData[i].weight == weight){
            tableData[i].amount += parseFloat(totalAmount);
            tableData[i].qty += parseFloat(qty);
            tableData[i].volume_weight += parseFloat(size);
            // tableData[i].weight += parseFloat(weight);
            tableData[i].total_price += parseFloat(totalAmount);
            isSame = true;
        }
    }

    if(isSame == false){
      tableData.push({nameList:contentName,
                      name:contentName,
                      contentId:contentId,
                      packageType:this.refs.package.getSelectedValue(),
                      packageContent:this.refs.content.getValue(),
                      amount:totalAmount,
                      currency:this.state.initialData.currency_code,
                      qty:parseFloat(qty),
                      width:parseFloat(width),
                      depth:parseFloat(depth),
                      height:parseFloat(height),
                      volume_weight:parseFloat(size),
                      weight:parseFloat(weight),
                      total_price:parseFloat(totalAmount),
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

  deleteContent: function(index) {
    console.log("click Table");
    tableData.splice(index, 1);
    this.setState({
      tableProductRow: this.ProductRow(tableData)
    });
    this.sumTotal();
  },

  onGetGetRateDoneAction: function(rate){
    this.state.rate = rate;
    this.setState({
      rate: this.state.rate
    });

    console.log("onGetGetRateDoneAction = ",this.state.rate);
    if(tableData.length > 0){
      console.log("tableData Data = ", tableData);
      this.calNewRate();
    }
  },

  onGetAddressListDoneAction: function(addrList) {
    console.log("addressList = ", addrList);
    addressListValue = addrList;

    var addressList = [];
    for(var i=0; i<addrList.length; i++){
      addressList.push(<div id={i} style={{padding:'5px',float:'left',width:'237'}} onMouseDown={this.setAddress.bind(this, i)}>
        <div style={{'border':'1px solid lightgray','padding':'5px','width':'100%','height':'70px'}}>
          {addrList[i].address}
        </div>
      </div>);
    }

    this.state.addressList = addressList;
    this.setState({
      addressList: this.state.addressList
    });
  },

  onGetDefaultAddrDoneAction: function(addr){
    //this.refs.sender.setValue(addr.address);
    this.state.textField.senderValues = addr.address;
    this.state.textField.picUpPlaceValues = addr.address;
    this.state.textField.invoiceNameValues = addr.address;

    this.state.initialData = addr;
    this.setState({
      textField:this.state.textField
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

  onContentGetPackageListDoneAction: function(listData){
    var list = listData.map(function(row) {
      return {
          value: row.value,
          text: row.text
      }
    });
    console.log(list,list.length);
    var packageList = [];
    for (var i=0; i<list.length; i++){
      packageList.push(<MenuItem key={list[i].value} value={list[i].value} primaryText={list[i].text}/>);
    }
    this.state.packageListValue.list =  packageList;
    this.setState({
      packageListValue: this.state.packageListValue
    })
  },

  onGetFromDestinationDoneAction: function(listData){
    console.log("GetFromList = ", listData);
    var list = listData.map(function(row) {
      return {
          value: row.value,
          text: row.text
      }
    });
    console.log(list,list.length);

    var fromList = [];
    for (var j=0; j<list.length; j++){
      fromList.push(<MenuItem key={list[j].value} value={list[j].value} primaryText={list[j].text}/>);
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
    })
  },

  onGetToDestination: function(listData){
    var list = listData.map(function(row) {
      return {
          value: row.value,
          text: row.text
      }
    });
    console.log(list,list.length);

    var toList = [];
    for (var j=0; j<list.length; j++){
      toList.push(<MenuItem key={list[j].value} value={list[j].value} primaryText={list[j].text}/>);
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
    })
  },

  onGetRateTypeDoneAction: function(res){
    console.log(res);
    var list = res.map(function(row) {
      return {
          value: row.service_type,
          text: row.service_type
      }
    });
    console.log(list,list.length);
    var rateTypes = [];
    for (var i=0; i<list.length; i++){
      rateTypes.push(<MenuItem value={list[i].value} primaryText={list[i].text}/>);
    }
    this.state.rateType.list =  rateTypes;
    this.setState({
      rateType: this.state.rateType
    })
  },

  handleChangepackageList:function(event, index, value, textContent){
    console.log("event = ",event," index = ",index, " value = ", value, "text = ", event.target.textContent);
    //console.log(this.state.packageListValue);
    this.state.packageListValue.value = value;
    this.state.packageListValue.text = event.target.textContent;
    this.setState({
      packageListValue: this.state.packageListValue
    });
  },

  handleChangeFromList:function(event, index, value){
    //console.log("event = ",event," index = ",index, " value = ", value);
    //console.log(this.state.packageListValue);
    this.state.fromList.value = value;
    this.setState({
      fromList: this.state.fromList
    });
    this.checkDisabledTo();
    //this.changeRate();
  },

  handleChangeToList:function(event, index, value){
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

  handleChangeRateType:function(evenn, index, value){
    var from = this.state.fromList.value
    var to = this.state.toList.value;
    this.state.rateType.value = value;
    this.setState({
      rateType: this.state.rateType
    });

    var rate = value;
    //console.log("From and To = ", from,to,rate);
    this.changeRate();
  },

  handleChangeTextField:function(id,event){
    // console.log("even = ",event.target.value);
    // console.log("id = ", id);
    this.state.textField[id] = event.target.value
    this.setState({
      textField: this.state.textField,
    });
  },

  saveBooking:function() {
    console.log('saveBooking');
    console.log("refs = ",this.refs);
    if(this.state.enableNext === false){
      var text = "Please accept the booking conditions.";
      this.setState({
        dialogMessage: text
      });
      this.dialogOpen();
      return;
    }

    if(this.state.fromList.value == '' || this.state.fromList.value == null){
      var text = "Please select from.";
      this.setState({
        dialogMessage: text
      });
      this.dialogOpen();
      return;
    }  else if (this.state.toList.value == '' || this.state.toList.value == null) {
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
    } else if (this.refs.rateType.props.value == null || this.refs.rateType.props.value == ""){
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
    var getMonths = (pickupDateData.getMonth()+1).toString(); // getMonth() is zero-based
    var getDays  = pickupDateData.getDate().toString();
    var fullPickupDate = getYears +"-"+ (getMonths[1]?getMonths:"0"+getMonths[0]) +"-"+ (getDays[1]?getDays:"0"+getDays[0]);

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
      discount_percent: (this.state.initialData.discount_type == 'percent') ? this.state.initialData.discountPercent : "0",
      charge_amount: this.state.initialData.charge,
      receipt_type: 'BILLING',
      currency_id: (this.state.initialData.currency_code == 'USD') ? '2' : '1',
      zone: this.state.rate.zone,
      rate: (this.state.initialData.currency_code == 'USD') ? this.state.rate.usd : this.state.rate.thb,
      customer_id: this.state.initialData.id,
      itemQty: this.state.itemQty,
      total_weight: this.state.total_weight,
      total_volume_weight: this.state.total_volume_weight,
      deliveryType: this.state.rateType.value,
      country_origin: this.state.rate.country_origin,
    }

    console.log("Obj = ", obj);

    actions.saveBooking(obj);
    //actions.sentMail();
  },
  onSaveBookingDoneAction: function(data){
    console.log("Booking ID = ", data.booking_id);
    toasterActions.pop({
      type:'success',
      message:data.done
    });
    actions.printReportBooking(data.booking_id);
  },
  onSaveBookingErrorAction: function(data){
    alert("Save Booking Error");
    toasterActions.pop({
      type:'warning',
      message:'Can not Save Booking'
    });
  },
  onPrintReportBookingDoneAction: function(data){
    window.open(data.pdfFile);
    actions.printBarcodeBooking(data.bookingId);
  },
  onPrintReportBookingErrorAction: function(data){
    console.log("Error GenReport");
  },
  onPrintBarcodeBookingDoneAction: function(data){
    window.open(data.pdfFile);
    actions.printInvoiceBooking(data.bookingId);
  },
  onPrintBarcodeBookingErrorAction: function(data){
    console.log("Error Genbarcode");
  },
  onPrintInvoiceBookingDoneAction: function(data){
      actions.sentMail(data.bookingId);
      window.open(data.pdfFile);
      //window.location.href='/signin-transport/#/finishbooking/' + data.bookingId;
  },
  onPrintInvoiceBookingErrorAction: function(data){
      console.log("Error Invoice");
  },
  onSentMailDoneAction: function(data){
      window.location.href='/signin-transport/#/finishbooking/' + data.bookingId;
  },
  onSentMailErrorAction:function(data){
      console.log("Error can't sent email");
  },

  onSaveBillistDoneAction: function(){
    //alert("Save list complete");
    actions.getAddressList(this.state.personId);
    toasterActions.pop({
      type:'success',
      message:'Save list complete'
    });
    actions.getDefaultAddr(this.state.personId);
  },

  dialogOpen: function(){
    this.setState({
      openDialog: true
    });
  },

  dialogClose: function(){
    this.setState({
      openDialog: false
    });
  },

  dialogBilOpen: function() {
    console.log("Open billing");
    this.setState({
      openBillingDialog: true
    });
  },

  dialogBilClose: function() {
    this.setState({
      openBillingDialog: false
    });
  },

  dialogAddBilling: function() {
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
      personId: this.state.initialData.id,
    };
    console.log(billist);

    actions.saveBillist(billist);

    this.setState({
      openBillingDialog: false
    });
  },

  dialogAddressOpen: function() {
    console.log("Open Address");
    this.setState({
      openAddressDialog: true
    });
  },

  dialogAddressClose: function() {
    this.setState({
      openAddressDialog: false
    });
  },

  agreeBox:function(e, value){
    console.log("e = ", e);
    console.log("v = ", value);

    this.setState({
      enableNext: value
    });
  //this.doNext(value);
  },

  linkCon: function(){
    console.log("ssssl");
    window.location.href='www.kapook.com';
  },

  checkDisabledTo: function(event){
      this.changeRate()
      console.log("checkDisabledTo",event);
      var check = true;
      if(event==undefined){
          //console.log("1")
          if(this.state.fromList.value==''||this.state.fromList.value==undefined){
              //console.log("2")
              check = true;
          }else{
              //console.log("3")
              check = false;
          }
      }else if(event==''){
          //console.log("4")
          check = true;
      }else{
          console.log("5 = ",event,"ssss = ",this.state.fromList.value)
          if(this.state.fromList.value==""){
              check = true;
          }else{
              check = false;
          }
      }

      if(this.state.textField.senderValues==''||check == true){
          //console.log("tyi1");
          this.setState({
              disabledTo: true
          });
      }else{
          //console.log("tyi2",this.state.textField.senderValues,"2",this.refs.fromText.getValue());
          this.setState({
              disabledTo: false
          });
      }
      this.checkDisabledPickUp();
      this.checkDisabledInvoice();
      this.checkDisabledDatePick();
  },

  checkDisabledPickUp: function(event){
      this.changeRate()
      console.log("checkDisabledPickUp",event);
      var check = true;
      if(event==undefined){
          if(this.state.toList.value==''||this.state.toList.value==undefined){
              check = true;
          }else{
              check = false;
          }
      }else if(event==''){
          check = true;
      }else{
          if(this.state.toList.value==""){
              check = true;
          }else{
              check = false;
          }
      }

      if(this.state.textField.receipientValues ==''||check == true||this.state.fromList.value==''||
         this.state.fromList.value==undefined||this.state.textField.senderValues==''){
          //console.log("tyi1");
          this.setState({
              disabledPickUp: true
          });
      }else{
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

  checkDisabledInvoice: function(){
      console.log(this.state.textField.picUpPlaceValues);
      if(this.state.textField.picUpPlaceValues ==''||this.state.textField.picUpPlaceValues==undefined||
         this.state.toList.value==''||this.state.toList.value==undefined||
         this.state.textField.receipientValues ==''||this.state.fromList.value==''||
         this.state.fromList.value==undefined||this.state.textField.senderValues==''){
          this.setState({
              disabledInvoice: true
          });
      }else{
          this.setState({
              disabledInvoice: false
          });
      }
      this.checkDisabledDatePick();
  },

  checkDisabledDatePick: function(){
      if(this.state.textField.invoiceNameValues ==''||this.state.textField.invoiceNameValues==undefined||
         this.state.textField.picUpPlaceValues ==''||this.state.textField.picUpPlaceValues==undefined||
         this.state.toList.value==''||this.state.toList.value==undefined||
         this.state.textField.receipientValues ==''||this.state.fromList.value==''||
         this.state.fromList.value==undefined||this.state.textField.senderValues==''){
          this.setState({
              disabledDatePick: true
          });
      }else{
          this.setState({
              disabledDatePick: false
          });
      }
  },

  checkDisabledDlType: function(event,value){
    // console.log("Get = ",this.refs.picUpDate.getDate());
    // console.log("event = ",event);
    console.log("value = ", value);
    if(value == undefined || value == null){
        this.setState({
            disabledDlType: true
        });
    }else{
        this.setState({
            disabledDlType: false
        });
    }
  },

  formatDate: function(date){
    console.log("Date Format = ", date)
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  },

  disabledAddBt: function(){

  },

  render: function() {
    // some text
    var dialogAddBillingAction = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.dialogBilClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.dialogAddBilling}
      />,
    ];

    var dialogChangeAddressAction = [
      <FlatButton
        label="ADD"
        primary={true}
        onTouchTap={this.dialogBilOpen}
      />,
      <FlatButton
        label="Close"
        secondary={true}
        onTouchTap={this.dialogAddressClose}
      />
    ];

    var dialogActions = [
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.dialogClose}
      />,
    ];
    return (
      <div className="layout-panel content-page" style={{margin:'auto'}}>
        <div style={{overflow: 'scroll'}}>
          <Dialog
            title="Change Address"
            actions={dialogChangeAddressAction}
            modal={false}
            open={this.state.openAddressDialog}
          >
            <div className="row" style={{maxHeight:'397px',overflow:'scroll'}}>
              {this.state.addressList}
            </div>
          </Dialog>
        </div>
        <div>
          <Dialog
            title="Add Billing List"
            actions={dialogAddBillingAction}
            modal={false}
            open={this.state.openBillingDialog}
            onRequestClose={this.dialogAddressClose}
          >
            <div>
              <TextField
                ref="billingCode"
                hintText="Code/Branch"
              /><label style={{'margin-left':'20px'}}> </label>
              <TextField
                ref="billingName"
                hintText="Name"
              /><br/>
              <TextField
                ref="billingAddr1"
                hintText="NO./Building/Village"
              /><label style={{'margin-left':'20px'}}> </label>
              <TextField
                ref="billingAddr2"
                hintText="Alley/Road"
              /><br/>
              <TextField
                ref="billingTambon"
                hintText="Tambon"
              /><label style={{'margin-left':'20px'}}> </label>
              <TextField
                ref="billingAmpher"
                hintText="Amphur"
              /><br/>
              <TextField
                ref="billingProvince"
                hintText="Province"
              /><label style={{'margin-left':'20px'}}> </label>
              <TextField
                ref="billingZipCode"
                hintText="Zipcode"
              /><br/>
              <TextField
                ref="billingTel"
                hintText="Tel"
              /><label style={{'margin-left':'20px'}}> </label>
            </div>
          </Dialog>
        </div>
        <div>
          <Dialog
            title="Warning"
            actions={dialogActions}
            modal={false}
            open={this.state.openDialog}
            onRequestClose={this.dialogOpen}
          >
            <p style={{'color': '#636363'}}>{this.state.dialogMessage}</p>
          </Dialog>
        </div>
        <div className="main-box" style={{width: '985px', height: '602px', backgroundColor: '#F5F5F5', overflow: 'scroll', padding: '10px'}}>
          <div className="row">
            <div className="columns" style={{
                backgroundColor: '#FFE',
                border: 'solid 1px lightgray',
                height:'38px',
                padding: '9px 15px 0px 15px',
                width: '957px'}}
                >
              <p style={{textAlign:'center',fontSize: '0.8em'}}>Welcome to One-X your GSM Logistics partner we offer you an easy online shipping solution.</p>
            </div>
          </div>
          <div className="row">
            <div className="columns" style={{
                height:'38px',
                padding: '9px 15px 0px 15px',
                width: '957px'}}
                >
              <p style={{textAlign:'center',fontSize: '1.0em'}}>Get a ouote and prepare a shipment</p>
            </div>
          </div>
          <div className="row1" style={{width:'957'}}>
            <div className="large-6 columns1" style={{border: 'solid 1px lightgray', backgroundColor:'#ffffff', width:'473px', float:'left'}}>
              <div className="row1" style={{width:'100%'}}>
                <div className="gps" style={{width:'8%',float: 'left',height:'72px'}}>
                </div>
                <div className="large-10 columns1" style={{width:'92%',height:'72px',float: 'left',padding:'20px 15px 0px 15px'}}>
                  <p>SENDER</p>
                  <SelectField
                      ref="fromText"
                      value={this.state.fromList.value}
                      onChange={this.handleChangeFromList}
                      style={{fontSize:'1.0em'}}
                      hintText="Sender"
                    >
                        {this.state.fromList.list}
                  </SelectField>
                </div>
              </div>
              <div className="row1" style={{width:'100%'}}>
                <div style={{width:'8%',float: 'left',height:'72px'}}>
                </div>
                <div className="large-10 columns1" style={{width:'92%',float: 'left',padding:'0px 15px'}}>
                  <TextField
                    ref="sender"
                    value={this.state.textField.senderValues}
                    style={{'width':'100%',fontSize:'1.0em'}}
                    floatingLabelText="Sender"
                    hintText="Sender"
                    multiLine={true}
                    rows={2}
                    onChange={this.handleChangeTextField.bind(this, "senderValues")}
                    onBlur={this.checkDisabledTo}
                  />
                </div>
              </div>
              <div className="row align-right1" style={{width:'100%'}}>
                <div style={{padding:'0px 15px 3px 0px',width:'250px',float: 'right'}}>
                    <FlatButton
                        label="Click here to change address"
                        style={{fontSize:'0.5em',float: 'right'}}
                        onMouseDown={this.changeAddress.bind(this, "sender")}
                    />
                </div>
              </div>
            </div>
            <div style={this.state.disabledTo==true?{border: 'solid 1px lightgray', backgroundColor:'#F5F5F5', width:'473px',float: 'right'}:{border: 'solid 1px lightgray', backgroundColor:'#ffffff', width:'473px',float: 'right'}}>
             <div style={{width:'100%'}}>
                <div className="gps" style={{width:'8%',float: 'left',height:'72px'}}>
                </div>
                <div className="large-10 columns1" style={{width:'92%',height:'72px',float: 'left',padding:'20px 15px 0px 15px'}}>
                  <p>RECIPIENT</p>
                  <SelectField
                      ref="toText"
                      value={this.state.toList.value}
                      onChange={this.handleChangeToList}
                      style={{fontSize:'1.0em'}}
                      hintText="Recipient"
                      disabled={this.state.disabledTo}
                    >
                        {this.state.toList.list}
                  </SelectField>
                </div>
              </div>
              <div>
                <div style={{width:'8%',float: 'left',height:'72px'}}>
                </div>
                <div style={{width:'92%',float: 'left',padding:'0px 15px'}}>
                  <TextField
                    ref="receipient"
                    value = {this.state.textField.receipientValues}
                    style={{'width':'100%',fontSize:'1.0em'}}
                    floatingLabelText="Recipient"
                    hintText="Recipient"
                    multiLine={true}
                    rows={4}
                    disabled={this.state.disabledTo}
                    onChange={this.handleChangeTextField.bind(this, "receipientValues")}
                    onBlur={this.checkDisabledPickUp}
                  />
                </div>
              </div>
              <div>
                <div style={{padding:'0px 15px 3px 0px',width:'250px',float: 'right'}}>
                    <FlatButton
                        label="Click here to change address"
                        style={{fontSize:'0.5em',float: 'right'}}
                        onMouseDown={this.changeAddress.bind(this, "receipient")}
                        disabled={this.state.disabledTo}
                    />
                </div>
              </div>
            </div>
          </div>

          <div style={{clear: 'both'}}></div>

          <div style={{marginTop:'5px',width:'957px'}}>
            <div style={this.state.disabledPickUp==true?{border: 'solid 1px lightgray', backgroundColor:'#F5F5F5', width:'473px', minHeight:'32px',float: 'left'}:{border: 'solid 1px lightgray', backgroundColor:'#ffffff', width:'473px', minHeight:'32px',float: 'left'}}>
              <div style={{backgroundColor:'#e2e2e2',width:'100%',height:'32px'}}>
                <div className="pickUpIcon" style={{width:'8%',height:'32px',float:'left'}}>
                </div>
                <div className="large-10 columns1" style={{width:'92%',height:'32px',float:'left',padding:'0px 15px'}}>
                  <p style={{paddingTop:'10px'}}>PICKUP PLACE</p>
                </div>
              </div>
              <div className="row1" style={{width:'100%'}}>
                <div style={{width:'8%',minHeight:'32px',float:'left'}}>
                </div>
                <div className="large-10 columns1" style={{width:'92%',float:'left',padding:'0px 15px'}}>
                  <TextField
                    value = {this.state.textField.picUpPlaceValues}
                    ref="picUpPlace"
                    style={{'width':'100%',fontSize:'1.0em'}}
                    floatingLabelText="Pickup Place"
                    hintText="Pickup Place"
                    multiLine={true}
                    rows={2}
                    onChange={this.handleChangeTextField.bind(this, "picUpPlaceValues")}
                    disabled={this.state.disabledPickUp}
                    onBlur={this.checkDisabledInvoice}
                  />
                </div>
              </div>
              <div className="row align-right1" style={{width:'100%'}}>
                <div className="column small-81" style={{padding:'0px 15px 3px 0px',width:'250px',float:'right'}}>
                    <FlatButton
                        label="Click here to change address"
                        style={{fontSize:'0.5em',float: 'right'}}
                        onMouseDown={this.changeAddress.bind(this, "picUpPlace")}
                        disabled={this.state.disabledPickUp}
                    />
                </div>
              </div>
            </div>
            <div className="large-6 columns1" style={this.state.disabledInvoice==true?{border: 'solid 1px lightgray', backgroundColor:'#F5F5F5', width:'473px', minHeight:'32px',float:'right'}:{border: 'solid 1px lightgray', backgroundColor:'#ffffff', width:'473px', minHeight:'32px',float:'right'}}>
              <div className="row" style={{backgroundColor:'#e2e2e2',width:'100%',height:'32px'}}>
                <div className="invoiceIcon" style={{width:'8%',float: 'left',height:'32px'}}>
                </div>
                <div className="large-10 columns1" style={{width:'92%',height:'32px',float:'left',padding:'0px 15px'}}>
                  <p style={{paddingTop:'10px'}}>INVOICE NAME</p>
                </div>
              </div>
              <div className="row1" style={{width:'100%'}}>
                <div style={{width:'8%',minHeight:'32px',float:'left'}}>
                </div>
                <div className="large-10 columns1" style={{width:'92%',float:'left',padding:'0px 15px'}}>
                  <TextField
                    value = {this.state.textField.invoiceNameValues}
                    ref="invoiceName"
                    style={{'width':'100%',fontSize:'1.0em'}}
                    floatingLabelText="Invoice Name"
                    hintText="Invoice Name"
                    multiLine={true}
                    rows={1}
                    onChange={this.handleChangeTextField.bind(this, "invoiceNameValues")}
                    disabled={this.state.disabledInvoice}
                    onBlur={this.checkDisabledDatePick}
                  />
                </div>
              </div>
              <div className="row align-right1" style={{width:'100%'}}>
                <div className="column small-81" style={{padding:'0px 15px 3px 0px',width:'250px',float:'right'}}>
                    <FlatButton
                        label="Click here to change address"
                        style={{fontSize:'0.5em',float: 'right'}}
                        onMouseDown={this.changeAddress.bind(this, "invoiceName")}
                        disabled={this.state.disabledInvoice}
                    />
                </div>
              </div>
            </div>
          </div>

          <div style={{clear: 'both'}}></div>

          <div style={this.state.disabledDatePick==true?{marginTop:'5px',border: 'solid 1px lightgray',backgroundColor:'#F5F5F5',width:'957px'}:{marginTop:'5px',border: 'solid 1px lightgray',backgroundColor:'#ffffff',width:'957px'}}>
            <div style={{width:'100%',float:'left',paddingTop:'11px',paddingLeft:'10px',paddingBottom:'11px',backgroundColor:'lightgray'}}>
                <p>Package & Shipment Detail</p>
            </div>
            <div style={{marginTop:'10px',width:'100%',float:'left'}}>
              <div style={{width:'50%',float:'left'}}>
                  <div className="dateIcon" style={{width:'8%',height:'32px',float:'left'}}>
                  </div>
                  <div className="large-10 columns2" style={{width:'92%',height:'32px',padding:'0px 15px',float:'left'}}>
                    <p style={{paddingTop:'10px'}}><b>Pickup Date</b></p>
                  </div>
              </div>
            </div>
            <div style={{marginTop:'10px',width:'100%',float:'left'}}>
              <div style={{width:'50%',float:'left'}}>
                <div style={{width:'8%',minHeight:'32px',float:'left'}}>
                </div>
                <div className="large-10 columns2" style={{width:'92%',padding:'0px 15px',float:'left'}}>
                  <DatePicker
                    ref="picUpDate"
                    hintText="Date"
                    mode="landscape"
                    formatDate={this.formatDate}
                    style={{fontSize:'1.0em'}}
                    disabled={this.state.disabledDatePick}
                    onChange={this.checkDisabledDlType}
                  />
                </div>
              </div>
            </div>

            <div style={{clear: 'both'}}></div>

            <div style={{width:'100%',float:'left'}}>
              <div style={{width:'473px', minHeight:'32px', float:'left',marginTop:'5px'}}>
                <div style={{width:'100%',float:'left'}}>
                  <div className="pickUpIcon" style={{width:'8%',height:'32px',float:'left'}}>
                  </div>
                  <div className="large-10 columns" style={{width:'92%',height:'32px',float:'left',padding:'0px 15px'}}>
                    <p style={{paddingTop:'10px'}}><b>Package Contents</b></p>
                  </div>
                </div>
                <div style={{width:'100%',float:'left'}}>
                  <div style={{width:'8%',float: 'left',minHeight:'32px'}}>
                  </div>
                  <div style={{width:'92%',float: 'left',padding:'0px 15px'}}>
                    <RadioButtonGroup ref="package" name="package" defaultSelected="Document" onChange={this.radioPackage}>
                      <RadioButton
                        value="Document"
                        label="Document"
                        style={styles.radioButton}
                      />
                      <RadioButton
                        value="Product"
                        label="Parcel"
                        style={styles.radioButton}
                      />
                    </RadioButtonGroup>
                  </div>
                  <div style={{width:'8%',float: 'left',minHeight:'32px'}}>
                  </div>
                  <div style={{width:'92%',float: 'left',padding:'0px 15px',minHeight:'98px',marginTop:'3px'}}>
                    <p>Product categories</p>
                    <SelectField
                      ref="packageList"
                      value={this.state.packageListValue.value}
                      onChange={this.handleChangepackageList}
                      disabled={this.state.packageListValue.isLock}
                      style={{fontSize:'1.0em'}}
                      hintText="Select Contents"
                    >
                        {this.state.packageListValue.list}
                    </SelectField>
                    <TextField
                      style={{'width':'100%',fontSize:'1.0em'}}
                      ref="content"
                      hintText="Content"
                    />
                  </div>
                </div>
              </div>

              <div style={{width:'473px', minHeight:'32px', float:'right',marginTop:'5px'}}>
                <div style={{width:'100%'}}>
                  <div className="boxIcon" style={{width:'8%',float: 'left',height:'32px'}}>
                  </div>
                  <div style={{width:'92%',height:'32px',float: 'left',padding:'0px 15px'}}>
                    <p style={{paddingTop:'10px'}}><b>Delivery type</b></p>
                  </div>
                </div>
                <div style={{width:'100%'}}>
                  <div style={{width:'8%',float: 'left',minHeight:'32px'}}>
                  </div>
                  <div style={{width:'92%',float: 'left',padding:'0px 15px'}}>
                    <SelectField
                      ref="rateType"
                      value={this.state.rateType.value}
                      onChange={this.handleChangeRateType}
                      hintText="Delivery type"
                      disabled={this.state.disabledDlType}
                    >
                        {this.state.rateType.list}
                    </SelectField >
                  </div>
                </div>
              </div>
            </div>

            <div style={{clear: 'both'}}></div>

            <div style={{marginTop:'15px',width:'957px'}}>
              <div style={{width:'100%',float: 'left'}}>
                <div className="kg" style={{width:'4%',float: 'left',height:'32px'}}>
                </div>
                <div style={{width:'96%',height:'32px',paddingLeft: '13px',float: 'left',padding:'0px 15px'}}>
                  <p style={{paddingTop:'10px'}}><b>Dimension</b></p>
                </div>
              </div>
              <div style={{paddingLeft: '35px',paddingRight: '150px',width:'100%',float: 'left'}}>
                <div style={{padding:'0px 15px',width:'134px',float: 'left'}}>
                  <TextField
                    ref="width"
                    style={{'width':'100%'}}
                    floatingLabelText="Width (cm.)"
                  />
                </div>
                <div style={{padding:'0px 15px',width:'134px',float: 'left'}}>
                  <TextField
                    ref="depth"
                    style={{'width':'100%'}}
                    floatingLabelText="Depth (cm.)"
                  />
                </div>
                <div style={{padding:'0px 15px',width:'134px',float: 'left'}}>
                  <TextField
                    ref="height"
                    style={{'width':'100%'}}
                    floatingLabelText="Height (cm.)"
                  />
                </div>
                <div style={{padding:'0px 15px',width:'134px',float: 'left'}}>
                  <TextField
                    ref="weight"
                    style={{'width':'100%'}}
                    floatingLabelText="Weight (kg.)"
                  />
                </div>
                <div style={{padding:'0px 15px',width:'134px',float: 'left'}}>
                  <TextField
                    ref="qty"
                    style={{'width':'100%'}}
                    floatingLabelText="QTY"
                  />
                </div>
                <div style={{padding:'25px 10px 0px 10px',width:'100px',float: 'right'}}>
                    <FloatingActionButton
                      mini={true}
                      secondary={true}
                      style={{marginRight: 20}}
                      onMouseDown={this.calContent}
                      >
                      <ContentAdd />
                    </FloatingActionButton>
                </div>
              </div>
            </div>


            <div style={{clear: 'both'}}></div>


            <div style={{marginTop:'15px',padding:'0px 15px',width:'100%',float: 'right'}}>
                <TextField
                    disabled={true}
                    hintText="Pricing"
                    style={{'width':'100%'}}
                 />
            </div>

            <div style={{clear: 'both'}}></div>

            <div style={{marginTop:'15px',padding:'0px 30px 0px 30px',width:'100%',float:'left'}}>
                <div style={this.state.checkDataTable > 0 ? {display:'block'} : {'display':'none'}}>
                  <Table
                    fixedHeader={this.state.fixedHeader}
                    fixedFooter={this.state.fixedFooter}
                    selectable={this.state.selectable}
                    multiSelectable={this.state.multiSelectable}
                    displaySelectAll={this.state.displaySelectAll}
                    onRowSelection={this._onRowSelection}
                    style={{marginBottom:'0px'}}
                  >

                    <TableHeader selectAllSelected={this.state.selectAllSelected}
                                adjustForCheckbox={this.state.hAdjustForCheckbox}
                                displaySelectAll={this.state.displayRowCheckbox}
                    >
                        <TableRow style={{'padding':'0px','height':'49px','border-bottom':'1px dotted #e2e2e2'}}>
                            <TableHeaderColumn style={{textAlign: 'left', 'width': '22%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>
                                <h4 style={{textAlign: 'left'}}>CONTENT</h4>
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>
                                <h4 style={{textAlign: 'center'}}>QTY</h4>
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>
                                <h4 style={{textAlign: 'center'}}>WIDTH</h4>
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>
                                <h4 style={{textAlign: 'center'}}>DEPTH</h4>
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>
                                <h4 style={{textAlign: 'center'}}>HEIGHT</h4>
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>
                                <h4 style={{textAlign: 'center'}}>WEIGHT</h4>
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{textAlign: 'right', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>
                                <h4 style={{textAlign: 'center'}}>AMOUNT</h4>
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{textAlign: 'center', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>
                                <h4 style={{textAlign: 'center'}}>CURRENTCY</h4>
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{'min-width':'103px', 'width': '8%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableHeaderColumn>
                        </TableRow>
                    </TableHeader>

                    <TableBody
                      deselectOnClickaway={this.state.deselectOnClickaway}
                      showRowHover={this.state.showRowHover}
                      stripedRows={this.state.stripedRows}
                      displayRowCheckbox={this.state.displayRowCheckbox}
                    >

                      {this.state.tableProductRow}

                    </TableBody>

                    <TableFooter
                      adjustForCheckbox={this.state.adjustForCheckbox}
                    >
                      <TableRow>
                        <TableRowColumn style={{textAlign: 'left','width': '22%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>Discount</TableRowColumn>
                        <TableRowColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{textAlign: 'right', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>-{helper.numberFormat(this.state.discount,2)}</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'center', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>{this.state.currencyCodeTemp}</TableRowColumn>
                        <TableRowColumn style={{'min-width':'103px', 'width': '8%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn style={{textAlign: 'left', 'width': '22%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>Surcharge</TableRowColumn>
                        <TableRowColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{textAlign: 'right', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>{helper.numberFormat(this.state.surCharge,2)}</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'center', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>{this.state.currencyCodeTemp}</TableRowColumn>
                        <TableRowColumn style={{'min-width':'103px', 'width': '8%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn style={{textAlign: 'left','width': '22%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>Total</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'right', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{textAlign: 'right', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{textAlign: 'right', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{textAlign: 'right', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{textAlign: 'right', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                        <TableRowColumn style={{textAlign: 'right', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>{helper.numberFormat(this.state.totalAmount,2)}</TableRowColumn>
                        <TableRowColumn style={{textAlign: 'center', 'width': '10%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}>{this.state.currencyCodeTemp}</TableRowColumn>
                        <TableRowColumn style={{'min-width':'103px', 'width': '8%','padding':'0px','padding-left':'3px','vertical-align':'middle'}}></TableRowColumn>
                      </TableRow>
                    </TableFooter>

                  </Table>
                </div>
            </div>

            <div style={{clear: 'both'}}></div>

            <div style={{marginTop:'15px',padding:'0px 15px',float:'left',width:'100%'}}>
                 <TextField
                    disabled={true}
                    hintText="Payment"
                    style={{'width':'100%'}}
                  />
            </div>

            <div style={{clear: 'both'}}></div>

            <div style={{marginTop:'15px',padding:'0px 15px',float:'left',width:'100%'}}>
                <RadioButtonGroup ref="paymentType" name="paymentType" defaultSelected={this.state.isPaymentType==true ? "credit" : "billing"}>
                <RadioButton
                    value="credit"
                    label="CREDIT CARD"
                    style={styles.radioButton}
                />
                <RadioButton
                    value="billing"
                    label="BILLING"
                    disabled={this.state.isPaymentType}
                    style={styles.radioButton}
                />
                </RadioButtonGroup>
            </div>

            <div style={{clear: 'both'}}></div>

            <div style={{marginTop:'15px',padding:'0px 15px',float:'left',width:'100%'}}>
                <div style={{width:'25px','float':'left'}}>
                <Checkbox
                    onCheck={this.agreeBox}
                    checked={this.state.enableNext}
                    style={styles.checkbox}
                />
                </div>
                <div style={{'float':'left','height': '24px','padding-top': '5px','margin-left': '7px'}}>
                I have read and agree to the <a href="http://www.w3schools.com">Terms & Condition</a>
                </div>
            </div>

            <div style={{clear: 'both'}}></div>

            <div style={{marginTop:'15px',padding:'0px 15px',float:'left',width:'100%'}}>
              <div style={{marginBottom:'30px',width:'100px',float:'right'}}>
                  <RaisedButton
                  label="Next"
                  onMouseDown={this.saveBooking}
                  primary={true}
                  style={styles.RaisedButtonNextStyle}
                  disabled={this.state.disabledDatePick}
                  />
              </div>
            </div>

            <div style={{clear: 'both'}}></div>

          </div>

        </div>
      </div>
    );
  }
});

module.exports = LoadFareScreen;
