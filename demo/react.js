import React from 'react'
import ReactDOM from 'react-dom'
import runtime from '../src/runtime/react'
import demo from './index'


const app = demo(runtime(React))
const root = document.createElement('react-root')

document.body.appendChild(root)

ReactDOM.render(
  React.createElement('main', null, app.template()),
  root
);
