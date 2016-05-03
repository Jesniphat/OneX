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

var FlexTextInput = widgets.FlexTextInput;// require('../../../widgets/flex-text-input.jsx');
var FlexButton    = widgets.FlexButton;// require('../../../widgets/flex-button.jsx');
var FlexDisplayTable    = widgets.FlexDisplayTable;// require('../../../widgets/flex-display-table.jsx');
var FlexDropdown  = widgets.FlexDropdown;// require('../../../widgets/flex-dropdown.jsx');
var FlexIcon = widgets.FlexIcon;
var FlexTab  = widgets.FlexTab; //require('../../../widgets/flex-tab.jsx');
var FlexCheckbox  = widgets.FlexCheckbox;
var FlexRadioGroup  = widgets.FlexRadioGroup;

var ReFlux = require('reflux');

var PaymentScreen = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins:[
    ReFlux.listenTo(actions.saveProduct.done,'onSaveProductDoneAction'),
    ReFlux.listenTo(actions.getDataProduct.done,'onGetDataProductDoneAction')
  ],
  getInitialState:function(){

    return{
        data:{
          id:'',
          name:'',
          amount:'',
          chkSave:'N'
        },
        listproduct:[]
    }
  },

  componentDidMount: function() {

    infoPanelActions.show('pos.receipt.list',
      <div className="box10">

      </div>
    );
    actions.getDataProduct();
  },

  componentWillUnmount: function() {
    infoPanelActions.hide();
  },

  handleChange:function(id, value){
    this.state.data[id] = value;
    this.setState({
      data: this.state.data
    });
  },

  savedata: function() {
    //console.log(this.state.data);
    actions.saveProduct(this.state.data);
  },

  onSaveProductDoneAction: function(data){
    toasterActions.pop({
      type:'success',
      message:'บันทึกข้อมูลเรียบร้อย'
    });
    this.state.data.chkSave = 'N';
    this.state.data.name = '';
    this.state.data.amount = '';
    this.state.data.id = '';
    this.setState({
        data:this.state.data
    });
    actions.getDataProduct();
  },

  onSelectDetail: function(row){
    //console.log(row.id);
    this.state.data.chkSave = 'Y';
    this.state.data.name = row.name;
    this.state.data.amount = row.amount;
    this.state.data.id = row.id;
    this.setState({
        data:this.state.data
    });
  },

  onGetDataProductDoneAction: function(data){
    this.setState({
      listproduct:data.dataproduct
    });
  },

  render: function() {

    var fields = {
      name:{
        id:'name',
        label:'pos.product.name',
        required:true,
        icon:'user158'
      },
      amount:{
        id:'amount',
        label:'pos.product.amount',
        required:true,
        icon:'user158'
      },
    };

    var productList = [
      {name:'id',label:'pos.receipt.receipt_code',width:150,render:function(row){
        return row.id;
      }},
      {name:'system_date',label:'pos.receipt.system_date', type:'date' ,width:120,render:function(row){
        return tr.localize(new Date(row.system_date),{type:'datetime',format:'short'});
      }},
      {name:'name',label:'pos.receipt.date',width:100,render:function(row){
        return row.name
      }},
      {name:'amount',label:'pos.receipt.amount',width:100 ,render:function(row){
        return <div><div className="right" style={{width:"80px"}} >{helper.numberFormat(row.amount,2)}</div></div>;
      }},
      {name:'actions', type:'actions', width:(2*20)+'px', render:function(row) {
        var f = function() {
          this.onSelectDetail(row)
        }.bind(this);
        return (<div className="flex">
            <div onClick={f}>
              <FlexIcon icon="printer88" title="action.select"></FlexIcon>
            </div>
        </div>);
      }.bind(this)},
    ];

    return(
      <div className="content-page">
        <div className="content-body panelf">
          <div className="panelf can-grow">
            <div>{this.state.data.product}</div>
          </div>
          <div className="box10 flex flex-form">
            <div className="panel3">
              <FlexTextInput
                field={fields.name}
                data={this.state.data}
                onChange={this.handleChange}
                />
            </div>
            <div className="panel3">
              <FlexTextInput
                field={fields.amount}
                data={this.state.data}
                onChange={this.handleChange}
                />
            </div>
            <div className="panel2">
              <FlexButton
                label="action.save"
                icon="save20"
                default={true}
                onClick={this.savedata}
                />
            </div>
          </div>
          <div className="box10 flex flex-form">
            <FlexDisplayTable
                fields={productList}
                data={this.state.listproduct}
                displayRows={5}
            />
          </div>
        </div>
      </div>

    );
  }
});

module.exports = PaymentScreen;
