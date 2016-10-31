var React         = require('react');
var Reflux        = require('reflux');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var systemActions     = system.systemActions; //require('../../system/actions');
var sessionStore      = system.sessionStore;
var infoPanelActions  = system.infoPanelActions; //require('../../system/actions/info-panel');
var helper            = system.helper; //require('../../../../../server/lib/helper');
var dialogActions     = system.dialogActions; //require('../../system/actions/dialog');
var toasterActions    = system.toasterActions; //require('../../system/actions/toaster');

var defaultActions  = require('./actions');
var grantStore    = require('./store');

var FlexForm      = widgets.FlexForm; //require('../../../widgets/flex-form.jsx');
var FlexIcon      = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
var FlexTextInput = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');
var FlexDropdown  = widgets.FlexDropdown; //require('../../../widgets/flex-dropdown.jsx');
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
var FlexCheckbox  = widgets.FlexCheckbox; //require('../../../widgets/flex-checkbox.jsx');
var FlexTab       = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');

var resetData = {
  company_name: "",
  tambon: "",
  amphur: "",
  addr1: "",
  addr2: "",
  province:"",
  zipcode:"",
  tel:"",
  email:"",
  homepage:"",
  conditionpage:"",
  doc1:"",
  doc2:"",
  doc3:"",
  headerPic:"",
  vatrate:""
};

var GrantSetting = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [
    Reflux.listenTo(defaultActions.facetSetting.done, 'onFacetSettingDoneAction'),
    Reflux.listenTo(defaultActions.facetSetting.error, 'onFacetSettingErrorAction'),
    Reflux.listenTo(defaultActions.save.done, 'onSaveDoneAction'),
    Reflux.listenTo(defaultActions.save.error, 'onSaveErrorAction')
  ],

  getInitialState: function() {
    var staff = sessionStore.getSession().staff;
    var fields = {
      company_name:{
        id:'company_name',
        type:'text',
        label:'default.fields.company_name',
        required:true,
        autofocus:true,
      },
      tambon:{
        id: 'tambon',
        type: 'text',
        required: true,
        label: 'default.fields.tambon'
      },
      amphur:{
        id: 'amphur',
        type: 'text',
        required: true,
        label: 'default.fields.amphur'
      },
      addr1:{
        id: 'addr1',
        type: 'text',
        required:true,
        label: 'default.fields.addr1'
      },
      addr2:{
        id: 'addr2',
        type: 'text',
        required:true,
        label: 'default.fields.addr2'
      },
      province:{
        id: 'province',
        type: 'text',
        required:true,
        label: 'default.fields.province'
      },
      zipcode:{
        id: 'zipcode',
        type: 'text',
        required:true,
        label: 'default.fields.zipcode'
      },
      tel:{
        id: 'tel',
        type: 'text',
        required:true,
        label: 'default.fields.tel'
      },
      email:{
        id: 'email',
        type: 'text',
        required:true,
        label: 'default.fields.email'
      },
      homepage:{
        id: 'homepage',
        type: 'text',
        required:true,
        label: 'default.fields.homepage'
      },
      conditionpage:{
        id: 'conditionpage',
        type: 'text',
        required:true,
        label: 'default.fields.conditionpage'
      },
      doc1:{
        id: 'doc1',
        type: 'text',
        required:true,
        label: 'default.fields.doc1'
      },
      doc2:{
        id: 'doc2',
        type: 'text',
        required:true,
        label: 'default.fields.doc2'
      },
      doc3:{
        id: 'doc3',
        type: 'text',
        required:true,
        label: 'default.fields.doc3'
      },
      headerPic:{
        id:'headerPic',
        name:'headerPic',
        type: 'file',
        label: 'default.fields.headerPic'
      },
      vatrate:{
        id:'vatrate',
        type:'text',
        required:true,
        label: 'default.fields.vatrate'
      }
    };
    return {
      fields: fields,
      data: helper.clone(resetData),
      origData: helper.clone(resetData),
      staff_id: staff.id,
    }
  },

  componentDidMount: function() {
    defaultActions.facetSetting();
  },


  onSaveDoneAction: function(data) {
    toasterActions.pop({
      type:'success',
      message:data.done
    });
    defaultActions.facetSetting();
  },

  onSaveErrorAction: function(data) {
    toasterActions.pop({
      type:'warning',
      message:"Can't update data"
    });
  },

  onFacetSettingDoneAction: function(data) {
    var company_profile = data.done;
    console.log("company_profile = ", company_profile);
    this.state.data.company_name = company_profile.name;
    this.state.data.tambon = company_profile.tambon;
    this.state.data.amphur = company_profile.amphur;
    this.state.data.addr1 = company_profile.addr1;
    this.state.data.addr2 = company_profile.road;
    this.state.data.province = company_profile.province;
    this.state.data.zipcode = company_profile.zipcode;
    this.state.data.tel = company_profile.tel;
    this.state.data.email = company_profile.email;
    this.state.data.homepage = company_profile.homepage;
    this.state.data.conditionpage = company_profile.condition;
    this.state.data.doc1 = company_profile.document1;
    this.state.data.doc2 = company_profile.document2;
    this.state.data.doc3 = company_profile.document3;
    this.state.data.headerPic = "";
    this.state.data.vatrate = company_profile.vat_rate;
    this.setState({
      data: this.state.data
    });
  },

  onFacetSettingErrorAction: function(error) {
    toasterActions.pop({
      type:'warning',
      message:"Can't get data"
    });
  },

  doSave: function() {
    var data = this.state.data;
    data.staff_id = this.state.staff_id,
    console.log("my data = ", data);
    defaultActions.save(this.state.data);
  },

  handleChange:function(id, newValue) {
    var data = this.state.data;
    data[id]=newValue;
    this.setState({
      data:data
    });
  },

  render: function() {
    var list = [];
    return (
      <div className="content-page flex-form">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
          <div className="flaticon-city24 normal icon" style={{height: '32px',float: 'left'}}></div>
            <T style={{marginTop:'7px'}} content="default.title.setting" component="h3" />
          </div>
          <div className="boxf flex no-shrink">
            <div className="panel2 no-shrink">
              <FlexButton
                label="action.save"
                field={{id:'save',tabIndex:1}}
                icon="save20"
                default={true}
                onClick={this.doSave}
                />
            </div>
          </div>
        </div>
        <div className="content-header">
          <div className="panelf">
            <FlexForm ref="shopForm" fields={this.state.fields} data={this.state.data}>

              <div className="box6">
                <div className="panel6">
                  <FlexTextInput ref="company_name" field={this.state.fields.company_name} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>

              <div className="box6">
                <div className="panel6">
                  <FlexTextInput ref="addr1" field={this.state.fields.addr1} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>

              <div className="box6">
                <div className="panel6">
                  <FlexTextInput ref="addr2" field={this.state.fields.addr2} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>

              <div className="box6 flex">
                <div className="box3">
                  <div className="panel3">
                    <FlexTextInput ref="tambon" field={this.state.fields.tambon} data={this.state.data} onChange={this.handleChange}/>
                  </div>
                </div>
                <div className="box3">
                  <div className="panel3">
                    <FlexTextInput ref="amphur" field={this.state.fields.amphur} data={this.state.data} onChange={this.handleChange}/>
                  </div>
                </div>
              </div>

              <div className="box6 flex">
                <div className="box3">
                  <div className="panel3">
                    <FlexTextInput ref="province" field={this.state.fields.province} data={this.state.data} onChange={this.handleChange}/>
                  </div>
                </div>
                <div className="box3">
                  <div className="panel3">
                    <FlexTextInput ref="zipcode" field={this.state.fields.zipcode} data={this.state.data} onChange={this.handleChange}/>
                  </div>
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
                    <FlexTextInput ref="email" field={this.state.fields.email} data={this.state.data} onChange={this.handleChange}/>
                  </div>
                </div>
              </div>

              <div className="box6">
                <div className="panel6">
                  <FlexTextInput ref="homepage" field={this.state.fields.homepage} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>

              <div className="box6">
                <div className="panel6">
                  <FlexTextInput ref="conditionpage" field={this.state.fields.conditionpage} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>

              <div className="box6">
                <div className="panel6">
                  <FlexTextInput ref="vatrate" field={this.state.fields.vatrate} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>

              <br/>
              <br/>
              <div className="flaticon-google134 normal icon" style={{height: '32px',float: 'left'}}></div>
              <T style={{marginTop:'7px'}} content="default.title.fileName" component="h3" />

              <div className="box6">
                <div className="panel6">
                  <FlexTextInput ref="doc1" field={this.state.fields.doc1} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>

              <div className="box6">
                <div className="panel6">
                  <FlexTextInput ref="doc2" field={this.state.fields.doc2} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>

              <div className="box6">
                <div className="panel6">
                  <FlexTextInput ref="doc3" field={this.state.fields.doc3} data={this.state.data} onChange={this.handleChange}/>
                </div>
              </div>


            </FlexForm>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = GrantSetting;
