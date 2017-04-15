import {compileClient} from '../src'

import template from './demo.pug'

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

export default function(runtime) {
  const TEMPLATE = compileClient(template, runtime)
  console.log(TEMPLATE+'')
  return {
    selected: 0,
    template: TEMPLATE,
    posts: [
      {title: 'hello', content: content()},
      {title: 'world', content: content()},
      {title: 'neat', content: content(), posts: [
        {title: 'nested', content:  content()}
      ]}
    ],
    select(header) {
      console.log("selected:", header)
    }
  }
}
