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
var dialogActions     = system.dialogActions; //require('../../system/actions/dialog');
var toasterActions    = system.toasterActions; //require('../../system/actions/toaster');

var shopActions   = require('./actions');
var shopStore     = require('./store');

var FlexGrid      = widgets.FlexGrid; //require('../../../widgets/flex-grid.jsx');
var FlexIcon      = widgets.FlexIcon; //require('../../../widgets/flex-icon.jsx');
var FlexButton    = widgets.FlexButton; //require('../../../widgets/flex-button.jsx');

var ShopList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    Reflux.listenTo(shopActions.delete.done, 'onDeleteDoneAction'),
    Reflux.listenTo(shopActions.delete.error, 'onDeleteErrorAction')
  ],

  getInitialState: function() {
    return {
      fields: [
        {name:'code', title:'shop.code', width:'100px'},
        {name:'prefix_barcode', title:'shop.prefix_barcode', width:'80px'},
        {name:'name', title:'shop.name', width:'200px'},
        {name:'location', title:'shop.location'},
        {name:'tel', title:'shop.tel', width:'120px'},
        {name:'fax', title:'shop.fax', width:'120px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to={'/setting/shop/shop_edit/'+row.id} icon="create3" title="action.edit"></FlexIcon>
            <FlexIcon icon="rubbish" title="action.delete" onClick={function(e) {this.doDelete(e, row.id)}.bind(this)}></FlexIcon>
          </div>);
        }.bind(this)}
      ]
    }
  },

  componentDidMount: function() {

  },

  doShopNew: function() {
    // this.context.router.transitionTo('setting.shop.edit', {id:0});
    this.props.history.pushState(null, '/setting/shop/shop_edit/0');
  },

  doDelete: function(e, id) {
    e.preventDefault();

    dialogActions.show({
      title:'dialog.title.confirm_to_delete',
      content:'ข้อมูลจะถูกลบถาวร ยืนยันหรือไม่',
      actions:[
        {id:'ok', icon:'check52', label:'dialog.confirm'},
        {id:'cancel', icon:'close47', label:'dialog.cancel', default:true}
      ]
    }, function(isCancel, action_id) {
      if (isCancel || action_id=='cancel') {
        return;
      }
      shopActions.delete(id);
    });
  },

  onDeleteDoneAction: function() {
    toasterActions.pop({
      type:'success',
      message:'delete.ok'
    });
    this.refs.grid.doRefresh();
//    console.log(this.refs);
  },

  onDeleteErrorAction: function(result) {
    toasterActions.pop({
      type:'warning',
      message: 'error.delete'
    });
  },

  render: function() {
    return (
      <div className="content-page">
        <div className="content-header boxf flex">
          <div className="panelf can-grow">
            <T content="shop.title.list" component="h2" />
          </div>
          <div className="boxf flex no-shrink">
            <div className="panel2 no-shrink">
              <FlexButton icon="add186" label="shop.action.new"
                onClick={this.doShopNew}/>
            </div>
          </div>
        </div>
        <div className="content-body panelf">
          <FlexGrid
            id="setting-shop-list"
            ref="grid"
            listAction={shopActions.list}
            exportAction={shopActions.export}
            fields={this.state.fields}
            pk="id"
            sortBy="code"
            sortDir="ASC"
            limit={10}
            checkbox={false}
            search={true}
            />
        </div>
      </div>
    );
  }
});

module.exports = ShopList;
