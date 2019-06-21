var ProtvistaTrack = (function(exports, d3, ProtvistaZoomable) {
  "use strict";

  ProtvistaZoomable =
    ProtvistaZoomable && ProtvistaZoomable.hasOwnProperty("default")
      ? ProtvistaZoomable["default"]
      : ProtvistaZoomable;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function(obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf =
      Object.setPrototypeOf ||
      function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }

    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
      length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }

    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */

  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /** Detect free variable `global` from Node.js. */
  var freeGlobal =
    (typeof global === "undefined" ? "undefined" : _typeof(global)) ==
      "object" &&
    global &&
    global.Object === Object &&
    global;

  /** Detect free variable `self`. */

  var freeSelf =
    (typeof self === "undefined" ? "undefined" : _typeof(self)) == "object" &&
    self &&
    self.Object === Object &&
    self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function("return this")();

  /** Built-in value references. */

  var _Symbol = root.Symbol;

  /** Used for built-in method references. */

  var objectProto = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString = objectProto.toString;
  /** Built-in value references. */

  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */

  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
    } catch (e) {}

    var result = nativeObjectToString.call(value);

    {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }

    return result;
  }

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString$1 = objectProto$1.toString;
  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */

  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  /** `Object#toString` result references. */

  var nullTag = "[object Null]",
    undefinedTag = "[object Undefined]";
  /** Built-in value references. */

  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }

    return symToStringTag$1 && symToStringTag$1 in Object(value)
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = _typeof(value);

    return value != null && (type == "object" || type == "function");
  }

  /** `Object#toString` result references. */

  var asyncTag = "[object AsyncFunction]",
    funcTag = "[object Function]",
    genTag = "[object GeneratorFunction]",
    proxyTag = "[object Proxy]";
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */

  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    } // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.

    var tag = baseGetTag(value);
    return (
      tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag
    );
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */

  function isLength(value) {
    return (
      typeof value == "number" &&
      value > -1 &&
      value % 1 == 0 &&
      value <= MAX_SAFE_INTEGER
    );
  }

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */

  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && _typeof(value) == "object";
  }

  /** `Object#toString` result references. */

  var stringTag = "[object String]";
  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a string, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */

  function isString(value) {
    return (
      typeof value == "string" ||
      (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag)
    );
  }

  /** `Object#toString` result references. */

  var symbolTag = "[object Symbol]";
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */

  function isSymbol(value) {
    return (
      _typeof(value) == "symbol" ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag)
    );
  }

  /** Used as references for various `Number` constants. */

  var NAN = 0 / 0;
  /** Used to match leading and trailing whitespace. */

  var reTrim = /^\s+|\s+$/g;
  /** Used to detect bad signed hexadecimal string values. */

  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  /** Used to detect binary string values. */

  var reIsBinary = /^0b[01]+$/i;
  /** Used to detect octal string values. */

  var reIsOctal = /^0o[0-7]+$/i;
  /** Built-in method references without a dependency on `root`. */

  var freeParseInt = parseInt;
  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */

  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }

    if (isSymbol(value)) {
      return NAN;
    }

    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }

    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }

    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value)
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : reIsBadHex.test(value)
      ? NAN
      : +value;
  }

  /** Used as references for various `Number` constants. */

  var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e308;
  /**
   * Converts `value` to a finite number.
   *
   * @static
   * @memberOf _
   * @since 4.12.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted number.
   * @example
   *
   * _.toFinite(3.2);
   * // => 3.2
   *
   * _.toFinite(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toFinite(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toFinite('3.2');
   * // => 3.2
   */

  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }

    value = toNumber(value);

    if (value === INFINITY || value === -INFINITY) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }

    return value === value ? value : 0;
  }

  /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */

  function toInteger(value) {
    var result = toFinite(value),
      remainder = result % 1;
    return result === result ? (remainder ? result - remainder : result) : 0;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }

    return result;
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */

  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
      result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }

    return result;
  }

  /** `Object#toString` result references. */

  var argsTag = "[object Arguments]";
  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */

  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }

  /** Used for built-in method references. */

  var objectProto$2 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
  /** Built-in value references. */

  var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;
  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */

  var isArguments = baseIsArguments(
    (function() {
      return arguments;
    })()
  )
    ? baseIsArguments
    : function(value) {
        return (
          isObjectLike(value) &&
          hasOwnProperty$1.call(value, "callee") &&
          !propertyIsEnumerable.call(value, "callee")
        );
      };

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  /** Detect free variable `exports`. */

  var freeExports =
    (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ==
      "object" &&
    exports &&
    !exports.nodeType &&
    exports;
  /** Detect free variable `module`. */

  var freeModule =
    freeExports &&
    (typeof module === "undefined" ? "undefined" : _typeof(module)) ==
      "object" &&
    module &&
    !module.nodeType &&
    module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Built-in value references. */

  var Buffer = moduleExports ? root.Buffer : undefined;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */

  var isBuffer = nativeIsBuffer || stubFalse;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  /** Used to detect unsigned integer values. */

  var reIsUint = /^(?:0|[1-9]\d*)$/;
  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */

  function isIndex(value, length) {
    var type = _typeof(value);

    length = length == null ? MAX_SAFE_INTEGER$1 : length;
    return (
      !!length &&
      (type == "number" || (type != "symbol" && reIsUint.test(value))) &&
      value > -1 &&
      value % 1 == 0 &&
      value < length
    );
  }

  /** `Object#toString` result references. */

  var argsTag$1 = "[object Arguments]",
    arrayTag = "[object Array]",
    boolTag = "[object Boolean]",
    dateTag = "[object Date]",
    errorTag = "[object Error]",
    funcTag$1 = "[object Function]",
    mapTag = "[object Map]",
    numberTag = "[object Number]",
    objectTag = "[object Object]",
    regexpTag = "[object RegExp]",
    setTag = "[object Set]",
    stringTag$1 = "[object String]",
    weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]",
    dataViewTag = "[object DataView]",
    float32Tag = "[object Float32Array]",
    float64Tag = "[object Float64Array]",
    int8Tag = "[object Int8Array]",
    int16Tag = "[object Int16Array]",
    int32Tag = "[object Int32Array]",
    uint8Tag = "[object Uint8Array]",
    uint8ClampedTag = "[object Uint8ClampedArray]",
    uint16Tag = "[object Uint16Array]",
    uint32Tag = "[object Uint32Array]";
  /** Used to identify `toStringTag` values of typed arrays. */

  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[
    int8Tag
  ] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[
    uint8Tag
  ] = typedArrayTags[uint8ClampedTag] = typedArrayTags[
    uint16Tag
  ] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[
    arrayBufferTag
  ] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[
    dateTag
  ] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[
    mapTag
  ] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[
    regexpTag
  ] = typedArrayTags[setTag] = typedArrayTags[stringTag$1] = typedArrayTags[
    weakMapTag
  ] = false;
  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */

  function baseIsTypedArray(value) {
    return (
      isObjectLike(value) &&
      isLength(value.length) &&
      !!typedArrayTags[baseGetTag(value)]
    );
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /** Detect free variable `exports`. */

  var freeExports$1 =
    (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ==
      "object" &&
    exports &&
    !exports.nodeType &&
    exports;
  /** Detect free variable `module`. */

  var freeModule$1 =
    freeExports$1 &&
    (typeof module === "undefined" ? "undefined" : _typeof(module)) ==
      "object" &&
    module &&
    !module.nodeType &&
    module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
  /** Detect free variable `process` from Node.js. */

  var freeProcess = moduleExports$1 && freeGlobal.process;
  /** Used to access faster Node.js helpers. */

  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types =
        freeModule$1 &&
        freeModule$1.require &&
        freeModule$1.require("util").types;

      if (types) {
        return types;
      } // Legacy `process.binding('util')` for Node.js < 10.

      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {}
  })();

  /* Node.js helper references. */

  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */

  var isTypedArray = nodeIsTypedArray
    ? baseUnary(nodeIsTypedArray)
    : baseIsTypedArray;

  /** Used for built-in method references. */

  var objectProto$3 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */

  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

    for (var key in value) {
      if (
        (inherited || hasOwnProperty$2.call(value, key)) &&
        !(
          skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
          (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          (isBuff && (key == "offset" || key == "parent")) || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          (isType &&
            (key == "buffer" || key == "byteLength" || key == "byteOffset")) || // Skip index properties.
            isIndex(key, length))
        )
      ) {
        result.push(key);
      }
    }

    return result;
  }

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */

  function isPrototype(value) {
    var Ctor = value && value.constructor,
      proto = (typeof Ctor == "function" && Ctor.prototype) || objectProto$4;
    return value === proto;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeKeys = overArg(Object.keys, Object);

  /** Used for built-in method references. */

  var objectProto$5 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$3 = objectProto$5.hasOwnProperty;
  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */

  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }

    var result = [];

    for (var key in Object(object)) {
      if (hasOwnProperty$3.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }

    return result;
  }

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */

  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }

  /**
   * Creates an array of the own enumerable string keyed property values of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property values.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.values(new Foo);
   * // => [1, 2] (iteration order is not guaranteed)
   *
   * _.values('hi');
   * // => ['h', 'i']
   */

  function values(object) {
    return object == null ? [] : baseValues(object, keys(object));
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeMax = Math.max;
  /**
   * Checks if `value` is in `collection`. If `collection` is a string, it's
   * checked for a substring of `value`, otherwise
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * is used for equality comparisons. If `fromIndex` is negative, it's used as
   * the offset from the end of `collection`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object|string} collection The collection to inspect.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
   * @returns {boolean} Returns `true` if `value` is found, else `false`.
   * @example
   *
   * _.includes([1, 2, 3], 1);
   * // => true
   *
   * _.includes([1, 2, 3], 1, 2);
   * // => false
   *
   * _.includes({ 'a': 1, 'b': 2 }, 1);
   * // => true
   *
   * _.includes('abcd', 'bc');
   * // => true
   */

  function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike(collection) ? collection : values(collection);
    fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
    var length = collection.length;

    if (fromIndex < 0) {
      fromIndex = nativeMax(length + fromIndex, 0);
    }

    return isString(collection)
      ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1
      : !!length && baseIndexOf(collection, value, fromIndex) > -1;
  }

  /*jslint node: true */
  var symbolSize = 10;

  var FeatureShape =
    /*#__PURE__*/
    (function() {
      function FeatureShape() {
        _classCallCheck(this, FeatureShape);
      }

      _createClass(
        FeatureShape,
        [
          {
            key: "getFeatureShape",
            value: function getFeatureShape(
              aaWidth,
              ftHeight,
              ftLength,
              shape
            ) {
              shape = shape || "rectangle";
              this._ftLength = ftLength;
              this._ftHeight = ftHeight;
              this._ftWidth = aaWidth * ftLength;

              if (typeof this["_" + shape] !== "function") {
                shape = "rectangle";
              }

              var feature = this["_" + shape]();
              return feature;
            }
          },
          {
            key: "_rectangle",
            value: function _rectangle() {
              return (
                "M0,0" +
                "L" +
                this._ftWidth +
                ",0" +
                "L" +
                this._ftWidth +
                "," +
                this._ftHeight +
                "L0," +
                this._ftHeight +
                "Z"
              );
            }
          },
          {
            key: "_roundRectangle",
            value: function _roundRectangle() {
              var radius = 6;
              return (
                "M" +
                radius +
                ",0" +
                "h" +
                (this._ftWidth - 2 * radius) +
                ",0" +
                "a" +
                radius +
                "," +
                radius +
                " 0 0 1 " +
                radius +
                "," +
                radius +
                "v" +
                (this._ftHeight - 2 * radius) +
                "a" +
                radius +
                "," +
                radius +
                " 0 0 1 " +
                -radius +
                "," +
                radius +
                "h" +
                (2 * radius - this._ftWidth) +
                "a" +
                radius +
                "," +
                radius +
                " 0 0 1 " +
                -radius +
                "," +
                -radius +
                "v" +
                (2 * radius - this._ftHeight) +
                "a" +
                radius +
                "," +
                radius +
                " 0 0 1 " +
                radius +
                "," +
                -radius +
                "Z"
              );
            }
          },
          {
            key: "_bridge",
            value: function _bridge() {
              if (this._ftLength !== 1) {
                return (
                  "M0," +
                  this._ftHeight +
                  "L0,0" +
                  "L" +
                  this._ftWidth +
                  ",0" +
                  "L" +
                  this._ftWidth +
                  "," +
                  this._ftHeight +
                  "L" +
                  this._ftWidth +
                  ",2" +
                  "L0,2Z"
                );
              } else {
                return (
                  "M0," +
                  this._ftHeight +
                  "L0," +
                  this._ftHeight / 2 +
                  "L" +
                  this._ftWidth / 2 +
                  "," +
                  this._ftHeight / 2 +
                  "L" +
                  this._ftWidth / 2 +
                  ",0" +
                  "L" +
                  this._ftWidth / 2 +
                  "," +
                  this._ftHeight / 2 +
                  "L" +
                  this._ftWidth +
                  "," +
                  this._ftHeight / 2 +
                  "L" +
                  this._ftWidth +
                  "," +
                  this._ftHeight +
                  "Z"
                );
              }
            }
          },
          {
            key: "_getMiddleLine",
            value: function _getMiddleLine(centerx) {
              return (
                "M0," + centerx + "L" + this._ftWidth + "," + centerx + "Z"
              );
            }
          },
          {
            key: "_diamond",
            value: function _diamond() {
              var centerx = symbolSize / 2;
              var m = this._ftWidth / 2;
              var shape =
                "M" +
                m +
                ",0" +
                "L" +
                (m + centerx) +
                "," +
                centerx +
                "L" +
                m +
                "," +
                symbolSize +
                "L" +
                (m - centerx) +
                "," +
                centerx;
              return this._ftLength !== 1
                ? shape + this._getMiddleLine(centerx, this._ftWidth)
                : shape + "Z";
            }
          },
          {
            key: "_chevron",
            value: function _chevron() {
              var m = this._ftWidth / 2;
              var centerx = symbolSize / 2;
              var shape =
                "M" +
                m +
                "," +
                centerx +
                "L" +
                (centerx + m) +
                ",0" +
                "L" +
                (centerx + m) +
                "," +
                centerx +
                "L" +
                m +
                "," +
                symbolSize +
                "L" +
                (-centerx + m) +
                "," +
                centerx +
                "L" +
                (-centerx + m) +
                ",0";
              return this._ftLength !== 1
                ? shape +
                    "L" +
                    m +
                    "," +
                    centerx +
                    this._getMiddleLine(centerx, this._ftWidth) +
                    "Z"
                : shape + "Z";
            }
          },
          {
            key: "_catFace",
            value: function _catFace() {
              var centerx = symbolSize / 2;
              var step = symbolSize / 10;
              var m = this._ftWidth / 2;
              var shape =
                "M" +
                (-centerx + m) +
                ",0" +
                "L" +
                (-centerx + m) +
                "," +
                6 * step +
                "L" +
                (-2 * step + m) +
                "," +
                symbolSize +
                "L" +
                (2 * step + m) +
                "," +
                symbolSize +
                "L" +
                (centerx + m) +
                "," +
                6 * step +
                "L" +
                (centerx + m) +
                ",0" +
                "L" +
                (2 * step + m) +
                "," +
                4 * step +
                "L" +
                (-2 * step + m) +
                "," +
                4 * step;
              return this._ftLength !== 1
                ? shape +
                    "M" +
                    m +
                    ",0" +
                    this._getMiddleLine(centerx, this._ftWidth) +
                    "Z"
                : shape + "Z";
            }
          },
          {
            key: "_triangle",
            value: function _triangle() {
              var centerx = symbolSize / 2;
              var m = this._ftWidth / 2;
              var shape =
                "M" +
                m +
                ",0" +
                "L" +
                (centerx + m) +
                "," +
                symbolSize +
                "L" +
                (-centerx + m) +
                "," +
                symbolSize;
              return this._ftLength !== 1
                ? shape +
                    "L" +
                    m +
                    ",0" +
                    this._getMiddleLine(centerx, this._ftWidth) +
                    "Z"
                : shape + "Z";
            }
          },
          {
            key: "_wave",
            value: function _wave() {
              var rx = symbolSize / 4;
              var ry = symbolSize / 2;
              var m = this._ftWidth / 2;
              var shape =
                "M" +
                (-symbolSize / 2 + m) +
                "," +
                ry +
                "A" +
                rx +
                "," +
                ry +
                " 0 1,1 " +
                m +
                "," +
                ry +
                "A" +
                rx +
                "," +
                ry +
                " 0 1,0 " +
                (symbolSize / 2 + m) +
                "," +
                ry;
              return this._ftLength !== 1
                ? shape + this._getMiddleLine(ry, this._ftWidth) + "Z"
                : shape + "Z";
            }
          },
          {
            key: "_getPolygon",
            value: function _getPolygon(sidesNumber) {
              var r = symbolSize / 2;
              var polygon = "M ";
              var m = this._ftWidth / 2;

              for (var i = 0; i < sidesNumber; i++) {
                polygon +=
                  r * Math.cos((2 * Math.PI * i) / sidesNumber) +
                  m +
                  "," +
                  (r * Math.sin((2 * Math.PI * i) / sidesNumber) + r) +
                  " ";
              }

              return this._ftLength !== 1
                ? polygon +
                    " " +
                    (r * Math.cos(0) + m) +
                    "," +
                    (r * Math.sin(0) + r) +
                    " " +
                    this._getMiddleLine(r, this._ftWidth) +
                    "Z"
                : polygon + "Z";
            }
          },
          {
            key: "_hexagon",
            value: function _hexagon() {
              return this._getPolygon(6);
            }
          },
          {
            key: "_pentagon",
            value: function _pentagon() {
              return this._getPolygon(5);
            }
          },
          {
            key: "_circle",
            value: function _circle() {
              var m = this._ftWidth / 2;
              var r = Math.sqrt(symbolSize / Math.PI);
              var shape =
                "M" +
                m +
                ",0" +
                "A" +
                r +
                "," +
                r +
                " 0 1,1 " +
                m +
                "," +
                symbolSize +
                "A" +
                r +
                "," +
                r +
                " 0 1,1 " +
                m +
                ",0";
              return this._ftLength !== 1
                ? shape +
                    this._getMiddleLine(symbolSize / 2, this._ftWidth) +
                    "Z"
                : shape + "Z";
            }
          },
          {
            key: "_arrow",
            value: function _arrow() {
              var step = symbolSize / 10;
              var m = this._ftWidth / 2;
              var shape =
                "M" +
                m +
                ",0" +
                "L" +
                (-step + m) +
                ",0" +
                "L" +
                (-5 * step + m) +
                "," +
                4 * step +
                "L" +
                (-step + m) +
                "," +
                this._ftHeight +
                "L" +
                m +
                "," +
                this._ftHeight +
                "L" +
                (4 * step + m) +
                "," +
                4 * step;
              return this._ftLength !== 1
                ? shape +
                    "L" +
                    m +
                    ",0" +
                    this._getMiddleLine(symbolSize / 2, this._ftWidth) +
                    "Z"
                : shape + "Z";
            }
          },
          {
            key: "_doubleBar",
            value: function _doubleBar() {
              var m = this._ftWidth / 2;
              var centerx = symbolSize / 2;
              var shape =
                "M" +
                m +
                ",0" +
                "L" +
                (-centerx + m) +
                "," +
                symbolSize +
                "L" +
                m +
                "," +
                symbolSize +
                "L" +
                (centerx + m) +
                ",0";
              return this._ftLength !== 1
                ? shape +
                    "L" +
                    m +
                    ",0" +
                    this._getMiddleLine(symbolSize / 2, this._ftWidth) +
                    "Z"
                : shape + "Z";
            }
          },
          {
            key: "_getBrokenEnd",
            value: function _getBrokenEnd() {
              var qh = this._ftHeight / 4.0;
              return (
                "L" +
                (this._ftWidth - qh) +
                "," +
                qh +
                "L" +
                this._ftWidth +
                "," +
                2 * qh +
                "L" +
                (this._ftWidth - qh) +
                "," +
                3 * qh +
                "L" +
                this._ftWidth +
                "," +
                this._ftHeight
              );
            }
          },
          {
            key: "_getBrokenStart",
            value: function _getBrokenStart() {
              var qh = this._ftHeight / 4.0;
              return (
                "L" + qh + "," + 3 * qh + "L0," + 2 * qh + "L" + qh + "," + qh
              );
            }
          },
          {
            key: "_discontinuosStart",
            value: function _discontinuosStart() {
              return (
                "M0,0" +
                "L" +
                this._ftWidth +
                ",0" +
                "L" +
                this._ftWidth +
                "," +
                this._ftHeight +
                "L0," +
                this._ftHeight +
                this._getBrokenStart() +
                "Z"
              );
            }
          },
          {
            key: "_discontinuos",
            value: function _discontinuos() {
              return (
                "M0,0" +
                "L" +
                this._ftWidth +
                ",0" +
                this._getBrokenEnd() +
                "L0," +
                this._ftHeight +
                this._getBrokenStart() +
                "Z"
              );
            }
          },
          {
            key: "_discontinuosEnd",
            value: function _discontinuosEnd() {
              return (
                "M0,0" +
                "L" +
                this._ftWidth +
                ",0" +
                this._getBrokenEnd() +
                "L0," +
                this._ftHeight +
                "Z"
              );
            }
          }
        ],
        [
          {
            key: "isContinuous",
            value: function isContinuous(shape) {
              //TODO, do we still need it?
              shape = type.toLowerCase();

              if (shape === "bridge") {
                return false;
              }

              return true;
            }
          }
        ]
      );

      return FeatureShape;
    })();

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
      length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }

    return array;
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];

        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }

      return object;
    };
  }

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */

  var baseFor = createBaseFor();

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */

  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */

  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }

      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }

      var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }

      return collection;
    };
  }

  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */

  var baseEach = createBaseEach(baseForOwn);

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Casts `value` to `identity` if it's not a function.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Function} Returns cast function.
   */

  function castFunction(value) {
    return typeof value == "function" ? value : identity;
  }

  /**
   * Iterates over elements of `collection` and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, collection).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length"
   * property are iterated like arrays. To avoid this behavior use `_.forIn`
   * or `_.forOwn` for object iteration.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias each
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   * @see _.forEachRight
   * @example
   *
   * _.forEach([1, 2], function(value) {
   *   console.log(value);
   * });
   * // => Logs `1` then `2`.
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'a' then 'b' (iteration order is not guaranteed).
   */

  function forEach(collection, iteratee) {
    var func = isArray(collection) ? arrayEach : baseEach;
    return func(collection, castFunction(iteratee));
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
      length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */

  function assocIndexOf(array, key) {
    var length = array.length;

    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }

    return -1;
  }

  /** Used for built-in method references. */

  var arrayProto = Array.prototype;
  /** Built-in value references. */

  var splice = arrayProto.splice;
  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */

  function listCacheDelete(key) {
    var data = this.__data__,
      index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }

    var lastIndex = data.length - 1;

    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }

    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */

  function listCacheGet(key) {
    var data = this.__data__,
      index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */

  function listCacheSet(key, value) {
    var data = this.__data__,
      index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }

    return this;
  }

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function ListCache(entries) {
    var index = -1,
      length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `ListCache`.

  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */

  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
      result = data["delete"](key);
    this.size = data.size;
    return result;
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  /** Used to detect overreaching core-js shims. */

  var coreJsData = root["__core-js_shared__"];

  /** Used to detect methods masquerading as native. */

  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(
      (coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) || ""
    );
    return uid ? "Symbol(src)_1." + uid : "";
  })();
  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */

  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }

  /** Used for built-in method references. */
  var funcProto = Function.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */

  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}

      try {
        return func + "";
      } catch (e) {}
    }

    return "";
  }

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */

  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  /** Used to detect host constructors (Safari). */

  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  /** Used for built-in method references. */

  var funcProto$1 = Function.prototype,
    objectProto$6 = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString$1 = funcProto$1.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$4 = objectProto$6.hasOwnProperty;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp(
    "^" +
      funcToString$1
        .call(hasOwnProperty$4)
        .replace(reRegExpChar, "\\$&")
        .replace(
          /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
          "$1.*?"
        ) +
      "$"
  );
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */

  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }

    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */

  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /* Built-in method references that are verified to be native. */

  var Map$1 = getNative(root, "Map");

  /* Built-in method references that are verified to be native. */

  var nativeCreate = getNative(Object, "create");

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */

  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  /** Used for built-in method references. */

  var objectProto$7 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$5 = objectProto$7.hasOwnProperty;
  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */

  function hashGet(key) {
    var data = this.__data__;

    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }

    return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */

  var objectProto$8 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$6 = objectProto$8.hasOwnProperty;
  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate
      ? data[key] !== undefined
      : hasOwnProperty$6.call(data, key);
  }

  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */

  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
    return this;
  }

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Hash(entries) {
    var index = -1,
      length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `Hash`.

  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */

  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      hash: new Hash(),
      map: new (Map$1 || ListCache)(),
      string: new Hash()
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = _typeof(value);

    return type == "string" ||
      type == "number" ||
      type == "symbol" ||
      type == "boolean"
      ? value !== "__proto__"
      : value === null;
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */

  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == "string" ? "string" : "hash"]
      : data.map;
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */

  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */

  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */

  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
      size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function MapCache(entries) {
    var index = -1,
      length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `MapCache`.

  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /** Used as the size to enable large array optimizations. */

  var LARGE_ARRAY_SIZE = 200;
  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */

  function stackSet(key, value) {
    var data = this.__data__;

    if (data instanceof ListCache) {
      var pairs = data.__data__;

      if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }

      data = this.__data__ = new MapCache(pairs);
    }

    data.set(key, value);
    this.size = data.size;
    return this;
  }

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Stack(entries) {
    var data = (this.__data__ = new ListCache(entries));
    this.size = data.size;
  } // Add methods to `Stack`.

  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */

  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED$2);

    return this;
  }

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */
  function setCacheHas(value) {
    return this.__data__.has(value);
  }

  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */

  function SetCache(values) {
    var index = -1,
      length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();

    while (++index < length) {
      this.add(values[index]);
    }
  } // Add methods to `SetCache`.

  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /** Used to compose bitmasks for value comparisons. */

  var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;
  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */

  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    } // Assume cyclic values are equal.

    var stacked = stack.get(array);

    if (stacked && stack.get(other)) {
      return stacked == other;
    }

    var index = -1,
      result = true,
      seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;
    stack.set(array, other);
    stack.set(other, array); // Ignore non-index properties.

    while (++index < arrLength) {
      var arrValue = array[index],
        othValue = other[index];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, arrValue, index, other, array, stack)
          : customizer(arrValue, othValue, index, array, other, stack);
      }

      if (compared !== undefined) {
        if (compared) {
          continue;
        }

        result = false;
        break;
      } // Recursively compare arrays (susceptible to call stack limits).

      if (seen) {
        if (
          !arraySome(other, function(othValue, othIndex) {
            if (
              !cacheHas(seen, othIndex) &&
              (arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack))
            ) {
              return seen.push(othIndex);
            }
          })
        ) {
          result = false;
          break;
        }
      } else if (
        !(
          arrValue === othValue ||
          equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )
      ) {
        result = false;
        break;
      }
    }

    stack["delete"](array);
    stack["delete"](other);
    return result;
  }

  /** Built-in value references. */

  var Uint8Array = root.Uint8Array;

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
      result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
      result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /** Used to compose bitmasks for value comparisons. */

  var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;
  /** `Object#toString` result references. */

  var boolTag$1 = "[object Boolean]",
    dateTag$1 = "[object Date]",
    errorTag$1 = "[object Error]",
    mapTag$1 = "[object Map]",
    numberTag$1 = "[object Number]",
    regexpTag$1 = "[object RegExp]",
    setTag$1 = "[object Set]",
    stringTag$2 = "[object String]",
    symbolTag$1 = "[object Symbol]";
  var arrayBufferTag$1 = "[object ArrayBuffer]",
    dataViewTag$1 = "[object DataView]";
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */

  function equalByTag(
    object,
    other,
    tag,
    bitmask,
    customizer,
    equalFunc,
    stack
  ) {
    switch (tag) {
      case dataViewTag$1:
        if (
          object.byteLength != other.byteLength ||
          object.byteOffset != other.byteOffset
        ) {
          return false;
        }

        object = object.buffer;
        other = other.buffer;

      case arrayBufferTag$1:
        if (
          object.byteLength != other.byteLength ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))
        ) {
          return false;
        }

        return true;

      case boolTag$1:
      case dateTag$1:
      case numberTag$1:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq(+object, +other);

      case errorTag$1:
        return object.name == other.name && object.message == other.message;

      case regexpTag$1:
      case stringTag$2:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == other + "";

      case mapTag$1:
        var convert = mapToArray;

      case setTag$1:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
        convert || (convert = setToArray);

        if (object.size != other.size && !isPartial) {
          return false;
        } // Assume cyclic values are equal.

        var stacked = stack.get(object);

        if (stacked) {
          return stacked == other;
        }

        bitmask |= COMPARE_UNORDERED_FLAG$1; // Recursively compare objects (susceptible to call stack limits).

        stack.set(object, other);
        var result = equalArrays(
          convert(object),
          convert(other),
          bitmask,
          customizer,
          equalFunc,
          stack
        );
        stack["delete"](object);
        return result;

      case symbolTag$1:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }

    return false;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
      length = values.length,
      offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }

    return array;
  }

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */

  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

    while (++index < length) {
      var value = array[index];

      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }

    return result;
  }

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  /** Used for built-in method references. */

  var objectProto$9 = Object.prototype;
  /** Built-in value references. */

  var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeGetSymbols = Object.getOwnPropertySymbols;
  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */

  var getSymbols = !nativeGetSymbols
    ? stubArray
    : function(object) {
        if (object == null) {
          return [];
        }

        object = Object(object);
        return arrayFilter(nativeGetSymbols(object), function(symbol) {
          return propertyIsEnumerable$1.call(object, symbol);
        });
      };

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */

  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }

  /** Used to compose bitmasks for value comparisons. */

  var COMPARE_PARTIAL_FLAG$2 = 1;
  /** Used for built-in method references. */

  var objectProto$a = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$7 = objectProto$a.hasOwnProperty;
  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */

  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }

    var index = objLength;

    while (index--) {
      var key = objProps[index];

      if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
        return false;
      }
    } // Assume cyclic values are equal.

    var stacked = stack.get(object);

    if (stacked && stack.get(other)) {
      return stacked == other;
    }

    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;

    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
        othValue = other[key];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, objValue, key, other, object, stack)
          : customizer(objValue, othValue, key, object, other, stack);
      } // Recursively compare objects (susceptible to call stack limits).

      if (
        !(compared === undefined
          ? objValue === othValue ||
            equalFunc(objValue, othValue, bitmask, customizer, stack)
          : compared)
      ) {
        result = false;
        break;
      }

      skipCtor || (skipCtor = key == "constructor");
    }

    if (result && !skipCtor) {
      var objCtor = object.constructor,
        othCtor = other.constructor; // Non `Object` object instances with different constructors are not equal.

      if (
        objCtor != othCtor &&
        "constructor" in object &&
        "constructor" in other &&
        !(
          typeof objCtor == "function" &&
          objCtor instanceof objCtor &&
          typeof othCtor == "function" &&
          othCtor instanceof othCtor
        )
      ) {
        result = false;
      }
    }

    stack["delete"](object);
    stack["delete"](other);
    return result;
  }

  /* Built-in method references that are verified to be native. */

  var DataView = getNative(root, "DataView");

  /* Built-in method references that are verified to be native. */

  var Promise$1 = getNative(root, "Promise");

  /* Built-in method references that are verified to be native. */

  var Set = getNative(root, "Set");

  /* Built-in method references that are verified to be native. */

  var WeakMap = getNative(root, "WeakMap");

  /** `Object#toString` result references. */

  var mapTag$2 = "[object Map]",
    objectTag$1 = "[object Object]",
    promiseTag = "[object Promise]",
    setTag$2 = "[object Set]",
    weakMapTag$1 = "[object WeakMap]";
  var dataViewTag$2 = "[object DataView]";
  /** Used to detect maps, sets, and weakmaps. */

  var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map$1),
    promiseCtorString = toSource(Promise$1),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);
  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  var getTag = baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.

  if (
    (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (Map$1 && getTag(new Map$1()) != mapTag$2) ||
    (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
    (Set && getTag(new Set()) != setTag$2) ||
    (WeakMap && getTag(new WeakMap()) != weakMapTag$1)
  ) {
    getTag = function getTag(value) {
      var result = baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : "";

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag$2;

          case mapCtorString:
            return mapTag$2;

          case promiseCtorString:
            return promiseTag;

          case setCtorString:
            return setTag$2;

          case weakMapCtorString:
            return weakMapTag$1;
        }
      }

      return result;
    };
  }

  var getTag$1 = getTag;

  /** Used to compose bitmasks for value comparisons. */

  var COMPARE_PARTIAL_FLAG$3 = 1;
  /** `Object#toString` result references. */

  var argsTag$2 = "[object Arguments]",
    arrayTag$1 = "[object Array]",
    objectTag$2 = "[object Object]";
  /** Used for built-in method references. */

  var objectProto$b = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$8 = objectProto$b.hasOwnProperty;
  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */

  function baseIsEqualDeep(
    object,
    other,
    bitmask,
    customizer,
    equalFunc,
    stack
  ) {
    var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag$1 : getTag$1(object),
      othTag = othIsArr ? arrayTag$1 : getTag$1(other);
    objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
    othTag = othTag == argsTag$2 ? objectTag$2 : othTag;
    var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }

      objIsArr = true;
      objIsObj = false;
    }

    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object)
        ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
        : equalByTag(
            object,
            other,
            objTag,
            bitmask,
            customizer,
            equalFunc,
            stack
          );
    }

    if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
      var objIsWrapped =
          objIsObj && hasOwnProperty$8.call(object, "__wrapped__"),
        othIsWrapped = othIsObj && hasOwnProperty$8.call(other, "__wrapped__");

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(
          objUnwrapped,
          othUnwrapped,
          bitmask,
          customizer,
          stack
        );
      }
    }

    if (!isSameTag) {
      return false;
    }

    stack || (stack = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }

  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */

  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }

    if (
      value == null ||
      other == null ||
      (!isObjectLike(value) && !isObjectLike(other))
    ) {
      return value !== value && other !== other;
    }

    return baseIsEqualDeep(
      value,
      other,
      bitmask,
      customizer,
      baseIsEqual,
      stack
    );
  }

  /** Used to compose bitmasks for value comparisons. */

  var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;
  /**
   * The base implementation of `_.isMatch` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Array} matchData The property names, values, and compare flags to match.
   * @param {Function} [customizer] The function to customize comparisons.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */

  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

    if (object == null) {
      return !length;
    }

    object = Object(object);

    while (index--) {
      var data = matchData[index];

      if (
        noCustomizer && data[2]
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
      ) {
        return false;
      }
    }

    while (++index < length) {
      data = matchData[index];
      var key = data[0],
        objValue = object[key],
        srcValue = data[1];

      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack();

        if (customizer) {
          var result = customizer(
            objValue,
            srcValue,
            key,
            object,
            source,
            stack
          );
        }

        if (
          !(result === undefined
            ? baseIsEqual(
                srcValue,
                objValue,
                COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2,
                customizer,
                stack
              )
            : result)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */

  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }

  /**
   * Gets the property names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */

  function getMatchData(object) {
    var result = keys(object),
      length = result.length;

    while (length--) {
      var key = result[length],
        value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }

    return result;
  }

  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }

      return (
        object[key] === srcValue &&
        (srcValue !== undefined || key in Object(object))
      );
    };
  }

  /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */

  function baseMatches(source) {
    var matchData = getMatchData(source);

    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }

    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }

  /** Used to match property names within property paths. */

  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;
  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */

  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }

    var type = _typeof(value);

    if (
      type == "number" ||
      type == "symbol" ||
      type == "boolean" ||
      value == null ||
      isSymbol(value)
    ) {
      return true;
    }

    return (
      reIsPlainProp.test(value) ||
      !reIsDeepProp.test(value) ||
      (object != null && value in Object(object))
    );
  }

  /** Error message constants. */

  var FUNC_ERROR_TEXT = "Expected a function";
  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */

  function memoize(func, resolver) {
    if (
      typeof func != "function" ||
      (resolver != null && typeof resolver != "function")
    ) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }

    var memoized = function memoized() {
      var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }

      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };

    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  } // Expose `MapCache`.

  memoize.Cache = MapCache;

  /** Used as the maximum memoize cache size. */

  var MAX_MEMOIZE_SIZE = 500;
  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */

  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }

      return key;
    });
    var cache = result.cache;
    return result;
  }

  /** Used to match property names within property paths. */

  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  /** Used to match backslashes in property paths. */

  var reEscapeChar = /\\(\\)?/g;
  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */

  var stringToPath = memoizeCapped(function(string) {
    var result = [];

    if (
      string.charCodeAt(0) === 46
      /* . */
    ) {
      result.push("");
    }

    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(
        quote ? subString.replace(reEscapeChar, "$1") : number || match
      );
    });
    return result;
  });

  /** Used as references for various `Number` constants. */

  var INFINITY$1 = 1 / 0;
  /** Used to convert symbols to primitives and strings. */

  var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;
  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */

  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == "string") {
      return value;
    }

    if (isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + "";
    }

    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }

    var result = value + "";
    return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */

  function toString(value) {
    return value == null ? "" : baseToString(value);
  }

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */

  function castPath(value, object) {
    if (isArray(value)) {
      return value;
    }

    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }

  /** Used as references for various `Number` constants. */

  var INFINITY$2 = 1 / 0;
  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */

  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }

    var result = value + "";
    return result == "0" && 1 / value == -INFINITY$2 ? "-0" : result;
  }

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */

  function baseGet(object, path) {
    path = castPath(path, object);
    var index = 0,
      length = path.length;

    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }

    return index && index == length ? object : undefined;
  }

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */

  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }

  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */

  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);
    var index = -1,
      length = path.length,
      result = false;

    while (++index < length) {
      var key = toKey(path[index]);

      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }

      object = object[key];
    }

    if (result || ++index != length) {
      return result;
    }

    length = object == null ? 0 : object.length;
    return (
      !!length &&
      isLength(length) &&
      isIndex(key, length) &&
      (isArray(object) || isArguments(object))
    );
  }

  /**
   * Checks if `path` is a direct or inherited property of `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.hasIn(object, 'a');
   * // => true
   *
   * _.hasIn(object, 'a.b');
   * // => true
   *
   * _.hasIn(object, ['a', 'b']);
   * // => true
   *
   * _.hasIn(object, 'b');
   * // => false
   */

  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }

  /** Used to compose bitmasks for value comparisons. */

  var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;
  /**
   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */

  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }

    return function(object) {
      var objValue = get(object, path);
      return objValue === undefined && objValue === srcValue
        ? hasIn(object, path)
        : baseIsEqual(
            srcValue,
            objValue,
            COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3
          );
    };
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   */

  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }

  /**
   * Creates a function that returns the value at `path` of a given object.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': 2 } },
   *   { 'a': { 'b': 1 } }
   * ];
   *
   * _.map(objects, _.property('a.b'));
   * // => [2, 1]
   *
   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
   * // => [1, 2]
   */

  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }

  /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */

  function baseIteratee(value) {
    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    if (typeof value == "function") {
      return value;
    }

    if (value == null) {
      return identity;
    }

    if (_typeof(value) == "object") {
      return isArray(value)
        ? baseMatchesProperty(value[0], value[1])
        : baseMatches(value);
    }

    return property(value);
  }

  /**
   * The base implementation of `_.some` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */

  function baseSome(collection, predicate) {
    var result;
    baseEach(collection, function(value, index, collection) {
      result = predicate(value, index, collection);
      return !result;
    });
    return !!result;
  }

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */

  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }

    var type = _typeof(index);

    if (
      type == "number"
        ? isArrayLike(object) && isIndex(index, object.length)
        : type == "string" && index in object
    ) {
      return eq(object[index], value);
    }

    return false;
  }

  /**
   * Checks if `predicate` returns truthy for **any** element of `collection`.
   * Iteration is stopped once `predicate` returns truthy. The predicate is
   * invoked with three arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   * @example
   *
   * _.some([null, 0, 'yes', false], Boolean);
   * // => true
   *
   * var users = [
   *   { 'user': 'barney', 'active': true },
   *   { 'user': 'fred',   'active': false }
   * ];
   *
   * // The `_.matches` iteratee shorthand.
   * _.some(users, { 'user': 'barney', 'active': false });
   * // => false
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.some(users, ['active', false]);
   * // => true
   *
   * // The `_.property` iteratee shorthand.
   * _.some(users, 'active');
   * // => true
   */

  function some(collection, predicate, guard) {
    var func = isArray(collection) ? arraySome : baseSome;

    if (guard && isIterateeCall(collection, predicate, guard)) {
      predicate = undefined;
    }

    return func(collection, baseIteratee(predicate, 3));
  }

  var DefaultLayout =
    /*#__PURE__*/
    (function() {
      function DefaultLayout(_ref) {
        var features = _ref.features,
          layoutHeight = _ref.layoutHeight,
          _ref$padding = _ref.padding,
          padding = _ref$padding === void 0 ? 1 : _ref$padding,
          _ref$minHeight = _ref.minHeight,
          minHeight = _ref$minHeight === void 0 ? 17 : _ref$minHeight;

        _classCallCheck(this, DefaultLayout);

        this._padding = padding;
        this._minHeight = minHeight;
        this._layoutHeight = layoutHeight;
      }

      _createClass(DefaultLayout, [
        {
          key: "init",
          value: function init(features) {
            this._features = features;
          }
        },
        {
          key: "getFeatureYPos",
          value: function getFeatureYPos(feature) {
            return Math.min(this._layoutHeight, this._minHeight);
          }
        },
        {
          key: "getFeatureHeight",
          value: function getFeatureHeight(feature) {
            return Math.min(this._layoutHeight, this._minHeight);
          }
        }
      ]);

      return DefaultLayout;
    })();

  /*jslint node: true */

  var Row =
    /*#__PURE__*/
    (function() {
      function Row() {
        _classCallCheck(this, Row);

        this._rowFeatures = [];
      }

      _createClass(Row, [
        {
          key: "_featureOverlap",
          value: function _featureOverlap(feature, d, ftEnd, dEnd) {
            var featureBeginOverlap =
              Number(feature.start) >= Number(d.start) &&
              Number(feature.start) <= Number(dEnd);
            var featureEndOverlap =
              Number(ftEnd) >= Number(d.start) && Number(ftEnd) <= Number(dEnd);
            return featureBeginOverlap || featureEndOverlap;
          }
        },
        {
          key: "_dOverlap",
          value: function _dOverlap(feature, d, ftEnd, dEnd) {
            var dBeginOverlap =
              Number(d.start) >= Number(feature.start) &&
              Number(d.start) <= Number(ftEnd);
            var dEndOverlap =
              Number(dEnd) >= Number(feature.start) &&
              Number(dEnd) <= Number(ftEnd);
            return dBeginOverlap || dEndOverlap;
          }
        },
        {
          key: "_addAbsoluteLimits",
          value: function _addAbsoluteLimits(feature) {
            var limits = feature.locations
              .reduce(function(acc, e) {
                return acc.concat(e.fragments);
              }, [])
              .reduce(
                function(acc, e) {
                  return {
                    start: Math.min(e.start, acc.start),
                    end: Math.max(e.end, acc.end)
                  };
                },
                {
                  start: Number.POSITIVE_INFINITY,
                  end: Number.NEGATIVE_INFINITY
                }
              );
            feature.start = limits.start;
            feature.end = limits.end;
          }
        },
        {
          key: "containsOverlap",
          value: function containsOverlap(feature) {
            var _this = this;

            this._addAbsoluteLimits(Object.assign(feature));

            return some(this._rowFeatures, function(d) {
              _this._addAbsoluteLimits(Object.assign(d));

              var ftEnd = feature.end ? feature.end : feature.start;
              var dEnd = d.end ? d.end : d.start;
              return (
                _this._featureOverlap(feature, d, ftEnd, dEnd) ||
                _this._dOverlap(feature, d, ftEnd, dEnd)
              );
            });
          }
        },
        {
          key: "addFeature",
          value: function addFeature(feature) {
            this._rowFeatures.push(feature);
          }
        }
      ]);

      return Row;
    })();

  var NonOverlappingLayout =
    /*#__PURE__*/
    (function(_DefaultLayout) {
      _inherits(NonOverlappingLayout, _DefaultLayout);

      function NonOverlappingLayout(options) {
        var _this2;

        _classCallCheck(this, NonOverlappingLayout);

        _this2 = _possibleConstructorReturn(
          this,
          _getPrototypeOf(NonOverlappingLayout).call(this, options)
        );
        _this2._rowHeight = 0;
        _this2._rows = [];
        _this2._minHeight = 15;
        return _this2;
      }

      _createClass(NonOverlappingLayout, [
        {
          key: "init",
          value: function init(features) {
            var _this3 = this;

            this._features = features;

            forEach(this._features, function(feature) {
              var added = some(_this3._rows, function(row) {
                if (!row.containsOverlap(feature)) {
                  row.addFeature(feature);
                  return true;
                }
              });

              if (!added) {
                var row = new Row();
                row.addFeature(feature);

                _this3._rows.push(row);
              }
            });

            this._rowHeight =
              Math.min(
                this._layoutHeight / this._rows.length,
                this._minHeight
              ) -
              2 * this._padding;
          }
        },
        {
          key: "getFeatureYPos",
          value: function getFeatureYPos(feature) {
            var _this4 = this;

            var yPos;
            var yOffset =
              this._layoutHeight / this._rows.length > this._minHeight
                ? (this._layoutHeight - this._rows.length * this._minHeight) / 2
                : 0;

            forEach(this._rows, function(row, i) {
              forEach(row._rowFeatures, function(currFeature) {
                if (currFeature === feature) {
                  yPos =
                    i * (_this4._rowHeight + 2 * _this4._padding) + yOffset;
                }
              });
            });

            return yPos;
          }
        },
        {
          key: "getFeatureHeight",
          value: function getFeatureHeight() {
            return this._rowHeight;
          }
        }
      ]);

      return NonOverlappingLayout;
    })(DefaultLayout);

  var config = {
    chain: {
      label: "Chain",
      tooltip:
        "(aka mature region). This describes the extent of a polypeptide chain in the mature protein following processing",
      shape: "rectangle",
      color: "#CC9933"
    },
    transit: {
      label: "Transit peptide",
      tooltip: "This describes the extent of a transit peptide",
      shape: "rectangle",
      color: "#009966"
    },
    init_met: {
      label: "Initiator methionine",
      tooltip:
        "This indicates that the initiator methionine is cleaved from the mature protein",
      shape: "arrow",
      color: "#996633"
    },
    propep: {
      label: "Propeptide",
      tooltip:
        "Part of a protein that is cleaved during maturation or activation",
      shape: "rectangle",
      color: "#99CCCC"
    },
    peptide: {
      label: "Peptide",
      tooltip:
        "The position and length of an active peptide in the mature protein",
      shape: "rectangle",
      color: "#006699"
    },
    signal: {
      label: "Signal peptide",
      tooltip: "N-terminal signal peptide",
      shape: "rectangle",
      color: "#CC0033"
    },
    helix: {
      label: "Helix",
      tooltip: "The positions of experimentally determined helical regions",
      shape: "rectangle",
      color: "#FF0066"
    },
    strand: {
      label: "Beta strand",
      tooltip: "The positions of experimentally determined beta strands",
      shape: "rectangle",
      color: "#FFCC00"
    },
    turn: {
      label: "Turn",
      tooltip:
        "The positions of experimentally determined hydrogen-bonded turns",
      shape: "rectangle",
      color: "#0571AF"
    },
    disulfid: {
      label: "Disulfide bond",
      tooltip:
        "The positions of cysteine residues participating in disulphide bonds",
      shape: "bridge",
      color: "#23B14D"
    },
    crosslnk: {
      label: "Cross-link",
      tooltip:
        "Covalent linkages of various types formed between two proteins or between two parts of the same protein",
      shape: "bridge",
      color: "#FF6600"
    },
    region: {
      label: "Region",
      tooltip:
        "Regions in multifunctional enzymes or fusion proteins, or characteristics of a region, e.g., protein-protein interactions mediation",
      shape: "rectangle",
      color: "#B33E00"
    },
    coiled: {
      label: "Coiled coil",
      tooltip:
        "Coiled coils are built by two or more alpha-helices that wind around each other to form a supercoil",
      shape: "rectangle",
      color: "#006699"
    },
    motif: {
      label: "Motif",
      tooltip: "Short conserved sequence motif of biological significance",
      shape: "rectangle",
      color: "#402060"
    },
    repeat: {
      label: "Repeat",
      tooltip:
        "Repeated sequence motifs or repeated domains within the protein",
      shape: "rectangle",
      color: "#9900FF"
    },
    ca_bind: {
      label: "Calcium binding",
      tooltip: "Calcium-binding regions, such as the EF-hand motif",
      shape: "rectangle",
      color: "#FF3399"
    },
    dna_bind: {
      label: "DNA binding",
      tooltip:
        "DNA-binding domains such as AP2/ERF domain, the ETS domain, the Fork-Head domain, the HMG box and the Myb domain",
      shape: "rectangle",
      color: "#009933"
    },
    domain: {
      label: "Domain",
      tooltip:
        "Specific combination of secondary structures organized into a characteristic three-dimensional structure or fold",
      shape: "rectangle",
      color: "#9999FF"
    },
    zn_fing: {
      label: "Zinc finger",
      tooltip:
        "Small, functional, independently folded domain that coordinates one or more zinc ions",
      shape: "rectangle",
      color: "#990066"
    },
    np_bind: {
      label: "Nucleotide binding",
      tooltip:
        "(aka flavin-binding). Region in the protein which binds nucleotide phosphates",
      shape: "rectangle",
      color: "#FF9900"
    },
    metal: {
      label: "Metal binding",
      tooltip: "Binding site for a metal ion",
      shape: "diamond",
      color: "#009900"
    },
    site: {
      label: "Site",
      tooltip: "Any interesting single amino acid site on the sequence",
      shape: "chevron",
      color: "#660033"
    },
    binding: {
      label: "Binding site",
      tooltip:
        "Binding site for any chemical group (co-enzyme, prosthetic group, etc.)",
      shape: "rectangle",
      color: "#catFace"
    },
    act_site: {
      label: "Active site",
      tooltip: "Amino acid(s) directly involved in the activity of an enzyme",
      shape: "circle",
      color: "#FF6666"
    },
    mod_res: {
      label: "Modified residue",
      tooltip:
        "Modified residues such as phosphorylation, acetylation, acylation, methylation",
      shape: "triangle",
      color: "#000066"
    },
    lipid: {
      label: "Lipidation",
      tooltip: "Covalently attached lipid group(s)",
      shape: "wave",
      color: "#99CC33"
    },
    carbohyd: {
      label: "Glycosylation",
      tooltip: "Covalently attached glycan group(s)",
      shape: "hexagon",
      color: "#CC3366"
    },
    compbias: {
      label: "Compositional bias",
      tooltip:
        "Position of regions of compositional bias within the protein and the particular amino acids that are over-represented within those regions",
      shape: "rectangle",
      color: "#FF3366"
    },
    conflict: {
      label: "Sequence conflict",
      tooltip: "Sequence discrepancies of unknown origin",
      shape: "rectangle",
      color: "#6633CC"
    },
    non_cons: {
      label: "Non-adjacent residues",
      tooltip:
        "Indicates that two residues in a sequence are not consecutive and that there is an undetermined number of unsequenced residues between them",
      shape: "doubleBar",
      color: "#FF0033"
    },
    non_ter: {
      label: "Non-terminal residue",
      tooltip:
        "The sequence is incomplete. The residue is not the terminal residue of the complete protein",
      shape: "doubleBar",
      color: "#339933"
    },
    unsure: {
      label: "Sequence uncertainty",
      tooltip:
        "Regions of a sequence for which the authors are unsure about the sequence assignment",
      shape: "rectangle",
      color: "#33FF00"
    },
    non_std: {
      label: "Non-standard residue",
      tooltip: "Non-standard amino acids (selenocysteine and pyrrolysine)",
      shape: "pentagon",
      color: "#330066"
    },
    mutagen: {
      label: "Mutagenesis",
      tooltip: "Site which has been experimentally altered by mutagenesis",
      shape: "rectangle",
      color: "#FF9900"
    },
    topo_dom: {
      label: "Topological domain",
      tooltip: "Location of non-membrane regions of membrane-spanning proteins",
      shape: "rectangle",
      color: "#CC0000"
    },
    transmem: {
      label: "Transmembrane",
      tooltip: "Extent of a membrane-spanning region",
      shape: "rectangle",
      color: "#CC00CC"
    },
    intramem: {
      label: "Intramembrane",
      tooltip: "Extent of a region located in a membrane without crossing it",
      shape: "rectangle",
      color: "#0000CC"
    },
    variant: {
      label: "Natural variant",
      tooltip:
        "Natural variant of the protein, including polymorphisms, variations between strains, isolates or cultivars, disease-associated mutations and RNA editing events",
      shape: "circle",
      color: "black"
    },
    unique: {
      label: "Unique peptide",
      tooltip: "",
      shape: "rectangle",
      color: "#fc3133"
    },
    non_unique: {
      label: "Non-unique peptide",
      tooltip: "",
      shape: "rectangle",
      color: "#8585fc"
    },
    antigen: {
      label: "Antibody binding sequences",
      tooltip: "",
      shape: "rectangle",
      color: "#996699"
    },
    pdbe_cover: {
      label: "PDBe 3D structure coverage",
      tooltip: "",
      shape: "rectangle",
      color: "#669966"
    }
  };

  /*jslint node: true */

  var ConfigHelper =
    /*#__PURE__*/
    (function() {
      function ConfigHelper(config) {
        _classCallCheck(this, ConfigHelper);

        this._config = config;
      }

      _createClass(ConfigHelper, [
        {
          key: "getShapeByType",
          value: function getShapeByType(type) {
            return this._config[type.toLowerCase()]
              ? this._config[type.toLowerCase()].shape
              : "rectangle";
          }
        },
        {
          key: "getColorByType",
          value: function getColorByType(type) {
            return this._config[type.toLowerCase()]
              ? this._config[type.toLowerCase()].color
              : "black";
          }
        }
      ]);

      return ConfigHelper;
    })();

  var ProtvistaTrack =
    /*#__PURE__*/
    (function(_ProtvistaZoomable) {
      _inherits(ProtvistaTrack, _ProtvistaZoomable);

      function ProtvistaTrack() {
        _classCallCheck(this, ProtvistaTrack);

        return _possibleConstructorReturn(
          this,
          _getPrototypeOf(ProtvistaTrack).apply(this, arguments)
        );
      }

      _createClass(
        ProtvistaTrack,
        [
          {
            key: "getLayout",
            value: function getLayout(data) {
              if (
                String(this.getAttribute("layout")).toLowerCase() ===
                "non-overlapping"
              )
                return new NonOverlappingLayout({
                  layoutHeight: this._height
                });
              return new DefaultLayout({
                layoutHeight: this._height
              });
            }
          },
          {
            key: "connectedCallback",
            value: function connectedCallback() {
              var _this = this;

              _get(
                _getPrototypeOf(ProtvistaTrack.prototype),
                "connectedCallback",
                this
              ).call(this);

              this._highlightstart = parseInt(
                this.getAttribute("highlightstart")
              );
              this._highlightend = parseInt(this.getAttribute("highlightend"));
              this._height = this.getAttribute("height")
                ? parseInt(this.getAttribute("height"))
                : 44;
              this._tooltipEvent = this.getAttribute("tooltip-event")
                ? this.getAttribute("tooltip-event")
                : "mouseover";
              this._color = this.getAttribute("color");
              this._shape = this.getAttribute("shape");
              this._featureShape = new FeatureShape();
              this._layoutObj = this.getLayout();
              this._config = new ConfigHelper(config);
              this.createTooltip = this.createTooltip.bind(this);
              if (this._data) this._createTrack();
              this.addEventListener("load", function(e) {
                if (includes(_this.children, e.target)) {
                  _this.data = e.detail.payload;
                }
              });
            }
          },
          {
            key: "normalizeLocations",
            value: function normalizeLocations(data) {
              return data.map(function(obj) {
                var locations = obj.locations,
                  start = obj.start,
                  end = obj.end;
                return locations
                  ? obj
                  : Object.assign(obj, {
                      locations: [
                        {
                          fragments: [
                            {
                              start: start,
                              end: end
                            }
                          ]
                        }
                      ]
                    });
              });
            }
          },
          {
            key: "_getFeatureColor",
            value: function _getFeatureColor(f) {
              if (f.color) {
                return f.color;
              } else if (this._color) {
                return this._color;
              } else if (f.type) {
                return this._config.getColorByType(f.type);
              } else {
                return "black";
              }
            }
          },
          {
            key: "_getShape",
            value: function _getShape(f) {
              if (f.shape) {
                return f.shape;
              } else if (this._shape) {
                return this._shape;
              } else if (f.type) {
                return this._config.getShapeByType(f.type);
              } else {
                return "rectangle";
              }
            }
          },
          {
            key: "_createTrack",
            value: function _createTrack() {
              this._layoutObj.init(this._data);

              d3.select(this)
                .selectAll("*")
                .remove();
              d3.select(this).html("");
              this.svg = d3
                .select(this)
                .append("div")
                .style("line-height", 0)
                .append("svg")
                .attr("width", this.width)
                .attr("height", this._height);
              this.highlighted = this.svg
                .append("rect")
                .attr("class", "highlighted")
                .attr("fill", "rgba(255, 235, 59, 0.8)") // .attr('stroke', 'black')
                .attr("height", this._height);
              this.seq_g = this.svg
                .append("g")
                .attr("class", "sequence-features")
                .attr("transform", "translate(0 ," + this.margin.top + ")");

              this._createFeatures();

              this.refresh();
            }
          },
          {
            key: "_createFeatures",
            value: function _createFeatures() {
              var _this2 = this;

              this.featuresG = this.seq_g
                .selectAll("g.feature-group")
                .data(this._data);
              this.locations = this.featuresG
                .enter()
                .append("g")
                .attr("class", "feature-group")
                .attr("id", function(d) {
                  return "g_".concat(d.accession);
                })
                .selectAll("g.location-group")
                .data(function(d) {
                  return d.locations.map(function(loc) {
                    return Object.assign({}, loc, {
                      feature: d
                    });
                  });
                }) // .data(d => d.locations.map((loc) => ({ feature: d, ...l })))
                .enter()
                .append("g")
                .attr("class", "location-group");
              this.features = this.locations
                .selectAll("g.fragment-group")
                .data(function(d) {
                  return d.fragments.map(function(loc) {
                    return Object.assign({}, loc, {
                      feature: d.feature
                    });
                  });
                }) // .data(d => d.fragments.map(({ ...l }) => ({ feature: d.feature, ...l })))
                .enter()
                .append("path")
                .attr("class", "feature")
                .attr("tooltip-trigger", "true")
                .attr("d", function(f) {
                  return _this2._featureShape.getFeatureShape(
                    _this2.getSingleBaseWidth(),
                    _this2._layoutObj.getFeatureHeight(f),
                    f.end ? f.end - f.start + 1 : 1,
                    _this2._getShape(f.feature)
                  );
                })
                .attr("transform", function(f) {
                  return (
                    "translate(" +
                    _this2.getXFromSeqPosition(f.start) +
                    "," +
                    (_this2.margin.top +
                      _this2._layoutObj.getFeatureYPos(f.feature)) +
                    ")"
                  );
                })
                .attr("fill", function(f) {
                  return _this2._getFeatureColor(f.feature);
                })
                .attr("stroke", function(f) {
                  return _this2._getFeatureColor(f.feature);
                })
                .on("mouseover", function(f) {
                  var self = _this2;
                  var e = d3.event;

                  if (_this2._tooltipEvent === "mouseover") {
                    window.setTimeout(function() {
                      self.createTooltip(e, f);
                    }, 50);
                  }

                  _this2.dispatchEvent(
                    new CustomEvent("change", {
                      detail: {
                        highlightend: f.end,
                        highlightstart: f.start
                      },
                      bubbles: true,
                      cancelable: true
                    })
                  );
                })
                .on("mouseout", function() {
                  var self = _this2;

                  if (_this2._tooltipEvent === "mouseover") {
                    window.setTimeout(function() {
                      self.removeAllTooltips();
                    }, 50);
                  }

                  _this2.dispatchEvent(
                    new CustomEvent("change", {
                      detail: {
                        highlightend: null,
                        highlightstart: null
                      },
                      bubbles: true,
                      cancelable: true
                    })
                  );
                })
                .on("click", function(d) {
                  if (_this2._tooltipEvent === "click") {
                    _this2.createTooltip(d3.event, d, true);
                  }
                });
            }
          },
          {
            key: "createTooltip",
            value: function createTooltip(e, d) {
              var closeable =
                arguments.length > 2 && arguments[2] !== undefined
                  ? arguments[2]
                  : false;

              if (!d.feature || !d.feature.tooltipContent) {
                return;
              }

              this.removeAllTooltips();
              var tooltip = document.createElement("protvista-tooltip");
              tooltip.top = e.clientY + 3;
              tooltip.left = e.clientX + 2;
              tooltip.title = ""
                .concat(d.feature.type, " ")
                .concat(d.start, "-")
                .concat(d.end);
              tooltip.closeable = closeable; // Passing the content as a property as it can contain HTML

              tooltip.content = d.feature.tooltipContent;
              this.appendChild(tooltip);
              var parentWidth = this.svg._groups[0][0].clientWidth;
              var tooltipPosition = d3
                .select(tooltip)
                .node()
                .getBoundingClientRect();

              if (tooltipPosition.width + tooltipPosition.x > parentWidth) {
                this.removeChild(tooltip);
                tooltip.left = parentWidth - tooltipPosition.width;
                tooltip.mirror = "H";
                this.appendChild(tooltip);
              }
            }
          },
          {
            key: "removeAllTooltips",
            value: function removeAllTooltips() {
              document
                .querySelectorAll("protvista-tooltip")
                .forEach(function(tooltip) {
                  return tooltip.remove();
                });
            }
          },
          {
            key: "refresh",
            value: function refresh() {
              var _this3 = this;

              if (this.xScale && this.seq_g) {
                this.features = this.seq_g.selectAll("path.feature").data(
                  this._data.reduce(function(acc, f) {
                    return acc.concat(
                      f.locations.reduce(function(acc2, e) {
                        return acc2.concat(
                          e.fragments.map(function(loc) {
                            return Object.assign({}, loc, {
                              feature: f
                            });
                          })
                        );
                      }, [])
                    );
                  }, [])
                );
                this.features
                  .attr("d", function(f) {
                    return _this3._featureShape.getFeatureShape(
                      _this3.getSingleBaseWidth(),
                      _this3._layoutObj.getFeatureHeight(f),
                      f.end ? f.end - f.start + 1 : 1,
                      _this3._getShape(f.feature)
                    );
                  })
                  .attr("transform", function(f) {
                    return (
                      "translate(" +
                      _this3.getXFromSeqPosition(f.start) +
                      "," +
                      (_this3.margin.top +
                        _this3._layoutObj.getFeatureYPos(f.feature)) +
                      ")"
                    );
                  });

                this._updateHighlight();
              }
            }
          },
          {
            key: "_updateHighlight",
            value: function _updateHighlight() {
              if (
                Number.isInteger(this._highlightstart) &&
                Number.isInteger(this._highlightend)
              ) {
                this.highlighted
                  .attr("x", this.getXFromSeqPosition(this._highlightstart))
                  .style("opacity", 0.3)
                  .attr(
                    "width",
                    this.getSingleBaseWidth() *
                      (this._highlightend - this._highlightstart + 1)
                  );
              } else {
                this.highlighted.style("opacity", 0);
              }
            }
          },
          {
            key: "height",
            set: function set(height) {
              this._height = height;
            },
            get: function get$$1() {
              return this._height;
            }
          },
          {
            key: "data",
            set: function set(data) {
              this._data = this.normalizeLocations(data);

              this._createTrack();
            }
          }
        ],
        [
          {
            key: "observedAttributes",
            get: function get$$1() {
              return [
                "length",
                "displaystart",
                "displayend",
                "highlightstart",
                "highlightend",
                "color",
                "shape",
                "layout"
              ];
            }
          }
        ]
      );

      return ProtvistaTrack;
    })(ProtvistaZoomable);

  var loadComponent = function loadComponent() {
    customElements.define("protvista-track", ProtvistaTrack);
  }; // Conditional loading of polyfill

  if (window.customElements) {
    loadComponent();
  } else {
    document.addEventListener("WebComponentsReady", function() {
      loadComponent();
    });
  }

  exports.default = ProtvistaTrack;
  exports.DefaultLayout = DefaultLayout;

  return exports;
})({}, d3, ProtvistaZoomable);
//# sourceMappingURL=protvista-track.js.map
