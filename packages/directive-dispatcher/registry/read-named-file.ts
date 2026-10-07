import fs from "node:fs/promises";
import path from "node:path";

export const readNamedFile = (
  dir: string,
  name: string,
  extension: string,
): Promise<string> => {
  if (!name) {
    throw new Error(`Missing name for .${extension} file in ${dir}`);
  }

  return fs.readFile(path.join(dir, `${name}.${extension}`), "utf8");
};
