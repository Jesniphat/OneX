var React         = require('react');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var systemActions = system.systemActions;
var infoPanelActions = system.infoPanelActions;
var helper        = system.helper;

var actions  = require('./actions');

var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;
var FlexGrid      = widgets.FlexGrid;

var PaymentVoucherList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      fields: [
        {name:'code',title:'finance.pv.list.code',width:'96px'},
        {name:'document_date',title:'finance.pv.list.document_date',width:'88px',render:function(row) {
          return tr.localize(new Date(row.document_date), {type:'date',format:'short'});
        }},
        {name:'approve_date',type:'daterange',title:'finance.pv.list.approve_date',width:'88px',render:function(row) {
          return row.approve_date=='0000-00-00' ?
            (<T content="finance.pv.status_not_yet_approve" component="i"/>)
            : tr.localize(new Date(row.approve_date), {type:'date',format:'short'});
        }},
        {name:'total_amount',title:'finance.pv.list.total_amount',width:'96px',format:'money'},
        {name:'supplier_code',title:'finance.pv.list.supplier_code'},
//        {name:'vat_amount',title:'finance.pv.list.vat_amount',width:'80px',format:'money'},
        {name:'cn_amount',title:'finance.pv.list.cn_amount',width:'80px',format:'money'},
        {name:'net_amount',title:'finance.pv.list.net_amount',width:'96px',format:'money'},
        {name:'cn_code',title:'finance.pv.list.cn_code',width:'96px'},
        {name:'staff',title:'finance.pv.list.staff'},
        {name:'remark',title:'finance.pv.list.remark'},
        {name:'status', title:'finance.pv.list.status', type:'lov', width:'100px',list:[
          {value:'DRAFT',text:tr.translate('finance.pv.list.status_DRAFT')},
          {value:'PROPOSE',text:tr.translate('finance.pv.list.status_PROPOSE')},
          {value:'APPROVE',text:tr.translate('finance.pv.list.status_APPROVE')},
          {value:'REJECT',text:tr.translate('finance.pv.list.status_REJECT')},
          {value:'PAID',text:tr.translate('finance.pv.list.status_PAID')},
          {value:'VOID',text:tr.translate('finance.pv.list.status_VOID')}
        ], render: function(row) {
          return tr.translate('finance.pv.list.status_' + row.status);
        }},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="finance.pv.screen" param={{id:row.id}} icon="create3" title="action.edit"></FlexIcon>
          </div>);
        }}
      ]
    }
  },

  componentDidMount: function() {
    infoPanelActions.hide();
  },

  doPaymentVoucherNew: function() {
    this.context.router.transitionTo('finance.pv.screen', {id:0});
  },

  render: function() {
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="finance.pv.title.list" component="h2" />
          </div>
          <div className="boxf flex no-shrink">
            <div className="panel2 no-shrink">
              <FlexButton icon="add184" label="finance.pv.action.new"
                onClick={this.doPaymentVoucherNew}/>
            </div>
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            id="finance-pv-list"
            listAction={actions.list}
            exportAction={actions.export}
            facetAction={actions.facetList}
            fields={this.state.fields}
            pk="id"
            sortBy="code"
            sortDir="DESC"
            limit={50}
            displayRows={10}
            checkbox={false}
            search={true}
            />
        </div>
      </div>
    );
  }
});

module.exports = PaymentVoucherList;
