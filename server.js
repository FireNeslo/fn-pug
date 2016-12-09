var budo = require('budo')
var stringify = require('stringify')
var babelify = require('babelify')



budo('./demo/index.js', {
  live: true,             // live reload
  open: true,             // open browser
  stream: process.stdout, // log to stdout
  browserify: {
    transform: [
      babelify,   // use ES6
      [stringify, { extensions: [ '.pug', '.jade' ] }]
    ]
  }
})
