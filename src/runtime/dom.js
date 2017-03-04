import {PugRuntime} from './index'

class DomRuntime extends PugRuntime {
  constructor(document) {
    super()
    this.document = document || global.document
  }
  init() {
    return this.document.createDocumentFragment()
  }
  create(tag) {
    return this.document.createElement(tag)
  }
  element(element) {
    return element
  }
  text(text) {
    return this.document.createTextNode(text || '')
  }
  child(parent, child) {
    parent.appendChild(child)
  }
  attrs(element, attrs) {
    for(let attr in attrs) {
      if(attrs[attr]) {
        element.setAttribute(attr, this.attr(attrs[attr]))
      }
    }
  }
  handles(element, self, handles) {
    self[handles] = element
  }

  events(element, self, events) {
    for(var [event, handler] of events) {
      element.addEventListener(event, handler)
    }
  }
  props(element, props) {
    if(props.style) {
      Object.assign(element.style, props.style)
      delete props.style
    }

    Object.assign(element, props)

    if(props.class) {
      let classes = this.attr(props.class)
      if(classes) for(var className of classes.split(' ')) {
        element.classList.add(className)
      }
    }
  }
  end(element) {
    return element
  }
}

export default function adapter(document) {
  return new DomRuntime(document)
}
