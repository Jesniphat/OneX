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

var action = require('./actions');
var ReFlux    = require('reflux');

var ProductGroup = React.createClass({
  contextTypes: {
      router: React.PropTypes.func
    },
  mixins:[
     ReFlux.listenTo(action.listFarePoint.done,'onListFarePointDone')
  ],
  getInitialState: function() {
    return { 
      Items: []
    }
  },

  onListFarePointDone: function(data) {
    var i = 1;
    this.setState({ Items: data.map(function(item){ item.no = i++; return item; }) });
  },
  componentDidMount: function() {
    action.listFarePoint();
    systemActions.setPageHeader(tr.translate('preliminary.fare.point_import'));
  },
  tableFare: [  //No. Group Code Effective Customer level Every Purchase Point
    {name:'no', className: 'center', label:'preliminary.table.no', width:'48px'},
    {name:'on_system', label:'preliminary.table.system',width:'180px'},
    {name:'product_code', label:'preliminary.table.code' },
    {name:'effective', label:'preliminary.table.effective'},
    {name:'member_type', label:'preliminary.table.level',width:'140px'},
    {name:'point', className: 'right', label:'preliminary.table.point', width:'140px', render: function(row, index){
      return helper.toMoney(row.point, 2);
    }}
  ],
  render: function() {

    return (
      <div>
        <FlexDataTable
          fields={this.tableFare}
          data={this.state.Items}
          displayRows={7} />
      </div>
    );
  }
});

module.exports = ProductGroup;
