'use strict';

exports.__esModule = true;
exports.default = transformContext;

var _babelCore = require('babel-core');

var _babelTypes = require('babel-types');

var _globals = require('globals');

var GLOBALS = Object.assign(Object.create(null), _globals.builtin, _globals.browser, _globals.commonjs);

delete GLOBALS.name;
delete GLOBALS.constructor;
delete GLOBALS.open;

function transformContext(code, map) {
  map = JSON.parse(map.toString());
  return (0, _babelCore.transform)(code, {
    inputSourceMap: map,
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
          CallExpression: function CallExpression(path) {
            var node = path.node,
                scope = path.scope;

            if (node.callee.type !== 'Identifier') return;
            if (node.callee.name in GLOBALS) return;
            if (path.scope.hasBinding(node.callee.name)) return;
            if (node.callee.name === 'this') return;
            if (node.callee.name === '$$') return;

            node.callee = (0, _babelTypes.memberExpression)((0, _babelTypes.identifier)('this'), node.callee);
          },
          ReferencedIdentifier: function ReferencedIdentifier(path) {
            var node = path.node,
                scope = path.scope;

            if (node.name in GLOBALS) return;
            if (path.scope.hasBinding(node.name)) return;
            if (node.name === 'this') return;
            if (node.name === '$$') return;

            scope.push((0, _babelTypes.variableDeclarator)((0, _babelTypes.identifier)(node.name), (0, _babelTypes.memberExpression)((0, _babelTypes.identifier)('this'), (0, _babelTypes.identifier)(node.name))));
          }
        }
      };
    }]
  });
}