var React         = require('react');
var Reflux        = require('reflux');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var infoPanelActions  = system.infoPanelActions; //require('../../system/actions/info-panel');
var helper            = system.helper; // require('../../../../../server/lib/helper');
var dialogActions     = system.dialogActions; //require('../../system/actions/dialog');
var toasterActions    = system.toasterActions; //require('../../system/actions/toaster');

var departmentActions  = require('./actions');
var departmentStore    = require('./store');

var FlexForm      = widgets.FlexForm; //require('../../../widgets/flex-form.jsx');
var FlexIcon      = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
var FlexTextInput = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');
var FlexDropdown  = widgets.FlexDropdown; //require('../../../widgets/flex-dropdown.jsx');
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

var resetData = {
  id:0,
  code:'',
  name:''
};

var DepartmentEdit = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [
    Reflux.listenTo(departmentActions.getById.done, 'onGetByIdDoneAction'),
    Reflux.listenTo(departmentActions.save.done, 'onSaveDoneAction'),
    Reflux.listenTo(departmentActions.save.error, 'onSaveErrorAction')
  ],
  statics: {
    willTransitionFrom: function (transition, component, cb) {
      if (component.formHasUnsavedData()) {
        dialogActions.show({
          title:'dialog.title.confirm_to_exit',
          content:'ข้อมูลยังไม่ถูกบันทึก ยืนยันการออกจากหน้าจอนี้',
          actions:[
            {id:'ok', icon:'check52', label:'dialog.confirm'},
            {id:'cancel', icon:'close47', label:'dialog.cancel', default:true}
          ]
        }, function(isCancel, id) {
          if (isCancel==true || id=='cancel') {
            transition.abort();
            cb();
          } else {
            // confirm to go
            transition.retry();
            cb();
          }
        });
      } else {
        transition.retry();
        cb();
      }
    }
  },

  getInitialState: function() {
    var fields = {
      code:{
        id:'code',
        type:'text',
        label:'department.code',
        icon:'user158',
        required:true,
        autofocus:true,
        pattern:'.{2,}',
        tabIndex: 1
      },
      name:{
        id:'name',
        type:'text',
        label:'department.name',
        icon:'user158',
        required:true,
        tabIndex: 2
      },
      save: {
        id:'save',
        tabIndex:6
      }
    };

    // var id = parseInt(this.context.router.getCurrentParams().id);
    var id = this.props.params.id;
    return {
      id: id,
      data: helper.clone(resetData),
      origData: helper.clone(resetData),
      fields: fields,
      isLock:false
    }
  },

  componentDidMount: function() {
    departmentActions.getById(this.props.params.id);
    infoPanelActions.show('setting.department', null);
  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  formHasUnsavedData: function() {
    return JSON.stringify(this.state.data) != JSON.stringify(this.state.origData);
  },

  onGetByIdDoneAction: function(data) {
    this.setState({
      data: data,
      origData: helper.clone(data)
    });
    infoPanelActions.show('setting.department', (
      <dl className="dl">
        <dt><T content="row.created_at"/></dt>
        <dd>{data.created_at.substr(0,4)=='0000'?
          '-':
          tr.localize(new Date(data.created_at), {format: 'short'})}</dd>
        <dt><T content="row.updated_at"/></dt>
        <dd>{data.updated_at.substr(0,4)=='0000'?
          '-':
          tr.localize(new Date(data.updated_at), {format: 'short'})}</dd>
      </dl>
    ));
  },

  onSaveDoneAction: function(data) {
    this.setState({
      isLock:false,
      data: helper.clone(resetData),
      origData: helper.clone(resetData)
    });
    toasterActions.pop({
      type:'success',
      message:'result.save_done'
    });
  },

  onSaveErrorAction: function(data) {
    this.setState({
      isLock:false
    });
    toasterActions.pop({
      type:'warning',
      message:'result.save_failed'
    });
  },

  doDepartmentSave: function() {
    // validate
    var data = this.state.data;
    var err = [];
    if (data.code=='') {
      err.push(tr.translate('department.error.code_empty'));
    }
    if (data.name=='') {
      err.push(tr.translate('department.error.name_empty'));
    }
    if (err.length > 0) {
      toasterActions.pop({
        type:'warning',
        message: err.join('\r\n')
      });
      return;
    }

    this.setState({
      isLock:true
    });
    departmentActions.save(this.state.data);
  },

  handleChange:function(id, newValue) {
    var data = this.state.data;
    data[id]=newValue;
    this.setState({
      data:data,
      isValid: this.refs.departmentForm.isValid()
    });
  },

  render: function() {
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content={this.state.data.id==0?'department.title.new':'department.title.edit'} component="h2" />
          </div>
          <div className="boxf flex no-shrink">
            <div className="panel2 no-shrink">
              <FlexButton
                label="action.save"
                field={this.state.fields.save}
                icon="save20"
                default={true}
                onClick={this.doDepartmentSave}
                />
            </div>
          </div>
        </div>
        <div className={'content-body boxf lockable'+(this.state.isLock?' lock':'')}>
          <div className="lock"></div>
          <FlexForm ref="departmentForm" fields={this.state.fields} data={this.state.data}>
            <div className="box6 flex">
              <div className="box3">
                <div className="panel3">
                  <FlexTextInput ref="code" field={this.state.fields.code} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="box3">
                <div className="panel3">
                  <FlexTextInput ref="name" field={this.state.fields.name} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>
            </div>
          </FlexForm>
        </div>
      </div>
    );
  }
});

module.exports = DepartmentEdit;
