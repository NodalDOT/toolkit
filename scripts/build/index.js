import fs from "node:fs";
import ejs from "ejs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createStructure from "./createStructure.js";
import { ensureDir } from "./utils.js";

const CONTENT_DIR = path.join(".", "content");
const BASE_DIR = path.join(".", "base");
const EJS_FILE = path.join(BASE_DIR, "index.ejs");
const BASE_STYLE_FILE = path.join(BASE_DIR, "style.css");
const BASE_SCRIPT_FILE = path.join(BASE_DIR, "script.js");
const GITHUB_URL = process.env.GITHUB_URL;

const BUILD_DIR = path.join('.', 'build')
const HTML_FILE = path.join(BUILD_DIR, 'index.html')

const __filename = fileURLToPath(import.meta.url);
const GITHUB_NAME = process.env.GITHUB_NAME;;

const build = () => {
  // STRUCTURE

  const structure = createStructure(CONTENT_DIR);

  // build folder

  fs.rmSync(BUILD_DIR, { recursive: true, force: true });

  ensureDir(BUILD_DIR);

  // HTML
  const ejsFile = fs.readFileSync(EJS_FILE, "utf-8");
  const html = ejs.render(ejsFile, {
    structure,
    currentDate: new Date().toLocaleDateString("en-CA"),
    githubUrl: GITHUB_URL,
    githubName: GITHUB_NAME,
  });

  fs.writeFileSync(HTML_FILE, html)
  // COMPONENTS

  for (const block of Object.values(structure)) {
    for (const element of block.elements) {
      ensureDir(path.join(BUILD_DIR, element.path));

      for (const file of element.files) {
        const sourcePath = path.join(CONTENT_DIR, file.path);
        const targetPath = path.join(BUILD_DIR, file.path);

        ensureDir(path.dirname(targetPath));
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  }

  // CSS
  if (fs.existsSync(BASE_STYLE_FILE)) {
    fs.copyFileSync(BASE_STYLE_FILE, path.join(BUILD_DIR, "style.css"));
  }

  // JS
  if (fs.existsSync(BASE_SCRIPT_FILE)) {
    fs.copyFileSync(BASE_SCRIPT_FILE, path.join(BUILD_DIR, "script.js"));
  }
};

export default build;

if (process.argv[1] === __filename) {
  build();
}
