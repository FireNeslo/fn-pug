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
    if(props.dangerouslySetInnerHTML) {
      return this.React.createElement(tagName, props)
    }
    return this.React.createElement(tagName, props, (children.length && children) || null)
  }
  attrs(attributes, attrs) {
    super.attrs({ attributes }, attrs)
  }
  handles(value, context, name) {
    value.ref = node => context[name] = node
  }
  props(target, props) {
    if(target.class) {
      if(target.className) {
        target.className = [target.className, target.class].join(' ')
      } else {
        target.className = target.class
      }
      delete target.class
    }
    for(let key of Object.keys(props)) {
      switch(key) {
        case "innerHTML":
          target.dangerouslySetInnerHTML  = { __html: props[key] }
        break;
        case "class":
          var className = this.attr(props[key])
          if(!className) continue
          if(target.className) {
            className += ' ' + target.className
          }
          target.className = className
        break;
        default:
          target[key] = props[key]
        break;
      }
    }

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
