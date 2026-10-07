import fs from "node:fs";
import path from "node:path";
import { routeIndexer } from "@toolkit/route-indexer";
import type { RouteEntry } from "@toolkit/route-indexer";
import type { Catalog, CatalogCategory, Inputs } from "../types.ts";

const PAGE_FILE = "index.html";

const byOrderThenTitle = (a: RouteEntry, b: RouteEntry): number =>
  a.order - b.order || a.title.localeCompare(b.title);

const toCatalogPath = (catalogDir: string, entryPath: string): string =>
  path.relative(catalogDir, entryPath).split(path.sep).join("/");

const hasPage = (entry: RouteEntry): boolean =>
  fs.existsSync(path.join(entry.path, PAGE_FILE));

const readCategories = async (
  catalogDir: string,
  sectionPath: string,
): Promise<CatalogCategory[]> => {
  const categories = await routeIndexer(sectionPath);

  return categories
    .sort(byOrderThenTitle)
    .map((category) => {
      const items = category.routes
        .filter(hasPage)
        .sort(byOrderThenTitle)
        .map((item) => ({
          title: item.title,
          path: toCatalogPath(catalogDir, item.path),
        }));

      return {
        title: category.title,
        path: toCatalogPath(catalogDir, category.path),
        count: items.length,
        items,
      };
    })
    .filter((category) => category.items.length);
};

export const readCatalog = async (catalogDir: string): Promise<Catalog> => {
  const sections = await routeIndexer(catalogDir);

  const catalog = await Promise.all(
    sections.sort(byOrderThenTitle).map(async (section) => ({
      title: section.title,
      path: toCatalogPath(catalogDir, section.path),
      categories: await readCategories(catalogDir, section.path),
    })),
  );

  return catalog.filter((section) => section.categories.length);
};

export const getCatalogInputs = async (catalogDir: string): Promise<Inputs> => {
  const inputs: Inputs = {};

  for (const section of await readCatalog(catalogDir)) {
    for (const category of section.categories) {
      for (const item of category.items) {
        inputs[item.path] = path.join(catalogDir, item.path, PAGE_FILE);
      }
    }
  }

  return inputs;
};
