import type { Handler, HandlerContext } from "../../types/index.ts"
import { readNamedFile } from "../read-named-file.ts"

export class IconHandler implements Handler {
  private readonly iconsDir: string

  constructor(iconsDir: string) {
    this.iconsDir = iconsDir
  }

  async render(context: HandlerContext): Promise<string> {
    return readNamedFile(this.iconsDir, context.node.expression, 'svg')
  }
}
