import { fillPlaceholders } from "../../placeholders/fill-placeholders.ts";
import type { Handler, HandlerContext } from "../../types/index.ts";
import { readNamedFile } from "../read-named-file.ts";

const CLOSING_SCRIPT_TAG = /<\/script/i;

const escapeJsString = (value: string): string =>
  JSON.stringify(value).slice(1, -1).replaceAll("'", "\\'");

export class ScriptHandler implements Handler {
  private readonly scriptDir: string;

  constructor(scriptDir: string) {
    this.scriptDir = scriptDir;
  }

  async render({ node, data }: HandlerContext): Promise<string> {
    const name = node.expression;
    const source = await readNamedFile(this.scriptDir, name, "js");
    const code = fillPlaceholders(source, data, escapeJsString);

    if (CLOSING_SCRIPT_TAG.test(code)) {
      throw new Error(`${name}.js can't be inlined: it contains </script`);
    }

    return `<script>${code}</script>`;
  }
}
