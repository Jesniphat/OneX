var React       = require('react');

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

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
  margin: 12,
};
module.exports = React.createClass({
  getInitialState: function(){
    console.log("fogor");
    return{
      email:""
    }
  },

  componentDidMount: function() {
    console.log("start");
  },

  forgotPass: function(){
    // console.log("ref = ", this.refs.email.getValue());
    var the_email = this.refs.email.getValue();
    var isValidEmail = function(str) {
      var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
      return (filter.test(str));
    }

    if(!(isValidEmail(this.refs.email.getValue()))){
      console.log("Not email");
      // toasterActions.pop({
      //   type:'warning',
      //   message:'Email Not Match'
      // });
      alert("Email Not Match");
      return;
    }

    $.ajax({
      type:'post',
      url:'/register/api',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        act:'forgot',
        email:the_email
      }),
      dataType:'json',
      success:function(res) {
        if (res.status===true) {
          console.log("Save data complete = ", res.data.user);
          alert("Your password has been successfully sent to your email address ");
        } else {
          alert("Don't have this email");
        }
      }.bind(this),
      error:function(e,m) {
        console.log("e,m ", e,m);
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
        <div style={{'width':'750px'}}>
        	<h3>forgot your password</h3>
        	<br/>
            <div style={{width:'100%',border:'solid 1px lightgray'}}>
                <h5 style={{textAlign:'center',borderBottom:'solid 1px lightgray',backgroundColor:'#F5F5F5'}}>Enter the email address for reset your password</h5>
                <div style={{padding:'15px'}}>
                    <TextField
                        hintText="Your email"
                        style={{width:'517px'}}
                        ref="email"
                    />
                    <RaisedButton label="send" onClick={this.forgotPass} secondary={true} style={{float:'right'}}/>
                </div>
            </div>
        </div>

      </div>
      </div>
    );
  }
});
