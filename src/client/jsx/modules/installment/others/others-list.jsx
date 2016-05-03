var React         = require('react');
var Reflux        = require('reflux');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var systemActions     = system.systemActions;
var dialogActions     = system.dialogActions;
var toasterActions    = system.toasterActions;

var customerActions  = require('./actions');
var customerStore    = require('./store');

var FlexGrid      = widgets.FlexGrid;
var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;

var CustomerList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(customerActions.delete.done, 'onDeleteDoneAction'),
    Reflux.listenTo(customerActions.delete.error, 'onDeleteErrorAction')
  ],

  getInitialState: function() {
    return {
      fields: [
        {name:'code', title:'customer.code', width:'100px'},
        {name:'fullname', title:'customer.fullname'},
        {name:'nation_id', title:'customer.nation_id'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="stock.customer.edit" param={{id:row.id}} icon="create3" title="action.edit"></FlexIcon>
            <FlexIcon icon="rubbish" title="action.delete" onClick={function(e) {console.log('onClick');this.doDelete(e, row.id)}.bind(this)}></FlexIcon>
          </div>);
        }.bind(this)}
      ]
    }
  },

  componentDidMount: function() {
  },

  doCustomerNew: function() {
    this.context.router.transitionTo('stock.customer.edit', {id:0});
  },

  doDelete: function(e, id) {
    e.preventDefault();
    dialogActions.show({
      title:'dialog.title.confirm_to_delete',
      content:'ข้อมูลจะถูกลบถาวร ยืนยันหรือไม่',
      actions:[
        {id:'ok', icon:'check52', label:'dialog.confirm'},
        {id:'cancel', icon:'close47', label:'dialog.cancel', default:true}
      ]
    }, function(isCancel, action_id) {
      if (isCancel || action_id=='cancel') {
        return;
      }
      customerActions.delete(id);
    });
  },

  onDeleteDoneAction: function() {
    toasterActions.pop({
      type:'success',
      message:'delete.ok'
    });
    this.refs.grid.doRefresh();
//    console.log(this.refs);
  },

  onDeleteErrorAction: function(result) {
    toasterActions.pop({
      type:'warning',
      message: 'error.delete'
    });
  },

  render: function() {
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="customer.title.list" component="h2" />
          </div>
          <div className="boxf flex no-shrink">
            <div className="panel2 no-shrink">
              <FlexButton icon="add184" label="customer.action.new"
                onClick={this.doCustomerNew}/>
            </div>
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            ref="grid"
            actions={customerActions}
            fields={this.state.fields}
            pk="id"
            sortBy="code"
            sortDir="ASC"
            limit={10}
            checkbox={false}
            search={true}
            />
        </div>
      </div>
    );
  }
});

module.exports = CustomerList;
