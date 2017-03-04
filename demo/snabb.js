import snabbdom from 'snabbdom'
import h from 'snabbdom/h'

import demo from  './index'
import runtime from '../src/runtime/snabb'

const app = demo(runtime(h))
const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
])

patch(document.body, h('body', app.template()))
