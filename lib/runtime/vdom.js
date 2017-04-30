'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = adapter;

var _index = require('./index');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventHook = function () {
  function EventHook(events) {
    _classCallCheck(this, EventHook);

    this.events = events;
  }

  EventHook.prototype.hook = function hook(node, prop, self) {
    var previous = self ? self.events : [];
    for (var _iterator = previous, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _ref3 = _ref,
          event = _ref3[0],
          callback = _ref3[1];

      node.removeEventListener(event, callback);
    }
    for (var _iterator2 = this.events, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var _ref4 = _ref2,
          event = _ref4[0],
          callback = _ref4[1];

      node.addEventListener(event, callback);
    }
  };

  EventHook.prototype.unhook = function unhook(node) {
    for (var _iterator3 = this.events, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref5 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref5 = _i3.value;
      }

      var _ref6 = _ref5,
          event = _ref6[0],
          callback = _ref6[1];

      node.removeEventListener(event, callback);
    }
  };

  return EventHook;
}();

var PropertyHook = function () {
  function PropertyHook(value) {
    _classCallCheck(this, PropertyHook);

    this.value = value;
  }

  PropertyHook.prototype.hook = function hook(node, property, self) {
    var previous = self && self.value;
    if (!previous && this.value !== undefined || this.value !== previous) {
      node[property] = this.value;
    }
  };

  return PropertyHook;
}();

var HandleHook = function () {
  function HandleHook(context, names) {
    _classCallCheck(this, HandleHook);

    this.context = context;
    this.names = names;
  }

  HandleHook.prototype.hook = function hook(node, prop, previous) {
    for (var _iterator4 = this.names, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref7;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref7 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref7 = _i4.value;
      }

      var name = _ref7;

      this.context[name] = node;
    }
  };

  HandleHook.prototype.unhook = function unhook() {
    for (var _iterator5 = this.names, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
      var _ref8;

      if (_isArray5) {
        if (_i5 >= _iterator5.length) break;
        _ref8 = _iterator5[_i5++];
      } else {
        _i5 = _iterator5.next();
        if (_i5.done) break;
        _ref8 = _i5.value;
      }

      var name = _ref8;

      this.context[name] = null;
    }
  };

  return HandleHook;
}();

var VDomRuntime = function (_PugRuntime) {
  _inherits(VDomRuntime, _PugRuntime);

  function VDomRuntime(h) {
    _classCallCheck(this, VDomRuntime);

    var _this = _possibleConstructorReturn(this, _PugRuntime.call(this));

    _this.h = h;
    return _this;
  }

  VDomRuntime.prototype.element = function element(properties) {
    return this.h(properties.tagName, properties, properties.children);
  };

  VDomRuntime.prototype.events = function events(value, context, _events) {
    return value.events = new EventHook(_events, context);
  };

  VDomRuntime.prototype.handles = function handles(value, context, name) {
    value.handle = new HandleHook(context, name);
  };

  VDomRuntime.prototype.text = function text(_text) {
    if (_text && _text.type === 'VirtualNode') {
      return _text;
    }
    return _PugRuntime.prototype.text.call(this, _text);
  };

  VDomRuntime.prototype.attrs = function attrs(context, value) {
    if (_typeof(value.style) === 'object') {
      context.style = value.style;
      delete value.style;
    }
    return _PugRuntime.prototype.attrs.call(this, context, value);
  };

  VDomRuntime.prototype.props = function props(context, value) {
    for (var _iterator6 = Object.keys(value), _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
      var _ref9;

      if (_isArray6) {
        if (_i6 >= _iterator6.length) break;
        _ref9 = _iterator6[_i6++];
      } else {
        _i6 = _iterator6.next();
        if (_i6.done) break;
        _ref9 = _i6.value;
      }

      var key = _ref9;

      switch (key) {
        case "class":
          var className = this.attr(value[key]);
          if (!className) continue;
          if (context.attributes && context.attributes.class) {
            className = context.attributes.class + ' ' + className;
            delete context.attributes.class;
          }
          if (context.className) {
            className += ' ' + context.className;
          }
          context.className = className;
          break;
        case "style":
          context[key] = value[key];
          break;
        default:
          context[key] = new PropertyHook(value[key]);
      }
    }
  };

  return VDomRuntime;
}(_index.PugRuntime);

function adapter(vdom) {
  return new VDomRuntime(vdom);
}