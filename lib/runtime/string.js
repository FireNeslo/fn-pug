'use strict';

exports.__esModule = true;
exports.default = adapter;

var _index = require('./index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StringRuntime = function (_PugRuntime) {
  _inherits(StringRuntime, _PugRuntime);

  function StringRuntime() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, StringRuntime);

    var _this = _possibleConstructorReturn(this, _PugRuntime.call(this));

    _this.options = options;
    return _this;
  }

  StringRuntime.prototype.init = function init() {
    this.level = 0;
    return { html: '' };
  };

  StringRuntime.prototype.indent = function indent() {
    if (!this.options.pretty) {
      return '';
    }
    return '\n' + '  '.repeat(this.level);
  };

  StringRuntime.prototype.create = function create(tagName) {
    this.level += 1;
    return { tagName: tagName, attrs: '', html: '', className: '' };
  };

  StringRuntime.prototype.element = function element(tag) {
    this.level -= 1;
    var indent = this.indent();
    return indent + '<' + tag.tagName + tag.attrs + '>' + tag.html + indent + '</' + tag.tagName + '>';
  };

  StringRuntime.prototype.text = function text(_text) {
    var indent = this.indent();
    return indent + (_text || '').split('\n').join(indent);
  };

  StringRuntime.prototype.child = function child(parent, _child) {
    parent.html += _child;
  };

  StringRuntime.prototype.attrs = function attrs(element, _attrs) {
    if (_attrs.class) {
      element.className = this.attr(_attrs.class);
    }
    delete _attrs.class;
    _attrs = Object.keys(_attrs).map(function (attr) {
      return attr + '="' + _attrs[attr] + '"';
    }).join(' ');
    if (_attrs) {
      element.attrs = ' ' + _attrs;
    }
  };

  StringRuntime.prototype.props = function props(element, _props) {
    var attrs = [];
    for (var _iterator = Object.keys(_props), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var prop = _ref;

      switch (prop) {
        case "innerHTML":
          element.html = this.text(_props[prop]);
          break;
        case "class":
          var className = this.attr(_props[prop]);
          if (!className) continue;
          if (element.className) {
            className += ' ' + element.className;
          }
          if (className) {
            attrs.push('class="' + className + '"');
          }
          break;
        case "style":
          var style = Object.keys(_props[prop]).map(function (key) {
            return key + ':' + _props[prop][key];
          }).join(';');
          attrs.push('style="' + style + '"');
          break;
        default:
          attrs.push('[' + prop + ']=\'' + JSON.stringify(_props[prop]) + '\'');
          break;
      }
      if (attrs.length) {
        element.attrs = ' ' + attrs.join(' ') + element.attrs;
      }
    }
  };

  StringRuntime.prototype.end = function end(element) {
    return element.html || element;
  };

  return StringRuntime;
}(_index.PugRuntime);

function adapter(options) {
  return new StringRuntime(options);
}