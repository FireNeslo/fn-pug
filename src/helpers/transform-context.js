import {transform} from 'babel-core'
import {memberExpression, identifier} from 'babel-types'
import {builtin, browser, commonjs} from 'globals'

const GLOBALS = Object.assign(Object.create(null), builtin, browser, commonjs)

delete GLOBALS.name
delete GLOBALS.constructor

export default function transformContext(code, source) {
  return transform(code, {
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
             ReferencedIdentifier(path) {
               var {node, scope} = path
               if(node.name in GLOBALS) return
               if(path.scope.hasBinding(node.name)) return
               if(node.name === 'this') return
               if(node.name === '$$') return
               var context = memberExpression(identifier('this'), node)
               path.replaceWith(context)
             }
           }
         }
      }]
    })
}
