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
var storageKey = 'preliminary.group_product.list';
var infoPanelActions = system.infoPanelActions;

// import FontIcon from 'material-ui/lib/font-icon'
// import FlatButton from 'material-ui/lib/flat-button';
// import RaisedButton from 'material-ui/lib/raised-button';
// import FloatingActionButton from 'material-ui/lib/floating-action-button';

var FlexGrid  = widgets.FlexGrid;
var FlexIcon  = widgets.FlexIcon;
var FlexTextInput = widgets.FlexTextInput;// require('../../../widgets/flex-text-input.jsx');
var FlexDropdown = widgets.FlexDropdown;
var FlexRadioGroup = widgets.FlexRadioGroup;
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

var productAction = require('./actions');
var ReFlux    = require('reflux');

var ProductGroupList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins:[
    ReFlux.listenTo(productAction.groupProductDelete.done,'onGroupProductDeletetDoneAction')
  ],
  onGroupProductDeletetDoneAction: function(data){
    this.refs.grid.doRefresh();
  },
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
      fields: [
        {name:'code', title:'preliminary.prod_group_id',width:110},
        {name:'name', title:'preliminary.prod_group_name'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          var f = function() {
            productAction.groupProductDelete(row)
          }.bind(this);
          return (<div className="flex">
            <div>
              <FlexIcon to={ "/preliminary/group_product/edit/"+row.id } icon="create3" title="action.select"></FlexIcon>
            </div>
            <div onClick={f}>
              <FlexIcon icon="rubbish" title="action.select"></FlexIcon>
            </div>
          </div>);
        }.bind(this)}
      ]
    }
  },

  componentDidMount: function() {
    // console.log(system.sessionStore.getSession());
  },

  addProductGroup: function(row) {
    // console.log('add_productGroup');
    this.props.history.pushState(null, '/preliminary/group_product/edit/0');
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

  handleChange:function(id, value){
        this.state.data[id] = value;
        this.setState({
          data: this.state.data
        });
        //console.log(this.state.data.customerTypeFieldList);
  },

  render: function() {
    var fields = {
      prodGroupName:{
        id:'prodGroupName',
        label:'preliminary.prod_group.name',
        required:true,
        maxLength:6
      }
    };
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="boxf can-grow">
          </div>
          <div className="box2 no-shrink">
            <FlexButton
              label="preliminary.title.cancelCustomerBT"
              icon="add186"
              default={false}
              label="preliminary.title.addProductGroupBT"
              onClick={this.addProductGroup} />
          </div>
        </div>
        <div className="layout-panel content-body panelf">
          <FlexGrid
            ref="grid"
            id="preliminary-productgroup-list"
            listAction={productAction.groupProductList}
            fields={this.state.fields}
            pk="id"
            sortBy="code"
            sortDir="ASC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            />
        </div>
      </div>
    );
  }
});

module.exports = ProductGroupList;
