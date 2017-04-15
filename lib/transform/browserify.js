'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = 'fn-pug/lib/runtime';

var RUNTIMES = {
  'dom': 'require(\'' + root + '/dom\').default(document)',
  'virtual-dom': 'require(\'' + root + '/vdom\').default(require(\'virtual-dom/h\'))',
  'snabbdom': 'require(\'' + root + '/snabb\').default(require(\'snabbdom/h\').default)',
  'react': 'require(\'' + root + '/react\').default(require(\'react\'))',
  'vue': 'require(\'' + root + '/vue\').default()'
};

module.exports = function browserify(file) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var extensions = options.extensions || ['.jade', '.pug'];

  if (extensions.indexOf(_path2.default.extname(file)) < 0) return (0, _through2.default)();

  var runtime = RUNTIMES[options.runtime || 'vdom'] || options.runtime;
  var content = [];

  function collect(buffer, encoding, next) {
    content.push(buffer);
    next();
  }

  function transform(done) {
    try {
      var source = Buffer.concat(content).toString();
      var header = 'var $$ = ' + runtime;
      var template = (0, _2.default)(source, options);
      var footer = 'module.exports = template';
      var _module = [header, template.code, footer].join('\n');

      this.push(new Buffer(_module));
      done();
    } catch (error) {
      done(error);
    }
  }

  return (0, _through2.default)(collect, transform);
};