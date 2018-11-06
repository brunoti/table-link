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
  var body = document.body;
  var selector = '[data-href]';

  return delegate(body, selector, 'mouseup', function(event) {
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

    if (event.ctrlKey || event.button === 1 || target === 'blank') {
      var newWindow = window.open(href);
      afterFn(event);
      newWindow.focus();

      return;
    }

    location.assign(href);
    afterFn(event);
  }, true);
};

module.exports = TableLink;

