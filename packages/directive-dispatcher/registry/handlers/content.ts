import type { Handler, HandlerContext } from "../../types/index.ts"
import { readNamedFile } from "../read-named-file.ts"

export class ContentHandler implements Handler {
  private readonly contentDir: string

  constructor(contentDir: string) {
    this.contentDir = contentDir
  }

  async render(context: HandlerContext): Promise<string> {
    return readNamedFile(this.contentDir, context.node.expression, 'html')
  }
}
