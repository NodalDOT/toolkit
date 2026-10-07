import { createHandlers } from "../registry/index.ts";
import { buildTree } from "../tree/index.ts";
import type { RenderOptions } from "../types/index.ts";
import { TemplateRenderer } from "./template-renderer.ts";

export const renderTemplate = async (
  html: string,
  { dirs, data = {} }: RenderOptions,
): Promise<string> => {
  const renderer = new TemplateRenderer(createHandlers(dirs));

  return renderer.render(buildTree(html), data);
};
