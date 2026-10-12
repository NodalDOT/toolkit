import { parseSync } from 'vite'
import type { Probe } from '../types.ts'
import { collectProbes } from './collect-probes.ts'
import { PROBE_FN, wrap } from './wrap-probe.ts'

const RUNTIME_IMPORT = `import { ${PROBE_FN} } from '@toolkit/code-trace/runtime';`

export const findProbes = (source: string, filename: string): Probe[] => {
  const { program, errors } = parseSync(filename, source, { preserveParens: false })
  return errors.length ? [] : collectProbes(program)
}

export const instrument = (source: string, filename: string): string | null => {
  const probes = findProbes(source, filename)
  if (!probes.length) return null

  return RUNTIME_IMPORT + wrap(source, probes)
}
