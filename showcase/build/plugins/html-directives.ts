import path from "node:path";
import { renderTemplate } from "@toolkit/html-directives";
import type { HandlerDirs } from "@toolkit/html-directives";
import type { Plugin } from "vite";
import {
  ENTRY_HTML,
  ICONS_DIR,
  PARTIALS_DIR,
  SCRIPTS_DIR,
  SNIPPETS_DIR,
} from "../../config/index.ts";
import { readCatalog } from "../utils/catalog.ts";

const RELOAD_DELAY_MS = 100;
const META_FILE = "meta.json";

const dirs: HandlerDirs = {
  iconsDir: ICONS_DIR,
  contentDir: PARTIALS_DIR,
  scriptDir: SCRIPTS_DIR,
};

const isInside = (dir: string, filePath: string): boolean =>
  filePath.startsWith(dir + path.sep);

const isTemplateAsset = (filePath: string): boolean =>
  Object.values(dirs).some((dir) => isInside(dir, filePath));

const isCatalogChange = (event: string, filePath: string): boolean =>
  isInside(SNIPPETS_DIR, filePath) &&
  (event !== "change" || path.basename(filePath) === META_FILE);

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const htmlDirectives = (): Plugin => ({
  name: "html-directives",
  transformIndexHtml: {
    order: "pre",
    async handler(html, ctx) {
      if (path.resolve(ctx.filename) !== ENTRY_HTML) {
        return html;
      }

      try {
        const catalog = await readCatalog(SNIPPETS_DIR);

        return await renderTemplate(html, { dirs, data: { catalog } });
      } catch (error) {
        throw new Error(`${ctx.filename}: ${toMessage(error)}`, {
          cause: error,
        });
      }
    },
  },
  configureServer(server) {
    let reloadTimer: NodeJS.Timeout | undefined;

    const reload = () => {
      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(
        () => server.ws.send({ type: "full-reload" }),
        RELOAD_DELAY_MS,
      );
    };

    server.watcher.on("all", (event, filePath) => {
      if (isTemplateAsset(filePath) || isCatalogChange(event, filePath)) {
        reload();
      }
    });
  },
});
