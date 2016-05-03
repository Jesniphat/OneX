var React     = require('react');
var Router    = require('react-router');
var Link      = Router.Link;
var T         = require('react-translate-component');
var tr        = require('counterpart');

var system    = require('ss-system');
var widgets   = require('ss-widget');
var toasterActions = system.toasterActions;
var helper    = system.helper;
var systemActions = system.systemActions;
var dialogActions     = system.dialogActions;
var storage   = system.storage;
var systemStore = system.systemStore;
var infoPanelActions = system.infoPanelActions;

var FlexGrid  = widgets.FlexGrid;
var FlexDisplayTable    = widgets.FlexDisplayTable;// require('../../../widgets/flex-display-table.jsx');
var FlexIcon  = widgets.FlexIcon;
var FlexTextInput = widgets.FlexTextInput;// require('../../../widgets/flex-text-input.jsx');
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');
var FlexDataTable = widgets.FlexDataTable;
var FlexCheckbox  = widgets.FlexCheckbox;

var setProdAction = require('./actions');
var ReFlux    = require('reflux');

var ProductGroup = React.createClass({
  contextTypes: {
      router: React.PropTypes.func
    },
  mixins:[
     ReFlux.listenTo(setProdAction.groupProductItem.done,'onGroupProductItemDone'),
     ReFlux.listenTo(setProdAction.allProductItem.done,'onAllProductItemDone'),
     ReFlux.listenTo(setProdAction.allGroupItem.done,'onAllGroupItemDone'),
     ReFlux.listenTo(setProdAction.getGroupProudct.done,'onGetGroupProudctDoneAction'),
     ReFlux.listenTo(setProdAction.groupProductSave.done,'onGroupProductSaveDoneAction')
  ],
  getInitialState: function() {
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
        group_name:'',
        group_code:'',
        oracle_db:'tcradio_stock'
      },
      GroupItems: [],
      ProdItems: [],
      btnMoveToProd:false,
      btnMoveToGroup:false,
      group_code:{
        id:'group_code',
        label:'preliminary.group_product.code',
        readonly:false,
        required:true
      },
      group_name:{
        id:'group_name',
        label:'preliminary.group_product.name',
        readonly: false,
        required:true,
        maxLength:255
      },
      search_group:{
        id:'search_group',
        label:'preliminary.group_product.search_group',
        readonly: false,
        maxLength:255
      },
      search_prod:{
        id:'search_prod',
        label:'preliminary.group_product.search_prod',
        readonly: false,
        maxLength:255
      },
      oracle_db: {
        id:'oracle_db',
        label:'preliminary.group_product.oracle_db',
        disabled: false,
        list:[
          { value:"tcradio_stock", text: "Stock" },
          { value:"mini_stock", text: "Mini" },
          { value:"tcradio_repair", text: "Repair" }
        ]
      },
    }
  },

  componentDidMount: function() {
    console.log('componentDidMount', this.state.editEvent);
    if (this.state.editEvent){
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

  onGroupProductItemDone: function(res) {
    console.log('onGroupProductItemDone', res);
    this.state.btnMoveToProd = (res.data.length == 0 || !this.state.editEvent ? false : true);
    this.setState(this.state);
  },
  onAllProductItemDone: function(res) {
    this.state.btnMoveToGroup = (res.length == 0 || !this.state.editEvent ? false : true);
    var items = []
    res.map(function(item){
      items[item.id] = item;
    });
    this.state.ProdItems = items;
    this.setState({ ProdItems: this.state.ProdItems });
  },
  onAllGroupItemDone: function(res) {
    this.state.btnMoveToProd = (res.length == 0 ? false : true);
    var items = []
    res.map(function(item){
      items[item.oracle_product_id] = {};
      items[item.oracle_product_id].id = item.oracle_product_id;
      items[item.oracle_product_id].code = item.oracle_product_code;
      items[item.oracle_product_id].flag = false;
    });
    console.log('onAllGroupItemDone', items);
    this.state.GroupItems = items;
    this.setState({ GroupItems: this.state.GroupItems });
  },


  onGetGroupProudctDoneAction: function(e){
    console.log('onGetGroupProudctDoneAction', e);
    this.state.data.group_name = e.data.name;
    this.state.data.group_code = e.data.code;
    this.state.data.oracle_db = e.data.dbname_oracle;
    this.setState({ data: this.state.data });
  },

  handleChange:function(id, value){
    console.log(id, value);
    this.state.data[id] = value;
    this.setState({
      data: this.state.data
    });
  },

  handleDropdownChange:function(id, value){
    console.log(id, value);
    this.state.data[id] = value;
    this.setState({ data: this.state.data });
    //setProdAction.allProductItem({ keywords: this.state.data });
  },
  handleChangeCheckbox: function(id, value){
    var getId = /(.*)-(.*)/.exec(id);
    console.log(getId[1], getId[2]);

    if(getId[1] == 'ProdItems') {
      for (var id in this.state.ProdItems) {
        if(id === getId[2]) { this.state.ProdItems[id].flag = value; }
      }
    } else if(getId[1] == 'GroupItems') {
      for (var id in this.state.GroupItems) {
        if(id === getId[2]) { this.state.GroupItems[id].flag = value; }
      }
    }
    this.setState(this.state);
  },

  onMoveToGroup:function(){
    this.state.btnMoveToProd = true;
    var items1 = this.state.GroupItems;
    for (var id in this.state.ProdItems) {
      if(this.state.ProdItems[id].flag == true) {
        this.state.ProdItems[id].flag = false;
        items1[id] = this.state.ProdItems[id];
      }
    }
    this.setState({ GroupItems: items1 });
  },

  onMoveToProd: function() {
    var items1 = [];
    for (var id in this.state.GroupItems) {
      if(this.state.GroupItems[id].flag != true) { 
        items1[id] = this.state.GroupItems[id];
      }
    }
    if(items1.length == 0) this.state.btnMoveToProd = false;
    this.setState({ GroupItems: items1  });
  },

  groupProductSave: function(){
    if(this.state.data.group_name !== "" && this.state.data.group_code !== "") {
      var items = [];
      for (var id in this.state.GroupItems) {
        items.push(this.state.GroupItems[id]);
      }
      setProdAction.groupProductSave(this.state.data, items);
    } else {
      toasterActions.pop({ type: 'warning', message: 'ระบุข้อมูลไม่ถูกต้อง' });
    }
  },

  onGroupProductSaveDoneAction: function(data){
    console.log('onGroupProductSaveDoneAction', data);
    data.error = data.error || {}
    toasterActions.pop({
      type: data.status ? 'success' : 'warning',
      message: data.status ? 'success' : (data.error.message != 'success' ? data.error.message : 'บันทึกข้อูลเรียบร้อย'),
    });
    if(data.status && !this.state.editEvent) {
      if (!this.state.editEvent) this.props.history.pushState(null, '/preliminary/group_product/edit/'+data.id);
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

  groupProductCancel: function(){
    this.props.history.pushState(null, '/preliminary/group_product');
  },

  handleSearchGroup: function(id, value){
    this.state.data[id] = value;
    this.setState({ data: this.state.data });
    setProdAction.allGroupItem(this.state.data);
  },

  handleSearchProduct: function(id, value){
    this.state.data[id] = value;
    this.setState({ data: this.state.data });
    setProdAction.allProductItem(this.state.data);
  },

  render: function() {

    this.GroupList =[
      {name:'checked',type:'custom',label:'', width:'48px',render: function(item) {
        return (
          <FlexCheckbox
            field={{ id:'GroupItems-'+item.id }}
            data={this.state.GroupItems[item.id].flag}
            onChange={this.handleChangeCheckbox} />
        );
      }.bind(this)},
      {name:'code', label:'preliminary.group_product_list.leftList'}
    ];

    this.ProdList = [
      {name:'checked',type:'custom',label:'',width:'48px', render:function(item) {
        return (
            <FlexCheckbox
              field={{ id:'ProdItems-'+item.id }}
              data={this.state.ProdItems[item.id].flag}
              onChange={this.handleChangeCheckbox} />
        );
      }.bind(this)},
      {name:'code', label:'preliminary.group_product_list.rightList'}
    ];

    return (
      <div className="content-page flex-form">
        <div className="content-header panelf flex">
          <div className="panelf can-grow">
          </div>
          <div className="panel2 no-shrink">
              <FlexButton
                label="preliminary.title.cancelCustomerBT"
                icon="back57"
                default={false}
                onClick={this.groupProductCancel}
              />
          </div>

          <div className="panel2 no-shrink">
              <FlexButton
                label="preliminary.title.saveCustomerBT"
                icon="save20"
                default={true}
                onClick={this.groupProductSave}
              />
          </div>
        </div>
        <div className="content-body panelf">
          <div className="flex">
            <div className="panel3 no-shrink">
                <FlexTextInput
                  field={this.state.group_code}
                  data={this.state.data}
                  onChange={this.handleChange}
                  />
            </div>
            <div className="panelf can-grow">
                <FlexTextInput
                  field={this.state.group_name}
                  data={this.state.data}
                  onChange={this.handleChange}
                  />
            </div>
            <div className="panel3 no-shrink">
                <FlexDropdown
                  field={ this.state.oracle_db }
                  data={ this.state.data }
                  onChange={this.handleDropdownChange}
                  />
            </div>
          </div>
          <hr />
          <div className="flex">
            <div className="panelf can-grow">
              <div>
                <FlexTextInput
                  field={this.state.search_group}
                  data={this.state.data}
                  onChange={this.handleChange}
                  onEnter={this.handleSearchGroup} />
              </div>
              <div>
                <FlexDataTable
                  fields={this.GroupList}
                  data={this.state.GroupItems}
                  displayRows={10} />
              </div>
            </div>
            <div className="panel1 no-shrink">
              <div style={{'margin-top':'119px', 'text-align': 'center'}}>
                <FlexButton
                  icon="fast46"
                  default={ this.state.btnMoveToProd }
                  disabled={ !this.state.btnMoveToProd }
                  onClick={this.onMoveToProd}
                />
              </div>
              <div style={{'margin-top':'15px', 'text-align': 'center'}}>
                <FlexButton
                  icon="rewind45"
                  default={ this.state.btnMoveToGroup }
                  disabled={ !this.state.btnMoveToGroup }
                  onClick={this.onMoveToGroup}
                />
              </div>
            </div>
            <div className="panelf can-grow">
              <div>
                <FlexTextInput
                  field={this.state.search_prod}
                  data={this.state.data}
                  onChange={this.handleChange}
                  onEnter={this.handleSearchProduct} />
              </div>
              <div>
                <FlexDataTable
                  fields={this.ProdList}
                  data={this.state.ProdItems}
                  displayRows={10} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ProductGroup;
