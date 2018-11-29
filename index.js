const arrayify = require('array-back')
const t = require('typical')

/**
 * Sort an array of objects by any property value, at any depth, in any custom order.
 *
 * @module sort-array
 * @typicalname sortBy
 * @example
 * const sortBy = require('sort-array')
 */
module.exports = sortBy

/**
 * @param {object[]} - Input array of objects
 * @param {string|string[]} - One or more property expressions to sort by,  e.g. `'name'` or `'name.first'`.
 * @param [customOrder] {object} - Custom sort order definitions. An object where each key is the property expression and the value is an array specifying the sort order. Example: <br>
 * `{ importance: [ 'speed', 'strength', 'intelligence' ]}`
 * @returns {Array}
 * @alias module:sort-array
 * @example
 * with this data
 * ```js
 * > DJs = [
 *   { name: 'Trevor', slot: 'twilight' },
 *   { name: 'Chris', slot: 'twilight' },
 *   { name: 'Mike', slot: 'afternoon' },
 *   { name: 'Rodney', slot: 'morning' },
 *   { name: 'Chris', slot: 'morning' },
 *   { name: 'Zane', slot: 'evening' }
 * ]
 * ```
 *
 * sort by `slot` using the default sort order (alphabetical)
 * ```js
 * > sortBy(DJs, 'slot')
 * [ { name: 'Mike', slot: 'afternoon' },
 *   { name: 'Zane', slot: 'evening' },
 *   { name: 'Chris', slot: 'morning' },
 *   { name: 'Rodney', slot: 'morning' },
 *   { name: 'Chris', slot: 'twilight' },
 *   { name: 'Trevor', slot: 'twilight' } ]
 * ```
 *
 * specify a custom sort order for `slot`
 * ```js
 * > const slotOrder = [ 'morning', 'afternoon', 'evening', 'twilight' ]
 * > sortBy(DJs, 'slot', { slot: slotOrder })
 * [ { name: 'Rodney', slot: 'morning' },
 *   { name: 'Chris', slot: 'morning' },
 *   { name: 'Mike', slot: 'afternoon' },
 *   { name: 'Zane', slot: 'evening' },
 *   { name: 'Trevor', slot: 'twilight' },
 *   { name: 'Chris', slot: 'twilight' } ]
 * ```
 *
 * sort by `slot` then `name`
 * ```js
 * > sortBy(DJs, ['slot', 'name'], { slot: slotOrder })
 * [ { name: 'Chris', slot: 'morning' },
 *   { name: 'Rodney', slot: 'morning' },
 *   { name: 'Mike', slot: 'afternoon' },
 *   { name: 'Zane', slot: 'evening' },
 *   { name: 'Chris', slot: 'twilight' },
 *   { name: 'Trevor', slot: 'twilight' } ]
 * ```
 *
 * sort by nested property values (at any depth) using dot notation (e.g. `'inner.number'`)
 * ```js
 * > input = [
 *   { inner: { number: 5 } },
 *   { inner: { number: 2 } },
 *   { inner: { number: 3 } },
 *   { inner: { number: 1 } },
 *   { inner: { number: 4 } }
 * ]
 *
 * > sortBy(input, 'inner.number')
 * [ { inner: { number: 1 } },
 *   { inner: { number: 2 } },
 *   { inner: { number: 3 } },
 *   { inner: { number: 4 } },
 *   { inner: { number: 5 } } ]
 * ```
 *
 * a custom order for a nested property looks like this:
 * ```js
 * const customOrder = {
 *   'inner.number': [ 1, 2, 4, 3, 5 ]
 * }
 * ```
 */
function sortBy (recordset, sortBy, computedProperties) {
  if (computedProperties) {
    return recordset.sort(sortWithComputedProperties(sortBy))
  } else {
    return recordset.sort(sortWithoutComputedProperties(sortBy))
  }
}

// @TODO: Question - do we support crap data in? E.g. testing for 'isArrayLike',
// @TODO: rather than just assuming the data in is correct?
function sortWithoutComputedProperties (sortBy) {
  let sorts = Object.entries(sortBy) // equiv: let sorts = sortBy.slice(0)
  let propSort = sorts.shift()
  let property = t.isArrayLike(propSort) && propSort[0] || undefined
  let sort = t.isArrayLike(propSort) && propSort[1] || 'asc'

  return function sorter (a, b) {
    let result
    const x = a[property]
    const y = b[property]
    let currentSort = sort
    let recurse

    if (t.isArrayLike(sort)) {
      // Custom sort the current property.
      result = sort.indexOf(y) - sort.indexOf(x)
    } else {
      // Asc/desc sort the current property. Perform an asc sort by default, 
      // then invert the result later if a desc has been requested for the 
      // current property.
      if (x === null && y === null) {
        result = 0
      } else if ((!t.isDefined(x) || x === null) && t.isDefined(y)) {
        result = -1
      } else if (t.isDefined(x) && (!t.isDefined(y) || y === null)) {
        result = 1
      } else if (!t.isDefined(x) && !t.isDefined(y)) {
        result = 0
      } else {
        result = x < y ? -1 : x > y ? 1 : 0
      }
    }
    
    // Reset this sorting function and parent, unless we have an equal
    // result and there are more sorts still to perform, in which case
    // move on to the next one.
    if (result === 0 && sorts.length) {
      recurse = true
    } else {
      recurse = false
      sorts = Object.entries(sortBy)
    }
    
    propSort = sorts.shift()
    property = t.isArrayLike(propSort) && propSort[0] || undefined
    sort = t.isArrayLike(propSort) && propSort[1] || 'asc'

    // Present the result
    if (recurse) {
      return sorter(a, b)
    } else if ((result === 0) || (currentSort === 'asc')) {
      return result
    }  else {
      return result * -1
    }
  }
}

/*
function sortByCustom (properties, customOrder) {
  let props = properties.slice(0)
  let property = props.shift()
  return function sorter (a, b) {
    const x = a[property]
    const y = b[property]
    
    let result = customOrder[property].indexOf(x) - customOrder[property].indexOf(y)

    if (result === 0) {
      if (props.length) {
        property = props.shift()
        return sorter(a, b)
      } else {
        props = properties.slice(0)
        property = props.shift()
        return 0
      }
    } else {
      props = properties.slice(0)
      property = props.shift()
      return result
    }
  }
}

function sortByConvention (sortBy, customOrder) {
  let sorts = sortBy.slice(0)
  let propSort = sorts.shift()
  let property = t.isArrayLike(propSort) && propSort[0] || undefined
  let sort = t.isArrayLike(propSort) && propSort[1] || customOrder ? 'custom' : 'asc'
  
  return function sorter (a, b) {
    let result
    const x = a[property]
    const y = b[property]
    let currentSort = sort
    let recurse

    if (customOrder) {
      result = customOrder[property].indexOf(x) - customOrder[property].indexOf(y)
    } else {
      // Perform the initial asc sort
      if (x === null && y === null) {
        result = 0
      } else if ((!t.isDefined(x) || x === null) && t.isDefined(y)) {
        result = -1
      } else if (t.isDefined(x) && (!t.isDefined(y) || y === null)) {
        result = 1
      } else if (!t.isDefined(x) && !t.isDefined(y)) {
        result = 0
      } else {
        result = x < y ? -1 : x > y ? 1 : 0
      }
    }
    
    // Reset this sorting function and parent, unless we have an equal
    // result and there are more sorts still to perform, in which case
    // move on to the next one.
    if (result === 0 && sorts.length) {
      recurse = true
    } else {
      recurse = false
      sorts = sortBy.slice(0)
    }
    
    propSort = sorts.shift()
    property = t.isArrayLike(propSort) && propSort[0] || undefined
    sort = t.isArrayLike(propSort) && propSort[1] || 'asc'

    // Present the result
    if (recurse) {
      return sorter(a, b)
    } else if ((result === 0) || (currentSort === 'asc')) {
      return result
    }  else {
      return result * -1
    }
  }
}
*/
