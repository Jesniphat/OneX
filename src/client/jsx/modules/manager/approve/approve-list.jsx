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
var storageKey = 'manager.approve.list';

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;
var dialogActions     = system.dialogActions;
var FlexCheckbox = widgets.FlexCheckbox;
var approveActions = require('./actions');

var ApproveList = React.createClass({
  mixins: [
    Reflux.listenTo(approveActions.save.done,'onSaveDoneAction')
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
        status_Approve:false
      },
      status_Approve:{
        id:'status_Approve',
        type:'checkbox'
      },
      fields: [
        {name:'approve_date', title:'approve.approve_date', width:'70px',render:function(row){
          var S = function(){
            this.doSave(row.id)
          }.bind(this);

          console.log(row.cd_status);
          if(row.cd_status == 'ปิดยอด'){
            return (<div className="flex">
              <div onClick={S}>
                <FlexIcon icon="blank32" title="action.select"></FlexIcon>
              </div>
            </div>);
          }else if(row.cd_status == 'อนุมัติ'){
            return (<div className="flex">
              <div>
                <FlexIcon icon="black399" title="action.select"></FlexIcon>
              </div>
              <div className="center" style={{width:"50px"}} >{tr.localize(new Date(row.approve_date), {type:'date', format:'short'})}</div>
            </div>);

          }else{
            return (<div className="flex">
              <div>
                <FlexIcon icon="blank32" title="action.select"></FlexIcon>
              </div>
            </div>);
          }
        }.bind(this)},
        {name:'on_date', title:'approve.created_by', width:'60px',textAlign:'center'},
        {name:'sum_cashTransfer', title:'approve.cash_on_report', width:'70px', className:'right', render:function(row) {
          return helper.numberFormat(row.sum_cashTransfer,2);
        }},
        {name:'cnClose', title:'approve.cnClose', width:'70px'},
        {name:'cnNoClose', title:'approve.cnNoClose', width:'70px'},
        {name:'cd_status', title:'approve.status', type:'lov', width:'70px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="finance.cd.list" param={{id:row.cash_daily_id}} icon="right244" title="action.select"></FlexIcon>
          </div>);
        }.bind(this)},

      ]
    }
  },

  doSave: function(ids) {
    // check required
    console.log(ids,' data:',this.state.data);
    dialogActions.show({
      title:'confirm',
      content: 'ยืนยันการบันทึก',
      actions: [
        {id:'save', icon:'check52', label:'action.confirm'},
        {id:'cancel', icon:'close47', label:'action.cancel', default:true}
      ]
    }, function(isCancel, id) {
      if (isCancel || id=='cancel') {
        return;
      }
      approveActions.save({
        data: this.state.data,
        staff_id:system.sessionStore.getSession().staff.id,
        id :ids
      });
    }.bind(this));

  },

  componentDidMount: function() {
    this.state.data.shop_id = system.sessionStore.getSession().shop.id;
  },
  onSaveDoneAction: function(data){
    this.refs.grid.doRefresh();
  },
  render: function() {
    // <div className="panelf can-grow">
    //   <T content="approve.title.list" component="h2" />
    // </div>
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
        </div>
        <div className="content-body panelf">
          <FlexGrid
            ref="grid"
            id="manager-approve-list"
            listAction={approveActions.list}
            exportAction={approveActions.export}
            facetAction={approveActions.ddlList}
            fields={this.state.fields}
            pk="id"
            sortBy="on_date"
            sortDir="DESC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{
              today: helper.dateToString(new Date()),
              shop_id:this.state.data.shop_id,
              staff_id:this.state.data.staff_id
            }}
            />
        </div>
      </div>
    );
  }
});

module.exports = ApproveList;
