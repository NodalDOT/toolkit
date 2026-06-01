import fs from "node:fs";
import path from "node:path";
import minifyHtml from "./minifyHtml.js";
import minifyCss from "./minifyCss.js";
import minifyJs from "./minifyJs.js";

const minifyByExtension = async (content, filePath) => {
  const extension = path.extname(filePath);

  if (extension === ".html") {
    return minifyHtml(content);
  }

  if (extension === ".css") {
    return minifyCss(content);
  }

  if (extension === ".js") {
    return minifyJs(content, filePath);
  }

  return content;
};

const writeBuildFile = async (sourcePath, targetPath) => {
  const extension = path.extname(sourcePath);

  if (![".html", ".css", ".js"].includes(extension)) {
    fs.copyFileSync(sourcePath, targetPath);
    return;
  }

  const source = fs.readFileSync(sourcePath, "utf-8");
  const minified = await minifyByExtension(source, sourcePath);

  fs.writeFileSync(targetPath, minified);
};

export default writeBuildFile;
