'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = objectString;
function keyPairs(object) {
  return Object.keys(object).map(function (attr) {
    if (_typeof(object[attr]) === 'object') {
      return JSON.stringify(attr) + ': ' + objectString(object[attr]);
    }
    return JSON.stringify(attr) + ': ' + object[attr];
  });
}

function objectString(object) {
  return '{' + keyPairs(object) + '}';
}