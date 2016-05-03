var React     = require('react');
var Reflux    = require('reflux');
var Router    = require('react-router');
var Link      = Router.Link;
var T         = require('react-translate-component');
var tr        = require('counterpart');

var system            = require('ss-system');
var widgets           = require('ss-widget');

var helper            = system.helper;
var systemActions     = system.systemActions;
var infoPanelActions  = system.infoPanelActions;
var dialogActions     = system.dialogActions;
var toasterActions    = system.toasterActions;

var FlexButton      = widgets.FlexButton;
var FlexDisplayTable    = widgets.FlexDisplayTable;
var FlexTab         = widgets.FlexTab;
var FlexTextInput   = widgets.FlexTextInput;
var FlexDropdown    = widgets.FlexDropdown;
var FlexIcon        = widgets.FlexIcon;
var FlexDataTable   = widgets.FlexDataTable;
var FlexRadioGroup  = widgets.FlexRadioGroup;
var NationIDCard    = widgets.NationIDCard;

var actions       = require('./actions');

var CashDailyEdit = React.createClass({
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

    var sendStatus = this.context.router.getCurrentParams().sendStatus;
    var flagClose = this.context.router.getCurrentParams().close;
    var flagDunning = this.context.router.getCurrentParams().dunning;
    var pageBack = this.context.router.getCurrentParams().pageback;
    if (!pageBack) {
      pageBack = 'pos.cashDaily.list';
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
      sendStatus:sendStatus,
      flagSave:false,
      data:{
        cash_daily_id:'',
        bank:'1',
        bank_ref:'',
        on_date:'',
        cash_on_report:0,
        cash_transfer:0,
        receive_pending_transfer:0,
        today_pending_transfer:0,
        pastday_pending_transfer:0,
        total_pending_transfer:0,
        remark:'',
        doc_ref:''
      },
      datatable:[],
      statdata:{
        status:'',
        created_at:'',
        updated_at:'',
        cd_balance_date:'',
        approve_date:'',
      },
      bank:{
        id:'bank',
        label:'cashDaily.bank',
        type:'dropdown',
        list: []
      },
      searchDate:''
    };
  },

  componentDidMount: function() {

    infoPanelActions.show('pos.cashDaily.list',
      <div className="box10">

      </div>
    );
    actions.getBank();
    actions.getDataMain(this.state.id,this.state.sendStatus);

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
    // this.state.data.bank = this.state.bank.list[this.state.selectedItem-1].value;
    // this.state.data.bank_ref = this.state.bank.list[this.state.selectedItem-1].text;

    this.setState({
      bank: this.state.bank,
      selectedItem: this.state.selectedItem
    });

  },

  onGetDataMainDoneAction: function(data){
    console.log('data:',data);
    this.state.data.on_date = 'ประจำวันที่ ' + tr.localize(new Date(data.Main[0].on_date), {type:'date', format:'short'}) + ' - ' + data.Main[0].sh_name;

    this.state.statdata.created_at = tr.localize(new Date(data.Main[0].created_at), {type:'datetime', format:'short'});
    this.state.statdata.updated_at = tr.localize(new Date(data.Main[0].updated_at), {type:'datetime', format:'short'});

    if (data.Main[0].approve_date=='-'){
      this.state.statdata.approve_date = data.Main[0].approve_date;
    }else{
        this.state.statdata.approve_date = tr.localize(new Date(data.Main[0].approve_date), {type:'datetime', format:'short'});
    }

    if (data.Main[0].cd_balance_date=='-'){
      this.state.statdata.cd_balance_date = data.Main[0].cd_balance_date;
    }else{
      this.state.statdata.cd_balance_date = tr.localize(new Date(data.Main[0].cd_balance_date), {type:'datetime', format:'short'});
    }

    this.state.statdata.status = data.Main[0].status;
    this.state.searchDate = data.Main[0].created_at;
    this.state.data.cash_daily_id = data.Main[0].cash_daily_id;

    //Form Price
    this.state.data.cash_on_report = parseInt(data.Main[0].cash_on_report|| 0);
    this.state.data.cash_transfer = parseInt(data.Main[0].cash_transfer|| 0);
    this.state.data.receive_pending_transfer = parseInt(data.Main[0].receive_pending_transfer|| 0);
    this.state.data.today_pending_transfer = parseInt(data.Main[0].today_pending_transfer|| 0);

    this.state.data.pastday_pending_transfer = parseInt(data.Main[0].pastday_pending_transfer|| 0);
    this.state.data.total_pending_transfer = parseInt(data.Main[0].total_pending_transfer|| 0);

    this.state.data.doc_ref = data.Main[0].doc_ref;
    this.state.data.remark = data.Main[0].remark;

    if(data.Main[0].bank_id != null) {
        this.state.selectedItem = data.Main[0].bank_id;
        //this.state.bank = = data.Main[0].bank_id;
        this.state.data.bank = data.Main[0].bank_id;
    }else{
        this.state.selectedItem = "1";
          this.state.data.bank = "1";
    }

    this.setState({
      data: this.state.data,
      statdata:this.state.statdata,
      searchDate:this.state.searchDate,
      cash_daily_id:this.state.data.cash_daily_id,
      selectedItem: this.state.selectedItem,
      bank:this.state.bank
    });

    var color = 'yellow';

    if(this.state.statdata.status=='อนุมัติ' || this.state.statdata.status =='ปิดยอด'){
      color ='#b2e388';
    }else{
      color ='yellow';
    }

    actions.getDataDetail(this.state.cash_daily_id);

    var amount = parseInt(this.state.data.cash_on_report || 0) - parseInt(this.state.data.cash_transfer || 0);

    if(amount > 0 ){
      this.state.data.today_pending_transfer = amount;
      this.state.data.receive_pending_transfer = '0';
    }else if(amount < 0){
      this.state.data.today_pending_transfer = '0';
      this.state.data.receive_pending_transfer = parseInt(amount || 0) * parseInt(-1);
    }else{
      this.state.data.today_pending_transfer = '0';
      this.state.data.receive_pending_transfer = '0';
    }

    this.state.data.total_pending_transfer = parseInt(this.state.data.pastday_pending_transfer  || 0) + parseInt(this.state.data.today_pending_transfer  || 0) - parseInt(this.state.data.receive_pending_transfer  || 0);
    this.setState({
      today_pending_transfer: this.state.data.today_pending_transfer,
      receive_pending_transfer:this.state.data.receive_pending_transfer,
      cash_transfer:this.state.data.cash_transfer,
      pastday_pending_transfer:this.state.data.pastday_pending_transfer,
      total_pending_transfer:this.state.data.total_pending_transfer
    });

    // <dl className="dl" style={{overflowY:'auto'}}>
    //   <dt><T content="cashDaily.stat.cd_created_at"/></dt>
    //   <dd>{this.state.statdata.created_at}</dd>
    //   <dt><T content="cashDaily.stat.cd_updated_at"/></dt>
    //   <dd>{this.state.statdata.updated_at}</dd>
    //   <dt><T content="cashDaily.stat.cd_close_date"/></dt>
    //   <dd>{this.state.statdata.close_at}</dd>
    //   <dt><T content="cashDaily.stat.cd_approve_date"/></dt>
    //   <dd>{this.state.statdata.approve_date}</dd>
    // </dl>

    var list = data.HistoryClose.map(function(row,i){
        var onDate = tr.localize(new Date(row.on_date), {type:'date', format:'short'});
        var cashAmount =   helper.numberFormat(row.cashAmount,2)

        return (  <tr style={{height:'20px'}}>
            <td style={{textAlign:'left'}}>
              {onDate}
            </td>
            <td style={{textAlign:'right'}}>
              {cashAmount}
            </td>
          </tr>
        );
    }.bind(this));


    infoPanelActions.show('pos.cashDaily.list', (
      <div className="flex-v can-grow" style={{overflowY:'auto'}}>
        <div style={{backgroundColor:color,textAlign:'center',height:'30px'}}>
            <h2>{this.state.statdata.status}</h2>
        </div>
        <div>
            <table style={{width:'100%'}}>
              <tr style={{height:'20px'}}>
                <td style={{textAlign:'left'}}><T content="cashDaily.stat.cd_created_at"/>
                </td>
                <td style={{textAlign:'right'}}>{this.state.statdata.created_at}
                </td>
              </tr>
              <tr style={{height:'20px'}}>
                <td style={{textAlign:'left'}}>
                  <T content="cashDaily.stat.cd_updated_at"/>
                </td>
                <td style={{textAlign:'right'}}>
                  {this.state.statdata.updated_at}
                </td>
              </tr>
              <tr style={{height:'20px'}}>
                <td style={{textAlign:'left'}}>
                  <T content="cashDaily.stat.cd_close_date"/>
                </td>
                <td style={{textAlign:'right'}}>
                  {this.state.statdata.cd_balance_date}
                </td>
              </tr>
              <tr style={{height:'20px'}}>
                <td style={{textAlign:'left'}}>
                  <T content="cashDaily.stat.cd_approve_date"/>
                </td>
                <td style={{textAlign:'right'}}>
                  {this.state.statdata.approve_date}
                </td>
              </tr>
            </table>
        </div>
        <div style={{textAlign:'center',height:'30px'}}>
             &nbsp;
        </div>
        <div>
            <table style={{width:'100%'}}>
              <tr style={{height:'20px'}}>
                <td style={{textAlign:'left'}}><T content="cashDaily.stat.cd_history"/>
                </td>
                <td style={{textAlign:'right'}}>
                    <T content="cashDaily.stat.cd_amount"/>
                </td>
              </tr>
                {list}
            </table>
        </div>
      </div>
    ));
  },

  handleListChange:function(id, value) {

    this.state.data.bank = value;
    this.state.data.bank_ref = this.state.bank.list[value-1].text;

    this.state.selectedItem = value;

    this.setState({
      data: this.state.data,
      selectedItem:  this.state.selectedItem
    });
  },

  onKeyUp:function(id,value){
    if(id=='cash_transfer'){
      this.state.data.cash_transfer = value;
    }else{
      this.state.data.pastday_pending_transfer = value;
    }

    var amount = parseInt(this.state.data.cash_on_report || 0) - parseInt(this.state.data.cash_transfer || 0);

    if(amount > 0 ){
      this.state.data.today_pending_transfer = amount;
      this.state.data.receive_pending_transfer = '0';
    }else if(amount < 0){
      this.state.data.today_pending_transfer = '0';
      this.state.data.receive_pending_transfer = parseInt(amount || 0) * parseInt(-1);
    }else{
      this.state.data.today_pending_transfer = '0';
      this.state.data.receive_pending_transfer = '0';
    }

    this.state.data.total_pending_transfer = parseInt(this.state.data.pastday_pending_transfer  || 0) + parseInt(this.state.data.today_pending_transfer  || 0) - parseInt(this.state.data.receive_pending_transfer  || 0);
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

      }
    });
    this.setState({
      datatable: this.state.datatable
    });

  },

  doSave: function() {
    // check required
    if (this.state.flagSave == false){
      dialogActions.show({
        title:'dialog.confirm',
        content: 'ยืนยันการบันทึก',
        actions: [
          {id:'save', icon:'check52', label:'action.confirm'},
          {id:'cancel', icon:'close47', label:'action.cancel', default:true}
        ]
      }, function(isCancel, id) {
        if (isCancel || id=='cancel') {
          return;
        }

        this.setState({
          flagSave : true
        });

        actions.save({
          data: this.state.data,
          staff_id:system.sessionStore.getSession().staff.id
        });
      }.bind(this));
    }
  },

  onSaveDoneAction: function(id,data,status){
    if(data==true){
      toasterActions.pop({
        type:'success',
        message:'บันทึกเรียบร้อยแล้ว'
      });
      this.state.sendStatus = status;
      this.state.id = id;
      this.doRefresh();
    }
    this.setState({
      flagSave : false
    });
  },

  doRefresh:function(){
    actions.getBank();
    actions.getDataMain(this.state.id,this.state.sendStatus);
  },

  handleChange:function(id, value){
        this.state.data[id] = value;
        this.setState({
          data: this.state.data
        });
  },

  checkStatus:function(){
    if (this.state.statdata.status=='รอปิดกะ'||this.state.statdata.status=='เปิดให้แก้ไข'){
      return false;
    }else{
      return true;
    }
  },

  render: function() {

      var field = {
        on_date:{
          id:'on_date',
          type:'text',
          readonly:true,
          Align:'center'
        },
        cash_on_report:{
          id:'cash_on_report',
          label:'cashDaily.c_on_report',
          type:'text',
          readonly:true
        },
        cash_transfer:{
          id:'cash_transfer',
          label:'cashDaily.cash_transfer',
          type:'text'
        },
        doc_ref:{
          id:'doc_ref',
          label:'cashDaily.doc_ref',
          type:'text'
        },
        today_pending_transfer:{
          id:'today_pending_transfer',
          label:'cashDaily.today_pending_transfer',
          type:'text',
          readonly:true
        },
        pastday_pending_transfer:{
          id:'pastday_pending_transfer',
          label:'cashDaily.pastday_pending_transfer',
          type:'text',
          readonly:true
        },
        total_pending_transfer:{
          id:'total_pending_transfer',
          label:'cashDaily.total_pending_transfer',
          type:'text',
          readonly:true
        },
        receive_pending_transfer:{
          id:'receive_pending_transfer',
          label:'cashDaily.receive_pending_transfer',
          type:'text',
          readonly:true
        },
        remark:{
          id:'remark',
          label:'cashDaily.remark',
          type:'text'
        }
      };

    var fieldTable = [
        {name:'type', label:'cashDaily.table.type', width:'50px'},
        {name:'old', label:'cashDaily.table.old', width:'40px'},
        {name:'sell', label:'cashDaily.table.sell', width:'40px'},
        {name:'return', label:'cashDaily.table.return', width:'40px'},
        {name:'installment', label:'cashDaily.table.finance', width:'40px'},
        {name:'income', label:'cashDaily.table.income', width:'40px'},
        {name:'expense', label:'cashDaily.table.expense', width:'40px'},
        {name:'cash_transfer', label:'cashDaily.table.cash_transfer', width:'40px'}
    ];

    var dataa = [
      {'type':'เงินสด','old':'-','sell':'100','return':'100','finance':'100','income':'100','expense':'100','cash_transfer':'100'}
    ]

      return (
        <div className="content-page layout-panel">
          <div className="content-body panelf">
            <div className="box10 flex flex-form">
              <div className="panel8" >
                  <div class="panel8"  style={{height:'100%',width:'100%',backgroundColor:'rgba(0,0,0,0.05)'}} >
                    <input className="input-text" disabled value={this.state.data.on_date} style={{textAlign:'center',height:'25px',width:'100%'}}>
                    </input>
                  </div>
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
                      onChange={this.handleChange}
                      />
                  </div>
                    <div className="panel3" style={{paddingLeft:0}}>
                    <FlexTextInput
                      field={field.cash_transfer}
                      data={this.state.data}
                      onKeyUp={this.onKeyUp}
                      onChange={this.handleChange}
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

module.exports = CashDailyEdit;
