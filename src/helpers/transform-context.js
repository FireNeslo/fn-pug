import {transform} from 'babel-core'
import {memberExpression, variableDeclarator, identifier} from 'babel-types'
import {builtin, browser, commonjs} from 'globals'

const GLOBALS = Object.assign(Object.create(null), builtin, browser, commonjs)

delete GLOBALS.name
delete GLOBALS.constructor
delete GLOBALS.open

export default function transformContext(code, map) {
  map = JSON.parse(map.toString())
  return transform(code, {
    inputSourceMap: map,
    plugins: [function transform() {
      return {
         visitor: {
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
             if(path.scope.hasBinding(node.name)) return
             if(node.name === 'this') return
             if(node.name === '$$') return

             scope.push(variableDeclarator(
               identifier(node.name),
               memberExpression(identifier('this'), identifier(node.name))
             ));
           }
         }
       }
    }]
  })
}
