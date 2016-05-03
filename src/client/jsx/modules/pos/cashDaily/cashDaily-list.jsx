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
var storageKey = 'pos.cashDaily.list';

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;

var cashDailyActions = require('./actions');

var CashDailyList = React.createClass({

  getInitialState: function() {
    var shop_id = system.sessionStore.getSession().shop.id;
    var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});
    var staff_id = system.sessionStore.getSession().staff.id;
    return {
      data: {
        shop:'',
        shop_id:shop_id,
        staff_id:staff_id
      },
      fields: [
        {name:'on_date', title:'cashDaily.created_by', width:'70px', render:function(row){
          return tr.localize(new Date(row.on_date), {type:'date', format:'short'});
        }},
        {name:'sh_name', title:'cashDaily.shop_code', width:'70px'},
        {name:'cash_transfer', title:'cashDaily.cash_on_report', width:'70px', className:'right', render:function(row) {
          return helper.numberFormat(row.cash_transfer,2);
        }},
        {name:'sh_tel', title:'cashDaily.shop_tel', width:'70px'},
        {name:'approve_date', title:'cashDaily.approve_date', width:'70px'},
        {name:'remark', title:'cashDaily.remark', width:'150px'},
        {name:'cd_status', title:'cashDaily.status', type:'lov', width:'50px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="pos.cashDaily.edit" param={{id:row.cash_daily_id,sendStatus:row.cd_status}} icon="right244" title="action.select"></FlexIcon>
          </div>);
        }.bind(this)},

      ]
    }
  },

  componentDidMount: function() {
    this.state.data.shop_id = system.sessionStore.getSession().shop.id;
  },

  render: function() {

    return (
      <div className="content-page layout-panel">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="cashDaily.title.list" component="h2" />
          </div>
          <div className="panel3 no-shrink flex-form">

          </div>
          <div className="panel3 no-shrink flex-form">

          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            ref="grid"
            id="pos-cashDaily-list"
            listAction={cashDailyActions.list}
            exportAction={cashDailyActions.export}
            facetAction={cashDailyActions.ddlList}
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

module.exports = CashDailyList;
