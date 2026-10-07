import path from "node:path";

export const ROOT_DIR = path.resolve(import.meta.dirname, "../..");
export const SNIPPETS_DIR = path.join(ROOT_DIR, "snippets");
export const UI_DIR = path.join(ROOT_DIR, "showcase", "ui");
export const ICONS_DIR = path.join(UI_DIR, "icons");
export const SCRIPTS_DIR = path.join(UI_DIR, "scripts");
export const PARTIALS_DIR = path.join(UI_DIR, "partials");
export const ENTRY_HTML = path.join(ROOT_DIR, "index.html");
export const DIST_DIR = path.join(ROOT_DIR, "dist");
