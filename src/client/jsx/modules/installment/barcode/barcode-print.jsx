var React       = require('react');
var Reflux      = require('reflux');
var T             = require('react-translate-component');

var system          = require('ss-system');
var widget      = require('ss-widget');

var barcodeActions  = require('./actions');

var dialogActions = system.dialogActions;
var toasterActions  = system.toasterActions;

var FlexGrid      = widget.FlexGrid;
var FlexDropdown  = widget.FlexDropdown;
var FlexTextInput = widget.FlexTextInput;
var FlexButton    = widget.FlexButton;

var Print = React.createClass({
  mixins: [
    Reflux.listenTo(barcodeActions.reprint.done, 'onGenBarcode_DoneAction')
  ],

  getInitialState: function() {
    return {
      begin: '',
      end: '',
      btn_print: { disabled:false }
    };
  },

  componentDidMount: function() {

  },
  onGenBarcode_DoneAction: function(data) {
    if(!data.status) {
      toasterActions.pop({ type:'success', message: data.message });
    } else {
      toasterActions.pop({
        type:'success',
        message:'กำลังส่งขอ้มูลให้เครื่องพิมพ์ทำงาน'
      });
    }
    this.setState({ btn_print: { disabled: false } });
  },

  doGenBarcode_WorkAction: function() {
    if(this.state.btn_print.disabled == false) {

      dialogActions.show({
        title:'ยืนยัน',
        content: (
          <T content="barcode.confirm_dialog" component="div"/>
        ),
        actions: [
          {id:'save', icon:'check52', label:'action.print', default:true},
          {id:'cancel', icon:'close47', label:'action.cancel'}
        ]
      }, function(isCancel, id) {
        if (isCancel || id=='cancel') {
          return;
        }
        this.setState({ btn_print: { disabled: true } });
        barcodeActions.reprint({
          begin: this.state.begin, 
          end: this.state.end 
        });
      }.bind(this));
    }
  },

  handleChange: function(id, value) {
    this.state[id] = value;
    this.setState({
      begin: this.state.begin,
      end: this.state.end
    });
  },

  render: function() {
    return (
      <div>
        <div className="flex-form flex">
          <div className="panel4">
            <FlexTextInput
              field={{id:'begin',label:'barcode.begin'}}
              data={{begin:this.state.begin}}
              onChange={this.handleChange}
              />
          </div>
          <div className="panel4">
            <FlexTextInput
              field={{id:'end',label:'barcode.end'}}
              data={{end:this.state.end}}
              onChange={this.handleChange}
              />
          </div>
          <div className="panel2">
            <FlexButton 
              icon="printer88" label="action.print" default={true}
              field={this.state.btn_print}
              onClick={this.doGenBarcode_WorkAction}/>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Print;
