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

var pickupReceiptActions = require('./actions');

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
    Reflux.listenTo(pickupReceiptActions.addBarcode.done, 'onAddBarcodeDoneAction'),
    Reflux.listenTo(pickupReceiptActions.addBarcode.error, 'onAddBarcodeErrorAction'),
    Reflux.listenTo(pickupReceiptActions.savePickupReceipt.done, 'onSavePickupReceiptAction'),
    Reflux.listenTo(pickupReceiptActions.savePickupReceipt.error, 'onSavePickupReceiptErrorAction')
  ],
  getInitialState: function() {
    var me = this;
    var staff = sessionStore.getSession().staff;
    console.log('staff',staff);

    this.pickupReceiptTable = [
      {name:'code',label:'pickupReceiptTable.pickup_no',width:'160px',render:function(row) {
        return (
          <div className="multiline">
            <div><span className="blue">{row.pickup_no}</span></div>
          </div>
        );
      }},
      {name:'product',label:'pickupReceiptTable.booking_no',render:function(row) {
        return (
          <div className="multiline" style={{whiteSpace:'normal'}}>{row.booking_no}</div>
        );
      }},
      {name:'serial',label:'pickupReceiptTable.item_no',width:'160px',render:function(row) {
        return (
          <div className="multiline">
            <div className="green">{row.item_no}</div>
          </div>
        );
      }},
      {name:'chk',label:(
          <span
            className="flaticon-clear5"
            title={tr.translate('pickupTable.remove_all')}
            onClick={function() {me.removeAllFromReceipPickup()}}
            />
        ),raw:true,width:'32px',render:function(row, i) {
        return (<span className="flaticon-clear5" onClick={function() {me.removeFromReceipPickup(row, i)}}/>);
      }}
    ];

    this.fields = {
      item_no: {
        id:'item_no',
        type:'text',
        label:'pickupReceiptTable.item_nos'
      },
    }

    return {
      data: {
        item_no:''
      },
      receipt_qty:0,
      puReceiptItems:[],
      item_no:'',
      pickup_no:''
    }
  },

  componentDidMount: function() {
    console.log(system.sessionStore.getSession());
    if(this.state.puReceiptItems.length > 0){
      console.log("puReceiptItems > 0");
      this.setState({
        puReceiptItems: []
      });
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
    console.log(res.pickup_no);
    if (this.state.pickup_no==""){
      this.state.pickup_no = res.pickup_no;
      this.setState({
        pickup_no: this.state.pickup_no
      });
    }else if (this.state.pickup_no!=res.pickup_no){
      toasterActions.pop({
        type:'warning',
        message:"Pickup no not macht"
      });
      return;
    }
    //console.log("puReceiptItems = ", this.puReceiptItems);
    var existing = {};
    this.state.puReceiptItems.forEach(function(item) {
      existing[item.item_no] = true;
    });

    if(!existing[res.item_no]){
      this.state.puReceiptItems.push(res);
    } else {
      toasterActions.pop({
        type:'warning',
        message:"ยิงไปแล้ว"
      });
      return;
    }
    this.state.data.item_no = "";
    this.setState({
      puReceiptItems: this.state.puReceiptItems,
      data:this.state.data
    });
  },

  onAddBarcodeErrorAction: function(error) {
    toasterActions.pop({
      type:'warning',
      message:"Don't have this item."
    });
  },

  onSavePickupReceiptAction: function(res) {
    console.log("save complete data = ", res);
    this.setState({
      puReceiptItems: []
    });
    this.state.pickup_no = "";
    this.setState({
      pickup_no: this.state.pickup_no
    });
    var existing = {};
    toasterActions.pop({
      type:'success',
      message:'Save pickup complete.'
    });
  },

  onSavePickupReceiptErrorAction: function(error){
    console.log("Err0r");
    toasterActions.pop({
      type:'warning',
      message:"Can't save data."
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
    pickupReceiptActions.addBarcode({item_no:value});
  },

  removeFromReceipPickup: function(row, i){
    this.state.puReceiptItems.splice(i, 1);
    this.setState({
      puReceiptItems: this.state.puReceiptItems
    });
  },

  removeAllFromReceipPickup: function(){
    this.setState({
      puReceiptItems: []
    });
  },

  doSave: function(){
    if(this.state.puReceiptItems.length == 0){
      toasterActions.pop({
        type:'warning',
        message:"Don't have item."
      });
      this.refs.item_no.setFocus();
      return;
    }
    var param = {
      receipt_qty: this.state.receipt_qty,
      pickup_no: this.state.pickup_no,
      puReceiptItems: this.state.puReceiptItems
    };
    console.log("param = ", param);
    pickupReceiptActions.savePickupReceipt(param);
  },

  render: function() {
    var pickupReceiptSummary = {
      count:0,
    };
    pickupReceiptSummary = this.state.puReceiptItems.reduce(function(prev, row) {
      return {
        count: prev.count+1
      };
    }, pickupReceiptSummary);

    this.state.receipt_qty = pickupReceiptSummary.count;

    var pickupReceiptFooter = (
      <tr>
        <td>Total</td>
        <td className="right"></td>
        <td className="right blue" style={{fontSize:'16px'}}>{pickupReceiptSummary.count} Item</td>
        <td></td>
      </tr>
    );
    return (
      <div className="flex-form">
      <div className="box10-flex">
        <div className="panel10 flex">
          <h3>Receive pickup container</h3>
        </div>
      </div>
      <div className="box10-flex">
        <div className="panel10 flex">
          <h4>Receive by barcode</h4>
        </div>
      </div>
      <div className="box10-flex">
        <div className="box6">
          <div className="panel2 flex" style={{float:"left"}}>
            <FlexTextInput
              ref="item_no"
              field={this.fields.item_no}
              data={this.state.data}
              onChange={this.handleBarcodeChange}
              onEnter={this.handleEnter}
            />
          </div>
          <div className="panel2 flex" style={{float:"right"}}>
            <FlexButton icon="email107"
              label="pickupEdit.save"
              default={true}
              onClick={this.doSave}
            />
          </div>
        </div>
      </div>
      <div className="box10 flex">
        <div className="box6">
          <div className="panel6" style={{borderLeft:'1px solid #eee',paddingLeft:'7px'}}>
            <FlexDataTable
              fields={this.pickupReceiptTable}
              data={this.state.puReceiptItems}
              key="stockin_id"
              displayRows={8}
              footer={pickupReceiptFooter}
            />
          </div>
        </div>
      </div>
      </div>
    );
  }
});

module.exports = PickupReceipt;
