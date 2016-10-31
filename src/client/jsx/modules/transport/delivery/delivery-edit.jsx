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

var deliveryActions = require('./actions');

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
    Reflux.listenTo(deliveryActions.addBarcode.done, 'onAddBarcodeDoneAction'),
    Reflux.listenTo(deliveryActions.addBarcode.error, 'onAddBarcodeErrorAction'),
    Reflux.listenTo(deliveryActions.saveDelivery.done, 'onSaveDeliveryDoneAction'),
    Reflux.listenTo(deliveryActions.saveDelivery.error, 'onSaveDeliveryErrorAction'),
    Reflux.listenTo(deliveryActions.updateDelivery.done, 'onUpdateDeliveryDoneAction'),
    Reflux.listenTo(deliveryActions.updateDelivery.error, 'onUpdateDeliveryErrorAction'),
    Reflux.listenTo(deliveryActions.getDeliveryItemById.done, 'onGetDeliveryItemByIdDoneAction'),
    Reflux.listenTo(deliveryActions.getDeliveryItemById.error, 'onGetDeliveryItemByIdErrorAction'),
    Reflux.listenTo(deliveryActions.genDeliveryReport.done, 'onGenDeliveryReportDoneAction'),
    Reflux.listenTo(deliveryActions.genDeliveryReport.error, 'onGenDeliveryReportErrorAction')
  ],
  getInitialState: function() {
    var delivery_id = this.props.params.id;
    console.log('delivery_id',delivery_id);
    var me = this;
    var staff = sessionStore.getSession().staff;
    console.log('staff',staff);

    this.deliveryListTable = [
      {name:'code',label:'DeliveryTable.booking_no',width:'160px',render:function(row) {
        return (
          <div className="multiline">
            <div><span className="blue">{row.booking_no}</span></div>
          </div>
        );
      }},
      {name:'product',label:'DeliveryTable.waybill',render:function(row) {
        return (
          <div className="multiline" style={{whiteSpace:'normal'}}>{row.waybill}</div>
        );
      }},
      {name:'serial',label:'DeliveryTable.item_no',width:'160px',render:function(row) {
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
            onClick={function() {me.removeAllFromDelivery()}}
            />
        ),raw:true,width:'32px',render:function(row, i) {
        return (<span className="flaticon-clear5" onClick={function() {me.removeFromDelivery(row, i)}}/>);
      }}
    ];

    this.fields = {
      delivery_no: {
        id:'delivery_no',
        type:'text',
        label:'deliveryEdit.delivery_no',
        readonly: true
      },
      delivery_date: {
        id: 'delivery_date',
        type: 'date',
        label: 'deliveryEdit.delivery_date',
        autofocus:true,
      },
      display_status: {
        id: 'display_status',
        type: 'text',
        label: '',
        readonly: true
      },
      driver:{
        id:'driver',
        type: 'text',
        label: 'deliveryEdit.driver'
      },
      license:{
        id: 'license',
        type: 'license',
        label: 'deliveryEdit.license'
      },
      from: {
        id:'from',
        type: 'text',
        label:'deliveryEdit.from',
        readonly:true
      },
      to: {
        id:'to',
        type:'text',
        label:'deliveryEdit.to',
        readonly:true
      },
      prepare_by: {
        id:'prepare_by',
        type: 'text',
        label:'deliveryEdit.prepare_by',
        readonly:true
      },
      remark: {
        id:'remark',
        type:'text',
        label:'deliveryEdit.remark'
      },
      item_no: {
        id:'item_no',
        type: 'text',
        label:'deliveryEdit.item_no'
      }
    }

    return {
      delivery_id: delivery_id,
      data: {
        delivery_no:'',
        delivery_date:helper.dateToString(new Date()),
        status:'active',
        display_status:'ACTIVE',
        from:'',
        to:'',
        prepare_by: staff.display_name,
        remark:'',
        item_no:'',
        driver:'',
        license:'',
      },
      delivery_qty:0,
      deliveryListItems:[],
      item_no:'',
      pickup_no:'',
      staff_id: staff.id,
      prev_status:'active'
    }
  },

  componentDidMount: function() {
    console.log(system.sessionStore.getSession());
    if (this.state.delivery_id != '0' || this.state.delivery_id != 0) {
      // console.log("com");
      deliveryActions.getDeliveryItemById(this.state.delivery_id);
    }
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
    console.log("deliveryListItems = ", this.state.deliveryListItems);
    if(this.state.data.from == ''){
      this.state.data.from = res.country_origin;
    }
    if (this.state.data.to == '') {
      this.state.data.to = res.country_destination;
    }
    var existing = {};
    this.state.deliveryListItems.forEach(function(item) {
      existing[item.booking_item_no] = true;
    });

    if(!existing[res.booking_item_no]){
      this.state.deliveryListItems.push(res);
    } else {
      toasterActions.pop({
        type:'warning',
        message:"ยิงไปแล้ว"
      });
      return;
    }
    this.state.data.item_no = "";
    this.setState({
      deliveryListItems: this.state.deliveryListItems,
      data:this.state.data
    });
  },

  onAddBarcodeErrorAction: function(error) {
    toasterActions.pop({
      type:'warning',
      message:"Don't have this item."
    });
  },

  onGetDeliveryItemByIdDoneAction: function(res){
    console.log('res:',res);
    var getdata = res.delivery;
    this.state.data.delivery_no = getdata.delivery_no;
    this.state.data.status = getdata.status;
    this.state.data.from = getdata.from;
    this.state.data.to = getdata.to;
    this.state.data.remark = getdata.remark;
    this.state.data.delivery_date = getdata.delivery_date;
    this.state.prev_status = getdata.status;
    this.state.data.driver = getdata.driver;
    this.state.data.license = getdata.license;
    this.state.data.display_status = getdata.display_status;
    this.setState({
      data:this.state.data,
      prev_status:this.state.prev_status,
      deliveryListItems: res.item_list
    });
  },

  onSaveDeliveryDoneAction: function(res) {
    console.log("save complete data = ", res);
    this.state.data.delivery_no = "";
    this.state.data.from = "";
    this.state.data.to = "";
    this.state.data.delivery_date = helper.dateToString(new Date());
    this.state.data.remark = "";
    this.state.data.driver = "";
    this.state.data.license = "";
    this.state.delivery_qty = 0;
    this.setState({
      deliveryListItems: [],
      data:this.state.data,
      delivery_qty:this.state.delivery_qty,
      prev_status:'active'
    });
    toasterActions.pop({
      type:'success',
      message:'Save complete.'
    });
    console.log("this = ", this.state.deliveryListItems, this.state.data, this.state.delivery_qty);
    deliveryActions.genDeliveryReport({delivery_id:res.delivery_id});
  },

  onSaveDeliveryErrorAction: function(error){
    toasterActions.pop({
      type:'warning',
      message:"Can't save data."
    });
  },


  onUpdateDeliveryDoneAction: function(res){
    console.log("update complete data = ", res);
    this.state.data.delivery_no = "";
    this.state.data.from = "";
    this.state.data.to = "";
    this.state.data.delivery_date = helper.dateToString(new Date());
    this.state.data.remark = "";
    this.state.data.driver = "";
    this.state.data.license = "";
    this.state.delivery_qty = 0;
    this.setState({
      deliveryListItems: [],
      data:this.state.data,
      delivery_qty:this.state.delivery_qty,
      prev_status:'active',
      delivery_id:0
    });
    toasterActions.pop({
      type:'success',
      message:'Update complete.'
    });
    console.log("this = ", this.state.deliveryListItems, this.state.data, this.state.delivery_qty, this.state.delivery_id);
    deliveryActions.genDeliveryReport({delivery_id:res.delivery_id});
  },

  onUpdateDeliveryErrorAction: function(){
    toasterActions.pop({
      type:'warning',
      message:"Can't update data."
    });
  },

  onGenDeliveryReportDoneAction: function(res){
    window.open(res.pdfFile);
  },

  onGenDeliveryReportErrorAction: function(error){
    console.log("error = ", error);
    toasterActions.pop({
      type:'warning',
      message:"Can't gen report."
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
    deliveryActions.addBarcode({item_no:value});
  },

  removeFromDelivery: function(row, i){
    this.state.deliveryListItems.splice(i, 1);
    this.setState({
      deliveryListItems: this.state.deliveryListItems
    });
  },

  removeAllFromDelivery: function(){
    this.setState({
      deliveryListItems: []
    });
  },

  canSave: function() {
    if (this.state.delivery_id != 0 || this.state.delivery_id != '0') {
      console.log('StatusCanSave = ',this.state.prev_status );
      if (this.state.prev_status =='active'){
        return false;
      }
      return true;
    }
  },

  doSave: function(){
    if(this.state.deliveryListItems.length == 0){
      toasterActions.pop({
        type:'warning',
        message:"Don't have item."
      });
      this.refs.item_no.setFocus();
      return;
    }
    var param = {
      delivery_qty: this.state.delivery_qty,
      delivery_id: this.state.delivery_id,
      staff_id: this.state.staff_id,
      delivery_no: this.state.data.delivery_no,
      delivery_date: this.state.data.delivery_date,
      status: this.state.data.status,
      from: this.state.data.from,
      to: this.state.data.to,
      prepare_by: this.state.staff_id,
      remark: this.state.data.remark,
      item_no: this.state.data.item_no,
      driver: this.state.data.driver,
      license: this.state.data.license,
      deliveryListItems: this.state.deliveryListItems
    };
    console.log("param = ", param);

    if(this.state.delivery_id == 0 || this.state.delivery_id == '0'){
      console.log("Save Delivery");
      deliveryActions.saveDelivery(param);
    }else {
      console.log("Update Delivery");
      deliveryActions.updateDelivery(param);
    }
  },

  canPrint: function() {
    if (this.state.delivery_id == 0 || this.state.delivery_id == '0') {
      return true;
    }else {
      return false;
    }
  },

  doPrint: function(){
    console.log("doPrint");
    // deliveryActions.genDeliveryReport({delivery_id:this.state.delivery_id});
    if (this.state.delivery_id == 0 || this.state.delivery_id == '0'){
      console.log("Don't print ");
      return;
    } else {
      console.log("doprint");
      window.open("/output/delivery/delivery_" + this.state.delivery_id + ".pdf");
    }
  },

  render: function() {
    var deliveryListSummary = {
      count:0,
    };
    deliveryListSummary = this.state.deliveryListItems.reduce(function(prev, row) {
      return {
        count: prev.count+1
      };
    }, deliveryListSummary);

    this.state.delivery_qty = deliveryListSummary.count;

    var deliveryListFooter = (
      <tr>
        <td>Total</td>
        <td className="right"></td>
        <td className="right blue" style={{fontSize:'16px'}}>{deliveryListSummary.count} Item</td>
        <td></td>
      </tr>
    );
    return (
      <div className="flex-form">
      <div className="box10-flex">
        <div className="panel10 flex">
          <h3>Receive delivery container</h3>
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
              field={this.fields.delivery_no}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="delivery_date"
              field={this.fields.delivery_date}
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
            <FlexTextInput
              ref="from"
              field={this.fields.from}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="to"
              field={this.fields.to}
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
              ref="driver"
              field={this.fields.driver}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="license"
              field={this.fields.license}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel2 flex" style={{float:"left"}}>
            <FlexButton icon="email107"
              label="deliveryEdit.save"
              default={true}
              onClick={this.doSave}
              disabled={this.canSave()}
            />
          </div>
        </div>
        <div className="box8">
          <div className="panel6 flex" style={{float:"left",width:"545px"}}>
            <FlexTextInput
              ref="remark"
              field={this.fields.remark}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
            />
          </div>
          <div className="panel2 flex" style={{float:"left"}}>
            <FlexButton icon="email107"
              label="deliveryEdit.print"
              onClick={this.doPrint}
              disabled={this.canPrint()}
            />
          </div>
        </div>
        <div className="box8">
          <div className="panel3 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="item_no"
              field={this.fields.item_no}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
              onEnter={this.handleEnter}
            />
          </div>
        </div>
      </div>
      <div className="box10 flex">
        <div className="box8">
          <div className="panel8" style={{borderLeft:'1px solid #eee',paddingLeft:'7px'}}>
            <FlexDataTable
              fields={this.deliveryListTable}
              data={this.state.deliveryListItems}
              key="stockin_id"
              displayRows={8}
              footer={deliveryListFooter}
            />
          </div>
        </div>
      </div>
      </div>
    );
  }
});

module.exports = PickupReceipt;
