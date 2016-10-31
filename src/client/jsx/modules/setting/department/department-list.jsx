var React         = require('react');
var Reflux        = require('reflux');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var systemActions     = system.systemActions; //require('../../system/actions');
var dialogActions     = system.dialogActions; //require('../../system/actions/dialog');
var toasterActions    = system.toasterActions; //require('../../system/actions/toaster');

var departmentActions  = require('./actions');
var departmentStore    = require('./store');

var FlexGrid      = widgets.FlexGrid; //require('../../../widgets/flex-grid.jsx');
var FlexIcon      = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

var DepartmentList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(departmentActions.delete.done, 'onDeleteDoneAction'),
    Reflux.listenTo(departmentActions.delete.error, 'onDeleteErrorAction')
  ],

  getInitialState: function() {
    return {
      fields: [
        {name:'code', title:'department.code', width:'100px'},
        {name:'name', title:'department.name'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to={'/setting/department/department_edit/'+row.id} icon="create3" title="action.edit"></FlexIcon>
            <FlexIcon icon="rubbish" title="action.delete" onClick={function(e) {console.log('onClick');this.doDelete(e, row.id)}.bind(this)}></FlexIcon>
          </div>);
        }.bind(this)}
      ]
    }
  },

  componentDidMount: function() {
  },

  doDepartmentNew: function() {
    // this.context.router.transitionTo('setting.department.edit', {id:0});
    this.props.history.pushState(null, '/setting/department/department_edit/0');
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
      departmentActions.delete(id);
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
            <T content="department.title.list" component="h2" />
          </div>
          <div className="boxf flex no-shrink">
            <div className="panel2 no-shrink">
              <FlexButton icon="add184" label="department.action.new"
                onClick={this.doDepartmentNew}/>
            </div>
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            id="setting-department-list"
            ref="grid"
            listAction={departmentActions.list}
            exportAction={departmentActions.export}
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

module.exports = DepartmentList;
