webpackJsonp([103,135],{

/***/ 904:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var Link = Router.Link;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);

	var systemActions = system.systemActions; //require('../../system/actions');

	var grantActions = __webpack_require__(905);
	var grantStore = __webpack_require__(906);

	var GrantSetting = __webpack_require__(907);

	var Grant = {};

	tr.registerTranslations('en', __webpack_require__(908));
	tr.registerTranslations('th', __webpack_require__(909));

	Grant.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('grant.title.index'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// Grant.Routes = (
	//   <Route name="setting.grant" path="grant" handler={Grant.Index}/>
	// );

	module.exports = Grant;

/***/ },

/***/ 905:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'facetSetting': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] }
	});

/***/ },

/***/ 906:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);

	var ajaxActions = system.ajaxActions; //require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');

	var grantActions = __webpack_require__(905);

	var grantStore = Reflux.createStore({
	  listenables: [grantActions],

	  onFacetSetting: function onFacetSetting() {
	    ajaxActions.request('/api/setting/grant/facetSetting', {}, this.doneFacetSetting);
	  },

	  doneFacetSetting: function doneFacetSetting(res) {
	    if (res.status === true) {
	      grantActions.facetSetting.done(res.data);
	    } else {
	      grantActions.facetSetting.error(res.error);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/setting/grant/save', { data: data }, this.doneSave);
	  },

	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      grantActions.save.done(res.data);
	      //      menuActions.updateCount('grant', res.totalRows);
	    } else {
	        grantActions.save.error(res.msg);
	      }
	  }

	});

	module.exports = grantStore;

/***/ },

/***/ 907:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widgets = __webpack_require__(377);

	var systemActions = system.systemActions; //require('../../system/actions');
	var infoPanelActions = system.infoPanelActions; //require('../../system/actions/info-panel');
	var helper = system.helper; //require('../../../../../server/lib/helper');
	var dialogActions = system.dialogActions; //require('../../system/actions/dialog');
	var toasterActions = system.toasterActions; //require('../../system/actions/toaster');

	var grantActions = __webpack_require__(905);
	var grantStore = __webpack_require__(906);

	var FlexForm = widgets.FlexForm; //require('../../../widgets/flex-form.jsx');
	var FlexIcon = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
	var FlexTextInput = widgets.FlexTextInput; //require('../../../widgets/flex-text-input.jsx');
	var FlexDropdown = widgets.FlexDropdown; //require('../../../widgets/flex-dropdown.jsx');
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
	var FlexCheckbox = widgets.FlexCheckbox; //require('../../../widgets/flex-checkbox.jsx');
	var FlexTab = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');

	var GrantSetting = React.createClass({
	  displayName: 'GrantSetting',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [Reflux.listenTo(grantActions.facetSetting.done, 'onFacetSettingDoneAction'), Reflux.listenTo(grantActions.facetSetting.error, 'onFacetSettingErrorAction'), Reflux.listenTo(grantActions.save.done, 'onSaveDoneAction'), Reflux.listenTo(grantActions.save.error, 'onSaveErrorAction')],
	  statics: {
	    willTransitionFrom: function willTransitionFrom(transition, component, cb) {
	      if (component.formHasUnsavedData()) {
	        dialogActions.show({
	          title: 'dialog.title.confirm_to_exit',
	          content: 'ข้อมูลยังไม่ถูกบันทึก ยืนยันการออกจากหน้าจอนี้',
	          actions: [{ id: 'ok', icon: 'check52', label: 'dialog.confirm' }, { id: 'cancel', icon: 'close47', label: 'dialog.cancel', default: true }]
	        }, function (isCancel, id) {
	          if (isCancel == true || id == 'cancel') {
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

	  getInitialState: function getInitialState() {
	    return {
	      selectedTab: 'staff',
	      field: {
	        id: 'list',
	        icon: 'user157',
	        label: 'grant.staff',
	        list: []
	      },
	      selectedItem: 1,
	      shop: [],
	      role: [],
	      staff: [],
	      department: [],
	      data: [],
	      origData: [],
	      expand: -1,
	      expand0: -1
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    grantActions.facetSetting();
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  formHasUnsavedData: function formHasUnsavedData() {
	    return JSON.stringify(this.state.data) != JSON.stringify(this.state.origData);
	  },

	  onFacetSettingDoneAction: function onFacetSettingDoneAction(data) {
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

	  _setupList: function _setupList(list, obj, data) {
	    if (list == 'staff') {
	      obj.field = helper.clone(this.state.field);
	      obj.field.label = 'grant.staff';
	      obj.field.list = this._genList(data.staff);
	      if (data.staff.length > 0) {
	        obj.selectedItem = data.staff[0].id;
	      }
	    } else if (list == 'shop') {
	      obj.field = helper.clone(this.state.field);
	      obj.field.label = 'grant.shop';
	      obj.field.list = this._genList(data.shop);
	      if (data.shop.length > 0) {
	        obj.selectedItem = data.shop[0].id;
	      }
	    } else if (list == 'role') {
	      obj.field = helper.clone(this.state.field);
	      obj.field.label = 'grant.role';
	      obj.field.list = this._genList(data.role);
	      if (data.role.length > 0) {
	        obj.selectedItem = data.role[0].id;
	      }
	    }
	  },

	  onFacetSettingErrorAction: function onFacetSettingErrorAction() {},

	  onSaveDoneAction: function onSaveDoneAction(data) {
	    this.setState({
	      isLock: false,
	      origData: helper.clone(this.state.data)
	    });
	    toasterActions.pop({
	      type: 'success',
	      message: 'result.save_done'
	    });
	  },

	  onSaveErrorAction: function onSaveErrorAction(data) {
	    this.setState({
	      isLock: false
	    });
	    toasterActions.pop({
	      type: 'warning',
	      message: 'result.save_failed'
	    });
	  },

	  _genList: function _genList(list) {
	    return list.map(function (item) {
	      return { value: item.id, text: item.code + ' ' + item.name };
	    });
	  },

	  doSave: function doSave() {
	    // validate
	    var data = this.state.data;

	    console.log('data', this.state.data, 'orig', this.state.origData, ',data:', data);
	    var err = [];
	    if (data.code == '') {
	      err.push(tr.translate('grant.error.code_empty'));
	    }
	    if (data.name == '') {
	      err.push(tr.translate('grant.error.name_empty'));
	    }
	    if (err.length > 0) {
	      toasterActions.pop({
	        type: 'warning',
	        message: err.join('\r\n')
	      });
	      return;
	    }

	    this.setState({
	      isLock: true
	    });
	    grantActions.save(this.state.data);
	  },

	  handleChange: function handleChange(id, newValue) {
	    var data = this.state.data;
	    data[id] = newValue;
	    this.setState({
	      data: data,
	      isValid: this.refs.grantForm.isValid()
	    });
	  },

	  togglePermission: function togglePermission(p_id) {
	    this.state.data.p[p_id] = !!!this.state.data.p[p_id];
	    this.setState({
	      data: this.state.data
	    });
	  },

	  handleTabClick: function handleTabClick(id) {
	    var obj = {
	      selectedTab: id,
	      expand0: -1,
	      expand: -1
	    };
	    this._setupList(id, obj, this.state);
	    this.setState(obj);
	  },

	  handleListChange: function handleListChange(id, value) {
	    this.setState({
	      selectedItem: value
	    });
	  },

	  toggleGrant: function toggleGrant(p_id) {

	    if (p_id.indexOf('_ALLSHOP') > 0) {
	      var chkAllshop = this.state.selectedItem;
	      var chkStaff = p_id.replace('_ALLSHOP', '');
	      chkStaff = chkStaff.replace(' ', '');

	      var chkId = '';
	      var _shop = this.state.shop;
	      var a = this;
	      _shop.forEach(function (item) {

	        chkId = chkStaff + '_' + item.id + "_" + chkAllshop;
	        chkId = chkId.replace(' ', '');

	        a.state.data[chkId] = !!!a.state.data[p_id];
	        a.setState({
	          data: a.state.data
	        });
	      });

	      this.state.data[p_id] = !!!this.state.data[p_id];
	      this.setState({
	        data: this.state.data
	      });
	    } else {
	      this.state.data[p_id] = !!!this.state.data[p_id];
	      this.setState({
	        data: this.state.data
	      });
	    }
	  },

	  _SetStatus: function _SetStatus(p_id, status) {

	    console.log('idUpdate:', p_id);

	    this.state.data[p_id] = status;
	    this.setState({
	      data: this.state.data
	    });
	  },

	  // return staff_shop_role
	  _genId: function _genId(id1, id2, id3) {
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

	  _genSetting: function _genSetting(level1, level2) {
	    var list = this.state[level1].map(function (item) {
	      var cnt = 0;
	      var total = 0;
	      var list2 = null;
	      var text = [];
	      if (item.id == this.state.expand) {
	        list2 = this.state[level2].map(function (item2) {
	          var id = this._genId(item.id, item2.id);
	          cnt += this.state.data[id] ? 1 : 0;
	          total++;
	          return React.createElement(
	            'li',
	            { key: level2 + '_' + item2.id },
	            React.createElement(FlexCheckbox, {
	              field: { id: id, type: 'checkbox', label: item2.code + ' ' + item2.name, raw: true },
	              data: this.state.data,
	              onChange: this.toggleGrant
	            })
	          );
	        }.bind(this));
	      } else {
	        this.state[level2].forEach(function (item2) {
	          var id = this._genId(item.id, item2.id);
	          cnt += this.state.data[id] ? 1 : 0;
	          total++;
	          if (this.state.data[id]) {
	            text.push(item2.code);
	          }
	        }.bind(this));
	      }
	      return React.createElement(
	        'li',
	        { key: level1 + '_' + item.id },
	        React.createElement(
	          'div',
	          {
	            className: 'header',
	            style: { cursor: 'pointer' },
	            onClick: function () {
	              this.setState({
	                expand: item.id == this.state.expand ? -1 : item.id
	              });
	            }.bind(this) },
	          React.createElement(
	            'b',
	            null,
	            item.code + ' ' + item.name
	          ),
	          ' (',
	          React.createElement(
	            'span',
	            { className: cnt > 0 ? 'blue' : null },
	            cnt
	          ),
	          '/',
	          total,
	          ')',
	          text.length == 0 ? null : ' [' + text.join(', ') + ']'
	        ),
	        list2 != null ? React.createElement(
	          'ul',
	          { className: 'flex check_list' },
	          list2
	        ) : null
	      );
	    }.bind(this));
	    return React.createElement(
	      'ul',
	      { className: 'grant-table' },
	      list
	    );
	  },

	  _genSettingShop: function _genSettingShop(level1, level2) {
	    var data = {};

	    // build staff-shop array
	    var st_sh = {};
	    var sh_st = {};
	    var tmp2 = {};
	    for (var key in this.state.data) {
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

	    this.state.staff.forEach(function (item) {
	      if (!st_sh[item.id]) {
	        return;
	      }
	      for (var sh in st_sh[item.id]) {
	        if (!data[sh]) {
	          data[sh] = [];
	        }
	        data[sh].push(item);
	      }
	    });

	    var groups = [this.state.selectedItem];

	    var title = {};

	    this.state.shop.forEach(function (item) {
	      title[item.id] = item.code + ': ' + item.name;
	      if (item.id != this.state.selectedItem) {
	        groups.push(item.id);
	      }
	    }.bind(this));

	    var list0 = [];

	    groups.forEach(function (group) {
	      if (!data[group]) {
	        return;
	      }
	      if (group == this.state.expand0) {
	        var list = data[group].map(function (item) {
	          var cnt = 0;
	          var total = 0;
	          var list2 = null;
	          var text = [];
	          if (item.id == this.state.expand) {
	            list2 = this.state[level2].map(function (item2) {
	              var id = this._genId(item.id, item2.id, group);
	              cnt += this.state.data[id] ? 1 : 0;
	              total++;
	              return React.createElement(
	                'li',
	                { key: level2 + '_' + item2.id },
	                React.createElement(FlexCheckbox, {
	                  field: { id: id, type: 'checkbox', label: item2.code + ' ' + item2.name, raw: true },
	                  data: this.state.data,
	                  onChange: this.toggleGrant
	                })
	              );
	            }.bind(this));
	          } else {
	            this.state[level2].forEach(function (item2) {
	              var id = this._genId(item.id, item2.id, group);
	              cnt += this.state.data[id] ? 1 : 0;
	              total++;
	              if (this.state.data[id]) {
	                text.push(item2.code);
	              }
	            }.bind(this));
	          }
	          return React.createElement(
	            'li',
	            { key: level1 + '_' + item.id },
	            React.createElement(
	              'div',
	              {
	                className: 'header',
	                style: { cursor: 'pointer' },
	                onClick: function () {
	                  this.setState({
	                    expand: item.id == this.state.expand ? -1 : item.id
	                  });
	                }.bind(this) },
	              React.createElement(
	                'b',
	                null,
	                item.code + ' ' + item.name
	              ),
	              ' (',
	              React.createElement(
	                'span',
	                { className: cnt > 0 ? 'blue' : null },
	                cnt
	              ),
	              '/',
	              total,
	              ')',
	              text.length == 0 ? null : ' [' + text.join(', ') + ']'
	            ),
	            list2 != null ? React.createElement(
	              'ul',
	              { className: 'flex check_list' },
	              list2
	            ) : null
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
	      var text0 = React.createElement(
	        'span',
	        null,
	        '(',
	        React.createElement(
	          'span',
	          { className: cnt > 0 ? 'blue' : null },
	          cnt
	        ),
	        '/',
	        total,
	        ')'
	      );

	      var header = React.createElement(
	        'div',
	        {
	          className: 'header2',
	          onClick: function () {
	            this.setState({
	              expand0: group == this.state.expand0 ? -1 : group
	            });
	          }.bind(this) },
	        title[group] ? title[group] : '-',
	        ' ',
	        text0
	      );

	      list0.push(React.createElement(
	        'li',
	        { key: 'shop_' + group, style: { cursor: 'pointer' }, className: 'grouping' },
	        header,
	        list != null ? React.createElement(
	          'ol',
	          null,
	          list
	        ) : null
	      ));
	    }.bind(this));

	    return React.createElement(
	      'ul',
	      { className: 'grant-table' },
	      list0
	    );
	  },

	  _genSettingDepartment: function _genSettingDepartment(level1, level2) {
	    var data = {};
	    this.state.staff.forEach(function (item) {
	      if (!data[item.department_id]) {
	        data[item.department_id] = [];
	      }
	      data[item.department_id].push(item);
	    });

	    var groups = [];
	    var title = {};
	    this.state.department.forEach(function (item) {
	      title[item.id] = item.code + ': ' + item.name;
	      groups.push(item.id);
	    }.bind(this));

	    var list0 = [];
	    groups.forEach(function (group) {
	      if (!data[group]) {
	        return;
	      }
	      if (group == this.state.expand0) {
	        var list = data[group].map(function (item) {
	          var cnt = 0;
	          var total = 0;
	          var list2 = null;
	          var text = [];
	          if (item.id == this.state.expand) {
	            list2 = this.state[level2].map(function (item2) {
	              var id = this._genId(item.id, item2.id);
	              cnt += this.state.data[id] ? 1 : 0;
	              total++;
	              return React.createElement(
	                'li',
	                { key: level2 + '_' + item2.id },
	                React.createElement(FlexCheckbox, {
	                  field: { id: id, type: 'checkbox', label: item2.code + ' ' + item2.name, raw: true },
	                  data: this.state.data,
	                  onChange: this.toggleGrant
	                })
	              );
	            }.bind(this));
	          } else {
	            this.state[level2].forEach(function (item2) {
	              var id = this._genId(item.id, item2.id);
	              cnt += this.state.data[id] ? 1 : 0;
	              total++;
	              if (this.state.data[id]) {
	                text.push(item2.code);
	              }
	            }.bind(this));
	          }
	          return React.createElement(
	            'li',
	            { key: level1 + '_' + item.id },
	            React.createElement(
	              'div',
	              {
	                className: 'header',
	                style: { cursor: 'pointer' },
	                onClick: function () {
	                  this.setState({
	                    expand: item.id == this.state.expand ? -1 : item.id
	                  });
	                }.bind(this) },
	              React.createElement(
	                'b',
	                null,
	                item.code + ' ' + item.name
	              ),
	              ' (',
	              React.createElement(
	                'span',
	                { className: cnt > 0 ? 'blue' : null },
	                cnt
	              ),
	              '/',
	              total,
	              ')',
	              text.length == 0 ? null : ' [' + text.join(', ') + ']'
	            ),
	            list2 != null ? React.createElement(
	              'ul',
	              { className: 'flex check_list' },
	              React.createElement(
	                'li',
	                null,
	                React.createElement(FlexCheckbox, {
	                  field: { id: item.id + '_ALLSHOP', type: 'checkbox', label: 'All Shop', raw: true },
	                  data: this.state.data,
	                  onChange: this.toggleGrant
	                })
	              )
	            ) : null,
	            list2 != null ? React.createElement(
	              'ul',
	              { className: 'flex check_list' },
	              list2
	            ) : null
	          );
	        }.bind(this));
	      }

	      var total = 0;
	      var cnt = 0;
	      for (var i = 0; i < this.state.staff.length; i++) {
	        if (this.state.staff[i].department_id != group) {
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
	      var text0 = React.createElement(
	        'span',
	        null,
	        '(',
	        React.createElement(
	          'span',
	          { className: cnt > 0 ? 'blue' : null },
	          cnt
	        ),
	        '/',
	        total,
	        ')'
	      );

	      var header = React.createElement(
	        'div',
	        {
	          className: 'header2',
	          onClick: function () {
	            this.setState({
	              expand0: group == this.state.expand0 ? -1 : group
	            });
	          }.bind(this)
	        },
	        title[group] ? title[group] : '-',
	        ' ',
	        text0
	      );

	      list0.push(React.createElement(
	        'li',
	        { key: 'department_' + group, style: { cursor: 'pointer' }, className: 'grouping' },
	        header,
	        list != null ? React.createElement(
	          'ol',
	          null,
	          list
	        ) : null
	      ));
	    }.bind(this));

	    return React.createElement(
	      'ul',
	      { className: 'grant-table' },
	      list0
	    );
	  },

	  genSetting: function genSetting() {
	    if (this.state.selectedTab == 'staff') {
	      return this._genSetting('shop', 'role');
	    } else if (this.state.selectedTab == 'shop') {
	      return this._genSettingShop('staff', 'role');
	    } else if (this.state.selectedTab == 'role') {
	      return this._genSettingDepartment('staff', 'shop');
	    }
	  },

	  render: function render() {
	    var list = [{ id: 'staff', icon: 'user157', text: 'grant.bystaff' }, { id: 'shop', icon: 'web37', text: 'grant.byshop' }, { id: 'role', icon: 'two385', text: 'grant.byrole' }];
	    return React.createElement(
	      'div',
	      { className: 'content-page flex-form' },
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'grant.title.setting', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'boxf flex no-shrink' },
	          React.createElement(
	            'div',
	            { className: 'panel2 no-shrink' },
	            React.createElement(FlexButton, {
	              label: 'action.save',
	              field: { id: 'save', tabIndex: 1 },
	              icon: 'save20',
	              'default': true,
	              onClick: this.doSave
	            })
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-header' },
	        React.createElement(
	          'div',
	          { className: 'panelf' },
	          React.createElement(FlexTab, { list: list, selected: this.state.selectedTab, onClick: this.handleTabClick })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panelf' },
	          React.createElement(FlexDropdown, {
	            field: this.state.field,
	            data: { list: this.state.selectedItem },
	            onChange: this.handleListChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf flex-form' },
	        this.genSetting()
	      )
	    );
	  }
	});

	module.exports = GrantSetting;

/***/ },

/***/ 908:
/***/ function(module, exports) {

	"use strict";

	module.exports = {};

/***/ },

/***/ 909:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  grant: {
	    title: {
	      index: 'กำหนดสิทธิ์',
	      setting: 'ตั้งค่า'
	    },
	    bystaff: 'พนักงาน',
	    byshop: 'สาขา',
	    byrole: 'กลุ่มสิทธิ์',
	    staff: 'เลือกพนักงาน',
	    shop: 'เลือกสาขา',
	    role: 'เลือกกลุ่มสิทธิ์'
	  }
	};

/***/ }

});