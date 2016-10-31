var React         = require('react');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var systemActions = system.systemActions;
var infoPanelActions = widgets.infoPanelActions;
var helper        = system.helper;

var staffActions  = require('./actions');
var staffStore    = require('./store');

var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;
var FlexGrid      = widgets.FlexGrid;

var StaffList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      fields: [
        {name:'user', title:'staff.user', width:'100px'},
        {name:'suffix_barcode', title:'staff.suffix_barcode', width:'120px', render:function(row) {
          return 'XX' + row.suffix_barcode
        }},
        {name:'nickname', title:'staff.nickname', width:'120px'},
        {name:'display_name', title:'staff.display_name'},
        {name:'department', title:'staff.department', type:'lov', width:'100px'},
        {name:'shop', title:'staff.shop', type:'lov', width:'160px'},
        {name:'last_login', title:'staff.last_login', type:'date', width:'160px', render:function(row) {
//          return helper.thShortDateTime(row.last_login);
          if (row.last_login.substr(0,4)=='0000') {
            return (<i>{tr.translate('staff.never_login')}</i>);
          }
          return tr.localize(new Date(row.last_login), { format: 'short' });
        }},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to={'/setting/staff/staff_new/'+row.id} icon="create3" title="action.edit"></FlexIcon>
            <FlexIcon to={'/setting/staff/staff_new/'+row.id} icon="rubbish" title="action.delete"></FlexIcon>
          </div>);
        }}
      ]
    }
  },

  componentDidMount: function() {
  },

  doStaffNew: function() {
    // this.context.router.transitionTo('setting.staff.edit', {id:0});
    this.props.history.pushState(null, '/setting/staff/staff_new/0');
  },

  render: function() {
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="staff.title.list" component="h2" />
          </div>
          <div className="boxf flex no-shrink">
            <div className="panel2 no-shrink">
              <FlexButton icon="add184" label="staff.action.new"
                onClick={this.doStaffNew}/>
            </div>
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            id="setting-staff-list"
            listAction={staffActions.list}
            exportAction={staffActions.export}
            facetAction={staffActions.facetList}
            fields={this.state.fields}
            pk="id"
            sortBy="user"
            sortDir="ASC"
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

module.exports = StaffList;
