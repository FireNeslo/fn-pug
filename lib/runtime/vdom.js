'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

  _createClass(EventHook, [{
    key: 'hook',
    value: function hook(node, prop) {
      var previous = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = previous[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              event = _step$value[0],
              callback = _step$value[1];

          node.removeEventListener(event, callback);
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              event = _step2$value[0],
              callback = _step2$value[1];

          node.addEventListener(event, callback);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return this.events;
    }
  }, {
    key: 'unhook',
    value: function unhook() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.events[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _step3$value = _slicedToArray(_step3.value, 2),
              event = _step3$value[0],
              callback = _step3$value[1];

          node.removeEventListener(event, callback);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }]);

  return EventHook;
}();

var HandleHook = function () {
  function HandleHook(context, name) {
    _classCallCheck(this, HandleHook);

    this.context = context;
    this.name = name;
  }

  _createClass(HandleHook, [{
    key: 'hook',
    value: function hook(node, prop, previous) {
      this.context[this.name] = node;
    }
  }, {
    key: 'unhook',
    value: function unhook() {
      this.context[this.name] = null;
    }
  }]);

  return HandleHook;
}();

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
      var attrs = properties.attributes;
      properties.events = new EventHook(properties.events);

      if (attrs.class) {
        attrs.class = this.attr([attrs.class, properties.class]);
      } else {
        attrs.class = this.attr(properties.class);
      }
      return new this.VNode(tagName, properties, properties.children);
    }
  }, {
    key: 'handle',
    value: function handle(context, name, node) {
      node['#' + name] = new HandleHook(context, name);
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