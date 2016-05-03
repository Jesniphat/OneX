webpackJsonp([113,135],{

/***/ 964:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'groupProductSave': { children: ['done', 'error'] },
	  'groupProductList': { children: ['done', 'error'] },
	  'groupProductItem': { children: ['done', 'error'] },
	  'allProductItem': { children: ['done', 'error'] },
	  'allGroupItem': { children: ['done', 'error'] },
	  'getGroupProudct': { children: ['done', 'error'] },
	  'groupProductDelete': { children: ['done', 'error'] }
	});

/***/ },

/***/ 975:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widgets = __webpack_require__(377);
	var toasterActions = system.toasterActions;
	var helper = system.helper;
	var systemActions = system.systemActions;
	var dialogActions = system.dialogActions;
	var storage = system.storage;
	var systemStore = system.systemStore;
	var infoPanelActions = system.infoPanelActions;

	var FlexGrid = widgets.FlexGrid;
	var FlexDisplayTable = widgets.FlexDisplayTable; // require('../../../widgets/flex-display-table.jsx');
	var FlexIcon = widgets.FlexIcon;
	var FlexTextInput = widgets.FlexTextInput; // require('../../../widgets/flex-text-input.jsx');
	var FlexDropdown = widgets.FlexDropdown;
	var FlexRadioGroup = widgets.FlexRadioGroup;
	var FlexButton = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
	var FlexDataTable = widgets.FlexDataTable;
	var FlexCheckbox = widgets.FlexCheckbox;

	var setProdAction = __webpack_require__(964);
	var ReFlux = __webpack_require__(335);

	var ProductGroup = React.createClass({
	  displayName: 'ProductGroup',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  mixins: [ReFlux.listenTo(setProdAction.groupProductItem.done, 'onGroupProductItemDone'), ReFlux.listenTo(setProdAction.allProductItem.done, 'onAllProductItemDone'), ReFlux.listenTo(setProdAction.allGroupItem.done, 'onAllGroupItemDone'), ReFlux.listenTo(setProdAction.getGroupProudct.done, 'onGetGroupProudctDoneAction'), ReFlux.listenTo(setProdAction.groupProductSave.done, 'onGroupProductSaveDoneAction')],
	  getInitialState: function getInitialState() {
	    var group_id = this.props.params.id;
	    var staff_id = system.sessionStore.getSession().staff.id;
	    var event_group = group_id !== "0";
	    return {
	      editEvent: event_group,
	      data: {
	        staff_id: staff_id,
	        group_id: group_id,
	        search_group: '',
	        search_prod: '',
	        group_name: '',
	        group_code: '',
	        oracle_db: 'tcradio_stock'
	      },
	      GroupItems: [],
	      ProdItems: [],
	      btnMoveToProd: false,
	      btnMoveToGroup: false,
	      group_code: {
	        id: 'group_code',
	        label: 'preliminary.group_product.code',
	        readonly: false,
	        required: true
	      },
	      group_name: {
	        id: 'group_name',
	        label: 'preliminary.group_product.name',
	        readonly: false,
	        required: true,
	        maxLength: 255
	      },
	      search_group: {
	        id: 'search_group',
	        label: 'preliminary.group_product.search_group',
	        readonly: false,
	        maxLength: 255
	      },
	      search_prod: {
	        id: 'search_prod',
	        label: 'preliminary.group_product.search_prod',
	        readonly: false,
	        maxLength: 255
	      },
	      oracle_db: {
	        id: 'oracle_db',
	        label: 'preliminary.group_product.oracle_db',
	        disabled: false,
	        list: [{ value: "tcradio_stock", text: "Stock" }, { value: "mini_stock", text: "Mini" }, { value: "tcradio_repair", text: "Repair" }]
	      }
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    console.log('componentDidMount', this.state.editEvent);
	    if (this.state.editEvent) {
	      this.state.oracle_db.readonly = true;
	      this.state.oracle_db.disabled = true;
	      this.state.group_code.readonly = true;

	      setProdAction.getGroupProudct(this.state.data);
	      setProdAction.allGroupItem(this.state.data);
	      setProdAction.allProductItem(this.state.data);
	    } else {
	      this.state.oracle_db.readonly = false;
	      this.state.oracle_db.disabled = false;
	      this.state.group_code.readonly = false;
	      this.setState(this.state);
	    }
	  },

	  onGroupProductItemDone: function onGroupProductItemDone(res) {
	    console.log('onGroupProductItemDone', res);
	    this.state.btnMoveToProd = res.data.length == 0 || !this.state.editEvent ? false : true;
	    this.setState(this.state);
	  },
	  onAllProductItemDone: function onAllProductItemDone(res) {
	    this.state.btnMoveToGroup = res.length == 0 || !this.state.editEvent ? false : true;
	    var items = [];
	    res.map(function (item) {
	      items[item.id] = item;
	    });
	    this.state.ProdItems = items;
	    this.setState({ ProdItems: this.state.ProdItems });
	  },
	  onAllGroupItemDone: function onAllGroupItemDone(res) {
	    this.state.btnMoveToProd = res.length == 0 ? false : true;
	    var items = [];
	    res.map(function (item) {
	      items[item.oracle_product_id] = {};
	      items[item.oracle_product_id].id = item.oracle_product_id;
	      items[item.oracle_product_id].code = item.oracle_product_code;
	      items[item.oracle_product_id].flag = false;
	    });
	    console.log('onAllGroupItemDone', items);
	    this.state.GroupItems = items;
	    this.setState({ GroupItems: this.state.GroupItems });
	  },

	  onGetGroupProudctDoneAction: function onGetGroupProudctDoneAction(e) {
	    console.log('onGetGroupProudctDoneAction', e);
	    this.state.data.group_name = e.data.name;
	    this.state.data.group_code = e.data.code;
	    this.state.data.oracle_db = e.data.dbname_oracle;
	    this.setState({ data: this.state.data });
	  },

	  handleChange: function handleChange(id, value) {
	    console.log(id, value);
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	  },

	  handleDropdownChange: function handleDropdownChange(id, value) {
	    console.log(id, value);
	    this.state.data[id] = value;
	    this.setState({ data: this.state.data });
	    //setProdAction.allProductItem({ keywords: this.state.data });
	  },
	  handleChangeCheckbox: function handleChangeCheckbox(id, value) {
	    var getId = /(.*)-(.*)/.exec(id);
	    console.log(getId[1], getId[2]);

	    if (getId[1] == 'ProdItems') {
	      for (var id in this.state.ProdItems) {
	        if (id === getId[2]) {
	          this.state.ProdItems[id].flag = value;
	        }
	      }
	    } else if (getId[1] == 'GroupItems') {
	      for (var id in this.state.GroupItems) {
	        if (id === getId[2]) {
	          this.state.GroupItems[id].flag = value;
	        }
	      }
	    }
	    this.setState(this.state);
	  },

	  onMoveToGroup: function onMoveToGroup() {
	    this.state.btnMoveToProd = true;
	    var items1 = this.state.GroupItems;
	    for (var id in this.state.ProdItems) {
	      if (this.state.ProdItems[id].flag == true) {
	        this.state.ProdItems[id].flag = false;
	        items1[id] = this.state.ProdItems[id];
	      }
	    }
	    this.setState({ GroupItems: items1 });
	  },

	  onMoveToProd: function onMoveToProd() {
	    var items1 = [];
	    for (var id in this.state.GroupItems) {
	      if (this.state.GroupItems[id].flag != true) {
	        items1[id] = this.state.GroupItems[id];
	      }
	    }
	    if (items1.length == 0) this.state.btnMoveToProd = false;
	    this.setState({ GroupItems: items1 });
	  },

	  groupProductSave: function groupProductSave() {
	    if (this.state.data.group_name !== "" && this.state.data.group_code !== "") {
	      var items = [];
	      for (var id in this.state.GroupItems) {
	        items.push(this.state.GroupItems[id]);
	      }
	      setProdAction.groupProductSave(this.state.data, items);
	    } else {
	      toasterActions.pop({ type: 'warning', message: 'ระบุข้อมูลไม่ถูกต้อง' });
	    }
	  },

	  onGroupProductSaveDoneAction: function onGroupProductSaveDoneAction(data) {
	    console.log('onGroupProductSaveDoneAction', data);
	    data.error = data.error || {};
	    toasterActions.pop({
	      type: data.status ? 'success' : 'warning',
	      message: data.status ? 'success' : data.error.message != 'success' ? data.error.message : 'บันทึกข้อูลเรียบร้อย'
	    });
	    if (data.status && !this.state.editEvent) {
	      if (!this.state.editEvent) this.props.history.pushState(null, '/preliminary/group_product/edit/' + data.id);
	      this.state.data.group_id = data.id;
	      this.state.data.group_name = data.name;
	      this.state.data.group_code = data.code;
	      this.state.oracle_db.readonly = true;
	      this.state.oracle_db.disabled = true;
	      this.state.group_code.readonly = true;
	      this.state.editEvent = true;
	      this.setState(this.state);

	      setProdAction.allGroupItem(this.state.data);
	      setProdAction.allProductItem(this.state.data);
	    }
	  },

	  groupProductCancel: function groupProductCancel() {
	    this.props.history.pushState(null, '/preliminary/group_product');
	  },

	  handleSearchGroup: function handleSearchGroup(id, value) {
	    this.state.data[id] = value;
	    this.setState({ data: this.state.data });
	    setProdAction.allGroupItem(this.state.data);
	  },

	  handleSearchProduct: function handleSearchProduct(id, value) {
	    this.state.data[id] = value;
	    this.setState({ data: this.state.data });
	    setProdAction.allProductItem(this.state.data);
	  },

	  render: function render() {

	    this.GroupList = [{ name: 'checked', type: 'custom', label: '', width: '48px', render: function (item) {
	        return React.createElement(FlexCheckbox, {
	          field: { id: 'GroupItems-' + item.id },
	          data: this.state.GroupItems[item.id].flag,
	          onChange: this.handleChangeCheckbox });
	      }.bind(this) }, { name: 'code', label: 'preliminary.group_product_list.leftList' }];

	    this.ProdList = [{ name: 'checked', type: 'custom', label: '', width: '48px', render: function (item) {
	        return React.createElement(FlexCheckbox, {
	          field: { id: 'ProdItems-' + item.id },
	          data: this.state.ProdItems[item.id].flag,
	          onChange: this.handleChangeCheckbox });
	      }.bind(this) }, { name: 'code', label: 'preliminary.group_product_list.rightList' }];

	    return React.createElement(
	      'div',
	      { className: 'content-page flex-form' },
	      React.createElement(
	        'div',
	        { className: 'content-header panelf flex' },
	        React.createElement('div', { className: 'panelf can-grow' }),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink' },
	          React.createElement(FlexButton, {
	            label: 'preliminary.title.cancelCustomerBT',
	            icon: 'back57',
	            'default': false,
	            onClick: this.groupProductCancel
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel2 no-shrink' },
	          React.createElement(FlexButton, {
	            label: 'preliminary.title.saveCustomerBT',
	            icon: 'save20',
	            'default': true,
	            onClick: this.groupProductSave
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'content-body panelf' },
	        React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { className: 'panel3 no-shrink' },
	            React.createElement(FlexTextInput, {
	              field: this.state.group_code,
	              data: this.state.data,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panelf can-grow' },
	            React.createElement(FlexTextInput, {
	              field: this.state.group_name,
	              data: this.state.data,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel3 no-shrink' },
	            React.createElement(FlexDropdown, {
	              field: this.state.oracle_db,
	              data: this.state.data,
	              onChange: this.handleDropdownChange
	            })
	          )
	        ),
	        React.createElement('hr', null),
	        React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { className: 'panelf can-grow' },
	            React.createElement(
	              'div',
	              null,
	              React.createElement(FlexTextInput, {
	                field: this.state.search_group,
	                data: this.state.data,
	                onChange: this.handleChange,
	                onEnter: this.handleSearchGroup })
	            ),
	            React.createElement(
	              'div',
	              null,
	              React.createElement(FlexDataTable, {
	                fields: this.GroupList,
	                data: this.state.GroupItems,
	                displayRows: 10 })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel1 no-shrink' },
	            React.createElement(
	              'div',
	              { style: { 'margin-top': '119px', 'text-align': 'center' } },
	              React.createElement(FlexButton, {
	                icon: 'fast46',
	                'default': this.state.btnMoveToProd,
	                disabled: !this.state.btnMoveToProd,
	                onClick: this.onMoveToProd
	              })
	            ),
	            React.createElement(
	              'div',
	              { style: { 'margin-top': '15px', 'text-align': 'center' } },
	              React.createElement(FlexButton, {
	                icon: 'rewind45',
	                'default': this.state.btnMoveToGroup,
	                disabled: !this.state.btnMoveToGroup,
	                onClick: this.onMoveToGroup
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'panelf can-grow' },
	            React.createElement(
	              'div',
	              null,
	              React.createElement(FlexTextInput, {
	                field: this.state.search_prod,
	                data: this.state.data,
	                onChange: this.handleChange,
	                onEnter: this.handleSearchProduct })
	            ),
	            React.createElement(
	              'div',
	              null,
	              React.createElement(FlexDataTable, {
	                fields: this.ProdList,
	                data: this.state.ProdItems,
	                displayRows: 10 })
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = ProductGroup;

/***/ }

});