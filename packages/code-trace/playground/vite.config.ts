import { codeTrace } from '@toolkit/code-trace'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [codeTrace({ include: (file) => file.endsWith('/example.ts') })],
})
