import type { ConfigEnv } from "vite";

export type CatalogItem = {
  title: string;
  path: string;
};

export type CatalogCategory = {
  title: string;
  path: string;
  count: number;
  items: CatalogItem[];
};

export type CatalogSection = {
  title: string;
  path: string;
  categories: CatalogCategory[];
};

export type Catalog = CatalogSection[];

export type Inputs = Record<string, string>;

export type Attributes = Map<string, string | undefined>;

export type PluginsEnv = Pick<ConfigEnv, "command" | "mode">;
