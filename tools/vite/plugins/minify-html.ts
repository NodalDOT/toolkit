import htmlnano from "htmlnano";
import type { HtmlnanoOptions } from "htmlnano";
import { minifySync } from "vite";
import type { Plugin } from "vite";
import { parseAttributes } from "../utils/html.ts";

const INLINE_SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
const JS_TYPES = new Set<string | undefined>([
  undefined,
  "",
  "module",
  "text/javascript",
]);

const htmlnanoOptions: HtmlnanoOptions = {
  collapseAttributeWhitespace: true,
  collapseBooleanAttributes: { amphtml: false },
  collapseWhitespace: "all",
  deduplicateAttributeValues: true,
  minifyAttributes: {
    metaContent: true,
    redundantWhitespaces: "agressive",
  },
  minifyCss: false,
  minifyConditionalComments: true,
  minifyHtmlTemplate: true,
  minifyJs: false,
  minifyJson: true,
  minifySvg: false,
  normalizeAttributeValues: true,
  removeAttributeQuotes: true,
  removeComments: "all",
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeUnusedCss: false,
  sortAttributes: true,
  sortAttributesWithLists: "alphabetical",
};

const minifyInlineScripts = (html: string, fileName: string): string =>
  html.replace(INLINE_SCRIPT, (tag, attributes: string, code: string) => {
    const parsed = parseAttributes(attributes);

    if (
      parsed.has("src") ||
      !code.trim() ||
      !JS_TYPES.has(parsed.get("type"))
    ) {
      return tag;
    }

    const result = minifySync(`${fileName}.js`, code);

    if (result.errors.length) {
      throw new Error(`${fileName}: ${result.errors[0].message}`);
    }

    return `<script${attributes}>${result.code.trim()}</script>`;
  });

export const minifyHtml = (): Plugin => ({
  name: "minify-html",
  enforce: "post",
  generateBundle: {
    order: "post",
    async handler(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== "asset" || !file.fileName.endsWith(".html")) {
          continue;
        }

        const result = await htmlnano.process(
          minifyInlineScripts(String(file.source), file.fileName),
          htmlnanoOptions,
        );

        file.source = result.html;
      }
    },
  },
});
