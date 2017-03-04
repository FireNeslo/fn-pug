import {PugRuntime} from './index'

class ReactRuntime extends PugRuntime {
  constructor(React) {
    super()
    this.React = React
  }
  element(props) {
    const {tagName, children} = props

    delete props.tagName
    delete props.children

    if(!props.key) {
      props.key = Math.random()
    }
    if(props.class) {
      props.className = this.attr(props.class)
      delete props.class
    }

    if(props.innerHTML) {

      props.dangerouslySetInnerHTML  = { __html: props.innerHTML }
      delete props.innerHTML

      return this.React.createElement(tagName, props)
    }

    return this.React.createElement(tagName, props, children)
  }
  attrs(attributes, attrs) {
    super.attrs({ attributes }, attrs)
  }
  handles(value, context, name) {
    value.ref = node => context[name] = node
  }
  events(context, self, events) {
    var on = context
    for(let [name, handler] of events) {
      on['on'+name.slice(0, 1).toUpperCase()+name.slice(1)] = handler
    }
  }
}

export default function adapter(React) {
  return new ReactRuntime(React)
}
