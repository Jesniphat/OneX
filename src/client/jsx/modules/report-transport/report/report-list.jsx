var React     = require('react');
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import Dialog from 'material-ui/lib/dialog';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
// import FontIcon from 'material-ui/lib/font-icon';
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

var FlexGrid  = widgets.FlexGrid;
var FlexDataTable = widgets.FlexDataTable;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
var FlexTextInput = widgets.FlexTextInput;

//var customerAction = require('./actions');
var reportActions = require('./actions');
var ReFlux    = require('reflux');

var ReportList = React.createClass({
  contextTypes: {
      router: React.PropTypes.func
    },
  mixins:[
    ReFlux.listenTo(reportActions.genReportManifest.done,'onGenReportManifestDoneAction'),
    ReFlux.listenTo(reportActions.genReportManifest.error,'onGenReportManifestErrorAction'),
    ReFlux.listenTo(reportActions.genReportSummaryCustomer.done,'onGenReportSummaryCustomerDoneAction'),
    ReFlux.listenTo(reportActions.genReportSummaryCustomer.error,'onGenReportSummaryCustomerErrorAction'),
    ReFlux.listenTo(reportActions.getCustomerList.done,'onGetCustomerListDoneAction'),
    ReFlux.listenTo(reportActions.getCustomerList.error,'onGetCustomerListErrorAction'),
    ReFlux.listenTo(reportActions.getDistrict.done, 'onGetDistrictDoneAction'),
    ReFlux.listenTo(reportActions.getDistrict.error, 'onGetDistrictErrorAction')
  ],
  getInitialState: function() {
    this.fields = {
      manifest_date: {
        id:'manifest_date',
        type: 'date',
        label:'dialog.manifest_date'
      },
      summary_date_from: {
        id: 'summary_date_from',
        type: 'date',
        label: 'dialog.summary_date_from'
      },
      summary_date_to: {
        id: 'summary_date_to',
        type: 'date',
        label: 'dialog.summary_date_to'
      }
    };
    return {
      data: {
        manifest_date:helper.dateToString(new Date()),
        summary_date_from: helper.dateToString(new Date()),
        summary_date_to: helper.dateToString(new Date()),
        paymentStatus: "pending",
        customer: "1",
        from:"Thailand - Bang Khen",
        to:"Cambodia - Doun Penh"
      },
      reportListBox:[],
      selectable: false,
      multiSelectable: false,
      displaySelectAll: false,
      selectAllSelected: false,
      hAdjustForCheckbox: false,
      displayRowCheckbox: false,
      noStyle:{
        width:"10%",
        textAlign:"center"
      },
      nameStyle:{
        width:"65%"
      },
      actionStyle:{
        width:"25%",
        textAlign:"center"
      },
      paymentStatusList:{
        id:'paymentStatus',
        label:'dialog.paymentStatusList',
        list:[
          {value:'all', text:"All"},
          {value:'pending', text:"Pending"},
          {value:'paid', text:"Paid"},
          {value:'unsuccess', text:"Unsuccess"}
        ]
      },
      customerList:{
        id:'customer',
        label:'dialog.customerList',
        list:[]
      },
      fromList:{
        id:'from',
        label:'dialog.from',
        list:[]
      },
      toList:{
        id:'to',
        label:'dialog.to',
        list:[]
      },
      openMainManifest: false,
      openSummaryCustomer: false
    }
  },

  componentDidMount: function() {
    console.log(system.sessionStore.getSession());
    reportActions.getCustomerList();
    reportActions.getDistrict();
  },

  handleChange:function(id, value){
    this.state.data[id] = value;
    this.setState({
      data: this.state.data
    });
  },

  handlePuChange: function(id, value) {
    this.state.data[id] = value;
    this.setState({
      data: this.state.data
    });
  },

  openDialogMainManifest: function() {
    this.setState({openMainManifest: true});
  },

  openDialogSummaryCustomer:function() {
    this.setState({openSummaryCustomer: true});
  },

  handleClose: function(){
    this.setState({
      openMainManifest: false,
      openSummaryCustomer:false
    });
  },

  genReportManifest: function() {
    console.log("GenReportManifest = ", this.state.data.manifest_date);
    var param = {
      manifest_date:this.state.data.manifest_date,
      from:this.state.data.from,
      to:this.state.data.to,
    }
    reportActions.genReportManifest(param);
    this.setState({openMainManifest: false});
  },

  onGenReportManifestDoneAction: function(res) {
    console.log("MD done = ", res);
    window.open(res.pdfFile);
  },

  onGenReportManifestErrorAction: function(error) {
    console.log("error = ", error);
    toasterActions.pop({
      type:'warning',
      message:"Can't gen report."
    });
  },

  onGetCustomerListDoneAction: function(res){
    // console.log("res : ", res);
    this.state.customerList.list = res.customerList;
    this.setState({
      customerList: this.state.customerList
    })
  },

  onGetCustomerListErrorAction: function(error){
    console.log("error = ", error);
    toasterActions.pop({
      type:'warning',
      message:"Can't get customerdata."
    });
  },

  onGenReportSummaryCustomerDoneAction: function(res) {
    console.log("gen ok");
    window.open(res.pdfFile);
  },

  onGenReportSummaryCustomerErrorAction: function(error) {
    console.log("error = ", error);
    toasterActions.pop({
      type:'warning',
      message:"Can't gen report."
    });
  },

  genReportSummaryCustomer: function() {
    var param = {
      p_from: this.state.data.summary_date_from,
      p_to: this.state.data.summary_date_to,
      p_status: this.state.data.paymentStatus,
      customer: this.state.data.customer
    };
    // console.log("this action : ", param);
    reportActions.genReportSummaryCustomer(param);
    this.setState({openSummaryCustomer: false});
  },

  testReport: function(){
    reportActions.testReport({bookingId:207});
  },

  onGetDistrictDoneAction: function(res){
    // console.log("onGetDistrictDoneAction = ", res);
    this.state.fromList.list = res.origin;
    this.state.toList.list = res.destination;
    this.setState({
      fromList: this.state.fromList,
      toList: this.state.toList
    })
  },

  onGetDistrictErrorAction: function(error){
    console.log("eeror get district = ", error);
  },

  render: function() {
    const actionsManifest = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.genReportManifest}
      />,
    ];

    const actionsSummary = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.genReportSummaryCustomer}
      />,
    ];
    return (
      <div className="layout-panel content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <h3>Report</h3>
          </div>
        </div>
        <div className="flex-form">
          <div className="box10 flex">
            <div className="box6" style={{border:"1px solid black"}}>
              <Table
                selectable={this.state.selectable}
                multiSelectable={this.state.multiSelectable}
                displaySelectAll={this.state.displaySelectAll}
              >
                <TableHeader
                  selectAllSelected={this.state.selectAllSelected}
                  adjustForCheckbox={this.state.hAdjustForCheckbox}
                  displaySelectAll={this.state.displayRowCheckbox}
                >
                  <TableRow>
                    <TableHeaderColumn style={this.state.noStyle}>NO</TableHeaderColumn>
                    <TableHeaderColumn style={this.state.nameStyle}>Report name</TableHeaderColumn>
                    <TableHeaderColumn style={this.state.actionStyle}>Action</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={this.state.displayRowCheckbox}>
                  <TableRow>
                    <TableRowColumn style={this.state.noStyle}>1</TableRowColumn>
                    <TableRowColumn style={this.state.nameStyle}>Main Manifest</TableRowColumn>
                    <TableRowColumn style={this.state.actionStyle}>
                      <FlatButton secondary={true} label="click" onTouchTap={this.openDialogMainManifest} />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn style={this.state.noStyle}>2</TableRowColumn>
                    <TableRowColumn style={this.state.nameStyle}>รายงานสรุปยอดตามลูกค้า</TableRowColumn>
                    <TableRowColumn style={this.state.actionStyle}>
                      <FlatButton secondary={true} label="click" onTouchTap={this.openDialogSummaryCustomer} />
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn style={this.state.noStyle}></TableRowColumn>
                    <TableRowColumn style={this.state.nameStyle}></TableRowColumn>
                    <TableRowColumn style={this.state.actionStyle}></TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn style={this.state.noStyle}></TableRowColumn>
                    <TableRowColumn style={this.state.nameStyle}></TableRowColumn>
                    <TableRowColumn style={this.state.actionStyle}></TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <Dialog
          title="Dialog Manifest"
          actions={actionsManifest}
          modal={false}
          open={this.state.openMainManifest}
          onRequestClose={this.handleClose}
        >
          <div className="layout-panel">
          <div className="flex-form">
            <div className="box7">
              <div className="panel3 flex">
                <FlexTextInput
                  field={this.fields.manifest_date}
                  data={this.state.data}
                  onChange={this.handlePuChange}
                />
              </div>
            </div>
            <div className="box7">
              <div className="panel3 flex" style={{float:"left"}}>
                    <FlexDropdown
                      field={this.state.fromList}
                      data={this.state.data}
                      onChange={this.handleChange}
                    />
              </div>
              <div className="panel3 flex" style={{float:"left"}}>
                    <FlexDropdown
                      field={this.state.toList}
                      data={this.state.data}
                      onChange={this.handleChange}
                    />
              </div>
            </div>
          </div>
          </div>
        </Dialog>
        <Dialog
          title="Dialog customer summary"
          actions={actionsSummary}
          modal={false}
          open={this.state.openSummaryCustomer}
          onRequestClose={this.handleClose}
        >
          <div className="layout-panel">
          <div className="flex-form">
            <div className="box7">
              <div className="panel3 flex" style={{float:"left"}}>
                <FlexTextInput
                  field={this.fields.summary_date_from}
                  data={this.state.data}
                  onChange={this.handlePuChange}
                />
              </div>
              <div className="panel3 flex" style={{float:"left"}}>
                <FlexTextInput
                  field={this.fields.summary_date_to}
                  data={this.state.data}
                  onChange={this.handlePuChange}
                />
              </div>
            </div>
            <div className="box7">
              <div className="panel3 flex" style={{float:"left"}}>
                    <FlexDropdown
                      field={this.state.paymentStatusList}
                      data={this.state.data}
                      onChange={this.handleChange}
                    />
              </div>
              <div className="panel3 flex" style={{float:"left"}}>
                    <FlexDropdown
                      field={this.state.customerList}
                      data={this.state.data}
                      onChange={this.handleChange}
                    />
              </div>
            </div>
          </div>
          </div>
        </Dialog>
      </div>
    );
  }
});

module.exports = ReportList;
// this.reportListBoxTable = [
//   {name:'code',label:'reportListBox.reportName',width:'112px',render:function(row) {
//     return (
//       <div className="multiline">
//         <div><span>{row.booking_no}</span></div>
//       </div>
//     );
//   }},
//   {name:'chk',label:(
//       <span
//         className="flaticon-right244"
//         title={tr.translate('finance.pv.search_table.select_all')}
//         />
//     ),raw:true,width:'32px',render:function(row, i) {
//       if (row.status=='WAIT_ASSIGN' || me.state.prevItems[row.stockin_id]) {
//         return (<span className="flaticon-right237" onClick={function(){me.addToPickup(row, i)}}/>);
//       } else {
//         return null;
//       }
//   }}
// ];

// <div className="panel4" style={{borderRight:'1px solid #eee',borderLeft:'1px solid #eee',paddingRight:'1px',paddingLeft:'1px'}}>
//   <FlexDataTable
//     fields={this.reportListBoxTable}
//     data={this.state.reportListBox}
//     key="stockin_id"
//     displayRows={10}
//     />
// </div>

// <FlatButton secondary={true} label="test" onTouchTap={this.testReport} />
