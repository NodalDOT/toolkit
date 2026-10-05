import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { RouteMetaSchema } from "./schema.ts";
import type { RouteMeta } from "./types.ts";

const META_FILE = "meta.json";

const readMetaFile = async (
  metaPath: string,
  dirPath: string,
): Promise<string> => {
  try {
    return await fs.readFile(metaPath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`Missing ${META_FILE} in ${dirPath}`, { cause: error });
    }

    throw error;
  }
};

const parseJson = (content: string, metaPath: string): unknown => {
  try {
    return JSON.parse(content);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);

    throw new Error(`Invalid JSON in ${metaPath}: ${reason}`, { cause: error });
  }
};

export const readMeta = async (dirPath: string): Promise<RouteMeta> => {
  const metaPath = path.join(dirPath, META_FILE);
  const data = parseJson(await readMetaFile(metaPath, dirPath), metaPath);
  const result = RouteMetaSchema.safeParse(data);

  if (!result.success) {
    throw new Error(
      `Invalid meta in ${metaPath}:\n${z.prettifyError(result.error)}`,
      {
        cause: result.error,
      },
    );
  }

  return result.data;
};
