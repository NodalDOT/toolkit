const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\b(\d[\d_.]*n?)\b|\b(as|async|await|break|case|catch|class|const|continue|default|delete|do|else|export|extends|false|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|switch|this|throw|true|try|type|typeof|undefined|var|void|while|yield)\b/g

const CLASSES = ['comment', 'string', 'number', 'keyword']

export type Token = { text: string; cls: string }

export const tokenizeLines = (source: string) => {
  const lines: Token[][] = [[]]

  const push = (text: string, cls = '') =>
    text.split('\n').forEach((part, i) => {
      if (i) lines.push([])
      if (part) lines[lines.length - 1].push({ text: part, cls })
    })

  let cursor = 0
  for (const match of source.matchAll(TOKEN)) {
    push(source.slice(cursor, match.index))
    push(match[0], `code-trace-${CLASSES[match.slice(1).findIndex(Boolean)]}`)
    cursor = match.index + match[0].length
  }
  push(source.slice(cursor))

  return lines
}
