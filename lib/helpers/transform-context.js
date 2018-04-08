'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformContext;

var _babelCore = require('babel-core');

var _babelTypes = require('babel-types');

var _globals = require('globals');

const GLOBALS = Object.assign(Object.create(null), _globals.builtin, _globals.browser, _globals.commonjs);

delete GLOBALS.name;
delete GLOBALS.constructor;
delete GLOBALS.open;

function transformContext(code, map) {
  map = JSON.parse(map.toString());
  const referenced = new Map();
  const imported = [];

  return (0, _babelCore.transform)(code, {
    inputSourceMap: map,
    parserOpts: {
      allowImportExportEverywhere: true
    },
    plugins: [function transform() {
      return {
        visitor: {
          ImportDeclaration(path) {
            imported.push(path.node);
            path.remove();
          },
          AssignmentExpression(path) {
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
          CallExpression(path) {
            var { node, scope } = path;
            if (node.callee.type !== 'Identifier') return;
            if (node.callee.name in GLOBALS) return;
            if (path.scope.hasBinding(node.callee.name)) return;
            if (node.callee.name === 'this') return;
            if (node.callee.name === '$$') return;

            node.callee = (0, _babelTypes.memberExpression)((0, _babelTypes.identifier)('this'), node.callee);
          },
          ReferencedIdentifier(path) {
            var { node, scope } = path;

            if (node.name in GLOBALS) return;
            if (scope.hasBinding(node.name)) return;
            if (node.name === 'this') return;
            if (node.name === '$$') return;

            if (!referenced.has(scope)) {
              referenced.set(scope, new Set());
            }

            referenced.get(scope).add(node.name);
          },
          Program: {
            exit(path) {
              for (const node of imported) {
                path.node.body.unshift(node);
              }

              for (const [scope, bindings] of referenced) {
                for (const name of bindings) {
                  if (scope.hasBinding(name)) continue;

                  scope.push((0, _babelTypes.variableDeclarator)((0, _babelTypes.identifier)(name), (0, _babelTypes.memberExpression)((0, _babelTypes.identifier)('this'), (0, _babelTypes.identifier)(name))));
                }
              }
            }
          }
        }
      };
    }]
  });
}