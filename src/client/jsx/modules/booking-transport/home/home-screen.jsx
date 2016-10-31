var React       = require('react');
import TextField from 'material-ui/lib/text-field';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import Checkbox from 'material-ui/lib/checkbox';
import ActionFavorite from 'material-ui/lib/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/lib/svg-icons/action/favorite-border';
import RaisedButton from 'material-ui/lib/raised-button';
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
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

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

var passMonth = [];
passMonth.push(
  <MenuItem value="1" key="1" primaryText="Past 1 Month" />,
  <MenuItem value="3" key="3" primaryText="Past 3 Month" />,
  <MenuItem value="6" key="6" primaryText="Past 6 Month" />,
  <MenuItem value="7" key="7" primaryText="Over 6 Month" />
);

var dialogReset = {
    booking_date:"2016-04-11 13:12:16",
    booking_name:"Notebook,Smart Phone",
    booking_no:"16040062",
    from_place:"Bang Bon",
    id:162,
    package_contents:"",
    pickup_place:"",
    receipient:"",
    sender:"",
    to_place:"",
    waybill:"",
    senderName:"",
    toName:"",
    senderAddr:"",
    toAddr:"",
    name:"",
    invoice_addr:"",
    shipment:"",
    barcode:"",
    invoice:"",
    discount:"",
    total_amount:"",
    charge_amount:"",
    currency:"",
    status:""
};

var resetData = {
    additionDetail:'',
    additionAmount:'',
    additionRemark:'',
    email:'',
    booking_id:0
};

const customContentStyle = {
  width: '70%',
  maxWidth: 'none',
};

const tabStyles = {
  headline: {
    fontSize: 24,
    paddingTop: 3,
    marginBottom: 5,
    fontWeight: 400,
  },
};

var textFieldsNonHr = {
    height:"25px",
    width:"100%",
    border:"1px solid lightgray",
    borderRadius:'4px',
    padding:"0px 3px 0px 3px",
    fontSize:'14px'
};

const hideStyles = {
  errorStyle: {
    bottom:'0px',
    fontSize:'14px',
    color: 'red',
  },
  okStyle: {
    bottom:'0px',
    fontSize:'14px'
  },
};

const tdStyle = {
  backgroundColor: "#FFFFFF",
  padding: "0px"
}

const tBodyStyle = {
  border: "0px"
}

var LoadHomeScreen = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins:[
    ReFlux.listenTo(actions.getAllBooking.done,'onAllBookingDoneAction'),
    ReFlux.listenTo(actions.getAllBooking.error,'onAllBookingErrorAction'),
    ReFlux.listenTo(actions.getCityList.done,'onGetCityListDoneAction'),
    ReFlux.listenTo(actions.getCityList.error,'onGetCityListErrorAction'),
    ReFlux.listenTo(actions.getDialogData.done,'onGetDialogDataDoneAction'),
    ReFlux.listenTo(actions.getDialogData.error,'onGetDialogDataDoneError'),
    ReFlux.listenTo(actions.getDialogDetailList.done,'onGetDialogDetailListDoneAction'),
    ReFlux.listenTo(actions.getDialogDetailList.error,'onGetDialogDetailListErrorAction'),
    ReFlux.listenTo(actions.getDialogItemList.done,'onGetDialogItemListDoneAction'),
    ReFlux.listenTo(actions.getDialogItemList.error,'onGetDialogItemListErrorAction'),
    ReFlux.listenTo(actions.sentDocToEmail.done,'onSentDocToEmailDoneAction'),
    ReFlux.listenTo(actions.sentDocToEmail.error,'onSentDocToEmailErrorAction'),
    ReFlux.listenTo(actions.exportExl.done,'onExportExlDoneAction'),
    ReFlux.listenTo(actions.exportExl.error,'onExportExlErrorAction')
  ],
  getInitialState:function() {
    var customer = system.sessionStore.getSession().staff;
    console.log("customer = ",customer);
    return {
      displayName: customer.displayname,
      person_id: customer.id,
      valuePassMonth: "1",
      valudFromPlace: "all",
      fromPlace:[],
      valueToPlace:"all",
      toPlace:[],
      inprocessBoxData: "",
      intransitBoxData: "",
      arrivedBoxData: "",
      deliveriedBoxData: "",
      exceptionBoxData: "",
      cancelBoxData: "",
      bookingList:helper.clone(dialogReset),
      data:helper.clone(resetData),
      detailRow:'',
      itemRow:'',
      dialogOpen: false,
      selectFieldStyle:{
        width:"220px",
        borderRadius:"5px",
        border:"1px solid lightgray",
        fontSize:"14px",
        height:"30px",
        padding:"0px 3px 0px 10px"
      },
      selectFieldLabelStyle:{
        height:"30px",
        lineHeight:"30px",
        paddingTop:"3px"
      },
      selectFieldIconStyle:{
        height:"30px",
        top:"0px"
      },
      buttonStyle:{
        height:"30px",
        fontSize:"14px",
        borderRadius:"5px"
      },
      orengeStyle:{
        width:"158px",
        float:"left",
        minHeight:"500px",
        padding:"0px 0px 0px 6px",
        // border:"1px solid lightgray",
        backgroundColor:"#fcb24c"
      },
      greenStyle:{
        width:"158px",
        float:"left",
        minHeight:"500px",
        padding:"0px 0px 0px 6px",
        // border:"1px solid lightgray",
        backgroundColor:"#adbe7e"
      },
      tdOrengeStyle:{
        backgroundColor:"#fcb24c",
        padding:"0px",
        verticalAlign: "top"
      },
      tdGreenStyle:{
        backgroundColor:"#adbe7e",
        padding:"0px",
        verticalAlign: "top"
      },
      iconHeadStyle:{
        width:"145px",
        float:"left",
        height:"85px",
        padding:"3px 3px 3px 3px",
        borderBottom:"3px solid #FFFFFF"
      },
      boxInside:{
        width:"145px",
        float:"left",
        height:"65px",
        padding:"3px",
        borderBottom:"1px solid #FFFFFF"
        // border:"1px solid lightgray"
      }
    }
  },

  componentDidMount: function() {
    actions.getAllBooking({person_id:this.state.person_id,passMonth:this.state.valuePassMonth, valudFromPlace:this.state.valudFromPlace, valueToPlace:this.state.valueToPlace});
    actions.getCityList({person_id:this.state.person_id});
    // this.mapReceipient();
    // this.mapInprocessBox();
  },

  setDetailRow:function(dataTable){
    //console.log(dataTable);
    return dataTable.map(function(row, index){
      return (
        <tr>
            <td style={{padding:"0px", backgroundColor:"#ffffff", borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}>
              <div style={{margin:"3px 0px 3px 0px"}} dangerouslySetInnerHTML={{__html:row.booking_name}}/>
            </td>
            <td style={{padding:"0px", backgroundColor:"#ffffff", textAlign:"right",borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{helper.numberFormat(row.total_price,2)}</span></td>
            <td style={{padding:"0px", backgroundColor:"#ffffff", textAlign:"right",borderBottom:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{this.state.bookingList.currency}</span></td>
        </tr>
        )
    }.bind(this));
  },

  setItemRow:function(dataTable){
    return dataTable.map(function(row, index){
      return (
        <tr>
            <td style={{padding:'0px', textAlign:"center"}}><span style={{lineHeight: "21px"}}>{index+1}.</span></td>
            <td style={{padding:'0px', textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.barcode}</span></td>
            <td style={{padding:'0px', textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.status}</span></td>
            <td style={{padding:'0px', textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.pickup_date}</span></td>
            <td style={{padding:'0px', textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.accepted_origin_date}</span></td>
            <td style={{padding:'0px', textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.accepted_destination_date}</span></td>
            <td style={{padding:'0px', textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.deliveried_date}</span></td>
        </tr>
        )
    }.bind(this));
  },

  mapHtml:function(data){
    console.log("data = ", data);
    return data.map(function(row, index){
      var index_of_tel = row.receipient.indexOf("Tel:");
      var tel = row.receipient.substring(index_of_tel);
      var first_sd = row.receipient.indexOf("\n");
      var name = row.receipient.substring(0,first_sd);
      if(row.package_contents_type == 'Document'){
        return (<div style={this.state.boxInside} onClick={this.openDetail.bind(this, row.id)}>
                  <img src="/img/Mail-Send.png" alt="Mail" width="25" height="25" />
                  <label style={{color:"#FFFFFF"}}>&nbsp; {row.date_i}</label>
                  <p style={{color:"#FFFFFF",fontSize:"9px"}}>{name}</p>
                  <p style={{color:"#FFFFFF",fontSize:"9px"}}>{tel}</p>
                </div>)
      }else {
        return (<div style={this.state.boxInside} onClick={this.openDetail.bind(this, row.id)}>
                  <img src="/img/package.png" alt="Parcel" width="25" height="25" />
                  <label style={{color:"#FFFFFF"}}>&nbsp; {row.date_i}</label>
                  <p style={{color:"#FFFFFF",fontSize:"9px"}}>{name}</p>
                  <p style={{color:"#FFFFFF",fontSize:"9px"}}>{tel}</p>
                </div>)
      }
    }.bind(this));
  },

  onGetCityListDoneAction: function(res){
    var fromPlace = [];
    fromPlace.push(
      <MenuItem value="all" key="0" primaryText="From place" />
    );
    for (var i = 0; i < res.from_place.length; i++) {
      fromPlace.push(
        <MenuItem value={res.from_place[i].from_place} key={i+1} primaryText={res.from_place[i].from_place} />
      );
    }

    var toPlace = [];
    toPlace.push(
      <MenuItem value="all" key="0" primaryText="To place" />
    );
    for (var i = 0; i < res.to_place.length; i++) {
      toPlace.push(
        <MenuItem value={res.to_place[i].to_place} key={i+1} primaryText={res.to_place[i].to_place} />
      );
    }

    this.setState({
      fromPlace: fromPlace,
      toPlace: toPlace
    })
  },

  onAllBookingDoneAction: function(res){
    console.log("onAllBookingDoneAction = ", res);
    this.setState({
      inprocessBoxData: this.mapHtml(res.inproocess),
      intransitBoxData: this.mapHtml(res.intransit),
      arrivedBoxData: this.mapHtml(res.arrived),
      deliveriedBoxData: this.mapHtml(res.deliveried),
      exceptionBoxData: this.mapHtml(res.exception),
      cancelBoxData: this.mapHtml(res.cancel)
    });
  },

  onAllBookingErrorAction: function(error) {
    console.log("error = ", error);
    toasterActions.pop({
      type:'warning',
      message:"Can't get data."
    });
  },

  openDetail: function(booking_id){
    console.log("booking_id = ", booking_id);
    // console.log(bookingId);
    actions.getDialogData(booking_id);
  },

  onGetDialogDataDoneAction: function(res) {
      console.log("My Dialog data = ",res.booking_data[0]);
      var bData = res.booking_data[0];
      //console.log("senderNameNum = ",senderNameNum,senderStr);
      bData.senderName = bData.sender.substring(0, bData.sender.indexOf('. '));
      bData.toName = bData.receipient.substring(0, bData.receipient.indexOf('. '));

      //var res = str.replace("Microsoft", "W3Schools");
      var a = bData.sender.substring(bData.sender.indexOf('. ')+2);
      var b = bData.receipient.substring(bData.receipient.indexOf('. ')+2);
      //this.state.bookingList = bData;
      bData.senderAddr = a.replace('. ',' ');
      bData.toAddr = b.replace('. ',' ');
      bData.shipment = "/output/shipment_"+bData.id+".pdf";
      bData.barcode = "/output/barcode_"+bData.id+".pdf";
      bData.invoice = "/output/invoice_"+bData.id+".pdf";
      this.setState({
          bookingList:bData
      })
      console.log("This state ",this.state.bookingList);
      actions.getDialogDetailList(bData.id);
  },

  onGetDialogDetailListDoneAction: function(data){
  //  console.log("List Detail = ",data);
    this.setState({
      detailRow: this.setDetailRow(data)
    });
    actions.getDialogItemList(this.state.bookingList.id);
  },

  onGetDialogItemListDoneAction: function(data){
    console.log("List Item = ", data);
    this.setState({
      itemRow: this.setItemRow(data)
    });
    this.setState({dialogOpen: true});
  },

  changePassMonth: function(event, index, value){
    console.log("event = ",event);
    console.log("index = ", index);
    console.log("value = ", value);
    this.setState({
      valuePassMonth: value
    });
    actions.getAllBooking({person_id:this.state.person_id,passMonth:value, valudFromPlace:this.state.valudFromPlace, valueToPlace:this.state.valueToPlace});
  },
  changeFrom: function(event, index, value){
    console.log("event = ",event);
    console.log("index = ", index);
    console.log("value = ", value);
    this.setState({
      valudFromPlace: value
    });
    actions.getAllBooking({person_id:this.state.person_id,passMonth:this.state.valuePassMonth, valudFromPlace:value, valueToPlace:this.state.valueToPlace});
  },
  changeReceipient: function(event, index, value){
    console.log("event = ",event);
    console.log("index = ", index);
    console.log("value = ", value);
    this.setState({
      valueToPlace: value
    });
    actions.getAllBooking({person_id:this.state.person_id,passMonth:this.state.valuePassMonth, valudFromPlace:this.state.valudFromPlace, valueToPlace:value});
  },

  handleChangeTab: function(value) {
    //   console.log("xxccc = ", value);
    this.setState({
      tabValue: value,
    });
  },

  dialogBookingClose: function() {
    this.setState({dialogOpen: false});
  },

  handleChangeFlaxTextInput:function(event){
    // console.log(event);
    this.state.data[event.target.id] = event.target.value;
    this.setState({
        data: this.state.data
    });
    // console.log("This Data = ", this.state.data);
  },

  sentDocToEmail: function(){
    var docData = {
      email: this.state.data.email,
      booking_id: this.state.bookingList.id
    };
    actions.sentDocToEmail(docData);
  },

  onSentDocToEmailDoneAction: function(data){
    toasterActions.pop({
      type:'success',
      message:data.rs
    });
  },
  onSentDocToEmailErrorAction: function(data){
    toasterActions.pop({
      type:'warning',
      message:"Can't sent Email " + data.errors
    });
  },

  exportExl: function(){
    console.log("export");
    // actions.getAllBooking("ddd");
    actions.exportExl({person_id:this.state.person_id,passMonth:this.state.valuePassMonth, valudFromPlace:this.state.valudFromPlace, valueToPlace:this.state.valueToPlace});
  },

  onExportExlDoneAction: function(file) {
    console.log("Export complete = ", file);
    window.open(file, '_blank');
  },

  onExportExlErrorAction: function(error) {
    console.log("Export not complete = ", error);
  },

  render: function() {
    var actions = [
      <RaisedButton
        label="OK"
        primary={true}
        onTouchTap={this.dialogBookingClose}
      />,
    ];

    return (
      <div>
        <div className="main-box" style={{width: '985px', minHeight: '602px', padding: '10px', margin:'auto', overflow:"auto"}}>
          <h3 style={{marginLeft:"15px"}}>Welcome {this.state.displayName}</h3><br/>
          <div>
            <div style={{float:"left",marginLeft:"12px"}}><img src="/img/building.png" alt="building" width="30" height="30" /></div>
            <div style={{float:"left", marginLeft:"5px"}}><h2> Tracking</h2></div>
          </div>
          <div id="filter-box" style={{width:"965px", float:"left", marginTop:"13px", height:"36px", paddingLeft:"12px"}}>
            <div style={{float:"left", margin:"3px 8px 3px 3px", paddingTop:"7px"}}><p>Filter</p></div>
            <div style={{float:"left", margin:"3px", width:"220px"}}>
              <SelectField maxHeight={300} value={this.state.valuePassMonth} onChange={this.changePassMonth}
                underlineStyle={{visibility: "hidden"}}
                labelStyle={this.state.selectFieldLabelStyle}
                iconStyle={this.state.selectFieldIconStyle}
                style={this.state.selectFieldStyle}
              >
                {passMonth}
              </SelectField>
            </div>
            <div style={{float:"left", margin:"3px", width:"220px"}}>
              <SelectField maxHeight={300} value={this.state.valudFromPlace} onChange={this.changeFrom}
                underlineStyle={{visibility: "hidden"}}
                labelStyle={this.state.selectFieldLabelStyle}
                iconStyle={this.state.selectFieldIconStyle}
                style={this.state.selectFieldStyle}
              >
                {this.state.fromPlace}
              </SelectField>
            </div>
            <div style={{float:"left", margin:"3px", width:"220px"}}>
              <SelectField maxHeight={300} value={this.state.valueToPlace} onChange={this.changeReceipient}
                underlineStyle={{visibility: "hidden"}}
                labelStyle={this.state.selectFieldLabelStyle}
                iconStyle={this.state.selectFieldIconStyle}
                style={this.state.selectFieldStyle}
              >
                {this.state.toPlace}
              </SelectField>
            </div>
            <div style={{float:"left", margin:"3px 3px 3px 9px", width:"220px"}}>
              <RaisedButton
                label="Export XLS"
                style={this.state.buttonStyle}
                fullWidth={true}
                backgroundColor="#adbe7e"
                labelColor="#ffffff"
                onMouseDown={this.exportExl}
              />
            </div>
          </div>
          <div id="status-list-box" style={{width:"970px", float:"left", marginTop:"13px", minHeight:"500px", paddingLeft:"12px", overflow:"auto"}}>
            <table style={{width: "950px"}}>
              <tbody>
                <tr>
                  <td style={this.state.tdOrengeStyle}>
                    <div class="orenge" style={this.state.orengeStyle}>
                      <div style={this.state.iconHeadStyle}>
                        <div style={{paddingLeft:"40px"}}>
                          <img src="/img/set5.png" alt="Inprocess" width="60" height="60" />
                        </div>
                        <p style={{color:"#ffffff",textAlign:"center"}}>Booked</p>
                      </div>
                      {this.state.inprocessBoxData}
                    </div>
                  </td>
                  <td style={this.state.tdGreenStyle}>
                    <div class="green" style={this.state.greenStyle}>
                      <div style={this.state.iconHeadStyle}>
                        <div style={{paddingLeft:"40px"}}>
                          <img src="/img/car147.png" alt="Intransit" width="60" height="60" />
                        </div>
                        <p style={{color:"#ffffff",textAlign:"center"}}>In transit</p>
                      </div>
                      {this.state.intransitBoxData}
                    </div>
                  </td>
                  <td style={this.state.tdOrengeStyle}>
                    <div class="orenge" style={this.state.orengeStyle}>
                      <div style={this.state.iconHeadStyle}>
                        <div style={{paddingLeft:"40px"}}>
                          <img src="/img/automatic3.png" alt="Arrived" width="60" height="60" />
                        </div>
                        <p style={{color:"#ffffff",textAlign:"center"}}>Arrived at destination</p>
                      </div>
                      {this.state.arrivedBoxData}
                    </div>
                  </td>
                  <td style={this.state.tdGreenStyle}>
                    <div class="green" style={this.state.greenStyle}>
                      <div style={this.state.iconHeadStyle}>
                        <div style={{paddingLeft:"40px"}}>
                          <img src="/img/briefcase50.png" alt="Delivery" width="60" height="60" />
                        </div>
                        <p style={{color:"#ffffff",textAlign:"center"}}>Delivered</p>
                      </div>
                      {this.state.deliveriedBoxData}
                    </div>
                  </td>
                  <td style={this.state.tdOrengeStyle}>
                    <div class="orenge" style={this.state.orengeStyle}>
                      <div style={this.state.iconHeadStyle}>
                        <div style={{paddingLeft:"40px"}}>
                          <img src="/img/problems.png" alt="Exception" width="60" height="60" />
                        </div>
                        <p style={{color:"#ffffff",textAlign:"center"}}>Exception</p>
                      </div>
                      {this.state.exceptionBoxData}
                    </div>
                  </td>
                  <td style={this.state.tdGreenStyle}>
                    <div class="green" style={this.state.greenStyle}>
                      <div style={this.state.iconHeadStyle}>
                        <div style={{paddingLeft:"40px"}}>
                          <img src="/img/cancel19.png" alt="Cancel" width="60" height="60" />
                        </div>
                        <p style={{color:"#ffffff",textAlign:"center"}}>Cancelled</p>
                      </div>
                      {this.state.cancelBoxData}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Dialog
          actions={actions}
          modal={true}
          contentStyle={customContentStyle}
          open={this.state.dialogOpen}
        >
            <div className="1boxindialog" style={{width:'908px',height:'400px',overflow:'scroll'}}>
                <div className="headBox" style={{width:'895px',height:'160px',border:'1px solid black',borderRadius:'5px',position:'relative'}}>
                    <div className="leftBox" style={{width:'370px',height:'160px',borderRight:'solid 1px black',float:'left'}}>
                        <div style={{width:'130px',height:'120px',float:'left',paddingTop:'8px',paddingLeft:'11px'}}>
                            <img src="/img/icon_staff.png" alt="staff_icon" height="100px" width="100px" />
                        </div>
                        <table style={{height: '120px', width: '237px',float:'left',marginBottom:"0px"}}>
                            <tbody style={tBodyStyle}>
                                <tr>
                                    <td style={tdStyle}>Booking No.: {this.state.bookingList.booking_no}</td>
                                </tr>
                                <tr>
                                    <td style={tdStyle}>Waybill No.: {this.state.bookingList.waybill}</td>
                                </tr>
                                <tr>
                                    <td style={tdStyle}>Booking date: {this.state.bookingList.booking_date}</td>
                                </tr>
                                <tr>
                                    <td style={tdStyle}><b>{this.state.bookingList.name}</b></td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{clear:'both'}}></div>
                        <div style={{width:'368px',height:'36px',float:'left'}}>
                            <table style={{height: '35px', width: '367px',marginBottom:"0px"}}>
                                <tbody style={tBodyStyle}>
                                    <tr>
                                        <td style={{textAlign:'center', padding:'0px'}}><strong>{this.state.bookingList.status}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="leftBox" style={{width:'520px',height:'160px',float:'left'}}>
                        <div style={{width:'100%',height:'50%',float:'left',borderBottom:'1px solid black'}}>
                            <div style={{width:'16%',height:'100%',float:'left',padding:'16px 0px 0px 3px'}}>
                                <img src="/img/TruckBlack.png" alt="staff_icon" height="45px" width="70px" />
                            </div>
                            <div style={{width:'84%',height:'100%',float:'left'}}>
                                <table style={{height: '70px',width: '430px',marginBottom:"0px"}}>
                                    <tbody style={tBodyStyle}>
                                        <tr>
                                            <td style={tdStyle}><strong>From : {this.state.bookingList.from_place}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style={tdStyle}>{this.state.bookingList.senderName}</td>
                                        </tr>
                                        <tr>
                                            <td style={tdStyle}>{this.state.bookingList.senderAddr}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style={{clear:'both'}}></div>
                        <div style={{width:'100%',height:'50%',float:'left'}}>
                            <div style={{width:'16%',height:'100%',float:'left',padding:'5px 0px 0px 15px'}}>
                                <img src="/img/delivery.png" alt="delivery_icon" height="60px" width="58px" />
                            </div>
                            <div style={{width:'84%',height:'100%',float:'left'}}>
                                <table style={{height: '70px',width: '430px',marginBottom:"0px"}}>
                                    <tbody style={tBodyStyle}>
                                        <tr>
                                            <td style={tdStyle}><strong>To : {this.state.bookingList.to_place}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style={tdStyle}>{this.state.bookingList.toName}</td>
                                        </tr>
                                        <tr>
                                            <td style={tdStyle}>{this.state.bookingList.toAddr}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{clear:'both'}}></div>
                <div className="TabBox" style={{width:'895px',minHeight:'227px',border:'1px solid black',borderRadius:'5px',position:'relative',marginTop:'3px'}}>
                    <Tabs
                        value={this.state.tabValue}
                    >
                        <Tab label="Service" value="service" id="service" onClick={this.handleChangeTab.bind(this, "service")} style={{height:'30px'}}>
                        <div>
                            <div style={{width:"365px",height:"25px",border:'1px solid black',borderRadius:'3px',margin:'5px 0px 0px 5px',paddingLeft:'3px',backgroundColor:'lightgray'}}>
                                <p>Package content: {this.state.bookingList.booking_name}</p>
                            </div>
                            <div style={{width:"882px",height:"25px",border:'1px solid black',borderRadius:'3px',margin:'5px 0px 0px 5px',paddingLeft:'3px',backgroundColor:'lightgray'}}>
                                <p>{this.state.bookingList.package_contents}</p>
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <table style={{width: "888px",marginLeft:"2px",marginBottom:"0px"}}>
                                    <thead style={{borderBottom:'2px solid lightgray'}}>
                                        <tr>
                                            <th scope="col" style={tdStyle}>NO.</th>
                                            <th scope="col" style={tdStyle}>Barcode</th>
                                            <th scope="col" style={tdStyle}>Status</th>
                                            <th scope="col" style={tdStyle}>Pickup date</th>
                                            <th scope="col" style={tdStyle}>Delivery date</th>
                                            <th scope="col" style={tdStyle}>Receipt date</th>
                                            <th scope="col" style={tdStyle}>Accepted date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.itemRow}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </Tab>
                        <Tab label="Package & Billing" value="package" id="package" onClick={this.handleChangeTab.bind(this, "package")} style={{height:'30px'}}>
                        <div>
                            <div style={{width:"888px",minHeight:"150px",paddingTop:"5px"}}>
                                <div style={{width:"60%",minHeight:"150px",float:"left",padding:"0px 8px 1px 8px",borderRight:"1px solid black"}}>
                                    <table style={{width: "510px",marginBottom:"0px"}}>
                                        <thead style={{borderBottom:'2px solid lightgray'}}>
                                            <tr>
                                                <th style={{padding:"0px", width: "60%",textAlign:"left",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingLeft: "3px"}}>Description</span></th>
                                                <th style={{padding:"0px", width: "20%",textAlign:"center",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px"}}>Amount</span></th>
                                                <th style={{padding:"0px", width: "20%",textAlign:"center"}}><span style={{lineHeight: "25px"}}>Currency</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.detailRow}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td style={{padding:'0px', borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingLeft: "3px"}}>Discount</span></td>
                                                <td style={{padding:'0px', textAlign:"right",borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{helper.numberFormat(this.state.bookingList.discount,2)}</span></td>
                                                <td style={{padding:'0px', textAlign:"right",borderBottom:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{this.state.bookingList.currency}</span></td>
                                            </tr>
                                            <tr>
                                                <td style={{padding:'0px', borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingLeft: "3px"}}>Surcharge</span></td>
                                                <td style={{padding:'0px', textAlign:"right",borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{helper.numberFormat(this.state.bookingList.charge_amount,2)}</span></td>
                                                <td style={{padding:'0px', textAlign:"right",borderBottom:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{this.state.bookingList.currency}</span></td>
                                            </tr>
                                        </tfoot>
                                    </table><br/>
                                    <div style={{width: "510px",height:"25px",border:'1px solid lightgray',borderRadius:'3px',paddingLeft:'3px',backgroundColor:'#e2e2e2'}}>
                                        <table style={{width: "100%",marginBottom:"0px"}}>
                                            <thead style={{border: "0px",backgroundColor:"transparent"}}>
                                                <tr>
                                                    <th style={{padding:"0px", width: "60%",textAlign:"left"}}><span style={{lineHeight: "25px",paddingLeft: "3px"}}>Total amount</span></th>
                                                    <th style={{padding:"0px", width: "20%",textAlign:"right"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{helper.numberFormat(this.state.bookingList.total_amount,2)}</span></th>
                                                    <th style={{padding:"0px", width: "20%",textAlign:"right"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{this.state.bookingList.currency}</span></th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                                <div style={{width:"40%",minHeight:"150px",float:"left",padding:"0px 8px 1px 8px"}}>
                                    <div style={{width:'100%'}}>
                                        <p><b></b></p><br/>
                                    </div>
                                    <div style={{width:'100%',marginTop:"3px"}}>
                                    </div>
                                    <div style={{width:'100%',marginTop:"3px"}}>
                                    </div>
                                    <div style={{width:'100%',marginTop:"5px"}}>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div style={{clear:'both'}}></div>
                            <div style={{width:"888px",minHeight:"60px",marginTop:"10px"}}>
                                <p style={{marginLeft: "8px"}}><b>Invoice name & address</b></p>
                                <div style={{width:"59%",minHeight:"60px",float:"left",margin:"0px 8px 5px 8px",border:"1px solid lightgray",backgroundColor:"#e2e2e2",borderRadius:"3px",padding:"3px"}}>
                                    <p style={{padding:"0px 8px 0px 8px"}}><span style={{lineHeight: "21px"}}><div dangerouslySetInnerHTML={{__html:this.state.bookingList.invoice_addr}}/></span></p>
                                </div>
                            </div>
                        </div>
                        </Tab>
                        <Tab label="Document" value="document" id="document" onClick={this.handleChangeTab.bind(this, "document")} style={{height:'30px'}}>
                        <div>
                            <div style={{width:"888px",minHeight:"150px",marginTop:"10px"}}>
                                <div style={{width:"50%",minHeight:"107px",float:"left",margin:"0px 8px 5px 8px",borderRight:"1px solid black"}}>
                                    <p><b>Print document</b></p>
                                    <div style={{marginLeft: "8px"}}>
                                        <a href={this.state.bookingList.shipment} target="_blank"><img src="/img/PDF-icon.png" alt="Smiley face" width="23" height="23" />Print shipment waybill</a>
                                    </div>
                                    <div style={{marginLeft: "8px",marginTop: "3px"}}>
                                        <a href={this.state.bookingList.barcode} target="_blank"><img src="/img/PDF-icon.png" alt="Smiley face" width="23" height="23" />Print shipment label</a>
                                    </div>
                                    <div style={{marginLeft: "8px",marginTop: "3px"}}>
                                        <a href={this.state.bookingList.invoice} target="_blank"><img src="/img/PDF-icon.png" alt="Smiley face" width="23" height="23" />Print proforma invoice / temporary receipt</a>
                                    </div>
                                </div>

                                <div style={{width:"45%",minHeight:"100px",float:"left",margin:"0px 8px 5px 8px"}}>
                                    <p><b>Send document via Email (all document)</b></p>
                                    <div style={{marginLeft: "8px",width:'100%',marginTop:"3px"}}>
                                        <TextField
                                            id="email"
                                            ref="email"
                                            underlineShow={false}
                                            style={{height:"25px",
                                                    width:"300px",
                                                    border:"1px solid lightgray",
                                                    borderRadius:'4px',
                                                    padding:"0px 3px 0px 3px",
                                                    fontSize:'14px'}}
                                            onChange={this.handleChangeFlaxTextInput}
                                            hintText="Email"
                                            hintStyle={{bottom:'0px',fontSize:'14px'}}
                                         />
                                         <RaisedButton
                                            label="sent"
                                            secondary={true}
                                            style={{height:"24px",fontSize:"12px",float:"right"}}
                                            onClick={this.sentDocToEmail}
                                         />
                                    </div>
                                </div>
                            </div>
                        </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </Dialog>
      </div>
    );
  }
});
module.exports = LoadHomeScreen;
