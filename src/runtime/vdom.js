import {PugRuntime} from './index'

class EventHook {
  constructor(events) {
    this.events = events
  }
  hook(node, prop, previous=[]) {
    for(var [event, callback] of previous) {
      node.removeEventListener(event, callback)
    }
    for(var [event, callback] of this.events) {
      node.addEventListener(event, callback)
    }
    return this.events
  }
  unhook(...args) {
    for(var [event, callback] of this.events) {
      node.removeEventListener(event, callback)
    }
  }
}

class HandleHook {
  constructor(context, name) {
    this.context = context
    this.name = name
  }
  hook(node, prop, previous) {
    this.context[this.name] = node
  }
  unhook() {
    this.context[this.name] = null
  }
}


class VDomRuntime extends PugRuntime {
  constructor({VNode, VText}) {
    super()
    this.VNode = VNode
    this.VText = VText
  }
  element(tagName, properties) {
    const attrs = properties.attributes
    properties.events = new EventHook(properties.events)

    if(attrs.class) {
      attrs.class = this.attr([attrs.class, properties.class])
    } else {
      attrs.class = this.attr(properties.class)
    }
    return new this.VNode(tagName, properties, properties.children)
  }
  handle(context, name, node) {
    node['#'+name] = new HandleHook(context, name)
  }
  text(text) {
    return new this.VText(super.text(text))
  }
}

export default function adapter(vdom) {
  return new VDomRuntime(vdom)
}
