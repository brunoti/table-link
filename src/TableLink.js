var delegate = require('delegate');
var closest = require('closest');

var TableLink = {
    init: function(selector) {
        return addTableLinks.call(this, selector);
    },
    before: function(e) {},
    after: function(e) {},
};

function addTableLinks(selector) {
    selector = selector || '[data-href]';
    var _this = this;
    var body = document.body;
    return delegate(body, selector, 'click', function(e) {
        var target = closest(e.delegateTarget, selector, true);

        if(!target) return null;

        e.preventDefault();
        _this.before(e)

        if(target.dataset.target === 'blank') {
            window.open(target.dataset.href).focus();
        } else if(target.dataset.target === 'silent-blank') {
            window.open(target.dataset.href);
        } else if(!target.dataset.target || target.dataset.target === 'self') {
            location.href = target.dataset.href;
        }

        _this.after(e);
    }, true);
};

module.exports = TableLink;
