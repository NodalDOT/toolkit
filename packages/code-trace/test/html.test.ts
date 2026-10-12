import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { findTracedSources } from '../plugin/html.ts'

describe('findTracedSources', () => {
  test('reads src in any quoting style', () => {
    const html = `<code-trace src="a.ts"></code-trace><code-trace src='b.ts'></code-trace><code-trace src=c.ts></code-trace>`

    assert.deepEqual(findTracedSources(html), ['a.ts', 'b.ts', 'c.ts'])
  })

  test('reads src among other attributes', () => {
    assert.deepEqual(findTracedSources('<code-trace class="x" src="./a.ts" hidden></code-trace>'), ['./a.ts'])
  })

  test('ignores tags inside html comments', () => {
    assert.deepEqual(findTracedSources('<!-- <code-trace src="old.ts"></code-trace> --><code-trace src="new.ts">'), ['new.ts'])
  })

  test('ignores attributes that only end with src', () => {
    assert.deepEqual(findTracedSources('<code-trace data-src="a.ts"></code-trace>'), [])
  })

  test('rejects paths that are not relative to the page', () => {
    assert.throws(() => findTracedSources('<code-trace src="/abs.ts">'), /relative to the page/)
    assert.throws(() => findTracedSources(`<code-trace src="a'b.ts">`), /relative to the page/)
  })
})
