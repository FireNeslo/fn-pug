import {h, diff, patch} from 'virtual-dom'

import runtime from '../src/runtime/vdom'
import demo from './index'

const app = demo(runtime(h))

const view = h('body', app.template())

patch(document.body, diff(h('body'), view))
