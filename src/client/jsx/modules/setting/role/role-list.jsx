var React         = require('react');
var Reflux        = require('reflux');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var systemActions = system.systemActions;
var infoPanelActions = system.infoPanelActions;
var dialogActions = system.dialogActions;
var toasterActions = system.toasterActions;

var roleActions   = require('./actions');
var roleStore     = require('./store');

var FlexGrid      = widgets.FlexGrid;
var FlexIcon      = widgets.FlexIcon;
var FlexButton    = widgets.FlexButton;

var RoleList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(roleActions.delete.done, 'onDeleteDoneAction'),
    Reflux.listenTo(roleActions.delete.error, 'onDeleteErrorAction')
  ],

  getInitialState: function() {
    return {
      fields: [
        {name:'code', title:'role.code', width:'100px'},
        {name:'name', title:'role.name'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="setting.role.edit" param={{id:row.id}} icon="create3" title="action.edit"></FlexIcon>
            <FlexIcon icon="rubbish" title="action.delete" onClick={function(e) {this.doDelete(e, row.id)}.bind(this)}></FlexIcon>
          </div>);
        }.bind(this)}
      ]
    }
  },

  componentDidMount: function() {
  },

  doRoleNew: function() {
    this.context.router.transitionTo('setting.role.edit', {id:0});
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
      roleActions.delete(id);
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
            <T content="role.title.list" component="h2" />
          </div>
          <div className="boxf flex no-shrink">
            <div className="panel2 no-shrink">
              <FlexButton icon="add184" label="role.action.new"
                onClick={this.doRoleNew}/>
            </div>
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            id="setting-role-list"
            ref="grid"
            listAction={roleActions.list}
            exportAction={roleActions.export}
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

module.exports = RoleList;
