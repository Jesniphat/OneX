var React       = require('react');
var Reflux      = require('reflux');
var T             = require('react-translate-component');

var system      = require('ss-system');
var widget      = require('ss-widget');

var barcodeActions  = require('./actions');

var dialogActions = system.dialogActions;

var FlexGrid      = widget.FlexGrid;
var FlexDropdown  = widget.FlexDropdown;
var FlexTextInput = widget.FlexTextInput;
var FlexButton    = widget.FlexButton;

var Generator = React.createClass({
  mixins: [
    Reflux.listenTo(barcodeActions.facet.done, 'onFacetDoneAction'),
    Reflux.listenTo(barcodeActions.generate.done, 'onGenBarcode_DoneAction')
  ],

  getInitialState: function() {
    return {
      data: [],
      shopList:[],
      shop_id : null,
      year: ((new Date).getFullYear()+543).toString(),
      qty: '100',
      fields: [
        {name:'shop_code', title:'barcode.shop_code', width:'120px'},
        {name:'shop_name', title:'barcode.shop_name'},
        {name:'year', title:'barcode.year'},
        {name:'last_barcode', title:'barcode.last_barcode', width:'200px'},
        {name:'count_total', title:'barcode.count_total', width:'120px'},
        {name:'count_used', title:'barcode.count_used', width:'120px'},
        {name:'count_available', title:'barcode.count_available', width:'120px'},
        {name:'actions', type:'actions', width:(2*28+8)+'px', render:function(row) {
          return (<div className="flex"></div>);
        }.bind(this)}
      ],
      btn_print: { disabled:false }
    };
  },

  componentDidMount: function() {
    barcodeActions.facet();
  },


  onFacetDoneAction: function(result) {
    var state = {};
    for(var i=0; i<result.shops.length;i++) { 
      state = { shop_id: result.shops[i].id, shop_code: result.shops[i].prefix_barcode };
      break;
    }

    this.setState({
      shop_id: state.shop_id,
      shop_code: state.shop_code,
      shopList: result.shops
    });
  },

  onGenBarcode_DoneAction: function() {
    this.setState({
      btn_print: { disabled: false },
      data: this.state.data
    }, function() {
      this.refs.grid.doRefresh();
    });
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
        barcodeActions.generate({ 
          shop_id: this.state.shop_id, 
          shop_code: this.state.shop_code, 
          year: this.state.year, 
          qty: this.state.qty 
        });
      }.bind(this));
    }
  },

  handleChange: function(id, value) {
    this.state[id] = value;
    this.setState({
      year: this.state.year,
      qty: this.state.qty
    });
  },

  handleShopChange: function(id, value) {
    var shop_id = 0;
    for(var i=0; i<this.state.shopList.length;i++) { 
      if(this.state.shopList[i].prefix_barcode === value) { 
        shop_id = this.state.shopList[i].id; 
        break; 
      }
    }
    //barcodeActions.list({ shop_id: shop_id, year: this.state.year});

    this.setState({
      shop_id: shop_id, 
      shop_code: value,
      data: this.state.data
    }, function() {
      this.refs.grid.doRefresh();
    });
  },


  render: function() {
    return (
      <div>
        <div className="flex-form flex">
          <div className="panel4">
            <FlexDropdown
              field={{
                id:'shop_code',
                label:'barcode.shop_code',
                list:this.state.shopList.map(function(item) {
                  return { 
                      value: item.prefix_barcode, 
                      text:item.code + ' ' + item.name + ' (' + item.prefix_barcode + ')'
                  };
                })
              }}
              data={{shop_code:this.state.shop_code}}
              onChange={this.handleShopChange}
              />
          </div>
          <div className="panel2">
            <FlexTextInput
              field={{id:'year',label:'barcode.year',pattern:'^(25|26)[0-9]{2}$'}}
              data={{year:this.state.year}}
              onChange={this.handleChange}
              />
          </div>
          <div className="panel2">
            <FlexTextInput
              field={{id:'qty',label:'barcode.qty',type:'number'}}
              data={{qty:this.state.qty}}
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
        <div className="panel10">
          <FlexGrid
            ref="grid"
            id="installment-barcode-list"
            listAction={barcodeActions.list}
            exportAction={barcodeActions.export}
            fields={this.state.fields}
            pk="id"
            sortBy="shop_code"
            sortDir="ASC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{
              shop_id: this.state.shop_id
            }}
            />
        </div>
      </div>
    )
  }
});

module.exports = Generator;
