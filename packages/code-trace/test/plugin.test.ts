import { after, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { codeTrace } from '../plugin/index.ts'

const call = (hook: unknown, ...args: unknown[]) => (hook as (...args: unknown[]) => unknown)(...args)

const setup = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'code-trace-'))
  after(() => fs.rmSync(root, { recursive: true }))

  const traced = path.join(root, 'traced.ts')
  const other = path.join(root, 'other.ts')

  fs.writeFileSync(path.join(root, 'page.html'), '<code-trace src="traced.ts"></code-trace>')
  fs.writeFileSync(traced, 'export const f = (n: number) => n * 2')
  fs.writeFileSync(other, 'export const g = (n: number) => n * 3')

  const plugin = codeTrace()
  call(plugin.configResolved, { root })
  call(plugin.buildStart, { input: { page: 'page.html' } })

  return { plugin, traced, other }
}

describe('codeTrace plugin', () => {
  test('knows traced files from html entries before any html is transformed', () => {
    const { plugin, traced } = setup()

    const result = call(plugin.transform, fs.readFileSync(traced, 'utf8'), traced)

    assert.match(String(result), /__trace\$\(0, \(n \* 2\)\)/)
  })

  test('leaves files that no page traces untouched', () => {
    const { plugin, other } = setup()

    assert.equal(call(plugin.transform, fs.readFileSync(other, 'utf8'), other), null)
  })

  test('serves probe positions for ?probes', () => {
    const { plugin, traced } = setup()

    assert.equal(call(plugin.load, `${traced}?probes`), 'export default [{"start":32,"end":37}]')
  })
})
