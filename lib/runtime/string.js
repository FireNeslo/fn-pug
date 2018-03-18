'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = adapter;

var _index = require('./index');

class StringRuntime extends _index.PugRuntime {
  constructor(options = {}) {
    super();
    this.options = options;
  }
  init() {
    this.level = 0;
    return { html: '' };
  }
  indent() {
    if (this.level < 1 || !this.options.pretty) {
      return '';
    }
    return '\n' + '  '.repeat(this.level);
  }
  create(tagName) {
    this.level += 1;
    return { tagName, attrs: '', html: ``, className: '' };
  }
  element(tag) {
    this.level -= 1;
    var indent = this.indent();
    return `${indent}<${tag.tagName}${tag.attrs}>${tag.html}${indent}</${tag.tagName}>`;
  }
  text(text) {
    const indent = this.indent();
    return indent + (text || '').split('\n').join(indent);
  }
  child(parent, child) {
    if (parent == null) debugger;
    parent.html += child;
  }
  attrs(element, attrs) {
    if (attrs.class) {
      element.className = this.attr(attrs.class);
    }
    delete attrs.class;
    attrs = Object.keys(attrs).map(attr => `${attr}="${attrs[attr]}"`).join(' ');
    if (attrs) {
      element.attrs = ' ' + attrs;
    }
  }
  props(element, props) {
    const attrs = [];
    for (var prop of Object.keys(props)) {
      switch (prop) {
        case "innerHTML":
          element.html = this.text(props[prop]);
          break;
        case "class":
          var className = this.attr(props[prop]);
          if (!className) continue;
          if (element.className) {
            className += ' ' + element.className;
          }
          if (className) {
            attrs.push(`class="${className}"`);
          }
          break;
        case "style":
          const style = Object.keys(props[prop]).map(key => {
            return `${key}:${props[prop][key]}`;
          }).join(';');
          attrs.push(`style="${style}"`);
          break;
        default:
          attrs.push(`[${prop}]='${JSON.stringify(props[prop])}'`);
          break;
      }
      if (attrs.length) {
        element.attrs = ' ' + attrs.join(' ') + element.attrs;
      }
    }
  }
  end(element) {
    return element.html || element;
  }
}

function adapter(options) {
  return new StringRuntime(options);
}