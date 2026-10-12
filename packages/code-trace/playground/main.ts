import '@toolkit/code-trace/view.css'
import '@toolkit/code-trace/view'
import { startRun } from '@toolkit/code-trace/runtime'
import { check } from './example.ts'
import source from './example.ts?raw'
import probes from './example.ts?probes'

const input = document.querySelector('input')!

document.querySelector('code-trace')!.load(source, probes)

input.addEventListener('input', () => {
  startRun()
  check(Number(input.value))
})
