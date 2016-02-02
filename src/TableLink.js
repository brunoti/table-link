var delegate = require('delegate');
var matches = require('matches-selector');

var beforeFn = function() {
    return true;
};

var afterFn = function() {};

var TableLink = {
    /**
     * Starts the 'table-link' plugin by adding the delegate
     * event on the rows that maches the selector param.
     *
     * @param {String} [selector="[data-href]"] - The selector that find the rows with links
     */
    init: function(selector) {
        selector = selector || '[data-href]';
        return addTableLinks.call(this, selector);
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
 * @param {String} selector - The selector that represents the rows with links
 */
function addTableLinks(selector) {
    var _this = this;
    var body = document.body;
    return delegate(body, selector, 'click', function(e) {
        var target = e.delegateTarget;

        if (!matches(e.target, 'tr, th, td')) return null;

        e.preventDefault();

        var before = beforeFn(target);

        if (!before && typeof before != 'undefined') return null;

        if (target.dataset.target === 'blank') {
            window.open(target.dataset.href).focus();
        } else if (!target.dataset.target || target.dataset.target === 'self') {
            location.href = target.dataset.href;
        } else {
            location.href = target.dataset.href;
        }

        afterFn(target);
    }, true);
};

module.exports = TableLink;

