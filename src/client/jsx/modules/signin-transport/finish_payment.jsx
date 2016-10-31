var React = require('react');

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import RaisedButton from 'material-ui/lib/raised-button';

var tr = require('counterpart');

var system = require('../system/system');
//var widgets = require('ss-widget');
var toasterActions = system.toasterActions;
var helper        = require('../../../../server/lib/helper');
var systemActions =  require('../system/actions');
var infoPanelActions =  require('../system/actions/info-panel');
var Router    = require('react-router');
var Link          = Router.Link;
var actions = require('./actions');

var T         = require('react-translate-component');
var dialogActions = system.dialogActions;
var FlexTextInput = require('../../widgets/flex-text-input.jsx');
var FlexButton    = require('../../widgets/flex-button.jsx');
var FlexDisplayTable    = require('../../widgets/flex-display-table.jsx');
var FlexDropdown  = require('../../widgets/flex-dropdown.jsx');
var FlexIcon = require('../../widgets/flex-icon.jsx');
var FlexTab  = require('../../widgets/flex-tab.jsx');
var FlexCheckbox  = require('../../widgets/flex-checkbox.jsx');
var FlexRadioGroup  = require('../../widgets/flex-radio-group.jsx');

var $             = require('jquery');

const style = {
  'width': '160px',
};

var FinishPayment = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState:function(){
    console.log("rs = ", this.props.params.rs);
    console.log("bookingId = ", this.props.params.bookingId);
    return {
      rs: this.props.params.rs,
      booking_id: this.props.params.bookingId,
      pay_text: ""
    }
  },

  componentDidMount: function() {
    if(this.props.params.rs == '1'){
      console.log("start");
      this.setState({
        pay_text: "Success"
      });
      this.setFinish(this.props.params.rs, this.props.params.bookingId);
    }else {
      console.log("start2");
      this.setState({
        pay_text: "Unsuccess"
      });
    }
  },

  setFinish: function(rs,bookingId){
    $.ajax({
      type:'post',
      url:'/finish-payment/api',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        act:'setFinish',
        rs: rs,
        bookingId:bookingId
      }),
      dataType:'json',
      success:function(res) {
        if (res.status===true) {
          console.log(res);
        } else {
          console.log("error");
        }
      }.bind(this)
    });
  },

  render: function() {
    return(
      <div id="bodysignin">
        <div className="onex-top-bar">
          <div className="onex-top-bar-left">
          </div>
          <div className="top-bar-right">
            <ul className="menu">
              <li><div className="space">.</div></li>
            </ul>
          </div>
        </div>
      <div id="content-panel-signin" style={{'width':'770px','height':'603px','overflow':'scroll'}}>
        <div style={{'width':'750px','marginTop':'5px'}}>
          <div>{this.state.pay_text}</div>
        <div style={{'width':'550px','height':'52px','float':'left','margin':'auto'}}>
          <div>
            <RaisedButton label="PRINT" secondary={true} style={style} onMouseDown={this.genShipmentReport} />
          </div>
        </div>
      </div>
    </div>
    </div>
    );
  }
});

module.exports = FinishPayment;
