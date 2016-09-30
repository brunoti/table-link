(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TableLink = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Module Dependencies
 */

try {
  var matches = require('matches-selector')
} catch (err) {
  var matches = require('component-matches-selector')
}

/**
 * Export `closest`
 */

module.exports = closest

/**
 * Closest
 *
 * @param {Element} el
 * @param {String} selector
 * @param {Element} scope (optional)
 */

function closest (el, selector, scope) {
  scope = scope || document.documentElement;

  // walk up the dom
  while (el && el !== scope) {
    if (matches(el, selector)) return el;
    el = el.parentNode;
  }

  // check scope for match
  return matches(el, selector) ? el : null;
}

},{"component-matches-selector":2,"matches-selector":2}],2:[function(require,module,exports){
/**
 * Module dependencies.
 */

try {
  var query = require('query');
} catch (err) {
  var query = require('component-query');
}

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

},{"component-query":3,"query":3}],3:[function(require,module,exports){
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

},{}],4:[function(require,module,exports){
var closest = require('component-closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector, true);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"component-closest":1}],5:[function(require,module,exports){
var delegate = require('delegate');
var matches = require('component-matches-selector');

var beforeFn, afterFn;

var TableLink = {
  /**
   * Starts the 'table-link' plugin by adding the delegate
   * event on the rows that maches the selector param.
   *
   * @param {String} [selector="[data-href]"] - The selector that find the rows with links
   * @param {String} [matches="tr,td,th"] - The elements that can become clickable
   */
  init: function(matchString) {
    matchString = matchString ? matchString + ',tr,th,td' : 'tr,th,td';

    beforeFn = function() { return true; };
    afterFn = function() {};

    return addTableLinks.call(this, matchString);
  },
  /**
   * Sets the function to be executed before the  window/link
   * opens. Prevent the opening by returning an false value.
   * If it returns nothing (undefine) the link will be
   * opened normally.
   *
   * @param {Function} callback - The function to execute before open the link.
   */
  before: function(callback) {
    beforeFn = callback.bind(this);
    return this;
  },
  /**
   * Sets the function to be executed after the
   * window/link opens.
   *
   * @param {Function} callback - The function to execute after open the link.
   */
  after: function(callback) {

    afterFn = callback.bind(this);
    return this;
  }
};

/**
 * Add the event delegation for listen to clicks on the elements,
 * that matches the passed selector, and open the link.
 *
 * @param {String} matches - The elements that can become clickable
 */
function addTableLinks(matchString) {
  var _this = this;
  var body = document.body;
  var selector = '[data-href]';

  return delegate(body, selector, 'click', function(event) {
    var element = event.delegateTarget;
    var eventTarget = event.target;
    var href = element.getAttribute('data-href');
    var target = element.getAttribute('data-target');

    if (!matches(eventTarget, matchString)) {
      return null;
    }

    event.preventDefault();

    var before = beforeFn(event);

    if (before === false) {
      return null;
    }

    if (target === 'blank') {
      var newWindow = window.open(href);
      afterFn(event);
      newWindow.focus();
    } else {
      location.assign(href);
      afterFn(event);
    }

  }, true);
};

module.exports = TableLink;


},{"component-matches-selector":2,"delegate":4}]},{},[5])(5)
});