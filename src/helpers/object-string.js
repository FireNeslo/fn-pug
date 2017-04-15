function keyPairs(object) {
  if(typeof object !== 'object') {
    return object
  }
  return Object.keys(object)
   .map(attr => {
     const key = JSON.stringify(attr)
     if(typeof object[attr] === 'object') {
       return `${key}: ${objectString(object[attr])}`
     }
     return `${key}: ${object[attr]}`
   })
}

export default function objectString(object) {
  if(Array.isArray(object)) {
    if(object.length === 1) {
      return keyPairs(object[0])
    }
    return `[${object.map(keyPairs)}]`
  }
  return `{${keyPairs(object)}}`
}
