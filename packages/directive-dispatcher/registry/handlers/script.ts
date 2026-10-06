import type { Handler, HandlerContext } from "../../types/index.ts"
import { readNamedFile } from "../read-named-file.ts"

export class ScriptHandler implements Handler {
  private readonly scriptDir: string

  constructor(scriptDir: string) {
    this.scriptDir = scriptDir
  }

  async render(context: HandlerContext): Promise<string> {
    const code = await readNamedFile(this.scriptDir, context.node.expression, 'js')

    return `<script>${code}</script>`
  }
}
