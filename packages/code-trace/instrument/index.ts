import { parseSync } from 'vite'


import { collectProbes } from './collect-probes.ts'
import { wrap } from './wrap-probe.ts'

export const instrument = (source: string, filename: string): string | null => {
  const { program, errors } = parseSync(filename, source, { preserveParens: false })
  if (errors.length) return null

  const probes = collectProbes(program)
  if (!probes.length) return null

  return `import { __trace$ } from '@toolkit/code-trace/runtime';` + wrap(source, probes)
}
