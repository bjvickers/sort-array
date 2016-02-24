[![view on npm](http://img.shields.io/npm/v/sort-array.svg)](https://www.npmjs.org/package/sort-array)
[![npm module downloads](http://img.shields.io/npm/dt/sort-array.svg)](https://www.npmjs.org/package/sort-array)
[![Build Status](https://travis-ci.org/75lb/sort-array.svg?branch=master)](https://travis-ci.org/75lb/sort-array)
[![Dependency Status](https://david-dm.org/75lb/sort-array.svg)](https://david-dm.org/75lb/sort-array)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

<a name="module_sort-array"></a>
## sort-array
Sort an array of objects by any property value, at any depth, in any custom order.

**Example**  
```js
var sortBy = require('sort-array')
```
<a name="exp_module_sort-array--sortBy"></a>
### sortBy(recordset, columnNames, [customOrder]) ⇒ <code>Array</code> ⏏
Sort an array of objects by one or more fields

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| recordset | <code>Array.&lt;object&gt;</code> | Input array of objects |
| columnNames | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | Column name(s) to sort by |
| [customOrder] | <code>object</code> | Custom sort order definitions. An object where each key is the column name and the value is an array mandating the custom sort order. Example: <br> `{ importance: [ 'speed', 'strength', 'intelligence' ]}` |

**Example**  
with this data
```js
> DJs = [
  { name: 'Trevor', slot: 'twilight' },
  { name: 'Chris', slot: 'twilight' },
  { name: 'Mike', slot: 'afternoon' },
  { name: 'Rodney', slot: 'morning' },
  { name: 'Chris', slot: 'morning' },
  { name: 'Zane', slot: 'evening' }
]
```

sort by `slot` using the default sort order (alphabetical)
```js
> a.sortBy(DJs, 'slot')
[ { name: 'Mike', slot: 'afternoon' },
  { name: 'Zane', slot: 'evening' },
  { name: 'Chris', slot: 'morning' },
  { name: 'Rodney', slot: 'morning' },
  { name: 'Chris', slot: 'twilight' },
  { name: 'Trevor', slot: 'twilight' } ]
```

specify a custom sort order for `slot`
```js
> var slotOrder = [ 'morning', 'afternoon', 'evening', 'twilight' ]
> a.sortBy(DJs, 'slot', { slot: slotOrder })
[ { name: 'Rodney', slot: 'morning' },
  { name: 'Chris', slot: 'morning' },
  { name: 'Mike', slot: 'afternoon' },
  { name: 'Zane', slot: 'evening' },
  { name: 'Trevor', slot: 'twilight' },
  { name: 'Chris', slot: 'twilight' } ]
```

sort by `slot` then `name`
```js
> a.sortBy(DJs, ['slot', 'name'], { slot: slotOrder })
[ { name: 'Chris', slot: 'morning' },
  { name: 'Rodney', slot: 'morning' },
  { name: 'Mike', slot: 'afternoon' },
  { name: 'Zane', slot: 'evening' },
  { name: 'Chris', slot: 'twilight' },
  { name: 'Trevor', slot: 'twilight' } ]
```

sort by nested property values (at any depth) using `property.property` notation
```
> input = [
  { inner: { number: 5 } },
  { inner: { number: 2 } },
  { inner: { number: 3 } },
  { inner: { number: 1 } },
  { inner: { number: 4 } }
]

> sortBy(input, 'inner.number')
[ { inner: { number: 1 } },
  { inner: { number: 2 } },
  { inner: { number: 3 } },
  { inner: { number: 4 } },
  { inner: { number: 5 } } ]
```

a custom order for a nested property looks like this:
```
var customOrder = {
  'inner.number': [ 1, 2, 4, 3, 5 ]
}
```

* * *

&copy; 2015-16 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
