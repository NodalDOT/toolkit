import fs from 'node:fs'
import path from 'node:path'
import type { HtmlTagDescriptor, Plugin, ViteDevServer } from 'vite'
import { findProbes, instrument } from '../instrument/index.ts'
import { findTracedSources } from './html.ts'

const PROBES_QUERY = 'probes'

const editorScript = (src: string): HtmlTagDescriptor => {
  const file = src.startsWith('.') ? src : `./${src}`

  return {
    tag: 'script',
    attrs: { type: 'module' },
    injectTo: 'body',
    children: `
      import '@toolkit/code-trace/view.css'
      import '@toolkit/code-trace/view'
      import source from '${file}?raw'
      import probes from '${file}?${PROBES_QUERY}'

      document.querySelector('code-trace[src="${src}"]').load(source, probes)
    `,
  }
}

const invalidate = (server: ViteDevServer | undefined, file: string) =>
  server?.moduleGraph.getModulesByFile(file)?.forEach((module) => server.moduleGraph.invalidateModule(module))

export const codeTrace = (): Plugin => {
  const traced = new Set<string>()
  let root = process.cwd()

  const traceSourcesOf = (htmlFile: string, html: string, server?: ViteDevServer) => {
    const srcs = findTracedSources(html)

    for (const src of srcs) {
      const file = path.resolve(path.dirname(htmlFile), src)
      if (traced.has(file)) continue

      traced.add(file)
      invalidate(server, file)
    }

    return srcs
  }

  return {
    name: 'code-trace',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    buildStart({ input }) {
      for (const entry of Object.values(input ?? {})) {
        const htmlFile = path.resolve(root, entry)
        if (htmlFile.endsWith('.html') && fs.existsSync(htmlFile)) {
          traceSourcesOf(htmlFile, fs.readFileSync(htmlFile, 'utf8'))
        }
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, { filename, server }) {
        const srcs = traceSourcesOf(filename, html, server)
        return srcs.length ? { html, tags: srcs.map(editorScript) } : html
      },
    },
    load(id) {
      const [file, query] = id.split('?')
      if (query !== PROBES_QUERY) return null

      const probes = findProbes(fs.readFileSync(file, 'utf8'), file)

      return `export default ${JSON.stringify(probes)}`
    },
    transform(code, id) {
      const [file, query] = id.split('?')
      if (query !== undefined || !traced.has(file)) return null

      return instrument(code, file)
    },
  }
}
