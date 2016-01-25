var delegate = require('delegate');
var closest = require('closest');
window.closest = closest;

var beforeFn = function() {
    return true;
};

var afterFn = function() {};

var TableLink = {
    init: function(selector) {
        return addTableLinks.call(this, selector);
    },
    before: function(callback) {
        beforeFn = callback.bind(this);
        return this;
    },
    after: function(callback) {
        afterFn = callback.bind(this);
        return this;
    }
};

function addTableLinks(selector) {
    selector = selector || '[data-href]';
    var _this = this;
    var body = document.body;
    return delegate(body, selector, 'click', function(e) {
        var target = closest(e.delegateTarget, 'tr, th, td', true);

        if (!target) return null;

        e.preventDefault();
        var before = beforeFn();

        if (!before && typeof before != 'undefined') return null;

        if (target.dataset.target === 'blank') {
            window.open(target.dataset.href).focus();
        } else if (!target.dataset.target || target.dataset.target === 'self') {
            location.href = target.dataset.href;
        } else {
            location.href = target.dataset.href;
        }

        afterFn();
    }, true);
};

module.exports = TableLink;

