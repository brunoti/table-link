# Table Link - The easiest way of adding links to your table rows/cells.

> Yeah man... Html can't do that for you out of the box. And it's sad. Very sad.

![I KNOW THAT FEEL BRO...](http://i0.kym-cdn.com/photos/images/original/000/107/432/i_hug_that_feel.png)

Don't worry bro here is the solution:

## Instalation
With npm:
```
npm install --save table-link
```

With bower:
```
bower install --save table-link
```

Or you can just [download a ZIP](https://github.com/brunoti/table-link/archive/master.zip).

## Setup

###### Node or Browserify
``` js
var TableLink = require('table-link');
```

###### Browser (Global)
``` html
<script src="table-link.min.js"></script>
```

## Usage
``` js
TableLink.init();
// Soooooo simple...
```

### Before and After events

###### The before event can cancel the link opening by returning false.

The "element" argument is the clicked element that can be ```td```, ```tr``` or ```th```.

``` js
TableLink.before(function(element) {
    return confirm('Can i open this link?');
});
```

``` js
TableLink.after(function(element) {
    return confirm('Can i open this link?');
});
```

### TableLink plugin uses

Javascript and the [delegate](https://github.com/zenorocha/delegate/) plugin by [Zeno Rocha](https://github.com/zenorocha).

## License

MIT
