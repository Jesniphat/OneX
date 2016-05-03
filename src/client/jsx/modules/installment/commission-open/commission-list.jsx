var React       = require('react');
var Reflux      = require('reflux');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system      = require('ss-system');
var widget      = require('ss-widget');

var helper      = system.helper;
var storage     = system.storage;

var commissionActions  = require('./actions');

var FlexGrid      = widget.FlexGrid;
var FlexDropdown  = widget.FlexDropdown;
var FlexIcon      = widget.FlexIcon;
var FlexTextInput = widget.FlexTextInput;

var storageKey = 'installment.commission-open.list';

var Generator = React.createClass({
  mixins: [
    Reflux.listenTo(commissionActions.list.done, 'onListDoneAction'),
    Reflux.listenTo(commissionActions.facetList.done, 'onFacetListDoneAction')
  ],

  getInitialState: function() {
    var today = new Date();
    var prevDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()-15);
    var option = storage.load(storageKey, {shop_id:0,term_month:('0'+(prevDay.getMonth()+1)).substr(-2),term_year:''+prevDay.getFullYear()});

    return {
      data: [],
      shop_id: option.shop_id,
      term_year: option.term_year,
      term_month: option.term_month,
      shopList:[],
      yearList:[],
      fields: [
        {name:'sell_staff_name', title:'installment.commission-open.sell_staff_name'},
        {name:'num_contract', title:'installment.commission-open.num_contract',width:'48px',className:'right'},
        {name:'sum_product_price', title:'installment.commission-open.sum_product_price', width:'100px',className:'right',render:function(row) {
          return helper.numberFormat(row.sum_product_price, 2);
        }},
        {name:'sum_payment_price', title:'installment.commission-open.sum_payment_price', width:'100px', className:'right', render:function(row) {
          return helper.numberFormat(row.sum_payment_price, 2);
        }},
        {name:'sum_cost', title:'installment.commission-open.sum_cost', width:'100px', className:'right', render: function(row) {
          return helper.numberFormat(row.sum_cost, 2);
        }},
        {name:'sum_fee', title:'installment.commission-open.sum_fee', width:'72px', className:'right', render:function(row) {
          return helper.numberFormat(row.sum_fee, 2);
        }},
        {name:'sum_install_cost', title:'installment.commission-open.sum_install_cost', width:'72px', className:'right', render:function(row) {
          return helper.numberFormat(row.sum_install_cost, 2);
        }},
        {name:'sum_profit', title:'installment.commission-open.sum_profit', width:'100px', className:'right', render:function(row) {
          return helper.numberFormat(row.sum_profit,2);
        }},
        {name:'paid_amount', title:'installment.commission-open.paid_amount', width:'68px', className:'right', render:function(row) {
          return row.paid_amount > 0 ? helper.numberFormat(row.paid_amount,2) : '-';
        }},
        {name:'authorized_date', title:'installment.commission-open.authorized_date', width:'80px', render:function(row) {
          if (!row.authorized_date) {
            return '';
          }
          return tr.localize(new Date(row.authorized_date), {type:'date',format:'short'});
        }},
        {name:'actions', type:'actions', width:(2*24+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="installment.commission-open.detail" param={{
                staff_id:row.id,
                term_year:this.state.term_year,
                term_month:this.state.term_month,
                shop_id:this.state.shop_id
              }}  icon="right244" title="action.select"></FlexIcon>
          </div>);
        }.bind(this)}
      ]
    };
  },

  componentDidMount: function() {
//    commissionActions.list();
    commissionActions.facetList();
  },

  onListDoneAction: function(result) {
    console.log('listDone');
    this.setState({
      data: result.data
    });
  },

  onFacetListDoneAction: function(result) {
    this.setState({
      shopList: result.shops.map(function(row) {return {value:row.id, text: row.code+' '+row.name}}),
      yearList: result.years.map(function(row) {return {value:row.term_year, text: row.term_year}})
    });
  },

  handleChange: function(id, value) {
    this.state[id] = value;
    var obj = {
      term_month:this.state.term_month,
      term_year:this.state.term_year,
      shop_id:this.state.shop_id
    };
    storage.save(storageKey, obj);
    this.setState(obj, function() {
      this.refs.grid.doRefresh();
    });
  },

  render: function() {
    var monthList = [];
    var thMonth = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    for (i = 0; i < 12; i++) {
      monthList.push({
        value: ('0' + (i+1)).substr(-2),
        text: thMonth[i]
      });
    };
    return (
      <div>
        <div className="content-header boxf flex flex-form">
          <div className="panelf can-grow">
            <T content="installment.commission-open.title.list" component="h2" />
          </div>
          <div className="panel4 flex">
            <div className="can-grow">
              <FlexDropdown
                field={{id:'term_month',label:'installment.commission-open.filter_term_month',list:monthList}}
                data={this.state}
                onChange={this.handleChange}
                />
            </div>
            <div className="no-shrink" style={{width:'160px'}}>
              <FlexDropdown
                field={{id:'term_year',label:'installment.commission-open.filter_term_year',list:this.state.yearList}}
                data={this.state}
                onChange={this.handleChange}
                />
            </div>
          </div>
          <div className="panel3 no-shrink flex-form">
            <FlexDropdown
              field={{id:'shop_id',label:'installment.commission-open.filter_shop',list:this.state.shopList}}
              data={this.state}
              onChange={this.handleChange}
              />
          </div>
        </div>
        <div className="panel10">
          <FlexGrid
            ref="grid"
            id="installment-commission-open-list"
            listAction={commissionActions.list}
            exportAction={commissionActions.export}
            fields={this.state.fields}
            pk="id"
            sortBy="sell_staff_name"
            sortDir="ASC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{
              shop_id:this.state.shop_id,
              term_year:this.state.term_year,
              term_month:this.state.term_month
            }}
            />
        </div>
      </div>
    )
  }
});

module.exports = Generator;
