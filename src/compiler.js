import {SourceMapGenerator} from 'source-map'
import transformContext from './helpers/transform-context'
import objectString from './helpers/object-string'
import path from 'path'

import {unflatten} from 'flat'

export class Compiler {
  compileSource(ast, options={}) {
    this.level = 0
    this.line = 1
    this.options = options
    this.file = options.file || 'template.pug'
    this.ast = ast
    this.map = new SourceMapGenerator({ file: this.file  })
    this.code = ''
    this.uid = 0
    this.map.setSourceContent(this.file, options.src)
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
    this.compileSource(tree, options)
    const {code, ast, map} = transformContext(this.code, this.map)
    return Object.assign(this, {code, ast, map})
  }
  buffer(code, newline=true) {
    var indent = '  '.repeat(this.level)
    var code = `${indent}${code}${newline ? '\n' : ''}`

    if(this.node) {
      this.map.addMapping({
        name: this.node.name,
        source: this.file,
        original: { line: this.node.line, column: 0},
        generated: { line: this.line, column: 0}
      })
    }

    this.line += code.match(/\n/g).length
    this.code += code
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

    this.node = node
    this.node.context = context
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
          if(!ATTRIBUTES[name]) ATTRIBUTES[name] = []
          ATTRIBUTES[name].push(val)
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
  visitBlockComment(comment) {
    this.buffer('/*' + comment.val+'*/')
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
  visitMixin(mixin, context) {
    const ATTRIBUTES = {}
    var attributes = ''
    if(mixin.attrs.length) {
      for(let {name, val} of mixin.attrs) {
        ATTRIBUTES[name] = val
      }
      attributes = objectString(ATTRIBUTES)
    }
    if(mixin.args) {
      attributes += (attributes ? ',' : '' ) + mixin.args
    }
    if(attributes) {
      this.buffer(`$$.mixin(${context}, this, ${mixin.name}, ${attributes})`)
    } else {
      this.buffer(`$$.mixin(${context}, this, ${mixin.name})`)
    }
  }
}

export default function compile(ast, options) {
  return new Compiler().compile(ast, options)
}
