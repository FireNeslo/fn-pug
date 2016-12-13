'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pug;
exports.compileClient = compileClient;

var _pugLexer = require('pug-lexer');

var _pugLexer2 = _interopRequireDefault(_pugLexer);

var _pugParser = require('pug-parser');

var _pugParser2 = _interopRequireDefault(_pugParser);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pug(src, opts) {
  return (0, _compiler2.default)((0, _pugParser2.default)((0, _pugLexer2.default)(src), opts = Object.assign({ src: src }, opts)), opts);
}

function compileClient(code, runtime) {
  return Function(['$$'], 'return ' + pug(code).code)(runtime);
}