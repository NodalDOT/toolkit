import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { instrument } from '../instrument/index.ts'

describe('instrument', () => {
  test('returns null for code with syntax errors', () => {
    assert.equal(instrument('export const f = (n: number) => {\n  if (n === ) return 1\n}', 'test.ts'), null)
    assert.equal(instrument('if (ready) return 1', 'test.ts'), null)
  })

  test('returns null when there is nothing to probe', () => {
    assert.equal(instrument('export function f() {}', 'test.ts'), null)
  })

  test('prepends the runtime import and wraps probes', () => {
    assert.equal(
      instrument('export const f = (n: number) => {\n  return n * 2\n}', 'test.ts'),
      "import { __trace$ } from '@toolkit/code-trace/runtime';" +
        'export const f = (n: number) => {\n  return __trace$(0, (n * 2))\n}',
    )
  })
})
