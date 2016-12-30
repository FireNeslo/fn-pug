import {PugRuntime} from './index'

class SnabbRuntime extends PugRuntime {
  constructor(h) {
    super()
    this.h = h
  }
  element(tagName, properties) {
    const on = properties.events
    const hook = properties.handles
    const attrs = properties.attributes
    const style = properties.style
    const children = properties.children
    const props = properties

    delete props.style
    delete props.events
    delete props.children
    delete props.attributes
    delete props.handles

    return this.h(tagName, {on, attrs, hook, props, style, children}, children)
  }
  handles(context, handles) {
    return {
      insert(vnode) {
        for(var handle of handles) {
          context[handle] = vnode.elm
        }
      }
    }
  }
  events(context, events) {
    var on = {}
    events.forEach(event => {
      on[event[0]] = event[1]
    })
    return on
  }
}

export default function adapter(vdom) {
  return new SnabbRuntime(vdom)
}
