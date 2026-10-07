import type { Handler, HandlerContext } from "../../types/index.ts";
import { readNamedFile } from "../read-named-file.ts";

const CLOSING_SCRIPT_TAG = /<\/script/i;

export class ScriptHandler implements Handler {
  private readonly scriptDir: string;

  constructor(scriptDir: string) {
    this.scriptDir = scriptDir;
  }

  async render(context: HandlerContext): Promise<string> {
    const name = context.node.expression;
    const code = await readNamedFile(this.scriptDir, name, "js");

    if (CLOSING_SCRIPT_TAG.test(code)) {
      throw new Error(`${name}.js can't be inlined: it contains </script`);
    }

    return `<script>${code}</script>`;
  }
}
