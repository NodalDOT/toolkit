import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import { htmlDirectives } from "./plugins/html-directives.ts";
import { minifyHtml } from "./plugins/minify-html.ts";
import type { PluginsEnv } from "./types.ts";

const sharedPlugins = (): PluginOption[] => [react(), htmlDirectives()];

const productionPlugins = (): PluginOption[] => [minifyHtml()];

export const createPlugins = ({
  command,
  mode,
}: PluginsEnv): PluginOption[] => [
  ...sharedPlugins(),
  ...(command === "build" && mode === "production" ? productionPlugins() : []),
];
