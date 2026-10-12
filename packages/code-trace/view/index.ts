import { CodeTrace } from './element.ts'

if (!customElements.get('code-trace')) {
  customElements.define('code-trace', CodeTrace)
}

export { CodeTrace }

declare global {
  interface HTMLElementTagNameMap {
    'code-trace': CodeTrace
  }
}
