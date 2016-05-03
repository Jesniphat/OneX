var React     = require('react');
var Reflux    = require('reflux');
var Router    = require('react-router');
var Link      = Router.Link;
var T         = require('react-translate-component');
var tr        = require('counterpart');

var system    = require('ss-system');
var widgets   = require('ss-widget');

var helper    = system.helper;
var systemActions = system.systemActions;
var storage   = system.storage;
var storageKey = 'pos.cashDaily.insertOld';

var FlexButton      = widgets.FlexButton;
var FlexDisplayTable    = widgets.FlexDisplayTable;
var dialogActions     = system.dialogActions;
var FlexTab         = widgets.FlexTab;
var FlexTextInput   = widgets.FlexTextInput;
var FlexDropdown    = widgets.FlexDropdown;
var FlexIcon        = widgets.FlexIcon;
var FlexDataTable   = widgets.FlexDataTable;
var FlexRadioGroup  = widgets.FlexRadioGroup;

var cashDailyActions = require('./actions');

var CashDailyList = React.createClass({
  mixins: [
    Reflux.listenTo(cashDailyActions.insertOld.done,'onInsertOldDoneAction')
  ],


  getInitialState: function() {
    var shop_id = system.sessionStore.getSession().shop.id;
    var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});
    var staff_id = system.sessionStore.getSession().staff.id;
    return {
      data: {
        shop:'',
        shop_id:shop_id,
        staff_id:staff_id,
        dateFrom:'2015-01-01',
        dateTo:'2015-01-31',
        flagSave:false
      },
      flagSave:false
    }
  },

  componentDidMount: function() {
    this.state.data.shop_id = system.sessionStore.getSession().shop.id;
  },

  doSave: function() {
    // check required

    console.log('jjjjj',this.state.flagSave);

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
        }else{
          this.setState({
            flagSave : true
          });
        }

        cashDailyActions.insertOld({
          data: this.state.data,
          staff_id:system.sessionStore.getSession().staff.id
        });
      }.bind(this));

  },

  onInsertOldDoneAction: function(id,data,status){
    if(data==true){
      toasterActions.pop({
        type:'success',
        message:'บันทึกเรียบร้อยแล้ว'
      });
      // this.state.sendStatus = status;
      // this.state.id = id;
      this.doRefresh();
    }
    this.setState({
      flagSave : false
    });
  },
  handleChange:function(id, value){
        this.state.data[id] = value;
        this.setState({
          data: this.state.data
        });
  },
  render: function() {
    var field = {
      dateFrom:{
        id:'dateFrom',
        type:'text',
        Align:'center'
      },
      dateTo:{
        id:'dateTo',
        type:'text',
        Align:'center'
      }
    }
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="cashDaily.title.list" component="h2" />
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexTextInput
              field={field.dateFrom}
              data={this.state.data}
                onChange={this.handleChange}
              />
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexTextInput
              field={field.dateTo}
              data={this.state.data}
                onChange={this.handleChange}
              />
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexButton
              label="action.save"
              icon="save20"
              onClick={this.doSave}
              default={true}
              />
          </div>
        </div>
        <div className="content-body panelf">

        </div>
      </div>
    );
  }
});

module.exports = CashDailyList;
