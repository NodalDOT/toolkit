const COMMENT = /<!--[\s\S]*?-->/g
const TRACE_TAG = /<code-trace\b[^>]*?\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g
const RELATIVE_PATH = /^(?!\/)[\w./-]+$/

const checkedSource = (src: string) => {
  if (!RELATIVE_PATH.test(src)) {
    throw new Error(`<code-trace src="${src}">: src must be a path relative to the page, e.g. "debounce.ts"`)
  }
  return src
}

export const findTracedSources = (html: string) =>
  [...html.replace(COMMENT, '').matchAll(TRACE_TAG)].map(([, double, single, bare]) =>
    checkedSource(double ?? single ?? bare),
  )
