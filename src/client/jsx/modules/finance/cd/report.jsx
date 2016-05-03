var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');
var Reflux        = require('reflux');

var system        = require('ss-system');
var widgets       = require('ss-widget');

var FlexButton    = widgets.FlexButton;
var FlexTextInput = widgets.FlexTextInput;
var FlexDropdown  = widgets.FlexDropdown;

var dialogActions = system.dialogActions;
var systemActions = system.systemActions; //require('../../system/actions');
var infoPanelActions  = system.infoPanelActions;

var actions  = require('./actions');
var customerStore    = require('./store');


var Report = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


Report.Index = React.createClass({
  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('reports.title.index'));
  },

  render: function() {
    return (
      <Router.RouteHandler/>
    );
  }
});


Report.List = React.createClass({
  mixins:[
    Reflux.listenTo(actions.getBranch.done,'onGetBranchAction'),
    Reflux.listenTo(actions.pdfExport.done,'onPDFExport'),
    Reflux.listenTo(actions.exportProfitLoss.done,'onExportProfitLoss')
  ],
  getInitialState: function() {
    var listMonth = [], listYear = [], listYearAll = [], yearStart = 2557;
    var THMonth = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม','มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]

    for (var i = 0; i < 12; i++) {
      listMonth.push({ value: i+1, text: THMonth[i] });
    };

    listYearAll.push({ value:'ALL', text: 'ALL' });
    for (var i = 0; i < 10; i++) {
      listYear.push({ value:yearStart + i - 543, text: yearStart + i });
      listYearAll.push({ value:yearStart + i - 543, text: yearStart + i });
    };

    var y = new Date().getFullYear(), m = new Date().getMonth() + 1;

    return {
        report: null,
        Parameter: (<div></div>),
        preview: '',
        param:{
          date_from: '2015/01/01',
          date_to: '2015/12/01',
          date: '2015/01/01',
          branch: 'ALL',
          month: m,
          year: y,
          year_all: y,
          day: 0
        },
        branchItem: {
          id:'branch',
          icon:'user157',
          label:'others.param.branch',
          list:[]
        },
        monthItem: {
          id:'month',
          icon:'user157',
          label:'others.param.month',
          list: listMonth
        },
        yearItem: {
          id:'year',
          icon:'user157',
          label:'others.param.year',
          list: listYear
        },
        yearAllItem: {
          id:'year_all',
          icon:'user157',
          label:'others.param.year_all',
          list: listYearAll
        },
        list:[
          'income_customer',
          'profit_loss'
        ],
        class:{}
    };
  },
  componentDidMount: function() {
    infoPanelActions.show('finance',null);
    systemActions.setPageHeader('reports.title.index');
    actions.getBranch();
    this.onResetCSSReport();
  },
  componentWillUnmount: function() {
    infoPanelActions.hide();
  },
  onResetCSSReport: function(name_active){
    for (var i=0; i<this.state.list.length; i++) { this.state.class[this.state.list[i]] = 'report-list'; }
    if(name_active != undefined) this.state.class[name_active] = 'report-list report-active';
    this.setState({ class: this.state.class });
  },
  onGetBranchAction: function(data){

    var list = data.branch.map(function(row) {
      return { value: row.value, text: row.text }
    });
    this.state.branchItem.list = list;
    this.setState({
      branchItem: { list: list }
    });
  },
  onPDFExport: function(filename){
    window.open(filename);
  },
  onExportProfitLoss: function(filename){
    window.open(filename);
  },
  handleChange: function(id, value)
  {
    console.log(id, value);
    this.state.param[id] = value;
    this.setState({
      param: this.state.param,
      Parameter: this.createParameter(this.state.report)
    });
  },
  createParameter: function(name)
  {
    this.state.report = name || this.state.report || 'summary';

    var report = {
      summaryIncomeShop:  ['date'],
      profit_loss:['month', 'year']
    }

    var field = {
      date_from: { id:'date_from', label:'reports.param.date_from', type: 'date' },
      date_to: { id:'date_to', label:'reports.param.date_to', type: 'date' },
      date: { id:'date_to', label:'reports.param.date', type: 'date' },
    }

    var obj = (
        <div className="flex-form" style={{ padding:'10px 10px' }}></div>
    );
    var btn = (
      <div style={{ marginTop:8 }}>
        <FlexButton
          icon="printer88" label="action.print" default={true}
          field={this.state.btn_print}
          onClick={this.doSubmit}/>
      </div>
    );


    if(obj._store.originalProps.children == undefined) obj._store.originalProps.children = [];
    if(obj._store.props.children == undefined) obj._store.props.children = [];
    obj._store.originalProps.children.push(btn);
    obj._store.props.children.push(btn);

    for (var i=0; i<report[this.state.report].length; i++)
    {
      var param = null;
      switch(report[this.state.report][i])
      {
        case 'branch':
          param = (
                    <div style={{ marginTop:8 }}>
                        <FlexDropdown field={this.state.branchItem} data={this.state.param} onChange={this.handleChange} />
                    </div>
                  );
          break;
        case 'month':
          param = (
                    <div style={{ marginTop:8 }}>
                        <FlexDropdown field={this.state.monthItem} data={this.state.param} onChange={this.handleChange} />
                    </div>
                  );
          break;
        case 'year':
          param = (
                    <div style={{ marginTop:8 }}>
                        <FlexDropdown field={this.state.yearItem} data={this.state.param} onChange={this.handleChange} />
                    </div>
                  );
          break;
        case 'year_all':
          param = (
                    <div style={{ marginTop:8 }}>
                        <FlexDropdown field={this.state.yearAllItem} data={this.state.param} onChange={this.handleChange} />
                    </div>
                  );
          break;
        case 'period_date':
          param = (
                    <div>
                      <div style={{ marginTop:8 }}>
                        <FlexTextInput field={field.date_from} data={ this.state.param } onChange={this.handleChange} />
                      </div>
                      <div style={{ marginTop:8 }}>
                        <FlexTextInput field={field.date_to} data={ this.state.param } onChange={this.handleChange} />
                      </div>
                    </div>
                  );
          break;
        case 'date':
          param = (
                    <div style={{ marginTop:8 }}>
                      <FlexTextInput field={field.date} data={ this.state.param } onChange={this.handleChange} />
                    </div>
                  );
          break;
      }
      if(param != null) {
        // Hack React. //
        obj._store.originalProps.children.push(param);
        obj._store.props.children.push(param);
        // Hack React. //
      }
    }


    return obj;
  },

  doPrint: function(name, label) {
    this.state.preview = '/img/reports/'+name+'.jpg';
    this.setState({ Parameter: this.createParameter(name), preview: this.state.preview });
    this.onResetCSSReport(name);
  },

  doSubmit: function(){
    var getState = this.state;
    console.log('State:',getState);
    if (getState.report=='profit_loss') {
      console.log('profit_loss');
      actions.exportProfitLoss(getState.report, getState.param);
    }else{
      console.log('else');
      actions.pdfExport(getState.report, getState.param);
    }

  },

  render: function() {
    return (
      <div className="content-page">
        <div className="box12 flex">
          <div className="box4">
            <T content={'reports.header.summary'} component="h2" />
            <T content={'reports.summaryIncomeShop'} component="div" className={this.state.class.income_customer}
             onClick={function(e) { this.doPrint('summaryIncomeShop', 'finance.name.income_customer'); }.bind(this) }/>
           <T content={'reports.profit_loss'} component="div" className={this.state.class.profit_loss}
              onClick={function(e) { this.doPrint('profit_loss', 'finance.name.profit_loss'); }.bind(this) }/>
          </div>
          <div className="box3">
            <T content={'reports.header.parameter'} component="h2" />
            {this.state.Parameter}
          </div>
          <div className="box5" >
            <T content={'reports.header.preview'} component="h2" />
            <img src={this.state.preview} width="500" />
          </div>
        </div>
      </div>
    )
  }

});

// Report.Routes = (
//   <Route name="finance.report" path="report" handler={Report.Index}>
//     <Router.DefaultRoute name="finance.report.list" handler={Report.List}/>
//   </Route>
// );

module.exports = Report;
