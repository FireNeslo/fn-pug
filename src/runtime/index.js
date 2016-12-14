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
  events(context, value) {
    return value
  }
  element(tagName, properties) {
    return Object.assign({tagName}, properties)
  }
  handles(context, handles) {
    return handles
  }
  text(text) {
    return text != null ? text : ''
  }
  attrs(values) {
    if(values.class) {
      values.class = this.attrs(values.class)
    }
    for(var attr in values) {
      if(!values[attr]) delete values[attr]
    }
    return values
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
}

export default function adapter() {
  return new PugRuntime()
}
