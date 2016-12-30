'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = adapter;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var slice = Array.call.bind(Array.prototype.slice);

function arrayIterator(array, callback) {
  for (var i = 0, l = array.length; i < l; ++i) {
    callback(array[i], i);
  }
}

function iterableIterator(iterator, callback) {
  var index = 0;
  for (var _iterator = iterator, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var item = _ref;

    if (Array.isArray(item)) {
      callback(item[0], item[1]);
    } else {
      callback(item, index++);
    }
  }
}
function objectIterator(object, callback) {
  var keys = Object.keys(object);
  for (var i = 0, l = keys.length; i < l; ++i) {
    callback(object[keys[i]], keys[i]);
  }
}

var PugRuntime = function () {
  function PugRuntime() {
    _classCallCheck(this, PugRuntime);
  }

  PugRuntime.prototype.events = function events(context, value) {
    return value;
  };

  PugRuntime.prototype.element = function element(tagName, properties) {
    return Object.assign({ tagName: tagName }, properties);
  };

  PugRuntime.prototype.handles = function handles(context, _handles) {
    return _handles;
  };

  PugRuntime.prototype.text = function text(_text) {
    return _text != null ? _text : '';
  };

  PugRuntime.prototype.attrs = function attrs(values) {
    if (values.class) {
      values.class = this.attr(values.class);
    }
    for (var attr in values) {
      if (!values[attr]) delete values[attr];else values[attr] = values[attr] + '';
    }
    return values;
  };

  PugRuntime.prototype.attr = function attr(value) {
    if (!value) return '';
    if (Array.isArray(value)) return value.map(this.attr, this).join(' ');
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      var result = [];
      for (var key in value) {
        if (value[key]) {
          result.push(key);
        }
      }
      return result.join(' ');
    }
    return value + '';
  };

  PugRuntime.prototype.each = function each(iterable, callback) {
    if (!iterable) return;
    if (Array.isArray(iterable)) {
      return arrayIterator(iterable, callback);
    } else if (Symbol.iterable in iterable) {
      return IterableIterator(terable, callback);
    } else if ('length' in iterable) {
      return arrayIterator(slice(iterable), callback);
    } else {
      return objectIterator(iterable, callback);
    }
  };

  return PugRuntime;
}();

exports.PugRuntime = PugRuntime;
function adapter() {
  return new PugRuntime();
}