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

  SnabbRuntime.prototype.element = function element(tagName, properties) {
    var on = properties.events;
    var attrs = properties.attributes;
    var style = properties.style;
    var children = properties.children;
    var props = properties;

    delete props.style;
    delete props.events;
    delete props.children;
    delete props.attributes;

    return this.h(tagName, { on: on, attrs: attrs, props: props, style: style, children: children }, children);
  };

  SnabbRuntime.prototype.events = function events(context, _events) {
    var on = {};
    _events.forEach(function (event) {
      on[event[0]] = event[1];
    });
    return on;
  };

  return SnabbRuntime;
}(_index.PugRuntime);

function adapter(vdom) {
  return new VDomRuntime(vdom);
}