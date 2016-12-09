import lex from 'pug-lexer'
import parse from 'pug-parser'
import compile from './compiler'

export default function pug(src, opts) {
  return compile(parse(lex(src), opts = Object.assign({src}, opts)), opts)
}

export function compileClient(code, runtime) {
  return Function(['__RUNTIME__'], 'return ' + pug(code).code)(runtime)
}
