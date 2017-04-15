'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = objectString;
function keyPairs(object) {
  if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
    return object;
  }
  return Object.keys(object).map(function (attr) {
    var key = JSON.stringify(attr);
    if (_typeof(object[attr]) === 'object') {
      return key + ': ' + objectString(object[attr]);
    }
    return key + ': ' + object[attr];
  });
}

function objectString(object) {
  if (Array.isArray(object)) {
    if (object.length === 1) {
      return keyPairs(object[0]);
    }
    return '[' + object.map(keyPairs) + ']';
  }
  return '{' + keyPairs(object) + '}';
}