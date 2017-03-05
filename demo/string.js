import runtime from '../src/runtime/string'
import demo from './index'

const app = demo(runtime({ pretty: true }))

document.body.innerHTML = app.template()
