var React     = require('react');
var Router    = require('react-router');
var Link      = Router.Link;
var T         = require('react-translate-component');
var tr        = require('counterpart');

var system    = require('ss-system');
var widgets   = require('ss-widget');
var toasterActions = system.toasterActions;
var helper    = system.helper;
var systemActions = system.systemActions;
var dialogActions     = system.dialogActions;
var storage   = system.storage;
var systemStore = system.systemStore;
//var storageKey = 'transport.bookingList.listWaitAssign';
var infoPanelActions = system.infoPanelActions;
var actions = require('./actions');

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
var FlexTextInput = widgets.FlexTextInput;
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import TextField from 'material-ui/lib/text-field';

//var customerAction = require('./actions');
var bookingListActions = require('./actions');
var ReFlux    = require('reflux');

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

var CustomerList = React.createClass({
  contextTypes: {
      router: React.PropTypes.func
    },
  mixins:[
    ReFlux.listenTo(bookingListActions.cancelBooking.done,'onCancelBookingDoneAction'),
    ReFlux.listenTo(bookingListActions.cancelBooking.error,'onCancelBookingErrorAction'),
    ReFlux.listenTo(bookingListActions.changeStatusBooking.done,'onChangeStatusBookingDoneAction'),
    ReFlux.listenTo(bookingListActions.changeStatusBooking.error,'onChangeStatusBookingErrorAction'),
    ReFlux.listenTo(bookingListActions.getDialogData.done,'onGetDialogDataDoneAction'),
    ReFlux.listenTo(bookingListActions.getDialogData.error,'onGetDialogDataDoneError'),
    ReFlux.listenTo(bookingListActions.getDialogDetailList.done,'onGetDialogDetailListDoneAction'),
    ReFlux.listenTo(bookingListActions.getDialogItemList.done,'onGetDialogItemListDoneAction'),
    ReFlux.listenTo(bookingListActions.getDialogItemList.error,'onGetDialogItemListErrorAction'),
    ReFlux.listenTo(bookingListActions.getDialogDetailList.error,'onGetDialogDetailListErrorAction'),
    ReFlux.listenTo(bookingListActions.saveAddition.done,'onSaveAdditionDoneAction'),
    ReFlux.listenTo(bookingListActions.saveAddition.error,'onSaveAdditionErrorAction'),
    ReFlux.listenTo(bookingListActions.sentDocToEmail.done,'onSentDocToEmailDoneAction'),
    ReFlux.listenTo(bookingListActions.sentDocToEmail.error,'onSentDocToEmailErrorAction')
  ],
  getInitialState: function() {
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
      data:helper.clone(resetData),
      checkAmount: false,
      amountFalse: "Amount",
      amountTrue: "This field is required and must be the number.",
      bookingList:helper.clone(dialogReset),
      detailRow:'',
      itemRow:'',
        // shop: opt.shop,
        // current_status: opt.current_status
      fields: [
        {name:'booking_no', title:'transport.booking_no'},
        {name:'customer_name', title:'transport.customer_name'},
        {name:'pickup_place', title:'transport.pickup_place'},//, width:'80px'
        {name:'pickup_date', title:'transport.pickup_date'},
        {name:'type', title:'transport.type'},
        {name:'real_delivery_date', title:'transport.real_delivery_date'},
        {name:'booking_date', title:'transport.booking_date'},
        {name:'actions', type:'actions', width:(3*28+8)+'px', render:function(row) {
          var e = function() {
            this.dialogBookingOpen(row.id)
          }.bind(this);
          var f = function() {
            this.onCancelBooking(row)
          }.bind(this);
          var g = function() {
            this.onToWaitAssign(row)
          }.bind(this);
          return (<div className="flex">
            <div onClick={e}>
              <FlexIcon icon="bed24" title="action.select"></FlexIcon>
            </div>
          </div>);
        }.bind(this)},
      ]
    }
  },

  setDetailRow:function(dataTable){
    //console.log(dataTable);
    return dataTable.map(function(row, index){
      return (
        <tr>
            <td style={{borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingLeft: "3px"}}></span>{row.booking_name}</td>
            <td style={{textAlign:"right",borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{helper.numberFormat(row.total_price,2)}</span></td>
            <td style={{textAlign:"right",borderBottom:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{this.state.bookingList.currency}</span></td>
        </tr>
        )
    }.bind(this));
  },

  setItemRow:function(dataTable){
    return dataTable.map(function(row, index){
      return (
        <tr>
            <td style={{textAlign:"center"}}><span style={{lineHeight: "21px"}}>{index+1}.</span></td>
            <td style={{textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.barcode}</span></td>
            <td style={{textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.pickup_date}</span></td>
            <td style={{textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.real_delivery_date}</span></td>
            <td style={{textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.real_delivery_date}</span></td>
            <td style={{textAlign:"center"}}><span style={{lineHeight: "21px"}}>{row.accepted_date}</span></td>
        </tr>
        )
    }.bind(this));
  },

  componentDidMount: function() {
    console.log(system.sessionStore.getSession());
  },

  addCustomer: function(row) {
    console.log('add_customer');
    this.props.history.pushState(null, '/preliminary/customer/edit/0');
  },

  onLinkToEdit: function(id) {
    console.log("Edit booking id = ",id);
    this.props.history.pushState(null, '/transport/bookingList/edit/' + id);
  },

  onCancelBooking: function(row){
    console.log('onCancelBooking = ',row);
    dialogActions.show({
      title:'preliminary.title.confirm_to_delete',
      content:'Do you want to cancel ' + row.booking_no + '?',
      actions:[
        {id:'ok', icon:'check52', label:'dialog.confirm'},
        {id:'cancel', icon:'close47', label:'dialog.cancel', default:true}
      ]
    }, function(isCancel, action_id) {
      if (isCancel || action_id=='cancel') {
        return;
      }
      console.log('DELETE');
      bookingListActions.cancelBooking(row);
    });
  },

  onToWaitAssign: function(row) {
    console.log("onToWaitAssign = ", row);
    dialogActions.show({
      title:'preliminary.title.confirm_to_change_status',
      content:'Do you want to change status booking NO. ' + row.booking_no + ' to Wait assign?',
      actions:[
        {id:'ok', icon:'check52', label:'dialog.confirm'},
        {id:'cancel', icon:'close47', label:'dialog.cancel', default:true}
      ]
    }, function(isCancel, action_id) {
      if (isCancel || action_id=='cancel') {
        return;
      }
      console.log('CHANGE');
      bookingListActions.changeStatusBooking(row);
    });
  },

  onCancelBookingDoneAction: function(data){
    toasterActions.pop({
      type:'success',
      message:data.done
    });
    this.refs.grid.doRefresh();
  },

  onCancelBookingErrorAction: function(errors){
    toasterActions.pop({
      type:'warning',
      message:'เธฅเธเธเนเธญเธกเธนเธฅเนเธกเนเธชเธณเน€เธฃเนเธ ' + errors
    });
  },

  onChangeStatusBookingDoneAction: function(data) {
      toasterActions.pop({
        type:'success',
        message:data.done
      });
      this.refs.grid.doRefresh();
  },

  onChangeStatusBookingErrorAction: function(errors) {
      toasterActions.pop({
        type:'warning',
        message:'เธฅเธเธเนเธญเธกเธนเธฅเนเธกเนเธชเธณเน€เธฃเนเธ ' + errors
      });
  },

  handleChange: function(id, value) {
    console.log("handleChange");
    this.state.data[id] = value;
    storage.save(storageKey, {
      current_status: this.state.data.current_status,
      shop: this.state.data.shop
    });
    this.setState({
      data: this.state.data
    }, function() {
      this.refs.grid.doRefresh();
    });
  },

  dialogBookingOpen: function(bookingId) {
    console.log(bookingId);
    actions.getDialogData(bookingId);
    //this.setState({dialogOpen: true});
  },
  dialogBookingClose: function() {
    this.setState({dialogOpen: false});
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

  handleChangeTab: function(value) {
    //   console.log("xxccc = ", value);
    this.setState({
      tabValue: value,
    });
  },

  handleChangeFlaxTextInput:function(event){
    //console.log(event);
    this.state.data[event.target.id] = event.target.value;
    this.setState({
        data: this.state.data
    });
    // console.log("This Data = ", this.state.data);
  },

  saveAddition:function() {
      if(isNaN(this.state.data.additionAmount) || this.state.data.additionAmount == ""){
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
      console.log("Save Addition = ",this.state.data);
      actions.saveAddition(this.state.data);
  },

  onSaveAdditionDoneAction: function(data) {
    toasterActions.pop({
      type:'success',
      message:data.done
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

    this.setState({dialogOpen: false});
  },

  onSaveAdditionErrorAction: function(data){
    toasterActions.pop({
      type:'warning',
      message:"Can't edit booking " + errors
    });
  },

  sentDocToEmail: function(){
    var docData = {
      email: this.state.data.email,
      booking_id: this.state.bookingList.id
    };
    //console.log("sant Email = ", docData);
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

  render: function() {
    var actions = [
      <RaisedButton
        label="OK"
        primary={true}
        onTouchTap={this.dialogBookingClose}
      />,
    ];

    var fields = {
        additionDetail:{
            id:'additionDetail',
            label:'transport.textFields.additionDetail'
      },
    };

    return (
      <div className="layout-panel content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="transport.title.headBookingList" component="h3" />
          </div>
          <div className="panel2 no-shrink flex-form">
          </div>
        </div>
        <div style={{minHeight:'540px',width:'1094px'}}>

            <div className="content-body panelf" style={{minHeight:'543px'}}>
            <div style={{height: '32px'}}>
                <div className="flaticon-briefcase50 normal icon" style={{height: '32px',float: 'left'}}></div>
                <label style={{height:'32px',display: 'block',float: 'left',fontSize: '1.1em',paddingTop: '8px'}}>
                    <b>Delivered</b>
                </label>
            </div>
            <div stule={{clear: 'both'}}></div>
              <div>
                <FlexGrid
                    ref="grid"
                    id="transport-bookingList-listDelivered"
                    listAction={bookingListActions.listDelivered}
                    exportAction={bookingListActions.exportDelivered}
                    fields={this.state.fields}
                    pk="id"
                    sortBy="booking_no"
                    sortDir="ASC"
                    limit={50}
                    checkbox={false}
                    search={true}
                    displayRows={12}
                    />
              </div>
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
                        <table style={{height: '120px', width: '237px',float:'left'}}>
                            <tbody>
                                <tr>
                                    <td>Booking No.: {this.state.bookingList.booking_no}</td>
                                </tr>
                                <tr>
                                    <td>Waybill No.: {this.state.bookingList.waybill}</td>
                                </tr>
                                <tr>
                                    <td>Booking date: {this.state.bookingList.booking_date}</td>
                                </tr>
                                <tr>
                                    <td><b>{this.state.bookingList.name}</b></td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{clear:'both'}}></div>
                        <div style={{width:'368px',height:'36px',float:'left'}}>
                            <table style={{height: '35px', width: '367px'}}>
                                <tbody>
                                    <tr>
                                        <td style={{textAlign:'center'}}><strong>{this.state.bookingList.status}</strong></td>
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
                                <table style={{height: '70px',width: '430px'}}>
                                    <tbody>
                                        <tr>
                                            <td><strong>From : {this.state.bookingList.from_place}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>{this.state.bookingList.senderName}</td>
                                        </tr>
                                        <tr>
                                            <td>{this.state.bookingList.senderAddr}</td>
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
                                <table style={{height: '70px',width: '430px'}}>
                                    <tbody>
                                        <tr>
                                            <td><strong>To : {this.state.bookingList.to_place}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>{this.state.bookingList.toName}</td>
                                        </tr>
                                        <tr>
                                            <td>{this.state.bookingList.toAddr}</td>
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
                                <table style={{width: "888px",marginLeft:"2px"}}>
                                    <thead style={{borderBottom:'2px solid lightgray'}}>
                                        <tr>
                                            <th scope="col">NO.</th>
                                            <th scope="col">Barcode</th>
                                            <th scope="col">Pickup date</th>
                                            <th scope="col">Delivery date</th>
                                            <th scope="col">Receipt date</th>
                                            <th scope="col">Accepted date</th>
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
                                    <table style={{width: "510px"}}>
                                        <thead style={{borderBottom:'2px solid lightgray'}}>
                                            <tr>
                                                <th style={{width: "60%",textAlign:"left",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingLeft: "3px"}}>Description</span></th>
                                                <th style={{width: "20%",textAlign:"center",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px"}}>Amount</span></th>
                                                <th style={{width: "20%",textAlign:"center"}}><span style={{lineHeight: "25px"}}>Currency</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.detailRow}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td style={{borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingLeft: "3px"}}>Discount</span></td>
                                                <td style={{textAlign:"right",borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{helper.numberFormat(this.state.bookingList.discount,2)}</span></td>
                                                <td style={{textAlign:"right",borderBottom:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{this.state.bookingList.currency}</span></td>
                                            </tr>
                                            <tr>
                                                <td style={{borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingLeft: "3px"}}>Surcharge</span></td>
                                                <td style={{textAlign:"right",borderBottom:"1px solid lightgray",borderRight:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{helper.numberFormat(this.state.bookingList.charge_amount,2)}</span></td>
                                                <td style={{textAlign:"right",borderBottom:"1px solid lightgray"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{this.state.bookingList.currency}</span></td>
                                            </tr>
                                        </tfoot>
                                    </table><br/>
                                    <div style={{width: "510px",height:"25px",border:'1px solid lightgray',borderRadius:'3px',paddingLeft:'3px',backgroundColor:'#e2e2e2'}}>
                                        <table style={{width: "100%"}}>
                                            <thead>
                                                <tr>
                                                    <th style={{width: "60%",textAlign:"left"}}><span style={{lineHeight: "25px",paddingLeft: "3px"}}>Total amount</span></th>
                                                    <th style={{width: "20%",textAlign:"right"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{helper.numberFormat(this.state.bookingList.total_amount,2)}</span></th>
                                                    <th style={{width: "20%",textAlign:"right"}}><span style={{lineHeight: "25px",paddingRight:"3px"}}>{this.state.bookingList.currency}</span></th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                                <div style={{width:"40%",minHeight:"150px",float:"left",padding:"0px 8px 1px 8px"}}>
                                    <div style={{width:'100%'}}>
                                        <p><b>Additional charge</b></p><br/>
                                        <TextField
                                            id="additionDetail"
                                            ref="additionDetail"
                                            underlineShow={false}
                                            style={textFieldsNonHr}
                                            onChange={this.handleChangeFlaxTextInput}
                                            hintText="Detail"
                                            hintStyle={{bottom:'0px',fontSize:'14px'}}
                                         />
                                    </div>
                                    <div style={{width:'100%',marginTop:"3px"}}>
                                        <TextField
                                            id="additionAmount"
                                            ref="additionAmount"
                                            underlineShow={false}
                                            style={textFieldsNonHr}
                                            onChange={this.handleChangeFlaxTextInput}
                                            hintText={this.state.checkAmount==true ? this.state.amountTrue : this.state.amountFalse}
                                            hintStyle={this.state.checkAmount==true ? hideStyles.errorStyle : hideStyles.okStyle}
                                         />
                                    </div>
                                    <div style={{width:'100%',marginTop:"3px"}}>
                                        <TextField
                                            id="additionRemark"
                                            ref="additionRemark"
                                            underlineShow={false}
                                            style={textFieldsNonHr}
                                            onChange={this.handleChangeFlaxTextInput}
                                            hintText="Remark"
                                            hintStyle={{bottom:'0px',fontSize:'14px'}}
                                         />
                                    </div>
                                    <div style={{width:'100%',marginTop:"5px"}}>
                                        <RaisedButton
                                            label="save"
                                            primary={true}
                                            style={{height:"28px",fontSize:"12px",float:"right"}}
                                            onClick={this.saveAddition}
                                         />
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

module.exports = CustomerList;
