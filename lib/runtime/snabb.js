'use strict';

exports.__esModule = true;
exports.default = adapter;

var _index = require('./index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SnabbRuntime = function (_PugRuntime) {
  _inherits(SnabbRuntime, _PugRuntime);

  function SnabbRuntime(h) {
    _classCallCheck(this, SnabbRuntime);

    var _this = _possibleConstructorReturn(this, _PugRuntime.call(this));

    _this.h = h;
    return _this;
  }

  SnabbRuntime.prototype.element = function element(properties) {
    var tagName = properties.tagName,
        children = properties.children;


    delete properties.tagName;
    delete properties.children;

    return this.h(tagName, properties, children);
  };

  SnabbRuntime.prototype.attrs = function attrs(context, _attrs) {
    _PugRuntime.prototype.attrs.call(this, { attributes: context.attrs = {} }, _attrs);
  };

  SnabbRuntime.prototype.handles = function handles(context, self, _handles) {
    context.hook = {
      insert: function insert(vnode) {
        for (var _iterator = _handles, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var handle = _ref;

          self[handle] = vnode.elm;
        }
      }
    };
  };

  SnabbRuntime.prototype.events = function events(context, self, _events) {
    var on = context.on = {};
    for (var _iterator2 = _events, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var _ref3 = _ref2,
          event = _ref3[0],
          handler = _ref3[1];

      on[event] = handler;
    }
  };

  SnabbRuntime.prototype.props = function props(context, _props) {
    if (_props.style) {
      context.style = _props.style;
      delete _props.style;
    }
    if (_props.class) {
      context.class = _props.class, _props.className;
      if (context.attrs.class) {
        for (var _iterator3 = context.attrs.class.split(' '), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref4;

          if (_isArray3) {
            if (_i3 >= _iterator3.length) break;
            _ref4 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) break;
            _ref4 = _i3.value;
          }

          var className = _ref4;

          context.class[className] = true;
        }
      }
      delete context.attrs.class;
      delete _props.class;
    }
    context.props = Object.assign(context.props || {}, _props);
  };

  return SnabbRuntime;
}(_index.PugRuntime);

function adapter(vdom) {
  return new SnabbRuntime(vdom);
}