export class Compiler {
  compile(ast, options) {
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

    this.buffer(`__RUNTIME__.each(${object}, (${args}) => {`).indent()
    this.visit(each.block, context)
    this.undent().buffer('})')

    return this
  }
  visitTag(tag, context) {
    var node = `e$${this.uid++}`
    var name = JSON.stringify(tag.name)

    this.buffer(`var ${node} = {children: [], events: {}, attributes: {}}`)

    this.visitAttributes(tag.attrs, node)

    if(tag.block) this.visit(tag.block, node)

    var element = `__RUNTIME__.element(${name}, ${node})`

    this.buffer(`${context}.children.push(${element})`)
  }
  visitAttributes(attrs, context) {
    for(var {name, val} of attrs) {
      switch (name[0]) {
        case "(":
          var event = JSON.stringify(name.slice(1, -1))
          var value = `__RUNTIME__.event(e => ${val})`
          this.buffer(`${context}.events[${event}] = ${value}`)
          break;
        case "[":
          this.buffer(`${context}.${name.slice(1, -1)} = ${val}`)
          break;
        default:
          var attr = JSON.stringify(name)
          var value = `__RUNTIME__.attr(${val})`
          this.buffer(`${context}.attributes[${attr}] = ${value}`)
          break;
      }
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
      this.buffer(`${context}.children.push(__RUNTIME__.text(${code.val}))`)
    } else {
      this.buffer(code.val)
    }
  }
  visitConditional(code, context) {
    this.buffer(`if(${code.test}) {`).indent()
    this.visit(code.consequent, context)
    if(code.alternate && code.alternate.nodes.length) {
      this.undent().buffer('} else {').indent().visit(code.alternate, context)
    }
    this.undent().buffer('}')
  }
}

export default function compile(ast, options) {
  return new Compiler().compile(ast, options)
}
