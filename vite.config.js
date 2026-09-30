import fs from "node:fs";
import path from "node:path";
import ejs from "ejs";
import htmlnano from "htmlnano";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const ROOT_DIR = import.meta.dirname;
const CONTENT_DIR = path.join(ROOT_DIR, "content");
const MAIN_HTML = path.join(ROOT_DIR, "index.html");

const htmlnanoOptions = {
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

const getDirNames = (dirPath) =>
  fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

/** Optional meta.json in any content folder: { "title": string, "order": number }. */
const readMeta = (dirPath) => {
  const metaPath = path.join(dirPath, "meta.json");

  return fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, "utf-8"))
    : {};
};

const byOrderThenTitle = (a, b) =>
  (a.order ?? Infinity) - (b.order ?? Infinity) ||
  a.title.localeCompare(b.title);

const readEntries = (parentPath, mapEntry) =>
  getDirNames(path.join(CONTENT_DIR, parentPath))
    .map((name) => {
      const entryPath = path.posix.join(parentPath, name);
      const meta = readMeta(path.join(CONTENT_DIR, entryPath));

      return mapEntry({
        name,
        path: entryPath,
        title: meta.title ?? name,
        order: meta.order,
      });
    })
    .filter(Boolean)
    .sort(byOrderThenTitle);


const createStructure = () =>
  readEntries("", (section) => {
    const categories = readEntries(section.path, (category) => {
      const items = readEntries(category.path, (item) =>
        fs.existsSync(path.join(CONTENT_DIR, item.path, "index.html"))
          ? item
          : null,
      );

      return items.length ? { ...category, items } : null;
    });

    return categories.length ? { ...section, categories } : null;
  });

const getPageInputs = () => {
  const inputs = { main: MAIN_HTML };

  for (const section of createStructure()) {
    for (const category of section.categories) {
      for (const item of category.items) {
        inputs[item.path] = path.join(CONTENT_DIR, item.path, "index.html");
      }
    }
  }

  return inputs;
};

const isStructureFile = (filePath) =>
  filePath.startsWith(CONTENT_DIR) &&
  ["index.html", "meta.json"].includes(path.basename(filePath));

const toolkitNav = (env) => ({
  name: "toolkit-nav",
  transformIndexHtml: {
    order: "pre",
    handler(html, ctx) {
      if (ctx.path !== "/index.html") {
        return html;
      }

      return ejs.render(html, {
        structure: createStructure(),
        currentDate: new Date().toLocaleDateString("en-CA"),
        githubUrl: env.GITHUB_URL,
        githubName: env.GITHUB_NAME,
      });
    },
  },
  configureServer(server) {
    const reload = (filePath) => {
      if (isStructureFile(filePath)) {
        server.ws.send({ type: "full-reload" });
      }
    };

    server.watcher.on("add", reload);
    server.watcher.on("unlink", reload);
    server.watcher.on("change", (filePath) => {
      if (path.basename(filePath) === "meta.json") {
        reload(filePath);
      }
    });
  },
});

const minifyHtml = () => ({
  name: "minify-html",
  apply: "build",
  enforce: "post",
  generateBundle: {
    order: "post",
    async handler(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== "asset" || !file.fileName.endsWith(".html")) {
          continue;
        }

        const result = await htmlnano.process(
          String(file.source),
          htmlnanoOptions,
        );

        file.source = result.html;
      }
    },
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ROOT_DIR, "");

  return {
    base: "./",
    plugins: [react(), toolkitNav(env), minifyHtml()],
    server: {
      port: Number(env.PORT || 3000),
    },
    preview: {
      port: Number(env.PORT || 3000),
    },
    build: {
      outDir: "build",
      emptyOutDir: true,
      modulePreload: { polyfill: false },
      rolldownOptions: {
        input: getPageInputs(),
      },
    },
  };
});
