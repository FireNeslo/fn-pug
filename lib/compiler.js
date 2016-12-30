'use strict';

exports.__esModule = true;
exports.Compiler = undefined;
exports.default = compile;

var _transformContext2 = require('./helpers/transform-context');

var _transformContext3 = _interopRequireDefault(_transformContext2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = exports.Compiler = function () {
  function Compiler() {
    _classCallCheck(this, Compiler);
  }

  Compiler.prototype.compileSource = function compileSource(ast) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.level = 0;
    this.options = options;
    this.ast = ast;
    this.code = '';
    this.uid = 0;

    return this.buffer('function template() {').indent().buffer('var __RESULT__ = {children: []}').visit(ast, '__RESULT__').buffer('return __RESULT__.children').undent().buffer('}');
  };

  Compiler.prototype.compile = function compile(tree, options) {
    this.compileSource(tree);

    var _transformContext = (0, _transformContext3.default)(this.code, this.options.src),
        code = _transformContext.code,
        ast = _transformContext.ast;

    return Object.assign(this, { code: code, ast: ast });
  };

  Compiler.prototype.buffer = function buffer(code) {
    var newline = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var indent = '  '.repeat(this.level);
    this.code += '' + indent + code + (newline ? '\n' : '');
    return this;
  };

  Compiler.prototype.indent = function indent() {
    return this.level += 1, this;
  };

  Compiler.prototype.undent = function undent() {
    return this.level -= 1, this;
  };

  Compiler.prototype.visit = function visit(node, context) {
    var type = 'visit' + node.type;
    if (this[type]) {
      this[type](node, context);
    } else {
      throw new Error(node.type + ' not implemented!');
    }
    return this;
  };

  Compiler.prototype.visitBlock = function visitBlock(block, context) {
    for (var _iterator = block.nodes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var node = _ref;

      this.visit(node, context);
    }
  };

  Compiler.prototype.visitEach = function visitEach(each, context) {
    var object = each.obj;
    var args = [each.val, each.key].filter(function (k) {
      return k;
    });

    this.buffer('$$.each(' + object + ', (' + args + ') => {').indent();
    this.visit(each.block, context);
    this.undent().buffer('})');

    return this;
  };

  Compiler.prototype.visitTag = function visitTag(tag, context) {
    var node = 'e$' + this.uid++;
    var name = JSON.stringify(tag.name);

    this.buffer('var ' + node + ' = {children: [], class: {}, style: {}}');

    this.visitAttributes(tag.attrs, node);

    if (tag.block) this.visit(tag.block, node);

    var element = '$$.element(' + name + ', ' + node + ')';

    return this.buffer(context + '.children.push(' + element + ')');
  };

  Compiler.prototype.visitAttributes = function visitAttributes(attrs, context) {
    var EVENTS = [];
    var HANDLES = [];
    var ATTRIBUTES = {};

    for (var _iterator2 = attrs, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var _ref2 = _ref3;
      var name = _ref2.name,
          val = _ref2.val;

      switch (name[0]) {
        case "#":
          HANDLES.push('' + JSON.stringify(name.slice(1)));
          break;
        case "(":
          var event = JSON.stringify(name.slice(1, -1));
          EVENTS.push('[' + event + ', e => ' + val + ']');
          break;
        case "[":
          if (name[1] === '(') {
            var key = name.slice(2, -2);
            var event = JSON.stringify(key + 'Changed');
            this.buffer(context + '.' + key + ' = $$.prop(' + val + ')');
            EVENTS.push('[' + event + ', e => ' + val + ' = e.target.' + key + ']');
          } else {
            this.buffer(context + '.' + name.slice(1, -1) + ' = $$.prop(' + val + ')');
          }
          break;
        default:
          if (!ATTRIBUTES[name]) {
            ATTRIBUTES[name] = [];
          }
          ATTRIBUTES[name].push(val);
          break;
      }
    }
    if (Object.keys(ATTRIBUTES).length) {
      var attributes = Object.keys(ATTRIBUTES).map(function (attr) {
        var value = ATTRIBUTES[attr];
        if (value.length === 1) {
          return JSON.stringify(attr) + ': ' + value;
        }
        return JSON.stringify(attr) + ': [' + value + ']';
      });
      this.buffer(context + '.attributes = $$.attrs({' + attributes + '})');
    }
    if (HANDLES.length) {
      this.buffer(context + '.handles = $$.handles(this, [' + HANDLES + '])');
    }
    if (EVENTS.length) {
      this.buffer(context + '.events = $$.events(this, [' + EVENTS + '])');
    }
  };

  Compiler.prototype.visitComment = function visitComment(comment) {
    this.buffer('// ' + comment.val);
  };

  Compiler.prototype.visitText = function visitText(text, context) {
    this.visitCode({ val: '`' + text.val + '`', buffer: true }, context);
  };

  Compiler.prototype.visitCode = function visitCode(code, context) {
    if (code.buffer) {
      this.buffer(context + '.children.push($$.text(' + code.val + '))');
    } else {
      this.buffer(code.val);
    }
  };

  Compiler.prototype.visitConditional = function visitConditional(code, context) {
    this.buffer('if(' + code.test + ') {').indent();
    this.visit(code.consequent, context);
    this.undent().buffer('}');
    if (code.alternate) {
      this.buffer(' else {').indent().visit(code.alternate, context).undent().buffer('}');
    }
    return this;
  };

  return Compiler;
}();

function compile(ast, options) {
  return new Compiler().compile(ast, options);
}