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
  constructor(h) {
    super()
    this.h = h
  }
  element(properties) {
    return this.h(properties.tagName, properties, properties.children)
  }
  events(value, context, events) {
    return value.events = new EventHook(events, context)
  }
  handles(value, context, name) {
    value.handle  = new HandleHook(context, name)
  }
  props(context, value) {
    for(var key of Object.keys(value)) {
      switch (key) {
        case "class":
          var className = this.attr(value[key])
          if(!className) continue
          if(context.attributes && context.attributes.class) {
            className = context.attributes.class + ' ' + className
            delete context.attributes.class
          }
          if(context.className) {
            className += ' ' + context.className
          }
          context.className = className
        break;
        case "style":
          context[key] = value[key]
        break;
        default:
          context[key] = new PropertyHook(value[key])
      }
    }
  }
}

export default function adapter(vdom) {
  return new VDomRuntime(vdom)
}
