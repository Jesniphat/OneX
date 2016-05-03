var React = require('react');
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
var dialogActions = system.dialogActions;
var FlexTextInput = widgets.FlexTextInput;// require('../../../widgets/flex-text-input.jsx');
var FlexButton    = widgets.FlexButton;// require('../../../widgets/flex-button.jsx');
var FlexDisplayTable    = widgets.FlexDisplayTable;// require('../../../widgets/flex-display-table.jsx');
var FlexDropdown  = widgets.FlexDropdown;// require('../../../widgets/flex-dropdown.jsx');
var FlexIcon = widgets.FlexIcon;
var FlexTab  = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');
var FlexCheckbox  = widgets.FlexCheckbox;
var FlexRadioGroup  = widgets.FlexRadioGroup;

var ReFlux = require('reflux');
var resetData = {
  id:'',
  customer_id:'',
  code:'XX0001',
  date:new Date().toJSON().slice(0,10),
  remark:'',
  product:'',
  customer_code:'',
  tax_num:'',
  member_code:'',
  names:'',
  last_name:'',
  password:'',
  repassword:'',
  e_mail:'',
  note:'',
  birthday:'',
  credit_term:1,
  serviceChargeText:'',
  serviceChargeAmount:0,
  discount:'0',
  contactId:0,
  contactPersonId:0,
  defaultAddrNo:'',
  defaultAddrSoi:'',
  defaultAddrTambon:'',
  defaultAddrAmphur:'',
  defaultAddrProvince:'',
  defaultAddrZipCode:'',
  defaultAddrPhone:'',
  contactName:'',
  contactPosition:'',
  contactAddr1:'',
  contactAddr2:'',
  contactTambon:'',
  contactAmphur:'',
  contactProvince:'',
  contactZipcode:'',
  contactEmail:'',
  contactPhoneNo:'',
  contactLineId:'',
  contactRemark:'',
  billingPersonId:0,
  billingCode:'',
  billingName:'',
  billingAddr1:'',
  billingAddr2:'',
  billingTambon:'',
  billingAmper:'',
  billingProvince:'',
  billingZipcode:'',
  billingOtherNo:'',
  billingLiveYear:'',
  billingRemark:'',
  billingSend:'',
  billingNote:'',
  billingPayment:'',
  default_billing:'N',
  customerTypeFieldList:'PERSON',
  customerIdTypeList:'nationid',
  credit_term_status:'APPROVE',
  customerGenderList:'N/A',
  customerTitleList:'N/A',
  is_active_list:'YES',
  paymentTypeList:'credit',
  memberTypeFieldList:-1,
  currencyList:'1'
};
var CustomerEdit = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins:[
  // ReFlux.listenTo(actions.getPaymentTerm.done,'onGetPaymentTermDoneAction'),
    // ReFlux.listenTo(actions.getMemberType.done,'onGetMemberTypeDoneAction'),
    // ReFlux.listenTo(actions.getCustomerData.done,'onGetCustomerDataDoneAction'),
    // ReFlux.listenTo(actions.getContactListData.done,'onGetContactListDataDoneAction'),
    // ReFlux.listenTo(actions.getBillingListData.done,'onGetBillingListDataDoneAction'),
    // ReFlux.listenTo(actions.saveCustomers.done,'onSaveCustomersDoneAction'),
    // ReFlux.listenTo(actions.saveCustomers.error,'onSaveCustomersErrorAction'),
    // ReFlux.listenTo(actions.editCustomers.done,'onEditCustomersDoneAction'),
    // ReFlux.listenTo(actions.editCustomers.error,'onEditCustomersErrorAction'),
    // ReFlux.listenTo(actions.getCurrencyFromBase.done,'onGetCurrencyFromBaseDoneAction')
  ],
  getInitialState:function(){
    var booking_id = this.props.params.id;
    console.log("booking_id = ", booking_id);
    return{
        data:helper.clone(resetData),
        edit_data: {
          booking_id:booking_id
        }
    }
  },
  componentDidMount: function() {
    // actions.getCurrencyFromBase();
    // //systemActions.setPageHeader(tr.translate('others.title.index'));
    // actions.getMemberType();
    // if (this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0'){
    //   actions.getCustomerData(this.state.edit_data);
    //   actions.getContactListData(this.state.edit_data);
    //   actions.getBillingListData(this.state.edit_data);
    // }
  },

  

  render: function() {
    return(
      <div className="layout-panel content-page">
        <div className="content-header boxf flex">
          Hello World.
        </div>
      </div>

    );
  }
});

module.exports = CustomerEdit;
