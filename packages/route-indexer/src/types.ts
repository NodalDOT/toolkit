import type { z } from "zod";
import type { RouteMetaSchema } from "./schema.ts";

export type RouteMeta = z.infer<typeof RouteMetaSchema>;

export type RouteEntry = {
  name: string;
  title: string;
  path: string;
  order: number;
};

export type Route = RouteEntry;

export type RouteSegment = RouteEntry & {
  routes: Route[];
};

export type RouteIndex = RouteSegment[];
