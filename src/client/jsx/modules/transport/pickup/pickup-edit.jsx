var React       = require('react');
import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';
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

var actions  = require('./actions');

var FlexDropdown  = widget.FlexDropdown;
var FlexTextInput = widget.FlexTextInput;
var FlexButton    = widget.FlexButton;
var FlexDataTable = widget.FlexDataTable;
var FlexCheckbox  = widget.FlexCheckbox;

var divauto = {
    height:"30px",
    width:"98%",
    border:"1px solid lightgray",
    borderRadius:'4px',
    padding:"3px 3px 0px 3px",
    fontSize:'14px'
};
var textFieldsNonHr = {
    height:"100%",
    width:"100%",
    fontSize:'14px'
};

var s_data_reset = {
  booking_no:"",
  customer:"",
  waybill:"",
  pickup_date:new Date().toJSON().slice(0,10),
  district:""
};

var r_staff = '';
var r_staff_id = '';
var r_prepare_by = '';

var Screen = React.createClass({
  mixins: [
    // Reflux.listenTo(actions.getPV.done, 'onGetPVDoneActon'),
    Reflux.listenTo(actions.getSearchBookingWait.done, 'onGetSearchBookingWaitDoneAction'),
    Reflux.listenTo(actions.getSearchBookingWait.error, 'onGetSearchBookingWaitErrorAction'),
    Reflux.listenTo(actions.savePickup.done, 'onSavePickupDoneAction'),
    Reflux.listenTo(actions.savePickup.error, 'onSavePickupErroreAction'),
    Reflux.listenTo(actions.updatePickup.done, 'onUpdatePickupDoneAction'),
    Reflux.listenTo(actions.updatePickup.error, 'onUpdatePickupErrorAction'),
    Reflux.listenTo(actions.getPU.done, 'onGetPUDoneAction'),
    Reflux.listenTo(actions.getPU.error, 'onGetPUErrorAction'),
    Reflux.listenTo(actions.genPrintPickup.done, 'onGenPrintPickupDoneAction'),
    Reflux.listenTo(actions.genPrintPickup.error, 'onGenPrintPickupErrorAction'),
    Reflux.listenTo(actions.getAutoComplete.done, 'onGetAutoCompleteDoneAction'),
    Reflux.listenTo(actions.getAutoComplete.error, 'onGetAutoCompleteErrorAction')
  ],

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    var id = this.props.params.id;
    console.log('id',id);
    var me = this;
    var staff = sessionStore.getSession().staff;
    console.log('staff',staff);
    r_staff_id = staff.id;
    r_staff = staff.display_name;
    r_prepare_by = staff.display_name;

    this.fields = {
      booking_no: {
        id:'booking_no',
        type:'text',
        label:'pickupEdit.booking_no',
        autofocus:true,
        tabIndex:1
      },
      customer: {
        id:'customer',
        type:'text',
        label:'pickupEdit.customer',
        tabIndex:2
      },
      pickup_no: {
        id:'pickup_no',
        type:'text',
        label:'pickupEdit.pickup_no',
        readonly:true
      },
      pickup_date_set: {
        id:'pickup_date_set',
        type: 'date',
        label:'pickupEdit.pickup_date_set',
        tabIndex:6
      },
      waybill: {
        id:'waybill',
        type:'text',
        label:'pickupEdit.waybill',
        tabIndex:3
      },
      pickup_date: {
        id:'pickup_date',
        tabIndex:4,
        type:'date',
        label:'pickupEdit.pickup_date'
      },
      prepare_by: {
        id:'prepare_by',
        type:'text',
        label:'pickupEdit.prepare_by',
        readonly:true
      },
      driver: {
        id:'driver',
        type:'text',
        label:'pickupEdit.driver',
        tabIndex:7
      },
      district: {
        id:'district',
        type:'text',
        label:'pickupEdit.district',
        tabIndex:5
      },
      remark: {
        id:'remark',
        type:'text',
        label:'pickupEdit.remark',
        tabIndex:8
      },
      display_status: {
        id:'display_status',
        // list:[
        //   {value:'active', text:tr.translate('pickupEdit.status.active')},
        //   {value:'receipted', text:tr.translate('pickupEdit.status.receipted')},
        //   {value:'cancel', text:tr.translate('pickupEdit.status.cancel')}
        // ],
        type:'text',
        readonly:true
      }
    };

    this.bookingBoxTable = [
      {name:'code',label:'bookingSearchTable.booking_no',width:'112px',render:function(row) {
        return (
          <div className="multiline">
            <div><span>{row.booking_no}</span></div>
          </div>
        );
      }},
      {name:'product',label:'bookingSearchTable.customer',render:function(row) {
        return (
          <div className="multiline">
            <div className="ellipsis" title={row.firstname}>{row.firstname}</div>
          </div>
        );
      }},
      {name:'cost',label:'bookingSearchTable.qty',width:'88px',render:function(row) {
        return (
          <div className="multiline">
            <div className="right green">{row.item_qty || 1}</div>
          </div>
        );
      }},
      {name:'chk',label:(
          <span
            className="flaticon-right244"
            title={tr.translate('finance.pv.search_table.select_all')}
            onClick={function() {me.addAllToPickup()}}
            />
        ),raw:true,width:'32px',render:function(row, i) {
          if (row.status=='WAIT_ASSIGN' || me.state.prevItems[row.stockin_id]) {
            return (<span className="flaticon-right237" onClick={function(){me.addToPickup(row, i)}}/>);
          } else {
            return null;
          }
      }}
    ];

    this.pickupTable = [
      {name:'code',label:'pickupTable.booking_no',width:'160px',render:function(row) {
        return (
          <div className="multiline">
            <div><span className="blue">{row.booking_no}</span></div>
          </div>
        );
      }},
      {name:'product',label:'pickupTable.customer',render:function(row) {
        return (
          <div className="multiline" style={{whiteSpace:'normal'}}>{row.firstname}</div>
        );
      }},
      {name:'serial',label:'pickupTable.package_content',width:'160px',render:function(row) {
        return (
          <div className="multiline">
            <div className="green">{row.package_contents_p}</div>
          </div>
        );
      }},
      {name:'cost',label:'pickupTable.qty',width:'104px',render:function(row) {
        return (
          <div className="multiline">
            <div className="right">{row.item_qty || 1}</div>
          </div>
        );
      }},
      {name:'chk',label:(
          <span
            className="flaticon-clear5"
            title={tr.translate('pickupTable.remove_all')}
            onClick={function() {me.removeAllFromPickup()}}
            />
        ),raw:true,width:'32px',render:function(row, i) {
        return (<span className="flaticon-clear5" onClick={function() {me.removeFromPickup(row, i)}}/>);
      }}
    ];

    return {
      s_data:helper.clone(s_data_reset),
      pu:{
        id:id,
        pickup_no:'',
        code:'',
        pickup_date_set:helper.dateToString(new Date()),
        booking_id:0,
        booking:'',
        staff_id:staff.id,
        staff:staff.display_name,
        prepare_by:staff.display_name,
        driver:'',
        remark:'',
        status:'active',
        display_status:'ACTIVE',
        booking_qty:0,
        booking_item_qty:0,
        vehicle:''
      },
      bookingBox:[],
      puItems:[],
      prevItems:{},
      prev_status:'active',
      vehicleList:[],
      driverList:[]
    };
  },

  componentDidMount: function() {
    //infoPanelActions.show('finance.pu.list', null);
    if (this.state.pu.id != '0' || this.state.pu.id != 0) {
      actions.getPU(this.state.pu.id);
    }
    actions.getAutoComplete();
    // $("#pickup_date").attr("tabIndex","4");
  },

  handleSearchChange: function(id, value) {
    this.state.s_data[id] = value;
    this.setState({
      s_data: this.state.s_data
    });
  },

  handlePuChange: function(id, value) {
    this.state.pu[id] = value;
    this.setState({
      pu: this.state.pu
    });
  },

  doSearch: function(){
    console.log("do Search = ", this.state.s_data);
    var obj = this.state.s_data;
    actions.getSearchBookingWait(obj);
  },

  onGetSearchBookingWaitDoneAction: function(result){
    console.log("onGetSearchBookingWaitDoneAction = ", result);

    if (result.length==0) {
      toasterActions.pop({
        type:'warning',
        message:'ไม่พบรายการตามที่ระบุ'
      });
    }

    var existing = {};
    this.state.puItems.forEach(function(item) {
      existing[item.booking_id] = true;
    });
    // console.log("existing[item.booking_id] = ", existing);
    this.setState({
      bookingBox: result.filter(function(row) {
        // console.log("existing[row.booking_id] = ", row.booking_id, "  ddd = ", existing[row.booking_id], " row = ", row);
        return !existing[row.booking_id]
      })
    });
    // console.log("bookingBox = ", this.state.bookingBox);
    // console.log("booking_id = ", result[0].id, result[0].booking_id);
    this.state.pu.booking_id = result[0].id;
    this.state.pu.booking_no = result[0].booking_no;
    this.setState({
      pu:this.state.pu
    });
    console.log('Code:',this.state.pu.booking_no,',id:',this.state.pu.booking_id);
  },

  onGetSearchBookingWaitErrorAction: function(error){
    toasterActions.pop({
      type:'warning',
      message:error
    });
  },

  onGetPUDoneAction: function(result){
    var prevItems = {};
    // console.log('onGetPUDoneAction :',result);
    result.pu_items.forEach(function(item) {
      prevItems[item.id] = true;
    });

    // console.log('Status2 : ' , result.pu.status)
    this.setState({
      pu: result.pu,
      puItems: result.pu_items,
      prevItems: prevItems,
      prev_status: result.pu.status
    });
    this.refs.vehicle.setValue(this.state.pu.vehicle);
    this.refs.driver.setValue(this.state.pu.driver);
    // console.log("pu state = ", this.state.pu);
  },

  onGetPUErrorAction: function(error){
    this.state.pu.id = 0;
    this.setState({
      pu: this.state.pu
    }, function() {
      toasterActions.pop({
        type:'warning',
        message:'ไม่พบรายการรับของ'
      });
    });
  },

  addToPickup: function(row, i) {
    this.state.puItems.unshift(this.state.bookingBox[i]);
    this.state.bookingBox.splice(i,1);
    this.setState({
      puItems: this.state.puItems,
      bookingBox: this.state.bookingBox
    });
    console.log("addToPickup : ",this.state.puItems);
  },

  addAllToPickup: function() {
    var cnt = 0;
    this.state.bookingBox.forEach(function(row) {
      if (row.status=='WAIT_ASSIGN') {
        this.state.puItems.unshift(row);
        cnt++;
      }
    }.bind(this));
    var len = this.state.bookingBox.length;
    for (var i = len-1; i >= 0; i--) {
      if (this.state.bookingBox[i].status=='WAIT_ASSIGN') {
        this.state.bookingBox.splice(i,1);
      }
    }
    if (cnt==0) {
      toasterActions.pop({
        type:'warning',
        message:'ไม่มีรายการที่จะเพิ่ม'
      });
    } else {
      this.setState({
        puItems: this.state.puItems,
        bookingBox: this.state.bookingBox
      });
    }
  },

  removeFromPickup: function(row, i) {
    var item = this.state.puItems.splice(i, 1);
    var hasChange = this.addBackToBookingBox(item);
    var obj = {
      puItems: this.state.puItems
    };
    if (hasChange) {
      obj.bookingBox = this.state.bookingBox;
    }
    this.setState(obj);
  },

  removeAllFromPickup: function() {
    var hasChange = this.addBackToBookingBox(this.state.puItems);
    var obj = {
      puItems: []
    };
    if (hasChange) {
      obj.bookingBox = this.state.bookingBox;
    }
    this.setState(obj);
  },

  addBackToBookingBox: function(items) {
    var filterBooking = this.state.s_data.booking_no.replace('%','');
    var filterCustomer = this.state.s_data.customer.replace('%', '');
    var filterWaybill = this.state.s_data.waybill.replace('%', '');
    if (filterBooking=="" && filterCustomer=="" && filterWaybill=="") {
      items.forEach(function(item) {
        this.state.bookingBox.push(item);
      }.bind(this));
      return true;
    }
    var hasChange = false;
    items.forEach(function(item) {
      if (filterBooking!='' && (item.booking_no==filterBooking || item.booking_no.indexOf(filterBooking) != -1)) {
        this.state.bookingBox.unshift(item);
        hasChange = true;
        return;
      }
      if (filterCustomer!='' && (item.firstname==filterCustomer || item.firstname.indexOf(filterCustomer) != -1)) {
        this.state.bookingBox.unshift(item);
        hasChange = true;
        return;
      }
      if (filterWaybill!='' && (item.waybill==filterWaybill || item.waybill.indexOf(filterWaybill)!=-1)) {
        this.state.bookingBox.unshift(item);
        hasChange = true;
        return;
      }
    }.bind(this));
    return hasChange;
  },

  canSave: function() {
    if (this.state.pu.id != 0 || this.state.pu.id != '0') {
      console.log('StatusCanSave = ',this.state.prev_status );
      if (this.state.prev_status =='active'){
        return false;
      }
      return true;
    }
  },

  doSave: function(){
    console.log(this.state.pu.id);
    if (this.state.puItems.length==0) {
      toasterActions.pop({type:'warning',message:'ยังไม่มีรายการ'});
      return;
    }
    if (this.state.pu.driver.trim()==''){
      toasterActions.pop({type:'warning',message:'กรุณาระบุคนไปรับสินค้า'});
      this.refs.driver.setFocus();
      return;
    }
    if (this.state.pu.vehicle == ''){
      toasterActions.pop({type:'warning',message:'กรุณาระบุทะเบียนรถ'});
      // this.refs.vehicle.setFocus();
      return;
    }
    var param = {
      pu: this.state.pu,
      pu_items: this.state.puItems
    };
    // console.log('param = ', param);
    if (this.state.pu.id == 0 || this.state.pu.id == '0'){
      console.log("save data = ", param);
      actions.savePickup(param);
    } else {
      console.log("Update data = ", param);
      actions.updatePickup(param);
    }

  },

  canPrint: function() {
    if (this.state.pu.id == 0 || this.state.pu.id == '0') {
      return true;
    }else {
      return false;
    }
  },

  doPrint:function(){
    if (this.state.pu.id == 0 || this.state.pu.id == '0'){
      console.log("Don't print ");
      return;
    } else {
      console.log("doprint");
      // /output/pickup/pickup_40.pdf
      window.open("/output/pickup/pickup_" + this.state.pu.id + ".pdf");
      // actions.printPickup(param);
      // actions.testprintPickup({pickup_id:this.state.pu.id});
    }
  },

  onGenPrintPickupDoneAction: function(res) {
    if (this.state.pu.id == 0 || this.state.pu.id == '0'){
      window.open(res.pdfFile);
    } else {
      console.log("Just Update.");
    }
  },

  onGenPrintPickupErrorAction: function(error) {
    console.log("error = ", error);
    toasterActions.pop({
      type:'warning',
      message:"Can't gen report."
    });
  },

  onSavePickupDoneAction: function(data){
    console.log("save complete data = ", data);
    toasterActions.pop({
      type:'success',
      message:'Save pickup complete.'
    });
    actions.genPrintPickup({pickup_id:data.pickup_id});
    this._resetData();
  },

  onSavePickupErroreAction: function(error){
    console.log("Error");
    toasterActions.pop({
      type:'warning',
      message:error
    });
  },

  onUpdatePickupDoneAction: function(data) {
    actions.genPrintPickup({pickup_id:this.state.pu.id});
    this._resetData();
    toasterActions.pop({
      type:'success',
      message:'Update pickup complete.'
    });
  },

  onUpdatePickupErrorAction: function(error) {
    console.log("Error");
    toasterActions.pop({
      type:'warning',
      message:error
    });
  },

  _resetData: function(){
    this.state.pu.id = 0;
    this.state.pu.pickup_no = '';
    this.state.pu.code = '';
    this.state.pu.pickup_date_set = helper.dateToString(new Date());
    this.state.pu.booking_id = 0;
    this.state.pu.booking = '';
    this.state.pu.staff_id = r_staff_id;
    this.state.pu.staff = r_staff;
    this.state.pu.prepare_by = r_prepare_by;
    this.state.pu.driver = '';
    this.state.pu.remark = '';
    this.state.pu.status = 'active';
    this.state.pu.booking_qty = 0;
    this.state.pu.booking_item_qty = 0;

    this.setState({
      pu: this.state.pu,
      s_data:helper.clone(s_data_reset),
      bookingBox:[],
      puItems:[],
      prevItems:{},
      prev_status:'active'
    });
  },

  onGetAutoCompleteDoneAction: function(res){
    console.log("Getautocomplete done = ", res);
    this.setState({
      driverList: res.driver,
      vehicleList: res.vehicle
    })
  },

  onGetAutoCompleteErrorAction : function(error){
    console.log("getAutoComplete error = ", error);
    toasterActions.pop({type:'warning',message:"Can't get autocomplete data"});
  },

  handleChangeAutocomVehicle: function(data,other) {
    // console.log("data = ", a);
    // console.log("other = ", b);
    this.state.pu.vehicle = data;
    this.setState({
      pu: this.state.pu
    })
  },

  handleChangeAutocomDriver: function(data,other) {
    // console.log("data = ", a);
    // console.log("other = ", b);
    this.state.pu.driver = data;
    this.setState({
      pu: this.state.pu
    })
  },

  render: function() {
    var searchSummary = {
      count:0,
      qty:0,
      amount:0
    };
    searchSummary = this.state.bookingBox.reduce(function(prev, row) {
      return {
        count: prev.count+1,
        qty: prev.qty + row.item_qty
      }
    }, searchSummary);
    var bookingBoxFooter = (
      <tr>
        <td className="right"><div style={{width:"103px"}}></div></td>
        <td className="right"><div style={{width:"109px"}}>{searchSummary.count} Booking</div></td>
        <td className="right"><div style={{width:"79px"}}>{searchSummary.qty} Item</div></td>
        <td><div style={{width:"40px"}}></div></td>
      </tr>
    );

    var pickupSummary = {
      count:0,
      qty:0,
      amount:0,
      vat_amount:0
    };
    pickupSummary = this.state.puItems.reduce(function(prev, row) {
      return {
        count: prev.count+1,
        qty: prev.qty + row.item_qty
      };
    }, pickupSummary);

    this.state.pu.total_amount = pickupSummary.amount;
    this.state.pu.vat_amount = pickupSummary.vat_amount;
    this.state.pu.net_amount = this.state.pu.total_amount + this.state.pu.vat_amount - this.state.pu.cn_amount;
    this.state.pu.booking_qty = pickupSummary.count;
    this.state.pu.booking_item_qty = pickupSummary.qty;

    var pickupFooter = (
      <tr>
        <td>Total</td>
        <td className="right">{pickupSummary.count} booking</td>
        <td className="right"></td>
        <td className="right blue" style={{fontSize:'16px'}}>{pickupSummary.qty} Item</td>
        <td></td>
      </tr>
    );

    return (
      <div className="flex-form">
      <div className="box10">
        <div className="panel5 flex">
          <p>Pickup schedule</p>
        </div>
      </div>
        <div className="box10 flex">
          <div className="box4">
            <div className="panel4 flex">
              <FlexTextInput
                field={this.fields.booking_no}
                data={this.state.s_data}
                onChange={this.handleSearchChange}
                />
              <div style={{width:'8px'}} className="no-shrink"></div>
              <FlexTextInput
                field={this.fields.customer}
                data={this.state.s_data}
                onChange={this.handleSearchChange}
                />
            </div>
          </div>
          <div className="box4">
            <div className="panel4 flex">
              <FlexTextInput
                field={this.fields.pickup_no}
                data={this.state.pu}
                onChange={this.handlePuChange}
                />
              <div style={{width:'8px'}} className="no-shrink"></div>
              <FlexTextInput
                field={this.fields.pickup_date_set}
                data={this.state.pu}
                onChange={this.handlePuChange}
                />
            </div>
          </div>
          <div className="box2">
            <div className="panel2 flex">
              <FlexTextInput
                field={this.fields.display_status}
                data={this.state.pu}
                onChange={this.handlePuChange}
                />
            </div>
          </div>
        </div>
        <div className="box10 flex">
          <div className="box4">
            <div className="panel4 flex">
              <FlexTextInput
                field={this.fields.waybill}
                data={this.state.s_data}
                onChange={this.handleSearchChange}
                />
              <div style={{width:'8px'}} className="no-shrink"></div>
              <FlexTextInput
                field={this.fields.pickup_date}
                data={this.state.s_data}
                onChange={this.handleSearchChange}
                />
            </div>
          </div>
          <div className="box4">
            <div className="panel4 flex">
              <FlexTextInput
                field={this.fields.prepare_by}
                data={this.state.pu}
                onChange={this.handlePuChange}
                />
              <div style={{width:'8px'}} className="no-shrink"></div>
              <div style={divauto}>
              <AutoComplete
                ref="driver"
                id="driver"
                hintText="driver"
                tabIndex={7}
                filter={AutoComplete.noFilter}
                dataSource={this.state.driverList}
                style={textFieldsNonHr}
                underlineShow={false}
                hintStyle={{bottom:'0px',fontSize:'14px',textAlign:'right'}}
                onUpdateInput={this.handleChangeAutocomDriver}
                onNewRequest={this.handleChangeAutocomDriver}
                filter={AutoComplete.caseInsensitiveFilter}
              />
              </div>
            </div>
          </div>
          <div className="box2">
            <div className="panel2 flex">
              <FlexButton icon="email107"
                label="pickupEdit.save"
                default={true}
                onClick={this.doSave}
                disabled={this.canSave()}
              />
            </div>
          </div>
        </div>
        <div className="box10 flex">
          <div className="box4">
            <div className="panel4 flex">
              <FlexTextInput
                field={this.fields.district}
                data={this.state.s_data}
                onChange={this.handleSearchChange}
                />
              <div style={{width:'8px'}} className="no-shrink"></div>
              <FlexButton icon="search100"
                label="pickupEdit.search"
                default={true}
                onClick={this.doSearch}
              />
            </div>
          </div>
          <div className="box4">
            <div className="panel4 flex">
              <FlexTextInput
                field={this.fields.remark}
                data={this.state.pu}
                onChange={this.handlePuChange}
              />
              <div style={{width:'8px'}} className="no-shrink"></div>
              <div style={divauto}>
              <AutoComplete
                ref="vehicle"
                id="vehicle"
                hintText="vehicle"
                tabIndex={9}
                filter={AutoComplete.noFilter}
                dataSource={this.state.vehicleList}
                style={textFieldsNonHr}
                underlineShow={false}
                hintStyle={{bottom:'0px',fontSize:'14px',textAlign:'right'}}
                onUpdateInput={this.handleChangeAutocomVehicle}
                onNewRequest={this.handleChangeAutocomVehicle}
                filter={AutoComplete.caseInsensitiveFilter}
              />
              </div>
            </div>
          </div>
          <div className="box2">
            <div className="panel2 flex">
              <FlexButton icon="printer88"
                label="pickupEdit.print"
                onClick={this.doPrint}
                disabled={this.canPrint()}
              />
            </div>
          </div>
        </div>

        <div className="box10 flex">
          <div className="box4">
            <div className="panel4" style={{borderRight:'1px solid #eee',paddingRight:'1px'}}>
              <FlexDataTable
                fields={this.bookingBoxTable}
                data={this.state.bookingBox}
                key="stockin_id"
                displayRows={8}
                footer={bookingBoxFooter}
                />
            </div>
          </div>
          <div className="box6">
            <div className="panel6" style={{borderLeft:'1px solid #eee',paddingLeft:'7px'}}>
              <FlexDataTable
                fields={this.pickupTable}
                data={this.state.puItems}
                key="stockin_id"
                displayRows={8}
                footer={pickupFooter}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Screen;
