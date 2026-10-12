import path from "node:path";
import { htmlDirectives as createHtmlDirectives } from "@toolkit/html-directives/vite";
import { META_FILE } from "@toolkit/route-indexer";
import type { Plugin } from "vite";
import {
  ENTRY_HTML,
  ICONS_DIR,
  PARTIALS_DIR,
  SCRIPTS_DIR,
  SNIPPETS_DIR,
  getConfig,
} from "../../config/index.ts";
import { readCatalog } from "../utils/catalog.ts";

const isInside = (dir: string, file: string): boolean =>
  file.startsWith(dir + path.sep);

const isPage = (file: string): boolean =>
  file === ENTRY_HTML || isInside(SNIPPETS_DIR, file);

const isCatalogChange = (event: string, file: string): boolean =>
  isInside(SNIPPETS_DIR, file) &&
  (event !== "change" || path.basename(file) === META_FILE);

export const htmlDirectives = (): Plugin => {
  const { storageKeys } = getConfig();

  const sharedData = {
    themeStorageKey: storageKeys.theme,
    sidebarStorageKey: storageKeys.sidebar,
    navGroupsStorageKey: storageKeys.navGroups,
  };

  const pageData = async (file: string) =>
    file === ENTRY_HTML
      ? { ...sharedData, catalog: await readCatalog(SNIPPETS_DIR) }
      : sharedData;

  return createHtmlDirectives({
    dirs: {
      iconsDir: ICONS_DIR,
      contentDir: PARTIALS_DIR,
      scriptDir: SCRIPTS_DIR,
    },
    include: isPage,
    data: pageData,
    reloadOn: isCatalogChange,
  });
};
