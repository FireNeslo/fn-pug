import path from 'path'
import through from 'through2'
import fnPug from '..'

const root = 'fn-pug/lib/runtime'

const RUNTIMES = {
  'vdom': `require('${root}/vdom').default(require('virtual-dom'))`,
  'virtual-dom': `require('${root}/vdom').default(require('virtual-dom'))`,
  'snabbdom': `require('${root}/snabb').default(require('snabbdom/h').default)`,
  'snabb': `require('${root}/snabb').default(require('snabbdom/h').default)`
}

module.exports = function browserify(file, options={}) {
  const extensions = options.extensions || ['.jade', '.pug']

  if(extensions.indexOf(path.extname(file)) < 0) return through()

  const runtime = RUNTIMES[options.runtime || 'vdom'] || options.runtime
  const content = []

  function collect(buffer, encoding, next) {
    content.push(buffer)
    next()
  }

  function transform(done) {
    try {
      const source = Buffer.concat(content).toString()
      const header =`var $$ = ${runtime}`
      const template = fnPug(source, options)
      const footer = `module.exports = template`
      const module = [header, template.code, footer].join('\n')

      this.push(new Buffer(module))
      done()
    } catch(error) {
      done(error)
    }
  }

  return through(collect, transform)
}
