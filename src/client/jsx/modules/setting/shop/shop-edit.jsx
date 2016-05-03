var React         = require('react');
var Reflux        = require('reflux');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var infoPanelActions = system.infoPanelActions; //require('../../system/actions/info-panel');
var helper        = system.helper; //equire('../../../../../server/lib/helper');
var dialogActions = system.dialogActions; //require('../../system/actions/dialog');
var toasterActions = system.toasterActions; //require('../../system/actions/toaster');

var shopActions  = require('./actions');
var shopStore    = require('./store');

var FlexForm      = widgets.FlexForm; // require('../../../widgets/flex-form.jsx');
var FlexIcon      = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
var FlexTextInput = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');
var FlexDropdown  = widgets.FlexDropdown; //require('../../../widgets/flex-dropdown.jsx');
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');


var resetData = {
  id:0,
  code:'',
  name:'',
  location:'',
  tel:'',
  fax:''
};

var ShopEdit = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [
    Reflux.listenTo(shopActions.getById.done, 'onGetByIdDoneAction'),
    Reflux.listenTo(shopActions.save.done, 'onSaveDoneAction'),
    Reflux.listenTo(shopActions.save.error, 'onSaveErrorAction')
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
    var id = parseInt(this.context.router.getCurrentParams().id);
    if (isNaN(id)) {
      id = 0;
    }
    var fields = {
      code:{
        id:'code',
        type:'text',
        label:'shop.code',
        icon:'user158',
        required:true,
        autofocus:true,
        pattern:'.{2,}',
        tabIndex: 1
      },
      prefix_barcode:{
        id:'prefix_barcode',
        type:'text',
        label:'shop.prefix_barcode',
        icon:'user158',
        pattern:'^[0-9]{2}$',
        tabIndex: 2,
        readonly: id > 0
      },
      name:{
        id:'name',
        type:'text',
        label:'shop.name',
        icon:'user158',
        required:true,
        tabIndex: 3
      },
      location:{
        id:'location',
        type:'text',
        label:'shop.location',
        icon:'user158',
        tabIndex: 4
      },
      tel:{
        id:'tel',
        type:'text',
        label:'shop.tel',
        icon:'user158',
        tabIndex: 5
      },
      fax:{
        id:'fax',
        type:'text',
        label:'shop.fax',
        icon:'user158',
        tabIndex: 6
      },
      is_active:{
        id:'is_active',
        type:'dropdown',
        label:'shop.is_active',
        icon:'user158',
        list: [
          {value:'YES', text:'ACTIVE'},
          {value:'NO', text:'INACTIVE'}
        ],
        tabIndex: 7
      },
      save: {
        id:'save',
        tabIndex: 8
      }
    };

    return {
      id: id,
      data: helper.clone(resetData),
      origData: helper.clone(resetData),
      fields: fields,
      isLock:false
    }
  },

  componentDidMount: function() {
    shopActions.getById(this.context.router.getCurrentParams().id);
    infoPanelActions.show('setting.shop', null);
  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  formHasUnsavedData: function() {
    return JSON.stringify(this.state.data) != JSON.stringify(this.state.origData);
  },

  onGetByIdDoneAction: function(data) {
    this.state.fields.prefix_barcode.readonly=data.prefix_barcode.trim() != '';
    console.log('data:',data);
    var obj = {
      data: data,
      origData: helper.clone(data),
      fields: this.state.fields
    };

    this.setState(obj);

    infoPanelActions.show('setting.shop', (
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

  doShopSave: function() {
    // validate
    var data = this.state.data;
    var err = [];
    if (data.code=='') {
      err.push(tr.translate('shop.error.code_empty'));
    }
    if (data.name=='') {
      err.push(tr.translate('shop.error.name_empty'));
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
    shopActions.save(this.state.data);
  },

  handleChange:function(id, newValue) {
    var data = this.state.data;
    data[id]=newValue;
    this.setState({
      data:data,
      isValid: this.refs.shopForm.isValid()
    });
  },

  render: function() {
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content={this.state.data.id==0?'shop.title.new':'shop.title.edit'} component="h2" />
          </div>
          <div className="boxf flex no-shrink">
            <div className="panel2 no-shrink">
              <FlexButton
                label="action.save"
                field={this.state.fields.save}
                icon="save20"
                default={true}
                onClick={this.doShopSave}
                />
            </div>
          </div>
        </div>
        <div className={'content-body boxf lockable'+(this.state.isLock?' lock':'')}>
          <div className="lock"></div>
          <FlexForm ref="shopForm" fields={this.state.fields} data={this.state.data}>
            <div className="box6 flex">
              <div className="box3">
                <div className="panel3">
                  <FlexTextInput ref="code" field={this.state.fields.code} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="box3">
                <div className="panel3">
                  <FlexTextInput ref="prefix_barcode" field={this.state.fields.prefix_barcode} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>
            </div>

            <div className="box6">
              <div className="panel6">
                <FlexTextInput ref="name" field={this.state.fields.name} data={this.state.data} onChange={this.handleChange}/>
              </div>
            </div>

            <div className="box6">
              <div className="panel6">
                <FlexTextInput ref="location" field={this.state.fields.location} data={this.state.data} onChange={this.handleChange}/>
              </div>
            </div>

            <div className="box6 flex">
              <div className="box3">
                <div className="panel3">
                  <FlexTextInput ref="tel" field={this.state.fields.tel} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="box3">
                <div className="panel3">
                  <FlexTextInput ref="fax" field={this.state.fields.fax} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>
            </div>

            <div className="box6 flex">
              <div className="box3">
                <div className="panel3">
                  <FlexDropdown ref="is_active" field={this.state.fields.is_active} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>
              <div className="box3">
                <div className="panel3">
                </div>
              </div>
            </div>

          </FlexForm>
        </div>
      </div>
    );
  }
});

module.exports = ShopEdit;
