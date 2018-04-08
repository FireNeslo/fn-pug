import {transform} from 'babel-core'
import {memberExpression, variableDeclarator, identifier} from 'babel-types'
import {builtin, browser, commonjs} from 'globals'

const GLOBALS = Object.assign(Object.create(null), builtin, browser, commonjs)

delete GLOBALS.name
delete GLOBALS.constructor
delete GLOBALS.open

export default function transformContext(code, map) {
  map = JSON.parse(map.toString())
  const referenced = new Map()
  const imported = []

  return transform(code, {
    inputSourceMap: map,
    parserOpts: {
      allowImportExportEverywhere: true
    },
    plugins: [function transform() {
      return {
        visitor: {
          ImportDeclaration(path) {
            imported.push(path.node)
            path.remove()
          },
          AssignmentExpression(path) {
            var node = path.node.left
            var parents = []
            while(node.object) {
              parents.push(node)
              node = node.object
            }
            if(node.name in GLOBALS) return
            if(path.scope.hasBinding(node.name)) return
            if(node.name === 'this') return

            var parent = parents.pop()

            if(parent) {
              parent.object = memberExpression(identifier('this'), node)
            } else {
              path.node.left = memberExpression(identifier('this'), node)
            }
            path.replaceWith(path.node)
          },
          CallExpression(path) {
            var {node, scope} = path
            if(node.callee.type !== 'Identifier') return
            if(node.callee.name in GLOBALS) return
            if(path.scope.hasBinding(node.callee.name)) return
            if(node.callee.name === 'this') return
            if(node.callee.name === '$$') return

            node.callee = memberExpression(identifier('this'), node.callee)
          },
          ReferencedIdentifier(path) {
            var {node, scope} = path

            if(node.name in GLOBALS) return
            if(scope.hasBinding(node.name)) return
            if(node.name === 'this') return
            if(node.name === '$$') return

            if(!referenced.has(scope)) {
              referenced.set(scope, new Set())
            }

            referenced.get(scope).add(node.name)
          },
          Program: {
            exit(path) {
              for(const node of imported) {
                path.node.body.unshift(node)
              }

              for(const [scope, bindings] of referenced) {
                for(const name of bindings) {
                  if(scope.hasBinding(name)) continue

                  scope.push(variableDeclarator(
                    identifier(name),
                    memberExpression(identifier('this'), identifier(name))
                  ))
                }
              }
            }
          }
        }
      }
    }]
  })
}
