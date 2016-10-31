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
     ReFlux.listenTo(action.listFareZone.done,'onListFareZoneDone')
  ],
  getInitialState: function() {
    return {
      Items: []
    }
  },

  onListFareZoneDone: function(data) {
    var i = 1;
    this.setState({ Items: data.map(function(item){ item.no = i++; return item; }) });
  },
  componentDidMount: function() {
    action.listFareZone();
    systemActions.setPageHeader(tr.translate('fareZoneTable.zone_import'));
  },
  tableFare: [  //No. Group Code Effective Customer level Every Purchase Point
    {name:'no', label:'fareZoneTable.no', width:'48px'},
    {name:'country_origin', label:'fareZoneTable.country_origin',width:'auto'},
    {name:'city_origin', label:'fareZoneTable.city_origin'},
    {name:'district_origin', label:'fareZoneTable.district_origin',width:'auto'},
    {name:'country_destination', label:'fareZoneTable.country_destination',width:'auto'},
    {name:'city_destination', label:'fareZoneTable.city_destination',width:'auto'},
    {name:'district_destination', label:'fareZoneTable.district_destination',width:'auto'},
    {name:'zone', label:'fareZoneTable.zone',width:'auto'}
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
