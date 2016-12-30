import {compileClient} from '../src'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'

import runtime from '../src/runtime/snabb'
import input from './demo.pug'

const modules = [ // Init patch function with chosen modules
  require('snabbdom/modules/class'), // makes it easy to toggle classes
  require('snabbdom/modules/props'), // for setting properties on DOM elements
  require('snabbdom/modules/style'), // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners'), // attaches event listeners
]
console.log(modules)
const patch = snabbdom.init(modules);

function content() {
  var paragraphs = Math.floor(Math.random() * 3) + 1
  var contents = ''
  for(var i= 0; i <= paragraphs; i++) {
    var lines = Math.floor(Math.random() * 5) + 1
    for(var line= 0; line <= lines; line++) {
      var words = Math.floor(Math.random() * 45) + 5
      contents += '<p>'
      for(var word=0; word <= words; word++) {
        var letters = Math.floor(Math.random() * 10) + 3
        contents += Math.random().toString(36).slice(2, letters)
        if(word !== words) contents += ' '
      }
      contents += '</p>'
    }
  }
  return contents
}

var app = {
  template: compileClient(input, runtime(h)),
  selected: 0,
  posts: [
    {title: 'hello', content: content()},
    {title: 'world', content: content()},
    {title: 'neat', content: content()}
  ],
  myUpdate(fixtures) {
    console.log("update", fixtures)
  }
}

console.log(app.template.toString())

const view = h('body', app.template())

patch(document.body, view)
