function keyPairs(object) {
  return Object.keys(object)
   .map(attr => {
     if(typeof object[attr] === 'object') {
       return `${JSON.stringify(attr)}: ${objectString(object[attr])}`
     }
     return `${JSON.stringify(attr)}: ${object[attr]}`
   })
}

export default function objectString(object) {
  return `{${keyPairs(object)}}`
}
