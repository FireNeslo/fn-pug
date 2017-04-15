'use strict';

exports.__esModule = true;
exports.default = adapter;

var _index = require('./index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VueRuntime = function (_PugRuntime) {
  _inherits(VueRuntime, _PugRuntime);

  function VueRuntime() {
    _classCallCheck(this, VueRuntime);

    return _possibleConstructorReturn(this, _PugRuntime.apply(this, arguments));
  }

  VueRuntime.prototype.init = function init(context, h) {
    if (h) this.h = h;
    return { children: [] };
  };

  VueRuntime.prototype.element = function element(properties) {
    var tagName = properties.tagName,
        children = properties.children;


    delete properties.tagName;
    delete properties.children;

    return this.h(tagName, properties, children);
  };

  VueRuntime.prototype.attrs = function attrs(context, _attrs) {
    if (_attrs.class) {
      context.class = _attrs.class;
      delete _attrs.class;
    }
    context.attrs = _attrs;
  };

  VueRuntime.prototype.props = function props(context, _props) {
    if (_props.class) {
      if (context.class) {
        context.class = [context.class, _props.class];
      } else {
        context.class = _props.class;
      }
      delete _props.class;
    }
    if (_props.style) {
      context.style = Object.assign(context.style || {}, _props.style);
      delete _props.style;
    }
    context.domProps = _props;
  };

  VueRuntime.prototype.mixin = function mixin(parent, self, _mixin) {
    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    var context = Object.assign.apply(Object, [{}].concat(args));
    var properties = Object.getOwnPropertyDescriptors(context);
    var children = _mixin.call(Object.create(self, properties));

    for (var _iterator = children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var child = _ref;

      this.child(parent, child);
    }
  };

  VueRuntime.prototype.handles = function handles(context, self, _handles) {
    for (var _iterator2 = _handles, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var handle = _ref2;

      context.ref = handle;
    }
  };

  VueRuntime.prototype.events = function events(context, self, _events) {
    var on = context.on = {};
    for (var _iterator3 = _events, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var _ref4 = _ref3,
          event = _ref4[0],
          handler = _ref4[1];

      on[event] = handler;
    }
  };

  return VueRuntime;
}(_index.PugRuntime);

function adapter() {
  return new VueRuntime();
}