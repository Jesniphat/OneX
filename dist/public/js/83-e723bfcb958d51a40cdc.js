webpackJsonp([83,135],{

/***/ 833:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facetList': { children: ['done', 'error'] },
	  'genrate': { children: ['done', 'error'] },
	  'facetDetail': { children: ['done', 'error'] },
	  'commissionDetail': { children: ['done', 'error'] },
	  'saveCommission': { children: ['done', 'error'] },
	  'voidCommission': { children: ['done', 'error'] },
	  'paidCommission': { children: ['done', 'error'] }
	});

/***/ },

/***/ 884:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(337);
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);
	var widgets = __webpack_require__(379);

	var actions = __webpack_require__(833);

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
	    var month = parseInt(param.term_month);
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
	      num_receipt: 0,
	      paid_pct: 5,
	      paid_amount: 0,
	      closeca_amount: 0,
	      closeca_amount_txt: 0,
	      remark: '',
	      chkAll: true,
	      commissionPayment: [],
	      commissionPaymentFields: [{ name: 'summary_period', label: 'installment.commission-close.payment.summary_period', width: 48 }, { name: 'paid_period', label: 'installment.commission-close.payment.paid_period', width: 48 }, { name: 'num_receipt', label: 'installment.commission-close.payment.num_receipt', width: 32 }, { name: 'profit_amount', label: 'installment.commission-close.payment.profit_amount', width: 80, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.profit_amount, 2);
	        } }, { name: 'paid_pct', label: 'installment.commission-close.payment.paid_pct', width: 56, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.paid_pct, 2);
	        } }, { name: 'paid_amount', label: 'installment.commission-close.payment.paid_amount', width: 80, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.paid_amount, 2);
	        } }, { name: 'authorized_date', label: 'installment.commission-close.payment.authorized_date', width: 72, render: function render(row) {
	          return tr.localize(new Date(row.authorized_date), { type: 'date', format: 'short' });
	        } }, { name: 'remark', label: 'installment.commission-close.payment.remark' }, { name: 'status', label: 'installment.commission-close.payment.status', width: 72, render: function render(row) {
	          return tr.translate('installment.commission-close.payment.status_' + row.status);
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
	      receiptList: [],
	      receiptFields: [{ name: 'chk', raw: true, label: null, width: 24, render: function (row, i) {
	          return React.createElement('input', { type: 'checkbox',
	            checked: row.chk && row.commission_close_id == 0,
	            disabled: row.commission_close_id > 0,
	            onChange: function () {
	              this.toggleCheckBox(i);
	            }.bind(this) });
	        }.bind(this) }, { name: 'no', label: 'installment.commission-close.receipt.no', width: 28, render: function render(row, i) {
	          return i + 1;
	        } }, { name: 'contract_code', label: 'installment.commission-close.receipt.contract_code', width: 150, render: function render(row) {
	          return row.contract_code;
	        } }, { name: 'close_date', label: 'installment.commission-close.receipt.close_date', width: 100, render: function render(row) {
	          return tr.localize(new Date(row.close_date), { type: 'date', format: 'short' });
	        } }, { name: 'sell_date', label: 'installment.commission-close.receipt.sell_date', width: 80, render: function render(row) {
	          return tr.localize(new Date(row.sell_date), { type: 'date', format: 'short' });
	        } }, { name: 'code', label: 'installment.commission-close.receipt.code', width: 150, render: function render(row) {
	          return row.code;
	        } }, { name: 'cus_name', label: 'installment.commission-close.receipt.cus_name', width: 120, render: function render(row) {
	          return row.cus_name;
	        } }, { name: 'pay_date', label: 'installment.commission-close.receipt.pay_date', width: 100, render: function render(row) {
	          return tr.localize(new Date(row.pay_date), { type: 'date', format: 'short' });
	        } }, { name: 'cost_term', label: 'installment.commission-close.receipt.cost', width: 100, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.cost_term, 2);
	        } }, { name: 'amount', label: 'installment.commission-close.receipt.amount', width: 100, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.amount, 2);
	        } }, { name: 'profit', label: 'installment.commission-close.receipt.profit', width: 100, className: 'right', render: function render(row) {
	          return helper.numberFormat(row.profit, 2);
	        } }, { name: 'display_name', label: 'installment.commission-close.receipt.finance_name', width: 120, render: function render(row) {
	          return row.display_name;
	        } }],
	      fields: {
	        profit_amount: {
	          id: 'profit_amount',
	          type: 'number',
	          label: 'installment.commission-close.profit_amount',
	          readonly: true,
	          render: function render(row) {
	            return helper.numberFormat(row.profit_amount, 2);
	          }
	        },
	        num_receipt: {
	          id: 'num_receipt',
	          type: 'numberinput',
	          label: 'installment.commission-close.total_contract',
	          readonly: true
	        },
	        paid_pct: {
	          id: 'paid_pct',
	          type: 'numberinput',
	          step: 0.05,
	          label: 'installment.commission-close.paid_pct'
	        },
	        paid_amount: {
	          id: 'paid_amount',
	          type: 'number',
	          label: 'installment.commission-close.paid_amount',
	          readonly: true,
	          render: function render(row) {
	            return helper.numberFormat(row.paid_amount, 2);
	          }
	        },
	        closeca_amount: {
	          id: 'closeca_amount',
	          type: 'number',
	          label: 'installment.commission-close.closeca',
	          readonly: true,
	          render: function render(row) {
	            return helper.numberFormat(row.closeca_amount, 2);
	          }
	        },
	        term_year: {
	          id: 'paid_year',
	          type: 'text',
	          label: 'installment.commission-close.term_year',
	          pattern: '^\\d{4}$'
	        },
	        term_month: {
	          id: 'paid_month',
	          type: 'text',
	          label: 'installment.commission-close.term_month',
	          pattern: '^\\d{1,2}$'
	        },
	        remark: {
	          id: 'remark',
	          label: 'installment.commission-close.remark'
	        }
	      },
	      shopField: {
	        id: 'shop_id',
	        label: 'installment.commission-close.filter_shop',
	        list: []
	      },
	      staffField: {
	        id: 'staff_id',
	        label: 'installment.commission-close.filter_staff',
	        list: []
	      }
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this.doRefreshFacet();
	    this.doRefresh();
	    infoPanelActions.show('installment.commission-close.list', null);
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    infoPanelActions.hide();
	  },

	  checkAll: function checkAll() {
	    this.state.chkAll = !this.state.chkAll;
	    this.state.receiptList.forEach(function (receipt) {
	      if (receipt.commission_close_id == 0) {
	        receipt.chk = this.state.chkAll;
	      }
	    }.bind(this));
	    this.calculatePayment();
	  },

	  toggleCheckBox: function toggleCheckBox(i) {
	    this.state.receiptList[i].chk = !this.state.receiptList[i].chk;
	    this.state.chkAll = true;
	    for (var j = 0; j < this.state.receiptList.length; j++) {
	      if (!this.state.receiptList[j].chk && this.state.receiptList[j].comm_open_payment_id == 0) {
	        this.state.chkAll = false;
	        break;
	      }
	    }
	    this.calculatePayment();
	    // this.setState({
	    //   chkAll: this.state.chkAll,
	    //   receiptList: this.state.receiptList
	    // });
	  },

	  doRefreshFacet: function doRefreshFacet() {
	    actions.facetDetail({
	      term_year: this.state.term_year,
	      term_month: this.state.term_month,
	      shop_id: this.state.shop_id,
	      staff_id: this.state.staff_id
	    });
	  },

	  doRefresh: function doRefresh() {

	    console.log('month:', this.state.term_month);
	    actions.commissionDetail({
	      staff_id: this.state.staff_id,
	      term_year: this.state.term_year,
	      term_month: this.state.term_month,
	      shop_id: this.state.shop_id
	    });
	  },

	  onFacetDetailDoneAction: function onFacetDetailDoneAction(result) {
	    console.log('jack=', result);
	    this.shopList = {};
	    this.state.shopField.list = result.shops.map(function (shop) {
	      this.shopList[shop.id] = shop;
	      //if (shop.id==this.state.shop_id) {
	      this.state.staffField.list = shop.staffs.map(function (staff) {
	        return {
	          value: staff.id,
	          text: staff.name
	        };
	      });
	      //}
	      return { value: shop.id, text: shop.code + ' ' + shop.name };
	    }.bind(this));
	    var found = false;
	    this.state.staffField.list.forEach(function (row) {
	      if (row.value == this.state.staff_id) {
	        found = true;
	      }
	    }.bind(this));
	    // if (!found) {
	    //   this.state.staff_id = this.state.staffField.list[0].value;
	    // }
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
	    var num_receipt = 0;
	    this.state.receiptList.forEach(function (row) {
	      if (row.chk) {
	        profit_amount += row.profit;
	        num_receipt++;
	      }
	    });
	    var paid_amount = parseFloat((profit_amount * this.state.paid_pct / 100.0).toFixed(2) - this.state.closeca_amount);
	    this.setState({
	      receiptList: this.state.receiptList,
	      num_receipt: num_receipt,
	      profit_amount: profit_amount,
	      paid_amount: paid_amount
	    });
	  },

	  onCommissionDetailDoneAction: function onCommissionDetailDoneAction(result) {
	    console.log(result);
	    result.receipts.forEach(function (row) {
	      if (row.commission_close_id == 0) {
	        row.chk = true;
	      } else {
	        row.chk = false;
	      }
	    });
	    this.setState({
	      receiptList: result.receipts,
	      commissionPayment: result.commissions,
	      closeca_amount: result.closeca_amount
	    }, function () {
	      this.calculatePayment();
	    }.bind(this));
	  },

	  onCommissionDetailErrorAction: function onCommissionDetailErrorAction(e) {
	    console.log(e);
	    toasterActions.pop({
	      type: 'warning',
	      message: e
	    });
	  },

	  doCommissionSave: function doCommissionSave() {
	    var list = [];
	    this.state.receiptList.forEach(function (receipt) {
	      if (receipt.chk) {
	        list.push(receipt.id);
	      }
	    });
	    var param = {
	      staff_id: this.state.staff_id,
	      summary_period: this.state.term_year.substr(-2) + '/' + this.state.term_month,
	      paid_period: this.state.paid_year.substr(-2) + '/' + this.state.paid_month,
	      num_receipt: this.state.num_receipt,
	      profit_amount: this.state.profit_amount,
	      paid_pct: this.state.paid_pct,
	      paid_amount: this.state.paid_amount,
	      authorized_date: helper.dateToString(new Date()),
	      remark: this.state.remark,
	      receipts: list
	    };
	    //console.log('staffID =',param);
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
	      content: React.createElement(T, { content: 'installment.commission-close.confirm_to_void', component: 'div' }),
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
	      content: React.createElement(T, { content: 'installment.commission-close.confirm_to_paid', component: 'div' }),
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
	    this.state.receiptFields[0].label = React.createElement('input', { type: 'checkbox', checked: this.state.chkAll, onChange: this.checkAll });
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'content-header boxf flex flex-form' },
	        React.createElement(
	          'div',
	          { className: 'panelf can-grow' },
	          React.createElement(T, { content: 'installment.commission-close.title.detail', component: 'h2' })
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
	              field: this.state.fields.num_receipt,
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
	            { style: { paddingBottom: '4px' } },
	            React.createElement(FlexTextInput, {
	              field: this.state.fields.closeca_amount,
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
	          fields: this.state.receiptFields,
	          data: this.state.receiptList,
	          displayRows: 6
	        })
	      )
	    );
	  }
	});

	module.exports = CommissionDetail;

/***/ }

});