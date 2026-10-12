import { hits, reset, run, subscribe, values } from '../runtime/index.ts'
import type { Probe } from '../types.ts'
import { tokenizeLines, type Token } from './highlight.ts'

type Line = { root: HTMLElement; hits: HTMLElement; ids: number[]; count: number }

const MARKER_BASE = 0xe000
const MARKERS = /([\ue000-\uf8ff])/

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = '') => {
  const node = document.createElement(tag)
  if (className) node.className = className
  node.textContent = text
  return node
}

const insertMarkers = (source: string, probes: Probe[]) => {
  const ids = probes.map((_, id) => id).sort((a, b) => probes[a].end - probes[b].end)

  let result = ''
  let cursor = 0
  for (const id of ids) {
    result += source.slice(cursor, probes[id].end) + String.fromCharCode(MARKER_BASE + id)
    cursor = probes[id].end
  }
  return result + source.slice(cursor)
}

const stateOf = (ids: number[]) => (ids.some((id) => run.has(id)) ? 'hit' : ids.length && run.size ? 'miss' : '')

const countOf = (ids: number[]) => Math.max(0, ...ids.map((id) => hits.get(id) ?? 0))

export class CodeTrace extends HTMLElement {
  #code = el('div', 'code-trace-code')
  #lines: Line[] = []
  #chips = new Map<number, HTMLElement>()
  #unsubscribe: (() => void) | null = null

  connectedCallback() {
    if (!this.contains(this.#code)) this.replaceChildren(this.#header(), this.#code)

    this.#unsubscribe = subscribe(() => this.#render())
    this.#render()
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
  }

  load(source: string, probes: Probe[]) {
    const fragment = document.createDocumentFragment()

    this.#chips.clear()
    this.#lines = tokenizeLines(insertMarkers(source, probes).trimEnd()).map((tokens, index) => {
      const line = this.#line(tokens, index)
      fragment.append(line.root)
      return line
    })

    this.#code.replaceChildren(fragment)
    this.#render()
  }

  #header() {
    const button = el('button', '', 'reset')
    button.type = 'button'
    button.addEventListener('click', reset)

    const header = el('header', 'code-trace-header')
    header.append(el('span', '', this.getAttribute('src') ?? ''), button)
    return header
  }

  #chip(id: number) {
    const chip = el('span', 'code-trace-chip')
    chip.hidden = true
    this.#chips.set(id, chip)
    return chip
  }

  #line(tokens: Token[], index: number): Line {
    const ids: number[] = []
    const code = el('span', 'code-trace-source')

    for (const { text, cls } of tokens) {
      text.split(MARKERS).forEach((part, i) => {
        if (i % 2) {
          const id = part.charCodeAt(0) - MARKER_BASE
          ids.push(id)
          code.append(this.#chip(id))
        } else if (part) {
          code.append(cls ? el('span', cls, part) : part)
        }
      })
    }

    const root = el('div', 'code-trace-line')
    const hitsView = el('span', 'code-trace-hits')
    root.append(el('span', 'code-trace-line-number', String(index + 1)), hitsView, code)

    return { root, hits: hitsView, ids, count: 0 }
  }

  #render() {
    for (const line of this.#lines) {
      const state = stateOf(line.ids)
      const count = countOf(line.ids)

      if (line.root.dataset.state !== state) line.root.dataset.state = state
      if (line.count === count) continue

      line.count = count
      line.hits.textContent = count ? `×${count}` : ''
      if (state === 'hit') line.root.getAnimations().forEach((animation) => animation.play())
    }

    for (const [id, chip] of this.#chips) {
      const text = run.has(id) ? values.get(id)! : ''
      if (chip.textContent === text) continue

      chip.textContent = text
      chip.hidden = !text
    }
  }
}
