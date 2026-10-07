import path from "node:path";

export const ROOT_DIR = path.resolve(import.meta.dirname, "..");
export const SRC_DIR = path.join(ROOT_DIR, "src");
export const SITE_DIR = path.join(SRC_DIR, "site");
export const ICONS_DIR = path.join(SITE_DIR, "icons");
export const SCRIPTS_DIR = path.join(SITE_DIR, "scripts");
export const PARTIALS_DIR = path.join(SITE_DIR, "partials");
export const CATALOG_DIR = path.join(SRC_DIR, "catalog");
export const ENTRY_HTML = path.join(SRC_DIR, "index.html");
export const DIST_DIR = path.join(ROOT_DIR, "dist");
