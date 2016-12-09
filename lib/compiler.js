'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = compile;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = exports.Compiler = function () {
  function Compiler() {
    _classCallCheck(this, Compiler);
  }

  _createClass(Compiler, [{
    key: 'compile',
    value: function compile(ast, options) {
      this.level = 0;
      this.options = options;
      this.ast = ast;
      this.code = '';
      this.uid = 0;

      return this.buffer('function template() {').indent().buffer('var __RESULT__ = {children: []}').visit(ast, '__RESULT__').buffer('return __RESULT__.children').undent().buffer('}');
    }
  }, {
    key: 'buffer',
    value: function buffer(code) {
      var newline = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var indent = '  '.repeat(this.level);
      this.code += '' + indent + code + (newline ? '\n' : '');
      return this;
    }
  }, {
    key: 'indent',
    value: function indent() {
      return this.level += 1, this;
    }
  }, {
    key: 'undent',
    value: function undent() {
      return this.level -= 1, this;
    }
  }, {
    key: 'visit',
    value: function visit(node, context) {
      var type = 'visit' + node.type;
      if (this[type]) {
        this[type](node, context);
      } else {
        throw new Error(node.type + ' not implemented!');
      }
      return this;
    }
  }, {
    key: 'visitBlock',
    value: function visitBlock(block, context) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = block.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var node = _step.value;

          this.visit(node, context);
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
  }, {
    key: 'visitEach',
    value: function visitEach(each, context) {
      var object = each.obj;
      var args = [each.val, each.key].filter(function (k) {
        return k;
      });

      this.buffer('__RUNTIME__.each(' + object + ', (' + args + ') => {').indent();
      this.visit(each.block, context);
      this.undent().buffer('})');

      return this;
    }
  }, {
    key: 'visitTag',
    value: function visitTag(tag, context) {
      var node = 'e$' + this.uid++;
      var name = JSON.stringify(tag.name);

      this.buffer('var ' + node + ' = {children: [], events: {}, attributes: {}}');

      this.visitAttributes(tag.attrs, node);

      if (tag.block) this.visit(tag.block, node);

      var element = '__RUNTIME__.element(' + name + ', ' + node + ')';

      this.buffer(context + '.children.push(' + element + ')');
    }
  }, {
    key: 'visitAttributes',
    value: function visitAttributes(attrs, context) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = attrs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ref = _step2.value;
          var name = _ref.name,
              val = _ref.val;

          switch (name[0]) {
            case "(":
              var event = JSON.stringify(name.slice(1, -1));
              var value = '__RUNTIME__.event(e => ' + val + ')';
              this.buffer(context + '.events[' + event + '] = ' + value);
              break;
            case "[":
              this.buffer(context + '.' + name.slice(1, -1) + ' = ' + val);
              break;
            default:
              var attr = JSON.stringify(name);
              var value = '__RUNTIME__.attr(' + val + ')';
              this.buffer(context + '.attributes[' + attr + '] = ' + value);
              break;
          }
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
    }
  }, {
    key: 'visitComment',
    value: function visitComment(comment) {
      this.buffer('// ' + comment.val);
    }
  }, {
    key: 'visitText',
    value: function visitText(text, context) {
      this.visitCode({ val: '`' + text.val + '`', buffer: true }, context);
    }
  }, {
    key: 'visitCode',
    value: function visitCode(code, context) {
      if (code.buffer) {
        this.buffer(context + '.children.push(__RUNTIME__.text(' + code.val + '))');
      } else {
        this.buffer(code.val);
      }
    }
  }, {
    key: 'visitConditional',
    value: function visitConditional(code, context) {
      this.buffer('if(' + code.test + ') {').indent();
      this.visit(code.consequent, context);
      if (code.alternate && code.alternate.nodes.length) {
        this.undent().buffer('} else {').indent().visit(code.alternate, context);
      }
      this.undent().buffer('}');
    }
  }]);

  return Compiler;
}();

function compile(ast, options) {
  return new Compiler().compile(ast, options);
}