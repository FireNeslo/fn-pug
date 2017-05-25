'use strict';

exports.__esModule = true;
exports.Compiler = undefined;
exports.default = compile;

var _sourceMap = require('source-map');

var _transformContext2 = require('./helpers/transform-context');

var _transformContext3 = _interopRequireDefault(_transformContext2);

var _objectString = require('./helpers/object-string');

var _objectString2 = _interopRequireDefault(_objectString);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _flat = require('flat');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = exports.Compiler = function () {
  function Compiler() {
    _classCallCheck(this, Compiler);
  }

  Compiler.prototype.compileSource = function compileSource(ast) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.level = 0;
    this.line = 1;
    this.options = options;
    this.file = options.file || 'template.pug';
    this.ast = ast;
    this.map = new _sourceMap.SourceMapGenerator({
      file: _path2.default.basename(this.file),
      sourceRoot: _path2.default.dirname(this.file)
    });
    this.code = '';
    this.uid = 0;
    this.map.setSourceContent(this.file, options.src);
    return this.buffer('function template(__INIT__) {').indent().buffer('var __RESULT__ = $$.init(this, __INIT__)').visit(ast, '__RESULT__').buffer('return $$.end(__RESULT__)').undent().buffer('}');
  };

  Compiler.prototype.compile = function compile(tree, options) {
    this.compileSource(tree, options);

    var _transformContext = (0, _transformContext3.default)(this.code, this.map),
        code = _transformContext.code,
        ast = _transformContext.ast,
        map = _transformContext.map;

    return Object.assign(this, { code: code, ast: ast, map: map });
  };

  Compiler.prototype.buffer = function buffer(code) {
    var newline = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var indent = '  '.repeat(this.level);
    var code = '' + indent + code + (newline ? '\n' : '');

    if (this.node) {
      this.map.addMapping({
        name: this.node.name,
        source: this.file,
        original: { line: this.node.line, column: 0 },
        generated: { line: this.line, column: 0 }
      });
    }

    this.line += code.match(/\n/g).length;
    this.code += code;
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

    this.node = node;
    this.node.context = context;
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

    this.buffer('var ' + node + ' = $$.create(' + name + ')');

    this.visitAttributes(tag.attrs, node);

    if (tag.block) this.visit(tag.block, node);

    var element = '$$.element(' + node + ')';

    return this.buffer('$$.child(' + context + ', ' + element + ')');
  };

  Compiler.prototype.visitAttributes = function visitAttributes(attrs, context) {
    var EVENTS = [];
    var HANDLES = [];
    var ATTRIBUTES = {};
    var PROPERTIES = {};

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
            PROPERTIES[key] = val;
            EVENTS.push('[' + event + ', e => ' + val + ' = e.target.' + key + ']');
          } else {
            PROPERTIES[name.slice(1, -1)] = val;
          }
          break;
        default:
          if (!ATTRIBUTES[name]) ATTRIBUTES[name] = [];
          ATTRIBUTES[name].push(val);
          break;
      }
    }
    if (Object.keys(ATTRIBUTES).length) {
      var attributes = (0, _objectString2.default)(ATTRIBUTES);
      this.buffer('$$.attrs(' + context + ', ' + attributes + ')');
    }
    if (Object.keys(PROPERTIES).length) {
      var properties = (0, _objectString2.default)((0, _flat.unflatten)(PROPERTIES));
      this.buffer('$$.props(' + context + ', ' + properties + ')');
    }
    if (HANDLES.length) {
      this.buffer('$$.handles(' + context + ', this, [' + HANDLES + '])');
    }
    if (EVENTS.length) {
      this.buffer('$$.events(' + context + ', this, [' + EVENTS + '])');
    }
  };

  Compiler.prototype.visitComment = function visitComment(comment) {
    this.buffer('// ' + comment.val);
  };

  Compiler.prototype.visitBlockComment = function visitBlockComment(comment) {
    this.buffer('/*' + comment.val + '*/');
  };

  Compiler.prototype.visitText = function visitText(text, context) {
    this.visitCode({ val: '`' + text.val + '`', buffer: true }, context);
  };

  Compiler.prototype.visitCode = function visitCode(code, context) {
    if (code.buffer) {
      this.buffer('$$.child(' + context + ', $$.text(' + code.val + '))');
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

  Compiler.prototype.visitMixin = function visitMixin(mixin, context) {
    var ATTRIBUTES = {};
    var attributes = '';
    if (mixin.attrs.length) {
      for (var _iterator3 = mixin.attrs, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref5;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref5 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref5 = _i3.value;
        }

        var _ref6 = _ref5;
        var name = _ref6.name,
            val = _ref6.val;

        ATTRIBUTES[name] = val;
      }
      attributes = (0, _objectString2.default)(ATTRIBUTES);
    }
    if (mixin.args) {
      attributes += (attributes ? ',' : '') + mixin.args;
    }
    if (attributes) {
      this.buffer('$$.mixin(' + context + ', this, ' + mixin.name + ', ' + attributes + ')');
    } else {
      this.buffer('$$.mixin(' + context + ', this, ' + mixin.name + ')');
    }
  };

  return Compiler;
}();

function compile(ast, options) {
  return new Compiler().compile(ast, options);
}