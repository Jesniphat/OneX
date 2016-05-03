webpackJsonp([42,135],{

/***/ 703:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'getPV': { children: ['done', 'error'] },
	  'queryForWaitList': { children: ['done', 'error'] },
	  'queryForSupplier': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] },
	  'save': { children: ['done', 'error'] },
	  'print': { children: ['done', 'error'] }
	});

/***/ },

/***/ 708:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(381);

	var system = __webpack_require__(354);
	var widget = __webpack_require__(377);
	var sessionStore = system.sessionStore;
	var toasterActions = system.toasterActions;
	var infoPanelActions = system.infoPanelActions;
	var dialogActions = system.dialogActions;
	var helper = system.helper;
	var systemStore = system.systemStore;

	var actions = __webpack_require__(703);

	var FlexDropdown = widget.FlexDropdown;
	var FlexTextInput = widget.FlexTextInput;
	var FlexButton = widget.FlexButton;
	var FlexDataTable = widget.FlexDataTable;
	var FlexCheckbox = widget.FlexCheckbox;

	var Screen = React.createClass({
	  displayName: 'Screen',

	  mixins: [Reflux.listenTo(actions.getPV.done, 'onGetPVDoneActon'), Reflux.listenTo(actions.getPV.error, 'onGetPVErrorActon'), Reflux.listenTo(actions.queryForWaitList.done, 'onQueryForWaitListDoneAction'), Reflux.listenTo(actions.queryForWaitList.error, 'onQueryForWaitListErrorAction'), Reflux.listenTo(actions.save.done, 'onSaveDoneAction'), Reflux.listenTo(actions.save.error, 'onSaveErrorAction'), Reflux.listenTo(actions.print.done, 'onPrintDoneAction'), Reflux.listenTo(actions.print.error, 'onPrintErrorAction')],

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    var id = parseInt(this.context.router.getCurrentParams().id);
	    if (isNaN(id)) {
	      id = 0;
	    }
	    var me = this;
	    var staff = sessionStore.getSession().staff;
	    var shops = systemStore.getMaster().shops;
	    var shopList = shops.map(function (shop) {
	      return { value: shop.code, text: shop.name };
	    });
	    shopList.unshift({ value: '', text: '' });

	    this.searchFields = {
	      invoice_code: {
	        id: 'invoice_code',
	        type: 'text',
	        label: 'finance.pv.invoice_code'
	      },
	      po_code: {
	        id: 'po_code',
	        type: 'text',
	        label: 'finance.pv.po_code'
	      },
	      invoice_date: {
	        id: 'invoice_date',
	        type: 'text',
	        label: 'finance.pv.invoice_date'
	      },
	      supplier: {
	        id: 'supplier',
	        type: 'text',
	        label: 'finance.pv.supplier'
	      },
	      product: {
	        id: 'product',
	        type: 'text',
	        label: 'finance.pv.product'
	      },
	      shop_code: {
	        id: 'shop_code',
	        type: 'dropdown',
	        list: shopList,
	        label: 'finance.pv.shop'
	      }
	    };
	    this.searchTable = [{ name: 'code', label: 'finance.pv.search_table.code', width: '112px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            null,
	            'P:',
	            React.createElement(
	              'span',
	              { className: 'green' },
	              row.po_code
	            )
	          ),
	          React.createElement(
	            'div',
	            null,
	            'I:',
	            React.createElement(
	              'span',
	              { className: 'blue' },
	              row.invoice_code
	            )
	          )
	        );
	      } }, { name: 'product', label: 'finance.pv.search_table.product', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            { className: 'ellipsis', title: row.product },
	            row.product
	          ),
	          React.createElement(
	            'div',
	            { className: 'flex' },
	            React.createElement(
	              'div',
	              { className: 'ellipsis' },
	              'S:',
	              React.createElement(
	                'span',
	                { className: 'green', title: row.serial },
	                row.serial
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'can-grow no-shrink right' },
	              'B:',
	              React.createElement(
	                'span',
	                { className: 'blue' },
	                row.barcode
	              )
	            )
	          )
	        );
	      } }, { name: 'cost', label: 'finance.pv.search_table.cost', width: '88px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            { className: 'right green' },
	            row.qty || 1,
	            ' x'
	          ),
	          React.createElement(
	            'div',
	            { className: 'right blue' },
	            helper.numberFormat(row.cost, 2)
	          )
	        );
	      } }, { name: 'chk', label: React.createElement('span', {
	        className: 'flaticon-right244',
	        title: tr.translate('finance.pv.search_table.select_all'),
	        onClick: function onClick() {
	          me.addAllToVouher();
	        }
	      }), raw: true, width: '32px', render: function render(row, i) {
	        if (row.status == 'W' || me.state.prevItems[row.stockin_id]) {
	          return React.createElement('span', { className: 'flaticon-right237', onClick: function onClick() {
	              me.addToVoucher(row, i);
	            } });
	        } else {
	          return null;
	        }
	      } }];

	    this.voucherFields = {
	      code: {
	        id: 'code',
	        type: 'text',
	        label: 'finance.pv.voucher.code',
	        readonly: true
	      },
	      document_date: {
	        id: 'document_date',
	        type: 'date',
	        label: 'finance.pv.voucher.document_date'
	      },
	      supplier: {
	        id: 'supplier',
	        type: 'text',
	        label: 'finance.pv.voucher.supplier',
	        readonly: true
	      },
	      staff: {
	        id: 'staff',
	        type: 'text',
	        label: 'finance.pv.voucher.staff',
	        readonly: true
	      },
	      remark: {
	        id: 'remark',
	        type: 'text',
	        label: 'finance.pv.voucher.remark'
	      },
	      total_amount: {
	        id: 'total_amount',
	        type: 'number',
	        label: 'finance.pv.voucher.total_amount'
	      },
	      // vat_amount: {
	      //   id:'vat_amount',
	      //   type:'number',
	      //   label:'finance.pv.voucher.vat_amount'
	      // },
	      cn_code: {
	        id: 'cn_code',
	        type: 'text',
	        label: 'finance.pv.voucher.cn_code'
	      },
	      cn_amount: {
	        id: 'cn_amount',
	        type: 'number',
	        label: 'finance.pv.voucher.cn_amount'
	      },
	      net_amount: {
	        id: 'net_amount',
	        type: 'number',
	        label: 'finance.pv.voucher.net_amount',
	        readonly: true,
	        render: function render(row) {
	          return helper.numberFormat(row.net_amount, 2);
	        }
	      },
	      status: {
	        id: 'status',
	        list: [{ value: 'DRAFT', text: tr.translate('finance.pv.voucher.status_DRAFT') }, { value: 'PROPOSE', text: tr.translate('finance.pv.voucher.status_PROPOSE') }]
	      }
	    };

	    this.voucherTable = [{ name: 'code', label: 'finance.pv.voucher_table.code', width: '160px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            null,
	            'P:',
	            React.createElement(
	              'span',
	              { className: 'green' },
	              row.po_code
	            )
	          ),
	          React.createElement(
	            'div',
	            null,
	            'I:',
	            React.createElement(
	              'span',
	              { className: 'blue' },
	              row.invoice_code
	            )
	          )
	        );
	      } }, { name: 'product', label: 'finance.pv.voucher_table.product', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline', style: { height: '40px', whiteSpace: 'normal' } },
	          row.product
	        );
	      } }, { name: 'serial', label: 'finance.pv.voucher_table.serial_barcode', width: '160px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            { className: 'green' },
	            'S:',
	            row.serial
	          ),
	          React.createElement(
	            'div',
	            { className: 'blue' },
	            'B:',
	            row.barcode
	          )
	        );
	      } }, { name: 'cost', label: 'finance.pv.voucher_table.cost', width: '104px', render: function render(row) {
	        return React.createElement(
	          'div',
	          { className: 'multiline' },
	          React.createElement(
	            'div',
	            { className: 'right' },
	            row.qty || 1,
	            ' x'
	          ),
	          React.createElement(
	            'div',
	            { className: 'right blue' },
	            helper.numberFormat(row.cost, 2)
	          )
	        );
	      } },
	    // {name:'vat_amount',label:'finance.pv.voucher_table.vat',width:'72px',render:function(row) {
	    //   return (
	    //     <div className="multiline">
	    //       <div className="right">{helper.numberFormat(row.vat_rate,2)+'%'}</div>
	    //       <div className="right blue">{helper.numberFormat(row.vat_amount,2)}</div>
	    //     </div>
	    //   );
	    // }},
	    { name: 'chk', label: React.createElement('span', {
	        className: 'flaticon-clear5',
	        title: tr.translate('finance.pv.voucher_table.remove_all'),
	        onClick: function onClick() {
	          me.removeAllFromVoucher();
	        }
	      }), raw: true, width: '32px', render: function render(row, i) {
	        return React.createElement('span', { className: 'flaticon-clear5', onClick: function onClick() {
	            me.removeFromVoucher(row, i);
	          } });
	      } }];

	    return {
	      filter: {
	        po_code: '',
	        invoice_code: '',
	        invoice_date: '',
	        supplier: '',
	        product: '',
	        shop_code: ''
	      },
	      pv: {
	        id: id,
	        code: '',
	        document_date: helper.dateToString(new Date()),
	        supplier_id: 0,
	        supplier: '',
	        staff_id: staff.id,
	        staff: staff.display_name,
	        remark: '',
	        status: 'DRAFT',
	        total_amount: 0,
	        vat_amount: 0,
	        cn_code: '',
	        cn_amount: 0,
	        net_amount: 0
	      },
	      searchItems: [],
	      pvItems: [],
	      prevItems: {},
	      prev_status: 'DRAFT'
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    infoPanelActions.show('finance.pv.list', null);
	    console.log(this.state.filter.shop_code);
	    if (this.state.pv.id) {
	      actions.getPV(this.state.pv.id);
	    }
	  },

	  onGetPVDoneActon: function onGetPVDoneActon(result) {
	    var prevItems = {};
	    console.log('results:', result);
	    result.pv_items.forEach(function (item) {
	      prevItems[item.stockin_id] = true;
	    });

	    console.log('Status2 : ', result.pv.status);
	    this.setState({
	      pv: result.pv,
	      pvItems: result.pv_items,
	      prevItems: prevItems,
	      prev_status: result.pv.status
	    });
	  },

	  onGetPVErrorActon: function onGetPVErrorActon(error) {
	    this.state.pv.id = 0;
	    this.setState({
	      pv: this.state.pv
	    }, function () {
	      toasterActions.pop({
	        type: 'warning',
	        message: 'ไม่พบใบสำคัญจ่าย'
	      });
	    });
	  },

	  onQueryDoneAction: function onQueryDoneAction(result) {
	    this.setState({
	      data: result.data
	    });
	  },

	  onFacetDoneAction: function onFacetDoneAction(result) {
	    this.setState({
	      shopList: result.shops
	    });
	  },

	  handleEnter: function handleEnter(id, value) {
	    this.state.filter[id] = value;
	    this.setState({
	      filter: this.state.filter
	    });
	    console.log(id, value);
	    console.log(this.state.filter);
	    var cond = {};
	    var hasCond = false;
	    if (this.state.filter.po_code) {
	      cond.po_code = this.state.filter.po_code;
	      hasCond = true;
	    }
	    if (this.state.filter.invoice_code) {
	      cond.invoice_code = this.state.filter.invoice_code;
	      hasCond = true;
	    }
	    if (this.state.filter.invoice_date) {
	      cond.invoice_date = this.state.filter.invoice_date;
	      hasCond = true;
	    }
	    if (this.state.filter.supplier) {
	      cond.supplier = this.state.filter.supplier;
	      hasCond = true;
	    }
	    if (this.state.filter.product) {
	      cond.product = this.state.filter.product;
	      hasCond = true;
	    }
	    if (this.state.filter.shop_code) {
	      cond.shop_code = this.state.filter.shop_code;
	      hasCond = true;
	    }
	    if (!hasCond) {
	      toasterActions.pop({
	        type: 'warning',
	        message: 'ยังไม่กำหนดเงื่อนไข'
	      });
	      return;
	    }

	    this.setState({
	      searchItems: []
	    }, function () {
	      actions.queryForWaitList(cond);
	    });
	  },

	  handleFilterChange: function handleFilterChange(id, value) {

	    this.state.filter[id] = value;
	    this.setState({
	      filter: this.state.filter
	    }, function () {
	      if (id == 'shop_code') {
	        this.handleEnter();
	      }
	    }.bind(this));
	  },

	  handleVoucherChange: function handleVoucherChange(id, value) {
	    if (id == 'cn_amount') {
	      value = helper.toNumber(value, 0);
	    }
	    this.state.pv[id] = value;
	    this.setState({
	      pv: this.state.pv
	    });
	  },

	  doQueryWaitingList: function doQueryWaitingList() {
	    if (this.state.filter.invoice_date) {
	      actions.queyrForSupplier({
	        date: this.state.filter.invoice_date
	      });
	      return;
	    }
	    actions.queryForWaitList({
	      po_code: this.state.filter.po_code,
	      invoice_code: this.state.filter.invoice_code,
	      invoice_date: this.state.filter.invoice_date,
	      supplier: this.state.filter.supplier,
	      product: this.state.filter.product
	    });
	  },

	  onQueryForWaitListDoneAction: function onQueryForWaitListDoneAction(result) {

	    console.log('queryForWaitList:', result);

	    if (result.length == 0) {
	      toasterActions.pop({
	        type: 'warning',
	        message: 'ไม่พบรายการตามที่ระบุ'
	      });
	    }
	    var existing = {};
	    this.state.pvItems.forEach(function (item) {
	      existing[item.stockin_id] = true;
	    });
	    this.setState({
	      searchItems: result.filter(function (row) {
	        return !existing[row.stockin_id];
	      })
	    });

	    this.state.pv.supplier_id = result[0].supplier_id;
	    this.state.pv.supplier_code = result[0].supplier_code;
	    this.setState({
	      pv: this.state.pv
	    });

	    console.log('Code:', this.state.pv.supplier_code, ',id:', this.state.pv.supplier_id);
	  },

	  onQueryForWaitListErrorAction: function onQueryForWaitListErrorAction(error) {
	    toasterActions.pop({
	      type: 'warning',
	      message: error
	    });
	  },

	  addToVoucher: function addToVoucher(row, i) {
	    this.state.pvItems.unshift(this.state.searchItems[i]);
	    this.state.searchItems.splice(i, 1);
	    this.setState({
	      pvItems: this.state.pvItems,
	      searchItems: this.state.searchItems
	    });
	  },

	  addAllToVouher: function addAllToVouher() {
	    var cnt = 0;
	    this.state.searchItems.forEach(function (row) {
	      if (row.status == 'W') {
	        this.state.pvItems.unshift(row);
	        cnt++;
	      }
	    }.bind(this));
	    var len = this.state.searchItems.length;
	    for (var i = len - 1; i >= 0; i--) {
	      if (this.state.searchItems[i].status == 'W') {
	        this.state.searchItems.splice(i, 1);
	      }
	    }
	    if (cnt == 0) {
	      toasterActions.pop({
	        type: 'warning',
	        message: 'ไม่มีรายการที่จะเพิ่ม'
	      });
	    } else {
	      this.setState({
	        pvItems: this.state.pvItems,
	        searchItems: this.state.searchItems
	      });
	    }
	  },

	  removeFromVoucher: function removeFromVoucher(row, i) {
	    var item = this.state.pvItems.splice(i, 1);
	    var hasChange = this.addBackToSearchList(item);
	    var obj = {
	      pvItems: this.state.pvItems
	    };
	    if (hasChange) {
	      obj.searchItems = this.state.searchItems;
	    }
	    this.setState(obj);
	  },

	  removeAllFromVoucher: function removeAllFromVoucher() {
	    var hasChange = this.addBackToSearchList(this.state.pvItems);
	    var obj = {
	      pvItems: []
	    };
	    if (hasChange) {
	      obj.searchItems = this.state.searchItems;
	    }
	    this.setState(obj);
	  },

	  addBackToSearchList: function addBackToSearchList(items) {
	    var filterPO = this.state.filter.po_code.replace('%', '');
	    var filterINV = this.state.filter.invoice_code.replace('%', '');
	    var filterSupplier = this.state.filter.supplier.replace('%', '');
	    if (filterPO == "" && filterINV == "" && filterSupplier == "") {
	      items.forEach(function (item) {
	        this.state.searchItems.push(item);
	      }.bind(this));
	      return true;
	    }
	    var hasChange = false;
	    items.forEach(function (item) {
	      if (filterPO != '' && (item.po_code == filterPO || item.po_code.indexOf(filterPO) != -1)) {
	        this.state.searchItems.unshift(item);
	        hasChange = true;
	        return;
	      }
	      if (filterINV != '' && (item.invoice_code == filterINV || item.invoice.indexOf(filterINV) != -1)) {
	        this.state.searchItems.unshift(item);
	        hasChange = true;
	        return;
	      }
	      if (filterSupplier != '' && (item.supplier_code == filterSupplier || item.supplier_code.indexOf(filterSupplier) != -1)) {
	        this.state.searchItems.unshift(item);
	        hasChange = true;
	        return;
	      }
	    }.bind(this));
	    return hasChange;
	  },

	  canSave: function canSave() {
	    if (this.state.pv.id) {
	      console.log('StatusCanSave = ', this.state.prev_status);
	      if (this.state.prev_status == 'DRAFT') {
	        return false;
	      }
	      return true;
	    }
	  },

	  canPrint: function canPrint() {
	    if (this.state.pv.id) {
	      return true;
	    }
	    return false;
	  },

	  doSave: function doSave() {
	    // check required
	    if (this.state.pvItems.length == 0) {
	      toasterActions.pop({ type: 'warning', message: 'ยังไม่มีรายการ' });
	      return;
	    }
	    var cn_amount = helper.toNumber(this.state.pv.cn_amount);
	    if (!isNaN(cn_amount) && cn_amount > 0 && this.state.pv.cn_code.trim() == '') {
	      toasterActions.pop({ type: 'warning', message: 'กรุณาระบุ CREDIT NOTE' });
	      this.refs.cn_code.setFocus();
	      return;
	    }
	    if (this.state.pv.cn_code.trim() != '' && (isNaN(cn_amount) || cn_amount == 0)) {
	      toasterActions.pop({ type: 'warning', message: 'กรุณาระบุยอด CREDIT NOTE' });
	      this.refs.cn_amount.setFocus();
	      return;
	    }
	    var net_amount = helper.toNumber(this.state.pv.net_amount);
	    if (isNaN(net_amount) || net_amount < 0) {
	      toasterActions.pop({ type: 'warning', message: 'ยอดเงินติดลบไม่ได้' });
	      this.refs.net_amount.setFocus();
	      return;
	    }

	    if (this.state.pv.staus != 'DRAFT' && this.state.prev_status != this.state.pv.status) {
	      if (this.state.pv.status == 'PROPOSE') {
	        msg = 'ยืนยันการเสนออนุมัติ';
	      }
	      dialogActions.show({
	        title: 'ยืนยัน',
	        content: msg,
	        actions: [{ id: 'save', icon: 'check52', label: 'action.confirm' }, { id: 'cancel', icon: 'close47', label: 'action.cancel', default: true }]
	      }, function (isCancel, id) {
	        if (isCancel || id == 'cancel') {
	          return;
	        }
	        actions.save({
	          pv: this.state.pv,
	          pv_items: this.state.pvItems
	        });
	      }.bind(this));
	    } else {
	      actions.save({
	        pv: this.state.pv,
	        pv_items: this.state.pvItems
	      });
	    }
	  },

	  onSaveDoneAction: function onSaveDoneAction(res) {
	    console.log('res=', res);
	    this.state.pv.code = res.code;
	    this.state.pv.id = res.id;
	    this.state.prevItems = {};
	    this.state.pvItems.forEach(function (item) {
	      this.state.prevItems[item.stockin_id] = true;
	    }.bind(this));
	    this.setState({
	      pv: this.state.pv,
	      prevItems: this.state.prevItems,
	      prev_status: this.state.pv.status
	    }, function () {
	      this.canSave();
	      toasterActions.pop({
	        type: 'success',
	        message: 'result.save.ok'
	      });
	    });
	  },

	  onSaveErrorAction: function onSaveErrorAction(err) {
	    toasterActions.pop({
	      type: 'warning',
	      message: err
	    });
	  },

	  doPrint: function doPrint() {
	    actions.print({ pv_id: this.state.pv.id });
	    console.log('doPrint', this.state.pv.id);
	  },

	  onPrintDoneAction: function onPrintDoneAction(result) {
	    var prefix_url = window.location.protocol + '//' + window.location.host + '/output/';
	    console.log(prefix_url);
	    window.open(prefix_url + result.url, '_blank');
	    // systemActions.print({
	    //   url:prefix_url + result.url
	    // });
	  },

	  onPrintErrorAction: function onPrintErrorAction(error) {
	    toasterActions.pop({
	      type: 'warning',
	      message: error
	    });
	  },

	  render: function render() {
	    var searchSummary = {
	      count: 0,
	      qty: 0,
	      amount: 0
	    };
	    searchSummary = this.state.searchItems.reduce(function (prev, row) {
	      return {
	        count: prev.count + 1,
	        qty: prev.qty + row.qty,
	        amount: prev.amount + row.qty * row.cost
	      };
	    }, searchSummary);
	    var searchFooter = React.createElement(
	      'tr',
	      null,
	      React.createElement(
	        'td',
	        { colSpan: '2', className: 'right' },
	        searchSummary.count,
	        ' รายการ'
	      ),
	      React.createElement(
	        'td',
	        { className: 'right' },
	        searchSummary.qty,
	        ' ชิ้น'
	      ),
	      React.createElement(
	        'td',
	        { className: 'right' },
	        helper.numberFormat(searchSummary.amount, 2)
	      ),
	      React.createElement('td', null)
	    );

	    var voucherSummary = {
	      count: 0,
	      qty: 0,
	      amount: 0,
	      vat_amount: 0
	    };

	    voucherSummary = this.state.pvItems.reduce(function (prev, row) {
	      return {
	        count: prev.count + 1,
	        qty: prev.qty + row.qty,
	        amount: prev.amount + row.qty * row.cost,
	        vat_amount: prev.vat_amount + row.vat_amount
	      };
	    }, voucherSummary);

	    this.state.pv.total_amount = voucherSummary.amount;
	    this.state.pv.vat_amount = voucherSummary.vat_amount;
	    this.state.pv.net_amount = this.state.pv.total_amount + this.state.pv.vat_amount - this.state.pv.cn_amount;

	    var voucherFooter = React.createElement(
	      'tr',
	      null,
	      React.createElement(
	        'td',
	        null,
	        'รวมรายการ'
	      ),
	      React.createElement(
	        'td',
	        { className: 'right' },
	        voucherSummary.count,
	        ' รายการ'
	      ),
	      React.createElement(
	        'td',
	        { className: 'right' },
	        voucherSummary.qty,
	        ' ชิ้น'
	      ),
	      React.createElement(
	        'td',
	        { className: 'right blue', style: { fontSize: '16px' } },
	        helper.numberFormat(voucherSummary.amount, 2)
	      ),
	      React.createElement('td', null)
	    );
	    //        <td className="right green">{helper.numberFormat(voucherSummary.vat_amount,2)}</td>
	    return React.createElement(
	      'div',
	      { className: 'flex-form' },
	      React.createElement('div', { className: 'flex-form flex' }),
	      React.createElement(
	        'div',
	        { className: 'box12 flex' },
	        React.createElement(
	          'div',
	          { className: 'box5' },
	          React.createElement(
	            'div',
	            { className: 'panel5 flex' },
	            React.createElement(FlexTextInput, {
	              field: this.searchFields.po_code,
	              data: this.state.filter,
	              onChange: this.handleFilterChange,
	              onEnter: this.handleEnter
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexTextInput, {
	              field: this.searchFields.supplier,
	              data: this.state.filter,
	              onChange: this.handleFilterChange,
	              onEnter: this.handleEnter
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel5 flex' },
	            React.createElement(FlexTextInput, {
	              field: this.searchFields.invoice_code,
	              data: this.state.filter,
	              onChange: this.handleFilterChange,
	              onEnter: this.handleEnter
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexTextInput, {
	              field: this.searchFields.invoice_date,
	              data: this.state.filter,
	              onChange: this.handleFilterChange,
	              onEnter: this.handleEnter
	            })
	          ),
	          React.createElement(
	            'div',
	            { className: 'panel5 flex' },
	            React.createElement(FlexTextInput, {
	              field: this.searchFields.product,
	              data: this.state.filter,
	              onChange: this.handleFilterChange,
	              onEnter: this.handleEnter
	            }),
	            React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	            React.createElement(FlexDropdown, {
	              field: this.searchFields.shop_code,
	              data: this.state.filter,
	              onChange: this.handleFilterChange
	            })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'box7 flex' },
	          React.createElement(
	            'div',
	            { className: 'box5' },
	            React.createElement(
	              'div',
	              { className: 'panel5 flex' },
	              React.createElement(FlexTextInput, {
	                field: this.voucherFields.code,
	                data: this.state.pv,
	                onChange: this.handleVoucherChange
	              }),
	              React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	              React.createElement(FlexTextInput, {
	                field: this.voucherFields.document_date,
	                data: this.state.pv,
	                onChange: this.handleVoucherChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel5 flex' },
	              React.createElement(FlexTextInput, {
	                field: this.voucherFields.supplier,
	                data: this.state.pv,
	                onChange: this.handleVoucherChange
	              }),
	              React.createElement('div', { style: { width: '8px' }, className: 'no-shrink' }),
	              React.createElement(FlexTextInput, {
	                field: this.voucherFields.staff,
	                data: this.state.pv,
	                onChange: this.handleVoucherChange
	              })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel5 flex' },
	              React.createElement(FlexTextInput, {
	                field: this.voucherFields.remark,
	                data: this.state.pv,
	                onChange: this.handleVoucherChange
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'box2' },
	            React.createElement(
	              'div',
	              { className: 'panel2' },
	              this.state.pv.status == 'DRAFT' || this.state.pv.status == 'PROPOSE' ? React.createElement(FlexDropdown, {
	                field: this.voucherFields.status,
	                data: this.state.pv,
	                onChange: this.handleVoucherChange
	              }) : React.createElement(T, {
	                content: 'finance.pv.voucher.status_' + this.state.pv.status,
	                component: 'div',
	                className: 'title center ' + (this.state.pv.status == 'REJECT' || this.state.pv.status == 'VOID' ? 'red' : 'blue') })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel2' },
	              React.createElement(FlexButton, { icon: 'email107', label: 'action.save', 'default': true,
	                onClick: this.doSave,
	                disabled: this.canSave() })
	            ),
	            React.createElement(
	              'div',
	              { className: 'panel2' },
	              React.createElement(FlexButton, { icon: 'printer88', label: 'action.print',
	                onClick: this.doPrint,
	                disabled: !this.canPrint() })
	            )
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'box12 flex' },
	        React.createElement(
	          'div',
	          { className: 'panel5', style: { borderRight: '1px solid #eee', paddingRight: '7px' } },
	          React.createElement(FlexDataTable, {
	            fields: this.searchTable,
	            data: this.state.searchItems,
	            key: 'stockin_id',
	            displayRows: 8,
	            footer: searchFooter
	          })
	        ),
	        React.createElement(
	          'div',
	          { className: 'panel7', style: { borderLeft: '1px solid #eee', paddingLeft: '7px' } },
	          React.createElement(FlexDataTable, {
	            fields: this.voucherTable,
	            data: this.state.pvItems,
	            key: 'stockin_id',
	            displayRows: 8,
	            footer: voucherFooter
	          }),
	          React.createElement(
	            'div',
	            { className: 'flex', style: { paddingTop: '4px' } },
	            React.createElement('div', { className: 'can-grow' }),
	            React.createElement(
	              'div',
	              { className: 'no-shrink', style: { width: '228px' } },
	              React.createElement(FlexTextInput, {
	                ref: 'cn_code',
	                field: this.voucherFields.cn_code,
	                data: this.state.pv,
	                onChange: this.handleVoucherChange
	              })
	            ),
	            React.createElement('div', { className: 'no-shrink', style: { width: '8px' } }),
	            React.createElement(
	              'div',
	              { className: 'no-shrink', style: { width: '228px' } },
	              React.createElement(FlexTextInput, {
	                ref: 'cn_amount',
	                field: this.voucherFields.cn_amount,
	                data: this.state.pv,
	                onChange: this.handleVoucherChange
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'flex', style: { paddingTop: '4px' } },
	            React.createElement('div', { className: 'can-grow' }),
	            React.createElement(
	              'div',
	              { className: 'no-shrink', style: { width: '228px' } },
	              React.createElement(FlexTextInput, {
	                field: this.voucherFields.net_amount,
	                data: this.state.pv
	              })
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = Screen;

/***/ }

});