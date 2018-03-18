'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = adapter;

var _index = require('./index');

class SnabbRuntime extends _index.PugRuntime {
  constructor(h) {
    super();
    this.h = h;
  }
  element(properties) {
    const { tagName, children } = properties;

    delete properties.tagName;
    delete properties.children;

    return this.h(tagName, properties, children);
  }
  attrs(context, attrs) {
    super.attrs({ attributes: context.attrs = {} }, attrs);
  }
  handles(context, self, handles) {
    context.hook = {
      insert(vnode) {
        for (var handle of handles) {
          self[handle] = vnode.elm;
        }
      }
    };
  }
  events(context, self, events) {
    var on = context.on = {};
    for (var [event, handler] of events) {
      on[event] = handler;
    }
  }
  props(context, props) {
    if (props.style) {
      context.style = props.style;
      delete props.style;
    }
    if (props.class) {
      context.class = props.class, props.className;
      if (context.attrs.class) {
        for (let className of context.attrs.class.split(' ')) {
          context.class[className] = true;
        }
      }
      delete context.attrs.class;
      delete props.class;
    }
    context.props = Object.assign(context.props || {}, props);
  }
}

function adapter(vdom) {
  return new SnabbRuntime(vdom);
}