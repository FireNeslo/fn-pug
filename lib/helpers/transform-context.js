'use strict';

exports.__esModule = true;
exports.default = transformContext;

var _babelCore = require('babel-core');

var _babelTypes = require('babel-types');

var _globals = require('globals');

var GLOBALS = Object.assign(_globals.builtin, _globals.browser, _globals.commonjs);

function transformContext(code, source) {
  return (0, _babelCore.transform)(code, {
    plugins: [function transform() {
      return {
        visitor: {
          AssignmentExpression: function AssignmentExpression(path) {
            var node = path.node.left;
            var parents = [];
            while (node.object) {
              parents.push(node);
              node = node.object;
            }
            if (node.name in GLOBALS) return;
            if (path.scope.hasBinding(node.name)) return;
            if (node.name === 'this') return;

            var parent = parents.pop();

            if (parent) {
              parent.object = (0, _babelTypes.memberExpression)((0, _babelTypes.identifier)('this'), node);
            } else {
              path.node.left = (0, _babelTypes.memberExpression)((0, _babelTypes.identifier)('this'), node);
            }
            path.replaceWith(path.node);
          },
          ReferencedIdentifier: function ReferencedIdentifier(path) {
            var node = path.node,
                scope = path.scope;

            if (node.name in GLOBALS) return;
            if (path.scope.hasBinding(node.name)) return;
            if (node.name === 'this') return;
            if (node.name === '$$') return;
            var context = (0, _babelTypes.memberExpression)((0, _babelTypes.identifier)('this'), node);
            path.replaceWith(context);
          }
        }
      };
    }]
  });
}