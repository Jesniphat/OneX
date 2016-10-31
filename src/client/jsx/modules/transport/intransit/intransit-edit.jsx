var React       = require('react');
var Reflux      = require('reflux');
var tr          = require('counterpart');
var T           = require('react-translate-component');

var system      = require('ss-system');
var widget      = require('ss-widget');
var sessionStore      = system.sessionStore;
var toasterActions    = system.toasterActions;
var infoPanelActions  = system.infoPanelActions;
var dialogActions     = system.dialogActions;
var helper            = system.helper;
var systemStore       = system.systemStore;

var intransitActions = require('./actions');

var FlexDropdown  = widget.FlexDropdown;
var FlexTextInput = widget.FlexTextInput;
var FlexButton    = widget.FlexButton;
var FlexDataTable = widget.FlexDataTable;
var FlexCheckbox  = widget.FlexCheckbox;

//var customerAction = require('./actions');
var PickupReceipt = React.createClass({
  contextTypes: {
      router: React.PropTypes.func
    },
  mixins:[
    // ReFlux.listenTo(pickupListActions.cancelBooking.done,'onCancelBookingDoneAction'),
    Reflux.listenTo(intransitActions.addBarcode.done, 'onAddBarcodeDoneAction'),
    Reflux.listenTo(intransitActions.addBarcode.error, 'onAddBarcodeErrorAction'),
    Reflux.listenTo(intransitActions.saveIntransit.done, 'onSaveIntransitDoneAction'),
    Reflux.listenTo(intransitActions.saveIntransit.error, 'onSaveIntransitErrorAction'),
    Reflux.listenTo(intransitActions.updateIntransit.done, 'onUpdateIntransitDoneAction'),
    Reflux.listenTo(intransitActions.updateIntransit.error, 'onUpdateIntransitErrorAction'),
    Reflux.listenTo(intransitActions.getIntransitItemById.done, 'onGetIntransitItemByIdDoneAction'),
    Reflux.listenTo(intransitActions.getIntransitItemById.error, 'onGetIntransitItemByIdErrorAction'),
    Reflux.listenTo(intransitActions.genReport.done, 'onGenReportDoneAction'),
    Reflux.listenTo(intransitActions.genReport.error, 'onGenReportErrorAction'),
    Reflux.listenTo(intransitActions.genBarcode.done, 'onGenBarcodeDoneAction'),
    Reflux.listenTo(intransitActions.genBarcode.error, 'onGenBarcodeErrorAction'),
    Reflux.listenTo(intransitActions.saveExceptionIntransit.done, 'onSaveExceptionIntransitDoneAction'),
    Reflux.listenTo(intransitActions.saveExceptionIntransit.error, 'onSaveExceptionIntransitErrorAction'),
    Reflux.listenTo(intransitActions.getDistrict.done, 'onGetDistrictDoneAction'),
    Reflux.listenTo(intransitActions.getDistrict.error, 'onGetDistrictErrorAction')
  ],
  getInitialState: function() {
    var intransit_id = this.props.params.id;
    console.log('intransit_id',intransit_id);
    var me = this;
    var staff = sessionStore.getSession().staff;
    console.log('staff',staff);

    this.intransitListTable = [
      {name:'code',label:'IntransitTable.booking_no',width:'160px',render:function(row) {
        return (
          <div className="multiline">
            <div><span className="blue">{row.booking_no}</span></div>
          </div>
        );
      }},
      {name:'product',label:'IntransitTable.waybill',render:function(row) {
        return (
          <div className="multiline" style={{whiteSpace:'normal'}}>{row.waybill}</div>
        );
      }},
      {name:'status',label:'IntransitTable.status',render:function(row) {
        return (
          <div className="multiline" style={{whiteSpace:'normal'}}>{row.status}</div>
        );
      }},
      {name:'serial',label:'IntransitTable.item_no',width:'160px',render:function(row) {
        return (
          <div className="multiline">
            <div className="green">{row.booking_item_no}</div>
          </div>
        );
      }},
      {name:'chk',label:(
          <span
            className="flaticon-clear5"
            title={tr.translate('pickupTable.remove_all')}
            onClick={function() {me.removeAllFromIntransit()}}
            />
        ),raw:true,width:'32px',render:function(row, i) {
        return (<span className="flaticon-clear5" onClick={function() {me.removeFromIntransit(row, i)}}/>);
      }}
    ];

    this.fields = {
      intransit_no: {
        id:'intransit_no',
        type:'text',
        label:'intransitEdit.intransit_no',
        readonly: true
      },
      delivery_date: {
        id: 'delivery_date',
        type: 'date',
        label: 'intransitEdit.delivery_date'
      },
      display_status: {
        id: 'display_status',
        type: 'text',
        label: '',
        readonly: true
      },
      // from: {
      //   id:'from',
      //   type: 'text',
      //   label:'intransitEdit.from',
      //   readonly:true
      // },
      // to: {
      //   id:'to',
      //   type:'text',
      //   label:'intransitEdit.to',
      //   readonly:true
      // },
      prepare_by: {
        id:'prepare_by',
        type: 'text',
        label:'intransitEdit.prepare_by',
        readonly:true
      },
      remark: {
        id:'remark',
        type:'text',
        label:'intransitEdit.remark'
      },
      item_no: {
        id:'item_no',
        type: 'text',
        label:'intransitEdit.item_no'
      },
      size: {
        id:'size',
        type: 'text',
        label:'intransitEdit.size',
        autofocus:true,
      },
      eta_date: {
        id:'eta_date',
        type:'date',
        label:'intransitEdit.eta_date'
      },
      intransit_time: {
        id: 'intransit_time',
        type: 'time',
        label: 'intransitEdit.intransit_time'
      },
      exception_reason: {
        id:'exception_reason',
        type:'text',
        label:'intransitEdit.exception_reason'
      }
    }

    return {
      intransit_id: intransit_id,
      data: {
        intransit_no:'',
        delivery_date:helper.dateToString(new Date()),
        status:'active',
        display_status:'ACTIVE',
        from:'Bang Bon',
        to:'Chamker Mon',
        prepare_by: staff.display_name,
        remark:'',
        item_no:'',
        size:'',
        eta_date:helper.dateToString(new Date()),
        intransit_time:helper.dateTimeToString(new Date()).substr(11,5),
        exception_reason:''
        // origin:'Bang Khun Thian',
        // destionation: 'Prampir Meakkakra'
      },
      intransit_qty:0,
      intransitListItems:[],
      item_no:'',
      pickup_no:'',
      staff_id: staff.id,
      staff: staff.display_name,
      prev_status:'active',
      originList:{
        id:'from',
        label:'intransitEdit.from',
        list:[]
      },
      destinationList:{
        id:'to',
        label:'intransitEdit.to',
        list:[]
      },
    }
  },

  componentDidMount: function() {
    // console.log("date = ", helper.dateTimeToString(new Date()).substr(11,5));
    console.log(system.sessionStore.getSession());
    if (this.state.intransit_id != '0' || this.state.intransit_id != 0) {
      // console.log("com");
      intransitActions.getIntransitItemById(this.state.intransit_id);
    }
    intransitActions.getDistrict();
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

  handleBarcodeChange: function(id, value) {
    this.state.data[id] = value;
    this.setState({
      data: this.state.data
    });
  },

  onAddBarcodeDoneAction: function(res) {
    console.log(res);
    console.log("intransitListItems = ", this.state.intransitListItems);
    if(this.state.data.from == ''){
      this.state.data.from = res.country_origin;
    }
    if (this.state.data.to == '') {
      this.state.data.to = res.country_destination;
    }
    var existing = {};
    this.state.intransitListItems.forEach(function(item) {
      existing[item.booking_item_no] = true;
    });

    if(!existing[res.booking_item_no]){
      this.state.intransitListItems.push(res);
    } else {
      toasterActions.pop({
        type:'warning',
        message:"ยิงไปแล้ว"
      });
      return;
    }
    this.state.data.item_no = "";
    this.setState({
      intransitListItems: this.state.intransitListItems,
      data:this.state.data
    });
  },

  onAddBarcodeErrorAction: function(error) {
    toasterActions.pop({
      type:'warning',
      message:"Don't have this item."
    });
  },

  onGetIntransitItemByIdDoneAction: function(res){
    console.log('res:',res);
    var getdata = res.intransit;
    this.state.data.intransit_no = getdata.intransit_no;
    this.state.data.status = getdata.status;
    this.state.data.from = getdata.from;
    this.state.data.to = getdata.to;
    this.state.data.remark = getdata.remark;
    this.state.data.delivery_date = getdata.intransit_date;
    this.state.data.size = getdata.size,
    this.state.data.eta_date = getdata.eta,
    this.state.data.intransit_time = getdata.intransit_time;
    this.state.prev_status = getdata.status;
    this.state.data.display_status = getdata.display_status;
    this.state.data.exception_reason = getdata.exception_reason;
    this.setState({
      data:this.state.data,
      prev_status:this.state.prev_status,
      intransitListItems: res.item_list
    });
  },

  onSaveIntransitDoneAction: function(res) {
    console.log("save complete data = ", res);
    this.state.data.delivery_no = "";
    this.state.data.from = "Thailand - Bang Bon";
    this.state.data.to = "Cambodia - Chamker Mon";
    this.state.data.delivery_date = helper.dateToString(new Date());
    this.state.data.remark = "";
    this.state.data.size = "";
    this.state.data.eta_date = helper.dateToString(new Date());
    this.state.data.intransit_time = helper.dateTimeToString(new Date()).substr(11,5);
    this.state.intransit_qty = 0;
    this.setState({
      intransitListItems: [],
      data:this.state.data,
      intransit_qty:this.state.intransit_qty,
      prev_status:'active'
    });
    toasterActions.pop({
      type:'success',
      message:'Save complete.'
    });
    console.log("this = ", this.state.intransitListItems, this.state.data, this.state.intransit_qty);
    intransitActions.genReport({intransit_id:res.intransit_id});
  },

  onSaveIntransitErrorAction: function(error){
    toasterActions.pop({
      type:'warning',
      message:"Can't save data."
    });
  },


  onUpdateIntransitDoneAction: function(res){
    console.log("update complete data = ", res);
    this.state.data.delivery_no = "";
    this.state.data.from = "Thailand - Bang Bon";
    this.state.data.to = "Cambodia - Chamker Mon";
    this.state.data.delivery_date = helper.dateToString(new Date());
    this.state.data.remark = "";
    this.state.data.size = "";
    this.state.data.eta_date = helper.dateToString(new Date());
    this.state.data.intransit_time = helper.dateTimeToString(new Date()).substr(11,5);
    this.state.intransit_qty = 0;
    this.setState({
      intransitListItems: [],
      data:this.state.data,
      intransit_qty:this.state.intransit_qty,
      prev_status:'active',
      intransit_id:0
    });
    toasterActions.pop({
      type:'success',
      message:'Update complete.'
    });
    console.log("this = ", this.state.intransitListItems, this.state.data, this.state.intransit_qty, this.state.intransit_id);
    intransitActions.genReport({intransit_id:res.data.intransit_id});
  },

  onUpdateIntransitErrorAction: function(){
    toasterActions.pop({
      type:'warning',
      message:"Can't update data."
    });
  },

  onGenReportDoneAction: function(res){
    window.open(res.pdfFile);
    intransitActions.genBarcode({intransit_id:res.intransitId});
  },

  onGenReportErrorAction: function(error){
    console.log("error = ", error);
    toasterActions.pop({
      type:'warning',
      message:"Can't gen report."
    });
  },

  onGenBarcodeDoneAction: function(res){
    window.open(res.pdfFile);
  },

  onGenBarcodeErrorAction: function(error){
    console.log("error = ", error);
    toasterActions.pop({
      type:'warning',
      message:"Can't gen barcode."
    });
  },

  handleEnter: function(id,value){
    if (value==""||value==undefined||value==null){
      toasterActions.pop({
        type:'warning',
        message:"Please fill barcode."
      });
      this.refs.item_no.setFocus();
      return;
    }
    intransitActions.addBarcode({item_no:value});
  },

  removeFromIntransit: function(row, i){
    this.state.intransitListItems.splice(i, 1);
    this.setState({
      intransitListItems: this.state.intransitListItems
    });
  },

  removeAllFromIntransit: function(){
    this.setState({
      intransitListItems: []
    });
  },

  canSave: function() {
    if (this.state.intransit_id != 0 || this.state.intransit_id != '0') {
      console.log('StatusCanSave = ',this.state.prev_status );
      if (this.state.prev_status =='active'){
        return false;
      }
      return true;
    }
  },

  doSave: function(){
    if(this.state.intransitListItems.length == 0){
      toasterActions.pop({
        type:'warning',
        message:"Don't have item."
      });
      this.refs.item_no.setFocus();
      return;
    }
    var param = {
      intransit_qty: this.state.intransit_qty,
      intransit_id: this.state.intransit_id,
      staff_id: this.state.staff_id,
      intransit_no: this.state.data.intransit_no,
      delivery_date: this.state.data.delivery_date,
      status: this.state.data.status,
      from: this.state.data.from,
      to: this.state.data.to,
      prepare_by: this.state.staff,
      remark: this.state.data.remark,
      item_no: this.state.data.item_no,
      intransitListItems: this.state.intransitListItems,
      size:this.state.data.size,
      eta_date:this.state.data.eta_date,
      intransit_time:this.state.data.intransit_time
    };
    console.log("param = ", param);

    if(this.state.intransit_id == 0 || this.state.intransit_id == '0'){
      console.log("Save Intransit");
      intransitActions.saveIntransit(param);
    }else {
      console.log("Update Intransit");
      intransitActions.updateIntransit(param);
    }
  },

  canPrint: function() {
    if (this.state.intransit_id == 0 || this.state.intransit_id == '0') {
      return true;
    }else {
      return false;
    }
  },

  doPrint: function(){
    console.log("Do Print");
    // intransitActions.genReport({intransit_id:this.state.intransit_id})
    if (this.state.intransit_id == 0 || this.state.intransit_id == '0'){
      console.log("Don't print ");
      return;
    } else {
      console.log("doprint");
      window.open("/output/intransit/intransit_" + this.state.intransit_id + ".pdf");
      window.open("/output/intransit/intransit_barcode_" + this.state.intransit_id + ".pdf");
    }
  },

  canException: function(){
    if (this.state.intransit_id != 0 || this.state.intransit_id != '0') {
      console.log('StatusCanSave = ',this.state.prev_status );
      if (this.state.prev_status =='exception'){
        return false;
      }else{
        return true;
      }
    } else {
      return true;
    }
  },

  doExceptionReason: function(){
    if(this.state.data.exception_reason == ""){
      toasterActions.pop({
        type:'warning',
        message:"Please fill reason."
      });
      this.refs.exception_reason.setFocus();
      return;
    }

    var param = {
      exception_reason: this.state.data.exception_reason,
      intransit_id: this.state.intransit_id
    }
    console.log("Save exception_reason = ", param);
    intransitActions.saveExceptionIntransit(param);
  },

  onSaveExceptionIntransitDoneAction: function(res){
    toasterActions.pop({
      type:'success',
      message:"Save data complete."
    });
  },

  onSaveExceptionIntransitErrorAction: function(error){
    console.log("reason error = ", error);
    toasterActions.pop({
      type:'warning',
      message:"Can't update reason."
    });
  },

  onGetDistrictDoneAction: function(res){
    this.state.originList.list = res.origin;
    this.state.destinationList.list = res.destination;
    this.setState({
      originList: this.state.originList,
      destinationList: this.state.destinationList
    })
  },

  onGetDistrictErrorAction: function(error){
    console.log("eeror get district = ", error);
  },

  render: function() {
    var intransitListSummary = {
      count:0,
    };
    intransitListSummary = this.state.intransitListItems.reduce(function(prev, row) {
      return {
        count: prev.count+1
      };
    }, intransitListSummary);

    this.state.intransit_qty = intransitListSummary.count;

    var intransitListFooter = (
      <tr>
        <td>Total</td>
        <td className="right"></td>
        <td className="right blue" style={{fontSize:'16px'}}>{intransitListSummary.count} Item</td>
        <td></td>
      </tr>
    );
    return (
      <div className="flex-form">
      <div className="box10-flex">
        <div className="panel10 flex">
          <h3>Receive in transit container</h3>
        </div>
      </div>
      <div className="box10-flex">
        <div className="panel10 flex">
          <h4>Receive by barcode</h4>
        </div>
      </div>
      <div className="box10-flex">
        <div className="box8">
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="delivery_no"
              field={this.fields.intransit_no}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="size"
              field={this.fields.size}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel2 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="display_status"
              field={this.fields.display_status}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
        </div>
        <div className="box8">
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexDropdown
              ref="from"
              field={this.state.originList}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexDropdown
              ref="to"
              field={this.state.destinationList}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel2 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="prepare_by"
              field={this.fields.prepare_by}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
        </div>
        <div className="box8">
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="delivery_date"
              field={this.fields.delivery_date}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="eta_date"
              field={this.fields.eta_date}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel2 flex" style={{float:"left"}}>
            <FlexButton icon="email107"
              label="intransitEdit.save"
              default={true}
              onClick={this.doSave}
              disabled={this.canSave()}
            />
          </div>
        </div>
        <div className="box8">
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="intransit_time"
              field={this.fields.intransit_time}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="remark"
              field={this.fields.remark}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel2 flex" style={{float:"left"}}>
            <FlexButton
              icon="printer88"
              label="intransitEdit.print"
              onClick={this.doPrint}
              disabled={this.canPrint()}
            />
          </div>
        </div>
        <div className="box8" style={{paddingRight:"47px"}}>
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="item_no"
              field={this.fields.item_no}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
              onEnter={this.handleEnter}
            />
          </div>
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="exception_reason"
              field={this.fields.exception_reason}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
              onEnter={this.handleEnter}
            />
          </div>
          <div className="panel2 flex" style={{float:"left"}}>
            <FlexButton
              icon="report"
              label="intransitEdit.exception"
              onClick={this.doExceptionReason}
              disabled={this.canException()}
            />
          </div>
        </div>
      </div>
      <div className="box10 flex">
        <div className="box8">
          <div className="panel8" style={{borderLeft:'1px solid #eee',paddingLeft:'7px'}}>
            <FlexDataTable
              fields={this.intransitListTable}
              data={this.state.intransitListItems}
              key="stockin_id"
              displayRows={8}
              footer={intransitListFooter}
            />
          </div>
        </div>
      </div>
      </div>
    );
  }
});

module.exports = PickupReceipt;
