import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { stripTypeScriptTypes } from 'node:module'
import { parseSync } from 'vite'
import { collectProbes } from '../instrument/collect-probes.ts'
import { wrap } from '../instrument/wrap-probe.ts'

const trace = (source: string) => {
  const probes = collectProbes(parseSync('test.ts', source, { preserveParens: false }).program)
  const traced = wrap(source, probes)
  const values = new Map<number, unknown>()

  const __trace$ = (id: number, value: unknown) => {
    values.set(id, value)
    return value
  }
  const load = (code: string) => new Function('__trace$', `${stripTypeScriptTypes(code)}\nreturn f`)(__trace$)

  assert.deepEqual(parseSync('traced.ts', traced).errors, [])

  return {
    texts: probes.map(({ start, end }) => source.slice(start, end)),
    original: load(source),
    traced: load(traced),
    values: () =>
      Object.fromEntries([...values].map(([id, value]) => [source.slice(probes[id].start, probes[id].end), value])),
  }
}

describe('collectProbes', () => {
  test('IfStatement: test', () => {
    const t = trace(`function f(n: number) {
  if (n > 0) return 'pos'
  return 'neg'
}`)

    assert.deepEqual(t.texts, ['n > 0', "'pos'", "'neg'"])
    assert.equal(t.traced(1), t.original(1))
    assert.deepEqual(t.values(), { 'n > 0': true, "'pos'": 'pos' })
  })

  test('ReturnStatement: argument, bare return is skipped', () => {
    const t = trace(`function f(n: number) {
  if (!n) return
  return n * 2
}`)

    assert.deepEqual(t.texts, ['!n', 'n * 2'])
    assert.equal(t.traced(0), t.original(0))
    assert.equal(t.traced(3), 6)
  })

  test('WhileStatement: test', () => {
    const t = trace(`function f(n: number) {
  let i = 10
  while (i < n) i++
  return i
}`)

    assert.deepEqual(t.texts, ['10', 'i < n', 'i++', 'i'])
    assert.equal(t.traced(13), t.original(13))
    assert.deepEqual(t.values(), { '10': 10, 'i < n': false, 'i++': 12, i: 13 })
  })

  test('DoWhileStatement: test', () => {
    const t = trace(`function f(n: number) {
  let i = 10
  do i++
  while (i < n)
  return i
}`)

    assert.deepEqual(t.texts, ['10', 'i < n', 'i++', 'i'])
    assert.equal(t.traced(0), t.original(0))
    assert.deepEqual(t.values(), { '10': 10, 'i++': 10, 'i < n': false, i: 11 })
  })

  test('ForStatement: test, empty test is skipped', () => {
    const t = trace(`function f(n: number) {
  let sum = 100
  for (let i = 1; i <= n; i++) sum += i
  for (;;) break
  return sum
}`)

    assert.deepEqual(t.texts, ['100', 'i <= n', '1', 'sum += i', 'sum'])
    assert.equal(t.traced(3), t.original(3))
    assert.deepEqual(t.values(), { '100': 100, '1': 1, 'i <= n': false, 'sum += i': 106, sum: 106 })
  })

  test('SwitchStatement: discriminant', () => {
    const t = trace(`function f(n: number) {
  switch (n % 2) {
    case 0: return 'even'
    default: return 'odd'
  }
}`)

    assert.deepEqual(t.texts, ['n % 2', "'even'", "'odd'"])
    assert.equal(t.traced(3), t.original(3))
    assert.deepEqual(t.values(), { 'n % 2': 1, "'odd'": 'odd' })
  })

  test('ThrowStatement: argument', () => {
    const t = trace(`function f(n: number) {
  if (n < 0) throw new Error('negative')
  return n
}`)

    assert.deepEqual(t.texts, ['n < 0', "new Error('negative')", 'n'])
    assert.throws(() => t.traced(-1), { message: 'negative' })
    assert.ok(t.values()["new Error('negative')"] instanceof Error)
  })

  test('ConditionalExpression: test', () => {
    const t = trace(`function f(n: number) {
  return n > 0 ? 'pos' : 'neg'
}`)

    assert.deepEqual(t.texts, ["n > 0 ? 'pos' : 'neg'", 'n > 0'])
    assert.equal(t.traced(-1), t.original(-1))
    assert.deepEqual(t.values(), { 'n > 0': false, "n > 0 ? 'pos' : 'neg'": 'neg' })
  })

  test('VariableDeclarator: init, missing init is skipped', () => {
    const t = trace(`function f(n: number) {
  let empty
  const double = n * 2
  return [empty, double]
}`)

    assert.deepEqual(t.texts, ['n * 2', '[empty, double]'])
    assert.deepEqual(t.traced(2), t.original(2))
  })

  test('VariableDeclarator: functions are skipped to keep inferred names', () => {
    const t = trace(`function f() {
  const arrow = () => {}
  const fn = function () {}
  const Cls = class {}
  const wrapped = (() => {})
  return [arrow.name, fn.name, Cls.name, wrapped.name]
}`)

    assert.deepEqual(t.texts, ['[arrow.name, fn.name, Cls.name, wrapped.name]'])
    assert.deepEqual(t.traced(), ['arrow', 'fn', 'Cls', 'wrapped'])
  })

  test('ArrowFunctionExpression: expression body, block body is skipped', () => {
    const t = trace(`function f(xs: number[]) {
  const doubled = xs.map((x) => x * 2)
  const tripled = xs.map((x) => { return x * 3 })
  return [doubled, tripled]
}`)

    assert.deepEqual(t.texts, ['xs.map((x) => x * 2)', 'x * 2', 'xs.map((x) => { return x * 3 })', 'x * 3', '[doubled, tripled]'])
    assert.deepEqual(t.traced([1, 2]), t.original([1, 2]))
    assert.deepEqual(t.values()['x * 2'], 4)
  })

  test('ExpressionStatement: expression', () => {
    const t = trace(`function f(xs: number[]) {
  xs.push(4)
  xs.length
  return xs
}`)

    assert.deepEqual(t.texts, ['xs.push(4)', 'xs.length', 'xs'])
    assert.deepEqual(t.traced([1]), t.original([1]))
    assert.deepEqual(t.values(), { 'xs.push(4)': 2, 'xs.length': 2, xs: [1, 4] })
  })

  test('ExpressionStatement: directives are skipped to keep strict mode', () => {
    const t = trace(`function f() {
  'use strict'
  return this
}`)

    const { traced } = t

    assert.deepEqual(t.texts, ['this'])
    assert.equal(traced(), undefined)
  })

  test('nested probes are wrapped inside each other', () => {
    const t = trace(`function f(xs: number[]) {
  if (xs.some((x) => { return x > 0 })) return 1
  return 0
}`)

    assert.deepEqual(t.texts, ['xs.some((x) => { return x > 0 })', 'x > 0', '1', '0'])
    assert.equal(t.traced([-1, 2]), t.original([-1, 2]))
    assert.deepEqual(t.values(), { 'xs.some((x) => { return x > 0 })': true, 'x > 0': true, '1': 1 })
  })
})
