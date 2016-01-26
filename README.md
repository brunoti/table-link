# Table Link 

The easiest way to add links in your table rows, cells or elements that are not anchors!

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

###### Browserify
``` js
var TableLink = require('table-link');
```

###### Browser (Global)
``` html
<script src="table-link.min.js"></script>
```

###### Some CSS (Optional)
``` CSS
[data-href] {
  cursor: pointer;
}

table [data-href]:hover,
table [data-href]:hover > * {
  background-color: #AAB7D1; // Put whatever color you want... Or no one.
}
```


## Usage

In your table:

``` html
<tr data-href="http://google.com">
    <td>Some random crazy data.</td>
</tr>
```

In your Javascript file:

``` js
TableLink.init();
// Soooooo simple...
```

You can make use of ```blank``` and ```self``` (default) for targeting the link:

``` html
<tr data-href="http://google.com" data-target="self">
    <td>Some random crazy data.</td>
</tr>
```

``` html
<tr data-href="http://google.com" data-target="blank">
    <td>Some random crazy data.</td>
</tr>
```

###### Soon

``` html
<div data-href="http://google.com"></div>

<span data-href="http://google.com"></span>

<i data-href="http://google.com"></i>

<header data-href="http://google.com"></header>

<body data-href="http://google.com"></body>

<h1 data-href="http://google.com"></h1>
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
    console.log('The link was opened!');
});
```

## License

MIT
