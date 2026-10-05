import fs from "node:fs/promises";
import path from "node:path";
import { readMeta } from "./meta.ts";
import type { Route, RouteIndex, RouteSegment } from "./types.ts";

export const routeIndexer = async (rootDir: string): Promise<RouteIndex> => {
  const segmentEntries = await fs.readdir(rootDir, {
    withFileTypes: true,
  });

  const segments: RouteSegment[] = [];

  for (const segmentEntry of segmentEntries) {
    if (!segmentEntry.isDirectory()) {
      continue;
    }
    const segmentPath = path.join(rootDir, segmentEntry.name);
    const segmentMeta = await readMeta(segmentPath);

    const routeEntries = await fs.readdir(segmentPath, {
      withFileTypes: true,
    });
    const routes: Route[] = [];

    for (const routeEntry of routeEntries) {
      if (!routeEntry.isDirectory()) {
        continue;
      }

      const routePath = path.join(segmentPath, routeEntry.name);
      const routeMeta = await readMeta(routePath);

      routes.push({
        name: routeEntry.name,
        title: routeMeta.title,
        path: routePath,
        order: routeMeta.order,
      });
    }

    segments.push({
      name: segmentEntry.name,
      title: segmentMeta.title,
      path: segmentPath,
      order: segmentMeta.order,
      routes,
    });
  }
  return segments;
};
