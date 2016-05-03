var React       = require('react');
var Reflux      = require('reflux');
var T             = require('react-translate-component');
var tr            = require('counterpart');

var system      = require('ss-system');
var widget      = require('ss-widget');

var helper      = system.helper;
var storage     = system.storage;

var actions  = require('./actions');

var FlexGrid      = widget.FlexGrid;
var FlexDropdown  = widget.FlexDropdown;
var FlexIcon      = widget.FlexIcon;
var FlexTextInput = widget.FlexTextInput;

var storageKey = 'installment.commission-close.list';

var Generator = React.createClass({
  mixins: [
    Reflux.listenTo(actions.list.done, 'onListDoneAction'),
    Reflux.listenTo(actions.facetList.done, 'onFacetListDoneAction')
  ],

  getInitialState: function() {
    var today = new Date();
    var prevDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()-15);
    var option = storage.load(storageKey, {term_month:('0'+(prevDay.getMonth()+1)).substr(-2),term_year:''+prevDay.getFullYear()});

    return {
      data: [],
      term_year: option.term_year,
      term_month: option.term_month,
      yearList:[],
      fields: [
        {name:'shop_code', title:'installment.commission-close.list.shop'},
        {name:'normal_cnt', title:'installment.commission-close.list.cnt',className:'right',width:'40px'},
        {name:'normal_amount', title:'installment.commission-close.list.close_normal',format:'money',width:'96px'},
        {name:'cancel_cnt', title:'installment.commission-close.list.cnt',className:'right',width:'40px'},
        {name:'cancel_amount', title:'installment.commission-close.list.close_cancel',format:'money',width:'96px'},
        {name:'return_cnt', title:'installment.commission-close.list.cnt',className:'right',width:'40px'},
        {name:'return_amount', title:'installment.commission-close.list.close_return',format:'money',width:'96px'},
        {name:'confiscate_cnt', title:'installment.commission-close.list.cnt',className:'right',width:'40px'},
        {name:'confiscate_amount', title:'installment.commission-close.list.close_confiscate',format:'money',width:'96px'},
        {name:'bad_debt_cnt', title:'installment.commission-close.list.cnt',className:'right',width:'40px'},
        {name:'bad_debt_amount', title:'installment.commission-close.list.close_bad_debt',format:'money',width:'96px'},
        {name:'total_cnt', title:'installment.commission-close.list.cnt',className:'right',width:'40px'},
        {name:'total_amount', title:'installment.commission-close.list.commission',format:'money',width:'96px'},
        {name:'actions', type:'actions', width:(2*24+8)+'px', render:function(row) {
          return (<div className="flex">
            <FlexIcon to="installment.commission-close.detail" param={{
                term_year:this.state.term_year,
                term_month:this.state.term_month,
                shop_id:row.shop_id
              }}  icon="right244" title="action.select"></FlexIcon>
          </div>);
        }.bind(this)}
      ]
    };
  },

  componentDidMount: function() {
    actions.list();
    actions.facetList();
  },

  onListDoneAction: function(result) {
    this.setState({
      data: result.data
    });
  },

  onFacetListDoneAction: function(result) {
    this.setState({
      yearList: result.years.map(function(row) {return {value:row.term_year, text: row.term_year}})
    });
  },

  handleChange: function(id, value) {
    this.state[id] = value;
    var obj = {
      term_month:this.state.term_month,
      term_year:this.state.term_year
    };
    storage.save(storageKey, obj);
    this.setState(obj, function() {
      console.log('doRefresh');
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
            <T content="installment.commission-close.title.list" component="h2" />
          </div>
          <div className="panel4 flex">
            <div className="can-grow">
              <FlexDropdown
                field={{id:'term_month',label:'installment.commission-close.filter_term_month',list:monthList}}
                data={this.state}
                onChange={this.handleChange}
                />
            </div>
            <div className="no-shrink" style={{width:'160px'}}>
              <FlexDropdown
                field={{id:'term_year',label:'installment.commission-close.filter_term_year',list:this.state.yearList}}
                data={this.state}
                onChange={this.handleChange}
                />
            </div>
          </div>
        </div>
        <div className="panel10">
          <FlexGrid
            ref="grid"
            id="installment-commission-close-list"
            listAction={actions.list}
            exportAction={actions.export}
            fields={this.state.fields}
            pk="id"
            sortBy="sell_staff_name"
            sortDir="ASC"
            limit={50}
            checkbox={false}
            search={true}
            displayRows={10}
            filters={{
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
