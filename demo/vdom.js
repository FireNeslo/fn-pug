import {h, diff, patch} from 'virtual-dom'
import {compileClient} from '../src'
var createElement = require('virtual-dom/create-element')

import runtime from '../src/runtime/vdom'
import demo from './index'
import template from './demo.pug'

var tpl = compileClient(template, runtime(h))
console.log(tpl + '')

function render (d) {
  return h('div', tpl.apply(d))
}

let data = demo()
data.newRender = newRender
let tree = render(data)
let rootNode = createElement(tree)
document.body.appendChild(rootNode)

function newRender (e) {
  e.preventDefault()
  let newData = demo()
  newData.newRender = newRender
  let newTree = render(newData)
  patch(rootNode, diff(tree, newTree))
  tree = newTree
}

window.newRender = newRender
