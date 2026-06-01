import fs from 'node:fs'
import path from 'node:path'

/**
 * @typedef {Object} StructureFile
 * @property {string} name
 * @property {string} path
 *
 * @typedef {Object} StructureElement
 * @property {string} name
 * @property {StructureFile[]} files
 * @property {string} path
 *
 * @typedef {Object} StructureBlock
 * @property {string} name
 * @property {StructureElement[]} elements
 * @property {string} path
 *
 * @typedef {Record<string, StructureBlock>} Structure
 */

const createStructure = (CONTENT_DIR) => {
  /** @type {Structure} */
  const structure = {};

  const blockDirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  for (const blockDir of blockDirs) {
    if (!blockDir.isDirectory()) {
      continue;
    }

    structure[blockDir.name] = {
      name: blockDir.name,
      elements: [],
      path: blockDir.name,
    };

    const blockPath = path.join(CONTENT_DIR, blockDir.name);
    const elementDirs = fs.readdirSync(blockPath, { withFileTypes: true });

    for (const elementDir of elementDirs) {
      if (!elementDir.isDirectory()) {
        continue;
      }

      const elementPath = path.join(blockPath, elementDir.name);
      const files = fs
        .readdirSync(elementPath, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => ({
          name: entry.name,
          path: path.join(blockDir.name, elementDir.name, entry.name),
        }));

      structure[blockDir.name].elements.push({
        name: elementDir.name,
        files,
        path: path.join(blockDir.name, elementDir.name),
      });
    }
  }

  return structure;
};
export default createStructure
