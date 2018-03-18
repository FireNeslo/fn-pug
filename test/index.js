const fnPug = require('..')
const { assert } = require('chai')

describe('fnPug(source)', () => {
  it('compiles basic tags', () => {
    const { file, code } = fnPug('div')

    assert.include(code, '$$.create("div")', 'creates elements');
  })
  it('compiles basic attributes', () => {
    const { file, code } = fnPug('div(title="test")')

    assert.include(code, '$$.attrs(e$0, { "title": "test" })', 'creates attrs')
  })

  it('compiles events', () => {
    const { file, code } = fnPug('div((click)=handler(e))')

    assert.include(code, '$$.events(e$0, this, [["click", e => this.handler(e)]])', 'creates events')
  })

  it('compiles properties', () => {
    const { file, code } = fnPug('input([value]=value)')

    assert.include(code, '$$.props(e$0, { "value": value })', 'creates props')
  })

  it('compiles handles', () => {
    const { file, code } = fnPug('input(#input)')
    assert.include(code, '$$.handles(e$0, this, ["input"])', 'creates handles')
  })

  it('compiles bindings', () => {
    const { file, code } = fnPug('input([(value)]=value)')


    assert.include(code, '$$.props(e$0, { "value": value })', 'creates props')
    assert.include(code, '$$.events(e$0, this, [["valueChanged", e => this.value = e.target.value]])', 'creates events')
  })

  it('hoists to the scope where first referenced', () => {
    const { file, code } = fnPug('if test\n  h1=reference')

    assert.include(code, 'if (test) {\n    var reference')
  })

  it('hoists to uppermost scope', () => {
    const { file, code } = fnPug('if test\n  h1=reference\nh2=reference')

    assert.include(code, '(__INIT__) {\n  var reference = this.reference')
  })

  it('supports each', () => {
    const { file, code } = fnPug('each item in items\n  li=item')

    assert.include(code, '$$.each(items, item =>')
  })
  it('supports each with index', () => {
    const { file, code } = fnPug('each item, index in items\n  li=item')

    assert.include(code, '$$.each(items, (item, index) =>')
  })

  it('supports mixins', () => {
    const { file, code } = fnPug('+neat({ sweet })')
    assert.include(code, '$$.mixin(__RESULT__, this, neat, { sweet })')
  })

  it('supports imports', () => {
    const { file, code } = fnPug('- import test from "./test"')
    assert.include(code, 'import test from "./test";\nfunction template')
  })
})
