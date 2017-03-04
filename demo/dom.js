import runtime from '../src/runtime/dom'
import demo from './index'

const app = demo(runtime(document))

document.body.appendChild(app.template())
