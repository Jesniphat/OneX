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
var storageKey = 'preliminary.customer.list';
var infoPanelActions = system.infoPanelActions;

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

var customerAction = require('./actions');
var ReFlux    = require('reflux');

var CustomerList = React.createClass({
  contextTypes: {
      router: React.PropTypes.func
    },
  mixins:[
    ReFlux.listenTo(customerAction.deleteCustomers.done,'onDeleteCustomersDoneAction'),
    ReFlux.listenTo(customerAction.deleteCustomers.error,'onDeleteCustomersErrorAction')
  ],
  getInitialState: function() {
//    var shops = system.acl.getShopAcl();
    var shops = systemStore.getMaster().shops.map(function(shop) {
      return {
        value: shop.code,
        text: shop.code+' '+shop.name
      }
    });
    shops.unshift({value:'*',text:'* ทุกสาขา'});
    var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});

    var opt = storage.load(storageKey, {current_status:'ALL', shop:''});
    if (opt.shop=='') {
      opt.shop = shops.length > 0 ?
        (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '';
    }
    //console.log("Data From Innitail = ", opt.shop, shops, opt);
    return {
      data: {
        shop: opt.shop,
        current_status: opt.current_status
      },
      fields: [
        {name:'customer_code', title:'preliminary.customer_code'},
        {name:'fullname', title:'preliminary.fullname'},
        {name:'type', title:'preliminary.type'},//, width:'80px'
        {name:'member_type_name', title:'preliminary.nation'},
        //{name:'last_uses_at', title:'preliminary.last_uses_at'},
        // {name:'shop_name', title:'preliminary.shop_name'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          var e = function() {
            this.onLinkToEdit(row.person_id)
          }.bind(this);
          var f = function() {
            this.onDeleteCustomer(row)
          }.bind(this);
          return (<div className="flex">
            <div onClick={e}>
              <FlexIcon icon="create3" title="action.select"></FlexIcon>
            </div>
            <div onClick={f}>
              <FlexIcon icon="rubbish" title="action.select"></FlexIcon>
            </div>
          </div>);
        }.bind(this)},
      ]
    }
  },

  componentDidMount: function() {
    console.log(system.sessionStore.getSession());
  },

  addCustomer: function(row) {
    console.log('add_customer');
    this.props.history.pushState(null, '/preliminary/customer/edit/0');
  },

  onLinkToEdit: function(id) {
    console.log(id);
    this.props.history.pushState(null, '/preliminary/customer/edit/' + id);
  },

  onDeleteCustomer: function(row){
    console.log('To Delete some thing',row);
    dialogActions.show({
      title:'preliminary.title.confirm_to_delete',
      content:'ต้อการลบขอมูลสมาชิก ' + row.fullname + ' หรือไม่',
      actions:[
        {id:'ok', icon:'check52', label:'dialog.confirm'},
        {id:'cancel', icon:'close47', label:'dialog.cancel', default:true}
      ]
    }, function(isCancel, action_id) {
      if (isCancel || action_id=='cancel') {
        return;
      }
      console.log('DELETE');
      customerAction.deleteCustomers(row);
    });
  },

  onDeleteCustomersDoneAction: function(data){
    toasterActions.pop({
      type:'success',
      message:data.done
    });
    this.refs.grid.doRefresh();
  },

  onDeleteCustomersErrorAction: function(errors){
    toasterActions.pop({
      type:'warning',
      message:'ลบข้อมูลไม่สำเร็จ ' + errors
    });
  },

  handleChange: function(id, value) {
    this.state.data[id] = value;
    storage.save(storageKey, {
      current_status: this.state.data.current_status,
      shop: this.state.data.shop
    });
    this.setState({
      data: this.state.data
    }, function() {
      this.refs.grid.doRefresh();
    });
  },

  render: function() {
    return (
      <div className="layout-panel content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="preliminary.title.head" component="h2" />
          </div>
          <div className="panel2 no-shrink flex-form">
            <FlexButton
              label="preliminary.title.addCustomerBT"
              icon="add184"
              default={true}
              onClick={this.addCustomer}
            />
          </div>
        </div>
        <div className="content-body panelf ">
          <FlexGrid
            ref="grid"
            id="preliminary-customer-list"
            listAction={customerAction.list}
            exportAction={customerAction.export}
            fields={this.state.fields}
            pk="id"
            sortBy="code"
            sortDir="ASC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{
              today: helper.dateToString(new Date()),
              shop: (this.state.data.shop=='*' ? null : this.state.data.shop),
              current_status: (this.state.data.current_status=='ALL' ? null : this.state.data.current_status)
            }}
            />
        </div>
      </div>
    );
  }
});

module.exports = CustomerList;
