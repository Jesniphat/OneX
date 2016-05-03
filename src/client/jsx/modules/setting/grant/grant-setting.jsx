var React         = require('react');
var Reflux        = require('reflux');
var Router        = require('react-router');
var Link          = Router.Link;
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var systemActions     = system.systemActions; //require('../../system/actions');
var infoPanelActions  = system.infoPanelActions; //require('../../system/actions/info-panel');
var helper            = system.helper; //require('../../../../../server/lib/helper');
var dialogActions     = system.dialogActions; //require('../../system/actions/dialog');
var toasterActions    = system.toasterActions; //require('../../system/actions/toaster');

var grantActions  = require('./actions');
var grantStore    = require('./store');

var FlexForm      = widgets.FlexForm; //require('../../../widgets/flex-form.jsx');
var FlexIcon      = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
var FlexTextInput = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');
var FlexDropdown  = widgets.FlexDropdown; //require('../../../widgets/flex-dropdown.jsx');
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
var FlexCheckbox  = widgets.FlexCheckbox; //require('../../../widgets/flex-checkbox.jsx');
var FlexTab       = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');

var GrantSetting = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [
    Reflux.listenTo(grantActions.facetSetting.done, 'onFacetSettingDoneAction'),
    Reflux.listenTo(grantActions.facetSetting.error, 'onFacetSettingErrorAction'),
    Reflux.listenTo(grantActions.save.done, 'onSaveDoneAction'),
    Reflux.listenTo(grantActions.save.error, 'onSaveErrorAction')
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
    return {
      selectedTab:'staff',
      field: {
        id:'list',
        icon:'user157',
        label:'grant.staff',
        list:[]
      },
      selectedItem:1,
      shop:[],
      role:[],
      staff:[],
      department:[],
      data:[],
      origData:[],
      expand:-1,
      expand0:-1
    }
  },

  componentDidMount: function() {
    grantActions.facetSetting();
  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  formHasUnsavedData: function() {
    return JSON.stringify(this.state.data) != JSON.stringify(this.state.origData);
  },

  onFacetSettingDoneAction: function(data) {
    var obj = {
      data: data.grant,
      origData: helper.clone(data.grant),
      shop: data.shop,
      role: data.role,
      staff: data.staff,
      department: data.department
    };
    this._setupList(this.state.selectedTab, obj, data);
    this.setState(obj);
  },

  _setupList: function(list, obj, data) {
    if (list=='staff') {
      obj.field = helper.clone(this.state.field);
      obj.field.label = 'grant.staff';
      obj.field.list = this._genList(data.staff);
      if (data.staff.length > 0) {
        obj.selectedItem = data.staff[0].id;
      }
    } else if (list=='shop') {
      obj.field = helper.clone(this.state.field);
      obj.field.label = 'grant.shop';
      obj.field.list = this._genList(data.shop);
      if (data.shop.length > 0) {
        obj.selectedItem = data.shop[0].id;
      }
    } else if (list=='role') {
      obj.field = helper.clone(this.state.field);
      obj.field.label = 'grant.role';
      obj.field.list = this._genList(data.role);
      if (data.role.length > 0) {
        obj.selectedItem = data.role[0].id;
      }
    }
  },

  onFacetSettingErrorAction: function() {
  },

  onSaveDoneAction: function(data) {
    this.setState({
      isLock:false,
      origData: helper.clone(this.state.data)
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

  _genList: function(list) {
    return list.map(function(item) {
      return {value:item.id, text:item.code+' '+item.name};
    });
  },

  doSave: function() {
    // validate
    var data = this.state.data;

    console.log('data',this.state.data,'orig',this.state.origData,',data:',data);
    var err = [];
    if (data.code=='') {
      err.push(tr.translate('grant.error.code_empty'));
    }
    if (data.name=='') {
      err.push(tr.translate('grant.error.name_empty'));
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
    grantActions.save(this.state.data);
  },

  handleChange:function(id, newValue) {
    var data = this.state.data;
    data[id]=newValue;
    this.setState({
      data:data,
      isValid: this.refs.grantForm.isValid()
    });
  },

  togglePermission:function(p_id) {
    this.state.data.p[p_id] = !!!this.state.data.p[p_id];
    this.setState({
      data:this.state.data
    });
  },

  handleTabClick: function(id) {
    var obj = {
      selectedTab: id,
      expand0: -1,
      expand:-1
    };
    this._setupList(id, obj, this.state);
    this.setState(obj);
  },

  handleListChange: function(id, value) {
    this.setState({
      selectedItem: value
    });
  },

  toggleGrant:function(p_id) {

    if (p_id.indexOf('_ALLSHOP') > 0 ){
        var chkAllshop = this.state.selectedItem;
        var chkStaff = p_id.replace('_ALLSHOP','');
        chkStaff = chkStaff.replace(' ','');

        var chkId = '';
        var _shop = this.state.shop;
        var a = this;
        _shop.forEach(function(item){

           chkId = chkStaff + '_' + item.id + "_" + chkAllshop;
           chkId = chkId.replace(' ','');

           a.state.data[chkId] = !!!a.state.data[p_id];
           a.setState({
             data:a.state.data
           });
        });

        this.state.data[p_id] = !!!this.state.data[p_id];
        this.setState({
          data:this.state.data
        });

    }else{
        this.state.data[p_id] = !!!this.state.data[p_id];
        this.setState({
          data:this.state.data
        });
    }


  },

  _SetStatus:function(p_id,status){

    console.log('idUpdate:',p_id);

    this.state.data[p_id] = status;
    this.setState({
      data:this.state.data
    });
  },

  // return staff_shop_role
  _genId: function(id1, id2, id3) {
    if (this.state.selectedTab == 'staff') {
      // id1 == shop
      // id2 == role
      return this.state.selectedItem + '_' + id1 + '_' + id2;
    }
    if (this.state.selectedTab == 'shop') {
      // id1 == staff
      // id2 == role
      return id1 + '_' + (id3 || this.state.selectedItem) + '_' + id2;
    }
    if (this.state.selectedTab == 'role') {
      // id1 == staff
      // id2 == shop
      return id1 + '_' + id2 + '_' + this.state.selectedItem;
    }
  },

  _genSetting: function(level1, level2) {
    var list = this.state[level1].map(function(item) {
      var cnt = 0;
      var total = 0;
      var list2 = null;
      var text = [];
      if (item.id==this.state.expand) {
        list2 = this.state[level2].map(function(item2) {
          var id = this._genId(item.id, item2.id);
          cnt += this.state.data[id] ? 1 : 0;
          total++;
          return (
            <li key={level2+'_'+item2.id}>
              <FlexCheckbox
                field={{id: id, type:'checkbox', label: item2.code + ' ' + item2.name, raw:true}}
                data={this.state.data}
                onChange={this.toggleGrant}
                />
            </li>
          );
        }.bind(this));
      } else {
        this.state[level2].forEach(function(item2) {
          var id = this._genId(item.id, item2.id);
          cnt += this.state.data[id] ? 1 : 0;
          total++;
          if (this.state.data[id]) {
            text.push(item2.code);
          }
        }.bind(this));
      }
      return (
        <li key={level1+'_'+item.id}>
          <div
            className="header"
            style={{cursor:'pointer'}}
            onClick={
              function() {
                this.setState({
                  expand:item.id==this.state.expand ? -1 : item.id
                });
              }.bind(this)
            }><b>{item.code + ' ' + item.name}</b> (<span className={cnt>0?'blue':null}>{cnt}</span>/{total}){text.length==0?null:' ['+text.join(', ') + ']'}</div>
          {
            list2 != null ? (
              <ul className="flex check_list">
                {list2}
              </ul>) : null
          }
        </li>
      );
    }.bind(this));
    return (
      <ul className="grant-table">
        {list}
      </ul>
    )
  },

  _genSettingShop: function(level1, level2) {
    var data = {};

    // build staff-shop array
    var st_sh = {};
    var sh_st = {};
    var tmp2 = {};
    for(var key in this.state.data) {
      var tmp = key.split('_');
      if (!st_sh[tmp[0]]) {
        st_sh[tmp[0]] = {};
      }
      if (!st_sh[tmp[0]][tmp[1]]) {
        st_sh[tmp[0]][tmp[1]] = true;
      }
      if (!sh_st[tmp[1]]) {
        sh_st[tmp[1]] = {};
      }
      if (!sh_st[tmp[1]][tmp[0]]) {
        sh_st[tmp[1]][tmp[0]] = true;
      }
    }


    this.state.staff.forEach(function(item) {
      if (!st_sh[item.id]) {
        return;
      }
      for(var sh in st_sh[item.id]) {
        if (!data[sh]) {
          data[sh] = [];
        }
        data[sh].push(item);
      }
    });

    var groups = [this.state.selectedItem];

    var title = {};

    this.state.shop.forEach(function(item) {
      title[item.id] = item.code + ': ' + item.name;
      if (item.id != this.state.selectedItem) {
        groups.push(item.id);
      }
    }.bind(this));

    var list0 = [];

    groups.forEach(function(group) {
      if (!data[group]) {
        return;
      }
      if (group==this.state.expand0) {
        var list = data[group].map(function(item) {
          var cnt = 0;
          var total = 0;
          var list2 = null;
          var text = [];
          if (item.id==this.state.expand) {
            list2 = this.state[level2].map(function(item2) {
              var id = this._genId(item.id, item2.id, group);
              cnt += this.state.data[id] ? 1 : 0;
              total++;
              return (
                <li key={level2+'_'+item2.id}>
                  <FlexCheckbox
                    field={{id: id, type:'checkbox', label: item2.code + ' ' + item2.name, raw:true}}
                    data={this.state.data}
                    onChange={this.toggleGrant}
                    />
                </li>
              );
            }.bind(this));
          } else {
            this.state[level2].forEach(function(item2) {
              var id = this._genId(item.id, item2.id, group);
              cnt += this.state.data[id] ? 1 : 0;
              total++;
              if (this.state.data[id]) {
                text.push(item2.code);
              }
            }.bind(this));
          }
          return (
            <li key={level1+'_'+item.id}>
              <div
                className="header"
                style={{cursor:'pointer'}}
                onClick={
                  function() {
                    this.setState({
                      expand:item.id==this.state.expand ? -1 : item.id
                    });
                  }.bind(this)
                }><b>{item.code + ' ' + item.name}</b> (<span className={cnt>0?'blue':null}>{cnt}</span>/{total}){text.length==0?null:' ['+text.join(', ') + ']'}</div>
              {
                list2 != null ? (
                  <ul className="flex check_list">
                    {list2}
                  </ul>) : null
              }
            </li>
          );
        }.bind(this));
      }
      var total = 0;
      var cnt = 0;
      for (var i in sh_st[group]) {
        cnt++;
      }
      total = cnt;
      /*
      for (var i = 0; i < this.state.staff.length; i++) {
        if (this.state.staff[i].shop_id!=group) {
          continue;
        }
        total++;
        for (var j = 0; j < this.state.role.length; j++) {
          var id = this._genId(this.state.staff[i].id, this.state.role[j].id);
          if (this.state.data[id]) {
            cnt++;
            break;
          }
        }
      }
      */
      var text0 = (
        <span>(<span className={cnt>0?'blue':null}>{cnt}</span>/{total})</span>
      );

      var header = (
        <div
          className="header2"
          onClick={
            function() {
              this.setState({
                expand0:group==this.state.expand0 ? -1 : group
              });
            }.bind(this)
          }>{title[group] ? title[group] : '-'} {text0}</div>
      );

      list0.push((
        <li key={'shop_'+group} style={{cursor:'pointer'}} className="grouping">
          {header}
          {
            list != null ? (
              <ol>
                {list}
              </ol>
            ) : null
          }
        </li>
      ));

    }.bind(this));



    return (
      <ul className="grant-table">
        {list0}
      </ul>
    )
  },

  _genSettingDepartment: function(level1, level2) {
    var data = {};
    this.state.staff.forEach(function(item) {
      if (!data[item.department_id]) {
        data[item.department_id] = [];
      }
      data[item.department_id].push(item);
    });

    var groups = [];
    var title = {};
    this.state.department.forEach(function(item) {
      title[item.id] = item.code + ': ' + item.name;
      groups.push(item.id);
    }.bind(this));

    var list0 = [];
    groups.forEach(function(group) {
      if (!data[group]) {
        return;
      }
      if (group==this.state.expand0) {
        var list = data[group].map(function(item) {
          var cnt = 0;
          var total = 0;
          var list2 = null;
          var text = [];
          if (item.id==this.state.expand) {
            list2 = this.state[level2].map(function(item2) {
              var id = this._genId(item.id, item2.id);
              cnt += this.state.data[id] ? 1 : 0;
              total++;
              return (
                <li key={level2+'_'+item2.id}>
                  <FlexCheckbox
                    field={{id: id, type:'checkbox', label: item2.code + ' ' + item2.name, raw:true}}
                    data={this.state.data}
                    onChange={this.toggleGrant}
                    />
                </li>
              );

            }.bind(this));

          } else {
            this.state[level2].forEach(function(item2) {
              var id = this._genId(item.id, item2.id);
              cnt += this.state.data[id] ? 1 : 0;
              total++;
              if (this.state.data[id]) {
                text.push(item2.code);
              }
            }.bind(this));
          }
          return (
            <li key={level1+'_'+item.id}>
              <div
                className="header"
                style={{cursor:'pointer'}}
                onClick={
                  function() {
                    this.setState({
                      expand:item.id==this.state.expand ? -1 : item.id
                    });
                  }.bind(this)
                }><b>{item.code + ' ' + item.name}</b> (<span className={cnt>0?'blue':null}>{cnt}</span>/{total}){text.length==0?null:' ['+text.join(', ') + ']'}</div>
              {
                list2 != null ? (
                  <ul className="flex check_list">
                    <li>
                      <FlexCheckbox
                        field={{id:item.id+'_ALLSHOP', type:'checkbox', label: 'All Shop', raw:true}}
                        data={this.state.data}
                        onChange={this.toggleGrant}
                        />
                    </li>
                  </ul>
                ) : null
              }
              {
                list2 != null ? (
                  <ul className="flex check_list">
                    {list2}
                  </ul>) : null
              }
            </li>
          );
        }.bind(this));
      }

      var total = 0;
      var cnt = 0;
      for (var i = 0; i < this.state.staff.length; i++) {
        if (this.state.staff[i].department_id!=group) {
          continue;
        }
        total++;
        for (var j = 0; j < this.state.shop.length; j++) {
          var id = this._genId(this.state.staff[i].id, this.state.shop[j].id);
          if (this.state.data[id]) {
            cnt++;
            break;
          }
        }
      }
      var text0 = (
        <span>(<span className={cnt>0?'blue':null}>{cnt}</span>/{total})</span>
      );

      var header = (
        <div
          className="header2"
          onClick={
            function() {
              this.setState({
                expand0:group==this.state.expand0 ? -1 : group
              });
            }.bind(this)
          }
          >{title[group] ? title[group] : '-'} {text0}</div>
      );

      list0.push((
        <li key={'department_'+group} style={{cursor:'pointer'}} className="grouping">
          {header}
          {
            list != null ? (
              <ol>
                {list}
              </ol>
            ) : null
          }
        </li>
      ));
    }.bind(this));


    return (
      <ul className="grant-table">
        {list0}
      </ul>
    )
  },

  genSetting: function() {
    if (this.state.selectedTab=='staff') {
      return this._genSetting('shop', 'role');
    } else if (this.state.selectedTab=='shop') {
      return this._genSettingShop('staff', 'role');
    } else if (this.state.selectedTab=='role') {
      return this._genSettingDepartment('staff', 'shop');
    }
  },

  render: function() {
    var list = [
      {id:'staff', icon:'user157', text:'grant.bystaff'},
      {id:'shop', icon:'web37', text:'grant.byshop'},
      {id:'role', icon:'two385', text:'grant.byrole'}
    ];
    return (
      <div className="content-page flex-form">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="grant.title.setting" component="h2" />
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
            <FlexTab list={list} selected={this.state.selectedTab} onClick={this.handleTabClick}/>
          </div>
          <div className="panelf">
            <FlexDropdown
              field={this.state.field}
              data={{list:this.state.selectedItem}}
              onChange={this.handleListChange}
              />
          </div>
        </div>
        <div className="content-body panelf flex-form">
          {this.genSetting()}
        </div>
      </div>
    );
  }
});

module.exports = GrantSetting;
