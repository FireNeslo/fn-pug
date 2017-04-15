import {PugRuntime} from './index'

class VueRuntime extends PugRuntime {
  init(context, h) {
    if(h) this.h = h
    return { children: [] }
  }
  element(properties) {
    const {tagName, children} = properties

    delete properties.tagName
    delete properties.children

    return this.h(tagName, properties, children)
  }
  attrs(context, attrs) {
    if(attrs.class) {
      context.class = attrs.class
      delete attrs.class
    }
    context.attrs = attrs
  }
  props(context, props) {
    if(props.class) {
      if(context.class) {
        context.class = [context.class, props.class]
      } else {
        context.class = props.class
      }
      delete props.class
    }
    if(props.style) {
      context.style = Object.assign(context.style || {}, props.style)
      delete props.style
    }
    context.domProps = props
  }
  mixin(parent, self, mixin, ...args) {
    const context = Object.assign({}, ...args)
    const properties = Object.getOwnPropertyDescriptors(context)
    const children =  mixin.call(Object.create(self, properties))

    for(var child of children) {
      this.child(parent, child)
    }
  }
  handles(context, self, handles) {
    for(var handle of handles) {
      context.ref = handle
    }
  }
  events(context, self, events) {
    var on = context.on = {}
    for(var [event, handler] of events) {
      on[event] = handler
    }
  }
}

export default function adapter() {
  return new VueRuntime()
}
