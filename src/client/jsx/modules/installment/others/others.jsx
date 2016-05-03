var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var T             = require('react-translate-component');
var tr            = require('counterpart');
var Reflux        = require('reflux');
var Link            = Router.Link;

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


var Others = {};

tr.registerTranslations('en', require('./lang/en.js'));
tr.registerTranslations('th', require('./lang/th.js'));


Others.Index = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function() {
    systemActions.setPageHeader(tr.translate('others.title.index'));
  },

  render: function() {
    return this.props.children;
  }
});


Others.List = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins:[
    Reflux.listenTo(actions.getBranch.done,'onGetBranchAction'),
    Reflux.listenTo(actions.pdfExport.done,'onPDFExport')
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
          'income_customer_expect',
          'summary',
          'product_branch',
          'debtor_ca_staff',
          'debtor_ca',
          'summary_installment',
          'debtor_per_day',
          'debtor_per_year',
          'summary_debtor',
          'summary_debtor_new',
          'summary_ca',
          'commission_expense',
          'table_summary_ca',
          'table_summary_r',
          'report_commission_open',
          'report_commission_close'
        ],
        class:{}
    };
  },
  componentDidMount: function() {
    infoPanelActions.show('installment',null);
    systemActions.setPageHeader('');
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
      branchItem: this.state.branchItem
    });
  },
  onPDFExport: function(filename){
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
      income_customer: ['period_date', 'branch'],
      income_customer_expect: ['period_date', 'branch'],
      summary: ['period_date', 'branch'],
      product_branch: ['period_date', 'branch'],
      debtor_ca_staff: ['period_date'],
      debtor_ca: ['period_date'],
      summary_installment: ['year_all', 'branch'],
      debtor_per_day: ['month', 'year', 'day'],
      debtor_per_year: ['year'],
      summary_debtor: ['month', 'year'],
      summary_debtor_new: ['year'],
      summary_ca: ['year'],
      commission_expense: ['month','year'],
      table_summary_ca: ['month','year'],
      table_summary_r: ['month','year'],
      report_commission_open: [],
      report_commission_close: []
    }
    

    var field = {
      date_from: { id:'date_from', label:'others.param.date_from', type: 'date' },
      date_to: { id:'date_to', label:'others.param.date_to', type: 'date' },
      date: { id:'date', label:'others.param.date', type: 'date' },
      day: { id:'day', label:'others.param.day', type: 'text', pattern:'^[0-9]{1,2}$'}
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

    // if(obj.props == undefined) obj.props = { children: [] };
    // if(obj.props.children == undefined) obj.props.children = [];
    // obj.props.children.push(btn);

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
        case 'day':
          param = (
                    <div style={{ marginTop:8 }}>
                      <FlexTextInput field={field.day} data={ this.state.param } onChange={this.handleChange} />
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
      // if(param != null) {
      //   // Hack React. //
      //   obj.props.children.push(param);
      //   // Hack React. //
      // }
    }


    return obj;
  },

  doPrint: function(name, label) {
    this.state.preview = '/img/reports/'+name+'.jpg';
    this.setState({ Parameter: this.createParameter(name), preview: this.state.preview });
    this.onResetCSSReport(name);
  },

  doRedirect: function(link){
    //console.log('this.context=',this.context.router);
    this.context.router.transitionTo(link);
  },

  doSubmit: function(){
    var getState = this.state;
    getState.param.display_name = system.sessionStore.getSession().staff.display_name;

    actions.pdfExport(getState.report, getState.param);
  },

  render: function() {
    return (
      <div className="content-page">
        <div className="box12 flex">
          <div className="box5">
            <T content={'others.header.summary'} component="h2" />
            <Link to="/installment/others/income_customer" activeClassName="report-active" className="report-list">
              <span className={'flaticon-google122 normal icon'}></span>
              {tr.translate("others.name.income_customer")}
            </Link>
            <T content={'others.name.income_customer'} component="div" className={this.state.class.income_customer}
             onClick={function(e) { this.doPrint('income_customer', 'others.name.income_customer'); }.bind(this) }/>
            <T content={'others.name.income_customer_expect'} component="div" className={this.state.class.income_customer_expect}
             onClick={function(e) { this.doPrint('income_customer_expect', 'others.name.income_customer_expect'); }.bind(this) }/>
            <T content={'others.name.summary'} component="div" className={this.state.class.summary}
             onClick={function(e) { this.doPrint('summary', 'others.name.summary'); }.bind(this) }/>
            <T content={'others.name.product_branch'} component="div" className={this.state.class.product_branch}
             onClick={function(e) { this.doPrint('product_branch', 'others.name.product_branch'); }.bind(this) }/>
            <T content={'others.name.debtor_ca_staff'} component="div" className={this.state.class.debtor_ca_staff}
             onClick={function(e) { this.doPrint('debtor_ca_staff', 'others.name.debtor_ca_staff'); }.bind(this) }/>
            <T content={'others.name.debtor_ca'} component="div" className={this.state.class.debtor_ca}
             onClick={function(e) { this.doPrint('debtor_ca', 'others.name.debtor_ca'); }.bind(this) }/>
            <T content={'others.name.summary_installment'} component="div" className={this.state.class.summary_installment}
             onClick={function(e) { this.doPrint('summary_installment', 'others.name.summary_installment'); }.bind(this) }/>
            <T content={'others.name.debtor_per_day'} component="div" className={this.state.class.debtor_per_day}
             onClick={function(e) { this.doPrint('debtor_per_day', 'others.name.debtor_per_day'); }.bind(this) }/>
            <T content={'others.name.debtor_per_year'} component="div" className={this.state.class.debtor_per_year}
             onClick={function(e) { this.doPrint('debtor_per_year', 'others.name.debtor_per_year'); }.bind(this) }/>
            <T content={'others.name.summary_debtor'} component="div" className={this.state.class.summary_debtor}
             onClick={function(e) { this.doPrint('summary_debtor', 'others.name.summary_debtor'); }.bind(this) }/>
            <T content={'others.name.summary_ca'} component="div" className={this.state.class.summary_ca}
             onClick={function(e) { this.doPrint('summary_ca', 'others.name.summary_ca'); }.bind(this) }/>
            <T content={'others.name.table_summary_ca'} component="div" className={this.state.class.table_summary_ca}
             onClick={function(e) { this.doPrint('table_summary_ca', 'others.name.table_summary_ca'); }.bind(this) }/>
            <T content={'others.name.table_summary_r'} component="div" className={this.state.class.table_summary_r}
             onClick={function(e) { this.doPrint('table_summary_r', 'others.name.table_summary_r'); }.bind(this) }/>
           <T content={'others.name.report_commission_open'} component="div" className={this.state.class.report_commission_open}
             onClick={function(e) {this.doRedirect('installment.report-commission-open')}.bind(this) }/>
           <T content={'others.name.report_commission_close'} component="div" className={this.state.class.report_commission_close}
             onClick={function(e) {this.doRedirect('installment.report-commission-close')}.bind(this) }/>
          </div>
          <div className="box3">
            <T content={'others.header.parameter'} component="h2" />
            {this.state.Parameter}
          </div>
          <div className="box5">
            <T content={'others.header.preview'} component="h2" />
            <img src={this.state.preview} width="500" />
          </div>
        </div>
      </div>
    )
  }

});

// Others.Routes = (
//   <Route name="installment.others.others" path="others" handler={Others.Index}>
//     <Router.DefaultRoute name="installment.others.list" handler={Others.List}/>
//   </Route>
// );

module.exports = Others;

            // <T content={'others.name.commission_expense'} component="div" className={this.state.class.commission_expense}
            //  onClick={function(e) { this.doPrint('commission_expense', 'others.name.commission_expense'); }.bind(this) }/>
