# Table Link 
[![Build Status](https://travis-ci.org/brunoti/table-link.svg?branch=master)](https://travis-ci.org/brunoti/table-link)
[![Coverage Status](https://coveralls.io/repos/github/brunoti/table-link/badge.svg)](https://coveralls.io/github/brunoti/table-link)
[![Made with vim](https://img.shields.io/badge/made_with-vim-brightgreen.svg?style=flat)](http://www.vim.org/)

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
  background-color: #AAB7D1; // Put whatever color you want... Or none.
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

## Using in other elements

###### Put the selector to find those as the first ```TableLink.init()``` parameter like this:

``` js
TableLink.init('h1, div, span');
```

``` html
<h1 data-href="http://google.com"></h1>

<div data-href="http://google.com"></div>

<span data-href="http://google.com"></span>
```
### Before and After events

###### The 'before' event can cancel the link opening by returning false.

The "element" argument is the delegate target, which can be ```td```, ```tr```,  ```th``` or any element that matches the selector, if it was passed.
The "target" argument is the real event target. The sencond can be used to see if the clicked element is the delegated element or some other element inside the delegated element.

``` js
TableLink.before(function(element, target) {
    return confirm('Can i open this link?');
});
```

``` js
TableLink.before(function(element, target) {
  // Cancel the action if the clicked element (maybe a cell inside a row[data-href])
  // has the ```.no-link``` class.
  return !target.classList.contains('no-link');
});
```

``` js
TableLink.after(function(element, target) {
    console.log('The link was opened!');
});
```

## License

This repository is under the MIT License
