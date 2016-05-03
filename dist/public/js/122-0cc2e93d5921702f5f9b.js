webpackJsonp([122,135],{

/***/ 1003:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);
	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);
	var widgets = __webpack_require__(377);

	var FlexButton = widgets.FlexButton;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexDropdown = widgets.FlexDropdown;

	var dialogActions = system.dialogActions;
	var systemActions = system.systemActions; //require('../../system/actions');
	var infoPanelActions = system.infoPanelActions;

	var actions = __webpack_require__(1004);
	var customerStore = __webpack_require__(1005);

	var Others = {};

	tr.registerTranslations('en', __webpack_require__(1006));
	tr.registerTranslations('th', __webpack_require__(1007));

	Others.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('others.title.index'));
	  },

	  render: function render() {
	    return this.props.children;
	  }
	});

	Others.List = React.createClass({
	  displayName: 'List',

	  mixins: [Reflux.listenTo(actions.getBranch.done, 'onGetBranchAction'), Reflux.listenTo(actions.pdfExport.done, 'onPDFExport')],
	  getInitialState: function getInitialState() {
	    return {
	      report: null,
	      Parameter: React.createElement('div', null),
	      preview: '',
	      param: {
	        date_from: '2015/01/01',
	        date_to: '2015/12/01',
	        date: '2015/01/01',
	        branch: 'ALL'
	      },
	      branchItem: {
	        id: 'branch',
	        icon: 'user157',
	        label: 'others.param.branch',
	        list: []
	      },
	      list: ['income_customer', 'income_customer_expect', 'summary', 'product_branch', 'debtor_ca_staff', 'debtor_ca', 'summary_installment', 'debtor_per_day', 'debtor_per_month', 'debtor_per_year', 'summary_debtor', 'summary_debtor_new'],
	      class: {}
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    infoPanelActions.show('report', null);
	    systemActions.setPageHeader('');
	    actions.getBranch();
	    this.onResetCSSReport();
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },
	  onResetCSSReport: function onResetCSSReport(name_active) {
	    for (var i = 0; i < this.state.list.length; i++) {
	      this.state.class[this.state.list[i]] = 'report-list';
	    }
	    if (name_active != undefined) this.state.class[name_active] = 'report-list report-active';
	    this.setState({ class: this.state.class });
	  },
	  onGetBranchAction: function onGetBranchAction(data) {

	    var list = data.branch.map(function (row) {
	      return { value: row.value, text: row.text };
	    });
	    this.state.branchItem.list = list;
	    this.setState({
	      branchItem: { list: list }
	    });
	  },
	  onPDFExport: function onPDFExport(filename) {
	    window.open(filename);
	  },
	  handleChange: function handleChange(id, value) {
	    console.log(id, value);
	    this.state.param[id] = value;
	    this.setState({
	      param: this.state.param,
	      Parameter: this.createParameter(this.state.report)
	    });
	  },
	  createParameter: function createParameter(name) {
	    this.state.report = name || this.state.report || 'summary';

	    var report = {
	      income_customer: ['period_date', 'branch'],
	      income_customer_expect: ['period_date', 'branch'],
	      summary: ['period_date', 'branch'],
	      product_branch: ['period_date', 'branch'],
	      debtor_ca_staff: ['period_date'],
	      debtor_ca: ['period_date'],
	      summary_installment: ['date'],
	      debtor_per_day: ['period_date'],
	      debtor_per_month: ['period_date'],
	      debtor_per_year: ['year'],
	      summary_debtor: ['date'],
	      summary_debtor_new: ['period_year']
	    };

	    var field = {
	      date_from: { id: 'date_from', label: 'others.param.date_from', type: 'date' },
	      date_to: { id: 'date_to', label: 'others.param.date_to', type: 'date' },
	      date: { id: 'date_to', label: 'others.param.date', type: 'date' }
	    };

	    var obj = React.createElement('div', { className: 'flex-form', style: { padding: '10px 10px' } });
	    var btn = React.createElement(
	      'div',
	      { style: { marginTop: 8 } },
	      React.createElement(FlexButton, {
	        icon: 'printer88', label: 'action.print', 'default': true,
	        field: this.state.btn_print,
	        onClick: this.doSubmit })
	    );

	    if (obj._store.originalProps.children == undefined) obj._store.originalProps.children = [];
	    if (obj._store.props.children == undefined) obj._store.props.children = [];
	    obj._store.originalProps.children.push(btn);
	    obj._store.props.children.push(btn);

	    for (var i = 0; i < report[this.state.report].length; i++) {
	      var param = null;
	      switch (report[this.state.report][i]) {
	        case 'branch':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexDropdown, { field: this.state.branchItem, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	        case 'period_date':
	          param = React.createElement(
	            'div',
	            null,
	            React.createElement(
	              'div',
	              { style: { marginTop: 8 } },
	              React.createElement(FlexTextInput, { field: field.date_from, data: this.state.param, onChange: this.handleChange })
	            ),
	            React.createElement(
	              'div',
	              { style: { marginTop: 8 } },
	              React.createElement(FlexTextInput, { field: field.date_to, data: this.state.param, onChange: this.handleChange })
	            )
	          );
	          break;
	        case 'date':
	          param = React.createElement(
	            'div',
	            { style: { marginTop: 8 } },
	            React.createElement(FlexTextInput, { field: field.date, data: this.state.param, onChange: this.handleChange })
	          );
	          break;
	      }
	      if (param != null) {
	        // Hack React. //
	        obj._store.originalProps.children.push(param);
	        obj._store.props.children.push(param);
	        // Hack React. //
	      }
	    }

	    return obj;
	  },

	  doPrint: function doPrint(name, label) {
	    this.state.preview = '/img/reports/' + name + '.jpg';
	    this.setState({ Parameter: this.createParameter(name), preview: this.state.preview });
	    this.onResetCSSReport(name);
	  },

	  doRedirect: function doRedirect(name) {},

	  doSubmit: function doSubmit() {
	    var getState = this.state;
	    actions.pdfExport(getState.report, getState.param);
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'content-page' },
	      React.createElement(
	        'div',
	        { className: 'box12 flex' },
	        React.createElement(
	          'div',
	          { className: 'box4' },
	          React.createElement(T, { content: 'others.header.summary', component: 'h2' }),
	          React.createElement(T, { content: 'others.name.income_customer', component: 'div', className: this.state.class.income_customer,
	            onClick: function (e) {
	              this.doPrint('income_customer', 'others.name.income_customer');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.summary', component: 'div', className: this.state.class.summary,
	            onClick: function (e) {
	              this.doPrint('summary', 'others.name.summary');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.product_branch', component: 'div', className: this.state.class.product_branch,
	            onClick: function (e) {
	              this.doPrint('product_branch', 'others.name.product_branch');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.debtor_ca_staff', component: 'div', className: this.state.class.debtor_ca_staff,
	            onClick: function (e) {
	              this.doPrint('debtor_ca_staff', 'others.name.debtor_ca_staff');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.debtor_ca', component: 'div', className: this.state.class.debtor_ca,
	            onClick: function (e) {
	              this.doPrint('debtor_ca', 'others.name.debtor_ca');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.summary_installment', component: 'div', className: this.state.class.summary_installment,
	            onClick: function (e) {
	              this.doPrint('summary_installment', 'others.name.summary_installment');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.debtor_per_day', component: 'div', className: this.state.class.debtor_per_day,
	            onClick: function (e) {
	              this.doPrint('debtor_per_day', 'others.name.debtor_per_day');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.debtor_per_month', component: 'div', className: this.state.class.debtor_per_month,
	            onClick: function (e) {
	              this.doPrint('debtor_per_month', 'others.name.debtor_per_month');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.debtor_per_year', component: 'div', className: this.state.class.debtor_per_year,
	            onClick: function (e) {
	              this.doPrint('debtor_per_year', 'others.name.debtor_per_year');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.summary_debtor_new', component: 'div', className: this.state.class.summary_debtor_new,
	            onClick: function (e) {
	              this.doPrint('summary_debtor_new', 'others.name.summary_debtor_new');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.summary_debtor', component: 'div', className: this.state.class.summary_debtor,
	            onClick: function (e) {
	              this.doPrint('summary_debtor', 'others.name.summary_debtor');
	            }.bind(this) }),
	          React.createElement(T, { content: 'others.name.report_commission_open', component: 'div', className: this.state.class.report_commission_open,
	            onClick: function (e) {}.bind(this) }),
	          React.createElement(T, { content: 'others.name.report_commission_close', component: 'div', className: this.state.class.report_commission_close,
	            onClick: function (e) {}.bind(this) })
	        ),
	        React.createElement(
	          'div',
	          { className: 'box3' },
	          React.createElement(T, { content: 'others.header.parameter', component: 'h2' }),
	          this.state.Parameter
	        ),
	        React.createElement(
	          'div',
	          { className: 'box5' },
	          React.createElement(T, { content: 'others.header.preview', component: 'h2' }),
	          React.createElement('img', { src: this.state.preview, width: '500' })
	        )
	      )
	    );
	  }

	});

	// Others.Routes = (
	//   <Route name="report.others" path="others" handler={Others.Index}>
	//     <Router.DefaultRoute name="report.others.list" handler={Others.List}/>
	//   </Route>
	// );

	module.exports = Others;

/***/ },

/***/ 1004:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'getBranch': { children: ['done', 'error'] },
	  'pdfExport': { children: ['done', 'error'] },
	  'plExport': { children: ['done', 'error'] }
	});

/***/ },

/***/ 1005:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);

	var system = __webpack_require__(354);
	var toasterActions = system.toasterActions;
	var ajaxActions = system.ajaxActions; // require('../../system/actions/ajax');
	var menuActions = system.menuActions; //require('../../system/actions/menu');
	var customerActions = __webpack_require__(1004);

	var customerStore = Reflux.createStore({
	  listenables: [customerActions],

	  onGetBranch: function onGetBranch() {
	    ajaxActions.request('/api/report/getBranch', {}, this.doneGetBranch);
	  },
	  doneGetBranch: function doneGetBranch(res) {
	    if (res.status === true) {
	      customerActions.getBranch.done(res.data);
	    } else {
	      customerActions.getBranch.error(res.msg);
	    }
	  },

	  onPdfExport: function onPdfExport(name, param) {
	    param.report_name = name;
	    ajaxActions.request('/api/report/export', { data: param }, this.donePdfExport);
	  },
	  donePdfExport: function donePdfExport(res) {
	    if (res.status === true) {
	      customerActions.pdfExport.done(res.data.exports);
	    } else {
	      toasterActions.pop({
	        type: 'success',
	        message: 'ไม่พบข้อมูลที่อยู่ในช่วงเวลาที่ระบุ'
	      });
	      customerActions.pdfExport.error(res.msg);
	    }
	  },

	  onPlExport: function onPlExport(name, param) {
	    param.report_name = name;
	    ajaxActions.request('/api/report/exportProfitLoss', { data: param }, this.donePlExport);
	  },

	  donePlExport: function donePlExport(res) {
	    if (res.status === true) {
	      customerActions.plExport.done(res.data.exports);
	    } else {
	      toasterActions.pop({
	        type: 'success',
	        message: 'ไม่พบข้อมูลที่อยู่ในช่วงเวลาที่ระบุ'
	      });
	      customerActions.plExport.error(res.msg);
	    }
	  }

	});

	module.exports = customerStore;

/***/ },

/***/ 1006:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  department: {}
	};

/***/ },

/***/ 1007:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  others: {
	    title: {
	      index: 'รายงานอื่นๆ'
	    }
	  }
	};

/***/ }

});