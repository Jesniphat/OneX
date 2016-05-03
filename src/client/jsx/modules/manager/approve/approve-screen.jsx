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

var actions  = require('./actions');

var FlexDropdown  = widget.FlexDropdown;
var FlexTextInput = widget.FlexTextInput;
var FlexButton    = widget.FlexButton;
var FlexDataTable = widget.FlexDataTable;
var FlexCheckbox  = widget.FlexCheckbox;
var FlexDisplayTable    = widget.FlexDisplayTable;


var Screen = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(actions.getBank.done,'onGetBankDoneAction'),
    Reflux.listenTo(actions.getDataDetail.done,'onGetDataDetailDoneAction'),
    Reflux.listenTo(actions.getDataMain.done,'onGetDataMainDoneAction'),
    Reflux.listenTo(actions.save.done,'onSaveDoneAction')
  ],

  getInitialState: function() {

    var id = parseInt(this.context.router.getCurrentParams().id);
    var flagClose = this.context.router.getCurrentParams().close;
    var flagDunning = this.context.router.getCurrentParams().dunning;
    var pageBack = this.context.router.getCurrentParams().pageback;
    if (!pageBack) {
      pageBack = 'manager.approve.list';
    }

    var default_today = new Date();
    default_today.setMonth(default_today.getMonth() + 0);
    var _valueToday = default_today.toJSON().slice(5,7) +'/'+ default_today.toJSON().slice(0,4);
    //console.log(_valueToday);
    return {
      id:id,
      flagClose:flagClose,
      flagDunning:flagDunning,
      pageBack:pageBack,
      genPaymentTerm:false,
      selectedItem:1,
      selectedStatus:'รอตรวจสอบ',
      data:{
        cash_daily_on_date_id:'',
        cash_daily_id:'',
        bank:'',
        bank_ref:'',
        on_date:'',
        cash_on_report:0,
        cash_transfer:0,
        receive_pending_transfer:0,
        today_pending_transfer:0,
        pastday_pending_transfer:0,
        total_pending_transfer:0,
        remark:'',
        doc_ref:'',
        status:''
      },
      datatable:[],
      statdata:{
        status:'',
        created_at:'',
        updated_at:'',
        cd_balance_date:'',
        approve_date:''
      },
      bank:{
        id:'bank',
        label:'approve.bank',
        type:'dropdown',
        list: [],
        readonly:true
      },
      searchDate:'',
      status: {
        id:'status',
        list:[
          {value:'รอตรวจสอบ', text:'รอตรวจสอบ'},
          {value:'เปิดให้แก้ไข', text:'เปิดให้แก้ไข'},
          {value:'ปิดยอด', text:'ปิดยอด'}
        ]
      }
    };
  },

  componentDidMount: function() {

    infoPanelActions.show('manage.Approve.list',
      <div className="box10 flex-form">

      </div>
    );

    console.log('stateID:',this.state);
    actions.getBank();
    actions.getDataMain(this.state.id);

  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  onGetBankDoneAction: function(data){
    this.state.bank.list = data.bank.map(function(row) {
      return {
        value: row.value,
        text: row.text
      }
    });
    console.log('selected:',this.state.selectedItem);
    this.state.data.bank = this.state.bank.list[this.state.selectedItem-1].value;
    this.state.data.bank_ref = this.state.bank.list[this.state.selectedItem-1].text;
    this.setState({
      bank: this.state.bank
    });


  },

  onGetDataMainDoneAction: function(data){
    console.log('data:',data);
    this.state.data.on_date = 'ประจำวันที่ ' + tr.localize(new Date(data.Main[0].on_date), {type:'date', format:'short'}) + ' - ' + data.Main[0].sh_name;
    this.state.statdata.created_at = tr.localize(new Date(data.Main[0].created_at), {type:'date', format:'short'});
    this.state.statdata.updated_at = tr.localize(new Date(data.Main[0].updated_at), {type:'date', format:'short'});

    if (data.Main[0].approve_date=='-'){
      this.state.statdata.approve_date = data.Main[0].approve_date;
    }else{
        this.state.statdata.approve_date = tr.localize(new Date(data.Main[0].approve_date), {type:'date', format:'short'});
    }

    if (data.Main[0].cd_balance_date=='-'){
      this.state.statdata.cd_balance_date = data.Main[0].cd_balance_date;
    }else{
      this.state.statdata.cd_balance_date = tr.localize(new Date(data.Main[0].cd_balance_date), {type:'date', format:'short'});
    }

    this.state.statdata.status = data.Main[0].status;
    this.state.searchDate = data.Main[0].created_at;
    this.state.data.cash_daily_id = data.Main[0].cash_daily_id;
    this.state.data.cash_daily_on_date_id = data.Main[0].cash_daily_on_date_id;
    //Form Price
    this.state.data.cash_on_report = data.Main[0].cash_on_report;
    this.state.data.cash_transfer = data.Main[0].cash_transfer;
    this.state.data.receive_pending_transfer = data.Main[0].receive_pending_transfer;
    this.state.data.today_pending_transfer = data.Main[0].today_pending_transfer;
    this.state.data.pastday_pending_transfer = data.Main[0].pastday_pending_transfer;
    this.state.data.total_pending_transfer = data.Main[0].total_pending_transfer;

    this.state.data.doc_ref = data.Main[0].doc_ref;
    this.state.data.remark = data.Main[0].remark;

    this.state.selectedItem = data.Main[0].bank_id;
    this.state.selectedStatus = data.Main[0].status ;


    console.log('cash_daily_on_date_id : ', data.Main[0].status,this.state.selectedStatus);

    this.setState({
      data: this.state.data,
      statdata:this.state.statdata,
      searchDate:this.state.searchDate,
      cash_daily_id:this.state.data.cash_daily_id,
      selectedItem: this.state.selectedItem,
      selectedStatus:this.state.selectedStatus
    });

    var color = 'yellow';

    if(this.state.statdata.status=='อนุมัติ' || this.state.statdata.status =='ปิดยอด'){
      color ='#b2e388';
    }else{
      color ='yellow';
    }

    actions.getDataDetail(this.state.cash_daily_id);

    infoPanelActions.show('manager.Approve.list', (
      <div className="flex-v can-grow" style={{overflowY:'auto'}}>
        <div style={{backgroundColor:color,textAlign:'center',height:'30px'}}>
            <h2>{this.state.statdata.status}</h2>
        </div>
        <div>
            <table style={{width:'100%'}}>
              <tr style={{height:'20px'}}>
                <td style={{textAlign:'left'}}><T content="approve.stat.cd_created_at"/>
                </td>
                <td style={{textAlign:'right'}}>{this.state.statdata.created_at}
                </td>
              </tr>
              <tr style={{height:'20px'}}>
                <td style={{textAlign:'left'}}>
                  <T content="approve.stat.cd_updated_at"/>
                </td>
                <td style={{textAlign:'right'}}>
                  {this.state.statdata.updated_at}
                </td>
              </tr>
              <tr style={{height:'20px'}}>
                <td style={{textAlign:'left'}}>
                  <T content="approve.stat.cd_close_date"/>
                </td>
                <td style={{textAlign:'right'}}>
                  {this.state.statdata.cd_balance_date}
                </td>
              </tr>
              <tr style={{height:'20px'}}>
                <td style={{textAlign:'left'}}>
                  <T content="approve.stat.cd_approve_date"/>
                </td>
                <td style={{textAlign:'right'}}>
                  {this.state.statdata.approve_date}
                </td>
              </tr>
            </table>
        </div>

      </div>
    ));

  },

  handleStatusChange:function(id, value) {
    this.state.data.status = value;
    this.state.selectedStatus = value;

    this.setState({
      data:this.state.data,
      selectedStatus:this.state.selectedStatus
    });


  },

  handleListChange:function(id, value) {

    this.state.data.bank = value;

    this.state.data.bank_ref = this.state.bank.list[value-1].text;
    //

  },

  onKeyUp:function(id,value){
    if(id=='cash_transfer'){
      this.state.data.cash_transfer = value;
    }else{
      this.state.data.pastday_pending_transfer = value;
    }

    var amount = parseFloat(this.state.data.cash_on_report || 0) - parseFloat(this.state.data.cash_transfer || 0);

    if(amount > 0 ){
      this.state.data.today_pending_transfer = amount;
      this.state.data.receive_pending_transfer = '0';
    }else if(amount < 0){
      this.state.data.today_pending_transfer = '0';
      this.state.data.receive_pending_transfer = parseFloat(amount || 0) * parseFloat(-1);
    }else{
      this.state.data.today_pending_transfer = '0';
      this.state.data.receive_pending_transfer = '0';
    }

    this.state.data.total_pending_transfer = parseFloat(this.state.data.pastday_pending_transfer  || 0) + parseFloat(this.state.data.today_pending_transfer  || 0) - parseFloat(this.state.data.receive_pending_transfer  || 0);
    this.setState({
      today_pending_transfer: this.state.data.today_pending_transfer,
      receive_pending_transfer:this.state.data.receive_pending_transfer,
      cash_transfer:this.state.data.cash_transfer,
      pastday_pending_transfer:this.state.data.pastday_pending_transfer,
      total_pending_transfer:this.state.data.total_pending_transfer
    });

  },

  onGetDataDetailDoneAction: function(data){

    this.state.datatable = data.dataDetail.map(function(row) {
      return {
        type: row.receive_by,
        old:helper.numberFormat(row.old,0),
        sell:helper.numberFormat(row.sell,0),
        return:helper.numberFormat(row.returnx,0),
        installment:helper.numberFormat(row.installment,0),
        income:helper.numberFormat(row.income,0),
        expense:helper.numberFormat(row.expense,0),
        cash_transfer:helper.numberFormat(row.transfer,0)
        // old:row.old,
        // sell:row.sell,
        // return:row.returnx,
        // installment:row.installment,
        // income:row.income,
        // expense:row.expense,
        // cash_transfer:row.transfer
      }
    });
    this.setState({
      datatable: this.state.datatable
    });

  },

  doSave: function() {
    // check required
    console.log(this.state.data);
    dialogActions.show({
      title:'ยืนยัน',
      content: 'ยืนยันการเปลี่ยนสถานะเป็น ' + this.state.data.status,
      actions: [
        {id:'save', icon:'check52', label:'action.confirm'},
        {id:'cancel', icon:'close47', label:'action.cancel', default:true}
      ]
    }, function(isCancel, id) {
      if (isCancel || id=='cancel') {
        return;
      }
      actions.save({
        data: this.state.data,
        staff_id:system.sessionStore.getSession().staff.id
      });
    }.bind(this));

  },

  onSaveDoneAction: function(data){
    this.doRefresh();


  },


  doRefresh:function(){
    actions.getBank();
    actions.getDataMain(this.state.id);
  },

  handleChange:function(id, value){
        this.state.data[id] = value;
        this.setState({
          data: this.state.data
        });
  },

  checkStatus:function(){
    if (this.state.statdata.status=='รอปิดกะ'||this.state.statdata.status=='ปิดยอด'){
      return true;
    }else{
      return false;
    }
  },

  render: function() {

      var field = {
        on_date:{
          id:'on_date',
          type:'text',
          readonly:true,
          textAlign:'center'
        },
        cash_on_report:{
          id:'cash_on_report',
          label:'approve.c_on_report',
          type:'text',
          readonly:true
        },
        cash_transfer:{
          id:'cash_transfer',
          label:'approve.cash_transfer',
          type:'text',
            readonly:true
        },
        doc_ref:{
          id:'doc_ref',
          label:'approve.doc_ref',
          type:'text',
            readonly:true
        },
        today_pending_transfer:{
          id:'today_pending_transfer',
          label:'approve.today_pending_transfer',
          type:'text',
          readonly:true
        },
        pastday_pending_transfer:{
          id:'pastday_pending_transfer',
          label:'approve.pastday_pending_transfer',
          type:'text',
            readonly:true
        },
        total_pending_transfer:{
          id:'total_pending_transfer',
          label:'approve.total_pending_transfer',
          type:'text',
          readonly:true
        },
        receive_pending_transfer:{
          id:'receive_pending_transfer',
          label:'approve.receive_pending_transfer',
          type:'text',
          readonly:true
        },
        remark:{
          id:'remark',
          label:'approve.remark',
          type:'text',
            readonly:true
        }

      };

    var fieldTable = [
        {name:'type', label:'approve.table.type', width:'50px'},

        {name:'old', label:'approve.table.old', width:'40px'},
        {name:'sell', label:'approve.table.sell', width:'40px'},
        {name:'return', label:'approve.table.return', width:'40px'},
        {name:'installment', label:'approve.table.finance', width:'40px'},
        {name:'income', label:'approve.table.income', width:'40px'},
        {name:'expense', label:'approve.table.expense', width:'40px'},
        {name:'cash_transfer', label:'approve.table.cash_transfer', width:'40px'}
    ];

    var dataa = [
      {'type':'เงินสด','old':'-','sell':'100','return':'100','finance':'100','income':'100','expense':'100','cash_transfer':'100'}
    ]

      return (
        <div className="content-page">
          <div className="content-body panelf">
            <div className="box10 flex flex-form">
              <div className="panel6">
                <div class="panel8"  style={{height:'100%',width:'100%',backgroundColor:'rgba(0,0,0,0.05)'}} >
                  <input className="input-text" disabled value={this.state.data.on_date} style={{textAlign:'center',height:'25px',width:'100%'}}>
                  </input>
                </div>
              </div>
              <div className="panel2">
                <FlexDropdown
                        field={this.state.status}
                        data={{status:this.state.selectedStatus}}
                        onChange={this.handleStatusChange}
                        />
              </div>
              <div className="panel2">
                <FlexButton
                  label="action.save"
                  icon="save20"
                  onClick={this.doSave}
                  default={true}
                  disabled={this.checkStatus()}
                  />
              </div>
            </div>

            <div className="box10 flex flex-form" >
              <div className="panel3" style={{borderRight:'1px solid #eee',paddingRight:'7px'}} >
                  <div className="panel3" style={{paddingLeft:0}}>
                  <FlexTextInput
                    field={field.cash_on_report}
                    data={this.state.data}
                    />
                </div>
                  <div className="panel3" style={{paddingLeft:0}}>
                    <FlexTextInput
                      field={field.pastday_pending_transfer}
                      data={this.state.data}
                      onKeyUp={this.onKeyUp}

                      />
                  </div>
                    <div className="panel3" style={{paddingLeft:0}}>
                  <FlexTextInput
                    field={field.cash_transfer}
                    data={this.state.data}
                    onKeyUp={this.onKeyUp}

                    />
                  </div>
                  <div className="panel3" style={{paddingLeft:0}}>
                      <FlexDropdown
                        field={this.state.bank}
                        data={{bank:this.state.selectedItem}}
                        onChange={this.handleListChange}
                        />
                  </div>
                    <div className="panel3" style={{paddingLeft:0}}>
                  <FlexTextInput
                    field={field.doc_ref}
                    data={this.state.data}
                    onChange={this.handleChange}
                    />
                  </div>
                    <div className="panel3" style={{paddingLeft:0}}>
                  <FlexTextInput
                    field={field.today_pending_transfer}
                    data={this.state.data}
                    onChange={this.handleChange}
                    />
                  </div>
                    <div className="panel3" style={{paddingLeft:0}}>
                  <FlexTextInput
                    field={field.receive_pending_transfer}
                    data={this.state.data}
                    onChange={this.handleChange}
                    />
                  </div>
                    <div className="panel3" style={{paddingLeft:0}}>
                  <FlexTextInput
                    field={field.total_pending_transfer}
                    data={this.state.data}
                    onChange={this.handleChange}
                    />
                  </div>
              </div>
              <div className="panel7" style={{borderLeft:'1px solid #eee',paddingLeft:'7px'}}>
                  <h2>สรุปยอดรายวันร้าน</h2>
                  <div className="box7">
                    <FlexDisplayTable
                        fields={fieldTable}
                        data={this.state.datatable}
                        displayRows={10}
                    />
                    <FlexTextInput
                      field={field.remark}
                      data={this.state.data}
                      onChange={this.handleChange}
                      />
                  </ div>
              </div>
            </div>
        </div>
    </div>

    );
  }
});

module.exports = Screen;
