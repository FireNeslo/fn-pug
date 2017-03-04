import transformContext from './helpers/transform-context'
import objectString from './helpers/object-string'

import {unflatten} from 'flat'

export class Compiler {
  compileSource(ast, options={}) {
    this.level = 0
    this.options = options
    this.ast = ast
    this.code = ''
    this.uid = 0

    return this.
      buffer('function template(__INIT__) {').
        indent().
          buffer('var __RESULT__ = $$.init(this, __INIT__)').
          visit(ast, '__RESULT__').
          buffer('return $$.end(__RESULT__)').
        undent().
      buffer('}')
  }
  compile(tree, options) {
    this.compileSource(tree)
    const {code, ast} = transformContext(this.code, this.options.src)
    return Object.assign(this, {code, ast})
  }
  buffer(code, newline=true) {
    var indent = '  '.repeat(this.level)
    this.code += `${indent}${code}${newline ? '\n' : ''}`
    return this
  }
  indent() {
    return this.level += 1, this
  }
  undent() {
    return this.level -= 1, this
  }
  visit(node, context) {
    var type = 'visit' + node.type
    if(this[type]) {
      this[type](node, context)
    } else {
      throw new Error(`${node.type} not implemented!`)
    }
    return this
  }
  visitBlock(block, context) {
    for(var node of block.nodes) {
      this.visit(node, context)
    }
  }
  visitEach(each, context) {
    var object = each.obj
    var args = [each.val, each.key].filter(k => k)

    this.buffer(`$$.each(${object}, (${args}) => {`).indent()
    this.visit(each.block, context)
    this.undent().buffer('})')

    return this
  }
  visitTag(tag, context) {
    var node = `e$${this.uid++}`
    var name = JSON.stringify(tag.name)

    this.buffer(`var ${node} = $$.create(${name})`)

    this.visitAttributes(tag.attrs, node)

    if(tag.block) this.visit(tag.block, node)

    var element = `$$.element(${node})`

    return this.buffer(`$$.child(${context}, ${element})`)
  }
  visitAttributes(attrs, context) {
    const EVENTS = []
    const HANDLES = []
    const ATTRIBUTES = {}
    const PROPERTIES = {}

    for(var {name, val} of attrs) {
      switch (name[0]) {
        case "#":
          HANDLES.push(`${JSON.stringify(name.slice(1))}`)
        break;
        case "(":
          var event = JSON.stringify(name.slice(1, -1))
          EVENTS.push(`[${event}, e => ${val}]`)
          break;
        case "[":
          if(name[1] === '(') {
            var key = name.slice(2, -2)
            var event = JSON.stringify(key + 'Changed')
            PROPERTIES[key] = val
            EVENTS.push(`[${event}, e => ${val} = e.target.${key}]`)
          } else {
            PROPERTIES[name.slice(1, -1)] = val
          }
          break;
        default:
          ATTRIBUTES[name] = val
          break;
      }
    }
    if(Object.keys(ATTRIBUTES).length) {
      var attributes = objectString(ATTRIBUTES)
      this.buffer(`$$.attrs(${context}, ${attributes})`)
    }
    if(Object.keys(PROPERTIES).length) {
      var properties = objectString(unflatten(PROPERTIES))
      this.buffer(`$$.props(${context}, ${properties})`)
    }
    if(HANDLES.length) {
      this.buffer(`$$.handles(${context}, this, [${HANDLES}])`)
    }
    if(EVENTS.length) {
      this.buffer(`$$.events(${context}, this, [${EVENTS}])`)
    }
  }
  visitComment(comment) {
    this.buffer('// ' + comment.val)
  }
  visitText(text, context) {
    this.visitCode({val: `\`${text.val}\``, buffer: true}, context)
  }
  visitCode(code, context) {
    if(code.buffer) {
      this.buffer(`$$.child(${context}, $$.text(${code.val}))`)
    } else {
      this.buffer(code.val)
    }
  }
  visitConditional(code, context) {
    this.buffer(`if(${code.test}) {`).indent()
    this.visit(code.consequent, context)
    this.undent().buffer('}')
    if(code.alternate) {
      this.buffer(' else {').
        indent().
          visit(code.alternate, context).
        undent().
      buffer('}')
    }
    return this
  }
}

export default function compile(ast, options) {
  return new Compiler().compile(ast, options)
}
