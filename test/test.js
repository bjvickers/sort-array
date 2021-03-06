const TestRunner = require('test-runner')
const sort = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('sort', function () {
  const fixture = [
    { a: 4, b: 1, c: 1 },
    { a: 4, b: 3, c: 1 },
    { a: 2, b: 2, c: 3 },
    { a: 2, b: 2, c: 2 },
    { a: 1, b: 3, c: 4 },
    { a: 1, b: 1, c: 4 },
    { a: 1, b: 2, c: 4 },
    { a: 3, b: 3, c: 3 },
    { a: 4, b: 3, c: 1 }
  ]
  const expected = [
    { a: 1, b: 1, c: 4 },
    { a: 1, b: 2, c: 4 },
    { a: 1, b: 3, c: 4 },
    { a: 2, b: 2, c: 2 },
    { a: 2, b: 2, c: 3 },
    { a: 3, b: 3, c: 3 },
    { a: 4, b: 1, c: 1 },
    { a: 4, b: 3, c: 1 },
    { a: 4, b: 3, c: 1 }
  ]
  const by = [ 'a', 'b', 'c' ]
  const result = sort(fixture, by)
  a.deepStrictEqual(result, expected)
})

runner.test('sort: undefined vals', function () {
  const fixture = [
    { a: 1 },
    {},
    { a: 0 }
  ]
  const expected = [
    {},
    { a: 0 },
    { a: 1 }
  ]
  const by = 'a'
  const result = sort(fixture, by)
  a.deepStrictEqual(result, expected)
})

runner.test('sort: undefined vals 2', function () {
  const fixture = [
    { a: 'yeah' },
    {},
    { a: 'what' }
  ]
  const expected = [
    {},
    { a: 'what' },
    { a: 'yeah' }
  ]
  const by = 'a'
  const result = sort(fixture, by)
  a.deepStrictEqual(result, expected)
})

runner.test('sort: undefined vals 3', function () {
  const fixture = [
    { a: 2 },
    { a: undefined },
    { a: 1 }
  ]
  const expected = [
    { a: undefined },
    { a: 1 },
    { a: 2 }
  ]
  const by = 'a'
  const result = sort(fixture, by)
  a.deepStrictEqual(result, expected)
})

runner.test('sort: deep value', function () {
  const fixture = [
    { inner: { number: 5 } },
    { inner: { number: 2 } },
    { inner: { number: 3 } },
    { inner: { number: 1 } },
    { inner: { number: 4 } }
  ]
  const expected = [
    { inner: { number: 1 } },
    { inner: { number: 2 } },
    { inner: { number: 3 } },
    { inner: { number: 4 } },
    { inner: { number: 5 } }
  ]
  const by = 'inner.number'
  const result = sort(fixture, by)
  a.deepStrictEqual(result, expected)
})

runner.test('sort: nulls', function () {
  const expected = [
    { importance: 'speed', weight: null },
    { importance: 'strength', weight: null },
    { importance: 'intelligence', weight: null },
    { importance: 'strength', weight: 'high' },
    { importance: 'speed', weight: 'high' },
    { importance: 'intelligence', weight: 'high' },
    { importance: 'intelligence', weight: 'medium' },
    { importance: 'speed', weight: 'medium' },
    { importance: 'strength', weight: 'medium' }
  ]
  const fixture = [
    { importance: 'intelligence', weight: 'medium' },
    { importance: 'strength', weight: 'high' },
    { importance: 'speed', weight: null },
    { importance: 'strength', weight: null },
    { importance: 'speed', weight: 'high' },
    { importance: 'intelligence', weight: null },
    { importance: 'speed', weight: 'medium' },
    { importance: 'intelligence', weight: 'high' },
    { importance: 'strength', weight: 'medium' }
  ]
  const by = 'weight'
  const result = sort(fixture, by)
  a.deepStrictEqual(result, expected)
})

runner.test('sort: nulls 2', function () {
  const fixture = [
    { a: 4, b: null, c: 3 },
    { a: 4, b: 2, c: null },
    { a: 2, b: 2, c: 3 },
    { a: 2, b: 2, c: 2 },
    { a: null, b: 3, c: 4 },
    { a: null, b: null, c: 4 },
    { a: null, b: 2, c: 4 },
    { a: 3, b: 3, c: 3 },
    { a: 4, b: 3, c: null }
  ]
  const expected = [
    { a: null, b: null, c: 4 },
    { a: null, b: 2, c: 4 },
    { a: null, b: 3, c: 4 },
    { a: 2, b: 2, c: 2 },
    { a: 2, b: 2, c: 3 },
    { a: 3, b: 3, c: 3 },
    { a: 4, b: null, c: 3 },
    { a: 4, b: 2, c: null },
    { a: 4, b: 3, c: null }
  ]
  const by = [ 'a', 'b', 'c' ]
  const result = sort(fixture, by)
  a.deepStrictEqual(result, expected)
})
