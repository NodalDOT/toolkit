import { codeTrace } from "@toolkit/code-trace/vite";
import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import { htmlDirectives } from "./plugins/html-directives.ts";
import { minifyHtml } from "./plugins/minify-html.ts";
import { uploadMock } from "./plugins/upload-mock.ts";
import type { PluginsEnv } from "./types.ts";

const sharedPlugins = (): PluginOption[] => [
  react(),
  htmlDirectives(),
  codeTrace(),
  uploadMock(),
];

const productionPlugins = (): PluginOption[] => [minifyHtml()];

export const createPlugins = ({
  command,
  mode,
}: PluginsEnv): PluginOption[] => [
  ...sharedPlugins(),
  ...(command === "build" && mode === "production" ? productionPlugins() : []),
];
