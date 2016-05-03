webpackJsonp([33,135],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(655);


/***/ },

/***/ 207:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var extend  = __webpack_require__(208);
	var isArray = __webpack_require__(209).isArray;
	var isDate  = __webpack_require__(209).isDate;
	var sprintf = __webpack_require__(212).sprintf;
	var events  = __webpack_require__(213);
	var except  = __webpack_require__(214);

	var strftime = __webpack_require__(216);

	var translationScope = 'counterpart';

	function isString(val) {
	  return typeof val === 'string' || Object.prototype.toString.call(val) === '[object String]';
	}

	function isFunction(val) {
	  return typeof val === 'function' || Object.prototype.toString.call(val) === '[object Function]';
	}

	function isPlainObject(val) {
	  return Object.prototype.toString.call(val) === '[object Object]';
	}

	function isSymbol(key) {
	  return isString(key) && key[0] === ':';
	}

	function hasOwnProp(obj, key) {
	  return Object.prototype.hasOwnProperty.call(obj, key);
	}

	function getEntry(translations, keys) {
	  return keys.reduce(function(result, key) {
	    if (isPlainObject(result) && hasOwnProp(result, key)) {
	      return result[key];
	    } else {
	      return null;
	    }
	  }, translations);
	}

	function Counterpart() {
	  this._registry = {
	    locale: 'en',
	    fallbackLocale: null,
	    scope: null,
	    translations: {},
	    interpolations: {},
	    normalizedKeys: {},
	    separator: '.'
	  };

	  this.registerTranslations('en', __webpack_require__(219));
	  this.setMaxListeners(0);
	}

	extend(Counterpart.prototype, events.EventEmitter.prototype);

	Counterpart.prototype.getLocale = function() {
	  return this._registry.locale;
	};

	Counterpart.prototype.setLocale = function(value) {
	  var previous = this._registry.locale;

	  if (previous != value) {
	    this._registry.locale = value;
	    this.emit('localechange', value, previous);
	  }

	  return previous;
	};

	Counterpart.prototype.getFallbackLocale = function() {
	  return this._registry.fallbackLocale;
	};

	Counterpart.prototype.setFallbackLocale = function(value) {
	  var previous = this._registry.fallbackLocale;
	  this._registry.fallbackLocale = value;
	  return previous;
	};

	Counterpart.prototype.getAvailableLocales = function() {
	  return this._registry.availableLocales || Object.keys(this._registry.translations);
	};

	Counterpart.prototype.setAvailableLocales = function(value) {
	  var previous = this.getAvailableLocales();
	  this._registry.availableLocales = value;
	  return previous;
	};

	Counterpart.prototype.getSeparator = function() {
	  return this._registry.separator;
	};

	Counterpart.prototype.setSeparator = function(value) {
	  var previous = this._registry.separator;
	  this._registry.separator = value;
	  return previous;
	};

	Counterpart.prototype.registerTranslations = function(locale, data) {
	  var translations = {};
	  translations[locale] = data;
	  extend(true, this._registry.translations, translations);
	  return translations;
	};

	Counterpart.prototype.registerInterpolations = function(data) {
	  return extend(true, this._registry.interpolations, data);
	};

	Counterpart.prototype.onLocaleChange =
	Counterpart.prototype.addLocaleChangeListener = function(callback) {
	  this.addListener('localechange', callback);
	};

	Counterpart.prototype.offLocaleChange =
	Counterpart.prototype.removeLocaleChangeListener = function(callback) {
	  this.removeListener('localechange', callback);
	};

	Counterpart.prototype.translate = function(key, options) {
	  if (!isArray(key) && !isString(key) || !key.length) {
	    throw new Error('invalid argument: key');
	  }

	  if (isSymbol(key)) {
	    key = key.substr(1);
	  }

	  options = extend(true, {}, options);

	  var locale = options.locale || this._registry.locale;
	  delete options.locale;

	  var scope = options.scope || this._registry.scope;
	  delete options.scope;

	  var separator = options.separator || this._registry.separator;
	  delete options.separator;

	  var fallbackLocale = options.fallbackLocale || this._registry.fallbackLocale;
	  delete options.fallbackLocale;

	  var keys = this._normalizeKeys(locale, scope, key, separator);

	  var entry = getEntry(this._registry.translations, keys);

	  if (entry === null && options.fallback) {
	    entry = this._fallback(locale, scope, key, options.fallback, options);
	  }

	  if (entry === null && fallbackLocale && locale !== fallbackLocale) {
	    var fallbackKeys = this._normalizeKeys(fallbackLocale, scope, key, separator);
	    entry = getEntry(this._registry.translations, fallbackKeys);

	    if (entry) {
	      locale = fallbackLocale;
	    }
	  }

	  if (entry === null) {
	//    entry = 'missing translation: ' + keys.join(separator);
	    entry = keys.join(separator);
	  }

	  entry = this._pluralize(locale, entry, options.count);

	  if (options.interpolate !== false) {
	    entry = this._interpolate(entry, options);
	  }

	  return entry;
	};

	Counterpart.prototype.localize = function(object, options) {
	  if (!isDate(object)) {
	    throw new Error('invalid argument: object must be a date');
	  }

	  options = extend(true, {}, options);

	  var locale  = options.locale  || this._registry.locale;
	  var scope   = options.scope   || translationScope;
	  var type    = options.type    || 'datetime';
	  var format  = options.format  || 'default';

	  options = { locale: locale, scope: scope, interpolate: false };
	  format  = this.translate(['formats', type, format], extend(true, {}, options));

	  return strftime(object, format, this.translate('names', options));
	};

	Counterpart.prototype._pluralize = function(locale, entry, count) {
	  if (typeof entry !== 'object' || entry === null || typeof count !== 'number') {
	    return entry;
	  }

	  var pluralizeFunc = this.translate('pluralize', { locale: locale, scope: translationScope });

	  if (Object.prototype.toString.call(pluralizeFunc) !== '[object Function]') {
	    return pluralizeFunc;
	  }

	  return pluralizeFunc(entry, count);
	};

	Counterpart.prototype.withLocale = function(locale, callback, context) {
	  var previous = this._registry.locale;
	  this._registry.locale = locale;
	  var result = callback.call(context);
	  this._registry.locale = previous;
	  return result;
	};

	Counterpart.prototype.withScope = function(scope, callback, context) {
	  var previous = this._registry.scope;
	  this._registry.scope = scope;
	  var result = callback.call(context);
	  this._registry.scope = previous;
	  return result;
	};

	Counterpart.prototype.withSeparator = function(separator, callback, context) {
	  var previous = this.setSeparator(separator);
	  var result = callback.call(context);
	  this.setSeparator(previous);
	  return result;
	};

	Counterpart.prototype._normalizeKeys = function(locale, scope, key, separator) {
	  var keys = [];

	  keys = keys.concat(this._normalizeKey(locale, separator));
	  keys = keys.concat(this._normalizeKey(scope, separator));
	  keys = keys.concat(this._normalizeKey(key, separator));

	  return keys;
	};

	Counterpart.prototype._normalizeKey = function(key, separator) {
	  this._registry.normalizedKeys[separator] = this._registry.normalizedKeys[separator] || {};

	  this._registry.normalizedKeys[separator][key] = this._registry.normalizedKeys[separator][key] || (function(key) {
	    if (isArray(key)) {
	      var normalizedKeyArray = key.map(function(k) { return this._normalizeKey(k, separator); }.bind(this));

	      return [].concat.apply([], normalizedKeyArray);
	    } else {
	      if (typeof key === 'undefined' || key === null) {
	        return [];
	      }

	      var keys = key.split(separator);

	      for (var i = keys.length - 1; i >= 0; i--) {
	        if (keys[i] === '') {
	          keys.splice(i, 1);
	        }
	      }

	      return keys;
	    }
	  }.bind(this))(key);

	  return this._registry.normalizedKeys[separator][key];
	};

	Counterpart.prototype._interpolate = function(entry, values) {
	  if (typeof entry !== 'string') {
	    return entry;
	  }

	  return sprintf(entry, extend({}, this._registry.interpolations, values));
	};

	Counterpart.prototype._resolve = function(locale, scope, object, subject, options) {
	  options = options || {};

	  if (options.resolve === false) {
	    return subject;
	  }

	  var result;

	  if (isSymbol(subject)) {
	    result = this.translate(subject, extend({}, options, { locale: locale, scope: scope }));
	  } else if (isFunction(subject)) {
	    var dateOrTime;

	    if (options.object) {
	      dateOrTime = options.object;
	      delete options.object;
	    } else {
	      dateOrTime = object;
	    }

	    result = this._resolve(locale, scope, object, subject(dateOrTime, options));
	  } else {
	    result = subject;
	  }

	  return /^missing translation:/.test(result) ? null : result;
	};

	Counterpart.prototype._fallback = function(locale, scope, object, subject, options) {
	  options = except(options, 'fallback');

	  if (isArray(subject)) {
	    for (var i = 0, ii = subject.length; i < ii; i++) {
	      var result = this._resolve(locale, scope, object, subject[i], options);

	      if (result) {
	        return result;
	      }
	    }

	    return null;
	  } else {
	    return this._resolve(locale, scope, object, subject, options);
	  }
	};

	var instance = new Counterpart();

	function translate() {
	  return instance.translate.apply(instance, arguments);
	}

	extend(translate, instance, {
	  Instance: Counterpart
	});

	module.exports = translate;


/***/ },

/***/ 208:
/***/ function(module, exports) {

	'use strict';

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}

		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },

/***/ 209:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(210);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(211);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5)))

/***/ },

/***/ 210:
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },

/***/ 211:
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },

/***/ 212:
/***/ function(module, exports) {

	/**
	sprintf() for JavaScript 0.7-beta1
	http://www.diveintojavascript.com/projects/javascript-sprintf

	Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
	All rights reserved.

	Redistribution and use in source and binary forms, with or without
	modification, are permitted provided that the following conditions are met:
	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.
	    * Neither the name of sprintf() for JavaScript nor the
	      names of its contributors may be used to endorse or promote products
	      derived from this software without specific prior written permission.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


	Changelog:
	2010.11.07 - 0.7-beta1-node
	  - converted it to a node.js compatible module

	2010.09.06 - 0.7-beta1
	  - features: vsprintf, support for named placeholders
	  - enhancements: format cache, reduced global namespace pollution

	2010.05.22 - 0.6:
	 - reverted to 0.4 and fixed the bug regarding the sign of the number 0
	 Note:
	 Thanks to Raphael Pigulla <raph (at] n3rd [dot) org> (http://www.n3rd.org/)
	 who warned me about a bug in 0.5, I discovered that the last update was
	 a regress. I appologize for that.

	2010.05.09 - 0.5:
	 - bug fix: 0 is now preceeded with a + sign
	 - bug fix: the sign was not at the right position on padded results (Kamal Abdali)
	 - switched from GPL to BSD license

	2007.10.21 - 0.4:
	 - unit test and patch (David Baird)

	2007.09.17 - 0.3:
	 - bug fix: no longer throws exception on empty paramenters (Hans Pufal)

	2007.09.11 - 0.2:
	 - feature: added argument swapping

	2007.04.03 - 0.1:
	 - initial release
	**/

	var sprintf = (function() {
		function get_type(variable) {
			return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
		}
		function str_repeat(input, multiplier) {
			for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
			return output.join('');
		}

		var str_format = function() {
			if (!str_format.cache.hasOwnProperty(arguments[0])) {
				str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
			}
			return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
		};

		// convert object to simple one line string without indentation or
		// newlines. Note that this implementation does not print array
		// values to their actual place for sparse arrays. 
		//
		// For example sparse array like this
		//    l = []
		//    l[4] = 1
		// Would be printed as "[1]" instead of "[, , , , 1]"
		// 
		// If argument 'seen' is not null and array the function will check for 
		// circular object references from argument.
		str_format.object_stringify = function(obj, depth, maxdepth, seen) {
			var str = '';
			if (obj != null) {
				switch( typeof(obj) ) {
				case 'function': 
					return '[Function' + (obj.name ? ': '+obj.name : '') + ']';
				    break;
				case 'object':
					if ( obj instanceof Error) { return '[' + obj.toString() + ']' };
					if (depth >= maxdepth) return '[Object]'
					if (seen) {
						// add object to seen list
						seen = seen.slice(0)
						seen.push(obj);
					}
					if (obj.length != null) { //array
						str += '[';
						var arr = []
						for (var i in obj) {
							if (seen && seen.indexOf(obj[i]) >= 0) arr.push('[Circular]');
							else arr.push(str_format.object_stringify(obj[i], depth+1, maxdepth, seen));
						}
						str += arr.join(', ') + ']';
					} else if ('getMonth' in obj) { // date
						return 'Date(' + obj + ')';
					} else { // object
						str += '{';
						var arr = []
						for (var k in obj) { 
							if(obj.hasOwnProperty(k)) {
								if (seen && seen.indexOf(obj[k]) >= 0) arr.push(k + ': [Circular]');
								else arr.push(k +': ' +str_format.object_stringify(obj[k], depth+1, maxdepth, seen)); 
							}
						}
						str += arr.join(', ') + '}';
					}
					return str;
					break;
				case 'string':				
					return '"' + obj + '"';
					break
				}
			}
			return '' + obj;
		}

		str_format.format = function(parse_tree, argv) {
			var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
			for (i = 0; i < tree_length; i++) {
				node_type = get_type(parse_tree[i]);
				if (node_type === 'string') {
					output.push(parse_tree[i]);
				}
				else if (node_type === 'array') {
					match = parse_tree[i]; // convenience purposes only
					if (match[2]) { // keyword argument
						arg = argv[cursor];
						for (k = 0; k < match[2].length; k++) {
							if (!arg.hasOwnProperty(match[2][k])) {
								throw new Error(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
							}
							arg = arg[match[2][k]];
						}
					}
					else if (match[1]) { // positional argument (explicit)
						arg = argv[match[1]];
					}
					else { // positional argument (implicit)
						arg = argv[cursor++];
					}

					if (/[^sO]/.test(match[8]) && (get_type(arg) != 'number')) {
						throw new Error(sprintf('[sprintf] expecting number but found %s "' + arg + '"', get_type(arg)));
					}
					switch (match[8]) {
						case 'b': arg = arg.toString(2); break;
						case 'c': arg = String.fromCharCode(arg); break;
						case 'd': arg = parseInt(arg, 10); break;
						case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
						case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
					    case 'O': arg = str_format.object_stringify(arg, 0, parseInt(match[7]) || 5); break;
						case 'o': arg = arg.toString(8); break;
						case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
						case 'u': arg = Math.abs(arg); break;
						case 'x': arg = arg.toString(16); break;
						case 'X': arg = arg.toString(16).toUpperCase(); break;
					}
					arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
					pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
					pad_length = match[6] - String(arg).length;
					pad = match[6] ? str_repeat(pad_character, pad_length) : '';
					output.push(match[5] ? arg + pad : pad + arg);
				}
			}
			return output.join('');
		};

		str_format.cache = {};

		str_format.parse = function(fmt) {
			var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
			while (_fmt) {
				if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
					parse_tree.push(match[0]);
				}
				else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
					parse_tree.push('%');
				}
				else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosOuxX])/.exec(_fmt)) !== null) {
					if (match[2]) {
						arg_names |= 1;
						var field_list = [], replacement_field = match[2], field_match = [];
						if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
							field_list.push(field_match[1]);
							while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
								if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
									field_list.push(field_match[1]);
								}
								else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
									field_list.push(field_match[1]);
								}
								else {
									throw new Error('[sprintf] ' + replacement_field);
								}
							}
						}
						else {
	                        throw new Error('[sprintf] ' + replacement_field);
						}
						match[2] = field_list;
					}
					else {
						arg_names |= 2;
					}
					if (arg_names === 3) {
						throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported');
					}
					parse_tree.push(match);
				}
				else {
					throw new Error('[sprintf] ' + _fmt);
				}
				_fmt = _fmt.substring(match[0].length);
			}
			return parse_tree;
		};

		return str_format;
	})();

	var vsprintf = function(fmt, argv) {
		var argvClone = argv.slice();
		argvClone.unshift(fmt);
		return sprintf.apply(null, argvClone);
	};

	module.exports = sprintf;
	sprintf.sprintf = sprintf;
	sprintf.vsprintf = vsprintf;


/***/ },

/***/ 213:
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },

/***/ 214:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ap      = Array.prototype;
	var concat  = ap.concat;
	var slice   = ap.slice;
	var indexOf = __webpack_require__(215);

	function except(object) {
	  var result = {};
	  var keys = concat.apply(ap, slice.call(arguments, 1));

	  for (var key in object) {
	    if (indexOf(keys, key) === -1) {
	      result[key] = object[key];
	    }
	  }

	  return result;
	}

	module.exports = except;


/***/ },

/***/ 215:
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;

	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },

/***/ 216:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var dateNames = __webpack_require__(217);

	function strftime(date, format, names) {
	  var timestamp = date.getTime();

	  names = names || dateNames;

	  return format.replace(/%([-_0]?.)/g, function(_, c) {
	    var padding = null;

	    if (c.length == 2) {
	      switch (c[0]) {
	        case '-': padding = '';  break;
	        case '_': padding = ' '; break;
	        case '0': padding = '0'; break;
	        default: return _; // should never reach this one
	      }

	      c = c[1];
	    }

	    switch (c) {
	      case 'A': return names.days[date.getDay()];
	      case 'a': return names.abbreviated_days[date.getDay()];
	      case 'B': return names.months[date.getMonth()];
	      case 'b': return names.abbreviated_months[date.getMonth()];
	      case 'C': return pad(Math.floor(date.getFullYear() / 100), padding);
	      case 'D': return strftime(date, '%m/%d/%y');
	      case 'd': return pad(date.getDate(), padding);
	      case 'e': return date.getDate();
	      case 'F': return strftime(date, '%Y-%m-%d');
	      case 'H': return pad(date.getHours(), padding);
	      case 'h': return names.abbreviated_months[date.getMonth()];
	      case 'I': return pad(hours12(date), padding);
	      case 'j': return pad(Math.ceil((date.getTime() - (new Date(date.getFullYear(), 0, 1)).getTime()) / (1000 * 60 * 60 * 24)), 3);
	      case 'k': return pad(date.getHours(), padding === null ? ' ' : padding);
	      case 'L': return pad(Math.floor(timestamp % 1000), 3);
	      case 'l': return pad(hours12(date), padding === null ? ' ' : padding);
	      case 'M': return pad(date.getMinutes(), padding);
	      case 'm': return pad(date.getMonth() + 1, padding);
	      case 'n': return '\n';
	      case 'o': return String(date.getDate()) + ordinal(date.getDate());
	      case 'P': return date.getHours() < 12 ? names.am.toLowerCase() : names.pm.toLowerCase();
	      case 'p': return date.getHours() < 12 ? names.am.toUpperCase() : names.pm.toUpperCase();
	      case 'Q': return ''+(date.getFullYear()+543);
	      case 'q': return (''+(date.getFullYear()+543)).substr(-2);
	      case 'R': return strftime(date, '%H:%M');
	      case 'r': return strftime(date, '%I:%M:%S %p');
	      case 'S': return pad(date.getSeconds(), padding);
	      case 's': return Math.floor(timestamp / 1000);
	      case 'T': return strftime(date, '%H:%M:%S');
	      case 't': return '\t';
	      case 'U': return pad(weekNumber(date, 'sunday'), padding);
	      case 'u': return date.getDay() === 0 ? 7 : date.getDay();
	      case 'v': return strftime(date, '%e-%b-%Y');
	      case 'W': return pad(weekNumber(date, 'monday'), padding);
	      case 'w': return date.getDay();
	      case 'Y': return date.getFullYear();
	      case 'y': var y = String(date.getFullYear()); return y.slice(y.length - 2);
	      case 'Z': var tzString = date.toString().match(/\((\w+)\)/); return tzString && tzString[1] || '';
	      case 'z': var off = date.getTimezoneOffset(); return (off > 0 ? '-' : '+') + pad(Math.round(Math.abs(off / 60)), 2) + ':' + pad(off % 60, 2);
	      default: return c;
	    }
	  });
	}

	function pad(n, padding, length) {
	  if (typeof padding === 'number') {
	    length = padding;
	    padding = '0';
	  }

	  if (padding === null) {
	    padding = '0';
	  }

	  length = length || 2;

	  var s = String(n);

	  if (padding) {
	    while (s.length < length) {
	      s = padding + s;
	    }
	  }

	  return s;
	}

	function hours12(date) {
	  var hour = date.getHours();

	  if (hour === 0) {
	    hour = 12;
	  } else if (hour > 12) {
	    hour -= 12;
	  }

	  return hour;
	}

	function ordinal(n) {
	  var i = n % 10, ii = n % 100;

	  if ((ii >= 11 && ii <= 13) || i === 0 || i >= 4) {
	    return 'th';
	  }

	  switch (i) {
	    case 1: return 'st';
	    case 2: return 'nd';
	    case 3: return 'rd';
	  }
	}

	function weekNumber(date, firstWeekday) {
	  firstWeekday = firstWeekday || 'sunday';

	  var wday = date.getDay();

	  if (firstWeekday == 'monday') {
	    if (wday === 0) { // Sunday
	      wday = 6;
	    } else {
	      wday--;
	    }
	  }

	  var
	    firstDayOfYear = new Date(date.getFullYear(), 0, 1),
	    yday = (date - firstDayOfYear) / 86400000,
	    weekNum = (yday + 7 - wday) / 7;

	  return Math.floor(weekNum);
	}

	module.exports = strftime;


/***/ },

/***/ 217:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	module.exports = __webpack_require__(218);


/***/ },

/***/ 218:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  __locale: "en",
	  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	  abbreviated_days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	  abbreviated_months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	  am: 'AM',
	  pm: 'PM'
	};


/***/ },

/***/ 219:
/***/ function(module, exports, __webpack_require__) {

	// The translations in this file are added by default.

	'use strict';

	module.exports = {
	  counterpart: {
	    names: __webpack_require__(218),
	    pluralize: __webpack_require__(220),

	    formats: {
	      date: {
	        'default':  '%a, %e %b %Y',
	        long:       '%A, %B %o, %Y',
	        short:      '%b %e'
	      },

	      time: {
	        'default':  '%H:%M',
	        long:       '%H:%M:%S %z',
	        short:      '%H:%M'
	      },

	      datetime: {
	        'default':  '%a, %e %b %Y %H:%M',
	        long:       '%A, %B %o, %Y %H:%M:%S %z',
	        short:      '%e %b %H:%M'
	      }
	    }
	  }
	};


/***/ },

/***/ 220:
/***/ function(module, exports) {

	'use strict';

	module.exports = function(entry, count) {
	  var key;

	  if (count === 0 && 'zero' in entry) {
	    key = 'zero';
	  }

	  key = key || (count === 1 ? 'one' : 'other');

	  return entry[key];
	};


/***/ },

/***/ 221:
/***/ function(module, exports, __webpack_require__) {

	var cookie = __webpack_require__(222);

	var _rawCookie = {};
	var _res = undefined;

	function load(name, doNotParse) {
	  var cookies = (typeof document === 'undefined') ? _rawCookie : cookie.parse(document.cookie);
	  var cookieVal = cookies && cookies[name];

	  if (!doNotParse) {
	    try {
	      cookieVal = JSON.parse(cookieVal);
	    } catch(e) {
	      // Not serialized object
	    }
	  }

	  return cookieVal;
	}

	function save(name, val, opt) {
	  _rawCookie[name] = val;

	  // allow you to work with cookies as objects.
	  if (typeof val === 'object') {
	    _rawCookie[name] = JSON.stringify(val);
	  }

	  // Cookies only work in the browser
	  if (typeof document !== 'undefined') {
	    document.cookie = cookie.serialize(name, _rawCookie[name], opt);
	  }

	  if (_res && _res.cookie) {
	    _res.cookie(name, val, opt);
	  }
	}

	function remove(name, opt) {
	  delete _rawCookie[name];

	  if (typeof opt === 'undefined') {
	    opt = {};
	  } else if (typeof opt === 'string') {
	    // Will be deprecated in future versions
	    opt = { path: opt };
	  }

	  if (typeof document !== 'undefined') {
	    opt.expires = new Date(1970, 1, 1, 0, 0, 1);
	    document.cookie = cookie.serialize(name, '', opt);
	  }

	  if (_res && _res.clearCookie) {
	    _res.clearCookie(name, opt);
	  }
	}

	function setRawCookie(rawCookie) {
	  if (rawCookie) {
	    _rawCookie = cookie.parse(rawCookie);
	  } else {
	    _rawCookie = {};
	  }
	}

	function plugToRequest(req, res) {
	  if (req.cookie) {
	    _rawCookie = req.cookie;
	  } else if (req.headers && req.headers.cookie) {
	    setRawCookie(req.headers.cookie);
	  } else {
	    _rawCookie = {};
	  }

	  _res = res;
	}

	var reactCookie = {
	  load: load,
	  save: save,
	  remove: remove,
	  setRawCookie: setRawCookie,
	  plugToRequest: plugToRequest
	};

	if (typeof window !== 'undefined') {
	  window['reactCookie'] = reactCookie;
	}

	module.exports = reactCookie;


/***/ },

/***/ 222:
/***/ function(module, exports) {

	/*!
	 * cookie
	 * Copyright(c) 2012-2014 Roman Shtylman
	 * Copyright(c) 2015 Douglas Christopher Wilson
	 * MIT Licensed
	 */

	/**
	 * Module exports.
	 * @public
	 */

	exports.parse = parse;
	exports.serialize = serialize;

	/**
	 * Module variables.
	 * @private
	 */

	var decode = decodeURIComponent;
	var encode = encodeURIComponent;

	/**
	 * RegExp to match field-content in RFC 7230 sec 3.2
	 *
	 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
	 * field-vchar   = VCHAR / obs-text
	 * obs-text      = %x80-FF
	 */

	var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

	/**
	 * Parse a cookie header.
	 *
	 * Parse the given cookie header string into an object
	 * The object has the various cookies as keys(names) => values
	 *
	 * @param {string} str
	 * @param {object} [options]
	 * @return {object}
	 * @public
	 */

	function parse(str, options) {
	  if (typeof str !== 'string') {
	    throw new TypeError('argument str must be a string');
	  }

	  var obj = {}
	  var opt = options || {};
	  var pairs = str.split(/; */);
	  var dec = opt.decode || decode;

	  pairs.forEach(function(pair) {
	    var eq_idx = pair.indexOf('=')

	    // skip things that don't look like key=value
	    if (eq_idx < 0) {
	      return;
	    }

	    var key = pair.substr(0, eq_idx).trim()
	    var val = pair.substr(++eq_idx, pair.length).trim();

	    // quoted values
	    if ('"' == val[0]) {
	      val = val.slice(1, -1);
	    }

	    // only assign once
	    if (undefined == obj[key]) {
	      obj[key] = tryDecode(val, dec);
	    }
	  });

	  return obj;
	}

	/**
	 * Serialize data into a cookie header.
	 *
	 * Serialize the a name value pair into a cookie string suitable for
	 * http headers. An optional options object specified cookie parameters.
	 *
	 * serialize('foo', 'bar', { httpOnly: true })
	 *   => "foo=bar; httpOnly"
	 *
	 * @param {string} name
	 * @param {string} val
	 * @param {object} [options]
	 * @return {string}
	 * @public
	 */

	function serialize(name, val, options) {
	  var opt = options || {};
	  var enc = opt.encode || encode;

	  if (!fieldContentRegExp.test(name)) {
	    throw new TypeError('argument name is invalid');
	  }

	  var value = enc(val);

	  if (value && !fieldContentRegExp.test(value)) {
	    throw new TypeError('argument val is invalid');
	  }

	  var pairs = [name + '=' + value];

	  if (null != opt.maxAge) {
	    var maxAge = opt.maxAge - 0;
	    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
	    pairs.push('Max-Age=' + maxAge);
	  }

	  if (opt.domain) {
	    if (!fieldContentRegExp.test(opt.domain)) {
	      throw new TypeError('option domain is invalid');
	    }

	    pairs.push('Domain=' + opt.domain);
	  }

	  if (opt.path) {
	    if (!fieldContentRegExp.test(opt.path)) {
	      throw new TypeError('option path is invalid');
	    }

	    pairs.push('Path=' + opt.path);
	  }

	  if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
	  if (opt.httpOnly) pairs.push('HttpOnly');
	  if (opt.secure) pairs.push('Secure');

	  return pairs.join('; ');
	}

	/**
	 * Try decoding a string using a decoding function.
	 *
	 * @param {string} str
	 * @param {function} decode
	 * @private
	 */

	function tryDecode(str, decode) {
	  try {
	    return decode(str);
	  } catch (e) {
	    return str;
	  }
	}


/***/ },

/***/ 356:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(357);

/***/ },

/***/ 357:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  systemActions: __webpack_require__(358),
	  systemStore: __webpack_require__(359),

	  ajaxActions: __webpack_require__(361),
	  dialogActions: __webpack_require__(366),
	  dialogLOV: __webpack_require__(367),
	  infoPanelActions: __webpack_require__(368),
	  menuActions: __webpack_require__(369),
	  sessionActions: __webpack_require__(370),
	  toasterActions: __webpack_require__(371),

	  ajaxStore: __webpack_require__(372),
	  sessionStore: __webpack_require__(377),

	  helper: __webpack_require__(363),
	  acl: __webpack_require__(378),
	  storage: __webpack_require__(362)
	};

/***/ },

/***/ 358:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
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

/***/ 359:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);
	var $ = __webpack_require__(360);

	var ajaxActions = __webpack_require__(361);
	var systemActions = __webpack_require__(358);
	var storage = __webpack_require__(362);
	var helper = __webpack_require__(363);

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

/***/ 361:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions(['request', 'requestDone', 'requestError', 'download']);

/***/ },

/***/ 362:
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

/***/ 363:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var q = __webpack_require__(364);

	// nsHelper.factory('helper', ['$filter', function($filter) {
	var lut = [];for (var i = 0; i < 256; i++) {
		lut[i] = (i < 16 ? '0' : '') + i.toString(16);
	}
	var newUUID = function newUUID() {
		var d0 = Math.random() * 0xffffffff | 0;
		var d1 = Math.random() * 0xffffffff | 0;
		var d2 = Math.random() * 0xffffffff | 0;
		var d3 = Math.random() * 0xffffffff | 0;
		return (lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff]).toUpperCase();
	};

	////////////////////////////////////////
	// md5
	////////////////////////////////////////
	function md5cycle(x, k) {
		var a = x[0],
		    b = x[1],
		    c = x[2],
		    d = x[3];

		a = ff(a, b, c, d, k[0], 7, -680876936);
		d = ff(d, a, b, c, k[1], 12, -389564586);
		c = ff(c, d, a, b, k[2], 17, 606105819);
		b = ff(b, c, d, a, k[3], 22, -1044525330);
		a = ff(a, b, c, d, k[4], 7, -176418897);
		d = ff(d, a, b, c, k[5], 12, 1200080426);
		c = ff(c, d, a, b, k[6], 17, -1473231341);
		b = ff(b, c, d, a, k[7], 22, -45705983);
		a = ff(a, b, c, d, k[8], 7, 1770035416);
		d = ff(d, a, b, c, k[9], 12, -1958414417);
		c = ff(c, d, a, b, k[10], 17, -42063);
		b = ff(b, c, d, a, k[11], 22, -1990404162);
		a = ff(a, b, c, d, k[12], 7, 1804603682);
		d = ff(d, a, b, c, k[13], 12, -40341101);
		c = ff(c, d, a, b, k[14], 17, -1502002290);
		b = ff(b, c, d, a, k[15], 22, 1236535329);

		a = gg(a, b, c, d, k[1], 5, -165796510);
		d = gg(d, a, b, c, k[6], 9, -1069501632);
		c = gg(c, d, a, b, k[11], 14, 643717713);
		b = gg(b, c, d, a, k[0], 20, -373897302);
		a = gg(a, b, c, d, k[5], 5, -701558691);
		d = gg(d, a, b, c, k[10], 9, 38016083);
		c = gg(c, d, a, b, k[15], 14, -660478335);
		b = gg(b, c, d, a, k[4], 20, -405537848);
		a = gg(a, b, c, d, k[9], 5, 568446438);
		d = gg(d, a, b, c, k[14], 9, -1019803690);
		c = gg(c, d, a, b, k[3], 14, -187363961);
		b = gg(b, c, d, a, k[8], 20, 1163531501);
		a = gg(a, b, c, d, k[13], 5, -1444681467);
		d = gg(d, a, b, c, k[2], 9, -51403784);
		c = gg(c, d, a, b, k[7], 14, 1735328473);
		b = gg(b, c, d, a, k[12], 20, -1926607734);

		a = hh(a, b, c, d, k[5], 4, -378558);
		d = hh(d, a, b, c, k[8], 11, -2022574463);
		c = hh(c, d, a, b, k[11], 16, 1839030562);
		b = hh(b, c, d, a, k[14], 23, -35309556);
		a = hh(a, b, c, d, k[1], 4, -1530992060);
		d = hh(d, a, b, c, k[4], 11, 1272893353);
		c = hh(c, d, a, b, k[7], 16, -155497632);
		b = hh(b, c, d, a, k[10], 23, -1094730640);
		a = hh(a, b, c, d, k[13], 4, 681279174);
		d = hh(d, a, b, c, k[0], 11, -358537222);
		c = hh(c, d, a, b, k[3], 16, -722521979);
		b = hh(b, c, d, a, k[6], 23, 76029189);
		a = hh(a, b, c, d, k[9], 4, -640364487);
		d = hh(d, a, b, c, k[12], 11, -421815835);
		c = hh(c, d, a, b, k[15], 16, 530742520);
		b = hh(b, c, d, a, k[2], 23, -995338651);

		a = ii(a, b, c, d, k[0], 6, -198630844);
		d = ii(d, a, b, c, k[7], 10, 1126891415);
		c = ii(c, d, a, b, k[14], 15, -1416354905);
		b = ii(b, c, d, a, k[5], 21, -57434055);
		a = ii(a, b, c, d, k[12], 6, 1700485571);
		d = ii(d, a, b, c, k[3], 10, -1894986606);
		c = ii(c, d, a, b, k[10], 15, -1051523);
		b = ii(b, c, d, a, k[1], 21, -2054922799);
		a = ii(a, b, c, d, k[8], 6, 1873313359);
		d = ii(d, a, b, c, k[15], 10, -30611744);
		c = ii(c, d, a, b, k[6], 15, -1560198380);
		b = ii(b, c, d, a, k[13], 21, 1309151649);
		a = ii(a, b, c, d, k[4], 6, -145523070);
		d = ii(d, a, b, c, k[11], 10, -1120210379);
		c = ii(c, d, a, b, k[2], 15, 718787259);
		b = ii(b, c, d, a, k[9], 21, -343485551);

		x[0] = add32(a, x[0]);
		x[1] = add32(b, x[1]);
		x[2] = add32(c, x[2]);
		x[3] = add32(d, x[3]);
	}

	function cmn(q, a, b, x, s, t) {
		a = add32(add32(a, q), add32(x, t));
		return add32(a << s | a >>> 32 - s, b);
	}

	function ff(a, b, c, d, x, s, t) {
		return cmn(b & c | ~b & d, a, b, x, s, t);
	}

	function gg(a, b, c, d, x, s, t) {
		return cmn(b & d | c & ~d, a, b, x, s, t);
	}

	function hh(a, b, c, d, x, s, t) {
		return cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function ii(a, b, c, d, x, s, t) {
		return cmn(c ^ (b | ~d), a, b, x, s, t);
	}

	function md51(s) {
		var txt = '';
		var n = s.length,
		    state = [1732584193, -271733879, -1732584194, 271733878],
		    i;
		for (i = 64; i <= s.length; i += 64) {
			md5cycle(state, md5blk(s.substring(i - 64, i)));
		}
		s = s.substring(i - 64);
		var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (i = 0; i < s.length; i++) {
			tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
		}tail[i >> 2] |= 0x80 << (i % 4 << 3);
		if (i > 55) {
			md5cycle(state, tail);
			for (i = 0; i < 16; i++) {
				tail[i] = 0;
			}
		}
		tail[14] = n * 8;
		md5cycle(state, tail);
		return state;
	}

	/* there needs to be support for Unicode here,
	 * unless we pretend that we can redefine the MD-5
	 * algorithm for multi-byte characters (perhaps
	 * by adding every four 16-bit characters and
	 * shortening the sum to 32 bits). Otherwise
	 * I suggest performing MD-5 as if every character
	 * was two bytes--e.g., 0040 0025 = @%--but then
	 * how will an ordinary MD-5 sum be matched?
	 * There is no way to standardize text to something
	 * like UTF-8 before transformation; speed cost is
	 * utterly prohibitive. The JavaScript standard
	 * itself needs to look at this: it should start
	 * providing access to strings as preformed UTF-8
	 * 8-bit unsigned value arrays.
	 */
	function md5blk(s) {
		/* I figured global was faster.   */
		var md5blks = [],
		    i; /* Andy King said do it this way. */
		for (i = 0; i < 64; i += 4) {
			md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
		}
		return md5blks;
	}

	var hex_chr = '0123456789abcdef'.split('');

	function rhex(n) {
		var s = '',
		    j = 0;
		for (; j < 4; j++) {
			s += hex_chr[n >> j * 8 + 4 & 0x0F] + hex_chr[n >> j * 8 & 0x0F];
		}return s;
	}

	function hex(x) {
		for (var i = 0; i < x.length; i++) {
			x[i] = rhex(x[i]);
		}return x.join('');
	}

	var md5 = function md5(s) {
		return hex(md51(s));
	};

	/* this function is much faster,
	so if possible we use it. Some IEs
	are the only ones I know of that
	need the idiotic second function,
	generated by an if clause.  */

	function add32(a, b) {
		return a + b & 0xFFFFFFFF;
	}

	if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
		var _add = function _add(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF),
			    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return msw << 16 | lsw & 0xFFFF;
		};
	}
	var toTIS620 = function toTIS620(s) {
		var len = s.length;
		var out = [];
		for (var i = 0; i < len; i++) {
			var code = s.charCodeAt(i);
			if (code >= 3585 && code <= 3679) {
				code -= 3585 - 161;
			}
			out.push(String.fromCharCode(code));
		}
		return out.join('');
	};
	var toByteArray = function toByteArray(s) {
		var len = s.length;
		var out = [];
		for (var i = 0; i < len; i++) {
			var code = s.charCodeAt(i);
			//console.log(s.charCodeAt(i));
			if (code >= 3585 && code <= 3679) {
				code -= 3585 - 161;
				//console.log(code, String.fromCharCode(code));
			}
			out.push(code);
		}
		return out;
	};
	var thSplit = function thSplit(s, limit) {
		var text = s.replace(/^\s+/, '');
		text = text.replace(/\s+$/, '');
		text = text.replace(/\s+/g, ' ');
		var num_char = 0;
		var last = 0;
		var len = text.length;
		for (var i = 0; i < len; i++) {
			var ch = text.charCodeAt(i);
			if (ch == 0xe31 || ch >= 0xe34 && ch <= 0xe3a || ch >= 0xe47 && ch <= 0xe4e) {
				continue;
			}
			if (ch == 32) {
				last = i;
			}
			num_char++;
			if (num_char > limit) {
				break;
			}
		}
		var out = [];
		if (num_char > limit) {
			out.push(text.substr(0, last));
			[].push.apply(out, thSplit(text.substr(last + 1), limit));
		} else {
			out.push(text);
		}
		return out;
	};
	var thDate = function thDate(d) {
		var tmp = d.substr(0, 10).split('-');
		if (tmp.length != 3) {
			return d;
		}
		if (tmp[0] == '0000') {
			return '';
		}
		var yy = parseInt(tmp[0]) + 543;
		return tmp[2] + '/' + tmp[1] + '/' + yy;
	};

	var formatNumber = function formatNumber(number, digit, padSize) {
		var s = '',
		    old = '',
		    out = '';

		number = parseFloat(number);
		s = '' + number.toFixed(isNaN(digit) ? 2 : digit);
		old = out = s;

		while ((out = out.replace(/(\d+)(\d{3})/g, '$1,$2')) != old) {
			old = out;
		}

		if (padSize) {
			return ('               ' + out).substr(-padSize);
		}
		return out;
	};

	var bahtText = function bahtText(n) {
		var text = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
		var unit = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];
		n = parseFloat(n);
		var num = n.toFixed(2);

		var numText = function numText(s) {
			var out = '';
			var j = 0;
			for (var i = s.length - 1; i >= 0; i--) {
				var num = parseInt(s.substr(i, 1));
				var t = text[num];
				var u = unit[j];
				if (num == 1 && j == 1) {
					t = '';
				} else if (num == 1 && j == 0 && s.length > 1) {
					t = 'เอ็ด';
				} else if (num == 2 && j == 1) {
					t = 'ยี่';
				} else if (num == 0) {
					u = '';
				}
				out = t + u + out;
				j++;
			}
			return out;
		};
		var tmp = num.split('.');
		var out = '';

		var t = tmp[0];
		while (t != '') {
			if (t.length <= 6) {
				out = numText(t) + out;
				t = '';
				break;
			} else {
				out = numText(t.substr(t.length - 6, 6)) + out;
				t = t.substr(0, t.length - 6);
			}
			if (t != '') {
				out = 'ล้าน' + out;
			}
		}
		out += 'บาท';
		if (parseInt(tmp[1]) > 0) {
			out += numText(tmp[1]) + 'สตางค์';
		} else {
			out += 'ถ้วน';
		}
		return out;
	};

	var numberToEnglish = function numberToEnglish(n) {

		var string = n.toString(),
		    units,
		    tens,
		    scales,
		    start,
		    end,
		    chunks,
		    chunksLen,
		    chunk,
		    ints,
		    i,
		    word,
		    words,
		    and = 'and';

		/* Is number zero? */
		if (parseInt(string) === 0) {
			return 'zero';
		}

		/* Array of units as words */
		units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

		/* Array of tens as words */
		tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

		/* Array of scales as words */
		scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

		/* Split user arguemnt into 3 digit chunks from right to left */
		start = string.length;
		chunks = [];
		while (start > 0) {
			end = start;
			chunks.push(string.slice(start = Math.max(0, start - 3), end));
		}

		/* Check if function has enough scale words to be able to stringify the user argument */
		chunksLen = chunks.length;
		if (chunksLen > scales.length) {
			return '';
		}

		/* Stringify each integer in each chunk */
		words = [];
		for (i = 0; i < chunksLen; i++) {

			chunk = parseInt(chunks[i]);

			if (chunk) {

				/* Split chunk into array of individual integers */
				ints = chunks[i].split('').reverse().map(parseFloat);

				/* If tens integer is 1, i.e. 10, then add 10 to units integer */
				if (ints[1] === 1) {
					ints[0] += 10;
				}

				/* Add scale word if chunk is not zero and array item exists */
				if (word = scales[i]) {
					words.push(word);
				}

				/* Add unit word if array item exists */
				if (word = units[ints[0]]) {
					words.push(word);
				}

				/* Add tens word if array item exists */
				if (word = tens[ints[1]]) {
					words.push(word);
				}

				/* Add 'and' string after units or tens integer if: */
				if (ints[0] || ints[1]) {

					/* Chunk has a hundreds integer or chunk is the first of multiple chunks */
					if (ints[2] || !i && chunksLen) {
						words.push(and);
					}
				}

				/* Add hundreds word if array item exists */
				if (word = units[ints[2]]) {
					words.push(word + ' hundred');
				}
			}
		}

		return words.reverse().join(' ');
	};

	var dateAdd = function dateAdd(date, ms) {
		var d = new Date(date);
		var d2 = new Date(d.getTime() + ms);
		return d2.getFullYear() + '-' + ('00' + (d2.getMonth() + 1)).substr(-2) + '-' + ('00' + d2.getDate()).substr(-2) + ' ' + ('00' + d2.getHours()).substr(-2) + ':' + ('00' + d2.getMinutes()).substr(-2) + ':' + ('00' + d2.getSeconds()).substr(-2);
		//		return $filter('date')(d2, 'yyyy-MM-dd HH:mm:ss');
	};

	// var thShortDate = function(date) {
	// 	var d = date.substr(0, 15).split('-');
	// 	var th = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'
	// 			, 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
	// 	return parseInt(d[2]) + ' ' + th[parseInt(d[1])] + ' ' + (parseInt(d[0])+543);
	// }
	var thShortDate = function thShortDate(date) {
		if (typeof date.getFullYear === 'function') {
			date = dateToString(date);
		}
		var d = date.substr(0, 10).split('-');
		if (d[0] == '0000') {
			return date.substr(0, 10);
		}
		var th = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
		return parseInt(d[2]) + ' ' + th[parseInt(d[1])] + ' ' + (parseInt(d[0]) + 543);
	};

	var thShortDateTime = function thShortDateTime(date) {
		if (typeof date.getFullYear === 'function') {
			date = dateTimeToString(date);
		}
		return thShortDate(date) + ' ' + date.substr(11, 5);
	};

	var getCookie = function getCookie(name, defaultValue) {
		// var value = "; " + document.cookie;
		// var parts = value.split("; " + name + "=");
		// if (parts.length == 2) {
		//   return parts.pop().split(";").shift();
		// }
		// return defaultValue;
		var value = window.localStorage.getItem(name);
		if (value === null) {
			return defaultValue;
		}
		return value;
	};
	var setCookie = function setCookie(name, value) {
		/*
	 if (!expiry) {
	  	window.document.cookie = name + '=' + value;
	 } else {
	 	window.document.cookie = name + '=' + value + '; max-age=' + expiry;
	 }
	 */
		// permanent = !!permanent;
		var storage;
		// if (permanent) {
		storage = window.localStorage;
		// } else {
		// 	storage = window.sessionStorage;
		// }
		if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
			value = JSON.stringify(value);
		};
		storage.setItem(name, value);
	};
	var clone = function clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	};

	var numberFormat = function numberFormat(number, n, s, c) {
		if (typeof number != 'number') {
			return number;
		}
		var re = '\\d(?=(\\d{3})+' + (n > 0 ? '\\D' : '$') + ')',
		    num = number.toFixed(Math.max(0, ~ ~n));
		return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
	};

	var escape = function escape(s) {
		return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
	};

	var toDate = function toDate(text) {
		if (!text) {
			return null;
		}
		var m = text.split(/[-\/]/);
		//  console.log('date', m);
		var n = m.map(function (s) {
			return parseInt(s);
		});
		if (isNaN(n[0]) || isNaN(n[1]) || isNaN(n[2]) || n[0] <= 0 || n[1] <= 0 || n[2] <= 0 || n[1] > 12) {
			return null;
		}
		if (n[0] >= 1900) {
			n[0] -= n[0] >= 2400 ? 543 : 0;
			return new Date(n[0], n[1] - 1, n[2]);
		}
		n[2] -= n[2] >= 2400 ? 543 : 0;
		return new Date(n[2], n[1] - 1, n[0]);
	};

	var parseDateRange = function parseDateRange(s) {
		var pattern = /^(\d+[-\/]\d+[-\/]\d+)(?:\s+(?:-\s+)?(\d+[-\/]\d+[-\/]\d+))?$/;
		var m = pattern.exec(s);
		if (m == null) {
			return null;
		}
		var d1 = toDate(m[1]);
		var d2 = toDate(m[2]);
		if (d1 == null && d2 == null) {
			return null;
		}
		if (d1 == null) {
			return [d2, null];
		}
		if (d2 == null) {
			return [d1, null];
		}
		if (d2 < d1) {
			return [d2, d1];
		}
		return [d1, d2];
	};
	var genCond = function genCond(field, keyword, isOracle) {
		keyword = keyword.trim();
		if (keyword == '') {
			return '';
		}
		if (field.type == 'date') {
			// var tmp = keyword.split(/\s+/);
			// if (tmp.length == 2) {
			// 	return field.name + " BETWEEN '" + tmp[0] + "' AND '" + tmp[1] + "'";
			// }
			//    return field.name + " LIKE '" + keyword.substr(0, 10) + "%'";
			if (isOracle) {
				return field.name + " BETWEEN TO_DATE('" + keyword.substr(0, 10) + "', 'YYYY-MM-DD') AND TO_DATE('" + keyword.substr(0, 10) + " 23:59:59', 'YYYY-MM-DD HH24:MI:SS')";
			}
			return field.name + " BETWEEN '" + keyword.substr(0, 10) + "' AND '" + keyword.substr(0, 10) + " 23:59:59'";
		}
		if (field.type == 'daterange') {
			if (/%/.test(keyword)) {
				if (/^[\d%]{1,4}[-\/][\d%]{1,2}[-\/][\d%]{1,4}$/.test(keyword)) {
					var tmp = keyword.split(/[-\/]/);
					var num = tmp.map(function (t) {
						return parseInt(t);
					});
					var out = [];
					if (!isNaN(num[0]) && num[0] >= 1900) {
						out.push('' + num[0]);
						out.push(isNaN(num[1]) ? tmp[1] : ('0' + num[1]).substr(-2));
						out.push(isNaN(num[2]) ? tmp[2] : ('0' + num[2]).substr(-2));
					} else {
						out.push('' + num[2]);
						out.push(isNaN(num[1]) ? tmp[1] : ('0' + num[1]).substr(-2));
						out.push(isNaN(num[0]) ? tmp[0] : ('0' + num[0]).substr(-2));
					}
					if (isOracle) {
						return "TO_CHAR(" + field.name + ", 'YYYY-MM-DD') LIKE '" + out.join('-') + "'";
					}
					return "CONCAT(''," + field.name + ") LIKE '" + out.join('-') + "%'";
				} else {
					return '';
				}
			} else {
				var tmp = parseDateRange(keyword);
				if (tmp == null || tmp[0] == null) {
					return '';
				}
				if (isOracle) {
					if (tmp[1] == null) {
						return field.name + " BETWEEN TO_DATE('" + dateToString(tmp[0]) + "', 'YYYY-MM-DD') AND TO_DATE('" + dateToString(tmp[0]) + " 23:59:59', 'YYYY-MM-DD HH24:MI:SS')";
					} else {
						return field.name + " BETWEEN TO_DATE('" + dateToString(tmp[0]) + "', 'YYYY-MM-DD') AND TO_DATE('" + dateToString(tmp[1]) + " 23:59:59', 'YYYY-MM-DD HH24:MI:SS')";
					}
				}
				if (tmp[1] == null) {
					return field.name + " BETWEEN '" + dateToString(tmp[0]) + "' AND '" + dateToString(tmp[0]) + " 23:59:59'";
				} else {
					return field.name + " BETWEEN '" + dateToString(tmp[0]) + "' AND '" + dateToString(tmp[1]) + " 23:59:59'";
				}
			}
		}
		if (/%/.test(keyword)) {
			return field.name + " LIKE '" + keyword + "'";
		}
		if (field.type == 'number') {
			var pattern = /(>|<|>=|<=|=|<>|!=)?\s*(\d+(?:\.\d+)?)/g;
			var out = [];
			var num;
			while (match = pattern.exec(keyword)) {
				num = parseFloat(match[2]);
				if (isNaN(num)) {
					continue;
				}
				if (!!!match[1]) {
					match[1] = '=';
				}
				out.push({ op: match[1] == '!=' ? '<>' : match[1], value: match[2] });
			}
			if (out.length == 0) {
				return '';
			}
			if (out.length == 2 && out[0].op == '=' && out[1].op == '=') {
				// between
				return field.name + ' BETWEEN ' + out[0].value + ' AND ' + out[1].value;
			}
			var tmp = out.map(function (item) {
				return field.name + item.op + item.value;
			});
			return tmp.join(' AND ');
		}
		return field.name + "='" + escape(keyword) + "'";
	};

	var gridOpt = function gridOpt(db, mainQuery, body, ext, isOracle) {
		var $result = {};
		isOracle = isOracle || false;

		ext.fields = ext.fields || {};

		var cond = [];
		for (var fld in body.keywords) {

			var keyword = body.keywords[fld];
			if (typeof keyword === 'undefined') continue;
			keyword = keyword.trim();
			if (keyword == '') continue;
			if (typeof ext.fields[fld] === 'undefined') continue;

			var tmp = genCond(ext.fields[fld], keyword, isOracle);
			if (tmp === '') continue;
			cond.push(tmp);
		}

		var sortBy = body.sortBy || ext.sortBy || 'id';
		var sortDir = body.sortDir || ext.sortDir || 'ASC';
		var limit = body.limit || ext.limit || 50;
		var page = body.page || ext.page || 0;

		$result.rows = mainQuery;
		$result.opt = {
			sortBy: sortBy,
			sortDir: sortDir,
			limit: limit,
			page: page,
			totalRows: 'SELECT COUNT(*) AS cnt FROM (' + mainQuery + ') x '
		};

		if (!isOracle) {
			sortBy = '`' + sortBy + '`';
			mainQuery += ' AND ' + cond.join(' AND ');
			$result.sql = mainQuery + ' ORDER BY ' + sortBy + ' ' + sortDir;
			$result.sql += ' LIMIT ' + page * limit + ', ' + limit;
		}

		var dfd = q.defer();
		q.all([function () {
			return db.query($result.rows, {}).then(function (rows) {
				$result.rows = rows;
			});
		}(), function () {
			return db.query($result.opt.totalRows, {}).then(function (rows) {
				$result.opt.totalRows = rows[0].cnt;
			});
		}()]).then(function () {
			dfd.resolve({ status: true, data: $result.rows, opt: $result.opt });
		}).catch(function (e) {
			dfd.reject({ status: false, error: e });
		});

		return dfd.promise;
	};

	var dateToString = function dateToString(d, d2) {
		if (!d || typeof d.getFullYear != 'function') {
			return d2 || '0000-00-00';
		}
		return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).substr(-2) + '-' + ('0' + d.getDate()).substr(-2);
	};

	var dateTimeToString = function dateTimeToString(d, d2) {
		if (!d || typeof d.getFullYear != 'function') {
			return d2 || '0000-00-00';
		}
		return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).substr(-2) + '-' + ('0' + d.getDate()).substr(-2) + ' ' + ('0' + d.getHours()).substr(-2) + ':' + ('0' + d.getMinutes()).substr(-2) + ':' + ('0' + d.getSeconds()).substr(-2);
	};

	var formatNationID = function formatNationID(s) {
		if (!s) {
			return '';
		}
		if (s.length != 13) {
			return s;
		}
		return s.substr(0, 1) + '-' + s.substr(1, 4) + '-' + s.substr(5, 5) + '-' + s.substr(10, 2) + '-' + s.substr(12, 1);
	};

	var toNumber = function toNumber(s, n) {
		if (typeof s === 'number') {
			return s;
		}
		var num = 0;
		if (typeof s === 'string') {
			s = s.replace(/[^\d\.]/mig, '');
			num = parseFloat(s);
		}
		if (isNaN(num)) {
			if (typeof n == 'number') {
				return n;
			} else {
				return 0;
			}
		}
		return num;
	};

	var toMoney = function toMoney(val) {
		var n = val;
		if (typeof val != 'number') {
			var f = n != undefined ? parseFloat(parseFloat(n.replace(/,/g, '')).toFixed(2)) : 0;n(!isNaN(f)) ? f : 0;
		}
		var c = 2,
		    d = ".",
		    t = ",",
		    s = n < 0 ? "-" : "",
		    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
		    j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	};
	module.exports = {
		newUUID: newUUID,
		md5: md5,
		toTIS620: toTIS620,
		thSplit: thSplit,
		thDate: thDate,
		thShortDate: thShortDate,
		thShortDateTime: thShortDateTime,
		numberFormat: numberFormat,
		formatNumber: formatNumber,
		bahtText: bahtText,
		numberToEnglish: numberToEnglish,
		dateAdd: dateAdd,
		getCookie: getCookie,
		setCookie: setCookie,
		clone: clone,
		genCond: genCond,
		gridOpt: gridOpt,
		dateToString: dateToString,
		dateTimeToString: dateTimeToString,
		formatNationID: formatNationID,
		toNumber: toNumber,
		toMoney: toMoney
	};

/***/ },

/***/ 364:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// vim:ts=4:sts=4:sw=4:
	/*!
	 *
	 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
	 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
	 *
	 * With parts by Tyler Close
	 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
	 * at http://www.opensource.org/licenses/mit-license.html
	 * Forked at ref_send.js version: 2009-05-11
	 *
	 * With parts by Mark Miller
	 * Copyright (C) 2011 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */

	(function (definition) {
	    "use strict";

	    // This file will function properly as a <script> tag, or a module
	    // using CommonJS and NodeJS or RequireJS module formats.  In
	    // Common/Node/RequireJS, the module exports the Q API and when
	    // executed as a simple <script>, it creates a Q global instead.

	    // Montage Require
	    if (typeof bootstrap === "function") {
	        bootstrap("promise", definition);

	    // CommonJS
	    } else if (true) {
	        module.exports = definition();

	    // RequireJS
	    } else if (typeof define === "function" && define.amd) {
	        define(definition);

	    // SES (Secure EcmaScript)
	    } else if (typeof ses !== "undefined") {
	        if (!ses.ok()) {
	            return;
	        } else {
	            ses.makeQ = definition;
	        }

	    // <script>
	    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
	        // Prefer window over self for add-on scripts. Use self for
	        // non-windowed contexts.
	        var global = typeof window !== "undefined" ? window : self;

	        // Get the `window` object, save the previous Q global
	        // and initialize Q as a global.
	        var previousQ = global.Q;
	        global.Q = definition();

	        // Add a noConflict function so Q can be removed from the
	        // global namespace.
	        global.Q.noConflict = function () {
	            global.Q = previousQ;
	            return this;
	        };

	    } else {
	        throw new Error("This environment was not anticipated by Q. Please file a bug.");
	    }

	})(function () {
	"use strict";

	var hasStacks = false;
	try {
	    throw new Error();
	} catch (e) {
	    hasStacks = !!e.stack;
	}

	// All code after this point will be filtered from stack traces reported
	// by Q.
	var qStartingLine = captureLine();
	var qFileName;

	// shims

	// used for fallback in "allResolved"
	var noop = function () {};

	// Use the fastest possible means to execute a task in a future turn
	// of the event loop.
	var nextTick =(function () {
	    // linked list of tasks (single, with head node)
	    var head = {task: void 0, next: null};
	    var tail = head;
	    var flushing = false;
	    var requestTick = void 0;
	    var isNodeJS = false;
	    // queue for late tasks, used by unhandled rejection tracking
	    var laterQueue = [];

	    function flush() {
	        /* jshint loopfunc: true */
	        var task, domain;

	        while (head.next) {
	            head = head.next;
	            task = head.task;
	            head.task = void 0;
	            domain = head.domain;

	            if (domain) {
	                head.domain = void 0;
	                domain.enter();
	            }
	            runSingle(task, domain);

	        }
	        while (laterQueue.length) {
	            task = laterQueue.pop();
	            runSingle(task);
	        }
	        flushing = false;
	    }
	    // runs a single function in the async queue
	    function runSingle(task, domain) {
	        try {
	            task();

	        } catch (e) {
	            if (isNodeJS) {
	                // In node, uncaught exceptions are considered fatal errors.
	                // Re-throw them synchronously to interrupt flushing!

	                // Ensure continuation if the uncaught exception is suppressed
	                // listening "uncaughtException" events (as domains does).
	                // Continue in next event to avoid tick recursion.
	                if (domain) {
	                    domain.exit();
	                }
	                setTimeout(flush, 0);
	                if (domain) {
	                    domain.enter();
	                }

	                throw e;

	            } else {
	                // In browsers, uncaught exceptions are not fatal.
	                // Re-throw them asynchronously to avoid slow-downs.
	                setTimeout(function () {
	                    throw e;
	                }, 0);
	            }
	        }

	        if (domain) {
	            domain.exit();
	        }
	    }

	    nextTick = function (task) {
	        tail = tail.next = {
	            task: task,
	            domain: isNodeJS && process.domain,
	            next: null
	        };

	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };

	    if (typeof process === "object" &&
	        process.toString() === "[object process]" && process.nextTick) {
	        // Ensure Q is in a real Node environment, with a `process.nextTick`.
	        // To see through fake Node environments:
	        // * Mocha test runner - exposes a `process` global without a `nextTick`
	        // * Browserify - exposes a `process.nexTick` function that uses
	        //   `setTimeout`. In this case `setImmediate` is preferred because
	        //    it is faster. Browserify's `process.toString()` yields
	        //   "[object Object]", while in a real Node environment
	        //   `process.nextTick()` yields "[object process]".
	        isNodeJS = true;

	        requestTick = function () {
	            process.nextTick(flush);
	        };

	    } else if (typeof setImmediate === "function") {
	        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
	        if (typeof window !== "undefined") {
	            requestTick = setImmediate.bind(window, flush);
	        } else {
	            requestTick = function () {
	                setImmediate(flush);
	            };
	        }

	    } else if (typeof MessageChannel !== "undefined") {
	        // modern browsers
	        // http://www.nonblocking.io/2011/06/windownexttick.html
	        var channel = new MessageChannel();
	        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
	        // working message ports the first time a page loads.
	        channel.port1.onmessage = function () {
	            requestTick = requestPortTick;
	            channel.port1.onmessage = flush;
	            flush();
	        };
	        var requestPortTick = function () {
	            // Opera requires us to provide a message payload, regardless of
	            // whether we use it.
	            channel.port2.postMessage(0);
	        };
	        requestTick = function () {
	            setTimeout(flush, 0);
	            requestPortTick();
	        };

	    } else {
	        // old browsers
	        requestTick = function () {
	            setTimeout(flush, 0);
	        };
	    }
	    // runs a task after all other tasks have been run
	    // this is useful for unhandled rejection tracking that needs to happen
	    // after all `then`d tasks have been run.
	    nextTick.runAfter = function (task) {
	        laterQueue.push(task);
	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };
	    return nextTick;
	})();

	// Attempt to make generics safe in the face of downstream
	// modifications.
	// There is no situation where this is necessary.
	// If you need a security guarantee, these primordials need to be
	// deeply frozen anyway, and if you don’t need a security guarantee,
	// this is just plain paranoid.
	// However, this **might** have the nice side-effect of reducing the size of
	// the minified code by reducing x.call() to merely x()
	// See Mark Miller’s explanation of what this does.
	// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
	var call = Function.call;
	function uncurryThis(f) {
	    return function () {
	        return call.apply(f, arguments);
	    };
	}
	// This is equivalent, but slower:
	// uncurryThis = Function_bind.bind(Function_bind.call);
	// http://jsperf.com/uncurrythis

	var array_slice = uncurryThis(Array.prototype.slice);

	var array_reduce = uncurryThis(
	    Array.prototype.reduce || function (callback, basis) {
	        var index = 0,
	            length = this.length;
	        // concerning the initial value, if one is not provided
	        if (arguments.length === 1) {
	            // seek to the first value in the array, accounting
	            // for the possibility that is is a sparse array
	            do {
	                if (index in this) {
	                    basis = this[index++];
	                    break;
	                }
	                if (++index >= length) {
	                    throw new TypeError();
	                }
	            } while (1);
	        }
	        // reduce
	        for (; index < length; index++) {
	            // account for the possibility that the array is sparse
	            if (index in this) {
	                basis = callback(basis, this[index], index);
	            }
	        }
	        return basis;
	    }
	);

	var array_indexOf = uncurryThis(
	    Array.prototype.indexOf || function (value) {
	        // not a very good shim, but good enough for our one use of it
	        for (var i = 0; i < this.length; i++) {
	            if (this[i] === value) {
	                return i;
	            }
	        }
	        return -1;
	    }
	);

	var array_map = uncurryThis(
	    Array.prototype.map || function (callback, thisp) {
	        var self = this;
	        var collect = [];
	        array_reduce(self, function (undefined, value, index) {
	            collect.push(callback.call(thisp, value, index, self));
	        }, void 0);
	        return collect;
	    }
	);

	var object_create = Object.create || function (prototype) {
	    function Type() { }
	    Type.prototype = prototype;
	    return new Type();
	};

	var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

	var object_keys = Object.keys || function (object) {
	    var keys = [];
	    for (var key in object) {
	        if (object_hasOwnProperty(object, key)) {
	            keys.push(key);
	        }
	    }
	    return keys;
	};

	var object_toString = uncurryThis(Object.prototype.toString);

	function isObject(value) {
	    return value === Object(value);
	}

	// generator related shims

	// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
	function isStopIteration(exception) {
	    return (
	        object_toString(exception) === "[object StopIteration]" ||
	        exception instanceof QReturnValue
	    );
	}

	// FIXME: Remove this helper and Q.return once ES6 generators are in
	// SpiderMonkey.
	var QReturnValue;
	if (typeof ReturnValue !== "undefined") {
	    QReturnValue = ReturnValue;
	} else {
	    QReturnValue = function (value) {
	        this.value = value;
	    };
	}

	// long stack traces

	var STACK_JUMP_SEPARATOR = "From previous event:";

	function makeStackTraceLong(error, promise) {
	    // If possible, transform the error stack trace by removing Node and Q
	    // cruft, then concatenating with the stack trace of `promise`. See #57.
	    if (hasStacks &&
	        promise.stack &&
	        typeof error === "object" &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	        var stacks = [];
	        for (var p = promise; !!p; p = p.source) {
	            if (p.stack) {
	                stacks.unshift(p.stack);
	            }
	        }
	        stacks.unshift(error.stack);

	        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
	        error.stack = filterStackString(concatedStacks);
	    }
	}

	function filterStackString(stackString) {
	    var lines = stackString.split("\n");
	    var desiredLines = [];
	    for (var i = 0; i < lines.length; ++i) {
	        var line = lines[i];

	        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	            desiredLines.push(line);
	        }
	    }
	    return desiredLines.join("\n");
	}

	function isNodeFrame(stackLine) {
	    return stackLine.indexOf("(module.js:") !== -1 ||
	           stackLine.indexOf("(node.js:") !== -1;
	}

	function getFileNameAndLineNumber(stackLine) {
	    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
	    // In IE10 function name can have spaces ("Anonymous function") O_o
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) {
	        return [attempt1[1], Number(attempt1[2])];
	    }

	    // Anonymous functions: "at filename:lineNumber:columnNumber"
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) {
	        return [attempt2[1], Number(attempt2[2])];
	    }

	    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) {
	        return [attempt3[1], Number(attempt3[2])];
	    }
	}

	function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

	    if (!fileNameAndLineNumber) {
	        return false;
	    }

	    var fileName = fileNameAndLineNumber[0];
	    var lineNumber = fileNameAndLineNumber[1];

	    return fileName === qFileName &&
	        lineNumber >= qStartingLine &&
	        lineNumber <= qEndingLine;
	}

	// discover own file name and line number range for filtering stack
	// traces
	function captureLine() {
	    if (!hasStacks) {
	        return;
	    }

	    try {
	        throw new Error();
	    } catch (e) {
	        var lines = e.stack.split("\n");
	        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
	        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	        if (!fileNameAndLineNumber) {
	            return;
	        }

	        qFileName = fileNameAndLineNumber[0];
	        return fileNameAndLineNumber[1];
	    }
	}

	function deprecate(callback, name, alternative) {
	    return function () {
	        if (typeof console !== "undefined" &&
	            typeof console.warn === "function") {
	            console.warn(name + " is deprecated, use " + alternative +
	                         " instead.", new Error("").stack);
	        }
	        return callback.apply(callback, arguments);
	    };
	}

	// end of shims
	// beginning of real work

	/**
	 * Constructs a promise for an immediate reference, passes promises through, or
	 * coerces promises from different systems.
	 * @param value immediate reference or promise
	 */
	function Q(value) {
	    // If the object is already a Promise, return it directly.  This enables
	    // the resolve function to both be used to created references from objects,
	    // but to tolerably coerce non-promises to promises.
	    if (value instanceof Promise) {
	        return value;
	    }

	    // assimilate thenables
	    if (isPromiseAlike(value)) {
	        return coerce(value);
	    } else {
	        return fulfill(value);
	    }
	}
	Q.resolve = Q;

	/**
	 * Performs a task in a future turn of the event loop.
	 * @param {Function} task
	 */
	Q.nextTick = nextTick;

	/**
	 * Controls whether or not long stack traces will be on
	 */
	Q.longStackSupport = false;

	// enable long stacks if Q_DEBUG is set
	if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
	    Q.longStackSupport = true;
	}

	/**
	 * Constructs a {promise, resolve, reject} object.
	 *
	 * `resolve` is a callback to invoke with a more resolved value for the
	 * promise. To fulfill the promise, invoke `resolve` with any value that is
	 * not a thenable. To reject the promise, invoke `resolve` with a rejected
	 * thenable, or invoke `reject` with the reason directly. To resolve the
	 * promise to another thenable, thus putting it in the same state, invoke
	 * `resolve` with that other thenable.
	 */
	Q.defer = defer;
	function defer() {
	    // if "messages" is an "Array", that indicates that the promise has not yet
	    // been resolved.  If it is "undefined", it has been resolved.  Each
	    // element of the messages array is itself an array of complete arguments to
	    // forward to the resolved promise.  We coerce the resolution value to a
	    // promise using the `resolve` function because it handles both fully
	    // non-thenable values and other thenables gracefully.
	    var messages = [], progressListeners = [], resolvedPromise;

	    var deferred = object_create(defer.prototype);
	    var promise = object_create(Promise.prototype);

	    promise.promiseDispatch = function (resolve, op, operands) {
	        var args = array_slice(arguments);
	        if (messages) {
	            messages.push(args);
	            if (op === "when" && operands[1]) { // progress operand
	                progressListeners.push(operands[1]);
	            }
	        } else {
	            Q.nextTick(function () {
	                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
	            });
	        }
	    };

	    // XXX deprecated
	    promise.valueOf = function () {
	        if (messages) {
	            return promise;
	        }
	        var nearerValue = nearer(resolvedPromise);
	        if (isPromise(nearerValue)) {
	            resolvedPromise = nearerValue; // shorten chain
	        }
	        return nearerValue;
	    };

	    promise.inspect = function () {
	        if (!resolvedPromise) {
	            return { state: "pending" };
	        }
	        return resolvedPromise.inspect();
	    };

	    if (Q.longStackSupport && hasStacks) {
	        try {
	            throw new Error();
	        } catch (e) {
	            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
	            // accessor around; that causes memory leaks as per GH-111. Just
	            // reify the stack trace as a string ASAP.
	            //
	            // At the same time, cut off the first line; it's always just
	            // "[object Promise]\n", as per the `toString`.
	            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
	        }
	    }

	    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
	    // consolidating them into `become`, since otherwise we'd create new
	    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

	    function become(newPromise) {
	        resolvedPromise = newPromise;
	        promise.source = newPromise;

	        array_reduce(messages, function (undefined, message) {
	            Q.nextTick(function () {
	                newPromise.promiseDispatch.apply(newPromise, message);
	            });
	        }, void 0);

	        messages = void 0;
	        progressListeners = void 0;
	    }

	    deferred.promise = promise;
	    deferred.resolve = function (value) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(Q(value));
	    };

	    deferred.fulfill = function (value) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(fulfill(value));
	    };
	    deferred.reject = function (reason) {
	        if (resolvedPromise) {
	            return;
	        }

	        become(reject(reason));
	    };
	    deferred.notify = function (progress) {
	        if (resolvedPromise) {
	            return;
	        }

	        array_reduce(progressListeners, function (undefined, progressListener) {
	            Q.nextTick(function () {
	                progressListener(progress);
	            });
	        }, void 0);
	    };

	    return deferred;
	}

	/**
	 * Creates a Node-style callback that will resolve or reject the deferred
	 * promise.
	 * @returns a nodeback
	 */
	defer.prototype.makeNodeResolver = function () {
	    var self = this;
	    return function (error, value) {
	        if (error) {
	            self.reject(error);
	        } else if (arguments.length > 2) {
	            self.resolve(array_slice(arguments, 1));
	        } else {
	            self.resolve(value);
	        }
	    };
	};

	/**
	 * @param resolver {Function} a function that returns nothing and accepts
	 * the resolve, reject, and notify functions for a deferred.
	 * @returns a promise that may be resolved with the given resolve and reject
	 * functions, or rejected by a thrown exception in resolver
	 */
	Q.Promise = promise; // ES6
	Q.promise = promise;
	function promise(resolver) {
	    if (typeof resolver !== "function") {
	        throw new TypeError("resolver must be a function.");
	    }
	    var deferred = defer();
	    try {
	        resolver(deferred.resolve, deferred.reject, deferred.notify);
	    } catch (reason) {
	        deferred.reject(reason);
	    }
	    return deferred.promise;
	}

	promise.race = race; // ES6
	promise.all = all; // ES6
	promise.reject = reject; // ES6
	promise.resolve = Q; // ES6

	// XXX experimental.  This method is a way to denote that a local value is
	// serializable and should be immediately dispatched to a remote upon request,
	// instead of passing a reference.
	Q.passByCopy = function (object) {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return object;
	};

	Promise.prototype.passByCopy = function () {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return this;
	};

	/**
	 * If two promises eventually fulfill to the same value, promises that value,
	 * but otherwise rejects.
	 * @param x {Any*}
	 * @param y {Any*}
	 * @returns {Any*} a promise for x and y if they are the same, but a rejection
	 * otherwise.
	 *
	 */
	Q.join = function (x, y) {
	    return Q(x).join(y);
	};

	Promise.prototype.join = function (that) {
	    return Q([this, that]).spread(function (x, y) {
	        if (x === y) {
	            // TODO: "===" should be Object.is or equiv
	            return x;
	        } else {
	            throw new Error("Can't join: not the same: " + x + " " + y);
	        }
	    });
	};

	/**
	 * Returns a promise for the first of an array of promises to become settled.
	 * @param answers {Array[Any*]} promises to race
	 * @returns {Any*} the first promise to be settled
	 */
	Q.race = race;
	function race(answerPs) {
	    return promise(function (resolve, reject) {
	        // Switch to this once we can assume at least ES5
	        // answerPs.forEach(function (answerP) {
	        //     Q(answerP).then(resolve, reject);
	        // });
	        // Use this in the meantime
	        for (var i = 0, len = answerPs.length; i < len; i++) {
	            Q(answerPs[i]).then(resolve, reject);
	        }
	    });
	}

	Promise.prototype.race = function () {
	    return this.then(Q.race);
	};

	/**
	 * Constructs a Promise with a promise descriptor object and optional fallback
	 * function.  The descriptor contains methods like when(rejected), get(name),
	 * set(name, value), post(name, args), and delete(name), which all
	 * return either a value, a promise for a value, or a rejection.  The fallback
	 * accepts the operation name, a resolver, and any further arguments that would
	 * have been forwarded to the appropriate method above had a method been
	 * provided with the proper name.  The API makes no guarantees about the nature
	 * of the returned object, apart from that it is usable whereever promises are
	 * bought and sold.
	 */
	Q.makePromise = Promise;
	function Promise(descriptor, fallback, inspect) {
	    if (fallback === void 0) {
	        fallback = function (op) {
	            return reject(new Error(
	                "Promise does not support operation: " + op
	            ));
	        };
	    }
	    if (inspect === void 0) {
	        inspect = function () {
	            return {state: "unknown"};
	        };
	    }

	    var promise = object_create(Promise.prototype);

	    promise.promiseDispatch = function (resolve, op, args) {
	        var result;
	        try {
	            if (descriptor[op]) {
	                result = descriptor[op].apply(promise, args);
	            } else {
	                result = fallback.call(promise, op, args);
	            }
	        } catch (exception) {
	            result = reject(exception);
	        }
	        if (resolve) {
	            resolve(result);
	        }
	    };

	    promise.inspect = inspect;

	    // XXX deprecated `valueOf` and `exception` support
	    if (inspect) {
	        var inspected = inspect();
	        if (inspected.state === "rejected") {
	            promise.exception = inspected.reason;
	        }

	        promise.valueOf = function () {
	            var inspected = inspect();
	            if (inspected.state === "pending" ||
	                inspected.state === "rejected") {
	                return promise;
	            }
	            return inspected.value;
	        };
	    }

	    return promise;
	}

	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};

	Promise.prototype.then = function (fulfilled, rejected, progressed) {
	    var self = this;
	    var deferred = defer();
	    var done = false;   // ensure the untrusted promise makes at most a
	                        // single call to one of the callbacks

	    function _fulfilled(value) {
	        try {
	            return typeof fulfilled === "function" ? fulfilled(value) : value;
	        } catch (exception) {
	            return reject(exception);
	        }
	    }

	    function _rejected(exception) {
	        if (typeof rejected === "function") {
	            makeStackTraceLong(exception, self);
	            try {
	                return rejected(exception);
	            } catch (newException) {
	                return reject(newException);
	            }
	        }
	        return reject(exception);
	    }

	    function _progressed(value) {
	        return typeof progressed === "function" ? progressed(value) : value;
	    }

	    Q.nextTick(function () {
	        self.promiseDispatch(function (value) {
	            if (done) {
	                return;
	            }
	            done = true;

	            deferred.resolve(_fulfilled(value));
	        }, "when", [function (exception) {
	            if (done) {
	                return;
	            }
	            done = true;

	            deferred.resolve(_rejected(exception));
	        }]);
	    });

	    // Progress propagator need to be attached in the current tick.
	    self.promiseDispatch(void 0, "when", [void 0, function (value) {
	        var newValue;
	        var threw = false;
	        try {
	            newValue = _progressed(value);
	        } catch (e) {
	            threw = true;
	            if (Q.onerror) {
	                Q.onerror(e);
	            } else {
	                throw e;
	            }
	        }

	        if (!threw) {
	            deferred.notify(newValue);
	        }
	    }]);

	    return deferred.promise;
	};

	Q.tap = function (promise, callback) {
	    return Q(promise).tap(callback);
	};

	/**
	 * Works almost like "finally", but not called for rejections.
	 * Original resolution value is passed through callback unaffected.
	 * Callback may return a promise that will be awaited for.
	 * @param {Function} callback
	 * @returns {Q.Promise}
	 * @example
	 * doSomething()
	 *   .then(...)
	 *   .tap(console.log)
	 *   .then(...);
	 */
	Promise.prototype.tap = function (callback) {
	    callback = Q(callback);

	    return this.then(function (value) {
	        return callback.fcall(value).thenResolve(value);
	    });
	};

	/**
	 * Registers an observer on a promise.
	 *
	 * Guarantees:
	 *
	 * 1. that fulfilled and rejected will be called only once.
	 * 2. that either the fulfilled callback or the rejected callback will be
	 *    called, but not both.
	 * 3. that fulfilled and rejected will not be called in this turn.
	 *
	 * @param value      promise or immediate reference to observe
	 * @param fulfilled  function to be called with the fulfilled value
	 * @param rejected   function to be called with the rejection exception
	 * @param progressed function to be called on any progress notifications
	 * @return promise for the return value from the invoked callback
	 */
	Q.when = when;
	function when(value, fulfilled, rejected, progressed) {
	    return Q(value).then(fulfilled, rejected, progressed);
	}

	Promise.prototype.thenResolve = function (value) {
	    return this.then(function () { return value; });
	};

	Q.thenResolve = function (promise, value) {
	    return Q(promise).thenResolve(value);
	};

	Promise.prototype.thenReject = function (reason) {
	    return this.then(function () { throw reason; });
	};

	Q.thenReject = function (promise, reason) {
	    return Q(promise).thenReject(reason);
	};

	/**
	 * If an object is not a promise, it is as "near" as possible.
	 * If a promise is rejected, it is as "near" as possible too.
	 * If it’s a fulfilled promise, the fulfillment value is nearer.
	 * If it’s a deferred promise and the deferred has been resolved, the
	 * resolution is "nearer".
	 * @param object
	 * @returns most resolved (nearest) form of the object
	 */

	// XXX should we re-do this?
	Q.nearer = nearer;
	function nearer(value) {
	    if (isPromise(value)) {
	        var inspected = value.inspect();
	        if (inspected.state === "fulfilled") {
	            return inspected.value;
	        }
	    }
	    return value;
	}

	/**
	 * @returns whether the given object is a promise.
	 * Otherwise it is a fulfilled value.
	 */
	Q.isPromise = isPromise;
	function isPromise(object) {
	    return object instanceof Promise;
	}

	Q.isPromiseAlike = isPromiseAlike;
	function isPromiseAlike(object) {
	    return isObject(object) && typeof object.then === "function";
	}

	/**
	 * @returns whether the given object is a pending promise, meaning not
	 * fulfilled or rejected.
	 */
	Q.isPending = isPending;
	function isPending(object) {
	    return isPromise(object) && object.inspect().state === "pending";
	}

	Promise.prototype.isPending = function () {
	    return this.inspect().state === "pending";
	};

	/**
	 * @returns whether the given object is a value or fulfilled
	 * promise.
	 */
	Q.isFulfilled = isFulfilled;
	function isFulfilled(object) {
	    return !isPromise(object) || object.inspect().state === "fulfilled";
	}

	Promise.prototype.isFulfilled = function () {
	    return this.inspect().state === "fulfilled";
	};

	/**
	 * @returns whether the given object is a rejected promise.
	 */
	Q.isRejected = isRejected;
	function isRejected(object) {
	    return isPromise(object) && object.inspect().state === "rejected";
	}

	Promise.prototype.isRejected = function () {
	    return this.inspect().state === "rejected";
	};

	//// BEGIN UNHANDLED REJECTION TRACKING

	// This promise library consumes exceptions thrown in handlers so they can be
	// handled by a subsequent promise.  The exceptions get added to this array when
	// they are created, and removed when they are handled.  Note that in ES6 or
	// shimmed environments, this would naturally be a `Set`.
	var unhandledReasons = [];
	var unhandledRejections = [];
	var reportedUnhandledRejections = [];
	var trackUnhandledRejections = true;

	function resetUnhandledRejections() {
	    unhandledReasons.length = 0;
	    unhandledRejections.length = 0;

	    if (!trackUnhandledRejections) {
	        trackUnhandledRejections = true;
	    }
	}

	function trackRejection(promise, reason) {
	    if (!trackUnhandledRejections) {
	        return;
	    }
	    if (typeof process === "object" && typeof process.emit === "function") {
	        Q.nextTick.runAfter(function () {
	            if (array_indexOf(unhandledRejections, promise) !== -1) {
	                process.emit("unhandledRejection", reason, promise);
	                reportedUnhandledRejections.push(promise);
	            }
	        });
	    }

	    unhandledRejections.push(promise);
	    if (reason && typeof reason.stack !== "undefined") {
	        unhandledReasons.push(reason.stack);
	    } else {
	        unhandledReasons.push("(no stack) " + reason);
	    }
	}

	function untrackRejection(promise) {
	    if (!trackUnhandledRejections) {
	        return;
	    }

	    var at = array_indexOf(unhandledRejections, promise);
	    if (at !== -1) {
	        if (typeof process === "object" && typeof process.emit === "function") {
	            Q.nextTick.runAfter(function () {
	                var atReport = array_indexOf(reportedUnhandledRejections, promise);
	                if (atReport !== -1) {
	                    process.emit("rejectionHandled", unhandledReasons[at], promise);
	                    reportedUnhandledRejections.splice(atReport, 1);
	                }
	            });
	        }
	        unhandledRejections.splice(at, 1);
	        unhandledReasons.splice(at, 1);
	    }
	}

	Q.resetUnhandledRejections = resetUnhandledRejections;

	Q.getUnhandledReasons = function () {
	    // Make a copy so that consumers can't interfere with our internal state.
	    return unhandledReasons.slice();
	};

	Q.stopUnhandledRejectionTracking = function () {
	    resetUnhandledRejections();
	    trackUnhandledRejections = false;
	};

	resetUnhandledRejections();

	//// END UNHANDLED REJECTION TRACKING

	/**
	 * Constructs a rejected promise.
	 * @param reason value describing the failure
	 */
	Q.reject = reject;
	function reject(reason) {
	    var rejection = Promise({
	        "when": function (rejected) {
	            // note that the error has been handled
	            if (rejected) {
	                untrackRejection(this);
	            }
	            return rejected ? rejected(reason) : this;
	        }
	    }, function fallback() {
	        return this;
	    }, function inspect() {
	        return { state: "rejected", reason: reason };
	    });

	    // Note that the reason has not been handled.
	    trackRejection(rejection, reason);

	    return rejection;
	}

	/**
	 * Constructs a fulfilled promise for an immediate reference.
	 * @param value immediate reference
	 */
	Q.fulfill = fulfill;
	function fulfill(value) {
	    return Promise({
	        "when": function () {
	            return value;
	        },
	        "get": function (name) {
	            return value[name];
	        },
	        "set": function (name, rhs) {
	            value[name] = rhs;
	        },
	        "delete": function (name) {
	            delete value[name];
	        },
	        "post": function (name, args) {
	            // Mark Miller proposes that post with no name should apply a
	            // promised function.
	            if (name === null || name === void 0) {
	                return value.apply(void 0, args);
	            } else {
	                return value[name].apply(value, args);
	            }
	        },
	        "apply": function (thisp, args) {
	            return value.apply(thisp, args);
	        },
	        "keys": function () {
	            return object_keys(value);
	        }
	    }, void 0, function inspect() {
	        return { state: "fulfilled", value: value };
	    });
	}

	/**
	 * Converts thenables to Q promises.
	 * @param promise thenable promise
	 * @returns a Q promise
	 */
	function coerce(promise) {
	    var deferred = defer();
	    Q.nextTick(function () {
	        try {
	            promise.then(deferred.resolve, deferred.reject, deferred.notify);
	        } catch (exception) {
	            deferred.reject(exception);
	        }
	    });
	    return deferred.promise;
	}

	/**
	 * Annotates an object such that it will never be
	 * transferred away from this process over any promise
	 * communication channel.
	 * @param object
	 * @returns promise a wrapping of that object that
	 * additionally responds to the "isDef" message
	 * without a rejection.
	 */
	Q.master = master;
	function master(object) {
	    return Promise({
	        "isDef": function () {}
	    }, function fallback(op, args) {
	        return dispatch(object, op, args);
	    }, function () {
	        return Q(object).inspect();
	    });
	}

	/**
	 * Spreads the values of a promised array of arguments into the
	 * fulfillment callback.
	 * @param fulfilled callback that receives variadic arguments from the
	 * promised array
	 * @param rejected callback that receives the exception if the promise
	 * is rejected.
	 * @returns a promise for the return value or thrown exception of
	 * either callback.
	 */
	Q.spread = spread;
	function spread(value, fulfilled, rejected) {
	    return Q(value).spread(fulfilled, rejected);
	}

	Promise.prototype.spread = function (fulfilled, rejected) {
	    return this.all().then(function (array) {
	        return fulfilled.apply(void 0, array);
	    }, rejected);
	};

	/**
	 * The async function is a decorator for generator functions, turning
	 * them into asynchronous generators.  Although generators are only part
	 * of the newest ECMAScript 6 drafts, this code does not cause syntax
	 * errors in older engines.  This code should continue to work and will
	 * in fact improve over time as the language improves.
	 *
	 * ES6 generators are currently part of V8 version 3.19 with the
	 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
	 * for longer, but under an older Python-inspired form.  This function
	 * works on both kinds of generators.
	 *
	 * Decorates a generator function such that:
	 *  - it may yield promises
	 *  - execution will continue when that promise is fulfilled
	 *  - the value of the yield expression will be the fulfilled value
	 *  - it returns a promise for the return value (when the generator
	 *    stops iterating)
	 *  - the decorated function returns a promise for the return value
	 *    of the generator or the first rejected promise among those
	 *    yielded.
	 *  - if an error is thrown in the generator, it propagates through
	 *    every following yield until it is caught, or until it escapes
	 *    the generator function altogether, and is translated into a
	 *    rejection for the promise returned by the decorated generator.
	 */
	Q.async = async;
	function async(makeGenerator) {
	    return function () {
	        // when verb is "send", arg is a value
	        // when verb is "throw", arg is an exception
	        function continuer(verb, arg) {
	            var result;

	            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
	            // engine that has a deployed base of browsers that support generators.
	            // However, SM's generators use the Python-inspired semantics of
	            // outdated ES6 drafts.  We would like to support ES6, but we'd also
	            // like to make it possible to use generators in deployed browsers, so
	            // we also support Python-style generators.  At some point we can remove
	            // this block.

	            if (typeof StopIteration === "undefined") {
	                // ES6 Generators
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    return reject(exception);
	                }
	                if (result.done) {
	                    return Q(result.value);
	                } else {
	                    return when(result.value, callback, errback);
	                }
	            } else {
	                // SpiderMonkey Generators
	                // FIXME: Remove this case when SM does ES6 generators.
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    if (isStopIteration(exception)) {
	                        return Q(exception.value);
	                    } else {
	                        return reject(exception);
	                    }
	                }
	                return when(result, callback, errback);
	            }
	        }
	        var generator = makeGenerator.apply(this, arguments);
	        var callback = continuer.bind(continuer, "next");
	        var errback = continuer.bind(continuer, "throw");
	        return callback();
	    };
	}

	/**
	 * The spawn function is a small wrapper around async that immediately
	 * calls the generator and also ends the promise chain, so that any
	 * unhandled errors are thrown instead of forwarded to the error
	 * handler. This is useful because it's extremely common to run
	 * generators at the top-level to work with libraries.
	 */
	Q.spawn = spawn;
	function spawn(makeGenerator) {
	    Q.done(Q.async(makeGenerator)());
	}

	// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
	/**
	 * Throws a ReturnValue exception to stop an asynchronous generator.
	 *
	 * This interface is a stop-gap measure to support generator return
	 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
	 * generators like Chromium 29, just use "return" in your generator
	 * functions.
	 *
	 * @param value the return value for the surrounding generator
	 * @throws ReturnValue exception with the value.
	 * @example
	 * // ES6 style
	 * Q.async(function* () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      return foo + bar;
	 * })
	 * // Older SpiderMonkey style
	 * Q.async(function () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      Q.return(foo + bar);
	 * })
	 */
	Q["return"] = _return;
	function _return(value) {
	    throw new QReturnValue(value);
	}

	/**
	 * The promised function decorator ensures that any promise arguments
	 * are settled and passed as values (`this` is also settled and passed
	 * as a value).  It will also ensure that the result of a function is
	 * always a promise.
	 *
	 * @example
	 * var add = Q.promised(function (a, b) {
	 *     return a + b;
	 * });
	 * add(Q(a), Q(B));
	 *
	 * @param {function} callback The function to decorate
	 * @returns {function} a function that has been decorated.
	 */
	Q.promised = promised;
	function promised(callback) {
	    return function () {
	        return spread([this, all(arguments)], function (self, args) {
	            return callback.apply(self, args);
	        });
	    };
	}

	/**
	 * sends a message to a value in a future turn
	 * @param object* the recipient
	 * @param op the name of the message operation, e.g., "when",
	 * @param args further arguments to be forwarded to the operation
	 * @returns result {Promise} a promise for the result of the operation
	 */
	Q.dispatch = dispatch;
	function dispatch(object, op, args) {
	    return Q(object).dispatch(op, args);
	}

	Promise.prototype.dispatch = function (op, args) {
	    var self = this;
	    var deferred = defer();
	    Q.nextTick(function () {
	        self.promiseDispatch(deferred.resolve, op, args);
	    });
	    return deferred.promise;
	};

	/**
	 * Gets the value of a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to get
	 * @return promise for the property value
	 */
	Q.get = function (object, key) {
	    return Q(object).dispatch("get", [key]);
	};

	Promise.prototype.get = function (key) {
	    return this.dispatch("get", [key]);
	};

	/**
	 * Sets the value of a property in a future turn.
	 * @param object    promise or immediate reference for object object
	 * @param name      name of property to set
	 * @param value     new value of property
	 * @return promise for the return value
	 */
	Q.set = function (object, key, value) {
	    return Q(object).dispatch("set", [key, value]);
	};

	Promise.prototype.set = function (key, value) {
	    return this.dispatch("set", [key, value]);
	};

	/**
	 * Deletes a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to delete
	 * @return promise for the return value
	 */
	Q.del = // XXX legacy
	Q["delete"] = function (object, key) {
	    return Q(object).dispatch("delete", [key]);
	};

	Promise.prototype.del = // XXX legacy
	Promise.prototype["delete"] = function (key) {
	    return this.dispatch("delete", [key]);
	};

	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param value     a value to post, typically an array of
	 *                  invocation arguments for promises that
	 *                  are ultimately backed with `resolve` values,
	 *                  as opposed to those backed with URLs
	 *                  wherein the posted value can be any
	 *                  JSON serializable object.
	 * @return promise for the return value
	 */
	// bound locally because it is used by other methods
	Q.mapply = // XXX As proposed by "Redsandro"
	Q.post = function (object, name, args) {
	    return Q(object).dispatch("post", [name, args]);
	};

	Promise.prototype.mapply = // XXX As proposed by "Redsandro"
	Promise.prototype.post = function (name, args) {
	    return this.dispatch("post", [name, args]);
	};

	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param ...args   array of invocation arguments
	 * @return promise for the return value
	 */
	Q.send = // XXX Mark Miller's proposed parlance
	Q.mcall = // XXX As proposed by "Redsandro"
	Q.invoke = function (object, name /*...args*/) {
	    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
	};

	Promise.prototype.send = // XXX Mark Miller's proposed parlance
	Promise.prototype.mcall = // XXX As proposed by "Redsandro"
	Promise.prototype.invoke = function (name /*...args*/) {
	    return this.dispatch("post", [name, array_slice(arguments, 1)]);
	};

	/**
	 * Applies the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param args      array of application arguments
	 */
	Q.fapply = function (object, args) {
	    return Q(object).dispatch("apply", [void 0, args]);
	};

	Promise.prototype.fapply = function (args) {
	    return this.dispatch("apply", [void 0, args]);
	};

	/**
	 * Calls the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q["try"] =
	Q.fcall = function (object /* ...args*/) {
	    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
	};

	Promise.prototype.fcall = function (/*...args*/) {
	    return this.dispatch("apply", [void 0, array_slice(arguments)]);
	};

	/**
	 * Binds the promised function, transforming return values into a fulfilled
	 * promise and thrown errors into a rejected one.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q.fbind = function (object /*...args*/) {
	    var promise = Q(object);
	    var args = array_slice(arguments, 1);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	Promise.prototype.fbind = function (/*...args*/) {
	    var promise = this;
	    var args = array_slice(arguments);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};

	/**
	 * Requests the names of the owned properties of a promised
	 * object in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @return promise for the keys of the eventually settled object
	 */
	Q.keys = function (object) {
	    return Q(object).dispatch("keys", []);
	};

	Promise.prototype.keys = function () {
	    return this.dispatch("keys", []);
	};

	/**
	 * Turns an array of promises into a promise for an array.  If any of
	 * the promises gets rejected, the whole array is rejected immediately.
	 * @param {Array*} an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns a promise for an array of the corresponding values
	 */
	// By Mark Miller
	// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
	Q.all = all;
	function all(promises) {
	    return when(promises, function (promises) {
	        var pendingCount = 0;
	        var deferred = defer();
	        array_reduce(promises, function (undefined, promise, index) {
	            var snapshot;
	            if (
	                isPromise(promise) &&
	                (snapshot = promise.inspect()).state === "fulfilled"
	            ) {
	                promises[index] = snapshot.value;
	            } else {
	                ++pendingCount;
	                when(
	                    promise,
	                    function (value) {
	                        promises[index] = value;
	                        if (--pendingCount === 0) {
	                            deferred.resolve(promises);
	                        }
	                    },
	                    deferred.reject,
	                    function (progress) {
	                        deferred.notify({ index: index, value: progress });
	                    }
	                );
	            }
	        }, void 0);
	        if (pendingCount === 0) {
	            deferred.resolve(promises);
	        }
	        return deferred.promise;
	    });
	}

	Promise.prototype.all = function () {
	    return all(this);
	};

	/**
	 * Returns the first resolved promise of an array. Prior rejected promises are
	 * ignored.  Rejects only if all promises are rejected.
	 * @param {Array*} an array containing values or promises for values
	 * @returns a promise fulfilled with the value of the first resolved promise,
	 * or a rejected promise if all promises are rejected.
	 */
	Q.any = any;

	function any(promises) {
	    if (promises.length === 0) {
	        return Q.resolve();
	    }

	    var deferred = Q.defer();
	    var pendingCount = 0;
	    array_reduce(promises, function (prev, current, index) {
	        var promise = promises[index];

	        pendingCount++;

	        when(promise, onFulfilled, onRejected, onProgress);
	        function onFulfilled(result) {
	            deferred.resolve(result);
	        }
	        function onRejected() {
	            pendingCount--;
	            if (pendingCount === 0) {
	                deferred.reject(new Error(
	                    "Can't get fulfillment value from any promise, all " +
	                    "promises were rejected."
	                ));
	            }
	        }
	        function onProgress(progress) {
	            deferred.notify({
	                index: index,
	                value: progress
	            });
	        }
	    }, undefined);

	    return deferred.promise;
	}

	Promise.prototype.any = function () {
	    return any(this);
	};

	/**
	 * Waits for all promises to be settled, either fulfilled or
	 * rejected.  This is distinct from `all` since that would stop
	 * waiting at the first rejection.  The promise returned by
	 * `allResolved` will never be rejected.
	 * @param promises a promise for an array (or an array) of promises
	 * (or values)
	 * @return a promise for an array of promises
	 */
	Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
	function allResolved(promises) {
	    return when(promises, function (promises) {
	        promises = array_map(promises, Q);
	        return when(all(array_map(promises, function (promise) {
	            return when(promise, noop, noop);
	        })), function () {
	            return promises;
	        });
	    });
	}

	Promise.prototype.allResolved = function () {
	    return allResolved(this);
	};

	/**
	 * @see Promise#allSettled
	 */
	Q.allSettled = allSettled;
	function allSettled(promises) {
	    return Q(promises).allSettled();
	}

	/**
	 * Turns an array of promises into a promise for an array of their states (as
	 * returned by `inspect`) when they have all settled.
	 * @param {Array[Any*]} values an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns {Array[State]} an array of states for the respective values.
	 */
	Promise.prototype.allSettled = function () {
	    return this.then(function (promises) {
	        return all(array_map(promises, function (promise) {
	            promise = Q(promise);
	            function regardless() {
	                return promise.inspect();
	            }
	            return promise.then(regardless, regardless);
	        }));
	    });
	};

	/**
	 * Captures the failure of a promise, giving an oportunity to recover
	 * with a callback.  If the given promise is fulfilled, the returned
	 * promise is fulfilled.
	 * @param {Any*} promise for something
	 * @param {Function} callback to fulfill the returned promise if the
	 * given promise is rejected
	 * @returns a promise for the return value of the callback
	 */
	Q.fail = // XXX legacy
	Q["catch"] = function (object, rejected) {
	    return Q(object).then(void 0, rejected);
	};

	Promise.prototype.fail = // XXX legacy
	Promise.prototype["catch"] = function (rejected) {
	    return this.then(void 0, rejected);
	};

	/**
	 * Attaches a listener that can respond to progress notifications from a
	 * promise's originating deferred. This listener receives the exact arguments
	 * passed to ``deferred.notify``.
	 * @param {Any*} promise for something
	 * @param {Function} callback to receive any progress notifications
	 * @returns the given promise, unchanged
	 */
	Q.progress = progress;
	function progress(object, progressed) {
	    return Q(object).then(void 0, void 0, progressed);
	}

	Promise.prototype.progress = function (progressed) {
	    return this.then(void 0, void 0, progressed);
	};

	/**
	 * Provides an opportunity to observe the settling of a promise,
	 * regardless of whether the promise is fulfilled or rejected.  Forwards
	 * the resolution to the returned promise when the callback is done.
	 * The callback can return a promise to defer completion.
	 * @param {Any*} promise
	 * @param {Function} callback to observe the resolution of the given
	 * promise, takes no arguments.
	 * @returns a promise for the resolution of the given promise when
	 * ``fin`` is done.
	 */
	Q.fin = // XXX legacy
	Q["finally"] = function (object, callback) {
	    return Q(object)["finally"](callback);
	};

	Promise.prototype.fin = // XXX legacy
	Promise.prototype["finally"] = function (callback) {
	    callback = Q(callback);
	    return this.then(function (value) {
	        return callback.fcall().then(function () {
	            return value;
	        });
	    }, function (reason) {
	        // TODO attempt to recycle the rejection with "this".
	        return callback.fcall().then(function () {
	            throw reason;
	        });
	    });
	};

	/**
	 * Terminates a chain of promises, forcing rejections to be
	 * thrown as exceptions.
	 * @param {Any*} promise at the end of a chain of promises
	 * @returns nothing
	 */
	Q.done = function (object, fulfilled, rejected, progress) {
	    return Q(object).done(fulfilled, rejected, progress);
	};

	Promise.prototype.done = function (fulfilled, rejected, progress) {
	    var onUnhandledError = function (error) {
	        // forward to a future turn so that ``when``
	        // does not catch it and turn it into a rejection.
	        Q.nextTick(function () {
	            makeStackTraceLong(error, promise);
	            if (Q.onerror) {
	                Q.onerror(error);
	            } else {
	                throw error;
	            }
	        });
	    };

	    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
	    var promise = fulfilled || rejected || progress ?
	        this.then(fulfilled, rejected, progress) :
	        this;

	    if (typeof process === "object" && process && process.domain) {
	        onUnhandledError = process.domain.bind(onUnhandledError);
	    }

	    promise.then(void 0, onUnhandledError);
	};

	/**
	 * Causes a promise to be rejected if it does not get fulfilled before
	 * some milliseconds time out.
	 * @param {Any*} promise
	 * @param {Number} milliseconds timeout
	 * @param {Any*} custom error message or Error object (optional)
	 * @returns a promise for the resolution of the given promise if it is
	 * fulfilled before the timeout, otherwise rejected.
	 */
	Q.timeout = function (object, ms, error) {
	    return Q(object).timeout(ms, error);
	};

	Promise.prototype.timeout = function (ms, error) {
	    var deferred = defer();
	    var timeoutId = setTimeout(function () {
	        if (!error || "string" === typeof error) {
	            error = new Error(error || "Timed out after " + ms + " ms");
	            error.code = "ETIMEDOUT";
	        }
	        deferred.reject(error);
	    }, ms);

	    this.then(function (value) {
	        clearTimeout(timeoutId);
	        deferred.resolve(value);
	    }, function (exception) {
	        clearTimeout(timeoutId);
	        deferred.reject(exception);
	    }, deferred.notify);

	    return deferred.promise;
	};

	/**
	 * Returns a promise for the given value (or promised value), some
	 * milliseconds after it resolved. Passes rejections immediately.
	 * @param {Any*} promise
	 * @param {Number} milliseconds
	 * @returns a promise for the resolution of the given promise after milliseconds
	 * time has elapsed since the resolution of the given promise.
	 * If the given promise rejects, that is passed immediately.
	 */
	Q.delay = function (object, timeout) {
	    if (timeout === void 0) {
	        timeout = object;
	        object = void 0;
	    }
	    return Q(object).delay(timeout);
	};

	Promise.prototype.delay = function (timeout) {
	    return this.then(function (value) {
	        var deferred = defer();
	        setTimeout(function () {
	            deferred.resolve(value);
	        }, timeout);
	        return deferred.promise;
	    });
	};

	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided as an array, and returns a promise.
	 *
	 *      Q.nfapply(FS.readFile, [__filename])
	 *      .then(function (content) {
	 *      })
	 *
	 */
	Q.nfapply = function (callback, args) {
	    return Q(callback).nfapply(args);
	};

	Promise.prototype.nfapply = function (args) {
	    var deferred = defer();
	    var nodeArgs = array_slice(args);
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided individually, and returns a promise.
	 * @example
	 * Q.nfcall(FS.readFile, __filename)
	 * .then(function (content) {
	 * })
	 *
	 */
	Q.nfcall = function (callback /*...args*/) {
	    var args = array_slice(arguments, 1);
	    return Q(callback).nfapply(args);
	};

	Promise.prototype.nfcall = function (/*...args*/) {
	    var nodeArgs = array_slice(arguments);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Wraps a NodeJS continuation passing function and returns an equivalent
	 * version that returns a promise.
	 * @example
	 * Q.nfbind(FS.readFile, __filename)("utf-8")
	 * .then(console.log)
	 * .done()
	 */
	Q.nfbind =
	Q.denodeify = function (callback /*...args*/) {
	    var baseArgs = array_slice(arguments, 1);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        Q(callback).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};

	Promise.prototype.nfbind =
	Promise.prototype.denodeify = function (/*...args*/) {
	    var args = array_slice(arguments);
	    args.unshift(this);
	    return Q.denodeify.apply(void 0, args);
	};

	Q.nbind = function (callback, thisp /*...args*/) {
	    var baseArgs = array_slice(arguments, 2);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        function bound() {
	            return callback.apply(thisp, arguments);
	        }
	        Q(bound).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};

	Promise.prototype.nbind = function (/*thisp, ...args*/) {
	    var args = array_slice(arguments, 0);
	    args.unshift(this);
	    return Q.nbind.apply(void 0, args);
	};

	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback with a given array of arguments, plus a provided callback.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param {Array} args arguments to pass to the method; the callback
	 * will be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nmapply = // XXX As proposed by "Redsandro"
	Q.npost = function (object, name, args) {
	    return Q(object).npost(name, args);
	};

	Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
	Promise.prototype.npost = function (name, args) {
	    var nodeArgs = array_slice(args || []);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback, forwarding the given variadic arguments, plus a provided
	 * callback argument.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param ...args arguments to pass to the method; the callback will
	 * be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nsend = // XXX Based on Mark Miller's proposed "send"
	Q.nmcall = // XXX Based on "Redsandro's" proposal
	Q.ninvoke = function (object, name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 2);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
	Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
	Promise.prototype.ninvoke = function (name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 1);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};

	/**
	 * If a function would like to support both Node continuation-passing-style and
	 * promise-returning-style, it can end its internal promise chain with
	 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
	 * elects to use a nodeback, the result will be sent there.  If they do not
	 * pass a nodeback, they will receive the result promise.
	 * @param object a result (or a promise for a result)
	 * @param {Function} nodeback a Node.js-style callback
	 * @returns either the promise or nothing
	 */
	Q.nodeify = nodeify;
	function nodeify(object, nodeback) {
	    return Q(object).nodeify(nodeback);
	}

	Promise.prototype.nodeify = function (nodeback) {
	    if (nodeback) {
	        this.then(function (value) {
	            Q.nextTick(function () {
	                nodeback(null, value);
	            });
	        }, function (error) {
	            Q.nextTick(function () {
	                nodeback(error);
	            });
	        });
	    } else {
	        return this;
	    }
	};

	Q.noConflict = function() {
	    throw new Error("Q.noConflict only works when Q is used as a global");
	};

	// All code before this point will be filtered from stack traces.
	var qEndingLine = captureLine();

	return Q;

	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(365).setImmediate))

/***/ },

/***/ 365:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(5).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(365).setImmediate, __webpack_require__(365).clearImmediate))

/***/ },

/***/ 366:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions(['show', 'close', 'update']);

/***/ },

/***/ 367:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions(['show', 'close', 'search']);

/***/ },

/***/ 368:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions(['show', 'hide']);

/***/ },

/***/ 369:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions(['show', 'updateCount']);

/***/ },

/***/ 370:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'load': { children: ['done', 'error'] },
	  'keepAlive': { children: ['done', 'error'] },
	  'updateSession': { children: ['done', 'error'] }
	});

/***/ },

/***/ 371:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions(['pop', 'dismissAll']);

/***/ },

/***/ 372:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var Reflux = __webpack_require__(337);
	var ajaxActions = __webpack_require__(361);
	var $ = __webpack_require__(360);
	var dialogActions = __webpack_require__(366);

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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(373).Buffer))

/***/ },

/***/ 373:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(374)
	var ieee754 = __webpack_require__(375)
	var isArray = __webpack_require__(376)

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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(373).Buffer, (function() { return this; }())))

/***/ },

/***/ 374:
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

/***/ 375:
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

/***/ 376:
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },

/***/ 377:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);
	var sessionActions = __webpack_require__(370);
	var ajaxActions = __webpack_require__(361);
	var ajaxStore = __webpack_require__(372);

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

/***/ 378:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var systemStore = __webpack_require__(359);
	var sessionStore = __webpack_require__(377);

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

/***/ 383:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React       = __webpack_require__(2);
	var Interpolate = __webpack_require__(384);
	var translator  = __webpack_require__(207);
	var extend      = __webpack_require__(386);

	var PropTypes = React.PropTypes;

	var translatorType = PropTypes.shape({
	  getLocale:        PropTypes.func,
	  onLocaleChange:   PropTypes.func,
	  offLocaleChange:  PropTypes.func,
	  translate:        PropTypes.func
	});

	var Translate = React.createClass({
	  displayName: 'Translate',

	  contextTypes: {
	    translator: translatorType
	  },

	  propTypes: {
	    locale: PropTypes.string,
	    count:  PropTypes.number,

	    content: PropTypes.oneOfType([
	      PropTypes.string,
	      PropTypes.arrayOf(PropTypes.string)
	    ]),

	    scope: PropTypes.oneOfType([
	      PropTypes.string,
	      PropTypes.arrayOf(PropTypes.string)
	    ]),

	    attributes: PropTypes.object
	  },

	  statics: {
	    textContentComponents: ['title', 'option', 'textarea']
	  },

	  getDefaultProps: function() {
	    return { component: 'span' };
	  },

	  getInitialState: function() {
	    return { locale: this.getTranslator().getLocale() };
	  },

	  getTranslator: function() {
	    return this.context.translator || translator;
	  },

	  componentDidMount: function() {
	    if (!this.props.locale) {
	      this.getTranslator().onLocaleChange(this.localeChanged);
	    }
	  },

	  componentWillUnmount: function() {
	    if (!this.props.locale) {
	      this.getTranslator().offLocaleChange(this.localeChanged);
	    }
	  },

	  localeChanged: function(newLocale) {
	    this.setState({ locale: newLocale });
	  },

	  render: function() {
	    var translator  = this.getTranslator();
	    var textContent = Translate.textContentComponents.indexOf(this.props.component) > -1;
	    var interpolate = textContent || this.props.unsafe === true;
	    var props       = extend({ locale: this.state.locale }, this.props, { interpolate: interpolate });

	    if (props.attributes) {
	      for (var attribute in props.attributes) {
	        if (props.attributes[attribute]) {
	          props[attribute] = translator.translate(props.attributes[attribute], props);
	        }
	      }

	      delete props.attributes;
	    }

	    if (props.content) {
	      var translation = translator.translate(props.content, props);

	      delete props.content;
	      delete props.locale;
	      delete props.scope;
	      delete props.children;
	      delete props.interpolate;

	      return React.createElement(Interpolate, props, translation);
	    } else {
	      delete props.locale;
	      delete props.scope;
	      delete props.interpolate;

	      return React.createElement(props.component, props);
	    }
	  }
	});

	module.exports = Translate;

	module.exports.translate = function(key, options) {
	  return React.createElement(Translate, extend({}, options, { content: key }));
	};

	module.exports.translatorType = translatorType;


/***/ },

/***/ 384:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React     = __webpack_require__(2);
	var invariant = __webpack_require__(385);
	var except    = __webpack_require__(214);

	function isString(object) {
	  return Object.prototype.toString.call(object) === '[object String]';
	}

	var REGEXP = /\%\((.+?)\)s/;
	var OMITTED_PROPS = ['children', 'format', 'component', 'unsafe'];

	var Interpolate = React.createClass({
	  displayName: 'Interpolate',

	  getDefaultProps: function() {
	    return { component: 'span' };
	  },

	  render: function() {
	    var format = this.props.children;
	    var parent = this.props.component;
	    var unsafe = this.props.unsafe === true;
	    var props  = except(this.props, OMITTED_PROPS);

	    var matches = [];
	    var children = [];

	    if (!isString(format)) {
	      format = this.props.format;
	    }

	    invariant(isString(format), 'Interpolate expects either a format string as only child or a `format` prop with a string value');

	    if (unsafe) {
	      var content = format.split(REGEXP).reduce(function(memo, match, index) {
	        var html;

	        if (index % 2 === 0) {
	          html = match;
	        } else {
	          html = props[match];
	          matches.push(match);
	        }

	        if (React.isValidElement(html)) {
	          throw new Error('cannot interpolate a React component into unsafe text');
	        }

	        memo += html;

	        return memo;
	      }, '');

	      props.dangerouslySetInnerHTML = { __html: content };
	    } else {
	      format.split(REGEXP).reduce(function(memo, match, index) {
	        var child;

	        if (index % 2 === 0) {
	          if (match.length === 0) {
	            return memo;
	          }

	          child = match;
	        } else {
	          child = props[match];
	          matches.push(match);
	        }

	        memo.push(child);

	        return memo;
	      }, children);
	    }

	    props = except(props, matches);

	    return React.createElement.apply(this, [parent, props].concat(children));
	  }
	});

	module.exports = Interpolate;


/***/ },

/***/ 385:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	function invariant(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },

/***/ 386:
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },

/***/ 655:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(159);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactRouter = __webpack_require__(160);

	var _counterpart = __webpack_require__(207);

	var _counterpart2 = _interopRequireDefault(_counterpart);

	var _reactCookie = __webpack_require__(221);

	var _reactCookie2 = _interopRequireDefault(_reactCookie);

	var _routes = __webpack_require__(656);

	var _routes2 = _interopRequireDefault(_routes);

	var _helper = __webpack_require__(363);

	var _helper2 = _interopRequireDefault(_helper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	console.log('language', _helper2.default.language);
	_counterpart2.default.setLocale(_helper2.default.getCookie('app.lang', _reactCookie2.default.load('SS_LANG') || 'en'));

	_reactDom2.default.render(_react2.default.createElement(_reactRouter.Router, { routes: _routes2.default }), document.getElementById('securestock-app'));

/***/ },

/***/ 656:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var routeConfig = [{ path: '/',
	  component: __webpack_require__(657),
	  indexRoute: { component: __webpack_require__(660) },
	  getChildRoutes: function getChildRoutes(location, cb) {
	    __webpack_require__.e/* nsure */(34, function (require) {
	      cb(null, [{ path: '/:member', component: __webpack_require__(663) }]);
	    });
	  }
	}];

	module.exports = routeConfig;

/***/ },

/***/ 657:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);
	var helper = __webpack_require__(363);

	tr.registerTranslations('en', __webpack_require__(658));
	tr.registerTranslations('th', __webpack_require__(659));

	var Index = React.createClass({
	  displayName: 'Index',

	  contextTypes: {
	    router: React.PropTypes.func
	  },

	  getInitialState: function getInitialState() {
	    return {
	      data: {}
	    };
	  },
	  render: function render() {
	    var image_logo = {
	      background: "url('/img/photo.png') 0px 0px no-repeat",
	      backgroundSize: 'contain',
	      paddingLeft: 124,
	      height: 96
	    };
	    return React.createElement(
	      'div',
	      { className: 'ui one column grid', style: { width: 720, margin: 'auto' } },
	      React.createElement(
	        'div',
	        { className: 'column' },
	        React.createElement(
	          'div',
	          { className: 'ui centered grid' },
	          React.createElement(
	            'div',
	            { className: 'ten wide column' },
	            React.createElement(
	              'div',
	              { style: image_logo },
	              React.createElement(
	                'h1',
	                { className: 'ui header', style: { textAlign: 'center' } },
	                tr.translate('member.title_th'),
	                React.createElement('br', null),
	                tr.translate('member.title_en')
	              )
	            )
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'row' },
	        React.createElement(
	          'div',
	          { className: 'column' },
	          this.props.children
	        )
	      )
	    );
	  }
	});

	module.exports = Index;

/***/ },

/***/ 658:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  member: {
	    title_th: 'ตรวจสอบคะแนนสะสม',
	    title_en: 'Check Member Point'
	  },
	  text: {
	    search: 'Tax Id Card :'
	  },
	  button: {
	    search: 'Search',
	    back: 'Back'
	  },
	  list: {
	    code: 'Code :',
	    name: 'Name :',
	    point: 'Points :',
	    expire_date: 'First Expire Date :',
	    expire_amount: 'Expire Amount :',
	    th_desc: 'Description',
	    th_point: 'Point(s)',
	    th_balance: 'Balance'
	  }
	};

/***/ },

/***/ 659:
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  signin: {
	    title: 'ลงชื่อเข้าใช้ระบบ',
	    user: 'ชื่อผู้ใช้',
	    pass: 'รหัสผ่าน',
	    forget: 'ลืมรหัสผ่าน?',
	    remember: 'จำชื่อผู้ใช้ไว้',
	    act_signin: 'เข้าสู่ระบบ',
	    signin_success: 'เข้าสู่ระบบสำเร็จ',
	    err_invalid_user: 'ไม่พบชื่อผู้ใช้ กรุณาตรวจสอบ',
	    err_invalid_pass: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบ',
	    err_account_disabled: 'ชื่อผู้ใช้ถูกระงับการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแล',
	    err_unknown: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
	  }
	};

/***/ },

/***/ 660:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var Router = __webpack_require__(160);
	var tr = __webpack_require__(207);
	var T = __webpack_require__(383);
	var helper = __webpack_require__(363);

	tr.registerTranslations('en', __webpack_require__(658));
	tr.registerTranslations('th', __webpack_require__(659));

	var store = __webpack_require__(661);
	var actions = __webpack_require__(662);
	var Reflux = __webpack_require__(337);

	var Search = React.createClass({
	  displayName: 'Search',

	  mixins: [Reflux.listenTo(actions.getTaxID.done, 'doneGetTaxID')],
	  getInitialState: function getInitialState() {
	    return {
	      data: {}
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    $('.ui.search.form').form({
	      onSuccess: function onSuccess(event, fields) {
	        if ($.trim($('.search.input>input').val()) != '') {
	          $('.search.input').removeClass('error');
	          $('.search.input').addClass('loading');
	          actions.getTaxID({ id_card: $('.search.input>input').val() });
	        }
	        return false;
	      }
	    });
	  },
	  doneGetTaxID: function doneGetTaxID(res) {
	    $('.search.input').removeClass('loading');
	    if (res.found) {
	      this.props.history.pushState(null, '/' + $('.search.input>input').val());
	    } else {
	      $('.search.input').addClass('error');
	    }
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'ui centered grid' },
	      React.createElement(
	        'div',
	        { className: 'ten wide column' },
	        React.createElement(
	          'form',
	          { className: 'ui search form' },
	          React.createElement(
	            'div',
	            { className: 'two fields' },
	            React.createElement(
	              'div',
	              { className: 'field', style: { textAlign: 'right', width: 125, paddingTop: 9, fontSize: 18 } },
	              tr.translate('text.search')
	            ),
	            React.createElement(
	              'div',
	              { className: 'field' },
	              React.createElement(
	                'div',
	                { className: 'ui icon search input', style: { width: 290 } },
	                React.createElement('input', { type: 'text', placeholder: 'Search...' }),
	                React.createElement('i', { className: 'search icon' })
	              )
	            )
	          ),
	          React.createElement(
	            'div',
	            { style: { textAlign: 'center' } },
	            React.createElement(
	              'div',
	              { className: 'ui submit blue icon button', style: { width: 130 } },
	              React.createElement('i', { className: 'search icon', style: { marginRight: 10 } }),
	              tr.translate('button.search')
	            )
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = Search;

/***/ },

/***/ 661:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Reflux = __webpack_require__(337);

	var system = __webpack_require__(356);
	var ajax = system.ajaxActions; //require('../../system/actions/ajax');
	var actions = __webpack_require__(662);

	module.exports = Reflux.createStore({
	  listenables: [actions],
	  onGetTaxID: function onGetTaxID(param) {
	    ajax.request('/api/member/search', param, actions.getTaxID.done);
	  },
	  onGetList: function onGetList(param) {
	    ajax.request('/api/member/list', param, actions.getList.done);
	  }

	});

/***/ },

/***/ 662:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(337).createActions({
	  'getTaxID': { children: ['done', 'error'] },
	  'getList': { children: ['done', 'error'] }
	});

/***/ }

});