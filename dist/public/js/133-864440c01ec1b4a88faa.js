webpackJsonp([133,135],{

/***/ 354:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(355);

/***/ },

/***/ 355:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  systemActions: __webpack_require__(356),
	  systemStore: __webpack_require__(357),

	  ajaxActions: __webpack_require__(359),
	  dialogActions: __webpack_require__(364),
	  dialogLOV: __webpack_require__(365),
	  infoPanelActions: __webpack_require__(366),
	  menuActions: __webpack_require__(367),
	  sessionActions: __webpack_require__(368),
	  toasterActions: __webpack_require__(369),

	  ajaxStore: __webpack_require__(370),
	  sessionStore: __webpack_require__(375),

	  helper: __webpack_require__(361),
	  acl: __webpack_require__(376),
	  storage: __webpack_require__(360)
	};

/***/ },

/***/ 356:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'toggleModuleMenu': {},
	  'bodyClick': {},
	  'getMaster': { children: ['done', 'error'] },
	  'iniModule': { children: ['done', 'error'] },
	  'requestSignOut': {},
	  'signout': { children: ['done', 'error'] },
	  'ping': { children: ['done', 'error'] },
	  'setTheme': {},
	  'updateTopPanel': {},
	  'setPageHeader': {},
	  'getIDCardReaders': { children: ['done', 'error'] },
	  'readIDCard': { children: ['done', 'error'] },
	  'readIDCardPhoto': { children: ['done', 'error'] },
	  'getCounts': { children: ['done', 'error'] },
	  'printerList': { children: ['done', 'error'] },
	  'print': { children: ['done', 'error'] }
	});

/***/ },

/***/ 357:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);
	var $ = __webpack_require__(358);

	var ajaxActions = __webpack_require__(359);
	var systemActions = __webpack_require__(356);
	var storage = __webpack_require__(360);
	var helper = __webpack_require__(361);

	var systemStore = Reflux.createStore({
	  listenables: [systemActions],

	  getMaster: function getMaster() {
	    return this.masterData || null;
	  },

	  onGetMaster: function onGetMaster() {
	    if (!this.masterData) {
	      ajaxActions.request('/api/system/getMaster', {}, this.didGetMaster);
	    } else {
	      systemActions.getMaster.done(this.masterData);
	    }
	  },

	  onIniModule: function onIniModule(item) {
	    systemActions.iniModule.done(item);
	  },

	  didGetMaster: function didGetMaster(res) {
	    console.log('didGetMaster', res);
	    if (res.status === true) {
	      systemActions.getMaster.done(res.data);
	      this.masterData = res.data;
	      return;
	    }
	    systemActions.getMaster.error(res.error);
	  },

	  onSignout: function onSignout() {
	    ajaxActions.request('/api/system/signout', {}, this.didSignout);
	  },

	  didSignout: function didSignout(res) {
	    if (res.status === true) {
	      systemActions.signout.done();
	      return;
	    }
	    systemActions.signout.error(res.error);
	  },

	  onPing: function onPing() {
	    ajaxActions.request('/api/system/ping', {}, this.didPing);
	  },

	  didPing: function didPing(res) {
	    if (res.status === true) {
	      systemActions.ping.done(res.sessionID);
	      return;
	    }
	    systemActions.ping.error(res.error);
	  },

	  onGetIDCardReaders: function onGetIDCardReaders() {
	    $.ajax({
	      url: '//localhost:9001/idcard/readers',
	      type: 'get',
	      dataType: 'json',
	      success: function success(result) {
	        //        console.log('onReadIDCardReaders', result);
	        if (result.status === true) {
	          systemActions.getIDCardReaders.done(result.readers);
	        } else {
	          systemActions.getIDCardReaders.error();
	        }
	      },
	      error: function error() {
	        systemActions.getIDCardReaders.error();
	      }
	    });
	  },

	  onReadIDCard: function onReadIDCard(reader, ref) {
	    $.ajax({
	      url: '//localhost:9001/idcard/read' + (reader ? '/' + reader : ''),
	      type: 'get',
	      dataType: 'json',
	      success: function success(result) {
	        //console.log('onReadIDCard', result);
	        if (result.status === true) {
	          systemActions.readIDCard.done(result.idcard, ref);
	        } else {
	          systemActions.readIDCard.error();
	        }
	      },
	      error: function error(e) {
	        systemActions.readIDCard.error();
	      }
	    });
	  },

	  onReadIDCardPhoto: function onReadIDCardPhoto(reader, ref) {
	    $.ajax({
	      url: '//localhost:9001/idcard/readPhoto' + (reader ? '/' + reader : ''),
	      type: 'get',
	      dataType: 'json',
	      success: function success(result) {
	        console.log('onReadIDCardPhoto', result);
	        if (result.status === true) {
	          systemActions.readIDCardPhoto.done({
	            nationid: result.nationid,
	            photoPath: '//localhost:9001/idcard/photo/' + result.nationid + '.jpg',
	            ref: ref
	          });
	        } else {
	          systemActions.readIDCardPhoto.error();
	        }
	      },
	      error: function error(e) {
	        systemActions.readIDCardPhoto.error();
	      }
	    });
	  },
	  onPrinterList: function onPrinterList(param) {
	    $.ajax({
	      url: param.url + '/printer/list',
	      type: 'get',
	      dataType: 'json',
	      success: function success(result) {
	        systemActions.printerList.done({
	          ref: param.ref,
	          printers: result.printers
	        });
	      },
	      error: function error(err) {
	        systemActions.printerList.error(err);
	      }
	    });
	  },

	  onPrint: function onPrint(req) {
	    var option = storage.load('system.printers', {
	      printerLaserUrl: 'http://localhost:9001',
	      printerDotUrl: 'http://localhost:9001',
	      printerLaser: 'Foxit Reader PDF Printer',
	      printerDot: 'Foxit Reader PDF Printer'
	    });

	    var param = {
	      uuid: helper.newUUID(),
	      report: '',
	      param: { url: req.url },
	      format: 'PDFURL',
	      printer: req.printer || option.printerLaser,
	      numCopy: req.numCopy || 1
	    };
	    console.log(param);
	    $.ajax({
	      type: 'post',
	      url: option.printerLaserUrl + '/printer/submit',
	      contentType: 'application/json; charset=utf-8',
	      data: JSON.stringify(param),
	      dataType: 'json',
	      success: function success(result) {
	        systemActions.print.done();
	      },
	      error: function error(e) {
	        systemActions.print.error(e);
	      }
	    });
	  },

	  onGetCounts: function onGetCounts(param) {
	    ajaxActions.request(param.request, param.list, this.didGetCounts);
	  },

	  didGetCounts: function didGetCounts(res) {
	    console.log(res);
	    systemActions.getCounts.done(res);
	    if (res.status === true) {
	      systemActions.getCounts.done(res.counts);
	      return;
	    }
	    systemActions.getCounts.error();
	  }
	});

	module.exports = systemStore;

/***/ },

/***/ 359:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions(['request', 'requestDone', 'requestError', 'download']);

/***/ },

/***/ 360:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  save: function save(key, value) {
	    localStorage.setItem(key, JSON.stringify(value));
	  },

	  load: function load(key, def) {
	    var value = localStorage.getItem(key);
	    if (value == null) {
	      return def || null;
	    }
	    try {
	      value = JSON.parse(value);
	    } catch (e) {
	      console.log('error', e);
	      value = null;
	    }
	    return value;
	  },

	  remove: function remove(key) {
	    localStorage.removeItem(key);
	  }
	};

/***/ },

/***/ 364:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions(['show', 'close', 'update']);

/***/ },

/***/ 365:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions(['show', 'close', 'search']);

/***/ },

/***/ 366:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions(['show', 'hide']);

/***/ },

/***/ 367:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions(['show', 'updateCount']);

/***/ },

/***/ 368:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions({
	  'load': { children: ['done', 'error'] },
	  'keepAlive': { children: ['done', 'error'] },
	  'updateSession': { children: ['done', 'error'] }
	});

/***/ },

/***/ 369:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(335).createActions(['pop', 'dismissAll']);

/***/ },

/***/ 370:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var Reflux = __webpack_require__(335);
	var ajaxActions = __webpack_require__(359);
	var $ = __webpack_require__(358);
	var dialogActions = __webpack_require__(364);

	var parseResponse = function parseResponse(res) {
	  if (!res.status) {
	    return res;
	  }

	  var transform = function transform(res, level) {
	    if (level >= 2) {
	      return res;
	    }
	    var res2 = {};
	    if (typeof res.length === 'number') {
	      res2 = [];
	    }
	    for (var i in res) {
	      if (_typeof(res[i]) !== 'object' || res[i] === null) {
	        res2[i] = res[i];
	        continue;
	      }
	      if (typeof res[i].d !== 'undefined' && typeof res[i].f !== 'undefined') {
	        res2[i] = res[i].d.map(function (row) {
	          var obj = {};
	          res[i].f.forEach(function (fld, i) {
	            obj[fld] = row[i];
	          });
	          return obj;
	        });
	      } else {
	        // console.log('before transform', res[i]);
	        // console.log('after transform', transform(res[i], level+1));
	        res2[i] = transform(res[i], level + 1);
	      }
	    }
	    return res2;
	  };
	  return transform(res, 0);
	};

	var ajaxStore = Reflux.createStore({
	  init: function init() {
	    this.listenTo(ajaxActions.request, this.onAjaxRequest), this.listenTo(ajaxActions.download, this.onAjaxDownload);
	  },

	  showSessionTimeout: function showSessionTimeout() {
	    dialogActions.show({
	      title: 'dialog.title.session_timeout',
	      content: 'ขาดการติดต่อกับระบบนานเกินกว่าที่กำหนด กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
	      actions: [{ id: 'ok', icon: 'check52', label: 'dialog.ok' }]
	    }, function () {

	      window.location.href = '/signin';
	    });
	  },

	  onAjaxRequest: function onAjaxRequest(path, data, cb) {
	    var req = {
	      data: JSON.stringify(data),
	      contentType: 'application/json; charset=utf-8'
	    };

	    if (data instanceof File) {
	      console.log(new Buffer(data.preview));
	      req.data = JSON.stringify({ type: data.type, file: data.preview, name: data.name });
	    }
	    $.ajax({
	      type: 'post',
	      url: '/securestock' + path,
	      data: req.data,
	      contentType: req.contentType,
	      dataType: 'json',
	      success: function (res) {
	        ajaxActions.requestDone(res.status, res.msg);
	        if (res.session === false) {
	          this.showSessionTimeout();
	        } else {
	          // console.log('before', res);
	          // console.log('after', parseResponse(res));
	          cb(parseResponse(res));
	        }
	      }.bind(this),
	      error: function (e) {
	        ajaxActions.requestError(e);
	        cb({ status: false, error: e });
	      }.bind(this)
	    });
	  },

	  onAjaxDownload: function onAjaxDownload(path, data, cb) {
	    // $.post('/securestock' + path, data, function(retData) {
	    //   consle.log('OK');
	    //   console.log(retData);
	    // }, function(res) {
	    //   console.log('error');
	    // });
	    // return;
	    $.ajax({
	      type: "POST",
	      url: '/securestock' + path,
	      data: JSON.stringify(data),
	      contentType: 'application/json; charset=utf-8',
	      dataType: 'binary',
	      success: function success(response, status, xhr) {
	        var filename = "";
	        var disposition = xhr.getResponseHeader('Content-Disposition');
	        if (disposition && disposition.toLowerCase().indexOf('attachment') !== -1) {
	          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
	          var matches = filenameRegex.exec(disposition);
	          if (matches != null && matches[1]) {
	            filename = matches[1].replace(/['"]/g, '');
	          }
	        }

	        var type = xhr.getResponseHeader('Content-Type');
	        console.log(type);
	        var blob = new Blob([response], { type: type });

	        if (typeof window.navigator.msSaveBlob !== 'undefined') {
	          window.navigator.msSaveBlob(blob, filename);
	        } else {
	          var URL = window.URL || window.webkitURL;
	          var downloadUrl = URL.createObjectURL(blob);

	          if (filename) {
	            // use HTML5 a[download] attribute to specify filename
	            var a = document.createElement("a");
	            // safari doesn't support this yet
	            if (typeof a.download === 'undefined') {
	              window.location = downloadUrl;
	            } else {
	              a.href = downloadUrl;
	              a.download = filename;
	              document.body.appendChild(a);
	              a.click();
	            }
	          } else {
	            window.location = downloadUrl;
	          }

	          setTimeout(function () {
	            URL.revokeObjectURL(downloadUrl);
	          }, 100); // cleanup
	        }
	        cb(true);
	      },
	      error: function (_error) {
	        function error(_x) {
	          return _error.apply(this, arguments);
	        }

	        error.toString = function () {
	          return _error.toString();
	        };

	        return error;
	      }(function (xhr) {
	        console.log(error, xhr);
	      })
	    });
	  },
	  // Callback
	  output: function output(flag) {
	    var status = flag ? 'ONLINE' : 'OFFLINE';

	    // Pass on to listeners
	    this.trigger(status);
	  }
	});

	module.exports = ajaxStore;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(371).Buffer))

/***/ },

/***/ 371:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(372)
	var ieee754 = __webpack_require__(373)
	var isArray = __webpack_require__(374)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(371).Buffer, (function() { return this; }())))

/***/ },

/***/ 372:
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },

/***/ 373:
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },

/***/ 374:
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },

/***/ 375:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(335);
	var sessionActions = __webpack_require__(368);
	var ajaxActions = __webpack_require__(359);
	var ajaxStore = __webpack_require__(370);

	var sessionStore = Reflux.createStore({
	  listenables: [sessionActions],

	  getSession: function getSession() {
	    return this.sessionData || null;
	  },

	  onLoad: function onLoad() {
	    ajaxActions.request('/api/system/sessionInfo', {}, this.didLoad);
	  },

	  didLoad: function didLoad(res) {
	    if (res.status === true) {
	      this.sessionData = res.session;
	      sessionActions.load.done(res.session);
	      this.trigger(res.session);
	      return;
	    }
	    sessionActions.load.error(res.msg);
	  },

	  onKeepAlive: function onKeepAlive() {
	    ajaxActions.request('/api/system/keepAlive', {}, this.didKeepAlive);
	  },

	  didKeepAlive: function didKeepAlive(res) {
	    if (res.status === true) {
	      sessionActions.keepAlive.done(res.session);
	      return;
	    }
	    sessionActions.keepAlive.error(res.error);
	  },

	  onUpdateSession: function onUpdateSession(param) {
	    ajaxActions.request('/api/system/sessionUpdate', param, this.didUpdateSession);
	  },

	  didUpdateSession: function didUpdateSession(res) {
	    if (res.status === true) {
	      this.sessionData = res.session;
	      sessionActions.updateSession.done(res.session);
	      return;
	    }
	    sessionActions.updateSession.error(res.error);
	  }
	});

	module.exports = sessionStore;

/***/ },

/***/ 376:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var systemStore = __webpack_require__(357);
	var sessionStore = __webpack_require__(375);

	var getShopAcl = function getShopAcl(acls) {
	  var session = sessionStore.getSession();
	  var acl = session.acl;
	  var shops = systemStore.getMaster().shops;
	  if (session.staff.is_admin == 'YES') {
	    return shops;
	  }
	  var out = [];
	  for (var ii in shops) {
	    var shop = shops[ii];
	    if (typeof acls === 'undefined') {
	      if (acl[shop.code]) {
	        out.push(shop);
	      }
	      continue;
	    }
	    for (var i in acls) {
	      var pass = true;
	      for (var j in acls[i]) {
	        if (!pass) {
	          break;
	        }
	        for (var k in acls[i][j]) {
	          if (typeof acl[shop.code] === 'undefined' || typeof acl[shop.code][j] === 'undefined' || typeof acl[shop.code][j][k] === 'undefined' || acl[shop.code][j][k] === false) {
	            pass = false;
	            break;
	          }
	        }
	      }
	      if (pass) {
	        break;
	      }
	    }
	    if (pass) {
	      out.push(shop);
	    }
	  }
	  return out;
	};

	var hasAcl = function hasAcl(acls) {
	  var session = sessionStore.getSession();
	  var acl = session.acl;
	  if (session.staff.is_admin == 'YES') {
	    return true;
	  }

	  for (var i in acls) {
	    for (var j = 0; j < acls[i].length; j++) {
	      if (typeof acl[session.shop.code] === 'undefined' || typeof acl[session.shop.code][i] === 'undefined' || typeof acl[session.shop.code][i][acls[i][j]] === 'undefined' || acl[session.shop.code][i][acls[i][j]] === false) {
	        //          console.log(i, j, session.shop.code, acl);
	        return false;
	      }
	    }
	  }

	  return true;
	};

	var hasMAcl = function hasMAcl(menu_acl) {
	  var session = sessionStore.getSession();
	  var acl = session.acl[session.shop.code];
	  if (session.staff.is_admin == 'YES') {
	    return true;
	  }
	  if (typeof acl !== 'undefined') {
	    for (var i in acl) {
	      for (var j = 0; j < menu_acl.length; j++) {
	        if (acl[i][menu_acl[j]] == true) return true;
	      }
	    }
	  }
	  return false;
	};

	var getAcl = function getAcl() {
	  return sessionStore.getSession().acl;
	};

	module.exports = {
	  getShopAcl: getShopAcl,
	  hasAcl: hasAcl,
	  hasMAcl: hasMAcl,
	  getAcl: getAcl
	};

/***/ },

/***/ 489:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var tr = __webpack_require__(207);

	var FlexIcon = React.createClass({
	  displayName: 'FlexIcon',

	  handleClick: function handleClick(e) {
	    e.preventDefault();
	    //    console.log('handleClick');
	    if (typeof this.props.onClick === 'function') {
	      this.props.onClick(e);
	    }
	  },
	  render: function render() {
	    var style = {};
	    if (this.props.style) {
	      style = this.props.style;
	    }
	    if (this.props.to) {
	      return React.createElement(
	        Link,
	        {
	          to: this.props.to,
	          params: this.props.param,
	          className: 'flex-icon',
	          title: tr(this.props.title),
	          style: style
	        },
	        React.createElement('span', { className: 'flaticon-' + this.props.icon })
	      );
	    } else {
	      return React.createElement(
	        'a',
	        { href: '#',
	          className: 'flex-icon',
	          title: tr(this.props.title),
	          onClick: this.handleClick,
	          style: style
	        },
	        React.createElement('span', { className: 'flaticon-' + this.props.icon })
	      );
	    }
	  }
	});
	module.exports = FlexIcon;

/***/ },

/***/ 490:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var T = __webpack_require__(381);
	var helper = __webpack_require__(354).helper;
	var FlexIcon = __webpack_require__(489);
	var DatePicker = __webpack_require__(486);

	var FlexDisplayTable = React.createClass({
	  displayName: 'FlexDisplayTable',


	  getInitialState: function getInitialState() {
	    return {
	      data: this.props.data || [],
	      displayRows: this.props.displayRows || 10,
	      lov: {},
	      inputData: {}
	    };
	  },

	  handleChange: function handleChange(name, value) {
	    this.state.inputData[name] = value;
	    if (typeof this.props.onInputChange === 'function') {
	      this.props.onInputChange(this.state.data);
	    }
	    this.setState({
	      inputData: this.state.inputData
	    });
	    //    console.log(this.state.inputData);
	  },

	  handleKeyEnter: function handleKeyEnter(field, e) {
	    //console.log('jack');
	    if (e.keyCode == 13) {
	      var ok = true;
	      if (typeof field.onEnter === 'function') {
	        e.stopPropagation();
	        var ok = field.onEnter.bind(this)(this.state.inputData);
	        if (ok) {
	          this.setState({
	            inputData: this.state.inputData
	          });
	        }
	      }

	      if (ok) {
	        // find next tab index
	        var ref = null;
	        var tabIndex = field.tabIndex;
	        //        console.log('tabIndex=', tabIndex);
	        var len = this.props.fields.length;
	        for (var i = 0; i < len; i++) {
	          if (this.props.fields[i].name == field.name) {
	            continue;
	          }
	          var index = parseInt(this.props.fields[i].tabIndex);
	          if (isNaN(index) || index <= tabIndex) {
	            continue;
	          }
	          // found
	          //          console.log('index=', index);
	          if (this.refs[this.props.fields[i].name]) {
	            ref = this.refs[this.props.fields[i].name];
	            break;
	          }
	        }
	        if (ref == null) {
	          // goto save
	          ref = this.refs._save;
	        }
	        //        console.log(ref.getDOMNode());
	        ref.getDOMNode().focus();
	        e.stopPropagation();
	      }
	    }
	  },

	  editRow: function editRow(i, e) {
	    e.preventDefault();
	    var data = JSON.parse(JSON.stringify(this.props.data[i]));
	    data._row = i;
	    this.setState({
	      inputData: data
	    });
	  },

	  removeRow: function removeRow(i, e) {
	    e.preventDefault();
	    if (typeof this.props.onRemove === 'function') {
	      this.props.onRemove(i);
	    }
	  },

	  doSave: function doSave(e) {
	    e.preventDefault();
	    e.stopPropagation();

	    if (typeof this.props.onSave === 'function') {
	      if (this.props.onSave(this.state.inputData)) {
	        // save ok
	        this.doClear(e);
	      } else {
	        // save error
	      }
	    }
	  },

	  doClear: function doClear(e) {
	    e.preventDefault();
	    this.setState({
	      inputData: { setup: false }
	    });
	    for (var i = 0; i < this.props.fields.length; i++) {
	      if (this.props.fields[i].tabIndex) {
	        if (this.refs[this.props.fields[i].name]) {
	          this.refs[this.props.fields[i].name].getDOMNode().focus();
	          break;
	        }
	      }
	    }
	  },

	  // shouldComponentUpdate: function(nextProps, nextState) {
	  //   if (nextProps.data==this.props.nextState){
	  //     return false;
	  //   }
	  //   if (JSON.stringify(nextProps.data)===JSON.stringify(this.props.data)) {
	  //     return false;
	  //   }
	  //   return true;
	  // },

	  render: function render() {
	    var colgroup = this.props.fields.map(function (field) {
	      var style = {};
	      if (field.width) {
	        style.width = field.width;
	      }
	      return React.createElement('col', { key: field.name, style: style });
	    });
	    //    colgroup.push(<col key="actions" style={{width:(28*2+8)+'px'}}></col>);

	    var th = this.props.fields.map(function (field) {
	      var style = {};
	      if (field.width) {
	        style.width = field.width + 'px';
	      }
	      return React.createElement(
	        'th',
	        { key: field.name, style: style },
	        React.createElement(T, { content: field.label })
	      );
	    });
	    //    th.push(<th key="actions">&nbsp;</th>);

	    // var inputRow = this.props.fields.map(function(field) {
	    //   var input = null;
	    //   if (field.type==='checkbox') {
	    //     input = (
	    //       <span className="checkbox">
	    //         <input
	    //           id={'chk_'+field.name}
	    //           type="checkbox"
	    //           ref={field.name}
	    //           checked={this.state.inputData[field.name]}
	    //           onChange={function(e) {this.handleChange(field.name, e.target.checked)}.bind(this)}
	    //           onKeyUp={function(e) {this.handleKeyEnter(field, e)}.bind(this)}
	    //         />
	    //         <label htmlFor={'chk_'+field.name}></label>
	    //       </span>
	    //     );
	    //   } else {
	    //     input = (
	    //       <input
	    //         type="text"
	    //         ref={field.name}
	    //         value={this.state.inputData[field.name]}
	    //         readOnly={field.readonly||false}
	    //         onChange={function(e) {this.handleChange(field.name, e.target.value)}.bind(this)}
	    //         onKeyUp={function(e) {this.handleKeyEnter(field, e)}.bind(this)}
	    //         />);
	    //   }
	    //   return (
	    //     <td key={field.name}>
	    //       {input}
	    //     </td>
	    //   )
	    // }.bind(this));

	    // inputRow.push((
	    //   <td key="actions">
	    //     <div className="flex">
	    //       <a href="#" ref="_save"
	    //         className="flaticon-download164"
	    //         onClick={this.doSave}
	    //         onKeyUp={function(e) {
	    //           if(e.keyCode==13) {
	    //             this.doSave(e);
	    //           }
	    //         }.bind(this)}
	    //         ></a>
	    //       <a href="#" className="flaticon-clear5" onClick={this.doClear}></a>
	    //     </div>
	    //   </td>
	    // ));

	    var rows = this.props.data.map(function (row, i) {
	      var td = this.props.fields.map(function (field) {
	        var text = null;
	        if (typeof field.render === 'function') {
	          text = field.render(row, i);
	        } else {
	          text = row[field.name];
	        }
	        return React.createElement(
	          'td',
	          { key: field.name },
	          text
	        );
	      });
	      // td.push(
	      //   <td key="actions" className="flex">
	      //     <a
	      //       href="#"
	      //       className="flaticon-create3"
	      //       onClick={function(e) {this.editRow(i, e)}.bind(this)}
	      //       ></a>
	      //     <a
	      //       href="#"
	      //       className="flaticon-rubbish"
	      //       onClick={function(e) {this.removeRow(i,e)}.bind(this)}
	      //       ></a>
	      //   </td>
	      // );
	      return React.createElement(
	        'tr',
	        { key: i },
	        td
	      );
	    }.bind(this));

	    var numRows = this.props.displayRows || 10;
	    // <tr className="inputRow">
	    //   {inputRow}
	    // </tr>

	    return React.createElement(
	      'div',
	      { className: 'flex-data-table' },
	      React.createElement(
	        'div',
	        { className: 'header' },
	        React.createElement(
	          'table',
	          null,
	          React.createElement(
	            'colgroup',
	            null,
	            colgroup
	          ),
	          React.createElement(
	            'thead',
	            null,
	            React.createElement(
	              'tr',
	              null,
	              th
	            )
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'body', style: { height: 32 * numRows + 'px' } },
	        React.createElement(
	          'table',
	          null,
	          React.createElement(
	            'colgroup',
	            null,
	            colgroup
	          ),
	          React.createElement(
	            'tbody',
	            null,
	            rows
	          )
	        )
	      )
	    );
	  }

	});

	module.exports = FlexDisplayTable;

/***/ },

/***/ 491:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var cn = __webpack_require__(380);
	var T = __webpack_require__(381);

	module.exports = React.createClass({
	  displayName: 'exports',

	  getInitialState: function getInitialState() {
	    return {
	      value: this.props.data[this.props.field.id]
	    };
	  },

	  handleChange: function handleChange(e) {
	    this.setState({ value: e.target.value });
	    if (typeof this.props.onChange === 'function') {
	      this.props.onChange(this.props.field.id, e.target.value);
	    }
	  },

	  // shouldComponentUpdate: function(nextProps, nextState) {
	  //   if (nextProps.data
	  //     && nextProps.field
	  //     && nextProps.field.id
	  //     && nextProps.data[nextProps.field.id]==this.props.data[this.props.field.id]
	  //     && JSON.stringify(nextProps.field.list)==JSON.stringify(this.props.field.list)
	  //   ) {
	  //     return false;
	  //   }
	  //   return true;
	  // },

	  render: function render() {
	    var field = this.props.field || {};
	    var attrs = {};

	    field.icon = field.icon || 'round52';
	    field.list = field.list || [];
	    var optionList = field.list.map(function (item) {
	      return React.createElement(
	        'option',
	        { key: item.value, value: item.value },
	        item.text
	      );
	    });

	    return React.createElement(
	      'div',
	      { className: cn('field', { readonly: field.readonly, disabled: field.disabled, required: field.required }) },
	      React.createElement('span', { className: 'flaticon-' + field.icon + ' icon-small field-icon' }),
	      React.createElement(
	        'label',
	        { className: 'label', htmlFor: field.id },
	        React.createElement(T, { content: field.label })
	      ),
	      React.createElement(
	        'select',
	        {
	          id: field.id,
	          ref: field.id,
	          value: this.props.data[this.props.field.id],
	          className: 'dropdown',
	          onChange: this.handleChange,
	          required: field.required,
	          tabIndex: field.tabIndex,
	          autoFocus: field.autofocus,
	          disabled: field.disabled ? "disabled" : null
	        },
	        optionList
	      )
	    );
	  }
	});

/***/ },

/***/ 494:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var cn = __webpack_require__(380);
	var T = __webpack_require__(381);

	var FlexRadioGroup = React.createClass({
	  displayName: 'FlexRadioGroup',

	  handleChange: function handleChange(e) {
	    if (typeof this.props.onChange === 'function') {
	      this.props.onChange(this.props.field.id, e.target.value);
	    }
	  },

	  render: function render() {
	    var field = this.props.field;
	    var list = field.list.map(function (item) {
	      var id = field.id + '_' + item.value;
	      var chk = false;
	      if (field.id.indexOf('.') > 0) {
	        var tmp = field.id.split('.');
	        if (tmp.length > 1) {
	          chk = this.props.data[tmp[0]][tmp[1]] == item.value;
	        }
	      } else {
	        chk = this.props.data[field.id] == item.value;
	      }

	      return React.createElement(
	        'div',
	        { key: item.value, className: this.props.itemClassName },
	        React.createElement('input', {
	          type: 'radio',
	          name: field.id,
	          id: id,
	          checked: chk,
	          value: item.value,
	          onChange: this.handleChange
	        }),
	        field.raw ? React.createElement(
	          'label',
	          { htmlFor: id, className: 'label' },
	          item.text
	        ) : React.createElement(T, { content: item.text, component: 'label', className: 'label', htmlFor: id })
	      );
	    }.bind(this));
	    return React.createElement(
	      'div',
	      { className: 'flex-radio-group' + (this.props.className ? ' ' + this.props.className : '') },
	      list,
	      field.label ? React.createElement(T, { content: field.label, component: 'label', className: 'label' }) : null
	    );
	  }
	});

	module.exports = FlexRadioGroup;

/***/ },

/***/ 495:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Reflux = __webpack_require__(335);
	var T = __webpack_require__(381);

	var FlexTab = React.createClass({
	  displayName: 'FlexTab',

	  handleClick: function handleClick(e, id) {
	    e.preventDefault();
	    if (typeof this.props.onClick == 'function') {
	      this.props.onClick(id);
	    }
	  },
	  render: function render() {
	    var tabs = this.props.list.map(function (item) {
	      return React.createElement(
	        'li',
	        { key: item.id },
	        React.createElement(
	          'a',
	          { href: '#', className: 'tab flex' + (item.id == this.props.selected ? ' active' : ''), onClick: function (e) {
	              this.handleClick(e, item.id);
	            }.bind(this) },
	          React.createElement('div', { className: 'flaticon-' + item.icon + ' icon' }),
	          item.raw ? React.createElement(
	            'div',
	            { className: 'text ellipsis' },
	            item.text
	          ) : React.createElement(T, { content: item.text, component: 'div', className: 'text ellipsis' })
	        )
	      );
	    }.bind(this));
	    return React.createElement(
	      'ul',
	      { className: 'flex-tab' },
	      tabs
	    );
	  }
	});

	module.exports = FlexTab;

/***/ },

/***/ 1040:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _table = __webpack_require__(564);

	var _table2 = _interopRequireDefault(_table);

	var _tableHeaderColumn = __webpack_require__(565);

	var _tableHeaderColumn2 = _interopRequireDefault(_tableHeaderColumn);

	var _tableRow = __webpack_require__(566);

	var _tableRow2 = _interopRequireDefault(_tableRow);

	var _tableHeader = __webpack_require__(567);

	var _tableHeader2 = _interopRequireDefault(_tableHeader);

	var _tableRowColumn = __webpack_require__(568);

	var _tableRowColumn2 = _interopRequireDefault(_tableRowColumn);

	var _tableBody = __webpack_require__(569);

	var _tableBody2 = _interopRequireDefault(_tableBody);

	var _tableFooter = __webpack_require__(570);

	var _tableFooter2 = _interopRequireDefault(_tableFooter);

	var _raisedButton = __webpack_require__(334);

	var _raisedButton2 = _interopRequireDefault(_raisedButton);

	var _textField = __webpack_require__(536);

	var _textField2 = _interopRequireDefault(_textField);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var React = __webpack_require__(2);

	var tr = __webpack_require__(207);

	var system = __webpack_require__(355);
	//var widgets = require('ss-widget');
	var toasterActions = system.toasterActions;
	var helper = __webpack_require__(361);
	var systemActions = __webpack_require__(356);
	var infoPanelActions = __webpack_require__(366);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var actions = __webpack_require__(1041);

	var T = __webpack_require__(381);
	var dialogActions = system.dialogActions;
	var FlexTextInput = __webpack_require__(496);
	var FlexButton = __webpack_require__(379);
	var FlexDisplayTable = __webpack_require__(490);
	var FlexDropdown = __webpack_require__(491);
	var FlexIcon = __webpack_require__(489);
	var FlexTab = __webpack_require__(495);
	var FlexCheckbox = __webpack_require__(385);
	var FlexRadioGroup = __webpack_require__(494);

	var $ = __webpack_require__(358);

	var style = {
	  margin: 12
	};
	module.exports = React.createClass({
	  displayName: 'exports',

	  render: function render() {

	    return React.createElement(
	      'div',
	      { id: 'bodysignin' },
	      React.createElement(
	        'div',
	        { className: 'onex-top-bar' },
	        React.createElement('div', { className: 'onex-top-bar-left' }),
	        React.createElement(
	          'div',
	          { className: 'top-bar-right' },
	          React.createElement(
	            'ul',
	            { className: 'menu' },
	            React.createElement(
	              'li',
	              null,
	              React.createElement(
	                'div',
	                { className: 'space' },
	                '.'
	              )
	            )
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { id: 'content-panel-signin', style: { 'width': '770px', 'height': '603px', 'overflow': 'scroll' } },
	        React.createElement(
	          'div',
	          { style: { 'width': '750px' } },
	          React.createElement(
	            'h3',
	            null,
	            'forgot your password'
	          ),
	          React.createElement('br', null),
	          React.createElement(
	            'div',
	            { style: { width: '100%', border: 'solid 1px lightgray' } },
	            React.createElement(
	              'h5',
	              { style: { textAlign: 'center', borderBottom: 'solid 1px lightgray', backgroundColor: '#F5F5F5' } },
	              'Enter the email address for reset your password'
	            ),
	            React.createElement(
	              'div',
	              { style: { padding: '15px' } },
	              React.createElement(_textField2.default, {
	                hintText: 'Your email',
	                style: { width: '517px' }
	              }),
	              React.createElement(_raisedButton2.default, { label: 'send', secondary: true, style: { float: 'right' } })
	            )
	          )
	        )
	      )
	    );
	  }
	});

/***/ },

/***/ 1041:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(335).createActions(['signin']);

/***/ },

/***/ 1042:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var tr = __webpack_require__(207);

	var system = __webpack_require__(355);
	//var widgets = require('ss-widget');
	var toasterActions = system.toasterActions;
	var helper = __webpack_require__(361);
	var systemActions = __webpack_require__(356);
	var infoPanelActions = __webpack_require__(366);
	var Router = __webpack_require__(160);
	var actions = __webpack_require__(1041);

	var T = __webpack_require__(381);
	var dialogActions = system.dialogActions;
	var FlexTextInput = __webpack_require__(496);
	var FlexButton = __webpack_require__(379);
	var FlexDisplayTable = __webpack_require__(490);
	var FlexDropdown = __webpack_require__(491);
	var FlexIcon = __webpack_require__(489);
	var FlexTab = __webpack_require__(495);
	var FlexCheckbox = __webpack_require__(385);
	var FlexRadioGroup = __webpack_require__(494);

	var $ = __webpack_require__(358);

	//var ReFlux = require('reflux');
	var resetData = {
	  id: '',
	  customer_id: '',
	  code: 'XX0001',
	  date: new Date().toJSON().slice(0, 10),
	  remark: '',
	  product: '',
	  customer_code: '',
	  tax_num: '',
	  member_code: '',
	  names: '',
	  last_name: '',
	  password: '',
	  repassword: '',
	  e_mail: '',
	  note: '',
	  birthday: '',
	  credit_term: 1,
	  serviceChargeText: '',
	  serviceChargeAmount: 0,
	  discount: '0',
	  contactId: 0,
	  contactPersonId: 0,
	  defaultAddrNo: '',
	  defaultAddrSoi: '',
	  defaultAddrTambon: '',
	  defaultAddrAmphur: '',
	  defaultAddrProvince: '',
	  defaultAddrZipCode: '',
	  defaultAddrPhone: '',
	  contactName: '',
	  contactPosition: '',
	  contactAddr1: '',
	  contactAddr2: '',
	  contactTambon: '',
	  contactAmphur: '',
	  contactProvince: '',
	  contactZipcode: '',
	  contactEmail: '',
	  contactPhoneNo: '',
	  contactLineId: '',
	  contactRemark: '',
	  billingPersonId: 0,
	  billingCode: '',
	  billingName: '',
	  billingAddr1: '',
	  billingAddr2: '',
	  billingTambon: '',
	  billingAmper: '',
	  billingProvince: '',
	  billingZipcode: '',
	  billingOtherNo: '',
	  billingLiveYear: '',
	  billingRemark: '',
	  billingSend: '',
	  billingNote: '',
	  billingPayment: '',
	  default_billing: 'N',
	  customerTypeFieldList: 'PERSON',
	  customerIdTypeList: 'nationid',
	  credit_term_status: 'APPROVE',
	  customerGenderList: 'N/A',
	  customerTitleList: 'N/A',
	  is_active_list: 'YES',
	  paymentTypeList: 'credit',
	  currencyList: '1'
	};
	var CustomerEdit = React.createClass({
	  displayName: 'CustomerEdit',

	  contextTypes: {
	    router: React.PropTypes.func
	  },
	  // mixins:[
	  // // ReFlux.listenTo(actions.getPaymentTerm.done,'onGetPaymentTermDoneAction'),
	  // // ReFlux.listenTo(actions.getMemberType.done,'onGetMemberTypeDoneAction'),
	  //   ReFlux.listenTo(actions.getCustomerData.done,'onGetCustomerDataDoneAction'),
	  //   ReFlux.listenTo(actions.getContactListData.done,'onGetContactListDataDoneAction'),
	  //   ReFlux.listenTo(actions.getBillingListData.done,'onGetBillingListDataDoneAction'),
	  //   ReFlux.listenTo(actions.saveCustomers.done,'onSaveCustomersDoneAction'),
	  //   ReFlux.listenTo(actions.saveCustomers.error,'onSaveCustomersErrorAction'),
	  //   ReFlux.listenTo(actions.editCustomers.done,'onEditCustomersDoneAction'),
	  //   ReFlux.listenTo(actions.editCustomers.error,'onEditCustomersErrorAction'),
	  //   ReFlux.listenTo(actions.getCurrencyFromBase.done,'onGetCurrencyFromBaseDoneAction')
	  // ],
	  getInitialState: function getInitialState() {
	    console.log(system);
	    // //console.log(this.context.router.getCurrentParams().id);
	    // //console.log(system.sessionStore.getSession().staff.id);
	    // if(this.context.router.getCurrentParams().id == 'unidentified' || this.context.router.getCurrentParams().id == null
	    //   || this.context.router.getCurrentParams().id == 0 || this.context.router.getCurrentParams().id == '0'){
	    //   var person_id = '0';
	    //   var cTab = 'tab1';
	    // }else {
	    //   var person_id = this.context.router.getCurrentParams().id;
	    //   var cTab = 'tab3'
	    // }
	    //console.log(person_id);
	    var person_id = '0';
	    var cTab = 'tab1';
	    return {
	      data: helper.clone(resetData),
	      edit_data: {
	        person_id: person_id
	      },
	      is_active: {
	        id: 'is_active_list',
	        label: 'newcustomer.add_new_customer.is_active',
	        list: [{ value: 'YES', text: 'YES' }, { value: 'NO', text: 'NO' }]
	      },
	      credit_term_status: {
	        id: 'credit_term_status',
	        label: 'newcustomer.add_new_customer.credit_term_status',
	        list: [{ value: 'APPROVE', text: tr.translate('newcustomer.newsList.AP') }, { value: 'WAITAPPROVE', text: tr.translate('newcustomer.newsList.NAP') }]
	      },
	      customerTypeField: {
	        id: 'customerTypeFieldList',
	        label: 'newcustomer.add_new_customer.customer_type',
	        list: [{ value: 'PERSON', text: tr.translate('newcustomer.customer_type_list.type_person') }, { value: 'COMPANY', text: tr.translate('newcustomer.customer_type_list.type_company') }]
	      },
	      customerTitle: {
	        id: 'customerTitleList',
	        label: 'newcustomer.add_new_customer.titel',
	        list: [{ value: 'N/A', text: 'N/A' }, { value: 'Mr.', text: 'Mr.' }, { value: 'Miss', text: 'Miss' }, { value: 'Mrs.', text: 'Mrs.' }]
	      },
	      customerIdType: {
	        id: 'customerIdTypeList',
	        label: 'newcustomer.add_new_customer.type_id',
	        list: [{ value: 'nationid', text: 'Card ID' }, { value: 'passport', text: 'Passport' }, { value: 'tax_id', text: 'TAX ID' }]
	      },
	      customerGender: {
	        id: 'customerGenderList',
	        label: 'newcustomer.add_new_customer.gender',
	        list: [{ value: 'N/A', text: 'N/A' }, { value: 'M', text: 'male' }, { value: 'F', text: 'female' }]
	      },
	      paymentType: {
	        id: 'paymentTypeList',
	        label: 'newcustomer.add_new_customer.paymentTeprList',
	        list: [{ value: 'credit', text: 'Credit' }, { value: 'billing', text: 'Billing' }]
	      },
	      currency: {
	        id: 'currencyList',
	        label: 'newcustomer.add_new_customer.currency',
	        list: []
	      },

	      contactListData: [],
	      billingListData: [],
	      curTab: cTab,
	      flagSave: false,
	      flagBillingList: 'N',
	      flagBillingListId: '',
	      flagContactList: 'N',
	      flagContactListId: ''
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    console.log("start");
	    console.log("toast = ", toasterActions);
	    // actions.getCurrencyFromBase();
	    // //systemActions.setPageHeader(tr.translate('others.title.index'));
	    // //actions.getMemberType();
	    // if (this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0'){
	    //   console.log("Get Data");
	    //   actions.getCustomerData(this.state.edit_data);
	    //   actions.getContactListData(this.state.edit_data);
	    //   actions.getBillingListData(this.state.edit_data);
	    // }
	  },

	  // onGetMemberTypeDoneAction: function(data){
	  //   //console.log(data);
	  //   var list = data.memberType.map(function(row) {
	  //     return {
	  //         value: row.value,
	  //         text: row.text
	  //     }
	  //   });
	  //   console.log(list);
	  //   this.state.customerIdType.list = list;
	  //   console.log(this.state.customerIdType);
	  //   this.setState({
	  //     customerIdType: this.state.customerIdType
	  //   });
	  //   //console.log(this.state.memberTypeField);
	  // },

	  onGetCurrencyFromBaseDoneAction: function onGetCurrencyFromBaseDoneAction(data) {
	    console.log('ddttaa');
	    var list = data.currencyListFromBase.map(function (row) {
	      return {
	        value: row.value,
	        text: row.text
	      };
	    });
	    console.log(list);
	    this.state.currency.list = list;
	    console.log(this.state.currency);
	    this.setState({
	      currency: this.state.currency
	    });
	    console.log(this.state.currency);
	  },

	  onGetCustomerDataDoneAction: function onGetCustomerDataDoneAction(data) {
	    console.log(data);
	    this.state.data.id = data.id;
	    this.state.data.customer_id = data.customer_id;
	    this.state.data.customer_code = data.code;
	    this.state.data.customerTypeFieldList = data.type;
	    this.state.data.customerGenderList = data.gender;
	    this.state.data.customerTitleList = data.prename;
	    this.state.data.names = data.firstname;
	    this.state.data.last_name = data.lastname;
	    this.state.data.password = data.password;
	    this.state.data.repassword = data.password;
	    this.state.data.e_mail = data.email;
	    this.state.data.birthday = data.birth;
	    this.state.data.credit_term = data.credit_term;
	    this.state.data.credit_term_status = data.approve_status;
	    this.state.data.is_active_list = data.get_news;
	    this.state.data.customerIdTypeList = data.costomer_type_id;
	    this.state.data.tax_num = data.id_number;
	    this.state.data.paymentTypeList = data.payment_type;
	    this.state.data.serviceChargeText = data.charge_text;
	    this.state.data.discount = data.discount;
	    this.state.data.serviceChargeAmount = data.charge;
	    this.state.data.defaultAddrNo = data.addr1;
	    this.state.data.defaultAddrSoi = data.addr2;
	    this.state.data.defaultAddrTambon = data.tambon;
	    this.state.data.defaultAddrAmphur = data.amphur;
	    this.state.data.defaultAddrProvince = data.province;
	    this.state.data.defaultAddrZipCode = data.zipcode;
	    this.state.data.defaultAddrPhone = data.tel;
	    this.state.data.currencyList = data.currency_id;
	    this.state.data.memberTypeFieldList = data.memberTypeFieldList;

	    this.setState({
	      data: this.state.data
	    });
	  },

	  onGetContactListDataDoneAction: function onGetContactListDataDoneAction(data) {
	    //console.log(data);
	    this.state.contactListData = data;
	    this.setState({
	      contactListData: this.state.contactListData
	    });
	    console.log(this.state.contactListData);
	  },

	  onGetBillingListDataDoneAction: function onGetBillingListDataDoneAction(data) {
	    this.state.billingListData = data;
	    this.setState({
	      billingListData: this.state.billingListData
	    });
	    console.log(this.state.billingListData);
	  },

	  onSaveCustomersDoneAction: function onSaveCustomersDoneAction(data) {
	    this.setState({
	      data: helper.clone(resetData),
	      contactListData: [],
	      billingListData: []
	    });
	    // toasterActions.pop({
	    //   type:'success',
	    //   message:data.done
	    // });
	  },
	  onSaveCustomersErrorAction: function onSaveCustomersErrorAction(data) {
	    // toasterActions.pop({
	    //   type:'warning',
	    //   message:'เพิ่มข้อมูลไม่สำเร็จ'
	    // });
	  },

	  handleChange: function handleChange(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	    //console.log(this.state.data.customerTypeFieldList);
	  },

	  onCodeEnter: function onCodeEnter(id, value) {
	    //console.log(value);
	    //console.log(this.state.data.code);
	    //actions.getPaymentTerm(value);
	  },

	  handleListChange: function handleListChange(id, value) {

	    var payment_option = this.state.fieldPaymentOption.list.filter(function (payment) {
	      return payment.value == value;
	    });
	    //console.log(payment_option);
	    // this.state.selectedItemText = payment_option;
	    this.setState({
	      selectedItem: value,
	      selectedItemText: payment_option[0].text
	    });
	  },

	  onKeyUp: function onKeyUp(id, value) {
	    var _chk = 'N';
	    if (id == 'card_id') {
	      //console.log(value);
	      //if(value != ''){
	      this.state.textdata.nationid = value;
	      //}
	    }
	    if (id == 'code') {
	      //if(value != ''){
	      this.state.textdata.contractid = value;
	      //  }
	    }
	    if (id == 'other') {
	      //if(value != ''){
	      this.state.textdata.other = value;
	      //}
	    }
	  },

	  onPrintReceiptDoneAction: function onPrintReceiptDoneAction(data) {
	    window.open(data.pdfFile);
	  },

	  doAddBillingLists: function doAddBillingLists() {
	    if (this.state.flagBillingList == 'N') {
	      var row = {
	        billingCode: this.state.data.billingCode,
	        billingName: this.state.data.billingName,
	        billingAddr1: this.state.data.billingAddr1,
	        billingAddr2: this.state.data.billingAddr2,
	        billingTambon: this.state.data.billingTambon,
	        billingAmper: this.state.data.billingAmper,
	        billingProvince: this.state.data.billingProvince,
	        billingZipcode: this.state.data.billingZipcode,
	        billingOtherNo: this.state.data.billingOtherNo,
	        billingLiveYear: this.state.data.billingLiveYear,
	        billingRemark: this.state.data.billingRemark,
	        billingSend: this.state.data.billingSend,
	        billingNote: this.state.data.billingNote,
	        billingPayment: this.state.data.billingPayment,
	        default_billing: this.state.data.default_billing
	      };
	      //console.log(row);
	      this.state.billingListData.push(row);

	      this.setState({
	        billingListData: this.state.billingListData
	      });
	      console.log(this.state.billingListData);
	    } else {
	      console.log('Not thing');
	      var index = this.state.flagBillingListId;
	      this.state.billingListData = this.state.billingListData;
	      console.log(this.state.billingListData[index]);
	      var row = {
	        billingCode: this.state.data.billingCode,
	        billingName: this.state.data.billingName,
	        billingAddr1: this.state.data.billingAddr1,
	        billingAddr2: this.state.data.billingAddr2,
	        billingTambon: this.state.data.billingTambon,
	        billingAmper: this.state.data.billingAmper,
	        billingProvince: this.state.data.billingProvince,
	        billingZipcode: this.state.data.billingZipcode,
	        billingOtherNo: this.state.data.billingOtherNo,
	        billingLiveYear: this.state.data.billingLiveYear,
	        billingRemark: this.state.data.billingRemark,
	        billingSend: this.state.data.billingSend,
	        billingNote: this.state.data.billingNote,
	        billingPayment: this.state.data.billingPayment,
	        default_billing: this.state.data.default_billing
	      };
	      this.state.billingListData[index] = row;

	      this.setState({
	        billingListData: this.state.billingListData
	      });
	      console.log(this.state.billingListData);
	    }
	    this.state.data.billingCode = '';
	    this.state.data.billingName = '';
	    this.state.data.billingAddr1 = '';
	    this.state.data.billingAddr2 = '';
	    this.state.data.billingTambon = '';
	    this.state.data.billingAmper = '';
	    this.state.data.billingProvince = '';
	    this.state.data.billingZipcode = '';
	    this.state.data.billingOtherNo = '';
	    this.state.data.billingLiveYear = '';
	    this.state.data.billingRemark = '';
	    this.state.data.billingSend = '';
	    this.state.data.billingNote = '';
	    this.state.data.billingPayment = '';
	    this.state.data.default_billing = 'N';
	    this.state.flagBillingList = 'N';
	  },

	  onSetDefaultBill: function onSetDefaultBill(i, row) {
	    var x = this.state.billingListData.length;
	    for (j = 0; j < x; j++) {
	      if (j == i) {
	        if (this.state.billingListData[j].default_billing == 'Y') {
	          var s = 'N';
	        } else if (this.state.billingListData[j].default_billing == 'N') {
	          var s = 'Y';
	        }
	        this.state.billingListData[j].default_billing = s;
	      } else {
	        this.state.billingListData[j].default_billing = 'N';
	      }
	    }
	    this.setState({
	      billingListData: this.state.billingListData
	    });
	    console.log(this.state.billingListData);
	  },

	  onBillingListDelete: function onBillingListDelete(i) {
	    this.state.billingListData.splice(i, 1);
	    this.setState({
	      billingListData: this.state.billingListData
	    });
	  },

	  onBillingListEdit: function onBillingListEdit(i, row) {
	    this.state.flagBillingListId = i;
	    this.state.flagBillingList = 'Y';

	    this.state.data = this.state.data;

	    this.state.data.billingCode = row.billingCode;
	    this.state.data.billingName = row.billingName;
	    this.state.data.billingAddr1 = row.billingAddr1;
	    this.state.data.billingAddr2 = row.billingAddr2;
	    this.state.data.billingTambon = row.billingTambon;
	    this.state.data.billingAmper = row.billingAmper;
	    this.state.data.billingProvince = row.billingProvince;
	    this.state.data.billingZipcode = row.billingZipcode;
	    this.state.data.billingOtherNo = row.billingOtherNo;
	    this.state.data.billingLiveYear = row.billingLiveYear;
	    this.state.data.billingRemark = row.billingRemark;
	    this.state.data.billingSend = row.billingSend;
	    this.state.data.billingNote = row.billingNote;
	    this.state.data.billingPayment = row.billingPayment;
	    this.state.data.default_billing = row.default_billing;

	    this.setState({
	      data: this.state.data
	    });
	  },

	  doAddContactLists: function doAddContactLists() {
	    if (this.state.flagContactList == 'N') {
	      var row = {
	        contactName: this.state.data.contactName,
	        contactPosition: this.state.data.contactPosition,
	        contactAddr1: this.state.data.contactAddr1,
	        contactAddr2: this.state.data.contactAddr2,
	        contactTambon: this.state.data.contactTambon,
	        contactAmphur: this.state.data.contactAmphur,
	        contactProvince: this.state.data.contactProvince,
	        contactZipcode: this.state.data.contactZipcode,
	        contactEmail: this.state.data.contactEmail,
	        contactPhoneNo: this.state.data.contactPhoneNo,
	        contactLineId: this.state.data.contactLineId,
	        contactRemark: this.state.data.contactRemark
	      };
	      //console.log(row);
	      this.state.contactListData.push(row);

	      this.setState({
	        contactListData: this.state.contactListData
	      });
	      console.log(this.state.contactListData);
	    } else {
	      console.log('Not thing');
	      var index = this.state.flagContactListId;
	      this.state.contactListData = this.state.contactListData;
	      console.log(this.state.contactListData[index]);
	      var row = {
	        contactName: this.state.data.contactName,
	        contactPosition: this.state.data.contactPosition,
	        contactAddr1: this.state.data.contactAddr1,
	        contactAddr2: this.state.data.contactAddr2,
	        contactTambon: this.state.data.contactTambon,
	        contactAmphur: this.state.data.contactAmphur,
	        contactProvince: this.state.data.contactProvince,
	        contactZipcode: this.state.data.contactZipcode,
	        contactEmail: this.state.data.contactEmail,
	        contactPhoneNo: this.state.data.contactPhoneNo,
	        contactLineId: this.state.data.contactLineId,
	        contactRemark: this.state.data.contactRemark
	      };
	      this.state.contactListData[index] = row;

	      this.setState({
	        contactListData: this.state.contactListData
	      });
	      console.log(this.state.contactListData);
	    }
	    this.state.data.contactName = '';
	    this.state.data.contactPosition = '';
	    this.state.data.contactAddr1 = '';
	    this.state.data.contactAddr2 = '';
	    this.state.data.contactTambon = '';
	    this.state.data.contactAmphur = '';
	    this.state.data.contactProvince = '';
	    this.state.data.contactZipcode = '';
	    this.state.data.contactEmail = '';
	    this.state.data.contactPhoneNo = '';
	    this.state.data.contactLineId = '';
	    this.state.data.contactRemark = '';

	    this.state.flagContactList = 'N';
	  },

	  onContactListDelete: function onContactListDelete(i) {
	    this.state.contactListData.splice(i, 1);
	    this.setState({
	      contactListData: this.state.contactListData
	    });
	  },

	  onContactListEdit: function onContactListEdit(i, row) {
	    this.state.flagContactListId = i;
	    this.state.flagContactList = 'Y';

	    this.state.data = this.state.data;

	    this.state.data.contactName = row.contactName;
	    this.state.data.contactPosition = row.contactPosition;
	    this.state.data.contactAddr1 = row.contactAddr1;
	    this.state.data.contactAddr2 = row.contactAddr2;
	    this.state.data.contactTambon = row.contactTambon;
	    this.state.data.contactAmphur = row.contactAmphur;
	    this.state.data.contactProvince = row.contactProvince;
	    this.state.data.contactZipcode = row.contactZipcode;
	    this.state.data.contactEmail = row.contactEmail;
	    this.state.data.contactPhoneNo = row.contactPhoneNo;
	    this.state.data.contactLineId = row.contactLineId;
	    this.state.data.contactRemark = row.contactRemark;

	    this.setState({
	      data: this.state.data
	    });
	  },

	  handleTabClick: function handleTabClick(id) {
	    this.setState({
	      curTab: id
	    });
	  },

	  onRePrint: function onRePrint(row) {
	    //actions.printReceipt({contract_id:row.contract_id,receipt_id:row.id});
	  },

	  handleChangeDialog: function handleChangeDialog(id, value) {
	    this.state.data[id] = value;
	    this.setState({
	      data: this.state.data
	    });
	    //dialogActions.update(this.createParameter());
	  },

	  saveCustomer: function saveCustomer() {
	    console.log("It's X");
	    if (this.state.data.password != this.state.data.repassword) {
	      console.log("Password Not Match");
	      toasterActions.pop({
	        type: 'warning',
	        message: 'Password Not Match'
	      });
	      return;
	    }
	    var obj = {
	      id: this.state.data.id,
	      customer_id: this.state.data.customer_id,
	      customer_code: this.state.data.customer_code,
	      customerTypeFieldList: this.state.data.customerTypeFieldList,
	      customerGenderList: this.state.data.customerGenderList,
	      customerTitleList: this.state.data.customerTitleList,
	      customerIdTypeList: this.state.data.customerIdTypeList,
	      tax_num: this.state.data.tax_num,
	      member_code: this.state.data.member_code,
	      names: this.state.data.names,
	      last_name: this.state.data.last_name,
	      password: this.state.data.password,
	      repassword: this.state.data.repassword,
	      e_mail: this.state.data.e_mail,
	      note: this.state.data.note,
	      birthday: this.state.data.birthday,
	      remark: this.state.data.remark,
	      is_active_list: this.state.data.is_active_list,
	      credit_term: this.state.data.credit_term,
	      credit_term_status: this.state.data.credit_term_status,
	      paymentTypeList: this.state.data.paymentTypeList,
	      currencyList: this.state.data.currencyList,
	      serviceChargeText: this.state.data.serviceChargeText,
	      serviceChargeAmount: this.state.data.serviceChargeAmount,
	      discount: this.state.data.discount,
	      defaultAddrName: this.state.data.names + " " + this.state.data.last_name,
	      defaultAddrNo: this.state.data.defaultAddrNo,
	      defaultAddrSoi: this.state.data.defaultAddrSoi,
	      defaultAddrTambon: this.state.data.defaultAddrTambon,
	      defaultAddrAmphur: this.state.data.defaultAddrAmphur,
	      defaultAddrProvince: this.state.data.defaultAddrProvince,
	      defaultAddrZipCode: this.state.data.defaultAddrZipCode,
	      defaultAddrPhone: this.state.data.defaultAddrPhone,
	      //memberTypeFieldList:this.state.data.memberTypeFieldList,
	      billingListData: this.state.billingListData,
	      contactListData: this.state.contactListData
	    };
	    console.log(this.state.edit_data);
	    if (this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0') {
	      console.log('Edit', obj);
	      //actions.editCustomers(obj);
	    } else {
	        console.log('Add', obj);
	        //actions.saveCustomers(obj);
	        $.ajax({
	          type: 'post',
	          url: '/register/api',
	          contentType: 'application/json; charset=utf-8',
	          data: JSON.stringify({
	            act: 'register',
	            dataSaving: obj
	          }),
	          dataType: 'json',
	          success: function (res) {
	            if (res.status === true) {
	              this.setState({
	                data: helper.clone(resetData),
	                contactListData: [],
	                billingListData: []
	              });
	              console.log("Save data complete = ", res.data.user);
	              alert("Register Complete your user is " + res.data.user);
	              toasterActions.pop({
	                type: 'success',
	                message: 'Save customer complete'
	              });
	            } else {
	              alert("ERROR! Can't not Register!!");
	            }
	          }.bind(this),
	          error: function (e, m) {
	            this.setState({
	              isLock: false,
	              message: tr('signin.unknow_error')
	            });
	          }.bind(this)
	        });
	      }
	  },

	  onEditCustomersDoneAction: function onEditCustomersDoneAction(data) {
	    this.setState({
	      data: helper.clone(resetData),
	      contactListData: [],
	      billingListData: []
	    });
	    // toasterActions.pop({
	    //   type:'success',
	    //   message:data.done
	    // });
	  },
	  onEditCustomersErrorAction: function onEditCustomersErrorAction(errors) {
	    // toasterActions.pop({
	    //   type:'warning',
	    //   message:'แก้ไขข้อมูลไม่สำเร็จ'
	    // });
	  },

	  render: function render() {
	    var fields = {
	      customer_code: {
	        id: 'customer_code',
	        label: 'newcustomer.add_new_customer.customer_code',
	        readonly: true,
	        maxLength: 6
	      },
	      tax_num: {
	        id: 'tax_num',
	        label: 'newcustomer.add_new_customer.tax_num',
	        required: true,
	        maxLength: 13
	      },
	      member_code: {
	        id: 'member_code',
	        label: 'newcustomer.add_new_customer.member_code'
	      },
	      names: {
	        id: 'names',
	        label: 'newcustomer.add_new_customer.names',
	        required: true
	      },
	      last_name: {
	        id: 'last_name',
	        label: 'newcustomer.add_new_customer.last_name'

	      },
	      password: {
	        id: 'password',
	        type: 'password',
	        label: 'newcustomer.add_new_customer.password',
	        required: true
	      },
	      repassword: {
	        id: 'repassword',
	        type: 'password',
	        label: 'newcustomer.add_new_customer.repassword',
	        required: true
	      },
	      e_mail: {
	        id: 'e_mail',
	        label: 'newcustomer.add_new_customer.e_mail',
	        required: true
	      },
	      note: {
	        id: 'note',
	        label: 'newcustomer.add_new_customer.note'
	      },
	      birthday: {
	        id: 'birthday',
	        label: 'newcustomer.add_new_customer.birthday'
	      },
	      remark: {
	        id: 'remark',
	        label: 'newcustomer.add_new_customer.remark'
	      },
	      news: {
	        id: 'news',
	        label: 'newcustomer.add_new_customer.news'
	      },
	      discount: {
	        id: 'discount',
	        label: 'newcustomer.add_new_customer.discount'
	      },
	      credit_term: {
	        id: 'credit_term',
	        label: 'newcustomer.add_new_customer.credit_term'
	      },
	      defaultAddrNo: {
	        id: 'defaultAddrNo',
	        label: 'newcustomer.add_new_customer.defaultAddrNo'
	      },
	      defaultAddrSoi: {
	        id: 'defaultAddrSoi',
	        label: 'newcustomer.add_new_customer.defaultAddrSoi'
	      },
	      defaultAddrTambon: {
	        id: 'defaultAddrTambon',
	        label: 'newcustomer.add_new_customer.defaultAddrTambon'
	      },
	      defaultAddrAmphur: {
	        id: 'defaultAddrAmphur',
	        label: 'newcustomer.add_new_customer.defaultAddrAmphur'
	      },
	      defaultAddrProvince: {
	        id: 'defaultAddrProvince',
	        label: 'newcustomer.add_new_customer.defaultAddrProvince'
	      },
	      defaultAddrZipCode: {
	        id: 'defaultAddrZipCode',
	        label: 'newcustomer.add_new_customer.defaultAddrZipCode'
	      },
	      defaultAddrPhone: {
	        id: 'defaultAddrPhone',
	        label: 'newcustomer.add_new_customer.defaultAddrPhone'
	      },
	      contactName: {
	        id: 'contactName',
	        label: 'preliminary.add_new_customer.contactName',
	        icon: 'user158'
	      },
	      contactPosition: {
	        id: 'contactPosition',
	        label: 'preliminary.add_new_customer.contactPosition',
	        icon: 'user158'
	      },
	      contactAddr1: {
	        id: 'contactAddr1',
	        label: 'preliminary.add_new_customer.contactAddr1'
	      },
	      contactAddr2: {
	        id: 'contactAddr2',
	        label: 'preliminary.add_new_customer.contactAddr2'
	      },
	      contactTambon: {
	        id: 'contactTambon',
	        label: 'preliminary.add_new_customer.contactTambon'
	      },
	      contactAmphur: {
	        id: 'contactAmphur',
	        label: 'preliminary.add_new_customer.contactAmphur'
	      },
	      contactProvince: {
	        id: 'contactProvince',
	        label: 'preliminary.add_new_customer.contactProvince'
	      },
	      contactZipcode: {
	        id: 'contactZipcode',
	        label: 'preliminary.add_new_customer.contactZipcode'
	      },
	      contactEmail: {
	        id: 'contactEmail',
	        label: 'preliminary.add_new_customer.contactEmail'
	      },
	      contactPhoneNo: {
	        id: 'contactPhoneNo',
	        label: 'preliminary.add_new_customer.contactPhoneNo'
	      },
	      contactLineId: {
	        id: 'contactLineId',
	        label: 'preliminary.add_new_customer.contactLineId'
	      },
	      contactRemark: {
	        id: 'contactRemark',
	        label: 'preliminary.add_new_customer.contactRemark'
	      },
	      serviceChargeText: {
	        id: 'serviceChargeText',
	        label: 'newcustomer.add_new_customer.serviceChargeText'
	      },
	      serviceChargeAmount: {
	        id: 'serviceChargeAmount',
	        label: 'newcustomer.add_new_customer.serviceChargeAmount'
	      },
	      billingCode: {
	        id: 'billingCode',
	        label: 'newcustomer.add_new_customer.billingCode'
	      },
	      billingName: {
	        id: 'billingName',
	        label: 'newcustomer.add_new_customer.billingName'
	      },
	      billingAddr1: {
	        id: 'billingAddr1',
	        label: 'newcustomer.add_new_customer.billingAddr1'
	      },
	      billingAddr2: {
	        id: 'billingAddr2',
	        label: 'newcustomer.add_new_customer.billingAddr2'
	      },
	      billingTambon: {
	        id: 'billingTambon',
	        label: 'newcustomer.add_new_customer.billingTambon'
	      },
	      billingAmper: {
	        id: 'billingAmper',
	        label: 'newcustomer.add_new_customer.billingAmper'
	      },
	      billingProvince: {
	        id: 'billingProvince',
	        label: 'newcustomer.add_new_customer.billingProvince'
	      },
	      billingZipcode: {
	        id: 'billingZipcode',
	        label: 'newcustomer.add_new_customer.billingZipcode'
	      },
	      billingOtherNo: {
	        id: 'billingOtherNo',
	        label: 'newcustomer.add_new_customer.billingOtherNo'
	      },
	      billingLiveYear: {
	        id: 'billingLiveYear',
	        label: 'newcustomer.add_new_customer.billingLiveYear'
	      },
	      billingRemark: {
	        id: 'billingRemark',
	        label: 'newcustomer.add_new_customer.billingRemark'
	      },
	      billingSend: {
	        id: 'billingSend',
	        label: 'newcustomer.add_new_customer.billingSend'
	      },
	      billingNote: {
	        id: 'billingNote',
	        label: 'newcustomer.add_new_customer.billingNote'
	      },
	      billingPayment: {
	        id: 'billingPayment',
	        label: 'newcustomer.add_new_customer.billingPayment'
	      },
	      penalty: {
	        id: 'penalty',
	        label: 'pos.receipt.penalty'
	      },
	      other: {
	        id: 'other',
	        label: 'pos.receipt.other',
	        icon: 'smartphone20'
	      },
	      payment_type: {
	        id: 'payment_type',
	        type: 'dropdown',
	        label: 'pos.receipt.type',
	        icon: 'list88',
	        list: [{ value: 'เงินสด', text: 'เงินสด' }, { value: 'บัตรเครดิต', text: 'บัตรเครดิต' }]
	      }
	    };

	    var contactList = [{ name: 'num', label: 'pos.receipt.no', width: 50, render: function render(row, i) {
	        return i + 1;
	      } }, { name: 'contactName', label: 'newcustomer.inTable.contactNameInTable', width: 100, render: function render(row) {
	        return row.contactName;
	      } }, { name: 'contactPhoneNo', label: 'newcustomer.inTable.contactPhoneNoInTable', width: 100, render: function render(row) {
	        return row.contactPhoneNo;
	      } }, { name: 'actions', type: 'actions', width: 2 * 15 + 'px', width: 100, render: function (row, i) {
	        var f = function () {
	          this.onContactListDelete(i);
	        }.bind(this);
	        var g = function () {
	          this.onContactListEdit(i, row);
	        }.bind(this);
	        return React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { onClick: g },
	            React.createElement(FlexIcon, { icon: 'create3', title: 'action.select' })
	          ),
	          React.createElement(
	            'div',
	            { onClick: f },
	            React.createElement(FlexIcon, { icon: 'clear5', title: 'action.select' })
	          )
	        );
	      }.bind(this) }];

	    // {name:'display_name',label:'pos.payment.staff',width:100, className:'right',render:function(row){
	    //   return row.display_name;
	    // }},
	    var billingList = [{ name: 'num', label: 'newcustomer.inTable.no', width: 50, render: function render(row, i) {
	        return i + 1;
	      } }, { name: 'billingCode', label: 'newcustomer.inTable.contactCodeInTableBill', width: 120, render: function render(row) {
	        return row.billingCode;
	      } }, { name: 'actions1', label: 'newcustomer.inTable.defaultBill', type: 'actions', width: 2 * 15 + 'px', width: 50, render: function (row, i) {
	        var h = function () {
	          this.onSetDefaultBill(i, row);
	        }.bind(this);
	        return row.default_billing == 'Y' ? React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { onClick: h },
	            React.createElement(FlexIcon, { icon: 'circle108', title: 'action.select' })
	          )
	        ) : React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { onClick: h },
	            React.createElement(FlexIcon, { icon: 'circle107', title: 'action.select' })
	          )
	        );
	      }.bind(this) }, { name: 'actions', type: 'actions', width: 2 * 15 + 'px', width: 50, render: function (row, i) {
	        var f = function () {
	          this.onBillingListDelete(i);
	        }.bind(this);
	        var g = function () {
	          this.onBillingListEdit(i, row);
	        }.bind(this);
	        return React.createElement(
	          'div',
	          { className: 'flex' },
	          React.createElement(
	            'div',
	            { onClick: g },
	            React.createElement(FlexIcon, { icon: 'create3', title: 'action.select' })
	          ),
	          React.createElement(
	            'div',
	            { onClick: f },
	            React.createElement(FlexIcon, { icon: 'clear5', title: 'action.select' })
	          )
	        );
	      }.bind(this) }];

	    if (this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0') {
	      var listTab = [
	      //{id:'tab1', icon:'google134', text:'newcustomer.tab.upload_doc'},
	      //{id:'tab2', icon:'account4', text:'newcustomer.tab.inital_tab'},
	      { id: 'tab3', icon: 'home149', text: 'newcustomer.tab.default_addr_tab' }, { id: 'tab4', icon: 'list89', text: 'newcustomer.tab.billing_data' }, { id: 'tab5', icon: 'user157', text: 'newcustomer.tab.contract_name' }];
	    } else {
	      var listTab = [{ id: 'tab1', icon: 'google134', text: 'newcustomer.tab.upload_doc' }
	      // {id:'tab2', icon:'account4', text:'newcustomer.tab.inital_tab'},
	      // {id:'tab3', icon:'home149', text:'newcustomer.tab.default_addr_tab'},
	      // {id:'tab4', icon:'list89', text:'newcustomer.tab.billing_data'}//,
	      // {id:'tab10', icon:'user157', text:'newcustomer.tab.contract_name'}
	      ];
	    }

	    return React.createElement(
	      'div',
	      { id: 'bodysignin' },
	      React.createElement(
	        'div',
	        { className: 'onex-top-bar' },
	        React.createElement('div', { className: 'onex-top-bar-left' }),
	        React.createElement(
	          'div',
	          { className: 'top-bar-right' },
	          React.createElement(
	            'ul',
	            { className: 'menu' },
	            React.createElement(
	              'li',
	              null,
	              React.createElement(
	                'div',
	                { className: 'space' },
	                '.'
	              )
	            )
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { id: 'content-panel-signin' },
	        React.createElement(
	          'div',
	          { id: 'inner-content', style: { border: 'solid 1px lightgray', borderRadius: '8px', marginTop: '5px' } },
	          React.createElement(
	            'div',
	            { className: 'content-page' },
	            React.createElement(
	              'div',
	              { className: 'content-header boxf flex' },
	              React.createElement(
	                'div',
	                { className: 'panelf can-grow', style: { paddingLeft: '8px' } },
	                React.createElement(T, { content: 'newcustomer.title.headNew', component: 'h3' })
	              ),
	              React.createElement('div', { className: 'panel2 no-shrink flex-form' }),
	              React.createElement('div', { className: 'panel2 no-shrink flex-form' }),
	              React.createElement('div', { className: 'panel2 no-shrink flex-form' }),
	              React.createElement(
	                'div',
	                { className: 'panel2 no-shrink flex-form' },
	                React.createElement(FlexButton, {
	                  label: 'newcustomer.title.saveCustomerBT',
	                  icon: 'add184',
	                  'default': true,
	                  onClick: this.saveCustomer
	                })
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'content-body panelf' },
	              React.createElement(
	                'div',
	                { className: 'box9 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel2' },
	                  React.createElement(FlexTextInput, {
	                    field: fields.customer_code,
	                    data: this.state.data,
	                    onChange: this.handleChange,
	                    onKeyUp: this.onKeyUp,
	                    onKeyDown: this.onKeyDown,
	                    live: true
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel4' },
	                  React.createElement(FlexDropdown, {
	                    field: this.state.customerIdType,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel4' },
	                  React.createElement(FlexTextInput, {
	                    field: fields.tax_num,
	                    data: this.state.data,
	                    onChange: this.handleChange,
	                    onKeyUp: this.onKeyUp,
	                    onKeyDown: this.onKeyDown,
	                    live: true
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { display: 'none' } },
	                  React.createElement(FlexDropdown, {
	                    field: this.state.customerTypeField,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { display: 'none' } },
	                  React.createElement(FlexDropdown, {
	                    field: this.state.customerGender,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box9 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel2' },
	                  React.createElement(FlexDropdown, {
	                    field: this.state.customerTitle,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel4' },
	                  React.createElement(FlexTextInput, {
	                    field: fields.names,
	                    data: this.state.data,
	                    onChange: this.handleChange,
	                    onEnter: this.onCodeEnter,
	                    onKeyUp: this.onKeyUp
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'panel4', style: this.state.data.customerTypeFieldList == 'PERSON' ? { display: 'block' } : { display: 'none' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.last_name,
	                    data: this.state.data,
	                    onChange: this.handleChange,
	                    onKeyUp: this.onKeyUp
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box9 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexTextInput, {
	                    field: fields.e_mail,
	                    data: this.state.data,
	                    onChange: this.handleChange,
	                    onKeyUp: this.onKeyUp
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { style: this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0' ? { display: 'none' } : { display: 'block' } },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, {
	                      field: fields.password,
	                      data: this.state.data,
	                      onChange: this.handleChange,
	                      onKeyUp: this.onKeyUp,
	                      onKeyDown: this.onKeyDown,
	                      live: true
	                    })
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { style: this.state.edit_data.person_id != 0 || this.state.edit_data.person_id != '0' ? { display: 'none' } : { display: 'block' } },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, {
	                      field: fields.repassword,
	                      data: this.state.data,
	                      onChange: this.handleChange,
	                      onEnter: this.onCodeEnter,
	                      onKeyUp: this.onKeyUp
	                    })
	                  )
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box9 flex flex-form' },
	                React.createElement(
	                  'div',
	                  { className: 'panel3', style: { display: 'none' } },
	                  React.createElement(FlexTextInput, {
	                    field: fields.birthday,
	                    data: this.state.data,
	                    onChange: this.handleChange,
	                    onEnter: this.onCodeEnter,
	                    onKeyUp: this.onKeyUp
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box9 flex flex-form', style: { display: 'none' } },
	                React.createElement(
	                  'div',
	                  { className: 'panel3' },
	                  React.createElement(FlexDropdown, {
	                    field: this.state.is_active,
	                    data: this.state.data,
	                    onChange: this.handleChange
	                  })
	                ),
	                React.createElement(
	                  'div',
	                  { style: this.state.data.customerTypeFieldList == 'COMPANY' ? { display: 'block' } : { display: 'none' } },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, {
	                      field: fields.credit_term,
	                      data: this.state.data,
	                      onChange: this.handleChange,
	                      onEnter: this.onCodeEnter,
	                      onKeyUp: this.onKeyUp
	                    })
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { style: this.state.data.customerTypeFieldList == 'COMPANY' ? { display: 'block' } : { display: 'none' } },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexDropdown, {
	                      field: this.state.credit_term_status,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  )
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'box9 flex flex-form', style: { display: 'none' } },
	                React.createElement(
	                  'div',
	                  { className: 'panel6' },
	                  React.createElement(FlexTextInput, {
	                    field: fields.note,
	                    data: this.state.data,
	                    onChange: this.handleChange,
	                    onKeyUp: this.onKeyUp,
	                    onKeyDown: this.onKeyDown,
	                    live: true
	                  })
	                )
	              ),
	              React.createElement(
	                'div',
	                { style: this.state.data.customerTypeFieldList == 'COMPANY' ? { display: 'none' } : { display: 'none' } },
	                React.createElement(
	                  'div',
	                  { className: 'box9 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3', style: { display: 'none' } },
	                    React.createElement(FlexTextInput, {
	                      field: fields.member_code,
	                      data: this.state.data,
	                      onChange: this.handleChange,
	                      onKeyUp: this.onKeyUp
	                    })
	                  )
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel9' },
	                React.createElement(FlexTab, { list: listTab, selected: this.state.curTab, onClick: this.handleTabClick })
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel9', style: this.state.curTab == 'tab1' ? { display: 'block' } : { display: 'none' } },
	                React.createElement('div', { className: 'box6 flex flex-form' })
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel9', style: this.state.curTab == 'tab2' ? { display: 'block' } : { display: 'none' } },
	                React.createElement(
	                  'div',
	                  { className: 'box6 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexDropdown, {
	                      field: this.state.paymentType,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  ),
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexDropdown, {
	                      field: this.state.currency,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'box6 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, { field: fields.serviceChargeText,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  ),
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, { field: fields.discount,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'box6 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, { field: fields.serviceChargeAmount,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  )
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel9', style: this.state.curTab == 'tab3' ? { display: 'block' } : { display: 'none' } },
	                React.createElement(
	                  'div',
	                  { className: 'box6 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel6' },
	                    React.createElement(FlexTextInput, { field: fields.defaultAddrNo,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'box6 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel6' },
	                    React.createElement(FlexTextInput, { field: fields.defaultAddrSoi,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'box6 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, { field: fields.defaultAddrTambon,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  ),
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, { field: fields.defaultAddrAmphur,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'box6 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, { field: fields.defaultAddrProvince,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  ),
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, { field: fields.defaultAddrZipCode,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'box6 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel3' },
	                    React.createElement(FlexTextInput, { field: fields.defaultAddrPhone,
	                      data: this.state.data,
	                      onChange: this.handleChange
	                    })
	                  )
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel9', style: this.state.curTab == 'tab4' ? { display: 'block' } : { display: 'none' } },
	                React.createElement(
	                  'div',
	                  { className: 'box9 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'box4' },
	                    React.createElement(FlexDisplayTable, {
	                      fields: billingList,
	                      data: this.state.billingListData,
	                      displayRows: 6
	                    })
	                  ),
	                  React.createElement(
	                    'div',
	                    null,
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel2' },
	                        React.createElement(FlexTextInput, { field: fields.billingCode,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, { field: fields.billingName,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel5' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingAddr1,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel5' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingAddr2,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingTambon,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingAmper,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingProvince,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingZipcode,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingOtherNo,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingLiveYear,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingRemark,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingSend,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingNote,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.billingPayment,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5' },
	                      React.createElement('div', { style: { height: '5px' } }),
	                      React.createElement(
	                        'div',
	                        { className: 'box4 flex flex-form' },
	                        React.createElement(
	                          'div',
	                          { className: 'panel2', 'no-shrink': true, 'flex-form': true },
	                          React.createElement(FlexButton, {
	                            label: 'newcustomer.button.addContact',
	                            icon: 'add186',
	                            'default': true,
	                            onClick: this.doAddBillingLists
	                          })
	                        )
	                      )
	                    )
	                  )
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'panel9', style: this.state.curTab == 'tab5' ? { display: 'block' } : { display: 'none' } },
	                React.createElement(
	                  'div',
	                  { className: 'box9 flex flex-form' },
	                  React.createElement(
	                    'div',
	                    { className: 'panel6' },
	                    React.createElement(
	                      'div',
	                      { className: 'box4' },
	                      React.createElement(FlexDisplayTable, {
	                        fields: contactList,
	                        data: this.state.contactListData,
	                        displayRows: 6
	                      })
	                    )
	                  ),
	                  React.createElement(
	                    'div',
	                    { className: 'panel6' },
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, { field: fields.contactName,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, { field: fields.contactPosition,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel5' },
	                        React.createElement(FlexTextInput, { field: fields.contactAddr1,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel5' },
	                        React.createElement(FlexTextInput, { field: fields.contactAddr2,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, { field: fields.contactTambon,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, { field: fields.contactAmphur,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, { field: fields.contactProvince,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, { field: fields.contactZipcode,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.contactEmail,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.contactPhoneNo,
	                          data: this.state.data,
	                          onChange: this.handleChange,
	                          autoSelect: true
	                        })
	                      )
	                    ),
	                    React.createElement(
	                      'div',
	                      { className: 'box5 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.contactLineId,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      ),
	                      React.createElement(
	                        'div',
	                        { className: 'panel3' },
	                        React.createElement(FlexTextInput, {
	                          field: fields.contactRemark,
	                          data: this.state.data,
	                          onChange: this.handleChange
	                        })
	                      )
	                    ),
	                    React.createElement('div', { style: { height: '5px' } }),
	                    React.createElement(
	                      'div',
	                      { className: 'box4 flex flex-form' },
	                      React.createElement(
	                        'div',
	                        { className: 'panel2', 'no-shrink': true, 'flex-form': true },
	                        React.createElement(FlexButton, {
	                          label: 'preliminary.button.addContact',
	                          icon: 'add186',
	                          'default': true,
	                          onClick: this.doAddContactLists
	                        })
	                      )
	                    )
	                  )
	                )
	              )
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = CustomerEdit;

/***/ },

/***/ 1043:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _table = __webpack_require__(564);

	var _table2 = _interopRequireDefault(_table);

	var _tableHeaderColumn = __webpack_require__(565);

	var _tableHeaderColumn2 = _interopRequireDefault(_tableHeaderColumn);

	var _tableRow = __webpack_require__(566);

	var _tableRow2 = _interopRequireDefault(_tableRow);

	var _tableHeader = __webpack_require__(567);

	var _tableHeader2 = _interopRequireDefault(_tableHeader);

	var _tableRowColumn = __webpack_require__(568);

	var _tableRowColumn2 = _interopRequireDefault(_tableRowColumn);

	var _tableBody = __webpack_require__(569);

	var _tableBody2 = _interopRequireDefault(_tableBody);

	var _tableFooter = __webpack_require__(570);

	var _tableFooter2 = _interopRequireDefault(_tableFooter);

	var _raisedButton = __webpack_require__(334);

	var _raisedButton2 = _interopRequireDefault(_raisedButton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var React = __webpack_require__(2);

	var tr = __webpack_require__(207);

	var system = __webpack_require__(355);
	//var widgets = require('ss-widget');
	var toasterActions = system.toasterActions;
	var helper = __webpack_require__(361);
	var systemActions = __webpack_require__(356);
	var infoPanelActions = __webpack_require__(366);
	var Router = __webpack_require__(160);
	var Link = Router.Link;
	var actions = __webpack_require__(1041);

	var T = __webpack_require__(381);
	var dialogActions = system.dialogActions;
	var FlexTextInput = __webpack_require__(496);
	var FlexButton = __webpack_require__(379);
	var FlexDisplayTable = __webpack_require__(490);
	var FlexDropdown = __webpack_require__(491);
	var FlexIcon = __webpack_require__(489);
	var FlexTab = __webpack_require__(495);
	var FlexCheckbox = __webpack_require__(385);
	var FlexRadioGroup = __webpack_require__(494);

	var $ = __webpack_require__(358);

	var style = {
	  'width': '160px'
	};
	var tableData = [];
	var textTo = "82 Soam Soamkrang Somengam Lampang Thailand 52201";
	var FinishBooking = React.createClass({
	  displayName: 'FinishBooking',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    console.log("id = ", this.props.params.id);
	    var bookingId = this.props.params.id;
	    var person_id = '0';
	    var cTab = 'tab1';
	    return {
	      bookingId: bookingId,
	      fixedHeader: false,
	      fixedFooter: false,
	      stripedRows: false,
	      showRowHover: false,
	      selectable: false,
	      multiSelectable: false,
	      selectAllSelected: false,
	      hAdjustForCheckbox: false,
	      adjustForCheckbox: false,
	      enableSelectAll: false,
	      deselectOnClickaway: false,
	      displaySelectAll: false,
	      displayRowCheckbox: false,
	      tableProductRow: '',
	      bookingData: {
	        bookingNo: '',
	        bookingDate: '',
	        bookingFrom: '',
	        bookingSender: '',
	        bookingTo: '',
	        bookingReceipient: '',
	        bookingPickup_place: '',
	        bookingCurrentcy: 'THB',
	        bookingWaybill: ''
	      }
	    };
	  },

	  ProductRow: function ProductRow(dataTable) {
	    return dataTable.map(function (row, index) {
	      return React.createElement(
	        _tableRow2.default,
	        { key: index, style: { 'background-color': '#fff', 'height': '35px', 'border-bottom': '1px dotted #e2e2e2', 'border-top': '0px dotted #e2e2e2' } },
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { 'padding': '0px', 'height': '35px' } },
	          row.name
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { 'textAlign': 'center', 'padding': '0px', 'height': '35px' } },
	          row.piece
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { 'textAlign': 'right', 'padding': '0px', 'padding-right': '25px', 'height': '35px' } },
	          row.weight
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { className: 'in-box-tb', style: { 'textAlign': 'center', 'padding': '0px', 'height': '35px' } },
	          row.width
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { className: 'in-box-tb2', style: { 'textAlign': 'center', 'padding': '0px', 'height': '35px' } },
	          row.depth
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { className: 'in-box-tb3', style: { 'textAlign': 'center', 'padding': '0px', 'height': '35px' } },
	          row.height
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { className: 'in-box-tb4', style: { 'textAlign': 'right', 'padding': '0px', 'padding-right': '15px', 'height': '35px' } },
	          helper.numberFormat(row.price, 2)
	        ),
	        React.createElement(
	          _tableRowColumn2.default,
	          { style: { 'textAlign': 'center', 'padding': '0px', 'height': '35px' } },
	          this.state.bookingData.bookingCurrentcy
	        )
	      );
	    }.bind(this));
	  },

	  componentDidMount: function componentDidMount() {
	    console.log("start");
	    this.getBookingData(this.state.bookingId);
	    // this.getBookingDetail(this.state.bookingId);
	  },

	  onGetBillingListDataDoneAction: function onGetBillingListDataDoneAction(data) {
	    this.state.billingListData = data;
	    this.setState({
	      billingListData: this.state.billingListData
	    });
	    console.log(this.state.billingListData);
	  },

	  getBookingData: function getBookingData(bookingId) {
	    //console.log("booking Id = ", bookingId);
	    $.ajax({
	      type: 'post',
	      url: '/finish-booking/api',
	      contentType: 'application/json; charset=utf-8',
	      data: JSON.stringify({
	        act: 'getBooking',
	        bookingId: bookingId
	      }),
	      dataType: 'json',
	      success: function (res) {
	        if (res.status === true) {
	          //console.log(res.data.bookingData);
	          var resData = res.data.bookingData;
	          this.setBookingData(resData);
	          this.getBookingDetail(this.state.bookingId);
	        } else {
	          console.log("error");
	        }
	      }.bind(this)
	    });
	  },

	  getBookingDetail: function getBookingDetail(bookingId) {
	    console.log("booking Id = ", bookingId);
	    $.ajax({
	      type: 'post',
	      url: '/finish-booking/api',
	      contentType: 'application/json; charset=utf-8',
	      data: JSON.stringify({
	        act: 'getBookingDetail',
	        bookingId: bookingId
	      }),
	      dataType: 'json',
	      success: function (res) {
	        if (res.status === true) {
	          console.log("getBookingDetail Dtat", res.data.bookingDetial);
	          var resData = res.data.bookingDetial;
	          this.setBookingDetail(resData);
	        } else {
	          console.log("eror");
	        }
	      }.bind(this)
	    });
	  },

	  genShipmentReport: function genShipmentReport() {
	    console.log("genShipmentReport Id = ", this.state.bookingId);
	    var bookingId = this.state.bookingId;
	    $.ajax({
	      type: 'post',
	      url: '/finish-booking/api',
	      contentType: 'application/json; charset=utf-8',
	      data: JSON.stringify({
	        act: 'shipmentReport',
	        bookingId: bookingId
	      }),
	      dataType: 'json',
	      success: function (res) {
	        if (res.status === true) {
	          console.log("getBookingDetail Dtat", res);
	          window.open(res.data.pdfFile);
	          window.open(res.data.pdfFileBarcode);
	          window.open(res.data.pdfFileInvoice);
	          //var resData = res.data.bookingDetial;
	          //this.setBookingDetail(resData);
	        } else {
	            console.log("eror");
	          }
	      }.bind(this)
	    });
	  },

	  setBookingData: function setBookingData(data) {
	    console.log("Data data = ", data);
	    this.state.bookingData.bookingNo = data.booking_no;
	    this.state.bookingData.bookingDate = data.booking_date;
	    this.state.bookingData.bookingFrom = data.from_place;
	    this.state.bookingData.bookingSender = data.sender1;
	    this.state.bookingData.bookingTo = data.to_place;
	    this.state.bookingData.bookingReceipient = data.receipient1;
	    this.state.bookingData.bookingPickup_place = data.pickup_place;
	    this.state.bookingData.bookingDiscountAmount = data.discount_amount;
	    this.state.bookingData.bookingChargeAmount = data.charge_amount;
	    this.state.bookingData.bookingTotalAmount = data.total_amount;
	    this.state.bookingData.bookingCurrentcy = data.currency_id == '1' ? 'THB' : 'USD';
	    this.state.bookingData.bookingWaybill = data.waybill;

	    this.setState({
	      bookingData: this.state.bookingData
	    });
	  },

	  setBookingDetail: function setBookingDetail(data) {
	    console.log("Detail = ", data);

	    for (var i = 0; i < data.length; i++) {
	      tableData.push({
	        name: data[i].booking_name,
	        piece: data[i].qty,
	        weight: data[i].weight + " kg.",
	        width: data[i].width + " cm.",
	        depth: data[i].depth + " cm.",
	        height: data[i].height + " cm.",
	        price: data[i].total_price,
	        currency: this.state.bookingData.bookingCurrentcy
	      });
	    }

	    if (this.state.bookingData.bookingDiscountAmount > 0) {
	      console.log("Set Discount = ", this.state.bookingData.bookingDiscountAmount);
	      tableData.push({
	        name: 'Discount',
	        piece: '',
	        weight: '',
	        depth: '',
	        height: '',
	        price: '-' + this.state.bookingData.bookingDiscountAmount
	      });
	    }

	    if (this.state.bookingData.bookingChargeAmount > 0) {
	      console.log("Set Surcharge = ", this.state.bookingData.bookingChargeAmount);
	      tableData.push({
	        name: 'Surcharge',
	        piece: '',
	        weight: '',
	        depth: '',
	        height: '',
	        price: this.state.bookingData.bookingChargeAmount
	      });
	    }

	    this.setState({
	      tableProductRow: this.ProductRow(tableData)
	    });
	  },

	  backBooking: function backBooking() {
	    console.log("back to booking");
	    window.location.href = '/booking-transport/#/transport/booking';
	  },

	  // genShipmentReport: function(){
	  //   console.log("genShipmentReport Id = ", this.state.bookingId);
	  //   window.location.href='/booking-transport/#/transport/report/booking_id/'+this.state.bookingId;
	  // },

	  render: function render() {

	    return React.createElement(
	      'div',
	      { id: 'bodysignin' },
	      React.createElement(
	        'div',
	        { className: 'onex-top-bar' },
	        React.createElement('div', { className: 'onex-top-bar-left' }),
	        React.createElement(
	          'div',
	          { className: 'top-bar-right' },
	          React.createElement(
	            'ul',
	            { className: 'menu' },
	            React.createElement(
	              'li',
	              null,
	              React.createElement(
	                'div',
	                { className: 'space' },
	                '.'
	              )
	            )
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { id: 'content-panel-signin', style: { 'width': '770px', 'height': '603px', 'overflow': 'scroll' } },
	        React.createElement(
	          'div',
	          { style: { 'width': '750px', 'marginTop': '5px' } },
	          React.createElement(
	            'div',
	            { style: { 'width': '750px', 'height': '263px', 'border': '2px solid #e2e2e2', 'border-radius': '7px', 'float': 'left' } },
	            React.createElement(
	              'div',
	              { style: { 'width': '340px', 'height': '263px', 'border-right': '2px solid #e2e2e2', 'float': 'left' } },
	              React.createElement(
	                'div',
	                { style: { 'width': '100%' } },
	                React.createElement('div', { className: 'success-box', style: { width: '100%', height: '35px', marginTop: '57px' } }),
	                React.createElement('div', { style: { 'clear': 'both' } }),
	                React.createElement('div', { style: { 'width': '100%', 'height': '20px', 'float': 'left' } }),
	                React.createElement(
	                  'div',
	                  { style: { 'width': '100%', 'height': '28px', 'float': 'left' } },
	                  React.createElement(
	                    'p',
	                    { style: { 'text-align': 'center', 'font-weight': 'bold' } },
	                    'Booking No. : ',
	                    this.state.bookingData.bookingNo
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { style: { 'width': '100%', 'height': '28px', 'float': 'left' } },
	                  React.createElement(
	                    'p',
	                    { style: { 'text-align': 'center', 'font-weight': 'bold' } },
	                    'Waybill No. : ',
	                    this.state.bookingData.bookingWaybill
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { style: { 'width': '100%', 'height': '28px', 'float': 'left' } },
	                  React.createElement(
	                    'p',
	                    { style: { 'text-align': 'center', 'font-weight': 'bold' } },
	                    'Booking Date : ',
	                    this.state.bookingData.bookingDate
	                  )
	                ),
	                React.createElement('div', { style: { 'clear': 'both' } })
	              )
	            ),
	            React.createElement(
	              'div',
	              { style: { 'width': '408px', 'height': '263px', 'float': 'right' } },
	              React.createElement(
	                'div',
	                { style: { 'width': '100%', 'height': '50%', 'border-bottom': '2px solid #e2e2e2' } },
	                React.createElement('div', { className: 'car', style: { 'width': '25%', 'height': '85%', 'float': 'left', marginTop: '12px' } }),
	                React.createElement(
	                  'div',
	                  { style: { 'width': '73%', 'height': '21%', 'float': 'right', paddingTop: '3px', paddingBottom: '2px', paddingLeft: '5px' } },
	                  React.createElement(
	                    'p',
	                    null,
	                    React.createElement(
	                      'label',
	                      { style: { 'font-size': '1.2em', 'font-weight': 'bold' } },
	                      'From: '
	                    ),
	                    React.createElement(
	                      'label',
	                      { style: { 'font-size': '1.2em' } },
	                      this.state.bookingData.bookingFrom
	                    )
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { style: { 'width': '73%', 'height': '55%', 'float': 'right', paddingLeft: '5px' } },
	                  React.createElement(
	                    'p',
	                    null,
	                    React.createElement(
	                      'label',
	                      { style: { 'font-size': '0.8em' } },
	                      React.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.bookingData.bookingSender } })
	                    )
	                  )
	                )
	              ),
	              React.createElement(
	                'div',
	                { style: { 'width': '100%', 'height': '50%' } },
	                React.createElement('div', { className: 'to-box', style: { 'width': '25%', 'height': '85%', 'float': 'left', marginTop: '12px' } }),
	                React.createElement(
	                  'div',
	                  { style: { 'width': '73%', 'height': '21%', 'float': 'right', paddingTop: '3px', paddingBottom: '2px', paddingLeft: '5px' } },
	                  React.createElement(
	                    'p',
	                    null,
	                    React.createElement(
	                      'label',
	                      { style: { 'font-size': '1.2em', 'font-weight': 'bold' } },
	                      'To: '
	                    ),
	                    React.createElement(
	                      'label',
	                      { style: { 'font-size': '1.2em' } },
	                      this.state.bookingData.bookingTo
	                    )
	                  )
	                ),
	                React.createElement(
	                  'div',
	                  { style: { 'width': '73%', 'height': '55%', 'float': 'right', paddingLeft: '5px' } },
	                  React.createElement(
	                    'p',
	                    null,
	                    React.createElement(
	                      'label',
	                      { style: { 'font-size': '0.8em' } },
	                      React.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.bookingData.bookingReceipient } })
	                    )
	                  )
	                )
	              )
	            )
	          ),
	          React.createElement('div', { className: 'booking-detail-tab', style: { 'width': '100%', 'height': '52px', 'float': 'left', marginTop: '10px', marginBottom: '5px' } }),
	          React.createElement('br', null),
	          React.createElement(
	            'div',
	            { style: { 'float': 'left' } },
	            React.createElement(
	              _table2.default,
	              {
	                fixedHeader: this.state.fixedHeader,
	                fixedFooter: this.state.fixedFooter,
	                selectable: this.state.selectable,
	                multiSelectable: this.state.multiSelectable,
	                displaySelectAll: this.state.displaySelectAll,
	                onRowSelection: this._onRowSelection
	              },
	              React.createElement(
	                _tableHeader2.default,
	                { selectAllSelected: this.state.selectAllSelected,
	                  adjustForCheckbox: this.state.hAdjustForCheckbox,
	                  displaySelectAll: this.state.displayRowCheckbox,
	                  style: { 'border-bottom': '1px dotted #e2e2e2' }
	                },
	                React.createElement(
	                  _tableRow2.default,
	                  { style: { 'padding': '0px', 'height': '49px', 'border-bottom': '1px dotted #e2e2e2' } },
	                  React.createElement(_tableHeaderColumn2.default, { style: { 'width': '30%', 'textAlign': 'center', 'padding': '0px', 'height': '49px' } }),
	                  React.createElement(_tableHeaderColumn2.default, { className: 'in-box-1', style: { 'width': '11%', 'textAlign': 'center', 'padding': '0px', 'height': '49px' } }),
	                  React.createElement(_tableHeaderColumn2.default, { className: 'in-box-2', style: { 'width': '11%', 'textAlign': 'center', 'padding': '0px', 'height': '49px' } }),
	                  React.createElement(
	                    _tableHeaderColumn2.default,
	                    { className: 'head-box-tb', style: { 'width': '11%', 'textAlign': 'center', 'padding': '0px', 'height': '49px' } },
	                    React.createElement(
	                      'h4',
	                      null,
	                      'WIDTH'
	                    )
	                  ),
	                  React.createElement(
	                    _tableHeaderColumn2.default,
	                    { className: 'head-box-tb2', style: { 'width': '11%', 'textAlign': 'center', 'padding': '0px', 'height': '49px' } },
	                    React.createElement(
	                      'h4',
	                      null,
	                      'DEPTH'
	                    )
	                  ),
	                  React.createElement(
	                    _tableHeaderColumn2.default,
	                    { className: 'head-box-tb3', style: { 'width': '11%', 'textAlign': 'center', 'padding': '0px', 'height': '49px' } },
	                    React.createElement(
	                      'h4',
	                      null,
	                      'HEIGHT'
	                    )
	                  ),
	                  React.createElement(
	                    _tableHeaderColumn2.default,
	                    { className: 'head-box-tb4', style: { 'width': '11%', 'textAlign': 'center', 'padding': '0px', 'height': '49px' } },
	                    React.createElement(
	                      'h4',
	                      null,
	                      'PRICE'
	                    )
	                  ),
	                  React.createElement(_tableHeaderColumn2.default, { style: { 'width': '4%', 'textAlign': 'center', 'padding': '0px', 'height': '49px' } })
	                )
	              ),
	              React.createElement(
	                _tableBody2.default,
	                {
	                  deselectOnClickaway: this.state.deselectOnClickaway,
	                  showRowHover: this.state.showRowHover,
	                  stripedRows: this.state.stripedRows,
	                  displayRowCheckbox: this.state.displayRowCheckbox
	                },
	                this.state.tableProductRow
	              ),
	              React.createElement(
	                _tableFooter2.default,
	                {
	                  adjustForCheckbox: this.state.adjustForCheckbox
	                },
	                React.createElement(
	                  _tableRow2.default,
	                  { style: { 'padding': '0px', 'height': '35px', 'border-bottom': '1px dotted #e2e2e2', 'border-top': '0px dotted #e2e2e2' } },
	                  React.createElement(
	                    _tableRowColumn2.default,
	                    { style: { 'padding': '0px', 'height': '35px', 'vertical-align': 'middle' } },
	                    React.createElement(
	                      'h5',
	                      null,
	                      'Total'
	                    )
	                  ),
	                  React.createElement(_tableRowColumn2.default, { style: { 'padding': '0px', 'height': '35px', 'vertical-align': 'middle' } }),
	                  React.createElement(_tableRowColumn2.default, { style: { 'padding': '0px', 'height': '35px', 'vertical-align': 'middle' } }),
	                  React.createElement(_tableRowColumn2.default, { className: 'in-box-tb', style: { 'padding': '0px', 'height': '35px', 'vertical-align': 'middle' } }),
	                  React.createElement(_tableRowColumn2.default, { className: 'in-box-tb2', style: { 'padding': '0px', 'height': '35px', 'vertical-align': 'middle' } }),
	                  React.createElement(_tableRowColumn2.default, { className: 'in-box-tb3', style: { 'padding': '0px', 'height': '35px', 'vertical-align': 'middle' } }),
	                  React.createElement(
	                    _tableRowColumn2.default,
	                    { className: 'in-box-tb4', style: { 'textAlign': 'right', 'padding': '0px', 'padding-right': '15px', 'height': '35px', 'vertical-align': 'middle' } },
	                    React.createElement(
	                      'h5',
	                      null,
	                      helper.numberFormat(this.state.bookingData.bookingTotalAmount, 2)
	                    )
	                  ),
	                  React.createElement(
	                    _tableRowColumn2.default,
	                    { style: { 'padding': '0px', 'height': '35px', 'vertical-align': 'middle', 'textAlign': 'center' } },
	                    React.createElement(
	                      'h5',
	                      null,
	                      this.state.bookingData.bookingCurrentcy
	                    )
	                  )
	                )
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: { 'width': '550px', 'height': '52px', 'float': 'left', 'margin-top': '15px', 'padding-left': '200px' } },
	            React.createElement(
	              'div',
	              { style: { 'float': 'left' } },
	              React.createElement(_raisedButton2.default, { label: 'PRINT', secondary: true, style: style, onMouseDown: this.genShipmentReport })
	            ),
	            React.createElement(
	              'div',
	              { style: { 'float': 'left', 'width': '20px', 'height': '52px' } },
	              ' '
	            ),
	            React.createElement(
	              'div',
	              { style: { 'float': 'left' } },
	              React.createElement(_raisedButton2.default, { label: 'FINISH', secondary: true, style: style, onMouseDown: this.backBooking })
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = FinishBooking;

/***/ }

});