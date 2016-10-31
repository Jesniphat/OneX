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
//var storageKey = 'transport.bookingList.listWaitAssign';
var infoPanelActions = system.infoPanelActions;

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

//var customerAction = require('./actions');
var deliveryListActions = require('./actions');
var ReFlux    = require('reflux');

var PickupList = React.createClass({
  contextTypes: {
      router: React.PropTypes.func
    },
  mixins:[
    // ReFlux.listenTo(deliveryListActions.cancelBooking.done,'onCancelBookingDoneAction'),
    // ReFlux.listenTo(deliveryListActions.cancelBooking.error,'onCancelBookingErrorAction')
  ],
  getInitialState: function() {
//    var shops = system.acl.getShopAcl();
    // var shops = systemStore.getMaster().shops.map(function(shop) {
    //   return {
    //     value: shop.code,
    //     text: shop.code+' '+shop.name
    //   }
    // });
    // shops.unshift({value:'*',text:'* ทุกสาขา'});
    // var monthYear = tr.localize(new Date(), {type:'date', format:'monthYear'});

    // var opt = storage.load(storageKey, {current_status:'ALL', shop:''});
    // if (opt.shop=='') {
    //   opt.shop = shops.length > 0 ?
    //     (system.acl.hasAcl({setting:['INST_CON_VIEW_ADMIN']}) ? '*': shops[0].code) : '';
    // }

    return {
      data: {
        // shop: opt.shop,
        // current_status: opt.current_status
      },
      fields: [
        {name:'delivery_no', title:'delivery_headtable.delivery_no'},
        {name:'delivery_date', title:'delivery_headtable.date'},
        {name:'from', title:'delivery_headtable.from'},//, width:'80px'
        {name:'to', title:'delivery_headtable.to'},
        {name:'prepare_by', title:'delivery_headtable.prepare_by'},
        {name:'delivery_qty', title:'delivery_headtable.plan_qty'},
        {name:'accepted_qty', title:'delivery_headtable.delivery_qty'},
        {name:'status', title:'delivery_headtable.status'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          var e = function() {
            this.onLinkToEdit(row.id)
          }.bind(this);
          return (<div className="flex">
            <div onClick={e}>
              <FlexIcon icon="create3" title="action.select"></FlexIcon>
            </div>
          </div>);
        }.bind(this)},
      ]
    }
  },

  componentDidMount: function() {
    console.log(system.sessionStore.getSession());
  },

  newDelivery: function(row) {
    console.log('add_customer');
    this.props.history.pushState(null, '/transport/delivery/delivery_edit/0');
  },

  onLinkToEdit: function(id) {
    console.log("Edit booking id = ",id);
    this.props.history.pushState(null, '/transport/delivery/delivery_edit/' + id);
  },

  onCancelBooking: function(row){
    console.log('onCancelBooking = ',row);
    dialogActions.show({
      title:'preliminary.title.confirm_to_delete',
      content:'Do you want to cancel ' + row.booking_no + '?',
      actions:[
        {id:'ok', icon:'check52', label:'dialog.confirm'},
        {id:'cancel', icon:'close47', label:'dialog.cancel', default:true}
      ]
    }, function(isCancel, action_id) {
      if (isCancel || action_id=='cancel') {
        return;
      }
      console.log('DELETE');
      deliveryListActions.cancelBooking(row);
    });
  },

  handleChange: function(id, value) {
    console.log("handleChange");
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
            <T content="transport.title.headDeliveryList" component="h3" />
          </div>
          <div className="panel2 no-shrink flex-form">
            <FlexButton
              label="transport.title.newDelivery"
              icon="add184"
              default={true}
              onClick={this.newDelivery}
            />
          </div>
        </div>

        <div style={{width:'1094px'}}>
            <div className="content-body panelf" style={{minHeight:'543px'}}>
            <div stule={{clear: 'both'}}></div>
              <div>
                <FlexGrid
                    ref="grid"
                    id="delivery_list"
                    listAction={deliveryListActions.listDelivery}
                    exportAction={deliveryListActions.exportDelivery}
                    fields={this.state.fields}
                    pk="id"
                    sortBy="delivery_no"
                    sortDir="ASC"
                    limit={50}
                    checkbox={false}
                    search={true}
                    displayRows={12}
                    />
              </div>
            </div>

        </div>
      </div>
    );
  }
});

module.exports = PickupList;
