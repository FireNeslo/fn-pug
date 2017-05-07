import React from 'react'
import ReactDOM from 'react-dom'
import {compileClient} from '../src'
import runtime from '../src/runtime/react'
import demo from './index'
import template from './demo.pug'

const root = document.createElement('react-root')

var tpl = compileClient(template, runtime(React))
console.log(tpl + '')

document.body.appendChild(root)

function newRender() {
  let data = demo()
  data.newRender = newRender
  ReactDOM.render(
    React.createElement('main', null, tpl.apply(data)),
    root
  )
}

newRender()
