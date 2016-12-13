'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = iterator[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (Array.isArray(item)) {
        callback(item[0], item[1]);
      } else {
        callback(item, index++);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
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

  _createClass(PugRuntime, [{
    key: 'event',
    value: function event(context, value) {
      return value;
    }
  }, {
    key: 'element',
    value: function element(tagName, properties) {
      return Object.assign({ tagName: tagName }, properties);
    }
  }, {
    key: 'handle',
    value: function handle(context, _handle, element) {
      context[_handle] = element;
    }
  }, {
    key: 'text',
    value: function text(_text) {
      return _text != null ? _text : '';
    }
  }, {
    key: 'attr',
    value: function attr(value) {
      if (value == null) return '';
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
    }
  }, {
    key: 'each',
    value: function each(iterable, callback) {
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
    }
  }]);

  return PugRuntime;
}();

exports.PugRuntime = PugRuntime;
function adapter() {
  return new PugRuntime();
}