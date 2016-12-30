import transformContext from './helpers/transform-context'


export class Compiler {
  compileSource(ast, options={}) {
    this.level = 0
    this.options = options
    this.ast = ast
    this.code = ''
    this.uid = 0

    return this.
      buffer('function template() {').
        indent().
          buffer('var __RESULT__ = {children: []}').
          visit(ast, '__RESULT__').
          buffer('return __RESULT__.children').
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

    this.buffer(`var ${node} = {children: [], class: {}, style: {}}`)

    this.visitAttributes(tag.attrs, node)

    if(tag.block) this.visit(tag.block, node)

    var element = `$$.element(${name}, ${node})`

    return this.buffer(`${context}.children.push(${element})`)
  }
  visitAttributes(attrs, context) {
    const EVENTS = []
    const HANDLES = []
    const ATTRIBUTES = {}

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
            this.buffer(`${context}.${key} = $$.prop(${val})`)
            EVENTS.push(`[${event}, e => ${val} = e.target.${key}]`)
          } else {
            this.buffer(`${context}.${name.slice(1, -1)} = $$.prop(${val})`)
          }
          break;
        default:
          if(!ATTRIBUTES[name]) {
            ATTRIBUTES[name] = []
          }
          ATTRIBUTES[name].push(val)
          break;
      }
    }
    if(Object.keys(ATTRIBUTES).length) {
      var attributes = Object.keys(ATTRIBUTES)
        .map(attr => {
          var value = ATTRIBUTES[attr]
          if(value.length === 1) {
            return `${JSON.stringify(attr)}: ${value}`
          }
          return `${JSON.stringify(attr)}: [${value}]`
        })
      this.buffer(`${context}.attributes = $$.attrs({${attributes}})`)
    }
    if(HANDLES.length) {
      this.buffer(`${context}.handles = $$.handles(this, [${HANDLES}])`)
    }
    if(EVENTS.length) {
      this.buffer(`${context}.events = $$.events(this, [${EVENTS}])`)
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
      this.buffer(`${context}.children.push($$.text(${code.val}))`)
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
