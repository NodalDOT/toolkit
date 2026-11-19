import fs from "node:fs/promises";
import path from "node:path";
import { readMeta } from "./meta.ts";
import type { Route, RouteIndex, RouteSegment } from "./types.ts";

export const readRoutes = async (rootDir: string): Promise<Route[]> => {
  const entries = await fs.readdir(rootDir, {
    withFileTypes: true,
  });

  const routes: Route[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const routePath = path.join(rootDir, entry.name);
    const meta = await readMeta(routePath);

    routes.push({
      name: entry.name,
      title: meta.title,
      path: routePath,
    });
  }

  return routes;
};

export const routeIndexer = async (rootDir: string): Promise<RouteIndex> => {
  const segments: RouteSegment[] = [];

  for (const segment of await readRoutes(rootDir)) {
    segments.push({ ...segment, routes: await readRoutes(segment.path) });
  }

  return segments;
};
