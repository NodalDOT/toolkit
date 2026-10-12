import path from "node:path";
import type { Plugin } from "vite";
import { renderTemplate } from "../render/index.ts";
import type { HandlerDirs, Scope } from "../types/index.ts";

const RELOAD_DELAY_MS = 100;

type Options = {
  dirs: HandlerDirs;
  include: (file: string) => boolean;
  data?: (file: string) => Scope | Promise<Scope>;
  reloadOn?: (event: string, file: string) => boolean;
};

const isInside = (dir: string, file: string): boolean =>
  file.startsWith(dir + path.sep);

const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const htmlDirectives = ({
  dirs,
  include,
  data,
  reloadOn,
}: Options): Plugin => {
  const isTemplateAsset = (file: string): boolean =>
    Object.values(dirs).some((dir) => isInside(dir, file));

  return {
    name: "html-directives",
    transformIndexHtml: {
      order: "pre",
      async handler(html, ctx) {
        const file = path.resolve(ctx.filename);

        if (!include(file)) {
          return html;
        }

        try {
          return await renderTemplate(html, { dirs, data: await data?.(file) });
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

      server.watcher.on("all", (event, file) => {
        if (isTemplateAsset(file) || reloadOn?.(event, file)) {
          reload();
        }
      });
    },
  };
};
