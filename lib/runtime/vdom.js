'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = adapter;

var _index = require('./index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VDomRuntime = function (_PugRuntime) {
  _inherits(VDomRuntime, _PugRuntime);

  function VDomRuntime(_ref) {
    var VNode = _ref.VNode,
        VText = _ref.VText;

    _classCallCheck(this, VDomRuntime);

    var _this = _possibleConstructorReturn(this, (VDomRuntime.__proto__ || Object.getPrototypeOf(VDomRuntime)).call(this));

    _this.VNode = VNode;
    _this.VText = VText;
    return _this;
  }

  _createClass(VDomRuntime, [{
    key: 'element',
    value: function element(tagName, properties) {
      var children = properties.children;
      delete properties.children;

      var events = properties.events;

      return new this.VNode(tagName, properties, children);
    }
  }, {
    key: 'text',
    value: function text(_text) {
      return new this.VText(_get(VDomRuntime.prototype.__proto__ || Object.getPrototypeOf(VDomRuntime.prototype), 'text', this).call(this, _text));
    }
  }]);

  return VDomRuntime;
}(_index.PugRuntime);

function adapter(vdom) {
  return new VDomRuntime(vdom);
}