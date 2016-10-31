var React = require('react');

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import RaisedButton from 'material-ui/lib/raised-button';

var tr = require('counterpart');

var system = require('../system/system');
//var widgets = require('ss-widget');
var toasterActions = system.toasterActions;
var helper        = require('../../../../server/lib/helper');
var systemActions =  require('../system/actions');
var infoPanelActions =  require('../system/actions/info-panel');
var Router    = require('react-router');
var Link          = Router.Link;
var actions = require('./actions');

var T         = require('react-translate-component');
var dialogActions = system.dialogActions;
var FlexTextInput = require('../../widgets/flex-text-input.jsx');
var FlexButton    = require('../../widgets/flex-button.jsx');
var FlexDisplayTable    = require('../../widgets/flex-display-table.jsx');
var FlexDropdown  = require('../../widgets/flex-dropdown.jsx');
var FlexIcon = require('../../widgets/flex-icon.jsx');
var FlexTab  = require('../../widgets/flex-tab.jsx');
var FlexCheckbox  = require('../../widgets/flex-checkbox.jsx');
var FlexRadioGroup  = require('../../widgets/flex-radio-group.jsx');

var $             = require('jquery');

const style = {
  'width': '160px',
};
var tableData = [];
var textTo = "82 Soam Soamkrang Somengam Lampang Thailand 52201";
var FinishBooking = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState:function(){
    console.log("id = ", this.props.params.id);
    console.log("page = ", this.props.params.page);
    var page = this.props.params.page;
    var bookingId = this.props.params.id;
    var person_id = '0';
    var cTab = 'tab1';
    return {
      page: page,
      bookingId: bookingId,
      fixedHeader: false,
      fixedFooter: false,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      selectAllSelected: false,
      hAdjustForCheckbox: false,
      adjustForCheckbox: false,
      enableSelectAll: false,
      deselectOnClickaway: false,
      displaySelectAll: false,
      displayRowCheckbox: false,
      tableProductRow: '',
      bookingData: {
        bookingNo:'',
        bookingDate: '',
        bookingFrom:'',
        bookingSender:'',
        bookingTo:'',
        bookingReceipient:'',
        bookingPickup_place:'',
        bookingCurrentcy:'THB',
        bookingWaybill:'',
        bookingSubtotal:'',
        bookingVatAmount:'',
        bookingVatRate:''
      },
    }
  },

  ProductRow:function(dataTable){
    return dataTable.map(function(row, index){
      return (<TableRow key={index} style={{'background-color': '#fff','height':'35px','border-bottom':'1px dotted #e2e2e2','border-top':'0px dotted #e2e2e2'}}>
        <TableRowColumn style={{'padding':'0px','height':'35px'}}>{row.name}</TableRowColumn>
        <TableRowColumn style={{'textAlign':'center','padding':'0px','height':'35px'}}>{row.piece}</TableRowColumn>
        <TableRowColumn style={{'textAlign':'right','padding':'0px','padding-right':'25px','height':'35px'}}>{row.weight}</TableRowColumn>
        <TableRowColumn className="in-box-tb" style={{'textAlign':'center','padding':'0px','height':'35px'}}>{row.width}</TableRowColumn>
        <TableRowColumn className="in-box-tb2" style={{'textAlign':'center','padding':'0px','height':'35px'}}>{row.depth}</TableRowColumn>
        <TableRowColumn className="in-box-tb3" style={{'textAlign':'center','padding':'0px','height':'35px'}}>{row.height}</TableRowColumn>
        <TableRowColumn className="in-box-tb4" style={{'textAlign':'right','padding':'0px','padding-right':'15px','height':'35px'}}>{helper.numberFormat(row.price,2)}</TableRowColumn>
        <TableRowColumn style={{'textAlign':'center','padding':'0px','height':'35px'}}>{this.state.bookingData.bookingCurrentcy}</TableRowColumn>
      </TableRow>)
    }.bind(this));
  },

  componentDidMount: function() {
    console.log("start");
    this.getBookingData(this.state.bookingId);
    // this.getBookingDetail(this.state.bookingId);
  },

  onGetBillingListDataDoneAction: function(data){
    this.state.billingListData = data;
    this.setState({
      billingListData: this.state.billingListData
    });
    console.log(this.state.billingListData);
  },

  getBookingData: function(bookingId){
    //console.log("booking Id = ", bookingId);
    $.ajax({
      type:'post',
      url:'/finish-booking/api',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        act:'getBooking',
        bookingId:bookingId
      }),
      dataType:'json',
      success:function(res) {
        if (res.status===true) {
          //console.log(res.data.bookingData);
          var resData = res.data.bookingData;
          this.setBookingData(resData);
          this.getBookingDetail(this.state.bookingId);
        } else {
          console.log("error");
        }
      }.bind(this)
    });
  },

  getBookingDetail: function(bookingId){
    console.log("booking Id = ", bookingId);
    $.ajax({
      type:'post',
      url:'/finish-booking/api',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        act:'getBookingDetail',
        bookingId:bookingId
      }),
      dataType:'json',
      success:function(res) {
        if (res.status===true) {
          console.log("getBookingDetail Dtat", res.data.bookingDetial);
          var resData = res.data.bookingDetial;
          this.setBookingDetail(resData);
        } else {
          console.log("eror");
        }
      }.bind(this)
    });
  },

  genShipmentReport: function(){
    console.log("genShipmentReport Id = ", this.state.bookingId);
    var bookingId = this.state.bookingId;
    $.ajax({
      type:'post',
      url:'/finish-booking/api',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        act:'shipmentReport',
        bookingId:bookingId
      }),
      dataType:'json',
      success:function(res) {
        if (res.status===true) {
          console.log("getBookingDetail Dtat", res);
          window.open(res.data.pdfFile);
          window.open(res.data.pdfFileBarcode);
          window.open(res.data.pdfFileInvoice);
          //var resData = res.data.bookingDetial;
          //this.setBookingDetail(resData);
        } else {
          console.log("eror");
        }
      }.bind(this)
    });
  },

  setBookingData: function(data) {
    console.log("Data data = ", data);
    this.state.bookingData.bookingNo = data.booking_no;
    this.state.bookingData.bookingDate = data.booking_date;
    this.state.bookingData.bookingFrom = data.from_place;
    this.state.bookingData.bookingSender = data.sender1;
    this.state.bookingData.bookingTo = data.to_place;
    this.state.bookingData.bookingReceipient = data.receipient1;
    this.state.bookingData.bookingPickup_place = data.pickup_place;
    this.state.bookingData.bookingDiscountAmount = data.discount_amount;
    this.state.bookingData.bookingChargeAmount = data.charge_amount;
    this.state.bookingData.bookingTotalAmount = data.grand_total_amount;
    this.state.bookingData.bookingVatAmount = data.vat_amount;
    this.state.bookingData.bookingVatRate = data.vat_rate;
    this.state.bookingData.bookingCurrentcy = (data.currency_id == '1')? 'THB':'USD';
    this.state.bookingData.bookingWaybill = data.waybill;
    this.state.bookingData.bookingSubtotal = data.sub_total;

    this.setState({
      bookingData:this.state.bookingData
    });
  },

  setBookingDetail: function(data) {
    console.log("Detail = ", data);

    for(var i=0; i<data.length; i++){
      tableData.push({
        name: data[i].booking_name,
        piece: data[i].qty,
        weight: data[i].weight + " kg.",
        width: data[i].width + " cm.",
        depth: data[i].depth + " cm.",
        height: data[i].height + " cm.",
        price: data[i].total_price,
        currency: this.state.bookingData.bookingCurrentcy,
      });
    }

    if(this.state.bookingData.bookingSubtotal != 0) {
      console.log("Set Subtotal = ", this.state.bookingData.bookingSubtotal);
      tableData.push({
        name: 'Sub total',
        piece: '',
        weight: '',
        depth: '',
        height: '',
        price: this.state.bookingData.bookingSubtotal,
      });
    }

    if(this.state.bookingData.bookingDiscountAmount > 0){
      console.log("Set Discount = ", this.state.bookingData.bookingDiscountAmount);
      tableData.push({
        name: 'Discount',
        piece: '',
        weight: '',
        depth: '',
        height: '',
        price: '-' + helper.numberFormat(this.state.bookingData.bookingDiscountAmount,2),
      });
    }

    if(this.state.bookingData.bookingChargeAmount > 0){
      console.log("Set Surcharge = ", this.state.bookingData.bookingChargeAmount);
      tableData.push({
        name: 'Surcharge',
        piece: '',
        weight: '',
        depth: '',
        height: '',
        price: this.state.bookingData.bookingChargeAmount,
      });
    }

    if(this.state.bookingData.bookingVatAmount > 0){
      console.log("Set Vat = ", this.state.bookingData.bookingVatAmount);
      tableData.push({
        name: 'Vat (' + this.state.bookingData.bookingVatRate + '%)' ,
        piece: '',
        weight: '',
        depth: '',
        height: '',
        price: this.state.bookingData.bookingVatAmount,
      });
    }

    this.setState({
      tableProductRow: this.ProductRow(tableData)
    });
  },

  backBooking: function(){
    console.log("back to booking");
    if(this.state.page == 0 || this.state.page == '0' ){
      window.location.href='/booking-transport/#/booking-transport/booking/booking_new/0';
    } else {
      window.location.href='/onex/#/booking-transport/booking';
    }
  },

  // genShipmentReport: function(){
  //   console.log("genShipmentReport Id = ", this.state.bookingId);
  //   window.location.href='/booking-transport/#/transport/report/booking_id/'+this.state.bookingId;
  // },

  render: function() {

    return(
      <div id="bodysignin">
        <div className="onex-top-bar">
          <div className="onex-top-bar-left">
          </div>

          <div className="top-bar-right">
            <ul className="menu">
              <li><div className="space">.</div></li>
            </ul>
          </div>
        </div>
      <div id="content-panel-signin" style={{'width':'770px','height':'603px','overflow':'scroll'}}>
        <div style={{'width':'750px','marginTop':'5px'}}>
        <div style={{'width':'750px','height':'263px','border':'2px solid #e2e2e2','border-radius':'7px','float':'left'}}>
          <div style={{'width':'340px','height':'263px','border-right':'2px solid #e2e2e2','float': 'left'}}>
            <div style={{'width':'100%'}}>
              <div className="success-box" style={{width:'100%',height:'35px',marginTop:'57px'}}>
            </div>
            <div style={{'clear':'both'}}></div>
            <div style={{'width':'100%','height':'20px','float':'left'}}></div>
            <div style={{'width':'100%','height':'28px','float':'left'}}>
              <p style={{'text-align':'center','font-weight':'bold'}}>Booking No. : {this.state.bookingData.bookingNo}</p>
            </div>

            <div style={{'width':'100%','height':'28px','float':'left'}}>
              <p style={{'text-align':'center','font-weight':'bold'}}>Waybill No. : {this.state.bookingData.bookingWaybill}</p>
            </div>

            <div style={{'width':'100%','height':'28px','float':'left'}}>
              <p style={{'text-align':'center','font-weight':'bold'}}>Booking Date : {this.state.bookingData.bookingDate}</p>
            </div>

            <div style={{'clear':'both'}}></div>

            </div>
          </div>
          <div style={{'width':'408px','height':'263px','float': 'right'}}>
            <div style={{'width':'100%','height':'50%','border-bottom':'2px solid #e2e2e2'}}>
              <div className="car" style={{'width':'25%','height':'85%','float':'left',marginTop:'12px'}}>
              </div>
              <div style={{'width':'73%','height':'21%','float':'right',paddingTop:'3px',paddingBottom:'2px',paddingLeft:'5px'}}>
                <p>
                  <label style={{'font-size':'1.2em','font-weight':'bold'}}>From: </label>
                  <label style={{'font-size':'1.2em'}}>{this.state.bookingData.bookingFrom}</label>
                </p>
              </div>

              <div style={{'width':'73%','height':'55%','float':'right',paddingLeft:'5px'}}>
                <p>
                  <label style={{'font-size':'0.8em'}}><div dangerouslySetInnerHTML={{__html:this.state.bookingData.bookingSender}}/></label>
                </p>
              </div>
            </div>

            <div style={{'width':'100%','height':'50%'}}>
              <div className="to-box" style={{'width':'25%','height':'85%','float':'left',marginTop:'12px'}}>
              </div>
              <div style={{'width':'73%','height':'21%','float':'right',paddingTop:'3px',paddingBottom:'2px',paddingLeft:'5px'}}>
                <p>
                  <label style={{'font-size':'1.2em','font-weight':'bold'}}>To: </label>
                  <label style={{'font-size':'1.2em'}}>{this.state.bookingData.bookingTo}</label>
                </p>
              </div>

              <div style={{'width':'73%','height':'55%','float':'right',paddingLeft:'5px'}}>
                <p>
                  <label style={{'font-size':'0.8em'}}><div dangerouslySetInnerHTML={{__html:this.state.bookingData.bookingReceipient}}/></label>
                </p>
              </div>
            </div>

          </div>
        </div>
        <div className="booking-detail-tab" style={{'width':'100%','height':'52px','float':'left',marginTop:'10px',marginBottom:'5px'}}>
        </div>
        <br/>
        <div style={{'float':'left'}}>
          <Table
            fixedHeader={this.state.fixedHeader}
            fixedFooter={this.state.fixedFooter}
            selectable={this.state.selectable}
            multiSelectable={this.state.multiSelectable}
            displaySelectAll={this.state.displaySelectAll}
            onRowSelection={this._onRowSelection}
          >
            <TableHeader selectAllSelected={this.state.selectAllSelected}
                         adjustForCheckbox={this.state.hAdjustForCheckbox}
                         displaySelectAll={this.state.displayRowCheckbox}
                         style={{'border-bottom':'1px dotted #e2e2e2'}}
            >
              <TableRow style={{'padding':'0px','height':'49px','border-bottom':'1px dotted #e2e2e2'}}>
                <TableHeaderColumn style={{'width':'30%','textAlign':'center','padding':'0px','height':'49px'}}></TableHeaderColumn>
                <TableHeaderColumn className="in-box-1" style={{'width':'11%','textAlign':'center','padding':'0px','height':'49px'}}>
                </TableHeaderColumn>
                <TableHeaderColumn className="in-box-2" style={{'width':'11%','textAlign':'center','padding':'0px','height':'49px'}}>
                </TableHeaderColumn>
                <TableHeaderColumn className="head-box-tb" style={{'width':'11%','textAlign':'center','padding':'0px','height':'49px'}}>
                  <h4>WIDTH</h4>
                </TableHeaderColumn>
                <TableHeaderColumn className="head-box-tb2" style={{'width':'11%','textAlign':'center','padding':'0px','height':'49px'}}>
                  <h4>DEPTH</h4>
                </TableHeaderColumn>
                <TableHeaderColumn className="head-box-tb3" style={{'width':'11%','textAlign':'center','padding':'0px','height':'49px'}}>
                  <h4>HEIGHT</h4>
                </TableHeaderColumn>
                <TableHeaderColumn className="head-box-tb4" style={{'width':'11%','textAlign':'center','padding':'0px','height':'49px'}}>
                  <h4>TOTAL</h4>
                </TableHeaderColumn>
                <TableHeaderColumn style={{'width':'4%','textAlign':'center','padding':'0px','height':'49px'}}></TableHeaderColumn>
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
              <TableRow style={{'padding':'0px','height':'35px','border-bottom':'1px dotted #e2e2e2','border-top':'0px dotted #e2e2e2'}}>
                <TableRowColumn style={{'padding':'0px','height':'35px','vertical-align':'middle'}}><h5>Grand total</h5></TableRowColumn>
                <TableRowColumn style={{'padding':'0px','height':'35px','vertical-align':'middle'}}></TableRowColumn>
                <TableRowColumn style={{'padding':'0px','height':'35px','vertical-align':'middle'}}></TableRowColumn>
                <TableRowColumn className="in-box-tb" style={{'padding':'0px','height':'35px','vertical-align':'middle'}}></TableRowColumn>
                <TableRowColumn className="in-box-tb2" style={{'padding':'0px','height':'35px','vertical-align':'middle'}}></TableRowColumn>
                <TableRowColumn className="in-box-tb3" style={{'padding':'0px','height':'35px','vertical-align':'middle'}}></TableRowColumn>
                <TableRowColumn className="in-box-tb4" style={{'textAlign':'right','padding':'0px','padding-right':'15px','height':'35px','vertical-align':'middle'}}>
                  <h5>{helper.numberFormat(this.state.bookingData.bookingTotalAmount,2)}</h5>
                </TableRowColumn>
                <TableRowColumn style={{'padding':'0px','height':'35px','vertical-align':'middle','textAlign':'center'}}><h5>{this.state.bookingData.bookingCurrentcy}</h5></TableRowColumn>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div style={{'width':'550px','height':'52px','float':'left','margin-top':'15px','padding-left':'200px'}}>
          <div style={{'float':'left'}}>
            <RaisedButton label="PRINT" secondary={true} style={style} onMouseDown={this.genShipmentReport} />
          </div>
          <div style={{'float':'left','width':'20px','height':'52px'}}> </div>
          <div style={{'float':'left'}}>
            <RaisedButton label="FINISH" secondary={true} style={style} onMouseDown={this.backBooking} />
          </div>
        </div>
        </div>

      </div>
      </div>
    );
  }
});

module.exports = FinishBooking;
