'use strict';

exports.__esModule = true;
exports.default = adapter;

var _index = require('./index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactRuntime = function (_PugRuntime) {
  _inherits(ReactRuntime, _PugRuntime);

  function ReactRuntime(React) {
    _classCallCheck(this, ReactRuntime);

    var _this = _possibleConstructorReturn(this, _PugRuntime.call(this));

    _this.React = React;
    return _this;
  }

  ReactRuntime.prototype.element = function element(props) {
    var tagName = props.tagName,
        children = props.children;


    delete props.tagName;
    delete props.children;

    if (!props.key) {
      props.key = Math.random();
    }
    if (props.dangerouslySetInnerHTML) {
      return this.React.createElement(tagName, props);
    }
    return this.React.createElement(tagName, props, children.length && children || null);
  };

  ReactRuntime.prototype.attrs = function attrs(attributes, _attrs) {
    _PugRuntime.prototype.attrs.call(this, { attributes: attributes }, _attrs);
  };

  ReactRuntime.prototype.handles = function handles(value, context, name) {
    value.ref = function (node) {
      return context[name] = node;
    };
  };

  ReactRuntime.prototype.props = function props(target, _props) {
    if (target.class) {
      if (target.className) {
        target.className = [target.className, target.class].join(' ');
      } else {
        target.className = target.class;
      }
      delete target.class;
    }
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

      var key = _ref;

      switch (key) {
        case "innerHTML":
          target.dangerouslySetInnerHTML = { __html: _props[key] };
          break;
        case "class":
          var className = this.attr(_props[key]);
          if (!className) continue;
          if (target.className) {
            className += ' ' + target.className;
          }
          target.className = className;
          break;
        default:
          target[key] = _props[key];
          break;
      }
    }
  };

  ReactRuntime.prototype.events = function events(context, self, _events) {
    var on = context;
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
          name = _ref3[0],
          handler = _ref3[1];

      on['on' + name.slice(0, 1).toUpperCase() + name.slice(1)] = handler;
    }
  };

  return ReactRuntime;
}(_index.PugRuntime);

function adapter(React) {
  return new ReactRuntime(React);
}