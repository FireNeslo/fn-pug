import {PugRuntime} from './index'

class EventHook {
  constructor(events) {
    this.events = events
  }
  hook(node, prop, self) {
    var previous = self ? self.events : []
    for(var [event, callback] of previous) {
      node.removeEventListener(event, callback)
    }
    for(var [event, callback] of this.events) {
      node.addEventListener(event, callback)
    }
  }
  unhook(node) {
    for(var [event, callback] of this.events) {
      node.removeEventListener(event, callback)
    }
  }
}

class PropertyHook {
  constructor(value) {
    this.value = value
  }
  hook(node, property, self) {
    var previous = self && self.value
    if(!previous && this.value !== undefined || this.value !== previous) {
      node[property] = this.value
    }
  }
}

class HandleHook {
  constructor(context, names) {
    this.context = context
    this.names = names
  }
  hook(node, prop, previous) {
    for(var name of this.names) {
      this.context[name] = node
    }
  }
  unhook() {
    for(var name of this.names) {
      this.context[name] = null
    }
  }
}


class VDomRuntime extends PugRuntime {
  constructor({VNode, VText}) {
    super()
    this.VNode = VNode
    this.VText = VText
  }
  element(tagName, properties) {
    return new this.VNode(tagName, properties, properties.children)
  }
  events(context, events) {
    return new EventHook(events, context)
  }
  handles(context, names) {
    return new HandleHook(context, names)
  }
  prop(value) {
    return new PropertyHook(value)
  }
  text(text) {
    return new this.VText(super.text(text))
  }
}

export default function adapter(vdom) {
  return new VDomRuntime(vdom)
}
