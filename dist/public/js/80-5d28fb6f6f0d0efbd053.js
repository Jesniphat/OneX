webpackJsonp([80,135],{

/***/ 820:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facetList': { children: ['done', 'error'] },
	  'facetDetail': { children: ['done', 'error'] },
	  'commissionDetail': { children: ['done', 'error'] },
	  'saveCommission': { children: ['done', 'error'] },
	  'voidCommission': { children: ['done', 'error'] },
	  'paidCommission': { children: ['done', 'error'] }
	});

/***/ },

/***/ 873:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var T = __webpack_require__(381);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(354);
	var widgets = __webpack_require__(377);

	var actions = __webpack_require__(820);

	var helper = system.helper;
	var toasterActions = system.toasterActions;
	var infoPanelActions = system.infoPanelActions;
	var dialogActions = system.dialogActions;

	var FlexDataTable = widgets.FlexDataTable;
	var FlexTextInput = widgets.FlexTextInput;
	var FlexDropdown = widgets.FlexDropdown;
	var FlexButton = widgets.FlexButton;
	var FlexIcon = widgets.FlexIcon;

	var statusName = {
	  NORMAL: 'ปกติ',
	  DEBT: 'ค้างชำระ',
	  CLOSE_CANCEL: 'ปิด/ยกเลิก',
	  CLOSE_NORMAL: 'ปิด/ปกติ',
	  CLOSE_RETURN: 'ปิด/คืนของ',
	  CLOSE_CONFISCATE: 'ปิด/ยึดของ',
	  CLOSE_BAD_DEBT: 'ปิด/หนี้สูญ'
	};

	var CommissionDetail = React.createClass({
	  displayName: 'CommissionDetail',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  mixins: [Reflux.listenTo(actions.facetDetail.done, 'onFacetDetailDoneAction'), Reflux.listenTo(actions.facetDetail.error, 'onFacetDetailErrorAction'), Reflux.listenTo(actions.commissionDetail.done, 'onCommissionDetailDoneAction'), Reflux.listenTo(actions.commissionDetail.error, 'onCommissionDetailErrorAction'), Reflux.listenTo(actions.saveCommission.done, 'onSaveCommissionDoneAction'), Reflux.listenTo(actions.saveCommission.error, 'onSaveCommissionErrorAction'), Reflux.listenTo(actions.voidCommission.done, 'onVoidCommissionDoneAction'), Reflux.listenTo(actions.voidCommission.error, 'onVoidCommissionErrorAction'), Reflux.listenTo(actions.paidCommission.done, 'onPaidCommissionDoneAction'), Reflux.listenTo(actions.paidCommission.error, 'onPaidCommissionErrorAction')],

	  getInitialState: function getInitialState() {
	    var param = this.context.router.getCurrentParams();
	    var year = parseInt(param.term_year);
	    var month = parseInt(param.term_month) + 1;
	    if (month > 12) {
	      year++;
	      month = 1;
	    }

	    return {
	      term_year: param.term_year,
	      term_month: param.term_month,
	      paid_year: '' + year,
	      paid_month: ('0' + month).substr(-2),
	      shop_id: parseInt(param.shop_id),
	      staff_id: parseInt(param.staff_id),
	      data: {},
	      profit_amount: 0,
	      num_contract: 0,
	      paid_pct: 5,
	      paid_amount: 0,
	      other_paid: 0,
	      remark: '',
	      chkAll: true,
	      commissionPayment: [],
	      commissionPaymentFields: [{ name: 'summary_period', label: 'installment.commission-open.payment.summary_period', width: 48 }, { name: 'paid_period', label: 'installment.commission-open.payment.paid_period', width: 48 }, { name: 'num_contract', label: 'installment.commission-open.payment.num_contract', width: 32 }, { name: 'profit_amount', label: 'installment.commission-open.payment.profit_amount', width: 80, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.profit_amount, 2);
	        } }, { name: 'paid_pct', label: 'installment.commission-open.payment.paid_pct', width: 56, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.paid_pct, 2);
	        } }, { name: 'paid_amount', label: 'installment.commission-open.payment.paid_amount', width: 80, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.paid_amount, 2);
	        } }, { name: 'authorized_date', label: 'installment.commission-open.payment.authorized_date', width: 72, render: function render(row) {
	          return tr.localize(new Date(row.authorized_date), { type: 'date', format: 'short' });
	        } }, { name: 'remark', label: 'installment.commission-open.payment.remark' }, { name: 'status', label: 'installment.commission-open.payment.status', width: 72, render: function render(row) {
	          return tr.translate('installment.commission-open.payment.status_' + row.status);
	        } }, { name: 'action', width: 70, render: function (row) {
	          console.log('row=', row);
	          if (row.status == 'READY') {
	            var f_void = function () {
	              this.doVoid(row.id);
	            }.bind(this);
	            var f_paid = function () {
	              this.doPaid(row.id);
	            }.bind(this);
	            return React.createElement(
	              'div',
	              { className: 'flex' },
	              React.createElement(
	                'div',
	                { onClick: f_void },
	                React.createElement(FlexIcon, { icon: 'cancel19', title: 'action.void' })
	              ),
	              React.createElement(
	                'div',
	                { onClick: f_paid },
	                React.createElement(FlexIcon, { icon: 'circle108', title: 'action.confirm' })
	              )
	            );
	          }
	          return null;
	        }.bind(this) }],
	      contractList: [],
	      contractFields: [{ name: 'chk', raw: true, label: null, width: 24, render: function (row, i) {
	          return React.createElement('input', { type: 'checkbox',
	            checked: row.chk && row.comm_open_payment_id == 0,
	            disabled: row.comm_open_payment_id > 0,
	            onChange: function () {
	              this.toggleCheckBox(i);
	            }.bind(this) });
	        }.bind(this) }, { name: 'no', label: 'installment.commission-open.contract.no', width: 28, render: function render(row, i) {
	          return i + 1;
	        } }, { name: 'sign_date', label: 'installment.commission-open.contract.sign_date', width: 80, render: function render(row) {
	          return tr.localize(new Date(row.sign_date), { type: 'date', format: 'short' });
	        } }, { name: 'code', label: 'installment.commission-open.contract.code', width: 80, render: function render(row) {
	          return React.createElement(
	            'span',
	            { title: row.code },
	            row.code.substr(8, 2) + '-' + row.code.substr(10, 5)
	          );
	        } }, { name: 'customer', label: 'installment.commission-open.contract.customer', width: 108 }, { name: 'product', label: 'installment.commission-open.contract.product' }, { name: 'total_price', label: 'installment.commission-open.contract.total_price', width: 80, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.total_price, 2);
	        } }, { name: 'payment_price', label: 'installment.commission-open.contract.payment_price', width: 80, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.payment_price, 2);
	        } }, { name: 'cost', label: 'installment.commission-open.contract.cost', width: 80, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.cost, 2);
	        } }, { name: 'fee', label: 'installment.commission-open.contract.fee', width: 64, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.fee, 2);
	        } }, { name: 'install_cost', label: 'installment.commission-open.contract.install_cost', width: 68, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.install_cost, 2);
	        } }, { name: 'profit', label: 'installment.commission-open.contract.profit', width: 80, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.profit, 2);
	        } }, { name: 'current_status', label: 'installment.commission-open.contract.status', width: 60, render: function render(row) {
	          return statusName[row.current_status];
	        } }, { name: 'paid_status', label: 'installment.commission-open.contract.commision_paid', width: 64, render: function render(row) {
	          if (row.comm_open_payment_id == 0) {
	            return '';
	          }
	          return row.paid_period;
	        } }],
	      fields: {
	        profit_amount: {
	          id: 'profit_amount',
	          type: 'number',
	          label: 'installment.commission-open.profit_amount',
	          readonly: true,
	          render: function render(row) {
	            return helper.numberFormat(row.profit_amount, 2);
	          }
	        },
	        num_contract: {
	          id: 'num_contract',
	          type: 'numberinput',
	          label: 'installment.commission-open.total_contract',
	          readonly: true
	        },
	        paid_pct: {
	          id: 'paid_pct',
	          type: 'numberinput',
	          step: 0.05,
	          label: 'installment.commission-open.paid_pct'
	        },
	        paid_amount: {
	          id: 'paid_amount',
	          type: 'number',
	          label: 'installment.commission-open.paid_amount',
	          readonly: true,
	          render: function render(row) {
	            return helper.numberFormat(row.paid_amount, 2);
	          }
	        },
	        other_paid: {
	          id: 'other_paid',
	          type: 'numberinput',
	          label: 'installment.commission-open.other_paid',
	          render: function render(row) {
	            return helper.numberFormat(row.other_paid, 2);
	          }
	        },
	        term_year: {
	          id: 'paid_year',
	          type: 'text',
	          label: 'installment.commission-open.term_year',
	          pattern: '^\\d{4}$'
	        },
	        term_month: {
	          id: 'paid_month',
	          type: 'text',
	          label: 'installment.commission-open.term_month',
	          pattern: '^\\d{1,2}$'
	        },
	        remark: {
	          id: 'remark',
	          label: 'installment.commission-open.remark'
	        }
	      },
	      shopField: {
	        id: 'shop_id',
	        label: 'installment.commission-open.filter_shop',
	        list: []
	      },
	      staffField: {
	        id: 'staff_id',
	        label: 'installment.commission-open.filter_staff',
	        list: []
	      }
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this.doRefreshFacet();
	    this.doRefresh();
	    infoPanelActions.show('installment.commission-open.list', null);
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  checkAll: function checkAll() {
	    this.state.chkAll = !this.state.chkAll;
	    this.state.contractList.forEach(function (contract) {
	      if (contract.comm_open_payment_id == 0) {
	        contract.chk = this.state.chkAll;
	      }
	    }.bind(this));
	    this.calculatePayment();
	  },

	  toggleCheckBox: function toggleCheckBox(i) {
	    this.state.contractList[i].chk = !this.state.contractList[i].chk;
	    this.state.chkAll = true;
	    for (var j = 0; j < this.state.contractList.length; j++) {
	      if (!this.state.contractList[j].chk && this.state.contractList[j].comm_open_payment_id == 0) {
	        this.state.chkAll = false;
	        break;
	      }
	    }
	    this.calculatePayment();
	    // this.setState({
	    //   chkAll: this.state.chkAll,
	    //   contractList: this.state.contractList
	    // });
	  },

	  doRefreshFacet: function doRefreshFacet() {
	    actions.facetDetail({
	      term_year: this.state.term_year,
	      term_month: this.state.term_month
	    });
	  },

	  doRefresh: function doRefresh() {
	    actions.commissionDetail({
	      staff_id: this.state.staff_id,
	      term_year: this.state.term_year,
	      term_month: this.state.term_month,
	      shop_id: this.state.shop_id
	    });
	  },

	  onFacetDetailDoneAction: function onFacetDetailDoneAction(result) {
	    this.shopList = {};
	    this.state.shopField.list = result.shops.map(function (shop) {
	      this.shopList[shop.id] = shop;
	      if (shop.id == this.state.shop_id) {
	        this.state.staffField.list = shop.staffs.map(function (staff) {
	          return {
	            value: staff.id,
	            text: staff.name + ' (' + staff.num_con + ')'
	          };
	        });
	      }
	      return { value: shop.id, text: shop.code + ' ' + shop.name };
	    }.bind(this));
	    var found = false;
	    this.state.staffField.list.forEach(function (row) {
	      if (row.value == this.state.staff_id) {
	        found = true;
	      }
	    }.bind(this));
	    if (!found) {
	      this.state.staff_id = this.state.staffField.list[0].value;
	    }
	    this.setState({
	      shopField: this.state.shopField,
	      staffField: this.state.staffField,
	      staff_id: this.state.staff_id
	    });
	  },

	  onFacetDetailErrorAction: function onFacetDetailErrorAction(err) {
	    toasterActions.pop({
	      type: 'warning',
	      message: err
	    });
	  },

	  calculatePayment: function calculatePayment() {
	    var profit_amount = 0;
	    var num_contract = 0;
	    this.state.contractList.forEach(function (row) {
	      if (row.chk) {
	        profit_amount += row.profit;
	        num_contract++;
	      }
	    });

	    var paid_amount = parseFloat((profit_amount * this.state.paid_pct / 100.0).toFixed(2));
	    paid_amount += this.state.other_paid;
	    this.setState({
	      contractList: this.state.contractList,
	      num_contract: num_contract,
	      profit_amount: profit_amount,
	      paid_amount: paid_amount,
	      other_paid: this.state.other_paid
	    });
	  },

	  onCommissionDetailDoneAction: function onCommissionDetailDoneAction(result) {
	    //    result.contracts[0].comm_open_payment_id = 5;
	    result.contracts.forEach(function (row) {
	      if (row.comm_open_payment_id == 0) {
	        row.chk = true;
	      } else {
	        row.chk = false;
	      }
	    });
	    this.setState({
	      contractList: result.contracts,
	      commissionPayment: result.commissions
	    }, function () {
	      this.calculatePayment();
	    }.bind(this));
	  },

	  onCommissionDetailErrorAction: function onCommissionDetailErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: e
	    });
	  },

	  doCommissionSave: function doCommissionSave() {
	    var list = [];
	    this.state.contractList.forEach(function (contract) {
	      if (contract.chk) {
	        list.push(contract.id);
	      }
	    });
	    var param = {
	      staff_id: this.state.staff_id,
	      summary_period: this.state.term_year.substr(-2) + '/' + this.state.term_month,
	      paid_period: this.state.paid_year.substr(-2) + '/' + this.state.paid_month,
	      num_contract: this.state.num_contract,
	      profit_amount: this.state.profit_amount,
	      paid_pct: this.state.paid_pct,
	      paid_amount: this.state.paid_amount,
	      authorized_date: helper.dateToString(new Date()),
	      remark: this.state.remark,
	      contracts: list,
	      other_paid: this.state.other_paid
	    };
	    actions.saveCommission(param);
	  },

	  onSaveCommissionDoneAction: function onSaveCommissionDoneAction() {
	    this.doRefresh();
	    toasterActions.pop({
	      type: 'success',
	      message: 'result.save.ok'
	    });
	  },

	  onSaveCommissionErrorAction: function onSaveCommissionErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: e
	    });
	  },

	  doVoid: function doVoid(comm_id) {
	    dialogActions.show({
	      title: 'ยืนยัน',
	      content: React.createElement(T, { content: 'installment.commission-open.confirm_to_void', component: 'div' }),
	      actions: [{ id: 'save', icon: 'check52', label: 'action.save' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	    }, function (isCancel, id) {
	      if (isCancel || id == 'cancel') {
	        return;
	      }
	      actions.voidCommission(comm_id);
	    }.bind(this));
	  },

	  doPaid: function doPaid(comm_id) {
	    dialogActions.show({
	      title: 'ยืนยัน',
	      content: React.createElement(T, { content: 'installment.commission-open.confirm_to_paid', component: 'div' }),
	      actions: [{ id: 'save', icon: 'check52', label: 'action.save' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	    }, function (isCancel, id) {
	      if (isCancel || id == 'cancel') {
	        return;
	      }
	      actions.paidCommission(comm_id);
	    }.bind(this));
	  },

	  onVoidCommissionDoneAction: function onVoidCommissionDoneAction() {
	    this.doRefreshFacet();
	    this.doRefresh();
	    toasterActions.pop({
	      type: 'success',
	      message: 'VOID SUCCESSFUL'
	    });
	  },

	  onVoidCommissionErrorAction: function onVoidCommissionErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: e
	    });
	  },

	  onPaidCommissionDoneAction: function onPaidCommissionDoneAction() {
	    this.doRefreshFacet();
	    this.doRefresh();
	    toasterActions.pop({
	      type: 'success',
	      message: 'PAID SUCCESSFUL'
	    });
	  },

	  onPaidCommissionErrorAction: function onPaidCommissionErrorAction(e) {
	    toasterActions.pop({
	      type: 'warning',
	      message: e
	    });
	  },

	  handleShopChange: function handleShopChange(id, value) {
	    if (this.shopList[value]) {
	      var found = false;
	      this.state.staffField.list = this.shopList[value].staffs.map(function (staff) {
	        if (staff.id == this.state.staff_id) {
	          found = true;
	        }
	        return {
	          value: staff.id,
	          text: staff.name + ' (' + staff.num_con + ')'
	        };
	      }.bind(this));

	      if (!found) {
	        this.state.staff_id = 0;
	      }
	    } else {
	      this.state.staff_id = 0;
	    }
	    this.setState({
	      shop_id: this.state.shiop_id,
	      staff_id: this.state.staff_id,
	      staffField: this.state.staffField
	    });
	  },

	  handleStaffChange: function handleStaffChange(id, value) {
	    this.setState({
	      staff_id: value
	    }, function () {
	      this.doRefresh();
	    }.bind(this));
	  },

	  handleChangePct: function handleChangePct(id, value) {
	    var pct = parseFloat(value);
	    if (isNaN(pct) || pct < 0) {
	      pct = 0;
	    }
	    this.state.paid_pct = pct;
	    this.calculatePayment();
	  },

	  handleChangeOther: function handleChangeOther(id, value) {
	    var other_paid = parseFloat(value);
	    // if (isNaN(other_paid) || other_paid < 0) {
	    //   other_paid = 0;
	    // }
	    this.state.other_paid = other_paid;
	    this.calculatePayment();
	  },

	  handleChange: function handleChange(id, value) {
	    if (id == 'term_month') {
	      if (value >= 12) {
	        value = 12;
	      }
	      if (value < 1) {
	        value = 1;
	      }
	      value = ('0' + value).substr(-2);
	    }
	    this.state[id] = value;
	    var obj = {};
	    obj[id] = value;
	    this.setState(obj);
	  },

	  render: function render() {
	    this.state.contractFields[0].label = React.createElement('input', { type: 'checkbox', checked: this.state.chkAll, onChange: this.checkAll });
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex flex-form' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'installment.commission-open.title.detail', component: 'h2' })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel5 flex' },
	          React.createElement(FlexDropdown, {
	            field: this.state.shopField,
	            data: this.state,
	            onChange: this.handleShopChange
	          }),
	          React.createElement(FlexDropdown, {
	            field: this.state.staffField,
	            data: this.state,
	            onChange: this.handleStaffChange
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'box12 flex-form flex' },
	        React.createElement(
	          'div',
	          { className: 'panel4 no-shrink' },
	          React.createElement(
	            'div',
	            { style: { paddingBottom: '4px' } },
	            React.createElement(FlexTextInput, {
	              field: this.state.fields.profit_amount,
	              data: this.state
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'flex', style: { paddingBottom: '4px' } },
	            React.createElement(FlexTextInput, {
	              field: this.state.fields.num_contract,
	              data: this.state
	            }),
	            React.createElement(FlexTextInput, {
	              field: this.state.fields.paid_pct,
	              data: this.state,
	              onChange: this.handleChangePct
	            })
	          ),
	          React.createElement(
	            'div',
	            { style: { paddingBottom: '4px' } },
	            React.createElement(FlexTextInput, {
	              field: this.state.fields.paid_amount,
	              data: this.state,
	              className: 'blue'
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'flex', style: { paddingBottom: '4px' } },
	            React.createElement(FlexTextInput, {
	              field: this.state.fields.term_year,
	              data: this.state,
	              onChange: this.handleChange
	            }),
	            React.createElement(FlexTextInput, {
	              field: this.state.fields.term_month,
	              data: this.state,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            null,
	            React.createElement(FlexTextInput, {
	              field: this.state.fields.remark,
	              data: this.state,
	              onChange: this.handleChange
	            })
	          ),
	          React.createElement(
	            'div',
	            null,
	            React.createElement(FlexButton, { icon: 'save20', label: 'action.save', 'default': true,
	              onClick: this.doCommissionSave })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel8' },
	          React.createElement(FlexDataTable, {
	            fields: this.state.commissionPaymentFields,
	            data: this.state.commissionPayment,
	            displayRows: 5
	          })
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'panel12' },
	        React.createElement(FlexDataTable, {
	          fields: this.state.contractFields,
	          data: this.state.contractList,
	          displayRows: 6
	        })
	      )
	    );
	  }
	});

	module.exports = CommissionDetail;

/***/ }

});