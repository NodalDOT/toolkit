import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { RouteIndex } from "../src/types.ts";

export type Tree = Record<string, unknown>;

export const createTree = async (tree: Tree): Promise<string> => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "route-indexer-"));

  for (const [relativePath, content] of Object.entries(tree)) {
    const fullPath = path.join(root, relativePath);

    if (relativePath.endsWith("/")) {
      await fs.mkdir(fullPath, { recursive: true });
      continue;
    }

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(
      fullPath,
      typeof content === "string" ? content : JSON.stringify(content),
    );
  }

  return root;
};

export const withTree = async (
  tree: Tree,
  run: (root: string) => Promise<void>,
): Promise<void> => {
  const root = await createTree(tree);

  try {
    await run(root);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
};

export const sortIndex = (index: RouteIndex): RouteIndex =>
  [...index]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((segment) => ({
      ...segment,
      routes: [...segment.routes].sort((a, b) => a.name.localeCompare(b.name)),
    }));
