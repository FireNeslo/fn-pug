'use strict';

exports.__esModule = true;
exports.default = adapter;

var _index = require('./index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DomRuntime = function (_PugRuntime) {
  _inherits(DomRuntime, _PugRuntime);

  function DomRuntime(document) {
    _classCallCheck(this, DomRuntime);

    var _this = _possibleConstructorReturn(this, _PugRuntime.call(this));

    _this.document = document || global.document;
    return _this;
  }

  DomRuntime.prototype.init = function init() {
    return this.document.createDocumentFragment();
  };

  DomRuntime.prototype.create = function create(tag) {
    return this.document.createElement(tag);
  };

  DomRuntime.prototype.element = function element(_element) {
    return _element;
  };

  DomRuntime.prototype.text = function text(_text) {
    return this.document.createTextNode(_text || '');
  };

  DomRuntime.prototype.child = function child(parent, _child) {
    parent.appendChild(_child);
  };

  DomRuntime.prototype.attrs = function attrs(element, _attrs) {
    for (var attr in _attrs) {
      if (_attrs[attr]) {
        element.setAttribute(attr, this.attr(_attrs[attr]));
      }
    }
  };

  DomRuntime.prototype.handles = function handles(element, self, _handles) {
    self[_handles] = element;
  };

  DomRuntime.prototype.events = function events(element, self, _events) {
    for (var _iterator = _events, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _ref2 = _ref,
          event = _ref2[0],
          handler = _ref2[1];

      element.addEventListener(event, handler);
    }
  };

  DomRuntime.prototype.props = function props(element, _props) {
    if (_props.style) {
      Object.assign(element.style, _props.style);
      delete _props.style;
    }

    Object.assign(element, _props);

    if (_props.class) {
      var classes = this.attr(_props.class);
      if (classes) {
        for (var _iterator2 = classes.split(' '), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref3;

          if (_isArray2) {
            if (_i2 >= _iterator2.length) break;
            _ref3 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done) break;
            _ref3 = _i2.value;
          }

          var className = _ref3;

          element.classList.add(className);
        }
      }
    }
  };

  DomRuntime.prototype.end = function end(element) {
    return element;
  };

  return DomRuntime;
}(_index.PugRuntime);

function adapter(document) {
  return new DomRuntime(document);
}