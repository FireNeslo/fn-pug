var slice = Array.call.bind(Array.prototype.slice)

function arrayIterator(array, callback) {
  for(var i =0, l=array.length; i<l; ++i) {
    callback(array[i], i)
  }
}

function iterableIterator(iterator, callback) {
  var index = 0;
  for(var item of iterator) {
    if(Array.isArray(item)) {
      callback(item[0], item[1])
    } else {
      callback(item, index++)
    }
  }
}
function objectIterator(object, callback) {
  var keys = Object.keys(object)
  for(var i = 0, l = keys.length; i < l; ++i) {
    callback(object[keys[i]], keys[i])
  }
}



export class PugRuntime {
  init() {
    return this.create()
  }
  create(tagName) {
    return { tagName: tagName, children: []}
  }
  child(parent, node) {
    if(!parent.children) debugger
    parent.children.push(node)
  }
  events(context, value) {
    return value
  }
  element(properties) {
    return properties
  }
  handles(value, context, name) {
    value.handle = [context, name]
  }
  props(target, source) {
    return Object.assign(target, source)
  }
  text(text) {
    return text != null ? (text + '') : ''
  }
  attrs(target, attrs) {
    target.attributes || (target.attributes = {})
    if(attrs.class) {
      attrs.class = this.attr(attrs.class)
    }
    for(var attr in attrs) {
      if(!attrs[attr]) continue
      target.attributes[attr] = attrs[attr] + ''
    }
  }
  attr(value) {
    if(!value) return ''
    if(Array.isArray(value)) return value.map(this.attr, this).join(' ')
    if(typeof value === 'object') {
      var result = []
      for(var key in value) {
        if(value[key]) {
          result.push(key)
        }
      }
      return result.join(' ')
    }
    return value + ''
  }
  each(iterable, callback) {
    if(!iterable) return
    if(Array.isArray(iterable)) {
      return arrayIterator(iterable, callback)
    } else if(Symbol.iterable in iterable) {
      return IterableIterator(terable, callback)
    } else if('length' in iterable) {
      return arrayIterator(slice(iterable), callback)
    } else {
      return objectIterator(iterable, callback)
    }
  }
  end(result) {
    return result.children
  }
}

export default function adapter() {
  return new PugRuntime()
}
