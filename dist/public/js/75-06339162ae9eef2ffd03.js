webpackJsonp([75,135],{

/***/ 822:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Route = Router.Route;
	var T = __webpack_require__(383);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(356);

	var systemActions = system.systemActions;

	var barcodeActions = __webpack_require__(823);
	var barcodeStore = __webpack_require__(824);

	var Generator = {};
	var Print = {};

	tr.registerTranslations('en', __webpack_require__(825));
	tr.registerTranslations('th', __webpack_require__(826));

	Generator.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('barcode.title.generator'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	Print.Index = React.createClass({
	  displayName: 'Index',

	  componentDidMount: function componentDidMount() {
	    systemActions.setPageHeader(tr.translate('barcode.title.print'));
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	// Generator.Routes = (
	//   <Route name="installment.barcode-gen" path="barcode-gen" handler={Generator.Index}>
	//     <Router.DefaultRoute name="installment.barcode-gen.generator" handler={require('./barcode-generator.jsx')}/>
	//   </Route>
	// );

	// Print.Routes = (
	//   <Route name="installment.barcode-print" path="barcode-print" handler={Print.Index}>
	//     <Router.DefaultRoute name="installment.barcode-print.print" handler={require('./barcode-print.jsx')}/>
	//   </Route>
	// );

	module.exports = { Print: Print, Generator: Generator };

/***/ },

/***/ 823:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'list': { children: ['done', 'error'] },
	  'export': { children: ['done', 'error'] },
	  'facet': { children: ['done', 'error'] },
	  'reprint': { children: ['done', 'error'] },
	  'generate': { children: ['done', 'error'] }
	});

/***/ },

/***/ 824:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);
	var $ = __webpack_require__(360);
	var system = __webpack_require__(356);

	var ajaxActions = system.ajaxActions;
	var menuActions = system.menuActions;
	var barcodeActions = __webpack_require__(823);

	var barcodeStore = Reflux.createStore({
	  listenables: [barcodeActions],

	  // barcodeActions.list
	  onList: function onList(param) {
	    console.log('onList');
	    ajaxActions.request('/api/installment/barcode/list', param, this.doneList);
	  },

	  doneList: function doneList(res) {
	    if (res.status === true) {
	      barcodeActions.list.done(res.data, res.opt);
	    } else {
	      barcodeActions.list.error(res.error);
	    }
	  },
	  // barcodeActions.list
	  onExport: function onExport(param) {
	    ajaxActions.request('/api/installment/barcode/export', param, this.doneExport);
	  },

	  doneExport: function doneExport(res) {
	    if (res.status === true) {
	      barcodeActions.export.done(res.file);
	    } else {
	      barcodeActions.export.error(res.error);
	    }
	  },

	  onFacet: function onFacet() {
	    ajaxActions.request('/api/installment/barcode/facet', {}, this.doneFacet);
	  },

	  doneFacet: function doneFacet(res) {
	    if (res.status === true) {
	      barcodeActions.facet.done(res);
	    } else {
	      barcodeActions.facet.error(res.error);
	    }
	  },

	  onGetBarcode: function onGetBarcode(param) {
	    ajaxActions.request('/api/installment/barcode/listBarcode', param, this.doneGetBarcode);
	  },

	  doneGetBarcode: function doneGetBarcode(res) {
	    if (res.status === true) {
	      barcodeActions.getBarcode.done(res.data);
	    } else {
	      barcodeActions.getBarcode.error(res.error);
	    }
	  },

	  onGenerate: function onGenerate(param) {
	    ajaxActions.request('/api/installment/barcode/generate', param, this.doneGenerate);
	  },

	  doneGenerate: function doneGenerate(res) {
	    if (res.status === true) {
	      $.ajax({
	        url: '//localhost:9001/barcode/ttp244',
	        contentType: 'application/json; charset=utf-8',
	        data: JSON.stringify(res.barcode),
	        type: 'POST',
	        dataType: 'json',
	        success: function success(result) {
	          barcodeActions.generate.done(result);
	        },
	        error: function error() {
	          barcodeActions.generate.done({ status: false });
	        }
	      });
	    } else {
	      barcodeActions.generate.done({ status: false });
	    }
	  },

	  onReprint: function onReprint(param) {
	    ajaxActions.request('/api/installment/barcode/reprint', param, this.doneReprint);
	  },

	  doneReprint: function doneReprint(res) {
	    if (res.status === true) {
	      $.ajax({
	        url: '//localhost:9001/barcode/ttp244',
	        contentType: 'application/json; charset=utf-8',
	        data: JSON.stringify(res.barcode),
	        type: 'POST',
	        dataType: 'json',
	        success: function success(result) {
	          console.log(result);
	          barcodeActions.reprint.done(result);
	        },
	        error: function error() {
	          barcodeActions.reprint.done({ status: false, message: 'กรุณา Restart Service และ เชื่อต่อเครื่องพิมพ์อีกครั้ง' });
	        }
	      });
	    } else {
	      barcodeActions.reprint.done({ status: false });
	    }
	  },
	  onGetById: function onGetById(id) {
	    ajaxActions.request('/api/barcode/getById', { id: id }, this.doneGetById);
	  },

	  doneGetById: function doneGetById(res) {
	    if (res.status === true) {
	      barcodeActions.getById.done({
	        barcode: res.barcode,
	        paymentTerm: res.paymentTerm,
	        refContract: res.refContract
	      });
	    } else {
	      barcodeActions.getById.error(res.msg);
	    }
	  },

	  onSaveNew: function onSaveNew(data) {
	    ajaxActions.request('/api/barcode/saveNew', data, this.doneSaveNew);
	  },

	  doneSaveNew: function doneSaveNew(res) {
	    if (res.status === true) {
	      barcodeActions.saveNew.done(res.data);
	      //      menuActions.updateCount('barcode', res.totalRows);
	    } else {
	        barcodeActions.saveNew.error(res.error);
	      }
	  },

	  onDelete: function onDelete(id) {
	    ajaxActions.request('/api/barcode/delete', { id: id }, this.doneDelete);
	  },

	  doneDelete: function doneDelete(res) {
	    if (res.status === true) {
	      barcodeActions.delete.done(res.data);
	    } else {
	      barcodeActions.delete.error(res.msg);
	    }
	  },

	  onGetSellInfo: function onGetSellInfo(id) {
	    ajaxActions.request('/api/barcode/sellInfo', { id: id }, this.doneGetSellInfo);
	  },

	  doneGetSellInfo: function doneGetSellInfo(res) {
	    if (res.status === true) {
	      barcodeActions.getSellInfo.done(res.data);
	    } else {
	      barcodeActions.getSellInfo.error(res.error);
	    }
	  },

	  onSave: function onSave(data) {
	    ajaxActions.request('/api/barcode/save', data, this.doneSave);
	  },
	  doneSave: function doneSave(res) {
	    if (res.status === true) {
	      barcodeActions.save.done(res.data);
	    } else {
	      barcodeActions.save.error(res.error);
	    }
	  }
	});

	module.exports = barcodeStore;

/***/ },

/***/ 825:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  contract: {}
	};

/***/ },

/***/ 826:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  barcode: {
	    begin: 'เลขที่สัญญา',
	    end: 'เลขที่สัญญา',
	    shop_code: 'รหัสสาขา',
	    shop_name: 'ชื่อสาขา',
	    year: 'พ.ศ.',
	    qty: 'จำนวน',
	    last_barcode: 'บาร์โค้ดสุดท้าย',
	    count_total: 'จำนวนทั้งหมด',
	    count_used: 'ใช้ไปแล้ว',
	    count_available: 'คงเหลือ',
	    confirm_dialog: 'ยืนยันการพิมพ์เลขที่สัญญา กรุณาติดตั้งเครื่องพิมพ์บาร์โค้ดให้เรียบร้อย, ก่อนกดตกลง',
	    title: {
	      generator: 'เพิ่มเลขที่สัญญา',
	      print: 'พิมพ์เลขที่สัญญา'
	    }
	  }
	};

/***/ }

});