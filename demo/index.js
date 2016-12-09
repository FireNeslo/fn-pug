import {compileClient} from '../src'
import {VNode, VText, h, diff, patch} from 'virtual-dom'

import runtime from '../src/runtime/vdom'
import input from './demo.pug'


const template = compileClient(input, runtime({VNode, VText}))

const app = h('body', template())

patch(document.body, diff(h('body'), app))
