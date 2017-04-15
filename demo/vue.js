import Vue from 'vue'

import runtime from '../src/runtime/vue'
import demo from './index'

const el = document.createElement('main')
const app = demo(runtime())

document.body.appendChild(el)

const view = new Vue({
   el,
   render(h) { return h('main', this.template(h)) },
   data: app
})
