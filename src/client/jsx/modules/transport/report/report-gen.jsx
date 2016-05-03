var React     = require('react');
import TextField from 'material-ui/lib/text-field';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import Checkbox from 'material-ui/lib/checkbox';
import ActionFavorite from 'material-ui/lib/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/lib/svg-icons/action/favorite-border';
import RaisedButton from 'material-ui/lib/raised-button';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import Toggle from 'material-ui/lib/toggle';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import FontIcon from 'material-ui/lib/font-icon';
import Colors from 'material-ui/lib/styles/colors';
import AutoComplete from 'material-ui/lib/auto-complete';

var tr = require('counterpart');

var system = require('ss-system');
var widgets = require('ss-widget');
var toasterActions = system.toasterActions;
var helper = system.helper;// require('../../../../../server/lib/Helper');
var systemActions = system.systemActions;// require('../../system/actions');
var infoPanelActions = system.infoPanelActions;// require('../../../actions/info-panel');
var Router    = require('react-router');
var actions = require('./actions');

var T         = require('react-translate-component');
// var dialogActions = system.dialogActions;
var FlexTextInput = widgets.FlexTextInput;// require('../../../widgets/flex-text-input.jsx');
var FlexButton    = widgets.FlexButton;// require('../../../widgets/flex-button.jsx');
var FlexDisplayTable    = widgets.FlexDisplayTable;// require('../../../widgets/flex-display-table.jsx');
var FlexDropdown  = widgets.FlexDropdown;// require('../../../widgets/flex-dropdown.jsx');
var FlexIcon = widgets.FlexIcon;
var FlexTab  = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');
var FlexCheckbox  = widgets.FlexCheckbox;
var FlexRadioGroup  = widgets.FlexRadioGroup;
var Link          = Router.Link;

var ReFlux = require('reflux');

var ReportScreen = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins:[
    //ReFlux.listenTo(actions.getInitialData.done,'onGetInitialData'),
    // ReFlux.listenTo(actions.getAddressList.done,'onGetAddressListDoneAction'),
  ],

  getInitialState:function() {
    console.log("Report");
    var booking_id = this.props.params.id;
    console.log("booking_id = ",booking_id);
    var personId = system.sessionStore.getSession().staff.id;
    var personType = system.sessionStore.getSession().staff.type;
    var isPaymentType = true;
    if (personType == "COMPANY") {
      isPaymentType = false;
    } else {
      isPaymentType = true;
    }
    return {
      isPaymentType: isPaymentType,
      personType: personType,
      personId: personId,
      bookingId: booking_id,
    }
  },
  componentDidMount:function() {
    console.log(this.state.bookingId);
    actions.genReport(this.state.bookingId);
  },
  render: function() {
    // some text
    
    return (
      <div>Hello</div>
    );
  }
});

module.exports = ReportScreen;
