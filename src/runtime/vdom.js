import {PugRuntime} from './index'

class VDomRuntime extends PugRuntime {
  constructor({VNode, VText}) {
    super()
    this.VNode = VNode
    this.VText = VText
  }
  element(tagName, properties) {
    var children = properties.children
    delete properties.children

    var events = properties.events

    return new this.VNode(tagName, properties, children)
  }
  text(text) {
    return new this.VText(super.text(text))
  }
}

export default function adapter(vdom) {
  return new VDomRuntime(vdom)
}
