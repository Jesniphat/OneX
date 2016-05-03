var React         = require('react');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var storage   = system.storage;
var systemStore = system.systemStore;
var systemActions = system.systemActions;
var infoPanelActions = system.infoPanelActions;
var helper        = system.helper;
var storageKey = 'finance.cd.list';

var actions  = require('./actions');

var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;
var FlexGrid      = widgets.FlexGrid;
var FlexDropdown = widgets.FlexDropdown;

var CashDailyList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    var shops = systemStore.getMaster().shops.map(function(shop) {
      return {
        value: shop.code,
        text: shop.code+' '+shop.name
      }
    });
    shops.unshift({value:'*',text:'* ทุกสาขา'});
    var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});
    var staff_id = system.sessionStore.getSession().staff.id;

    var opt = storage.load(storageKey, {current_status:'ALL', shop:''});
    if (opt.shop=='') {
      opt.shop = shops.length > 0 ?
        (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '';
    }

    return {
      data: {
        shop:opt.shop,
        staff_id:staff_id
      },
      shopList: shops,
      fields: [
        {name:'on_date', type:'daterange', title:'cashDaily.created_by', width:'70px', render:function(row){
          return tr.localize(new Date(row.on_date), {type:'date', format:'short'});
        }},
        {name:'sh_name', title:'cashDaily.shop_code', width:'70px'},
        {name:'cash_transfer', title:'cashDaily.cash_on_report', width:'70px', className:'right', render:function(row) {
          return helper.numberFormat(row.cash_transfer,2);
        }},
        {name:'sh_tel', title:'cashDaily.shop_tel', width:'70px'},
        {name:'approve_date', type:'daterange', title:'cashDaily.approve_date', width:'70px'},
        {name:'remark', title:'cashDaily.remark', width:'150px'},
        {name:'cd_status', title:'cashDaily.status', type:'lov', width:'50px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="finance.cd.screen" param={{id:row.cash_daily_id}} icon="right244" title="action.select"></FlexIcon>
          </div>);
        }.bind(this)},
      ]
    }
  },

  componentDidMount: function() {
      this.state.data.shop_id = system.sessionStore.getSession().shop.id;
  },

  handleChange: function(id, value) {
    console.log(value);
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

  render: function() {

        return (
          <div className="content-page">
            <div className="content-header boxf flex">
              <div className="panelf can-grow">
                <T content="cd.title.list" component="h2" />
              </div>
              <div className="panel3 no-shrink flex-form">

              </div>
              <div className="panel3 no-shrink flex-form">
                <FlexDropdown
                  field={{id:'shop',label:'receipt.filter_shop',list:this.state.shopList}}
                  data={this.state.data}
                  onChange={this.handleChange}
                  />
              </div>
            </div>
            <div className="content-body panelf">
              <FlexGrid
                ref="grid"
                id="finance-cd-list"
                listAction={actions.list}
                exportAction={actions.export}
                facetAction={actions.ddlList}
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
                  shop: (this.state.data.shop=='*' ? null : this.state.data.shop),
                  staff_id:this.state.data.staff_id
                }}
                />
            </div>
          </div>
        );
  }
});

module.exports = CashDailyList;
